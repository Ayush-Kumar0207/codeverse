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
  }
];
