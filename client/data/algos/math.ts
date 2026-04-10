import { AlgorithmEntry } from "./types";

export const mathAlgorithms: AlgorithmEntry[] = [
  {
    id: "palindrome-number",
    title: "Palindrome Number",
    topic: "Mathematics",
    category: "Math Hacks",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.",
    leetcodeLink: "https://leetcode.com/problems/palindrome-number/",
    useCases: ["Data validation checks", "Numeric symmetry algorithms", "Bit manipulation practice"],
    approaches: [
       {
          name: "Optimal (Reverse Half)",
          description: "### 🧠 The Core Concept\nHow do we check if `12321` is a palindrome without turning it into a string? Strings are expensive! \nInstead, we mathematically 'peel' numbers off the end of the input and build a reversed number.\n\nBut wait—if we reverse the entire number, we might encounter an **Overflow** if the number is massive. So we only reverse **HALF** of the number. If `12321` becomes `12` and a reversed `12` (with the `3` in the middle), we have a match!\n\n### 🛠️ Execution Strategy\n1. **Negative Check**: Negative numbers (like `-121`) are mathematically NEVER palindromes (due to the `-` sign).\n2. **Zero Check**: Numbers ending in 0 (like `10`) aren't palindromes unless the number is `0` itself.\n3. **Reverse the Tail**: \n   - While the `original` number is greater than the `reversed` number:\n   - `reversed = (reversed * 10) + (original % 10)`\n   - `original = Math.floor(original / 10)`\n4. **Comparison**: Check if the two numbers are equal, or if `original === Math.floor(reversed / 10)` (handles odd-length numbers like `121`).",
          timeComplexity: "O(log₁₀ N)",
          timeComplexityExplanation: "We divide the number by 10 at every iteration. Since the number of digits in N is exactly $\\log_{10}(N)$, the complexity is logarithmic.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We strictly only use two native integer variables regardless of how large the number scales.",
          implementations: [
             {
                language: "Python",
                code: "def isPalindrome(x: int) -> bool:\n    if x < 0 or (x % 10 == 0 and x != 0):\n        return False\n    \n    rev = 0\n    while x > rev:\n        rev = rev * 10 + x % 10\n        x //= 10\n        \n    return x == rev or x == rev // 10"
             },
             {
                language: "JavaScript",
                code: "function isPalindrome(x) {\n    if (x < 0 || (x % 10 === 0 && x !== 0)) return false;\n    \n    let rev = 0;\n    while (x > rev) {\n        rev = (rev * 10) + (x % 10);\n        x = Math.floor(x / 10);\n    }\n    \n    return x === rev || x === Math.floor(rev / 10);\n}"
             },
             {
                language: "Java",
                code: "public boolean isPalindrome(int x) {\n    if (x < 0 || (x % 10 == 0 && x != 0)) return false;\n    int rev = 0;\n    while (x > rev) {\n        rev = (rev * 10) + (x % 10);\n        x /= 10;\n    }\n    return x == rev || x == rev / 10;\n}"
             },
             {
                language: "C++",
                code: "bool isPalindrome(int x) {\n    if (x < 0 || (x % 10 == 0 && x != 0)) return false;\n    int rev = 0;\n    while (x > rev) {\n        rev = (rev * 10) + (x % 10);\n        x /= 10;\n    }\n    return x == rev || x == rev / 10;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "sieve-of-eratosthenes",
    title: "Sieve of Eratosthenes",
    topic: "Mathematics",
    category: "Math Hacks",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "An ancient algorithm for finding all prime numbers up to any given limit.",
    leetcodeLink: "https://leetcode.com/problems/count-primes/",
    useCases: ["Cryptography key generation", "Prime factor discovery", "Mathematical modeling"],
    approaches: [
       {
          name: "Optimal (Sieve Marking)",
          description: "### 🧠 The Core Concept\nTo find all primes up to 100, you don't check 'is 1 prime? is 2 prime?' for every number. \nInstead, you start with 2 (the first prime) and **strike out** all multiples of 2 ($4, 6, 8, ...$) because you know they aren't prime. Then you move to 3 and strike out all its multiples ($9, 12, ...$). \n\nWhatever numbers remain 'un-struck' at the end are guaranteed to be prime.\n\n### 🛠️ Execution Strategy\n1. Create a boolean array `isPrime` of size $N+1$ pre-filled with `true`.\n2. Mark `isPrime[0]` and `isPrime[1]` as `false`.\n3. Loop `p` from 2 up to $\\sqrt{N}$:\n   - If `isPrime[p]` is true:\n   - Mark all multiples of $p$ starting from $p^2$ as `false`.\n4. All indices remaining `true` are your primes.",
          timeComplexity: "O(N log log N)",
          timeComplexityExplanation: "The number of strikeouts we perform follows the harmonic series of primes, which grows extremely slowly—practically linear for all realistic inputs.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "We require an N-sized boolean buffer to track the 'struck-out' status of each number.",
          implementations: [
             {
                language: "JavaScript",
                code: "function countPrimes(n) {\n    if (n <= 2) return 0;\n    const isPrime = new Uint8Array(n).fill(1);\n    isPrime[0] = isPrime[1] = 0;\n    \n    for (let p = 2; p * p < n; p++) {\n        if (isPrime[p]) {\n            for (let i = p * p; i < n; i += p) {\n                isPrime[i] = 0;\n            }\n        }\n    }\n    \n    return isPrime.reduce((acc, val) => acc + val, 0);\n}"
             },
             {
                language: "Python",
                code: "def countPrimes(n: int) -> int:\n    if n <= 2: return 0\n    primes = [True] * n\n    primes[0] = primes[1] = False\n    for p in range(2, int(n**0.5) + 1):\n        if primes[p]:\n            for i in range(p * p, n, p):\n                primes[i] = False\n    return sum(primes)"
             },
             {
                language: "Java",
                code: "public int countPrimes(int n) {\n    if (n <= 2) return 0;\n    boolean[] primes = new boolean[n];\n    Arrays.fill(primes, true);\n    for (int p = 2; p * p < n; p++) {\n        if (primes[p]) {\n            for (int i = p * p; i < n; i += p) primes[i] = false;\n        }\n    }\n    int count = 0;\n    for (int i = 2; i < n; i++) if (primes[i]) count++;\n    return count;\n}"
             },
             {
                language: "C++",
                code: "int countPrimes(int n) {\n    if (n <= 2) return 0;\n    vector<bool> primes(n, true);\n    primes[0] = primes[1] = false;\n    for (int p = 2; p * p < n; p++) {\n        if (primes[p]) {\n            for (int i = p * p; i < n; i += p) primes[i] = false;\n        }\n    }\n    return count(primes.begin(), primes.end(), true);\n}"
             }
          ]
       }
    ]
  },
  {
    id: "pow-x-n",
    title: "Implement Pow(x, n)",
    topic: "Mathematics",
    category: "Math Hacks",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Implement pow(x, n), which calculates x raised to the power n.",
    leetcodeLink: "https://leetcode.com/problems/powx-n/",
    useCases: ["Compound interest calcs", "Scientific modeling", "Graphics transformation matrices"],
    approaches: [
       {
          name: "Optimal (Binary Exponentiation)",
          description: "### 🧠 The Core Concept\nIf I ask you for $2^{10}$, you could multiply $2$ ten times ($2 \\times 2 \\times 2 ...$). That's 10 operations ($O(N)$).\n\nBut wait: $2^{10}$ is just $(2^5)^2$. And $2^5$ is $2 \\times (2^2)^2$. \nBy 'halving' the power at every step, we can calculate massive powers in just a few steps. \n1024 operations becomes just 10 operations! This is **Binary Exponentiation**.\n\n### 🛠️ Execution Strategy\n1. Handle the **Negative Power**: If $n < 0$, we calculate $1/x$ and flip $n$ to positive.\n2. **Recursion / Iteration**:\n   - If $n$ is even: $Pow(x, n) = Pow(x \\times x, n/2)$\n   - If $n$ is odd: $Pow(x, n) = x \\times Pow(x \\times x, (n-1)/2)$\n3. Repeat until $n=0$ (result is 1).",
          timeComplexity: "O(log N)",
          timeComplexityExplanation: "We divide the exponent by 2 at every single step, allowing us to find the result in logarithmic time.",
          spaceComplexity: "O(log N)",
          spaceComplexityExplanation: "Utilizing recursive frames scales by the depth of the binary tree ($Log N$). Iterative solutions can reduce this to $O(1)$.",
          implementations: [
             {
                language: "Python",
                code: "def myPow(x: float, n: int) -> float:\n    def helper(base, exp):\n        if exp == 0: return 1.0\n        res = helper(base, exp // 2)\n        res *= res\n        return res * base if exp % 2 else res\n\n    if n < 0: return 1 / helper(x, -n)\n    return helper(x, n)"
             },
             {
                language: "JavaScript",
                code: "function myPow(x, n) {\n    if (n < 0) {\n        x = 1 / x;\n        n = -n;\n    }\n    \n    function helper(base, exp) {\n        if (exp === 0) return 1;\n        let half = helper(base, Math.floor(exp / 2));\n        if (exp % 2 === 0) return half * half;\n        return half * half * base;\n    }\n    \n    return helper(x, n);\n}"
             },
             {
                language: "Java",
                code: "public double myPow(double x, int n) {\n    long N = n;\n    if (N < 0) {\n        x = 1 / x;\n        N = -N;\n    }\n    return fastPow(x, N);\n}\n\nprivate double fastPow(double x, long n) {\n    if (n == 0) return 1.0;\n    double half = fastPow(x, n / 2);\n    if (n % 2 == 0) return half * half;\n    else return half * half * x;\n}"
             },
             {
                language: "C++",
                code: "double myPow(double x, int n) {\n    long long N = n;\n    if (N < 0) {\n        x = 1 / x;\n        N = -N;\n    }\n    return helper(x, N);\n}\n\ndouble helper(double x, long long n) {\n    if (n == 0) return 1.0;\n    double half = helper(x, n / 2);\n    if (n % 2 == 0) return half * half;\n    return half * half * x;\n}"
             }
          ]
       }
    ]
  }
];
