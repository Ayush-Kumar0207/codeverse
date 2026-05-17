// CodeVerse generated visual simulation.
// Run this file in AlgoTrace to watch the algorithm move one decision at a time.
const algorithm = {
  "id": "kadanes-algorithm",
  "title": "Kadane's Algorithm (Max Subarray Sum)",
  "topic": "Arrays - Medium",
  "difficulty": "Medium",
  "family": "Array",
  "timeComplexity": "O(N)",
  "spaceComplexity": "O(1)",
  "simulationProfile": "Algorithm-specific trace"
};
const trace = [
  {
    "simulationId": "kadanes-algorithm:step-1",
    "problemLens": "Kadane's Algorithm (Max Subarray Sum): Finding the contiguous subarray within a one-dimensional array of numbers which has the largest sum.",
    "implementationFocus": "currentSum = max(num, currentSum + num); maxSum = max(maxSum, currentSum)",
    "visualizer": "CodeVerse Universal Trace",
    "kind": "array",
    "step": 1,
    "totalSteps": 6,
    "progress": 17,
    "phase": "Start running sum",
    "headline": "Initialize the best answer and the current subarray at the first value.",
    "narrative": "Kadane's algorithm asks at every index: should I extend the previous subarray or start fresh here?",
    "beginnerPrompt": "Watch the highlighted index and ask: what information has the scan proven so far?",
    "invariant": "After processing index i, the running state summarizes exactly the prefix seen so far.",
    "focus": "current index",
    "values": [
      -2,
      1,
      -3,
      4,
      -1,
      2,
      1,
      -5,
      4
    ],
    "pointers": [
      {
        "label": "i",
        "index": 0,
        "tone": "cyan"
      }
    ],
    "window": {
      "left": 0,
      "right": 0
    },
    "variables": {
      "approach": "Optimal (Kadane's Dynamic Approach)",
      "currentSum": -2,
      "bestSum": -2
    },
    "decision": "The first value is the only subarray we know so far."
  },
  {
    "simulationId": "kadanes-algorithm:step-2",
    "problemLens": "Kadane's Algorithm (Max Subarray Sum): Finding the contiguous subarray within a one-dimensional array of numbers which has the largest sum.",
    "implementationFocus": "currentSum = max(num, currentSum + num); maxSum = max(maxSum, currentSum)",
    "visualizer": "CodeVerse Universal Trace",
    "kind": "array",
    "step": 2,
    "totalSteps": 6,
    "progress": 33,
    "phase": "Fresh start",
    "headline": "At value 1, extending -2 would make the sum worse, so start a new subarray.",
    "narrative": "A negative carry hurts every future extension, so dropping it is safe.",
    "beginnerPrompt": "Watch the highlighted index and ask: what information has the scan proven so far?",
    "invariant": "After processing index i, the running state summarizes exactly the prefix seen so far.",
    "focus": "current index",
    "values": [
      -2,
      1,
      -3,
      4,
      -1,
      2,
      1,
      -5,
      4
    ],
    "pointers": [
      {
        "label": "i",
        "index": 1,
        "tone": "emerald"
      }
    ],
    "window": {
      "left": 1,
      "right": 1
    },
    "retired": [
      0
    ],
    "variables": {
      "approach": "Optimal (Kadane's Dynamic Approach)",
      "extend": -1,
      "startFresh": 1,
      "currentSum": 1,
      "bestSum": 1
    },
    "decision": "Choose max(1, -2 + 1) = 1."
  },
  {
    "simulationId": "kadanes-algorithm:step-3",
    "problemLens": "Kadane's Algorithm (Max Subarray Sum): Finding the contiguous subarray within a one-dimensional array of numbers which has the largest sum.",
    "implementationFocus": "currentSum = max(num, currentSum + num); maxSum = max(maxSum, currentSum)",
    "visualizer": "CodeVerse Universal Trace",
    "kind": "array",
    "step": 3,
    "totalSteps": 6,
    "progress": 50,
    "phase": "Absorb a dip",
    "headline": "The -3 lowers the current sum, but the best answer remains 1.",
    "narrative": "A bad element can be part of a future best only if the running total stays useful.",
    "beginnerPrompt": "Watch the highlighted index and ask: what information has the scan proven so far?",
    "invariant": "After processing index i, the running state summarizes exactly the prefix seen so far.",
    "focus": "current index",
    "values": [
      -2,
      1,
      -3,
      4,
      -1,
      2,
      1,
      -5,
      4
    ],
    "pointers": [
      {
        "label": "i",
        "index": 2,
        "tone": "rose"
      }
    ],
    "window": {
      "left": 1,
      "right": 2
    },
    "variables": {
      "approach": "Optimal (Kadane's Dynamic Approach)",
      "currentSum": -2,
      "bestSum": 1
    },
    "decision": "The best record does not change."
  },
  {
    "simulationId": "kadanes-algorithm:step-4",
    "problemLens": "Kadane's Algorithm (Max Subarray Sum): Finding the contiguous subarray within a one-dimensional array of numbers which has the largest sum.",
    "implementationFocus": "currentSum = max(num, currentSum + num); maxSum = max(maxSum, currentSum)",
    "visualizer": "CodeVerse Universal Trace",
    "kind": "array",
    "step": 4,
    "totalSteps": 6,
    "progress": 67,
    "phase": "New strong segment",
    "headline": "At 4, starting fresh beats extending the negative sum.",
    "narrative": "This begins the subarray that will eventually become the answer.",
    "beginnerPrompt": "Watch the highlighted index and ask: what information has the scan proven so far?",
    "invariant": "After processing index i, the running state summarizes exactly the prefix seen so far.",
    "focus": "current index",
    "values": [
      -2,
      1,
      -3,
      4,
      -1,
      2,
      1,
      -5,
      4
    ],
    "pointers": [
      {
        "label": "i",
        "index": 3,
        "tone": "emerald"
      }
    ],
    "window": {
      "left": 3,
      "right": 3
    },
    "retired": [
      0,
      1,
      2
    ],
    "variables": {
      "approach": "Optimal (Kadane's Dynamic Approach)",
      "startFresh": 4,
      "currentSum": 4,
      "bestSum": 4
    },
    "decision": "Reset the window start to index 3."
  },
  {
    "simulationId": "kadanes-algorithm:step-5",
    "problemLens": "Kadane's Algorithm (Max Subarray Sum): Finding the contiguous subarray within a one-dimensional array of numbers which has the largest sum.",
    "implementationFocus": "currentSum = max(num, currentSum + num); maxSum = max(maxSum, currentSum)",
    "visualizer": "CodeVerse Universal Trace",
    "kind": "array",
    "step": 5,
    "totalSteps": 6,
    "progress": 83,
    "phase": "Extend while positive",
    "headline": "The segment 4, -1, 2, 1 grows to sum 6.",
    "narrative": "Even though -1 is negative, the running total after it stays positive, so it is worth carrying forward.",
    "beginnerPrompt": "Watch the highlighted index and ask: what information has the scan proven so far?",
    "invariant": "After processing index i, the running state summarizes exactly the prefix seen so far.",
    "focus": "current index",
    "values": [
      -2,
      1,
      -3,
      4,
      -1,
      2,
      1,
      -5,
      4
    ],
    "pointers": [
      {
        "label": "i",
        "index": 6,
        "tone": "emerald"
      }
    ],
    "window": {
      "left": 3,
      "right": 6
    },
    "solution": [
      3,
      4,
      5,
      6
    ],
    "variables": {
      "approach": "Optimal (Kadane's Dynamic Approach)",
      "currentSum": 6,
      "bestSum": 6,
      "bestSubarray": "[4, -1, 2, 1]"
    },
    "decision": "Update the global best to 6."
  },
  {
    "simulationId": "kadanes-algorithm:step-6",
    "problemLens": "Kadane's Algorithm (Max Subarray Sum): Finding the contiguous subarray within a one-dimensional array of numbers which has the largest sum.",
    "implementationFocus": "currentSum = max(num, currentSum + num); maxSum = max(maxSum, currentSum)",
    "visualizer": "CodeVerse Universal Trace",
    "kind": "array",
    "step": 6,
    "totalSteps": 6,
    "progress": 100,
    "phase": "Return record",
    "headline": "Later values cannot beat the recorded sum, so return the best seen.",
    "narrative": "Kadane separates the live candidate from the global record, which is why a later dip cannot erase the answer.",
    "beginnerPrompt": "Watch the highlighted index and ask: what information has the scan proven so far?",
    "invariant": "After processing index i, the running state summarizes exactly the prefix seen so far.",
    "focus": "current index",
    "values": [
      -2,
      1,
      -3,
      4,
      -1,
      2,
      1,
      -5,
      4
    ],
    "pointers": [
      {
        "label": "end",
        "index": 8,
        "tone": "cyan"
      }
    ],
    "solution": [
      3,
      4,
      5,
      6
    ],
    "variables": {
      "approach": "Optimal (Kadane's Dynamic Approach)",
      "answer": 6
    },
    "decision": "Return maxSum."
  }
];

for (const state of trace) {
  recordTrace({ algorithm, ...state });
}
