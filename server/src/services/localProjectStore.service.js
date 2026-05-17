const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const DATA_DIR = path.join(__dirname, "../../.data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");

async function readProjects() {
  try {
    const raw = await fs.readFile(PROJECTS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeProjects(projects) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PROJECTS_FILE, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
}

async function createProject({ title, language, owner }) {
  const projects = await readProjects();
  const now = new Date().toISOString();
  const project = {
    _id: randomUUID(),
    title,
    language,
    owner,
    code: "",
    isDemo: false,
    createdAt: now,
    updatedAt: now,
  };

  projects.unshift(project);
  await writeProjects(projects);

  return project;
}

async function findByOwner(owner) {
  const projects = await readProjects();
  return projects.filter((project) => project.owner === owner || project.owner_id === owner);
}

async function findById(id) {
  const projects = await readProjects();
  return projects.find((project) => project._id === id || project.id === id) || null;
}

async function updateProject(id, updates) {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project._id === id || project.id === id);
  if (index === -1) return null;

  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeProjects(projects);

  return projects[index];
}

async function deleteProject(id) {
  const projects = await readProjects();
  const nextProjects = projects.filter((project) => project._id !== id && project.id !== id);
  if (nextProjects.length === projects.length) return false;

  await writeProjects(nextProjects);
  return true;
}

module.exports = {
  createProject,
  deleteProject,
  findById,
  findByOwner,
  updateProject,
};
