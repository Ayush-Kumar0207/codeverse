const asyncHandler = require("../middlewares/asyncHandler");
const codeService = require("../services/code.service");

const save = asyncHandler(async (req, res) => {
  const result = await codeService.saveLegacyVersion(req.body);
  res.status(201).json(result);
});

const list = asyncHandler(async (req, res) => {
  const result = await codeService.getLegacyVersions(req.params.userId, req.params.fileName);
  res.json(result);
});

module.exports = {
  save,
  list,
};

