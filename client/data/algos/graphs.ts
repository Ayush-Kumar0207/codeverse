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
                code: "var numIslands = function(grid) {\n    if (!grid || grid.length === 0) return 0;\n    \n    let count = 0;\n    const m = grid.length;\n    const n = grid[0].length;\n    \n    const dfs = (r, c) => {\n        if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] === '0') return;\n        \n        grid[r][c] = '0'; // Mark as visited\n        \n        dfs(r + 1, c);\n        dfs(r - 1, c);\n        dfs(r, c + 1);\n        dfs(r, c - 1);\n    };\n    \n    for (let r = 0; r < m; r++) {\n        for (let c = 0; c < n; c++) {\n            if (grid[r][c] === '1') {\n                count++;\n                dfs(r, c);\n            }\n        }\n    }\n    \n    return count;\n};"
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
                code: "from collections import deque\n\nclass Solution:\n    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:\n        adj = [[] for _ in range(numCourses)]\n        in_degree = [0] * numCourses\n        \n        for course, pre in prerequisites:\n            adj[pre].append(course)\n            in_degree[course] += 1\n            \n        queue = deque([i for i in range(numCourses) if in_degree[i] == 0])\n        count = 0\n        \n        while queue:\n            curr = queue.popleft()\n            count += 1\n            \n            for neighbor in adj[curr]:\n                in_degree[neighbor] -= 1\n                if in_degree[neighbor] == 0:\n                    queue.append(neighbor)\n                    \n        return count == numCourses"
             },
             {
                language: "Java",
                code: "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        List<Integer>[] adj = new List[numCourses];\n        int[] inDegree = new int[numCourses];\n        \n        for (int i = 0; i < numCourses; i++) adj[i] = new ArrayList<>();\n        \n        for (int[] pair : prerequisites) {\n            adj[pair[1]].add(pair[0]);\n            inDegree[pair[0]]++;\n        }\n        \n        Queue<Integer> queue = new LinkedList<>();\n        for (int i = 0; i < numCourses; i++) {\n            if (inDegree[i] == 0) queue.offer(i);\n        }\n        \n        int count = 0;\n        while (!queue.isEmpty()) {\n            int curr = queue.poll();\n            count++;\n            \n            for (int next : adj[curr]) {\n                inDegree[next]--;\n                if (inDegree[next] == 0) queue.offer(next);\n            }\n        }\n        \n        return count == numCourses;\n    }\n}"
             },
             {
                language: "C++",
                code: "class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        vector<vector<int>> adj(numCourses);\n        vector<int> inDegree(numCourses, 0);\n        \n        for (auto& pair : prerequisites) {\n            adj[pair[1]].push_back(pair[0]);\n            inDegree[pair[0]]++;\n        }\n        \n        queue<int> q;\n        for (int i = 0; i < numCourses; i++) {\n            if (inDegree[i] == 0) q.push(i);\n        }\n        \n        int count = 0;\n        while (!q.empty()) {\n            int curr = q.front();\n            q.pop();\n            count++;\n            \n            for (int next : adj[curr]) {\n                inDegree[next]--;\n                if (inDegree[next] == 0) q.push(next);\n            }\n        }\n        \n        return count == numCourses;\n    }\n};"
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
          description: "### 🧠 The Core Concept\nAlways expand the node that has the current minimum distance from the source. This 'Greedy' choice is guaranteed to be the shortest path because we don't have negative edge weights.\n\n### 🛠️ Execution Strategy\n1. Initialize `dist` array with `Infinity`, `dist[source] = 0`.\n2. Push `[0, source]` into a Min-Heap.\n3. While Heap is not empty:\n   - Pop node with min distance.\n   - For each neighbor, if `dist[curr] + weight < dist[neighbor]`, update and push to heap.",
          timeComplexity: "O(E * log V)",
          spaceComplexity: "O(V + E)",
          implementations: [
             { language: "Python", code: "import heapq\ndef dijkstra(adj, src, n):\n    dist = [float('inf')] * n\n    dist[src] = 0\n    pq = [(0, src)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        for v, w in adj[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return dist" }
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
          name: "Optimal (Dynamic Programming)",
          description: "### 🧠 The Core Concept\nShortest path can have at most $V-1$ edges. Relax all edges $V-1$ times. If we can relax once more and distances still decrease, we have a **Negative Cycle**.",
          timeComplexity: "O(V * E)",
          spaceComplexity: "O(V)",
          implementations: [
             { language: "JavaScript", code: "function bellmanFord(edges, v, src) {\n    let dist = Array(v).fill(Infinity);\n    dist[src] = 0;\n    for(let i=0; i < v-1; i++) {\n        for(let [u, v_node, w] of edges) {\n            if(dist[u] != Infinity && dist[u] + w < dist[v_node])\n                dist[v_node] = dist[u] + w;\n        }\n    }\n    return dist;\n}" }
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
          name: "Optimal (DP Matrix)",
          description: "### 🧠 The Core Concept\nFor every pair of nodes $(i, j)$, check if passing through an intermediate node `k` makes the path shorter: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.",
          timeComplexity: "O(V^3)",
          spaceComplexity: "O(V^2)",
          implementations: [
             { language: "Python", code: "def floydWarshall(matrix, v):\n    for k in range(v):\n        for i in range(v):\n            for j in range(v):\n                matrix[i][j] = min(matrix[i][j], matrix[i][k] + matrix[k][j])" }
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
          name: "Optimal (Greedy + DSU)",
          description: "### 🧠 The Core Concept\nSort all edges by weight. Pick the smallest edge. If it doesn't form a cycle (check via DSU), add it to the MST.",
          timeComplexity: "O(E * log E + E * alpha(V))",
          spaceComplexity: "O(V + E)",
          implementations: [
             { language: "Python", code: "def kruskal(edges, v):\n    edges.sort(key=lambda x: x[2])\n    parent = list(range(v)); mst_weight = 0\n    def find(i):\n        if parent[i] == i: return i\n        parent[i] = find(parent[i]); return parent[i]\n    for u, v_node, w in edges:\n        root_u, root_v = find(u), find(v_node)\n        if root_u != root_v:\n            mst_weight += w; parent[root_u] = root_v\n    return mst_weight" }
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
          description: "### 🧠 The Core Concept\n1. DFS and push nodes to stack by finishing time.\n2. Reverse the graph.\n3. Pop from stack and run DFS on reversed graph to reveal SCCs.",
          timeComplexity: "O(V + E)",
          spaceComplexity: "O(V + E)",
          implementations: [
             { language: "JavaScript", code: "function kosaraju(adj, v) {\n    let stack = [], visited = new Set();\n    function dfs1(u) {\n        visited.add(u);\n        for(let v_node of adj[u]) if(!visited.has(v_node)) dfs1(v_node);\n        stack.push(u);\n    }\n    for(let i=0; i<v; i++) if(!visited.has(i)) dfs1(i);\n    // ... Reverse and DFS2 ...\n}" }
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
             { language: "Python", code: "def findBridges(n, adj):\n    tin, low = [-1]*n, [-1]*n\n    timer, bridges = 0, []\n    def dfs(u, p=-1):\n        nonlocal timer\n        tin[u] = low[u] = timer; timer += 1\n        for v in adj[u]:\n            if v == p: continue\n            if tin[v] != -1: low[u] = min(low[u], tin[v])\n            else:\n                dfs(v, u)\n                low[u] = min(low[u], low[v])\n                if low[v] > tin[u]: bridges.append([u, v])\n    dfs(0); return bridges" }
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
          name: "Optimal (Tarjan's variant)",
          description: "### 🧠 The Core Concept\nSimilar to bridges, but we check if `low[v] >= tin[u]`. For the root node, it is an articulation point if it has more than one child in the DFS tree.",
          timeComplexity: "O(V + E)",
          spaceComplexity: "O(V + E)",
          implementations: [
             { language: "JavaScript", code: "function findArticulationPoints(n, adj) {\n    let tin = Array(n).fill(-1), low = Array(n).fill(-1);\n    let timer = 0, res = new Set();\n    function dfs(u, p = -1) {\n        tin[u] = low[u] = timer++;\n        let children = 0;\n        for(let v of adj[u]) {\n            if(v === p) continue;\n            if(tin[v] !== -1) low[u] = Math.min(low[u], tin[v]);\n            else {\n                dfs(v, u);\n                low[u] = Math.min(low[u], low[v]);\n                if(low[v] >= tin[u] && p !== -1) res.add(u);\n                children++;\n            }\n        }\n        if(p === -1 && children > 1) res.add(u);\n    }\n    dfs(0); return Array.from(res);\n}" }
          ]
       }
    ]
  }
];
