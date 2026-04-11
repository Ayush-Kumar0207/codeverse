import { AlgorithmEntry } from "./types";

export const heapAlgorithms: AlgorithmEntry[] = [
  {
    id: "kth-largest-element-in-an-array",
    title: "Kth Largest Element",
    topic: "Heaps",
    category: "Selection Patterns",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Find the kth largest element in an unsorted array without sorting the entire collection.",
    leetcodeLink: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    useCases: ["Finding median", "Selection statistics", "Top performance monitoring"],
    approaches: [
       {
          name: "Optimal (Min-Heap)",
          description: "### 🧠 The Core Concept: The 'VIP Club' Analogy\nImagine you want to find the 3rd tallest person in a massive crowd of 1 million people. You could sort everyone by height (slow), or you could use a **VIP Club** (Min-Heap) that only holds 3 people.\n\n1. At the start, the first 3 people enter the club.\n2. For every new person in the crowd, they compare themselves to the **shortest person currently in the club** (the `top` of the Min-Heap).\n3. If the newcomer is taller, the shortest person is kicked out, and the newcomer enters.\n4. After meeting everyone, the shortest person left in the club is exactly the 3rd tallest in the world!\n\n### 🛠️ Execution Strategy\n1. **Initialize** a Min-Heap and iterate through the array.\n2. **Push** each element into the heap.\n3. **Maintain Size**: If the heap size exceeds $K$, `pop` the smallest element.\n4. **Result**: After the loop, the `top` of the heap is our $K^{th}$ largest element.",
          timeComplexity: "O(N * log K)",
          timeComplexityExplanation: "We iterate through N elements once. Each heap insertion/deletion takes log K time because the heap size never exceeds K.",
          spaceComplexity: "O(K)",
          spaceComplexityExplanation: "We only store K elements in the heap at any given time, regardless of how large the input array is.",
          implementations: [
             { 
                language: "Python", 
                code: `import heapq

def findKthLargest(nums, k):
    # Create a min-heap of the first k elements
    heap = nums[:k]
    heapq.heapify(heap)
    
    # Process the rest of the elements
    for i in range(k, len(nums)):
        # If current element is larger than the smallest in our heap
        if nums[i] > heap[0]:
            # Replace the smallest with current
            heapq.heapreplace(heap, nums[i])
            
    return heap[0]` 
             },
             {
                language: "JavaScript",
                code: `// Using a PriorityQueue (standard in modern JS environments)
function findKthLargest(nums, k) {
    const minHeap = new MinPriorityQueue();
    
    for (const num of nums) {
        minHeap.enqueue(num);
        if (minHeap.size() > k) {
            minHeap.dequeue();
        }
    }
    
    return minHeap.front().element;
}`
             }
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
    overview: "Design a data structure that calculates the median of a continuously growing stream of numbers in real-time.",
    leetcodeLink: "https://leetcode.com/problems/find-median-from-data-stream/",
    useCases: ["Real-time statistical monitoring", "Dynamic data summarization", "Financial moving averages"],
    approaches: [
       {
          name: "Optimal (Two Heaps Algorithm)",
          description: "### 🧠 The Core Concept: The 'Perfect Balance'\nThe median is the middle point. To find it instantly, we split our data into two equal-sized 'buckets':\n\n1. **The Small Half (Max-Heap)**: Stores the smaller half of the numbers. We want the *largest* of these to be easily accessible at the top.\n2. **The Large Half (Min-Heap)**: Stores the larger half of the numbers. We want the *smallest* of these to be at the top.\n\nBy keeping these two heaps balanced (size difference $\\le 1$), the median is always right at the 'meeting point' of their tops!\n\n### 🛠️ Step-by-Step Logic\n1. **Insert**: Always push to the Max-Heap first, then move the largest element to the Min-Heap to maintain order.\n2. **Rebalance**: If the Min-Heap becomes larger than the Max-Heap, move the smallest 'Large' value back to the 'Small' side.\n3. **Calculate**: \n   - If total count is odd: The Max-Heap top is the median.\n   - If total count is even: It's the average of both tops.",
          timeComplexity: "O(log N) add, O(1) find",
          timeComplexityExplanation: "Adding a number involves a few heap operations (log N). Finding the median only requires looking at the tops of the heaps (constant time).",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "We must store all numbers from the stream to calculate future medians correctly.",
          implementations: [
             { 
                language: "Python", 
                code: `import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # Max-Heap (stores smaller half)
        self.large = []  # Min-Heap (stores larger half)

    def addNum(self, num: int):
        # Always push to max-heap first
        # (Using negative for Python's min-heap to act as max-heap)
        heapq.heappush(self.small, -num)
        
        # Ensure every element in small <= every element in large
        if self.small and self.large and (-self.small[0] > self.large[0]):
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
            
        # Balance the sizes
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        if len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0`
             }
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
    overview: "Given an integer array, return the k most frequent elements in any order.",
    leetcodeLink: "https://leetcode.com/problems/top-k-frequent-elements/",
    useCases: ["Trending topics analysis", "Cache prefetching algorithms", "Autocomplete suggestions"],
    approaches: [
       {
          name: "Optimal (Min-Heap + Hash Map)",
          description: "### 🧠 The Core Concept: Counting & Sorting\nFinding the most frequent items is like a talent show:\n1. **Audition (Counting)**: Use a Hash Map to count how many times each 'contestant' (number) appears.\n2. **The Finalists (Heap)**: Use a Min-Heap of size $K$ to keep track of the top performers. \n\nWe use a **Min-Heap** specifically because we want to easily 'evict' the least frequent of the top $K$ competitors as we find even better ones.\n\n### 🛠️ Execution Strategy\n1. Create a frequency map (Hash Map).\n2. Iterate through the unique numbers in the map.\n3. Push `(frequency, number)` into the Min-Heap.\n4. If heap size > $K$, remove the element with the lowest frequency.\n5. The remaining $K$ elements are your winners!",
          timeComplexity: "O(N * log K)",
          timeComplexityExplanation: "Counting takes O(N). Building a heap of size K for the unique elements (at most N) takes O(N log K). If K is small, this is nearly linear!",
          spaceComplexity: "O(N + K)",
          spaceComplexityExplanation: "We store N unique elements in the map and K elements in the heap.",
          implementations: [
             { 
                language: "Python", 
                code: `from collections import Counter
import heapq

def topKFrequent(nums, k):
    # 1. Count frequencies O(N)
    count = Counter(nums)
    
    # 2. Use min-heap to keep k most frequent O(N log K)
    # heap stores (frequency, num)
    return heapq.nlargest(k, count.keys(), key=count.get)` 
             },
             {
                language: "Java",
                code: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // 1. Build frequency map
        Map<Integer, Integer> count = new HashMap<>();
        for (int n : nums) count.put(n, count.getOrDefault(n, 0) + 1);

        // 2. Keep k top frequent elements in a min-heap
        PriorityQueue<Integer> heap = new PriorityQueue<>(
            (n1, n2) -> count.get(n1) - count.get(n2)
        );

        for (int n : count.keySet()) {
            heap.add(n);
            if (heap.size() > k) heap.poll();
        }

        // 3. Build output array
        int[] result = new int[k];
        for (int i = k - 1; i >= 0; --i) result[i] = heap.poll();
        return result;
    }
}`
             }
          ]
       }
    ]
  }
];
