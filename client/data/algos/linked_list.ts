import { AlgorithmEntry } from "./types";

export const linkedListAlgorithms: AlgorithmEntry[] = [
  {
    id: "reverse-linked-list",
    title: "Reverse a LinkedList",
    topic: "LinkedList - Medium",
    category: "Linked Lists",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Reverse a singly linked list in-place.",
    leetcodeLink: "https://leetcode.com/problems/reverse-linked-list/",
    useCases: ["Undo functionality", "Palindrome checking in lists"],
    approaches: [
       {
          name: "Optimal (Iterative 3-Pointers)",
          description: "### 🧠 The Core Concept\nImagine you have a line of people holding hands, pointing to the person in front of them. You want to flip the line so everyone points backwards.\n\nIf the first person just drops their hand and points backward, they lose the connection to the rest of the line forever and the line is broken!\n\n### 🛠️ Execution Strategy\nTo flip the pointers safely, we need exactly 3 trackers:\n1. **`prev`**: Points to the node we have *already processed* (starts as `null`).\n2. **`curr`**: Points to the node we are *currently flipping*.\n3. **`next`**: Temporarily holds the rest of the line before we sever the connection!\n\n**The Loop:**\n- `next_node = curr.next` (Save the rest of the line!)\n- `curr.next = prev` (SNAP! Flip the pointer backward!)\n- `prev = curr` (Shift `prev` forward)\n- `curr = next_node` (Shift `curr` forward into the saved line)\n\nRepeat until the absolute end!",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1)",
          implementations: [
             {
                language: "Python",
                code: "# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev"
             },
             {
                language: "JavaScript",
                code: "function reverseList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr !== null) {\n        let nextNode = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextNode;\n    }\n    return prev;\n}"
             },
             {
                language: "Java",
                code: "class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n        while(curr != null) {\n            ListNode nextNode = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = nextNode;\n        }\n        return prev;\n    }\n}"
             },
             {
                language: "C++",
                code: "ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while(curr != nullptr) {\n        ListNode* nextNode = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nextNode;\n    }\n    return prev;\n}"
             }
          ]
       }
    ]
  }
];
