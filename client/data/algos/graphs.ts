import { AlgorithmEntry } from "./types";

export const graphsAlgorithms: AlgorithmEntry[] = [
  {
    id: "bfs-graph",
    title: "Breadth-First Search (Graph Maze)",
    topic: "Graphs - Traversals",
    category: "Graph Traversals",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Imagine dropping a stone in a pond. BFS traverses a graph exactly like those outward ripples. It explores all immediate neighbors first, before moving one layer deeper.",
    leetcodeLink: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",
    useCases: ["Finding shortest path (GPS)", "Social network connections", "Web Crawler spiders"],
    approaches: [
      {
        name: "Optimal (Queue-Based)",
        description: "### 🧠 The Core Problem\nYou are inside a massive maze. Depth First Search (DFS) would mean tying a rope to your waist, picking a single hallway, and sprinting blindly into the darkness until you hit a dead end, before backtracking. \n\n**Breadth-First Search (BFS)** is different. Instead of sprinting down one hallway, imagine you split into 4 clones, and take exactly 1 step into all 4 accessible hallways at the same time. Then, every clone takes 1 more step. Because you expand outwards equally like a ripple in a pond, the first clone that hits the exit is guaranteed to have found the absolute shortest path!\n\n### 🛠️ Execution Strategy\n1. **The Waiting Line (Queue)**: In code, we can't clone ourselves. So we use a `Queue` (a First-In-First-Out waiting line). We push our `startNode` into the line.\n2. **Explore**: While the line isn't empty, we pop the first person out of the line. Is this the exit? If yes, we win! \n3. **Queue Followers**: If it's not the exit, we look at all the connected rooms (neighbors). If we haven't visited them yet, we mark them visited, and push them to the **BACK** of the waiting line. \n\nBy always pulling from the front and pushing to the back, we naturally explore exactly 1 radius outward at a time before moving further.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        implementations: [
          {
            language: "JavaScript",
            code: "function bfsShortestPath(graph, startNode, targetNode) {\n  let queue = [{ node: startNode, distance: 0 }];\n  let visited = new Set();\n  visited.add(startNode);\n\n  while (queue.length > 0) {\n    let current = queue.shift(); \n    \n    if (current.node === targetNode) return current.distance;\n\n    for (let neighbor of graph[current.node]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push({ node: neighbor, distance: current.distance + 1 });\n      }\n    }\n  }\n  return -1;\n}"
          },
          {
            language: "Python",
            code: "from collections import deque\n\ndef bfsShortestPath(graph, startNode, targetNode):\n    queue = deque([(startNode, 0)])\n    visited = set([startNode])\n    \n    while queue:\n        node, distance = queue.popleft()\n        \n        if node == targetNode:\n            return distance\n            \n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append((neighbor, distance + 1))\n                \n    return -1"
          },
          {
            language: "Java",
            code: "class Solution {\n    public int bfsShortestPath(List<List<Integer>> graph, int start, int target) {\n        Queue<int[]> queue = new LinkedList<>();\n        Set<Integer> visited = new HashSet<>();\n        \n        queue.offer(new int[]{start, 0});\n        visited.add(start);\n        \n        while (!queue.isEmpty()) {\n            int[] current = queue.poll();\n            int node = current[0];\n            int dist = current[1];\n            \n            if (node == target) return dist;\n            \n            for (int neighbor : graph.get(node)) {\n                if (!visited.contains(neighbor)) {\n                    visited.add(neighbor);\n                    queue.offer(new int[]{neighbor, dist + 1});\n                }\n            }\n        }\n        return -1;\n    }\n}"
          },
          {
            language: "C++",
            code: "int bfsShortestPath(vector<vector<int>>& graph, int start, int target) {\n    queue<pair<int, int>> q;\n    unordered_set<int> visited;\n    \n    q.push({start, 0});\n    visited.insert(start);\n    \n    while(!q.empty()) {\n        auto current = q.front();\n        q.pop();\n        \n        int node = current.first;\n        int dist = current.second;\n        \n        if(node == target) return dist;\n        \n        for(int neighbor : graph[node]) {\n            if(visited.find(neighbor) == visited.end()) {\n                visited.insert(neighbor);\n                q.push({neighbor, dist + 1});\n            }\n        }\n    }\n    return -1;\n}"
          }
        ]
      }
    ]
  }
];
