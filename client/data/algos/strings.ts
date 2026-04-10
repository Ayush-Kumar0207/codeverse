import { AlgorithmEntry } from "./types";

export const stringsAlgorithms: AlgorithmEntry[] = [
  {
    id: "valid-anagram",
    title: "Check Anagram",
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
          spaceComplexity: "O(1)",
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
                code: "bool isAnagram(string s, string t) {\n    if(s.length() != t.length()) return false;\n    vector<int> count(26, 0);\n    for(int i = 0; i < s.length(); i++) {\n        count[s[i] - 'a']++;\n        count[t[i] - 'a']--;\n    }\n    for(int val : count) {\n        if(val != 0) return false;\n    }\n    return true;\n}"
             }
          ]
       }
    ]
  }
];
