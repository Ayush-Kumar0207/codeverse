// server/routes/ai.js

const express = require("express");
const router = express.Router();
const axios = require("axios");

/**
 * @route   POST /api/ai/suggest
 * @desc    Get code suggestion/refactor from Ollama (e.g., CodeLlama)
 * @access  Public
 */
router.post("/suggest", async (req, res) => {
  try {
    let { prompt, model } = req.body;
    console.log("📥 Prompt received:", prompt);
    model = model?.trim().toLowerCase() || "codellama";
    console.log("🤖 Using model:", model);

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      console.log("❌ Prompt too short or invalid");
      return res.status(400).json({
        error: "Prompt must be a string with at least 5 characters.",
      });
    }

    const sanitizedPrompt = prompt.trim().replace(/\s+/g, " ");

    console.log("📡 Sending request to Ollama...");

    const ollamaRes = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model,
        prompt: sanitizedPrompt,
        stream: false,
      },
      { timeout: 60000 }
    );

    console.log("✅ Ollama responded:", ollamaRes.data);

    const suggestion = ollamaRes.data?.response?.trim();
    if (!suggestion) {
      return res.status(500).json({ error: "No response from Ollama." });
    }

    return res.status(200).json({ suggestion });

  } catch (err) {
    console.error("❌ AI Suggestion Error:", err.message);
    return res.status(500).json({
      error: "Failed to get AI suggestion from Ollama.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = router;
