import { AlgorithmEntry } from "./types";

export const bstAlgorithms: AlgorithmEntry[] = [
  {
    id: "validate-bst",
    title: "Check if tree is a BST",
    topic: "Binary Search Trees",
    category: "Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Determine if a generic binary tree perfectly satisfies the sorting properties of a Binary Search Tree.",
    leetcodeLink: "https://leetcode.com/problems/validate-binary-search-tree/",
    useCases: ["Database indexing validation", "Tree rotations"],
    approaches: [
       {
          name: "Optimal (Valid Range Boundaries)",
          description: "### 🧠 The Core Concept\nIn a Binary Search Tree, everything to the left of a node MUST be completely smaller than it, and everything to the right MUST be completely greater.\n\nBut here is a hidden trap: It's not enough to just check if `Node.Left < Node` and `Node.Right > Node`. If a right-side child node has a left-subchild that is smaller than the absolute root of the tree, the *entire tree* is invalid!\n\n### 🛠️ Execution Strategy\nInstead of checking local neighbors, we pass down **Strict Boundaries** (a min limit and max limit) to every node.\n\n1. The Root node is allowed to be anything. (Min: `-Infinity`, Max: `Infinity`).\n2. When we dive into the Left Child, we pass down a new constraint: *\"You must be smaller than your parent!\"*. (Our absolute Max limit becomes identical to our Parent's value).\n3. When we dive to the Right Child, we pass down: *\"You must be bigger than your parent!\"*. (Our absolute Min limit becomes identical to our Parent's value).\n\nIf any node breaks the constraints passed down to it, the recursive cascade halts and returns False immediately. Pure DFS scaling at O(N) speed.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(H)",
          implementations: [
             {
                language: "Python",
                code: "def isValidBST(root) -> bool:\n    def validate(node, low=-float('inf'), high=float('inf')):\n        if not node: return True\n        if node.val <= low or node.val >= high:\n            return False\n        \n        # Left child must be smaller than the node, Right child must be larger\n        return (validate(node.left, low, node.val) and \n                validate(node.right, node.val, high))\n                \n    return validate(root)"
             },
             {
                language: "JavaScript",
                code: "function isValidBST(root) {\n    function validate(node, low, high) {\n        if (!node) return true;\n        if (node.val <= low || node.val >= high) return false;\n        \n        return validate(node.left, low, node.val) && validate(node.right, node.val, high);\n    }\n    return validate(root, -Infinity, Infinity);\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public boolean isValidBST(TreeNode root) {\n        return validate(root, null, null);\n    }\n    \n    public boolean validate(TreeNode node, Integer low, Integer high) {\n        if (node == null) return true;\n        if ((low != null && node.val <= low) || (high != null && node.val >= high)) {\n            return false;\n        }\n        return validate(node.left, low, node.val) && validate(node.right, node.val, high);\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    bool validate(TreeNode* node, long long low, long long high) {\n        if (!node) return true;\n        if (node->val <= low || node->val >= high) return false;\n        \n        return validate(node->left, low, node->val) && \n               validate(node->right, node->val, high);\n    }\n    \n    bool isValidBST(TreeNode* root) {\n        return validate(root, LLONG_MIN, LLONG_MAX);\n    }\n};"
             }
          ]
       }
    ]
  }
];
