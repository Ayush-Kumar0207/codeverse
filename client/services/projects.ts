import apiClient from "./api";
import type { SharedProject } from "@shared/types/project";

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
  const { data } = await apiClient.post("/api/projects/create", payload);
  return data;
}

