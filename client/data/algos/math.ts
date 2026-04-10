import { AlgorithmEntry } from "./types";

export const mathAlgorithms: AlgorithmEntry[] = [
  {
    id: "check-palindrome-math",
    title: "Check Palindrome Number",
    topic: "Basic Basics - Basic Math",
    category: "Math",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Determine if an integer reads the same backwards as forwards, without converting it to a String.",
    leetcodeLink: "https://leetcode.com/problems/palindrome-number/",
    useCases: ["Numeric validations", "Symmetrical checks"],
    approaches: [
       {
          name: "Optimal (Half Reverse)",
          description: "### 🧠 The Core Concept\nYou might think, *\"I'll just convert it to a string and reverse it!\"* But what if you aren't allowed to use extra memory? What if it's an incredibly massive integer that would crash the string encoder?\n\nInstead, we can peel off numbers from the **back** of the integer, and build a new integer backwards!\n\n### 🛠️ Execution Strategy\nImagine the number `1221`.\n1. **Peel the Last Digit**: Using `1221 % 10`, we get `1`. We add it to our `Reversed` variable. Then we chop off the last digit from the original number: `1221 / 10 = 122`.\n2. **Shift and Stack**: On the next loop, `Reversed` is multiplied by 10 (shifting it left), and the new peeled digit is added. \n3. **When to stop?** We can actually stop exactly halfway! When the original number becomes smaller than the reversed number, we know we've crossed the middle! \nIf the halved numbers equal each other, it's a Palindrome!",
          timeComplexity: "O(log10(N))",
          spaceComplexity: "O(1)",
          implementations: [
             {
                language: "Python",
                code: "def isPalindrome(x: int) -> bool:\n    if x < 0 or (x % 10 == 0 and x != 0): return False\n    revertedNumber = 0\n    while x > revertedNumber:\n        revertedNumber = revertedNumber * 10 + x % 10\n        x //= 10\n    return x == revertedNumber or x == revertedNumber // 10"
             },
             {
                language: "JavaScript",
                code: "function isPalindrome(x) {\n    if (x < 0 || (x % 10 === 0 && x !== 0)) return false;\n    let revertedNumber = 0;\n    while (x > revertedNumber) {\n        revertedNumber = revertedNumber * 10 + x % 10;\n        x = Math.floor(x / 10);\n    }\n    return x === revertedNumber || x === Math.floor(revertedNumber / 10);\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public boolean isPalindrome(int x) {\n        if (x < 0 || (x % 10 == 0 && x != 0)) return false;\n        int revertedNumber = 0;\n        while (x > revertedNumber) {\n            revertedNumber = revertedNumber * 10 + x % 10;\n            x /= 10;\n        }\n        return x == revertedNumber || x == revertedNumber / 10;\n    }\n}"
             },
             {
                language: "C++",
                code: "bool isPalindrome(int x) {\n    if (x < 0 || (x % 10 == 0 && x != 0)) return false;\n    int revertedNumber = 0;\n    while (x > revertedNumber) {\n        revertedNumber = revertedNumber * 10 + x % 10;\n        x /= 10;\n    }\n    return x == revertedNumber || x == revertedNumber / 10;\n}"
             }
          ]
       }
    ]
  }
];
