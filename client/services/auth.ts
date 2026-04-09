import apiClient from "./api";
import type { AuthResponse } from "@shared/types/auth";
import type { SharedUser } from "@shared/types/user";

export async function fetchProfile(): Promise<{ user: SharedUser }> {
  const { data } = await apiClient.get("/api/auth/profile");
  return data;
}

export async function loginRequest(payload: { username: string; password: string }): Promise<AuthResponse> {
  const { data } = await apiClient.post("/api/auth/login", payload);
  return data;
}

export async function registerRequest(payload: {
  username: string;
  password: string;
  email?: string;
}): Promise<{ message: string }> {
  const { data } = await apiClient.post("/api/auth/register", payload);
  return data;
}

