import { AlgorithmEntry } from "./types";

export const patternsAlgorithms: AlgorithmEntry[] = [
  {
    id: "pattern-1-square",
    title: "Pattern 1: Square",
    topic: "Logical Thinking",
    category: "Patterns",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Print a square of N x N stars.",
    leetcodeLink: "",
    useCases: ["Initial loop logic building"],
    approaches: [
       {
          name: "Optimal (Nested Loops)",
          description: "### 🎨 Visualization\n```\n****\n****\n****\n****\n```",
          timeComplexity: "O(N^2)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function printSquare(n) {\n    for(let i=0; i<n; i++) {\n        console.log(\"*\".repeat(n));\n    }\n}" }
          ]
       }
    ]
  },
  {
    id: "pattern-7-triangle-star",
    title: "Pattern 7: Star Triangle",
    topic: "Logical Thinking",
    category: "Patterns",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Print a centered triangle of stars.",
    leetcodeLink: "",
    useCases: ["Nested loop logic with spacing"],
    approaches: [
       {
          name: "Optimal (Math-based Loops)",
          description: "### 🎨 Visualization\n```\n   *   \n  ***  \n ***** \n*******\n```\nSpace: `n - i - 1`, Star: `2 * i + 1`.",
          timeComplexity: "O(N^2)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def printTriangle(n):\n    for i in range(n):\n        print(\" \" * (n-i-1) + \"*\" * (2*i+1) + \" \" * (n-i-1))" }
          ]
       }
    ]
  },
  {
    id: "pattern-10-rotational-triangle",
    title: "Pattern 10: Half Diamond",
    topic: "Logical Thinking",
    category: "Patterns",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Print a star triangle that grows then shrinks.",
    leetcodeLink: "",
    useCases: ["Symmetry logic"],
    approaches: [
       {
          name: "Optimal (Multi-phase Loops)",
          description: "### 🎨 Visualization\n```\n*\n**\n***\n**\n*\n```",
          timeComplexity: "O(N^2)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function printDiamond(n) {\n    for(let i=1; i<=2*n-1; i++) {\n        let stars = i > n ? 2*n-i : i;\n        console.log(\"*\".repeat(stars));\n    }\n}" }
          ]
       }
    ]
  }
];
