"use client";

import { useAuth } from "@/context/AuthContext";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useDynamicTextarea } from "@/hooks/useDynamicTextarea";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

type Props = {
  roomId: string;
  context?: string;
  aiMode?: boolean;
  channel?: "ai" | "team";
  placeholder?: string;
};

const pendingAssistantPromptKey = "codeverse:pending-ai-prompt";

export default function ChatBox({
  roomId,
  context,
  aiMode = true,
  channel,
  placeholder = aiMode ? "Ask the AI about this code..." : "Message collaborators...",
}: Props) {
  const { user } = useAuth();
  const { messages, sendMessage, aiLoading } = useChatMessages(roomId, {
    aiMode,
    channel,
    context,
  });
  const { messageEndRef, chatContainerRef } = useAutoScroll([messages]);
  const { textareaRef, resizeTextarea } = useDynamicTextarea();
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!aiMode && channel !== "ai") return;

    const prepareAssistantPrompt = (detail?: {
      stateContext?: Record<string, unknown>;
      question?: string;
    }) => {
      const { stateContext = {}, question = "" } = detail || {};
      
      // Filter out huge structures to prevent payload explosion, but keep arrays simple
      const safeContext = Object.entries(stateContext).map(([k, v]) => {
        if (Array.isArray(v) && v.length > 20) return `${k}: [Array with ${v.length} elements]`;
        if (typeof v === 'object') return `${k}: ${JSON.stringify(v).slice(0, 100)}`;
        return `${k}: ${v}`;
      }).join('\\n');

      const fullPrompt = `${question}\\n\\n[AlgoTrace Context Snapshot]:\\n${safeContext}`;
      setInput(fullPrompt);
      
      // Attempt to find the AI Assistant Tab trigger globally and click it to switch tabs instantly
      const aiTabButton = document.querySelector('button[value="assistant"], [data-tab-value="assistant"]') as HTMLButtonElement | null;
      if (aiTabButton) aiTabButton.click();
      
      setTimeout(() => resizeTextarea(), 50);
    };

    const handleAskAIEvent = (event: Event) => {
      const detail = (event as CustomEvent<{
        stateContext?: Record<string, unknown>;
        question?: string;
      }>).detail;
      prepareAssistantPrompt(detail);
      window.sessionStorage.removeItem(pendingAssistantPromptKey);
    };

    window.addEventListener('algotrace:ask_ai', handleAskAIEvent);

    const pendingPrompt = window.sessionStorage.getItem(pendingAssistantPromptKey);
    if (pendingPrompt) {
      try {
        prepareAssistantPrompt(JSON.parse(pendingPrompt));
        window.sessionStorage.removeItem(pendingAssistantPromptKey);
      } catch {
        window.sessionStorage.removeItem(pendingAssistantPromptKey);
      }
    }

    return () => window.removeEventListener('algotrace:ask_ai', handleAskAIEvent);
  }, [aiMode, channel, resizeTextarea]);

  const handleSend = async () => {
    if (!input.trim() || aiLoading) return;
    const prompt = input.trim();
    setInput("");
    setTimeout(() => resizeTextarea(), 0);
    await sendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-transparent p-3 text-foreground">
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar"
      >
        {messages.map((msg, idx) => {
          const isOwn = msg.user === user?.username || (!user && msg.user === "Guest");

          return (
            <div key={idx} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
              <div
                className={cn(
                  "rounded-md px-3 py-2 text-xs shadow-sm transition-all",
                  isOwn
                    ? "max-w-[85%] border border-primary/25 bg-primary/10 text-foreground"
                    : "max-w-full border border-border bg-muted/60 text-foreground"
                )}
              >
                {!isOwn && (
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {msg.user || "Anonymous"}
                  </div>
                )}

                {isOwn ? (
                  <div className="whitespace-pre-wrap break-words leading-relaxed">{msg.message}</div>
                ) : (
                  <div className="ai-markdown leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h3 className="mb-2 mt-3 text-sm font-semibold text-foreground first:mt-0">{children}</h3>,
                        h2: ({ children }) => <h3 className="mb-2 mt-3 text-sm font-semibold text-foreground first:mt-0">{children}</h3>,
                        h3: ({ children }) => <h3 className="mb-2 mt-3 text-sm font-semibold text-foreground first:mt-0">{children}</h3>,
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="pl-1">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                        code: ({ children }) => (
                          <code className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[11px] text-primary">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {msg.message}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              <div className="mt-1 px-1 text-[10px] text-muted-foreground">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            resizeTextarea();
          }}
          onKeyDown={handleKeyPress}
          rows={1}
          disabled={aiLoading}
          className="max-h-32 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground shadow-inner outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] text-muted-foreground">{aiLoading ? "Thinking..." : "Ready"}</span>
          <Button
            onClick={handleSend}
            disabled={aiLoading || !input.trim()}
            size="sm"
            className="h-8 bg-primary px-4 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
          >
            {aiLoading ? "Thinking" : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
