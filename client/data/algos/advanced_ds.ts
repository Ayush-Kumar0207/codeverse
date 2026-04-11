import { AlgorithmEntry } from "./types";

export const advancedDsAlgorithms: AlgorithmEntry[] = [
  {
    id: "disjoint-set-union-by-rank-size",
    title: "Disjoint Set Union (DSU)",
    topic: "Advanced Data Structures",
    category: "Connectivity",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "A data structure that tracks a set of elements partitioned into several disjoint (non-overlapping) subsets.",
    leetcodeLink: "",
    useCases: ["Kruskal's MST", "Checking connectivity in dynamic graphs", "Finding cycles in undirected graphs"],
    approaches: [
       {
          name: "Optimal (Path Compression + Union by Rank/Size)",
          description: "### 🧠 The Core Concept\nWe treat each set as a tree. To find which set an element belongs to, we follow parent pointers to the root. \n\nTo keep the tree flat ($O(1)$ amortized):\n1. **Path Compression**: During `find()`, make every visited node point directly to the root.\n2. **Union by Rank**: Always attach the smaller tree under the taller tree.",
          timeComplexity: "O(alpha(N)) Amortized",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "Python", code: "class DSU:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n    def find(self, i):\n        if self.parent[i] == i: return i\n        self.parent[i] = self.find(self.parent[i])\n        return self.parent[i]\n    def union(self, i, j):\n        root_i, root_j = self.find(i), self.find(j)\n        if root_i != root_j:\n            if self.rank[root_i] < self.rank[root_j]: self.parent[root_i] = root_j\n            elif self.rank[root_i] > self.rank[root_j]: self.parent[root_j] = root_i\n            else: self.parent[root_i] = root_j; self.rank[root_j] += 1" }
          ]
       }
    ]
  },
  {
    id: "segment-tree-point-update-range-query",
    title: "Segment Tree",
    topic: "Advanced Data Structures",
    category: "Range Queries",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "A tree data structure used for storing information about intervals, or segments.",
    leetcodeLink: "",
    useCases: ["Range Sum / Min / Max queries with point updates", "Computational geometry"],
    approaches: [
       {
          name: "Optimal (Point Update / Range Query)",
          description: "### 🧠 The Core Concept\nDivide the array into halves recursively. Each node in the tree stores the aggregate (Sum/Min/Max) for its range. Updates take $O(\\log N)$ as you only update the branch containing the index.",
          timeComplexity: "O(log N) per operation",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "JavaScript", code: "class SegmentTree {\n    constructor(arr) {\n        this.n = arr.length;\n        this.tree = new Array(4 * this.n);\n        this.build(arr, 1, 0, this.n - 1);\n    }\n    build(arr, node, start, end) {\n        if(start === end) { this.tree[node] = arr[start]; return; }\n        let mid = Math.floor((start+end)/2);\n        this.build(arr, 2*node, start, mid);\n        this.build(arr, 2*node+1, mid+1, end);\n        this.tree[node] = this.tree[2*node] + this.tree[2*node+1];\n    }\n}" }
          ]
       }
    ]
  },
  {
    id: "fenwick-tree-binary-indexed-tree",
    title: "Fenwick Tree (BIT)",
    topic: "Advanced Data Structures",
    category: "Range Queries",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "A data structure that can efficiently update elements and calculate prefix sums in an array of numbers.",
    leetcodeLink: "",
    useCases: ["Frequency counts", "Prefix sum in dynamic arrays"],
    approaches: [
       {
          name: "Optimal (LSB Bit Manipulation)",
          description: "### 🧠 The Core Concept\nUses the binary representation of indices. Each index `i` is responsible for a range of length `LSB(i)`. Moving up or down in the tree involves adding or subtracting the LSB.",
          timeComplexity: "O(log N)",
          spaceComplexity: "O(N)",
          implementations: [
             { language: "Python", code: "class FenwickTree:\n    def __init__(self, n):\n        self.tree = [0] * (n + 1)\n    def update(self, i, delta):\n        i += 1\n        while i < len(self.tree):\n            self.tree[i] += delta\n            i += i & (-i)\n    def query(self, i):\n        i += 1; s = 0\n        while i > 0:\n            s += self.tree[i]\n            i -= i & (-i)\n        return s" }
          ]
       }
    ]
  }
];
