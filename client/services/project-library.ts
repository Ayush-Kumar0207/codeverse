import type { SharedProject } from "@shared/types/project";
import type { SupportedLanguage } from "@shared/types/language";

const PROJECT_LIBRARY_PREFIX = "codeverse:project-library:";
const LAST_PROJECT_PREFIX = "codeverse:last-project:";
const TIMELINE_PREFIX = "codeverse:workspace-timeline:";
const MAX_CACHED_PROJECTS = 100;

interface StoredWorkspaceSnapshot {
  id: string;
  createdAt: string;
  files: Record<string, string>;
  activeFile: string;
  label?: string;
}

const supportedLanguages = new Set<SupportedLanguage>([
  "javascript",
  "typescript",
  "python",
  "cpp",
  "c",
  "java",
  "html",
  "css",
  "markdown",
  "json",
  "plaintext",
]);

const normalizeOwner = (owner: string) => owner.trim().toLowerCase();
const libraryKey = (owner: string) => `${PROJECT_LIBRARY_PREFIX}${normalizeOwner(owner)}`;
const lastProjectKey = (owner: string) => `${LAST_PROJECT_PREFIX}${normalizeOwner(owner)}`;

const canUseStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

function isProject(value: unknown): value is SharedProject {
  if (!value || typeof value !== "object") return false;
  const project = value as Partial<SharedProject>;
  return Boolean(project._id && project.title && project.language && supportedLanguages.has(project.language));
}

function isSnapshot(value: unknown): value is StoredWorkspaceSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<StoredWorkspaceSnapshot>;
  return Boolean(
    snapshot.id &&
      snapshot.createdAt &&
      snapshot.files &&
      typeof snapshot.files === "object" &&
      !Array.isArray(snapshot.files) &&
      snapshot.activeFile
  );
}

function sortNewest(projects: SharedProject[]) {
  return [...projects].sort(
    (left, right) => Date.parse(right.updatedAt || right.createdAt || "") - Date.parse(left.updatedAt || left.createdAt || "")
  );
}

function inferLanguage(files: Record<string, string>, activeFile: string): SupportedLanguage {
  const names = Object.keys(files);
  if (names.some((name) => name.toLowerCase() === "index.html")) return "html";

  const candidates = [activeFile, ...names.filter((name) => name !== activeFile && name.toLowerCase() !== "readme.md")];
  for (const name of candidates) {
    const lower = name.toLowerCase();
    if (lower.endsWith(".tsx") || lower.endsWith(".ts")) return "typescript";
    if (lower.endsWith(".jsx") || lower.endsWith(".js")) return "javascript";
    if (lower.endsWith(".py")) return "python";
    if (lower.endsWith(".cpp") || lower.endsWith(".cc") || lower.endsWith(".cxx")) return "cpp";
    if (lower.endsWith(".c")) return "c";
    if (lower.endsWith(".java")) return "java";
    if (lower.endsWith(".html")) return "html";
    if (lower.endsWith(".css")) return "css";
    if (lower.endsWith(".md")) return "markdown";
    if (lower.endsWith(".json")) return "json";
  }
  return "plaintext";
}

function inferTitle(files: Record<string, string>, id: string) {
  const readme = files["README.md"] || files["readme.md"] || "";
  const heading = readme.match(/^\s*#\s+(.+)$/m)?.[1]?.trim();
  if (heading) return heading.slice(0, 100);
  return `Recovered workspace ${id.slice(0, 8)}`;
}

function sortSnapshots(snapshots: StoredWorkspaceSnapshot[]) {
  return [...snapshots].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}

function readTimeline(projectId: string): StoredWorkspaceSnapshot[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(`${TIMELINE_PREFIX}${projectId}`);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isSnapshot) : [];
  } catch {
    return [];
  }
}

export function recoverProjectFromTimeline(projectId: string, owner: string): SharedProject | null {
  if (!projectId || projectId === "demo-sandbox") return null;
  const snapshots = sortSnapshots(readTimeline(projectId));
  const latest = snapshots[0];
  if (!latest || Object.keys(latest.files).length === 0) return null;

  return {
    _id: projectId,
    title: inferTitle(latest.files, projectId),
    language: inferLanguage(latest.files, latest.activeFile),
    owner,
    code: latest.files[latest.activeFile] || "",
    createdAt: snapshots.at(-1)?.createdAt || latest.createdAt,
    updatedAt: latest.createdAt,
    storage: "device",
  };
}

export function recoverTimelineProjects(owner: string): SharedProject[] {
  if (!canUseStorage()) return [];
  const recovered: SharedProject[] = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key?.startsWith(TIMELINE_PREFIX)) continue;
    const projectId = key.slice(TIMELINE_PREFIX.length);
    const project = recoverProjectFromTimeline(projectId, owner);
    if (project) recovered.push(project);
  }
  return sortNewest(recovered);
}

export function readProjectLibrary(owner: string): SharedProject[] {
  if (!owner || !canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(libraryKey(owner));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? sortNewest(parsed.filter(isProject)) : [];
  } catch {
    return [];
  }
}

function writeProjectLibrary(owner: string, projects: SharedProject[]) {
  if (!owner || !canUseStorage()) return;
  try {
    window.localStorage.setItem(
      libraryKey(owner),
      JSON.stringify(sortNewest(projects.filter(isProject)).slice(0, MAX_CACHED_PROJECTS))
    );
  } catch {
    // The cloud remains authoritative when browser storage is unavailable.
  }
}

function mergeById(projectGroups: SharedProject[][]) {
  const merged = new Map<string, SharedProject>();
  for (const projects of projectGroups) {
    for (const project of projects) {
      if (project._id) merged.set(project._id, project);
    }
  }
  return sortNewest([...merged.values()]);
}

export function mergeCloudProjectLibrary(owner: string, cloudProjects: SharedProject[]) {
  const cachedLocal = readProjectLibrary(owner).filter(
    (project) => project.storage === "device" || project.storage === "pending"
  );
  const recovered = recoverTimelineProjects(owner);
  const cloud = cloudProjects.map((project) => ({ ...project, storage: "cloud" as const }));
  const projects = mergeById([cachedLocal, recovered, cloud]);
  writeProjectLibrary(owner, projects);
  return {
    projects,
    cloudAvailable: true,
    recoveredCount: projects.filter((project) => project.storage !== "cloud").length,
  };
}

export function getDeviceProjectLibrary(owner: string) {
  const projects = mergeById([readProjectLibrary(owner), recoverTimelineProjects(owner)]);
  writeProjectLibrary(owner, projects);
  return {
    projects,
    cloudAvailable: false,
    recoveredCount: projects.filter((project) => project.storage !== "cloud").length,
  };
}

export function rememberCreatedProject(owner: string, project: SharedProject) {
  if (!project._id) return project;
  const storedProject: SharedProject = {
    ...project,
    owner,
    storage: project.storage || "pending",
  };
  const projects = mergeById([readProjectLibrary(owner), [storedProject]]);
  writeProjectLibrary(owner, projects);
  rememberLastOpenedProject(owner, project._id);
  return storedProject;
}

export function findProjectOnDevice(owner: string, projectId: string) {
  const cached = readProjectLibrary(owner).find((project) => project._id === projectId);
  return cached || recoverProjectFromTimeline(projectId, owner);
}

export function removeProjectFromDevice(owner: string, projectId: string) {
  writeProjectLibrary(owner, readProjectLibrary(owner).filter((project) => project._id !== projectId));
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(`${TIMELINE_PREFIX}${projectId}`);
    if (window.localStorage.getItem(lastProjectKey(owner)) === projectId) {
      window.localStorage.removeItem(lastProjectKey(owner));
    }
  } catch {
    // Best effort only.
  }
}

export function rememberLastOpenedProject(owner: string, projectId: string) {
  if (!owner || !projectId || !canUseStorage()) return;
  try {
    window.localStorage.setItem(lastProjectKey(owner), projectId);
  } catch {
    // Best effort only.
  }
}

export function getLastOpenedProjectId(owner: string) {
  if (!owner || !canUseStorage()) return null;
  try {
    return window.localStorage.getItem(lastProjectKey(owner));
  } catch {
    return null;
  }
}
