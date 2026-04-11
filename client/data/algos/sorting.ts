import { AlgorithmEntry } from "./types";

export const sortingAlgorithms: AlgorithmEntry[] = [
  {
    id: "quick-sort",
    title: "Quick Sort",
    topic: "Sorting Algorithms",
    category: "Divide & Conquer",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "An efficient, in-place sorting algorithm that uses a divide-and-conquer strategy by picking a 'pivot' and partitioning the array around it.",
    leetcodeLink: "https://leetcode.com/problems/sort-an-array/",
    useCases: ["System-level sorting (qsort in C)", "Embedded systems with memory constraints", "Large-scale data processing"],
    approaches: [
       {
          name: "Optimal (Lomuto Partitioning)",
          description: "### 🧠 The Core Concept\nImagine you are sorting a messy line of students by height. You pick one student (the **Pivot**) and say: *\"Everyone shorter than this person, move to the left! Everyone taller, move to the right!\"*\n\nOnce the shuffling is done, that one student is in their **Perfect Final Position**. You then do the exact same thing for the left group and the right group recursively until the whole line is sorted.\n\n### 🛠️ Execution Strategy\n1. **Pick Pivot**: Usually the last element of the current segment.\n2. **Partition**: \n   - Use a pointer `i` to track the 'boundary' of the smaller elements.\n   - Iterate through the elements. If `arr[j] < pivot`, swap `arr[j]` with `arr[i]` and increment `i`.\n3. **Final Swap**: Place the pivot at its final spot (`i`).\n4. **Recurse**: Repeat for `[low...i-1]` and `[i+1...high]`.",
          timeComplexity: "O(N log N)",
          timeComplexityExplanation: "On average, each partitioning step halves the problem size. However, in the absolute worst case (already sorted array), it can degrade to $O(N^2)$ if the pivot selection is poor.",
          spaceComplexity: "O(log N)",
          spaceComplexityExplanation: "This represents the memory used by the recursive call stack. Since it's in-place, auxiliary data space is $O(1)$.",
          implementations: [
             {
                language: "Python",
                code: "def quickSort(nums, low, high):\n    if low < high:\n        pivot_idx = partition(nums, low, high)\n        quickSort(nums, low, pivot_idx - 1)\n        quickSort(nums, pivot_idx + 1, high)\n\ndef partition(nums, low, high):\n    pivot = nums[high]\n    i = low\n    for j in range(low, high):\n        if nums[j] < pivot:\n            nums[i], nums[j] = nums[j], nums[i]\n            i += 1\n    nums[i], nums[high] = nums[high], nums[i]\n    return i"
             },
             {
                language: "JavaScript",
                code: "function quickSort(arr, low = 0, high = arr.length - 1) {\n    if (low < high) {\n        let p = partition(arr, low, high);\n        quickSort(arr, low, p - 1);\n        quickSort(arr, p + 1, high);\n    }\n    return arr;\n}\n\nfunction partition(arr, low, high) {\n    let pivot = arr[high];\n    let i = low;\n    for (let j = low; j < high; j++) {\n        if (arr[j] < pivot) {\n            [arr[i], arr[j]] = [arr[j], arr[i]];\n            i++;\n        }\n    }\n    [arr[i], arr[high]] = [arr[high], arr[i]];\n    return i;\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public void quickSort(int[] arr, int low, int high) {\n        if (low < high) {\n            int p = partition(arr, low, high);\n            quickSort(arr, low, p - 1);\n            quickSort(arr, p + 1, high);\n        }\n    }\n\n    private int partition(int[] arr, int low, int high) {\n        int pivot = arr[high];\n        int i = low;\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) {\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n                i++;\n            }\n        }\n        int temp = arr[i];\n        arr[i] = arr[high];\n        arr[high] = temp;\n        return i;\n    }\n}"
             },
             {
                language: "C++",
                code: "void quickSort(vector<int>& arr, int low, int high) {\n    if (low < high) {\n        int p = partition(arr, low, high);\n        quickSort(arr, low, p - 1);\n        quickSort(arr, p + 1, high);\n    }\n}\n\nint partition(vector<int>& arr, int low, int high) {\n    int pivot = arr[high];\n    int i = low;\n    for (int j = low; j < high; j++) {\n        if (arr[j] < pivot) {\n            swap(arr[i], arr[j]);\n            i++;\n        }\n    }\n    swap(arr[i], arr[high]);\n    return i;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "merge-sort",
    title: "Merge Sort",
    topic: "Sorting Algorithms",
    category: "Divide & Conquer",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "A stable, comparison-based sorting algorithm that consistently runs in O(N log N) time by splitting the array into halves and merging them back together.",
    leetcodeLink: "https://leetcode.com/problems/sort-an-array/",
    useCases: ["Sorting Linked Lists", "External sorting for large files", "E-commerce apps (stable sorting required)"],
    approaches: [
       {
          name: "Optimal (Divide & Merge)",
          description: "### 🧠 The Core Concept\nMerge Sort follows the philosophy of **Divide and Conquer**. \nIt takes a massive, messy array and recursively splits it in half until every piece is just a single element (a single element is, by definition, sorted!).\n\nYou then **Merge** these tiny sorted pieces back together, comparing the fronts of each list and building a new sorted whole. Because it splits perfectly every time, it has zero 'worst-case' speed traps.\n\n### 🛠️ Execution Strategy\n1. **Base Case**: If array length $\le 1$, return the array.\n2. **Split**: Find the `mid` point and recursively call `mergeSort` on the Left and Right halves.\n3. **Merge**: \n   - Use two pointers to iterate through the two sorted halves.\n   - Pick the smaller element and add it to a `result` array.\n4. **Combine**: Append the remains of whichever half finished last.",
          timeComplexity: "O(N log N)",
          timeComplexityExplanation: "The tree depth is constantly $Log N$. At each of those levels, we perform a linear $O(N)$ merge operation. Total work is $N \\times Log N$ regardless of initial order.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Merge sort is not in-place for arrays; it requires an auxiliary buffer to temporarily store the values during the merge phase.",
          implementations: [
             {
                language: "JavaScript",
                code: "function mergeSort(arr) {\n    if (arr.length <= 1) return arr;\n    \n    const mid = Math.floor(arr.length / 2);\n    const left = mergeSort(arr.slice(0, mid));\n    const right = mergeSort(arr.slice(mid));\n    \n    return merge(left, right);\n}\n\nfunction merge(left, right) {\n    let result = [], i = 0, j = 0;\n    while (i < left.length && j < right.length) {\n        if (left[i] < right[j]) result.push(left[i++]);\n        else result.push(right[j++]);\n    }\n    return result.concat(left.slice(i)).concat(right.slice(j));\n}"
             },
             {
                language: "Python",
                code: "def mergeSort(nums):\n    if len(nums) <= 1: return nums\n    \n    mid = len(nums) // 2\n    left = mergeSort(nums[:mid])\n    right = mergeSort(nums[mid:])\n    \n    return merge(left, right)\n\ndef merge(l, r):\n    res = []\n    i = j = 0\n    while i < len(l) and j < len(r):\n        if l[i] < r[j]:\n            res.append(l[i])\n            i += 1\n        else:\n            res.append(r[j])\n            j += 1\n    res.extend(l[i:])\n    res.extend(r[j:])\n    return res"
             },
             {
                language: "Java",
                code: "public int[] sortArray(int[] nums) {\n    if (nums.length <= 1) return nums;\n    int mid = nums.length / 2;\n    int[] left = sortArray(Arrays.copyOfRange(nums, 0, mid));\n    int[] right = sortArray(Arrays.copyOfRange(nums, mid, nums.length));\n    return merge(left, right);\n}\n\nprivate int[] merge(int[] l, int[] r) {\n    int[] res = new int[l.length + r.length];\n    int i = 0, j = 0, k = 0;\n    while (i < l.length && j < r.length) {\n        if (l[i] < r[j]) res[k++] = l[i++];\n        else res[k++] = r[j++];\n    }\n    while (i < l.length) res[k++] = l[i++];\n    while (j < r.length) res[k++] = r[j++];\n    return res;\n}"
             },
             {
                language: "C++",
                code: "vector<int> mergeSort(vector<int>& nums) {\n    if (nums.size() <= 1) return nums;\n    int mid = nums.size() / 2;\n    vector<int> left(nums.begin(), nums.begin() + mid);\n    vector<int> right(nums.begin() + mid, nums.end());\n    \n    left = mergeSort(left);\n    right = mergeSort(right);\n    \n    return merge(left, right);\n}\n\nvector<int> merge(vector<int>& l, vector<int>& r) {\n    vector<int> res;\n    int i = 0, j = 0;\n    while(i < l.size() && j < r.size()) {\n        if (l[i] < r[j]) res.push_back(l[i++]);\n        else res.push_back(r[j++]);\n    }\n    while(i < l.size()) res.push_back(l[i++]);\n    while(j < r.size()) res.push_back(r[j++]);\n    return res;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "selection-sort",
    title: "Selection Sort",
    topic: "Sorting Algorithms",
    category: "Basics",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Pick the minimum element and swap it to the front. Repeat for the remaining portion.",
    leetcodeLink: "",
    useCases: ["Educational basics", "Small data sets"],
    approaches: [
       {
          name: "Standard Optimal",
          description: "### 🧠 The Core Concept: The 'Mini-Scan' Strategy\nImagine you have a messy shelf of books. You start at the left, scan the entire shelf for the thinnest book, and swap it with the book in the first position. Now the first position is perfect. Then you scan the rest of the shelf for the second thinnest, and so on.\n\n### 🛠️ Execution Strategy\n1. Iterate from $i = 0$ to $n-1$.\n2. For each $i$, find the index of the minimum element in the range $[i, n-1]$.\n3. Swap that minimum element with the element at index $i$.\n4. The sorted boundary moves forward one step.",
          timeComplexity: "O(N²)",
          timeComplexityExplanation: "Regardless of whether the array is sorted or not, we always perform the same number of comparisons to find the minimum: $N + (N-1) + (N-2) ... + 1 = N(N+1)/2$.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We sort the array in-place without any extra storage.",
          implementations: [
             {
                language: "Python",
                code: `def selectionSort(arr):
    n = len(arr)
    for i in range(n - 1):
        mini = i
        for j in range(i + 1, n):
            if arr[j] < arr[mini]:
                mini = j
        arr[i], arr[mini] = arr[mini], arr[i]`
             },
             {
                language: "JavaScript",
                code: `function selectionSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let mini = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[mini]) mini = j;
        }
        [arr[i], arr[mini]] = [arr[mini], arr[i]];
    }
}`
             }
          ]
       }
    ]

  },
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    topic: "Sorting Algorithms",
    category: "Basics",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Repeatedly swap adjacent elements if they are in the wrong order.",
    leetcodeLink: "",
    useCases: ["Educational basics"],
    approaches: [
       {
          name: "Optimal (With Early Exit)",
          description: "### 🧠 The Core Concept: The 'Weight' Analogy\nImagine elements as bubbles in water. Heavier (larger) elements 'sink' to the bottom (the end of the array) while lighter ones float to the top. Every full pass guarantees that at least one more heavy element has reached its final home at the end.\n\n### 🛠️ Execution Strategy\n1. Iterate from the end of the array down to the start.\n2. In each pass, compare adjacent elements: `arr[j]` and `arr[j+1]`.\n3. If `arr[j] > arr[j+1]`, swap them.\n4. **Optimization**: If an entire pass completes without a single swap, the array is already sorted! We can stop early.",
          timeComplexity: "O(N²) (Avg), O(N) (Best)",
          timeComplexityExplanation: "Best case occurs if the array is already sorted, finishing in a single $O(N)$ pass. Average/Worst is $O(N^2)$ for reverse-sorted data.",
          spaceComplexity: "O(1)",
          implementations: [
             {
                language: "Python",
                code: `def bubbleSort(arr):
    n = len(arr)
    for i in range(n - 1, 0, -1):
        didSwap = False
        for j in range(i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                didSwap = True
        if not didSwap: break`
             },
             {
                language: "JavaScript",
                code: `function bubbleSort(arr) {
    let n = arr.length;
    for (let i = n - 1; i >= 0; i--) {
        let didSwap = false;
        for (let j = 0; j <= i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                didSwap = true;
            }
        }
        if (!didSwap) break;
    }
}`
             }
          ]
       }
    ]

  },
  {
    id: "insertion-sort",
    title: "Insertion Sort",
    topic: "Sorting Algorithms",
    category: "Basics",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Build the sorted array one element at a time by picking from the unsorted part and 'inserting' it into the correct spot.",
    leetcodeLink: "",
    useCases: ["Almost sorted data", "Online sorting"],
    approaches: [
       {
          name: "Standard Optimal",
          description: "### 🧠 The Core Concept: The 'Playing Cards' Analogy\nImagine you're playing cards. You pick up a new card and 'insert' it into the sorted group in your hand. You do this by comparing it with the cards on its left and shifting them right until you find the correct hole to drop the new card into.\n\n### 🛠️ Execution Strategy\n1. Start from the second element (it's the 'new card').\n2. Compare it with the element on its left.\n3. If it's smaller, 'shift' it left until it reaches a smaller element or the start of the array.\n4. Repeat for all elements in the unsorted portion.",
          timeComplexity: "O(N²) (Avg), O(N) (Best)",
          timeComplexityExplanation: "In the best case (already sorted), each element only checks one neighbor. In the worst case (reverse sorted), it checks all previously sorted elements.",
          spaceComplexity: "O(1)",
          implementations: [
             {
                language: "Python",
                code: `def insertionSort(arr):
    for i in range(len(arr)):
        j = i
        while j > 0 and arr[j - 1] > arr[j]:
            arr[j - 1], arr[j] = arr[j], arr[j - 1]
            j -= 1`
             },
             {
                language: "JavaScript",
                code: `function insertionSort(arr) {
    for (let i = 0; i <= arr.length - 1; i++) {
        let j = i;
        while (j > 0 && arr[j - 1] > arr[j]) {
            [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
            j--;
        }
    }
}`
             }
          ]
       }
    ]

  }
];
