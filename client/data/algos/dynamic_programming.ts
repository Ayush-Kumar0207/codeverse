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
          description: "### 🧠 The Core Concept\nImagine you are standing at Step 5 of a staircase. How could you have possibly gotten there? \nBecause you can only jump 1 or 2 steps at a time, there are exactly *two* ways you could have landed on Step 5:\n1. You jumped $+1$ step from **Step 4**.\n2. You jumped $+2$ steps from **Step 3**.\n\nTherefore, the total number of ways to reach Step 5 is perfectly equal to `Ways(Step 4) + Ways(Step 3)`.\nThis is classically identical to the Fibonacci Sequence! `DP[i] = DP[i-1] + DP[i-2]`.\n\n### 🛠️ Execution Strategy\n1. Define base cases: `DP[1] = 1`, `DP[2] = 2`.\n2. Loop from step 3 up to $N$.\n3. At each step, mathematically combine the sums of the two preceding variables.\nSince we strictly only need to remember the absolute last 2 steps, our space requirement mathematically compresses from an entire Array array down to two native integer variables.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "The computation iterates directly from indices 3 to `N` strictly once, executing exactly `N - 2` constant-time additions.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Instead of allocating an N-sized DP array structure to track historical bounds, mathematical garbage collection is natively invoked by only tracking the 2 most immediate historical variables (`prev1`, `prev2`).",
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
                 code: "class Solution {\npublic:\n    int climbStairs(int n) {\n        if(n <= 2) return n;\n        int prev2 = 1, prev1 = 2;\n        for(int i = 3; i <= n; i++){\n            int curr = prev1 + prev2;\n            prev2 = prev1;\n            prev1 = curr;\n        }\n        return prev1;\n    }\n};"
             }
          ]
       }
    ]
  },
  {
    id: "coin-change",
    title: "Coin Change",
    topic: "DP on Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "You are given an integer array sorted of coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
    leetcodeLink: "https://leetcode.com/problems/coin-change/",
    useCases: ["Financial Systems Change Generation", "Vending Machine Dispensation Logic", "Inventory Management"],
    approaches: [
       {
          name: "Bottom-Up Tabulation (1D Array)",
          description: "### 🧠 The Core Concept\nIf you want to determine the bare minimum coins needed to make $11$, and you possess a $5$ coin, you can mathematically ask: *\"What was the bare minimum coins needed to make $6$?\"*\nIf you already know the answer for $6$, then making $11$ is simply `Ways(6) + 1` (the $5$ coin!).\n\nThus, we calculate the absolute minimum coins required for **EVERY SINGLE VALUE** starting from $0$ all the way up to the target amount.\n\n### 🛠️ Execution Strategy\n1. **State Initialization**: Construct a DP array of size `amount + 1`. Pre-fill it with a massive placeholder value (`Infinity` or `amount + 1`) representing unreachable states.\n2. **Base Case Configuration**: `dp[0] = 0`. It takes exactly zero coins to make zero dollars.\n3. **Double Loop Tabulation**: \n   - Loop `i` from $1$ to `amount`. This represents the current sub-amount we are statically solving.\n   - Inside the loop, iterate over every `coin` denomination available.\n   - If `i - coin >= 0` (meaning the coin fits), conditionally update the answer: `dp[i] = min(dp[i], dp[i - coin] + 1)`.\n4. **Result Resolution**: If `dp[amount]` is still Infinity, return `-1`. Otherwise, return `dp[amount]`.",
          timeComplexity: "O(A * C)",
          timeComplexityExplanation: "Our outer evaluation loop executes strictly `A` times (representing the `amount`). Inherently nested inside it is a loop spanning the `C` coins. Multiplication applies yielding `O(Amount * Coins)`.",
          spaceComplexity: "O(A)",
          spaceComplexityExplanation: "An explicit 1-Dimensional Array `dp` array tracking answers for each sub-amount integers strictly scales to the ceiling of the mathematical `amount` limit.",
          implementations: [
             {
                language: "JavaScript",
                code: "var coinChange = function(coins, amount) {\n    let dp = new Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    \n    for (let i = 1; i <= amount; i++) {\n        for (let coin of coins) {\n            if (i - coin >= 0) {\n                dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n            }\n        }\n    }\n    \n    return dp[amount] === Infinity ? -1 : dp[amount];\n};"
             },
             {
                language: "Python",
                code: "class Solution:\n    def coinChange(self, coins: List[int], amount: int) -> int:\n        dp = [float('inf')] * (amount + 1)\n        dp[0] = 0\n        \n        for i in range(1, amount + 1):\n            for c in coins:\n                if i - c >= 0:\n                    dp[i] = min(dp[i], dp[i - c] + 1)\n                    \n        return dp[amount] if dp[amount] != float('inf') else -1"
             },
             {
                language: "Java",
                code: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        int max = amount + 1;\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, max);\n        dp[0] = 0;\n        \n        for (int i = 1; i <= amount; i++) {\n            for (int j = 0; j < coins.length; j++) {\n                if (coins[j] <= i) {\n                    dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);\n                }\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        vector<int> dp(amount + 1, amount + 1);\n        dp[0] = 0;\n        \n        for (int i = 1; i <= amount; i++) {\n            for (int coin : coins) {\n                if (i - coin >= 0) {\n                    dp[i] = min(dp[i], dp[i - coin] + 1);\n                }\n            }\n        }\n        \n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n};"
             }
          ]
       }
    ]
  },
  {
    id: "longest-common-subsequence",
    title: "Longest Common Subsequence",
    topic: "DP on Strings",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given two strings text1 and text2, return the length of their longest common subsequence (characters appearing in the same relative order but not necessarily contiguous).",
    leetcodeLink: "https://leetcode.com/problems/longest-common-subsequence/",
    useCases: ["Version Control System 'diff' tools", "Bioinformatics Sequence Alignment", "Plagiarism Detection"],
    approaches: [
       {
          name: "2D Tabulation",
          description: "### 🧠 The Core Concept\nWe need to compare `" + "abcde" + "` with `" + "ace" + "`. \nLet's compare them character by character via pointers. \n1. **Match Detection**: If `text1[i] == text2[j]`, we have identical correlation! We definitively add $1$ to our total sequence length, and cross out both letters since they are matched. (Proceed left to right).\n2. **Mismatch Handling**: What if `text1[i] != text2[j]`? (Like comparing 'b' with 'c'). We must explore two diverging realities:\n   - What if we ignore 'b' and check the rest?\n   - What if we ignore 'c' and check the rest?\n   - We take whichever alternate reality yields the maximum common subsequence.\n\n### 🛠️ Execution Strategy\nWe build a visually expanding 2D Matrix Grid of size `[N+1][M+1]`.\n1. Row index $i$ corresponds horizontally to characters in `text1`.\n2. Column index $j$ corresponds vertically to characters in `text2`.\n3. We iterate perfectly sequentially through every cell of the grid.\n    - If `text1[i-1] == text2[j-1]`, we adopt the diagonal cell score and add 1. `dp[i][j] = dp[i-1][j-1] + 1`.\n    - If characters mismatch, we inherit the mathematical max of the cell perfectly above us or perfectly to the left of us. `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.",
          timeComplexity: "O(N * M)",
          timeComplexityExplanation: "Our fundamental execution populates practically every single cell in an instantiated `N` by `M` 2D Array dynamically exactly once without recursive overhead.",
          spaceComplexity: "O(N * M)",
          spaceComplexityExplanation: "The 2D array matrix fully consumes $N \\times M$ topological space frames. Note: Optimized boundaries do exist scaling mathematically to $O(Min(N,M))$ utilizing a 2-row rolling-status buffer strategy.",
          implementations: [
             {
                language: "JavaScript",
                code: "var longestCommonSubsequence = function(text1, text2) {\n    const m = text1.length, n = text2.length;\n    let dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));\n    \n    for (let i = 1; i <= m; i++) {\n        for (let j = 1; j <= n; j++) {\n            if (text1[i - 1] === text2[j - 1]) {\n                dp[i][j] = 1 + dp[i - 1][j - 1];\n            } else {\n                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n            }\n        }\n    }\n    \n    return dp[m][n];\n};"
             },
             {
                language: "Python",
                code: "class Solution:\n    def longestCommonSubsequence(self, text1: str, text2: str) -> int:\n        m, n = len(text1), len(text2)\n        dp = [[0] * (n + 1) for _ in range(m + 1)]\n        \n        for i in range(1, m + 1):\n            for j in range(1, n + 1):\n                if text1[i - 1] == text2[j - 1]:\n                    dp[i][j] = 1 + dp[i - 1][j - 1]\n                else:\n                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n                    \n        return dp[m][n]"
             },
             {
                language: "Java",
                code: "class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        int m = text1.length();\n        int n = text2.length();\n        int[][] dp = new int[m + 1][n + 1];\n        \n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {\n                    dp[i][j] = dp[i - 1][j - 1] + 1;\n                } else {\n                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n                }\n            }\n        }\n        \n        return dp[m][n];\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    int longestCommonSubsequence(string text1, string text2) {\n        int m = text1.size(), n = text2.size();\n        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n        \n        for (int i = 1; i <= m; ++i) {\n            for (int j = 1; j <= n; ++j) {\n                if (text1[i - 1] == text2[j - 1]) {\n                    dp[i][j] = dp[i - 1][j - 1] + 1;\n                } else {\n                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);\n                }\n            }\n        }\n        \n        return dp[m][n];\n    }\n};"
             }
          ]
       }
    ]
  }
];
