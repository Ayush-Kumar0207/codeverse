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
          name: "Optimal (Path Compression + Union by Rank)",
          description: "### 🧠 The Core Concept: The 'Kingdoms & Scouts' Analogy\nImagine $N$ lone villagers. Each villager is their own 'set'. \n- **Union**: When two villagers marry, their families merge. To keep things efficient, the smaller family always joins the larger one (Union by Rank/Size).\n- **Find (Path Compression)**: When a scout needs to find the Great King (the Root), they ask their parent, who asks their parent... Once found, the scout tells *everyone* they met along the way: \"Hey, the King is right there!\" Now, everyone points directly to the King, making next time instant.\n\n### 🛠️ Execution Strategy\n1. **Path Compression**: In `find(i)`, recursively find the root and update `parent[i] = root`. This flattens the tree effectively to $O(1)$ depth.\n2. **Union by Rank**: Compare the heights (ranks) of two trees. Attach the shorter one as a child of the taller one to prevent 'skewed' trees.",
          timeComplexity: "O(α(N)) Amortized",
          timeComplexityExplanation: "The Inverse Ackermann function α(N) grows so slowly that it is effectively O(1) for all practical values of N.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "We store two primitive arrays: `parent` and `rank`.",
          implementations: [
             {
                language: "Python",
                code: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, i):
        if self.parent[i] == i:
            return i
        # Path Compression
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def union(self, i, j):
        root_i, root_j = self.find(i), self.find(j)
        if root_i != root_j:
            # Union by Rank
            if self.rank[root_i] < self.rank[root_j]:
                self.parent[root_i] = root_j
            elif self.rank[root_i] > self.rank[root_j]:
                self.parent[root_j] = root_i
            else:
                self.parent[root_i] = root_j
                self.rank[root_j] += 1
            return True
        return False`
             },
             {
                language: "JavaScript",
                code: `class DSU {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    find(i) {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]);
    }
    union(i, j) {
        let rootI = this.find(i);
        let rootJ = this.find(j);
        if (rootI !== rootJ) {
            if (this.rank[rootI] < this.rank[rootJ]) {
                this.parent[rootI] = rootJ;
            } else if (this.rank[rootI] > this.rank[rootJ]) {
                this.parent[rootJ] = rootI;
            } else {
                this.parent[rootI] = rootJ;
                this.rank[rootJ]++;
            }
        }
    }
}`
             }
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
          name: "Optimal (Recursive Range Storage)",
          description: "### 🧠 The Core Concept: The 'Divide and Conquer' Tree\nStatic arrays are great for prefix sums ($O(1)$) but terrible at updates ($O(N)$). Segment Trees offer a balance: $O(\\log N)$ for both query and update.\n\nImagine the array is the bottom floor of a pyramid. Each level above stores the sum of two neighbors below it. To find the sum of a range, you don't sum 100 individuals; you sum a few 'managers' who already know the sub-totals.\n\n### 🛠️ Execution Strategy\n1. **Structure**: Allocate $4*N$ space for the tree array.\n2. **Build**: Recursively divide the array until leaves. Each parent $P$ stores $LeftChild + RightChild$.\n3. **Query**: If the current node's range is entirely inside the query range, return its value. If it's outside, return $0$. Otherwise, split and ask both children.",
          timeComplexity: "O(log N) per operation",
          timeComplexityExplanation: "The tree height is perfectly balanced at log N.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "We use an array of size 4N to store the tree nodes.",
          implementations: [
             {
                language: "JavaScript",
                code: `class SegmentTree {
    constructor(arr) {
        this.n = arr.length;
        this.tree = new Array(4 * this.n).fill(0);
        this.build(arr, 1, 0, this.n - 1);
    }
    build(arr, node, start, end) {
        if (start === end) {
            this.tree[node] = arr[start];
            return;
        }
        let mid = Math.floor((start + end) / 2);
        this.build(arr, 2 * node, start, mid);
        this.build(arr, 2 * node + 1, mid + 1, end);
        this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
    }
    query(node, start, end, L, R) {
        if (R < start || end < L) return 0;
        if (L <= start && end <= R) return this.tree[node];
        let mid = Math.floor((start + end) / 2);
        return this.query(2 * node, start, mid, L, R) + 
               this.query(2 * node + 1, mid + 1, end, L, R);
    }
}`
             }
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
          name: "Optimal (Binary Skipping)",
          description: "### 🧠 The Core Concept: The 'Powers of 2' Strategy\nA Fenwick Tree (or BIT) is like a clever accountant who only tracks specific power-of-2 totals. Instead of storing the sum of $[0, 7]$, you store it such that every index `i` is responsible for a range of size `LSB(i)` (the value of the lowest set bit).\n\n### 🛠️ Execution Strategy\n1. **Index 1-Based**: Unlike standard arrays, BIT works best with 1-based indexing.\n2. **Update**: To update a value at $i$, move 'up' the tree by adding LSB to $i$: `i += (i & -i)`. Update every responsible node.\n3. **Query (Prefix Sum)**: To get the sum up to $i$, move 'down' by subtracting LSB: `i -= (i & -i)`. Sum up the values encountered.",
          timeComplexity: "O(log N)",
          timeComplexityExplanation: "Updating or querying only visits log N nodes (the number of set bits in the index).",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "We store a single array of size N+1.",
          implementations: [
             {
                language: "Python",
                code: `class FenwickTree:
    def __init__(self, n):
        self.bit = [0] * (n + 1)

    def update(self, i, delta):
        # i is 0-indexed in call, convert to 1-indexed
        i += 1
        while i < len(self.bit):
            self.bit[i] += delta
            i += i & (-i)

    def query(self, i):
        # i is 0-indexed in call, convert to 1-indexed
        i += 1
        total = 0
        while i > 0:
            total += self.bit[i]
            i -= i & (-i)
        return total`
             }
          ]
       }
    ]

  }
];
