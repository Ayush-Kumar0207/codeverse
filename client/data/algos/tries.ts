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
          description: "### 🧠 The Core Concept\nIf you store 10,000 words in an array, searching to see if a word exists takes $O(N)$ time. \n\nA **Trie** is a specialized tree where every node represents a single letter. To spell the word \"CAT\", you start at the root, go down the branch `C`, then `A`, then `T`. \n\nIf you also want to add \"CAR\", you don't rebuild the whole word. You follow `C` and `A`, and simply add a new branch `R`. This dramatically saves memory and makes searches insanely fast.\n\n### 🛠️ Execution Strategy\n1. **The Node**: Every `TrieNode` needs two things: A dictionary wrapping characters to other `TrieNode` instances, and a boolean `is_end_of_word` flag.\n2. **Insert**: Iterate heavily through the target string. If a letter doesn't exist in the current node's dictionary, create a new node and link it. Then step *into* that node.\n3. **Search**: Iterate heavily through the target string. If at any point the letter is missing from the dictionary, return False. If you safely traverse the entire word, return `is_end_of_word` to guarantee it's a full word, not just a prefix!",
          timeComplexity: "O(L) per word (L = length of word)",
          timeComplexityExplanation: "Search execution is strictly proportional to the number of characters in the string being looked up, irrespective of total database size.",
          spaceComplexity: "O(T) (T = Total characters)",
          spaceComplexityExplanation: "The total alphanumeric occupancy correlates to every unique character sequence mapped into the structure.",
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
  },
  {
    id: "word-search-ii",
    title: "Word Search II",
    topic: "Tries - Backtracking",
    category: "Tries",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Given a board of characters and a list of words, find all words on the board. Each word must be constructed from letters of sequentially adjacent cells.",
    leetcodeLink: "https://leetcode.com/problems/word-search-ii/",
    useCases: ["Boggle software solvers", "Complex pattern recognition in genomes", "OCR text extraction correction"],
    approaches: [
       {
          name: "Optimal (Trie + DFS Backtracking)",
          description: "### 🧠 The Core Concept\nIf you have 1,000 target words, and you run a separate Grid DFS for every single word, the computation is massive. \n\nInstead, you store all target words in a **Trie**. Then, you run a SINGLE DFS starting from every cell in the grid. As you move across the board, you simultaneously step through the Trie branches. If you move from 'C' to 'A' on the board, and your Trie also has a branch from 'C' to 'A', you keep going! If not, you immediately 'prune' that branch and stop checking. \n\n### 🛠️ Execution Strategy\n1. **Build Trie**: Insert all target words into a Trie structure.\n2. **Grid Traversal**: Iterate through every cell $(r, c)$ in the grid.\n3. **Backtracking DFS**:\n   - Check bounds and if the current character is in the Trie branch of your current node.\n   - If found, mark the cell as 'visited' (to prevent reusing it in the same word).\n   - Check if that Trie node marks the `endOfWord`. If yes, you found a word! Save it.\n   - Recursively call DFS in all four directions.\n   - **Crucial**: After the recursion, unmark the cell (backtrack) and potentially 'prune' the Trie (delete words as you find them) to prevent redundant searches.",
          timeComplexity: "O(M * (4 * 3^(L-1)))",
          timeComplexityExplanation: "We start a DFS from every cell in the grid. Due to Trie pruning, we only explore paths that represent valid word prefixes in the dictionary.",
          spaceComplexity: "O(T)",
          spaceComplexityExplanation: "The structural storage for the Trie is the primary memory overhead, Scaling with total dictionary characters $T$.",
          implementations: [
             {
                language: "Python",
                code: "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.word = None\n\nclass Solution:\n    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:\n        root = TrieNode()\n        for w in words:\n            curr = root\n            for c in w:\n                curr = curr.children.setdefault(c, TrieNode())\n            curr.word = w\n            \n        res = []\n        rows, cols = len(board), len(board[0])\n        \n        def dfs(r, c, node):\n            char = board[r][c]\n            if char not in node.children: return\n            \n            curr_node = node.children[char]\n            if curr_node.word:\n                res.append(curr_node.word)\n                curr_node.word = None  # Prevent duplicates\n            \n            board[r][c] = \"#\"\n            for dr, dc in [(r+1, c), (r-1, c), (r, c+1), (r, c-1)]:\n                if 0 <= dr < rows and 0 <= dc < cols:\n                    dfs(dr, dc, curr_node)\n            board[r][c] = char\n            \n        for r in range(rows):\n            for c in range(cols):\n                dfs(r, c, root)\n        return res"
             },
             {
                language: "JavaScript",
                code: "class TrieNode {\n  constructor() {\n    this.children = {};\n    this.word = null;\n  }\n}\n\nvar findWords = function(board, words) {\n  let root = new TrieNode();\n  for (let w of words) {\n    let curr = root;\n    for (let c of w) {\n      if (!curr.children[c]) curr.children[c] = new TrieNode();\n      curr = curr.children[c];\n    }\n    curr.word = w;\n  }\n\n  let res = [];\n  let rows = board.length, cols = board[0].length;\n\n  function dfs(r, c, node) {\n    let char = board[r][c];\n    if (!node.children[char]) return;\n\n    let currNode = node.children[char];\n    if (currNode.word) {\n      res.push(currNode.word);\n      currNode.word = null; // Duplicate prevention\n    }\n\n    board[r][c] = '#'; // Mark visited\n    const directions = [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]];\n    for (let [dr, dc] of directions) {\n      if (dr >= 0 && dr < rows && dc >= 0 && dc < cols) {\n        dfs(dr, dc, currNode);\n      }\n    }\n    board[r][c] = char; // Backtrack\n  }\n\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      dfs(r, c, root);\n    }\n  }\n  return res;\n};"
             }
          ]
       }
    ]
  },
  {
    id: "implement-trie-ii",
    title: "Implement Trie II",
    topic: "Tries",
    category: "Tries",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Extend Trie to support counting: how many times a word was inserted and how many words start with a prefix.",
    leetcodeLink: "",
    useCases: ["Frequency-based autocomplete", "Dataset statistics"],
    approaches: [
       {
          name: "Optimal (Counter Nodes)",
          description: "### 🧠 The Core Concept\nEach node stores `countPrefix` (how many words pass through) and `countEnd` (how many words end exactly here).",
          timeComplexity: "O(L)",
          spaceComplexity: "O(T)",
          implementations: [
             { language: "Python", code: "class Node:\n    def __init__(self):\n        self.children = {}\n        self.cntEnd = 0\n        self.cntPrefix = 0\n\nclass Trie:\n    def __init__(self):\n        self.root = Node()\n    def insert(self, word):\n        curr = self.root\n        for c in word:\n            curr = curr.children.setdefault(c, Node())\n            curr.cntPrefix += 1\n        curr.cntEnd += 1" }
          ]
       }
    ]
  },
  {
    id: "number-of-distinct-substrings-in-a-string",
    title: "Distinct Substrings",
    topic: "Tries",
    category: "Hard Tries",
    frequencyLevel: "Niche",
    difficulty: "Hard",
    overview: "Count the number of distinct substrings present in a given string.",
    leetcodeLink: "",
    useCases: ["Suffix tree analysis", "Bioinformatics sequence counting"],
    approaches: [
       {
          name: "Optimal (Trie Node Counting)",
          description: "### 🧠 The Core Concept\nEvery single path in a Trie starting from the root represents a distinct substring. Insert all suffixes of the string into the Trie; the total number of nodes created (minus root) is the answer!\n\n### 🛠️ Execution Strategy\nFor `s = \"abab\"`, insert suffixes: `\"abab\"`, `\"bab\"`, `\"ab\"`, `\"b\"`.",
          timeComplexity: "O(N^2)",
          spaceComplexity: "O(N^2)",
          implementations: [
             { language: "JavaScript", code: "function countDistinctSubstrings(s) {\n    let root = {}, count = 0;\n    for(let i=0; i<s.length; i++) {\n        let curr = root;\n        for(let j=i; j<s.length; j++) {\n            if(!curr[s[j]]) {\n                curr[s[j]] = {};\n                count++;\n            }\n            curr = curr[s[j]];\n        }\n    }\n    return count + 1; // +1 for empty string\n}" }
          ]
       }
    ]
  },
  {
    id: "maximum-xor-of-two-numbers-in-an-array",
    title: "Maximum XOR of Two Numbers",
    topic: "Bitwise Tries",
    category: "Hard Tries",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Given an integer array, find the maximum result of num1 XOR num2.",
    leetcodeLink: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
    useCases: ["Cryptography", "Optimizing bitwise operations"],
    approaches: [
       {
          name: "Optimal (Bitwise Trie)",
          description: "### 🧠 The Core Concept\nTo maximize XOR, for every bit of a number, we want to find another number that has the **Opposite** bit at that position. \n\nWe store binary representations of all numbers in a 0/1 Trie. For each number, we traverse the Trie and 'greedy' choose the opposite bit whenever possible.",
          timeComplexity: "O(N * 32)",
          spaceComplexity: "O(N * 32)",
          implementations: [
             { language: "Python", code: "class TrieNode:\n    def __init__(self):\n        self.children = [None, None]\n\ndef findMaxXOR(nums):\n    root = TrieNode()\n    for n in nums:\n        curr = root\n        for i in range(31, -1, -1):\n            bit = (n >> i) & 1\n            if not curr.children[bit]: curr.children[bit] = TrieNode()\n            curr = curr.children[bit]\n    \n    res = 0\n    for n in nums:\n        curr, total = root, 0\n        for i in range(31, -1, -1):\n            bit = (n >> i) & 1\n            if curr.children[1 - bit]:\n                total |= (1 << i)\n                curr = curr.children[1 - bit]\n            else: curr = curr.children[bit]\n        res = max(res, total)\n    return res" }
          ]
       }
    ]
  }
];
