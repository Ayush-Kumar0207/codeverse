import { AlgorithmEntry } from "./types";

export const greedyAlgorithms: AlgorithmEntry[] = [
  {
    id: "jump-game",
    title: "Jump Game",
    topic: "Greedy Algorithms",
    category: "Greedy",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index.",
    leetcodeLink: "https://leetcode.com/problems/jump-game/",
    useCases: ["Network routing reachability", "Logistics pathfinding"],
    approaches: [
       {
          name: "Optimal (Greedy Gas Tank)",
          description: "### 🧠 The Core Concept\nImagine you are driving a car across a desert highway. Every stop on the highway specifies how many gallons of gas you can siphon from it (1 gallon = 1 mile). \n\nYou don't need to actually test every single combination of jumps. You just need to keep track of one specific metric: **What is the absolute furthest mile marker I can reach so far?**\n\n### 🛠️ Execution Strategy\n1. Initialize `maxReach = 0`.\n2. Iterate through every single index.\n3. **The Dead Zone**: If your current index `i` is greater than `maxReach`, it means you literally ran out of gas before even reaching this stop. Return False immediately!\n4. **Refuel**: At every stop, calculate: `i + nums[i]` (Your current spot + the gas available here). If this number is bigger than your `maxReach`, update `maxReach`!\n5. If you successfully iterate through the entire array without hitting a Dead Zone, you can reach the end!",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             {
                language: "Python",
                code: "def canJump(nums) -> bool:\n    max_reach = 0\n    for i in range(len(nums)):\n        if i > max_reach:\n            return False\n        max_reach = max(max_reach, i + nums[i])\n        if max_reach >= len(nums) - 1:\n            return True\n    return True"
             },
             {
                language: "JavaScript",
                code: "function canJump(nums) {\n    let maxReach = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (i > maxReach) return false;\n        maxReach = Math.max(maxReach, i + nums[i]);\n        if (maxReach >= nums.length - 1) return true;\n    }\n    return true;\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public boolean canJump(int[] nums) {\n        int maxReach = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (i > maxReach) return false;\n            maxReach = Math.max(maxReach, i + nums[i]);\n            if (maxReach >= nums.length - 1) return true;\n        }\n        return true;\n    }\n}"
             },
             {
                language: "C++",
                code: "bool canJump(vector<int>& nums) {\n    int maxReach = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        if (i > maxReach) return false;\n        maxReach = max(maxReach, i + nums[i]);\n        if (maxReach >= nums.size() - 1) return true;\n    }\n    return true;\n}"
             }
          ]
       }
    ]
  }
];
