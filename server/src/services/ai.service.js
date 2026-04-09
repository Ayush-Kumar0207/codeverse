const axios = require("axios");
const HttpError = require("../utils/httpError");

async function suggestCode(prompt, model = "codellama") {
  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
    throw new HttpError(400, "Prompt must be a string with at least 5 characters.");
  }

  const sanitizedPrompt = prompt.trim().replace(/\s+/g, " ");
  const ollamaRes = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model,
      prompt: sanitizedPrompt,
      stream: false,
    },
    { timeout: 60000 }
  );

  const suggestion = ollamaRes.data?.response?.trim();
  if (!suggestion) {
    throw new HttpError(500, "No response from Ollama.");
  }

  return { suggestion };
}

module.exports = {
  suggestCode,
};

