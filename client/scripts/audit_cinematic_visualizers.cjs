const fs = require("fs");
const Module = require("module");
const path = require("path");
const ts = require("typescript");

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveTypeScriptModule(request, parent, isMain, options) {
  try {
    return originalResolveFilename.call(this, request, parent, isMain, options);
  } catch (error) {
    if (!request.startsWith(".") || !parent?.filename) throw error;

    const base = path.resolve(path.dirname(parent.filename), request);
    for (const candidate of [`${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]) {
      if (fs.existsSync(candidate)) return candidate;
    }
    throw error;
  }
};

require.extensions[".ts"] = compileTypeScript;
require.extensions[".tsx"] = compileTypeScript;

function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  });
  module._compile(output.outputText, filename);
}

const { AT_ALGORITHMS } = require("../data/algos/index.ts");
const {
  getCinematicVisualizerCode,
  hasCinematicVisualizer,
} = require("../lib/cinematic-visualizers.ts");

const failures = [];
const familyCounts = new Map();
let traceStateCount = 0;
let dedicatedSceneCount = 0;
let adaptiveSceneCount = 0;

for (const algorithm of AT_ALGORITHMS) {
  const label = `${algorithm.title} [${algorithm.id}]`;
  if (!algorithm.visualizerCode?.trim()) {
    failures.push(`${label}: missing base trace`);
    continue;
  }
  if (!hasCinematicVisualizer(algorithm)) {
    failures.push(`${label}: cinematic route is disabled`);
    continue;
  }

  const code = getCinematicVisualizerCode(algorithm);
  if (!code.trim()) {
    failures.push(`${label}: cinematic trace is empty`);
    continue;
  }

  const captured = [];
  try {
    new Function("recordTrace", code)((state) => captured.push(state));
  } catch (error) {
    failures.push(`${label}: cinematic trace throws ${formatError(error)}`);
    continue;
  }

  if (!captured.length) {
    failures.push(`${label}: cinematic trace records no states`);
    continue;
  }

  traceStateCount += captured.length;
  const expectedVisualizer =
    algorithm.id === "two-sum" ? "two-sum-cinematic-3d" : "codeverse-cinematic-3d";
  if (expectedVisualizer === "two-sum-cinematic-3d") dedicatedSceneCount += 1;
  else adaptiveSceneCount += 1;

  for (const [index, state] of captured.entries()) {
    if (!state || typeof state !== "object" || Array.isArray(state)) {
      failures.push(`${label}: step ${index + 1} is not an object`);
      continue;
    }
    if (state.visualizer !== expectedVisualizer) {
      failures.push(
        `${label}: step ${index + 1} uses ${String(state.visualizer)} instead of ${expectedVisualizer}`
      );
    }
    if (!state.algorithm || state.algorithm.id !== algorithm.id) {
      failures.push(`${label}: step ${index + 1} lost algorithm identity`);
    }
    if (algorithm.id !== "two-sum" && !state.cinematic3d) {
      failures.push(`${label}: step ${index + 1} has no adaptive 3D profile`);
    }
    if (!hasRenderableState(state)) {
      failures.push(`${label}: step ${index + 1} has no renderable scene data`);
    }
  }

  const family = String(captured[0]?.kind || captured[0]?.algorithm?.family || "unknown");
  familyCounts.set(family, (familyCounts.get(family) || 0) + 1);
}

console.log(
  `Audited ${AT_ALGORITHMS.length}/${AT_ALGORITHMS.length} cinematic algorithm routes and ${traceStateCount} trace states.`
);
console.log(
  `Scene coverage: ${dedicatedSceneCount} dedicated + ${adaptiveSceneCount} adaptive = ${
    dedicatedSceneCount + adaptiveSceneCount
  }.`
);
console.log(
  `Families: ${Array.from(familyCounts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([family, count]) => `${family}=${count}`)
    .join(", ")}`
);

if (failures.length) {
  console.error(`Cinematic audit failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Cinematic 3D coverage audit passed.");
}

function hasRenderableState(state) {
  const keys = [
    "values",
    "working_array",
    "chars",
    "matrix",
    "dpTable",
    "dp_table",
    "dpRow",
    "graph",
    "tree",
    "list",
    "stack",
    "queue",
    "heap",
    "bits",
    "recursionFrames",
    "choices",
  ];
  return keys.some((key) => {
    const value = state[key];
    if (Array.isArray(value)) return true;
    return Boolean(value && typeof value === "object");
  });
}

function formatError(error) {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}
