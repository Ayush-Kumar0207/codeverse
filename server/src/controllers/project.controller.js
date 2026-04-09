const asyncHandler = require("../middlewares/asyncHandler");
const projectService = require("../services/project.service");

const create = asyncHandler(async (req, res) => {
  const result = await projectService.createProject(req.body);
  res.status(201).json(result);
});

const listByOwner = asyncHandler(async (req, res) => {
  const result = await projectService.getProjectsByOwner(req.params.owner);
  res.json(result);
});

const getById = asyncHandler(async (req, res) => {
  const result = await projectService.getProjectById(req.params.id);
  res.json(result);
});

const update = asyncHandler(async (req, res) => {
  const result = await projectService.updateProject(req.params.id, req.body);
  res.json(result);
});

const remove = asyncHandler(async (req, res) => {
  const result = await projectService.deleteProject(req.params.id);
  res.json(result);
});

module.exports = {
  create,
  listByOwner,
  getById,
  update,
  remove,
};

