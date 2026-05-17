import type { AlgorithmEntry } from "./types";

type VisualFamily =
  | "array"
  | "two-pointers"
  | "sliding-window"
  | "binary-search"
  | "prefix"
  | "sorting"
  | "matrix"
  | "dynamic-programming"
  | "graph"
  | "tree"
  | "linked-list"
  | "stack-queue"
  | "heap"
  | "recursion"
  | "trie"
  | "bit"
  | "string"
  | "math"
  | "greedy";

type TraceState = Record<string, unknown>;
type SpecificTrace = {
  family: VisualFamily;
  steps: TraceState[];
};

export function completeAlgorithmVisualizers(algorithms: AlgorithmEntry[]): AlgorithmEntry[] {
  return algorithms.map((algorithm) => ({
    ...algorithm,
    visualizerCode: buildVisualizerCode(algorithm),
  }));
}

function buildVisualizerCode(algorithm: AlgorithmEntry) {
  const specific = specificTraceFor(algorithm);
  const family = specific?.family || detectVisualFamily(algorithm);
  const approach = algorithm.approaches[0];
  const steps = enrichTrace(specific?.steps || buildTrace(algorithm, family), algorithm);
  const payload = {
    id: algorithm.id,
    title: algorithm.title,
    topic: algorithm.topic,
    difficulty: algorithm.difficulty,
    family: familyLabel(family),
    timeComplexity: approach?.timeComplexity || "O(N)",
    spaceComplexity: approach?.spaceComplexity || "O(1)",
    simulationProfile: specific ? "Algorithm-specific trace" : "Pattern trace customized for this algorithm",
  };

  return [
    "// CodeVerse generated visual simulation.",
    "// Run this file in AlgoTrace to watch the algorithm move one decision at a time.",
    `const algorithm = ${JSON.stringify(payload, null, 2)};`,
    `const trace = ${JSON.stringify(steps, null, 2)};`,
    "",
    "for (const state of trace) {",
    "  recordTrace({ algorithm, ...state });",
    "}",
  ].join("\n");
}

function buildTrace(algorithm: AlgorithmEntry, family: VisualFamily): TraceState[] {
  switch (family) {
    case "two-pointers":
      return twoPointerTrace(algorithm);
    case "sliding-window":
      return slidingWindowTrace(algorithm);
    case "binary-search":
      return binarySearchTrace(algorithm);
    case "prefix":
      return prefixTrace(algorithm);
    case "sorting":
      return sortingTrace(algorithm);
    case "matrix":
      return matrixTrace(algorithm);
    case "dynamic-programming":
      return dynamicProgrammingTrace(algorithm);
    case "graph":
      return graphTrace(algorithm);
    case "tree":
      return treeTrace(algorithm);
    case "linked-list":
      return linkedListTrace(algorithm);
    case "stack-queue":
      return stackQueueTrace(algorithm);
    case "heap":
      return heapTrace(algorithm);
    case "recursion":
      return recursionTrace(algorithm);
    case "trie":
      return trieTrace(algorithm);
    case "bit":
      return bitTrace(algorithm);
    case "string":
      return stringTrace(algorithm);
    case "math":
      return mathTrace(algorithm);
    case "greedy":
      return greedyTrace(algorithm);
    default:
      return arrayTrace(algorithm);
  }
}

function base(
  algorithm: AlgorithmEntry,
  family: VisualFamily,
  step: number,
  totalSteps: number,
  phase: string,
  headline: string,
  narrative: string,
  extra: TraceState = {}
): TraceState {
  return {
    visualizer: "CodeVerse Universal Trace",
    kind: family,
    step,
    totalSteps,
    progress: Math.round((step / totalSteps) * 100),
    phase,
    headline,
    narrative,
    beginnerPrompt: beginnerPrompt(family),
    invariant: invariantFor(family),
    focus: focusFor(family),
    ...extra,
  };
}

function specificTraceFor(algorithm: AlgorithmEntry): SpecificTrace | null {
  const id = algorithm.id;
  const text = normalize(`${algorithm.id} ${algorithm.title} ${algorithm.topic} ${algorithm.category}`);

  if (id === "sort-an-array-of-0-s-1-s-and-2-s" || match(text, ["sort colors", "sort 0s 1s 2s"])) {
    return { family: "sorting", steps: sortColorsTrace(algorithm) };
  }
  if (id === "two-sum") return { family: "two-pointers", steps: twoSumTrace(algorithm) };
  if (id === "kadanes-algorithm" || match(text, ["maximum subarray", "kadane"])) {
    return { family: "array", steps: kadaneTrace(algorithm) };
  }
  if (id === "subarray-sum-equals-k") return { family: "prefix", steps: subarraySumEqualsKTrace(algorithm) };
  if (id === "merge-intervals") return { family: "greedy", steps: mergeIntervalsTrace(algorithm) };
  if (id === "next-permutation") return { family: "array", steps: nextPermutationTrace(algorithm) };
  if (id === "find-the-duplicate-number") return { family: "array", steps: findDuplicateTrace(algorithm) };
  if (id === "majority-element-n-2-times" || match(text, ["majority element n 2", "majority element n 2 times"])) {
    return { family: "array", steps: majorityElementTrace(algorithm) };
  }
  if (id === "best-time-to-buy-and-sell-stock") return { family: "greedy", steps: stockProfitTrace(algorithm) };
  if (id === "rearrange-array-elements-by-sign") return { family: "array", steps: rearrangeBySignTrace(algorithm) };
  if (id === "leaders-in-an-array") return { family: "array", steps: leadersTrace(algorithm) };
  if (id === "longest-consecutive-sequence") return { family: "prefix", steps: longestConsecutiveTrace(algorithm) };
  if (id === "set-matrix-zeroes") return { family: "matrix", steps: setMatrixZeroesTrace(algorithm) };
  if (id === "rotate-matrix-by-90-degrees") return { family: "matrix", steps: rotateMatrixTrace(algorithm) };
  if (id === "print-the-matrix-in-spiral-manner" || match(text, ["spiral matrix"])) return { family: "matrix", steps: spiralMatrixTrace(algorithm) };
  if (id === "pascal-s-triangle") return { family: "dynamic-programming", steps: pascalTriangleTrace(algorithm) };
  if (id === "3-sum" || match(text, ["3 sum", "three sum"])) return { family: "two-pointers", steps: threeSumTrace(algorithm) };

  return null;
}

function enrichTrace(steps: TraceState[], algorithm: AlgorithmEntry): TraceState[] {
  const approach = algorithm.approaches[0];
  const implementationFocus = codeFocusFor(algorithm);
  const lens = `${algorithm.title}: ${algorithm.overview}`;

  return steps.map((step, index) => {
    const variables = isRecord(step.variables) ? step.variables : {};
    return {
      simulationId: `${algorithm.id}:step-${index + 1}`,
      problemLens: lens,
      implementationFocus,
      ...step,
      variables: {
        approach: approach?.name || "Selected approach",
        ...variables,
      },
    };
  });
}

function codeFocusFor(algorithm: AlgorithmEntry) {
  const id = algorithm.id;
  if (id === "sort-an-array-of-0-s-1-s-and-2-s") return "while (mid <= high) { if 0 swap low; if 1 advance; if 2 swap high; }";
  if (id === "two-sum") return "while (left < right) compare nums[left] + nums[right] with target";
  if (id === "kadanes-algorithm") return "currentSum = max(num, currentSum + num); maxSum = max(maxSum, currentSum)";
  if (id === "subarray-sum-equals-k") return "answer += prefixCount[currentSum - k]; prefixCount[currentSum]++";
  if (id === "merge-intervals") return "if current.start <= last.end, stretch last.end; otherwise append a new interval";
  if (id === "next-permutation") return "find pivot from the right, swap with successor, then reverse the suffix";
  if (id === "find-the-duplicate-number") return "slow = nums[slow]; fast = nums[nums[fast]]; then reset slow to find cycle entry";
  if (id === "majority-element-n-2-times") return "if count == 0 choose candidate; matching values increment, others decrement";
  if (id === "best-time-to-buy-and-sell-stock") return "minPrice = min(minPrice, price); best = max(best, price - minPrice)";
  if (id === "rearrange-array-elements-by-sign") return "positive values fill even slots; negative values fill odd slots";
  if (id === "leaders-in-an-array") return "scan right to left and record values greater than maxRight";
  if (id === "longest-consecutive-sequence") return "only expand x when x - 1 is missing from the set";
  if (id === "set-matrix-zeroes") return "first row and first column store row/column zero markers";
  if (id === "rotate-matrix-by-90-degrees") return "transpose across the diagonal, then reverse each row";
  if (id === "print-the-matrix-in-spiral-manner") return "walk top row, right column, bottom row, left column; shrink boundaries";
  if (id === "pascal-s-triangle") return "row[j] = previousRow[j - 1] + previousRow[j]";
  if (id === "3-sum") return "sort, fix i, then run two pointers for the remaining target";
  return `${algorithm.title} - ${algorithm.approaches[0]?.name || "Approach"}: watch the active state update that preserves the invariant`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function sortColorsTrace(algorithm: AlgorithmEntry): TraceState[] {
  return [
    base(algorithm, "sorting", 1, 6, "Initialize zones", "Set low, mid, and high around the unknown region.", "Everything before low will become 0, everything after high will become 2, and mid inspects the unknown middle.", {
      values: [2, 0, 2, 1, 1, 0],
      pointers: [
        { label: "low", index: 0, tone: "cyan" },
        { label: "mid", index: 0, tone: "amber" },
        { label: "high", index: 5, tone: "violet" },
      ],
      window: { left: 0, right: 5 },
      variables: { low: 0, mid: 0, high: 5, zones: "0s | 1s | unknown | 2s" },
      decision: "mid sees 2, so that value belongs on the high side.",
    }),
    base(algorithm, "sorting", 2, 6, "Swap 2 right", "Swap nums[mid] with nums[high], then shrink high.", "mid stays in place because the value swapped in from high has not been inspected yet.", {
      values: [0, 0, 2, 1, 1, 2],
      pointers: [
        { label: "low", index: 0, tone: "cyan" },
        { label: "mid", index: 0, tone: "amber" },
        { label: "high", index: 4, tone: "violet" },
      ],
      window: { left: 0, right: 4 },
      solution: [5],
      variables: { swap: "nums[0] <-> nums[5]", high: 4, midStayed: true },
      decision: "The rightmost 2 is finalized; re-check index 0.",
    }),
    base(algorithm, "sorting", 3, 6, "Place first 0", "mid now sees 0, so swap with low and advance both low and mid.", "A 0 is safe on the left because all earlier positions are the zero zone.", {
      values: [0, 0, 2, 1, 1, 2],
      pointers: [
        { label: "low", index: 1, tone: "cyan" },
        { label: "mid", index: 1, tone: "amber" },
        { label: "high", index: 4, tone: "violet" },
      ],
      window: { left: 1, right: 4 },
      solution: [0, 5],
      variables: { action: "swap with low, low++, mid++", zeroZone: "0..0" },
      decision: "Index 0 is finalized as a 0.",
    }),
    base(algorithm, "sorting", 4, 6, "Place second 0", "The next mid value is also 0, so it joins the zero zone.", "low and mid move together because the swapped-in value is from the already-checked one-zone boundary.", {
      values: [0, 0, 2, 1, 1, 2],
      pointers: [
        { label: "low", index: 2, tone: "cyan" },
        { label: "mid", index: 2, tone: "amber" },
        { label: "high", index: 4, tone: "violet" },
      ],
      window: { left: 2, right: 4 },
      solution: [0, 1, 5],
      variables: { zeroZone: "0..1", oneZone: "empty", unknown: "2..4", twoZone: "5..5" },
      decision: "Both 0s are now locked to the left.",
    }),
    base(algorithm, "sorting", 5, 6, "Resolve middle", "mid sees 2, swaps it with high, then the incoming 1 is accepted by moving mid.", "This is the key Dutch Flag detail: 2-swaps do not advance mid until the replacement has been inspected.", {
      values: [0, 0, 1, 1, 2, 2],
      pointers: [
        { label: "low", index: 2, tone: "cyan" },
        { label: "mid", index: 4, tone: "amber" },
        { label: "high", index: 3, tone: "violet" },
      ],
      solution: [0, 1, 2, 3, 4, 5],
      variables: { swap: "nums[2] <-> nums[4]", acceptedOnes: "2..3", high: 3 },
      decision: "mid crossed high, so the unknown region is empty.",
    }),
    base(algorithm, "sorting", 6, 6, "Finished in place", "The array is partitioned into 0s, then 1s, then 2s.", "No counting array, no library sort, and no extra output array was needed.", {
      values: [0, 0, 1, 1, 2, 2],
      solution: [0, 1, 2, 3, 4, 5],
      variables: { finalZones: "0s: 0..1, 1s: 2..3, 2s: 4..5", extraSpace: "constant" },
      decision: "Return after the single scan.",
    }),
  ];
}

function twoSumTrace(algorithm: AlgorithmEntry): TraceState[] {
  return twoPointerTrace(algorithm);
}

function kadaneTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  return [
    base(algorithm, "array", 1, 6, "Start running sum", "Initialize the best answer and the current subarray at the first value.", "Kadane's algorithm asks at every index: should I extend the previous subarray or start fresh here?", {
      values,
      pointers: [{ label: "i", index: 0, tone: "cyan" }],
      window: { left: 0, right: 0 },
      variables: { currentSum: -2, bestSum: -2 },
      decision: "The first value is the only subarray we know so far.",
    }),
    base(algorithm, "array", 2, 6, "Fresh start", "At value 1, extending -2 would make the sum worse, so start a new subarray.", "A negative carry hurts every future extension, so dropping it is safe.", {
      values,
      pointers: [{ label: "i", index: 1, tone: "emerald" }],
      window: { left: 1, right: 1 },
      retired: [0],
      variables: { extend: -1, startFresh: 1, currentSum: 1, bestSum: 1 },
      decision: "Choose max(1, -2 + 1) = 1.",
    }),
    base(algorithm, "array", 3, 6, "Absorb a dip", "The -3 lowers the current sum, but the best answer remains 1.", "A bad element can be part of a future best only if the running total stays useful.", {
      values,
      pointers: [{ label: "i", index: 2, tone: "rose" }],
      window: { left: 1, right: 2 },
      variables: { currentSum: -2, bestSum: 1 },
      decision: "The best record does not change.",
    }),
    base(algorithm, "array", 4, 6, "New strong segment", "At 4, starting fresh beats extending the negative sum.", "This begins the subarray that will eventually become the answer.", {
      values,
      pointers: [{ label: "i", index: 3, tone: "emerald" }],
      window: { left: 3, right: 3 },
      retired: [0, 1, 2],
      variables: { startFresh: 4, currentSum: 4, bestSum: 4 },
      decision: "Reset the window start to index 3.",
    }),
    base(algorithm, "array", 5, 6, "Extend while positive", "The segment 4, -1, 2, 1 grows to sum 6.", "Even though -1 is negative, the running total after it stays positive, so it is worth carrying forward.", {
      values,
      pointers: [{ label: "i", index: 6, tone: "emerald" }],
      window: { left: 3, right: 6 },
      solution: [3, 4, 5, 6],
      variables: { currentSum: 6, bestSum: 6, bestSubarray: "[4, -1, 2, 1]" },
      decision: "Update the global best to 6.",
    }),
    base(algorithm, "array", 6, 6, "Return record", "Later values cannot beat the recorded sum, so return the best seen.", "Kadane separates the live candidate from the global record, which is why a later dip cannot erase the answer.", {
      values,
      pointers: [{ label: "end", index: 8, tone: "cyan" }],
      solution: [3, 4, 5, 6],
      variables: { answer: 6 },
      decision: "Return maxSum.",
    }),
  ];
}

function subarraySumEqualsKTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [1, 2, 3, -2, 5];
  return [
    base(algorithm, "prefix", 1, 5, "Seed prefix map", "Store prefix sum 0 once before scanning.", "That empty prefix lets a subarray starting at index 0 count correctly.", {
      values,
      target: 3,
      variables: { prefix: 0, count: 0, needed: "prefix - k" },
      memory: { "0": 1 },
      decision: "Begin with history for the empty subarray.",
    }),
    base(algorithm, "prefix", 2, 5, "First match", "After reading 1 and 2, prefix is 3, so prefix - k is 0.", "Because 0 was seen before the array started, [1, 2] is a valid subarray.", {
      values,
      target: 3,
      pointers: [{ label: "i", index: 1, tone: "emerald" }],
      window: { left: 0, right: 1 },
      solution: [0, 1],
      variables: { prefix: 3, neededEarlierPrefix: 0, count: 1 },
      memory: { "0": 1, "1": 1, "3": 1 },
      decision: "Add one match to the answer.",
    }),
    base(algorithm, "prefix", 3, 5, "Single-value match", "At index 2, prefix becomes 6 and prefix - k is 3.", "A previous prefix of 3 means the gap after that point sums to k, so [3] is another answer.", {
      values,
      target: 3,
      pointers: [{ label: "i", index: 2, tone: "emerald" }],
      window: { left: 2, right: 2 },
      solution: [2],
      variables: { prefix: 6, neededEarlierPrefix: 3, count: 2 },
      memory: { "0": 1, "1": 1, "3": 1, "6": 1 },
      decision: "Use stored history instead of moving a window.",
    }),
    base(algorithm, "prefix", 4, 5, "Negative-safe scan", "The -2 drops the prefix, but the hash map method still works.", "This is why prefix sums handle negative values better than a basic sliding window.", {
      values,
      target: 3,
      pointers: [{ label: "i", index: 3, tone: "rose" }],
      variables: { prefix: 4, neededEarlierPrefix: 1, count: 3 },
      memory: { "0": 1, "1": 1, "3": 1, "6": 1, "4": 1 },
      decision: "prefix 1 was seen, so [2, 3, -2] also sums to 3.",
    }),
    base(algorithm, "prefix", 5, 5, "Finish count", "Every index asked one constant-time history question.", "The answer is the number of compatible pairs of prefix sums.", {
      values,
      target: 3,
      variables: { finalPrefix: 9, answer: 3 },
      memory: { "0": 1, "1": 1, "3": 1, "4": 1, "6": 1, "9": 1 },
      decision: "Return the accumulated count.",
    }),
  ];
}

function mergeIntervalsTrace(algorithm: AlgorithmEntry): TraceState[] {
  return [
    base(algorithm, "greedy", 1, 5, "Sort by start", "Put intervals on a timeline from earliest start to latest start.", "Once starts are ordered, the only interval that can overlap the current one is the last merged interval.", {
      values: ["[1,3]", "[2,6]", "[8,10]", "[15,18]"],
      pointers: [{ label: "current", index: 0, tone: "cyan" }],
      variables: { merged: "[]" },
      decision: "Start with the earliest interval.",
    }),
    base(algorithm, "greedy", 2, 5, "Open first block", "Add [1,3] as the first merged block.", "There is nothing to compare yet, so it becomes the active timeline block.", {
      values: ["[1,3]", "[2,6]", "[8,10]", "[15,18]"],
      pointers: [{ label: "last", index: 0, tone: "emerald" }],
      solution: [0],
      variables: { merged: "[[1,3]]" },
      decision: "The last merged end is 3.",
    }),
    base(algorithm, "greedy", 3, 5, "Merge overlap", "[2,6] starts before the last end 3, so extend the block to 6.", "Overlapping intervals become one larger interval because their covered time is connected.", {
      values: ["[1,6]", "[2,6]", "[8,10]", "[15,18]"],
      pointers: [{ label: "current", index: 1, tone: "amber" }],
      solution: [0, 1],
      variables: { comparison: "2 <= 3", merged: "[[1,6]]" },
      decision: "Stretch the end with max(3, 6).",
    }),
    base(algorithm, "greedy", 4, 5, "Start new block", "[8,10] starts after 6, so it cannot overlap.", "A gap means the previous block is finalized and a new block begins.", {
      values: ["[1,6]", "[8,10]", "[15,18]"],
      pointers: [{ label: "current", index: 1, tone: "cyan" }],
      solution: [0],
      variables: { comparison: "8 > 6", merged: "[[1,6], [8,10]]" },
      decision: "Append instead of merging.",
    }),
    base(algorithm, "greedy", 5, 5, "Return timeline", "The scan finishes with three non-overlapping blocks.", "Sorting made one left-to-right pass enough.", {
      values: ["[1,6]", "[8,10]", "[15,18]"],
      solution: [0, 1, 2],
      variables: { answer: "[[1,6], [8,10], [15,18]]" },
      decision: "Return merged intervals.",
    }),
  ];
}

function nextPermutationTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [1, 3, 5, 4, 2];
  return [
    base(algorithm, "array", 1, 5, "Find falling suffix", "Scan from the right until the sequence stops descending.", "A descending suffix is already the biggest arrangement for those positions.", {
      values,
      pointers: [
        { label: "i", index: 1, tone: "amber" },
        { label: "i+1", index: 2, tone: "cyan" },
      ],
      window: { left: 2, right: 4 },
      variables: { suffix: "[5,4,2]", pivotCandidate: 3 },
      decision: "3 < 5, so index 1 is the pivot.",
    }),
    base(algorithm, "array", 2, 5, "Find successor", "Search from the right for the smallest value larger than the pivot.", "The rightmost larger value gives the next bigger prefix with the smallest possible increase.", {
      values,
      pointers: [
        { label: "pivot", index: 1, tone: "amber" },
        { label: "successor", index: 3, tone: "emerald" },
      ],
      variables: { pivot: 3, successor: 4 },
      decision: "Swap 3 and 4.",
    }),
    base(algorithm, "array", 3, 5, "Swap pivot", "After the swap, the number is bigger, but the suffix is still in descending order.", "To make the overall result the next immediate permutation, the suffix must become as small as possible.", {
      values: [1, 4, 5, 3, 2],
      pointers: [{ label: "pivot", index: 1, tone: "emerald" }],
      window: { left: 2, right: 4 },
      variables: { suffixBeforeReverse: "[5,3,2]" },
      decision: "Reverse the suffix.",
    }),
    base(algorithm, "array", 4, 5, "Reverse suffix", "Turning the descending suffix into ascending order gives the smallest tail.", "This keeps the new permutation just one step larger than the original.", {
      values: [1, 4, 2, 3, 5],
      pointers: [
        { label: "L", index: 2, tone: "cyan" },
        { label: "R", index: 4, tone: "violet" },
      ],
      solution: [2, 3, 4],
      variables: { suffixAfterReverse: "[2,3,5]" },
      decision: "The next permutation is now formed.",
    }),
    base(algorithm, "array", 5, 5, "Next permutation", "Return the mutated array in place.", "If no pivot had existed, the whole array would be reversed to the first permutation.", {
      values: [1, 4, 2, 3, 5],
      solution: [0, 1, 2, 3, 4],
      variables: { answer: "[1,4,2,3,5]" },
      decision: "The array is the next lexicographic arrangement.",
    }),
  ];
}

function findDuplicateTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [1, 3, 4, 2, 2];
  return [
    base(algorithm, "array", 1, 5, "Treat values as links", "Each index points to nums[index], forming a hidden linked list.", "A duplicate value means two positions point into the same node, which creates a cycle.", {
      values,
      pointers: [{ label: "start", index: 0, tone: "cyan" }],
      variables: { edge: "0 -> 1 -> 3 -> 2 -> 4 -> 2" },
      decision: "Run Floyd's slow/fast pointers on values.",
    }),
    base(algorithm, "array", 2, 5, "Move slow and fast", "slow moves one link, fast moves two links.", "Inside a cycle, the faster pointer must eventually lap the slower one.", {
      values,
      pointers: [
        { label: "slow", index: 3, tone: "cyan" },
        { label: "fast", index: 2, tone: "violet" },
      ],
      variables: { slow: 3, fast: 2 },
      decision: "Continue until they meet.",
    }),
    base(algorithm, "array", 3, 5, "Detect meeting point", "Both pointers land at value/index 2 inside the cycle.", "This confirms a duplicate-created loop, but the meeting point is not necessarily the duplicate entry.", {
      values,
      pointers: [
        { label: "slow", index: 2, tone: "emerald" },
        { label: "fast", index: 2, tone: "emerald" },
      ],
      solution: [2],
      variables: { meeting: 2 },
      decision: "Reset one pointer to the start.",
    }),
    base(algorithm, "array", 4, 5, "Find cycle entry", "Move both pointers one link at a time.", "The place where they meet now is the cycle entry, which equals the duplicate number.", {
      values,
      pointers: [
        { label: "finder", index: 1, tone: "cyan" },
        { label: "slow", index: 4, tone: "violet" },
      ],
      variables: { finderPath: "0 -> 1", slowPath: "2 -> 4" },
      decision: "Advance together.",
    }),
    base(algorithm, "array", 5, 5, "Duplicate found", "The pointers meet at value 2.", "Because two different indices point to 2, that value is the repeated number.", {
      values,
      pointers: [
        { label: "entry", index: 2, tone: "emerald" },
        { label: "entry", index: 4, tone: "emerald" },
      ],
      solution: [2, 4],
      variables: { duplicate: 2 },
      decision: "Return 2.",
    }),
  ];
}

function majorityElementTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [2, 2, 1, 1, 1, 2, 2];
  return [
    base(algorithm, "array", 1, 5, "Choose candidate", "When count is zero, the current value becomes the candidate.", "The count is not the real frequency; it is the candidate's lead after pair cancellations.", {
      values,
      pointers: [{ label: "i", index: 0, tone: "cyan" }],
      variables: { candidate: 2, count: 1 },
      decision: "Start with candidate 2.",
    }),
    base(algorithm, "array", 2, 5, "Same value supports", "Another 2 increases the candidate's lead.", "Matching values vote for the current candidate.", {
      values,
      pointers: [{ label: "i", index: 1, tone: "emerald" }],
      solution: [0, 1],
      variables: { candidate: 2, count: 2 },
      decision: "count++.",
    }),
    base(algorithm, "array", 3, 5, "Different values cancel", "Two 1s cancel out the two votes for 2.", "Pairing one candidate with one non-candidate removes both from consideration.", {
      values,
      pointers: [{ label: "i", index: 3, tone: "rose" }],
      retired: [0, 1, 2, 3],
      variables: { candidate: 2, count: 0 },
      decision: "The next value can become a new candidate.",
    }),
    base(algorithm, "array", 4, 5, "Candidate can change", "With count zero, value 1 briefly becomes the candidate.", "This does not break correctness because already cancelled pairs cannot affect the final majority.", {
      values,
      pointers: [{ label: "i", index: 4, tone: "amber" }],
      variables: { candidate: 1, count: 1 },
      decision: "Choose 1, then compare later values.",
    }),
    base(algorithm, "array", 5, 5, "Majority survives", "The final two 2s cancel the temporary candidate and leave 2 as the survivor.", "A value appearing more than n/2 times cannot be fully cancelled by all other values.", {
      values,
      pointers: [{ label: "i", index: 6, tone: "emerald" }],
      solution: [0, 1, 5, 6],
      variables: { candidate: 2, count: 1, answer: 2 },
      decision: "Return the surviving candidate.",
    }),
  ];
}

function stockProfitTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [7, 1, 5, 3, 6, 4];
  return [
    base(algorithm, "greedy", 1, 5, "Track cheapest buy", "Start with the first price as the cheapest seen so far.", "At each day, the best sale uses the cheapest earlier buy, never a future price.", {
      values,
      pointers: [{ label: "buy", index: 0, tone: "cyan" }],
      variables: { minPrice: 7, bestProfit: 0 },
      decision: "No sale before buying.",
    }),
    base(algorithm, "greedy", 2, 5, "Lower buy price", "Day 1 price is 1, so replace the buy candidate.", "A lower buy price can only improve or keep future profit options.", {
      values,
      pointers: [{ label: "buy", index: 1, tone: "emerald" }],
      variables: { minPrice: 1, bestProfit: 0 },
      decision: "Update minPrice to 1.",
    }),
    base(algorithm, "greedy", 3, 5, "Test sale", "Selling at 5 after buying at 1 gives profit 4.", "Every day asks: what if I sell today using the best buy before today?", {
      values,
      pointers: [
        { label: "buy", index: 1, tone: "cyan" },
        { label: "sell", index: 2, tone: "emerald" },
      ],
      solution: [1, 2],
      variables: { profitToday: 4, bestProfit: 4 },
      decision: "Record profit 4.",
    }),
    base(algorithm, "greedy", 4, 5, "Improve sale", "Selling at 6 gives profit 5, which beats the old record.", "The buy day stays fixed because 1 is still the cheapest earlier price.", {
      values,
      pointers: [
        { label: "buy", index: 1, tone: "cyan" },
        { label: "sell", index: 4, tone: "emerald" },
      ],
      solution: [1, 4],
      variables: { profitToday: 5, bestProfit: 5 },
      decision: "Update best profit to 5.",
    }),
    base(algorithm, "greedy", 5, 5, "Return best gap", "The final day cannot beat profit 5.", "The algorithm has tracked the best increasing price gap in one pass.", {
      values,
      solution: [1, 4],
      variables: { answer: 5, buyAt: 1, sellAt: 6 },
      decision: "Return 5.",
    }),
  ];
}

function rearrangeBySignTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [3, 1, -2, -5, 2, -4];
  return [
    base(algorithm, "array", 1, 5, "Reserve slots", "Even indices are reserved for positives and odd indices for negatives.", "The two write pointers do not search for values; they mark the next output slot of each sign.", {
      values,
      pointers: [
        { label: "pos", index: 0, tone: "cyan" },
        { label: "neg", index: 1, tone: "violet" },
      ],
      variables: { result: "[_, _, _, _, _, _]", pos: 0, neg: 1 },
      decision: "Scan input left to right.",
    }),
    base(algorithm, "array", 2, 5, "Place positives", "3 and 1 fill positive slots 0 and 2.", "After writing a positive, the positive pointer jumps by two to the next even slot.", {
      values: [3, "_", 1, "_", "_", "_"],
      pointers: [{ label: "pos", index: 4, tone: "cyan" }],
      solution: [0, 2],
      variables: { pos: 4, neg: 1 },
      decision: "Keep original positive order.",
    }),
    base(algorithm, "array", 3, 5, "Place negatives", "-2 and -5 fill odd slots 1 and 3.", "The negative pointer also jumps by two, preserving alternating signs.", {
      values: [3, -2, 1, -5, "_", "_"],
      pointers: [{ label: "neg", index: 5, tone: "violet" }],
      solution: [0, 1, 2, 3],
      variables: { pos: 4, neg: 5 },
      decision: "Odd slots now contain negatives.",
    }),
    base(algorithm, "array", 4, 5, "Finish alternation", "The remaining positive 2 and negative -4 fill the last pair.", "Because the problem has equal counts, both pointers finish exactly past the array.", {
      values: [3, -2, 1, -5, 2, -4],
      solution: [0, 1, 2, 3, 4, 5],
      variables: { pos: 6, neg: 7 },
      decision: "All positions satisfy the sign pattern.",
    }),
    base(algorithm, "array", 5, 5, "Return result", "The output alternates positive, negative, positive, negative.", "The scan is linear and the extra result array keeps the original relative order inside each sign group.", {
      values: [3, -2, 1, -5, 2, -4],
      solution: [0, 1, 2, 3, 4, 5],
      variables: { answer: "[3,-2,1,-5,2,-4]" },
      decision: "Return the rearranged array.",
    }),
  ];
}

function leadersTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [16, 17, 4, 3, 5, 2];
  return [
    base(algorithm, "array", 1, 5, "Start from right", "The rightmost element is always a leader because nothing is to its right.", "Scanning from the right lets maxRight summarize every value already seen.", {
      values,
      pointers: [{ label: "i", index: 5, tone: "emerald" }],
      solution: [5],
      variables: { maxRight: 2, leaders: "[2]" },
      decision: "Record 2.",
    }),
    base(algorithm, "array", 2, 5, "Find larger right-side peak", "5 is greater than maxRight 2, so it is also a leader.", "A leader must beat the best value to its right, not just the next neighbor.", {
      values,
      pointers: [{ label: "i", index: 4, tone: "emerald" }],
      solution: [4, 5],
      variables: { maxRight: 5, leaders: "[2,5]" },
      decision: "Update maxRight to 5.",
    }),
    base(algorithm, "array", 3, 5, "Skip hidden values", "3 and 4 are both less than 5, so they are hidden by a stronger value to their right.", "Values smaller than maxRight cannot be leaders.", {
      values,
      pointers: [{ label: "i", index: 2, tone: "rose" }],
      retired: [2, 3],
      variables: { maxRight: 5, skipped: "3, 4" },
      decision: "Do not record them.",
    }),
    base(algorithm, "array", 4, 5, "Record left leader", "17 is greater than every value to its right.", "maxRight jumps from 5 to 17.", {
      values,
      pointers: [{ label: "i", index: 1, tone: "emerald" }],
      solution: [1, 4, 5],
      variables: { maxRight: 17, leaders: "[2,5,17]" },
      decision: "Record 17.",
    }),
    base(algorithm, "array", 5, 5, "Restore order", "The leaders were collected from right to left, so reverse them for original order.", "The answer is [17, 5, 2].", {
      values,
      solution: [1, 4, 5],
      variables: { answer: "[17,5,2]" },
      decision: "Return reversed leaders.",
    }),
  ];
}

function longestConsecutiveTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [100, 4, 200, 1, 3, 2];
  return [
    base(algorithm, "prefix", 1, 5, "Build set", "Put every number into a set for constant-time membership checks.", "The set lets us ask whether a number has a predecessor or successor without sorting.", {
      values,
      variables: { set: "{1,2,3,4,100,200}", longest: 0 },
      decision: "Only sequence starts should expand.",
    }),
    base(algorithm, "prefix", 2, 5, "Reject non-start", "4 has predecessor 3, so it is not the start of its run.", "Expanding from every number would duplicate work; start only where x - 1 is missing.", {
      values,
      pointers: [{ label: "x", index: 1, tone: "rose" }],
      variables: { x: 4, hasPrevious: true },
      decision: "Skip 4 as a start.",
    }),
    base(algorithm, "prefix", 3, 5, "Start at 1", "1 has no predecessor, so it begins a consecutive chain.", "Now walk 2, 3, 4 using set lookups.", {
      values,
      pointers: [{ label: "start", index: 3, tone: "emerald" }],
      solution: [3],
      variables: { start: 1, length: 1 },
      decision: "Expand while next value exists.",
    }),
    base(algorithm, "prefix", 4, 5, "Expand chain", "The chain 1, 2, 3, 4 has length 4.", "Each number participates in at most one successful chain expansion from its true start.", {
      values,
      solution: [1, 3, 4, 5],
      variables: { chain: "1 -> 2 -> 3 -> 4", length: 4, longest: 4 },
      decision: "Stop when 5 is missing.",
    }),
    base(algorithm, "prefix", 5, 5, "Return longest", "The isolated values 100 and 200 have length 1, so the best remains 4.", "No sorting was needed; the set gave O(N) expected time.", {
      values,
      solution: [1, 3, 4, 5],
      variables: { answer: 4 },
      decision: "Return 4.",
    }),
  ];
}

function setMatrixZeroesTrace(algorithm: AlgorithmEntry): TraceState[] {
  return [
    base(algorithm, "matrix", 1, 5, "Find zero", "Scan the matrix and find a zero at row 1, column 1.", "Changing cells immediately would corrupt later discovery, so the first pass only marks.", {
      matrix: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ],
      activeCells: ["1-1"],
      variables: { row: 1, col: 1, col0: 1 },
      decision: "Use matrix[1][0] and matrix[0][1] as markers.",
    }),
    base(algorithm, "matrix", 2, 5, "Write markers", "Store the row and column zero flags in the matrix itself.", "The first row and first column become a tiny in-place hash table.", {
      matrix: [
        [1, 0, 1],
        [0, 0, 1],
        [1, 1, 1],
      ],
      activeCells: ["1-0", "0-1"],
      variables: { markedRow: 1, markedColumn: 1 },
      decision: "Do not zero the full row yet.",
    }),
    base(algorithm, "matrix", 3, 5, "Apply inner cells", "Walk backward through inner cells and zero anything whose row or column marker is zero.", "Backward traversal protects the marker row and marker column until they have done their job.", {
      matrix: [
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 1],
      ],
      activeCells: ["1-2", "2-1"],
      variables: { rule: "matrix[i][0] == 0 || matrix[0][j] == 0" },
      decision: "Zero row 1 and column 1 cells.",
    }),
    base(algorithm, "matrix", 4, 5, "Handle first column", "Use the separate col0 flag for column 0.", "Column 0 is special because matrix[0][0] cannot store both first-row and first-column flags.", {
      matrix: [
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 1],
      ],
      activeCells: ["1-0"],
      variables: { col0: 1, firstColumnChanged: "only row marker at row 1" },
      decision: "Keep column 0 cells that were not marked.",
    }),
    base(algorithm, "matrix", 5, 5, "Matrix updated", "The final matrix has exactly the marked row and column zeroed.", "The algorithm used the input matrix as storage and kept extra memory constant.", {
      matrix: [
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 1],
      ],
      activeCells: ["1-0", "1-1", "1-2", "0-1", "2-1"],
      variables: { extraSpace: "O(1)" },
      decision: "Return after the second pass.",
    }),
  ];
}

function rotateMatrixTrace(algorithm: AlgorithmEntry): TraceState[] {
  return [
    base(algorithm, "matrix", 1, 5, "Original image", "Start with the matrix in row-major view.", "A clockwise rotation can be decomposed into a diagonal transpose and a row reverse.", {
      matrix: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      activeCells: ["0-0", "0-1", "0-2"],
      variables: { transform: "rotate 90 clockwise" },
      decision: "First transpose.",
    }),
    base(algorithm, "matrix", 2, 5, "Transpose diagonal", "Swap matrix[i][j] with matrix[j][i] for cells above the diagonal.", "Rows become columns while the main diagonal stays fixed.", {
      matrix: [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
      ],
      activeCells: ["0-1", "1-0", "0-2", "2-0", "1-2", "2-1"],
      variables: { swaps: "(0,1)<->(1,0), (0,2)<->(2,0), (1,2)<->(2,1)" },
      decision: "Now reverse each row.",
    }),
    base(algorithm, "matrix", 3, 5, "Reverse top row", "Swap the ends of each row.", "After transpose, reversing rows places former columns into clockwise order.", {
      matrix: [
        [7, 4, 1],
        [2, 5, 8],
        [3, 6, 9],
      ],
      activeCells: ["0-0", "0-2"],
      variables: { row: 0, swap: "7 with 1" },
      decision: "Continue row by row.",
    }),
    base(algorithm, "matrix", 4, 5, "Reverse remaining rows", "Rows 1 and 2 are reversed the same way.", "Each row reversal is independent and in place.", {
      matrix: [
        [7, 4, 1],
        [8, 5, 2],
        [9, 6, 3],
      ],
      activeCells: ["1-0", "1-2", "2-0", "2-2"],
      variables: { rowsReversed: "0, 1, 2" },
      decision: "All cells now match the rotated position.",
    }),
    base(algorithm, "matrix", 5, 5, "Rotated in place", "The matrix has been rotated 90 degrees clockwise.", "No second matrix was allocated; every move was a swap inside the original grid.", {
      matrix: [
        [7, 4, 1],
        [8, 5, 2],
        [9, 6, 3],
      ],
      activeCells: ["0-0", "0-1", "0-2", "1-0", "1-1", "1-2", "2-0", "2-1", "2-2"],
      variables: { extraSpace: "O(1)" },
      decision: "Return the mutated matrix.",
    }),
  ];
}

function spiralMatrixTrace(algorithm: AlgorithmEntry): TraceState[] {
  return [
    base(algorithm, "matrix", 1, 5, "Set boundaries", "Track top, bottom, left, and right edges of the remaining rectangle.", "The spiral is just four straight walks followed by shrinking the rectangle.", {
      matrix: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      activeCells: ["0-0", "0-1", "0-2"],
      variables: { top: 0, bottom: 2, left: 0, right: 2, output: "[]" },
      decision: "Walk the top row left to right.",
    }),
    base(algorithm, "matrix", 2, 5, "Top and right", "Collect 1,2,3 from the top row, then 6,9 from the right column.", "After consuming an edge, move that boundary inward.", {
      matrix: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      activeCells: ["0-0", "0-1", "0-2", "1-2", "2-2"],
      variables: { top: 1, right: 1, output: "[1,2,3,6,9]" },
      decision: "Now the bottom row is available from right to left.",
    }),
    base(algorithm, "matrix", 3, 5, "Bottom and left", "Collect 8,7 from the bottom row, then 4 from the left column.", "Boundary checks prevent double-counting when the rectangle becomes thin.", {
      matrix: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      activeCells: ["2-1", "2-0", "1-0"],
      variables: { bottom: 1, left: 1, output: "[1,2,3,6,9,8,7,4]" },
      decision: "Shrink to the center cell.",
    }),
    base(algorithm, "matrix", 4, 5, "Center cell", "Only the center cell remains.", "The boundaries still describe a valid 1 by 1 rectangle.", {
      matrix: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      activeCells: ["1-1"],
      variables: { top: 1, bottom: 1, left: 1, right: 1, output: "[1,2,3,6,9,8,7,4,5]" },
      decision: "Append 5 and shrink again.",
    }),
    base(algorithm, "matrix", 5, 5, "Spiral complete", "The boundaries cross, so every cell has been visited once.", "The output order follows the outside-in layers.", {
      matrix: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      activeCells: ["0-0", "0-1", "0-2", "1-2", "2-2", "2-1", "2-0", "1-0", "1-1"],
      variables: { answer: "[1,2,3,6,9,8,7,4,5]" },
      decision: "Return the output list.",
    }),
  ];
}

function pascalTriangleTrace(algorithm: AlgorithmEntry): TraceState[] {
  return [
    base(algorithm, "dynamic-programming", 1, 5, "Seed first row", "Pascal's Triangle starts with a single 1.", "Every row later uses the row directly above it.", {
      dpTable: [[1]],
      activeCells: ["0-0"],
      variables: { row: 0, value: 1 },
      decision: "Create row 0.",
    }),
    base(algorithm, "dynamic-programming", 2, 5, "Add row edges", "Each new row starts and ends with 1.", "The edges have only one parent above, so they stay 1.", {
      dpTable: [
        [1, "", ""],
        [1, 1, ""],
      ],
      activeCells: ["1-0", "1-1"],
      variables: { row: 1, rule: "edges are 1" },
      decision: "Move to inner cells on larger rows.",
    }),
    base(algorithm, "dynamic-programming", 3, 5, "Fill inner sum", "The center of row 2 is previousRow[0] + previousRow[1].", "Each inner cell is built from the two numbers leaning into it from the row above.", {
      dpTable: [
        [1, "", ""],
        [1, 1, ""],
        [1, 2, 1],
      ],
      activeCells: ["1-0", "1-1", "2-1"],
      variables: { calculation: "1 + 1 = 2" },
      decision: "Write 2 in the middle.",
    }),
    base(algorithm, "dynamic-programming", 4, 5, "Grow next row", "Row 3 uses row 2 to create 1, 3, 3, 1.", "The same local rule builds the entire triangle.", {
      dpTable: [
        [1, "", "", ""],
        [1, 1, "", ""],
        [1, 2, 1, ""],
        [1, 3, 3, 1],
      ],
      activeCells: ["2-0", "2-1", "3-1", "2-1", "2-2", "3-2"],
      variables: { row: 3, inner: "3 and 3" },
      decision: "Continue until numRows is reached.",
    }),
    base(algorithm, "dynamic-programming", 5, 5, "Return triangle", "The final table contains all requested rows.", "This is DP because every new row reuses already-computed smaller row values.", {
      dpTable: [
        [1, "", "", "", ""],
        [1, 1, "", "", ""],
        [1, 2, 1, "", ""],
        [1, 3, 3, 1, ""],
        [1, 4, 6, 4, 1],
      ],
      activeCells: ["4-0", "4-1", "4-2", "4-3", "4-4"],
      variables: { rows: 5 },
      decision: "Return all rows.",
    }),
  ];
}

function threeSumTrace(algorithm: AlgorithmEntry): TraceState[] {
  return [
    base(algorithm, "two-pointers", 1, 5, "Sort and fix", "Sort the array and fix one value as the first member of the triplet.", "After fixing one number, the remaining problem is a two-sum search in the suffix.", {
      values: [-4, -1, -1, 0, 1, 2],
      target: 0,
      pointers: [{ label: "i", index: 1, tone: "amber" }],
      variables: { fixed: -1, needPairSum: 1 },
      decision: "Search to the right of i.",
    }),
    base(algorithm, "two-pointers", 2, 5, "Open pair search", "Place left after i and right at the end.", "The sorted order lets the pair sum move predictably.", {
      values: [-4, -1, -1, 0, 1, 2],
      pointers: [
        { label: "i", index: 1, tone: "amber" },
        { label: "left", index: 2, tone: "cyan" },
        { label: "right", index: 5, tone: "violet" },
      ],
      variables: { sum: 0, target: 0 },
      decision: "-1 + -1 + 2 = 0, record a triplet.",
    }),
    base(algorithm, "two-pointers", 3, 5, "Skip duplicates", "After recording [-1,-1,2], move both pointers past duplicate values.", "Duplicate skipping prevents returning the same triplet shape twice.", {
      values: [-4, -1, -1, 0, 1, 2],
      solution: [1, 2, 5],
      pointers: [
        { label: "left", index: 3, tone: "cyan" },
        { label: "right", index: 4, tone: "violet" },
      ],
      variables: { triplets: "[[-1,-1,2]]" },
      decision: "Try the next pair.",
    }),
    base(algorithm, "two-pointers", 4, 5, "Record second triplet", "-1 + 0 + 1 is also zero.", "The fixed value stays the same while left and right find another compatible pair.", {
      values: [-4, -1, -1, 0, 1, 2],
      solution: [1, 3, 4],
      pointers: [
        { label: "i", index: 1, tone: "amber" },
        { label: "left", index: 3, tone: "emerald" },
        { label: "right", index: 4, tone: "emerald" },
      ],
      variables: { triplets: "[[-1,-1,2],[-1,0,1]]" },
      decision: "Record and move inward.",
    }),
    base(algorithm, "two-pointers", 5, 5, "Advance fixed index", "When pointers cross, move i and skip duplicate fixed values.", "The scan ends after every fixed value has searched its suffix.", {
      values: [-4, -1, -1, 0, 1, 2],
      solution: [1, 2, 3, 4, 5],
      variables: { answer: "[[-1,-1,2],[-1,0,1]]" },
      decision: "Return unique triplets.",
    }),
  ];
}

function twoPointerTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [1, 4, 7, 10, 15, 20];
  const target = 17;
  return [
    base(algorithm, "two-pointers", 1, 5, "Initialize", "Place both pointers on the search boundary.", "The left pointer starts at the smallest value and the right pointer starts at the largest value.", {
      values,
      target,
      pointers: [
        { label: "left", index: 0, tone: "cyan" },
        { label: "right", index: 5, tone: "violet" },
      ],
      variables: { left: 0, right: 5, currentSum: 21, target },
      decision: "1 + 20 is too large, so the larger side must move inward.",
    }),
    base(algorithm, "two-pointers", 2, 5, "Compare", "The current pair is too large.", "Because the array is sorted, keeping 20 can only keep the sum large with every left value we have not tried yet.", {
      values,
      target,
      pointers: [
        { label: "left", index: 0, tone: "cyan" },
        { label: "right", index: 5, tone: "rose" },
      ],
      retired: [5],
      variables: { currentSum: 21, move: "right--" },
      decision: "Discard index 5 and try a smaller right value.",
    }),
    base(algorithm, "two-pointers", 3, 5, "Adjust", "The sum became too small.", "Now 1 + 15 is below the target, so the smaller side needs to grow.", {
      values,
      target,
      pointers: [
        { label: "left", index: 0, tone: "rose" },
        { label: "right", index: 4, tone: "violet" },
      ],
      retired: [5],
      variables: { currentSum: 16, move: "left++" },
      decision: "Move left from 1 to 4 to increase the sum.",
    }),
    base(algorithm, "two-pointers", 4, 5, "Narrow", "Each pointer move removes a whole region of impossible pairs.", "The search space shrinks without losing the answer because every skipped pair is proven too small or too large.", {
      values,
      target,
      pointers: [
        { label: "left", index: 1, tone: "cyan" },
        { label: "right", index: 3, tone: "violet" },
      ],
      retired: [0, 4, 5],
      variables: { currentSum: 14, remainingWindow: "indices 1..3" },
      decision: "The remaining candidates are concentrated between the pointers.",
    }),
    base(algorithm, "two-pointers", 5, 5, "Solved", "The pointers land on the answer.", "When the current pair matches the target, the simulation stops because the goal condition is satisfied.", {
      values,
      target,
      pointers: [
        { label: "left", index: 2, tone: "emerald" },
        { label: "right", index: 3, tone: "emerald" },
      ],
      solution: [2, 3],
      variables: { currentSum: 17, answer: "[7, 10]" },
      decision: "7 + 10 equals 17.",
    }),
  ];
}

function slidingWindowTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [2, 1, 3, 2, 4, 1, 1];
  return [
    base(algorithm, "sliding-window", 1, 5, "Open window", "Start with a small window and a running measurement.", "A sliding window keeps a live slice of the input instead of recomputing from scratch.", {
      values,
      window: { left: 0, right: 1 },
      variables: { windowSum: 3, best: 3 },
      decision: "Expand while the window can still become better.",
    }),
    base(algorithm, "sliding-window", 2, 5, "Expand", "Include the next element and update the running state.", "Only the new element changes the total, so the update is constant time.", {
      values,
      window: { left: 0, right: 3 },
      pointers: [{ label: "right", index: 3, tone: "violet" }],
      variables: { added: 2, windowSum: 8, best: 8 },
      decision: "The right edge moves forward to collect more information.",
    }),
    base(algorithm, "sliding-window", 3, 5, "Shrink", "If the window breaks the rule, move the left edge.", "Shrinking removes old elements until the window becomes valid again.", {
      values,
      window: { left: 2, right: 3 },
      retired: [0, 1],
      variables: { removed: "2, 1", windowSum: 5 },
      decision: "Move left until the condition is restored.",
    }),
    base(algorithm, "sliding-window", 4, 5, "Record", "A valid window can update the answer.", "The best answer is updated only when the current window satisfies the problem rule.", {
      values,
      window: { left: 2, right: 4 },
      pointers: [{ label: "candidate", index: 4, tone: "emerald" }],
      variables: { windowSum: 9, best: 9 },
      decision: "This window becomes the new best candidate.",
    }),
    base(algorithm, "sliding-window", 5, 5, "Finish", "Every element entered and left the window at most once.", "That is why the scan stays linear even though the window changes many times.", {
      values,
      window: { left: 4, right: 6 },
      solution: [4, 5, 6],
      variables: { finalBest: 9 },
      decision: "Return the best recorded valid window.",
    }),
  ];
}

function binarySearchTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [2, 5, 8, 12, 16, 23, 38];
  const target = 16;
  return [
    base(algorithm, "binary-search", 1, 5, "Bounds", "Search only inside the current low/high range.", "Binary search works because the input has an order that lets one comparison discard half of the candidates.", {
      values,
      target,
      window: { left: 0, right: 6 },
      pointers: [
        { label: "low", index: 0, tone: "cyan" },
        { label: "high", index: 6, tone: "violet" },
      ],
      variables: { low: 0, high: 6 },
    }),
    base(algorithm, "binary-search", 2, 5, "Probe middle", "Check the middle candidate.", "The middle value tells us which side can still contain the target.", {
      values,
      target,
      window: { left: 0, right: 6 },
      pointers: [{ label: "mid", index: 3, tone: "amber" }],
      variables: { mid: 3, value: 12 },
      decision: "12 is below 16, so everything at or left of mid is too small.",
    }),
    base(algorithm, "binary-search", 3, 5, "Discard left half", "Move low to the first still-possible index.", "The eliminated values cannot become the target because they are all <= 12.", {
      values,
      target,
      window: { left: 4, right: 6 },
      retired: [0, 1, 2, 3],
      pointers: [
        { label: "low", index: 4, tone: "cyan" },
        { label: "high", index: 6, tone: "violet" },
      ],
      variables: { low: 4, high: 6 },
    }),
    base(algorithm, "binary-search", 4, 5, "Probe again", "The new middle is the answer.", "A match can return immediately, or it can be stored while searching left/right for a bound variant.", {
      values,
      target,
      window: { left: 4, right: 6 },
      pointers: [{ label: "mid", index: 5, tone: "amber" }],
      variables: { mid: 5, value: 23 },
      decision: "23 is too large, so move high left.",
    }),
    base(algorithm, "binary-search", 5, 5, "Converge", "The remaining candidate satisfies the condition.", "The loop ends when the range collapses onto the target or the insertion boundary.", {
      values,
      target,
      window: { left: 4, right: 4 },
      pointers: [{ label: "answer", index: 4, tone: "emerald" }],
      solution: [4],
      variables: { answerIndex: 4, answerValue: 16 },
    }),
  ];
}

function prefixTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [3, 4, -7, 1, 3, 3, 1];
  return [
    base(algorithm, "prefix", 1, 5, "Running sum", "Convert subarray questions into prefix differences.", "If two prefixes differ by the target, the elements between them form the answer.", {
      values,
      pointers: [{ label: "i", index: 0, tone: "cyan" }],
      variables: { prefix: 3, neededEarlierPrefix: 0 },
      memory: { "0": "seen before scan", "3": "index 0" },
    }),
    base(algorithm, "prefix", 2, 5, "Store history", "The hash map remembers prefixes we have already seen.", "This lets us answer 'have I seen the matching past state?' in constant time.", {
      values,
      pointers: [{ label: "i", index: 1, tone: "cyan" }],
      variables: { prefix: 7, target: 7, neededEarlierPrefix: 0 },
      memory: { "0": "count 1", "3": "count 1", "7": "count 1" },
      decision: "prefix - target = 0, so the subarray from start to i works.",
    }),
    base(algorithm, "prefix", 3, 5, "Handle negatives", "Negative values do not break the method.", "Unlike two pointers, prefix sums work even when the running total can go up and down.", {
      values,
      pointers: [{ label: "i", index: 2, tone: "rose" }],
      variables: { prefix: 0, value: -7 },
      memory: { "0": "count 2", "3": "count 1", "7": "count 1" },
    }),
    base(algorithm, "prefix", 4, 5, "Find another match", "A repeated compatible prefix reveals another valid region.", "The map turns each index into a question about previous history.", {
      values,
      window: { left: 3, right: 5 },
      pointers: [{ label: "i", index: 5, tone: "emerald" }],
      variables: { prefix: 7, neededEarlierPrefix: 0 },
      solution: [3, 4, 5],
    }),
    base(algorithm, "prefix", 5, 5, "Return count or best", "The final answer comes from all compatible prefix pairs.", "The code may return a count, a length, or indices depending on the problem statement.", {
      values,
      variables: { matchesFound: 2, finalPrefix: 8 },
      decision: "Use the accumulated records to produce the requested output.",
    }),
  ];
}

function sortingTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [4, 1, 3, 2, 2];
  return [
    base(algorithm, "sorting", 1, 5, "Compare", "Sorting algorithms repeatedly compare local order.", "A comparison asks whether two neighboring or selected values are already in the correct order.", {
      values,
      pointers: [
        { label: "a", index: 0, tone: "amber" },
        { label: "b", index: 1, tone: "amber" },
      ],
      decision: "4 should come after 1, so swap.",
    }),
    base(algorithm, "sorting", 2, 5, "Swap", "Move the smaller value earlier.", "Each swap reduces disorder according to the chosen sorting strategy.", {
      values: [1, 4, 3, 2, 2],
      pointers: [
        { label: "fixed", index: 0, tone: "emerald" },
        { label: "scan", index: 1, tone: "cyan" },
      ],
      variables: { swapped: "4 and 1" },
    }),
    base(algorithm, "sorting", 3, 5, "Partition or merge", "Group values into regions with known order.", "Most efficient sorting methods build larger ordered regions from smaller known facts.", {
      values: [1, 3, 4, 2, 2],
      window: { left: 0, right: 2 },
      variables: { orderedPrefix: "[1, 3, 4]" },
    }),
    base(algorithm, "sorting", 4, 5, "Resolve duplicates", "Equal values must be handled without losing or duplicating them.", "Stable algorithms preserve original order for equal values; unstable ones still keep values correct.", {
      values: [1, 2, 2, 3, 4],
      solution: [0, 1, 2, 3, 4],
      variables: { duplicates: "two 2s kept together" },
    }),
    base(algorithm, "sorting", 5, 5, "Sorted", "The whole range now satisfies nondecreasing order.", "Once every adjacent pair is ordered, the full array is sorted.", {
      values: [1, 2, 2, 3, 4],
      solution: [0, 1, 2, 3, 4],
      decision: "Return the sorted structure or use it for the next algorithm phase.",
    }),
  ];
}

function matrixTrace(algorithm: AlgorithmEntry): TraceState[] {
  const matrix = [
    [1, 2, 3],
    [4, 0, 6],
    [7, 8, 9],
  ];
  return [
    base(algorithm, "matrix", 1, 5, "Map coordinates", "Treat each cell as a row/column position.", "Matrix algorithms become easier when you name the active row, column, and boundary.", {
      matrix,
      activeCells: ["1-1"],
      variables: { row: 1, col: 1, value: 0 },
    }),
    base(algorithm, "matrix", 2, 5, "Mark affected lines", "A decision at one cell can affect an entire row or column.", "The visualizer highlights the blast radius before applying the update.", {
      matrix,
      activeCells: ["1-0", "1-1", "1-2", "0-1", "2-1"],
      variables: { affectedRow: 1, affectedColumn: 1 },
      decision: "Remember the affected coordinates before mutating values.",
    }),
    base(algorithm, "matrix", 3, 5, "Traverse safely", "Move through the grid in a predictable direction.", "Boundaries prevent revisiting cells or stepping outside the matrix.", {
      matrix,
      activeCells: ["0-0", "0-1", "0-2"],
      variables: { top: 0, bottom: 2, left: 0, right: 2 },
    }),
    base(algorithm, "matrix", 4, 5, "Apply update", "Update only the cells proven by the rule.", "A good matrix algorithm separates discovery from mutation when one change can affect later decisions.", {
      matrix: [
        [1, 0, 3],
        [0, 0, 0],
        [7, 0, 9],
      ],
      activeCells: ["1-0", "1-1", "1-2", "0-1", "2-1"],
      variables: { update: "row 1 and column 1" },
    }),
    base(algorithm, "matrix", 5, 5, "Complete", "Every required cell has been visited or updated.", "The final matrix reflects all local rules applied consistently.", {
      matrix: [
        [1, 0, 3],
        [0, 0, 0],
        [7, 0, 9],
      ],
      activeCells: ["1-1"],
      solution: ["row 1", "column 1"],
    }),
  ];
}

function dynamicProgrammingTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [2, 3, 5, 6];
  return [
    base(algorithm, "dynamic-programming", 1, 5, "Define state", "Give every subproblem a clear meaning.", "Dynamic programming works only after you can explain exactly what each cell or variable stores.", {
      values,
      dpTable: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1],
      ],
      activeCells: ["1-2"],
      variables: { stateMeaning: "best answer using processed prefix" },
    }),
    base(algorithm, "dynamic-programming", 2, 5, "Transition", "Build the current answer from smaller answers.", "Each DP transition asks: what changes if I include or skip the current choice?", {
      values,
      dpTable: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 2, 2],
      ],
      activeCells: ["2-5"],
      variables: { include: 2, skip: 1, chosen: 2 },
      decision: "Choose the better transition for this cell.",
    }),
    base(algorithm, "dynamic-programming", 3, 5, "Reuse", "Previously solved cells become instant answers.", "The table prevents recomputing the same smaller problem again and again.", {
      values,
      dpTable: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 2, 2],
        [0, 0, 1, 1, 1, 2, 2],
      ],
      activeCells: ["3-6"],
      variables: { readFrom: "cell 2-1", writeTo: "cell 3-6" },
    }),
    base(algorithm, "dynamic-programming", 4, 5, "Compress", "Some DP tables can shrink to one row or a few variables.", "If the transition only needs nearby history, space can be optimized.", {
      values,
      dpRow: [0, 0, 1, 1, 1, 2, 2],
      pointers: [{ label: "capacity", index: 6, tone: "cyan" }],
      variables: { memoryMode: "rolling row" },
    }),
    base(algorithm, "dynamic-programming", 5, 5, "Answer", "Read the final state requested by the problem.", "The last cell, best variable, or target state now contains the result.", {
      values,
      dpRow: [0, 0, 1, 1, 1, 2, 3],
      solution: [6],
      variables: { answer: 3 },
    }),
  ];
}

function graphTrace(algorithm: AlgorithmEntry): TraceState[] {
  const graph = {
    nodes: [
      { id: "A", label: "A", state: "source" },
      { id: "B", label: "B", state: "frontier" },
      { id: "C", label: "C", state: "unseen" },
      { id: "D", label: "D", state: "unseen" },
      { id: "E", label: "E", state: "unseen" },
    ],
    edges: [
      { from: "A", to: "B", label: "4", state: "active" },
      { from: "A", to: "C", label: "2" },
      { from: "B", to: "D", label: "5" },
      { from: "C", to: "D", label: "1" },
      { from: "D", to: "E", label: "3" },
    ],
  };
  return [
    base(algorithm, "graph", 1, 5, "Start node", "Begin from the source and mark it visited.", "Graph algorithms keep a frontier: nodes discovered but not fully processed yet.", {
      graph,
      queue: ["A"],
      variables: { visited: "A", frontier: "A" },
    }),
    base(algorithm, "graph", 2, 5, "Expand edges", "Look at every neighbor of the current node.", "Each edge is a doorway. The algorithm decides whether walking through it improves or discovers something.", {
      graph: {
        ...graph,
        nodes: graph.nodes.map((node) => (node.id === "C" ? { ...node, state: "frontier" } : node)),
        edges: graph.edges.map((edge) => (edge.from === "A" ? { ...edge, state: "active" } : edge)),
      },
      queue: ["B", "C"],
      variables: { current: "A", discovered: "B, C" },
    }),
    base(algorithm, "graph", 3, 5, "Choose next", "Take the next frontier node using the algorithm's rule.", "BFS uses queue order, DFS uses stack depth, and shortest path algorithms use best distance first.", {
      graph: {
        ...graph,
        nodes: graph.nodes.map((node) => (node.id === "B" ? { ...node, state: "active" } : node.id === "A" ? { ...node, state: "done" } : node)),
      },
      queue: ["C", "D"],
      variables: { current: "B", rule: "frontier priority" },
    }),
    base(algorithm, "graph", 4, 5, "Relax or visit", "Update the best known information for neighbors.", "If a better path or state is found, the neighbor re-enters the frontier with improved data.", {
      graph: {
        ...graph,
        nodes: graph.nodes.map((node) => (node.id === "D" ? { ...node, state: "frontier" } : node.id === "B" ? { ...node, state: "done" } : node)),
        edges: graph.edges.map((edge) => (edge.to === "D" ? { ...edge, state: "active" } : edge)),
      },
      queue: ["C", "D"],
      variables: { updated: "D", distanceOrDepth: "improved" },
    }),
    base(algorithm, "graph", 5, 5, "Complete frontier", "Stop when no useful frontier remains.", "At this point every reachable node has the final state promised by the algorithm.", {
      graph: {
        ...graph,
        nodes: graph.nodes.map((node) => ({ ...node, state: "done" })),
      },
      queue: [],
      variables: { result: "all reachable nodes resolved" },
    }),
  ];
}

function treeTrace(algorithm: AlgorithmEntry): TraceState[] {
  const tree = {
    nodes: [
      { id: "8", label: "8", level: 0, position: 0, state: "active" },
      { id: "4", label: "4", level: 1, position: -1, state: "frontier" },
      { id: "12", label: "12", level: 1, position: 1, state: "frontier" },
      { id: "2", label: "2", level: 2, position: -1.5, state: "unseen" },
      { id: "6", label: "6", level: 2, position: -0.5, state: "unseen" },
      { id: "10", label: "10", level: 2, position: 0.5, state: "unseen" },
      { id: "14", label: "14", level: 2, position: 1.5, state: "unseen" },
    ],
    edges: [
      { from: "8", to: "4" },
      { from: "8", to: "12" },
      { from: "4", to: "2" },
      { from: "4", to: "6" },
      { from: "12", to: "10" },
      { from: "12", to: "14" },
    ],
  };
  return [
    base(algorithm, "tree", 1, 5, "Root", "Start at the root because it controls every subtree.", "Tree algorithms solve one node plus the answer from its left and right children.", {
      tree,
      variables: { current: "8", depth: 0 },
    }),
    base(algorithm, "tree", 2, 5, "Branch", "Move to child subtrees in the required order.", "Traversal order changes what you see first, but the recursive structure stays the same.", {
      tree: {
        ...tree,
        nodes: tree.nodes.map((node) => (node.id === "4" ? { ...node, state: "active" } : node.id === "8" ? { ...node, state: "done" } : node)),
      },
      callStack: ["visit(8)", "visit(4)"],
      variables: { current: "4", branch: "left" },
    }),
    base(algorithm, "tree", 3, 5, "Leaf fact", "A leaf produces a simple base answer.", "Base cases keep recursion from falling forever and give parents something concrete to combine.", {
      tree: {
        ...tree,
        nodes: tree.nodes.map((node) => (node.id === "2" ? { ...node, state: "active" } : node.id === "4" ? { ...node, state: "frontier" } : node)),
      },
      callStack: ["visit(8)", "visit(4)", "visit(2)"],
      variables: { leafAnswer: 1 },
    }),
    base(algorithm, "tree", 4, 5, "Combine", "Return child answers to the parent.", "Most tree algorithms are a small combine formula applied at every node.", {
      tree: {
        ...tree,
        nodes: tree.nodes.map((node) => (["2", "6", "4"].includes(node.id) ? { ...node, state: "done" } : node)),
      },
      callStack: ["visit(8)", "combine(4)"],
      variables: { leftAnswer: 1, rightAnswer: 1, parentAnswer: 2 },
    }),
    base(algorithm, "tree", 5, 5, "Return root answer", "The root receives all subtree answers.", "Once the root combines its children, the whole tree's answer is known.", {
      tree: {
        ...tree,
        nodes: tree.nodes.map((node) => ({ ...node, state: "done" })),
      },
      callStack: ["return answer"],
      variables: { finalAnswer: "computed at root" },
    }),
  ];
}

function linkedListTrace(algorithm: AlgorithmEntry): TraceState[] {
  const list = [
    { id: "n1", value: 1, state: "done" },
    { id: "n2", value: 2, state: "active" },
    { id: "n3", value: 3, state: "frontier" },
    { id: "n4", value: 4, state: "unseen" },
  ];
  return [
    base(algorithm, "linked-list", 1, 5, "Pointers", "Linked-list algorithms are pointer choreography.", "Because nodes are not indexed, you must track references such as previous, current, and next.", {
      list,
      pointers: [
        { label: "prev", index: 0, tone: "emerald" },
        { label: "curr", index: 1, tone: "cyan" },
        { label: "next", index: 2, tone: "violet" },
      ],
      variables: { prev: 1, curr: 2, next: 3 },
    }),
    base(algorithm, "linked-list", 2, 5, "Save next", "Never overwrite the only path to the rest of the list.", "The common linked-list bug is changing curr.next before saving where it used to point.", {
      list,
      pointers: [{ label: "saved next", index: 2, tone: "amber" }],
      variables: { saved: "node 3" },
    }),
    base(algorithm, "linked-list", 3, 5, "Rewire", "Change one pointer at a time.", "After rewiring, the local relationship is correct even if the whole list is not finished yet.", {
      list: list.map((node) => (node.id === "n2" ? { ...node, state: "done" } : node)),
      pointers: [{ label: "curr.next -> prev", index: 1, tone: "emerald" }],
      variables: { rewired: "2 points to 1" },
    }),
    base(algorithm, "linked-list", 4, 5, "Advance", "Slide all helper pointers forward.", "Advancing restores the same problem shape on the remaining suffix.", {
      list: list.map((node, index) => (index <= 2 ? { ...node, state: "done" } : { ...node, state: "active" })),
      pointers: [
        { label: "prev", index: 2, tone: "emerald" },
        { label: "curr", index: 3, tone: "cyan" },
      ],
      variables: { prev: 3, curr: 4 },
    }),
    base(algorithm, "linked-list", 5, 5, "Head update", "Return the new head or final pointer.", "The answer is usually the pointer that survives after the scan finishes.", {
      list: [
        { id: "n4", value: 4, state: "done" },
        { id: "n3", value: 3, state: "done" },
        { id: "n2", value: 2, state: "done" },
        { id: "n1", value: 1, state: "done" },
      ],
      solution: [0],
      variables: { newHead: 4 },
    }),
  ];
}

function stackQueueTrace(algorithm: AlgorithmEntry): TraceState[] {
  return [
    base(algorithm, "stack-queue", 1, 5, "Read stream", "Process values in the order they arrive.", "Stacks and queues remember candidates whose answer depends on future input.", {
      values: [5, 1, 4, 2, 6],
      stack: [],
      queue: [],
      variables: { incoming: 5 },
    }),
    base(algorithm, "stack-queue", 2, 5, "Push candidate", "Keep unresolved values in the container.", "The container stores exactly the states we still need later.", {
      values: [5, 1, 4, 2, 6],
      stack: [5, 1],
      pointers: [{ label: "i", index: 1, tone: "cyan" }],
      variables: { stackTop: 1 },
    }),
    base(algorithm, "stack-queue", 3, 5, "Pop dominated", "Remove values that can no longer win.", "A monotonic container is powerful because one new value can resolve many older values at once.", {
      values: [5, 1, 4, 2, 6],
      stack: [5, 4],
      retired: [1],
      variables: { popped: 1, reason: "4 dominates 1" },
    }),
    base(algorithm, "stack-queue", 4, 5, "Use front/top", "The answer often lives at the front or top.", "Queues expose the oldest valid candidate; stacks expose the newest unresolved candidate.", {
      values: [5, 1, 4, 2, 6],
      stack: [5, 4, 2],
      variables: { currentAnswer: 5 },
    }),
    base(algorithm, "stack-queue", 5, 5, "Flush", "Finish any unresolved candidates.", "After the scan, remaining items get default answers or are returned as the final structure.", {
      values: [5, 1, 4, 2, 6],
      stack: [6],
      solution: [4],
      variables: { finalTop: 6 },
    }),
  ];
}

function heapTrace(algorithm: AlgorithmEntry): TraceState[] {
  return [
    base(algorithm, "heap", 1, 5, "Heap rule", "The root is always the current priority winner.", "A heap is not fully sorted; it only guarantees fast access to the min or max.", {
      heap: [3, 8, 5, 12, 10, 7],
      variables: { root: 3, mode: "min-heap" },
    }),
    base(algorithm, "heap", 2, 5, "Insert", "Add a value at the end, then bubble it upward.", "Bubble-up swaps with parents until the heap rule is restored.", {
      heap: [3, 8, 5, 12, 10, 7, 2],
      pointers: [{ label: "new", index: 6, tone: "amber" }],
      variables: { inserted: 2 },
    }),
    base(algorithm, "heap", 3, 5, "Restore priority", "The new value moves toward the root if it outranks its parent.", "Every swap repairs one local parent-child violation.", {
      heap: [2, 8, 3, 12, 10, 7, 5],
      pointers: [{ label: "root", index: 0, tone: "emerald" }],
      variables: { swaps: 2 },
    }),
    base(algorithm, "heap", 4, 5, "Extract", "Remove the root when the best priority is needed.", "The last value moves to the root, then sinks until the heap rule returns.", {
      heap: [3, 8, 5, 12, 10, 7],
      solution: [0],
      variables: { extracted: 2 },
    }),
    base(algorithm, "heap", 5, 5, "Repeat", "Each operation keeps the heap ready for the next priority query.", "This is why heap-based algorithms are fast for top-k, streams, and shortest paths.", {
      heap: [3, 8, 5, 12, 10, 7],
      variables: { nextPriority: 3 },
    }),
  ];
}

function recursionTrace(algorithm: AlgorithmEntry): TraceState[] {
  return [
    base(algorithm, "recursion", 1, 5, "Choose", "Pick one decision point.", "Backtracking explores a decision tree: choose, recurse, undo.", {
      recursionFrames: [
        { label: "solve([])", state: "active" },
      ],
      choices: ["A", "B", "C"],
      variables: { path: "[]" },
    }),
    base(algorithm, "recursion", 2, 5, "Go deeper", "Add a choice and solve the smaller remaining problem.", "The call stack remembers where to return after the deeper choice finishes.", {
      recursionFrames: [
        { label: "solve([])", state: "waiting" },
        { label: "solve([A])", state: "active" },
      ],
      choices: ["B", "C"],
      variables: { path: "[A]" },
    }),
    base(algorithm, "recursion", 3, 5, "Base case", "Stop when the partial answer is complete or invalid.", "Base cases turn a branch into either a recorded answer or a dead end.", {
      recursionFrames: [
        { label: "solve([])", state: "waiting" },
        { label: "solve([A])", state: "waiting" },
        { label: "solve([A, B])", state: "active" },
      ],
      variables: { completed: "[A, B]" },
      solution: ["[A, B]"],
    }),
    base(algorithm, "recursion", 4, 5, "Backtrack", "Undo the last choice before trying the next one.", "Without undoing, sibling branches would inherit state that does not belong to them.", {
      recursionFrames: [
        { label: "solve([])", state: "waiting" },
        { label: "solve([A])", state: "active" },
      ],
      variables: { undo: "remove B", nextChoice: "C" },
    }),
    base(algorithm, "recursion", 5, 5, "Search complete", "All valid branches have been explored.", "The collected answers are exactly the branches that reached a successful base case.", {
      recursionFrames: [
        { label: "solve([])", state: "done" },
      ],
      variables: { answers: 3 },
    }),
  ];
}

function trieTrace(algorithm: AlgorithmEntry): TraceState[] {
  return [
    base(algorithm, "trie", 1, 5, "Root", "Start from an empty prefix.", "A trie stores one character per edge, so common prefixes are shared.", {
      tree: {
        nodes: [{ id: "root", label: "*", level: 0, position: 0, state: "active" }],
        edges: [],
      },
      variables: { word: "cat", prefix: "" },
    }),
    base(algorithm, "trie", 2, 5, "Insert c", "Create or follow the next character node.", "If the edge already exists, reuse it instead of creating duplicate prefix storage.", {
      tree: {
        nodes: [
          { id: "root", label: "*", level: 0, position: 0, state: "done" },
          { id: "c", label: "c", level: 1, position: 0, state: "active" },
        ],
        edges: [{ from: "root", to: "c" }],
      },
      variables: { prefix: "c" },
    }),
    base(algorithm, "trie", 3, 5, "Share prefix", "Words with the same prefix travel through the same nodes.", "This is what makes prefix lookup fast.", {
      tree: {
        nodes: [
          { id: "root", label: "*", level: 0, position: 0, state: "done" },
          { id: "c", label: "c", level: 1, position: 0, state: "done" },
          { id: "a", label: "a", level: 2, position: 0, state: "active" },
        ],
        edges: [{ from: "root", to: "c" }, { from: "c", to: "a" }],
      },
      variables: { prefix: "ca" },
    }),
    base(algorithm, "trie", 4, 5, "Mark word end", "A terminal marker separates full words from mere prefixes.", "The path c-a-t can represent the prefix ca and the complete word cat at the same time.", {
      tree: {
        nodes: [
          { id: "root", label: "*", level: 0, position: 0, state: "done" },
          { id: "c", label: "c", level: 1, position: 0, state: "done" },
          { id: "a", label: "a", level: 2, position: 0, state: "done" },
          { id: "t", label: "t", level: 3, position: 0, state: "active" },
        ],
        edges: [{ from: "root", to: "c" }, { from: "c", to: "a" }, { from: "a", to: "t" }],
      },
      variables: { isWordEnd: true },
    }),
    base(algorithm, "trie", 5, 5, "Query", "Search follows the same character path.", "A missing edge means the word or prefix cannot exist in the trie.", {
      tree: {
        nodes: [
          { id: "root", label: "*", level: 0, position: 0, state: "done" },
          { id: "c", label: "c", level: 1, position: 0, state: "done" },
          { id: "a", label: "a", level: 2, position: 0, state: "done" },
          { id: "t", label: "t", level: 3, position: 0, state: "done" },
        ],
        edges: [{ from: "root", to: "c" }, { from: "c", to: "a" }, { from: "a", to: "t" }],
      },
      solution: ["cat"],
      variables: { found: true },
    }),
  ];
}

function bitTrace(algorithm: AlgorithmEntry): TraceState[] {
  return [
    base(algorithm, "bit", 1, 5, "Binary view", "Write numbers as bits so each position can be reasoned about independently.", "Bit algorithms use CPU-friendly operations such as AND, OR, XOR, shifts, and masks.", {
      bits: [
        { label: "x", value: "10110" },
        { label: "mask", value: "00100" },
      ],
      variables: { x: 22, mask: 4 },
    }),
    base(algorithm, "bit", 2, 5, "Test bit", "AND with a mask checks whether a position is on.", "Only the masked bit survives the operation.", {
      bits: [
        { label: "x", value: "10110" },
        { label: "x & mask", value: "00100", active: [2] },
      ],
      variables: { result: 4, bitIsSet: true },
    }),
    base(algorithm, "bit", 3, 5, "Toggle or clear", "XOR toggles bits and x & (x - 1) clears the lowest set bit.", "These tiny formulas replace slower loops over individual digits.", {
      bits: [
        { label: "x", value: "10110" },
        { label: "x - 1", value: "10101" },
        { label: "x & (x - 1)", value: "10100" },
      ],
      variables: { clearedLowestSetBit: true },
    }),
    base(algorithm, "bit", 4, 5, "Accumulate", "Repeat until the required property is measured.", "Counting, parity, subsets, and XOR tricks all build from this same bit-level view.", {
      bits: [{ label: "running xor", value: "11101" }],
      variables: { setBitsSeen: 3 },
    }),
    base(algorithm, "bit", 5, 5, "Return", "Convert the bit result back to the requested answer.", "The binary representation is the reasoning tool; the returned value matches the problem format.", {
      bits: [{ label: "answer", value: "11101" }],
      variables: { answer: 29 },
    }),
  ];
}

function stringTrace(algorithm: AlgorithmEntry): TraceState[] {
  const chars = ["c", "o", "d", "e", "v", "e", "r", "s", "e"];
  return [
    base(algorithm, "string", 1, 5, "Characters", "Treat the string as an indexed sequence.", "Most string algorithms compare, count, or reuse information about neighboring characters.", {
      chars,
      pointers: [{ label: "i", index: 0, tone: "cyan" }],
      variables: { current: "c" },
    }),
    base(algorithm, "string", 2, 5, "Compare", "Move pointers according to the matching rule.", "Two-pointer, prefix, and pattern algorithms differ in how much past matching work they reuse.", {
      chars,
      pointers: [
        { label: "left", index: 3, tone: "cyan" },
        { label: "right", index: 5, tone: "violet" },
      ],
      variables: { compared: "e vs e", match: true },
    }),
    base(algorithm, "string", 3, 5, "Reuse prefix", "Avoid restarting from scratch after partial matches.", "Good string algorithms remember what a previous comparison already proved.", {
      chars,
      window: { left: 0, right: 3 },
      variables: { prefixLength: 2, fallback: 1 },
    }),
    base(algorithm, "string", 4, 5, "Update answer", "Record the best match, count, or transformed segment.", "The algorithm keeps the exact state required by the problem, not extra noise.", {
      chars,
      solution: [3, 4, 5],
      variables: { bestSegment: "eve" },
    }),
    base(algorithm, "string", 5, 5, "Finish", "All characters have been consumed consistently.", "The result follows from the maintained invariant over the scan.", {
      chars,
      variables: { answer: "computed string result" },
    }),
  ];
}

function mathTrace(algorithm: AlgorithmEntry): TraceState[] {
  return [
    base(algorithm, "math", 1, 5, "Represent", "Convert the number problem into a repeatable operation.", "Math algorithms usually shrink the number, factor it, or derive a formula.", {
      values: [9876],
      variables: { n: 9876 },
    }),
    base(algorithm, "math", 2, 5, "Extract", "Use modulo or division to isolate useful pieces.", "For digit problems, n % 10 gives the last digit and floor(n / 10) removes it.", {
      values: [9, 8, 7, 6],
      pointers: [{ label: "digit", index: 3, tone: "amber" }],
      variables: { lastDigit: 6, remaining: 987 },
    }),
    base(algorithm, "math", 3, 5, "Update formula", "Accumulate the result using the derived relationship.", "The algorithm is correct when each update preserves the same mathematical meaning.", {
      values: [6, 7],
      variables: { accumulator: 13 },
    }),
    base(algorithm, "math", 4, 5, "Reduce", "Keep shrinking until the base condition is reached.", "Each iteration removes a digit, factor, divisor range, or search interval.", {
      values: [9, 8],
      variables: { remaining: 98, stepsLeft: 2 },
    }),
    base(algorithm, "math", 5, 5, "Answer", "Return the accumulated value or final formula result.", "The simulation ends when no meaningful input remains to process.", {
      values: [9, 8, 7, 6],
      solution: [0, 1, 2, 3],
      variables: { answer: "derived result" },
    }),
  ];
}

function greedyTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [1, 3, 4, 8, 9];
  return [
    base(algorithm, "greedy", 1, 5, "Local choice", "Pick the option that is safest right now.", "A greedy algorithm works only when the local choice can be proven not to hurt the future.", {
      values,
      pointers: [{ label: "candidate", index: 0, tone: "cyan" }],
      variables: { chosen: 1 },
    }),
    base(algorithm, "greedy", 2, 5, "Prove safety", "Explain why alternatives can be ignored.", "The exchange argument says any optimal solution can be changed to include this choice without becoming worse.", {
      values,
      retired: [1],
      variables: { skipped: 3, reason: "less flexible than current choice" },
    }),
    base(algorithm, "greedy", 3, 5, "Commit", "Once safe, lock the choice and reduce the problem.", "Greedy algorithms do not backtrack; correctness comes from the proof that commitment is safe.", {
      values,
      solution: [0, 2],
      variables: { committed: "1, 4" },
    }),
    base(algorithm, "greedy", 4, 5, "Repeat", "Apply the same safe choice rule to the remaining input.", "Each step keeps the partial answer extendable to an optimal solution.", {
      values,
      pointers: [{ label: "next", index: 3, tone: "violet" }],
      variables: { partialAnswer: 2 },
    }),
    base(algorithm, "greedy", 5, 5, "Optimal result", "The final answer is built entirely from safe local choices.", "The proof is as important as the implementation for greedy problems.", {
      values,
      solution: [0, 2, 4],
      variables: { answer: "optimal greedy set" },
    }),
  ];
}

function arrayTrace(algorithm: AlgorithmEntry): TraceState[] {
  const values = [3, -2, 5, -1, 6, -3];
  return [
    base(algorithm, "array", 1, 5, "Scan", "Start with a clear running state.", "Most array algorithms are a disciplined scan plus a small amount of memory.", {
      values,
      pointers: [{ label: "i", index: 0, tone: "cyan" }],
      variables: { current: 3, best: 3 },
    }),
    base(algorithm, "array", 2, 5, "Update", "Use the current value to update the running state.", "The update should be explainable using only what has already been scanned.", {
      values,
      pointers: [{ label: "i", index: 2, tone: "amber" }],
      window: { left: 0, right: 2 },
      variables: { current: 6, best: 6 },
    }),
    base(algorithm, "array", 3, 5, "Branch", "If a rule is broken, repair the state immediately.", "Good array scans keep the invariant true after every index.", {
      values,
      pointers: [{ label: "i", index: 3, tone: "rose" }],
      variables: { value: -1, action: "adjust running state" },
    }),
    base(algorithm, "array", 4, 5, "Record best", "Only record answers when the current state is valid.", "This prevents accidental answers from partially processed data.", {
      values,
      pointers: [{ label: "i", index: 4, tone: "emerald" }],
      solution: [0, 1, 2, 3, 4],
      variables: { best: 11 },
    }),
    base(algorithm, "array", 5, 5, "Finish", "After the last index, return the recorded answer.", "The scan has covered every element exactly once.", {
      values,
      solution: [0, 2, 4],
      variables: { answer: "best recorded state" },
    }),
  ];
}

function detectVisualFamily(algorithm: AlgorithmEntry): VisualFamily {
  const text = normalize(
    `${algorithm.id} ${algorithm.title} ${algorithm.topic} ${algorithm.category} ${algorithm.overview} ${algorithm.approaches
      .map((approach) => approach.name)
      .join(" ")}`
  );

  if (match(text, ["matrix", "grid", "island", "cell"])) return "matrix";
  if (match(text, ["trie", "prefix tree"])) return "trie";
  if (match(text, ["linked list", "linkedlist", "ll", "node pointer"])) return "linked-list";
  if (match(text, ["graph", "shortest path", "dijkstra", "bellman", "floyd", "mst", "kruskal", "prim", "bfs", "dfs", "topological", "course schedule"])) return "graph";
  if (match(text, ["heap", "priority queue", "top k", "median from data stream"])) return "heap";
  if (match(text, ["tree", "bst", "binary search tree", "lowest common ancestor", "diameter", "ancestor"])) return "tree";
  if (match(text, ["dynamic programming", " dp ", "kadane", "knapsack", "subsequence", "memo", "tabulation", "stock buy and sell"])) return "dynamic-programming";
  if (match(text, ["binary search", "lower bound", "upper bound", "rotated sorted", "koko", "ship packages", "sqrt", "peak element"])) return "binary-search";
  if (match(text, ["sliding window", "window", "longest substring", "minimum window"])) return "sliding-window";
  if (match(text, ["two pointer", "two pointers", "two sum", "3sum", "4sum", "palindrome", "container with most water"])) return "two-pointers";
  if (match(text, ["next permutation", "merge intervals", "sort", "sorting", "inversion", "colors"])) return "sorting";
  if (match(text, ["backtracking", "recursion", "recursive", "subsets", "permutation", "combination", "sudoku", "n queen"])) return "recursion";
  if (match(text, ["prefix", "subarray sum", "xor", "hashing"])) return "prefix";
  if (match(text, ["stack", "queue", "deque", "monotonic", "lru", "next greater", "asteroid"])) return "stack-queue";
  if (match(text, ["bit", "xor", "set bit", "single number", "power of two"])) return "bit";
  if (match(text, ["string", "anagram", "substring", "palindrome", "word", "roman", "atoi"])) return "string";
  if (match(text, ["sort", "sorting", "merge intervals", "next permutation", "inversion", "colors"])) return "sorting";
  if (match(text, ["greedy", "interval", "jump game", "lemonade", "meeting", "candy", "assign cookies"])) return "greedy";
  if (match(text, ["math", "digit", "prime", "gcd", "lcm", "power", "sqrt"])) return "math";
  return "array";
}

function match(text: string, terms: string[]) {
  return terms.some((term) => {
    const normalized = normalize(term).trim();
    return normalized.length > 0 && text.includes(` ${normalized} `);
  });
}

function normalize(value: string) {
  return ` ${value.toLowerCase().replace(/[^a-z0-9+#]+/g, " ")} `;
}

function familyLabel(family: VisualFamily) {
  return family
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function beginnerPrompt(family: VisualFamily) {
  const prompts: Record<VisualFamily, string> = {
    array: "Watch the highlighted index and ask: what information has the scan proven so far?",
    "two-pointers": "Before a pointer moves, ask which side has been mathematically ruled out.",
    "sliding-window": "Track what enters and leaves the window; the running state changes only at the edges.",
    "binary-search": "After every middle check, name the half that cannot contain the answer.",
    prefix: "Focus on the running prefix and the remembered history map.",
    sorting: "Watch comparisons become ordered regions.",
    matrix: "Name the active row, column, and boundary before each move.",
    "dynamic-programming": "Read every DP cell as a smaller question that has already been answered.",
    graph: "Follow the frontier; it tells you what the algorithm will explore next.",
    tree: "Follow the call stack from parent to child and back to the parent.",
    "linked-list": "Track prev, curr, and next. Losing next means losing the rest of the list.",
    "stack-queue": "The container holds unresolved candidates; each pop has a reason.",
    heap: "The root is the priority winner; every swap restores that promise.",
    recursion: "Say choose, recurse, undo out loud for each branch.",
    trie: "Each character moves one level deeper in a shared prefix tree.",
    bit: "Read the binary rows vertically; one column is one bit position.",
    string: "Watch indexes and remembered prefix/match information.",
    math: "Track how the number shrinks or how the formula accumulates.",
    greedy: "Ask why the current local choice is safe forever.",
  };
  return prompts[family];
}

function invariantFor(family: VisualFamily) {
  const invariants: Record<VisualFamily, string> = {
    array: "After processing index i, the running state summarizes exactly the prefix seen so far.",
    "two-pointers": "Everything outside the pointers has already been proven impossible or finalized.",
    "sliding-window": "The window boundaries enclose the only live candidates.",
    "binary-search": "The answer, if it exists, is always inside the current low/high range.",
    prefix: "The memory map contains prefix facts from earlier indices only.",
    sorting: "The finalized region is already in the correct relative order.",
    matrix: "Every visited cell is either finalized or deliberately marked for a later update.",
    "dynamic-programming": "Every cell used by the transition is already solved.",
    graph: "Visited nodes never need to be rediscovered with weaker information.",
    tree: "Each subtree returns a complete answer to its parent.",
    "linked-list": "All nodes behind prev are safely rewired or finalized.",
    "stack-queue": "The container contains only candidates that are still useful.",
    heap: "Every parent outranks its children according to the heap rule.",
    recursion: "The current path contains exactly the choices on the active branch.",
    trie: "The current node represents the prefix formed by the path from the root.",
    bit: "Each bit operation changes only the positions selected by the mask or operator.",
    string: "The processed prefix has no hidden unmatched work.",
    math: "The accumulator plus remaining input still represents the original problem.",
    greedy: "The committed choices can still be extended to an optimal answer.",
  };
  return invariants[family];
}

function focusFor(family: VisualFamily) {
  const focus: Record<VisualFamily, string> = {
    array: "current index",
    "two-pointers": "left and right boundaries",
    "sliding-window": "window edges",
    "binary-search": "low, mid, high",
    prefix: "prefix sum and memory",
    sorting: "comparison and ordered regions",
    matrix: "active cell coordinates",
    "dynamic-programming": "state transition",
    graph: "frontier expansion",
    tree: "subtree return value",
    "linked-list": "pointer rewiring",
    "stack-queue": "container top/front",
    heap: "heap root and swaps",
    recursion: "call stack branch",
    trie: "prefix path",
    bit: "active bit columns",
    string: "character pointers",
    math: "shrinking number",
    greedy: "safe local choice",
  };
  return focus[family];
}
