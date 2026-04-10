import { AlgorithmEntry } from "./types";

export const triesAlgorithms: AlgorithmEntry[] = [
  {
    id: "implement-trie",
    title: "Implement Trie (Prefix Tree)",
    topic: "Tries",
    category: "Tries",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "A trie or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.",
    leetcodeLink: "https://leetcode.com/problems/implement-trie-prefix-tree/",
    useCases: ["Autocomplete systems", "Spell checkers", "IP routing (Longest prefix match)"],
    approaches: [
       {
          name: "Optimal (Node Dictionary Architecture)",
          description: "### 🧠 The Core Concept\nIf you store 10,000 words in an array, searching to see if a word exists takes $O(N)$ time. \n\nA **Trie** is a specialized tree where every node represents a single letter. To spell the word \"CAT\", you start at the root, go down the branch `C`, then `A`, then `T`. \n\nIf you also want to add \"CAR\", you don't rebuild the whole word. You follow `C` and `A`, and simply add a new branch `R`. This dramatically saves memory and makes searches insanely fast.\n\n### 🛠️ Execution Strategy\n1. **The Node**: Every `TrieNode` needs two things: A dictionary mapping characters to other `TrieNode` instances, and a boolean `is_end_of_word` flag.\n2. **Insert**: Iterate heavily through the target string. If a letter doesn't exist in the current node's dictionary, create a new node and link it. Then step *into* that node.\n3. **Search**: Iterate heavily through the target string. If at any point the letter is missing from the dictionary, return False. If you safely traverse the entire word, return `is_end_of_word` to guarantee it's a full word, not just a prefix!",
          timeComplexity: "O(L) per word (L = length of word)",
          spaceComplexity: "O(T) (T = Total number of characters)",
          implementations: [
             {
                language: "Python",
                code: "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end_of_word = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word: str) -> None:\n        curr = self.root\n        for char in word:\n            if char not in curr.children:\n                curr.children[char] = TrieNode()\n            curr = curr.children[char]\n        curr.is_end_of_word = True\n\n    def search(self, word: str) -> bool:\n        curr = self.root\n        for char in word:\n            if char not in curr.children:\n                return False\n            curr = curr.children[char]\n        return curr.is_end_of_word\n\n    def startsWith(self, prefix: str) -> bool:\n        curr = self.root\n        for char in prefix:\n            if char not in curr.children:\n                return False\n            curr = curr.children[char]\n        return True"
             },
             {
                language: "JavaScript",
                code: "class TrieNode {\n    constructor() {\n        this.children = {};\n        this.isEndOfWord = false;\n    }\n}\n\nclass Trie {\n    constructor() {\n        this.root = new TrieNode();\n    }\n\n    insert(word) {\n        let curr = this.root;\n        for (let char of word) {\n            if (!curr.children[char]) {\n                curr.children[char] = new TrieNode();\n            }\n            curr = curr.children[char];\n        }\n        curr.isEndOfWord = true;\n    }\n\n    search(word) {\n        let curr = this.root;\n        for (let char of word) {\n            if (!curr.children[char]) return false;\n            curr = curr.children[char];\n        }\n        return curr.isEndOfWord;\n    }\n\n    startsWith(prefix) {\n        let curr = this.root;\n        for (let char of prefix) {\n            if (!curr.children[char]) return false;\n            curr = curr.children[char];\n        }\n        return true;\n    }\n}"
             },
             {
                language: "Java",
                code: "class TrieNode {\n    TrieNode[] children = new TrieNode[26];\n    boolean isEndOfWord = false;\n}\n\nclass Trie {\n    private TrieNode root;\n\n    public Trie() {\n        root = new TrieNode();\n    }\n    \n    public void insert(String word) {\n        TrieNode curr = root;\n        for(char c : word.toCharArray()) {\n            int index = c - 'a';\n            if(curr.children[index] == null) {\n                curr.children[index] = new TrieNode();\n            }\n            curr = curr.children[index];\n        }\n        curr.isEndOfWord = true;\n    }\n    \n    public boolean search(String word) {\n        TrieNode curr = root;\n        for(char c : word.toCharArray()) {\n            int index = c - 'a';\n            if(curr.children[index] == null) return false;\n            curr = curr.children[index];\n        }\n        return curr.isEndOfWord;\n    }\n    \n    public boolean startsWith(String prefix) {\n        TrieNode curr = root;\n        for(char c : prefix.toCharArray()) {\n            int index = c - 'a';\n            if(curr.children[index] == null) return false;\n            curr = curr.children[index];\n        }\n        return true;\n    }\n}"
             },
             {
                language: "C++",
                code: "class TrieNode {\npublic:\n    TrieNode* children[26];\n    bool isEndOfWord;\n    TrieNode() {\n        isEndOfWord = false;\n        for(int i = 0; i < 26; i++) children[i] = nullptr;\n    }\n};\n\nclass Trie {\nprivate:\n    TrieNode* root;\npublic:\n    Trie() {\n        root = new TrieNode();\n    }\n    \n    void insert(string word) {\n        TrieNode* curr = root;\n        for(char c : word) {\n            int index = c - 'a';\n            if(curr->children[index] == nullptr) {\n                curr->children[index] = new TrieNode();\n            }\n            curr = curr->children[index];\n        }\n        curr->isEndOfWord = true;\n    }\n    \n    bool search(string word) {\n        TrieNode* curr = root;\n        for(char c : word) {\n            int index = c - 'a';\n            if(curr->children[index] == nullptr) return false;\n            curr = curr->children[index];\n        }\n        return curr->isEndOfWord;\n    }\n    \n    bool startsWith(string prefix) {\n        TrieNode* curr = root;\n        for(char c : prefix) {\n            int index = c - 'a';\n            if(curr->children[index] == nullptr) return false;\n            curr = curr->children[index];\n        }\n        return true;\n    }\n};"
             }
          ]
       }
    ]
  }
];
