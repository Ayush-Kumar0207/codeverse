import { useState } from "react";
import { suggestCode } from "@/services/ai";

interface UseAIAssistantOptions {
  code?: string;
  context?: string; // Full project context
}

export function useAIAssistant(options: UseAIAssistantOptions = {}) {
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim() || prompt.trim().length < 5) {
      setSuggestion("Please enter at least 5 characters for a prompt.");
      return;
    }

    setLoading(true);
    try {
      const response = await suggestCode({
        prompt,
        context: options.context || `Active File Content:\n${options.code}`,
        systemPrompt: "You are the CodeVerse Neural Architect. You have access to the full project context. Provide production-grade, architectural advice."
      });
      setSuggestion(response.suggestion || "Synthetic silence from Ollama Engine.");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to get AI suggestion";
      setSuggestion(`Error: ${errorMsg}`);
      console.error("AI suggestion error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const triggerKey = isMac ? e.metaKey : e.ctrlKey;

    if (triggerKey && e.key === "Enter") {
      e.preventDefault();
      handleAsk();
    }
  };

  return {
    prompt,
    setPrompt,
    suggestion,
    setSuggestion,
    loading,
    handleAsk,
    handleKeyDown,
  };
}
