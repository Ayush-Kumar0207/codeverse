import { AlgorithmEntry } from "./types";

export const graphsAlgorithms: AlgorithmEntry[] = [
  {
    id: "number-of-islands",
    title: "Number of Islands",
    topic: "Graphs - Traversals",
    category: "Grid Traversal (DFS)",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    leetcodeLink: "https://leetcode.com/problems/number-of-islands/",
    useCases: ["Image processing (segmentation)", "Battle royale game zones", "Geographic data analysis"],
    approaches: [
       {
          name: "Optimal (DFS Search)",
          description: "### 🧠 The Core Concept\nImagine the grid as a map of the ocean. Each '1' is a piece of land. If you step on one piece of land, you can explore everything connected to it. \nWhen you find a new '1' that you haven't visited before, that's the start of a **new island**. You immediately call a search team (DFS) to 'sink' or mark as visited all the land connected to that spot. After the team returns, everything connected to that first spot is now marked, and you keep scanning for the next unvisited land.\n\n### 🛠️ Execution Strategy\n1. **Scan the Grid**: Iterate through every cell in the 2D grid.\n2. **New Island Discovery**: If you hit a '1' (land):\n   - Increment your island counter `count++`.\n   - Trigger a **DFS** starting from this cell to mark the entire island.\n3. **DFS Execution**: \n   - Check bounds: If the cell is out of bounds or is '0' (water), stop.\n   - Mark the current cell as '0' (or 'visited') so you don't count it again.\n   - Recursively call DFS on the four adjacent neighbors: **Up, Down, Left, Right**.\n\nBy efficiently sinking every island as you find it, you ensure you only count the unique continuous masses.",
          timeComplexity: "O(M * N)",
          timeComplexityExplanation: "We must visit every cell in the grid at least once during the scan. Even with DFS, each '1' in the grid is visited exactly once and turned into '0'.",
          spaceComplexity: "O(M * N)",
          spaceComplexityExplanation: "In the absolute worst case (an entire grid made of land), the recursion stack can go as deep as M * N frames.",
          implementations: [
             {
                language: "JavaScript",
                code: `var numIslands = function(grid) {
    if (!grid || grid.length === 0) return 0;
    
    let count = 0;
    const m = grid.length;
    const n = grid[0].length;
    
    const dfs = (r, c) => {
        if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] === '0') return;
        
        grid[r][c] = '0';
        
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    };
    
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; r++) {
            if (grid[r][c] === '1') {
                count++;
                dfs(r, c);
            }
        }
    }
    
    return count;
};`
             },
             {
                language: "Python",
                code: "class Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        if not grid: return 0\n        \n        rows, cols = len(grid), len(grid[0])\n        count = 0\n        \n        def dfs(r, c):\n            if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == '0':\n                return\n                \n            grid[r][c] = '0'\n            dfs(r + 1, c)\n            dfs(r - 1, c)\n            dfs(r, c + 1)\n            dfs(r, c - 1)\n            \n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c] == '1':\n                    count += 1\n                    dfs(r, c)\n                    \n        return count"
             },
             {
                language: "Java",
                code: "class Solution {\n    public int numIslands(char[][] grid) {\n        if (grid == null || grid.length == 0) return 0;\n        \n        int count = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == '1') {\n                    count++;\n                    dfs(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n    \n    private void dfs(char[][] grid, int r, int c) {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == '0') return;\n        \n        grid[r][c] = '0';\n        dfs(grid, r + 1, c);\n        dfs(grid, r - 1, c);\n        dfs(grid, r, c + 1);\n        dfs(grid, r, c - 1);\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        if (grid.empty()) return 0;\n        int count = 0;\n        \n        for (int r = 0; r < grid.size(); r++) {\n            for (int c = 0; c < grid[0].size(); c++) {\n                if (grid[r][c] == '1') {\n                    count++;\n                    dfs(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n    \nprivate:\n    void dfs(vector<vector<char>>& grid, int r, int c) {\n        if (r < 0 || c < 0 || r >= grid.size() || c >= grid[0].size() || grid[r][c] == '0') return;\n        \n        grid[r][c] = '0';\n        dfs(grid, r + 1, c);\n        dfs(grid, r - 1, c);\n        dfs(grid, r, c + 1);\n        dfs(grid, r, c - 1);\n    }\n};"
             }
          ]
       }
    ]
  },
  {
    id: "clone-graph",
    title: "Clone Graph",
    topic: "Graphs - Traversals",
    category: "Deep Copy (DFS/BFS)",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value and a list of its neighbors.",
    leetcodeLink: "https://leetcode.com/problems/clone-graph/",
    useCases: ["Creating snapshots of object graphs", "Memory management deep-copy", "Distributed system state replication"],
    approaches: [
       {
          name: "Optimal (DFS + Hash Map)",
          description: "### 🧠 The Core Concept\nYou can't just copy the pointers; you need to create entirely new memory objects for every node. But wait—graphs can have cycles! If you just blindly copy neighbors, you'll enter an infinite loop of cloning already cloned nodes.\n\nYou need a **Map** to track original nodes and their cloned counterparts. Think of it as a registry: \"Original Node A has already been cloned to New Node A'.\"\n\n### 🛠️ Execution Strategy\n1. **Registry Map**: Create a `visited` map where `key = originalNode` and `value = clonedNode`.\n2. **DFS Function**: \n   - If the current node is null, return null.\n   - If the node is already in the `visited` map, return its cloned version immediately (prevents infinite cycles).\n   - Create a **New Node** with the same value as the original.\n   - Store it in the `visited` map: `visited[node] = clone`.\n   - Recursively clone all neighbors of the original node and add them to the new node's neighbor list.\n3. **Result**: Return the clone of the starting node.",
          timeComplexity: "O(V + E)",
          timeComplexityExplanation: "We visit each vertex (V) exactly once to clone it and iterate through all of its edges (E) to establish connections.",
          spaceComplexity: "O(V)",
          spaceComplexityExplanation: "The structural Hash Map stores a reference for every vertex in the graph, and the recursion stack can go as deep as the total number of vertices.",
          implementations: [
             {
                language: "JavaScript",
                code: "var cloneGraph = function(node) {\n    if (!node) return null;\n    let visited = new Map();\n\n    const dfs = (n) => {\n        if (visited.has(n)) return visited.get(n);\n\n        let clone = new Node(n.val);\n        visited.set(n, clone);\n\n        for (let neighbor of n.neighbors) {\n            clone.neighbors.push(dfs(neighbor));\n        }\n        \n        return clone;\n    };\n\n    return dfs(node);\n};"
             },
             {
                language: "Python",
                code: "class Solution:\n    def cloneGraph(self, node: 'Node') -> 'Node':\n        if not node: return None\n        visited = {}\n\n        def dfs(n):\n            if n in visited:\n                return visited[n]\n            \n            clone = Node(n.val)\n            visited[n] = clone\n            \n            for neighbor in n.neighbors:\n                clone.neighbors.append(dfs(neighbor))\n                \n            return clone\n            \n        return dfs(node)"
             },
             {
                language: "Java",
                code: "class Solution {\n    private HashMap<Node, Node> visited = new HashMap<>();\n\n    public Node cloneGraph(Node node) {\n        if (node == null) return null;\n        if (visited.containsKey(node)) return visited.get(node);\n\n        Node clone = new Node(node.val);\n        visited.put(node, clone);\n\n        for (Node neighbor : node.neighbors) {\n            clone.neighbors.add(cloneGraph(neighbor));\n        }\n\n        return clone;\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    unordered_map<Node*, Node*> visited;\n\n    Node* cloneGraph(Node* node) {\n        if (node == nullptr) return nullptr;\n        if (visited.count(node)) return visited[node];\n\n        Node* clone = new Node(node->val);\n        visited[node] = clone;\n\n        for (Node* neighbor : node->neighbors) {\n            clone->neighbors.push_back(cloneGraph(neighbor));\n        }\n\n        return clone;\n    }\n};"
             }
          ]
       }
    ]
  },
  {
    id: "course-schedule",
    title: "Course Schedule",
    topic: "Graphs - Advanced",
    category: "Cycle Detection (Topological Sort)",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a, b] indicates that you must take course b first if you want to take course a. Determine if you can finish all courses.",
    leetcodeLink: "https://leetcode.com/problems/course-schedule/",
    useCases: ["Job scheduling with dependencies", "Software package dependency resolution (npm/pip)", "Build system task ordering"],
    approaches: [
       {
          name: "Optimal (Kahn's Algorithm - BFS)",
          description: "### 🧠 The Core Concept\nIf you can't finish your courses, it means there is a **Cyclic Dependency**. (e.g., You need Course A to take Course B, but you need Course B to take Course A). This is logically impossible.\n\nKahn's algorithm finds the 'starting points'—courses that Have NO prerequisites (`in-degree` is 0). Once you take a course, you essentially 'unlock' the next courses. If you manage to take every course, there was no cycle!\n\n### 🛠️ Execution Strategy\n1. **Build Adjacency List**: Map each course to which courses it 'unlocks'.\n2. **In-Degree Array**: Create an array where `inDegree[i]` is the number of prerequisites Course `i` currently has.\n3. **Queue Initial Nodes**: Push every course with an `in-degree` of 0 into a Queue (these are immediately available).\n4. **Unlock Level-by-Level**: \n   - While the queue isn't empty, pop a course.\n   - Increment a `takenCount` counter.\n   - Look at every course this course unlocks. **Subtract 1** from their in-degree.\n   - If any course's in-degree drops to 0, push it into the Queue.\n5. **Victory Condition**: If `takenCount == numCourses`, return true. Otherwise, a cycle exists.",
          timeComplexity: "O(V + E)",
          timeComplexityExplanation: "We build the graph in $O(E)$ and process each vertex and edge exactly once in the BFS loop.",
          spaceComplexity: "O(V + E)",
          spaceComplexityExplanation: "The adjacency list stores all edges, and the in-degree array/queue stores all vertices.",
          implementations: [
             {
                language: "JavaScript",
                code: "var canFinish = function(numCourses, prerequisites) {\n    const adj = Array.from({ length: numCourses }, () => []);\n    const inDegree = new Array(numCourses).fill(0);\n    \n    for (let [course, pre] of prerequisites) {\n        adj[pre].push(course);\n        inDegree[course]++;\n    }\n    \n    const queue = [];\n    for (let i = 0; i < numCourses; i++) {\n        if (inDegree[i] === 0) queue.push(i);\n    }\n    \n    let count = 0;\n    while (queue.length > 0) {\n        let curr = queue.shift();\n        count++;\n        \n        for (let nextCourse of adj[curr]) {\n            inDegree[nextCourse]--;\n            if (inDegree[nextCourse] === 0) queue.push(nextCourse);\n        }\n    }\n    \n    return count === numCourses;\n};"
             },
             {
                language: "Python",
                code: "from collections import deque\n\nclass Solution:\n    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:\n        adj = [[] for _ in range(numCourses)]\n        in_degree = [0] * numCourses\n        \n        for course, pre in prerequisites:\n            adj[pre].append(course)\n            in_degree[course] += 1\n            \n        queue = deque([i for i in range(numCourses) if in_degree[i] == 0])\n        count = 0\n        \n        while queue:\n            curr = queue.popleft()\n            count += 1\n            \n            for next_course in adj[curr]:\n                in_degree[next_course] -= 1\n                if in_degree[next_course] == 0:\n                    queue.append(next_course)\n                    \n        return count == numCourses"
             },
             {
                language: "Java",
                code: "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        List<Integer>[] adj = new List[numCourses];\n        int[] inDegree = new int[numCourses];\n        \n        for (int i = 0; i < numCourses; i++) adj[i] = new ArrayList<>();\n        \n        for (int[] pair : prerequisites) {\n            adj[pair[1]].add(pair[0]);\n            inDegree[pair[0]]++;\n        }\n        \n        Queue<Integer> queue = new LinkedList<>();\n        for (int i = 0; i < numCourses; i++) {\n            if (inDegree[i] == 0) queue.offer(i);\n        }\n        \n        int count = 0;\n        while (!queue.isEmpty()) {\n            int curr = queue.poll();\n            count++;\n            \n            for (int next : adj[curr]) {\n                inDegree[next]--;\n                if (inDegree[next] == 0) queue.offer(next);\n            }\n        }\n        \n        return count == numCourses;\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        vector<vector<int>> adj(numCourses);\n        vector<int> inDegree(numCourses, 0);\n        \n        for (auto& pair : prerequisites) {\n            adj[pair[1]].push_back(pair[0]);\n            inDegree[pair[0]]++;\n        }\n        \n        queue<int> q;\n        for (int i = 0; i < numCourses; i++) {\n            if (inDegree[i] == 0) q.push(i);\n        }\n        \n        int count = 0;\n        while (!q.empty()) {\n            int curr = q.front();\n            q.pop();\n            count++;\n            \n            for (int nextCourse : adj[curr]) {\n                inDegree[nextCourse]--;\n                if (inDegree[nextCourse] == 0) q.push(nextCourse);\n            }\n        }\n        \n        return count == numCourses;\n    }\n};"
             }
          ]
       }
    ]
  },
  {
    id: "dijkstra-s-algorithm",
    title: "Dijkstra's Algorithm",
    topic: "Graphs - Shortest Path",
    category: "Shortest Path",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Find the shortest path from a single source node to all other nodes in a weighted graph (no negative weights).",
    leetcodeLink: "",
    useCases: ["Google Maps routing", "Network packet routing", "Social network degree of separation"],
    approaches: [
       {
          name: "Optimal (Priority Queue / Min-Heap)",
          description: "### The Core Concept\nImagine you are planning a road trip across a country with multiple cities connected by roads of different lengths. You want to find the shortest path from your starting city to every other city. How would you do this efficiently?\n\nDijkstra's algorithm is like having a super-smart GPS that always picks the shortest possible route step by step. Here is the key insight: If you always move to the closest unvisited city, you will never need to reconsider that choice later because all roads have positive lengths (no negative distances allowed).\n\nThink of it this way: You are at city A. You have neighbors B (5 miles away) and C (10 miles away). You visit B first because it is closer. Once you are at B, you might discover a shortcut to C that makes the total distance only 8 miles instead of 10. You update your knowledge and continue. This greedy approach works because once you find the shortest path to a city, you never need to revisit it.\n\n### Interactive Walkthrough\nLet us trace through a simple graph:\nCities: A, B, C, D\nRoads: A to B (5), A to C (10), B to D (3), C to D (1)\nStart at A\n\nStep 1: Distance to A = 0 (we are here). Distances to others are unknown (infinity).\nStep 2: Visit closest unvisited city. From A, B is closest (5 miles).\nStep 3: From B, we can reach D in 5 + 3 = 8 miles. Update distance to D.\nStep 4: Visit next closest city. From A, C is 10 miles. But from C to D is 1 mile, so A to C to D = 11 miles. This is worse than our current 8 miles to D, so we keep 8.\nStep 5: Visit D (8 miles from A). Done!\n\n### Execution Strategy\n1. Initialize Distance Array: Create an array dist where dist[i] represents the shortest known distance from source to node i. Set all distances to infinity except the source node (set to 0).\n\n2. Priority Queue Setup: Create a min-heap (priority queue) that always gives us the node with the smallest distance. Initially, add the source node with distance 0.\n\n3. Main Loop: While the queue is not empty:\n   - Extract the node with minimum distance from the queue.\n   - If this distance is greater than the known shortest distance to this node, skip it (we already found a better path).\n   - For each neighbor of this node:\n     - Calculate the new distance: distance to current node + weight of edge to neighbor.\n     - If this new distance is shorter than the currently known distance to the neighbor:\n       - Update the neighbor's distance.\n       - Add the neighbor to the queue with its new distance.\n\n4. Result: The dist array now contains the shortest distance from source to every node.\n\n### Why This Works\nThe Greedy Property: By always processing the closest unvisited node, we guarantee that once we mark a node as visited, we have found its absolute shortest path. This is because any alternative path would have to go through a node that is farther away, making it longer.\n\nNo Negative Edges: The algorithm assumes all edge weights are positive. If negative edges existed, a shorter path might be found later through a negative cycle, breaking our guarantee.\n\n### Code Logic Breakdown\nThe code maintains two key data structures:\n- dist array: Tracks the shortest known distance to each node.\n- priority queue: Always processes nodes in order of increasing distance.\n\nWhen we pop a node from the queue, we explore all its neighbors. For each neighbor, we check if going through the current node provides a shorter path than what we already know. If yes, we update and add it to the queue for further exploration.",
          timeComplexity: "O(E * log V)",
          spaceComplexity: "O(V + E)",
          implementations: [
             { language: "Python", code: "import heapq\n\ndef dijkstra(adj, src, n):\n    dist = [float('inf')] * n\n    dist[src] = 0\n    pq = [(0, src)]\n    \n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        \n        for v, w in adj[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    \n    return dist" }
          ]
       }
    ]
  },
  {
    id: "bellman-ford-algorithm",
    title: "Bellman-Ford",
    topic: "Graphs - Shortest Path",
    category: "Shortest Path",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Calculate shortest paths from a single source to all nodes, even with negative edge weights.",
    leetcodeLink: "",
    useCases: ["Detecting negative cycles in financial arbitrage", "Distance vector routing"],
    approaches: [
       {
          name: "Optimal (Global Edge Relaxation)",
          description: "### 🧠 The Core Concept: The 'Safe Bet' Analogy\nUnlike Dijkstra, which is 'greedy' and expects edges to always be positive, Bellman-Ford is paranoid. It assumes that there might be a negative edge somewhere that could provide a massive shortcut. \n\nIn a graph with $V$ vertices, the longest possible path without a cycle has $V-1$ edges. So, Bellman-Ford simply relaxes **ALL** edges $V-1$ times. By the end of the $(V-1)$-th pass, it's mathematically certain that we've found the shortest path to every node.\n\n### 🛠️ Execution Strategy\n1. Initialize `dist` array with infinity, `dist[source] = 0`.\n2. **Relaxation Loop**: Run exactly $V-1$ times:\n   - For every edge $(u, v)$ with weight $w$:\n   - If `dist[u] + w < dist[v]`, update `dist[v] = dist[u] + w`.\n3. **Negative Cycle Check**: Run the loop one more time. \n   - If any `dist[v]` can still be shrunk, then there is a **Negative Cycle**—a vortex where you can gain infinite value by spinning in circles.",
          timeComplexity: "O(V * E)",
          timeComplexityExplanation: "We perform $V-1$ iterations, and in each iteration, we visit all $E$ edges.",
          spaceComplexity: "O(V)",
          spaceComplexityExplanation: "We only need a single distance array of size $V$.",
          implementations: [
             {
                language: "JavaScript",
                code: `function bellmanFord(numVertices, edges, src) {
    let dist = new Array(numVertices).fill(Infinity);
    dist[src] = 0;
    
    // V-1 iterations of relaxation
    for (let i = 0; i < numVertices - 1; i++) {
        for (let [u, v, w] of edges) {
            if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    // Check for negative cycles
    for (let [u, v, w] of edges) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
            console.error("Graph contains a negative weight cycle!");
            return null;
        }
    }
    
    return dist;
}`
             }
          ]
       }
    ]

  },
  {
    id: "floyd-warshall-algorithm",
    title: "Floyd-Warshall",
    topic: "Graphs - All Pairs Shortest Path",
    category: "Shortest Path",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Find shortest paths between all pairs of vertices in a weighted graph.",
    leetcodeLink: "",
    useCases: ["Transitive closure in graphs", "Finding all-points reachability"],
    approaches: [
       {
          name: "Optimal (Triple-Nested Dynamic Programming)",
          description: "### 🧠 The Core Concept: The 'Shortcut Registry'\nInstead of finding a path from one source, Floyd-Warshall finds the shortcut between **every possible pair** of cities simultaneously.\n\nIt asks: *\"For every pair $(i, j)$, can I find a better way to get there if I'm allowed to stop at city $k$?\"*\n\n### 🛠️ Step-by-Step Logic\n1. Initialize a 2D matrix `dist` where `dist[i][j]` is the weight of edge $(i, j)$, or infinity if no edge exists.\n2. **The Triple Loop**: \n   - For every intermediate city $k$ ($0$ to $V-1$):\n     - For every starting city $i$:\n       - For every destination city $j$:\n         - `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.\n3. After all $k$ are processed, `dist[i][j]` is the shortest path between any two points.",
          timeComplexity: "O(V³)",
          timeComplexityExplanation: "The three nested loops each iterate through all $V$ vertices.",
          spaceComplexity: "O(V²)",
          spaceComplexityExplanation: "We store an $V \times V$ matrix of distances.",
          implementations: [
             {
                language: "Python",
                code: `def floydWarshall(matrix, v):
    # matrix[i][j] is weight of edge i->j
    # If no edge, matrix[i][j] should be infinity
    for k in range(v):
        for i in range(v):
            for j in range(v):
                if matrix[i][k] + matrix[k][j] < matrix[i][j]:
                    matrix[i][j] = matrix[i][k] + matrix[k][j]
    return matrix`
             }
          ]
       }
    ]

  },
  {
    id: "kruskal-s-algorithm",
    title: "Kruskal's Algorithm",
    topic: "Graphs - Minimum Spanning Tree",
    category: "MST",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the Minimum Spanning Tree (MST) of a graph using the Union-Find data structure.",
    leetcodeLink: "",
    useCases: ["Efficient physical network laying (cables/pipes)", "Clustering algorithms"],
    approaches: [
       {
          name: "Optimal (Greedy Strategy with Disjoint Set Union)",
          description: "### 🧠 The Core Concept: The 'Cheap Connector' Strategy\nKruskal’s is an edge-based approach to finding the Minimum Spanning Tree (MST). \n\nImagine you are building a power grid. To minimize cost, you always pick the **cheapest available cable** in the whole country. \n\nThere's a catch: If the two cities are **already connected** (even through a long path), you skip that cable so you don't waste money on a 'short circuit' (cycle).\n\n### 🛠️ Execution Strategy\n1. **Sort** all $E$ edges by weight (cheapest first).\n2. **Union-Find Initialization**: Create a DSU structure for all $V$ vertices.\n3. **Greedy Selection**: \n   - For each sorted edge $(u, v)$:\n   - Check: `if Find(u) != Find(v)`:\n     - The cities aren't connected yet! Take the edge.\n     - Add weight to MST total.\n     - `Union(u, v)` (Merge their sets).",
          timeComplexity: "O(E log E + E α(V))",
          timeComplexityExplanation: "Sorting takes $E \log E$. The $E$ union-find operations take nearly linear time (inverse Ackermann function $\alpha$).",
          spaceComplexity: "O(V + E)",
          spaceComplexityExplanation: "Storing the edges and the parent array for Union-Find.",
          implementations: [
             {
                language: "Python",
                code: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
    def find(self, i):
        if self.parent[i] == i: return i
        self.parent[i] = self.find(self.parent[i]) # Path compression
        return self.parent[i]
    def union(self, i, j):
        root_i, root_j = self.find(i), self.find(j)
        if root_i != root_j:
            self.parent[root_i] = root_j
            return True
        return False

def kruskal(edges, v):
    # edges as [u, v, weight]
    edges.sort(key=lambda x: x[2])
    dsu = DSU(v)
    mst_weight = 0
    edges_count = 0
    
    for u, v_node, w in edges:
        if dsu.union(u, v_node):
            mst_weight += w
            edges_count += 1
            if edges_count == v - 1: break
            
    return mst_weight`
             }
          ]
       }
    ]

  },
  {
    id: "kosaraju-s-algorithm-strongly-connected-components",
    title: "Kosaraju's Algorithm",
    topic: "Graphs - Strongly Connected Components",
    category: "Connectivity",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Find all Strongly Connected Components (SCC) in a directed graph.",
    leetcodeLink: "",
    useCases: ["Social community detection", "Analyzing dependency cycles in codebases"],
    approaches: [
       {
          name: "Optimal (Two-Pass DFS)",
          description: "### The Core Concept\nKosaraju's algorithm finds all Strongly Connected Components (SCCs) in a directed graph. An SCC is a group of nodes where every node can reach every other node in the group. The algorithm works in three clever steps. First, it performs a DFS on the original graph and pushes nodes onto a stack in the order they finish being processed (this is like taking a snapshot of the graph's structure). Second, it reverses all the edges in the graph (if you could go from A to B before, now you can go from B to A). Third, it processes nodes from the stack (in reverse finishing order) and runs DFS on the reversed graph. Each DFS in this phase discovers one complete SCC. The key insight is that reversing the graph and processing in reverse finishing order guarantees that we explore each SCC completely before moving to the next.",
          timeComplexity: "O(V + E)",
          spaceComplexity: "O(V + E)",
          implementations: [
             { language: "JavaScript", code: "function kosaraju(adj, v) {\n    let stack = [], visited = new Set();\n    \n    function dfs1(u) {\n        visited.add(u);\n        for(let v_node of adj[u]) if(!visited.has(v_node)) dfs1(v_node);\n        stack.push(u);\n    }\n    \n    for(let i=0; i<v; i++) if(!visited.has(i)) dfs1(i);\n    \n}" }
          ]
       }
    ]
  },
  {
    id: "bridges-in-graph-tarjan-s-algorithm",
    title: "Bridges in Graph",
    topic: "Graphs - Connectivity",
    category: "Tarjan's Algorithm",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "A bridge is an edge in an undirected graph whose removal increases the number of connected components.",
    leetcodeLink: "https://leetcode.com/problems/critical-connections-in-a-network/",
    useCases: ["Network reliability analysis", "Identifying single points of failure in infrastructure"],
    approaches: [
       {
          name: "Optimal (One-pass DFS / Tarjan's)",
          description: "### 🧠 The Core Concept\nWe track the time of insertion (`tin`) and the lowest time reachable (`low`). If for an edge `u -> v`, the lowest point reachable from `v` is STILL greater than the time we reached `u`, it means there is NO back-edge. Thus, `u-v` is a Bridge.",
          timeComplexity: "O(V + E)",
          spaceComplexity: "O(V + E)",
          implementations: [
             { language: "Python", code: "def findBridges(n, adj):\n    tin, low = [-1]*n, [-1]*n\n    timer, bridges = 0, []\n    \n    def dfs(u, p=-1):\n        nonlocal timer\n        tin[u] = low[u] = timer\n        timer += 1\n        \n        for v in adj[u]:\n            if v == p: continue\n            \n            if tin[v] != -1:\n                low[u] = min(low[u], tin[v])\n            else:\n                dfs(v, u)\n                low[u] = min(low[u], low[v])\n                \n                if low[v] > tin[u]: bridges.append([u, v])\n    \n    dfs(0)\n    return bridges" }
          ]
       }
    ]
  },
  {
    id: "articulation-point",
    title: "Articulation Points",
    topic: "Graphs - Connectivity",
    category: "Tarjan's Algorithm",
    frequencyLevel: "Niche",
    difficulty: "Hard",
    overview: "A vertex whose removal increases the number of connected components.",
    leetcodeLink: "",
    useCases: ["Power grid vulnerability mapping", "Social network key-influencer detection"],
    approaches: [
       {
          name: "Optimal (Tarjan's DFS Variant)",
          description: "### 🧠 The Core Concept: The 'Critical Link' Analogy\nAn Articulation Point (or Cut Vertex) is a node whose removal breaks the graph into multiple disconnected pieces. Think of it as a single point of failure in a server network.\n\nWe track the 'arrival time' (`tin`) and the 'earliest ancestor reachable' (`low`) for each node.\n\n### 🛠️ Execution Strategy\n1. For node $U$ and its child $V$:\n   - If $V$ cannot reach an ancestor of $U$ (i.e., `low[V] >= tin[U]`), then $U$ is the ONLY way $V$ connects to the rest of the world.\n   - **Exception (The Root)**: A root of the DFS tree is only an articulation point if it has more than 1 independent child.\n2. We use a single pass of DFS to populate these values and identify vertices that satisfy the condition.",
          timeComplexity: "O(V + E)",
          timeComplexityExplanation: "Standard DFS traversal visits every node and edge once.",
          spaceComplexity: "O(V + E)",
          spaceComplexityExplanation: "Stores adjacency list and discovery/low-link time arrays.",
          implementations: [
             {
                language: "JavaScript",
                code: `function findArticulationPoints(n, adj) {
    let tin = Array(n).fill(-1), low = Array(n).fill(-1);
    let timer = 0, res = new Set();
    
    function dfs(u, p = -1) {
        tin[u] = low[u] = timer++;
        let children = 0;
        
        for(let v of adj[u]) {
            if(v === p) continue;
            
            if(tin[v] !== -1) {
                // Back-edge
                low[u] = Math.min(low[u], tin[v]);
            } else {
                // Forward-edge
                dfs(v, u);
                low[u] = Math.min(low[u], low[v]);
                if(low[v] >= tin[u] && p !== -1) {
                    res.add(u);
                }
                children++;
            }
        }
        
        // Root case
        if(p === -1 && children > 1) res.add(u);
    }
    
    dfs(0);
    return Array.from(res);
}`
             }
          ]
       }
    ]

  }
];
