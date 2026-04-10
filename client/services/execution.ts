import apiClient from "./api";
import type { SupportedLanguage } from "@shared/types/language";

export async function executeCode(payload: {
  code: string;
  language: SupportedLanguage;
  roomId: string;
  user: string;
  fileName?: string;
}): Promise<{ output: string; type?: string; stats?: any }> {
  const { data } = await apiClient.post("/api/execute", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

