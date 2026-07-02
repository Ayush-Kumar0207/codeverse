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
  storyDryRunOnly: hasFlag("--story-dry-run-only"),
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

function serializePlainObject(value, indent = 10) {
  const padding = " ".repeat(indent);
  return JSON.stringify(value, null, 2)
    .split("\n")
    .map((line, index) => (index === 0 ? line : `${padding}${line}`))
    .join("\n");
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
          spaceComplexityExplanation: ${q(appr.spaceComplexityExplanation || "")}${appr.storyDryRun ? `,\n          storyDryRun: ${serializePlainObject(appr.storyDryRun, 10)}` : ""},
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

function normalizeStoryDryRun(value) {
  const source = value?.storyDryRun ? value.storyDryRun : value;
  if (!source || typeof source !== "object") return null;

  const steps = Array.isArray(source.steps)
    ? source.steps
        .map((step) => {
          const variables = step?.variables && typeof step.variables === "object"
            ? Object.fromEntries(
                Object.entries(step.variables)
                  .map(([key, val]) => [String(key).trim(), String(val).trim()])
                  .filter(([key, val]) => key && val)
              )
            : undefined;

          return {
            title: String(step?.title || "").trim(),
            state: String(step?.state || "").trim(),
            explanation: String(step?.explanation || "").trim(),
            ...(variables && Object.keys(variables).length > 0 ? { variables } : {}),
          };
        })
        .filter((step) => step.title && step.state && step.explanation)
    : [];

  return {
    sampleInput: String(source.sampleInput || source.input || "").trim(),
    sampleOutput: String(source.sampleOutput || source.output || "").trim(),
    steps,
    closingInsight: String(source.closingInsight || source.insight || "").trim(),
  };
}

function validateStoryDryRun(value) {
  const story = normalizeStoryDryRun(value);
  if (!story?.sampleInput) throw new Error("storyDryRun.sampleInput is required");
  if (!story.sampleOutput) throw new Error("storyDryRun.sampleOutput is required");
  if (!story.closingInsight) throw new Error("storyDryRun.closingInsight is required");
  if (!Array.isArray(story.steps) || story.steps.length < 5) {
    throw new Error("storyDryRun.steps must contain at least 5 detailed steps");
  }
  return story;
}

function hasStoryDryRun(approach) {
  try {
    validateStoryDryRun(approach?.storyDryRun);
    return true;
  } catch {
    return false;
  }
}

function shouldProcessEntry(algo) {
  if (CONFIG.storyDryRunOnly) return !hasStoryDryRun(algo?.approaches?.[0]);
  return isWeakEntry(algo);
}

function stateKey(algo) {
  return CONFIG.storyDryRunOnly ? `${algo.id}:story-dry-run` : algo.id;
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
  return `You are CodeVerse's strict senior algorithm tutor, implementation engineer, and reviewer.
Target quality: behave as close as possible to a frontier x-high reasoning model. You cannot be vague, generic, or pattern-only. Your output must feel like it was written after fully solving this exact problem.

Problem metadata:
- id: ${algo.id}
- title: ${algo.title}
- topic: ${algo.topic}
- difficulty: ${algo.difficulty}

Quality bar you must satisfy silently before answering:
A) Exactness: every explanation, dry run, complexity, and implementation must match this exact title, not just the broad pattern.
B) Beginner clarity: explain the intuition as if the learner is bright but seeing the pattern for the first time.
C) State tracing: name the variables/state that change and show why each update is legal.
D) Correctness: include the invariant or proof idea that prevents the solution from feeling like magic.
E) Implementation parity: all four languages must solve the same approach with equivalent behavior.
F) Anti-template check: remove sentences that could be pasted into 20 unrelated problems.
G) Edge discipline: mention edge cases that are specific to this problem shape.

Return ONLY valid JSON object with this exact schema:
{
  "overview": "specific plain-English problem summary",
  "useCases": ["specific use case","specific use case","specific use case"],
  "approach": {
    "name": "Optimal (Topic-Specific)",
    "description": "Long markdown explanation with sections: Core Intuition, Invariant, Logic + Code Walkthrough, Story Dry Run, Edge Cases, Complexity Deep Dive",
    "timeComplexity": "O(...) found by counting the dominant operation",
    "timeComplexityExplanation": "why this exact implementation has that time bound",
    "spaceComplexity": "O(...) found by counting auxiliary storage",
    "spaceComplexityExplanation": "why this exact implementation has that space bound"
  },
  "implementations": [
    {"language":"Python","code":"full working solution code"},
    {"language":"JavaScript","code":"full working solution code"},
    {"language":"C","code":"full working solution code"},
    {"language":"C++","code":"full working solution code"}
  ],
  "storyDryRun": {
    "sampleInput": "small concrete input for this exact problem",
    "sampleOutput": "exact output for that sample",
    "steps": [
      {"title":"Set the scene","state":"initial variable/state snapshot","explanation":"patient storybook explanation tied to this problem","variables":{"name":"value"}},
      {"title":"First move","state":"state after the first decision","explanation":"why this move is legal","variables":{"name":"value"}}
    ],
    "closingInsight": "one memorable beginner takeaway"
  },
  "visualizerCode": "optional JS trace snippet; can be empty string"
}

Hard rules:
1) No placeholders, TODOs, pass stubs, pseudo-code-only answers, or generic scaffolds.
2) Use exactly these implementation languages: ${primaryLangs.join(", ")}.
3) Prefer canonical interview signatures named solve(...) unless the problem is a class/data-structure design question.
4) Code strings must be valid JSON string values with escaped newlines and quotes.
5) Keep implementations concise but complete; no full CLI templates.
6) storyDryRun must have 5 to 9 steps, each with meaningful state and variables.
7) The dry run must use a sample whose output you can derive exactly.
8) Complexity must agree with the code and dry run.
9) If the title implies a known problem variant, solve that variant, not a nearby easier variant.
10) Return strict JSON only. No markdown fence. No commentary outside JSON.`;
}
function buildStoryDryRunPrompt(algo) {
  const approach = algo.approaches?.[0] || {};
  const implementation = (approach.implementations || [])[0] || {};
  const codeSample = String(implementation.code || "").slice(0, 2600);
  return `You are CodeVerse's dry-run specialist: a world-class algorithm tutor who turns one problem into a clear, exact, beginner-friendly story.
Target quality: aim for frontier x-high reasoning. A local model may be weaker, so compensate by being concrete, structured, self-critical, and exact.

Problem metadata:
- id: ${algo.id}
- title: ${algo.title}
- topic: ${algo.topic}
- difficulty: ${algo.difficulty}
- overview: ${algo.overview}
- approach: ${approach.name || "Optimal"}
- time: ${approach.timeComplexity || "unknown"}
- space: ${approach.spaceComplexity || "unknown"}

Approach description:
${String(approach.description || "").slice(0, 3200)}

Reference implementation (${implementation.language || "unknown"}):
${codeSample}

Before producing JSON, silently run this audit:
1) Did I choose a sample input that belongs to this exact problem title?
2) Can I compute the sample output manually from the sample input?
3) Does each step show real state change, not just narration?
4) Would a beginner know which variable changed and why?
5) Did I avoid generic pattern language that could fit many problems?
6) Did I cover the critical turn where the algorithm makes its main decision?
7) Is the final output consistent with every step?

Return ONLY valid JSON with this exact schema:
{
  "storyDryRun": {
    "sampleInput": "small concrete input for this exact problem",
    "sampleOutput": "exact output for that sample",
    "steps": [
      {"title":"Set the scene","state":"initial variable/state snapshot","explanation":"patient storybook explanation tied to the exact problem","variables":{"name":"value"}},
      {"title":"First move","state":"next state snapshot","explanation":"why this move happens","variables":{"name":"value"}},
      {"title":"Decision point","state":"state before/after the key branch","explanation":"why the branch is correct","variables":{"name":"value"}},
      {"title":"State update","state":"updated state snapshot","explanation":"how the invariant remains true","variables":{"name":"value"}},
      {"title":"Final reveal","state":"final state snapshot","explanation":"how this produces the sample output","variables":{"name":"value"}}
    ],
    "closingInsight": "one memorable beginner takeaway"
  }
}

Hard rules:
1) Use this exact problem, not just the broad pattern.
2) Use 5 to 9 steps.
3) Every step must include state and variables that change or matter.
4) Keep sample values small enough to trace by hand but rich enough to show the core trick.
5) Explanation style: patient human tutor, storybook flow, technically precise.
6) Forbidden phrases: "standard approach", "simply iterate", "as needed", "depends on implementation", "use the algorithm" without saying what changes.
7) Return strict JSON only. No markdown fence. No commentary outside JSON.`;
}
function buildReviewerPrompt(algo, draft) {
  return `You are a strict senior reviewer for CodeVerse algorithm education data.
Target quality: frontier x-high reasoning style. You must improve weak local-model output, not politely accept it.

Problem:
- ${algo.title} (${algo.topic}, ${algo.difficulty})

Draft JSON:
${JSON.stringify(draft)}

Review and repair checklist:
1) Exact problem fit: reject broad-pattern explanations that do not name this problem's real state.
2) Dry run: ensure storyDryRun has a concrete exact sample, exact output, and 5 to 9 stateful steps.
3) Code correctness: remove placeholders and make all languages equivalent.
4) Complexity: make time/space match the actual implementation.
5) Beginner clarity: add the missing why behind the key branch or update.
6) JSON validity: preserve the same schema and canonical languages: Python, JavaScript, C, C++.

Return ONLY corrected JSON object in the same schema. No markdown fence. No commentary.`;
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
  payload.storyDryRun = validateStoryDryRun(payload.storyDryRun);
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
  cleaned.storyDryRun = normalizeStoryDryRun(cleaned.storyDryRun);
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

async function generateStoryDryRunWithRetries(algo) {
  let lastError = "unknown";
  let raw = "";
  for (let attempt = 1; attempt <= CONFIG.maxAttempts; attempt++) {
    try {
      raw = await ollamaGenerate(CONFIG.model, buildStoryDryRunPrompt(algo));
      const parsed = normalizeJsonReply(raw);
      return validateStoryDryRun(parsed.storyDryRun || parsed);
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (lastError.toLowerCase().includes("abort")) {
        throw new Error("Dry-run generation timed out. Use a smaller model or increase --request-timeout-ms.");
      }
      const repairPrompt = `Fix this to strict valid JSON in the exact storyDryRun schema. Return JSON only.
Error: ${lastError}
Bad output:
${raw}`;
      try {
        const repairedRaw = await ollamaGenerate(CONFIG.model, repairPrompt);
        const repaired = normalizeJsonReply(repairedRaw);
        return validateStoryDryRun(repaired.storyDryRun || repaired);
      } catch (repairErr) {
        lastError = repairErr instanceof Error ? repairErr.message : String(repairErr);
      }
    }
  }
  throw new Error(`Story dry-run generation failed after retries: ${lastError}`);
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
      storyDryRun: payload.storyDryRun,
    },
  ];
  if (payload.visualizerCode && payload.visualizerCode.trim()) {
    algo.visualizerCode = payload.visualizerCode.trim();
  }
}

async function processOne(algo, state) {
  const key = stateKey(algo);

  if (CONFIG.storyDryRunOnly) {
    if (!algo.approaches?.[0]) throw new Error("Cannot attach storyDryRun without an approach");
    algo.approaches[0].storyDryRun = await generateStoryDryRunWithRetries(algo);
    state.completed[key] = { at: new Date().toISOString(), model: CONFIG.model, mode: "story-dry-run-only" };
    delete state.failed[key];
    return;
  }

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
  state.completed[key] = { at: new Date().toISOString(), model: CONFIG.model };
  delete state.failed[key];
}
async function runPass() {
  const state = loadState();
  const algorithms = tsModuleToObject(fs.readFileSync(TARGET_FILE, "utf8"));
  const queue = algorithms.filter((a) => {
    const key = stateKey(a);
    return shouldProcessEntry(a) && !state.completed[key] && !isFailedInCooldown(key, state);
  });
  if (CONFIG.prioritizeEasy) {
    queue.sort((a, b) => difficultyRank(a) - difficultyRank(b));
  }
  const totalWeak = algorithms.filter((a) => shouldProcessEntry(a)).length;
  const remaining = queue.length;
  const mode = CONFIG.storyDryRunOnly ? "story-dry-runs" : "full-generation";

  console.log(`[pipeline] mode=${mode} model=${CONFIG.model} target_total=${totalWeak} remaining=${remaining}`);
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
        console.log(`[pipeline] generating: ${stateKey(algo)}`);
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
        const key = stateKey(algo);
        state.failed[key] = { at: new Date().toISOString(), error: msg };
        console.error(`[pipeline] failed: ${key} -> ${msg}`);
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
