"use client";

import { useAuth } from "@/context/AuthContext";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useDynamicTextarea } from "@/hooks/useDynamicTextarea";
import { useState } from "react";

type Props = {
  roomId: string;
};

export default function ChatBox({ roomId }: Props) {
  const { user } = useAuth();
  const { messages, sendMessage } = useChatMessages(roomId);
  const { messageEndRef, chatContainerRef } = useAutoScroll([messages]);
  const { textareaRef, resizeTextarea } = useDynamicTextarea();
  const [input, setInput] = useState("");

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
    <div className="flex flex-col h-full w-full bg-[#121826] text-white rounded-xl shadow-lg border border-gray-700 p-4">
      <h2 className="text-lg font-bold mb-4 text-purple-400 border-b border-gray-700 pb-2 text-center">
        💬 Real-time Chat
      </h2>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, idx) => {
          const isOwn = msg.user === user?.username || (!user && msg.user === "Guest");

          return (
            <div key={idx} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 max-w-xs text-sm rounded-xl shadow-md transition ${
                  isOwn
                    ? "bg-purple-600 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-100 rounded-bl-none"
                }`}
              >
                <div className="font-semibold text-xs mb-1">
                  {isOwn ? "You" : msg.user || "Anonymous"}
                </div>

                <div>{msg.message}</div>

                <div className="text-[10px] text-gray-400 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <div className="flex mt-4 gap-2">
        <textarea
          ref={textareaRef}
          placeholder="Type a message... (@ai What is JSX?)"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            resizeTextarea();
          }}
          onKeyDown={handleKeyPress}
          rows={1}
          className="flex-1 h-14 mt-3 resize-none px-4 py-0.5 rounded-xl border border-gray-600 bg-[#0f172a] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 max-h-32 overflow-y-hidden"
        />

        <button
          onClick={handleSend}
          className="px-4 py-2 h-14 mt-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
