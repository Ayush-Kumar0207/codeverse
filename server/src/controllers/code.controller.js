const asyncHandler = require("../middlewares/asyncHandler");
const codeService = require("../services/code.service");

const saveCode = asyncHandler(async (req, res) => {
  const result = await codeService.saveCodeVersion(req.body);
  res.status(201).json(result);
});

const getVersions = asyncHandler(async (req, res) => {
  const result = await codeService.getCodeVersions(req.query);
  res.json(result);
});

const getUserCodes = asyncHandler(async (req, res) => {
  const result = await codeService.getSavedCodes(req.params.userId);
  res.json(result);
});

module.exports = {
  saveCode,
  getVersions,
  getUserCodes,
};

