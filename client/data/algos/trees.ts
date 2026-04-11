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
                code: "var maxDepth = function(root) {\n    if (root === null) return 0;\n    let leftDepth = maxDepth(root.left);\n    let rightDepth = maxDepth(root.right);\n    return Math.max(leftDepth, rightDepth) + 1;\n};"
             },
             {
                language: "Python",
                code: "class Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        if not root:\n            return 0\n        left_depth = self.maxDepth(root.left)\n        right_depth = self.maxDepth(root.right)\n        return max(left_depth, right_depth) + 1"
             },
             {
                language: "Java",
                code: "class Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        if (root == nullptr) return 0;\n        return max(maxDepth(root->left), maxDepth(root->right)) + 1;\n    }\n};"
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
                code: "var invertTree = function(root) {\n    if (root === null) return null;\n    \n    let temp = root.left;\n    root.left = root.right;\n    root.right = temp;\n    \n    invertTree(root.left);\n    invertTree(root.right);\n    \n    return root;\n};"
             },
             {
                language: "Python",
                code: "class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        if not root:\n            return None\n            \n        root.left, root.right = root.right, root.left\n        \n        self.invertTree(root.left)\n        self.invertTree(root.right)\n        \n        return root"
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
                code: "var lowestCommonAncestor = function(root, p, q) {\n    let current = root;\n    \n    while (current !== null) {\n        if (p.val > current.val && q.val > current.val) {\n            current = current.right;\n        } \n        else if (p.val < current.val && q.val < current.val) {\n            current = current.left;\n        } \n        else {\n            return current;\n        }\n    }\n    return null;\n};"
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
  },
  {
    id: "diameter-of-binary-tree",
    title: "Diameter of Binary Tree",
    topic: "Trees",
    category: "Breadth-First Search / Depth-First Search",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes in a tree.",
    leetcodeLink: "https://leetcode.com/problems/diameter-of-binary-tree/",
    useCases: ["Network reliability analysis", "Topological spanning"],
    approaches: [
       {
          name: "Optimal (Global Maximum Tracker)",
          description: "### 🧠 The Core Concept\nThe longest path in a tree doesn't necessarily go through the root. It could be hidden deep down. \n\nHowever, **for every single node**, the longest path *passing through it* is simply `LeftHeight + RightHeight`. \n\nSo, while we calculate the height of each node (standard DFS), we simultaneously update a global 'All Time Best' record for `LeftHeight + RightHeight`.\n\n### 🛠️ Execution Strategy\n1. Initialize `maxDiameter = 0`.\n2. Define a DFS that returns Height: `1 + max(L, R)`.\n3. Inside the DFS, update `maxDiameter = max(maxDiameter, L + R)`.\n4. Return `maxDiameter` after the DFS finishes.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Single DFS traversal.",
          spaceComplexity: "O(H)",
          spaceComplexityExplanation: "Recursive stack height.",
          implementations: [
             {
                language: "Python",
                code: "def diameterOfBinaryTree(root):\n    res = 0\n    def dfs(node):\n        nonlocal res\n        if not node: return 0\n        l, r = dfs(node.left), dfs(node.right)\n        res = max(res, l + r)\n        return 1 + max(l, r)\n    dfs(root)\n    return res"
             }
          ]
       }
    ]
  },
  {
    id: "balanced-binary-tree",
    title: "Balanced Binary Tree",
    topic: "Trees",
    category: "Structure Check",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Determine if a binary tree is height-balanced (height difference between subtrees <= 1).",
    leetcodeLink: "https://leetcode.com/problems/balanced-binary-tree/",
    useCases: ["Guaranteeing O(log N) search speeds", "Tree database integrity"],
    approaches: [
       {
          name: "Optimal (Bottom-Up Early Exit)",
          description: "### 🧠 The Core Concept\nWe check height recursively. If at any point a subtree is unbalanced, we bubble up a special '-1' signal all the way to the root. If the top returns -1, the tree is broken!\n\n### 🛠️ Execution Strategy\nReturn `-1` if unbalanced, otherwise return actual height.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Single pass.",
          spaceComplexity: "O(H)",
          spaceComplexityExplanation: "Stack space.",
          implementations: [
             {
                language: "JavaScript",
                code: "function isBalanced(root) {\n    function dfs(node) {\n        if (!node) return 0;\n        let l = dfs(node.left);\n        if (l === -1) return -1;\n        let r = dfs(node.right);\n        if (r === -1) return -1;\n        if (Math.abs(l - r) > 1) return -1;\n        return 1 + Math.max(l, r);\n    }\n    return dfs(root) !== -1;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "level-order-traversal",
    title: "Level Order Traversal",
    topic: "Binary Trees",
    category: "Breadth-First Search",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    useCases: ["Network broadcasting", "GPS routing layers", "Organizational hierarchy visualization"],
    approaches: [
       {
          name: "Optimal (Queue-Based BFS)",
          description: "### 🧠 The Core Concept: The 'Wavefront' Analogy\nImagine dropping a pebble into a pond. The ripples (levels) move outward in concentric circles. You process the entire first circle before moving to the second.\n\n### 🛠️ Step-by-Step Logic\n1. Use a **Queue** data structure to maintain the order.\n2. Add the `root` to the queue.\n3. While the queue isn't empty:\n   - Check the `size` of the queue (this is how many nodes are on the current level).\n   - Loop `size` times: Pop a node, save its value, and add its children to the back of the queue.\n   - Add the completed level list to your results.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Every node is enqueued and dequeued exactly once.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "In the worst case (a perfect binary tree), the last level contains $N/2$ nodes, requiring $O(N)$ storage in the queue.",
          implementations: [
             {
                language: "JavaScript",
                code: `function levelOrder(root) {
    if (!root) return [];
    let res = [], queue = [root];
    while (queue.length) {
        let size = queue.length, level = [];
        for (let i = 0; i < size; i++) {
            let node = queue.shift();
            level.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        res.push(level);
    }
    return res;
}`
             },
             {
                language: "Python",
                code: `from collections import deque
def levelOrder(root):
    if not root: return []
    res, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        res.append(level)
    return res`
             }
          ]
       }
    ]

  },
  {
    id: "iterative-inorder",
    title: "Iterative Inorder",
    topic: "Binary Trees",
    category: "DFS",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Perform an Inorder traversal without using recursion (using an explicit stack).",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    useCases: ["Non-recursive tree processing", "Stack-based parsing"],
    approaches: [
       {
          name: "Optimal (Explicit Stack)",
          description: "### 🧠 The Core Concept: The 'Leftmost-First' Strategy\nRecursion uses a hidden call stack. We can do it manually by using our own **Stack**. The goal is: always try to go left, but remember the way back up.\n\n### 🛠️ Execution Strategy\n1. Maintain a pointer `curr` at the current node and an empty stack.\n2. **Drill Left**: While `curr` is not null, push `curr` to the stack and move to `curr.left`.\n3. **Backtrack & Visit**: Pop from the stack (you've reached the deepest possible left), process this node's value.\n4. **Explore Right**: Set `curr = poppedNode.right` and repeat from step 2.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Every node is pushed and popped exactly once.",
          spaceComplexity: "O(H)",
          spaceComplexityExplanation: "The stack stores the path from root to the current leaf, which is the height of the tree.",
          implementations: [
             {
                language: "Python",
                code: `def inorderTraversal(root):
    res, stack, curr = [], [], root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        res.append(curr.val)
        curr = curr.right
    return res`
             },
             {
                language: "JavaScript",
                code: `function inorderTraversal(root) {
    let res = [], stack = [], curr = root;
    while (curr || stack.length) {
        while (curr) {
            stack.push(curr);
            curr = curr.left;
        }
        curr = stack.pop();
        res.push(curr.val);
        curr = curr.right;
    }
    return res;
}`
             }
          ]
       }
    ]

  },
  {
    id: "top-view-of-binary-tree",
    title: "Top View",
    topic: "Binary Trees",
    category: "Views",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Return the nodes visible from the top of the tree.",
    leetcodeLink: "",
    useCases: ["Shadow mapping", "Topological visibility"],
    approaches: [
       {
          name: "Optimal (Vertical Line Tracker)",
          description: "### 🧠 The Core Concept: The 'Shadow' Analogy\nImagine the tree viewed from the side. Each node casts a shadow on a vertical axis. The 'Top View' is just the first node that hits each vertical lane when looking from above.\n\n### 🛠️ Execution Strategy\n1. Use a **Horizontal Distance (HD)** coordinate: Root is $0$, Left is $-1$, Right is $+1$.\n2. Use a **Queue** for BFS (this ensures we visit top nodes before bottom nodes).\n3. Use a **Map** to store the first value found for each HD coordinate.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(N)",
          implementations: [
             {
                language: "JavaScript",
                code: `function topView(root) {
    if (!root) return [];
    let map = new Map(), queue = [[root, 0]];
    while (queue.length) {
        let [node, hd] = queue.shift();
        if (!map.has(hd)) map.set(hd, node.val);
        if (node.left) queue.push([node.left, hd - 1]);
        if (node.right) queue.push([node.right, hd + 1]);
    }
    const sortedKeys = Array.from(map.keys()).sort((a,b) => a - b);
    return sortedKeys.map(key => map.get(key));
}`
             }
          ]
       }
    ]

  },
  {
    id: "right-left-view-of-binary-tree",
    title: "Right View",
    topic: "Binary Trees",
    category: "Views",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Return the sequence of nodes visible when looking from the right side.",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-right-side-view/",
    useCases: ["Side-profile rendering"],
    approaches: [
       {
          name: "Optimal (DFS Level-First)",
          description: "### 🧠 The Core Concept: The 'First Encounter' Rule\nWe want the rightmost node at each depth. If we traverse the tree while always exploring **Right subtrees first**, then for every new depth level we enter, the first node we see is guaranteed to be the rightmost one.\n\n### 🛠️ Step-by-Step Logic\n1. Maintain a `result` list.\n2. Run DFS with a `depth` parameter, following: **Root -> Right -> Left**.\n3. If `depth == result.length`, this is the first time we've reached this depth. Add the node to `result`.\n4. Recurse to Right then Left.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(H)",
          implementations: [
             {
                language: "Python",
                code: `def rightSideView(root):
    res = []
    def dfs(node, depth):
        if not node: return
        if depth == len(res):
            res.append(node.val)
        dfs(node.right, depth + 1)
        dfs(node.left, depth + 1)
    dfs(root, 0)
    return res`
             },
             {
                language: "JavaScript",
                code: `function rightSideView(root) {
    let res = [];
    function dfs(node, level) {
        if (!node) return;
        if (level === res.length) res.push(node.val);
        dfs(node.right, level + 1);
        dfs(node.left, level + 1);
    }
    dfs(root, 0);
    return res;
}`
             }
          ]
       }
    ]

  },
  {
    id: "morris-preorder-traversal",
    title: "Morris Traversal",
    topic: "Binary Trees",
    category: "Advanced DFS",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Traverse the tree without recursion and without a stack (O(1) extra space).",
    leetcodeLink: "",
    useCases: ["Memory-constrained embedded systems"],
    approaches: [
       {
          name: "Optimal (Threaded Binary Tree)",
          description: "### The Core Concept\nMorris Traversal is a brilliant algorithm that performs tree traversal without using recursion or a stack, achieving O(1) extra space complexity. The key insight is to temporarily modify the tree structure by creating threads (temporary links) from the rightmost node of the left subtree back to the current node. These threads allow us to return to the current node after exploring the left subtree without using a stack. The algorithm works by finding the inorder predecessor of each node (the rightmost node in its left subtree). If the predecessor's right child is null, we create a thread from predecessor to current and move left. If the predecessor's right child already points to current (meaning we have already visited the left subtree), we remove the thread (restore the tree structure), visit the current node, and move right. This process continues until we have visited all nodes, and the tree is restored to its original structure.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             { language: "Python", code: "def morris(root):\n    curr, res = root, []\n    while curr:\n        if not curr.left: res.append(curr.val); curr = curr.right\n        else:\n            prev = curr.left\n            while prev.right and prev.right != curr: prev = prev.right\n            if not prev.right: prev.right = curr; res.append(curr.val); curr = curr.left\n            else: prev.right = None; curr = curr.right\n    return res" }
          ]
       }
    ]
  }
];
