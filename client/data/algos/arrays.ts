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
  },
  {
    id: "sort-an-array-of-0-s-1-s-and-2-s",
    title: "Sort Colors (Sort 0s, 1s, 2s)",
    topic: "Arrays - Medium",
    category: "Two Pointers / Sorting",
    frequencyLevel: "Highest",
    difficulty: "Medium",
    overview: "Given an array of 0s, 1s, and 2s, sort them in-place so that objects of the same color are adjacent.",
    leetcodeLink: "https://leetcode.com/problems/sort-colors/",
    useCases: ["Inventory partitioning", "Quick-sort partitioning variants", "Grouping categories in-place"],
    approaches: [
       {
          name: "Optimal (Dutch National Flag Algorithm)",
          description: "### 🧠 The Core Concept\nImagine you have a row of red, white, and blue balls. You want to group them without using a different box. \n\nWe use **3 Pointers**:\n- `low`: Boundary for the 0s (at the start).\n- `mid`: The explorer (scans the array).\n- `high`: Boundary for the 2s (at the end).\n\nAs we scan with `mid`, if we find a 0, we kick it to `low`. If we find a 2, we kick it to `high`. Over time, the 1s naturally gather in the middle.\n\n### 🛠️ Execution Strategy\n1. Initialize `low = 0`, `mid = 0`, `high = len - 1`.\n2. While `mid <= high`:\n   - If `nums[mid] == 0`: Swap `nums[low]` and `nums[mid]`. Increment both.\n   - If `nums[mid] == 1`: Leave it alone. Just increment `mid`.\n   - If `nums[mid] == 2`: Swap `nums[mid]` and `nums[high]`. **Only** decrement `high`. (Don't move `mid` yet, as the element we just swapped in from the end hasn't been checked!).",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We make a single pass through the array with the `mid` pointer.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The sort is performed strictly in-place with zero auxiliary buffers.",
          implementations: [
             {
                language: "Python",
                code: "def sortColors(nums):\n    low, mid, high = 0, 0, len(nums) - 1\n    while mid <= high:\n        if nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low += 1\n            mid += 1\n        elif nums[mid] == 1:\n            mid += 1\n        else:\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high -= 1"
             },
             {
                language: "JavaScript",
                code: "function sortColors(nums) {\n    let low = 0, mid = 0, high = nums.length - 1;\n    while (mid <= high) {\n        if (nums[mid] === 0) {\n            [nums[low], nums[mid]] = [nums[mid], nums[low]];\n            low++; mid++;\n        } else if (nums[mid] === 1) {\n            mid++;\n        } else {\n            [nums[mid], nums[high]] = [nums[high], nums[mid]];\n            high--;\n        }\n    }\n}"
             }
          ]
       }
    ]
  },
  {
    id: "subarray-sum-equals-k",
    title: "Subarray Sum Equals K",
    topic: "Arrays - Prefix Sum",
    category: "Arrays / Hashing",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Given an array of integers and a target k, find the total number of continuous subarrays whose sum equals to k.",
    leetcodeLink: "https://leetcode.com/problems/subarray-sum-equals-k/",
    useCases: ["Financial transaction analysis", "Segmenting audio signals", "Finding target patterns in data streams"],
    approaches: [
       {
          name: "Optimal (Prefix Sum + Hash Map)",
          description: "### 🧠 The Core Concept\nIf you know that the sum from the beginning to index $I$ is $P1$, and the sum from the beginning to index $J$ is $P2$, then the sum of the gap between $I$ and $J$ is exactly $P2 - P1$.\n\nWe want $P2 - P1 = K$, which means we are looking for a previous prefix sum that equals $P2 - K$.\n\n### 🛠️ Execution Strategy\n1. Maintain a `currentSum` as we iterate.\n2. Use a Hash Map `prefixSums` to store how many times each sum has appeared (initialize with `{0: 1}`).\n3. For every number:\n   - Add to `currentSum`.\n   - Check if `currentSum - k` exists in our map. If yes, add its count to our `totalCount`.\n   - Record the `currentSum` in the map.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We iterate through the array once and perform $O(1)$ Hash Map lookups.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "In the worst case, every prefix sum is unique and must be stored in the map.",
          implementations: [
             {
                language: "Python",
                code: "def subarraySum(nums, k):\n    res = 0\n    curr = 0\n    prefix_map = {0: 1}\n    for n in nums:\n        curr += n\n        diff = curr - k\n        res += prefix_map.get(diff, 0)\n        prefix_map[curr] = prefix_map.get(curr, 0) + 1\n    return res"
             },
             {
                language: "JavaScript",
                code: "function subarraySum(nums, k) {\n    let res = 0, curr = 0;\n    const map = new Map([[0, 1]]);\n    for (let n of nums) {\n        curr += n;\n        if (map.has(curr - k)) res += map.get(curr - k);\n        map.set(curr, (map.get(curr) || 0) + 1);\n    }\n    return res;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    topic: "Arrays - Intervals",
    category: "Arrays / Sorting",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given an array of intervals, merge all overlapping intervals.",
    leetcodeLink: "https://leetcode.com/problems/merge-intervals/",
    useCases: ["Calendar scheduling", "Cloud resource allocation", "Merging log timelines"],
    approaches: [
       {
          name: "Optimal (Sort & Merge)",
          description: "### 🧠 The Core Concept\nIf intervals are sorted by their **Start Time**, two intervals can only overlap if the current interval starts before the previous interval ends.\n\n### 🛠️ Execution Strategy\n1. Sort the intervals by Start Time.\n2. Iterate and compare the current interval with the 'Last Merged' interval in your result list.\n   - If `currentStart <= lastEnd`: Overlap! Update `lastEnd` to `max(lastEnd, currentEnd)`.\n   - If no overlap: Add the current interval as a new independent entry.",
          timeComplexity: "O(N log N)",
          timeComplexityExplanation: "The sorting step dominates the complexity.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Space required for the sorted array or the output result list.",
          implementations: [
             {
                language: "Python",
                code: "def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for i in intervals:\n        if not merged or i[0] > merged[-1][1]:\n            merged.append(i)\n        else:\n            merged[-1][1] = max(merged[-1][1], i[1])\n    return merged"
             }
          ]
       }
    ]
  },
  {
    id: "next-permutation",
    title: "Next Permutation",
    topic: "Arrays - Ad-hoc",
    category: "Arrays / Combinatorics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Compute the lexicographically next greater permutation of numbers.",
    leetcodeLink: "https://leetcode.com/problems/next-permutation/",
    useCases: ["Generating permutations", "Optimization in routing"],
    approaches: [
       {
          name: "Optimal (Naravana Pandita Algorithm)",
          description: "### 🧠 The Core Concept\nTo find the next bigger number:\n1. Find the first 'dip' from the right (`nums[i] < nums[i+1]`).\n2. If no dip, the array is descending (return reversed).\n3. Find the smallest number to the right of the dip that is larger than the dip.\n4. Swap them.\n5. Reverse everything to the right of the dip's original position.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Three sequential passes at most.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "In-place modification.",
          implementations: [
             {
                language: "Python",
                code: "def nextPermutation(nums):\n    i = len(nums) - 2\n    while i >= 0 and nums[i] >= nums[i+1]: i -= 1\n    if i >= 0:\n        j = len(nums) - 1\n        while nums[j] <= nums[i]: j -= 1\n        nums[i], nums[j] = nums[j], nums[i]\n    nums[i+1:] = reversed(nums[i+1:])"
             }
          ]
       }
    ]
  },
  {
    id: "find-the-duplicate-number",
    title: "Find the Duplicate Number",
    topic: "Arrays - Cycle Detection",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "In an array of $n+1$ integers where each integer is between 1 and n, there is exactly one duplicate. Find it without modifying the array or using extra space.",
    leetcodeLink: "https://leetcode.com/problems/find-the-duplicate-number/",
    useCases: ["Data integrity checks", "Detecting redundant records"],
    approaches: [
       {
          name: "Optimal (Floyd's Tortoise & Hare)",
          description: "### 🧠 The Core Concept\nSince values are between 1 and N, we can treat the array as a directed graph where index `i` points to `nums[i]`. \n\nA duplicate value means two different indices point to the same value—creating a **Cycle**! We then use Floyd's cycle detection.\n\n### 🛠️ Execution Strategy\n1. Find the intersection point in the cycle using fast/slow pointers.\n2. Find the entry point of the cycle (the duplicate).",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Linear traversal.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Zero extra storage.",
          implementations: [
             {
                language: "Python",
                code: "def findDuplicate(nums):\n    slow = fast = nums[0]\n    while True:\n        slow = nums[slow]\n        fast = nums[nums[fast]]\n        if slow == fast: break\n    slow = nums[0]\n    while slow != fast:\n        slow = nums[slow]\n        fast = nums[fast]\n    return slow"
             }
          ]
       }
    ]
  },
  {
    id: "majority-element-n-2-times",
    title: "Majority Element (>N/2 times)",
    topic: "Arrays - Medium",
    category: "Boyer-Moore Voting",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Find the element that appears more than floor(N/2) times in an array.",
    leetcodeLink: "https://leetcode.com/problems/majority-element/",
    useCases: ["Data consensus", "Fault-tolerant systems"],
    approaches: [
       {
          name: "Optimal (Boyer-Moore Voting Algorithm)",
          description: "### 🧠 The Core Concept\nImagine a war where different 'candidate' elements are fighting for supremacy. If two different elements fight, they both 'die' (count decreases). \n\nSince one element appears more than half the time, it will always survive the 'wars' with all other elements combined.\n\n### 🛠️ Execution Strategy\n1. Maintain a `candidate` and a `count`.\n2. Iterate through the array:\n   - If `count == 0`, set current element as `candidate`.\n   - If `element == candidate`, `count++`.\n   - Else `count--`.\n3. The remaining `candidate` is the winner.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Single linear pass.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Only two variables stored.",
          implementations: [
             { language: "Python", code: "def majorityElement(nums):\n    res = count = 0\n    for n in nums:\n        if count == 0: res = n\n        count += (1 if n == res else -1)\n    return res" }
          ]
       }
    ]
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    topic: "Arrays - Medium",
    category: "Sliding Window / Greedy",
    frequencyLevel: "Extreme",
    difficulty: "Easy",
    overview: "Find the maximum profit you can achieve by buying and selling a stock exactly once.",
    leetcodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    useCases: ["Financial profit optimization", "Finding max delta in time series"],
    approaches: [
       {
          name: "Optimal (Greedy Min-Pointer)",
          description: "### 🧠 The Core Concept\nWe keep track of the lowest price we've seen so far and check if selling at the current price yields a better profit than what we have recorded.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Linear scan.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Constant variables.",
          implementations: [
             { language: "JavaScript", code: "function maxProfit(prices) {\n    let minPrice = Infinity, maxProf = 0;\n    for (let price of prices) {\n        minPrice = Math.min(minPrice, price);\n        maxProf = Math.max(maxProf, price - minPrice);\n    }\n    return maxProf;\n}" }
          ]
       }
    ]
  },
  {
    id: "rearrange-array-elements-by-sign",
    title: "Rearrange Array Elements by Sign",
    topic: "Arrays - Medium",
    category: "Two Pointers",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Rearrange elements such that every consecutive pair contains opposite signs, starting with positive.",
    leetcodeLink: "https://leetcode.com/problems/rearrange-array-elements-by-sign/",
    useCases: ["Data balancing", "Signal alternation"],
    approaches: [
       {
          name: "Optimal (Two Index Filling)",
          description: "### 🧠 The Core Concept\nUse two pointers—one for the next positive slot (0, 2, 4...) and one for the next negative slot (1, 3, 5...).",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Single pass filling a new array.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "New array is required to maintain order in $O(N)$ time.",
          implementations: [
             { language: "Python", code: "def rearrangeArray(nums):\n    ans = [0] * len(nums)\n    pos, neg = 0, 1\n    for x in nums:\n        if x > 0:\n            ans[pos] = x\n            pos += 2\n        else:\n            ans[neg] = x\n            neg += 2\n    return ans" }
          ]
       }
    ]
  },
  {
    id: "leaders-in-an-array",
    title: "Leaders in an Array",
    topic: "Arrays - Medium",
    category: "Scanning",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Find all elements that are greater than all elements to their right.",
    leetcodeLink: "",
    useCases: ["Stock peak analysis", "Building skyline view"],
    approaches: [
       {
          name: "Optimal (Reverse Scan)",
          description: "### 🧠 The Core Concept\nStart from the right. Keep track of the maximum seen so far. If a current element is greater than this max, it's a leader.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Single linear pass from right to left.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Ignoring output array space.",
          implementations: [
             { language: "JavaScript", code: "function findLeaders(arr) {\n    let max = -Infinity, leaders = [];\n    for (let i = arr.length - 1; i >= 0; i--) {\n        if (arr[i] > max) {\n            max = arr[i];\n            leaders.push(arr[i]);\n        }\n    }\n    return leaders.reverse();\n}" }
          ]
       }
    ]
  },
  {
    id: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    topic: "Arrays - Medium",
    category: "Hashing",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given an unsorted array, find the length of the longest consecutive elements sequence in $O(N)$ time.",
    leetcodeLink: "https://leetcode.com/problems/longest-consecutive-sequence/",
    useCases: ["Data grouping", "Interval identification"],
    approaches: [
       {
          name: "Optimal (Set Lookup)",
          description: "### 🧠 The Core Concept\nPut everything in a Set. For each element, check if it's the 'start' of a sequence (i.e., `x-1` is not in the set). If yes, count how far the sequence goes.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Even with the inner while loop, each number is visited at most twice.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Set stores all N elements.",
          implementations: [
             { language: "Python", code: "def longestConsecutive(nums):\n    s = set(nums)\n    longest = 0\n    for x in s:\n        if (x - 1) not in s:\n            curr = x\n            count = 1\n            while (curr + 1) in s:\n                curr += 1\n                count += 1\n            longest = max(longest, count)\n    return longest" }
          ]
       }
    ]
  },
  {
    id: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    topic: "Arrays - Medium",
    category: "Matrix",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "If an element in an $M \times N$ matrix is 0, set its entire row and column to 0.",
    leetcodeLink: "https://leetcode.com/problems/set-matrix-zeroes/",
    useCases: ["Graphics clearing", "Data masking"],
    approaches: [
       {
          name: "Optimal (In-place Hashing)",
          description: "### 🧠 The Core Concept\nUse the first row and first column of the matrix itself to store 'markers' for which rows/cols need to be zeroed.",
          timeComplexity: "O(M * N)",
          timeComplexityExplanation: "Need to visit every cell twice (once to mark, once to fill).",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Uses matrix internally for storage.",
          implementations: [
             { language: "JavaScript", code: "function setZeroes(matrix) {\n    let col0 = 1, rows = matrix.length, cols = matrix[0].length;\n    for (let i = 0; i < rows; i++) {\n        if (matrix[i][0] === 0) col0 = 0;\n        for (let j = 1; j < cols; j++) {\n            if (matrix[i][j] === 0) matrix[i][0] = matrix[0][j] = 0;\n        }\n    }\n    for (let i = rows - 1; i >= 0; i--) {\n        for (let j = cols - 1; j >= 1; j--) {\n            if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;\n        }\n        if (col0 === 0) matrix[i][0] = 0;\n    }\n}" }
          ]
       }
    ]
  },
  {
    id: "rotate-matrix-by-90-degrees",
    title: "Rotate Matrix by 90 Degrees",
    topic: "Arrays - Medium",
    category: "Matrix",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Rotate an $N \times N$ matrix by 90 degrees clockwise in-place.",
    leetcodeLink: "https://leetcode.com/problems/rotate-image/",
    useCases: ["Image processing", "Game transformations"],
    approaches: [
       {
          name: "Optimal (Transpose + Reverse)",
          description: "### 🧠 The Core Concept\nRotating 90 degrees is equivalent to: \n1. **Transpose** (swap `matrix[i][j]` with `matrix[j][i]`).\n2. **Reverse** each row.",
          timeComplexity: "O(N²)",
          timeComplexityExplanation: "Visiting every cell once for transpose and once for reversal.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Strictly in-place.",
          implementations: [
             { language: "JavaScript", code: "function rotate(matrix) {\n    const n = matrix.length;\n    for (let i = 0; i < n; i++) {\n        for (let j = i; j < n; j++) {\n            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];\n        }\n        matrix[i].reverse();\n    }\n}" }
          ]
       }
    ]
  },
  {
    id: "print-the-matrix-in-spiral-manner",
    title: "Spiral Matrix",
    topic: "Arrays - Medium",
    category: "Matrix",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given an $M \times N$ matrix, return all elements in spiral order.",
    leetcodeLink: "https://leetcode.com/problems/spiral-matrix/",
    useCases: ["Scanning algorithms", "Data serialization"],
    approaches: [
       {
          name: "Optimal (Boundary Shrinking)",
          description: "### 🧠 The Core Concept\nMaintain four boundaries: `top`, `bottom`, `left`, `right`. Traverse and shrink them until they cross.",
          timeComplexity: "O(M * N)",
          timeComplexityExplanation: "Visit every cell exactly once.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Ignoring output storage.",
          implementations: [
             { language: "Python", code: "def spiralOrder(matrix):\n    res = []\n    t, b, l, r = 0, len(matrix)-1, 0, len(matrix[0])-1\n    while t <= b and l <= r:\n        for j in range(l, r+1): res.append(matrix[t][j])\n        t += 1\n        for i in range(t, b+1): res.append(matrix[i][r])\n        r -= 1\n        if t <= b:\n            for j in range(r, l-1, -1): res.append(matrix[b][j])\n            b -= 1\n        if l <= r:\n            for i in range(b, t-1, -1): res.append(matrix[i][l])\n            l += 1\n    return res" }
          ]
       }
    ]
  },
  {
    id: "pascal-s-triangle",
    title: "Pascal's Triangle",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given an integer numRows, return the first numRows of Pascal's triangle.",
    leetcodeLink: "https://leetcode.com/problems/pascals-triangle/",
    useCases: ["Combinatorics calculation", "Polynomial distribution"],
    approaches: [
       {
          name: "Optimal (Row Construction)",
          description: "### 🧠 The Core Concept\nEach number is the sum of the two numbers directly above it. Mathematically, `row[j] = prevRow[j-1] + prevRow[j]`.",
          timeComplexity: "O(N²)",
          spaceComplexity: "O(N²)",
          implementations: [
             { language: "JavaScript", code: "function generate(numRows) {\n    let res = [];\n    for (let i = 0; i < numRows; i++) {\n        let row = new Array(i + 1).fill(1);\n        for (let j = 1; j < i; j++) {\n            row[j] = res[i-1][j-1] + res[i-1][j];\n        }\n        res.push(row);\n    }\n    return res;\n}" }
          ]
       }
    ]
  },
  {
    id: "majority-element-n-3-times",
    title: "Majority Element (>N/3 times)",
    topic: "Arrays - Hard",
    category: "Boyer-Moore Voting",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find all elements that appear more than floor(N/3) times.",
    leetcodeLink: "https://leetcode.com/problems/majority-element-ii/",
    useCases: ["Data consensus", "Frequent item discovery"],
    approaches: [
       {
          name: "Optimal (Extended Boyer-Moore)",
          description: "### 🧠 The Core Concept\nThere can be at most 2 such elements. Use two candidates and two counters.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def majorityElement(nums):\n    c1 = c2 = v1 = v2 = 0\n    for n in nums:\n        if n == val1: c1 += 1\n        elif n == val2: c2 += 1\n        elif c1 == 0: val1, c1 = n, 1\n        elif c2 == 0: val2, c2 = n, 1\n        else: c1 -= 1; c2 -= 1\n    # Verification pass required...\n    return [x for x in [val1, val2] if nums.count(x) > len(nums)//3]" }
          ]
       }
    ]
  },
  {
    id: "3-sum",
    title: "3 Sum (Unique Triplets)",
    topic: "Arrays - Hard",
    category: "Two Pointers",
    frequencyLevel: "Highest",
    difficulty: "Medium",
    overview: "Find all unique triplets in the array which gives the sum of zero.",
    leetcodeLink: "https://leetcode.com/problems/3sum/",
    useCases: ["Combination finding", "Target matching"],
    approaches: [
       {
          name: "Optimal (Sort + Two Pointers)",
          description: "### 🧠 The Core Concept\nFix one number `i` and use two pointers `j` and `k` to find `nums[j] + nums[k] = -nums[i]`. Skip duplicates to ensure unique triplets.",
          timeComplexity: "O(N²)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function threeSum(nums) {\n    nums.sort((a,b)=>a-b); let res = [];\n    for (let i = 0; i < nums.length; i++) {\n        if (i > 0 && nums[i] === nums[i-1]) continue;\n        let l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            let s = nums[i] + nums[l] + nums[r];\n            if (s === 0) {\n                res.push([nums[i], nums[l], nums[r]]);\n                while (nums[l] === nums[l+1]) l++; l++;\n                while (nums[r] === nums[r-1]) r--; r--;\n            } else if (s < 0) l++; else r--;\n        }\n    }\n    return res;\n}" }
          ]
       }
    ]
  },
  {
    id: "4-sum",
    title: "4 Sum",
    topic: "Arrays - Hard",
    category: "Two Pointers",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Find all unique quadruplets which give the sum of a target.",
    leetcodeLink: "https://leetcode.com/problems/4sum/",
    useCases: ["High-dimensional pattern matching"],
    approaches: [
       {
          name: "Optimal (Sort + Nested Loops + Two Pointers)",
          description: "### 🧠 The Core Concept\nGeneralization of 3Sum. Use two fixed loops and two pointers.",
          timeComplexity: "O(N³)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def fourSum(nums, target):\n    nums.sort(); res = []\n    for i in range(len(nums)):\n        if i > 0 and nums[i] == nums[i-1]: continue\n        for j in range(i+1, len(nums)):\n            if j > i+1 and nums[j] == nums[j-1]: continue\n            l, r = j+1, len(nums)-1\n            while l < r:\n                s = nums[i]+nums[j]+nums[l]+nums[r]\n                if s == target: res.append(...); l+=1; r-=1\n                elif s < target: l+=1\n                else: r-=1\n    return res" }
          ]
       }
    ]
  },
  {
    id: "largest-subarray-with-0-sum",
    title: "Largest Subarray with 0 Sum",
    topic: "Arrays - Hard",
    category: "Hashing",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the length of the longest subarray with sum 0.",
    leetcodeLink: "",
    useCases: ["Data balancing", "Net zero delta period"],
    approaches: [
       {
          name: "Optimal (Prefix Sum Map)",
          description: "### 🧠 The Core Concept\nIf prefix sum at index `i` is same as index `j`, the sum between `i+1` and `j` is zero.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "JavaScript", code: "function maxLen(arr) {\n    let map = new Map(), sum = 0, res = 0;\n    for (let i = 0; i < arr.length; i++) {\n        sum += arr[i];\n        if (sum === 0) res = i + 1;\n        else if (map.has(sum)) res = Math.max(res, i - map.get(sum));\n        else map.set(sum, i);\n    }\n    return res;\n}" }
          ]
       }
    ]
  },
  {
    id: "count-number-of-subarrays-with-given-xor-k",
    title: "Subarrays with XOR K",
    topic: "Arrays - Hard",
    category: "Hashing",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Count the number of subarrays having XOR sum equal to K.",
    leetcodeLink: "",
    useCases: ["Cryptography", "Parity analysis"],
    approaches: [
       {
          name: "Optimal (Prefix XOR Map)",
          description: "### 🧠 The Core Concept\n`XR ^ K` logic similar to `Prefix Sum - K`.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "Python", code: "def solve(A, K):\n    xr = 0; map = {0: 1}; res = 0\n    for x in A:\n        xr ^= x\n        res += map.get(xr ^ K, 0)\n        map[xr] = map.get(xr, 0) + 1\n    return res" }
          ]
       }
    ]
  },
  {
    id: "merge-overlapping-subintervals",
    title: "Merge Intervals (Hard)",
    topic: "Arrays - Hard",
    category: "Sorting",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Optimal merging of overlapping intervals.",
    leetcodeLink: "https://leetcode.com/problems/merge-intervals/",
    useCases: ["Timeline consolidation"],
    approaches: [
       {
          name: "Optimal",
          description: "Sort then merge in-place.",
          timeComplexity: "O(N log N)",
          spaceComplexity: "O(1) (excluding output)",
          implementations: [
             { language: "JavaScript", code: "function merge(intervals) { ... }" }
          ]
       }
    ]
  },
  {
    id: "merge-two-sorted-arrays-without-extra-space",
    title: "Merge Sorted without Extra Space",
    topic: "Arrays - Hard",
    category: "Two Pointers",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Merge two sorted arrays into themselves without using outside memory.",
    leetcodeLink: "",
    useCases: ["In-place database merging", "Memory constrained sorting"],
    approaches: [
       {
          name: "Optimal (Gap Method)",
          description: "### 🧠 The Core Concept\nUse shell-sort style gap logic. `gap = ceil((n+m)/2)`, then compare elements at `gap` distance.",
          timeComplexity: "O((N+M) * log(N+M))",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def merge(arr1, arr2, n, m):\n    gap = ceil((n + m) / 2)\n    while gap > 0:\n        i = 0; j = gap\n        while j < n + m:\n            # Compare and swap logic\n            j += 1; i += 1\n        if gap == 1: break\n        gap = ceil(gap / 2)" }
          ]
       }
    ]
  },
  {
    id: "find-the-repeating-and-missing-number",
    title: "Repeating & Missing Number",
    topic: "Arrays - Hard",
    category: "Math / XOR",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the repeating and missing numbers in an array of 1 to N.",
    leetcodeLink: "",
    useCases: ["Data integrity", "Sequencing errors"],
    approaches: [
       {
          name: "Optimal (Math Equations)",
          description: "### 🧠 The Core Concept\nUse sum of first N numbers and sum of squares. `X - Y = S - Sn` and `X^2 - Y^2 = S2 - S2n`.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function findMissing(arr) {\n    let n = arr.length;\n    let Sn = (n * (n+1))/2, S2n = (n * (n+1) * (2*n+1))/6;\n    let S = 0, S2 = 0;\n    for (let x of arr) { S+=x; S2+=x*x; }\n    let val1 = S - Sn, val2 = S2 - S2n;\n    val2 = val2 / val1;\n    let x = (val1 + val2) / 2, y = x - val1;\n    return [x, y];\n}" }
          ]
       }
    ]
  },
  {
    id: "count-inversions",
    title: "Count Inversions",
    topic: "Arrays - Hard",
    category: "Divide & Conquer",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Count how many pairs (i, j) exist such that i < j and arr[i] > arr[j].",
    leetcodeLink: "",
    useCases: ["Collaborative filtering", "Ranking similarity"],
    approaches: [
       {
          name: "Optimal (Merge Sort Variant)",
          description: "### 🧠 The Core Concept\nDuring the merge step of Merge Sort, if `left[i] > right[j]`, then all elements from `i` to the end of `left` form an inversion with `right[j]`.",
          timeComplexity: "O(N log N)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "Python", code: "def countInversions(arr):\n    def merge(arr, temp, l, m, r):\n        cnt = 0; i = l; j = m + 1; k = l\n        while i <= m and j <= r:\n            if arr[i] <= arr[j]: temp[k] = arr[i]; i += 1\n            else: temp[k] = arr[j]; j += 1; cnt += (m - i + 1)\n            k += 1\n        # ... copy remainder\n        return cnt\n    return mergeSort(arr, [0]*len(arr), 0, len(arr)-1)" }
          ]
       }
    ]
  },
  {
    id: "maximum-product-subarray",
    title: "Max Product Subarray",
    topic: "Arrays - Hard",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the contiguous subarray with the largest product.",
    leetcodeLink: "https://leetcode.com/problems/maximum-product-subarray/",
    useCases: ["Growth factor analysis", "Compounding gains"],
    approaches: [
       {
          name: "Optimal (Prefix/Suffix Scan)",
          description: "### 🧠 The Core Concept\nThe max product must be either a prefix product or a suffix product (considering zeroes reset the product).",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function maxProduct(nums) {\n    let res = -Infinity, pre = 1, suff = 1;\n    for (let i = 0; i < nums.length; i++) {\n        if (pre === 0) pre = 1; if (suff === 0) suff = 1;\n        pre *= nums[i]; suff *= nums[nums.length-1-i];\n        res = Math.max(res, pre, suff);\n    }\n    return res;\n}" }
          ]
       }
    ]
  }
];
