import apiClient from "./api";

export async function suggestCode(prompt: string, model = "codellama"): Promise<{ suggestion: string }> {
  const { data } = await apiClient.post("/api/ai/suggest", { prompt, model });
  return data;
}

