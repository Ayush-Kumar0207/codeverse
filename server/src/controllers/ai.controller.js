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

const suggestStream = async (req, res) => {
  const { prompt, model, context, systemPrompt, maxTokens, fast } = req.body;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  try {
    await aiService.streamNeuralInsight(
      {
        prompt,
        model,
        context,
        systemPrompt,
        maxTokens,
        fast,
      },
      (token) => {
        res.write(token);
      }
    );
  } catch (error) {
    res.write(`\n\nError: ${error.message || "AI stream failed."}`);
  } finally {
    res.end();
  }
};

module.exports = {
  suggest,
  suggestStream,
};

