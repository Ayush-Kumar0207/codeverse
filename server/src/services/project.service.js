const { supabase } = require("../config/db");
const HttpError = require("../utils/httpError");

async function createProject({ title, language, owner }) {
  const { data: project, error } = await supabase
    .from("projects")
    .insert([{ title, language, owner_id: owner }])
    .select()
    .single();

  if (error) throw error;
  return { message: "Project created", project };
}

async function getProjectsByOwner(owner) {
  let ownerId = owner;

  // If owner doesn't look like a UUID, assume it's a username and look up the ID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(owner)) {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("username", owner)
      .single();

    if (userError || !userData) {
      throw new HttpError(404, "User not found");
    }
    ownerId = userData.id;
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return { projects };
}

async function getProjectById(id) {
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    throw new HttpError(404, "Project not found");
  }
  return { project };
}

async function updateProject(id, { code, title, language }) {
  const updates = { code, title, language };
  const { data: updated, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !updated) {
    throw new HttpError(404, "Project not found or update failed");
  }
  return { message: "Project updated", project: updated };
}

async function deleteProject(id) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    throw new HttpError(404, "Project not found or deletion failed");
  }
  return { message: "Project deleted" };
}

module.exports = {
  createProject,
  getProjectsByOwner,
  getProjectById,
  updateProject,
  deleteProject,
};

