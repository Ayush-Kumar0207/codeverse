import type { AlgorithmEntry } from "@/data/algos";

const TWO_SUM_CINEMATIC_VISUALIZER = "two-sum-cinematic-3d";

export function hasCinematicVisualizer(algorithm: Pick<AlgorithmEntry, "id">) {
  return algorithm.id === "two-sum";
}

export function getCinematicVisualizerCode(algorithm: AlgorithmEntry) {
  if (!hasCinematicVisualizer(algorithm)) return "";

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
      headline: "Two search pilots start at the outside values",
      narrative:
        "The array is sorted, so the smallest value stands on the left edge and the largest value stands on the right edge. Their sum tells us which boundary can be safely moved.",
      beginnerPrompt: "Watch the two glowing pointers. They are not guessing; every move removes impossible pairs.",
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
        lesson: "A high sum means the right value is too heavy.",
      },
    },
    {
      visualizer: TWO_SUM_CINEMATIC_VISUALIZER,
      kind: "two-pointers",
      step: 2,
      totalSteps: 5,
      progress: 40,
      phase: "Remove the heavy side",
      headline: "The right pointer retreats from 20 to 15",
      narrative:
        "Since 1 plus 20 is already too large, keeping 20 with any larger left value can never help. The right boundary moves inward to lower the sum.",
      beginnerPrompt: "Notice how an entire region fades out. That is the proof, not just an animation.",
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
        lesson: "After lowering the right side, the pair becomes too small.",
      },
    },
    {
      visualizer: TWO_SUM_CINEMATIC_VISUALIZER,
      kind: "two-pointers",
      step: 3,
      totalSteps: 5,
      progress: 60,
      phase: "Lift the light side",
      headline: "The left pointer advances because 1 + 15 is too small",
      narrative:
        "A low sum means the left value is too small. Moving the right pointer left would only make the sum even smaller, so the left pointer must move right.",
      beginnerPrompt: "The left side lights up because the algorithm needs a larger number, not a different random pair.",
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
        lesson: "The search window tightens from both ends.",
      },
    },
    {
      visualizer: TWO_SUM_CINEMATIC_VISUALIZER,
      kind: "two-pointers",
      step: 4,
      totalSteps: 5,
      progress: 80,
      phase: "Pinch the search space",
      headline: "The right pointer slides again to test 4 + 10",
      narrative:
        "The pair 4 and 15 is too high, so the larger side retreats. The window has shrunk to the only candidates that can still make the target.",
      beginnerPrompt: "The shrinking golden lane is the remaining search space. Everything outside it has a reason to be gone.",
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
        lesson: "Only the middle corridor remains alive.",
      },
    },
    {
      visualizer: TWO_SUM_CINEMATIC_VISUALIZER,
      kind: "two-pointers",
      step: 5,
      totalSteps: 5,
      progress: 100,
      phase: "Lock the answer",
      headline: "The pointers land on 7 and 10",
      narrative:
        "The left pointer reaches 7 and the right pointer stays at 10. Their bridge lights green because 7 + 10 exactly equals the target.",
      beginnerPrompt: "This is the whole idea in one picture: sorted order lets the two pointers squeeze until the correct pair is forced.",
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
        lesson: "The bridge equals the target gate.",
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
