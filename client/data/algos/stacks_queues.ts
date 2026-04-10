import { AlgorithmEntry } from "./types";

export const stackQueueAlgorithms: AlgorithmEntry[] = [
  {
    id: "next-greater-element",
    title: "Next Greater Element I",
    topic: "Stack and Queues - Monotonic",
    category: "Stacks & Queues",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "For every element in an array, find the first element strictly greater than it on the right side.",
    leetcodeLink: "https://leetcode.com/problems/next-greater-element-i/",
    useCases: ["Stock market peak predictions", "Daily temperatures calculation", "Visible building horizons"],
    approaches: [
       {
          name: "Optimal (Monotonic Decreasing Stack)",
          description: "### 🧠 The Core Concept\nImagine you are standing in a line of people, looking to your right. You want to know who is the absolutely closest person to you that is **taller than you**.\n\nNow imagine an absurdly tall person is standing at the end of the line. Anyone shorter than them, standing behind them, is completely hidden from your view forever! They become useless data.\n\n### 🛠️ Execution Strategy\nWe process the array **backwards** (from Right to Left), and we use a Stack to represent the \"visible heights\".\n\n1. Pop elements from the Stack if they are shorter than the current number. (Why? Because the current number is taller and closer to the remaining elements processing on the left, so it completely blocks those shorter elements!).\n2. Once all the shorter, blocked elements are popped, whatever is left on the top of the Stack is guaranteed to be the Next Greater Element! Record it.\n3. Finally, push the current number onto the Stack so it can potentially block the people behind it.\n\nBecause every element is pushed and popped exactly once across the entire loop, Time Complexity collapses from O(N²) to O(N)!",
          timeComplexity: "O(N)",
          spaceComplexity: "O(N)",
          implementations: [
             {
                language: "Python",
                code: "def nextGreaterElement(nums):\n    res = [-1] * len(nums)\n    stack = []\n    \n    for i in range(len(nums) - 1, -1, -1):\n        while stack and stack[-1] <= nums[i]:\n            stack.pop()  # Blocked line-of-sight!\n            \n        if stack:\n            res[i] = stack[-1]\n            \n        stack.append(nums[i])\n        \n    return res"
             },
             {
                language: "JavaScript",
                code: "function nextGreaterElement(nums) {\n    const res = new Array(nums.length).fill(-1);\n    const stack = [];\n    \n    for (let i = nums.length - 1; i >= 0; i--) {\n        while (stack.length > 0 && stack[stack.length - 1] <= nums[i]) {\n            stack.pop(); // Blocked by current taller number\n        }\n        \n        if (stack.length > 0) {\n            res[i] = stack[stack.length - 1];\n        }\n        \n        stack.push(nums[i]);\n    }\n    \n    return res;\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public int[] nextGreaterElement(int[] nums) {\n        int[] res = new int[nums.length];\n        Stack<Integer> stack = new Stack<>();\n        \n        for (int i = nums.length - 1; i >= 0; i--) {\n            while (!stack.isEmpty() && stack.peek() <= nums[i]) {\n                stack.pop();\n            }\n            \n            res[i] = stack.isEmpty() ? -1 : stack.peek();\n            stack.push(nums[i]);\n        }\n        \n        return res;\n    }\n}"
             },
             {
                language: "C++",
                code: "vector<int> nextGreaterElement(vector<int>& nums) {\n    vector<int> res(nums.size(), -1);\n    stack<int> st;\n    \n    for (int i = nums.size() - 1; i >= 0; i--) {\n        while (!st.empty() && st.top() <= nums[i]) {\n            st.pop();\n        }\n        \n        if (!st.empty()) {\n            res[i] = st.top();\n        }\n        \n        st.push(nums[i]);\n    }\n    \n    return res;\n}"
             }
          ]
       }
    ]
  }
];
