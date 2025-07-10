// client/components/AIAssistant.tsx
"use client";

import { useState } from "react";
import axios from "axios";

type Props = {
  code: string;
};

export default function AIAssistant({ code }: Props) {
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    const trimmedPrompt = prompt.trim();
    const trimmedCode = code.trim();

    if (trimmedPrompt.length < 5 || trimmedCode.length < 5) {
      setSuggestion("⚠️ Prompt or code is too short.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/suggest", {
        prompt: `${trimmedPrompt}\n\n${trimmedCode}`,
      });
      setSuggestion(res.data.suggestion || "⚠️ No suggestion returned.");
    } catch (err) {
      console.error("AI Suggestion Error:", err);
      setSuggestion("⚠️ Error getting suggestion from AI.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-[#1b1b2f] text-white h-full rounded shadow flex flex-col gap-3">
      <h2 className="text-lg font-bold">🤖 AI Suggestions</h2>

      <textarea
        placeholder="Ask AI to refactor, debug, or explain..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleAsk();
        }}
        className="w-full h-24 p-2 rounded bg-[#0e0e16] border border-gray-600 text-white"
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm font-semibold"
      >
        {loading ? "Thinking..." : "Get Suggestion"}
      </button>

      {suggestion && (
        <div className="mt-4 bg-[#0e0e16] p-3 rounded text-sm border border-gray-600 overflow-auto max-h-64 whitespace-pre-wrap">
          <pre className="text-green-300">{suggestion}</pre>
        </div>
      )}
    </div>
  );
}
