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
  }
];
