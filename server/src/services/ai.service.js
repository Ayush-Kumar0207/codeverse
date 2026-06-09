const axios = require("axios");
const HttpError = require("../utils/httpError");

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "qwen2.5-coder:1.5b";
const FALLBACK_MODELS = [DEFAULT_MODEL, "llama3.2:latest", "llama3:latest"];
const DEFAULT_NUM_PREDICT = Number(process.env.OLLAMA_NUM_PREDICT || 180);
const DEFAULT_NUM_CTX = Number(process.env.OLLAMA_NUM_CTX || 2048);
const MAX_PROMPT_CHARS = Number(process.env.AI_MAX_PROMPT_CHARS || 2200);
const MAX_CONTEXT_CHARS = Number(process.env.AI_MAX_CONTEXT_CHARS || 1800);
const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function normalizeProvider(value) {
  const provider = String(value || "").trim().toLowerCase();
  if (["ollama", "openai", "auto"].includes(provider)) return provider;
  return process.env.OPENAI_API_KEY ? "auto" : "ollama";
}

function uniqueModels(models) {
  return [...new Set(models.filter(Boolean))];
}

function compactText(value, limit) {
  const text = String(value || "").replace(/\r/g, "").trim();
  if (text.length <= limit) return text;

  const head = Math.floor(limit * 0.7);
  const tail = limit - head - 62;
  return `${text.slice(0, head)}\n...[shortened for latency; ask for deeper detail if needed]...\n${text.slice(-Math.max(0, tail))}`;
}

function fastLocalReply(prompt) {
  const text = String(prompt || "").trim();
  if (/^(hi|hello|hey|yo|sup)\W*$/i.test(text)) {
    return "Hi. Ask me what to explain, debug, or improve in the active file.";
  }
  if (/^(thanks|thank you)\W*$/i.test(text)) {
    return "You're welcome. Send the next code question and I'll keep it quick.";
  }
  return "";
}

function normalizeSuggestion(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/\s+(#{2,4}\s+)/g, "\n\n$1")
    .replace(/\s+(\*\*[^*\n]{2,36}\*\*:)/g, "\n\n$1")
    .replace(/\s+(\d+\.\s+\*\*)/g, "\n$1")
    .replace(/\s+-\s+/g, "\n- ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function finalizeSuggestion(text) {
  const normalized = normalizeSuggestion(text);
  if (!normalized) return "";

  const lines = normalized.split("\n");
  const last = lines.at(-1)?.trim() || "";
  if (last && !/[.!?)`\]]$/.test(last) && lines.length > 1) {
    lines.pop();
  }

  return lines.join("\n").trim() || normalized;
}

function extractOllamaError(error) {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    "Ollama request failed."
  );
}

async function createOpenAIClient() {
  const openaiModule = await import("openai");
  const OpenAI = openaiModule.default || openaiModule.OpenAI;
  const options = { apiKey: process.env.OPENAI_API_KEY };

  if (process.env.OPENAI_BASE_URL) {
    options.baseURL = process.env.OPENAI_BASE_URL;
  }

  return new OpenAI(options);
}

async function generateWithOpenAI(prepared) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const client = await createOpenAIClient();
  const completion = await client.chat.completions.create({
    model: prepared.openAIModel,
    messages: [{ role: "user", content: prepared.fullPrompt }],
    max_tokens: prepared.budget,
    temperature: prepared.fast ? 0.15 : 0.25,
  });
  const suggestion = finalizeSuggestion(completion.choices?.[0]?.message?.content);

  if (!suggestion) {
    throw new Error("OpenAI returned an empty response.");
  }

  return { suggestion, model: prepared.openAIModel, provider: "openai" };
}

async function streamWithOpenAI(prepared, onToken) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const client = await createOpenAIClient();
  const stream = await client.chat.completions.create({
    model: prepared.openAIModel,
    messages: [{ role: "user", content: prepared.fullPrompt }],
    max_tokens: prepared.budget,
    temperature: prepared.fast ? 0.15 : 0.25,
    stream: true,
  });

  let emitted = false;
  for await (const chunk of stream) {
    const token = chunk.choices?.[0]?.delta?.content || "";
    if (token) {
      emitted = true;
      onToken(token);
    }
  }

  if (!emitted) {
    throw new Error("OpenAI returned an empty stream.");
  }

  return { model: prepared.openAIModel, provider: "openai" };
}

async function generateNeuralInsight(payload) {
  const prepared = prepareGeneration(payload);
  if (prepared.localReply) {
    return { suggestion: prepared.localReply, model: "local-fast-path" };
  }

  const failures = [];

  if (prepared.provider !== "openai") {
    for (const modelName of prepared.modelsToTry) {
      try {
        const ollamaRes = await axios.post(
          `${OLLAMA_URL}/api/generate`,
          {
            model: modelName,
            prompt: prepared.fullPrompt,
            stream: false,
            keep_alive: process.env.OLLAMA_KEEP_ALIVE || "20m",
            options: {
              num_predict: prepared.budget,
              num_ctx: DEFAULT_NUM_CTX,
              temperature: prepared.fast ? 0.15 : 0.25,
              top_p: 0.8,
              repeat_penalty: 1.08,
            },
          },
          { timeout: prepared.fast ? 30000 : 70000 }
        );

        const upstreamError = ollamaRes.data?.error;
        if (upstreamError) {
          failures.push(`${modelName}: ${upstreamError}`);
          continue;
        }

        const suggestion = finalizeSuggestion(ollamaRes.data?.response);
        if (suggestion) {
          return { suggestion, model: modelName, provider: "ollama" };
        }

        failures.push(`${modelName}: empty response`);
      } catch (error) {
        failures.push(`${modelName}: ${extractOllamaError(error)}`);
      }
    }
  }

  if (prepared.provider === "openai" || prepared.provider === "auto") {
    try {
      return await generateWithOpenAI(prepared);
    } catch (error) {
      failures.push(`openai:${prepared.openAIModel}: ${error?.message || String(error)}`);
    }
  }

  const tried = [
    ...(prepared.provider !== "openai" ? prepared.modelsToTry : []),
    ...(prepared.provider === "openai" || prepared.provider === "auto" ? [`openai:${prepared.openAIModel}`] : []),
  ];

  throw new HttpError(
    502,
    `AI assistant is unavailable. Tried ${tried.join(", ")}.`,
    failures.join(" | ")
  );
}

function prepareGeneration(payload) {
  const { prompt, context, systemPrompt, model, maxTokens, fast, provider, openAIModel } = payload;

  if (!prompt) {
    throw new HttpError(400, "Neural prompt is required.");
  }

  const selectedProvider = normalizeProvider(provider || process.env.AI_PROVIDER);
  const localReply = fastLocalReply(prompt);
  const compactPrompt = compactText(prompt, fast ? 900 : MAX_PROMPT_CHARS);
  const compactContext = compactText(context || "No project context provided.", fast ? 520 : MAX_CONTEXT_CHARS);
  const budget = Math.max(96, Math.min(Number(maxTokens || DEFAULT_NUM_PREDICT), fast ? 360 : 480));
  const selectedOpenAIModel =
    openAIModel ||
    (selectedProvider === "openai" && model ? model : "") ||
    DEFAULT_OPENAI_MODEL;

  const fullPrompt = `
System: ${systemPrompt || "You are the CodeVerse AI pair programmer. Be clear, practical, and concise."}
Rules:
- Return clean Markdown only.
- Use short sections with blank lines.
- Do not repeat long code.
- For code explanations, use exactly: **Quick Idea**, **Step-by-step**, **Result**.
- Use at most 4 numbered steps.
- Each numbered step must be one short sentence.
- Do not use nested bullets.
- Finish the **Result** section before stopping.
- If code/context is shortened, explain the visible logic and ask for the missing part only when necessary.

Context:
${compactContext}

User:
${compactPrompt}

Assistant:
`;

  return {
    budget,
    fast: Boolean(fast),
    fullPrompt,
    localReply,
    openAIModel: selectedOpenAIModel,
    provider: selectedProvider,
    modelsToTry: uniqueModels([selectedProvider === "openai" ? "" : model, ...FALLBACK_MODELS]),
  };
}

async function streamNeuralInsight(payload, onToken) {
  const prepared = prepareGeneration(payload);
  if (prepared.localReply) {
    onToken(prepared.localReply);
    return { model: "local-fast-path" };
  }

  const failures = [];

  if (prepared.provider !== "openai") {
    for (const modelName of prepared.modelsToTry) {
      let emitted = false;

      try {
        const ollamaRes = await axios.post(
          `${OLLAMA_URL}/api/generate`,
          {
            model: modelName,
            prompt: prepared.fullPrompt,
            stream: true,
            keep_alive: process.env.OLLAMA_KEEP_ALIVE || "20m",
            options: {
              num_predict: prepared.budget,
              num_ctx: DEFAULT_NUM_CTX,
              temperature: prepared.fast ? 0.15 : 0.25,
              top_p: 0.8,
              repeat_penalty: 1.08,
            },
          },
          {
            responseType: "stream",
            timeout: prepared.fast ? 30000 : 70000,
          }
        );

        let buffer = "";
        for await (const chunk of ollamaRes.data) {
          buffer += chunk.toString("utf8");
          let newlineIndex = buffer.indexOf("\n");

          while (newlineIndex >= 0) {
            const line = buffer.slice(0, newlineIndex).trim();
            buffer = buffer.slice(newlineIndex + 1);
            newlineIndex = buffer.indexOf("\n");

            if (!line) continue;

            const item = JSON.parse(line);
            if (item.error) throw new Error(item.error);
            if (item.response) {
              emitted = true;
              onToken(item.response);
            }
            if (item.done) return { model: modelName, provider: "ollama" };
          }
        }

        if (buffer.trim()) {
          const item = JSON.parse(buffer.trim());
          if (item.error) throw new Error(item.error);
          if (item.response) {
            emitted = true;
            onToken(item.response);
          }
        }

        if (emitted) return { model: modelName, provider: "ollama" };
        failures.push(`${modelName}: empty stream`);
      } catch (error) {
        if (emitted) {
          onToken(`\n\nError: ${extractOllamaError(error)}`);
          return { model: modelName, provider: "ollama" };
        }

        failures.push(`${modelName}: ${extractOllamaError(error)}`);
      }
    }
  }

  if (prepared.provider === "openai" || prepared.provider === "auto") {
    try {
      return await streamWithOpenAI(prepared, onToken);
    } catch (error) {
      failures.push(`openai:${prepared.openAIModel}: ${error?.message || String(error)}`);
    }
  }

  const tried = [
    ...(prepared.provider !== "openai" ? prepared.modelsToTry : []),
    ...(prepared.provider === "openai" || prepared.provider === "auto" ? [`openai:${prepared.openAIModel}`] : []),
  ];

  throw new HttpError(
    502,
    `AI assistant is unavailable. Tried ${tried.join(", ")}.`,
    failures.join(" | ")
  );
}

module.exports = {
  suggestCode: generateNeuralInsight, // alias for legacy support
  generateNeuralInsight,
  streamNeuralInsight
};

