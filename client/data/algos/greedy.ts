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
  },
  {
    id: "n-meetings-in-one-room",
    title: "N Meetings in one room",
    topic: "Greedy Algorithms",
    category: "Interval Scheduling",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Find the maximum number of meetings that can be performed in a single room.",
    leetcodeLink: "",
    useCases: ["Scheduling CPU tasks", "Room booking systems"],
    approaches: [
       {
          name: "Optimal (Sort by End Time)",
          description: "### 🧠 The Core Concept\nTo fit the most meetings in one room, you should always pick the meeting that **finishes the earliest**. \n\nBy picking the earliest-finishing meeting, you maximize the remaining time available for future meetings.\n\n### 🛠️ Execution Strategy\n1. Store meetings as `(start, end, index)` tuples.\n2. Sort meetings primarily by their **end time**.\n3. Iterate: If the next meeting's start time > previous meeting's end time, accept it and update the 'last finish time'.",
          timeComplexity: "O(N log N)",
          timeComplexityExplanation: "Sorting takes N log N.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Storage for meeting structures.",
          implementations: [
             {
                language: "Python",
                code: "def maxMeetings(n, start, end):\n    meetings = sorted(zip(start, end, range(n)), key=lambda x: x[1])\n    count = 1\n    last_end = meetings[0][1]\n    for i in range(1, n):\n        if meetings[i][0] > last_end:\n            count += 1\n            last_end = meetings[i][1]\n    return count"
             }
          ]
       }
    ]
  },
  {
    id: "job-sequencing-problem",
    title: "Job Sequencing Protocol",
    topic: "Greedy Algorithms",
    category: "Greedy Patterns",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Given a set of jobs where each job has a deadline and profit. Every job takes 1 unit of time and only one job can be scheduled at a time. Maximize profit.",
    leetcodeLink: "",
    useCases: ["Profit maximization in logistics", "Task priority scheduling"],
    approaches: [
       {
          name: "Optimal (Sort by Profit + Deadline Slots)",
          description: "### 🧠 The Core Concept\nSince all jobs take equal time, we should prioritize the jobs with the **Highest Profit**.\n\nTo give other jobs a chance, we should schedule each high-profit job at the **latest possible time slot** before its deadline.\n\n### 🛠️ Execution Strategy\n1. Sort jobs by profit (Descending).\n2. Find the maximum deadline to size our 'Schedule' array.\n3. For each job, try to place it in the latest available slot $(\le deadline)$.",
          timeComplexity: "O(N * MaxDeadline)",
          timeComplexityExplanation: "Outer loop for jobs, inner loop to find slot.",
          spaceComplexity: "O(MaxDeadline)",
          spaceComplexityExplanation: "Schedule array tracking.",
          implementations: [
             {
                language: "Python",
                code: "def JobScheduling(Jobs, n):\n    Jobs.sort(key=lambda x: x.profit, reverse=True)\n    max_d = max(j.deadline for j in Jobs)\n    slot = [-1] * (max_d + 1)\n    count, profit = 0, 0\n    for j in Jobs:\n        for k in range(j.deadline, 0, -1):\n            if slot[k] == -1:\n                slot[k] = j.id\n                count += 1\n                profit += j.profit\n                break\n    return count, profit"
             }
          ]
       }
    ]
  },
  {
    id: "lemonade-change",
    title: "Lemonade Change",
    topic: "Greedy Algorithms",
    category: "Greedy Patterns",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Determine if you can provide change to every customer starting with no money.",
    leetcodeLink: "https://leetcode.com/problems/lemonade-change/",
    useCases: ["Cash flow validation"],
    approaches: [
       {
          name: "Optimal (Greedy Choice)",
          description: "### 🧠 The Core Concept\nAlways prioritize giving a $10 bill and a $5 bill as change for a $20 bill, rather than three $5 bills. $5 bills are more 'valuable' for future change.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function lemonadeChange(bills) {\n    let five = 0, ten = 0;\n    for (let x of bills) {\n        if (x === 5) five++;\n        else if (x === 10) { if (five === 0) return false; five--; ten++; }\n        else {\n            if (ten > 0 && five > 0) { ten--; five--; }\n            else if (five >= 3) five -= 3;\n            else return false;\n        }\n    }\n    return true;\n}" }
          ]
       }
    ]
  },
  {
    id: "valid-parenthesis-string",
    title: "Valid Parenthesis String",
    topic: "Greedy Algorithms",
    category: "Greedy Patterns",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Check if a string with '(', ')' and '*' (wildcard) is valid.",
    leetcodeLink: "https://leetcode.com/problems/valid-parenthesis-string/",
    useCases: ["Flexible syntax validation"],
    approaches: [
       {
          name: "Optimal (Min/Max Balance)",
          description: "### 🧠 The Core Concept\nKeep track of the range of possible open brackets. `minOpen` ignores `*` as `)`, `maxOpen` treats `*` as `(`.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def checkValidString(s):\n    mi = ma = 0\n    for c in s:\n        if c == '(': mi += 1; ma += 1\n        elif c == ')': mi -= 1; ma -= 1\n        else: mi -= 1; ma += 1\n        if ma < 0: return False\n        if mi < 0: mi = 0\n    return mi == 0" }
          ]
       }
    ]
  },
  {
    id: "jump-game-ii",
    title: "Jump Game II (Min Jumps)",
    topic: "Greedy Algorithms",
    category: "Greedy Patterns",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the minimum number of jumps to reach the last index.",
    leetcodeLink: "https://leetcode.com/problems/jump-game-ii/",
    useCases: ["Shortest path in distance-constrained graphs"],
    approaches: [
       {
          name: "Optimal (Greedy Range Expansion)",
          description: "### 🧠 The Core Concept\nJump as far as possible within the current reach. When you reach the boundary of your current jump, increment jump count and update the boundary to the farthest point found.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function jump(nums) {\n    let jumps = 0, curEnd = 0, curFarthest = 0;\n    for (let i = 0; i < nums.length - 1; i++) {\n        curFarthest = Math.max(curFarthest, i + nums[i]);\n        if (i === curEnd) { jumps++; curEnd = curFarthest; }\n    }\n    return jumps;\n}" }
          ]
       }
    ]
  },
  {
    id: "candy",
    title: "Candy Distribution",
    topic: "Greedy Algorithms",
    category: "Greedy Patterns",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Give candies to children such that those with higher ratings get more than neighbors.",
    leetcodeLink: "https://leetcode.com/problems/candy/",
    useCases: ["Incentive alignment"],
    approaches: [
       {
          name: "Optimal (Two-Pass Greedy)",
          description: "### 🧠 The Core Concept\n1. Left-to-Right: Ensure child $i$ gets more than $i-1$ if rating is higher.\n2. Right-to-Left: Ensure child $i$ gets more than $i+1$ if rating is higher.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "Python", code: "def candy(ratings):\n    n = len(ratings); res = [1] * n\n    for i in range(1, n):\n        if ratings[i] > ratings[i-1]: res[i] = res[i-1] + 1\n    for i in range(n-2, -1, -1):\n        if ratings[i] > ratings[i+1]: res[i] = max(res[i], res[i+1] + 1)\n    return sum(res)" }
          ]
       }
    ]
  },
  {
    id: "fractional-knapsack",
    title: "Fractional Knapsack",
    topic: "Greedy Algorithms",
    category: "Greedy Patterns",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Maximize value in a knapsack by taking fractions of items.",
    leetcodeLink: "",
    useCases: ["Material cutting", "Portfolio optimization"],
    approaches: [
       {
          name: "Optimal (Value/Weight Ratio)",
          description: "### 🧠 The Core Concept\nSort items by density (Value/Weight). Take as much as possible of the densest item.",
          timeComplexity: "O(N log N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function fractionalKnapsack(W, items) {\n    items.sort((a,b) => (b.val/b.wt) - (a.val/a.wt));\n    let res = 0;\n    for (let item of items) {\n        if (W >= item.wt) { res += item.val; W -= item.wt; }\n        else { res += item.val * (W / item.wt); break; }\n    }\n    return res;\n}" }
          ]
       }
    ]
  }
];
