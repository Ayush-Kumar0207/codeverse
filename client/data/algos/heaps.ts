import { AlgorithmEntry } from "./types";

export const heapAlgorithms: AlgorithmEntry[] = [
  {
    id: "kth-largest-element-in-an-array",
    title: "Kth Largest Element",
    topic: "Heaps",
    category: "Selection Patterns",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Find the kth largest element in an unsorted array.",
    leetcodeLink: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    useCases: ["Finding median", "Selection statistics", "Top performance monitoring"],
    approaches: [
       {
          name: "Optimal (Min-Heap)",
          description: "### 🧠 The Core Concept\nBy maintaining a **Min-Heap** of size $K$, the top of the heap always represents the 'smallest of the largest $K$' elements. \nOnce we process the entire array, the top is exactly the Kth largest element.\n\n### 🛠️ Execution Strategy\n1. Iterate through the array.\n2. Push element to Min-Heap.\n3. If heap size > K, pop from heap.\n4. Return the top of heap.",
          timeComplexity: "O(N * log K)",
          spaceComplexity: "O(K)",
          implementations: [
             { language: "Python", code: "import heapq\ndef findKthLargest(nums, k):\n    return heapq.nlargest(k, nums)[-1]" }
          ]
       }
    ]
  },
  {
    id: "find-median-from-data-stream",
    title: "Median from Data Stream",
    topic: "Heaps",
    category: "Two-Heaps Pattern",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Design a data structure that supports adding numbers and finding the median.",
    leetcodeLink: "https://leetcode.com/problems/find-median-from-data-stream/",
    useCases: ["Real-time statistical monitoring", "Dynamic data summarization"],
    approaches: [
       {
          name: "Optimal (Two Heaps)",
          description: "### 🧠 The Core Concept\nDivide the data into two halves: \n1. **Small Half**: Max-Heap (to get the largest of the smalls).\n2. **Large Half**: Min-Heap (to get the smallest of the larges).\n\nThe median is either the top of the larger heap (if total size is odd) or the average of both tops (if even).",
          timeComplexity: "O(log N) add, O(1) find",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "JavaScript", code: "// Implementation using two priority queues..." }
          ]
       }
    ]
  },
  {
    id: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    topic: "Heaps",
    category: "Frequency Patterns",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given an integer array nums and an integer k, return the k most frequent elements.",
    leetcodeLink: "https://leetcode.com/problems/top-k-frequent-elements/",
    useCases: ["Trending topics analysis", "Cache prefetching algorithms"],
    approaches: [
       {
          name: "Optimal (Heap + Hash Map)",
          description: "### 🧠 The Core Concept\nUse a Hash Map to count frequencies, then use a Min-Heap of size K to keep track of the most frequent elements.",
          timeComplexity: "O(N * log K)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "Python", code: "from collections import Counter\nimport heapq\ndef topKFrequent(nums, k):\n    count = Counter(nums)\n    return heapq.nlargest(k, count.keys(), key=count.get)" }
          ]
       }
    ]
  }
];
