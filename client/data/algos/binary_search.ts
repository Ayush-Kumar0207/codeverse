import { AlgorithmEntry } from "./types";

export const binarySearchAlgorithms: AlgorithmEntry[] = [
  {
    id: "binary-search",
    title: "Binary Search",
    topic: "Binary Search - 1D Arrays",
    category: "Divide & Conquer",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "When looking for a word in a dictionary, you don't read page by page. You open the middle, check if your word is earlier or later, and tear away the half that is useless.",
    leetcodeLink: "https://leetcode.com/problems/binary-search/",
    useCases: ["Database engine lookups", "Finding zero-crossings", "Git bisect logic"],
    approaches: [
      {
        name: "Optimal (Divide & Conquer)",
        description: "### 🧠 The Core Problem\nIf I asked you to find the word **\"Zebra\"** in a dictionary, would you start at Page 1, Word 1 (\"Aardvark\") and read thousands of pages sequentially? Absolutely not. \n\nYou would split the book down the middle, see you landed on \"M\", realize that \"Z\" is after \"M\", and literally tear off and throw away the entire left half of the dictionary! You keep repeating this until you easily pinpoint \"Zebra\".\n\n### 🛠️ Execution Strategy\n1. **Set the Bounds**: Place a `left` pointer at the start (index 0) and a `right` pointer at the end of the array.\n2. **Strike the Middle**: Calculate the middle point: `mid = (left + right) / 2`.\n3. **Compare**: Check the number at that middle spot.\n   - Is it the target? You're done! Return the index.\n   - Is it **too small**? The target MUST lie to the right! Discard everything to the left by moving `left = mid + 1`.\n   - Is it **too big**? The target MUST lie to the left! Discard everything to the right by moving `right = mid - 1`.\n\nEvery single step **destroys 50% of the remaining array**. It is so catastrophically fast that if you had an array with 4,000,000,000 (4 Billion) elements, it would only take roughly **32 checks** to find your exact number. That's the power of O(log N).",
        timeComplexity: "O(log N)",
        timeComplexityExplanation: "The search space is reduced by half at every iteration. `N -> N/2 -> N/4 -> ... -> 1`. The number of times we can divide N by 2 before reaching 1 is exactly log₂(N). For an array of 10^9 elements, it requires at most 30 comparisons.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "We are only using two pointers (`left` and `right`) to track our window boundaries regardless of how large the array scales. No auxiliary arrays or recursive call stacks are utilized.",
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
    id: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    topic: "Binary Search - 1D Arrays",
    category: "Divide & Conquer",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "You are given an integer array sorted in ascending order, but it has been pivoted at an unknown index. You must search for a target element in O(log N) time.",
    leetcodeLink: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    useCases: ["Rotational Database Indexes", "Ring Buffer Binary Searching", "Fault-tolerant log scanning"],
    approaches: [
      {
        name: "Modified Binary Search",
        description: "### 🧠 The Core Problem\nNormally, binary search requires a strictly sorted array so you know exactly which half to discard. \nBut imagine the array `[0,1,2,4,5,6,7]` is rotated to `[4,5,6,7,0,1,2]`. \nIf we land on mid=`7` and our target is `0`, `0 < 7`. Normally we go left! But wait, `0` is actually on the RIGHT! \n\nWe need a way to figure out which side is \"safe\" and correctly sorted.\n\n### 🛠️ Execution Strategy\n1. **Identify the Sorted Half**: If we slice a rotated array in half, **at least one side MUST be perfectly sorted**. \n   - If `nums[left] <= nums[mid]`, the left side is perfectly sorted.\n   - Otherwise, the right side must be perfectly sorted.\n2. **Check Bounds on Sorted Half**: \n   - Let's say the left side `[left ... mid]` is sorted.\n   - Does the `target` fall mathematically within `nums[left]` and `nums[mid]`?\n     - If YES: It's guaranteed to be in the left half! `right = mid - 1`.\n     - If NO: It MUST be in the chaotic right half! `left = mid + 1`.\n3. **Mirror Logic**: Do the exact inverse if the right half was the perfectly sorted one.\n\nBy leveraging the fact that we can always identify a sorted subspace, we continuously slice the search domain by 50% without fail.",
        timeComplexity: "O(log N)",
        timeComplexityExplanation: "Despite the array being rotated, we successfully establish mathematical polarity at every single iteration to eliminate exactly half the remaining elements. Thus, the classic log₂N bound is seamlessly maintained.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "We track the bounds using isolated pointers (`left`, `right`, `mid`), strictly avoiding auxiliary state trees or recursive frame allocation.",
        implementations: [
          {
            language: "JavaScript",
            code: "var search = function(nums, target) {\n    let left = 0, right = nums.length - 1;\n    \n    while (left <= right) {\n        let mid = Math.floor((left + right) / 2);\n        if (nums[mid] === target) return mid;\n        \n        // Determine which half is fully sorted\n        if (nums[left] <= nums[mid]) {\n            // Left side is sorted\n            if (target >= nums[left] && target < nums[mid]) {\n                right = mid - 1; // Target is definitively in sorted left\n            } else {\n                left = mid + 1;  // Target must be in chaotic right\n            }\n        } else {\n            // Right side is sorted\n            if (target > nums[mid] && target <= nums[right]) {\n                left = mid + 1;  // Target is definitively in sorted right\n            } else {\n                right = mid - 1; // Target must be in chaotic left\n            }\n        }\n    }\n    return -1;\n};"
          },
          {
            language: "Python",
            code: "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        left, right = 0, len(nums) - 1\n        \n        while left <= right:\n            mid = (left + right) // 2\n            if nums[mid] == target:\n                return mid\n            \n            if nums[left] <= nums[mid]:\n                if nums[left] <= target < nums[mid]:\n                    right = mid - 1\n                else:\n                    left = mid + 1\n            else:\n                if nums[mid] < target <= nums[right]:\n                    left = mid + 1\n                else:\n                    right = mid - 1\n                    \n        return -1"
          },
          {
            language: "Java",
            code: "class Solution {\n    public int search(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        \n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            \n            if (nums[left] <= nums[mid]) {\n                if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n                else left = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n                else right = mid - 1;\n            }\n        }\n        return -1;\n    }\n}"
          },
          {
            language: "C++",
            code: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int left = 0, right = nums.size() - 1;\n        \n        while(left <= right){\n            int mid = left + (right - left) / 2;\n            if(nums[mid] == target) return mid;\n            \n            if(nums[left] <= nums[mid]){\n                if(target >= nums[left] && target < nums[mid]) right = mid - 1;\n                else left = mid + 1;\n            }\n            else{\n                if(target > nums[mid] && target <= nums[right]) left = mid + 1;\n                else right = mid - 1;\n            }\n        }\n        return -1;\n    }\n};"
          }
        ]
      }
    ]
  },
  {
    id: "koko-eating-bananas",
    title: "Koko Eating Bananas",
    topic: "Binary Search on Answers",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Koko loves to eat bananas. Given an array of banana piles and H hours, what is the minimum integer speed K to eat all the bananas?",
    leetcodeLink: "https://leetcode.com/problems/koko-eating-bananas/",
    useCases: ["Rate Limiter Capacity Discovery", "Server Load Balancing", "Delivery Truck Throughput"],
    approaches: [
      {
        name: "Binary Search on Answer Space",
        description: "### 🧠 The Core Problem\nWe don't know the exact speed `K` Koko needs, but we know the constraints:\n- **Minimum Speed**: `1` banana per hour (she can't go slower than that).\n- **Maximum Speed**: the size of the biggest pile. (If she eats the maximum pile in 1 hour, she is wasting time going any faster than that).\n\nIf we pick a random speed `mid`, we can easily calculate *how many hours* it takes to eat everything at that speed. \nIf `hoursUsed <= h`, Koko is moving fast enough! But can she move **slower** and still make it? Let's check smaller speeds. \nIf `hoursUsed > h`, she is too slow! She MUST move faster.\n\n### 🛠️ Execution Strategy\nInstead of linearly testing speeds `k=1, k=2, ...` which would take `O(Max(Pile))`, we **Binary Search the Speed Domain**.\n\n1. `left = 1` and `right = max(piles)`\n2. `mid = (left + right) / 2` (Test Speed)\n3. Calculate total hours at speed `mid`.\n    - For each pile, hours needed = `Math.ceil(pile / mid)`.\n4. If she finishes in time, record `mid` as a valid answer, but try an even slower speed: `right = mid - 1`.\n5. If she is too slow, we must increase speed: `left = mid + 1`.",
        timeComplexity: "O(N * log(MaxPile))",
        timeComplexityExplanation: "Our binary search interval spans from 1 to the maximum pile size (let's denote it M). The binary search execution will trigger `log₂(M)` steps. At each intermediate payload, we iterate through all `N` array items to calculate hours expended. Total complexity converges at `N * log(M)`.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "The structural calculation purely iterates pointer comparisons, utilizing zero array mapping mechanisms.",
        implementations: [
          {
            language: "JavaScript",
            code: "var minEatingSpeed = function(piles, h) {\n    let left = 1;\n    let right = Math.max(...piles);\n    let result = right;\n    \n    const calculateHours = (speed) => {\n        return piles.reduce((sum, pile) => sum + Math.ceil(pile / speed), 0);\n    };\n    \n    while (left <= right) {\n        let mid = Math.floor((left + right) / 2);\n        \n        if (calculateHours(mid) <= h) {\n            result = mid;\n            right = mid - 1; // Can we eat slower?\n        } else {\n            left = mid + 1; // Too slow, must eat faster\n        }\n    }\n    \n    return result;\n};"
          },
          {
            language: "Python",
            code: "import math\nclass Solution:\n    def minEatingSpeed(self, piles: List[int], h: int) -> int:\n        left, right = 1, max(piles)\n        res = right\n        \n        while left <= right:\n            mid = (left + right) // 2\n            hours = sum(math.ceil(pile / mid) for pile in piles)\n            \n            if hours <= h:\n                res = mid\n                right = mid - 1\n            else:\n                left = mid + 1\n                \n        return res"
          },
          {
            language: "Java",
            code: "class Solution {\n    public int minEatingSpeed(int[] piles, int h) {\n        int left = 1;\n        int right = 0;\n        for (int pile : piles) right = Math.max(right, pile);\n        \n        int result = right;\n        \n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            long hours = 0;\n            for (int p : piles) {\n                hours += Math.ceil((double) p / mid);\n            }\n            \n            if (hours <= h) {\n                result = mid;\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        }\n        return result;\n    }\n}"
          },
          {
            language: "C++",
            code: "class Solution {\npublic:\n    int minEatingSpeed(vector<int>& piles, int h) {\n        int left = 1;\n        int right = *max_element(piles.begin(), piles.end());\n        int result = right;\n        \n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            long long hours = 0;\n            for (int p : piles) {\n                hours += (p + mid - 1) / mid; // Fast double ceiling division\n            }\n            \n            if (hours <= h) {\n                result = mid;\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        }\n        return result;\n    }\n};"
          }
        ]
      }
    ]
  }
];
