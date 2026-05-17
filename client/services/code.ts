import apiClient from "./api";
import axios from "axios";
import type { SharedVersion } from "@shared/types/version";

function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined;
    return data?.error || data?.message || error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

export async function saveCodeVersion(payload: {
  code: string;
  userId: string;
  fileName: string;
}): Promise<{ message: string }> {
  try {
    const { data } = await apiClient.post("/api/code/save", payload);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to save code version"));
  }
}

export async function fetchCodeVersions(params: {
  userId: string;
  fileName: string;
}): Promise<{ versions: SharedVersion[] }> {
  try {
    const { data } = await apiClient.get("/api/code/versions", { params });
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to load code versions"));
  }
}

export async function fetchSavedCodes(userId: string): Promise<{ codes: SharedVersion[] }> {
  try {
    const { data } = await apiClient.get(`/api/code/user/${userId}`);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to load saved code"));
  }
}


