import apiClient from "./api";
import { getToken } from "@/utils/auth";
import { getApiBaseUrl } from "./runtime-config";

type AIPayload = {
  prompt: string;
  model?: string;
  openAIModel?: string;
  provider?: "ollama" | "openai" | "auto";
  context?: string;
  systemPrompt?: string;
  maxTokens?: number;
  fast?: boolean;
};

export async function suggestCode(payload: AIPayload): Promise<{ suggestion: string; model?: string }> {
  const { data } = await apiClient.post("/api/ai/suggest", payload);
  return data;
}

export async function streamCodeSuggestion(
  payload: AIPayload,
  onToken: (token: string) => void
): Promise<void> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("AI streaming is not configured for this deployment.");
  }

  const token = getToken();
  const response = await fetch(`${apiBaseUrl}/api/ai/suggest/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.body) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `AI stream failed with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onToken(decoder.decode(value, { stream: true }));
  }

  const tail = decoder.decode();
  if (tail) onToken(tail);
}
