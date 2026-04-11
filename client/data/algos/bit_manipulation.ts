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
          name: "Optimal (The 'Binary Tail' Check)",
          description: "### 🧠 The Core Concept: The 'Last Bit' Analogy\nIn binary, every position represents a power of $2$ ($1, 2, 4, 8, ...$). Notice that ALL of these are even except for the very first one ($2^0 = 1$).\n\nTherefore, a number's 'even-ness' or 'odd-ness' depends entirely on that single last bit. If it's $1$, the number is odd. If $0$, it's even.\n\n### 🛠️ Execution Strategy\nUse the **AND (&)** operator with $1$. The number $1$ in binary is `...0001`. \n- `n & 1` masks out everything except the last bit.\n- If the result is `1`, the number is **Odd**.\n- If the result is `0`, the number is **Even**.",
          timeComplexity: "O(1)",
          timeComplexityExplanation: "Bitwise AND is a single CPU instruction.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "No additional memory used.",
          implementations: [
             {
                language: "Python",
                code: `def isOdd(n):
    return (n & 1) == 1

def isEven(n):
    return (n & 1) == 0`
             }
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
          name: "Optimal (Bit Shifting & Masking)",
          description: "### 🧠 The Core Concept: The 'Flashlight' Analogy\nImagine your number is a dark hallway and you want to see if there's a light (a `1`) at position `i`. You use a custom flashlight (a **Bitmask**) that ONLY shines on that specific spot.\n\n### 🛠️ Execution Strategy\n- **Check Bit**: Create a mask with a `1` at position `i` using `(1 << i)`. AND this with `n`. If result $\\neq 0$, the bit was `1`.\n- **Set Bit**: Use **OR (|)** with the mask. Since `1 | anything = 1`, it forces that bit to be `1`.\n- **Clear Bit**: Use **AND (&)** with a *reversed* mask `~(1 << i)`. This creates a mask of all `1`s EXCEPT at position `i`. This kills that specific bit.\n- **Toggle Bit**: Use **XOR (^)** with the mask. XOR flips bits ($1 \\rightarrow 0$, $0 \\rightarrow 1$).",
          timeComplexity: "O(1)",
          timeComplexityExplanation: "Each operation takes exactly one or two bitwise instructions.",
          spaceComplexity: "O(1)",
          implementations: [
             {
                language: "JavaScript",
                code: `const checkBit = (n, i) => (n & (1 << i)) !== 0;
const setBit = (n, i) => n | (1 << i);
const clearBit = (n, i) => n & ~(1 << i);
const toggleBit = (n, i) => n ^ (1 << i);`
             }
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
          name: "Optimal (Bitwise Exponential Search)",
          description: "### 🧠 The Core Concept: The 'Giant Steps' Strategy\nWe can't use `/` or `*`. One way is to subtract the divisor from the dividend over and over, but that is pathologically slow ($O(N)$).\n\nInstead, we take **Giant Steps** by bit-shifting the divisor. If $100 / 3$, we don't just subtract $3$. We subtract $3 \\times 2^x$ (like $3 \\times 32 = 96$). This allows us to cover the distance in logarithmic time.\n\n### 🛠️ Execution Strategy\n1. Handle the sign (result is negative if signs of dividend and divisor differ).\n2. Work with absolute values.\n3. **Loop**: For the current `dividend`, find the largest `x` such that `(divisor << x) <= dividend`.\n4. Subtract `(divisor << x)` from `dividend` and add `(1 << x)` to the quotient.\n5. Repeat until `dividend < divisor`.\n6. Handle 32-bit overflow cases.",
          timeComplexity: "O(log² N)",
          timeComplexityExplanation: "We effectively perform a binary search for the quotient segments.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Only constant extra space for variables.",
          implementations: [
             {
                language: "JavaScript",
                code: `function divide(dividend, divisor) {
    if (dividend === -2147483648 && divisor === -1) return 2147483647;
    
    let sign = (dividend > 0) === (divisor > 0) ? 1 : -1;
    let n = Math.abs(dividend);
    let d = Math.abs(divisor);
    let res = 0;
    
    while (n >= d) {
        let x = 0;
        // Find largest x s.t. d * 2^x <= n
        while (n >= (d << (x + 1)) && (d << (x + 1)) > 0) {
            x++;
        }
        res += (1 << x);
        n -= (d << x);
    }
    
    return sign * res;
}`
             }
          ]
       }
    ]

  },
  {
    id: "find-the-number-that-appears-once-and-the-other-numbers-appear-twice",
    title: "Single Number",
    topic: "Bit Manipulation - Problems",
    category: "Bit Manipulation",
    frequencyLevel: "Very High",
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
