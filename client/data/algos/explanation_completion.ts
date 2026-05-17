import type { AlgorithmApproach, AlgorithmEntry } from "./types";

type FamilyKey =
  | "two-pointers"
  | "sliding-window"
  | "binary-search"
  | "prefix-hash"
  | "dynamic-programming"
  | "graph"
  | "tree"
  | "linked-list"
  | "stack-queue"
  | "heap"
  | "trie"
  | "greedy"
  | "backtracking"
  | "sorting"
  | "bit"
  | "math"
  | "general";

type FamilyExplanation = {
  label: string;
  plainGoal: string;
  mentalModel: string;
  state: string[];
  steps: string[];
  dryRun: string[];
  invariant: string;
  why: string[];
  pitfalls: string[];
  selfCheck: string[];
};

const MIN_EXPLANATION_WORDS = 260;

export function completeAlgorithmExplanations(algorithms: AlgorithmEntry[]): AlgorithmEntry[] {
  return algorithms.map((algorithm) => ({
    ...algorithm,
    approaches: algorithm.approaches.map((approach) => ({
      ...approach,
      description: shouldUpgradeExplanation(approach.description)
        ? buildBeginnerExplanation(algorithm, approach)
        : approach.description,
    })),
  }));
}

function shouldUpgradeExplanation(description: string) {
  const text = clean(description);
  const words = text ? text.split(/\s+/).length : 0;
  const lower = text.toLowerCase();
  return (
    words < MIN_EXPLANATION_WORDS ||
    !/(dry run|example walk|trace)/.test(lower) ||
    !/(pitfall|edge case|watch out|mistake)/.test(lower) ||
    !/(why|invariant|proof)/.test(lower)
  );
}

function buildBeginnerExplanation(algorithm: AlgorithmEntry, approach: AlgorithmApproach) {
  const family = familyExplanations[detectFamily(algorithm, approach)];

  return [
    `## Beginner-first walkthrough`,
    "",
    `### 1. What this problem is asking`,
    `${algorithm.title} asks you to solve this in plain terms: ${plainOverview(algorithm)} The selected approach is **${approach.name}**, which belongs to the **${family.label}** pattern.`,
    "",
    `Think of the input as a small story rather than code. Your job is to keep just enough information from the part you have already inspected so that the next decision becomes obvious. You do not need to remember everything; you only keep the state that can still change the final answer.`,
    "",
    `### 2. Mental model`,
    `${family.mentalModel}`,
    "",
    `For this specific algorithm, the useful question is: "After I look at the current item or current state, what fact can I safely keep, discard, or update?" Once that question is clear, the code becomes a direct translation of the thought process.`,
    "",
    `### 3. State to keep in your head`,
    ...family.state.map((item) => `- ${item}`),
    `- The current answer candidate for **${algorithm.title}**.`,
    `- The stopping condition: when every useful candidate has either been processed or safely ruled out.`,
    "",
    `### 4. Step-by-step algorithm`,
    ...family.steps.map((step, index) => `${index + 1}. ${step}`),
    `${family.steps.length + 1}. Return the final answer in the format the problem expects.`,
    "",
    `### 5. Dry run you can follow by hand`,
    `Use a tiny input first. Do not start with the largest sample; beginners learn the pattern faster when the state changes are visible.`,
    ...family.dryRun.map((step, index) => `${index + 1}. ${step}`),
    `${family.dryRun.length + 1}. After the final step, compare the tracked answer with the expected result. If they differ, the bug is usually in the update order or boundary condition.`,
    "",
    `### 6. Invariant`,
    `${family.invariant}`,
    "",
    `An invariant is the promise that stays true after every loop iteration or recursive call. When you can say the invariant out loud, you can debug the algorithm without guessing.`,
    "",
    `### 7. Why this works`,
    ...family.why.map((item) => `- ${item}`),
    `- The algorithm is not magic; it is repeatedly applying the same safe decision until no useful work remains.`,
    "",
    `### 8. Common pitfalls and edge cases`,
    ...family.pitfalls.map((item) => `- ${item}`),
    `- Test the smallest input, a normal input, and an input where the answer sits at the boundary.`,
    "",
    `### 9. Complexity, explained slowly`,
    `- **Time complexity: ${approach.timeComplexity}.** ${complexitySentence("time", approach.timeComplexity)}`,
    `- **Space complexity: ${approach.spaceComplexity}.** ${complexitySentence("space", approach.spaceComplexity)}`,
    "",
    `### 10. Self-check before coding`,
    ...family.selfCheck.map((item) => `- ${item}`),
    `- Can you explain what each variable means without reading the code comments?`,
    `- Can you run the first two iterations by hand? If yes, the implementation is usually straightforward.`,
  ].join("\n");
}

const familyExplanations: Record<FamilyKey, FamilyExplanation> = {
  "two-pointers": {
    label: "two pointers",
    plainGoal: "compare two positions and move the position that can no longer produce a better answer",
    mentalModel:
      "Imagine two fingers placed on useful positions, often the left and right ends. Each comparison tells you which finger should move. The key is that one move eliminates many impossible candidates at once.",
    state: [
      "A left pointer that represents the smaller, earlier, or opening side.",
      "A right pointer that represents the larger, later, or closing side.",
      "The value produced by the two pointers together, such as a sum, width, area, or match.",
    ],
    steps: [
      "Prepare the input if ordering is required, usually by sorting or by using an already sorted structure.",
      "Place the two pointers at their starting positions.",
      "Compute what the current two positions give you.",
      "If the current state answers the problem, record it or return it.",
      "Move the pointer whose side has been proven too small, too large, or no longer useful.",
      "Repeat until the pointers meet, cross, or the answer is found.",
    ],
    dryRun: [
      "Write the current left value, right value, and their combined result.",
      "Ask whether the result is too small, too large, or just right.",
      "Move only one pointer and write the new pair.",
      "Notice that the skipped pair does not need to be checked again because the comparison already ruled it out.",
    ],
    invariant:
      "Every candidate outside the current pointer range has already been proven impossible or worse than the best answer seen so far.",
    why: [
      "Sorted order or boundary dominance gives a reason to discard one side.",
      "Each pointer only moves in one direction, so the algorithm cannot loop forever.",
      "Because skipped candidates are ruled out in groups, the scan is much faster than trying every pair.",
    ],
    pitfalls: [
      "Sorting can destroy original indices unless you store value-index pairs.",
      "Duplicate values may need special handling when the answer requires unique combinations.",
      "Use `left < right` when the same element cannot be used twice.",
    ],
    selfCheck: [
      "Can you justify why the left pointer moves instead of the right pointer?",
      "Can you explain what happens when the current value is exactly the target?",
    ],
  },
  "sliding-window": {
    label: "sliding window",
    plainGoal: "maintain a contiguous range while expanding and shrinking it",
    mentalModel:
      "Picture a movable frame over an array or string. The right edge brings in new data. The left edge removes old data when the frame breaks the rule.",
    state: [
      "The left boundary of the current window.",
      "The right boundary being added to the window.",
      "A compact summary of the window, such as counts, sum, distinct values, or validity flags.",
    ],
    steps: [
      "Start with an empty or minimal window.",
      "Move the right boundary forward and include the new item in the window state.",
      "While the window violates the rule, move the left boundary and remove its item from the state.",
      "When the window is valid, update the answer.",
      "Continue until the right boundary reaches the end.",
    ],
    dryRun: [
      "Draw brackets around the current window.",
      "Add the next item on the right and update the stored sum or counts.",
      "If the rule breaks, remove items from the left until the rule becomes true again.",
      "Record the best length, count, or value only at the moment the window has the required meaning.",
    ],
    invariant:
      "The stored state always describes exactly the elements between left and right, no more and no less.",
    why: [
      "Every item enters the window once.",
      "Every item leaves the window at most once.",
      "That gives linear work while still exploring all useful contiguous ranges.",
    ],
    pitfalls: [
      "Updating the answer before the window is valid gives wrong results.",
      "For exactly-k problems, at-most-k transformations may be needed.",
      "Negative numbers can break sum-based shrinking logic.",
    ],
    selfCheck: [
      "Can you say the exact condition that makes the window shrink?",
      "Can you say whether the answer updates before or after shrinking?",
    ],
  },
  "binary-search": {
    label: "binary search",
    plainGoal: "discard half of a sorted or monotonic search space after each check",
    mentalModel:
      "Think of guessing a number in a range. Each middle check tells you whether the answer is on the left side, right side, or at the middle.",
    state: [
      "A low boundary for the smallest candidate still possible.",
      "A high boundary for the largest candidate still possible.",
      "A middle candidate used to ask a yes-or-no question.",
    ],
    steps: [
      "Define exactly what the search space contains: indices, values, days, capacity, distance, or answer size.",
      "Write the condition that tells whether a middle value is feasible or too small/large.",
      "Compute the middle safely.",
      "Use the condition to keep the half that can still contain the answer.",
      "When searching for a boundary, store the current feasible answer before moving inward.",
      "Stop when the boundaries cross or collapse.",
    ],
    dryRun: [
      "Write low, high, and mid.",
      "Evaluate the predicate at mid in plain English.",
      "Cross out the half that cannot contain the answer.",
      "Repeat until only the answer boundary remains.",
    ],
    invariant:
      "If the answer exists, it is always inside the current [low, high] search range or stored as the best feasible answer.",
    why: [
      "Monotonicity means once a candidate is too small or too large, a whole side is also impossible.",
      "The range shrinks quickly because roughly half the candidates disappear each time.",
      "Boundary variants work because feasible candidates are remembered before continuing the search.",
    ],
    pitfalls: [
      "Using `while low < high` versus `while low <= high` changes the update rules.",
      "For first/last occurrence, do not return immediately when you see a match.",
      "A wrong midpoint update can create an infinite loop on two elements.",
    ],
    selfCheck: [
      "Can you define the predicate without code?",
      "Can you test the loop on one-element and two-element ranges?",
    ],
  },
  "prefix-hash": {
    label: "prefix state with hashing",
    plainGoal: "turn a range question into a lookup against earlier prefix values",
    mentalModel:
      "A prefix is the running total up to the current point. A subarray or substring value is the difference between two prefixes.",
    state: [
      "The current prefix value, such as sum, xor, balance, or encoded count.",
      "A map from previously seen prefix values to counts or indices.",
      "The answer accumulated from matching earlier prefixes.",
    ],
    steps: [
      "Start with the neutral prefix in the map when empty ranges matter.",
      "Scan the input from left to right.",
      "Update the current prefix with the new item.",
      "Compute which previous prefix would make a valid range with the current prefix.",
      "Use the map to count or locate that previous prefix.",
      "Store the current prefix for future positions.",
    ],
    dryRun: [
      "Make a table with columns: index, value, prefix, needed previous prefix, answer.",
      "Begin with prefix 0 already in the map if the range can start at index 0.",
      "At each row, look up the needed prefix before or after inserting the current prefix according to the problem.",
      "Watch how a long range becomes one map lookup.",
    ],
    invariant:
      "Before processing the next item, the map contains exactly the prefix information allowed to pair with future positions.",
    why: [
      "For any range, range value equals current prefix minus an earlier prefix.",
      "The map remembers all useful earlier prefixes without scanning backward.",
      "This handles negative values better than a simple shrinking window.",
    ],
    pitfalls: [
      "For count problems, store frequencies rather than only one index.",
      "For longest-length problems, store the earliest index of each prefix.",
      "Inserting the current prefix too early can accidentally count an empty range.",
    ],
    selfCheck: [
      "Can you write the prefix equation for this problem?",
      "Can you explain what the map value stores: count, first index, last index, or boolean?",
    ],
  },
  "dynamic-programming": {
    label: "dynamic programming",
    plainGoal: "solve smaller overlapping problems and reuse their answers",
    mentalModel:
      "Dynamic programming is a notebook of answers. Instead of solving the same smaller question again and again, you write it once and reuse it.",
    state: [
      "The DP state, meaning exactly what one cell or function call represents.",
      "Base cases for the smallest inputs.",
      "A transition that builds a bigger answer from smaller answers.",
    ],
    steps: [
      "Define the state in one sentence.",
      "Write the base cases before thinking about loops.",
      "List the choices available at the current state.",
      "Convert those choices into a recurrence or transition.",
      "Fill states in an order where dependencies are already known, or use memoized recursion.",
      "Return the state representing the full original problem.",
    ],
    dryRun: [
      "Draw the DP table or recursion tree for a tiny input.",
      "Fill the base cases first.",
      "Compute one non-base cell slowly and name which previous cells it uses.",
      "Repeat until the final cell or memoized call is clear.",
    ],
    invariant:
      "Every filled DP state is the correct answer for the exact subproblem named by the state definition.",
    why: [
      "The recurrence considers every valid choice.",
      "The base cases anchor the recursion so it has known starting answers.",
      "Memoization or tabulation prevents repeated work.",
    ],
    pitfalls: [
      "If the state definition is vague, the code becomes guesswork.",
      "Space optimization should come after the full DP is correct.",
      "Loop order matters when a state depends on previous row or previous column values.",
    ],
    selfCheck: [
      "Can you say what `dp[i]` or `dp[i][j]` means in plain English?",
      "Can you identify the base case and final answer cell?",
    ],
  },
  graph: {
    label: "graph traversal",
    plainGoal: "explore nodes and edges while tracking reachability, distance, order, or components",
    mentalModel:
      "A graph is a map of places and roads. The algorithm decides which place to visit next and what information to record when a road is inspected.",
    state: [
      "The adjacency structure that tells which neighbors each node has.",
      "Visited, distance, parent, indegree, or component arrays depending on the problem.",
      "A stack, queue, priority queue, or recursion call stack that controls exploration order.",
    ],
    steps: [
      "Model the input as nodes and edges.",
      "Initialize traversal state for all nodes.",
      "Choose BFS, DFS, topological sort, Dijkstra, union-find, or another graph tool based on the goal.",
      "Process one node at a time and inspect its neighbors.",
      "Update neighbor state only when you discover, improve, or validate something.",
      "Handle disconnected components if the problem is not guaranteed connected.",
    ],
    dryRun: [
      "Draw four or five nodes and their edges.",
      "Mark the starting node and put it into the traversal structure.",
      "Pop or remove one node, then write which neighbors change state.",
      "Continue until the structure is empty or the target condition is reached.",
    ],
    invariant:
      "A visited or finalized node has already been processed according to the traversal rule, so duplicate work can be skipped safely.",
    why: [
      "Every edge is considered through its endpoint relationships.",
      "The traversal structure enforces the property needed: BFS for levels, DFS for depth, priority queue for best distance.",
      "Visited/finalized state prevents infinite cycling.",
    ],
    pitfalls: [
      "For disconnected graphs, starting from node 0 is not enough.",
      "One-indexed input must be converted carefully if arrays are zero-indexed.",
      "Weighted shortest paths need Dijkstra or Bellman-Ford, not plain BFS unless all weights are equal.",
    ],
    selfCheck: [
      "Can you define what a node and edge represent here?",
      "Can you explain why the chosen traversal structure is appropriate?",
    ],
  },
  tree: {
    label: "tree recursion",
    plainGoal: "solve each subtree and combine child answers at the parent",
    mentalModel:
      "A tree problem is a conversation between a parent and its children. Each child returns a small piece of information; the parent combines those pieces with its own value.",
    state: [
      "The current node.",
      "The value returned by the left subtree.",
      "The value returned by the right subtree.",
      "Any global answer updated when the current node forms a candidate.",
    ],
    steps: [
      "Handle the null node first.",
      "Ask the left subtree for the information needed.",
      "Ask the right subtree for the information needed.",
      "Combine both answers with the current node.",
      "Update the global or returned answer.",
      "Return exactly what the parent needs.",
    ],
    dryRun: [
      "Use a three-node tree first.",
      "Write the value returned by each leaf.",
      "Move one level up and combine the child returns.",
      "Check whether the final answer is stored globally or returned from the root.",
    ],
    invariant:
      "When a recursive call returns, the entire subtree rooted at that node has already been solved for the return-value definition.",
    why: [
      "Tree subproblems do not overlap because each node belongs to exactly one subtree.",
      "Postorder works well when a parent depends on child results.",
      "BST variants become faster by using the ordering rule to skip whole subtrees.",
    ],
    pitfalls: [
      "Do not confuse the value returned to the parent with the global best answer.",
      "Skewed trees can have recursion depth O(N).",
      "Null child handling is often where off-by-one height bugs appear.",
    ],
    selfCheck: [
      "Can you say what the recursive function returns?",
      "Does the current node need preorder, inorder, or postorder behavior?",
    ],
  },
  "linked-list": {
    label: "linked list pointer work",
    plainGoal: "move or reconnect nodes without losing access to the rest of the list",
    mentalModel:
      "A linked list is a chain where each node only knows the next node. Before changing a link, save the node you will need later.",
    state: [
      "The current node being processed.",
      "A previous pointer, next pointer, dummy node, or fast/slow pair.",
      "The head of the result list when the original head might change.",
    ],
    steps: [
      "Create a dummy node if deleting, merging, or rebuilding near the head.",
      "Save `next` before changing `current.next`.",
      "Rewire the needed pointer.",
      "Advance pointers in a safe order.",
      "Return the correct head, often `dummy.next` or the final previous pointer.",
    ],
    dryRun: [
      "Draw three nodes with arrows.",
      "Mark `prev`, `curr`, and `next`.",
      "Change exactly one arrow and confirm the remaining list is still reachable.",
      "Advance the labels and repeat.",
    ],
    invariant:
      "The processed part is already correctly wired, and the unprocessed part has not been lost.",
    why: [
      "Saving pointers before rewiring preserves access.",
      "A dummy node removes special cases around the head.",
      "Fast/slow pointers reveal middle, cycle, or gap information with one pass.",
    ],
    pitfalls: [
      "Changing `curr.next` before saving `next` can lose the rest of the list.",
      "Returning the old head after head deletion or reversal is wrong.",
      "Cycle problems need reference comparison, not value comparison.",
    ],
    selfCheck: [
      "Can you draw the pointer positions before and after one iteration?",
      "Can the head node change? If yes, use a dummy or return the new head.",
    ],
  },
  "stack-queue": {
    label: "stack and queue discipline",
    plainGoal: "store unresolved candidates in the order they should be answered",
    mentalModel:
      "A stack remembers the most recent unresolved item. A queue remembers the oldest item waiting its turn. A monotonic structure removes candidates that can no longer win.",
    state: [
      "The stack, queue, or deque.",
      "What each stored item represents: value, index, pair, or state.",
      "The answer array or result built when items become resolved.",
    ],
    steps: [
      "Choose the structure based on needed order: stack for nearest previous/next, queue for levels, deque for windows.",
      "Before adding a new item, remove items that are resolved, expired, or dominated.",
      "Use the remaining top/front item to update the answer.",
      "Push the current item if it can help future positions.",
      "Continue until all items are processed.",
    ],
    dryRun: [
      "Write the stack or queue contents after each input item.",
      "When an item is popped, write exactly why it is no longer useful.",
      "When an answer is filled, connect it to the item that caused the pop or front check.",
      "At the end, handle unresolved items according to the default answer.",
    ],
    invariant:
      "The structure contains only candidates that are still useful and unresolved under the chosen order.",
    why: [
      "Each item is pushed once and popped at most once.",
      "The top or front exposes the next candidate that can affect the answer.",
      "Removing dominated items early keeps the structure small and meaningful.",
    ],
    pitfalls: [
      "For distance or window problems, store indices rather than only values.",
      "Equal values need a deliberate pop-or-keep rule.",
      "Empty checks must happen before reading top/front.",
    ],
    selfCheck: [
      "Can you explain what one stack entry means?",
      "Can you justify each pop condition?",
    ],
  },
  heap: {
    label: "heap priority processing",
    plainGoal: "always process the currently best or most urgent candidate",
    mentalModel:
      "A heap is a waiting room ordered by priority. The next item removed is the minimum or maximum according to the priority rule.",
    state: [
      "The heap entries and their priority.",
      "Any map, distance array, or count table feeding the heap.",
      "A rule for skipping stale heap entries if better information has already been found.",
    ],
    steps: [
      "Define the priority clearly.",
      "Insert initial candidates into the heap.",
      "Pop the best current candidate.",
      "Skip it if it is stale or already finalized.",
      "Use it to update the answer or push new candidates.",
      "Stop when the target is finalized or the heap is empty.",
    ],
    dryRun: [
      "Write heap entries as `(priority, value)` pairs.",
      "Pop the smallest or largest priority entry.",
      "Show which new entries are pushed because of that pop.",
      "If an old entry is stale, cross it out and continue.",
    ],
    invariant:
      "Among all available non-stale candidates, the heap top is the next best candidate to process.",
    why: [
      "The heap avoids sorting the whole candidate list after each update.",
      "Priority order guarantees the next pop is the locally best available choice.",
      "For shortest path style problems, finalized distances cannot be improved later when edge assumptions hold.",
    ],
    pitfalls: [
      "Some languages have only min-heaps, so max-heap needs negated priorities or custom comparators.",
      "Stale entries may remain after a better value is pushed.",
      "Top-k problems often keep a heap of size k, not size n.",
    ],
    selfCheck: [
      "Can you say what makes one heap entry higher priority than another?",
      "Can stale entries appear? If yes, how are they ignored?",
    ],
  },
  trie: {
    label: "trie prefix indexing",
    plainGoal: "store shared prefixes once so prefix lookup becomes fast",
    mentalModel:
      "A trie is a tree of characters or bits. Walking from root to a node spells a prefix.",
    state: [
      "The root node.",
      "Child pointers or maps for each symbol.",
      "Metadata such as end-of-word, count, index, or best value.",
    ],
    steps: [
      "Start at the root.",
      "For insertion, create missing child nodes for each symbol.",
      "Mark the final node or update metadata.",
      "For search, follow existing child nodes symbol by symbol.",
      "Fail immediately if a needed child is missing.",
    ],
    dryRun: [
      "Insert two words with the same prefix.",
      "Notice that the shared prefix nodes are reused.",
      "Search one full word and one missing word.",
      "Watch where the missing search fails.",
    ],
    invariant:
      "Every node represents exactly the prefix formed by the path from the root to that node.",
    why: [
      "Shared prefixes are stored once.",
      "Lookup time depends on query length rather than number of stored words.",
      "Metadata at nodes turns prefix paths into counts, matches, or optimized answers.",
    ],
    pitfalls: [
      "End-of-word must be separate from having children.",
      "Duplicate insertions may need counters.",
      "Large alphabets can use significant memory if arrays are used for children.",
    ],
    selfCheck: [
      "Can you explain what one trie node represents?",
      "What metadata is stored at each node and why?",
    ],
  },
  greedy: {
    label: "greedy choice",
    plainGoal: "make the safest local choice and prove it does not block the best final answer",
    mentalModel:
      "Greedy algorithms are about choosing now. The hard part is proving the chosen local move can belong to some optimal solution.",
    state: [
      "The sorted or prioritized candidate list.",
      "The resource, boundary, or answer built so far.",
      "The condition that decides whether to accept the current candidate.",
    ],
    steps: [
      "Identify the local choice: earliest finish, smallest cost, largest profit, farthest reach, or best ratio.",
      "Sort or prioritize candidates so that choice appears naturally.",
      "Scan candidates in that order.",
      "Accept a candidate when it preserves feasibility or improves the answer.",
      "Update the state and continue.",
    ],
    dryRun: [
      "Sort the sample by the greedy key.",
      "Look at the first candidate and decide accept or skip.",
      "Write how the resource or boundary changes.",
      "Repeat and check that no accepted choice conflicts with earlier choices.",
    ],
    invariant:
      "After each accepted greedy choice, there is still an optimal solution consistent with all choices made so far.",
    why: [
      "The sort order makes the safest candidate appear first.",
      "An exchange argument shows replacing another choice with the greedy choice does not make the answer worse.",
      "The state update preserves feasibility for future choices.",
    ],
    pitfalls: [
      "A greedy-looking rule is not valid unless it has an exchange argument.",
      "Tie handling in sorting can affect implementation details.",
      "Some problems that look greedy actually need DP.",
    ],
    selfCheck: [
      "Can you state the greedy key?",
      "Can you explain why taking this candidate now is safe?",
    ],
  },
  backtracking: {
    label: "backtracking search",
    plainGoal: "try choices one by one, undo them, and explore the next possibility",
    mentalModel:
      "Backtracking is controlled trial and error. You build a partial answer, recurse, then undo the last choice so the next branch starts clean.",
    state: [
      "The current index or decision position.",
      "The partial path being built.",
      "Used markers, remaining target, or constraints.",
      "The result list or best answer.",
    ],
    steps: [
      "Define the recursive state.",
      "Write the base case where a full answer is found or a branch stops.",
      "Loop through valid choices.",
      "Apply one choice to the path/state.",
      "Recurse to explore deeper.",
      "Undo the choice before trying the next one.",
    ],
    dryRun: [
      "Draw a small decision tree with two or three levels.",
      "Follow the leftmost branch until the base case.",
      "Record the answer if valid.",
      "Undo the last choice and move to the sibling branch.",
    ],
    invariant:
      "At the start of each recursive call, the path and used-state exactly match the choices on the route from the root to that call.",
    why: [
      "Every valid answer corresponds to one path in the decision tree.",
      "Undoing choices prevents branches from contaminating each other.",
      "Pruning removes branches that cannot possibly become valid answers.",
    ],
    pitfalls: [
      "For mutable arrays, push before recursion and pop after recursion.",
      "When storing an answer, copy the path instead of storing the same mutable object.",
      "Duplicate skipping usually requires sorting first.",
    ],
    selfCheck: [
      "Can you name the choice, constraint, and goal?",
      "Can you point to the exact line that undoes a choice?",
    ],
  },
  sorting: {
    label: "sorting and scanning",
    plainGoal: "put related items next to each other, then scan once",
    mentalModel:
      "Sorting changes the problem from chaos to order. Once related items are neighbors, a simple scan can merge, count, compare, or choose.",
    state: [
      "The sorted input or sorted copy.",
      "The current group, interval, candidate, or boundary.",
      "The result built from completed groups.",
    ],
    steps: [
      "Choose the sort key that reveals the relationship.",
      "Sort the input or a copy if original order matters.",
      "Start the first group or candidate.",
      "Scan each next item and decide whether it joins the current group or starts a new one.",
      "Finalize the last group after the scan.",
    ],
    dryRun: [
      "Write the sample before and after sorting.",
      "Circle the first group or candidate.",
      "Move one item at a time and decide merge, count, skip, or start new.",
      "At the end, add the final pending group to the answer.",
    ],
    invariant:
      "All items before the scan position have been processed in sorted order and no later item can change their finalized relationship.",
    why: [
      "Sorting makes all potentially interacting items close together.",
      "The scan only needs local comparisons because global order has already been established.",
      "This replaces many pairwise comparisons with one organized pass.",
    ],
    pitfalls: [
      "Do not forget the sorting cost in time complexity.",
      "If original indices matter, sort pairs rather than raw values.",
      "Finalize the last interval or group after the loop.",
    ],
    selfCheck: [
      "Can you explain why this sort key was chosen?",
      "What exactly is stored as the current group or candidate?",
    ],
  },
  bit: {
    label: "bit manipulation",
    plainGoal: "use binary properties to store or transform information compactly",
    mentalModel:
      "Bits are tiny switches. Operations like AND, OR, XOR, and shifts let you test, turn on, turn off, or combine those switches directly.",
    state: [
      "The current mask, xor, count, or accumulated bit value.",
      "The bit position currently being inspected.",
      "The result derived from bit properties.",
    ],
    steps: [
      "Identify the bit law being used.",
      "Initialize the mask or accumulator.",
      "Process numbers or bit positions one at a time.",
      "Apply the bit operation to update state.",
      "Convert the final bit state into the requested answer.",
    ],
    dryRun: [
      "Write one small number in binary.",
      "Apply the operation to that binary representation.",
      "Track how the accumulator changes.",
      "Repeat until the pattern becomes obvious.",
    ],
    invariant:
      "The accumulator's bits always encode the property promised by the chosen bit operation.",
    why: [
      "Bit laws are deterministic, such as `x ^ x = 0` and `x & (x - 1)` removing the last set bit.",
      "A single integer can store many boolean states.",
      "The operations are constant time per bit or per number.",
    ],
    pitfalls: [
      "Signed integers and shifts can behave differently across languages.",
      "Operator precedence can surprise you; use parentheses.",
      "Zero and negative values need explicit thought.",
    ],
    selfCheck: [
      "Can you state the bit identity used?",
      "Can you demonstrate it on a tiny binary example?",
    ],
  },
  math: {
    label: "math and counting",
    plainGoal: "use a formula or number property instead of brute force",
    mentalModel:
      "Math algorithms work by finding the rule hiding inside the examples. Once the rule is known, the code mostly applies it carefully.",
    state: [
      "The current number, count, divisor, formula value, or remainder.",
      "Any boundary needed for loops, such as square root or digit count.",
      "The final computed result.",
    ],
    steps: [
      "Identify the mathematical property.",
      "Test the property on a very small input.",
      "Translate the property into loop, formula, or modular arithmetic.",
      "Handle zero, one, negatives, and large values.",
      "Return the computed value.",
    ],
    dryRun: [
      "Pick a small number and write each arithmetic step.",
      "Track how the count, remainder, or formula changes.",
      "Stop at the mathematical boundary.",
      "Compare the result with the obvious hand-computed answer.",
    ],
    invariant:
      "Each arithmetic update preserves the same mathematical relationship between the processed part and the remaining part.",
    why: [
      "The formula compresses many repeated operations into a smaller calculation.",
      "Divisibility, remainders, and bounds let the algorithm skip impossible cases.",
      "Careful edge handling keeps the formula valid for small inputs.",
    ],
    pitfalls: [
      "Integer division and floating division are different.",
      "Modulo with negative values can vary by language.",
      "Large values may overflow fixed-width integer types.",
    ],
    selfCheck: [
      "Can you derive the formula from a small example?",
      "Did you test zero, one, and a large value?",
    ],
  },
  general: {
    label: "general algorithmic decomposition",
    plainGoal: "process the input while maintaining the state needed for the answer",
    mentalModel:
      "Every algorithm is state plus transitions. At each step, ask what information from the past can affect the future.",
    state: [
      "The input position or current item.",
      "The maintained state summarizing processed data.",
      "The answer candidate or final result.",
    ],
    steps: [
      "Restate the problem in one sentence.",
      "Choose the state variables needed to make the next decision.",
      "Initialize them for the smallest input.",
      "Process each item and update state in a consistent order.",
      "Return the final answer.",
    ],
    dryRun: [
      "Make a table with one row per input item.",
      "Write the state before and after each row.",
      "Update the answer candidate only when the rule says it is valid.",
      "Check the final row against the expected answer.",
    ],
    invariant:
      "After each processed item, the maintained state is enough to answer the problem for the processed prefix.",
    why: [
      "The algorithm keeps only facts that can affect future decisions.",
      "Each update follows the same rule, making behavior predictable.",
      "The final state is the result of applying that rule to the whole input.",
    ],
    pitfalls: [
      "Unclear variable meaning leads to unclear code.",
      "Initialization bugs often show up on empty or single-item input.",
      "Updating the answer before the state is valid can create off-by-one errors.",
    ],
    selfCheck: [
      "Can you name each state variable?",
      "Can you trace two iterations without reading the code?",
    ],
  },
};

const familyRules: Array<{ key: FamilyKey; terms: string[] }> = [
  { key: "dynamic-programming", terms: ["kadane", "maximum subarray", "max subarray"] },
  { key: "sorting", terms: ["next permutation", "lexicographic", "lexicographically", "permutation of numbers"] },
  { key: "sliding-window", terms: ["sliding window", "window", "substring", "subarray with at most", "longest repeating"] },
  { key: "two-pointers", terms: ["two pointer", "two-pointer", "pointer", "palindrome", "container", "3sum", "4sum", "merge sorted", "remove duplicates"] },
  { key: "binary-search", terms: ["binary search", "lower bound", "upper bound", "search insert", "rotated sorted", "koko", "ship packages", "median in", "sqrt", "peak element"] },
  { key: "prefix-hash", terms: ["prefix", "hash", "map", "subarray sum", "xor", "frequency map", "count subarrays"] },
  { key: "dynamic-programming", terms: ["dynamic programming", "dp", "memo", "tabulation", "knapsack", "subsequence", "matrix chain", "partition", "lis", "lcs"] },
  { key: "graph", terms: ["graph", "bfs", "dfs", "dijkstra", "topological", "mst", "union find", "disjoint", "cycle", "shortest path", "component"] },
  { key: "tree", terms: ["tree", "bst", "binary tree", "traversal", "inorder", "preorder", "postorder", "lca", "diameter"] },
  { key: "linked-list", terms: ["linked list", "linkedlist", "list node", "slow", "fast", "reverse list", "cycle in list", " ll"] },
  { key: "stack-queue", terms: ["stack", "queue", "deque", "monotonic", "next greater", "histogram", "parentheses", "celebrity"] },
  { key: "heap", terms: ["heap", "priority queue", "top k", "kth", "median stream", "merge k"] },
  { key: "trie", terms: ["trie", "prefix tree", "word dictionary", "bit trie"] },
  { key: "greedy", terms: ["greedy", "interval", "meeting", "activity", "job sequencing", "minimum platforms", "fractional"] },
  { key: "backtracking", terms: ["backtracking", "recursion", "permutation", "combination", "subset", "n queens", "sudoku", "rat in a maze"] },
  { key: "sorting", terms: ["sort", "merge intervals", "quick sort", "merge sort", "inversion", "colors"] },
  { key: "bit", terms: ["bit", "xor", "set bit", "single number", "power of two"] },
  { key: "math", terms: ["math", "gcd", "prime", "count digits", "factorial", "pow", "sieve", "combin"] },
];

function detectFamily(algorithm: AlgorithmEntry, approach: AlgorithmApproach): FamilyKey {
  const text = clean(`${algorithm.id} ${algorithm.title} ${algorithm.topic} ${algorithm.category} ${algorithm.overview} ${approach.name} ${approach.description}`).toLowerCase();
  return familyRules.find((rule) => rule.terms.some((term) => termMatches(text, term)))?.key || "general";
}

function termMatches(text: string, term: string) {
  const normalizedTerm = term.toLowerCase();
  if (normalizedTerm.includes(" ") || normalizedTerm.includes("-")) {
    return text.includes(normalizedTerm);
  }
  const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`).test(text);
}

function plainOverview(algorithm: AlgorithmEntry) {
  const overview = clean(algorithm.overview);
  if (overview) return overview.endsWith(".") ? overview : `${overview}.`;
  return familyExplanations.general.plainGoal;
}

function complexitySentence(kind: "time" | "space", value: string) {
  const normalized = value.toLowerCase().replace(/\s+/g, "");
  if (kind === "time") {
    if (normalized.includes("nlogn")) return "This usually means sorting or divide-and-conquer dominates the work.";
    if (normalized.includes("logn")) return "The search space is repeatedly reduced, usually by half.";
    if (normalized.includes("n^2") || normalized.includes("n2") || normalized.includes("n*m") || normalized.includes("m*n")) return "Two dimensions or nested comparisons dominate the work.";
    if (normalized.includes("2^") || normalized.includes("factorial")) return "The algorithm explores a branching choice tree, so pruning matters.";
    if (normalized.includes("n")) return "Each input item is processed a bounded number of times.";
    if (normalized.includes("1")) return "The amount of work does not grow with input size.";
  }

  if (normalized.includes("1")) return "Only a constant number of helper variables are needed.";
  if (normalized.includes("logn")) return "The extra memory is usually recursion depth or divide-and-conquer stack usage.";
  if (normalized.includes("n^2") || normalized.includes("n2") || normalized.includes("n*m") || normalized.includes("m*n")) return "A table or structure stores information across two dimensions.";
  if (normalized.includes("n")) return "The algorithm stores data proportional to the input, such as a map, stack, queue, copy, or DP table.";
  return "This follows from the largest auxiliary structure used by the approach.";
}

function clean(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
