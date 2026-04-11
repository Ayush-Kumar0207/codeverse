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
  },
  {
    id: "partition-equal-subset-sum",
    title: "Partition Equal Subset Sum",
    topic: "DP on Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given a non-empty array nums containing only positive integers, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.",
    leetcodeLink: "https://leetcode.com/problems/partition-equal-subset-sum/",
    useCases: ["Resource balancing", "Load distribution", "Subset division problems"],
    approaches: [
       {
          name: "Optimal (DP on Subset Sum)",
          description: "### 🧠 The Core Concept\nIf you want to split an array into two equal parts, each part must sum to exactly **TotalSum / 2**. \n\nThis transforms the problem into a standard 'Subset Sum' question: *\"Can we find a group of numbers that sums to this specific target?\"*\n\n### 🛠️ Execution Strategy\n1. Calculate `totalSum`. If it's odd, return `False` immediately (you can't split an odd number into two equal integers!).\n2. Solve the subset sum problem for `target = totalSum / 2`.\n3. Use a 1D DP boolean array where `dp[i]` represents *\"Is it possible to achieve sum i using a subset of the numbers we've seen?\"*.",
          timeComplexity: "O(N * Target)",
          timeComplexityExplanation: "We iterate through N numbers, and for each, we update a DP row of size Target.",
          spaceComplexity: "O(Target)",
          spaceComplexityExplanation: "We only need a single row to track achievable sums.",
          implementations: [
             {
                language: "Python",
                code: "def canPartition(nums):\n    total = sum(nums)\n    if total % 2: return False\n    target = total // 2\n    dp = [False] * (target + 1)\n    dp[0] = True\n    for n in nums:\n        for i in range(target, n - 1, -1):\n            dp[i] = dp[i] or dp[i - n]\n    return dp[target]"
             }
          ]
       }
    ]
  },
  {
    id: "edit-distance",
    title: "Edit Distance (Levenshtein)",
    topic: "DP on Strings",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) required to convert word1 to word2.",
    leetcodeLink: "https://leetcode.com/problems/edit-distance/",
    useCases: ["Autocorrect engines", "DNA sequence similarity", "Git diff calculations"],
    approaches: [
       {
          name: "Optimal (2D Tabulation)",
          description: "### 🧠 The Core Concept\nImagine you are converting 'HORSE' to 'ROS'. \nFor every character pair $(i, j)$:\n- If they match: Cost is 0, Move diagonally.\n- If they mismatch: We must choose the minimum cost among:\n  1. **Insert**: $1 + dp[i][j-1]$\n  2. **Delete**: $1 + dp[i-1][j]$\n  3. **Replace**: $1 + dp[i-1][j-1]$ (classic substitution).\n\n### 🛠️ Execution Strategy\nBuild a grid where `dp[i][j]` is the distance between `word1[:i]` and `word2[:j]`. Fill it based on the min-cost of surrounding cells.",
          timeComplexity: "O(N * M)",
          timeComplexityExplanation: "Every cell in the matrix is computed once.",
          spaceComplexity: "O(N * M)",
          spaceComplexityExplanation: "Storage for the distance matrix.",
          implementations: [
             {
                language: "JavaScript",
                code: "function minDistance(w1, w2) {\n    const m = w1.length, n = w2.length;\n    let dp = Array(m+1).fill().map(() => Array(n+1).fill(0));\n    for(let i=0; i<=m; i++) dp[i][0] = i;\n    for(let j=0; j<=n; j++) dp[0][j] = j;\n    for(let i=1; i<=m; i++) {\n        for(let j=1; j<=n; j++) {\n            if(w1[i-1] === w2[j-1]) dp[i][j] = dp[i-1][j-1];\n            else dp[i][j] = 1 + Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]);\n        }\n    }\n    return dp[m][n];\n}"
             }
          ]
       }
    ]
  },
  {
    id: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    topic: "DP on Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    leetcodeLink: "https://leetcode.com/problems/longest-increasing-subsequence/",
    useCases: ["Trend analysis in data points", "Patience sorting", "Optimal sequence alignment"],
    approaches: [
       {
          name: "Optimal (Binary Search + Greedy)",
          description: "### 🧠 The Core Concept\nInstead of a standard $O(N^2)$ DP, we can solve this in $O(N Log N)$ by maintaining a 'tail' list of the smallest possible ending values for all increasing subsequences of length $1, 2, ... K$.\n\nWhen we see a new number:\n1. If it's larger than our current max tail, append it (increasing our LIS length).\n2. If not, find the smallest tail that is $\ge$ the number and replace it. This is 'Greedy' because a smaller ending value for a sub-sequence of length $X$ makes it easier to extend that sequence later!\n\n### 🛠️ Execution Strategy\n1. Initialize an empty list `tails`.\n2. For each number in `nums`:\n   - Use **Binary Search** to find its position in `tails`.\n   - If it's at the end, append it.\n   - Otherwise, update `tails[pos]` with the number.",
          timeComplexity: "O(N log N)",
          timeComplexityExplanation: "We perform N binary searches.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Storage for the tails list.",
          implementations: [
             {
                language: "Python",
                code: "import bisect\ndef lengthOfLIS(nums):\n    tails = []\n    for x in nums:\n        pos = bisect.bisect_left(tails, x)\n        if pos == len(tails): tails.append(x)\n        else: tails[pos] = x\n    return len(tails)"
             }
          ]
       }
    ]
  },
  {
    id: "best-time-to-buy-and-sell-stock-ii",
    title: "Buy and Sell Stock II",
    topic: "DP on Stocks",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "You are given an integer array prices where prices[i] is the price of a given stock on the ith day. You can buy and sell multiple times.",
    leetcodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
    useCases: ["Day trading modeling", "Yield optimization"],
    approaches: [
       {
          name: "Optimal (Greedy/Peak-Valley)",
          description: "### 🧠 The Core Concept\nSince we can buy and sell as many times as we want, we should capture every single 'uptick' in the price. If price tomorrow is higher than price today, just buy today and sell tomorrow!\n\nMathematically, the total profit is the sum of all positive differences $P[i] - P[i-1]$.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def maxProfit(prices):\n    profit = 0\n    for i in range(1, len(prices)):\n        if prices[i] > prices[i-1]:\n            profit += prices[i] - prices[i-1]\n    return profit" }
          ]
       }
    ]
  },
  {
    id: "best-time-to-buy-and-sell-stock-iii",
    title: "Buy and Sell Stock III",
    topic: "DP on Stocks",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Find the maximum profit you can achieve with at most TWO transactions.",
    leetcodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",
    useCases: ["Portfolio rebalancing constraints"],
    approaches: [
       {
          name: "Optimal (DP with State Machine)",
          description: "### 🧠 The Core Concept\nAt any day, we can be in one of 4 states:\n1. First buy (trying to minimize cost)\n2. First sell (trying to maximize profit)\n3. Second buy (trying to minimize net reinvestment cost)\n4. Second sell (trying to maximize total net profit)\n\nWe update these states sequentially for every price.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function maxProfit(prices) {\n    let b1 = -Infinity, s1 = 0, b2 = -Infinity, s2 = 0;\n    for (let p of prices) {\n        b1 = Math.max(b1, -p);\n        s1 = Math.max(s1, b1 + p);\n        b2 = Math.max(b2, s1 - p);\n        s2 = Math.max(s2, b2 + p);\n    }\n    return s2;\n}" }
          ]
       }
    ]
  },
  {
    id: "best-time-to-buy-and-sell-stock-iv",
    title: "Buy and Sell Stock IV",
    topic: "DP on Stocks",
    category: "Dynamic Programming",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Maximum profit with at most K transactions.",
    leetcodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",
    useCases: ["Limited liquidity trading"],
    approaches: [
       {
          name: "Optimal (Tabulation)",
          description: "### 🧠 The Core Concept\nWe use a 2D DP where `dp[i][j]` represents the max profit with exactly `i` transactions up to day `j`.",
          timeComplexity: "O(K * N)",
          spaceComplexity: "O(K * N)",
          implementations: [
             { language: "Python", code: "def maxProfit(k, prices):\n    if not prices: return 0\n    n = len(prices)\n    dp = [[0] * n for _ in range(k + 1)]\n    for i in range(1, k + 1):\n        max_diff = -prices[0]\n        for j in range(1, n):\n            dp[i][j] = max(dp[i][j-1], prices[j] + max_diff)\n            max_diff = max(max_diff, dp[i-1][j] - prices[j])\n    return dp[k][n-1]" }
          ]
       }
    ]
  },
  {
    id: "best-time-to-buy-and-sell-stock-with-cooldown",
    title: "Stock with Cooldown",
    topic: "DP on Stocks",
    category: "Dynamic Programming",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Find max profit with unlimited transactions but a one-day cooldown after selling.",
    leetcodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
    useCases: ["Trading with settlement latency"],
    approaches: [
       {
          name: "Optimal (State Machine)",
          description: "### 🧠 The Core Concept\nStates: `Buying`, `Selling`, `Resting`. \nYou can only buy if you weren't in 'Selling' state yesterday.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function maxProfit(prices) {\n    let sold = 0, rest = 0, hold = -Infinity;\n    for (let p of prices) {\n        let prev_sold = sold;\n        sold = hold + p;\n        hold = Math.max(hold, rest - p);\n        rest = Math.max(rest, prev_sold);\n    }\n    return Math.max(sold, rest);\n}" }
          ]
       }
    ]
  },
  {
    id: "print-longest-common-subsequence",
    title: "Print LCS",
    topic: "DP on Strings",
    category: "Dynamic Programming",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Return the actual string content of the LCS (not just the length).",
    leetcodeLink: "",
    useCases: ["Detailed diff visualization"],
    approaches: [
       {
          name: "Optimal (Backtrack thru DP Table)",
          description: "### 🧠 The Core Concept\nOnce the 2D DP table is filled, start from `dp[m][n]`. If `s1[i-1] == s2[j-1]`, this char was part of LCS (move diagonally). Otherwise, move to the neighbor with the larger value.",
          timeComplexity: "O(N * M)",
          spaceComplexity: "O(N * M)",
          implementations: [
             { language: "Python", code: "def printLCS(s1, s2, dp):\n    m, n = len(s1), len(s2); i, j = m, n; res = []\n    while i > 0 and j > 0:\n        if s1[i-1] == s2[j-1]: res.append(s1[i-1]); i-=1; j-=1\n        elif dp[i-1][j] > dp[i][j-1]: i-=1\n        else: j-=1\n    return ''.join(reversed(res))" }
          ]
       }
    ]
  },
  {
    id: "longest-common-substring",
    title: "Longest Common Substring",
    topic: "DP on Strings",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the maximum length of a contiguous substring present in both strings.",
    leetcodeLink: "",
    useCases: ["Plagiarism detection", "DNA local alignment"],
    approaches: [
       {
          name: "Optimal (2D Tabulation)",
          description: "### 🧠 The Core Concept\nUnlike LCS, substrings must be contiguous. If `s1[i-1] == s2[j-1]`, then `dp[i][j] = 1 + dp[i-1][j-1]`. If they mismatch, `dp[i][j] = 0`! We track the maximum value ever placed in the grid.",
          timeComplexity: "O(N * M)",
          spaceComplexity: "O(N * M)",
          implementations: [
             { language: "JavaScript", code: "function longestCommonSubstring(s1, s2) {\n    let m = s1.length, n = s2.length, res = 0;\n    let dp = Array(m+1).fill().map(() => Array(n+1).fill(0));\n    for(let i=1; i<=m; i++) {\n        for(let j=1; j<=n; j++) {\n            if(s1[i-1] === s2[j-1]) {\n                dp[i][j] = 1 + dp[i-1][j-1];\n                res = Math.max(res, dp[i][j]);\n            } else dp[i][j] = 0;\n        }\n    }\n    return res;\n}" }
          ]
       }
    ]
  },
  {
    id: "grid-unique-paths",
    title: "Unique Paths",
    topic: "DP on Grids",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "A robot is located at the top-left corner of a m x n grid. Find the number of possible unique paths to reach the bottom-right corner.",
    leetcodeLink: "https://leetcode.com/problems/unique-paths/",
    useCases: ["Route calculating in constrained grids", "Probability modeling"],
    approaches: [
       {
          name: "Optimal (Top-Down Tabulation)",
          description: "### 🧠 The Core Concept\nTo reach a cell $(i, j)$, the robot could only have come from the **Top** $(i-1, j)$ or the **Left** $(i, j-1)$. \nThus, `Ways(i, j) = Ways(i-1, j) + Ways(i, j-1)`.\n\n### 🛠️ Execution Strategy\n1. Initialize a 1D row array to save space.\n2. Fill the first row with 1s.\n3. For each row, update values: `row[j] = row[j] + row[j-1]`.",
          timeComplexity: "O(N * M)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "JavaScript", code: "function uniquePaths(m, n) {\n    let row = new Array(n).fill(1);\n    for (let i = 1; i < m; i++) {\n        for (let j = 1; j < n; j++) {\n            row[j] += row[j - 1];\n        }\n    }\n    return row[n - 1];\n}" }
          ]
       }
    ]
  },
  {
    id: "minimum-path-sum-in-grid",
    title: "Min Path Sum",
    topic: "DP on Grids",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find a path from top-left to bottom-right which minimizes the sum of all numbers along its path.",
    leetcodeLink: "https://leetcode.com/problems/minimum-path-sum/",
    useCases: ["Logistics cost minimization", "PCB routing"],
    approaches: [
       {
          name: "Optimal (Tabulation)",
          description: "### 🧠 The Core Concept\nMin cost to reach $(i, j)$ is simply the cell's value plus the minimum of the cost to reach its top or left neighbor.",
          timeComplexity: "O(N * M)",
          spaceComplexity: "O(1) (In-place)",
          implementations: [
             { language: "Python", code: "def minPathSum(grid):\n    m, n = len(grid), len(grid[0])\n    for i in range(m):\n        for j in range(n):\n            if i == 0 and j > 0: grid[i][j] += grid[i][j-1]\n            elif j == 0 and i > 0: grid[i][j] += grid[i-1][j]\n            elif i > 0 and j > 0: grid[i][j] += min(grid[i-1][j], grid[i][j-1])\n    return grid[-1][-1]" }
          ]
       }
    ]
  },
  {
    id: "subset-sum-equal-to-k",
    title: "Subset Sum = K",
    topic: "DP on Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Check if there exists a subset with a sum equal to target.",
    leetcodeLink: "",
    useCases: ["Financial balancing", "Package selection"],
    approaches: [
       {
          name: "Optimal (Boolean Tabulation)",
          description: "### 🧠 The Core Concept\nFor each number, we check if we can achieve target `T` by either including it (check target `T-num`) or excluding it (check target `T`).",
          timeComplexity: "O(N * K)",
          spaceComplexity: "O(K)",
          implementations: [
             { language: "JavaScript", code: "function subsetSum(nums, k) {\n    let dp = new Array(k + 1).fill(false);\n    dp[0] = true;\n    for (let num of nums) {\n        for (let i = k; i >= num; i--) {\n            dp[i] = dp[i] || dp[i - num];\n        }\n    }\n    return dp[k];\n}" }
          ]
       }
    ]
  },
  {
    id: "0-1-knapsack",
    title: "0/1 Knapsack",
    topic: "DP on Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Maximize total value in a knapsack of capacity W.",
    leetcodeLink: "",
    useCases: ["Resource allocation", "Selection optimization"],
    approaches: [
       {
          name: "Optimal (1D DP Optimization)",
          description: "### 🧠 The Core Concept\nWe iterate through items. For each weight capacity from `W` down to `itemWeight`, we decide whether to take the item.",
          timeComplexity: "O(N * W)",
          spaceComplexity: "O(W)",
          implementations: [
             { language: "Python", code: "def knapsack(wt, val, W, n):\n    dp = [0] * (W + 1)\n    for i in range(n):\n        for w in range(W, wt[i] - 1, -1):\n            dp[w] = max(dp[w], val[i] + dp[w - wt[i]])\n    return dp[W]" }
          ]
       }
    ]
  },
  {
    id: "triangle",
    title: "Triangle",
    topic: "DP on Grids",
    category: "Dynamic Programming",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Find the minimum path sum from top to bottom in a triangle-shaped array.",
    leetcodeLink: "https://leetcode.com/problems/triangle/",
    useCases: ["Pathfinding in pyramid structures"],
    approaches: [
       {
          name: "Optimal (Bottom-Up Tabulation)",
          description: "### 🧠 The Core Concept\nStarting from the second to last row, each cell's min path sum is its value plus the minimum of the two cells directly below it.",
          timeComplexity: "O(N^2)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "Python", code: "def minimumTotal(triangle):\n    dp = triangle[-1]\n    for i in range(len(triangle)-2, -1, -1):\n        for j in range(len(triangle[i])):\n            dp[j] = triangle[i][j] + min(dp[j], dp[j+1])\n    return dp[0]" }
          ]
       }
    ]
  },
  {
    id: "rod-cutting-problem",
    title: "Rod Cutting",
    topic: "DP on Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Maximize profit by cutting a rod into pieces of various lengths.",
    leetcodeLink: "",
    useCases: ["Material utilization optimization"],
    approaches: [
       {
          name: "Optimal (Unbounded Knapsack variant)",
          description: "### 🧠 The Core Concept\nWe treat lengths as 'weights' and prices as 'values'. Since we can use any length multiple times, it's an Unbounded Knapsack problem.",
          timeComplexity: "O(Length * N)",
          spaceComplexity: "O(Length)",
          implementations: [
             { language: "JavaScript", code: "function cutRod(price, n) {\n    let dp = new Array(n + 1).fill(0);\n    for (let i = 1; i <= n; i++) {\n        for (let j = 0; j < i; j++) {\n            dp[i] = Math.max(dp[i], price[j] + dp[i - j - 1]);\n        }\n    }\n    return dp[n];\n}" }
          ]
       }
    ]
  },
  {
    id: "matrix-chain-multiplication",
    title: "Matrix Chain Multiplication",
    topic: "Partition DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Find the most efficient way to multiply a given sequence of matrices.",
    leetcodeLink: "",
    useCases: ["Compiler optimization", "Robotics kinematics chains"],
    approaches: [
       {
          name: "Optimal (MCM Tabulation)",
          description: "### 🧠 The Core Concept\nDivide the problem into sub-problems: *\"What is the min cost to multiply matrices from index i to j?\"* \nTry all possible split points `k` between `i` and `j`.",
          timeComplexity: "O(N^3)",
          spaceComplexity: "O(N^2)",
          implementations: [
             { language: "Python", code: "def matrixMultiplication(arr, n):\n    dp = [[0]*n for _ in range(n)]\n    for length in range(2, n):\n        for i in range(1, n - length + 1):\n            j = i + length - 1\n            dp[i][j] = float('inf')\n            for k in range(i, j):\n                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + arr[i-1]*arr[k]*arr[j])\n    return dp[1][n-1]" }
          ]
       }
    ]
  }
];
