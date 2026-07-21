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
    for (const candidate of [`${base}.ts`, path.join(base, "index.ts")]) {
      if (fs.existsSync(candidate)) return candidate;
    }

    throw error;
  }
};

require.extensions[".ts"] = function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  });

  module._compile(output.outputText, filename);
};

const { AT_ALGORITHMS } = require("../data/algos/index.ts");

const suspiciousTemplates = [
  ["longestWindowAtMostK", /longest.*(?:window|subarray).*at most|longest.*subarray.*sum/i],
  ["prefixTotal", /prefix|range sum/i],
  ["maxDepth", /depth|height|diameter/i],
  ["reverseList", /reverse.*(?:linked )?list/i],
  ["nextGreaterElements", /next greater/i],
  ["topKFrequent", /top k frequent/i],
  ["subsetSum", /subset sum/i],
  ["maxNonOverlappingIntervals", /non.?overlapping|meetings|activity selection/i],
  ["countSetBits", /set bits/i],
  ["longestCommonPrefix", /longest common prefix/i],
  ["countDigits", /count digits|number of digits/i],
  ["lowerBound", /lower bound|binary search|first and last occurrence|row with max 1s/i],
];

const failures = [];
const ids = new Set();
const codeOwners = new Map();
let approachCount = 0;
let implementationCount = 0;

for (const algorithm of AT_ALGORITHMS) {
  if (ids.has(algorithm.id)) failures.push(`Duplicate algorithm id: ${algorithm.id}`);
  ids.add(algorithm.id);

  for (const approach of algorithm.approaches) {
    approachCount += 1;
    const languages = new Set();

    if (!approach.implementations.length) {
      failures.push(`${algorithm.title} / ${approach.name}: no verified implementation`);
    }

    for (const implementation of approach.implementations) {
      implementationCount += 1;
      const code = implementation.code || "";
      const language = implementation.language.toLowerCase();

      if (languages.has(language)) {
        failures.push(`${algorithm.title} / ${approach.name}: duplicate ${implementation.language} implementation`);
      }
      languages.add(language);

      if (!code.trim()) failures.push(`${algorithm.title} / ${approach.name} / ${implementation.language}: empty code`);
      if (/Pattern implementation|reference scaffold|Implement the selected approach|Auto-completed/i.test(code)) {
        failures.push(`${algorithm.title} / ${approach.name} / ${implementation.language}: placeholder or generic implementation`);
      }

      const fingerprint = code
        .replace(/\/\/.*$/gm, "")
        .replace(/#.*$/gm, "")
        .replace(/\s+/g, " ")
        .trim();
      if (fingerprint.length >= 120) {
        const ownerKey = `${language}:${fingerprint}`;
        const owners = codeOwners.get(ownerKey) || new Map();
        owners.set(algorithm.id, algorithm.title);
        codeOwners.set(ownerKey, owners);
      }

      for (const [signature, allowedTitle] of suspiciousTemplates) {
        if (code.includes(signature) && !allowedTitle.test(algorithm.title)) {
          failures.push(
            `${algorithm.title} / ${approach.name} / ${implementation.language}: suspicious ${signature} template`
          );
        }
      }
    }
  }
}

const equivalentProblemGroups = [
  new Set(["balanced-binary-tree", "check-if-a-tree-is-balanced-or-not"]),
  new Set(["inorder-successor-predecessor-in-bst", "inorder-predecessor-successor-in-bst"]),
  new Set([
    "find-the-number-that-appears-once",
    "find-the-number-that-appears-once-and-the-other-numbers-appear-twice",
  ]),
  new Set(["trapping-rain-water", "trapping-rainwater"]),
  new Set(["find-intersection-point-of-y-ll", "find-the-intersection-point-of-y-ll"]),
  new Set([
    "search-in-rotated-sorted-array",
    "search-in-rotated-sorted-array-i",
    "search-in-rotated-sorted-array-ii",
  ]),
];

for (const owners of codeOwners.values()) {
  const ownerIds = [...owners.keys()];
  const isVerifiedAliasGroup = equivalentProblemGroups.some(
    (group) => ownerIds.every((id) => group.has(id))
  );
  if (owners.size > 1 && !isVerifiedAliasGroup) {
    failures.push(
      `Identical solution reused across unrelated entries: ${Array.from(owners.entries())
        .map(([id, title]) => `${title} [${id}]`)
        .join(" | ")}`
    );
  }
}

console.log(
  `Audited ${AT_ALGORITHMS.length} algorithms, ${approachCount} approaches, and ${implementationCount} implementations.`
);

if (failures.length) {
  console.error(`Catalog audit failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Catalog audit passed.");
}
