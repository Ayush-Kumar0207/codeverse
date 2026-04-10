import { AlgorithmEntry } from "./types";

export const recursionAlgorithms: AlgorithmEntry[] = [
  {
    id: "generate-parentheses",
    title: "Generate Parentheses",
    topic: "Recursion - Backtracking",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    leetcodeLink: "https://leetcode.com/problems/generate-parentheses/",
    useCases: ["Compiler parsing", "Syntax validation combinations"],
    approaches: [
       {
          name: "Optimal (Backtracking DSL)",
          description: "### 🧠 The Core Concept\nYou have a infinite bucket of '(' and ')'. You want to form a valid sequence of length $2N$.\n\nTo ensure validity:\n1. You can always add an **opening** bracket `(` if you haven't used all $N$ units.\n2. You can ONLY add a **closing** bracket `)` if the current total number of closing brackets is less than the current total number of opening brackets. (You can't close what hasn't been opened!).\n\n### 🛠️ Execution Strategy\nThis is a classic decision-tree traversal.\n- Use `openCount` and `closeCount` to track available inventory.\n- Recursively branch at every position: *\"Try adding '(', then backtrack and try adding ')'\"*.\n- Base Case: Length of current string is $2N$.",
          timeComplexity: "O(4^N / sqrt(N))",
          timeComplexityExplanation: "The total number of valid sequences is bounded by the N-th Catalan number.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "The maximum depth of the recursive call stack is $2N$.",
          implementations: [
             {
                language: "Python",
                code: "def generateParenthesis(n: int):\n    res = []\n    def backtrack(s, open_c, close_c):\n        if len(s) == 2 * n:\n            res.append(s)\n            return\n        if open_c < n:\n            backtrack(s + '(', open_c + 1, close_c)\n        if close_c < open_c:\n            backtrack(s + ')', open_c, close_c + 1)\n    backtrack(\"\", 0, 0)\n    return res"
             },
             {
                language: "JavaScript",
                code: "function generateParenthesis(n) {\n    const res = [];\n    function backtrack(s, o, c) {\n        if (s.length === 2 * n) {\n            res.push(s);\n            return;\n        }\n        if (o < n) backtrack(s + '(', o + 1, c);\n        if (c < o) backtrack(s + ')', o, c + 1);\n    }\n    backtrack(\"\", 0, 0);\n    return res;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "subsets",
    title: "Subsets (Power Set)",
    topic: "Recursion - Backtracking",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given an integer array of unique elements, return all possible subsets (the power set).",
    leetcodeLink: "https://leetcode.com/problems/subsets/",
    useCases: ["Combination lock hacking", "Marketing segment generation", "Option probability pricing"],
    approaches: [
       {
          name: "Optimal (Include/Exclude Backtracking)",
          description: "### 🧠 The Core Concept\nImagine you are packing for a trip. You have a list of items. For **EVERY SINGLE ITEM**, you have a simple binary choice: *\"Do I put this in my suitcase, or do I leave it at home?\"*\n\nIf you make this choice for all $N$ items, you will end up with $2^N$ different combinations of suitcases. This is exactly how we generate the Power Set.\n\n### 🛠️ Execution Strategy\n1. Use a pointer `index` starting at 0.\n2. **The Branch**:\n   - **Option A**: Include `nums[index]` in the current subset and move to `index + 1`.\n   - **Option B**: Exclude `nums[index]` from the current subset (remove it) and move to `index + 1`.\n3. **Base Case**: If `index == nums.length`, we've made a decision for every item. Save the current suitcase (subset)!",
          timeComplexity: "O(N * 2^N)",
          timeComplexityExplanation: "There are $2^N$ possible subsets, and for each one, we perform an $O(N)$ operation to copy the current path into the result list.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "The recursion stack depth is equal to the number of elements in the array.",
          implementations: [
             {
                language: "Python",
                code: "def subsets(nums):\n    res = []\n    path = []\n    def backtrack(i):\n        if i == len(nums):\n            res.append(list(path))\n            return\n        # Include\n        path.append(nums[i])\n        backtrack(i + 1)\n        # Exclude (Backtrack)\n        path.pop()\n        backtrack(i + 1)\n    backtrack(0)\n    return res"
             },
             {
                language: "JavaScript",
                code: "function subsets(nums) {\n    const res = [];\n    const path = [];\n    function backtrack(i) {\n        if (i === nums.length) {\n            res.push([...path]);\n            return;\n        }\n        path.push(nums[i]);\n        backtrack(i + 1);\n        path.pop();\n        backtrack(i + 1);\n    }\n    backtrack(0);\n    return res;\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        backtrack(0, nums, new ArrayList<>(), res);\n        return res;\n    }\n\n    private void backtrack(int i, int[] nums, List<Integer> path, List<List<Integer>> res) {\n        if (i == nums.length) {\n            res.add(new ArrayList<>(path));\n            return;\n        }\n        path.add(nums[i]);\n        backtrack(i + 1, nums, path, res);\n        path.remove(path.size() - 1);\n        backtrack(i + 1, nums, path, res);\n    }\n}"
             }
          ]
       }
    ]
  },
  {
    id: "n-queens",
    title: "N-Queens",
    topic: "Recursion - Extreme Backtracking",
    category: "Recursion",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Place n queens on an n x n chessboard such that no two queens attack each other.",
    leetcodeLink: "https://leetcode.com/problems/n-queens/",
    useCases: ["Constraint satisfaction problems", "Circuit layout optimization", "Parallel task distribution"],
    approaches: [
       {
          name: "Optimal (Backtracking with bit-sets or sets)",
          description: "### 🧠 The Core Concept\nA Queen attacks everything in her row, column, and diagonals. To solve this, we place queens one row at a time. \n\nFor every single row, we test every column. But before we drop a Queen, we check: *\"Is this column, positive-diagonal, or negative-diagonal already under attack by another Queen?\"*\n\n### 🛠️ Step-by-Step\n1. **Track Threat Zones**: Use 3 Sets to mark columns, positive diagonals ($r+c$), and negative diagonals ($r-c$) that are occupied.\n2. **The Search**: \n   - For Row $R$, iterate through each Column $C$.\n   - If $(R, C)$ isn't threatened:\n     - Place Queen, mark Sets.\n     - Recurse to Row $R+1$.\n     - **Backtrack**: Remove Queen, unmark Sets, and try the next column.\n3. **Base Case**: If $R == N$, success! Convert the board state into the requested string format.",
          timeComplexity: "O(N!)",
          timeComplexityExplanation: "There are $N$ choices for the first row, $N-2$ roughly for the next, scaling factorially as constraints accumulate.",
          spaceComplexity: "O(N^2)",
          spaceComplexityExplanation: "Required to store the N by N board representation.",
          implementations: [
             {
                language: "Python",
                code: "def solveNQueens(n):\n    res = []\n    board = [[\".\"] * n for _ in range(n)]\n    cols, p_diag, n_diag = set(), set(), set()\n\n    def backtrack(r):\n        if r == n:\n            res.append([\"\".join(row) for row in board])\n            return\n        for c in range(n):\n            if c in cols or (r+c) in p_diag or (r-c) in n_diag: continue\n            \n            cols.add(c); p_diag.add(r+c); n_diag.add(r-c)\n            board[r][c] = \"Q\"\n            backtrack(r + 1)\n            # Backtrack\n            cols.remove(c); p_diag.remove(r+c); n_diag.remove(r-c)\n            board[r][c] = \".\"\n            \n    backtrack(0)\n    return res"
             },
             {
                language: "JavaScript",
                code: "function solveNQueens(n) {\n    const res = [];\n    const board = Array.from({ length: n }, () => Array(n).fill(\".\"));\n    const cols = new Set(), pDiag = new Set(), nDiag = new Set();\n\n    function backtrack(r) {\n        if (r === n) {\n            res.push(board.map(row => row.join(\"\")));\n            return;\n        }\n        for (let c = 0; c < n; c++) {\n            if (cols.has(c) || pDiag.has(r+c) || nDiag.has(r-c)) continue;\n\n            cols.add(c); pDiag.add(r+c); nDiag.add(r-c);\n            board[r][c] = \"Q\";\n            backtrack(r + 1);\n            board[r][c] = \".\";\n            cols.delete(c); pDiag.delete(r+c); nDiag.delete(r-c);\n        }\n    }\n    backtrack(0);\n    return res;\n}"
             }
          ]
       }
    ]
  }
];
