"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

// ✅ Define message type
interface Message {
  user: string;
  message: string;
  time: string;
  roomId?: string;
}

const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}`);
const ROOM_ID = "room1";

export default function ChatBox() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    socket.emit("joinRoom", ROOM_ID);

    socket.on("chatMessage", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, []);

  useEffect(() => {
    if (isAutoScroll) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAutoScroll]); // ✅ Added isAutoScroll to dependency

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      setIsAutoScroll(isBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      roomId: ROOM_ID,
      user: user?.username || "Guest",
      message: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("chatMessage", userMsg);
    const prompt = input;
    setInput("");

    if (prompt.trim().startsWith("@ai") || prompt.trim().startsWith("ask:")) {
      const cleanedPrompt = prompt.replace(/^(@ai|ask:)/i, "").trim();

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/suggest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: cleanedPrompt }),
        });

        const data = await res.json();
        if (data.suggestion) {
          const aiReply: Message = {
            roomId: ROOM_ID,
            user: "CodeVerse AI 🤖",
            message: data.suggestion,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          socket.emit("chatMessage", aiReply);
        }
      } catch (err) {
        console.error("Ollama AI Error:", err);
      }
    }
  };

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [input]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
                  {msg.time || ""}
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
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
          className="flex-1 h-14 mt-3 resize-none px-4 py-0.5 rounded-xl border border-gray-600 bg-[#0f172a] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 max-h-32 overflow-y-hidden"
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 h-14 mt-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
