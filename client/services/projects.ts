import apiClient from "./api";
import type { SharedProject } from "@shared/types/project";
import axios from "axios";
import {
  findProjectOnDevice,
  getDeviceProjectLibrary,
  mergeCloudProjectLibrary,
  rememberCreatedProject,
  removeProjectFromDevice,
} from "./project-library";

export interface ProjectListResult {
  projects: SharedProject[];
  cloudAvailable: boolean;
  recoveredCount: number;
}

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

async function fetchCloudProjects(owner: string) {
  try {
    const { data } = await apiClient.get<{ projects: SharedProject[] }>("/api/projects", { timeout: 12000 });
    return data.projects || [];
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 404) throw error;
    const { data } = await apiClient.get<{ projects: SharedProject[] }>(`/api/projects/user/${encodeURIComponent(owner)}`, {
      timeout: 12000,
    });
    return data.projects || [];
  }
}

export async function fetchProjectById(id: string, owner?: string): Promise<{ project: SharedProject }> {
  const cached = projectCache.get(id);
  if (cached && Date.now() - cached.cachedAt < PROJECT_CACHE_TTL_MS) {
    return { project: cached.project };
  }

  const pending = projectRequests.get(id);
  if (pending) return pending;

  const request = apiClient
    .get<{ project: SharedProject }>(`/api/projects/${id}`, { timeout: 12000 })
    .then(({ data }) => {
      const project = { ...data.project, storage: "cloud" as const };
      rememberProject(project);
      return { project };
    })
    .catch((error) => {
      const localProject = owner ? findProjectOnDevice(owner, id) : null;
      if (localProject) {
        rememberProject(localProject);
        return { project: localProject };
      }
      throw new Error(getProjectErrorMessage(error, "Failed to open project"));
    })
    .finally(() => projectRequests.delete(id));
  projectRequests.set(id, request);
  return request;
}

export async function fetchCollaborativeProjectById(
  id: string,
  inviteToken?: string | null
): Promise<{ project: SharedProject }> {
  const params = new URLSearchParams();
  if (inviteToken) params.set("invite", inviteToken);
  const query = params.toString();
  try {
    const { data } = await apiClient.get<{ project: SharedProject }>(
      `/api/collaboration/${encodeURIComponent(id)}/project${query ? `?${query}` : ""}`,
      { timeout: 12000 }
    );
    return { project: { ...data.project, storage: "cloud" as const } };
  } catch (error) {
    throw new Error(getProjectErrorMessage(error, "This collaboration invite is invalid or has expired"));
  }
}

export async function fetchProjectsByOwner(owner: string): Promise<ProjectListResult> {
  try {
    const cloudProjects = await fetchCloudProjects(owner);
    const result = mergeCloudProjectLibrary(owner, cloudProjects);
    for (const project of result.projects) rememberProject(project);
    return result;
  } catch (error) {
    const local = getDeviceProjectLibrary(owner);
    for (const project of local.projects) rememberProject(project);
    if (local.projects.length > 0) return local;
    throw new Error(getProjectErrorMessage(error, "Project service unavailable"));
  }
}

export async function createProject(payload: {
  title: string;
  language: SharedProject["language"];
  owner: string | null;
  isDemo?: boolean;
}): Promise<{ project: SharedProject }> {
  try {
    const { data } = await apiClient.post<{ project: SharedProject }>("/api/projects/create", payload, { timeout: 12000 });
    const project = payload.owner ? rememberCreatedProject(payload.owner, data.project) : data.project;
    rememberProject(project);
    return { ...data, project };
  } catch (error) {
    throw new Error(getProjectErrorMessage(error, "Failed to create project"));
  }
}

export async function saveProjectWorkspace(
  id: string,
  payload: { files: Record<string, string>; activeFile: string }
): Promise<{ project: SharedProject; message?: string }> {
  try {
    const { data } = await apiClient.put<{ project: SharedProject; message?: string }>(`/api/projects/${id}`, payload, {
      timeout: 12000,
    });
    const project = { ...data.project, storage: data.project.storage || "cloud" as const };
    rememberProject(project);
    return { ...data, project };
  } catch (error) {
    throw new Error(getProjectErrorMessage(error, "Workspace could not be saved to the cloud"));
  }
}

export async function deleteProject(id: string, owner: string, storage?: SharedProject["storage"]): Promise<{ message?: string }> {
  if (storage === "device") {
    removeProjectFromDevice(owner, id);
    projectCache.delete(id);
    return { message: "Device project removed" };
  }

  const { data } = await apiClient.delete(`/api/projects/${id}`);
  removeProjectFromDevice(owner, id);
  projectCache.delete(id);
  return data;
}
