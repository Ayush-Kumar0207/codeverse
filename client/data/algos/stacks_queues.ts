import { AlgorithmEntry } from "./types";

export const stackQueueAlgorithms: AlgorithmEntry[] = [
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    topic: "Stacks - String Patterns",
    category: "Stacks & Queues",
    frequencyLevel: "Highest",
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
  }
];
