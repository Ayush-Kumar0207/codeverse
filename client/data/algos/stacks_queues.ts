import { AlgorithmEntry } from "./types";

export const stackQueueAlgorithms: AlgorithmEntry[] = [
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    topic: "Stacks - String Patterns",
    category: "Stacks & Queues",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    leetcodeLink: "https://leetcode.com/problems/valid-parentheses/",
    useCases: ["Compiler syntax checking", "Markdown/HTML parser validation", "Balanced expression evaluation"],
    approaches: [
       {
          name: "Optimal (Stack Matching)",
          description: "### 🧠 The Core Concept\nImagine you are reading a book with nested parentheses. Every time you see an **Opening** symbol `(`, you must 'wait' for its partner `)`. \n\nA Stack is perfect for this because it follows **Last-In, First-Out (LIFO)**. The *last* bracket we opened is the *first* one that must be closed.\n\n### 🛠️ Execution Strategy\n1. Iterate through the string character by character.\n2. **Opening Bracket?**: If it's a `(`, `[` or `{`, push it onto the Stack.\n3. **Closing Bracket?**: If it's a `)`, `]` or `}`:\n   - Check if the Stack is empty. (If it's empty, we have a closing bracket with no opener! Return `false`).\n   - Pop the top element from the Stack.\n   - If the popped opener doesn't match the current closer (e.g., `(` and `]`), it's an invalid nesting! Return `false`.\n4. **Final Check**: After the loop, the Stack should be empty. If there's anything left, it means some brackets were never closed. Return `true` if empty, else `false`.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We process every character in the string exactly once.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "In the worst case (e.g., `((((((`), we push every single character into the Stack.",
          implementations: [
             {
                language: "Python",
                code: "def isValid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top: return False\n        else:\n            stack.append(char)\n    return not stack"
             },
             {
                language: "JavaScript",
                code: "function isValid(s) {\n    const stack = [];\n    const mapping = { ')': '(', '}': '{', ']': '[' };\n    for (let char of s) {\n        if (mapping[char]) {\n            const top = stack.length > 0 ? stack.pop() : '#';\n            if (mapping[char] !== top) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}"
             },
             {
                language: "Java",
                code: "public boolean isValid(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(' || c == '{' || c == '[') stack.push(c);\n        else {\n            if (stack.isEmpty()) return false;\n            char top = stack.pop();\n            if (c == ')' && top != '(') return false;\n            if (c == '}' && top != '{') return false;\n            if (c == ']' && top != '[') return false;\n        }\n    }\n    return stack.isEmpty();\n}"
             },
             {
                language: "C++",
                code: "bool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) return false;\n            if (c == ')' && st.top() != '(') return false;\n            if (c == '}' && st.top() != '{') return false;\n            if (c == ']' && st.top() != '[') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}"
             }
          ]
       }
    ]
  },
  {
    id: "min-stack",
    title: "Min Stack Design",
    topic: "Stacks - Data Structure Design",
    category: "Stacks & Queues",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
    leetcodeLink: "https://leetcode.com/problems/min-stack/",
    useCases: ["Tracking all-time-highs in streaming data", "Undo operations with state management", "Heuristic pruning in search algorithms"],
    approaches: [
       {
          name: "Optimal (Two Stacks Strategy)",
          description: "### 🧠 The Core Concept\nIf you have a normal Stack, finding the 'minimum' requires looking at every single element, which takes $O(N)$. We want it to be $O(1)$.\n\nTo achieve this, we keep a **Second Stack** (the Min-Stack) that stores the 'minimum value seen so far' at every step.\n\n### 🛠️ Execution Strategy\n1. **Push**: \n   - Push the value to the `mainStack`.\n   - Look at the top of `minStack`. If the new value is $\le$ current min, push it onto `minStack` too.\n2. **Pop**: \n   - Peek at the `mainStack` top. If it's the current minimum (equal to `minStack.top()`), pop from `minStack` as well.\n   - Pop from `mainStack`.\n3. **GetMin**: \n   - Simply return `minStack.top()`. This is guaranteed to be the minimum since we kept it perfectly synced during push/pop operations.",
          timeComplexity: "O(1)",
          timeComplexityExplanation: "All operations (push, pop, top, getMin) are direct index/pointer manipulations.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "We use twice the memory (two stacks), but still linearly proportional to the number of elements.",
          implementations: [
             {
                language: "Python",
                code: "class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)\n\n    def pop(self) -> None:\n        if self.stack.pop() == self.min_stack[-1]:\n            self.min_stack.pop()\n\n    def getMin(self) -> int:\n        return self.min_stack[-1]"
             },
             {
                language: "JavaScript",
                code: "class MinStack {\n    constructor() {\n        this.stack = [];\n        this.minStack = [];\n    }\n    push(val) {\n        this.stack.push(val);\n        if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {\n            this.minStack.push(val);\n        }\n    }\n    pop() {\n        const val = this.stack.pop();\n        if (val === this.minStack[this.minStack.length - 1]) {\n            this.minStack.pop();\n        }\n    }\n    getMin() {\n        return this.minStack[this.minStack.length - 1];\n    }\n}"
             },
             {
                language: "Java",
                code: "class MinStack {\n    private Stack<Integer> stack = new Stack<>();\n    private Stack<Integer> minStack = new Stack<>();\n    \n    public void push(int val) {\n        stack.push(val);\n        if (minStack.isEmpty() || val <= minStack.peek()) minStack.push(val);\n    }\n    \n    public void pop() {\n        if (stack.pop().equals(minStack.peek())) minStack.pop();\n    }\n    \n    public int getMin() {\n        return minStack.peek();\n    }\n}"
             },
             {
                language: "C++",
                code: "class MinStack {\n    stack<int> s, ms;\npublic:\n    void push(int val) {\n        s.push(val);\n        if (ms.empty() || val <= ms.top()) ms.push(val);\n    }\n    void pop() {\n        if (s.top() == ms.top()) ms.pop();\n        s.pop();\n    }\n    int getMin() { return ms.top(); }\n};"
             }
          ]
       }
    ]
  },
  {
    id: "implement-queue-using-stacks",
    title: "Implement Queue using Stacks",
    topic: "Stacks & Queues - Design",
    category: "Stacks & Queues",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Implement a first in first out (FIFO) queue using only two stacks.",
    leetcodeLink: "https://leetcode.com/problems/implement-queue-using-stacks/",
    useCases: ["Simulating asynchronous tasks", "Message passing systems in older architectures", "Interview behavioral logic testing"],
    approaches: [
       {
          name: "Optimal (Amortized Cost Transfer)",
          description: "### 🧠 The Core Concept\nA Stack is a 'Tube' (First-In, Last-Out). A Queue is a 'Pipe' (First-In, First-Out). \nIf you have two stacks, you can pour the contents of the first tube into the second. Because the second tube is filled 'upside down', its top now represents the *first* item pushed into the original tube! \n\n### 🛠️ Execution Strategy\n1. **`pushStack`**: Used for all incoming items.\n2. **`popStack`**: Used for all outgoing items.\n3. **The Pouring Logic**: When a `pop` or `peek` is requested, check the `popStack`.\n   - If `popStack` is empty, pour **everything** from `pushStack` into it.\n   - Now, the top of `popStack` is the absolute head of the queue.\n4. **Amortized Analysis**: While one 'pour' takes $O(N)$, it happens very rarely. Every item is pushed exactly once and popped exactly once. The *average* cost per operation stays $O(1)$.",
          timeComplexity: "O(1) Amortized",
          timeComplexityExplanation: "Most operations are direct stack access. The transfer only happens when the output stack is exhausted.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Total space used by two stacks is equal to the number of elements in the queue.",
          implementations: [
             {
                language: "Python",
                code: "class MyQueue:\n    def __init__(self):\n        self.s1 = []\n        self.s2 = []\n\n    def push(self, x: int) -> None:\n        self.s1.append(x)\n\n    def pop(self) -> int:\n        self.peek()\n        return self.s2.pop()\n\n    def peek(self) -> int:\n        if not self.s2:\n            while self.s1:\n                self.s2.append(self.s1.pop())\n        return self.s2[-1]\n\n    def empty(self) -> bool:\n        return not self.s1 and not self.s2"
             },
             {
                language: "JavaScript",
                code: "class MyQueue {\n    constructor() {\n        this.s1 = [];\n        this.s2 = [];\n    }\n    push(x) {\n        this.s1.push(x);\n    }\n    pop() {\n        this.peek();\n        return this.s2.pop();\n    }\n    peek() {\n        if (this.s2.length === 0) {\n            while (this.s1.length > 0) {\n                this.s2.push(this.s1.pop());\n            }\n        }\n        return this.s2[this.s2.length - 1];\n    }\n    empty() {\n        return this.s1.length === 0 && this.s2.length === 0;\n    }\n}"
             },
             {
                language: "Java",
                code: "class MyQueue {\n    Stack<Integer> s1 = new Stack<>();\n    Stack<Integer> s2 = new Stack<>();\n    \n    public void push(int x) { s1.push(x); }\n    \n    public int pop() {\n        peek();\n        return s2.pop();\n    }\n    \n    public int peek() {\n        if (s2.isEmpty()) {\n            while (!s1.isEmpty()) s2.push(s1.pop());\n        }\n        return s2.peek();\n    }\n    \n    public boolean empty() { return s1.isEmpty() && s2.isEmpty(); }\n}"
             },
             {
                language: "C++",
                code: "class MyQueue {\n    stack<int> s1, s2;\npublic:\n    void push(int x) { s1.push(x); }\n    \n    int pop() {\n        peek();\n        int val = s2.top();\n        s2.pop();\n        return val;\n    }\n    \n    int peek() {\n        if (s2.empty()) {\n            while (!s1.empty()) {\n                s2.push(s1.top());\n                s1.pop();\n            }\n        }\n        return s2.top();\n    }\n    \n    bool empty() { return s1.empty() && s2.empty(); }\n};"
             }
          ]
       }
    ]
  },
  {
    id: "next-greater-element-i",
    title: "Next Greater Element",
    topic: "Stacks - Monotonic",
    category: "Stacks & Queues",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "For each element in an array, find the next element to its right that is strictly greater than it.",
    leetcodeLink: "https://leetcode.com/problems/next-greater-element-i/",
    useCases: ["Weather forecasting (next hotter day)", "Stock market breakout detection"],
    approaches: [
       {
          name: "Optimal (Monotonic Stack)",
          description: "### 🧠 The Core Concept\nImagine you are standing in a line. You want to know who the first person to your right is who is taller than you. \n\nWe use a **Monotonic Stack** (a stack that is always sorted). We process the array from **Right to Left**.\n\n### 🛠️ Execution Strategy\n1. Iterate from end to start.\n2. **The Purge**: While the stack is not empty and the top of the stack is $\le$ current element, pop the stack. (Those people are shorter than you, so they can't be your 'next greater', and they'll never be the 'next greater' for anyone to your left either!).\n3. **The Result**: If the stack is empty, there is no greater element (-1). Otherwise, the top of the stack is your answer.\n4. **The Update**: Push yourself onto the stack.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Each element is pushed and popped exactly once.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Storage for the monotonic stack.",
          implementations: [
             {
                language: "Python",
                code: "def nextGreaterElement(arr):\n    n = len(arr)\n    res = [-1] * n\n    stack = []\n    for i in range(n-1, -1, -1):\n        while stack and stack[-1] <= arr[i]:\n            stack.pop()\n        if stack: res[i] = stack[-1]\n        stack.append(arr[i])\n    return res"
             }
          ]
       }
    ]
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    topic: "Stacks & Queues - Hard",
    category: "Hard Pointers/Stacks",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    leetcodeLink: "https://leetcode.com/problems/trapping-rain-water/",
    useCases: ["Terrain analysis", "Fluid dynamics simulations"],
    approaches: [
       {
          name: "Optimal (Two Pointers)",
          description: "### 🧠 The Core Concept\nWater trapped at any position matches: `min(maxLeft, maxRight) - currentHeight`. \n\nInstead of calculating `maxLeft` and `maxRight` arrays, we use two pointers. If `leftMax < rightMax`, the bottleneck is on the left, so we process the left pointer. Otherwise, we process the right.\n\n### 🛠️ Execution Strategy\n1. `left = 0, right = n-1`.\n2. Keep track of `leftMax` and `rightMax` seen so far.\n3. While `left < right`:\n   - Move the pointer with the smaller 'max'.\n   - Add `currentMax - height` to the result.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Single pass from both ends.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Only pointers and max variables used.",
          implementations: [
             {
                language: "JavaScript",
                code: "function trap(height) {\n    let left = 0, right = height.length - 1;\n    let leftMax = 0, rightMax = 0, res = 0;\n    while (left < right) {\n        if (height[left] < height[right]) {\n            if (height[left] >= leftMax) leftMax = height[left];\n            else res += leftMax - height[left];\n            left++;\n        } else {\n            if (height[right] >= rightMax) rightMax = height[right];\n            else res += rightMax - height[right];\n            right--;\n        }\n    }\n    return res;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    topic: "Stacks - Hard",
    category: "Stacks & Queues",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Find the area of the largest rectangle in a histogram.",
    leetcodeLink: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    useCases: ["Image processing (largest solid color block)", "Financial peak analysis"],
    approaches: [
       {
          name: "Optimal (Monotonic Stack)",
          description: "### 🧠 The Core Concept\nFor every bar in the histogram, we want to know how far it can extend to the left and right without hitting a shorter bar. \n\nWe use a stack to store indices of bars in **increasing order** of height. When we see a shorter bar, it 'limits' the bars in the stack, and we calculate their areas.\n\n### 🛠️ Execution Strategy\n1. Maintain a stack of indices.\n2. If current height < stack top height:\n   - Pop the top and treat it as the 'height' of a potential rectangle.\n   - The 'width' is the distance between the current index and the new stack top.\n3. Add a sentinel '0' at the end to force the stack to clear.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Each index is pushed and popped exactly once.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Stack storage.",
          implementations: [
             {
                language: "Python",
                code: "def largestRectangleArea(heights):\n    heights.append(0)\n    stack = [-1]\n    max_area = 0\n    for i in range(len(heights)):\n        while heights[i] < heights[stack[-1]]:\n            h = heights[stack.pop()]\n            w = i - stack[-1] - 1\n            max_area = max(max_area, h * w)\n        stack.append(i)\n    return max_area"
             }
          ]
       }
    ]
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    topic: "Stacks & Queues - Design",
    category: "Data Structure Design",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    leetcodeLink: "https://leetcode.com/problems/lru-cache/",
    useCases: ["Browser history", "Database buffer pools", "Redis cache eviction"],
    approaches: [
       {
          name: "Optimal (Hash Map + Doubly Linked List)",
          description: "### 🧠 The Core Concept: The 'Desk Organizer' Analogy\nImagine you have a small desk (Cache) that can only hold $K$ files. You want to keep the files you use most often close at hand. \n\nTo do this perfectly, you need two things:\n1. **A Map (The Index)**: So you can instantly find a file by its name ($O(1)$ lookup).\n2. **A Doubly Linked List (The Pile)**: A physical stack of files where you always put the most recently used file on TOP. When the desk is full, you throw away the file at the BOTTOM.\n\n### 🛠️ Step-by-Step Logic\n1. **`get(key)`**: Look up the node in the Map.\n   - If not found, return -1.\n   - If found, **Move to Head**: Remove the node from its current spot in the list and re-insert it at the very front.\n2. **`put(key, value)`**: \n   - If the key exists, update the value and **Move to Head**.\n   - If the key is new:\n     - If the cache is full, delete the **Tail** node from both the List and the Map.\n     - Add the new node to the **Head** and register it in the Map.",
          timeComplexity: "O(1)",
          timeComplexityExplanation: "Both hash map lookups and doubly linked list pointer updates are $O(1)$ operations.",
          spaceComplexity: "O(Capacity)",
          spaceComplexityExplanation: "We store at most `capacity` entries in both the map and the list.",
          implementations: [
             {
                language: "Python",
                code: `class Node:
    def __init__(self, key, val):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {} # Map key -> Node
        self.head, self.tail = Node(0, 0), Node(0, 0)
        self.head.next, self.tail.prev = self.tail, self.head

    def _remove(self, node):
        p, n = node.prev, node.next
        p.next, n.prev = n, p

    def _add(self, node):
        p, n = self.head, self.head.next
        p.next = n.prev = node
        node.prev, node.next = p, n

    def get(self, key: int) -> int:
        if key in self.cache:
            self._remove(self.cache[key])
            self._add(self.cache[key])
            return self.cache[key].val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        self.cache[key] = Node(key, value)
        self._add(self.cache[key])
        if len(self.cache) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]`
             }
          ]
       }
    ]
  },
  {
    id: "lfu-cache",
    title: "LFU Cache",
    topic: "Stacks & Queues - Design",
    category: "Data Structure Design",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview: "Least Frequently Used (LFU) cache design.",
    leetcodeLink: "https://leetcode.com/problems/lfu-cache/",
    useCases: ["Advanced caching where frequency matters more than recency"],
    approaches: [
       {
          name: "Optimal (Frequency Map + Multiple DLLs)",
          description: "### 🧠 The Core Concept: The 'Popularity Contest' Strategy\nLFU is like LRU but with an extra layer: **Frequency**. \n\nInstead of one single pile of files, we have multiple piles: \"The 1-Visit Pile\", \"The 2-Visit Pile\", etc. \nInside each pile, the files are ordered by recency (LRU).\n\nWhen you access a file, you 'promote' it. You move it from its current frequency pile to the next pile up (e.g., from freq 2 to freq 3).\n\n### 🛠️ Execution Strategy\n1. **Maps**: \n   - `vals`: `key -> [value, frequency]`\n   - `counts`: `frequency -> DoublyLinkedList(keys)`\n2. **Min Freq Tracker**: A pointer to the lowest non-empty frequency.\n3. **Promotion Logic**: When `get(key)` is called, move the key from `counts[f]` to `counts[f+1]`. If `counts[minFreq]` becomes empty, increment `minFreq`.\n4. **Eviction Logic**: Remove the **Tail** (LRU) of the `counts[minFreq]` list.",
          timeComplexity: "O(1)",
          timeComplexityExplanation: "All operations involving hash maps and DLL nodes are constant time.",
          spaceComplexity: "O(Capacity)",
          spaceComplexityExplanation: "Space scales linearly with cache size.",
          implementations: [
             {
                language: "Python",
                code: `from collections import defaultdict, OrderedDict

class LFUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.values = {} # key -> [val, freq]
        self.freq_map = defaultdict(OrderedDict) # freq -> {key: None}
        self.min_freq = 0

    def get(self, key: int) -> int:
        if key not in self.values:
            return -1
        val, freq = self.values[key]
        self._update(key, val, freq)
        return val

    def _update(self, key, val, freq):
        self.freq_map[freq].pop(key)
        if not self.freq_map[freq] and freq == self.min_freq:
            self.min_freq += 1
        self.values[key] = [val, freq + 1]
        self.freq_map[freq + 1][key] = None

    def put(self, key: int, value: int) -> None:
        if self.cap <= 0: return
        if key in self.values:
            self._update(key, value, self.values[key][1])
            return
        if len(self.values) == self.cap:
            k, _ = self.freq_map[self.min_freq].popitem(last=False)
            del self.values[k]
        self.values[key] = [value, 1]
        self.freq_map[1][key] = None
        self.min_freq = 1`
             }
          ]
       }
    ]

  },
  {
    id: "sliding-window-maximum",
    title: "Sliding Window Maximum",
    topic: "Stacks & Queues - Advanced",
    category: "Monotonic Queue",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Find the maximum for each sliding window of size k.",
    leetcodeLink: "https://leetcode.com/problems/sliding-window-maximum/",
    useCases: ["Real-time peak monitoring", "Network throughput analysis"],
    approaches: [
       {
          name: "Optimal (The 'Monotonic Deque' Strategy)",
          description: "### 🧠 The Core Concept: The 'King of the Hill' Analogy\nImagine you are monitoring a moving line of competitors. You only care about the absolute strongest (the maximum).\n\nAs the window slides:\n1. **New Arrival**: If a new person arrives who is stronger than the people already in your 'top-tier list', those weaker people will NEVER be the champion again (they will expire before the new person does). So, you **purge** them from the list.\n2. **Expiration**: If the current champion's time is up (their index is out of the window), remove them.\n\n### 🛠️ Step-by-Step Logic\n1. Use a **Deque** to store indices, maintaining them such that the corresponding values are in **strictly decreasing** order.\n2. For each new element $X$:\n   - **Purge Tail**: While deque top value $\le X$, pop from back.\n   - **Purge Head**: If deque front index is outside the window $(i - k)$, pop from front.\n   - **Record**: The front of the deque is always your window's current maximum.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Each element is added to and removed from the deque exactly once.",
          spaceComplexity: "O(K)",
          spaceComplexityExplanation: "The deque stores at most $K$ indices for a window of size $K$.",
          implementations: [
             {
                language: "JavaScript",
                code: `function maxSlidingWindow(nums, k) {
    const q = []; // Deque of indices
    const res = [];
    
    for (let i = 0; i < nums.length; i++) {
        // 1. Maintain monotonic property: remove smaller elements
        while (q.length && nums[q[q.length - 1]] <= nums[i]) {
            q.pop();
        }
        
        q.push(i);
        
        // 2. Remove element out of window
        if (q[0] === i - k) {
            q.shift();
        }
        
        // 3. Current window max is always at the front
        if (i >= k - 1) {
            res.push(nums[q[0]]);
        }
    }
    return res;
}`
             }
          ]
       }
    ]

  }
];
