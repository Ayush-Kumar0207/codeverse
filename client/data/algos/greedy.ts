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
          description: "### 🧠 The Core Concept: The 'Bill Scarcity' Strategy\nWhy is this greedy? Because a $5 bill is more 'flexible' than a $10 bill. You can use a $5 bill to give change for both $10 and $20, but a $10 bill only works for a $20.\n\n### 🛠️ Step-by-Step Logic\n1. If customer gives $5: keep it.\n2. If customer gives $10: must give back $5. (Decrease $5 count, increase $10 count).\n3. If customer gives $20: \n   - **Option A (Greedy)**: Give one $10 and one $5. \n   - **Option B**: Give three $5 bills.\n   - Always try Option A first to save your precious $5 bills!",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We process each customer exactly once in a single pass.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only track the count of $5 and $10 bills.",
          implementations: [
             {
                language: "Python",
                code: `def lemonadeChange(bills):
    five = ten = 0
    for b in bills:
        if b == 5: five += 1
        elif b == 10:
            if not five: return False
            five -= 1; ten += 1
        else:
            if ten > 0 and five > 0:
                ten -= 1; five -= 1
            elif five >= 3:
                five -= 3
            else:
                return False
    return True`
             },
             {
                language: "JavaScript",
                code: `function lemonadeChange(bills) {
    let five = 0, ten = 0;
    for (let x of bills) {
        if (x === 5) five++;
        else if (x === 10) { 
            if (five === 0) return false; 
            five--; ten++; 
        } else {
            if (ten > 0 && five > 0) { ten--; five--; }
            else if (five >= 3) five -= 3;
            else return false;
        }
    }
    return true;
}`
             }
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
          name: "Optimal (Range of Possibility)",
          description: "### 🧠 The Core Concept: The 'Elastic' Balance\nBecause `*` can be anything, the count of open brackets isn't a single number—it's a **Range**. \n- `minOpen`: The minimum possible open brackets (treating `*` as `)` if possible).\n- `maxOpen`: The maximum possible open brackets (treating `*` as `(` if possible).\n\nIf at any point `maxOpen < 0`, the string is impossible. If at the end `minOpen == 0`, the string is valid.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             {
                language: "Python",
                code: `def checkValidString(s):
    low = high = 0
    for char in s:
        if char == '(':
            low += 1; high += 1
        elif char == ')':
            low -= 1; high -= 1
        else:
            low -= 1; high += 1
        if high < 0: return False
        if low < 0: low = 0
    return low == 0`
             },
             {
                language: "JavaScript",
                code: `function checkValidString(s) {
    let low = 0, high = 0;
    for (let char of s) {
        if (char === '(') { low++; high++; }
        else if (char === ')') { low--; high--; }
        else { low--; high++; }
        if (high < 0) return false;
        if (low < 0) low = 0;
    }
    return low === 0;
}`
             }
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
          description: "### 🧠 The Core Concept: The 'Ladders' Analogy\nImagine you are navigating a dark hallway. Each spot has a lantern (the jump distance). You want to reach the end with minimum steps.\n\nYou stand at your current reach and look at all the spots you can jump to. You ask: *'Which of these spots has the longest lantern that lets me see the farthest into the hallway?'*\n\nYou take one 'jump' and move your boundary to that farthest spot.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             {
                language: "Python",
                code: `def jump(nums):
    jumps = 0
    current_end = 0
    farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == current_end:
            jumps += 1
            current_end = farthest
    return jumps`
             },
             {
                language: "JavaScript",
                code: `function jump(nums) {
    let jumps = 0, curEnd = 0, curFarthest = 0;
    for (let i = 0; i < nums.length - 1; i++) {
        curFarthest = Math.max(curFarthest, i + nums[i]);
        if (i === curEnd) { 
            jumps++; 
            curEnd = curFarthest; 
        }
    }
    return jumps;
}`
             }
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
          name: "Optimal (Two-Pass Greedy Sweep)",
          description: "### 🧠 The Core Concept: The 'Local Influence' Analogy\nEach child's candy count is only influenced by their immediate neighbors. \n1. **Forward Pass**: Ensure every child with a higher rating than their *left* neighbor gets more candy than them.\n2. **Backward Pass**: Ensure every child with a higher rating than their *right* neighbor gets more candy than them.\n\nBy taking the maximum of these two constraints, we satisfy all requirements with minimum total candy.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(N)",
          implementations: [
             {
                language: "Python",
                code: `def candy(ratings):
    n = len(ratings)
    candies = [1] * n
    for i in range(1, n):
        if ratings[i] > ratings[i-1]:
            candies[i] = candies[i-1] + 1
    for i in range(n-2, -1, -1):
        if ratings[i] > ratings[i+1]:
            candies[i] = max(candies[i], candies[i+1] + 1)
    return sum(candies)`
             },
             {
                language: "JavaScript",
                code: `function candy(ratings) {
    const n = ratings.length;
    let res = new Array(n).fill(1);
    for (let i = 1; i < n; i++) {
        if (ratings[i] > ratings[i-1]) res[i] = res[i-1] + 1;
    }
    for (let i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i+1]) {
            res[i] = Math.max(res[i], res[i+1] + 1);
        }
    }
    return res.reduce((a, b) => a + b, 0);
}`
             }
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
