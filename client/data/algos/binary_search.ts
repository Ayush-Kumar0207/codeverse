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
  },
  {
    id: "implement-lower-bound",
    title: "Lower Bound",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search Basics",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Find the smallest index $i$ such that $arr[i] \ge x$.",
    leetcodeLink: "",
    useCases: ["Search insert position", "Range queries"],
    approaches: [
       {
          name: "Optimal (Binary Search)",
          description: "### 🧠 The Core Concept\nSimilar to binary search, but instead of stopping when we find the target, we record the index and continue searching on the **LEFT** side to find a 'lower' index that still satisfies the condition.",
          timeComplexity: "O(log N)",
          timeComplexityExplanation: "Standard logarithmic bound.",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function lowerBound(arr, n, x) {\n    let low = 0, high = n - 1, ans = n;\n    while (low <= high) {\n        let mid = Math.floor((low + high) / 2);\n        if (arr[mid] >= x) { ans = mid; high = mid - 1; }\n        else low = mid + 1;\n    }\n    return ans;\n}" }
          ]
       }
    ]
  },
  {
    id: "implement-upper-bound",
    title: "Upper Bound",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search Basics",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Find the smallest index $i$ such that $arr[i] > x$.",
    leetcodeLink: "",
    useCases: ["Counting occurrences", "Frequency ranges"],
    approaches: [
       {
          name: "Optimal (Binary Search)",
          description: "### 🧠 The Core Concept\nRecord the index when `arr[mid] > x` and keep searching left.",
          timeComplexity: "O(log N)",
          timeComplexityExplanation: "Standard logarithmic bound.",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def upperBound(arr, x):\n    low, high, ans = 0, len(arr) - 1, len(arr)\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] > x: ans = mid; high = mid - 1\n        else: low = mid + 1\n    return ans" }
          ]
       }
    ]
  },
  {
    id: "search-insert-position",
    title: "Search Insert Position",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search Basics",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Find the index where target should be inserted in a sorted array.",
    leetcodeLink: "https://leetcode.com/problems/search-insert-position/",
    useCases: ["Maintaing sorted order", "Insertion algorithms"],
    approaches: [
       {
          name: "Optimal (Lower Bound)",
          description: "### 🧠 The Core Concept\nThis is identical to the **Lower Bound** problem. The index $i$ where $arr[i] \ge target$ is the exact insertion spot.",
          timeComplexity: "O(log N)",
          timeComplexityExplanation: "Standard logarithmic bound.",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "var searchInsert = function(nums, target) {\n    let low = 0, high = nums.length - 1, ans = nums.length;\n    while (low <= high) {\n        let mid = Math.floor((low + high) / 2);\n        if (nums[mid] >= target) { ans = mid; high = mid - 1; }\n        else low = mid + 1;\n    }\n    return ans;\n};" }
          ]
       }
    ]
  },
  {
    id: "floor-ceil-in-sorted-array",
    title: "Floor/Ceil in Sorted Array",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Find the floor (largest element $\le x$) and ceil (smallest element $\ge x$) in a sorted array.",
    leetcodeLink: "",
    useCases: ["Proximity search", "Data bucketing"],
    approaches: [
       {
          name: "Optimal (Dual Binary Search)",
          description: "### 🧠 The Core Concept\nCeiling is essentially the **Lower Bound**. Floor is found by recording index when `arr[mid] <= x` and searching right.",
          timeComplexity: "O(log N)",
          timeComplexityExplanation: "Dual logarithmic passes.",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def getFloorAndCeil(arr, n, x):\n    f, c = -1, -1\n    # Floor logic\n    l, r = 0, n - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if arr[mid] <= x: f = arr[mid]; l = mid + 1\n        else: r = mid - 1\n    # Ceil is Lower Bound\n    return (f, c)" }
          ]
       }
    ]
  },
  {
    id: "first-or-last-occurrence-of-a-number",
    title: "First and Last Occurrence",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search Basics",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Find the start and end positions of a target value in a sorted array.",
    leetcodeLink: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
    useCases: ["Frequency counting", "Log analysis"],
    approaches: [
       {
          name: "Optimal (Lower/Upper Bound)",
          description: "### 🧠 The Core Concept\n1. First Occur = Lower Bound (if $arr[lb] == x$).\n2. Last Occur = Upper Bound - 1.",
          timeComplexity: "O(log N)",
          timeComplexityExplanation: "Dual binary searches.",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function findFirstLast(nums, target) {\n    const lb = lowerBound(nums, nums.length, target);\n    if (lb === nums.length || nums[lb] !== target) return [-1, -1];\n    return [lb, upperBound(nums, nums.length, target) - 1];\n}" }
          ]
       }
    ]
  },
  {
    id: "search-in-rotated-sorted-array-ii",
    title: "Search in Rotated Sorted Array II",
    topic: "Binary Search - 1D Arrays",
    category: "Divide & Conquer",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Same as version I, but the array contains duplicates.",
    leetcodeLink: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
    useCases: ["Chaotic sorted data", "Duplicate handling"],
    approaches: [
       {
          name: "Optimal (Bound Compression)",
          description: "### 🧠 The Core Concept\nIf `arr[low] == arr[mid] == arr[high]`, we can't tell which side is sorted. We simply shrink the search space by `low++` and `high--` and retry.",
          timeComplexity: "O(log N) (avg), O(N) (worst)",
          timeComplexityExplanation: "Worst case occurs if all elements are identical.",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return True\n        if nums[l] == nums[mid] == nums[r]: l += 1; r -= 1; continue\n        # ... same as Rotated BS I\n    return False" }
          ]
       }
    ]
  },
  {
    id: "minimum-days-to-make-m-bouquets",
    title: "Minimum Days for M Bouquets",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Find the minimum number of days to wait until we can make m bouquets with k adjacent flowers.",
    leetcodeLink: "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/",
    useCases: ["Resource scheduling", "Deadline estimation"],
    approaches: [
       {
          name: "Optimal (BS on Days)",
          description: "### 🧠 The Core Concept\nThe answer lies between `min(bloomDay)` and `max(bloomDay)`. Use binary search to find the earliest day that satisfies the bouquet condition.",
          timeComplexity: "O(N * log(MaxDay))",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function minDays(bloomDay, m, k) {\n    if (m * k > bloomDay.length) return -1;\n    let low = Math.min(...bloomDay), high = Math.max(...bloomDay);\n    while (low <= high) {\n        let mid = Math.floor((low + high) / 2);\n        if (canMake(bloomDay, mid, m, k)) high = mid - 1;\n        else low = mid + 1;\n    }\n    return low;\n}" }
          ]
       }
    ]
  },
  {
    id: "find-the-smallest-divisor-given-a-threshold",
    title: "Smallest Divisor",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Find the smallest divisor such that the sum of the division results is less than or equal to a threshold.",
    leetcodeLink: "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/",
    useCases: ["Load balancing", "Capacity partitioning"],
    approaches: [
       {
          name: "Optimal (BS on Divisor)",
          description: "### 🧠 The Core Concept\nBinary search the range [1, max(nums)]. For each mid, check if the sum of `ceil(nums[i]/mid)` is $\le$ threshold.",
          timeComplexity: "O(N * log(MaxNum))",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def smallestDivisor(nums, threshold):\n    l, r = 1, max(nums)\n    while l <= r:\n        mid = (l + r) // 2\n        if sum((n + mid - 1) // mid for n in nums) <= threshold: r = mid - 1\n        else: l = mid + 1\n    return l" }
          ]
       }
    ]
  },
  {
    id: "capacity-to-ship-packages-within-d-days",
    title: "Ship Packages in D Days",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the minimum weight capacity of a ship that will result in all packages being shipped within D days.",
    leetcodeLink: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
    useCases: ["Logistics optimization", "Bandwidth allocation"],
    approaches: [
       {
          name: "Optimal (BS on Capacity)",
          description: "### 🧠 The Core Concept\nMin capacity = max(weights), Max capacity = sum(weights). Binary search this range.",
          timeComplexity: "O(N * log(Sum))",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function shipWithinDays(weights, days) {\n    let l = Math.max(...weights), r = weights.reduce((a,b)=>a+b, 0);\n    while (l <= r) {\n        let mid = Math.floor((l+r)/2);\n        if (canShip(mid)) r = mid - 1;\n        else l = mid + 1;\n    }\n    return l;\n}" }
          ]
       }
    ]
  },
  {
    id: "aggressive-cows",
    title: "Aggressive Cows",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Assign cows to stalls such that the minimum distance between any two of them is as large as possible.",
    leetcodeLink: "",
    useCases: ["Wireless sensor placement", "Conflict-free scheduling"],
    approaches: [
       {
          name: "Optimal (BS on Distance)",
          description: "### 🧠 The Core Concept\nBinary search the minimum distance. For each mid, check if we can place all cows with at least 'mid' distance apart.",
          timeComplexity: "O(N log N + N log(MaxDist))",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def aggressiveCows(stalls, k):\n    stalls.sort()\n    l, r, ans = 1, stalls[-1] - stalls[0], 1\n    while l <= r:\n        mid = (l + r) // 2\n        if canPlace(mid): ans = mid; l = mid + 1\n        else: r = mid - 1\n    return ans" }
          ]
       }
    ]
  },
  {
    id: "book-allocation-problem",
    title: "Book Allocation Problem",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Allocate books to students such that the maximum number of pages assigned to a student is minimized.",
    leetcodeLink: "",
    useCases: ["Workload balancing", "Parallel process allocation"],
    approaches: [
       {
          name: "Optimal (BS on Max Pages)",
          description: "### 🧠 The Core Concept\nThis is identical to 'Split Array Largest Sum' and 'Painter's Partition'. Binary search the max pages threshold.",
          timeComplexity: "O(N log(Sum))",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function allocateBooks(A, B) {\n    if (B > A.length) return -1;\n    let l = Math.max(...A), r = A.reduce((a,b)=>a+b, 0);\n    while (l <= r) {\n        let mid = Math.floor((l+r)/2);\n        if (countStudents(mid) <= B) r = mid - 1;\n        else l = mid + 1;\n    }\n    return l;\n}" }
          ]
       }
    ]
  },
  {
    id: "find-the-row-with-maximum-number-of-1s",
    title: "Row with Max 1s",
    topic: "Binary Search - 2D Arrays",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "In a 2D matrix where each row is sorted, find the row index with the maximum number of 1s.",
    leetcodeLink: "",
    useCases: ["Feature detection", "Sparse matrix analysis"],
    approaches: [
       {
          name: "Optimal (Binary Search per Row)",
          description: "### 🧠 The Core Concept\nFor each row, find the first '1' using Lower Bound. The number of 1s is `cols - firstIndex`.",
          timeComplexity: "O(Rows * log(Cols))",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function rowWithMax1s(mat) {\n    let maxCount = 0, rowIdx = -1;\n    for (let i = 0; i < mat.length; i++) {\n        let firstOne = lowerBound(mat[i], mat[i].length, 1);\n        let count = mat[i].length - firstOne;\n        if (count > maxCount) { maxCount = count; rowIdx = i; }\n    }\n    return rowIdx;\n}" }
          ]
       }
    ]
  },
  {
    id: "search-in-a-2d-matrix",
    title: "Search in 2D Matrix",
    topic: "Binary Search - 2D Arrays",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Search for a target value in an m x n matrix where each row is sorted and the first integer of each row is greater than the last integer of the previous row.",
    leetcodeLink: "https://leetcode.com/problems/search-in-a-2d-matrix/",
    useCases: ["Database table lookups", "Sorted grid search"],
    approaches: [
       {
          name: "Optimal (Virtual 1D Array)",
          description: "### 🧠 The Core Concept\nTreat the matrix as a flattened 1D array of size `m * n`. A virtual index `i` maps to `[Math.floor(i/n), i%n]`.",
          timeComplexity: "O(log(M*N))",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def searchMatrix(matrix, target):\n    m, n = len(matrix), len(matrix[0])\n    l, r = 0, m * n - 1\n    while l <= r:\n        mid = (l + r) // 2\n        val = matrix[mid // n][mid % n]\n        if val == target: return True\n        elif val < target: l = mid + 1\n        else: r = mid - 1\n    return False" }
          ]
       }
    ]
  },
  {
    id: "search-in-a-2d-matrix-ii",
    title: "Search in 2D Matrix II",
    topic: "Binary Search - 2D Arrays",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Search in an m x n matrix where each row and each column is sorted in ascending order.",
    leetcodeLink: "https://leetcode.com/problems/search-in-a-2d-matrix-ii/",
    useCases: ["Multi-index database searching"],
    approaches: [
       {
          name: "Optimal (Staircase Search)",
          description: "### 🧠 The Core Concept\nStart from the Top-Right corner. If `val > target`, move left (entire column is too big). If `val < target`, move down (entire row is too small).",
          timeComplexity: "O(M + N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function searchMatrixII(matrix, target) {\n    let row = 0, col = matrix[0].length - 1;\n    while (row < matrix.length && col >= 0) {\n        if (matrix[row][col] === target) return true;\n        if (matrix[row][col] > target) col--;\n        else row++;\n    }\n    return false;\n}" }
          ]
       }
    ]
  },
  {
    id: "find-peak-element-2d-matrix",
    title: "Peak Element in 2D Matrix",
    topic: "Binary Search - 2D Arrays",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Find a peak element in a 2D matrix where an element is a peak if it is greater than its neighbors (left, right, top, bottom).",
    leetcodeLink: "https://leetcode.com/problems/find-a-peak-element-ii/",
    useCases: ["Terrain analysis", "Signal peak detection"],
    approaches: [
       {
          name: "Optimal (BS on Columns)",
          description: "### 🧠 The Core Concept\nBinary search for the column. Find the maximum element in the `midCol`. If it's smaller than its neighbor in `midCol+1`, a peak must exist on the right.",
          timeComplexity: "O(Rows * log(Cols))",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def findPeakGrid(mat):\n    l, r = 0, len(mat[0]) - 1\n    while l <= r:\n        midCol = (l + r) // 2\n        maxRow = findMaxRow(mat, midCol)\n        left = mat[maxRow][midCol-1] if midCol > 0 else -1\n        right = mat[maxRow][midCol+1] if midCol < len(mat[0])-1 else -1\n        if mat[maxRow][midCol] > left and mat[maxRow][midCol] > right: return [maxRow, midCol]\n        elif mat[maxRow][midCol] < right: l = midCol + 1\n        else: r = midCol - 1" }
          ]
       }
    ]
  },
  {
    id: "median-in-a-row-wise-sorted-matrix",
    title: "Median in Row-wise Sorted Matrix",
    topic: "Binary Search - 2D Arrays",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Find the median of a matrix where each row is sorted.",
    leetcodeLink: "",
    useCases: ["Statistical analysis on partitioned data"],
    approaches: [
       {
          name: "Optimal (BS on Number Range)",
          description: "### 🧠 The Core Concept\nBinary search the range [min, max]. For each mid, count elements $\le$ mid in the matrix using `upperBound` on each row. Median is the first value where count $> (M*N)/2$.",
          timeComplexity: "O(Rows * log(Cols) * log(2^31))",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function median(matrix) {\n    let low = 1, high = 1e9;\n    while (low <= high) {\n        let mid = Math.floor((low + high) / 2);\n        if (countLessEqual(matrix, mid) <= (R*C)/2) low = mid + 1;\n        else high = mid - 1;\n    }\n    return low;\n}" }
          ]
       }
    ]
  }
];
