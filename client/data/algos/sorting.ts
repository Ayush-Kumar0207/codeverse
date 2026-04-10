import { AlgorithmEntry } from "./types";

export const sortingAlgorithms: AlgorithmEntry[] = [
  {
    id: "merge-sort",
    title: "Merge Sort",
    topic: "Sorting - Sorting II",
    category: "Sorting",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Merge Sort is a Divide and Conquer algorithm that divides the input array into two halves, calls itself on the two halves, and then merges the two sorted halves.",
    leetcodeLink: "https://leetcode.com/problems/sort-an-array/",
    useCases: ["External sorting implementations", "Stabilizing sort order", "Javascript Array.prototype.sort (in older V8 engines)"],
    approaches: [
       {
          name: "Optimal (Divide & Conquer)",
          description: "### 🧠 The Core Concept\nIf I handed you a deck of 52 badly shuffled cards and said \"Sort this instantly\", you would panic.\nBut what if you split the deck in half, gave 26 to your friend, and told them to sort it, while you sort the other 26? \n\nWhat if your friend split their deck again? \n**Merge Sort** recursively splits the array exactly in half until you are left with just `1` card. (A stack of 1 card is technically perfectly sorted!). \n\nOnce everything is split into individuals, you look at the person next to you, compare your 1 card to their 1 card, and **Merge** them into a sorted pile of 2. Then a pile of 4, then a pile of 8, until the entire array is zipped back together seamlessly.\n\n### 🛠️ Execution Strategy\n1. **Base Case**: If the array has 1 or fewer elements, return it.\n2. **Split**: Find `mid = array.length / 2`. Split into `left_half` and `right_half`.\n3. **Recursive Call**: `MergeSort(left_half)` and `MergeSort(right_half)`.\n4. **Merge Hook**: Create two pointers on the returned halves. Compare `Left[i]` with `Right[j]`. Whichever is smaller gets pushed to the merged array. Once one side is empty, shove the rest of the other side in.",
          timeComplexity: "O(N log N)",
          spaceComplexity: "O(N)",
          implementations: [
             {
                language: "Python",
                code: "def mergeSort(arr):\n    if len(arr) <= 1: return arr\n    \n    mid = len(arr) // 2\n    left_half = mergeSort(arr[:mid])\n    right_half = mergeSort(arr[mid:])\n    \n    return merge(left_half, right_half)\n    \ndef merge(left, right):\n    sorted_arr = []\n    i, j = 0, 0\n    \n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            sorted_arr.append(left[i])\n            i += 1\n        else:\n            sorted_arr.append(right[j])\n            j += 1\n            \n    sorted_arr.extend(left[i:])\n    sorted_arr.extend(right[j:])\n    return sorted_arr"
             },
             {
                language: "JavaScript",
                code: "function mergeSort(arr) {\n    if (arr.length <= 1) return arr;\n    \n    let mid = Math.floor(arr.length / 2);\n    let leftHalf = mergeSort(arr.slice(0, mid));\n    let rightHalf = mergeSort(arr.slice(mid));\n    \n    return merge(leftHalf, rightHalf);\n}\n\nfunction merge(left, right) {\n    let sortedArr = [];\n    let i = 0, j = 0;\n    \n    while (i < left.length && j < right.length) {\n        if (left[i] <= right[j]) sortedArr.push(left[i++]);\n        else sortedArr.push(right[j++]);\n    }\n    \n    return [...sortedArr, ...left.slice(i), ...right.slice(j)];\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public int[] sortArray(int[] nums) {\n        mergeSort(nums, 0, nums.length - 1);\n        return nums;\n    }\n    \n    private void mergeSort(int[] arr, int left, int right) {\n        if (left >= right) return;\n        int mid = left + (right - left) / 2;\n        \n        mergeSort(arr, left, mid);\n        mergeSort(arr, mid + 1, right);\n        merge(arr, left, mid, right);\n    }\n    \n    private void merge(int[] arr, int left, int mid, int right) {\n        int[] temp = new int[right - left + 1];\n        int i = left, j = mid + 1, k = 0;\n        \n        while (i <= mid && j <= right) {\n            if (arr[i] <= arr[j]) temp[k++] = arr[i++];\n            else temp[k++] = arr[j++];\n        }\n        \n        while (i <= mid) temp[k++] = arr[i++];\n        while (j <= right) temp[k++] = arr[j++];\n        \n        for (i = left; i <= right; i++) arr[i] = temp[i - left];\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    vector<int> sortArray(vector<int>& nums) {\n        mergeSort(nums, 0, nums.size() - 1);\n        return nums;\n    }\n    \n    void mergeSort(vector<int>& arr, int left, int right) {\n        if (left >= right) return;\n        int mid = left + (right - left) / 2;\n        \n        mergeSort(arr, left, mid);\n        mergeSort(arr, mid + 1, right);\n        merge(arr, left, mid, right);\n    }\n    \n    void merge(vector<int>& arr, int left, int mid, int right) {\n        vector<int> temp;\n        int i = left, j = mid + 1;\n        \n        while (i <= mid && j <= right) {\n            if (arr[i] <= arr[j]) temp.push_back(arr[i++]);\n            else temp.push_back(arr[j++]);\n        }\n        \n        while (i <= mid) temp.push_back(arr[i++]);\n        while (j <= right) temp.push_back(arr[j++]);\n        \n        for (int k = 0; k < temp.size(); k++) arr[left + k] = temp[k];\n    }\n};"
             }
          ]
       }
    ]
  }
];
