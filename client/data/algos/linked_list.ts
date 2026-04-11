import { AlgorithmEntry } from "./types";

export const linkedListAlgorithms: AlgorithmEntry[] = [
  {
    id: "reverse-linked-list",
    title: "Reverse a Linked List",
    topic: "Linked Lists - Basics",
    category: "Linked Lists",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Reverse a singly linked list so that the last node becomes the head and all pointers are reversed.",
    leetcodeLink: "https://leetcode.com/problems/reverse-linked-list/",
    useCases: ["Undo/Redo sequences", "Palindrome checking", "Memory management buffers"],
    approaches: [
       {
          name: "Optimal (Iterative 3-Pointers)",
          description: "### 🧠 The Core Concept\nImagine a series of people holding hands, pointing to the person in front. To flip the line, you can't just tell everyone to turn around at once or the 'line' will be lost. \n\nYou need a tracker for who was **behind** you (`prev`), who you are **currently** flipping (`curr`), and who is **ahead** of you (`next`).\n\n### 🛠️ Execution Strategy\n1. Initialize `prev = null` and `curr = head`.\n2. **The Flip**: While `curr` is not null:\n   - Save the rest of the list: `next_node = curr.next`.\n   - Flip the current pointer: `curr.next = prev`.\n   - Move forward: `prev = curr`, then `curr = next_node`.\n3. Return `prev` as the new head.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We traverse the entire list exactly once, performing constant time pointer swaps at each node.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only use three pointers regardless of list length, avoiding extra allocations.",
          implementations: [
             {
                language: "Python",
                code: "def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev"
             },
             {
                language: "JavaScript",
                code: "function reverseList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr !== null) {\n        let nextNode = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextNode;\n    }\n    return prev;\n}"
             },
             {
                language: "Java",
                code: "public ListNode reverseList(ListNode head) {\n    ListNode prev = null;\n    ListNode curr = head;\n    while (curr != null) {\n        ListNode nextNode = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextNode;\n    }\n    return prev;\n}"
             },
             {
                language: "C++",
                code: "ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr != nullptr) {\n        ListNode* nextNode = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nextNode;\n    }\n    return prev;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "linked-list-cycle",
    title: "Linked List Cycle Detection",
    topic: "Linked Lists - Pointers",
    category: "Linked Lists",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Determine if a linked list contains a cycle (a loop where a node points back to a previous node).",
    leetcodeLink: "https://leetcode.com/problems/linked-list-cycle/",
    useCases: ["Deadlock detection in OS", "Infinite redirect loops in routers", "Circular buffer validation"],
    approaches: [
       {
          name: "Optimal (Floyd's Tortoise & Hare)",
          description: "### 🧠 The Core Concept\nImagine two runners on a circular track. One runs twice as fast as the other. If the track is a straight line, the fast runner will just reach the end and disappear. \n\nHowever, if the track is a **circle**, the fast runner will eventually 'lap' the slow runner and they will collide! This is the core of **Floyd's Cycle-Finding Algorithm**.\n\n### 🛠️ Execution Strategy\n1. Initialize `slow` and `fast` pointers at the head.\n2. **The Chase**: While `fast` and `fast.next` are not null:\n   - Move `slow` forward by 1 step.\n   - Move `fast` forward by 2 steps.\n   - **Collision?**: If `slow == fast`, a cycle is mathematically guaranteed. Return `true`.\n3. **Dead End?**: If the loop terminates, the list is finite and has no cycle. Return `false`.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "In the worst case (no cycle), we traverse the list once. If a cycle exists, the fast runner will catch the slow runner in at most $N$ iterations.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only store two pointers, no matter how massive the list is.",
          implementations: [
             {
                language: "Python",
                code: "def hasCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False"
             },
             {
                language: "JavaScript",
                code: "function hasCycle(head) {\n    let slow = head, fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow === fast) return true;\n    }\n    return false;\n}"
             },
             {
                language: "Java",
                code: "public boolean hasCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) return true;\n    }\n    return false;\n}"
             },
             {
                language: "C++",
                code: "bool hasCycle(ListNode *head) {\n    ListNode *slow = head, *fast = head;\n    while (fast != NULL && fast.next != NULL) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    topic: "Linked Lists - Basics",
    category: "Linked Lists",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Merge two sorted linked lists into one single sorted list by splicing together nodes.",
    leetcodeLink: "https://leetcode.com/problems/merge-two-sorted-lists/",
    useCases: ["Merge Sort implementation", "Combining sorted database results", "Merging chronological log files"],
    approaches: [
       {
          name: "Optimal (Iterative with Dummy Node)",
          description: "### 🧠 The Core Concept\nImagine comparing two stacks of graded papers, both already sorted. You always pick the smaller top paper and place it on your new stack. \n\nTo simplify the code, we use a **Dummy Node**—a fake starting node. This saves us from writing complex 'if-statements' to handle the very first element of the new list.\n\n### 🛠️ Execution Strategy\n1. Create a `dummy` node and a `curr` tracker pointing to it.\n2. **The Comparison**: While both lists have nodes:\n   - Compare `list1.val` and `list2.val`.\n   - Attach the smaller node to `curr.next`.\n   - Move the pointer of the list you just took from, and move `curr` forward.\n3. **Clean Up**: If one list is finished but the other still has nodes, just attach the remainder (since it's already sorted).\n4. Return `dummy.next`.",
          timeComplexity: "O(N + M)",
          timeComplexityExplanation: "We iterate through the sum total of both lists exactly once.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We are reusing the existing nodes (splicing), not creating new ones. The dummy node is the only extra memory allocated.",
          implementations: [
             {
                language: "Python",
                code: "def mergeTwoLists(l1, l2):\n    dummy = ListNode()\n    curr = dummy\n    while l1 and l2:\n        if l1.val < l2.val:\n            curr.next = l1\n            l1 = l1.next\n        else:\n            curr.next = l2\n            l2 = l2.next\n        curr = curr.next\n    curr.next = l1 or l2\n    return dummy.next"
             },
             {
                language: "JavaScript",
                code: "function mergeTwoLists(l1, l2) {\n    let dummy = { next: null };\n    let curr = dummy;\n    while (l1 && l2) {\n        if (l1.val < l2.val) {\n            curr.next = l1;\n            l1 = l1.next;\n        } else {\n            curr.next = l2;\n            l2 = l2.next;\n        }\n        curr = curr.next;\n    }\n    curr.next = l1 || l2;\n    return dummy.next;\n}"
             },
             {
                language: "Java",
                code: "public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n    ListNode dummy = new ListNode(0);\n    ListNode curr = dummy;\n    while (l1 != null && l2 != null) {\n        if (l1.val < l2.val) {\n            curr.next = l1;\n            l1 = l1.next;\n        } else {\n            curr.next = l2;\n            l2 = l2.next;\n        }\n        curr = curr.next;\n    }\n    curr.next = (l1 != null) ? l1 : l2;\n    return dummy.next;\n}"
             },
             {
                language: "C++",
                code: "ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0);\n    ListNode* curr = &dummy;\n    while (l1 && l2) {\n        if (l1->val < l2->val) {\n            curr->next = l1;\n            l1 = l1->next;\n        } else {\n            curr->next = l2;\n            l2 = l2->next;\n        }\n        curr = curr->next;\n    }\n    curr->next = l1 ? l1 : l2;\n    return dummy.next;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "middle-of-a-linkedlist",
    title: "Middle of a LinkedList",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Find the middle node of a linked list. If there are two middle nodes, return the second one.",
    leetcodeLink: "https://leetcode.com/problems/middle-of-the-linked-list/",
    useCases: ["Dividing a list for Merge Sort", "Balanced data partitioning"],
    approaches: [
       {
          name: "Optimal (Fast & Slow Pointers)",
          description: "### 🧠 The Core Concept\nImagine two people running. One runs twice as fast as the other. When the fast runner reaches the finish line, the slow runner is exactly in the middle.\n\n### 🛠️ Execution Strategy\n1. Initialize `slow` and `fast` at `head`.\n2. While `fast` and `fast.next` are not null:\n   - `slow = slow.next`\n   - `fast = fast.next.next`\n3. Return `slow`.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We traverse the list once, with the fast pointer covering the entire length.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Only two pointers are used.",
          implementations: [
             { language: "Python", code: "def middleNode(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow" }
          ]
       }
    ]
  },
  {
    id: "check-if-ll-is-palindrome-or-not",
    title: "Palindrome LinkedList",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Determine if a linked list reads the same forward and backward.",
    leetcodeLink: "https://leetcode.com/problems/palindrome-linked-list/",
    useCases: ["Validation sequences", "Undo/Redo logic"],
    approaches: [
       {
          name: "Optimal (Reverse Second Half)",
          description: "### 🧠 The Core Concept\nTo check if a list is a palindrome without extra space, we:\n1. Find the middle.\n2. Reverse the second half of the list.\n3. Compare the first half and the reversed second half side-by-side.\n\n### 🛠️ Execution Strategy\n1. Use Fast/Slow pointers to find the middle.\n2. Reverse the list starting from the middle node.\n3. Compare nodes one by one. If any value differs, it's not a palindrome.\n4. (Optional) Reverse the second half back to restore the original list.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Finding the middle is O(N), reversing is O(N), and comparing is O(N).",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The list is modified in-place with a few pointers.",
          implementations: [
             {
                language: "JavaScript",
                code: "function isPalindrome(head) {\n    let slow = head, fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    \n    let prev = null, curr = slow;\n    while (curr) {\n        let next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    \n    let left = head, right = prev;\n    while (right) {\n        if (left.val !== right.val) return false;\n        left = left.next;\n        right = right.next;\n    }\n    return true;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "remove-nth-node-from-the-back-of-the-ll",
    title: "Remove Nth Node From Back",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    leetcodeLink: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    useCases: ["Session history management", "Circular buffer cleanup"],
    approaches: [
       {
          name: "Optimal (Maintain a Gap of N)",
          description: "### 🧠 The Core Concept\nIf you want to find the person N steps from the end, you can use two pointers with a 'gap' between them. \n\n1. Move the `fast` pointer $N$ steps ahead of the `slow` pointer.\n2. Move them both forward at the same speed. \n3. When `fast` hits the end, `slow` will be exactly at the node *before* the one you want to delete.\n\n### 🛠️ Execution Strategy\n1. Use a `dummy` node pointing to `head` (essential for cases where we delete the first node).\n2. Set `slow` and `fast` to `dummy`.\n3. Move `fast` forward $N$ times.\n4. Move both until `fast.next` is null.\n5. `slow.next = slow.next.next` to skip the target node.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Single pass through the list.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Two pointers used.",
          implementations: [
             {
                language: "Python",
                code: "def removeNthFromEnd(head, n):\n    dummy = ListNode(0, head)\n    slow = fast = dummy\n    for _ in range(n):\n        fast = fast.next\n    while fast.next:\n        slow = slow.next\n        fast = fast.next\n    slow.next = slow.next.next\n    return dummy.next"
             }
          ]
       }
    ]
  },
  {
    id: "sort-a-ll-of-0-s-1-s-and-2-s",
    title: "Sort LL of 0s, 1s, 2s",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Given a linked list of 0s, 1s and 2s, sort it.",
    leetcodeLink: "",
    useCases: ["Bucketing distinct priorities"],
    approaches: [
       {
          name: "Optimal (Three Dummy Chains)",
          description: "### 🧠 The Core Concept\nInstead of counting or swapping values, we create three separate lists: one for 0s, one for 1s, and one for 2s. We then link them together.\n\n### 🛠️ Execution Strategy\n1. Create 3 dummy nodes: `zeroD`, `oneD`, `twoD`.\n2. Iterate through the list. Move each node to its respective 'chain'.\n3. Link `zeroD.next` to the start of the 1s list, and `oneD.next` to the start of the 2s list.\n4. Set `twoTail.next = null` to terminate the list properly.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "Single pass distribution.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "No new nodes created, just re-linking existing ones.",
          implementations: [
             {
                language: "Python",
                code: "def segregate(head):\n    z_head = ListNode(-1); o_head = ListNode(-1); t_head = ListNode(-1)\n    zero = z_head; one = o_head; two = t_head\n    curr = head\n    while curr:\n        if curr.val == 0:\n            zero.next = curr; zero = zero.next\n        elif curr.val == 1:\n            one.next = curr; one = one.next\n        else:\n            two.next = curr; two = two.next\n        curr = curr.next\n    # Link chains\n    one.next = t_head.next\n    zero.next = o_head.next if o_head.next else t_head.next\n    two.next = None\n    return z_head.next"
             }
          ]
       }
    ]
  },
  {
    id: "add-1-to-a-number-represented-by-ll",
    title: "Add 1 to LL",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Represent a number using a linked list where each node is a digit. Add 1 to it.",
    leetcodeLink: "",
    useCases: ["Arbitrary precision arithmetic"],
    approaches: [
       {
          name: "Optimal (Recursive Backtracking)",
          description: "### 🧠 The Core Concept: The 'Bottom-Up' Approach\nAdding $1$ is easy at the tail of the list, but carries can propagate all the way back to the head (e.g., $999 \\to 1000$). Using recursion allows us to travel to the end first, add $1$, and handle 'carries' as we climb back up the recursive stack.\n\n### 🛠️ Execution Strategy\n1. Use a recursive function `addHelper(node)` that returns the **carry** (0 or 1).\n2. **Base Case**: If node is null, return 1 (this is the '+1' we are initially adding).\n3. **Climb Up**: Each node's value becomes `(current.val + carryFromNextNode) % 10`.\n4. **Final Step**: If the very first call returns a carry of 1, create a new head node.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We visit each node once on the way down and once on the way up the stack.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "The recursion stack will have $N$ frames for a list of length $N$.",
          implementations: [
             {
                language: "JavaScript",
                code: `function addOne(head) {
    let carry = addHelper(head);
    if (carry) {
        let newNode = new ListNode(1);
        newNode.next = head;
        return newNode;
    }
    return head;
}

function addHelper(node) {
    if (!node) return 1;
    let carry = addHelper(node.next);
    let sum = node.val + carry;
    node.val = sum % 10;
    return Math.floor(sum / 10);
}`
             }
          ]
       }
    ]

  },
  {
    id: "find-intersection-point-of-y-ll",
    title: "Intersection of Y LL",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Find the node where two singly linked lists intersect.",
    leetcodeLink: "https://leetcode.com/problems/intersection-of-two-linked-lists/",
    useCases: ["Data deduplication", "Shared resource detection"],
    approaches: [
       {
          name: "Optimal (The 'Infinite Loop' Sync Technique)",
          description: "### 🧠 The Core Concept: The 'Equalizer' Intuition\nIf two lists intersect, they share a common suffix. The only reason they wouldn't meet at the start is because of a length difference ($L1$ vs $L2$).\n\nBy having each pointer switch to the **other** list's head after finishing its own, both pointers will eventually travel exactly `L1 + L2 + IntersectionLength` steps. This mathematically synchronizes them at the intersection point!\n\n### 🛠️ Execution Strategy\n1. Start pointer `a` at `headA` and `b` at `headB`.\n2. **The Walk**: Move both by $1$ step.\n3. **The Switch**: If `a` hits null, redirect it to `headB`. If `b` hits null, redirect it to `headA`.\n4. **The Meeting**: The moment `a === b`, you've found the intersection.",
          timeComplexity: "O(N + M)",
          timeComplexityExplanation: "In the worst case, each pointer travels the length of both lists once.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Only two pointers are tracked.",
          implementations: [
             {
                language: "Python",
                code: `def getIntersectionNode(headA, headB):
    if not headA or not headB: return None
    a, b = headA, headB
    
    # In the second iteration, they will be synchronized
    while a != b:
        a = headB if a is None else a.next
        b = headA if b is None else b.next
        
    return a`
             }
          ]
       }
    ]

  },
  {
    id: "reverse-nodes-in-k-group",
    title: "Reverse in K-Group",
    topic: "LinkedList - Hard",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Reverse the nodes of a linked list k at a time and return its modified head.",
    leetcodeLink: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
    useCases: ["Batch processing in buffers", "Packet reordering logic"],
    approaches: [
       {
          name: "Optimal (Iterative Fragment Reversal)",
          description: "### 🧠 The Core Concept: Batch Reversal\nThis is a generalized version of 'Reverse a Linked List'. We divide the list into chunks of size $K$. If a chunk has at least $K$ nodes, we flip it. If it has fewer, we leave it untouched (based on LeetCode rules).\n\n### 🛠️ Execution Strategy\n1. **Count Nodes**: Check if there are $K$ nodes available.\n2. **Flip Phase**: Within a loop that runs $K$ times, perform standard 3-pointer reversal logic.\n3. **Recursive Link**: Connect the tail of the newly flipped group to the result of flipping the next group.\n4. **Persistence**: Use a `dummy` node to cleanly track the new head.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We visit every node exactly once during our processing loop.",
          spaceComplexity: "O(N/K) or O(1)",
          spaceComplexityExplanation: "Recursive implementations take $N/K$ stack space. Iterative versions can achieve $O(1)$.",
          implementations: [
             {
                language: "JavaScript",
                code: `function reverseKGroup(head, k) {
    if (!head || k === 1) return head;
    
    let dummy = new ListNode(0);
    dummy.next = head;
    let curr = dummy, nex = dummy, pre = dummy;
    let count = 0;
    
    while(curr.next) {
        curr = curr.next;
        count++;
    }
    
    while(count >= k) {
        curr = pre.next;
        nex = curr.next;
        for(let i = 1; i < k; i++) {
            curr.next = nex.next;
            nex.next = pre.next;
            pre.next = nex;
            nex = curr.next;
        }
        pre = curr;
        count -= k;
    }
    return dummy.next;
}`
             }
          ]
       }
    ]

  },
  {
    id: "flattening-of-ll",
    title: "Flattening of LL",
    topic: "LinkedList - Hard",
    category: "LinkedList",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Flatten a multi-level linked list where each node has a 'next' pointer and a 'bottom' pointer.",
    leetcodeLink: "",
    useCases: ["Sparse matrix storage", "Multi-dimensional sequence flattening"],
    approaches: [
       {
          name: "Optimal (Recursion + Merge Pattern)",
          description: "### 🧠 The Core Concept: The 'Column-by-Column' Strategy\nThink of the structure as multiple vertical linked lists (branches) coming off a horizontal main line. \n\nWe start from the last two vertical branches on the right and merge them into a single sorted branch. We then take this 'merged branch' and merge it with the branch to its left. We repeat this until only one giant vertical sorted list remains.\n\n### 🛠️ Step-by-Step Logic\n1. **Base Case**: If root or root.next is null, return root.\n2. **Recursion**: Recursively call `flatten` on `root.next`. This clears the right side.\n3. **Merge**: Combine the current `root` and the result of the recursive call using the 'Merge Two Sorted Lists' logic, but using the **bottom** pointer instead of **next**.",
          timeComplexity: "O(N * M)",
          timeComplexityExplanation: "Where $N$ is the number of vertical lists and $M$ is the average nodes per list.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Recursion stack depth equals the number of vertical lists.",
          implementations: [
             {
                language: "Python",
                code: `def merge(a, b):
    if not a: return b
    if not b: return a
    
    res = None
    if a.data < b.data:
        res = a
        res.bottom = merge(a.bottom, b)
    else:
        res = b
        res.bottom = merge(a, b.bottom)
    return res

def flatten(root):
    if not root or not root.next:
        return root
    
    # Recurse for the list on the right
    root.next = flatten(root.next)
    
    # Merge current list with the flattened right list
    root = merge(root, root.next)
    
    return root`
             }
          ]
       }
    ]

  },
  {
    id: "clone-a-linked-list-with-random-and-next-pointer",
    title: "Clone LL with Random Pointers",
    topic: "LinkedList - Hard",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Create a deep copy of a linked list where each node has a 'next' and 'random' pointer.",
    leetcodeLink: "https://leetcode.com/problems/copy-list-with-random-pointer/",
    useCases: ["Deep copying complex graph structures", "State persistence with pointers"],
    approaches: [
       {
          name: "Optimal (The 'DNA Splice' Strategy)",
          description: "### 🧠 The Core Concept: The 'Shadow Node' Analogy\nDirectly cloning nodes with random pointers is hard because the 'target' of a random pointer might not exist yet. \nInstead of using a Map ($O(N)$ space), we can 'splice' the copies directly into the original list!\n\n### 🛠️ Execution Strategy\n1. **Iteration 1**: Create a copy of each node and insert it between original nodes. \n   (e.g., $A \\to B$ becomes $A \\to A' \\to B \\to B'$).\n2. **Iteration 2**: Assign `random` pointers. `A'.random` is simply `A.random.next`.\n3. **Iteration 3**: 'Unweave' the lists to restore the original and extract the clone.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We make three distinct linear passes: one to double the list, one for random pointers, and one to extract.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We don't use any auxiliary storage like a Hash Map; we use the existing list structure temporarily.",
          implementations: [
             {
                language: "JavaScript",
                code: `function copyRandomList(head) {
    if (!head) return null;
    
    // 1. Double the list
    let curr = head;
    while(curr) {
        let copy = new Node(curr.val, curr.next, null);
        curr.next = copy;
        curr = copy.next;
    }
    
    // 2. Assign random pointers
    curr = head;
    while(curr) {
        if(curr.random) curr.next.random = curr.random.next;
        curr = curr.next.next;
    }
    
    // 3. Unweave
    let dummy = new Node(0);
    let copyIter = dummy;
    curr = head;
    while(curr) {
        copyIter.next = curr.next;
        curr.next = curr.next.next;
        copyIter = copyIter.next;
        curr = curr.next;
    }
    return dummy.next;
}`
             }
          ]
       }
    ]

  }
];
