import { AlgorithmEntry } from "./types";

export const arraysAlgorithms: AlgorithmEntry[] = [
  {
    id: "two-sum",
    title: "Two Sum (Sorted & Unsorted)",
    topic: "Arrays - Medium",
    category: "Two Pointers",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "We need to find two numbers in an array that add up to a specific target.",
    leetcodeLink: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    useCases: ["Finding pairs matching a sum", "Checking palindromes", "Container with most water"],
    visualizerCode: "let arr = [1, 4, 7, 10, 15, 20];\nlet target = 17;\nlet left = 0;\nlet right = arr.length - 1;\n\nrecordTrace({\n  narrative: `We place our left pointer at index 0 (value = ${arr[left]}), and right pointer at the very end (value = ${arr[right]}). We want them to add up to ${target}.`,\n  working_array: [...arr], target_sum: target, left_index: left, right_index: right\n});\n\nwhile (left < right) {\n  let sum = arr[left] + arr[right];\n  if (sum === target) {\n    recordTrace({ explanation: `Perfect! ${arr[left]} + ${arr[right]} = ${target}.`, working_array: [...arr], solution_found: [left, right], status: \"Complete\" });\n    break;\n  } else if (sum < target) {\n    recordTrace({ tip: `Our sum (${sum}) is LESS than ${target}. Slider LEFT rightward.`, working_array: [...arr], action: \"->\", left_index: left + 1, right_index: right });\n    left++;\n  } else {\n    recordTrace({ tip: `Our sum (${sum}) is GREATER than ${target}. Slider RIGHT leftward.`, working_array: [...arr], action: \"<-\", left_index: left, right_index: right - 1 });\n    right--;\n  }\n}",
    approaches: [
      {
        name: "Brute Force",
        description: "### 🧠 The Core Concept\nImagine you have a stack of cards laid out in front of you.\nYour task? Find two cards that add up exactly to the target.\n\n### 🚨 The Naive Method\nThe absolute most obvious way to solve this is to pick up the very first card, and then test it against every single other card on the table.\n\nBecause if you have 100,000 cards, you are performing a nested loop resulting in N × N operations. That's **10 Billion checks!** O(N²) Time Complexity.",
        timeComplexity: "O(N²)",
        timeComplexityExplanation: "We perform a nested loop checking every single card against every other remaining card. For N elements, it executes roughly N*(N-1)/2 operations.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "We are only using two simple integer pointers `i` and `j` to track our position. No extra arrays or data structures are allocated.",
        implementations: [
          {
            language: "Python",
            code: "def twoSum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []"
          },
          {
            language: "JavaScript",
            code: "function twoSum(nums, target) {\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = i + 1; j < nums.length; j++) {\n            if (nums[i] + nums[j] === target) return [i, j];\n        }\n    }\n    return [];\n}"
          },
          {
             language: "Java",
             code: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        for (int i = 0; i < nums.length; i++) {\n            for (int j = i + 1; j < nums.length; j++) {\n                if (nums[i] + nums[j] == target) return new int[]{i, j};\n            }\n        }\n        return new int[]{};\n    }\n}"
          },
          {
             language: "C++",
             code: "vector<int> twoSum(vector<int>& nums, int target) {\n    for (int i = 0; i < nums.size(); i++) {\n        for (int j = i + 1; j < nums.size(); j++) {\n            if (nums[i] + nums[j] == target) return {i, j};\n        }\n    }\n    return {};\n}"
          }
        ]
      },
      {
        name: "Optimal (Two Pointers / Sorting approach)",
        description: "### ✨ The Pointer Magic\nIf the array is sorted, we place one finger on the **SMALLEST** number (left edge), and one finger on the **LARGEST** number (right edge).\n\nIf the sum is too big, move the right finger inward. If too small, move the left finger inward. Time Complexity drops spectacularly down into O(N). Pure magic!",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "We process each element exactly once by pulling the pointers inwards. The while loop gracefully shrinks the window in purely linear time.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "The two pointers physically collapse inward using constant overhead. We don't employ any HashMaps or auxiliary sorting grids.",
        implementations: [
          {
            language: "Python",
            code: "def twoSum(nums, target):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        s = nums[left] + nums[right]\n        if s == target: return [left, right]\n        if s < target: left += 1\n        else: right -= 1\n    return []"
          },
          {
            language: "JavaScript",
            code: "function twoSum(nums, target) {\n    let left = 0, right = nums.length - 1;\n    while (left < right) {\n        let sum = nums[left] + nums[right];\n        if (sum === target) return [left, right];\n        if (sum < target) left++;\n        else right--;\n    }\n    return [];\n}"
          },
          {
             language: "Java",
             code: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left < right) {\n            int sum = nums[left] + nums[right];\n            if (sum == target) return new int[]{left, right};\n            if (sum < target) left++;\n            else right--;\n        }\n        return new int[]{};\n    }\n}"
          },
          {
             language: "C++",
             code: "vector<int> twoSum(vector<int>& nums, int target) {\n    int left = 0, right = nums.size() - 1;\n    while (left < right) {\n        int sum = nums[left] + nums[right];\n        if (sum == target) return {left, right};\n        if (sum < target) left++;\n        else right--;\n    }\n    return {};\n}"
          }
        ]
      }
    ]
  },
  {
    id: "kadanes-algorithm",
    title: "Kadane's Algorithm (Max Subarray Sum)",
    topic: "Arrays - Medium",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Finding the contiguous subarray within a one-dimensional array of numbers which has the largest sum.",
    leetcodeLink: "https://leetcode.com/problems/maximum-subarray/",
    useCases: ["Financial tracking", "Data sequence peak detection", "Signal processing computing"],
    approaches: [
       {
          name: "Optimal (Kadane's Dynamic Approach)",
          description: "### 🧠 The Train Analogy\nImagine you are picking up passengers sequentially along a train route. Each passenger you pick up pays you money (positive numbers), but some stops cost you a massive toll fee (negative numbers).\n\nIf your total cash in hand drops into the **negatives**, would you carry that debt forward? No! You throw it away and reset your count to zero, starting fresh from the next stop. But you always remember the *highest amount of money you ever held at any point*.\n\n### 🛠️ Step-by-Step\n1. Iterate through every number.\n2. Add the number to your `currentSum`.\n3. Update your `maxSum` if `currentSum` is the highest you've ever seen.\n4. If `currentSum` drops below 0, reset it to 0!\nOnly $O(N)$ running time. Flawless.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "The algorithm effortlessly loops through the numeric data exactly one single time. There is absolute zero backtracking; once you pass a station, you never look behind you.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Only two variables (maxSum and currentSum) are tracked in memory. You don't need a DP array or Hash cache. Perfect efficiency.",
          implementations: [
             {
                language: "Python",
                code: "def maxSubArray(nums):\n    max_sum = float('-inf')\n    current_sum = 0\n    for num in nums:\n        current_sum += num\n        if current_sum > max_sum:\n            max_sum = current_sum\n        if current_sum < 0:\n            current_sum = 0\n    return max_sum"
             },
             {
                language: "JavaScript",
                code: "function maxSubArray(nums) {\n    let maxSum = -Infinity;\n    let currentSum = 0;\n    for(let i=0; i<nums.length; i++) {\n        currentSum += nums[i];\n        if(currentSum > maxSum) maxSum = currentSum;\n        if(currentSum < 0) currentSum = 0;\n    }\n    return maxSum;\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public int maxSubArray(int[] nums) {\n        long maxSum = Long.MIN_VALUE;\n        long currentSum = 0;\n        for(int num : nums) {\n            currentSum += num;\n            if (currentSum > maxSum) maxSum = currentSum;\n            if (currentSum < 0) currentSum = 0;\n        }\n        return (int)maxSum;\n    }\n}"
             },
             {
                language: "C++",
                code: "int maxSubArray(vector<int>& nums) {\n    long long maxSum = LLONG_MIN;\n    long long currentSum = 0;\n    for(int i=0; i<nums.size(); i++) {\n        currentSum += nums[i];\n        if (currentSum > maxSum) maxSum = currentSum;\n        if (currentSum < 0) currentSum = 0;\n    }\n    return maxSum;\n}"
             }
          ]
       }
    ]
  }
];
