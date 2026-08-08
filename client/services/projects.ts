import apiClient from "./api";
import type { SharedProject } from "@shared/types/project";
import axios from "axios";

type CachedProject = { project: SharedProject; cachedAt: number };

const PROJECT_CACHE_TTL_MS = 60_000;
const projectCache = new Map<string, CachedProject>();
const projectRequests = new Map<string, Promise<{ project: SharedProject }>>();

function rememberProject(project: SharedProject) {
  if (project._id) projectCache.set(project._id, { project, cachedAt: Date.now() });
}
function getProjectErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined;
    return data?.error || data?.message || error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

export async function fetchProjectById(id: string): Promise<{ project: SharedProject }> {
  const cached = projectCache.get(id);
  if (cached && Date.now() - cached.cachedAt < PROJECT_CACHE_TTL_MS) {
    return { project: cached.project };
  }

  const pending = projectRequests.get(id);
  if (pending) return pending;

  const request = apiClient.get<{ project: SharedProject }>(`/api/projects/${id}`, { timeout: 12000 })
    .then(({ data }) => {
      rememberProject(data.project);
      return data;
    })
    .finally(() => projectRequests.delete(id));
  projectRequests.set(id, request);
  return request;
}

export async function fetchProjectsByOwner(owner: string): Promise<{ projects: SharedProject[] }> {
  const { data } = await apiClient.get<{ projects: SharedProject[] }>(`/api/projects/user/${owner}`, { timeout: 12000 });
  for (const project of data.projects || []) rememberProject(project);
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
