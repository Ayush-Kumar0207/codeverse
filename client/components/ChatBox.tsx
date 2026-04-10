"use client";

import { useAuth } from "@/context/AuthContext";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useDynamicTextarea } from "@/hooks/useDynamicTextarea";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  roomId: string;
};

export default function ChatBox({ roomId }: Props) {
  const { user } = useAuth();
  const { messages, sendMessage } = useChatMessages(roomId);
  const { messageEndRef, chatContainerRef } = useAutoScroll([messages]);
  const { textareaRef, resizeTextarea } = useDynamicTextarea();
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleAskAIEvent = (e: any) => {
      const { stateContext, question } = e.detail;
      
      // Filter out huge structures to prevent payload explosion, but keep arrays simple
      const safeContext = Object.entries(stateContext).map(([k, v]) => {
        if (Array.isArray(v) && v.length > 20) return `${k}: [Array with ${v.length} elements]`;
        if (typeof v === 'object') return `${k}: ${JSON.stringify(v).slice(0, 100)}`;
        return `${k}: ${v}`;
      }).join('\\n');

      const fullPrompt = `${question}\\n\\n[AlgoTrace Context Snapshot]:\\n${safeContext}`;
      setInput(fullPrompt);
      
      // Attempt to find the AI Assistant Tab trigger globally and click it to switch tabs instantly
      const aiTabButton = document.querySelector('[value="assistant"]') as HTMLButtonElement | null;
      if (aiTabButton) aiTabButton.click();
      
      setTimeout(() => resizeTextarea(), 50);
    };

    window.addEventListener('algotrace:ask_ai', handleAskAIEvent);
    return () => window.removeEventListener('algotrace:ask_ai', handleAskAIEvent);
  }, [resizeTextarea]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-transparent text-foreground p-3 overflow-hidden">
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
                  "px-3 py-2 max-w-[85%] text-[11px] rounded-lg shadow-sm transition-all",
                  isOwn
                    ? "bg-primary/10 border border-primary/20 text-foreground"
                    : "bg-white/5 border border-white/5 text-muted-foreground"
                )}
              >
                {!isOwn && (
                  <div className="font-bold text-[9px] mb-1 text-primary/80 uppercase tracking-tighter">
                    {msg.user || "Anonymous"}
                  </div>
                )}

                <div className="leading-relaxed">{msg.message}</div>
              </div>
              <div className="text-[8px] text-muted-foreground/40 mt-1 px-1">
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

      <div className="flex flex-col mt-4 gap-2">
        <textarea
          ref={textareaRef}
          placeholder="Ask AI or message team..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            resizeTextarea();
          }}
          onKeyDown={handleKeyPress}
          rows={1}
          className="w-full resize-none px-3 py-2 rounded-md border border-white/5 bg-black/20 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 max-h-32 shadow-inner"
        />
        <div className="flex justify-between items-center px-1">
          <span className="text-[9px] text-muted-foreground/30">Shift+Enter for newline</span>
          <Button
            onClick={handleSend}
            size="sm"
            className="h-7 px-4 bg-primary hover:bg-primary/90 text-[10px] font-bold uppercase tracking-widest"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
