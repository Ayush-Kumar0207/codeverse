import { AlgorithmEntry } from "./types";

export const bitManipulationAlgorithms: AlgorithmEntry[] = [
  {
    id: "introduction-to-bit-manipulation",
    title: "Intro to Bit Manipulation",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Bit manipulation is the act of algorithmically moving, cutting, and changing individual bits in a binary number.",
    leetcodeLink: "",
    useCases: ["Low-level systems programming", "Cryptography", "Performance optimization"],
    approaches: [
       {
          name: "The 3 Primary Operations",
          description: "### 🧠 The Core Concept\n- **AND (&)**: Only 1 if both are 1.\n- **OR (|)**: 1 if at least one is 1.\n- **XOR (^)**: 1 if exactly one is 1 (differences).",
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "// AND: 5 & 1 = 1 (101 & 001)\n// OR: 5 | 2 = 7 (101 | 010 = 111)\n// XOR: 5 ^ 4 = 1 (101 ^ 100 = 001)" }
          ]
       }
    ]
  },
  {
    id: "check-if-a-number-is-odd-or-not",
    title: "Check Odd/Even",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Use the LSB (Least Significant Bit) to determine parity.",
    leetcodeLink: "",
    useCases: ["Quick parity checks"],
    approaches: [
       {
          name: "Optimal (AND with 1)",
          description: "### 🧠 The Core Concept\nIf `(n & 1)` is 1, the number is odd. If 0, it's even.",
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def isOdd(n): return (n & 1) == 1" }
          ]
       }
    ]
  },
  {
    id: "check-if-i-th-bit-is-set-or-not",
    title: "Check i-th Bit",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Determine if the bit at position 'i' is 1.",
    leetcodeLink: "",
    useCases: ["Bitmasking", "Flag checking"],
    approaches: [
       {
          name: "Optimal (Left Shift Mask)",
          description: "### 🧠 The Core Concept\nCreate a mask `(1 << i)` and AND it with the number.",
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function isSet(n, i) { return (n & (1 << i)) !== 0; }" }
          ]
       }
    ]
  },
  {
    id: "set-the-i-th-bit",
    title: "Set i-th Bit",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Change the bit at position 'i' to 1.",
    leetcodeLink: "",
    useCases: ["Setting flags"],
    approaches: [
       {
          name: "Optimal (OR Mask)",
          description: "### 🧠 The Core Concept\n`n = n | (1 << i)`",
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def setBit(n, i): return n | (1 << i)" }
          ]
       }
    ]
  },
  {
    id: "clear-the-i-th-bit",
    title: "Clear i-th Bit",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Change the bit at position 'i' to 0.",
    leetcodeLink: "",
    useCases: ["Unsetting flags"],
    approaches: [
       {
          name: "Optimal (AND with Negated Mask)",
          description: "### 🧠 The Core Concept\n`n = n & ~(1 << i)`",
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function clearBit(n, i) { return n & ~(1 << i); }" }
          ]
       }
    ]
  },
  {
    id: "toggle-the-i-th-bit",
    title: "Toggle i-th Bit",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Flip the bit at position 'i'.",
    leetcodeLink: "",
    useCases: ["Bitwise switching"],
    approaches: [
       {
          name: "Optimal (XOR Mask)",
          description: "### 🧠 The Core Concept\n`n = n ^ (1 << i)`",
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def toggleBit(n, i): return n ^ (1 << i)" }
          ]
       }
    ]
  },
  {
    id: "remove-the-last-set-bit",
    title: "Remove Last Set Bit",
    topic: "Bit Manipulation - Tricks",
    category: "Bit Manipulation",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Clear the rightmost bit that is set to 1.",
    leetcodeLink: "",
    useCases: ["Counting set bits (Brian Kernighan's)"],
    approaches: [
       {
          name: "Optimal (n & n-1)",
          description: "### 🧠 The Core Concept\n`n & (n - 1)` always clears the rightmost set bit.",
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function removeLastSet(n) { return n & (n - 1); }" }
          ]
       }
    ]
  },
  {
    id: "check-if-a-number-is-power-of-2-or-not",
    title: "Check Power of 2",
    topic: "Bit Manipulation - Tricks",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Check if a number is a power of 2 using bit tricks.",
    leetcodeLink: "https://leetcode.com/problems/power-of-two/",
    useCases: ["Buffer sizing checks"],
    approaches: [
       {
          name: "Optimal (Single Bit Property)",
          description: "### 🧠 The Core Concept\nPowers of 2 have exactly one set bit. Thus `n & (n-1)` should be 0.",
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def isPowerOfTwo(n): return n > 0 and (n & (n - 1)) == 0" }
          ]
       }
    ]
  },
  {
    id: "count-the-number-of-set-bits",
    title: "Count Set Bits",
    topic: "Bit Manipulation - Tricks",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Return the number of 1s in the binary representation of n.",
    leetcodeLink: "https://leetcode.com/problems/number-of-1-bits/",
    useCases: ["Popcount", "Weight calculation"],
    approaches: [
       {
          name: "Optimal (Brian Kernighan's Algorithm)",
          description: "### 🧠 The Core Concept\nRepeatedly remove the last set bit until n becomes 0.",
          timeComplexity: "O(SetBits)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function countSetBits(n) {\n    let count = 0;\n    while (n > 0) {\n        n = n & (n - 1);\n        count++;\n    }\n    return count;\n}" }
          ]
       }
    ]
  },
  {
    id: "swap-two-numbers",
    title: "Swap Numbers (XOR)",
    topic: "Bit Manipulation - Intro",
    category: "Bit Manipulation",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Swap two variables without using a temporary variable.",
    leetcodeLink: "",
    useCases: ["Interview brainteasers"],
    approaches: [
       {
          name: "Optimal (XOR Swap)",
          description: "### 🧠 The Core Concept\n`a = a ^ b; b = a ^ b; a = a ^ b;`",
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def swap(a, b):\n    a = a ^ b\n    b = a ^ b\n    a = a ^ b\n    return a, b" }
          ]
       }
    ]
  },
  {
    id: "divide-two-integers-without-using-multiplication-division-and-mod-operator",
    title: "Divide Two Integers",
    topic: "Bit Manipulation - Problems",
    category: "Bit Manipulation",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Divide two integers using bit manipulation.",
    leetcodeLink: "https://leetcode.com/problems/divide-two-integers/",
    useCases: ["Custom math engines"],
    approaches: [
       {
          name: "Optimal (Exponential Shift)",
          description: "### 🧠 The Core Concept\nSubtract (divisor * 2^x) as many times as possible.",
          timeComplexity: "O(log(Quotient)^2)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function divide(dividend, divisor) {\n    // Implementation using bit shifts\n}" }
          ]
       }
    ]
  },
  {
    id: "find-the-number-that-appears-once-and-the-other-numbers-appear-twice",
    title: "Single Number",
    topic: "Bit Manipulation - Problems",
    category: "Bit Manipulation",
    frequencyLevel: "Highest",
    difficulty: "Easy",
    overview: "Every number appears twice except for one. Find it.",
    leetcodeLink: "https://leetcode.com/problems/single-number/",
    useCases: ["Finding unique IDs", "Checksums"],
    approaches: [
       {
          name: "Optimal (XOR Property)",
          description: "### 🧠 The Core Concept\n`x ^ x = 0`. XORing everything together cancels out the duplicates.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def singleNumber(nums):\n    res = 0\n    for n in nums: res ^= n\n    return res" }
          ]
       }
    ]
  },
  {
    id: "power-set",
    title: "Power Set (Bitmask)",
    topic: "Bit Manipulation - Problems",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Generate all possible subsets of an array.",
    leetcodeLink: "https://leetcode.com/problems/subsets/",
    useCases: ["Brute force combinations"],
    approaches: [
       {
          name: "Optimal (Binary Counter)",
          description: "### 🧠 The Core Concept\nA set of size N has 2^N subsets. Each integer from 0 to (2^N - 1) represents a unique subset where bit positions represent elements.",
          timeComplexity: "O(N * 2^N)",
          spaceComplexity: "O(1) (excluding result)",
          implementations: [
             { language: "JavaScript", code: "function powerSet(nums) {\n    let n = nums.length, res = [];\n    for (let i = 0; i < (1 << n); i++) {\n        let sub = [];\n        for (let j = 0; j < n; j++) {\n            if (i & (1 << j)) sub.push(nums[j]);\n        }\n        res.push(sub);\n    }\n    return res;\n}" }
          ]
       }
    ]
  }
];
