#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const TARGET_FILE = path.join(ROOT, "data", "algos", "generated_striver_algos.ts");
const STATE_FILE = path.join(__dirname, ".ollama-pipeline-state.json");

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const getArgValue = (name, fallback) => {
  const prefix = `${name}=`;
  const found = args.find((a) => a.startsWith(prefix));
  if (found) return found.slice(prefix.length);
  const idx = args.indexOf(name);
  if (idx !== -1 && idx + 1 < args.length && !args[idx + 1].startsWith("--")) {
    return args[idx + 1];
  }
  return fallback;
};

const CONFIG = {
  endpoint: String(process.env.OLLAMA_ENDPOINT || getArgValue("--endpoint", "http://localhost:11434")).trim(),
  model: String(process.env.OLLAMA_MODEL || getArgValue("--model", "llama3.2:latest")).trim(),
  reviewerModel: String(process.env.OLLAMA_REVIEWER_MODEL || getArgValue("--reviewer-model", "")).trim(),
  batchSize: Number(getArgValue("--batch", "5")),
  maxItems: Number(getArgValue("--max", "0")),
  continuous: hasFlag("--continuous"),
  concurrency: Number(getArgValue("--concurrency", "2")),
  intervalMs: Number(getArgValue("--interval-ms", "20000")),
  dryRun: hasFlag("--dry-run"),
  skipReview: hasFlag("--skip-review"),
  minDescriptionLength: Number(getArgValue("--min-desc", "900")),
  forceReview: hasFlag("--force-review"),
  noReview: hasFlag("--no-review"),
  temperature: Number(getArgValue("--temperature", "0.08")),
  numPredict: Number(getArgValue("--num-predict", "3200")),
  maxAttempts: Number(getArgValue("--attempts", "3")),
  failCooldownMin: Number(getArgValue("--fail-cooldown-min", "120")),
  prioritizeEasy: !hasFlag("--no-prioritize-easy"),
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) {
    return { completed: {}, failed: {}, updatedAt: new Date().toISOString() };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
}

function saveState(state) {
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
}

function tsModuleToObject(tsContent) {
  const transformed = tsContent
    .replace(/import\s+\{\s*AlgorithmEntry\s*\}\s+from\s+"\.\/types";?/g, "")
    .replace(/export const generatedStriverAlgorithms:\s*AlgorithmEntry\[\]\s*=\s*/g, "module.exports = ");
  const context = { module: { exports: [] } };
  vm.createContext(context);
  vm.runInContext(transformed, context, { timeout: 2000 });
  return context.module.exports;
}

function escapeTemplate(code) {
  return (code || "").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function q(v) {
  return JSON.stringify(v ?? "");
}

function serializeAlgorithms(algorithms) {
  const entries = algorithms
    .map((algo) => {
      const useCases = (algo.useCases || []).map((u) => q(u)).join(", ");
      const approaches = (algo.approaches || [])
        .map((appr) => {
          const implementations = (appr.implementations || [])
            .map(
              (impl) => `            {
              language: ${q(impl.language)},
              code: \`${escapeTemplate(impl.code)}\`
            }`
            )
            .join(",\n");

          return `        {
          name: ${q(appr.name)},
          description: ${q(appr.description)},
          timeComplexity: ${q(appr.timeComplexity)},
          timeComplexityExplanation: ${q(appr.timeComplexityExplanation || "")},
          spaceComplexity: ${q(appr.spaceComplexity)},
          spaceComplexityExplanation: ${q(appr.spaceComplexityExplanation || "")},
          implementations: [
${implementations}
          ]
        }`;
        })
        .join(",\n");

      return `  {
    id: ${q(algo.id)},
    title: ${q(algo.title)},
    topic: ${q(algo.topic)},
    category: ${q(algo.category)},
    frequencyLevel: ${q(algo.frequencyLevel)},
    difficulty: ${q(algo.difficulty)},
    overview: ${q(algo.overview)},
    leetcodeLink: ${q(algo.leetcodeLink || "")},
    useCases: [${useCases}],
    approaches: [
${approaches}
    ]${algo.visualizerCode ? `,\n    visualizerCode: ${q(algo.visualizerCode)}` : ""}
  }`;
    })
    .join(",\n");

  return `import { AlgorithmEntry } from "./types";

export const generatedStriverAlgorithms: AlgorithmEntry[] = [
${entries}
];
`;
}

function isWeakEntry(algo) {
  if (!algo?.approaches?.length) return true;
  const overview = (algo.overview || "").toLowerCase();
  const approach = algo.approaches[0];
  const desc = (approach.description || "").toLowerCase();
  const genericOverview =
    overview.includes("mass-ingested algorithmic placeholder") ||
    overview.includes("elite algorithmic implementation of");
  const genericDescription =
    desc.includes("standard production-grade implementation") ||
    desc.includes("methodology and interactive tutorials") ||
    desc.length < CONFIG.minDescriptionLength;
  const stubCode = (approach.implementations || []).some((impl) => {
    const code = (impl.code || "").toLowerCase();
    return (
      code.includes("todo: implement") ||
      code.includes("pass") ||
      code.includes("...args") ||
      code.includes("logic for") ||
      code.includes("high-performance")
    );
  });
  return genericOverview || genericDescription || stubCode;
}

function normalizeJsonReply(raw) {
  const fenced = raw.match(/```json\s*([\s\S]*?)```/i) || raw.match(/```([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : raw;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in model response.");
  }
  const jsonText = candidate.slice(firstBrace, lastBrace + 1);
  return JSON.parse(jsonText);
}

function canonicalLanguage(lang) {
  const x = String(lang || "").trim().toLowerCase();
  if (x === "python" || x === "py") return "Python";
  if (x === "javascript" || x === "js" || x === "nodejs") return "JavaScript";
  if (x === "c") return "C";
  if (x === "java") return "Java";
  if (x === "c++" || x === "cpp" || x === "cxx") return "C++";
  return String(lang || "").trim();
}

async function ollamaGenerate(model, prompt) {
  const controller = new AbortController();
  const timeoutMs = Number(getArgValue("--request-timeout-ms", "180000"));
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const res = await fetch(`${CONFIG.endpoint}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: controller.signal,
    body: JSON.stringify({
      model,
      prompt,
      format: "json",
      stream: false,
      options: {
        temperature: CONFIG.temperature,
        num_predict: CONFIG.numPredict,
        keep_alive: "20m",
      },
    }),
  });

  clearTimeout(timeout);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Ollama error ${res.status}: ${txt}`);
  }
  const payload = await res.json();
  return payload.response || "";
}

async function listOllamaModels() {
  const res = await fetch(`${CONFIG.endpoint}/api/tags`, { method: "GET" });
  if (!res.ok) throw new Error(`Cannot query Ollama models: HTTP ${res.status}`);
  const data = await res.json();
  return (data.models || []).map((m) => m.name);
}

function buildWriterPrompt(algo) {
  const primaryLangs = ["Python", "JavaScript", "C", "C++"];
  return `You are writing production-quality algorithm education content.
Problem metadata:
- id: ${algo.id}
- title: ${algo.title}
- topic: ${algo.topic}
- difficulty: ${algo.difficulty}

Return ONLY valid JSON object with this exact schema:
{
  "overview": "string",
  "useCases": ["string","string","string"],
  "approach": {
    "name": "Optimal (Topic-Specific)",
    "description": "Long markdown explanation with sections: Core Intuition, Invariant, Logic + Code Walkthrough, Edge Cases, Complexity Deep Dive",
    "timeComplexity": "O(...)",
    "timeComplexityExplanation": "string",
    "spaceComplexity": "O(...)",
    "spaceComplexityExplanation": "string"
  },
  "implementations": [
    {"language":"Python","code":"full working solution code"},
    {"language":"JavaScript","code":"full working solution code"},
    {"language":"C","code":"full working solution code"},
    {"language":"C++","code":"full working solution code"}
  ],
  "visualizerCode": "optional JS trace snippet; can be empty string"
}

Rules:
1) No placeholders, no TODO, no pass stubs.
2) Implementations must be complete and runnable.
3) Keep explanation beginner-friendly but technically rigorous.
4) Complexity must match provided implementation.
5) Use exactly these languages: ${primaryLangs.join(", ")}.
6) Return strict JSON only.
7) Ensure code strings are valid JSON string values (escaped newlines and quotes).
8) Keep each implementation concise and interview-grade (not full CLI app templates).
9) Use function signatures solve(...) for Python/JS/C/C++.
10) Keep response compact and deterministic.`;
}

function buildReviewerPrompt(algo, draft) {
  return `You are a strict reviewer for algorithm educational data.
Problem:
- ${algo.title} (${algo.topic}, ${algo.difficulty})

Draft JSON:
${JSON.stringify(draft)}

Task:
1) Fix any generic statements.
2) Ensure algorithm/code are specific to the problem.
3) Ensure code is complete (no TODO/pass/stub).
4) Ensure complexity is accurate.
Return ONLY corrected JSON object in same schema.
 Enforce exact languages as canonical values: Python, JavaScript, C, C++.`;
}

function validateGeneratedPayload(payload) {
  const required = ["overview", "useCases", "approach", "implementations"];
  for (const key of required) {
    if (!(key in payload)) throw new Error(`Missing key: ${key}`);
  }
  if (!Array.isArray(payload.useCases) || payload.useCases.length < 2) {
    throw new Error("useCases must be an array with >=2 values");
  }
  if (!Array.isArray(payload.implementations) || payload.implementations.length < 4) {
    throw new Error("implementations must contain 4 language entries");
  }
  const langs = new Set(payload.implementations.map((i) => canonicalLanguage(i.language)));
  for (const lang of ["Python", "JavaScript", "C", "C++"]) {
    if (!langs.has(lang)) throw new Error(`Missing implementation for ${lang}`);
  }
  for (const impl of payload.implementations) {
    const code = (impl.code || "").toLowerCase();
    if (!impl.code || code.includes("todo") || code.includes("...args")) {
      throw new Error(`Implementation appears incomplete for ${impl.language}`);
    }
  }
}

function normalizePayload(payload) {
  const cleaned = { ...payload };
  cleaned.useCases = Array.isArray(cleaned.useCases) ? cleaned.useCases.map((x) => String(x).trim()).filter(Boolean) : [];
  cleaned.implementations = Array.isArray(cleaned.implementations)
    ? cleaned.implementations
        .map((impl) => ({
          language: canonicalLanguage(impl.language),
          code: String(impl.code || ""),
        }))
        .filter((impl) => impl.language && impl.code)
    : [];
  const dedup = new Map();
  for (const impl of cleaned.implementations) {
    dedup.set(impl.language, impl);
  }
  cleaned.implementations = Array.from(dedup.values());
  return cleaned;
}

function needsReview(payload) {
  const desc = String(payload?.approach?.description || "");
  const lowDesc = desc.toLowerCase();
  const short = desc.length < CONFIG.minDescriptionLength;
  const generic =
    lowDesc.includes("in general") ||
    lowDesc.includes("depends on implementation") ||
    lowDesc.includes("placeholder");
  const implShort = (payload.implementations || []).some((impl) => String(impl.code || "").length < 120);
  return short || generic || implShort;
}

function parseIsoDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isFailedInCooldown(algoId, state) {
  const failed = state.failed?.[algoId];
  if (!failed || CONFIG.failCooldownMin <= 0) return false;
  const at = parseIsoDate(failed.at);
  if (!at) return false;
  const ageMin = (Date.now() - at.getTime()) / 60000;
  return ageMin < CONFIG.failCooldownMin;
}

function difficultyRank(algo) {
  const d = String(algo?.difficulty || "").toLowerCase();
  if (d.includes("easy")) return 0;
  if (d.includes("medium")) return 1;
  if (d.includes("hard")) return 2;
  return 1;
}

async function generatePayloadWithRetries(algo) {
  let lastError = "unknown";
  let raw = "";
  for (let attempt = 1; attempt <= CONFIG.maxAttempts; attempt++) {
    try {
      raw = await ollamaGenerate(CONFIG.model, buildWriterPrompt(algo));
      const parsed = normalizePayload(normalizeJsonReply(raw));
      validateGeneratedPayload(parsed);
      return parsed;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (lastError.toLowerCase().includes("abort")) {
        throw new Error("Generation timed out. Use a smaller model or increase --request-timeout-ms.");
      }
      const repairPrompt = `Fix this to strict valid JSON in the exact required schema. Do not change algorithm intent. Return JSON only.
Error: ${lastError}
Bad output:
${raw}`;
      try {
        const repairedRaw = await ollamaGenerate(CONFIG.model, repairPrompt);
        const repaired = normalizePayload(normalizeJsonReply(repairedRaw));
        validateGeneratedPayload(repaired);
        return repaired;
      } catch (repairErr) {
        lastError = repairErr instanceof Error ? repairErr.message : String(repairErr);
      }
    }
  }
  throw new Error(`Generation failed after retries: ${lastError}`);
}

function applyGeneratedPayload(algo, payload) {
  const approach = payload.approach || {};
  algo.overview = payload.overview;
  algo.useCases = payload.useCases;
  algo.approaches = [
    {
      name: approach.name || "Optimal",
      description: approach.description || "",
      timeComplexity: approach.timeComplexity || "O(?)",
      timeComplexityExplanation: approach.timeComplexityExplanation || "",
      spaceComplexity: approach.spaceComplexity || "O(?)",
      spaceComplexityExplanation: approach.spaceComplexityExplanation || "",
      implementations: payload.implementations,
    },
  ];
  if (payload.visualizerCode && payload.visualizerCode.trim()) {
    algo.visualizerCode = payload.visualizerCode.trim();
  }
}

async function processOne(algo, state) {
  let draft = await generatePayloadWithRetries(algo);

  const reviewEnabled = !CONFIG.skipReview && !CONFIG.noReview;
  if (reviewEnabled && (CONFIG.forceReview || needsReview(draft))) {
    const reviewerModel = CONFIG.reviewerModel || CONFIG.model;
    const reviewPrompt = buildReviewerPrompt(algo, draft);
    const reviewedRaw = await ollamaGenerate(reviewerModel, reviewPrompt);
    const reviewed = normalizePayload(normalizeJsonReply(reviewedRaw));
    validateGeneratedPayload(reviewed);
    draft = reviewed;
  }

  applyGeneratedPayload(algo, draft);
  state.completed[algo.id] = { at: new Date().toISOString(), model: CONFIG.model };
  delete state.failed[algo.id];
}

async function runPass() {
  const state = loadState();
  const algorithms = tsModuleToObject(fs.readFileSync(TARGET_FILE, "utf8"));
  const queue = algorithms.filter(
    (a) => isWeakEntry(a) && !state.completed[a.id] && !isFailedInCooldown(a.id, state)
  );
  if (CONFIG.prioritizeEasy) {
    queue.sort((a, b) => difficultyRank(a) - difficultyRank(b));
  }
  const totalWeak = algorithms.filter((a) => isWeakEntry(a)).length;
  const remaining = queue.length;

  console.log(`[pipeline] model=${CONFIG.model} weak_total=${totalWeak} remaining=${remaining}`);
  if (remaining === 0) return { changed: false, done: true };

  const take = CONFIG.maxItems > 0 ? Math.min(CONFIG.maxItems, CONFIG.batchSize, remaining) : Math.min(CONFIG.batchSize, remaining);
  const batch = queue.slice(0, take);

  if (CONFIG.dryRun) {
    console.log("[pipeline] dry-run batch ids:", batch.map((b) => b.id).join(", "));
    return { changed: false, done: false };
  }

  let changed = false;
  const concurrency = Math.max(1, Math.min(CONFIG.concurrency, batch.length));
  for (let i = 0; i < batch.length; i += concurrency) {
    const slice = batch.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      slice.map(async (algo) => {
        console.log(`[pipeline] generating: ${algo.id}`);
        await processOne(algo, state);
        return algo.id;
      })
    );

    for (let idx = 0; idx < results.length; idx++) {
      const algo = slice[idx];
      const r = results[idx];
      if (r.status === "fulfilled") {
        changed = true;
        console.log(`[pipeline] done: ${algo.id}`);
      } else {
        const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
        state.failed[algo.id] = { at: new Date().toISOString(), error: msg };
        console.error(`[pipeline] failed: ${algo.id} -> ${msg}`);
      }
    }

    if (changed) {
      const out = serializeAlgorithms(algorithms);
      fs.writeFileSync(TARGET_FILE, out, "utf8");
    }
    saveState(state);
  }

  return { changed, done: false };
}

async function main() {
  const models = await listOllamaModels();
  if (!models.includes(CONFIG.model)) {
    throw new Error(
      `Configured model not found: ${CONFIG.model}. Available: ${models.join(", ")}`
    );
  }
  if (CONFIG.reviewerModel && !models.includes(CONFIG.reviewerModel)) {
    throw new Error(
      `Reviewer model not found: ${CONFIG.reviewerModel}. Available: ${models.join(", ")}`
    );
  }
  do {
    const result = await runPass();
    if (result.done || !CONFIG.continuous) break;
    if (!result.changed) await sleep(CONFIG.intervalMs);
  } while (true);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
