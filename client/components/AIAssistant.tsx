// client/components/AIAssistant.tsx
"use client";

import { useAIAssistant } from "@/hooks/useAIAssistant";

type Props = {
  code: string;
};

export default function AIAssistant({ code }: Props) {
  const { prompt, setPrompt, suggestion, loading, handleAsk, handleKeyDown } =
    useAIAssistant({ code });

  return (
    <div className="flex h-full flex-col gap-3 rounded bg-card p-4 text-card-foreground shadow">
      <h2 className="text-lg font-bold">AI Suggestions</h2>

      <textarea
        placeholder="Ask AI to refactor, debug, or explain..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-24 w-full rounded border border-border bg-background p-2 text-foreground"
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        {loading ? "Thinking..." : "Get Suggestion"}
      </button>

      {suggestion && (
        <div className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded border border-border bg-background p-3 text-sm">
          <pre className="text-primary">{suggestion}</pre>
        </div>
      )}
    </div>
  );
}
