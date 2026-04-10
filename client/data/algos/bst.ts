import { AlgorithmEntry } from "./types";

export const bstAlgorithms: AlgorithmEntry[] = [
  {
    id: "validate-bst",
    title: "Validate Binary Search Tree",
    topic: "Binary Search Trees",
    category: "BST Operations",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Determine if a binary tree satisfies the Binary Search Tree property: the left subtree of a node contains only nodes with keys less than the node's key, and the right subtree contains only nodes with keys greater than the node's key.",
    leetcodeLink: "https://leetcode.com/problems/validate-binary-search-tree/",
    useCases: ["Database index integrity checks", "Set/Map data structure implementation validation", "Tree structural auditing"],
    approaches: [
       {
          name: "Optimal (Recursive Range Boundaries)",
          description: "### 🧠 The Core Concept\nA common mistake is to only check if a node is greater than its left child and smaller than its right child locally. \n\nHowever, a right-side grandchild could still be smaller than the absolute root of the tree, which would invalidate the entire BST! To solve this, we must pass down a **Min/Max constraint range** that tightens as we go deeper into the tree.\n\n### 🛠️ Execution Strategy\n1. At the root, the range is $[-\\infty, \\infty]$.\n2. When moving to the **Left Child**, the new Max boundary becomes the parent's value.\n3. When moving to the **Right Child**, the new Min boundary becomes the parent's value.\n4. If any node's value falls outside its inherited range, it's not a valid BST.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We visit each node exactly once during a single Depth First Search traversal.",
          spaceComplexity: "O(H)",
          spaceComplexityExplanation: "The maximum depth of the recursive call stack is proportional to the height of the tree ($O(N)$ for skewed trees, $O(log N)$ for balanced trees).",
          implementations: [
             {
                language: "Python",
                code: "def isValidBST(root):\n    def validate(node, low=-float('inf'), high=float('inf')):\n        if not node: return True\n        if not (low < node.val < high): return False\n        \n        return (validate(node.left, low, node.val) and \n                validate(node.right, node.val, high))\n    return validate(root)"
             },
             {
                language: "JavaScript",
                code: "function isValidBST(root) {\n    function validate(node, low, high) {\n        if (!node) return true;\n        if (node.val <= low || node.val >= high) return false;\n        return validate(node.left, low, node.val) && validate(node.right, node.val, high);\n    }\n    return validate(root, -Infinity, Infinity);\n}"
             },
             {
                language: "Java",
                code: "public boolean isValidBST(TreeNode root) {\n    return validate(root, null, null);\n}\n\nprivate boolean validate(TreeNode node, Integer low, Integer high) {\n    if (node == null) return true;\n    if ((low != null && node.val <= low) || (high != null && node.val >= high)) return false;\n    return validate(node.left, low, node.val) && validate(node.right, node.val, high);\n}"
             }
          ]
       }
    ]
  },
  {
    id: "kth-smallest-element-in-a-bst",
    title: "Kth Smallest Element in BST",
    topic: "Binary Search Trees",
    category: "BST Operations",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given the root of a binary search tree and an integer k, return the kth smallest value among all the values of the nodes in the tree.",
    leetcodeLink: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    useCases: ["Finding median of a dataset", "Ranking systems", "Selecting percentiles in BST databases"],
    approaches: [
       {
          name: "Optimal (In-order Traversal Property)",
          description: "### 🧠 The Core Concept\nOne of the most beautiful properties of a Binary Search Tree is that an **In-order Traversal** (Left, Root, Right) always visits the nodes in **perfect sorted order**.\n\nTo find the Kth smallest element, we simply walk through the tree in-order and stop when we've seen exactly $K$ nodes.\n\n### 🛠️ Execution Strategy\n1. Perform an In-order traversal (recursive or iterative).\n2. Keep a counter of nodes visited.\n3. Once the counter reaches $K$, the current node is your answer.",
          timeComplexity: "O(H + K)",
          timeComplexityExplanation: "We dive down to the smallest element ($O(H)$) and then visit $K$ nodes. This is extremely efficient if $K$ is small.",
          spaceComplexity: "O(H)",
          spaceComplexityExplanation: "The recursive stack depth corresponds to the height of the tree.",
          implementations: [
             {
                language: "Python",
                code: "def kthSmallest(root, k):\n    stack = []\n    while True:\n        while root:\n            stack.append(root)\n            root = root.left\n        root = stack.pop()\n        k -= 1\n        if k == 0: return root.val\n        root = root.right"
             },
             {
                language: "JavaScript",
                code: "function kthSmallest(root, k) {\n    const stack = [];\n    while (true) {\n        while (root) {\n            stack.push(root);\n            root = root.left;\n        }\n        root = stack.pop();\n        if (--k === 0) return root.val;\n        root = root.right;\n    }\n}"
             },
             {
                language: "Java",
                code: "public int kthSmallest(TreeNode root, int k) {\n    Stack<TreeNode> stack = new Stack<>();\n    while (true) {\n        while (root != null) {\n            stack.push(root);\n            root = root.left;\n        }\n        root = stack.pop();\n        if (--k == 0) return root.val;\n        root = root.right;\n    }\n}"
             }
          ]
       }
    ]
  },
  {
    id: "delete-node-in-a-bst",
    title: "Delete Node in a BST",
    topic: "Binary Search Trees",
    category: "BST Operations",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Delete a node with a given key from a BST while maintaining the BST properties.",
    leetcodeLink: "https://leetcode.com/problems/delete-node-in-a-bst/",
    useCases: ["Dynamic database record removal", "File system directory deletion", "Memory hierarchy reclamation"],
    approaches: [
       {
          name: "Optimal (Recursive Structural Realignment)",
          description: "### 🧠 The Core Concept\nDeleting a node in a BST is tricky because we must keep the tree 'sorted'. There are three cases:\n1. **Leaf Node**: If the node has no children, just remove it. Simple!\n2. **One Child**: If the node has one child, the child simply 'moves up' to take its parent's place.\n3. **Two Children**: This is the 'Doctor Surgery' case. We cannot just delete the node or we'll break the tree in half. \n   - Instead, we find the node's **In-order Successor** (the smallest value in its right subtree).\n   - We swap the node's value with the successor's value.\n   - Finally, we recursively delete the successor (which is guaranteed to have at most one child!).\n\n### 🛠️ Execution Strategy\n1. Search for the key ($< \\implies$ go left, $> \\implies$ go right).\n2. Once identified, apply the case logic (Leaf, 1-Child, or 2-Children).\n3. Return the modified subtree root back up the recruitment chain.",
          timeComplexity: "O(H)",
          timeComplexityExplanation: "The search and deletion logic scales solely with the height of the tree.",
          spaceComplexity: "O(H)",
          spaceComplexityExplanation: "Recursive stack frames are created for every level of the tree traversed.",
          implementations: [
             {
                language: "Python",
                code: "def deleteNode(root, key):\n    if not root: return None\n    \n    if key < root.val:\n        root.left = deleteNode(root.left, key)\n    elif key > root.val:\n        root.right = deleteNode(root.right, key)\n    else:\n        # Case 1 & 2: 0 or 1 child\n        if not root.left: return root.right\n        if not root.right: return root.left\n        \n        # Case 3: 2 children - Find successor\n        curr = root.right\n        while curr.left: curr = curr.left\n        root.val = curr.val\n        root.right = deleteNode(root.right, curr.val)\n        \n    return root"
             },
             {
                language: "JavaScript",
                code: "function deleteNode(root, key) {\n    if (!root) return null;\n    \n    if (key < root.val) {\n        root.left = deleteNode(root.left, key);\n    } else if (key > root.val) {\n        root.right = deleteNode(root.right, key);\n    } else {\n        if (!root.left) return root.right;\n        if (!root.right) return root.left;\n        \n        let curr = root.right;\n        while (curr.left) curr = curr.left;\n        root.val = curr.val;\n        root.right = deleteNode(root.right, curr.val);\n    }\n    return root;\n}"
             }
          ]
       }
    ]
  }
];
