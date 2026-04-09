import apiClient from "./api";
import type { SharedVersion } from "@shared/types/version";

export async function saveCodeVersion(payload: {
  code: string;
  userId: string;
  fileName: string;
}): Promise<{ message: string }> {
  const { data } = await apiClient.post("/api/code/save", payload);
  return data;
}

export async function fetchCodeVersions(params: {
  userId: string;
  fileName: string;
}): Promise<{ versions: SharedVersion[] }> {
  const { data } = await apiClient.get("/api/code/versions", { params });
  return data;
}

export async function fetchSavedCodes(userId: string): Promise<{ codes: SharedVersion[] }> {
  const { data } = await apiClient.get(`/api/code/user/${userId}`);
  return data;
}


