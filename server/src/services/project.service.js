const Project = require("../../models/Project");
const HttpError = require("../utils/httpError");

async function createProject({ title, language, owner }) {
  const project = new Project({ title, language, owner });
  await project.save();
  return { message: "Project created", project };
}

async function getProjectsByOwner(owner) {
  const projects = await Project.find({ owner }).sort({ createdAt: -1 });
  return { projects };
}

async function getProjectById(id) {
  const project = await Project.findById(id);
  if (!project) {
    throw new HttpError(404, "Project not found");
  }
  return { project };
}

async function updateProject(id, { code, title, language }) {
  const updated = await Project.findByIdAndUpdate(id, { code, title, language }, { new: true });
  if (!updated) {
    throw new HttpError(404, "Project not found");
  }
  return { message: "Project updated", project: updated };
}

async function deleteProject(id) {
  const deleted = await Project.findByIdAndDelete(id);
  if (!deleted) {
    throw new HttpError(404, "Project not found");
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

