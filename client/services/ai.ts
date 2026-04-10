import apiClient from "./api";

export async function suggestCode(payload: {
  prompt: string;
  model?: string;
  context?: string;
  systemPrompt?: string;
}): Promise<{ suggestion: string }> {
  const { data } = await apiClient.post("/api/ai/suggest", payload);
  return data;
}

