// CodeVerse generated visual simulation.
// Run this file in AlgoTrace to watch the algorithm move one decision at a time.
const algorithm = {
  "id": "rotate-matrix-by-90-degrees",
  "title": "Rotate Matrix by 90 Degrees",
  "topic": "Arrays - Medium",
  "difficulty": "Medium",
  "family": "Matrix",
  "timeComplexity": "O(N²)",
  "spaceComplexity": "O(1)",
  "simulationProfile": "Algorithm-specific trace"
};
const trace = [
  {
    "simulationId": "rotate-matrix-by-90-degrees:step-1",
    "problemLens": "Rotate Matrix by 90 Degrees: Rotate an $N \times N$ matrix by 90 degrees clockwise in-place.",
    "implementationFocus": "transpose across the diagonal, then reverse each row",
    "visualizer": "CodeVerse Universal Trace",
    "kind": "matrix",
    "step": 1,
    "totalSteps": 5,
    "progress": 20,
    "phase": "Original image",
    "headline": "Start with the matrix in row-major view.",
    "narrative": "A clockwise rotation can be decomposed into a diagonal transpose and a row reverse.",
    "beginnerPrompt": "Name the active row, column, and boundary before each move.",
    "invariant": "Every visited cell is either finalized or deliberately marked for a later update.",
    "focus": "active cell coordinates",
    "matrix": [
      [
        1,
        2,
        3
      ],
      [
        4,
        5,
        6
      ],
      [
        7,
        8,
        9
      ]
    ],
    "activeCells": [
      "0-0",
      "0-1",
      "0-2"
    ],
    "variables": {
      "approach": "Optimal (Transpose + Reverse)",
      "transform": "rotate 90 clockwise"
    },
    "decision": "First transpose."
  },
  {
    "simulationId": "rotate-matrix-by-90-degrees:step-2",
    "problemLens": "Rotate Matrix by 90 Degrees: Rotate an $N \times N$ matrix by 90 degrees clockwise in-place.",
    "implementationFocus": "transpose across the diagonal, then reverse each row",
    "visualizer": "CodeVerse Universal Trace",
    "kind": "matrix",
    "step": 2,
    "totalSteps": 5,
    "progress": 40,
    "phase": "Transpose diagonal",
    "headline": "Swap matrix[i][j] with matrix[j][i] for cells above the diagonal.",
    "narrative": "Rows become columns while the main diagonal stays fixed.",
    "beginnerPrompt": "Name the active row, column, and boundary before each move.",
    "invariant": "Every visited cell is either finalized or deliberately marked for a later update.",
    "focus": "active cell coordinates",
    "matrix": [
      [
        1,
        4,
        7
      ],
      [
        2,
        5,
        8
      ],
      [
        3,
        6,
        9
      ]
    ],
    "activeCells": [
      "0-1",
      "1-0",
      "0-2",
      "2-0",
      "1-2",
      "2-1"
    ],
    "variables": {
      "approach": "Optimal (Transpose + Reverse)",
      "swaps": "(0,1)<->(1,0), (0,2)<->(2,0), (1,2)<->(2,1)"
    },
    "decision": "Now reverse each row."
  },
  {
    "simulationId": "rotate-matrix-by-90-degrees:step-3",
    "problemLens": "Rotate Matrix by 90 Degrees: Rotate an $N \times N$ matrix by 90 degrees clockwise in-place.",
    "implementationFocus": "transpose across the diagonal, then reverse each row",
    "visualizer": "CodeVerse Universal Trace",
    "kind": "matrix",
    "step": 3,
    "totalSteps": 5,
    "progress": 60,
    "phase": "Reverse top row",
    "headline": "Swap the ends of each row.",
    "narrative": "After transpose, reversing rows places former columns into clockwise order.",
    "beginnerPrompt": "Name the active row, column, and boundary before each move.",
    "invariant": "Every visited cell is either finalized or deliberately marked for a later update.",
    "focus": "active cell coordinates",
    "matrix": [
      [
        7,
        4,
        1
      ],
      [
        2,
        5,
        8
      ],
      [
        3,
        6,
        9
      ]
    ],
    "activeCells": [
      "0-0",
      "0-2"
    ],
    "variables": {
      "approach": "Optimal (Transpose + Reverse)",
      "row": 0,
      "swap": "7 with 1"
    },
    "decision": "Continue row by row."
  },
  {
    "simulationId": "rotate-matrix-by-90-degrees:step-4",
    "problemLens": "Rotate Matrix by 90 Degrees: Rotate an $N \times N$ matrix by 90 degrees clockwise in-place.",
    "implementationFocus": "transpose across the diagonal, then reverse each row",
    "visualizer": "CodeVerse Universal Trace",
    "kind": "matrix",
    "step": 4,
    "totalSteps": 5,
    "progress": 80,
    "phase": "Reverse remaining rows",
    "headline": "Rows 1 and 2 are reversed the same way.",
    "narrative": "Each row reversal is independent and in place.",
    "beginnerPrompt": "Name the active row, column, and boundary before each move.",
    "invariant": "Every visited cell is either finalized or deliberately marked for a later update.",
    "focus": "active cell coordinates",
    "matrix": [
      [
        7,
        4,
        1
      ],
      [
        8,
        5,
        2
      ],
      [
        9,
        6,
        3
      ]
    ],
    "activeCells": [
      "1-0",
      "1-2",
      "2-0",
      "2-2"
    ],
    "variables": {
      "approach": "Optimal (Transpose + Reverse)",
      "rowsReversed": "0, 1, 2"
    },
    "decision": "All cells now match the rotated position."
  },
  {
    "simulationId": "rotate-matrix-by-90-degrees:step-5",
    "problemLens": "Rotate Matrix by 90 Degrees: Rotate an $N \times N$ matrix by 90 degrees clockwise in-place.",
    "implementationFocus": "transpose across the diagonal, then reverse each row",
    "visualizer": "CodeVerse Universal Trace",
    "kind": "matrix",
    "step": 5,
    "totalSteps": 5,
    "progress": 100,
    "phase": "Rotated in place",
    "headline": "The matrix has been rotated 90 degrees clockwise.",
    "narrative": "No second matrix was allocated; every move was a swap inside the original grid.",
    "beginnerPrompt": "Name the active row, column, and boundary before each move.",
    "invariant": "Every visited cell is either finalized or deliberately marked for a later update.",
    "focus": "active cell coordinates",
    "matrix": [
      [
        7,
        4,
        1
      ],
      [
        8,
        5,
        2
      ],
      [
        9,
        6,
        3
      ]
    ],
    "activeCells": [
      "0-0",
      "0-1",
      "0-2",
      "1-0",
      "1-1",
      "1-2",
      "2-0",
      "2-1",
      "2-2"
    ],
    "variables": {
      "approach": "Optimal (Transpose + Reverse)",
      "extraSpace": "O(1)"
    },
    "decision": "Return the mutated matrix."
  }
];

for (const state of trace) {
  recordTrace({ algorithm, ...state });
}
