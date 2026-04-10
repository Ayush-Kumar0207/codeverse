import { AlgorithmEntry } from "./types";

export const dpAlgorithms: AlgorithmEntry[] = [
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    topic: "Dynamic Programming - 1D DP",
    category: "Dynamic Programming",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    leetcodeLink: "https://leetcode.com/problems/climbing-stairs/",
    useCases: ["Combinatorics", "Predicting permutations of paths"],
    approaches: [
       {
          name: "Optimal (DP Tabulation)",
          description: "### 🧠 The Core Concept\nImagine you are standing at Step 5 of a staircase. How could you have possibly gotten there? \nBecause you can only jump 1 or 2 steps at a time, there are exactly *two* ways you could have landed on Step 5:\n1. You jumped $+1$ step from **Step 4**.\n2. You jumped $+2$ steps from **Step 3**.\n\nTherefore, the total number of ways to reach Step 5 is perfectly equal to `Ways(Step 4) + Ways(Step 3)`.\nThis is identical to the Fibonacci Sequence! `DP[i] = DP[i-1] + DP[i-2]`.\n\n### 🛠️ Execution Strategy\n1. Define base cases: `DP[1] = 1`, `DP[2] = 2`.\n2. Loop from step 3 up to $N$.\n3. At each step, just add the two previous variables together.\nWe only need to remember the last 2 steps, so our space complexity drops to O(1)!",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             {
                language: "Python",
                code: "def climbStairs(n: int) -> int:\n    if n <= 2: return n\n    prev2, prev1 = 1, 2\n    for i in range(3, n + 1):\n        curr = prev1 + prev2\n        prev2 = prev1\n        prev1 = curr\n    return prev1"
             },
             {
                language: "JavaScript",
                code: "function climbStairs(n) {\n    if (n <= 2) return n;\n    let prev2 = 1, prev1 = 2;\n    for (let i = 3; i <= n; i++) {\n        let curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev2 = 1, prev1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int curr = prev1 + prev2;\n            prev2 = prev1;\n            prev1 = curr;\n        }\n        return prev1;\n    }\n}"
             },
             {
                language: "C++",
                code: "int climbStairs(int n) {\n    if(n <= 2) return n;\n    int prev2 = 1, prev1 = 2;\n    for(int i = 3; i <= n; i++){\n        int curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}"
             }
          ]
       }
    ]
  }
];
