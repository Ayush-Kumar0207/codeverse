const asyncHandler = require("../middlewares/asyncHandler");
const executionService = require("../services/execution.service");

const execute = asyncHandler(async (req, res) => {
  const result = await executionService.executeCode(req.body);
  res.json(result);
});

module.exports = {
  execute,
};

