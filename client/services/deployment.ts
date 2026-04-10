import apiClient from "./api";

export async function deployProject(payload: {
  projectId: string;
  files: Record<string, string>;
}): Promise<{ message: string; url: string; timestamp: string }> {
  const { data } = await apiClient.post("/api/deploy", payload);
  return data;
}
