import apiClient from "./api";
import type { SupportedLanguage } from "@shared/types/language";

export async function executeCode(payload: {
  code: string;
  language: SupportedLanguage;
  roomId: string;
  user: string;
}): Promise<{ output: string }> {
  const { data } = await apiClient.post("/api/execute", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

