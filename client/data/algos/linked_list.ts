import { AlgorithmEntry } from "./types";

export const linkedListAlgorithms: AlgorithmEntry[] = [
  {
    id: "reverse-linked-list",
    title: "Reverse a Linked List",
    topic: "Linked Lists - Basics",
    category: "Linked Lists",
    frequencyLevel: "Highest",
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
  }
];
