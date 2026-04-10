const fs = require('fs');
const path = require('path');

const csvData = `Step,Topic,Difficulty,Problem Name
1,Basic Basics - Things to Know,Easy,User Input / Output
1,Basic Basics - Things to Know,Easy,Data Types
1,Basic Basics - Things to Know,Easy,If Else statements
1,Basic Basics - Things to Know,Easy,Switch Statement
1,Basic Basics - Things to Know,Easy,For loops & while loops
1,Basic Basics - Patterns,Easy,Pattern Printing (Patterns 1 to 22)
1,Basic Basics - Basic Math,Easy,Count Digits
1,Basic Basics - Basic Math,Easy,Reverse a Number
1,Basic Basics - Basic Math,Easy,Check Palindrome
1,Basic Basics - Basic Math,Easy,GCD Or HCF
1,Basic Basics - Basic Math,Easy,Armstrong Numbers
1,Basic Basics - Basic Math,Easy,Print all Divisors
1,Basic Basics - Basic Math,Easy,Check for Prime
1,Basic Basics - Basic Recursion,Easy,Understand recursion by printing something N times
1,Basic Basics - Basic Recursion,Easy,Print 1 to N using recursion
1,Basic Basics - Basic Recursion,Easy,Print N to 1 using recursion
1,Basic Basics - Basic Recursion,Easy,Sum of first N numbers
1,Basic Basics - Basic Recursion,Easy,Factorial of N numbers
1,Basic Basics - Basic Recursion,Easy,Reverse an array
1,Basic Basics - Basic Recursion,Easy,Check if a string is palindrome or not
1,Basic Basics - Basic Recursion,Easy,Fibonacci Number
1,Basic Basics - Basic Hashing,Easy,Counting frequencies of array elements
1,Basic Basics - Basic Hashing,Easy,Find the highest/lowest frequency element
2,Sorting - Sorting I,Easy,Selection Sort
2,Sorting - Sorting I,Easy,Bubble Sort
2,Sorting - Sorting I,Easy,Insertion Sort
2,Sorting - Sorting II,Medium,Merge Sort
2,Sorting - Sorting II,Medium,Recursive Bubble Sort
2,Sorting - Sorting II,Medium,Recursive Insertion Sort
2,Sorting - Sorting II,Medium,Quick Sort
3,Arrays - Easy,Easy,Largest Element in an Array
3,Arrays - Easy,Easy,Second Largest Element in an Array without sorting
3,Arrays - Easy,Easy,Check if the array is sorted
3,Arrays - Easy,Easy,Remove Duplicates from Sorted Array
3,Arrays - Easy,Easy,Left Rotate an array by one place
3,Arrays - Easy,Easy,Left rotate an array by D places
3,Arrays - Easy,Easy,Move Zeroes to end
3,Arrays - Easy,Easy,Linear Search
3,Arrays - Easy,Medium,Find the Union
3,Arrays - Easy,Easy,Find missing number in an array
3,Arrays - Easy,Easy,Maximum Consecutive Ones
3,Arrays - Easy,Medium,Find the number that appears once
3,Arrays - Easy,Medium,Longest subarray with given sum K (positives)
3,Arrays - Easy,Medium,Longest subarray with given sum K (Positives + Negatives)
3,Arrays - Medium,Medium,Two Sum
3,Arrays - Medium,Medium,Sort an array of 0's 1's and 2's
3,Arrays - Medium,Medium,Majority Element (>N/2 times)
3,Arrays - Medium,Medium,Kadane's Algorithm (Maximum Subarray Sum)
3,Arrays - Medium,Medium,Print subarray with maximum sum
3,Arrays - Medium,Medium,Best time to buy and sell stock
3,Arrays - Medium,Medium,Rearrange array elements by sign
3,Arrays - Medium,Medium,Next Permutation
3,Arrays - Medium,Medium,Leaders in an Array
3,Arrays - Medium,Medium,Longest Consecutive Sequence
3,Arrays - Medium,Medium,Set Matrix Zeroes
3,Arrays - Medium,Medium,Rotate Matrix by 90 degrees
3,Arrays - Medium,Medium,Print the matrix in spiral manner
3,Arrays - Medium,Medium,Count subarrays with given sum
3,Arrays - Hard,Hard,Pascal's Triangle
3,Arrays - Hard,Hard,Majority Element (>N/3 times)
3,Arrays - Hard,Hard,3 Sum
3,Arrays - Hard,Hard,4 Sum
3,Arrays - Hard,Hard,Largest Subarray with 0 Sum
3,Arrays - Hard,Hard,Count number of subarrays with given XOR K
3,Arrays - Hard,Hard,Merge Overlapping Subintervals
3,Arrays - Hard,Hard,Merge two sorted arrays without extra space
3,Arrays - Hard,Hard,Find the repeating and missing number
3,Arrays - Hard,Hard,Count Inversions
3,Arrays - Hard,Hard,Reverse Pairs
3,Arrays - Hard,Hard,Maximum Product Subarray
4,Binary Search - 1D Arrays,Easy,Binary Search to find X in sorted array
4,Binary Search - 1D Arrays,Easy,Implement Lower Bound
4,Binary Search - 1D Arrays,Easy,Implement Upper Bound
4,Binary Search - 1D Arrays,Easy,Search Insert Position
4,Binary Search - 1D Arrays,Medium,Floor/Ceil in Sorted Array
4,Binary Search - 1D Arrays,Medium,First or Last occurrence of a number
4,Binary Search - 1D Arrays,Medium,Count occurrences of a number in a sorted array
4,Binary Search - 1D Arrays,Medium,Search in Rotated Sorted Array I
4,Binary Search - 1D Arrays,Medium,Search in Rotated Sorted Array II
4,Binary Search - 1D Arrays,Medium,Find minimum in Rotated Sorted Array
4,Binary Search - 1D Arrays,Easy,Find out how many times array has been rotated
4,Binary Search - 1D Arrays,Medium,Single element in a sorted array
4,Binary Search - 1D Arrays,Medium,Find peak element
4,Binary Search - Answers,Medium,Find square root of a number in log n
4,Binary Search - Answers,Medium,Find the Nth root of a number
4,Binary Search - Answers,Medium,Koko Eating Bananas
4,Binary Search - Answers,Medium,Minimum days to make M bouquets
4,Binary Search - Answers,Medium,Find the smallest Divisor Given a Threshold
4,Binary Search - Answers,Medium,Capacity to Ship Packages within D Days
4,Binary Search - Answers,Hard,Kth Missing Positive Number
4,Binary Search - Answers,Hard,Aggressive Cows
4,Binary Search - Answers,Hard,Book Allocation Problem
4,Binary Search - Answers,Hard,Split Array - Largest Sum
4,Binary Search - Answers,Hard,Painter's Partition Problem
4,Binary Search - Answers,Hard,Minimize Max Distance to Gas Station
4,Binary Search - Answers,Hard,Median of two sorted arrays
4,Binary Search - Answers,Hard,K-th element of two sorted arrays
4,Binary Search - 2D Arrays,Medium,Find the row with maximum number of 1s
4,Binary Search - 2D Arrays,Medium,Search in a 2D matrix
4,Binary Search - 2D Arrays,Medium,Search in a 2D matrix II
4,Binary Search - 2D Arrays,Medium,Find Peak Element (2D Matrix)
4,Binary Search - 2D Arrays,Hard,Median in a row-wise sorted Matrix
5,Strings - Basic,Easy,Remove outermost Parenthesis
5,Strings - Basic,Easy,Reverse words in a given string
5,Strings - Basic,Medium,Largest odd number in a string
5,Strings - Basic,Medium,Longest Common Prefix
5,Strings - Basic,Easy,Isomorphic Strings
5,Strings - Basic,Easy,Check if two strings are anagram of each other
5,Strings - Basic,Easy,Rotate String
5,Strings - Medium,Medium,Sort Characters by frequency
5,Strings - Medium,Medium,Maximum Nesting Depth of Parentheses
5,Strings - Medium,Medium,Roman Number to Integer
5,Strings - Medium,Medium,Implement Atoi
5,Strings - Medium,Medium,Count number of substrings
5,Strings - Medium,Medium,Longest Palindromic Substring
5,Strings - Medium,Medium,Sum of Beauty of All Substrings
5,Strings - Medium,Medium,Reverse Every Word in a String
6,LinkedList - 1D LL,Easy,Introduction to LinkedList (Insert/Delete)
6,LinkedList - 1D LL,Easy,Insert a node in LinkedList
6,LinkedList - 1D LL,Easy,Delete a node in LinkedList
6,LinkedList - 1D LL,Easy,Find the length of the linkedlist
6,LinkedList - 1D LL,Easy,Search an element in the LL
6,LinkedList - Doubly LL,Easy,Introduction to Doubly LinkedList
6,LinkedList - Doubly LL,Easy,Insert a node in DLL
6,LinkedList - Doubly LL,Easy,Delete a node in DLL
6,LinkedList - Doubly LL,Easy,Reverse a Doubly LinkedList
6,LinkedList - Medium,Medium,Middle of a LinkedList
6,LinkedList - Medium,Medium,Reverse a LinkedList
6,LinkedList - Medium,Medium,Detect a loop in LL
6,LinkedList - Medium,Medium,Find the starting point in LL
6,LinkedList - Medium,Medium,Length of Loop in LL
6,LinkedList - Medium,Medium,Check if LL is palindrome or not
6,LinkedList - Medium,Medium,Segregate even and odd nodes in LL
6,LinkedList - Medium,Medium,Remove Nth node from the back of the LL
6,LinkedList - Medium,Medium,Delete the middle node of LL
6,LinkedList - Medium,Medium,Sort LL
6,LinkedList - Medium,Medium,Sort a LL of 0's 1's and 2's
6,LinkedList - Medium,Medium,Find the intersection point of Y LL
6,LinkedList - Medium,Medium,Add 1 to a number represented by LL
6,LinkedList - Medium,Medium,Add two numbers represented by LL
6,LinkedList - Hard,Hard,Reverse LL in groups of size K
6,LinkedList - Hard,Hard,Rotate a LL
6,LinkedList - Hard,Hard,Flattening of LL
6,LinkedList - Hard,Hard,Clone a Linked List with random and next pointer
7,Recursion - Subsequences,Medium,Generate all binary strings
7,Recursion - Subsequences,Medium,Generate Parentheses
7,Recursion - Subsequences,Medium,Print all subsequences
7,Recursion - Subsequences,Medium,Learn All Patterns of Subsequences
7,Recursion - Subsequences,Medium,Count all subsequences with sum K
7,Recursion - Subsequences,Medium,Check if there exists a subsequence with sum K
7,Recursion - Subsequences,Medium,Combination Sum I
7,Recursion - Subsequences,Medium,Combination Sum II
7,Recursion - Subsequences,Medium,Subset Sum I
7,Recursion - Subsequences,Medium,Subset Sum II
7,Recursion - Subsequences,Medium,Combination Sum III
7,Recursion - Subsequences,Medium,Letter Combinations of a Phone number
7,Recursion - Hard,Hard,Palindrome Partitioning
7,Recursion - Hard,Hard,Word Search
7,Recursion - Hard,Hard,N Queens
7,Recursion - Hard,Hard,Rat in a Maze
7,Recursion - Hard,Hard,Word Break
7,Recursion - Hard,Hard,M Coloring Problem
7,Recursion - Hard,Hard,Sudoku Solver
7,Recursion - Hard,Hard,Expression Add Operators
8,Bit Manipulation - Basics,Easy,Introduction to Bit Manipulation
8,Bit Manipulation - Basics,Easy,Check if a number is odd or not
8,Bit Manipulation - Basics,Easy,Check if i-th bit is set or not
8,Bit Manipulation - Basics,Easy,Set the i-th bit
8,Bit Manipulation - Basics,Easy,Clear the i-th bit
8,Bit Manipulation - Basics,Easy,Toggle the i-th bit
8,Bit Manipulation - Basics,Easy,Remove the last set bit
8,Bit Manipulation - Basics,Easy,Check if a number is power of 2
8,Bit Manipulation - Basics,Medium,Count total set bits
8,Bit Manipulation - Interview,Medium,Minimum bit flips to convert number
8,Bit Manipulation - Interview,Medium,Single Number I
8,Bit Manipulation - Interview,Medium,Single Number II
8,Bit Manipulation - Interview,Medium,Single Number III
8,Bit Manipulation - Interview,Medium,XOR of numbers in a given range
8,Bit Manipulation - Advanced,Hard,Find XOR of numbers from L to R
9,Stack and Queues - Basics,Easy,Implement Stack using Arrays
9,Stack and Queues - Basics,Easy,Implement Queue using Arrays
9,Stack and Queues - Basics,Easy,Implement Stack using Queue
9,Stack and Queues - Basics,Easy,Implement Queue using Stack
9,Stack and Queues - Basics,Easy,Implement Stack using Linked List
9,Stack and Queues - Basics,Easy,Implement Queue using Linked List
9,Stack and Queues - Basics,Easy,Check for balanced parentheses
9,Stack and Queues - Basics,Easy,Min Stack
9,Stack and Queues - Conversions,Medium,Infix to Postfix Conversion
9,Stack and Queues - Conversions,Medium,Prefix to Infix Conversion
9,Stack and Queues - Conversions,Medium,Prefix to Postfix Conversion
9,Stack and Queues - Conversions,Medium,Postfix to Prefix Conversion
9,Stack and Queues - Conversions,Medium,Postfix to Infix Conversion
9,Stack and Queues - Monotonic,Medium,Next Greater Element
9,Stack and Queues - Monotonic,Medium,Next Greater Element II
9,Stack and Queues - Monotonic,Medium,Next Smaller Element
9,Stack and Queues - Monotonic,Medium,Number of NGEs to the right
9,Stack and Queues - Monotonic,Medium,Trapping Rainwater
9,Stack and Queues - Monotonic,Medium,Sum of Subarray Minimums
9,Stack and Queues - Monotonic,Hard,Asteroid Collision
9,Stack and Queues - Monotonic,Hard,Sum of subarray ranges
9,Stack and Queues - Monotonic,Hard,Remove K Digits
9,Stack and Queues - Monotonic,Hard,Largest Rectangle in Histogram
9,Stack and Queues - Monotonic,Hard,Maximal Rectangle
9,Stack and Queues - Implementation,Hard,Sliding Window Maximum
9,Stack and Queues - Implementation,Hard,Stock Span Problem
9,Stack and Queues - Implementation,Hard,The Celebrity Problem
9,Stack and Queues - Implementation,Hard,LRU Cache
9,Stack and Queues - Implementation,Hard,LFU Cache
10,Sliding Window - Medium,Medium,Longest Substring Without Repeating Characters
10,Sliding Window - Medium,Medium,Max Consecutive Ones III
10,Sliding Window - Medium,Medium,Fruit Into Baskets
10,Sliding Window - Medium,Medium,Longest Repeating Character Replacement
10,Sliding Window - Medium,Medium,Binary Subarrays With Sum
10,Sliding Window - Medium,Medium,Count Number of Nice Subarrays
10,Sliding Window - Medium,Medium,Number of Substrings Containing All Three Characters
10,Sliding Window - Medium,Medium,Maximum Points You Can Obtain from Cards
10,Sliding Window - Hard,Hard,Longest Substring with At Most K Distinct Characters
10,Sliding Window - Hard,Hard,Subarrays with K Different Integers
10,Sliding Window - Hard,Hard,Minimum Window Substring
10,Sliding Window - Hard,Hard,Minimum Window Subsequence
11,Heaps - Basics,Easy,Introduction to Priority Queues using Binary Heaps
11,Heaps - Basics,Easy,Min Heap and Max Heap Implementation
11,Heaps - Basics,Easy,Check if an array is a min-heap
11,Heaps - Medium,Medium,Kth Largest Element in an Array
11,Heaps - Medium,Medium,Kth Smallest Element in an Array
11,Heaps - Medium,Medium,Sort K-sorted array
11,Heaps - Medium,Medium,Replace elements by its rank in the array
11,Heaps - Medium,Medium,Task Scheduler
11,Heaps - Medium,Medium,Hand of Straights
11,Heaps - Hard,Hard,Design Twitter
11,Heaps - Hard,Hard,Kth Largest Element in a Stream
11,Heaps - Hard,Hard,Maximum Sum Combinations
11,Heaps - Hard,Hard,Find Median from Data Stream
11,Heaps - Hard,Hard,Merge K Sorted Lists
12,Greedy Algorithms,Easy,Assign Cookies
12,Greedy Algorithms,Easy,Fractional Knapsack
12,Greedy Algorithms,Easy,Find minimum number of coins
12,Greedy Algorithms,Easy,Lemonade Change
12,Greedy Algorithms,Easy,Valid Parenthesis String
12,Greedy Algorithms,Medium,N meetings in one room
12,Greedy Algorithms,Medium,Jump Game I
12,Greedy Algorithms,Medium,Jump Game II
12,Greedy Algorithms,Medium,Minimum number of platforms required for a railway
12,Greedy Algorithms,Medium,Job Sequencing Problem
12,Greedy Algorithms,Medium,Candy
12,Greedy Algorithms,Hard,Insert Interval
12,Greedy Algorithms,Hard,Merge Intervals
12,Greedy Algorithms,Hard,Non-overlapping Intervals
13,Binary Trees - Traversals,Easy,Introduction to Trees
13,Binary Trees - Traversals,Easy,Binary Tree Representation in C++
13,Binary Trees - Traversals,Easy,Preorder Traversal
13,Binary Trees - Traversals,Easy,Inorder Traversal
13,Binary Trees - Traversals,Easy,Postorder Traversal
13,Binary Trees - Traversals,Medium,Level Order Traversal
13,Binary Trees - Traversals,Medium,Iterative Preorder
13,Binary Trees - Traversals,Medium,Iterative Inorder
13,Binary Trees - Traversals,Hard,Iterative Postorder (using 2 stacks)
13,Binary Trees - Traversals,Hard,Iterative Postorder (using 1 stack)
13,Binary Trees - Traversals,Hard,Preorder Inorder Postorder in a single traversal
13,Binary Trees - Medium,Medium,Maximum Depth of Binary Tree
13,Binary Trees - Medium,Medium,Check if a tree is balanced or not
13,Binary Trees - Medium,Medium,Diameter of Binary Tree
13,Binary Trees - Medium,Medium,Maximum Path Sum
13,Binary Trees - Medium,Medium,Check if two trees are identical or not
13,Binary Trees - Medium,Medium,Zig Zag Traversal
13,Binary Trees - Medium,Medium,Boundary Traversal
13,Binary Trees - Medium,Medium,Vertical Order Traversal
13,Binary Trees - Medium,Medium,Top View of Binary Tree
13,Binary Trees - Medium,Medium,Bottom View of Binary Tree
13,Binary Trees - Medium,Medium,Right/Left View of Binary Tree
13,Binary Trees - Medium,Medium,Symmetric Binary Tree
13,Binary Trees - Hard,Hard,Root to Node Path
13,Binary Trees - Hard,Hard,LCA in Binary Tree
13,Binary Trees - Hard,Hard,Maximum width of a Binary Tree
13,Binary Trees - Hard,Hard,Check for Children Sum Property
13,Binary Trees - Hard,Hard,Print all the Nodes at a distance of K in a Binary Tree
13,Binary Trees - Hard,Hard,Minimum time taken to BURN the Binary Tree
13,Binary Trees - Hard,Hard,Count total Nodes in a COMPLETE Binary Tree
13,Binary Trees - Hard,Hard,Construct Binary Tree from inorder and preorder
13,Binary Trees - Hard,Hard,Construct Binary Tree from Inorder and Postorder
13,Binary Trees - Hard,Hard,Serialize and deserialize Binary Tree
13,Binary Trees - Hard,Hard,Morris Preorder Traversal
13,Binary Trees - Hard,Hard,Morris Inorder Traversal
13,Binary Trees - Hard,Hard,Flatten Binary Tree to LinkedList
14,Binary Search Trees,Easy,Search in a BST
14,Binary Search Trees,Easy,Find Min/Max in BST
14,Binary Search Trees,Medium,Ceil in a BST
14,Binary Search Trees,Medium,Floor in a BST
14,Binary Search Trees,Medium,Insert a given Node in BST
14,Binary Search Trees,Medium,Delete a Node in BST
14,Binary Search Trees,Medium,Kth Smallest Element in a BST
14,Binary Search Trees,Medium,Check if a tree is a BST or not
14,Binary Search Trees,Medium,LCA in Binary Search Tree
14,Binary Search Trees,Medium,Construct a BST from a preorder traversal
14,Binary Search Trees,Medium,Inorder Successor/Predecessor in BST
14,Binary Search Trees,Medium,Binary Search Tree Iterator
14,Binary Search Trees,Hard,Two Sum In BST | Check if there exists a pair with Sum K
14,Binary Search Trees,Hard,Recover BST
14,Binary Search Trees,Hard,Largest BST in Binary Tree
15,Graphs - Learning,Easy,Graph and Types
15,Graphs - Learning,Easy,Graph Representation in C++ | Java
15,Graphs - Learning,Easy,Connected Components
15,Graphs - Traversals,Medium,BFS
15,Graphs - Traversals,Medium,DFS
15,Graphs - Traversals,Medium,Number of Provinces
15,Graphs - Traversals,Medium,Rotting Oranges
15,Graphs - Traversals,Medium,Flood Fill
15,Graphs - Traversals,Medium,Cycle Detection in Undirected Graph (BFS/DFS)
15,Graphs - Traversals,Medium,01 Matrix (Bipartite Graph)
15,Graphs - Traversals,Medium,Surrounded Regions
15,Graphs - Traversals,Medium,Number of Enclaves
15,Graphs - Traversals,Medium,Word Ladder I
15,Graphs - Traversals,Medium,Word Ladder II
15,Graphs - Topo Sort,Medium,Topological Sort
15,Graphs - Topo Sort,Medium,Kahn's Algorithm
15,Graphs - Topo Sort,Medium,Cycle Detection in Directed Graph
15,Graphs - Topo Sort,Medium,Course Schedule I
15,Graphs - Topo Sort,Medium,Course Schedule II
15,Graphs - Topo Sort,Medium,Find Eventual Safe States
15,Graphs - Topo Sort,Hard,Alien Dictionary
15,Graphs - Shortest Path,Medium,Shortest Path in Directed Acyclic Graph
15,Graphs - Shortest Path,Medium,Shortest Path in Undirected Graph with Unit Weights
15,Graphs - Shortest Path,Medium,Dijkstra's Algorithm
15,Graphs - Shortest Path,Medium,Shortest Path in Weighted undirected graph
15,Graphs - Shortest Path,Medium,Shortest Distance in a Binary Maze
15,Graphs - Shortest Path,Medium,Path With Minimum Effort
15,Graphs - Shortest Path,Hard,Cheapest Flights Within K Stops
15,Graphs - Shortest Path,Hard,Network Delay Time
15,Graphs - Shortest Path,Hard,Number of Ways to Arrive at Destination
15,Graphs - Shortest Path,Hard,Minimum Multiplications to reach End
15,Graphs - Shortest Path,Hard,Bellman Ford Algorithm
15,Graphs - Shortest Path,Hard,Floyd Warshall Algorithm
15,Graphs - MST,Hard,Prim's Algorithm
15,Graphs - MST,Hard,Disjoint Set (Union by Rank & Size)
15,Graphs - MST,Hard,Kruskal's Algorithm
15,Graphs - MST,Hard,Number of Operations to Make Network Connected
15,Graphs - MST,Hard,Most Stones Removed with Same Row or Column
15,Graphs - MST,Hard,Accounts Merge
15,Graphs - MST,Hard,Number of Islands II
15,Graphs - MST,Hard,Making A Large Island
15,Graphs - MST,Hard,Swim in Rising Water
15,Graphs - Other,Hard,Bridges in Graph (Tarjan's Algorithm)
15,Graphs - Other,Hard,Articulation Point
15,Graphs - Other,Hard,Kosaraju's Algorithm (Strongly Connected Components)
16,Dynamic Programming - 1D DP,Medium,Climbing Stairs
16,Dynamic Programming - 1D DP,Medium,Frog Jump
16,Dynamic Programming - 1D DP,Medium,Frog Jump with k distances
16,Dynamic Programming - 1D DP,Medium,Maximum sum of non-adjacent elements
16,Dynamic Programming - 1D DP,Medium,House Robber
16,Dynamic Programming - 2D/3D DP,Medium,Ninja's Training
16,Dynamic Programming - 2D/3D DP,Medium,Grid Unique Paths
16,Dynamic Programming - 2D/3D DP,Medium,Unique Paths II
16,Dynamic Programming - 2D/3D DP,Medium,Minimum path sum in Grid
16,Dynamic Programming - 2D/3D DP,Medium,Triangle
16,Dynamic Programming - 2D/3D DP,Medium,Minimum Falling Path Sum
16,Dynamic Programming - 2D/3D DP,Hard,Cherry Pickup II (3D DP)
16,Dynamic Programming - Subsequences,Medium,Subset Sum Equal to K
16,Dynamic Programming - Subsequences,Medium,Partition Equal Subset Sum
16,Dynamic Programming - Subsequences,Medium,Partition a set into two subsets with minimum absolute sum difference
16,Dynamic Programming - Subsequences,Medium,Count Subsets with Sum K
16,Dynamic Programming - Subsequences,Medium,Count Partitions with Given Difference
16,Dynamic Programming - Subsequences,Medium,0/1 Knapsack
16,Dynamic Programming - Subsequences,Medium,Minimum Coins
16,Dynamic Programming - Subsequences,Medium,Target Sum
16,Dynamic Programming - Subsequences,Medium,Coin Change 2
16,Dynamic Programming - Subsequences,Medium,Unbounded Knapsack
16,Dynamic Programming - Subsequences,Medium,Rod Cutting Problem
16,Dynamic Programming - Strings,Medium,Longest Common Subsequence
16,Dynamic Programming - Strings,Medium,Print Longest Common Subsequence
16,Dynamic Programming - Strings,Medium,Longest Common Substring
16,Dynamic Programming - Strings,Medium,Longest Palindromic Subsequence
16,Dynamic Programming - Strings,Medium,Minimum insertions to make string palindrome
16,Dynamic Programming - Strings,Medium,Minimum insertions/deletions to convert String A to String B
16,Dynamic Programming - Strings,Hard,Shortest Common Supersequence
16,Dynamic Programming - Strings,Hard,Distinct Subsequences
16,Dynamic Programming - Strings,Hard,Edit Distance
16,Dynamic Programming - Strings,Hard,Wildcard Matching
16,Dynamic Programming - Stocks,Medium,Best Time to Buy and Sell Stock
16,Dynamic Programming - Stocks,Medium,Best Time to Buy and Sell Stock II
16,Dynamic Programming - Stocks,Hard,Best Time to Buy and Sell Stock III
16,Dynamic Programming - Stocks,Hard,Best Time to Buy and Sell Stock IV
16,Dynamic Programming - Stocks,Medium,Best Time to Buy and Sell Stock with Cooldown
16,Dynamic Programming - Stocks,Medium,Best Time to Buy and Sell Stock with Transaction Fee
16,Dynamic Programming - LIS,Medium,Longest Increasing Subsequence
16,Dynamic Programming - LIS,Medium,Print Longest Increasing Subsequence
16,Dynamic Programming - LIS,Medium,Longest Increasing Subsequence (Binary Search)
16,Dynamic Programming - LIS,Medium,Largest Divisible Subset
16,Dynamic Programming - LIS,Medium,Longest String Chain
16,Dynamic Programming - LIS,Hard,Longest Bitonic Subsequence
16,Dynamic Programming - LIS,Hard,Number of Longest Increasing Subsequences
16,Dynamic Programming - MCM DP,Hard,Matrix Chain Multiplication
16,Dynamic Programming - MCM DP,Hard,Minimum cost to cut the stick
16,Dynamic Programming - MCM DP,Hard,Burst Balloons
16,Dynamic Programming - MCM DP,Hard,Evaluate Boolean Expression to True
16,Dynamic Programming - MCM DP,Hard,Palindrome Partitioning II
16,Dynamic Programming - MCM DP,Hard,Partition Array for Maximum Sum
17,Tries,Medium,Implement Trie (Prefix Tree)
17,Tries,Medium,Implement Trie II
17,Tries,Medium,Longest Word with All Prefixes
17,Tries,Medium,Number of Distinct Substrings in a String
17,Tries,Hard,Bit PreRequisites for Tries
17,Tries,Hard,Maximum XOR of Two Numbers in an Array
17,Tries,Hard,Maximum XOR With an Element From Array`;

const SKIP_LIST = [
  "Two Sum",
  "Kadane's Algorithm",
  "Binary Search",
  "Check Palindrome",
  "Check if two strings are anagram of each other",
  "Generate Parentheses",
  "Check if a tree is a BST or not",
  "Jump Game I",
  "Implement Trie (Prefix Tree)",
  "Merge Sort",
  "Next Greater Element",
  "Inorder Traversal",
  "Climbing Stairs",
  "Reverse a LinkedList",
  "BFS"
];

// Clean titles to match basic skip strings
function isSkipped(title) {
  for (const s of SKIP_LIST) {
     if (title.toLowerCase().includes(s.toLowerCase())) return true;
  }
  return false;
}

const lines = csvData.split('\n');
const items = [];

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  
  // Custom CSV parser handling quotes if any
  const parts = lines[i].split(',');
  const step = parts[0];
  const topic = parts[1];
  const difficulty = parts[2];
  const titleName = parts.slice(3).join(',').replace(/"/g, '').trim();

  if(isSkipped(titleName)) continue;

  const id = titleName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  items.push({
    id,
    title: titleName,
    topic,
    difficulty
  });
}

const tsContent = [
  'import { AlgorithmEntry } from "./types";',
  '',
  'export const generatedStriverAlgorithms: AlgorithmEntry[] = ['
].concat(items.map(item => [
  '  {',
  '    id: "' + item.id + '",',
  '    title: "' + item.title + '",',
  '    topic: "' + item.topic + '",',
  '    category: "' + item.topic.split(' - ')[0] + '",',
  '    frequencyLevel: "Medium",',
  '    difficulty: "' + item.difficulty + '",',
  '    overview: "This is a mass-ingested algorithmic placeholder for ' + item.title + '. The full interactive methodology and polyglot tracing code will be built in a future batch update.",',
  '    leetcodeLink: "",',
  '    useCases: ["Algorithmic Preparation"],',
  '    approaches: [',
  '       {',
  '          name: "Standard Implementation",',
  '          description: "### 🧠 Core Concept\\n\\nThe methodology and interactive tutorials for this problem will be rolled out via over-the-air updates. For now, you can implement your own solutions in the IDE.",',
  '          timeComplexity: "O(?)",',
  '          spaceComplexity: "O(?)",',
  '          implementations: [',
  '             {',
  '                language: "Python",',
  '                code: "# TODO: Implement ' + item.title + '\\n\\ndef solve():\\n    pass"',
  '             },',
  '             {',
  '                language: "JavaScript",',
  '                code: "// TODO: Implement ' + item.title + '\\n\\nfunction solve() {\\n    // logic\\n}"',
  '             },',
  '             {',
  '                language: "Java",',
  '                code: "// TODO: Implement ' + item.title + '\\nclass Solution {\\n    public void solve() {\\n\\n    }\\n}"',
  '             },',
  '             {',
  '                language: "C++",',
  '                code: "// TODO: Implement ' + item.title + '\\nvoid solve() {\\n    // logic\\n}"',
  '             }',
  '          ]',
  '       }',
  '    ]',
  '  }'
].join('\\n'))).join(',\\n') + '\\n];';

fs.writeFileSync(path.join(__dirname, '..', 'data', 'algos', 'generated_striver_algos.ts'), tsContent);

console.log("Successfully scaffolded " + items.length + " problems!");
