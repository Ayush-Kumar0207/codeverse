import type { AlgorithmEntry } from "@/data/algos";

const TWO_SUM_CINEMATIC_VISUALIZER = "two-sum-cinematic-3d";
const UNIVERSAL_CINEMATIC_VISUALIZER = "codeverse-cinematic-3d";

const CINEMATIC_ALGORITHM_IDS = new Set([
  "two-sum",
  "kadanes-algorithm",
  "sort-an-array-of-0-s-1-s-and-2-s",
  "subarray-sum-equals-k",
  "merge-intervals",
  "next-permutation",
  "find-the-duplicate-number",
  "majority-element-n-2-times",
  "best-time-to-buy-and-sell-stock",
  "rearrange-array-elements-by-sign",
]);

export function hasCinematicVisualizer(algorithm: Pick<AlgorithmEntry, "id">) {
  return CINEMATIC_ALGORITHM_IDS.has(algorithm.id);
}
export function getCinematicVisualizerCode(algorithm: AlgorithmEntry) {
  if (!hasCinematicVisualizer(algorithm)) return "";
  if (algorithm.id !== "two-sum") return getUniversalCinematicVisualizerCode(algorithm);

  const payload = {
    id: algorithm.id,
    title: algorithm.title,
    topic: algorithm.topic,
    difficulty: algorithm.difficulty,
    family: "Two pointers",
    timeComplexity: algorithm.approaches[0]?.timeComplexity || "O(N)",
    spaceComplexity: algorithm.approaches[0]?.spaceComplexity || "O(1)",
    simulationProfile: "CodeVerse Cinematic 3D prototype",
  };

  const values = [1, 4, 7, 10, 15, 20];
  const target = 17;
  const steps = [
    {
      visualizer: TWO_SUM_CINEMATIC_VISUALIZER,
      kind: "two-pointers",
      step: 1,
      totalSteps: 5,
      progress: 20,
      phase: "Set the boundaries",
      headline: "Place the two pointers on the sorted edges",
      narrative:
        "Sorted order gives the scene a direction: the smallest candidate starts on the left, the largest on the right, and their sum decides which edge can move.",
      beginnerPrompt: "Watch the highlighted pair only. The algorithm is not guessing; each comparison proves one boundary can be removed.",
      invariant:
        "All valid answers, if one still exists, must stay between the left and right pointers.",
      decision: "1 + 20 = 21, which is larger than the target 17.",
      implementationFocus: "left = 0; right = nums.length - 1",
      values,
      target,
      pointers: [
        { label: "left", index: 0, tone: "cyan" },
        { label: "right", index: 5, tone: "violet" },
      ],
      window: { left: 0, right: 5 },
      variables: { left: 0, right: 5, currentSum: 21, target },
      cinematic: {
        sum: 21,
        comparison: "too-high",
        cue: "wide",
        eliminated: [],
        spotlight: [0, 5],
        lesson: "A high sum proves the right edge must move inward.",
      },
    },
    {
      visualizer: TWO_SUM_CINEMATIC_VISUALIZER,
      kind: "two-pointers",
      step: 2,
      totalSteps: 5,
      progress: 40,
      phase: "Remove the heavy side",
      headline: "Move the right pointer from 20 to 15",
      narrative:
        "Because 1 plus 20 is already too large, pairing 20 with any larger left value would only get worse. The clean move is to lower the right edge.",
      beginnerPrompt: "The faded tower is not decoration. It is the part of the search space that has just been mathematically ruled out.",
      invariant:
        "Every faded pair with value 20 is impossible because all future left values are at least 1.",
      decision: "Discard index 5 and try a smaller right value.",
      implementationFocus: "if (sum > target) right--",
      values,
      target,
      pointers: [
        { label: "left", index: 0, tone: "cyan" },
        { label: "right", index: 4, tone: "violet" },
      ],
      retired: [5],
      window: { left: 0, right: 4 },
      variables: { left: 0, right: 4, currentSum: 16, move: "right--" },
      cinematic: {
        sum: 16,
        comparison: "too-low",
        cue: "right-retreat",
        eliminated: [5],
        spotlight: [0, 4],
        lesson: "After lowering the right edge, the active pair becomes too small.",
      },
    },
    {
      visualizer: TWO_SUM_CINEMATIC_VISUALIZER,
      kind: "two-pointers",
      step: 3,
      totalSteps: 5,
      progress: 60,
      phase: "Lift the light side",
      headline: "Move the left pointer because 1 + 15 is too small",
      narrative:
        "A low sum means the left value is holding the pair down. Moving the right pointer left would shrink the sum again, so the left pointer must advance.",
      beginnerPrompt: "The left edge moves because the algorithm needs a larger number, not because it is trying a random pair.",
      invariant:
        "Any pair using index 0 with the remaining right values is too small or already tested, so index 0 can retire.",
      decision: "Move left from value 1 to value 4.",
      implementationFocus: "if (sum < target) left++",
      values,
      target,
      pointers: [
        { label: "left", index: 1, tone: "cyan" },
        { label: "right", index: 4, tone: "violet" },
      ],
      retired: [0, 5],
      window: { left: 1, right: 4 },
      variables: { left: 1, right: 4, currentSum: 19, move: "left++" },
      cinematic: {
        sum: 19,
        comparison: "too-high",
        cue: "left-advance",
        eliminated: [0, 5],
        spotlight: [1, 4],
        lesson: "The remaining corridor tightens from both ends.",
      },
    },
    {
      visualizer: TWO_SUM_CINEMATIC_VISUALIZER,
      kind: "two-pointers",
      step: 4,
      totalSteps: 5,
      progress: 80,
      phase: "Pinch the search space",
      headline: "Move the right pointer again to test 4 + 10",
      narrative:
        "The pair 4 and 15 overshoots the target, so the larger side retreats. What remains is a small corridor of candidates that still deserve attention.",
      beginnerPrompt: "The highlighted lane is the remaining search space. Everything outside it has already been eliminated by a comparison.",
      invariant:
        "The answer, if present, must be inside indices 1 through 3 after removing proven-too-small and proven-too-large edges.",
      decision: "Try a smaller right value and keep the scan ordered.",
      implementationFocus: "right-- after a high comparison",
      values,
      target,
      pointers: [
        { label: "left", index: 1, tone: "cyan" },
        { label: "right", index: 3, tone: "violet" },
      ],
      retired: [0, 4, 5],
      window: { left: 1, right: 3 },
      variables: { left: 1, right: 3, currentSum: 14, remainingWindow: "indices 1..3" },
      cinematic: {
        sum: 14,
        comparison: "too-low",
        cue: "right-retreat",
        eliminated: [0, 4, 5],
        spotlight: [1, 3],
        lesson: "Only the middle corridor can still contain the answer.",
      },
    },
    {
      visualizer: TWO_SUM_CINEMATIC_VISUALIZER,
      kind: "two-pointers",
      step: 5,
      totalSteps: 5,
      progress: 100,
      phase: "Lock the answer",
      headline: "The pointers lock onto 7 and 10",
      narrative:
        "The left pointer reaches 7 while the right pointer holds 10. The comparison bridge turns green because the active sum exactly equals the target.",
      beginnerPrompt: "This is the full strategy in one picture: sorted order lets both pointers squeeze the search space until the answer is forced.",
      invariant:
        "The active pair matches the target, so the algorithm can stop immediately.",
      decision: "Return indices 2 and 3, values 7 and 10.",
      implementationFocus: "if (sum === target) return [left, right]",
      values,
      target,
      pointers: [
        { label: "left", index: 2, tone: "emerald" },
        { label: "right", index: 3, tone: "emerald" },
      ],
      retired: [0, 1, 4, 5],
      solution: [2, 3],
      window: { left: 2, right: 3 },
      variables: { left: 2, right: 3, currentSum: 17, answer: "[7, 10]" },
      cinematic: {
        sum: 17,
        comparison: "match",
        cue: "solution",
        eliminated: [0, 1, 4, 5],
        spotlight: [2, 3],
        lesson: "The bridge turns green because the active sum equals the target.",
      },
    },
  ];

  return [
    "// CodeVerse cinematic 3D visual simulation.",
    "// This file records a Two Sum trace that the 3D renderer turns into an interactive scene.",
    `const algorithm = ${JSON.stringify(payload, null, 2)};`,
    `const trace = ${JSON.stringify(steps, null, 2)};`,
    "",
    "for (const state of trace) {",
    "  recordTrace({ algorithm, ...state });",
    "}",
  ].join("\n");
}

const UNIVERSAL_CINEMATIC_PROFILES: Record<string, { title: string; family: string; mode: string; palette: Record<string, string> }> = {
  "kadanes-algorithm": {
    title: "Kadane running energy field",
    family: "Array DP",
    mode: "Live subarray",
    palette: { primary: "#34d399", secondary: "#22d3ee", accent: "#fbbf24", danger: "#fb7185", success: "#6ee7b7", neutral: "#2563eb" },
  },
  "sort-an-array-of-0-s-1-s-and-2-s": {
    title: "Dutch flag partition stage",
    family: "Sorting",
    mode: "Partition zones",
    palette: { primary: "#22d3ee", secondary: "#a78bfa", accent: "#fbbf24", danger: "#fb7185", success: "#34d399", neutral: "#2563eb" },
  },
  "subarray-sum-equals-k": {
    title: "Prefix ledger corridor",
    family: "Prefix sums",
    mode: "Prefix ledger",
    palette: { primary: "#38bdf8", secondary: "#818cf8", accent: "#facc15", danger: "#f472b6", success: "#2dd4bf", neutral: "#1d4ed8" },
  },
  "merge-intervals": {
    title: "Interval timeline merge",
    family: "Intervals",
    mode: "Timeline merge",
    palette: { primary: "#60a5fa", secondary: "#c084fc", accent: "#f59e0b", danger: "#fb7185", success: "#34d399", neutral: "#334155" },
  },
  "next-permutation": {
    title: "Permutation pivot theater",
    family: "Arrays",
    mode: "Pivot and suffix",
    palette: { primary: "#2dd4bf", secondary: "#f0abfc", accent: "#fde047", danger: "#fb7185", success: "#4ade80", neutral: "#2563eb" },
  },
  "find-the-duplicate-number": {
    title: "Cycle chase arena",
    family: "Cycle detection",
    mode: "Cycle chase",
    palette: { primary: "#38bdf8", secondary: "#a78bfa", accent: "#fbbf24", danger: "#fb7185", success: "#34d399", neutral: "#1e40af" },
  },
  "majority-element-n-2-times": {
    title: "Majority vote balance",
    family: "Voting",
    mode: "Vote balance",
    palette: { primary: "#22d3ee", secondary: "#f9a8d4", accent: "#fcd34d", danger: "#fb7185", success: "#86efac", neutral: "#2563eb" },
  },
  "best-time-to-buy-and-sell-stock": {
    title: "Profit skyline scan",
    family: "Greedy",
    mode: "Profit scan",
    palette: { primary: "#2dd4bf", secondary: "#93c5fd", accent: "#fbbf24", danger: "#f43f5e", success: "#34d399", neutral: "#1d4ed8" },
  },
  "rearrange-array-elements-by-sign": {
    title: "Sign weave lanes",
    family: "Arrays",
    mode: "Positive-negative weave",
    palette: { primary: "#22d3ee", secondary: "#c084fc", accent: "#fbbf24", danger: "#fb7185", success: "#34d399", neutral: "#2563eb" },
  },
};

function getUniversalCinematicVisualizerCode(algorithm: AlgorithmEntry) {
  const source = algorithm.visualizerCode?.trim();
  if (!source) return "";

  const profile = UNIVERSAL_CINEMATIC_PROFILES[algorithm.id] || {
    title: `${algorithm.title} cinematic stage`,
    family: algorithm.category || algorithm.topic || "Algorithm",
    mode: "Shared 3D grammar",
    palette: { primary: "#22d3ee", secondary: "#a78bfa", accent: "#fbbf24", danger: "#fb7185", success: "#34d399", neutral: "#2563eb" },
  };

  return [
    "// CodeVerse shared cinematic 3D visual simulation.",
    "// This file reuses the generated trace and renders it through reusable 3D props.",
    `const cinematic3d = ${JSON.stringify({ id: algorithm.id, ...profile }, null, 2)};`,
    "const capturedTrace = [];",
    "((recordTrace) => {",
    indentCode(source),
    "})((state) => capturedTrace.push(state));",
    "",
    "for (const state of capturedTrace) {",
    `  recordTrace({ ...state, visualizer: "${UNIVERSAL_CINEMATIC_VISUALIZER}", cinematic3d });`,
    "}",
  ].join("\n");
}

function indentCode(code: string) {
  return code
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
}
