const asyncHandler = require("../middlewares/asyncHandler");
const projectService = require("../services/project.service");

const authenticatedOwner = (req) => req.user?._id;

const create = asyncHandler(async (req, res) => {
  const result = await projectService.createProject({
    ...req.body,
    owner: authenticatedOwner(req),
  });
  res.status(201).json(result);
});

const listCurrent = asyncHandler(async (req, res) => {
  const result = await projectService.getProjectsByOwner(authenticatedOwner(req));
  res.json(result);
});

const listByOwner = asyncHandler(async (req, res) => {
  const result = await projectService.getProjectsByOwner(authenticatedOwner(req));
  res.json(result);
});

const getById = asyncHandler(async (req, res) => {
  const result = await projectService.getProjectById(req.params.id, authenticatedOwner(req));
  res.json(result);
});

const update = asyncHandler(async (req, res) => {
  const result = await projectService.updateProject(req.params.id, authenticatedOwner(req), req.body);
  res.json(result);
});

const remove = asyncHandler(async (req, res) => {
  const result = await projectService.deleteProject(req.params.id, authenticatedOwner(req));
  res.json(result);
});

module.exports = {
  create,
  listCurrent,
  listByOwner,
  getById,
  update,
  remove,
};
