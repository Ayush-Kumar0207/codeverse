import { AlgorithmEntry } from "./types";

export const stringsAlgorithms: AlgorithmEntry[] = [
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    topic: "Strings - Basic",
    category: "Strings",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Determine if two strings are anagrams of each other (contain exactly the same characters in any order).",
    leetcodeLink: "https://leetcode.com/problems/valid-anagram/",
    useCases: ["Cryptography", "Spell checking", "Search suggestions"],
    approaches: [
       {
          name: "Optimal (Frequency Array Hash)",
          description: "### 🧠 The Core Concept\nIf I give you the words `LISTEN` and `SILENT`, how do you prove they are the same word shuffled?\n\nYou could sort both words alphabetically: `EILNST` vs `EILNST`. But sorting takes $O(N \\log N)$ time.\n\n### 🛠️ Execution Strategy\nInstead, imagine you have a clipboard with 26 tally counters (one for each letter of the alphabet).\n\n1. Walk through the first word (`LISTEN`). Every time you see a letter, click the tally counter **Up** by +1.\n2. Walk through the second word (`SILENT`). Every time you see a letter, click the tally counter **Down** by -1.\n3. Finally, look at your clipboard. If every single counter reads exactly `0`, the words are perfect anagrams! If any counter is positive or negative, they don't match.\n\nThis method requires NO sorting, running purely linearly in $O(N)$.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We iterate across both strings perfectly uniformly without inner loops. Total execution is exactly proportional to the length of the string `N`.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The size of the tally clipboard is fixed strictly at 26 indices (the english alphabet). No matter how infinitely long the strings become, memory utilization is solidly locked at O(1).",
          implementations: [
             {
                language: "Python",
                code: "def isAnagram(s: str, t: str) -> bool:\n    if len(s) != len(t): return False\n    count = [0] * 26\n    for i in range(len(s)):\n        count[ord(s[i]) - ord('a')] += 1\n        count[ord(t[i]) - ord('a')] -= 1\n    for val in count:\n        if val != 0:\n            return False\n    return True"
             },
             {
                language: "JavaScript",
                code: "function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    const count = new Array(26).fill(0);\n    for (let i = 0; i < s.length; i++) {\n        count[s.charCodeAt(i) - 97]++;\n        count[t.charCodeAt(i) - 97]--;\n    }\n    return count.every(val => val === 0);\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] count = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            count[s.charAt(i) - 'a']++;\n            count[t.charAt(i) - 'a']--;\n        }\n        for (int i : count) {\n            if (i != 0) return false;\n        }\n        return true;\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if(s.length() != t.length()) return false;\n        vector<int> count(26, 0);\n        for(int i = 0; i < s.length(); i++) {\n            count[s[i] - 'a']++;\n            count[t[i] - 'a']--;\n        }\n        for(int val : count) {\n            if(val != 0) return false;\n        }\n        return true;\n    }\n};"
             }
          ]
       }
    ]
  },
  {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    topic: "Strings - Advanced",
    category: "Sliding Window",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Given a string `s`, find the length of the longest substring without repeating characters.",
    leetcodeLink: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    useCases: ["Network Data Packet Compression", "DNA Sequence Mapping", "Live Text Analysis"],
    approaches: [
       {
          name: "Optimal (Sliding Window & Hash Map)",
          description: "### 🧠 The Core Concept\nImagine you are placing a physical magnifying glass (a \"window\") over the string. You start extending the right edge of this magnifying glass, bringing in new letters one by one.\nIf you see a letter you've already captured inside your glass... you have a collision!\nYou must immediately shrink the left side of your magnifying glass until that duplicate letter is squeezed out.\n\n### 🛠️ Execution Strategy\n1. Use two pointers: `left` and `right`. Both start at 0.\n2. Use a **Hash Map / Dictionary** to memorize the exact index where you most recently saw every character.\n3. Expand `right`. If the character at `right` is already in the map AND its stored index is $\\ge$ `left`, it means the duplicate is currently inside your window.\n4. **The Jump**: Instead of slowly moving `left` by 1, instantly teleport `left` to `Duplicate_Index + 1`! This immediately drops the older duplicate out of the window.\n5. Wait, why not just `left = map[char] + 1` always? Because if the duplicate index is *behind* the left pointer (meaning it's not even in the window anymore), it's completely irrelevant. Thus: `left = max(left, map[char] + 1)`.\n6. Update the Hash Map with the new index of the current character.\n7. Record the window width: `max_len = max(max_len, right - left + 1)`.\n\nThis elegantly parses the string without ever checking the same sequence twice.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "The right pointer bounds from 0 to N smoothly. Due to Hash Optimization, the left pointer directly skips indexes rather than crawling element-by-element. Every single character is visited strictly once by `right`, achieving pure $O(N)$ resolution.",
          spaceComplexity: "O(min(N, M))",
          spaceComplexityExplanation: "The structural Hash Map maintains pointers correlating to individual seen characters. Bounded ultimately by the available Character Domain space $M$ (e.g. 26 lowercase characters, or 256 for standard ASCII sets).",
          implementations: [
             {
                language: "JavaScript",
                code: "var lengthOfLongestSubstring = function(s) {\n    let map = new Map();\n    let left = 0;\n    let maxLen = 0;\n    \n    for (let right = 0; right < s.length; right++) {\n        let char = s[right];\n        if (map.has(char)) {\n            left = Math.max(left, map.get(char) + 1);\n        }\n        map.set(char, right);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    \n    return maxLen;\n};"
             },
             {
                language: "Python",
                code: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        char_map = {}\n        left = 0\n        max_len = 0\n        \n        for right in range(len(s)):\n            char = s[right]\n            if char in char_map:\n                left = max(left, char_map[char] + 1)\n                \n            char_map[char] = right\n            max_len = max(max_len, right - left + 1)\n            \n        return max_len"
             },
             {
                language: "Java",
                code: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        HashMap<Character, Integer> map = new HashMap<>();\n        int left = 0;\n        int maxLen = 0;\n        \n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            if (map.containsKey(c)) {\n                left = Math.max(left, map.get(c) + 1);\n            }\n            map.put(c, right);\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        \n        return maxLen;\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char, int> m;\n        int left = 0;\n        int maxLen = 0;\n        \n        for (int right = 0; right < s.length(); right++) {\n            char c = s[right];\n            if (m.count(c)) {\n                left = max(left, m[c] + 1);\n            }\n            m[c] = right;\n            maxLen = max(maxLen, right - left + 1);\n        }\n        \n        return maxLen;\n    }\n};"
             }
          ]
       }
    ]
  },
  {
    id: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    topic: "Strings - Advanced",
    category: "Two Pointers",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given a string `s`, return the longest palindromic substring in `s`.",
    leetcodeLink: "https://leetcode.com/problems/longest-palindromic-substring/",
    useCases: ["DNA structural mirroring", "Natural Language Processing algorithms"],
    approaches: [
       {
          name: "Optimal (Expand Around Center)",
          description: "### 🧠 The Core Concept\nHow do we identify a palindrome immediately? A palindrome mirrors perfectly around its center. E.g., `racecar` reflects around `e`. `abba` reflects around the empty space between `b` and `b`.\n\nInstead of checking every single substring variation combination ($O(N^3)$), what if we iterated through the string and treated **every literal character** as the potential center of a palindrome?\n\n### 🛠️ Execution Strategy\n1. Loop through each character `i` in the string.\n2. **Odd Palindrome Expansion**: Imagine `i` is the direct center (like `aba`). Place pointers at `left = i`, `right = i` and dynamically push them outward so long as `s[left] == s[right]`.\n3. **Even Palindrome Expansion**: Imagine the center is the space between `i` and `i+1` (like `abba`). Place pointers at `left = i`, `right = i+1` and expand.\n4. Take whichever expansion was geographically largest, and capture its substring index offsets if it broke the all-time-high record length.\n5. Once evaluated, move onto the next character as the nucleus.",
          timeComplexity: "O(N²)",
          timeComplexityExplanation: "We loop through `N` core elements. For each element, the maximum peripheral expansion is bounded inherently by `N`. Total matrix calculation maxes out at $N \\tim N = N^2$.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Zero substring allocation occurs until the very termination layer. Only minimal numeric pointer bounds (`start`, `maxLength`) traverse the framework execution.",
          implementations: [
             {
                language: "JavaScript",
                code: "var longestPalindrome = function(s) {\n    if (s == null || s.length < 1) return \"\";\n    \n    let start = 0, maxLength = 0;\n    \n    const expandAroundCenter = (left, right) => {\n        while (left >= 0 && right < s.length && s[left] === s[right]) {\n            left--;\n            right++;\n        }\n        return right - left - 1;\n    };\n    \n    for (let i = 0; i < s.length; i++) {\n        let len1 = expandAroundCenter(i, i);\n        let len2 = expandAroundCenter(i, i + 1);\n        let len = Math.max(len1, len2);\n        \n        if (len > maxLength) {\n            maxLength = len;\n            start = i - Math.floor((len - 1) / 2);\n        }\n    }\n    \n    return s.substring(start, start + maxLength);\n};"
             },
             {
                language: "Python",
                code: "class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        if not s: return \"\"\n        \n        start, max_length = 0, 0\n        \n        def expand_around_center(left: int, right: int) -> int:\n            while left >= 0 and right < len(s) and s[left] == s[right]:\n                left -= 1\n                right += 1\n            return right - left - 1\n            \n        for i in range(len(s)):\n            len1 = expand_around_center(i, i)\n            len2 = expand_around_center(i, i + 1)\n            curr_max = max(len1, len2)\n            \n            if curr_max > max_length:\n                max_length = curr_max\n                start = i - (curr_max - 1) // 2\n                \n        return s[start:start + max_length]"
             },
             {
                language: "Java",
                code: "class Solution {\n    public String longestPalindrome(String s) {\n        if (s == null || s.length() < 1) return \"\";\n        \n        int start = 0, maxLength = 0;\n        \n        for (int i = 0; i < s.length(); i++) {\n            int len1 = expandAroundCenter(s, i, i);\n            int len2 = expandAroundCenter(s, i, i + 1);\n            int len = Math.max(len1, len2);\n            \n            if (len > maxLength) {\n                maxLength = len;\n                start = i - (len - 1) / 2;\n            }\n        }\n        \n        return s.substring(start, start + maxLength);\n    }\n    \n    private int expandAroundCenter(String s, int left, int right) {\n        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {\n            left--;\n            right++;\n        }\n        return right - left - 1;\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    string longestPalindrome(string s) {\n        if (s.empty()) return \"\";\n        \n        int start = 0, maxLength = 0;\n        \n        for (int i = 0; i < s.length(); i++) {\n            int len1 = expandAroundCenter(s, i, i);\n            int len2 = expandAroundCenter(s, i, i + 1);\n            int max_len = max(len1, len2);\n            \n            if (max_len > maxLength) {\n                maxLength = max_len;\n                start = i - (max_len - 1) / 2;\n            }\n        }\n        \n        return s.substr(start, maxLength);\n    }\n    \nprivate:\n    int expandAroundCenter(const string& s, int left, int right) {\n        while (left >= 0 && right < s.length() && s[left] == s[right]) {\n            left--;\n            right++;\n        }\n        return right - left - 1;\n    }\n};"
             }
          ]
       }
    ]
  },
  {
    id: "reverse-words-in-a-given-string",
    title: "Reverse Words in a String",
    topic: "Strings - Basic",
    category: "Strings",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given an input string s, reverse the order of the words.",
    leetcodeLink: "https://leetcode.com/problems/reverse-words-in-a-string/",
    useCases: ["Natural Language Processing", "Inverting display text"],
    approaches: [
       {
          name: "Optimal (Trim & Two Pointers)",
          description: "### 🧠 The Core Concept\nWe want to reverse the order of words, but not the characters within the words themselves. \n\nWe can split the string by spaces, filter out the empty strings (extra spaces), reverse the resulting array, and join it back up.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Linear time to scan, split, and reverse.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Storing the intermediate words array.",
          implementations: [
             {
                language: "JavaScript",
                code: "function reverseWords(s) {\n    return s.trim().split(/\\s+/).reverse().join(' ');\n}"
             }
          ]
       }
    ]
  },
  {
    id: "remove-outermost-parenthesis",
    title: "Remove Outermost Parenthesis",
    topic: "Strings - Basic",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "A valid parentheses string s is primitive if it is non-empty, and there does not exist a way to split s into s = A + B. This algorithm removes the outermost parentheses of every primitive string.",
    leetcodeLink: "https://leetcode.com/problems/remove-outermost-parentheses/",
    useCases: ["Compiler parser logic", "LISP-style syntax cleanup"],
    approaches: [
       {
          name: "Optimal (Balance Counter)",
          description: "### 🧠 The Core Concept\nKeep track of the 'balance' of open and closed parentheses. Only add a character to the result if it's NOT an outermost one.\n\n### 🛠️ Execution Strategy\n- `count > 0` before adding `(` means it's not outermost.\n- `count > 1` before adding `)` means it's not outermost.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "JavaScript", code: "function removeOuterParentheses(s) {\n    let res = '', count = 0;\n    for (let c of s) {\n        if (c === '(') {\n            if (count > 0) res += c;\n            count++;\n        } else {\n            count--;\n            if (count > 0) res += c;\n        }\n    }\n    return res;\n}" }
          ]
       }
    ]
  },
  {
    id: "largest-odd-number-in-a-string",
    title: "Largest Odd Number in String",
    topic: "Strings - Basic",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Return the largest-valued odd integer (as a string) that is a non-empty substring of the input string.",
    leetcodeLink: "https://leetcode.com/problems/largest-odd-number-in-a-string/",
    useCases: ["Number theory basics"],
    approaches: [
       {
          name: "Optimal (Scan from Right)",
          description: "### 🧠 The Core Concept\nThe largest substring starting from index 0 that is odd is determined by the rightmost odd digit.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def largestOddNumber(num: str) -> str:\n    for i in range(len(num) - 1, -1, -1):\n        if int(num[i]) % 2 != 0: return num[:i+1]\n    return ''" }
          ]
       }
    ]
  },
  {
    id: "isomorphic-strings",
    title: "Isomorphic Strings",
    topic: "Strings - Basic",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Two strings are isomorphic if the characters in s can be replaced to get t.",
    leetcodeLink: "https://leetcode.com/problems/isomorphic-strings/",
    useCases: ["Pattern matching", "Cipher analysis"],
    approaches: [
       {
          name: "Optimal (Double Map)",
          description: "### 🧠 The Core Concept\nMaintain a mapping from s to t and t to s. Each character must map to exactly one other character.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1) (Bounded by charset size)",
          implementations: [
             { language: "JavaScript", code: "function isIsomorphic(s, t) {\n    let mapST = {}, mapTS = {};\n    for (let i = 0; i < s.length; i++) {\n        if ((mapST[s[i]] && mapST[s[i]] !== t[i]) || (mapTS[t[i]] && mapTS[t[i]] !== s[i])) return false;\n        mapST[s[i]] = t[i]; mapTS[t[i]] = s[i];\n    }\n    return true;\n}" }
          ]
       }
    ]
  },
  {
    id: "rotate-string",
    title: "Rotate String",
    topic: "Strings - Basic",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Check if s can become t after some number of shifts.",
    leetcodeLink: "https://leetcode.com/problems/rotate-string/",
    useCases: ["Circular pattern matching"],
    approaches: [
       {
          name: "Optimal (Concatenation Hint)",
          description: "### 🧠 The Core Concept\nIf s is shifted, it will always be a substring of `s + s`.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "Python", code: "def rotateString(s: str, t: str) -> bool:\n    return len(s) == len(t) and t in (s + s)" }
          ]
       }
    ]
  },
  {
    id: "roman-number-to-integer",
    title: "Roman to Integer",
    topic: "Strings - Medium",
    category: "Strings",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Convert a roman numeral string to an integer.",
    leetcodeLink: "https://leetcode.com/problems/roman-to-integer/",
    useCases: ["Legacy system parsing", "Historical data processing"],
    approaches: [
       {
          name: "Optimal (Subtraction Rule)",
          description: "### 🧠 The Core Concept\nNormally Roman numerals are largest to smallest. If a smaller numeral comes before a larger one, subtract it.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "JavaScript", code: "function romanToInt(s) {\n    const map = {I:1, V:5, X:10, L:50, C:100, D:500, M:1000};\n    let res = 0;\n    for (let i = 0; i < s.length; i++) {\n        if (map[s[i]] < map[s[i+1]]) res -= map[s[i]];\n        else res += map[s[i]];\n    }\n    return res;\n}" }
          ]
       }
    ]
  },
  {
    id: "implement-atoi",
    title: "String to Integer (atoi)",
    topic: "Strings - Medium",
    category: "Strings",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Implement the myAtoi(string s) function which converts a string to a 32-bit signed integer.",
    leetcodeLink: "https://leetcode.com/problems/string-to-integer-atoi/",
    useCases: ["Input sanitization", "Number parsing"],
    approaches: [
       {
          name: "Optimal (Boundary Check)",
          description: "### 🧠 The Core Concept\nHandle whitespace, then the sign, then digit conversion while checking for overflow/underflow.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def myAtoi(s: str) -> int:\n    s = s.strip()\n    if not s: return 0\n    sign = -1 if s[0] == '-' else 1\n    if s[0] in ['-', '+']: s = s[1:]\n    res, i = 0, 0\n    while i < len(s) and s[i].isdigit():\n        res = res * 10 + int(s[i])\n        i += 1\n    res = sign * res\n    return max(-2**31, min(res, 2**31 - 1))" }
          ]
       }
    ]
  },
  {
    id: "sort-characters-by-frequency",
    title: "Sort Characters by Frequency",
    topic: "Strings - Medium",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Given a string s, sort it in decreasing order based on the frequency of the characters.",
    leetcodeLink: "https://leetcode.com/problems/sort-characters-by-frequency/",
    useCases: ["Data compression", "Huffman coding basics"],
    approaches: [
       {
          name: "Optimal (Bucket Sort)",
          description: "### 🧠 The Core Concept\nCount frequencies, then use buckets where index = frequency and value = list of chars.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "JavaScript", code: "function frequencySort(s) {\n    let map = new Map();\n    for (let c of s) map.set(c, (map.get(c)||0)+1);\n    let buckets = Array.from({length: s.length + 1}, () => []);\n    for (let [c, f] of map) buckets[f].push(c);\n    let res = '';\n    for (let f = buckets.length - 1; f > 0; f--) {\n        for (let c of buckets[f]) res += c.repeat(f);\n    }\n    return res;\n}" }
          ]
       }
    ]
  },
  {
    id: "maximum-nesting-depth-of-parentheses",
    title: "Max Nesting Depth of Parentheses",
    topic: "Strings - Medium",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Given a valid parentheses string s, return the nesting depth of s.",
    leetcodeLink: "https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/",
    useCases: ["Syntax highlighting", "Nesting metrics"],
    approaches: [
       {
          name: "Optimal (Max Balance)",
          description: "### 🧠 The Core Concept\nThe maximum value reached by the bracket balance counter is the depth.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def maxDepth(s: str) -> int:\n    res = curr = 0\n    for c in s:\n        if c == '(': curr += 1\n        elif c == ')': curr -= 1\n        res = max(res, curr)\n    return res" }
          ]
       }
    ]
  },
  {
    id: "longest-common-prefix",
    title: "Longest Common Prefix",
    topic: "Strings - Horizontal Scanning",
    category: "Strings",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Find the longest common prefix string amongst an array of strings.",
    leetcodeLink: "https://leetcode.com/problems/longest-common-prefix/",
    useCases: ["Autocomplete systems", "Trie-based indexing"],
    approaches: [
       {
          name: "Optimal (Horizontal Scanning)",
          description: "### 🧠 The Core Concept\nAssume the first string is the prefix. Compare it with the second string and 'shorten' it until it matches. Repeat for all strings.\n\n### 🛠️ Execution Strategy\nIf we have `flower`, `flow`, `flight`:\n1. Prefix = `flower`. \n2. Compare with `flow`. Prefix becomes `flow`.\n3. Compare with `flight`. Prefix becomes `fl`.",
          timeComplexity: "O(S)",
          timeComplexityExplanation: "S is the sum of all characters in all strings.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Constant space aside from the prefix output.",
          implementations: [
             {
                language: "Python",
                code: "def longestCommonPrefix(strs):\n    if not strs: return \"\"\n    prefix = strs[0]\n    for i in range(1, len(strs)):\n        while strs[i].find(prefix) != 0:\n            prefix = prefix[:-1]\n            if not prefix: return \"\"\n    return prefix"
             }
          ]
       }
    ]
  }
];
