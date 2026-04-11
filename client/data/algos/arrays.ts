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
        name: "Optimal (Two Pointers / Sorting approach)",
        description: "### 🧠 The Core Concept: The 'Tug of War' Strategy\nImagine you have a sorted array and a target sum. Finding two numbers that add up to the target is like adjusting a **Tug of War** rope to find the perfect tension.\n\n- We place one pointer at the **start** (smallest possible number).\n- We place another at the **end** (largest possible number).\n\nIf their sum is too big, we need to decrease it—so we move the right pointer inward. If the sum is too small, we move the left pointer rightward to increase it. We keep doing this until the fingers meet or we find the target!\n\n### 🛠️ Execution Strategy\n1. **Sort** the array (if not already sorted).\n2. **Initialize** `left` at 0 and `right` at the last index.\n3. **Loop** while `left < right`:\n   - Let `currentSum = arr[left] + arr[right]`.\n   - If `currentSum == target`: Ding ding! We found it.\n   - If `currentSum < target`: We need more 'weight', so move `left` to the right (`left++`).\n   - If `currentSum > target`: We have too much, so move `right` to the left (`right--`).\n\n### 💡 CodeVerse Tip\nIn the visualizer, watch how the two highlight rings 'pinch' toward each other until they land on the solution!",
        timeComplexity: "O(N log N)",
        timeComplexityExplanation: "The sorting step takes O(N log N). Once sorted, the two-pointer scan only takes O(N) because each element is visited at most once. Overall, the sort dominates the time.",
        spaceComplexity: "O(log N) to O(N)",
        spaceComplexityExplanation: "Depending on the sorting algorithm used by the language (like Timsort or Quicksort), some auxiliary space is required for the recursion stack during the sort.",
        implementations: [
          {
            language: "Python",
            code: `def twoSum(nums, target):
    # Sort first to enable two pointers
    # Note: If indices are needed, store (val, index) pairs before sorting
    nums.sort()
    left, right = 0, len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []`
          },
          {
            language: "JavaScript",
            code: `function twoSum(nums, target) {
    nums.sort((a, b) => a - b);
    let left = 0, right = nums.length - 1;
    
    while (left < right) {
        let sum = nums[left] + nums[right];
        if (sum === target) return [left, right];
        if (sum < target) left++;
        else right--;
    }
    return [];
}`
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
          description: "### 🧠 The Core Concept: The 'Fresh Start' Analogy\nImagine you are picking up gold coins sequentially along a track. Some stops have coins (positive numbers), but some stops have 'debt' collectors who take coins away (negative numbers).\n\nIf at any point your **current total debt** outweighs all the gold you've collected so far (your `currentSum` drops below zero), would you keep carrying that debt forward? **Absolutely not!** \n\nYou dump your empty pockets, reset your count to zero, and start fresh from the very next stop. However, you always remember the *most gold you ever held* in your hands at any single point in time (`maxSum`).\n\n### 🛠️ Step-by-Step Logic\n1. **Start** with `maxSum` as the smallest possible number and `currentSum` as 0.\n2. **Iterate** through every number in the array.\n3. **Add** the current number to your `currentSum`.\n4. **Check Records**: If `currentSum > maxSum`, update your record.\n5. **The Reset**: If `currentSum < 0`, reset it back to 0 immediately.\n6. **Return** the `maxSum` after finishing the track.\n\n### 🚀 Why this Works\nSince we want the *maximum* sum, carrying a negative sub-total only hurts our future potential. Greedily starting over whenever we hit a deficit guarantees we find the strongest positive peak.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We make exactly one single pass through the array. There is no nested looping or backtracking. Whether the array has 10 elements or 10 million, we only visit each one once.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only use two simple variables (`maxSum` and `currentSum`) to keep track of our state. No matter how large the input array grows, our memory usage stays constant.",
          implementations: [
             {
                language: "Python",
                code: `def maxSubArray(nums):
    # Initialize max_sum to negative infinity
    max_sum = float('-inf')
    current_sum = 0
    
    for num in nums:
        current_sum += num
        
        # Is this the best we've ever done?
        if current_sum > max_sum:
            max_sum = current_sum
        
        # If we hit a total deficit, dump it and start over
        if current_sum < 0:
            current_sum = 0
            
    return max_sum`
             },
             {
                language: "JavaScript",
                code: `function maxSubArray(nums) {
    let maxSum = -Infinity;
    let currentSum = 0;
    
    for (let num of nums) {
        currentSum += num;
        if (currentSum > maxSum) maxSum = currentSum;
        if (currentSum < 0) currentSum = 0;
    }
    return maxSum;
}`
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
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Given an array of 0s, 1s, and 2s, sort them in-place so that objects of the same color are adjacent.",
    leetcodeLink: "https://leetcode.com/problems/sort-colors/",
    useCases: ["Inventory partitioning", "Quick-sort partitioning variants", "Grouping categories in-place"],
    approaches: [
       {
          name: "Optimal (Dutch National Flag Algorithm)",
          description: "### 🧠 The Core Concept: The 'Sorting Sorter' Analogy\nImagine you have a long conveyor belt with red (0), white (1), and blue (2) objects in a random mess. You want to group them without picking them up and moving them to a new table.\n\nWe use **3 Workers** (Pointers):\n- **Low Worker**: Stands at the start, making sure all 0s stay behind them.\n- **High Worker**: Stands at the end, making sure all 2s stay ahead of them.\n- **Mid Worker**: The explorer who walks the line and talks to each object.\n\n### 🛠️ The Strategy\n1. If Mid sees a **0**: They send it back to Low. ('Go to the start!'). Both Mid and Low step forward.\n2. If Mid sees a **1**: They leave it alone. ('You're already in the middle!'). Only Mid steps forward.\n3. If Mid sees a **2**: They send it to High. ('Go to the back!'). High steps backward, but Mid stays put to examine the object that High just threw back at them!\n\n### 🔥 Why it's Special\nThis algorithm sorts everything in **one single pass** without any extra arrays. It's the absolute peak of in-place sorting efficiency for small sets of values.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "The `mid` pointer travels from 0 to `high` exactly once. Every element is visited at most twice (once to see it, maybe once more if swapped from the end).",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We swap elements directly within the original array using only three tiny pointers (integers). No extra memory is allocated.",
          implementations: [
             {
                language: "Python",
                code: `def sortColors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            # Send 0 to the 'low' boundary
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            # 1 is already where it belongs
            mid += 1
        else:
            # Send 2 to the 'high' boundary
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`
             },
             {
                language: "JavaScript",
                code: `function sortColors(nums) {
    let low = 0, mid = 0, high = nums.length - 1;
    
    while (mid <= high) {
        if (nums[mid] === 0) {
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++; mid++;
        } else if (nums[mid] === 1) {
            mid++;
        } else {
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
        }
    }
}`
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
                code: "def subarraySum(nums, k):\n    # Result counter for number of valid subarrays\n    res = 0\n    # Current running prefix sum\n    curr = 0\n    # Hash map to store frequency of each prefix sum\n    # Initialize with {0: 1} because empty prefix has sum 0\n    prefix_map = {0: 1}\n    for n in nums:\n        # Add current number to running sum\n        curr += n\n        # Calculate what prefix sum we need to find\n        diff = curr - k\n        # Add count of needed prefix sums to result\n        res += prefix_map.get(diff, 0)\n        # Record current prefix sum in map\n        prefix_map[curr] = prefix_map.get(curr, 0) + 1\n    return res"
             },
             {
                language: "JavaScript",
                code: "function subarraySum(nums, k) {\n    // Result counter for number of valid subarrays\n    let res = 0, curr = 0;\n    // Hash map to store frequency of each prefix sum\n    // Initialize with [[0, 1]] because empty prefix has sum 0\n    const map = new Map([[0, 1]]);\n    for (let n of nums) {\n        // Add current number to running sum\n        curr += n;\n        // Check if we've seen prefix sum (curr - k)\n        if (map.has(curr - k)) res += map.get(curr - k);\n        // Record current prefix sum in map\n        map.set(curr, (map.get(curr) || 0) + 1);\n    }\n    return res;\n}"
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
          description: "### 🧠 The Core Concept: The 'Congregated Timeline' Analogy\nImagine you have several people booked for time slots in a meeting room. Some meetings overlap (e.g., 1 PM - 3 PM and 2 PM - 4 PM). To find the total time the room is occupied, you want to **merge** these into a single block (1 PM - 4 PM).\n\nThe trick? **Sort the meetings by their start time.** Once they are in chronological order, you only ever need to compare the current meeting with the *very last one* you processed. If the current one starts before the last one ended, they are part of the same contiguous block!\n\n### 🛠️ Step-by-Step Strategy\n1. **Sort** the intervals based on the start values.\n2. **Initialize** an empty `merged` list.\n3. **Iterate** through each interval:\n   - If `merged` is empty OR the current interval starts **after** the last one in `merged` ends: Just add it! It's a brand new meeting.\n   - If the current interval starts **before or at the same time** the last one ends: Merge them! Update the end time of the last meeting to be the maximum of both.",
          timeComplexity: "O(N log N)",
          timeComplexityExplanation: "Sorting takes O(N log N). The subsequent scan takes O(N) because we only look at each interval once. The sorting step is the bottleneck.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "We need space to store the merged intervals, and depending on the language, O(N) or O(log N) space for the sorting algorithm itself.",
          implementations: [
             {
                language: "Python",
                code: `def merge(intervals):
    # 1. Chronological sorting
    intervals.sort(key=lambda x: x[0])
    
    merged = []
    for interval in intervals:
        # If no overlap, add new interval
        if not merged or interval[0] > merged[-1][1]:
            merged.append(interval)
        else:
            # Overlap! 'Stretch' the existing interval to cover both
            merged[-1][1] = max(merged[-1][1], interval[1])
            
    return merged`
             },
             {
                language: "JavaScript",
                code: `function merge(intervals) {
    if (intervals.length <= 1) return intervals;
    
    // 1. Sort by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    const result = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const lastMerged = result[result.length - 1];
        const current = intervals[i];
        
        if (current[0] <= lastMerged[1]) {
            // Overlap: Merge
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            // No overlap: New entry
            result.push(current);
        }
    }
    return result;
}`
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
    frequencyLevel: "Variable",
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
             { language: "JavaScript", code: "function maxProfit(prices) {\n    // Track the minimum price seen so far\n    let minPrice = Infinity, maxProf = 0;\n    \n    for (let price of prices) {\n        // Update minimum price if current price is lower\n        minPrice = Math.min(minPrice, price);\n        // Calculate profit if selling at current price\n        // Update max profit if this is better than previous best\n        maxProf = Math.max(maxProf, price - minPrice);\n    }\n    return maxProf;\n}" }
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
             { language: "Python", code: "def rearrangeArray(nums):\n    # Create result array of same size\n    ans = [0] * len(nums)\n    # Pointers for next positive (even indices) and negative (odd indices) slots\n    pos, neg = 0, 1\n    \n    for x in nums:\n        if x > 0:\n            # Place positive number at next even index\n            ans[pos] = x\n            pos += 2\n        else:\n            # Place negative number at next odd index\n            ans[neg] = x\n            neg += 2\n    return ans" }
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
             { language: "JavaScript", code: "function findLeaders(arr) {\n    // Track maximum seen from right side\n    let max = -Infinity, leaders = [];\n    \n    // Scan from right to left\n    for (let i = arr.length - 1; i >= 0; i--) {\n        // If current element is greater than max seen so far\n        if (arr[i] > max) {\n            // Update max and add to leaders\n            max = arr[i];\n            leaders.push(arr[i]);\n        }\n    }\n    // Reverse to get leaders in original order\n    return leaders.reverse();\n}" }
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
             { language: "Python", code: "def longestConsecutive(nums):\n    # Convert array to set for O(1) lookups\n    s = set(nums)\n    longest = 0\n    \n    for x in s:\n        # Check if this is the start of a sequence\n        # (i.e., x-1 is not in the set)\n        if (x - 1) not in s:\n            curr = x\n            count = 1\n            # Count how long the consecutive sequence goes\n            while (curr + 1) in s:\n                curr += 1\n                count += 1\n            # Update longest if current sequence is longer\n            longest = max(longest, count)\n    \n    return longest" }
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
             { language: "JavaScript", code: "function setZeroes(matrix) {\n    // Track if first column needs to be zeroed\n    let col0 = 1, rows = matrix.length, cols = matrix[0].length;\n    \n    // First pass: mark zeros in first row and column\n    for (let i = 0; i < rows; i++) {\n        // If first cell in row is zero, mark column 0\n        if (matrix[i][0] === 0) col0 = 0;\n        \n        for (let j = 1; j < cols; j++) {\n            // If cell is zero, mark its row and column\n            if (matrix[i][j] === 0) matrix[i][0] = matrix[0][j] = 0;\n        }\n    }\n    \n    // Second pass: zero out cells based on marks\n    for (let i = rows - 1; i >= 0; i--) {\n        for (let j = cols - 1; j >= 1; j--) {\n            // If row or column is marked, zero the cell\n            if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;\n        }\n        // Zero first column if needed\n        if (col0 === 0) matrix[i][0] = 0;\n    }\n}" }
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
          description: "### 🧠 The Core Concept: The 'Mirror & Flip' Analogy\nRotating a square matrix by 90 degrees clockwise can be achieved by two simple linear transformations:\n\n1. **Mirroring (Transpose)**: Flip the matrix along its main diagonal (top-left to bottom-right). Now every row has become a column, but in the wrong order!\n2. **Flipping (Reverse)**: Reverse every single row horizontally. \n\n### 🛠️ Step-by-Step Logistics\n- **Transpose**: Swap `matrix[i][j]` with `matrix[j][i]` for every pair where $i < j$. This turns the first row into the first column, second row into the second column, etc.\n- **Reverse**: For each row, swap the first element with the last, second with second-to-last, etc.\n\n### 🔥 Why this is brilliant\nNormally, rotating would require a temporary extra matrix ($O(N^2)$ space). By using these two geometric properties, we perform the entire rotation **in-place** with no extra memory!",
          timeComplexity: "O(N²)",
          timeComplexityExplanation: "We visit each element twice: once during the transpose swap and once during the row reversal ($N^2$ elements).",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The rotation is performed strictly in-place, swapping elements directly within the existing structure.",
          implementations: [
             {
                language: "JavaScript",
                code: `function rotate(matrix) {
    const n = matrix.length;
    
    // 1. Transpose: Swap matrix[i][j] with matrix[j][i]
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
    
    // 2. Reverse each row
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
}`
             }
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
             { language: "Python", code: "def spiralOrder(matrix):\n    res = []\n    # Initialize boundaries\n    t, b, l, r = 0, len(matrix)-1, 0, len(matrix[0])-1\n    \n    while t <= b and l <= r:\n        # Traverse from left to right along top boundary\n        for j in range(l, r+1): res.append(matrix[t][j])\n        t += 1\n        \n        # Traverse from top to bottom along right boundary\n        for i in range(t, b+1): res.append(matrix[i][r])\n        r -= 1\n        \n        # Traverse from right to left along bottom boundary\n        if t <= b:\n            for j in range(r, l-1, -1): res.append(matrix[b][j])\n            b -= 1\n        \n        # Traverse from bottom to top along left boundary\n        if l <= r:\n            for i in range(b, t-1, -1): res.append(matrix[i][l])\n            l += 1\n    \n    return res" }
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
          name: "Optimal (Dynamic Construction)",
          description: "### 🧠 The Core Concept: The 'Build-Up' Strategy\nPascal's Triangle is a geometric arrangement where each number is the 'offspring' of the two numbers directly above it.\n\n1. Every row starts and ends with a **1**.\n2. Every 'inner' number at position `j` is found by adding the numbers at `j-1` and `j` from the previous row.\n\n### 🛠️ Execution Strategy\n- **Base Case**: The first row is always `[1]`.\n- **Iterative Growth**: For each new row $i$, create a list of size $i+1$.\n- **Filling logic**: \n  - `row[0] = 1`\n  - `row[i] = 1`\n  - `row[j] = prev_row[j-1] + prev_row[j]` for $0 < j < i$.",
          timeComplexity: "O(N²)",
          timeComplexityExplanation: "To generate N rows, we calculate $1 + 2 + 3 + ... + N$ elements, which is a quadratic summation.",
          spaceComplexity: "O(N²)",
          spaceComplexityExplanation: "We must store all numbers generated to return the full triangle.",
          implementations: [
             {
                language: "JavaScript",
                code: `function generate(numRows) {
    let triangle = [];
    if (numRows === 0) return triangle;
    
    for (let i = 0; i < numRows; i++) {
        let row = new Array(i + 1).fill(1);
        
        // Fill the 'middle' elements
        for (let j = 1; j < i; j++) {
            row[j] = triangle[i-1][j-1] + triangle[i-1][j];
        }
        
        triangle.push(row);
    }
    return triangle;
}`
             }
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
          name: "Optimal (Boyer-Moore Voting Variant)",
          description: "### 🧠 The Core Concept: The 'Two Queens' Analogy\nIn a standard Majority Element problem ($>N/2$), one candidate can 'fight' everyone else and survive. In this variant ($>N/3$), there can be at most **two** such winners.\n\nImagine a battle with multiple factions. If we find three different factions, they can all 'cancel each other out'. If any faction remains with a positive count at the end, they *might* be our winner.\n\n### 🛠️ The Strategy\n1. **Nomination**: Keep two candidates and two counters. \n   - If current element matches a candidate, increment its counter.\n   - If a counter is zero, take the current element as a new candidate.\n   - If it matches neither and both counters > 0, decrement **both** counters (three-way cancellation).\n2. **Verification**: Unlike the $>N/2$ version, the survivors of Boyer-Moore are not guaranteed winners. We must make a second pass through the array to manually count their actual frequencies and ensure they truly exceed $N/3$.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Two sequential linear passes: one for the voting and one for verification.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Constant space used for two candidates and two counters, regardless of array size.",
          implementations: [
             {
                language: "Python",
                code: `def majorityElement(nums):
    if not nums: return []
    
    # 1. Voting Phase
    cand1, cand2, count1, count2 = None, None, 0, 0
    for n in nums:
        if n == cand1:
            count1 += 1
        elif n == cand2:
            count2 += 1
        elif count1 == 0:
            cand1, count1 = n, 1
        elif count2 == 0:
            cand2, count2 = n, 1
        else:
            count1 -= 1
            count2 -= 1
            
    # 2. Verification Phase
    result = []
    for c in [cand1, cand2]:
        if nums.count(c) > len(nums) // 3:
            result.append(c)
    return result`
             }
          ]
       }
    ]

  },
  {
    id: "3-sum",
    title: "3 Sum (Unique Triplets)",
    topic: "Arrays - Hard",
    category: "Two Pointers",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Find all unique triplets in the array which gives the sum of zero.",
    leetcodeLink: "https://leetcode.com/problems/3sum/",
    useCases: ["Combination finding", "Target matching"],
    approaches: [
       {
          name: "Optimal (Sorting + Two Pointers)",
          description: "### 🧠 The Core Concept: Reduce to Two Sum\n3Sum is essentially 'Two Sum' with one element fixed. By sorting the array, we can use the efficient **Two-Pointer** technique for each fixed element.\n\n### 🛠️ Execution Strategy\n1. **Sort**: Sorting lets us handle duplicates easily and use pointers.\n2. **Fix & Solve**: \n   - Loop through the array, fixing one number `nums[i]`.\n   - For every fixed `i`, solve the remaining `Two Sum` problem for `target = -nums[i]` using two pointers (`left = i+1`, `right = length-1`).\n3. **De-duplication**: \n   - Skip `i` if it's the same as `i-1`.\n   - Skip `left` or `right` if they match their previous values after finding a triplet.\n\n### ✨ Why it works\nSorting brings identical numbers together, allowing us to 'jump' over them to avoid duplicate triplets in our final answer list.",
          timeComplexity: "O(N²)",
          timeComplexityExplanation: "Sorting takes O(N log N). The nested loop ($N$ for fixed element $\times N$ for two-pointer scan) takes $O(N^2)$. Thus, the overall performance is quadratic.",
          spaceComplexity: "O(log N) to O(N)",
          spaceComplexityExplanation: "Depends on the sorting implementation's recursion depth.",
          implementations: [
             {
                language: "JavaScript",
                code: `function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicate first elements
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                // Skip duplicate second and third elements
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}`
             }
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
          name: "Optimal (Sorting + Nested Loops + Two Pointers)",
          description: "### 🧠 The Core Concept: Recursive Thinking\n4Sum is essentially a layer deeper than 3Sum. We fix **two** numbers ($i$ and $j$) and then use the Two-Pointer technique to find the remaining two numbers that complete the target sum.\n\n### 🛠️ Step-by-Step Logic\n1. **Sort** the array to handle duplicates and enable pointers.\n2. **First Loop ($i$)**: Fix the first number. Skip if `nums[i] == nums[i-1]`.\n3. **Second Loop ($j$)**: Fix the second number starting from $i+1$. Skip if `nums[j] == nums[j-1]`.\n4. **Two Pointers ($left, right$)**: Use pointers on the remaining range $[j+1, \text{end}]$ to find `nums[left] + nums[right] = target - nums[i] - nums[j]`.\n\n### 💡 Efficiency Note\nWhile $O(N^3)$ might seem slow, it is the optimal approach for this problem without using massive extra space. Sorting allows us to skip large amounts of duplicate work.",
          timeComplexity: "O(N³)",
          timeComplexityExplanation: "Two nested loops ($N \times N$) combined with a linear two-pointer scan ($N$) result in a cubic time complexity.",
          spaceComplexity: "O(1) to O(N)",
          spaceComplexityExplanation: "The algorithm itself is in-place, but sorting might require auxiliary space depending on implementation.",
          implementations: [
             {
                language: "Python",
                code: `def fourSum(nums, target):
    nums.sort()
    res = []
    n = len(nums)
    
    for i in range(n):
        if i > 0 and nums[i] == nums[i-1]: continue
        for j in range(i + 1, n):
            if j > i + 1 and nums[j] == nums[j-1]: continue
            
            l, r = j + 1, n - 1
            while l < r:
                s = nums[i] + nums[j] + nums[l] + nums[r]
                if s == target:
                    res.append([nums[i], nums[j], nums[l], nums[r]])
                    while l < r and nums[l] == nums[l+1]: l += 1
                    while l < r and nums[r] == nums[r-1]: r -= 1
                    l += 1
                    r -= 1
                elif s < target:
                    l += 1
                else:
                    r -= 1
    return res`
             }
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
          description: "### 🧠 The Core Concept: The 'Returning Sum' Analogy\nImagine you are walking along a path, and every step you take, you add up the values of the ground you've covered. \n\nIf at **Mile 5** your total sum is **100**, and at **Mile 12** your total sum is **still 100**, what does that mean? It means the path you walked between Mile 5 and Mile 12 added up exactly to **ZERO**.\n\n### 🛠️ Execution Strategy\n1. **Track** the `currentPrefixSum` as you iterate.\n2. **Store** each new prefix sum in a Hash Map with its **first-seen index**.\n3. **Collision Check**: If you encounter a `currentPrefixSum` that is already in the map, you've found a zero-sum subarray!\n4. **Calculate Length**: The length is `currentIndex - firstSeenIndex`.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We perform a single linear scan of the array. Each Map operation (check and set) is $O(1)$ on average.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Worst case, every prefix sum is unique, requiring us to store $N$ entries in the Map.",
          implementations: [
             {
                language: "JavaScript",
                code: `function maxLen(arr) {
    let map = new Map();
    let sum = 0;
    let max_len = 0;
    
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        
        if (sum === 0) {
            max_len = i + 1;
        } else if (map.has(sum)) {
            // Found a subarray that sums to 0!
            max_len = Math.max(max_len, i - map.get(sum));
        } else {
            // Only store the first occurrence to maximize length
            map.set(sum, i);
        }
    }
    return max_len;
}`
             }
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
          name: "Optimal (Prefix XOR Hash Map)",
          description: "### 🧠 The Core Concept: The XOR Mirror Property\nXOR is a bitwise operation with a unique property: if $A \\oplus B = K$, then $A \\oplus K = B$.\n\nSimilar to the 'Subarray Sum Equals K' problem, we keep a running **Prefix XOR** ($XR$). At any index, if we want a subarray with XOR $K$, we look for a previous prefix XOR ($B$) such that $XR \\oplus B = K$. Using our property, this means we are searching for a previous prefix XOR equal to $XR \\oplus K$.\n\n### 🛠️ Execution Strategy\n1. **Initialize** a Hash Map with `{0: 1}` (we start with a XOR sum of 0).\n2. **Iterate** through the array, maintaining a running `currentXOR`.\n3. **Target Search**: Calculate `target = currentXOR ^ K`.\n4. **Update Count**: If `target` exists in our map, add its frequency to our result.\n5. **Record**: Increment the frequency of `currentXOR` in the map.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "One linear pass with $O(1)$ Hash Map operations on average.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Storing prefix XOR frequencies for up to N elements.",
          implementations: [
             {
                language: "Python",
                code: `def solve(A, K):
    xr = 0
    # Map stores {prefix_xor: frequency}
    freq_map = {0: 1}
    count = 0
    
    for val in A:
        xr ^= val
        # If xr ^ target = K, then target = xr ^ K
        target = xr ^ K
        count += freq_map.get(target, 0)
        
        # Update map with current xr
        freq_map[xr] = freq_map.get(xr, 0) + 1
        
    return count`
             }
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
          name: "Optimal (Gap Method / Shell Sort Intuition)",
          description: "### 🧠 The Core Concept: The 'Sliding Ruler' Analogy\nMerging two sorted arrays without extra space is tricky because you'll overwrite elements you still need. The **Gap Method** uses a virtual 'ruler' (the gap) to compare and swap elements that are far apart.\n\nInitially, the gap is large (half the total size). We compare every pair of elements separated by this gap across the combined length of both arrays. We then shrink the gap ($Gap = \\lceil Gap/2 \\rceil$) and repeat until $Gap = 1$.\n\n### 🛠️ Step-by-Step Logistics\n1. **Initialize** `gap` as the ceiling of $(n + m) / 2$.\n2. **Slide**: Start two pointers, `left` and `right`, where `right = left + gap`.\n3. **Compare & Swap**: If `arr[left] > arr[right]`, swap them. Move both pointers forward.\n4. **Handle Boundaries**: Pointers can both be in array1, both in array2, or split across both.\n5. **Shrink**: Once the pointers hit the end, reduce the gap and start over from the beginning.\n\n### 🔥 Why it's remarkable\nIt allows us to achieve a sorted state across two separate memory buffers without ever allocating a single extra array! It's an in-place $O((N+M) \\log (N+M))$ feat.",
          timeComplexity: "O((N+M) * log(N+M))",
          timeComplexityExplanation: "The outer loop runs $\\log (N+M)$ times (gap reduction). The inner loop performs a linear scan of $N+M$ elements.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Strictly in-place. Only a few integer variables are used for pointers and gap tracking.",
          implementations: [
             {
                language: "Python",
                code: `import math

def merge(arr1, arr2, n, m):
    gap = math.ceil((n + m) / 2)
    while gap > 0:
        i = 0
        j = gap
        while j < n + m:
            # Case 1: i and j both in arr1
            if j < n:
                if arr1[i] > arr1[j]:
                    arr1[i], arr1[j] = arr1[j], arr1[i]
            # Case 2: i in arr1, j in arr2
            elif i < n:
                if arr1[i] > arr2[j - n]:
                    arr1[i], arr2[j - n] = arr2[j - n], arr1[i]
            # Case 3: i and j both in arr2
            else:
                if arr2[i - n] > arr2[j - n]:
                    arr2[i - n], arr2[j - n] = arr2[j - n], arr2[i - n]
            i += 1
            j += 1
            
        if gap == 1: break
        gap = math.ceil(gap / 2)`
             }
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
          name: "Optimal (Mathematical Equations)",
          description: "### 🧠 The Core Concept: The 'Alphanumeric Balance'\nGiven an array from $1$ to $N$, let the missing number be $Y$ and the repeating number be $X$. We can use sum and sum of squares to solve for them like a detective puzzle:\n\n1. **Equation 1**: $(\\text{Actual Sum} - \\text{Expected Sum}) = X - Y$\n2. **Equation 2**: $(\\text{Actual Sum Squares} - \\text{Expected Sum Squares}) = X^2 - Y^2$\n\nSince $X^2 - Y^2 = (X - Y)(X + Y)$, we can divide Equation 2 by Equation 1 to find $(X + Y)$. Now we have a simple system of equations to find both $X$ and $Y$ immediately!\n\n### 🛠️ Execution Strategy\n1. Calculate the 'Expected' sums for $1 \\to N$ using formulas: $Sum = N(N+1)/2$ and $Squares = N(N+1)(2N+1)/6$.\n2. Iterate through the array to find the 'Actual' sums.\n3. Subtract Expected from Actual to find `val1` ($X-Y$) and `val2` ($X^2-Y^2$).\n4. Solve: $X+Y = val2 / val1$.\n5. Solve for $X$: $( (X-Y) + (X+Y) ) / 2$.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "One single pass to calculate the actual sums. All other operations are constant time math.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "No arrays or maps; only a few variables to store numeric sums.",
          implementations: [
             {
                language: "JavaScript",
                code: `function findNumbers(nums) {
    const n = nums.length;
    let sn = (n * (n + 1)) / 2;
    let s2n = (n * (n + 1) * (2 * n + 1)) / 6;
    
    let s = 0, s2 = 0;
    for (let x of nums) {
        s += x;
        s2 += x * x;
    }
    
    let val1 = s - sn; // X - Y
    let val2 = s2 - s2n; // X^2 - Y^2
    
    val2 = val2 / val1; // (X^2 - Y^2)/(X - Y) = X + Y
    
    let x = (val1 + val2) / 2;
    let y = x - val1;
    
    return [Math.round(x), Math.round(y)];
}`
             }
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
          description: "### 🧠 The Core Concept: The 'Inversion Window'\nAn inversion exists if a larger number comes before a smaller one. We can count these efficiently during the **Merge step** of Merge Sort.\n\nWhen we merge two sorted halves (Left and Right):\n- If `Left[i] <= Right[j]`, everything is normal.\n- If `Left[i] > Right[j]`, then `Right[j]` is smaller than EVERY element remaining in the sorted `Left` half! \n- Since `Left` is sorted, all elements from index `i` to the end of `Left` form an inversion with `Right[j]`.\n\n### 🛠️ Execution Strategy\n1. Modify standard Merge Sort to return a count.\n2. In the `merge` function, whenever an element is picked from the **Right** half before the **Left** half is finished, add the number of remaining elements in `Left` to your total count.\n\n### 🔥 Why it's brilliant\nIt solves a counting problem by 'piggybacking' on a sorting algorithm, giving us $O(N \\log N)$ instead of the $O(N^2)$ brute force.",
          timeComplexity: "O(N log N)",
          timeComplexityExplanation: "Exactly the same as Merge Sort. We divide the array until single elements and merge them back.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "We need a temporary array for the merging process, just like standard Merge Sort.",
          implementations: [
             {
                language: "Python",
                code: `def countInversions(arr):
    def merge(arr, temp, l, m, r):
        inv_count = 0
        i, j, k = l, m + 1, l
        
        while i <= m and j <= r:
            if arr[i] <= arr[j]:
                temp[k] = arr[i]
                i += 1
            else:
                # Inversion found! 
                temp[k] = arr[j]
                inv_count += (m - i + 1)
                j += 1
            k += 1
            
        while i <= m:
            temp[k] = arr[i]; i += 1; k += 1
        while j <= r:
            temp[k] = arr[j]; j += 1; k += 1
            
        return inv_count`
             }
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
          name: "Optimal (Prefix & Suffix Scan)",
          description: "### 🧠 The Core Concept: The 'Resetting Product' Intuition\nUnlike sums, products can swing wildly due to zeros and negative numbers. \n\n1. **Zeros**: A zero resets any product to 0. It effectively splits the array into independent sub-problems.\n2. **Negatives**: Two negatives make a positive! \n\nThe maximum product subarray must be either a **Prefix Product** or a **Suffix Product**. By scanning from both ends and resetting when we hit a zero, we are guaranteed to catch the best possible contiguous product segment.\n\n### 🛠️ Step-by-Step Logistics\n1. **Scan Left to Right**: Carry a `prefixProduct`. If it hits 0, reset it to 1 and keep going.\n2. **Scan Right to Left**: Carry a `suffixProduct`. If it hits 0, reset it to 1.\n3. **Result**: The answer is the maximum value encountered by either `prefix` or `suffix` during the entire process.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We perform one single loop that handles both prefix and suffix scans simultaneously.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only store a few variables (prefix, suffix, and result) regardless of input size.",
          implementations: [
             {
                language: "JavaScript",
                code: `function maxProduct(nums) {
    let res = nums[0];
    let pre = 1, suff = 1;
    let n = nums.length;
    
    for (let i = 0; i < n; i++) {
        // Reset if we hit a zero
        if (pre === 0) pre = 1;
        if (suff === 0) suff = 1;
        
        pre *= nums[i];
        suff *= nums[n - 1 - i];
        
        res = Math.max(res, pre, suff);
    }
    return res;
}`
             }
          ]
       }
    ]

  }
];
