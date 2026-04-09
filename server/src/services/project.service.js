const { supabase } = require("../../config/db");
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
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", owner)
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

