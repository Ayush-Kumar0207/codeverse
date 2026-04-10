import { AlgorithmEntry } from "./types";

export const treesAlgorithms: AlgorithmEntry[] = [
  {
    id: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    topic: "Trees",
    category: "Breadth-First Search / Depth-First Search",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    leetcodeLink: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    useCases: ["DOM Tree Analysis in Browsers", "Decision Tree evaluating depth bounds", "Network Node routing distance"],
    approaches: [
       {
          name: "Optimal (Recursive DFS)",
          description: "### 🧠 The Core Concept\nImagine standing at the top of a giant tree. You don't know how deep it goes. But if you have a friend exploring the Left branch, and another exploring the Right branch, you just wait for them to come back and mathematically state: *\"Whatever the deepest branch was between the two of you... just add $1$ (for myself) and that's the absolute max depth!\"*\n\n### 🛠️ Execution Strategy\nBecause the problem is perfectly self-similar, we use **Recursion**.\n1. **Base Case**: If the current node is `null`, it mathematically has a depth of $0$.\n2. **Sub-problem Expansion**: Recursively call the depth function on `root.left`.\n3. **Sub-problem Expansion**: Recursively call the depth function on `root.right`.\n4. **Synthesis Resolution**: Return `1 + max(left_depth, right_depth)`.\n\nThis organically traverses to the absolute bottom of every leaf, allowing the values to bubble back up to the root nucleus dynamically.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We cannot determine depth without inherently pinging every single node. The recursive stack traces exactly $N$ times, executing an instantaneous $O(1)$ max calculation at each layer.",
          spaceComplexity: "O(H)",
          spaceComplexityExplanation: "The Call Stack pushes memory frames proportional to the height $H$ of the tree. In an optimally balanced tree, this converges to $O(\\log N)$. In a degenerate linked-list style tree, it scales to $O(N)$.",
          implementations: [
             {
                language: "JavaScript",
                code: "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\nvar maxDepth = function(root) {\n    if (root === null) return 0;\n    \n    let leftDepth = maxDepth(root.left);\n    let rightDepth = maxDepth(root.right);\n    \n    return Math.max(leftDepth, rightDepth) + 1;\n};"
             },
             {
                language: "Python",
                code: "# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\nclass Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        if not root:\n            return 0\n            \n        left_depth = self.maxDepth(root.left)\n        right_depth = self.maxDepth(root.right)\n        \n        return max(left_depth, right_depth) + 1"
             },
             {
                language: "Java",
                code: "/**\n * Definition for a binary tree node.\n * public class TreeNode {\n *     int val;\n *     TreeNode left;\n *     TreeNode right;\n *     TreeNode() {}\n *     TreeNode(int val) { this.val = val; }\n *     TreeNode(int val, TreeNode left, TreeNode right) {\n *         this.val = val;\n *         this.left = left;\n *         this.right = right;\n *     }\n * }\n */\nclass Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;\n    }\n}"
             },
             {
                language: "C++",
                code: "/**\n * Definition for a binary tree node.\n * struct TreeNode {\n *     int val;\n *     TreeNode *left;\n *     TreeNode *right;\n *     TreeNode() : val(0), left(nullptr), right(nullptr) {}\n *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\n * };\n */\nclass Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        if (root == nullptr) return 0;\n        return max(maxDepth(root->left), maxDepth(root->right)) + 1;\n    }\n};"
             }
          ]
       }
    ]
  },
  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    topic: "Trees",
    category: "Breadth-First Search / Depth-First Search",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Given the root of a binary tree, invert the tree, and return its root. (The infamous algorithm Max Howell failed to write on a whiteboard at Google).",
    leetcodeLink: "https://leetcode.com/problems/invert-binary-tree/",
    useCases: ["GUI Interface mirroring", "Machine Learning model parameter flipping"],
    approaches: [
       {
          name: "Optimal (Recursive Structure Flipping)",
          description: "### 🧠 The Core Concept\nTo flip an entire tree perfectly, you just need to swap the `left` child and `right` child of every single node in the system. \nIf you recursively tell every node \"Hey, hold your left child in your right hand, and your right child in your left hand\", the entire macro structure naturally perfectly mirrors itself!\n\n### 🛠️ Execution Strategy\n1. **Base Case Validation**: If the current node evaluates to `null`, instantly return `null`.\n2. **Temporary State Caching**: Save the `left` node array to a temporary variable so it doesn't get mathematically overwritten.\n3. **Pointer Overwrite**: Assign `root.left = root.right`, passing the right side over.\n4. **Pointer Overwrite**: Assign `root.right = TEMP`, restoring the previously cached left side.\n5. **Recursive Branching**: Pass the exact same instructions down to `root.left` and `root.right` to ensure the sub-children flip their own sub-children.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Since the goal is an absolute structural mirror, the execution tracer inherently visits every single instanced node exactly once, scaling purely linearly.",
          spaceComplexity: "O(H)",
          spaceComplexityExplanation: "The recursive pointer stacking dynamically scales to the height (`H`) of the topological graph, hitting `O(log N)` for perfectly constructed trees, and `O(N)` for degenerate boundaries.",
          implementations: [
             {
                language: "JavaScript",
                code: "var invertTree = function(root) {\n    if (root === null) return null;\n    \n    // Standard pointer swap\n    let temp = root.left;\n    root.left = root.right;\n    root.right = temp;\n    \n    // Recursively flip the branches\n    invertTree(root.left);\n    invertTree(root.right);\n    \n    return root;\n};"
             },
             {
                language: "Python",
                code: "class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        if not root:\n            return None\n            \n        # Python allows beautiful single-line tuple assignment swapping\n        root.left, root.right = root.right, root.left\n        \n        self.invertTree(root.left)\n        self.invertTree(root.right)\n        \n        return root"
             },
             {
                language: "Java",
                code: "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        \n        TreeNode temp = root.left;\n        root.left = root.right;\n        root.right = temp;\n        \n        invertTree(root.left);\n        invertTree(root.right);\n        \n        return root;\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        if (root == nullptr) return nullptr;\n        \n        swap(root->left, root->right);\n        \n        invertTree(root->left);\n        invertTree(root->right);\n        \n        return root;\n    }\n};"
             }
          ]
       }
    ]
  },
  {
    id: "lowest-common-ancestor-of-a-binary-search-tree",
    title: "Lowest Common Ancestor of a BST",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes `p` and `q`.",
    leetcodeLink: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    useCases: ["CSS DOM tree element correlation", "Git commit branch divergence detection"],
    approaches: [
       {
          name: "Optimal (BST Math Pruning)",
          description: "### 🧠 The Core Concept\nBecause this is a **Binary Search Tree** (and not a random binary tree), we essentially get \"free\" mathematical intelligence! \nEverything to the left of a node is numerically strictly smaller. Everything to the right is numerically strictly larger.\nTherefore, the \"Split Point\" (Lowest Common Ancestor) is literally the first node whose value organically falls *between* the structural target values $P$ and $Q$.\n\n### 🛠️ Execution Strategy\n1. Start at the absolutely highest point: the `root`.\n2. **Check Right Drift**: If BOTH `p` and `q` are mathematically structurally HIGHER than `root`, the Split Point cannot possibly be here. The LCA MUST be down in the `root.right` ecosystem. Traverse exactly there.\n3. **Check Left Drift**: If BOTH `p` and `q` are mathematically LOWER than `root`, the LCA MUST be down in the `root.left` ecosystem.\n4. **Split Point Detected**: If one value is mathematically higher, and the other value is mathematically lower... congratulations! You found the exact node where their timelines diverged. This is officially the Lowest Common Ancestor. Return it.",
          timeComplexity: "O(H)",
          timeComplexityExplanation: "We absolutely do not scan the entire tree natively. Since we aggressively prune $50\\%$ of the graph mathematically at every iteration, execution scales perfectly with the depth height $H$. Essentially running in $O(\\log N)$.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "By configuring iteration via a purely continuous `while` pointer rather than invoking recursive stacks, we definitively prevent garbage instantiation, running gracefully in perfect $O(1)$.",
          implementations: [
             {
                language: "JavaScript",
                code: "var lowestCommonAncestor = function(root, p, q) {\n    let current = root;\n    \n    while (current !== null) {\n        // Both targets are strictly in the right subtree ecosystem\n        if (p.val > current.val && q.val > current.val) {\n            current = current.right;\n        } \n        // Both targets are strictly in the left subtree ecosystem\n        else if (p.val < current.val && q.val < current.val) {\n            current = current.left;\n        } \n        // Timeline structural divergence detected!\n        else {\n            return current;\n        }\n    }\n    return null;\n};"
             },
             {
                language: "Python",
                code: "class Solution:\n    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':\n        curr = root\n        \n        while curr:\n            if p.val > curr.val and q.val > curr.val:\n                curr = curr.right\n            elif p.val < curr.val and q.val < curr.val:\n                curr = curr.left\n            else:\n                return curr\n                \n        return None"
             },
             {
                language: "Java",
                code: "class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        TreeNode current = root;\n        \n        while (current != null) {\n            if (p.val > current.val && q.val > current.val) {\n                current = current.right;\n            } else if (p.val < current.val && q.val < current.val) {\n                current = current.left;\n            } else {\n                return current;\n            }\n        }\n        \n        return null;\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        TreeNode* current = root;\n        \n        while (current != nullptr) {\n            if (p->val > current->val && q->val > current->val) {\n                current = current->right;\n            } else if (p->val < current->val && q->val < current->val) {\n                current = current->left;\n            } else {\n                return current;\n            }\n        }\n        \n        return nullptr;\n    }\n};"
             }
          ]
       }
    ]
  }
];
