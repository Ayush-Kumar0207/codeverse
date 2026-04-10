import { AlgorithmEntry } from "./types";

export const treesAlgorithms: AlgorithmEntry[] = [
  {
    id: "binary-tree-inorder",
    title: "Inorder Traversal",
    topic: "Binary Trees - Traversals",
    category: "Binary Trees",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Traversing a tree such that we process the Left child, then the Root node, and finally the Right child.",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    useCases: ["Flattening a BST into sorted order", "Expression tree evaluation"],
    approaches: [
       {
          name: "Optimal (Recursive DFS)",
          description: "### 🧠 The Core Concept\nImagine exploring a massive dungeon where every room splits into a Left Path and a Right Path. \n\nInorder traversal follows a strict rule: **\"Never loot the current room until you have completely exhausted the entire Left Path.\"**\n\n### 🛠️ Execution Strategy\n1. You enter a room (Node).\n2. First, you dive into the `Left` door recursively.\n3. When you finally hit a dead end and return, you are allowed to *loot* (Process) the current room.\n4. Finally, you dive into the `Right` door to explore that side.\n\nBecause we visit every room exactly once, the Time Complexity is strictly O(N).",
          timeComplexity: "O(N)",
          spaceComplexity: "O(H)",
          implementations: [
             {
                language: "Python",
                code: "# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\ndef inorderTraversal(root):\n    res = []\n    def inorder(node):\n        if not node:\n            return\n        inorder(node.left)\n        res.append(node.val)\n        inorder(node.right)\n    inorder(root)\n    return res"
             },
             {
                language: "JavaScript",
                code: "function inorderTraversal(root) {\n    const res = [];\n    function inorder(node) {\n        if (!node) return;\n        inorder(node.left);\n        res.push(node.val);\n        inorder(node.right);\n    }\n    inorder(root);\n    return res;\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        List<Integer> res = new ArrayList<>();\n        inorder(root, res);\n        return res;\n    }\n    \n    private void inorder(TreeNode node, List<Integer> res) {\n        if (node == null) return;\n        inorder(node.left, res);\n        res.add(node.val);\n        inorder(node.right, res);\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    void inorder(TreeNode* node, vector<int>& res) {\n        if (!node) return;\n        inorder(node->left, res);\n        res.push_back(node->val);\n        inorder(node->right, res);\n    }\n\n    vector<int> inorderTraversal(TreeNode* root) {\n        vector<int> res;\n        inorder(root, res);\n        return res;\n    }\n};"
             }
          ]
       }
    ]
  }
];
