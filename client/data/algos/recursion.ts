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
  },
  {
    id: "rat-in-a-maze",
    title: "Rat in a Maze",
    topic: "Recursion - Backtracking",
    category: "Backtracking",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Find all possible paths that a rat can take from source to destination in a maze.",
    leetcodeLink: "",
    useCases: ["Pathfinding in robotics", "Game level navigation"],
    approaches: [
       {
          name: "Optimal (Recursive DFS with Visited Matrix)",
          description: "### 🧠 The Core Concept\nThe rat can move in four directions: **Up, Down, Left, Right**. \nTo prevent the rat from going in circles, we must 'mark' our path as we go. If we reach the finish, we save the path. If we hit a wall or a dead end, we backtrack by unmarking the path and trying a different direction.",
          timeComplexity: "O(4^(N^2))",
          timeComplexityExplanation: "Worst case we explore 4 directions for every cell in an N by N grid.",
          spaceComplexity: "O(N^2)",
          spaceComplexityExplanation: "Recursion stack and visited matrix.",
          implementations: [
             {
                language: "Python",
                code: "def solveMaze(maze, n):\n    res = []\n    def backtrack(r, c, path):\n        if r == n-1 and c == n-1:\n            res.append(path)\n            return\n        temp = maze[r][c]\n        maze[r][c] = 0 # Mark visited\n        for dr, dc, move in [(1,0,'D'), (-1,0,'U'), (0,1,'R'), (0,-1,'L')]:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < n and 0 <= nc < n and maze[nr][nc] == 1:\n                backtrack(nr, nc, path + move)\n        maze[r][c] = temp # Unmark\n    if maze[0][0] == 1: backtrack(0, 0, \"\")\n    return res"
             }
          ]
       }
    ]
  },
  {
    id: "word-search",
    title: "Word Search",
    topic: "Recursion - Backtracking",
    category: "Matrix Backtracking",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
    leetcodeLink: "https://leetcode.com/problems/word-search/",
    useCases: ["Search engines in grid-based data", "Crossword validation"],
    approaches: [
       {
          name: "Optimal (Matrix Backtracking)",
          description: "### 🧠 The Core Concept\nFor every cell, if it matches the first letter of our word, we start a **DFS**. We explore neighbors attempting to match the next letter. To avoid reusing the same cell twice for the same word, we 'mask' the cell temporarily during recursion.",
          timeComplexity: "O(N * M * 4^L)",
          timeComplexityExplanation: "N*M starting points. L is word length.",
          spaceComplexity: "O(L)",
          spaceComplexityExplanation: "Recursion stack depth equals word length.",
          implementations: [
             {
                language: "Python",
                code: "def exist(board, word):\n    rows, cols = len(board), len(board[0])\n    def dfs(r, c, i):\n        if i == len(word): return True\n        if r < 0 or c < 0 or r >= rows or c >= cols or board[r][c] != word[i]: return False\n        temp = board[r][c]\n        board[r][c] = '#'\n        found = dfs(r+1, c, i+1) or dfs(r-1, c, i+1) or dfs(r, c+1, i+1) or dfs(r, c-1, i+1)\n        board[r][c] = temp\n        return found\n    for r in range(rows):\n        for c in range(cols):\n            if dfs(r, c, 0): return True\n    return False"
             }
          ]
       }
    ]
  },
  {
    id: "print-1-to-n-using-recursion",
    title: "Print 1 to N using recursion",
    topic: "Basic Recursion",
    category: "Recursion Basics",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Print numbers from 1 to N without using loops.",
    leetcodeLink: "",
    useCases: ["Recursion fundamentals"],
    approaches: [
       {
          name: "Optimal (Backtracking / Induction)",
          description: "### 🧠 The Core Concept\nWe push calls onto the stack until we reach N, then print as the stack unwinds.\n\n### 🛠️ Execution Strategy\n1. Base case: `if (n < 1) return`.\n2. Recurse: `print1ToN(n - 1)`.\n3. Print: `console.log(n)`.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "N recursive calls.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Recursive stack depth.",
          implementations: [
             { language: "JavaScript", code: "function print1ToN(n) {\n    if (n < 1) return;\n    print1ToN(n - 1);\n    console.log(n);\n}" }
          ]
       }
    ]
  },
  {
    id: "print-n-to-1-using-recursion",
    title: "Print N to 1 using recursion",
    topic: "Basic Recursion",
    category: "Recursion Basics",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Print numbers from N to 1 without using loops.",
    leetcodeLink: "",
    useCases: ["Recursion fundamentals"],
    approaches: [
       {
          name: "Optimal (Direct Recursion)",
          description: "### 🧠 The Core Concept\nPrint the current number first, then recurse for N-1.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "N recursive calls.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Recursive stack depth.",
          implementations: [
             { language: "JavaScript", code: "function printNTo1(n) {\n    if (n < 1) return;\n    console.log(n);\n    printNTo1(n - 1);\n}" }
          ]
       }
    ]
  },
  {
    id: "sum-of-first-n-numbers",
    title: "Sum of first N numbers",
    topic: "Basic Recursion",
    category: "Recursion Basics",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Find the sum of the first N natural numbers.",
    leetcodeLink: "",
    useCases: ["Arithmetic series"],
    approaches: [
       {
          name: "Optimal (Parametric Recursion)",
          description: "### 🧠 The Core Concept\n`sum(n) = n + sum(n-1)`.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "N recursive calls.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Stack depth.",
          implementations: [
             { language: "Python", code: "def sumOfN(n):\n    if n == 0: return 0\n    return n + sumOfN(n - 1)" }
          ]
       }
    ]
  },
  {
    id: "factorial-of-n-numbers",
    title: "Factorial of N numbers",
    topic: "Basic Recursion",
    category: "Recursion Basics",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Find the factorial of a number N.",
    leetcodeLink: "",
    useCases: ["Combinatorics", "Probability"],
    approaches: [
       {
          name: "Optimal (Functional Recursion)",
          description: "### 🧠 The Core Concept\n`n! = n * (n-1)!`.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "N recursive calls.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Stack depth.",
          implementations: [
             { language: "Python", code: "def factorial(n):\n    if n == 0: return 1\n    return n * factorial(n - 1)" }
          ]
       }
    ]
  },
  {
    id: "reverse-an-array",
    title: "Reverse an array",
    topic: "Basic Recursion",
    category: "Recursion Basics",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Reverse an array using recursion.",
    leetcodeLink: "",
    useCases: ["Array manipulation"],
    approaches: [
       {
          name: "Optimal (Two Pointers Recursion)",
          description: "### 🧠 The Core Concept\nSwap the first and last elements, then recurse for the inner array.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "N/2 swaps.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Stack depth.",
          implementations: [
             { language: "Python", code: "def reverseArray(arr, l, r):\n    if l >= r: return\n    arr[l], arr[r] = arr[r], arr[l]\n    reverseArray(arr, l + 1, r - 1)" }
          ]
       }
    ]
  },
  {
    id: "check-if-a-string-is-palindrome-or-not",
    title: "Check if a string is palindrome or not",
    topic: "Basic Recursion",
    category: "Recursion Basics",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Check if a string reads the same forward and backward recursively.",
    leetcodeLink: "",
    useCases: ["String validation"],
    approaches: [
       {
          name: "Optimal (Recursive Comparison)",
          description: "### 🧠 The Core Concept\nCompare `s[i]` and `s[n-i-1]`. If they match, recurse for `i+1`.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "N/2 comparisons.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Stack depth.",
          implementations: [
             { language: "JavaScript", code: "function isPalindrome(s, i=0) {\n    if (i >= s.length / 2) return true;\n    if (s[i] !== s[s.length - i - 1]) return false;\n    return isPalindrome(s, i + 1);\n}" }
          ]
       }
    ]
  },
  {
    id: "fibonacci-number",
    title: "Fibonacci Number",
    topic: "Basic Recursion / DP",
    category: "Recursion Basics",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Find the N-th Fibonacci number.",
    leetcodeLink: "https://leetcode.com/problems/fibonacci-number/",
    useCases: ["Nature patterns", "Recursive modeling"],
    approaches: [
       {
          name: "Optimal (Multiple Recursion)",
          description: "### 🧠 The Core Concept\n`f(n) = f(n-1) + f(n-2)`.",
          timeComplexity: "O(2^N) (Unoptimized)",
          timeComplexityExplanation: "Every call branches into two more.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Stack depth.",
          implementations: [
             { language: "Python", code: "def fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)" }
          ]
       }
    ]
  },
  {
    id: "generate-all-binary-strings",
    title: "Generate Binary Strings",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Generate all binary strings of length N without consecutive 1s.",
    leetcodeLink: "",
    useCases: ["Constraint-based generation"],
    approaches: [
       {
          name: "Optimal (Recursive Generation)",
          description: "### 🧠 The Core Concept\nAt each step, we can always add '0'. We can only add '1' if the previous character was not '1'.",
          timeComplexity: "O(2^N)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "JavaScript", code: "function generate(n, s='', last='0') {\n    if (n === 0) { console.log(s); return; }\n    generate(n-1, s+'0', '0');\n    if (last !== '1') generate(n-1, s+'1', '1');\n}" }
          ]
       }
    ]
  },
  {
    id: "combination-sum-i",
    title: "Combination Sum",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find all unique combinations in candidates where the candidates sum to target.",
    leetcodeLink: "https://leetcode.com/problems/combination-sum/",
    useCases: ["Change making", "Budget allocation"],
    approaches: [
       {
          name: "Optimal (Pick/Don't Pick)",
          description: "### 🧠 The Core Concept\nAt each index, you can either pick the current element (and stay at the same index because reuse is allowed) or move to the next index.",
          timeComplexity: "O(2^T * K)",
          spaceComplexity: "O(Target)",
          implementations: [
             { language: "Python", code: "def combinationSum(candidates, target):\n    res = []\n    def backtrack(i, cur, total):\n        if total == target: res.append(list(cur)); return\n        if i >= len(candidates) or total > target: return\n        # Pick\n        cur.append(candidates[i])\n        backtrack(i, cur, total + candidates[i])\n        # Don't pick\n        cur.pop()\n        backtrack(i + 1, cur, total)\n    backtrack(0, [], 0); return res" }
          ]
       }
    ]
  },
  {
    id: "combination-sum-ii",
    title: "Combination Sum II",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find all unique combinations where each number is used once.",
    leetcodeLink: "https://leetcode.com/problems/combination-sum-ii/",
    useCases: ["Exact constraint matching"],
    approaches: [
       {
          name: "Optimal (Loop-based Backtracking)",
          description: "### 🧠 The Core Concept\nSort candidates. In the recursive loop, skip duplicate elements to ensure unique combinations.",
          timeComplexity: "O(2^N * K)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "JavaScript", code: "function combinationSum2(candidates, target) {\n    candidates.sort((a,b)=>a-b); let res = [];\n    function backtrack(idx, target, path) {\n        if (target === 0) { res.push([...path]); return; }\n        for (let i = idx; i < candidates.length; i++) {\n            if (i > idx && candidates[i] === candidates[i-1]) continue;\n            if (candidates[i] > target) break;\n            path.push(candidates[i]);\n            backtrack(i + 1, target - candidates[i], path);\n            path.pop();\n        }\n    }\n    backtrack(0, target, []); return res;\n}" }
          ]
       }
    ]
  },
  {
    id: "subset-sum-i",
    title: "Subset Sum I",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Return the sums of all possible subsets.",
    leetcodeLink: "",
    useCases: ["Value range analysis"],
    approaches: [
       {
          name: "Optimal (Recursion)",
          description: "### 🧠 The Core Concept\nStandard pick/don't pick recursion. Accumulate sum in a list.",
          timeComplexity: "O(2^N)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "Python", code: "def subsetSums(arr, n):\n    res = []\n    def func(idx, s):\n        if idx == n: res.append(s); return\n        func(idx + 1, s + arr[idx])\n        func(idx + 1, s)\n    func(0, 0); return sorted(res)" }
          ]
       }
    ]
  },
  {
    id: "palindrome-partitioning",
    title: "Palindrome Partitioning",
    topic: "Recursion - Hard",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Partition a string such that every substring is a palindrome.",
    leetcodeLink: "https://leetcode.com/problems/palindrome-partitioning/",
    useCases: ["Decomposition algorithms"],
    approaches: [
       {
          name: "Optimal (Backtracking)",
          description: "### 🧠 The Core Concept\nAt each index, try taking every possible substring. If it's a palindrome, recurse for the rest of the string.",
          timeComplexity: "O(N * 2^N)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "JavaScript", code: "function partition(s) {\n    let res = [];\n    function backtrack(idx, path) {\n        if (idx === s.length) { res.push([...path]); return; }\n        for (let i = idx; i < s.length; i++) {\n            if (isPal(s, idx, i)) {\n                path.push(s.substring(idx, i+1));\n                backtrack(i + 1, path); path.pop();\n            }\n        }\n    }\n    backtrack(0, []); return res;\n}" }
          ]
       }
    ]
  },
  {
    id: "word-break",
    title: "Word Break",
    topic: "Recursion - Hard",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Determine if a string can be segmented into words from a dictionary.",
    leetcodeLink: "https://leetcode.com/problems/word-break/",
    useCases: ["Natural language processing"],
    approaches: [
       {
          name: "Optimal (Backtracking with Memo)",
          description: "### 🧠 The Core Concept\nTry matching dictionary words at the current position. Use memoization to avoid redundant subproblems.",
          timeComplexity: "O(N * M * K)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "Python", code: "def wordBreak(s, wordDict):\n    memo = {}\n    def dp(start):\n        if start == len(s): return True\n        if start in memo: return memo[start]\n        for word in wordDict:\n            if s.startswith(word, start) and dp(start + len(word)):\n                memo[start] = True; return True\n        memo[start] = False; return False\n    return dp(0)" }
          ]
       }
    ]
  },
  {
    id: "sudoku-solver",
    title: "Sudoku Solver",
    topic: "Recursion - Hard",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Solve a Sudoku board using backtracking.",
    leetcodeLink: "https://leetcode.com/problems/sudoku-solver/",
    useCases: ["Constraint satisfaction", "Puzzle solving"],
    approaches: [
       {
          name: "Optimal (Exhaustive Backtracking)",
          description: "### 🧠 The Core Concept\nFind an empty cell. Try digits 1-9. If a digit is valid, recurse. If it fails, backtrack.",
          timeComplexity: "O(9^(N*N))",
          spaceComplexity: "O(N*N)",
          implementations: [
             { language: "JavaScript", code: "function solveSudoku(board) {\n    for (let i = 0; i < 9; i++) {\n        for (let j = 0; j < 9; j++) {\n            if (board[i][j] === '.') {\n                for (let c = 1; c <= 9; c++) {\n                    if (isValid(board, i, j, c.toString())) {\n                        board[i][j] = c.toString();\n                        if (solveSudoku(board)) return true;\n                        else board[i][j] = '.';\n                    }\n                }\n                return false;\n            }\n        }\n    }\n    return true;\n}" }
          ]
       }
    ]
  }
];
