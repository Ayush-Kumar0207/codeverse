const asyncHandler = require("../middlewares/asyncHandler");
const codeService = require("../services/code.service");

const authenticatedUserId = (req) => req.user?._id;

const saveCode = asyncHandler(async (req, res) => {
  const result = await codeService.saveCodeVersion({
    ...req.body,
    userId: authenticatedUserId(req),
  });
  res.status(201).json(result);
});

const getVersions = asyncHandler(async (req, res) => {
  const result = await codeService.getCodeVersions({
    fileName: req.query.fileName,
    userId: authenticatedUserId(req),
  });
  res.json(result);
});

const getUserCodes = asyncHandler(async (req, res) => {
  const result = await codeService.getSavedCodes(authenticatedUserId(req));
  res.json(result);
});

module.exports = {
  saveCode,
  getVersions,
  getUserCodes,
};
