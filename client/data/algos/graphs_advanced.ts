import { AlgorithmEntry } from "./types";

export const graphsAdvancedAlgorithms: AlgorithmEntry[] = [
  {
    id: "flood-fill",
    title: "Flood Fill",
    topic: "Graphs - Traversal",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Perform a 'flood fill' on an image starting from a source pixel, changing the color of the source and all same-colored adjacent pixels.",
    leetcodeLink: "https://leetcode.com/problems/flood-fill/",
    useCases: ["Paint-bucket tool in graphics apps", "Spreading infection models", "MineSweeper reveal logic"],
    approaches: [
       {
          name: "Optimal (Depth First Search)",
          description: "### 🧠 The Core Concept\nImagine you spill a glass of water on a tiled floor. The water will flow only onto adjacent tiles that aren't blocked by a wall or a different 'layer'. \n\nIn Flood Fill, we change the color of the starting pixel, then recursively do the same for its 4 neighbors (Up, Down, Left, Right) as long as they have the **Original Color**.\n\n### 🛠️ Execution Strategy\n1. **Color Check**: If the target `color` is already the `newColor`, return immediately (to prevent an infinite loop!).\n2. **DFS Function**:\n   - Base Case: If out of bounds or current pixel != `oldColor`, return.\n   - Action: Set `image[r][c] = newColor`.\n   - Recurse: Call DFS for all 4 neighbors.\n3. Return the modified image.",
          timeComplexity: "O(N * M)",
          timeComplexityExplanation: "In the worst case, we visit every single pixel in the image grid once.",
          spaceComplexity: "O(N * M)",
          spaceComplexityExplanation: "The recursive stack depth can reach the total number of pixels in a giant uniform image.",
          implementations: [
             {
                language: "Python",
                code: "def floodFill(image, sr, sc, color):\n    old_color = image[sr][sc]\n    if old_color == color: return image\n    \n    def dfs(r, c):\n        if r < 0 or r >= len(image) or c < 0 or c >= len(image[0]): return\n        if image[r][c] != old_color: return\n        \n        image[r][c] = color\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n        \n    dfs(sr, sc)\n    return image"
             },
             {
                language: "JavaScript",
                code: "function floodFill(image, sr, sc, color) {\n    const oldColor = image[sr][sc];\n    if (oldColor === color) return image;\n    \n    function dfs(r, c) {\n        if (r < 0 || r >= image.length || c < 0 || c >= image[0].length) return;\n        if (image[r][c] !== oldColor) return;\n        \n        image[r][c] = color;\n        dfs(r + 1, c);\n        dfs(r - 1, c);\n        dfs(r, c + 1);\n        dfs(r, c - 1);\n    }\n    \n    dfs(sr, sc);\n    return image;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "01-matrix-bipartite-graph",
    title: "01 Matrix",
    topic: "Graphs - BFS",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Given an m x n binary matrix, find the distance of the nearest 0 for each cell.",
    leetcodeLink: "https://leetcode.com/problems/01-matrix/",
    useCases: ["Pathfinding in 2D grids", "Network latency mapping", "Shadow calculation in graphics"],
    approaches: [
       {
          name: "Optimal (Multi-Source BFS)",
          description: "### 🧠 The Core Concept\nIf you want to find the distance to the nearest '0' for every '1', don't start at the '1's! If you start at every '1' and search for a '0', you'll do a lot of redundant work ($O(N^2 M^2)$).\n\nInstead, start at **ALL ZEROS simultanously**. Think of it like a ripple effect from every zero at once. The first time a 'ripple' reaches a '1', that is guaranteed to be the shortest path to a zero.\n\n### 🛠️ Execution Strategy\n1. Initialize a `queue` with the coordinates of all `0`s in the matrix.\n2. Mark all `1`s as unvisited (e.g., set their value to `-1` or `Infinity`).\n3. **BFS Pulse**:\n   - While queue is not empty, pop coordinate $(r, c)$.\n   - For each 4 neighbors $(nr, nc)$:\n     - If neighbor is valid AND currently set to `-1`:\n       - Update `matrix[nr][nc] = matrix[r][c] + 1`.\n       - Add $(nr, nc)$ to the queue.\n4. Return the matrix.",
          timeComplexity: "O(N * M)",
          timeComplexityExplanation: "Every cell is added to and removed from the queue exactly once.",
          spaceComplexity: "O(N * M)",
          spaceComplexityExplanation: "The queue can store up to $N \\times M$ coordinates in the worst case scenario.",
          implementations: [
             {
                language: "Python",
                code: "from collections import deque\n\ndef updateMatrix(mat):\n    rows, cols = len(mat), len(mat[0])\n    q = deque()\n    for r in range(rows):\n        for c in range(cols):\n            if mat[r][c] == 0: q.append((r, c))\n            else: mat[r][c] = -1\n            \n    while q:\n        r, c = q.popleft()\n        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:\n            nr, nc = r+dr, c+dc\n            if 0 <= nr < rows and 0 <= nc < cols and mat[nr][nc] == -1:\n                mat[nr][nc] = mat[r][c] + 1\n                q.append((nr, nc))\n    return mat"
             },
             {
                language: "JavaScript",
                code: "function updateMatrix(mat) {\n    const rows = mat.length, cols = mat[0].length;\n    const q = [];\n    for (let r = 0; r < rows; r++) {\n        for (let c = 0; c < cols; c++) {\n            if (mat[r][c] === 0) q.push([r, c]);\n            else mat[r][c] = -1;\n        }\n    }\n    \n    let head = 0;\n    while (head < q.length) {\n        const [r, c] = q[head++];\n        for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {\n            const nr = r + dr, nc = c + dc;\n            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && mat[nr][nc] === -1) {\n                mat[nr][nc] = mat[r][c] + 1;\n                q.push([nr, nc]);\n            }\n        }\n    }\n    return mat;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "surrounded-regions",
    title: "Surrounded Regions",
    topic: "Graphs - Boundary DFS",
    category: "Graphs",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Given an m x n matrix board containing 'X' and 'O', capture all regions that are 4-directionally surrounded by 'X'.",
    leetcodeLink: "https://leetcode.com/problems/surrounded-regions/",
    useCases: ["Game state 'capture' logic (Go/Othello)", "Island isolation analysis", "Image thresholding"],
    approaches: [
       {
          name: "Optimal (Inverse Boundary Check)",
          description: "### 🧠 The Core Concept\nAny 'O' that is **connected to the boundary** can NEVER be surrounded. Everyone else is a target for capture.\n\nInstead of checking every 'O' to see if it's trapped, we find every 'O' on the four edges and run a DFS to mark all its connected buddies as 'SAFE'. Everything else remains 'O' and should be flipped to 'X'.\n\n### 🛠️ Execution Strategy\n1. **Edge DFS**: Run DFS for every 'O' on the top row, bottom row, left column, and right column.\n2. **Marking**: In the DFS, change 'O' to a temporary character (e.g., 'S' for Safe).\n3. **The Final Sweep**:\n   - If a cell is 'O' (and wasn't marked Safe), flip it to 'X'.\n   - If a cell is 'S' (Safe), flip it back to 'O'.",
          timeComplexity: "O(N * M)",
          timeComplexityExplanation: "We traverse the matrix twice (once for boundary DFS, once for the final sweep).",
          spaceComplexity: "O(N * M)",
          spaceComplexityExplanation: "Worst case recursion stack depth for a giant sea of 'O's connected to a boundary.",
          implementations: [
             {
                language: "Python",
                code: "def solve(board):\n    if not board: return\n    \n    rows, cols = len(board), len(board[0])\n    \n    def dfs(r, c):\n        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != 'O': return\n        board[r][c] = 'S'\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    \n    for r in range(rows):\n        dfs(r, 0); dfs(r, cols-1)\n    for c in range(cols):\n        dfs(0, c); dfs(rows-1, c)\n    \n    for r in range(rows):\n        for c in range(cols):\n            if board[r][c] == 'O': board[r][c] = 'X'\n            elif board[r][c] == 'S': board[r][c] = 'O'"
             }
          ]
       }
    ]
  },
  {
    id: "number-of-enclaves",
    title: "Number of Enclaves",
    topic: "Graphs - Boundary DFS",
    category: "Graphs",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Return the number of land cells (1s) in a grid for which we cannot walk off the boundary of the grid in any number of moves.",
    leetcodeLink: "https://leetcode.com/problems/number-of-enclaves/",
    useCases: ["Finding isolated communities", "Analyzing landmass insulation", "Security perimeter analysis"],
    approaches: [
       {
          name: "Optimal (Boundary Neutralization)",
          description: "### 🧠 The Core Concept\nThis is nearly identical to 'Surrounded Regions'. Any land (1) touching the boundary allows you to 'escape'. We want to count the landlocked '1's.\n\n### 🛠️ Execution Strategy\n1. **Boundary DFS**: For every '1' on the edge, run DFS to switch it (and all connected land) to '0' (water). These are the 'Escapable' islands.\n2. **The Result**: Count how many '1's are left in the grid. Since they weren't connected to the boundary, they are enclaves.",
          timeComplexity: "O(N * M)",
          timeComplexityExplanation: "Each cell is processed at most twice.",
          spaceComplexity: "O(N * M)",
          spaceComplexityExplanation: "DFS recursion depth.",
          implementations: [
             {
                language: "JavaScript",
                code: "function numEnclaves(grid) {\n    const rows = grid.length, cols = grid[0].length;\n    \n    function dfs(r, c) {\n        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === 0) return;\n        grid[r][c] = 0;\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);\n    }\n    \n    for (let r = 0; r < rows; r++) { dfs(r, 0); dfs(r, cols-1); }\n    for (let c = 0; c < cols; c++) { dfs(0, c); dfs(rows-1, c); }\n    \n    let count = 0;\n    for (let r = 0; r < rows; r++) {\n        for (let c = 0; c < cols; c++) {\n            if (grid[r][c] === 1) count++;\n        }\n    }\n    return count;\n}"
             }
          ]
       }
    ]
  },
  {
    id: "word-ladder-i",
    title: "Word Ladder I",
    topic: "Graphs - Shortest Path BFS",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Find the length of the shortest transformation sequence from a beginWord to an endWord using a dictionary, where only one letter can be changed at a time.",
    leetcodeLink: "https://leetcode.com/problems/word-ladder/",
    useCases: ["Search engine 'Did you mean?' suggestions", "Genomic sequence mutation analysis", "Efficient string transitions"],
    approaches: [
       {
          name: "Optimal (Breadth First Search)",
          description: "### 🧠 The Core Concept\nThis is a Shortest Path problem in an unweighted graph where every word is a node and an edge exists if words differ by exactly one letter. **BFS** is the gold-standard for finding the shortest path.\n\n### 🛠️ Execution Strategy\n1. **Dictionary Prep**: Convert the word list to a Set for $O(1)$ lookups.\n2. **BFS Initialization**: Queue starts with `[beginWord, 1]` (word and level).\n3. **Layered Search**:\n   - While queue has words, for each word:\n     - Try changing each of its characters ($26$ letters per position).\n     - If the new word is `endWord`, return `level + 1`.\n     - If the new word is in our dictionary set, add it to the queue and **REMOVE** it from the set (to prevent loops).\n4. Return 0 if no path is found.",
          timeComplexity: "O(M^2 * N)",
          timeComplexityExplanation: "M is word length, N is total words. We check M positions, 26 letters each, and string slicing takes O(M).",
          spaceComplexity: "O(M^2 * N)",
          spaceComplexityExplanation: "Total storage for the word graph/queue.",
          implementations: [
             {
                language: "Python",
                code: "from collections import deque\n\ndef ladderLength(beginWord, endWord, wordList):\n    wordSet = set(wordList)\n    if endWord not in wordSet: return 0\n    \n    q = deque([(beginWord, 1)])\n    while q:\n        word, length = q.popleft()\n        if word == endWord: return length\n        \n        for i in range(len(word)):\n            for char in 'abcdefghijklmnopqrstuvwxyz':\n                next_word = word[:i] + char + word[i+1:]\n                if next_word in wordSet:\n                    wordSet.remove(next_word)\n                    q.append((next_word, length + 1))\n    return 0"
             }
          ]
       }
    ]
  },
  {
    id: "word-ladder-ii",
    title: "Word Ladder II",
    topic: "Graphs - Hard BFS + DFS",
    category: "Graphs",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Find all shortest transformation sequences from beginWord to endWord.",
    leetcodeLink: "https://leetcode.com/problems/word-ladder-ii/",
    useCases: ["Finding all optimal paths in network routing", "Complete sequence reconstruction"],
    approaches: [
       {
          name: "Optimal (BFS Layer Building + DFS Backtracking)",
          description: "### 🧠 The Core Concept\nWord Ladder I only asked for the *length*. Word Ladder II asks for the *paths*. \n\nWe cannot just run BFS and save paths at every node because the memory would explode. Instead:\n1. Run **BFS** to build a 'Distance Map' indicating the shortest distance of every word from the start.\n2. Once we have the map, we start at the `endWord` and run a **DFS/Backtracking** search 'downhill' (always moving to a neighbor that is 1 step closer to the start).\n\n### 🛠️ Execution Strategy\n- **BFS Phase**: Record `adj` (adjacency list) where we only keep edges that move forward in distance.\n- **DFS Phase**: Simple backtracking using the `adj` list to reconstruct all valid paths from start to end.",
          timeComplexity: "O(K * N * 26 + Paths)",
          timeComplexityExplanation: "BFS takes O(K*N*26). Backtracking complexity depends on the number of valid shortest paths.",
          spaceComplexity: "O(Total Words)",
          spaceComplexityExplanation: "Storage for the distance map and adjacency list.",
          implementations: [
             {
                language: "Python",
                code: "from collections import deque, defaultdict\n\ndef findLadders(beginWord, endWord, wordList):\n    wordSet = set(wordList)\n    if endWord not in wordSet: return []\n    \n    adj = defaultdict(list)\n    dist = {beginWord: 0}\n    q = deque([beginWord])\n    found = False\n    \n    while q and not found:\n        visited_this_level = set()\n        for _ in range(len(q)):\n            word = q.popleft()\n            for i in range(len(word)):\n                for c in 'abcdefghijklmnopqrstuvwxyz':\n                    next_w = word[:i] + c + word[i+1:]\n                    if next_w in wordSet:\n                        if next_w not in dist or dist[next_w] == dist[word] + 1:\n                            adj[word].append(next_w)\n                            if next_w not in dist:\n                                dist[next_w] = dist[word] + 1\n                                q.append(next_w)\n                                visited_this_level.add(next_w)\n                            if next_w == endWord: found = True\n\n    res = []\n    def backtrack(word, path):\n        if word == endWord:\n            res.append(list(path))\n            return\n        for next_w in adj[word]:\n            path.append(next_w)\n            backtrack(next_w, path)\n            path.pop()\n\n    backtrack(beginWord, [beginWord])\n    return res"
             }
          ]
       }
    ]
  }
];
