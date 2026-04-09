const asyncHandler = require("../middlewares/asyncHandler");
const aiService = require("../services/ai.service");

const suggest = asyncHandler(async (req, res) => {
  const { prompt, model } = req.body;
  const result = await aiService.suggestCode(prompt, model);
  res.json(result);
});

module.exports = {
  suggest,
};

