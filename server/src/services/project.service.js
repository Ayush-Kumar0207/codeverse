const { supabase } = require("../config/db");
const HttpError = require("../utils/httpError");
const localProjectStore = require("./localProjectStore.service");

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SUPABASE_TIMEOUT_MS = Number(process.env.SUPABASE_TIMEOUT_MS || 2500);

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeWorkspaceFiles(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new HttpError(400, "Workspace files must be a file-content object");
  }

  const entries = Object.entries(value);
  if (!entries.length || entries.length > 100) {
    throw new HttpError(400, "A workspace must contain between 1 and 100 files");
  }

  let totalBytes = 0;
  const files = {};
  for (const [rawName, rawContent] of entries) {
    const name = cleanText(rawName);
    if (!name || name.length > 200 || name.includes("..") || name.startsWith("/") || name.startsWith("\\")) {
      throw new HttpError(400, "Workspace contains an invalid file name");
    }
    if (typeof rawContent !== "string") throw new HttpError(400, `Workspace file ${name} must contain text`);
    totalBytes += Buffer.byteLength(rawContent, "utf8");
    if (totalBytes > 2_000_000) throw new HttpError(413, "Workspace exceeds the 2 MB cloud-save limit");
    files[name] = rawContent;
  }
  return files;
}

function encodeWorkspace(files, activeFile) {
  const normalizedFiles = normalizeWorkspaceFiles(files);
  const requestedActiveFile = cleanText(activeFile);
  const normalizedActiveFile = Object.hasOwn(normalizedFiles, requestedActiveFile)
    ? requestedActiveFile
    : Object.keys(normalizedFiles)[0];
  return JSON.stringify({ format: "codeverse-workspace-v1", files: normalizedFiles, activeFile: normalizedActiveFile });
}

function decodeWorkspace(value) {
  if (typeof value !== "string" || !value.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(value);
    if (parsed?.format !== "codeverse-workspace-v1" || !parsed.files || typeof parsed.files !== "object") return null;
    const activeFile = Object.hasOwn(parsed.files, parsed.activeFile)
      ? parsed.activeFile
      : Object.keys(parsed.files)[0] || "";
    return { files: parsed.files, activeFile };
  } catch {
    return null;
  }
}

function canUseLocalProjectStore() {
  return process.env.NODE_ENV !== "production";
}

function cloudPersistenceError() {
  return new HttpError(
    503,
    "Cloud project storage is temporarily unavailable. Nothing was saved to temporary server storage; please retry."
  );
}

function isSupabaseUnavailable(error) {
  const message = `${error?.message || ""} ${error?.cause?.message || ""}`;
  return (
    !supabase ||
    /fetch failed|getaddrinfo|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ETIMEDOUT|timed out|timeout|network/i.test(message)
  );
}

async function withSupabaseTimeout(promise, label) {
  let timeout;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error(`${label} timed out after ${SUPABASE_TIMEOUT_MS}ms`)),
          SUPABASE_TIMEOUT_MS
        );
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function normalizeProject(project, storage = "cloud") {
  const workspace = decodeWorkspace(project.code);
  return {
    _id: project._id || project.id,
    title: project.title,
    language: project.language,
    owner: project.owner || project.owner_id,
    isDemo: Boolean(project.isDemo || project.is_demo),
    code: workspace ? workspace.files[workspace.activeFile] || "" : project.code || "",
    files: workspace?.files,
    activeFile: workspace?.activeFile,
    createdAt: project.createdAt || project.created_at,
    updatedAt: project.updatedAt || project.updated_at || project.created_at,
    storage,
  };
}

function validateProjectPayload({ title, language, owner }) {
  if (!title) throw new HttpError(400, "Project title is required");
  if (!language) throw new HttpError(400, "Project language is required");
  if (!owner) throw new HttpError(401, "An authenticated project owner is required");
}

async function resolveSupabaseOwnerId(owner) {
  if (uuidRegex.test(owner)) return owner;

  const { data: userData, error } = await withSupabaseTimeout(
    supabase.from("users").select("id").eq("username", owner).maybeSingle(),
    "Supabase owner lookup"
  );

  if (error) throw error;
  return userData?.id || null;
}

async function localProjectByOwner(id, owner) {
  const project = await localProjectStore.findById(id);
  if (!project || (project.owner !== owner && project.owner_id !== owner)) return null;
  return project;
}

async function createProject({ title, language, owner }) {
  const payload = {
    title: cleanText(title),
    language: cleanText(language),
    owner: cleanText(owner),
  };
  validateProjectPayload(payload);

  const createLocalProject = async () => {
    const project = await localProjectStore.createProject(payload);
    return { message: "Project created on this development device", project: normalizeProject(project, "device") };
  };

  if (!supabase) {
    if (canUseLocalProjectStore()) return createLocalProject();
    throw cloudPersistenceError();
  }

  try {
    const ownerId = await resolveSupabaseOwnerId(payload.owner);
    if (!ownerId) throw new HttpError(404, "Authenticated project owner was not found");

    const { data: project, error } = await withSupabaseTimeout(
      supabase
        .from("projects")
        .insert([{ title: payload.title, language: payload.language, owner_id: ownerId, code: "" }])
        .select()
        .single(),
      "Supabase project create"
    );

    if (error) throw error;
    return { message: "Project created", project: normalizeProject(project) };
  } catch (error) {
    if (isSupabaseUnavailable(error)) {
      if (canUseLocalProjectStore()) return createLocalProject();
      throw cloudPersistenceError();
    }
    throw error;
  }
}

async function getProjectsByOwner(owner) {
  const cleanOwner = cleanText(owner);
  if (!cleanOwner) throw new HttpError(401, "An authenticated project owner is required");

  const listLocalProjects = async () => {
    const projects = await localProjectStore.findByOwner(cleanOwner);
    return { projects: projects.map((project) => normalizeProject(project, "device")) };
  };

  if (!supabase) {
    if (canUseLocalProjectStore()) return listLocalProjects();
    throw cloudPersistenceError();
  }

  try {
    const ownerId = await resolveSupabaseOwnerId(cleanOwner);
    if (!ownerId) return { projects: [] };

    const { data: projects, error } = await withSupabaseTimeout(
      supabase
        .from("projects")
        .select("*")
        .eq("owner_id", ownerId)
        .order("updated_at", { ascending: false }),
      "Supabase project list"
    );

    if (error) throw error;
    return { projects: (projects || []).map((project) => normalizeProject(project)) };
  } catch (error) {
    if (isSupabaseUnavailable(error)) {
      if (canUseLocalProjectStore()) return listLocalProjects();
      throw cloudPersistenceError();
    }
    throw error;
  }
}

async function getProjectById(id, owner) {
  const cleanId = cleanText(id);
  const cleanOwner = cleanText(owner);
  if (!cleanId) throw new HttpError(400, "Project id is required");
  if (!cleanOwner) throw new HttpError(401, "An authenticated project owner is required");

  const getLocalProject = async () => {
    const project = await localProjectByOwner(cleanId, cleanOwner);
    if (!project) throw new HttpError(404, "Project not found");
    return { project: normalizeProject(project, "device") };
  };

  if (!supabase) {
    if (canUseLocalProjectStore()) return getLocalProject();
    throw cloudPersistenceError();
  }

  try {
    const ownerId = await resolveSupabaseOwnerId(cleanOwner);
    const { data: project, error } = await withSupabaseTimeout(
      supabase
        .from("projects")
        .select("*")
        .eq("id", cleanId)
        .eq("owner_id", ownerId)
        .maybeSingle(),
      "Supabase project lookup"
    );

    if (error) throw error;
    if (!project) {
      if (canUseLocalProjectStore()) return getLocalProject();
      throw new HttpError(404, "Project not found");
    }

    return { project: normalizeProject(project) };
  } catch (error) {
    if (isSupabaseUnavailable(error)) {
      if (canUseLocalProjectStore()) return getLocalProject();
      throw cloudPersistenceError();
    }
    throw error;
  }
}

async function updateProject(id, owner, { code, title, language, files, activeFile }) {
  const cleanId = cleanText(id);
  const cleanOwner = cleanText(owner);
  if (!cleanId) throw new HttpError(400, "Project id is required");
  if (!cleanOwner) throw new HttpError(401, "An authenticated project owner is required");

  const updates = {
    ...(files !== undefined
      ? { code: encodeWorkspace(files, activeFile) }
      : typeof code === "string"
        ? { code }
        : {}),
    ...(typeof title === "string" ? { title: cleanText(title) } : {}),
    ...(typeof language === "string" ? { language: cleanText(language) } : {}),
  };

  const updateLocalProject = async () => {
    const existing = await localProjectByOwner(cleanId, cleanOwner);
    if (!existing) throw new HttpError(404, "Project not found");
    const project = await localProjectStore.updateProject(cleanId, updates);
    return { message: "Project updated on this development device", project: normalizeProject(project, "device") };
  };

  if (!supabase) {
    if (canUseLocalProjectStore()) return updateLocalProject();
    throw cloudPersistenceError();
  }

  try {
    const ownerId = await resolveSupabaseOwnerId(cleanOwner);
    const { data: updated, error } = await withSupabaseTimeout(
      supabase
        .from("projects")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", cleanId)
        .eq("owner_id", ownerId)
        .select()
        .maybeSingle(),
      "Supabase project update"
    );

    if (error) throw error;
    if (!updated) throw new HttpError(404, "Project not found");
    return { message: "Project updated", project: normalizeProject(updated) };
  } catch (error) {
    if (isSupabaseUnavailable(error)) {
      if (canUseLocalProjectStore()) return updateLocalProject();
      throw cloudPersistenceError();
    }
    throw error;
  }
}

async function deleteProject(id, owner) {
  const cleanId = cleanText(id);
  const cleanOwner = cleanText(owner);
  if (!cleanId) throw new HttpError(400, "Project id is required");
  if (!cleanOwner) throw new HttpError(401, "An authenticated project owner is required");

  const deleteLocalProject = async () => {
    const existing = await localProjectByOwner(cleanId, cleanOwner);
    if (!existing) throw new HttpError(404, "Project not found");
    await localProjectStore.deleteProject(cleanId);
    return { message: "Project deleted" };
  };

  if (!supabase) {
    if (canUseLocalProjectStore()) return deleteLocalProject();
    throw cloudPersistenceError();
  }

  try {
    const ownerId = await resolveSupabaseOwnerId(cleanOwner);
    const { data: deleted, error } = await withSupabaseTimeout(
      supabase
        .from("projects")
        .delete()
        .eq("id", cleanId)
        .eq("owner_id", ownerId)
        .select("id")
        .maybeSingle(),
      "Supabase project delete"
    );
    if (error) throw error;
    if (!deleted) throw new HttpError(404, "Project not found");
    return { message: "Project deleted" };
  } catch (error) {
    if (isSupabaseUnavailable(error)) {
      if (canUseLocalProjectStore()) return deleteLocalProject();
      throw cloudPersistenceError();
    }
    throw error;
  }
}

module.exports = {
  canUseLocalProjectStore,
  decodeWorkspace,
  encodeWorkspace,
  createProject,
  deleteProject,
  getProjectById,
  getProjectsByOwner,
  updateProject,
};
