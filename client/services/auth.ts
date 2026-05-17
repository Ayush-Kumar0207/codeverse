import apiClient from "./api";
import axios from "axios";
import type { AuthResponse } from "@shared/types/auth";
import type { SharedUser } from "@shared/types/user";

function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined;
    return data?.error || data?.message || error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

export async function fetchProfile(): Promise<{ user: SharedUser }> {
  try {
    const { data } = await apiClient.get("/api/auth/profile");
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to load profile"));
  }
}

export async function loginRequest(payload: { username: string; password: string }): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post("/api/auth/login", payload);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Login failed"));
  }
}

export async function registerRequest(payload: {
  username: string;
  password: string;
  email?: string;
}): Promise<{ message: string }> {
  try {
    const { data } = await apiClient.post("/api/auth/register", payload);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Registration failed"));
  }
}

