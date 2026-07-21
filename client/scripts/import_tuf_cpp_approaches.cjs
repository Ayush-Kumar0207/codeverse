const fs = require("fs");
const Module = require("module");
const path = require("path");
const { spawn } = require("child_process");
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
      resolveJsonModule: true,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  });
  module._compile(output.outputText, filename);
};

require.extensions[".json"] = function loadJson(module, filename) {
  module.exports = JSON.parse(fs.readFileSync(filename, "utf8"));
};

const { AT_ALGORITHMS } = require("../data/algos/index.ts");

const outputPath = path.resolve(__dirname, "../data/algos/generated_cpp_approaches.json");
const reportPath = path.resolve(__dirname, "../data/algos/tuf_cpp_source_report.json");
const sitemapUrl = "https://takeuforward.org/sitemap.xml";
const dryRun = process.argv.includes("--dry-run");
const fetchConcurrency = 5;
const compileConcurrency = 4;

const stopWords = new Set([
  "a", "an", "and", "algorithm", "algorithms", "by", "c",
  "cpp", "data", "dsa", "for", "from", "g", "given", "i",
  "in", "introduction", "java", "learn", "leetcode", "n", "of", "on",
  "or", "problem", "problems", "the", "to", "tutorial", "using", "with",
]);

const tokenAliases = new Map([
  ["ll", "linkedlist"],
  ["linked", "linkedlist"],
  ["linkedlist", "linkedlist"],
  ["bst", "binarysearchtree"],
  ["binarytree", "tree"],
  ["subarray", "subarray"],
  ["subarrays", "subarray"],
  ["subsequence", "subsequence"],
  ["subsequences", "subsequence"],
  ["occurrence", "occurrence"],
  ["occurrences", "occurrence"],
  ["traversals", "traversal"],
  ["weights", "weight"],
]);

const manualSlugs = {
  "best-time-to-buy-and-sell-stock": "stock-buy-and-sell-dp-35",
  "best-time-to-buy-and-sell-stock-ii": "buy-and-sell-stock-ii-dp-36",
  "best-time-to-buy-and-sell-stock-iii": "buy-and-sell-stock-iii-dp-37",
  "best-time-to-buy-and-sell-stock-iv": "buy-and-sell-stock-iv-dp-38",
  "best-time-to-buy-and-sell-stock-with-cooldown": "buy-and-sell-stocks-with-cooldown-dp-39",
  "best-time-to-buy-and-sell-stock-with-transaction-fee": "buy-and-sell-stocks-with-transaction-fees-dp-40",
  "cycle-detection-in-directed-graph": "detect-cycle-in-a-directed-graph-using-dfs-g-19",
  "largest-divisible-subset": "longest-divisible-subset-dp-44",
  "largest-rectangle-in-histogram": "largest-rectangle-in-histogram",
  "maximal-rectangle": "maximum-rectangle-area-with-all-1s-dp-on-rectangles-dp-55",
  "maximum-product-subarray": "maximum-product-subarray-in-an-array",
  "merge-intervals": "overlapping-intervals",
  "palindrome-partitioning-ii": "palindrome-partitioning-ii-front-partition-dp-53",
  "partition-array-for-maximum-sum": "partition-array-for-maximum-sum-front-partition-dp-54",
  "print-longest-increasing-subsequence": "printing-longest-increasing-subsequence-dp-42",
  "3-sum": "3-sum-find-triplets-that-add-up-to-a-zero",
  "4-sum": "4-sum-find-quads-that-add-up-to-a-target-value",
  "articulation-point": "articulation-point-in-graph-g-56",
  "balanced-binary-tree": "check-if-the-binary-tree-is-balanced-binary-tree",
  "binary-search": "binary-search-explained",
  "check-for-prime": "check-if-a-number-is-prime-or-not",
  "climbing-stairs": "dynamic-programming-climbing-stairs",
  "coin-change-2": "coin-change-2-dp-22",
  "course-schedule": "course-schedule-i-and-ii-pre-requisite-tasks-topological-sort-g-24",
  "dijkstra-s-algorithm": "dijkstras-algorithm-using-priority-queue-g-32",
  "disjoint-set-union-by-rank-size": "disjoint-set-union-by-rank-union-by-size-path-compression-g-46",
  "factorial-of-n-numbers": "factorial-of-a-number-iterative-and-recursive",
  "find-intersection-point-of-y-ll": "find-intersection-of-two-linked-lists",
  "find-the-duplicate-number": "find-the-duplicate-in-an-array-of-n1-integers",
  "iterative-inorder": "iterative-inorder-traversal-of-binary-tree",
  "kadanes-algorithm": "kadanes-algorithm-maximum-subarray-sum-in-an-array",
  "kosaraju-s-algorithm-strongly-connected-components": "kosarajus-algorithm-for-strongly-connected-componentsscc",
  "kruskal-s-algorithm": "kruskals-algorithm-minimum-spanning-tree-g-47",
  "longest-substring-without-repeating-characters": "length-of-longest-substring-without-any-repeating-character",
  "majority-element-n-2-times": "find-the-majority-element-that-occurs-more-than-n-2-times",
  "majority-element-n-3-times": "majority-elementsn-3-times-find-the-elements-that-appears-more-than-n-3-times-in-the-array",
  "middle-of-a-linkedlist": "find-middle-element-in-a-linked-list",
  "minimum-coins": "minimum-coins-dp-20",
  "n-queens": "n-queen-problem-return-all-distinct-solutions-to-the-n-queens-puzzle",
  "next-permutation": "next_permutation-find-next-lexicographically-greater-permutation",
  "pascal-s-triangle": "program-to-generate-pascals-triangle",
  "pow-x-n": "calculate-the-power-of-a-number-binary-exponentiation",
  "print-the-matrix-in-spiral-manner": "spiral-traversal-of-matrix",
  "recover-bst": "recover-bst-correct-bst-with-two-nodes-swapped",
  "remove-nth-node-from-the-back-of-the-ll": "remove-n-th-node-from-the-end-of-a-linked-list",
  "reverse-a-number": "reverse-digits-of-a-number",
  "reverse-nodes-in-k-group": "reverse-linked-list-in-groups-of-size-k",
  "search-in-rotated-sorted-array": "search-element-in-a-rotated-sorted-array",
  "search-in-rotated-sorted-array-i": "search-element-in-a-rotated-sorted-array",
  "search-in-rotated-sorted-array-ii": "search-element-in-a-rotated-sorted-array",
  "sieve-of-eratosthenes": "sieve-of-eratosthenes-find-all-prime-numbers",
  "subset-sum-equal-to-k": "subset-sum-equal-to-target-dp-14",
  "trapping-rain-water": "trapping-rainwater",
  "valid-anagram": "check-if-two-strings-are-anagrams-of-each-other",
  "valid-parentheses": "check-for-balanced-parentheses",
  "bfs": "breadth-first-searchbfs-level-order-traversal",
  "bipartite-graph": "bipartite-check-using-dfs-if-graph-is-bipartite",
  "check-if-a-tree-is-a-bst-or-not": "check-if-binary-tree-is-bst",
  "check-if-ll-is-palindrome-or-not": "check-if-given-linked-list-is-plaindrome",
  "find-the-starting-point-in-ll": "starting-point-of-loop-in-a-linked-list",
  "find-the-intersection-point-of-y-ll": "find-intersection-of-two-linked-lists",
  "find-the-nth-root-of-a-number": "nth-root-of-a-number-using-binary-search",
  "find-peak-element": "peak-element-in-array",
  "flattening-of-ll": "flattening-a-linked-list",
  "frog-jump": "dynamic-programming-frog-jump-dp-3",
  "gcd-or-hcf": "find-gcd-of-two-numbers",
  "house-robber": "dynamic-programming-house-robber-dp-6",
  "implement-trie": "implement-trie-1",
  "iterative-postorder-using-1-stack": "iterative-postorder-traversal-of-binary-tree-using-1-stack",
  "iterative-postorder-using-2-stacks": "iterative-postorder-traversal-of-binary-tree-using-2-stack",
  "iterative-preorder": "iterative-preorder-traversal-of-binary-tree",
  "kahn-s-algorithm": "kahns-algorithm-topological-sort-algorithm-bfs-g-22",
  "kth-smallest-element-in-a-bst": "kth-largest-smallest-element-in-binary-search-tree",
  "largest-subarray-with-0-sum": "length-of-the-longest-subarray-with-zero-sum",
  "lca-in-binary-tree": "lowest-common-ancestor-for-two-given-nodes",
  "linked-list-cycle": "detect-a-cycle-in-a-linked-list",
  "maximum-path-sum": "maximum-sum-path-in-binary-tree",
  "min-stack": "implement-min-stack-o2n-and-on-space-complexity",
  "move-zeroes-to-end": "move-all-zeros-to-the-end-of-the-array",
  "ninja-s-training": "dynamic-programming-ninjas-training-dp-7",
  "partition-a-set-into-two-subsets-with-minimum-absolute-sum-difference": "partition-set-into-2-subsets-with-min-absolute-sum-diff-dp-16",
  "postorder-traversal": "preorder-inorder-postorder-traversals-in-one-traversal",
  "power-of-2": "power-of-two",
  "prim-s-algorithm": "prims-algorithm-minimum-spanning-tree-c-and-java-g-45",
  "root-to-node-path": "print-root-to-node-path-in-a-binary-tree",
  "rotting-oranges": "rotten-oranges-min-time-to-rot-all-oranges-bfs",
  "search-in-a-bst": "search-in-a-binary-search-tree-2",
  "symmetric-binary-tree": "check-for-symmetrical-binary-tree",
  "undirected-cycle-detection": "cycle-detection-in-undirected-graph-using-dfs",
  "two-sum": "two-sum-check-if-a-pair-with-given-sum-exists-in-array",
};

function decodeEntities(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function stripHtml(value) {
  return decodeEntities(
    value
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<\/p>|<\/li>|<\/h\d>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[\t ]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function tokens(value) {
  return value
    .toLowerCase()
    .replace(/\b0[1i]\b/g, "01")
    .replace(/\bnth\b/g, "n")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((token) => tokenAliases.get(token) || token)
    .filter((token) => token && !stopWords.has(token) && !/^\d+$/.test(token));
}

function jaccard(left, right) {
  const a = new Set(tokens(left));
  const b = new Set(tokens(right));
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const token of a) if (b.has(token)) common += 1;
  return common / (a.size + b.size - common);
}

function levenshtein(left, right) {
  const a = left.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const b = right.replace(/[^a-z0-9]/gi, "").toLowerCase();
  if (!a.length || !b.length) return 0;
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const previous = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      diagonal = previous;
    }
  }
  return 1 - row[b.length] / Math.max(a.length, b.length);
}

function normalizedSlug(url) {
  return new URL(url).pathname
    .split("/")
    .filter(Boolean)
    .at(-1)
    .replace(/-(?:dp|g)-?\d+(?:-.*)?$/i, "")
    .replace(/-(?:tutorial|leetcode)$/i, "");
}

function matchScore(algorithm, url) {
  const slug = normalizedSlug(url);
  if (algorithm.id === "coin-change" && slug.startsWith("coin-change-2")) return 0;
  const idSimilarity = levenshtein(algorithm.id, slug);
  const titleSimilarity = levenshtein(algorithm.title, slug);
  const tokenSimilarity = Math.max(jaccard(algorithm.id, slug), jaccard(algorithm.title, slug));
  const containment = slug.includes(algorithm.id) || algorithm.id.includes(slug) ? 1 : 0;
  const algorithmTokens = new Set(tokens(`${algorithm.id} ${algorithm.title}`));
  const slugTokens = new Set(tokens(slug));
  const structuralMarkers = ["linkedlist", "array", "matrix", "string", "tree", "graph"];
  const requiredStructure = structuralMarkers.find((marker) => algorithmTokens.has(marker));
  const structuralPenalty = requiredStructure && !slugTokens.has(requiredStructure) ? 0.2 : 1;
  const semanticMarkers = ["odd", "prime"];
  const requiredSemantic = semanticMarkers.find((marker) => algorithmTokens.has(marker));
  const semanticPenalty = requiredSemantic && !slugTokens.has(requiredSemantic) ? 0.15 : 1;
  return (tokenSimilarity * 0.48 + Math.max(idSimilarity, titleSimilarity) * 0.37 + containment * 0.15)
    * structuralPenalty
    * semanticPenalty;
}

function decodeFlightStream(html) {
  let decoded = "";
  const pattern = /self\.__next_f\.push\(\[1,("(?:\\.|[^"\\])*")\]\)<\/script>/g;
  for (const match of html.matchAll(pattern)) {
    try {
      decoded += JSON.parse(match[1]);
    } catch {}
  }
  return decoded;
}

function stripCppComments(source) {
  let output = "";
  let index = 0;
  let mode = "code";
  let quote = "";
  while (index < source.length) {
    const current = source[index];
    const next = source[index + 1];
    if (mode === "code") {
      if (current === '"' || current === "'") {
        mode = "string";
        quote = current;
        output += current;
        index += 1;
      } else if (current === "/" && next === "/") {
        mode = "line";
        index += 2;
      } else if (current === "/" && next === "*") {
        mode = "block";
        index += 2;
      } else {
        output += current;
        index += 1;
      }
    } else if (mode === "string") {
      output += current;
      if (current === "\\" && index + 1 < source.length) {
        output += source[index + 1];
        index += 2;
      } else {
        if (current === quote) mode = "code";
        index += 1;
      }
    } else if (mode === "line") {
      if (current === "\n") {
        output += "\n";
        mode = "code";
      }
      index += 1;
    } else {
      if (current === "*" && next === "/") {
        mode = "code";
        index += 2;
      } else {
        if (current === "\n") output += "\n";
        index += 1;
      }
    }
  }
  return output;
}

function cleanCpp(source) {
  let seenBits = false;
  let seenNamespace = false;
  const lines = stripCppComments(decodeEntities(source.replace(/\r\n/g, "\n")))
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (trimmed === "#include <bits/stdc++.h>") {
        if (seenBits) return false;
        seenBits = true;
      }
      if (trimmed === "using namespace std;") {
        if (seenNamespace) return false;
        seenNamespace = true;
      }
      return true;
    });
  return lines.join("\n").replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}

function approachTier(name, topic = "") {
  const normalized = name.toLowerCase();
  const dynamicProgramming = /dynamic programming|\bdp\b/i.test(topic);
  if (normalized.includes("space optim")) return "optimal";
  if (normalized.includes("brute") || normalized.includes("naive")) return "brute";
  if (normalized.includes("better") || normalized.includes("memoization") || normalized.includes("memoized")) return "better";
  if (dynamicProgramming && (normalized.includes("recursion") || normalized.includes("recursive"))) return "brute";
  if (dynamicProgramming && (normalized.includes("tabulation") || normalized.includes("bottom-up"))) return "better";
  if (normalized.includes("optimal") || normalized.includes("optimized")) return "optimal";
  return "";
}

function complexity(section, label) {
  const text = stripHtml(section);
  const start = text.search(new RegExp(`${label}\\s*complexity`, "i"));
  if (start < 0) return "Not stated";
  const tail = text.slice(start, start + 500);
  const bigO = tail.match(/O\s*\([^\n.;]{1,80}\)/i);
  return bigO ? bigO[0].replace(/\s+/g, " ") : "Not stated";
}

function descriptionFor(algorithm, tier, heading) {
  if (tier === "brute") {
    return `Build a correctness baseline for ${algorithm.title} by directly enumerating the candidate states allowed by the problem. This version prioritizes transparent control flow and exhaustive coverage over asymptotic efficiency.`;
  }
  if (tier === "better") {
    return `Reduce repeated work in ${algorithm.title} with the intermediate structure or cached state used by the standard better approach. It preserves the brute-force reasoning while improving one major time or space bottleneck.`;
  }
  return `Apply the ${heading.replace(/\s*approach\s*/i, "").trim() || "alternative"} strategy for ${algorithm.title}. This is a distinct, source-verified implementation retained only after standalone compilation.`;
}

function splitParameters(value) {
  const parameters = [];
  let start = 0;
  let angleDepth = 0;
  let bracketDepth = 0;
  for (let index = 0; index <= value.length; index += 1) {
    const character = value[index];
    if (character === "<") angleDepth += 1;
    else if (character === ">") angleDepth = Math.max(0, angleDepth - 1);
    else if (character === "[") bracketDepth += 1;
    else if (character === "]") bracketDepth = Math.max(0, bracketDepth - 1);
    else if ((character === "," || index === value.length) && angleDepth === 0 && bracketDepth === 0) {
      const parameter = value.slice(start, index).trim();
      if (parameter && parameter !== "void") parameters.push(parameter);
      start = index + 1;
    }
  }
  return parameters;
}

function sampleArgument(parameter, index) {
  const withoutDefault = parameter.replace(/\s*=.*$/, "").trim();
  const arrayMatch = withoutDefault.match(/^(.*?\b)([A-Za-z_]\w*)\s*\[\s*\]$/);
  if (arrayMatch) {
    const type = arrayMatch[1].replace(/\bconst\b/g, "").trim();
    return { declaration: `${type} sample${index}[] = {1, 2, 3};`, expression: `sample${index}` };
  }
  const nameMatch = withoutDefault.match(/([A-Za-z_]\w*)\s*$/);
  if (!nameMatch) return null;
  const type = withoutDefault
    .slice(0, nameMatch.index)
    .replace(/\bconst\b/g, "")
    .replace(/[&\s]+$/g, "")
    .trim();
  const variable = `sample${index}`;
  if (!type) return null;
  if (/vector\s*<\s*vector\s*<\s*(?:int|long long|double)\s*>\s*>/.test(type)) {
    return { declaration: `${type} ${variable} = {{1, 2}, {3, 4}};`, expression: variable };
  }
  if (/vector\s*<\s*string\s*>/.test(type)) {
    return { declaration: `${type} ${variable} = {"a", "b"};`, expression: variable };
  }
  if (/vector\s*<\s*char\s*>/.test(type)) {
    return { declaration: `${type} ${variable} = {'a', 'b'};`, expression: variable };
  }
  if (/vector\s*</.test(type)) {
    return { declaration: `${type} ${variable} = {1, 2, 3};`, expression: variable };
  }
  if (/string/.test(type)) {
    return { declaration: `${type} ${variable} = "abc";`, expression: variable };
  }
  if (/char/.test(type)) {
    return { declaration: `${type} ${variable} = 'a';`, expression: variable };
  }
  if (/double|float/.test(type)) {
    return { declaration: `${type} ${variable} = 2.0;`, expression: variable };
  }
  if (/bool/.test(type)) {
    return { declaration: `${type} ${variable} = true;`, expression: variable };
  }
  if (/\*/.test(type)) {
    return { declaration: `${type} ${variable} = nullptr;`, expression: variable };
  }
  if (/\b(?:int|long|short|size_t)\b/.test(type)) {
    return { declaration: `${type} ${variable} = 3;`, expression: variable };
  }
  return { declaration: `${type} ${variable}{};`, expression: variable };
}

function ensureRunnableMain(input) {
  if (/\bint\s+main\s*\(/.test(input)) return input;
  let code = input;
  if (!/^\s*#include\s*</m.test(code)) code = `#include <bits/stdc++.h>\n${code}`;
  if (!/\busing\s+namespace\s+std\s*;/.test(code)) {
    const includeEnd = code.lastIndexOf("#include");
    const lineEnd = includeEnd >= 0 ? code.indexOf("\n", includeEnd) : -1;
    code = lineEnd >= 0
      ? `${code.slice(0, lineEnd + 1)}using namespace std;\n${code.slice(lineEnd + 1)}`
      : `using namespace std;\n${code}`;
  }

  const classMatch = code.match(/class\s+Solution\s*\{([\s\S]*?)\n?\};/);
  let searchRegion = classMatch?.[1] || code;
  if (classMatch) {
    const publicIndex = searchRegion.indexOf("public:");
    if (publicIndex >= 0) searchRegion = searchRegion.slice(publicIndex + "public:".length);
    const privateIndex = searchRegion.search(/\bprivate\s*:/);
    if (privateIndex >= 0) searchRegion = searchRegion.slice(0, privateIndex);
  }

  const methodPattern = /^\s*(?!if\b|for\b|while\b|switch\b)([A-Za-z_][\w:<>,\s*&]*?)\s+([A-Za-z_]\w*)\s*\(([^(){};]*)\)\s*(?:const\s*)?\{/gm;
  const methods = [...searchRegion.matchAll(methodPattern)].filter((match) =>
    !["main", "if", "for", "while", "switch"].includes(match[2])
  );
  const method = methods.find((match) => !/^(?:dfs|bfs|solve|helper|recur|backtrack)$/i.test(match[2])) || methods[0];
  if (!method) return null;

  const returnType = method[1].replace(/\b(?:public|private|protected)\s*:/g, "").trim();
  const methodName = method[2];
  const parameters = splitParameters(method[3]);
  const samples = parameters.map(sampleArgument);
  if (samples.some((sample) => !sample)) return null;
  const declarations = samples.map((sample) => `    ${sample.declaration}`).join("\n");
  const argumentsList = samples.map((sample) => sample.expression).join(", ");
  const target = classMatch ? `solution.${methodName}` : methodName;
  const invocation = /\bvoid\b/.test(returnType)
    ? `    ${target}(${argumentsList});`
    : `    auto result = ${target}(${argumentsList});\n    (void)result;`;
  const construction = classMatch ? "    Solution solution;\n" : "";
  return `${code.trim()}\n\nint main() {\n${construction}${declarations ? `${declarations}\n` : ""}${invocation}\n    cout << "approach executed\\n";\n    return 0;\n}`;
}

function extractCppApproaches(html, algorithm, url) {
  const stream = decodeFlightStream(html);
  if (!stream) return [];

  const headings = [];
  const headingPattern = /<summary class="main-summary">[\s\S]{0,900}?<span>([\s\S]*?)<\/span>/gi;
  for (const match of stream.matchAll(headingPattern)) {
    const name = stripHtml(match[1]);
    if (/approach/i.test(name)) headings.push({ index: match.index, name });
  }

  const codes = [];
  const codePattern = /<div class="code-block[^>]*data-lang="cpp"[^>]*>[\s\S]*?<code[^>]*>([\s\S]*?)<\/code>/gi;
  for (const match of stream.matchAll(codePattern)) {
    const headingIndex = headings.findLastIndex((item) => item.index < match.index);
    if (headingIndex < 0) continue;
    const heading = headings[headingIndex];
    const nextHeading = headings[headingIndex + 1]?.index ?? stream.length;
    if (match.index > nextHeading) continue;
    const tier = approachTier(heading.name, algorithm.topic);
    if (!tier) continue;
    const code = ensureRunnableMain(cleanCpp(match[1]));
    if (!code) continue;
    const section = stream.slice(match.index + match[0].length, nextHeading);
    codes.push({
      name: tier === "brute" ? "Brute Force" : tier === "better" ? "Better" : "Optimal",
      description: descriptionFor(algorithm, tier, heading.name),
      timeComplexity: complexity(section, "time"),
      spaceComplexity: complexity(section, "space"),
      code,
      sourceUrl: url,
      sourceApproach: heading.name,
    });
  }

  const seen = new Set();
  return codes.filter((candidate) => {
    const tier = approachTier(candidate.name);
    const signature = candidate.code.replace(/\s+/g, "");
    if (seen.has(tier) || seen.has(signature)) return false;
    seen.add(tier);
    seen.add(signature);
    return true;
  });
}

async function fetchText(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "CodeVerse-catalog-audit/1.0" },
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw lastError;
}

async function mapConcurrent(items, concurrency, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

function compileSource(compiler, candidate) {
  return new Promise((resolve) => {
    const child = spawn(compiler, ["-std=c++17", "-x", "c++", "-fsyntax-only", "-"], {
      stdio: ["pipe", "ignore", "pipe"],
      windowsHide: true,
    });
    let stderr = "";
    const timeout = setTimeout(() => child.kill(), 20000);
    child.stderr.on("data", (chunk) => {
      if (stderr.length < 4000) stderr += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timeout);
      resolve({ ...candidate, compileError: error.message });
    });
    child.on("close", (status, signal) => {
      clearTimeout(timeout);
      resolve(status === 0 ? candidate : {
        ...candidate,
        compileError: signal || stderr.replace(/\r/g, "").trim().slice(0, 1000) || `exit ${status}`,
      });
    });
    child.stdin.end(candidate.approach.code);
  });
}

async function main() {
  const sitemap = await fetchText(sitemapUrl);
  const urls = [...sitemap.matchAll(/<loc>(https:\/\/takeuforward\.org\/data-structure\/[^<]+)<\/loc>/g)]
    .map((match) => match[1]);
  const bySlug = new Map(urls.map((url) => [new URL(url).pathname.split("/").filter(Boolean).at(-1), url]));

  const matches = AT_ALGORITHMS.map((algorithm) => {
    const manual = manualSlugs[algorithm.id];
    if (manual && bySlug.has(manual)) return { algorithm, url: bySlug.get(manual), score: 1, manual: true };
    const ranked = urls
      .map((url) => ({ url, score: matchScore(algorithm, url) }))
      .sort((left, right) => right.score - left.score);
    return {
      algorithm,
      url: ranked[0]?.url,
      score: ranked[0]?.score || 0,
      margin: (ranked[0]?.score || 0) - (ranked[1]?.score || 0),
      manual: false,
    };
  });

  const acceptedMatches = matches.filter((match) => match.score >= 0.56 && (match.manual || match.margin >= 0.025));
  const unmatched = matches.filter((match) => !acceptedMatches.includes(match));
  console.log(`Matched ${acceptedMatches.length}/${AT_ALGORITHMS.length} catalog entries to ${urls.length} public articles.`);
  console.log(`Unmatched or ambiguous: ${unmatched.length}.`);
  if (dryRun) {
    for (const match of unmatched.slice(0, 120)) {
      console.log(`- ${match.algorithm.id}: ${match.score.toFixed(3)} -> ${match.url || "none"}`);
    }
    return;
  }

  const pageCache = new Map();
  let fetched = 0;
  const extracted = await mapConcurrent(acceptedMatches, fetchConcurrency, async (match) => {
    try {
      let html = pageCache.get(match.url);
      if (!html) {
        html = await fetchText(match.url);
        pageCache.set(match.url, html);
      }
      fetched += 1;
      if (fetched % 25 === 0) console.log(`Fetched ${fetched}/${acceptedMatches.length} matched articles...`);
      return extractCppApproaches(html, match.algorithm, match.url).map((approach) => ({
        algorithm: match.algorithm,
        approach,
      }));
    } catch (error) {
      return [{ algorithm: match.algorithm, fetchError: error.message, sourceUrl: match.url }];
    }
  });

  const candidates = extracted.flat().filter((item) => item.approach);
  const compiler = "C:\\MinGW\\bin\\g++.exe";
  if (!fs.existsSync(compiler)) throw new Error(`Compiler not found: ${compiler}`);
  console.log(`Compiling ${candidates.length} extracted standalone programs...`);
  const compiled = await mapConcurrent(candidates, compileConcurrency, (candidate) =>
    compileSource(compiler, candidate)
  );
  const valid = compiled.filter((candidate) => !candidate.compileError);
  const compileFailures = compiled.filter((candidate) => candidate.compileError);

  const generated = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  const previousReport = fs.existsSync(reportPath)
    ? JSON.parse(fs.readFileSync(reportPath, "utf8"))
    : {};
  let added = 0;
  const sourceRows = [...(previousReport.acceptedSources || [])];
  for (const candidate of valid) {
    const id = candidate.algorithm.id;
    const existing = generated[id] || [];
    const tier = approachTier(candidate.approach.name);
    const existingTiers = new Set(existing.map((approach) => approachTier(approach.name) || "optimal"));
    if (existingTiers.has(tier)) continue;
    const signature = candidate.approach.code.replace(/\s+/g, "");
    if (existing.some((approach) => approach.code.replace(/\s+/g, "") === signature)) continue;
    existing.push(candidate.approach);
    generated[id] = existing;
    sourceRows.push({
      algorithmId: id,
      approach: candidate.approach.name,
      sourceApproach: candidate.approach.sourceApproach,
      sourceUrl: candidate.approach.sourceUrl,
    });
    added += 1;
  }

  for (const approaches of Object.values(generated)) {
    approaches.sort((left, right) => {
      const rank = { brute: 0, better: 1, optimal: 2 };
      return (rank[approachTier(left.name)] ?? 1.5) - (rank[approachTier(right.name)] ?? 1.5);
    });
  }

  fs.writeFileSync(outputPath, `${JSON.stringify(generated, null, 2)}\n`);
  fs.writeFileSync(reportPath, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: sitemapUrl,
    matched: acceptedMatches.length,
    unmatched: unmatched.map((match) => ({
      algorithmId: match.algorithm.id,
      score: Number(match.score.toFixed(3)),
      candidateUrl: match.url,
    })),
    added: sourceRows.length,
    newlyAdded: added,
    acceptedSources: sourceRows,
    rejectedAfterSemanticAudit: previousReport.rejectedAfterSemanticAudit || [],
    compileFailures: [
      ...(previousReport.compileFailures || []),
      ...compileFailures.map((candidate) => ({
      algorithmId: candidate.algorithm.id,
      approach: candidate.approach.name,
      sourceUrl: candidate.approach.sourceUrl,
        error: candidate.compileError,
      })),
    ],
  }, null, 2)}\n`);

  console.log(`Accepted ${valid.length}/${candidates.length} extracted programs after compilation.`);
  console.log(`Added ${added} genuinely distinct approach tiers.`);
  console.log(`Source report: ${path.relative(process.cwd(), reportPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
