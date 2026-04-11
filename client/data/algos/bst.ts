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
  },
  {
    id: "ceil-in-a-bst",
    title: "Ceil in BST",
    topic: "Binary Search Trees",
    category: "BST Operations",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the smallest node value that is greater than or equal to a target value X.",
    leetcodeLink: "",
    useCases: ["Range search indexing", "Finding smallest upper bound in data"],
    approaches: [
       {
          name: "Optimal (Pruned Vertical Scan)",
          description: "### 🧠 The Core Concept: The 'Tightening Upper Bound'\nSearching for a Ceil is like hunting for the smallest hat that still fits your head. If the current hat (node) is too small, you MUST look for larger ones (go Right). If it fits but might be too loose, you remember its size as a candidate and look for a tighter fit (go Left).\n\n### 🛠️ Execution Strategy\n1. Initialize `ceil = -1`.\n2. Traverse from the root:\n   - If `node.val == X`, the ceil is exactly X. Return immediately.\n   - If `node.val < X`, the current node is too small. Move to `node.right` to find larger values.\n   - If `node.val > X`, the current node is a potential ceil! Save it and move to `node.left` to see if a smaller value still satisfies the condition.",
          timeComplexity: "O(H)",
          timeComplexityExplanation: "We traverse a single path from root to leaf.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Only a single pointer and a variable are used.",
          implementations: [
             {
                language: "JavaScript",
                code: `function findCeil(root, key) {
    let ceil = -1;
    while (root) {
        if (root.val === key) return root.val;
        if (key > root.val) {
            root = root.right;
        } else {
            ceil = root.val;
            root = root.left;
        }
    }
    return ceil;
}`
             },
             {
                language: "Python",
                code: `def findCeil(root, key):
    ceil = -1
    while root:
        if root.val == key: return root.val
        if key > root.val:
            root = root.right
        else:
            ceil = root.val
            root = root.left
    return ceil`
             }
          ]
       }
    ]

  },
  {
    id: "floor-in-a-bst",
    title: "Floor in BST",
    topic: "Binary Search Trees",
    category: "BST Operations",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the largest node value that is smaller than or equal to a target value X.",
    leetcodeLink: "",
    useCases: ["Finding largest lower bound"],
    approaches: [
       {
          name: "Optimal (Pruned Vertical Scan)",
          description: "### 🧠 The Core Concept: The 'Safe Lower Bound'\nSearching for a Floor is like finding the highest diving board you are brave enough to jump from (below your max limit). If a board is too high (node > X), you must go lower (Right subtree is useless). If it's safe (node <= X), it's a candidate, but there might be a higher one further Right.\n\n### 🛠️ Step-by-Step Logic\n1. Initialize `floor = -1`.\n2. While traversing:\n   - If `node.val == X`, it's the perfect floor.\n   - If `node.val > X`, look in the Left subtree.\n   - If `node.val < X`, save current as candidate and look in the Right subtree.",
          timeComplexity: "O(H)",
          spaceComplexity: "O(1)",
          implementations: [
             {
                language: "Python",
                code: `def findFloor(root, key):
    res = -1
    while root:
        if root.val == key: return root.val
        if key < root.val: 
            root = root.left
        else:
            res = root.val
            root = root.right
    return res`
             },
             {
                language: "JavaScript",
                code: `function findFloor(root, key) {
    let res = -1;
    while (root) {
        if (root.val === key) return root.val;
        if (key < root.val) {
            root = root.left;
        } else {
            res = root.val;
            root = root.right;
        }
    }
    return res;
}`
             }
          ]
       }
    ]

  },
  {
    id: "inorder-successor-predecessor-in-bst",
    title: "BST Successor / Predecessor",
    topic: "Binary Search Trees",
    category: "BST Operations",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the node that comes immediately after (successor) or before (predecessor) a given node in an in-order traversal.",
    leetcodeLink: "https://leetcode.com/problems/inorder-successor-in-bst/",
    useCases: ["Iterating through BSTs like a linked list"],
    approaches: [
       {
          name: "Optimal (Standard Search Logic)",
          description: "### 🧠 The Core Concept: The 'Next Largest' Hunting\nHow do you find the next larger number in a BST without sorting the whole thing? \nUse the BST property: any node larger than our target must be in the **Right subtree** or be one of its **Ancestors**.\n\n### 🛠️ Step-by-Step Logic (Successor)\n1. Initialize `successor = null`.\n2. While searching for the node:\n   - If `current.val > target.val`: This could be the successor! Save it and move Left to see if there's a smaller one that's still larger than target.\n   - If `current.val <= target.val`: This node is too small. Move Right.",
          timeComplexity: "O(H)",
          spaceComplexity: "O(1)",
          implementations: [
             {
                language: "JavaScript",
                code: `function successor(root, p) {
    let res = null;
    while (root) {
        if (p.val < root.val) {
            res = root;
            root = root.left;
        } else {
            root = root.right;
        }
    }
    return res;
}`
             },
             {
                language: "Python",
                code: `def getSuccessor(root, p):
    res = None
    while root:
        if p.val < root.val:
            res = root
            root = root.left
        else:
            root = root.right
    return res`
             }
          ]
       }
    ]

  },
  {
    id: "recover-bst",
    title: "Recover BST",
    topic: "Binary Search Trees",
    category: "Hard BST",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Two nodes of a BST are swapped by mistake. Recover the tree without changing its structure.",
    leetcodeLink: "https://leetcode.com/problems/recover-binary-search-tree/",
    useCases: ["Corrupt tree database recovery"],
    approaches: [
       {
          name: "Optimal (One-Pass Inorder)",
          description: "### 🧠 The Core Concept\nAn inorder traversal of a BST should be strictly increasing. If we find two anomalies (where `prev.val > curr.val`), those are our two swapped nodes.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(H)",
          implementations: [
             { language: "Python", code: "def recoverTree(root):\n    first = second = prev = None\n    def dfs(node):\n        nonlocal first, second, prev\n        if not node: return\n        dfs(node.left)\n        if prev and prev.val > node.val:\n            if not first: first = prev\n            second = node\n        prev = node\n        dfs(node.right)\n    dfs(root)\n    first.val, second.val = second.val, first.val" }
          ]
       }
    ]
  },
  {
    id: "largest-bst-in-binary-tree",
    title: "Largest BST in BT",
    topic: "Binary Search Trees",
    category: "Hard BST",
    frequencyLevel: "Niche",
    difficulty: "Hard",
    overview: "Given a binary tree, find the size of the largest subtree that is a valid BST.",
    leetcodeLink: "",
    useCases: ["Maximizing sorted components in a graph"],
    approaches: [
       {
          name: "Optimal (Post-order Info Bubbling)",
          description: "### 🧠 The Core Concept\nEach node returns: `(isValid, size, min, max)`. A node is a BST if its left and right subtrees are BSTs AND its value is within their min/max bounds.",
          timeComplexity: "O(N)",
          spaceComplexity: "O(H)",
          implementations: [
             { language: "JavaScript", code: "function largestBST(root) {\n    let res = 0;\n    function traverse(node) {\n        if(!node) return [true, 0, Infinity, -Infinity];\n        let [lVal, lSize, lMin, lMax] = traverse(node.left);\n        let [rVal, rSize, rMin, rMax] = traverse(node.right);\n        if(lVal && rVal && node.val > lMax && node.val < rMin) {\n            let size = 1 + lSize + rSize;\n            res = Math.max(res, size);\n            return [true, size, Math.min(node.val, lMin), Math.max(node.val, rMax)];\n        }\n        return [false, 0, 0, 0];\n    }\n    traverse(root);\n    return res;\n}" }
          ]
       }
    ]
  }
];
