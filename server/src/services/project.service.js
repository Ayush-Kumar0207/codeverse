const { supabase } = require("../config/db");
const HttpError = require("../utils/httpError");
const localProjectStore = require("./localProjectStore.service");

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SUPABASE_TIMEOUT_MS = Number(process.env.SUPABASE_TIMEOUT_MS || 2500);

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isSupabaseUnavailable(error) {
  const message = `${error?.message || ""} ${error?.cause?.message || ""}`;
  return (
    !supabase ||
    /fetch failed|getaddrinfo|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ETIMEDOUT|timed out|timeout|network/i.test(message)
  );
}

function withSupabaseTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error(`${label} timed out after ${SUPABASE_TIMEOUT_MS}ms`)),
        SUPABASE_TIMEOUT_MS
      );
    }),
  ]);
}

function normalizeProject(project) {
  return {
    _id: project._id || project.id,
    title: project.title,
    language: project.language,
    owner: project.owner || project.owner_id,
    isDemo: Boolean(project.isDemo || project.is_demo),
    code: project.code || "",
    createdAt: project.createdAt || project.created_at,
    updatedAt: project.updatedAt || project.updated_at || project.created_at,
  };
}

function validateProjectPayload({ title, language, owner }) {
  if (!title) throw new HttpError(400, "Project title is required");
  if (!language) throw new HttpError(400, "Project language is required");
  if (!owner) throw new HttpError(400, "Project owner is required");
}

async function resolveSupabaseOwnerId(owner) {
  if (uuidRegex.test(owner)) return owner;

  const { data: userData, error } = await withSupabaseTimeout(
    supabase
      .from("users")
      .select("id")
      .eq("username", owner)
      .maybeSingle(),
    "Supabase owner lookup"
  );

  if (error) throw error;
  return userData?.id || null;
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
    return { message: "Project created", project: normalizeProject(project) };
  };

  if (!supabase) return createLocalProject();

  try {
    const ownerId = await resolveSupabaseOwnerId(payload.owner);
    if (!ownerId) return createLocalProject();

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
    if (isSupabaseUnavailable(error)) return createLocalProject();
    throw error;
  }
}

async function getProjectsByOwner(owner) {
  const cleanOwner = cleanText(owner);
  if (!cleanOwner) throw new HttpError(400, "Project owner is required");

  const listLocalProjects = async () => {
    const projects = await localProjectStore.findByOwner(cleanOwner);
    return { projects: projects.map(normalizeProject) };
  };

  if (!supabase) return listLocalProjects();

  try {
    const ownerId = await resolveSupabaseOwnerId(cleanOwner);
    if (!ownerId) return listLocalProjects();

    const { data: projects, error } = await withSupabaseTimeout(
      supabase
        .from("projects")
        .select("*")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false }),
      "Supabase project list"
    );

    if (error) throw error;
    return { projects: (projects || []).map(normalizeProject) };
  } catch (error) {
    if (isSupabaseUnavailable(error)) return listLocalProjects();
    throw error;
  }
}

async function getProjectById(id) {
  const cleanId = cleanText(id);
  if (!cleanId) throw new HttpError(400, "Project id is required");

  const getLocalProject = async () => {
    const project = await localProjectStore.findById(cleanId);
    if (!project) throw new HttpError(404, "Project not found");
    return { project: normalizeProject(project) };
  };

  if (!supabase) return getLocalProject();

  try {
    const { data: project, error } = await withSupabaseTimeout(
      supabase
        .from("projects")
        .select("*")
        .eq("id", cleanId)
        .maybeSingle(),
      "Supabase project lookup"
    );

    if (error) throw error;
    if (!project) return getLocalProject();

    return { project: normalizeProject(project) };
  } catch (error) {
    if (isSupabaseUnavailable(error)) return getLocalProject();
    throw error;
  }
}

async function updateProject(id, { code, title, language }) {
  const cleanId = cleanText(id);
  if (!cleanId) throw new HttpError(400, "Project id is required");

  const updates = {
    ...(typeof code === "string" ? { code } : {}),
    ...(typeof title === "string" ? { title: cleanText(title) } : {}),
    ...(typeof language === "string" ? { language: cleanText(language) } : {}),
  };

  const updateLocalProject = async () => {
    const project = await localProjectStore.updateProject(cleanId, updates);
    if (!project) throw new HttpError(404, "Project not found or update failed");
    return { message: "Project updated", project: normalizeProject(project) };
  };

  if (!supabase) return updateLocalProject();

  try {
    const supabaseUpdates = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    const { data: updated, error } = await withSupabaseTimeout(
      supabase
        .from("projects")
        .update(supabaseUpdates)
        .eq("id", cleanId)
        .select()
        .maybeSingle(),
      "Supabase project update"
    );

    if (error) throw error;
    if (!updated) return updateLocalProject();

    return { message: "Project updated", project: normalizeProject(updated) };
  } catch (error) {
    if (isSupabaseUnavailable(error)) return updateLocalProject();
    throw error;
  }
}

async function deleteProject(id) {
  const cleanId = cleanText(id);
  if (!cleanId) throw new HttpError(400, "Project id is required");

  const deleteLocalProject = async () => {
    const deleted = await localProjectStore.deleteProject(cleanId);
    if (!deleted) throw new HttpError(404, "Project not found or deletion failed");
    return { message: "Project deleted" };
  };

  if (!supabase) return deleteLocalProject();

  try {
    const { error } = await withSupabaseTimeout(
      supabase.from("projects").delete().eq("id", cleanId),
      "Supabase project delete"
    );
    if (error) throw error;

    await localProjectStore.deleteProject(cleanId);
    return { message: "Project deleted" };
  } catch (error) {
    if (isSupabaseUnavailable(error)) return deleteLocalProject();
    throw error;
  }
}

module.exports = {
  createProject,
  deleteProject,
  getProjectById,
  getProjectsByOwner,
  updateProject,
};
