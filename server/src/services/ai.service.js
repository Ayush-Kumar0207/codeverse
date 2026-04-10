const axios = require("axios");
const HttpError = require("../utils/httpError");

async function generateNeuralInsight(payload) {
  const { prompt, context, systemPrompt, model = "codellama" } = payload;
  
  if (!prompt) {
    throw new HttpError(400, "Neural prompt is required.");
  }

  // Constructing a high-fidelity system context
  const fullPrompt = `
System: ${systemPrompt || "You are the CodeVerse Neural Architect. You provide high-fidelity, production-grade code advice."}
Context: ${context || "No project context provided."}
User Request: ${prompt}
Neural Output:
`;

  const ollamaRes = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model,
      prompt: fullPrompt,
      stream: false,
    },
    { timeout: 70000 }
  );

  const suggestion = ollamaRes.data?.response?.trim();
  if (!suggestion) {
    throw new HttpError(500, "Synthetic silence from Ollama Engine.");
  }

  return { suggestion };
}

module.exports = {
  suggestCode: generateNeuralInsight, // alias for legacy support
  generateNeuralInsight
};

