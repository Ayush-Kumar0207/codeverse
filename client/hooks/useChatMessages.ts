import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";
import { useAuth } from "@/context/AuthContext";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";
import { streamCodeSuggestion } from "@/services/ai";
import axios from "axios";

export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  roomId?: string;
  channel?: "ai" | "team";
}

interface UseChatMessagesOptions {
  aiMode?: boolean;
  context?: string;
  channel?: "ai" | "team";
}

const FAST_PROMPT_LIMIT = 850;
const FAST_CONTEXT_LIMIT = 1700;

function compactText(value: string | undefined, limit: number) {
  const text = (value || "").replace(/\r/g, "").trim();
  if (text.length <= limit) return text;

  const head = Math.floor(limit * 0.68);
  const tail = limit - head - 56;
  return `${text.slice(0, head)}\n...[shortened for faster AI reply]...\n${text.slice(-Math.max(0, tail))}`;
}

function looksLikeGreeting(text: string) {
  return /^(hi|hello|hey|yo|sup|thanks|thank you)\W*$/i.test(text.trim());
}

function fastGreetingReply(text: string) {
  if (/thank/i.test(text)) return "You're welcome. Send me the code or question and I'll keep the answer quick.";
  return "Hi. Ask me what to explain, debug, or improve in the active file.";
}

function codeHeavy(text: string) {
  return text.length > 900 || /```|#include|public\s+class|function\s+\w+|def\s+\w+|=>|;\s*$/m.test(text);
}

function buildFastPrompt(text: string) {
  const normalized = text.replace(/\r/g, "").trim();
  if (!codeHeavy(normalized)) return normalized;

  const intent = /explain/i.test(normalized)
    ? "Explain the relevant code step by step, but stay concise."
    : "Answer the user's question using the relevant code.";

  return `${intent}\n\nUser message excerpt:\n${compactText(normalized, FAST_PROMPT_LIMIT)}`;
}

function normalizeAssistantMarkdown(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/\s+(#{2,4}\s+)/g, "\n\n$1")
    .replace(/\s+(\*\*[^*\n]{2,36}\*\*:)/g, "\n\n$1")
    .replace(/\s+(\d+\.\s+\*\*)/g, "\n$1")
    .replace(/\s+-\s+/g, "\n- ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function finalizeAssistantMarkdown(text: string) {
  const normalized = normalizeAssistantMarkdown(text);
  if (!normalized) return "No suggestion available.";

  const lines = normalized.split("\n");
  const last = lines.at(-1)?.trim() || "";
  const endsCleanly = /[.!?)`\]]$/.test(last) || last.startsWith("```");

  if (!endsCleanly && lines.length > 1) {
    lines.pop();
  }

  const cleaned = lines.join("\n").trim();
  return cleaned || normalized;
}

function formatAIError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { error?: unknown; message?: unknown } | undefined;
    const serverMessage =
      typeof data?.error === "string"
        ? data.error
        : typeof data?.message === "string"
          ? data.message
          : error.message;

    return status ? `${serverMessage} (${status})` : serverMessage;
  }

  return error instanceof Error ? error.message : "Unknown AI error";
}

export function useChatMessages(roomId: string, options: UseChatMessagesOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const { socket, on, emit } = useSocket(roomId);
  const { user } = useAuth();
  const channel = options.channel || (options.aiMode ? "ai" : "team");

  // Handle incoming chat messages
  useEffect(() => {
    const handleMessage = (msg: ChatMessage) => {
      if ((msg.channel || "team") !== channel) return;

      setMessages((prev) => {
        if (prev.some((item) => item.id === msg.id)) return prev;
        return [...prev, { ...msg, timestamp: new Date(msg.timestamp) }];
      });
    };

    on(SOCKET_EVENTS.CHAT_MESSAGE, handleMessage);

    return () => {
      // Note: Not removing listener to avoid disrupting other components using same socket
    };
  }, [channel, on]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      try {
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          user: user?.username || "Guest",
          message: trimmed,
          timestamp: new Date(),
          roomId,
          channel,
        };

        setMessages((prev) => [...prev, userMsg]);
        emit(SOCKET_EVENTS.CHAT_MESSAGE, userMsg);

        const shouldAskAI = options.aiMode || trimmed.startsWith("@ai ") || trimmed.startsWith("ask: ");
        if (shouldAskAI) {
          const prompt = options.aiMode ? trimmed.replace(/^(@ai |ask: )/, "") : trimmed.replace(/^(@ai |ask: )/, "");

          if (looksLikeGreeting(prompt)) {
            const aiReply: ChatMessage = {
              id: `${Date.now()}-ai-fast`,
              user: "AI Assistant",
              message: fastGreetingReply(prompt),
              timestamp: new Date(),
              roomId,
              channel,
            };
            emit(SOCKET_EVENTS.CHAT_MESSAGE, aiReply);
            setMessages((prev) => [...prev, aiReply]);
            return;
          }

          setAiLoading(true);

          try {
            const compactPrompt = buildFastPrompt(prompt);
            const hasPastedCode = codeHeavy(prompt);
            const aiReplyId = `${Date.now()}-ai`;
            let streamed = "";
            const aiReply: ChatMessage = {
              id: aiReplyId,
              user: "AI Assistant",
              message: "Starting...",
              timestamp: new Date(),
              roomId,
              channel,
            };

            setMessages((prev) => [...prev, aiReply]);

            await streamCodeSuggestion({
              prompt: compactPrompt,
              context: hasPastedCode
                ? "The user pasted the relevant code in the prompt. Do not request more context."
                : compactText(options.context, FAST_CONTEXT_LIMIT),
              systemPrompt:
                [
                  "You are CodeVerse's fast AI pair programmer.",
                  "Return clean Markdown only.",
                  "For code explanations, use exactly this compact structure:",
                  "**Quick Idea**: one sentence.",
                  "",
                  "**Step-by-step**",
                  "1. One short sentence.",
                  "2. One short sentence.",
                  "3. One short sentence.",
                  "",
                  "**Result**: one sentence.",
                  "Do not use nested bullets.",
                  "Do not repeat the full code.",
                  "Finish the final Result section before stopping.",
                ].join("\n"),
              maxTokens: hasPastedCode ? 320 : 170,
              fast: true,
            }, (token) => {
              streamed += token;
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === aiReplyId
                    ? { ...message, message: normalizeAssistantMarkdown(streamed) || "Starting..." }
                    : message
                )
              );
            });

            const finalReply = finalizeAssistantMarkdown(streamed);
            setMessages((prev) =>
              prev.map((message) => (message.id === aiReplyId ? { ...message, message: finalReply } : message))
            );
            emit(SOCKET_EVENTS.CHAT_MESSAGE, { ...aiReply, message: finalReply });
          } catch (err) {
            console.error("AI suggestion error:", err);
            const errorMsg: ChatMessage = {
              id: `${Date.now()}-ai-error`,
              user: "AI Assistant",
              message: `Error: Failed to get AI suggestion. ${formatAIError(err)}`,
              timestamp: new Date(),
              roomId,
              channel,
            };
            emit(SOCKET_EVENTS.CHAT_MESSAGE, errorMsg);
            setMessages((prev) => [...prev, errorMsg]);
          } finally {
            setAiLoading(false);
          }
        }
      } catch (err) {
        console.error("Error sending message:", err);
      }
    },
    [channel, emit, options.aiMode, options.context, roomId, user?.username]
  );

  return {
    messages,
    sendMessage,
    aiLoading,
    socket,
  };
}
