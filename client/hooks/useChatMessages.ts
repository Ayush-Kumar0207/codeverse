import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";
import { useAuth } from "@/context/AuthContext";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";
import { suggestCode } from "@/services/ai";

export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
}

export function useChatMessages(roomId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { socket, on, emit } = useSocket(roomId);
  const { user } = useAuth();

  // Handle incoming chat messages
  useEffect(() => {
    const handleMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, { ...msg, timestamp: new Date(msg.timestamp) }]);
    };

    on(SOCKET_EVENTS.CHAT_MESSAGE, handleMessage);

    return () => {
      // Note: Not removing listener to avoid disrupting other components using same socket
    };
  }, [on]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !user) return;

      try {
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          user: user.username,
          message: text,
          timestamp: new Date(),
        };

        // Emit to socket
        emit(SOCKET_EVENTS.CHAT_MESSAGE, userMsg);

        // Check for AI trigger (@ai or ask:)
        if (text.startsWith("@ai ") || text.startsWith("ask: ")) {
          const prompt = text.replace(/^(@ai |ask: )/, "");

          try {
            const response = await suggestCode(prompt);
            const aiReply: ChatMessage = {
              id: Date.now().toString(),
              user: "AI Assistant",
              message: response.suggestion || "No suggestion available.",
              timestamp: new Date(),
            };

            emit(SOCKET_EVENTS.CHAT_MESSAGE, aiReply);
            setMessages((prev) => [...prev, aiReply]);
          } catch (err) {
            console.error("AI suggestion error:", err);
            const errorMsg: ChatMessage = {
              id: Date.now().toString(),
              user: "AI Assistant",
              message: `Error: Failed to get AI suggestion. ${err instanceof Error ? err.message : ""}`,
              timestamp: new Date(),
            };
            emit(SOCKET_EVENTS.CHAT_MESSAGE, errorMsg);
            setMessages((prev) => [...prev, errorMsg]);
          }
        }
      } catch (err) {
        console.error("Error sending message:", err);
      }
    },
    [user, emit]
  );

  return {
    messages,
    sendMessage,
    socket,
  };
}
