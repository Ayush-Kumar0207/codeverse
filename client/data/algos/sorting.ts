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
          name: "Standard Implementation",
          description: "### 🧠 The Core Concept\nFind the smallest element in the unsorted part and swap it with the first element of the unsorted part.",
          timeComplexity: "O(N²)",
          timeComplexityExplanation: "Nested loops: for each N, search remaining N-i.",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function selectionSort(arr) {\n    for (let i = 0; i < arr.length - 1; i++) {\n        let min = i;\n        for (let j = i + 1; j < arr.length; j++) {\n            if (arr[j] < arr[min]) min = j;\n        }\n        [arr[i], arr[min]] = [arr[min], arr[i]];\n    }\n}" }
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
          description: "### 🧠 The Core Concept\nLargest elements 'bubble' up to the end. If no swaps occur in a pass, the array is already sorted.",
          timeComplexity: "O(N²) (Avg), O(N) (Best)",
          timeComplexityExplanation: "Worst case is $O(N^2)$, but sorted arrays exit in $O(N)$.",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def bubbleSort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n                swapped = True\n        if not swapped: break" }
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
          name: "Standard Implementation",
          description: "### 🧠 The Core Concept\nTake an element and keep swapping it backward until it finds its sorted home.",
          timeComplexity: "O(N²) (Avg), O(N) (Best)",
          timeComplexityExplanation: "Efficient for small or almost-sorted data.",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function insertionSort(arr) {\n    for (let i = 1; i < arr.length; i++) {\n        let j = i;\n        while (j > 0 && arr[j-1] > arr[j]) {\n            [arr[j], arr[j-1]] = [arr[j-1], arr[j]];\n            j--;\n        }\n    }\n}" }
          ]
       }
    ]
  }
];
