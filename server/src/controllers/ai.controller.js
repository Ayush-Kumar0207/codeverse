const asyncHandler = require("../middlewares/asyncHandler");
const aiService = require("../services/ai.service");

const suggest = asyncHandler(async (req, res) => {
  const { prompt, model, context, systemPrompt } = req.body;
  const result = await aiService.suggestCode({ 
    prompt, 
    model, 
    context, 
    systemPrompt 
  });
  res.json(result);
});

module.exports = {
  suggest,
};

