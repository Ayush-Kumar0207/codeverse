import { AlgorithmEntry } from "./types";

export const recursionAlgorithms: AlgorithmEntry[] = [
  {
    id: "generate-parentheses",
    title: "Generate Parentheses",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    leetcodeLink: "https://leetcode.com/problems/generate-parentheses/",
    useCases: ["Compiler parsing", "Syntax validation combinations"],
    approaches: [
       {
          name: "Optimal (Backtracking Depth-First Search)",
          description: "### 🧠 The Core Concept\nImagine you have a bucket of `N` Left-Brackets and a bucket of `N` Right-Brackets. You want to lay them out in a straight line to make a perfect mathematical sequence.\n\nYou can only place brackets if they follow two strict logical rules:\n1. **Rule of Supply**: You can place a Left-Bracket as long as you still have some left in your bucket.\n2. **Rule of Closure**: You can ONLY place a Right-Bracket if you have placed MORE Left-Brackets than Right-Brackets locally on the table. (You cannot close what hasn't been opened!).\n\n### 🛠️ Execution Strategy\nThis is a classic Backtracking Decision Tree.\n- At every step of the sequence, the branch splits in two: *\"Should I place a `(` or a `)`?\"*\n- We recursively dive down both decisions as long as they don't break our strict rules.\n- If a sequence reaches length `N * 2`, we know we exhausted both buckets, so we save the combination and backtrack to try another branch!",
          timeComplexity: "O(4^N / sqrt(N))",
          spaceComplexity: "O(N)",
          implementations: [
             {
                language: "Python",
                code: "def generateParenthesis(n: int):\n    res = []\n    def backtrack(current_str, open_count, close_count):\n        if len(current_str) == 2 * n:\n            res.append(current_str)\n            return\n        if open_count < n:\n            backtrack(current_str + '(', open_count + 1, close_count)\n        if close_count < open_count:\n            backtrack(current_str + ')', open_count, close_count + 1)\n            \n    backtrack(\"\", 0, 0)\n    return res"
             },
             {
                language: "JavaScript",
                code: "function generateParenthesis(n) {\n    const res = [];\n    function backtrack(currentStr, openCount, closeCount) {\n        if (currentStr.length === 2 * n) {\n            res.push(currentStr);\n            return;\n        }\n        if (openCount < n) {\n            backtrack(currentStr + '(', openCount + 1, closeCount);\n        }\n        if (closeCount < openCount) {\n            backtrack(currentStr + ')', openCount, closeCount + 1);\n        }\n    }\n    backtrack(\"\", 0, 0);\n    return res;\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public List<String> generateParenthesis(int n) {\n        List<String> res = new ArrayList<>();\n        backtrack(res, \"\", 0, 0, n);\n        return res;\n    }\n    \n    private void backtrack(List<String> res, String currentStr, int open, int close, int max){\n        if (currentStr.length() == max * 2) {\n            res.add(currentStr);\n            return;\n        }\n        \n        if (open < max) backtrack(res, currentStr + \"(\", open + 1, close, max);\n        if (close < open) backtrack(res, currentStr + \")\", open, close + 1, max);\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    vector<string> generateParenthesis(int n) {\n        vector<string> res;\n        backtrack(res, \"\", 0, 0, n);\n        return res;\n    }\n    \n    void backtrack(vector<string>& res, string currentStr, int open, int close, int max){\n        if(currentStr.length() == max * 2) {\n            res.push_back(currentStr);\n            return;\n        }\n        if(open < max) backtrack(res, currentStr + \"(\", open + 1, close, max);\n        if(close < open) backtrack(res, currentStr + \")\", open, close + 1, max);\n    }\n};"
             }
          ]
       }
    ]
  }
];
