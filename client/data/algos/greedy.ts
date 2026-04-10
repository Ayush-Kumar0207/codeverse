import { AlgorithmEntry } from "./types";

export const greedyAlgorithms: AlgorithmEntry[] = [
  {
    id: "assign-cookies",
    title: "Assign Cookies",
    topic: "Greedy Algorithms",
    category: "Greedy Patterns",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "You want to distribute cookies to children to maximize satisfaction. Each child has a greed factor, and each cookie has a size. A child is content if the cookie size >= their greed factor.",
    leetcodeLink: "https://leetcode.com/problems/assign-cookies/",
    useCases: ["Resource allocation", "Simple load balancing", "Inventory management"],
    approaches: [
       {
          name: "Optimal (Sort & Two Pointers)",
          description: "### 🧠 The Core Concept\nImagine you are a server at a party. You have a handful of different-sized cookies, and a line of children with different hunger levels.\nTo satisfy the most children, you should be **Greedy**. \n\nYou give the smallest cookie that can satisfy the least hungry child. Why? Because if you give a massive cookie to a slightly hungry child, you are wasting that large cookie's potential to satisfy a very hungry child later!\n\n### 🛠️ Execution Strategy\n1. **Sorting**: Sort both the `children` (greed levels) and the `cookies` (sizes) in ascending order.\n2. **The Iterate**: Use two pointers—one for children, one for cookies.\n3. **Greedy Match**:\n   - If current cookie $\ge$ current child's greed: The child is happy! Move both pointers forward.\n   - If current cookie < current child's greed: This cookie is too small for this child. Throw it away (move cookie pointer forward) and try the next bigger cookie for the same child.\n4. **Result**: The number of happy children is your answer.",
          timeComplexity: "O(N log N)",
          timeComplexityExplanation: "The primary computational cost is the sorting of the two input arrays. The actual greedy two-pointer pass is linear $(O(N))$.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The algorithm modifies the pointers in-place utilizing constant auxiliary space (excluding the space required for the sorting algorithm).",
          implementations: [
             {
                language: "Python",
                code: "def findContentChildren(g: List[int], s: List[int]) -> int:\n    g.sort()\n    s.sort()\n    child = cookie = 0\n    while child < len(g) and cookie < len(s):\n        if s[cookie] >= g[child]:\n            child += 1\n        cookie += 1\n    return child"
             },
             {
                language: "JavaScript",
                code: "function findContentChildren(g, s) {\n    g.sort((a,b) => a - b);\n    s.sort((a,b) => a - b);\n    let child = 0, cookie = 0;\n    while (child < g.length && cookie < s.length) {\n        if (s[cookie] >= g[child]) {\n            child++;\n        }\n        cookie++;\n    }\n    return child;\n}"
             },
             {
                language: "Java",
                code: "public int findContentChildren(int[] g, int[] s) {\n    Arrays.sort(g);\n    Arrays.sort(s);\n    int child = 0, cookie = 0;\n    while (child < g.length && cookie < s.length) {\n        if (s[cookie] >= g[child]) child++;\n        cookie++;\n    }\n    return child;\n}"
             },
             {
                language: "C++",
                code: "int findContentChildren(vector<int>& g, vector<int>& s) {\n    sort(g.begin(), g.end());\n    sort(s.begin(), s.end());\n    int child = 0, cookie = 0;\n    while(child < g.size() && cookie < s.size()) {\n        if(s[cookie] >= g[child]) child++;\n        cookie++;\n    }\n    return child;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "jump-game",
    title: "Jump Game",
    topic: "Greedy Algorithms",
    category: "Greedy Patterns",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Given an array of non-negative integers representing your maximum jump distance at that position, determine if you can reach the last index.",
    leetcodeLink: "https://leetcode.com/problems/jump-game/",
    useCases: ["Path existence checks", "Resource reachability logic", "Game AI movement distance"],
    approaches: [
       {
          name: "Optimal (Greedy Goal Tracking)",
          description: "### 🧠 The Core Concept\nImagine you are trying to reach a finish line. Instead of looking forward and guessing jumps, what if we started at the **Finish Line** and looked backward?\n\nIf you can reach the finish line from a certain spot, then that spot effectively becomes the 'new' finish line! If you keep moving the goalpost toward the start and eventually reach index 0, the path exists.\n\n### 🛠️ Execution Strategy\n1. **Initialize Goal**: Set `goal = len(nums) - 1` (the last index).\n2. **Backward Scan**: Iterate from the second-to-last element down to index 0.\n3. **Relocate Goal**: \n   - At index `i`, can we jump far enough to touch the current `goal`? \n   - If `i + nums[i] >= goal`, then we can definitively reach the goal from `i`. Move the `goal` to `i`!\n4. **Final Check**: If `goal == 0`, return `true`. It means we successfully traced a path back to the starting line.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We perform a single backward pass through the array. No nested loops or recursion required.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Only a single integer `goal` is tracked in memory.",
          implementations: [
             {
                language: "JavaScript",
                code: "var canJump = function(nums) {\n    let goal = nums.length - 1;\n    for (let i = nums.length - 2; i >= 0; i--) {\n        if (i + nums[i] >= goal) {\n            goal = i;\n        }\n    }\n    return goal === 0;\n};"
             },
             {
                language: "Python",
                code: "class Solution:\n    def canJump(self, nums: List[int]) -> bool:\n        goal = len(nums) - 1\n        for i in range(len(nums) - 2, -1, -1):\n            if i + nums[i] >= goal:\n                goal = i\n        return goal == 0"
             },
             {
                language: "Java",
                code: "class Solution {\n    public boolean canJump(int[] nums) {\n        int goal = nums.length - 1;\n        for (int i = nums.length - 2; i >= 0; i--) {\n            if (i + nums[i] >= goal) goal = i;\n        }\n        return goal == 0;\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        int goal = nums.size() - 1;\n        for (int i = nums.size() - 2; i >= 0; i--) {\n            if (i + nums[i] >= goal) goal = i;\n        }\n        return goal == 0;\n    }\n};"
             }
          ]
       }
    ]
  },
  {
    id: "gas-station",
    title: "Gas Station (Circuit Traversal)",
    topic: "Greedy Algorithms",
    category: "Greedy Patterns",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given gas and cost arrays, find the starting gas station index that allows you to travel around the circuit once in a clockwise direction.",
    leetcodeLink: "https://leetcode.com/problems/gas-station/",
    useCases: ["Circular buffer routing", "Supply chain logistics", "Energy-constrained pathfinding"],
    approaches: [
       {
          name: "Optimal (One-Pass Greedy)",
          description: "### 🧠 The Core Concept\nThis is a classic 'Net Balance' problem. To complete the circuit:\n1. Total Gas MUST be greater than or equal to Total Cost. If not, the tour is mathematically impossible.\n2. **The Logic**: If you start at Station A and run out of gas at Station D, then Station A, B, and C are **ALL invalid starting points**. You can simply skip them and try starting at Station D+1.\n\n### 🛠️ Execution Strategy\n1. Check Total Balance: If `sum(gas) < sum(cost)`, return `-1`.\n2. **The Greedy Scan**:\n   - Start with `total = 0` and `start_index = 0`.\n   - Iterate through the stations. Add `gas[i] - cost[i]` to `total`.\n   - If `total` becomes < 0: Reset `total = 0` and set `start_index = i + 1`.\n3. Return the final `start_index`.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We iterate through the station collection precisely once to determine the transition point.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Only numeric accumulation pointers are utilized.",
          implementations: [
             {
                language: "Python",
                code: "def canCompleteCircuit(gas, cost):\n    if sum(gas) < sum(cost): return -1\n    total, start = 0, 0\n    for i in range(len(gas)):\n        total += gas[i] - cost[i]\n        if total < 0:\n            total = 0\n            start = i + 1\n    return start"
             },
             {
                language: "JavaScript",
                code: "function canCompleteCircuit(gas, cost) {\n    let totalGas = gas.reduce((a,b) => a+b, 0);\n    let totalCost = cost.reduce((a,b) => a+b, 0);\n    if (totalGas < totalCost) return -1;\n    \n    let curr = 0, start = 0;\n    for (let i = 0; i < gas.length; i++) {\n        curr += gas[i] - cost[i];\n        if (curr < 0) {\n            curr = 0;\n            start = i + 1;\n        }\n    }\n    return start;\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        int totalGas = 0, totalCost = 0;\n        for (int i = 0; i < gas.length; i++) {\n            totalGas += gas[i];\n            totalCost += cost[i];\n        }\n        if (totalGas < totalCost) return -1;\n        \n        int curr = 0, start = 0;\n        for (int i = 0; i < gas.length; i++) {\n            curr += gas[i] - cost[i];\n            if (curr < 0) {\n                curr = 0;\n                start = i + 1;\n            }\n        }\n        return start;\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n        int total_gas = 0, total_cost = 0;\n        for(int i=0; i<gas.size(); i++) {\n            total_gas += gas[i];\n            total_cost += cost[i];\n        }\n        if(total_gas < total_cost) return -1;\n\n        int curr = 0, start = 0;\n        for(int i=0; i<gas.size(); i++) {\n            curr += gas[i] - cost[i];\n            if(curr < 0) {\n                curr = 0;\n                start = i + 1;\n            }\n        }\n        return start;\n    }\n};"
             }
          ]
       }
    ]
  }
];
