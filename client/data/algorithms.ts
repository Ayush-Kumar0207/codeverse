export interface CodeImplementation {
  language: string; 
  code: string;
}

export interface AlgorithmApproach {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  implementations: CodeImplementation[];
}

export interface AlgorithmEntry {
  id: string;
  title: string;
  category: string;
  frequencyLevel: "Very High" | "High" | "Medium" | "Niche";
  difficulty: "Easy" | "Medium" | "Hard";
  overview: string;
  leetcodeLink?: string;
  useCases: string[];
  approaches: AlgorithmApproach[];
  visualizerCode?: string;
}

export const AT_ALGORITHMS: AlgorithmEntry[] = [
  {
    id: "two-pointer-target-sum",
    title: "Two-Pointer Sorted Target Sum",
    category: "Two Pointers",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "We need to find two numbers in an array that add up to a specific target. Because the array is already sorted, we can use a highly elegant strategy where two pointers start at opposite ends of the array and walk inwards.",
    leetcodeLink: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    useCases: ["Finding pairs matching a sum", "Checking palindromes", "Container with most water"],
    approaches: [
      {
        name: "Brute Force",
        description: "### 🧠 The Core Concept\nImagine you have a stack of cards laid out in front of you, sorted from lowest to highest.\nYour task? Find two cards that add up exactly to the number **17**.\n\n### 🚨 The Naive Method\nThe absolute most obvious way to solve this is to pick up the very first card, and then test it against every single other card on the table.\n- Check **Card 1 + Card 2**\n- Check **Card 1 + Card 3**\n... and so on. If it doesn't match, you pick up Card 2 and test it against every remaining card.\n\n*Why is this bad?* Because if you have 100,000 cards, you are performing a nested loop resulting in N × N operations. That's **10 Billion checks!** Your computer will literally start stuttering and the server will timeout. This is called O(N²) Time Complexity.",
        timeComplexity: "O(N²)",
        spaceComplexity: "O(1)",
        implementations: [
          {
            language: "JavaScript",
            code: "function twoSumBruteForce(numbers, target) {\n  for (let i = 0; i < numbers.length; i++) {\n    for (let j = i + 1; j < numbers.length; j++) {\n      if (numbers[i] + numbers[j] === target) {\n        return [i + 1, j + 1];\n      }\n    }\n  }\n  return [];\n}"
          },
          {
            language: "Python",
            code: "def twoSumBruteForce(numbers, target):\n    for i in range(len(numbers)):\n        for j in range(i + 1, len(numbers)):\n            if numbers[i] + numbers[j] == target:\n                return [i + 1, j + 1]\n    return []"
          },
          {
            language: "Java",
            code: "class Solution {\n    public int[] twoSumBruteForce(int[] numbers, int target) {\n        for (int i = 0; i < numbers.length; i++) {\n            for (int j = i + 1; j < numbers.length; j++) {\n                if (numbers[i] + numbers[j] == target) {\n                    return new int[]{i + 1, j + 1};\n                }\n            }\n        }\n        return new int[]{};\n    }\n}"
          },
          {
            language: "C++",
            code: "vector<int> twoSumBruteForce(vector<int>& numbers, int target) {\n    for (int i = 0; i < numbers.size(); i++) {\n        for (int j = i + 1; j < numbers.size(); j++) {\n            if (numbers[i] + numbers[j] == target) {\n                return {i + 1, j + 1};\n            }\n        }\n    }\n    return {};\n}"
          }
        ]
      },
      {
        name: "Optimal (Two Pointers)",
        description: "### ✨ The Pointer Magic\nInstead of being blind, let's use the fact that the array is **SORTED**. This is the ultimate cheat code!\n\nWe place one finger on the **SMALLEST** number (left edge), and one finger on the **LARGEST** number (right edge).\n\n### 🛠️ Execution Steps:\n1. **Calculate the Sum**: Add the two numbers exactly where your fingers are pointing. \n2. **Too Big?**: If our sum is 25 and our target is 17, we must make the sum smaller! We can't move the left finger (moving it to the right gives us bigger numbers). We *must* move the **right finger** to the left to capture a smaller value.\n3. **Too Small?**: If our sum is 10 and our target is 17, we need a bigger number. We slide the **left finger** to the right to reach higher numbers!\n4. **Match!**: If it equals exactly 17, boom! Return the indices.\n\nBecause each finger only ever moves horizontally towards the center, we only scan the array *once*. Time Complexity drops spectacularly down into O(N). Pure magic!",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        implementations: [
          {
            language: "JavaScript",
            code: "function twoSumOptimal(numbers, target) {\n  let left = 0;\n  let right = numbers.length - 1;\n\n  while (left < right) {\n    let sum = numbers[left] + numbers[right];\n    if (sum === target) return [left + 1, right + 1];\n    \n    if (sum < target) left++;\n    else right--;\n  }\n  return [];\n}"
          },
          {
            language: "Python",
            code: "def twoSumOptimal(numbers, target):\n    left, right = 0, len(numbers) - 1\n    \n    while left < right:\n        curr_sum = numbers[left] + numbers[right]\n        if curr_sum == target:\n            return [left + 1, right + 1]\n            \n        if curr_sum < target:\n            left += 1\n        else:\n            right -= 1\n            \n    return []"
          },
          {
            language: "Java",
            code: "class Solution {\n    public int[] twoSumOptimal(int[] numbers, int target) {\n        int left = 0;\n        int right = numbers.length - 1;\n        \n        while (left < right) {\n            int sum = numbers[left] + numbers[right];\n            if (sum == target) return new int[]{left + 1, right + 1};\n            \n            if (sum < target) left++;\n            else right--;\n        }\n        return new int[]{};\n    }\n}"
          },
          {
            language: "C++",
            code: "vector<int> twoSumOptimal(vector<int>& numbers, int target) {\n    int left = 0, right = numbers.size() - 1;\n    \n    while (left < right) {\n        int sum = numbers[left] + numbers[right];\n        if (sum == target) return {left + 1, right + 1};\n        \n        if (sum < target) left++;\n        else right--;\n    }\n    return {};\n}"
          }
        ]
      }
    ],
    visualizerCode: "let arr = [1, 4, 7, 10, 15, 20];\nlet target = 17;\nlet left = 0;\nlet right = arr.length - 1;\n\nrecordTrace({\n  narrative: `We place our left pointer at index 0 (value = ${arr[left]}), and right pointer at the very end (value = ${arr[right]}). We want them to add up to ${target}.`,\n  working_array: [...arr], target_sum: target, left_index: left, right_index: right\n});\n\nwhile (left < right) {\n  let sum = arr[left] + arr[right];\n  if (sum === target) {\n    recordTrace({ explanation: `Perfect! ${arr[left]} + ${arr[right]} = ${target}.`, working_array: [...arr], solution_found: [left, right], status: \"Complete\" });\n    break;\n  } else if (sum < target) {\n    recordTrace({ tip: `Our sum (${sum}) is LESS than ${target}. Slider LEFT rightward.`, working_array: [...arr], action: \"->\", left_index: left + 1, right_index: right });\n    left++;\n  } else {\n    recordTrace({ tip: `Our sum (${sum}) is GREATER than ${target}. Slider RIGHT leftward.`, working_array: [...arr], action: \"<-\", left_index: left, right_index: right - 1 });\n    right--;\n  }\n}"
  },
  {
    id: "sliding-window-max",
    title: "Sliding Window Maximum Sum",
    category: "Sliding Window",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Imagine examining a sub-section of an array (a 'window'). If we want to find the largest sum of K consecutive elements, recalculating the sum every time we move the window is wasteful. A sliding window shifts smoothly by just subtracting the element that falls behind, and adding the element that enters.",
    leetcodeLink: "https://leetcode.com/problems/maximum-average-subarray-i/",
    useCases: ["Network peak traffic analysis", "Financial rolling averages", "Analyzing fixed sub-strings"],
    approaches: [
      {
        name: "Optimal (Sliding Window)",
        description: "### 🧠 The Core Problem\nImagine standing on a train looking at 3 window panels at a time. The train moves forward by exactly **one** panel. Instead of recounting the contents of all 3 panels again, wouldn't it be easier to just realize that only **one panel disappeared** from your view, and **one new panel appeared**?\n\n### 🛠️ Execution Strategy\n1. **Initialize the Window**: First, we create our baseline. We loop through the first K elements and add them together. This is our first Window.\n2. **Slide the Glass**: We begin shifting our window to the right by exactly one slot.\n3. **The Equation**:\n   `New Window Sum = Old Window Sum - (Element Falling Behind) + (Element Entering Front)`\n4. **Compare**: Is this new window sum larger than our highest recorded sum? If yes, save it!\n\nBy never re-calculating the inner elements of the window, you skip millions of pointless addition operations, collapsing the time complexity perfectly flat into O(N)!",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        implementations: [
          {
            language: "JavaScript",
            code: "function maxSubarraySumOptimal(arr, k) {\n  let maxSum = 0, windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += arr[i];\n  maxSum = windowSum;\n\n  for (let i = k; i < arr.length; i++) {\n    windowSum += arr[i] - arr[i - k]; \n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}"
          },
          {
            language: "Python",
            code: "def maxSubarraySumOptimal(arr, k):\n    window_sum = sum(arr[:k])\n    max_sum = window_sum\n\n    for i in range(k, len(arr)):\n        window_sum += arr[i] - arr[i - k]\n        max_sum = max(max_sum, window_sum)\n\n    return max_sum"
          },
          {
            language: "Java",
            code: "class Solution {\n    public int maxSubarraySumOptimal(int[] arr, int k) {\n        int windowSum = 0, maxSum = 0;\n        \n        for (int i = 0; i < k; i++) windowSum += arr[i];\n        maxSum = windowSum;\n        \n        for (int i = k; i < arr.length; i++) {\n            windowSum += arr[i] - arr[i - k];\n            maxSum = Math.max(maxSum, windowSum);\n        }\n        return maxSum;\n    }\n}"
          },
          {
            language: "C++",
            code: "int maxSubarraySumOptimal(vector<int>& arr, int k) {\n    int windowSum = 0, maxSum = 0;\n    \n    for (int i = 0; i < k; i++) windowSum += arr[i];\n    maxSum = windowSum;\n    \n    for (int i = k; i < arr.size(); i++) {\n        windowSum += arr[i] - arr[i - k];\n        maxSum = max(maxSum, windowSum);\n    }\n    return maxSum;\n}"
          }
        ]
      }
    ]
  },
  {
    id: "binary-search",
    title: "Binary Search",
    category: "Divide & Conquer",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "When looking for a word in a dictionary, you don't read page by page. You open the middle, check if your word is earlier or later, and tear away the half that is useless. Binary search revolves around halving the search space every single step.",
    leetcodeLink: "https://leetcode.com/problems/binary-search/",
    useCases: ["Database engine lookups", "Finding zero-crossings", "Git bisect logic"],
    approaches: [
      {
        name: "Optimal (Divide & Conquer)",
        description: "### 🧠 The Core Problem\nIf I asked you to find the word **\"Zebra\"** in a dictionary, would you start at Page 1, Word 1 (\"Aardvark\") and read thousands of pages sequentially? Absolutely not. \n\nYou would split the book down the middle, see you landed on \"M\", realize that \"Z\" is after \"M\", and literally tear off and throw away the entire left half of the dictionary! You keep repeating this until you easily pinpoint \"Zebra\".\n\n### 🛠️ Execution Strategy\n1. **Set the Bounds**: Place a `left` pointer at the start (index 0) and a `right` pointer at the end of the array.\n2. **Strike the Middle**: Calculate the middle point: `mid = (left + right) / 2`.\n3. **Compare**: Check the number at that middle spot.\n   - Is it the target? You're done! Return the index.\n   - Is it **too small**? The target MUST lie to the right! Discard everything to the left by moving `left = mid + 1`.\n   - Is it **too big**? The target MUST lie to the left! Discard everything to the right by moving `right = mid - 1`.\n\nEvery single step **destroys 50% of the remaining array**. It is so catastrophically fast that if you had an array with 4,000,000,000 (4 Billion) elements, it would only take roughly **32 checks** to find your exact number. That's the power of O(log N).",
        timeComplexity: "O(log N)",
        spaceComplexity: "O(1)",
        implementations: [
          {
            language: "JavaScript",
            code: "function binarySearch(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while(left <= right) {\n      let mid = Math.floor((left + right)/2);\n      if(nums[mid] === target) return mid;\n      \n      if(nums[mid] < target) left = mid + 1;\n      else right = mid - 1;\n  }\n  return -1;\n}"
          },
          {
            language: "Python",
            code: "def binarySearch(nums, target):\n    left, right = 0, len(nums) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        \n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n            \n    return -1"
          },
          {
            language: "Java",
            code: "class Solution {\n    public int binarySearch(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        \n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            \n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n}"
          },
          {
            language: "C++",
            code: "int binarySearch(vector<int>& nums, int target) {\n    int left = 0, right = nums.size() - 1;\n    \n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] == target) return mid;\n        \n        if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}"
          }
        ]
      }
    ]
  },
  {
    id: "dp-lcs",
    title: "Longest Common Subsequence",
    category: "Dynamic Programming (2D)",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "We need to find the longest sequence of characters that appear in the exact same format across two strings. This powers text diffing architectures like Git.",
    leetcodeLink: "https://leetcode.com/problems/longest-common-subsequence/",
    useCases: ["Git Diff (Text diffing)", "DNA sequence alignment", "Plagiarism detection"],
    approaches: [
      {
        name: "Optimal (2D Matrix Tabulation)",
        description: "### 🧠 The Core Problem\nTo completely solve Longest Common Subsequence (LCS), you have to break down large strings into tiny 1-letter puzzles.\n\nImagine you are comparing the strings `abcde` and `ace`. Dynamic programming forces you to construct a 2D Matrix Grid on a piece of paper, placing one word on the Top axis and one on the Left axis.\n\n### 🛠️ Execution Strategy\n1. **Initialize the Matrix**: Create a grid full of zeros. The dimension is `(text1.length + 1) x (text2.length + 1)`. We need that extra padding row/col of zeros as our \"base case\" (comparing against an empty string).\n2. **Fill the Grid**: We run a double-loop. At each `cell(i, j)`, we look at the corresponding letter from `text1` and `text2`.\n3. **The Magic Conditionals**:\n   - 🟢 **MATCH!**: If `text1[i] == text2[j]`, then we have a common letter! We add **+1** to whatever score exists **diagonally up and to the left** (`dp[i-1][j-1]`). Why diagonal? Because that diagonal cell represents the longest string *before* we included these matching letters!\n   - 🔴 **MISMATCH!**: If the letters are different, we can't add to the score. We simply \"carry forward\" the highest score we've discovered so far. We literally look directly **above** (`dp[i-1][j]`) and directly to the **left** (`dp[i][j-1]`), figure out which is bigger, and copy it into our current cell.\n\nWhen the grid is finally full, your absolute highest score rests safely in the absolute bottom-right corner cell!",
        timeComplexity: "O(N * M)",
        spaceComplexity: "O(N * M)",
        implementations: [
          {
            language: "JavaScript",
            code: "function longestCommonSubsequence(text1, text2) {\n  const dp = Array(text1.length + 1).fill(0).map(\n    () => Array(text2.length + 1).fill(0)\n  );\n  \n  for (let i = 1; i <= text1.length; i++) {\n    for (let j = 1; j <= text2.length; j++) {\n      if (text1[i - 1] === text2[j - 1]) {\n        dp[i][j] = dp[i - 1][j - 1] + 1;\n      } else {\n        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n      }\n    }\n  }\n  return dp[text1.length][text2.length];\n}"
          },
          {
            language: "Python",
            code: "def longestCommonSubsequence(text1, text2):\n    dp = [[0] * (len(text2) + 1) for _ in range(len(text1) + 1)]\n    \n    for i in range(1, len(text1) + 1):\n        for j in range(1, len(text2) + 1):\n            if text1[i - 1] == text2[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1] + 1\n            else:\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n                \n    return dp[len(text1)][len(text2)]"
          },
          {
            language: "Java",
            code: "class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        int[][] dp = new int[text1.length() + 1][text2.length() + 1];\n        \n        for (int i = 1; i <= text1.length(); i++) {\n            for (int j = 1; j <= text2.length(); j++) {\n                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {\n                    dp[i][j] = dp[i - 1][j - 1] + 1;\n                } else {\n                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n                }\n            }\n        }\n        return dp[text1.length()][text2.length()];\n    }\n}"
          },
          {
            language: "C++",
            code: "int longestCommonSubsequence(string text1, string text2) {\n    int n = text1.length(), m = text2.length();\n    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));\n    \n    for (int i = 1; i <= n; i++) {\n        for (int j = 1; j <= m; j++) {\n            if (text1[i - 1] == text2[j - 1]) {\n                dp[i][j] = dp[i - 1][j - 1] + 1;\n            } else {\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);\n            }\n        }\n    }\n    return dp[n][m];\n}"
          }
        ]
      }
    ]
  },
  {
    id: "bfs-graph",
    title: "Breadth-First Search (Graph Maze)",
    category: "Graph Traversals",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Imagine dropping a stone in a pond. BFS traverses a graph exactly like those outward ripples. It explores all immediate neighbors first, before moving one layer deeper.",
    leetcodeLink: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",
    useCases: ["Finding shortest path (GPS)", "Social network connections", "Web Crawler spiders"],
    approaches: [
      {
        name: "Optimal (Queue-Based)",
        description: "### 🧠 The Core Problem\nYou are inside a massive maze. Depth First Search (DFS) would mean tying a rope to your waist, picking a single hallway, and sprinting blindly into the darkness until you hit a dead end, before backtracking. \n\n**Breadth-First Search (BFS)** is different. Instead of sprinting down one hallway, imagine you split into 4 clones, and take exactly 1 step into all 4 accessible hallways at the same time. Then, every clone takes 1 more step. Because you expand outwards equally like a ripple in a pond, the first clone that hits the exit is guaranteed to have found the absolute shortest path!\n\n### 🛠️ Execution Strategy\n1. **The Waiting Line (Queue)**: In code, we can't clone ourselves. So we use a `Queue` (a First-In-First-Out waiting line). We push our `startNode` into the line.\n2. **Explore**: While the line isn't empty, we pop the first person out of the line. Is this the exit? If yes, we win! \n3. **Queue Followers**: If it's not the exit, we look at all the connected rooms (neighbors). If we haven't visited them yet, we mark them visited, and push them to the **BACK** of the waiting line. \n\nBy always pulling from the front and pushing to the back, we naturally explore exactly 1 radius outward at a time before moving further.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        implementations: [
          {
            language: "JavaScript",
            code: "function bfsShortestPath(graph, startNode, targetNode) {\n  let queue = [{ node: startNode, distance: 0 }];\n  let visited = new Set();\n  visited.add(startNode);\n\n  while (queue.length > 0) {\n    let current = queue.shift(); \n    \n    if (current.node === targetNode) return current.distance;\n\n    for (let neighbor of graph[current.node]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push({ node: neighbor, distance: current.distance + 1 });\n      }\n    }\n  }\n  return -1;\n}"
          },
          {
            language: "Python",
            code: "from collections import deque\n\ndef bfsShortestPath(graph, startNode, targetNode):\n    queue = deque([(startNode, 0)])\n    visited = set([startNode])\n    \n    while queue:\n        node, distance = queue.popleft()\n        \n        if node == targetNode:\n            return distance\n            \n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append((neighbor, distance + 1))\n                \n    return -1"
          },
          {
            language: "Java",
            code: "class Solution {\n    public int bfsShortestPath(List<List<Integer>> graph, int start, int target) {\n        Queue<int[]> queue = new LinkedList<>();\n        Set<Integer> visited = new HashSet<>();\n        \n        queue.offer(new int[]{start, 0});\n        visited.add(start);\n        \n        while (!queue.isEmpty()) {\n            int[] current = queue.poll();\n            int node = current[0];\n            int dist = current[1];\n            \n            if (node == target) return dist;\n            \n            for (int neighbor : graph.get(node)) {\n                if (!visited.contains(neighbor)) {\n                    visited.add(neighbor);\n                    queue.offer(new int[]{neighbor, dist + 1});\n                }\n            }\n        }\n        return -1;\n    }\n}"
          },
          {
            language: "C++",
            code: "int bfsShortestPath(vector<vector<int>>& graph, int start, int target) {\n    queue<pair<int, int>> q;\n    unordered_set<int> visited;\n    \n    q.push({start, 0});\n    visited.insert(start);\n    \n    while(!q.empty()) {\n        auto current = q.front();\n        q.pop();\n        \n        int node = current.first;\n        int dist = current.second;\n        \n        if(node == target) return dist;\n        \n        for(int neighbor : graph[node]) {\n            if(visited.find(neighbor) == visited.end()) {\n                visited.insert(neighbor);\n                q.push({neighbor, dist + 1});\n            }\n        }\n    }\n    return -1;\n}"
          }
        ]
      }
    ]
  }
];
