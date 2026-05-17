import apiClient from "./api";
import type { SharedProject } from "@shared/types/project";
import axios from "axios";

function getProjectErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined;
    return data?.error || data?.message || error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

export async function fetchProjectById(id: string): Promise<{ project: SharedProject }> {
  const { data } = await apiClient.get(`/api/projects/${id}`);
  return data;
}

export async function fetchProjectsByOwner(owner: string): Promise<{ projects: SharedProject[] }> {
  const { data } = await apiClient.get(`/api/projects/user/${owner}`);
  return data;
}

export async function createProject(payload: {
  title: string;
  language: SharedProject["language"];
  owner: string | null;
  isDemo?: boolean;
}): Promise<{ project: SharedProject }> {
  try {
    const { data } = await apiClient.post("/api/projects/create", payload, { timeout: 12000 });
    return data;
  } catch (error) {
    throw new Error(getProjectErrorMessage(error, "Failed to create project"));
  }
}

export async function deleteProject(id: string): Promise<{ message?: string }> {
  const { data } = await apiClient.delete(`/api/projects/${id}`);
  return data;
}
