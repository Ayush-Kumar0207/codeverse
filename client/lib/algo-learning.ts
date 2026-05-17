import type { AlgorithmApproach, AlgorithmEntry } from "@/data/algos";

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

type LearningGuide = {
  label: string;
  reason: string;
  mentalModel: string;
  executionSteps: string[];
  invariant: string;
  whyItWorks: string;
  edgeCases: string[];
  interviewNotes: string[];
};

export type AlgorithmLearningProfile = {
  family: string;
  coverage: "Curated" | "Expanded";
  sourceSummary: string;
  mentalModel: string;
  executionSteps: string[];
  invariant: string;
  whyItWorks: string;
  edgeCases: string[];
  interviewNotes: string[];
  timeExplanation: string;
  spaceExplanation: string;
};

const familyGuides: Record<FamilyKey, LearningGuide> = {
  "two-pointers": {
    label: "Two pointers",
    reason: "the decision at one boundary tells you which side can be safely moved next",
    mentalModel:
      "Keep two markers on meaningful positions, usually the ends of a sorted range or the edges of a window. Each comparison proves that one side is no longer useful, so that pointer moves inward while the other side stays anchored.",
    executionSteps: [
      "Prepare the input if order matters, commonly by sorting or by choosing the correct start and end positions.",
      "Track the two pointer positions and compute the current value they represent, such as a sum, width, area, or match condition.",
      "If the current value already satisfies the target, record or return it according to the problem statement.",
      "Move only the pointer whose side has been proven too small, too large, or dominated by the current comparison.",
      "Stop when the pointers cross, meet, or the window no longer has a valid candidate.",
    ],
    invariant:
      "After each move, every skipped candidate on the discarded side has been ruled out by sorted order, dominance, or the current comparison.",
    whyItWorks:
      "The algorithm is efficient because it never revisits a pair or boundary state that cannot improve the answer. The pointer movement encodes a proof about a whole set of candidates, not just one candidate.",
    edgeCases: ["Empty or one-element input", "Duplicate values", "Negative numbers mixed with positive numbers", "Problems that need original indices after sorting"],
    interviewNotes: [
      "Say exactly why the left pointer or right pointer moves.",
      "If sorting is used, mention whether the returned answer must preserve original indices.",
      "For counting variants, be clear about whether duplicates create multiple valid answers.",
    ],
  },
  "sliding-window": {
    label: "Sliding window",
    reason: "a contiguous range can be expanded and shrunk while maintaining a local condition",
    mentalModel:
      "Treat the answer as a moving window. Expand the right boundary to include new information, then shrink the left boundary until the window becomes valid, minimal, or ready to score.",
    executionSteps: [
      "Initialize left and right boundaries plus the state needed to describe the current window.",
      "Move the right boundary one step at a time and update counts, sums, or constraint trackers.",
      "While the window violates the rule, move the left boundary and remove its contribution from the state.",
      "When the window is valid, update the best length, count, sum, or candidate answer.",
      "Continue until the right boundary has processed the full input.",
    ],
    invariant:
      "The maintained state always matches exactly the elements currently inside the window.",
    whyItWorks:
      "Each element enters the window once and leaves the window once. That makes the scan linear while still considering the useful contiguous ranges.",
    edgeCases: ["All elements invalid", "The whole array/string is valid", "Repeated characters or values", "Constraints that require at most, at least, or exactly a count"],
    interviewNotes: [
      "Clarify whether the window is fixed-size or variable-size.",
      "Name the condition that triggers shrinking.",
      "Update the answer at the moment the window has the required meaning.",
    ],
  },
  "binary-search": {
    label: "Binary search",
    reason: "the candidates can be split by a monotonic condition",
    mentalModel:
      "Search over an ordered answer space. Ask a yes/no question at the middle and use monotonicity to discard half of the remaining candidates.",
    executionSteps: [
      "Define the search space: array indices, numeric answer range, or a boundary between false and true states.",
      "Write the predicate or comparison that tells which half can contain the answer.",
      "Pick the middle carefully to avoid overflow and infinite loops.",
      "When the middle is feasible or matches the condition, record it if the problem asks for a boundary answer.",
      "Move the low or high boundary until the interval collapses to the final answer.",
    ],
    invariant:
      "The answer, if it exists, remains inside the current search interval after every boundary update.",
    whyItWorks:
      "Monotonicity means all candidates on one side of the middle share the same impossible status. Discarding that side cannot remove the correct answer.",
    edgeCases: ["Empty input", "First or last position is the answer", "Duplicates around the boundary", "Integer overflow in midpoint calculation"],
    interviewNotes: [
      "State the predicate in plain language before coding.",
      "Decide whether you are searching for any match, first true, last false, lower bound, or upper bound.",
      "Check loop conditions with a one-element and two-element interval.",
    ],
  },
  "prefix-hash": {
    label: "Prefix state and hashing",
    reason: "the current prefix can be compared with a previously seen prefix to reveal a range",
    mentalModel:
      "Convert a range question into a difference between two prefixes. A map stores the prefixes already seen, so each new position can instantly ask whether a matching earlier state exists.",
    executionSteps: [
      "Initialize the running prefix state and seed the map with the neutral prefix when needed.",
      "Scan the input once and update the running sum, xor, balance, or encoded state.",
      "Derive the previous prefix value that would make the current range valid.",
      "Use the map to count, locate, or score matching previous prefixes.",
      "Store the current prefix state in the map using the rule required by the problem.",
    ],
    invariant:
      "At index i, the map contains exactly the prefix information from positions before or up to i, depending on the counting rule.",
    whyItWorks:
      "For any subarray or substring, range value equals current prefix minus an earlier prefix. The map turns that algebra into constant-time lookup.",
    edgeCases: ["Zero target or neutral prefix", "Negative numbers", "Repeated prefix values", "Whether the map stores counts, earliest index, or latest index"],
    interviewNotes: [
      "Explain the equation that connects current prefix, previous prefix, and target.",
      "Mention why a simple sliding window may fail when negative numbers are present.",
      "Be precise about when the current prefix is inserted into the map.",
    ],
  },
  "dynamic-programming": {
    label: "Dynamic programming",
    reason: "the problem breaks into overlapping subproblems with reusable answers",
    mentalModel:
      "Define a state that fully describes a smaller version of the problem. Solve base cases first, then build larger answers from already-known smaller answers.",
    executionSteps: [
      "Define the DP state in words, including what each dimension means.",
      "Write the base cases for empty input, index zero, or impossible states.",
      "Derive the transition by listing the choices available at the current state.",
      "Choose an iteration order or memoized recursion so dependencies are solved before they are used.",
      "Return the state that corresponds to the original full problem, and optimize space only after the recurrence is correct.",
    ],
    invariant:
      "Every filled DP cell stores the optimal or correct answer for exactly the subproblem described by its state definition.",
    whyItWorks:
      "The transition is exhaustive over the valid choices, and each choice depends only on smaller states that have already been solved.",
    edgeCases: ["Empty input", "Single element input", "Impossible states", "Large answers that need modulo arithmetic"],
    interviewNotes: [
      "Lead with the state definition; it is the spine of the solution.",
      "Separate recurrence correctness from space optimization.",
      "Use a tiny example to verify the base cases and iteration order.",
    ],
  },
  graph: {
    label: "Graph traversal",
    reason: "relationships between items are best modeled as nodes and edges",
    mentalModel:
      "Represent the data as a graph, then explore it with the traversal or relaxation rule that matches the goal: reachability, shortest path, ordering, components, or cycle detection.",
    executionSteps: [
      "Build or interpret the adjacency structure from the input.",
      "Initialize visited state, distances, indegrees, parent pointers, or component labels.",
      "Choose BFS, DFS, topological processing, union-find, or a priority queue based on the property being solved.",
      "Process neighbors and update state only when the new information improves or validates something.",
      "Return the derived structure: path length, ordering, component count, reachability, or optimized cost.",
    ],
    invariant:
      "Once a node reaches its finalized state for the chosen traversal, later work cannot produce a better interpretation for that state.",
    whyItWorks:
      "The traversal follows every relevant edge under a disciplined rule, so all reachable relationships are considered while duplicated work is blocked by visited or finalized state.",
    edgeCases: ["Disconnected graph", "Self-loops", "Parallel edges", "Cycles", "One-indexed versus zero-indexed nodes"],
    interviewNotes: [
      "Name what nodes and edges represent.",
      "Explain why BFS, DFS, Dijkstra, topological sort, or union-find is the right fit.",
      "State how cycles or disconnected components are handled.",
    ],
  },
  tree: {
    label: "Tree recursion",
    reason: "each subtree can be solved independently and combined at its parent",
    mentalModel:
      "A tree problem is usually a local decision plus information returned from the left and right subtrees. Decide what each recursive call returns before writing the traversal.",
    executionSteps: [
      "Handle the null or leaf base case first.",
      "Ask the recursive call for exactly the information needed from each child.",
      "Combine child answers with the current node's value.",
      "Update any global best answer if the current node forms a candidate.",
      "Return the value the parent needs, which may be different from the global answer.",
    ],
    invariant:
      "When a recursive call returns, its subtree has already been fully solved according to the return-value definition.",
    whyItWorks:
      "Subtrees do not overlap, and every parent can compute its result from child results plus local node information.",
    edgeCases: ["Empty tree", "Single node", "Skewed tree depth", "Negative node values", "Duplicate BST values"],
    interviewNotes: [
      "Separate traversal order from the value returned by recursion.",
      "Call out whether the solution uses a global accumulator.",
      "For BSTs, state the ordering invariant being used.",
    ],
  },
  "linked-list": {
    label: "Linked list pointer work",
    reason: "the structure can only be navigated through references, so pointer ownership matters",
    mentalModel:
      "Treat every operation as rewiring references. A dummy node, slow/fast pointers, or previous/current/next trio keeps edge cases controlled.",
    executionSteps: [
      "Create a dummy node when the head might change.",
      "Track the minimum set of references needed before changing any pointer.",
      "Advance pointers in the order that preserves access to the remaining list.",
      "Reconnect nodes or lists according to the target shape.",
      "Return the new head, often dummy.next.",
    ],
    invariant:
      "The processed part of the list is already correctly wired, and the unprocessed part is still reachable.",
    whyItWorks:
      "Keeping explicit references prevents losing nodes while allowing each link to be changed once.",
    edgeCases: ["Empty list", "One node", "Head or tail removal", "Cycles", "Odd versus even length"],
    interviewNotes: [
      "Draw the pointers for one iteration before coding.",
      "Use a dummy node for deletions and merges when it simplifies head handling.",
      "Save next before rewiring current.next.",
    ],
  },
  "stack-queue": {
    label: "Stack and queue discipline",
    reason: "the next useful item is determined by last-in-first-out or first-in-first-out order",
    mentalModel:
      "Use the data structure to preserve candidates until the moment they become answerable. Monotonic stacks and queues remove dominated candidates early.",
    executionSteps: [
      "Choose stack for nested or nearest-neighbor relationships, queue for level order or arrival order.",
      "Define what each stored item represents: value, index, pair, state, or partial answer.",
      "Before pushing a new item, pop or dequeue entries that are resolved or no longer useful.",
      "Use the remaining top/front item to update the answer.",
      "Push the current item if it can help a future position.",
    ],
    invariant:
      "The structure contains only candidates that are still unresolved and useful under the chosen order.",
    whyItWorks:
      "Each item is inserted and removed a limited number of times, and the ordering exposes exactly the next candidate that can affect the answer.",
    edgeCases: ["Empty structure checks", "Equal values in monotonic structures", "Circular arrays", "Window boundaries expiring old indices"],
    interviewNotes: [
      "Say what the stack or queue stores, not just that you use one.",
      "For monotonic variants, specify increasing or decreasing order.",
      "Use indices when distance, expiry, or answer position matters.",
    ],
  },
  heap: {
    label: "Heap priority processing",
    reason: "the next item to process is always the current minimum or maximum priority",
    mentalModel:
      "Keep the best available candidate at the top of a priority queue. Insert new candidates as they become available and discard stale ones when they no longer match the current state.",
    executionSteps: [
      "Define the priority: smallest value, largest value, earliest finish, shortest distance, or best score.",
      "Push all initial candidates into the heap.",
      "Repeatedly pop the current best candidate.",
      "Skip stale entries or expand the popped item into new candidates.",
      "Stop when the heap is empty or the required number of best candidates has been processed.",
    ],
    invariant:
      "The heap top is always the best candidate among the currently available, non-finalized items.",
    whyItWorks:
      "A heap gives efficient access to the next priority item without sorting the entire remaining set after every update.",
    edgeCases: ["Duplicate priorities", "Stale heap entries", "K larger than input size", "Min-heap versus max-heap language defaults"],
    interviewNotes: [
      "Mention whether stale entries are possible and how they are ignored.",
      "For top-k, compare heap size and replacement rules.",
      "For shortest path, explain when a distance becomes finalized.",
    ],
  },
  trie: {
    label: "Trie prefix indexing",
    reason: "shared prefixes can be represented once and reused for fast lookup",
    mentalModel:
      "Store characters or bits as a path from the root. Every prefix becomes a node, making prefix queries and incremental matching natural.",
    executionSteps: [
      "Create a root node with child links and any metadata needed at each node.",
      "Insert each word, number, or pattern one symbol at a time.",
      "Mark terminal nodes or store counts, indices, or best values as required.",
      "For lookup, follow the same symbol path and fail as soon as a required child is missing.",
      "Use stored metadata to answer prefix, existence, ranking, or xor-style questions.",
    ],
    invariant:
      "Every node on a path represents the exact prefix formed by the symbols from the root to that node.",
    whyItWorks:
      "Common prefixes are shared, so matching work is proportional to the query length rather than the number of stored strings.",
    edgeCases: ["Empty string", "Duplicate insertions", "Word ending before a longer word", "Alphabet size and memory usage"],
    interviewNotes: [
      "State what metadata lives in each node.",
      "Mention memory tradeoffs compared with sorting or hashing.",
      "For bit tries, clarify the bit width used.",
    ],
  },
  greedy: {
    label: "Greedy choice",
    reason: "a locally optimal choice can be proven not to block a global optimum",
    mentalModel:
      "Sort or prioritize the input so the safest local decision appears first. Make that decision, lock in its contribution, and prove that delaying or changing it cannot help.",
    executionSteps: [
      "Identify the choice that can be made locally: smallest end, largest gain, earliest deadline, or cheapest merge.",
      "Order the candidates so that choice is available at each step.",
      "Take the choice when it improves or preserves feasibility.",
      "Update the resource, boundary, count, or accumulated score.",
      "Use an exchange argument or invariant to justify that no better solution is lost.",
    ],
    invariant:
      "After each greedy choice, there exists an optimal solution that agrees with all choices made so far.",
    whyItWorks:
      "The greedy rule is valid when any optimal solution can be transformed to include the chosen local decision without making it worse.",
    edgeCases: ["Ties in sorting", "Negative values", "Insufficient resources", "Intervals that touch at boundaries"],
    interviewNotes: [
      "Do not just say 'sort and greedy'; state the exact ordering.",
      "Prepare a short exchange argument.",
      "Watch for problems where local best fails and DP is required.",
    ],
  },
  backtracking: {
    label: "Backtracking search",
    reason: "the answer space is a tree of choices that must be explored with pruning",
    mentalModel:
      "Build a partial answer one choice at a time. Recurse into valid choices, then undo the choice so sibling branches start from a clean state.",
    executionSteps: [
      "Define the recursive state: position, remaining choices, partial answer, and any used markers.",
      "Stop at the base case and record a copy of the completed answer.",
      "Loop through valid choices for the current state.",
      "Apply a choice, recurse, then undo that choice.",
      "Prune branches that already violate constraints or cannot beat the current best answer.",
    ],
    invariant:
      "Before and after each recursive call, the mutable state matches exactly the current partial answer path.",
    whyItWorks:
      "The recursion enumerates every valid branch of the choice tree, while pruning removes branches that cannot lead to a valid or better result.",
    edgeCases: ["Duplicate choices", "Empty answer", "Need to copy mutable arrays", "Pruning too aggressively"],
    interviewNotes: [
      "Name the choice, constraint, and goal before coding.",
      "Sort first when duplicate skipping depends on order.",
      "Always undo mutable state in the reverse order of applying it.",
    ],
  },
  sorting: {
    label: "Sorting and ordering",
    reason: "ordering the data exposes relationships that are hidden in arbitrary input order",
    mentalModel:
      "Put related items next to each other or in priority order, then scan once while maintaining the answer.",
    executionSteps: [
      "Choose the sort key that makes the next decision obvious.",
      "Sort the input or create a sorted copy if original order must be preserved.",
      "Scan from left to right and maintain the current group, interval, best candidate, or boundary.",
      "Merge, count, compare, or update the answer when adjacent ordered items interact.",
      "Finalize the last group or candidate after the scan ends.",
    ],
    invariant:
      "All items before the current scan position have been processed in the only order relevant to the chosen comparison.",
    whyItWorks:
      "Sorting clusters candidates that can affect each other, so the scan does not need to compare every pair.",
    edgeCases: ["Stable ordering requirements", "Equal keys", "Original index preservation", "Empty input"],
    interviewNotes: [
      "Explain the sort key and what it reveals.",
      "Include the sorting cost in the final complexity.",
      "Be careful when mutating the input is not allowed.",
    ],
  },
  bit: {
    label: "Bit manipulation",
    reason: "the problem can be reduced to per-bit properties or xor cancellation",
    mentalModel:
      "Work at the bit level. Use masks, shifts, and xor to isolate state that would be harder to track with arithmetic alone.",
    executionSteps: [
      "Identify the bit property being used: set count, parity, carry, mask membership, or xor cancellation.",
      "Initialize the mask, accumulator, or bit counter.",
      "Process each number or bit position and update the encoded state.",
      "Use bit tests to include, exclude, toggle, or compare candidates.",
      "Convert the final mask or accumulator back into the requested answer.",
    ],
    invariant:
      "The accumulator's bits encode the exact property promised by the chosen representation.",
    whyItWorks:
      "Bit operations update many boolean facts compactly, and xor or masking laws make cancellation and membership checks deterministic.",
    edgeCases: ["Negative numbers and signed shifts", "Bit width", "Overflow in fixed-width languages", "Zero input"],
    interviewNotes: [
      "State the bit law being used, such as x xor x equals 0.",
      "Mention language-specific signed integer behavior when relevant.",
      "Use parentheses around bit operations to avoid precedence bugs.",
    ],
  },
  math: {
    label: "Math and counting",
    reason: "a formula, invariant, or number property simplifies the search",
    mentalModel:
      "Translate the problem into a count, equation, divisibility rule, or combinatorial identity. The algorithm then applies that property directly instead of enumerating everything.",
    executionSteps: [
      "Identify the mathematical property that characterizes valid answers.",
      "Derive the formula or recurrence on a small example.",
      "Handle constraints such as modulo, overflow, signs, and integer division.",
      "Compute the needed values in the cheapest order.",
      "Return the formula result or use it to guide a smaller search.",
    ],
    invariant:
      "Each computed value follows from the same mathematical identity, so the algorithm is checking or constructing exactly the valid cases.",
    whyItWorks:
      "The formula compresses many equivalent cases into one calculation, reducing work while preserving correctness.",
    edgeCases: ["Zero and one", "Negative numbers", "Large values needing modulo", "Rounding in integer division"],
    interviewNotes: [
      "Show the derivation briefly; formulas without justification feel like guesses.",
      "Call out modulo and overflow choices.",
      "Test the formula on the smallest inputs.",
    ],
  },
  general: {
    label: "Algorithmic decomposition",
    reason: "the input can be processed by maintaining a small, well-defined state",
    mentalModel:
      "Break the task into state, transition, and answer. At every step, update only the information that future steps need.",
    executionSteps: [
      "Restate the goal and identify the minimum state needed to decide the next step.",
      "Initialize that state for the smallest input.",
      "Process the input in the order that makes dependencies available.",
      "Update the state and answer consistently after each item or decision.",
      "Return the accumulated answer and verify it on a small example.",
    ],
    invariant:
      "After processing each item, the maintained state is sufficient to answer the problem for the processed prefix.",
    whyItWorks:
      "The algorithm avoids unnecessary history by preserving exactly the facts that can affect future decisions.",
    edgeCases: ["Empty input", "Single item", "Duplicate values", "Boundary values from the constraints"],
    interviewNotes: [
      "Define the maintained state before code.",
      "Use a small trace to catch off-by-one mistakes.",
      "State whether the algorithm mutates the input.",
    ],
  },
};

const familyRules: Array<{ key: FamilyKey; terms: string[] }> = [
  { key: "dynamic-programming", terms: ["kadane", "maximum subarray", "max subarray"] },
  { key: "sorting", terms: ["next permutation", "lexicographic", "lexicographically", "permutation of numbers", "merge intervals", "merge overlapping"] },
  { key: "sliding-window", terms: ["sliding window", "window", "substring", "subarray with at most", "longest repeating"] },
  { key: "two-pointers", terms: ["two pointer", "two-pointer", "pointer", "palindrome", "container", "3sum", "4sum", "merge sorted", "remove duplicates"] },
  { key: "binary-search", terms: ["binary search", "lower bound", "upper bound", "search insert", "first occurrence", "last occurrence", "rotated sorted", "koko", "ship packages", "capacity to ship", "median in", "sqrt", "peak element", "minimum days"] },
  { key: "prefix-hash", terms: ["prefix", "hash", "map", "subarray sum", "xor", "frequency map", "count subarrays"] },
  { key: "dynamic-programming", terms: ["dynamic programming", "dp", "memo", "tabulation", "knapsack", "subsequence", "matrix chain", "partition", "lis", "lcs", "minimum path"] },
  { key: "graph", terms: ["graph", "bfs", "dfs", "dijkstra", "topological", "mst", "union find", "disjoint", "cycle", "shortest path", "component"] },
  { key: "tree", terms: ["tree", "bst", "binary tree", "traversal", "inorder", "preorder", "postorder", "lca", "diameter"] },
  { key: "linked-list", terms: ["linked list", "list node", "slow", "fast", "reverse list", "cycle in list"] },
  { key: "stack-queue", terms: ["stack", "queue", "deque", "monotonic", "next greater", "histogram", "parentheses", "celebrity"] },
  { key: "heap", terms: ["heap", "priority queue", "top k", "kth", "median stream", "merge k"] },
  { key: "trie", terms: ["trie", "prefix tree", "word dictionary", "bit trie"] },
  { key: "greedy", terms: ["greedy", "interval", "meeting", "activity", "job sequencing", "minimum platforms", "fractional"] },
  { key: "backtracking", terms: ["backtracking", "recursion", "permutation", "combination", "subset", "n queens", "sudoku", "rat in a maze"] },
  { key: "sorting", terms: ["sort", "merge intervals", "quick sort", "merge sort", "inversion", "colors"] },
  { key: "bit", terms: ["bit", "xor", "set bit", "single number", "power of two"] },
  { key: "math", terms: ["math", "gcd", "prime", "count digits", "factorial", "pow", "sieve", "combin"] },
];

export function buildAlgorithmLearningProfile(
  algo: AlgorithmEntry,
  approach: AlgorithmApproach
): AlgorithmLearningProfile {
  const familyKey = detectAlgorithmFamily(algo, approach);
  const guide = familyGuides[familyKey];
  const sourceText = cleanMarkdown(`${approach.description || ""} ${algo.overview || ""}`);
  const sourceWords = countWords(sourceText);
  const isDetailedSource = sourceWords >= 80 || /invariant|why it works|execution strategy|core concept|edge case/i.test(sourceText);

  return {
    family: guide.label,
    coverage: isDetailedSource ? "Curated" : "Expanded",
    sourceSummary: buildSourceSummary(algo, approach, guide, sourceText, isDetailedSource),
    mentalModel: `${guide.mentalModel} For "${algo.title}", this means the approach should focus on ${guide.reason}.`,
    executionSteps: guide.executionSteps,
    invariant: guide.invariant,
    whyItWorks: guide.whyItWorks,
    edgeCases: guide.edgeCases,
    interviewNotes: guide.interviewNotes,
    timeExplanation: explainComplexity("time", approach.timeComplexity, approach.timeComplexityExplanation, guide),
    spaceExplanation: explainComplexity("space", approach.spaceComplexity, approach.spaceComplexityExplanation, guide),
  };
}

function detectAlgorithmFamily(algo: AlgorithmEntry, approach: AlgorithmApproach): FamilyKey {
  const haystack = normalize(`${algo.title} ${algo.topic} ${algo.category} ${algo.overview} ${approach.name}`);
  const rule = familyRules.find(({ terms }) => terms.some((term) => termMatches(haystack, term)));
  return rule?.key || "general";
}

function termMatches(text: string, term: string) {
  const normalizedTerm = term.toLowerCase();
  if (normalizedTerm.includes(" ") || normalizedTerm.includes("-")) {
    return text.includes(normalizedTerm);
  }
  const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`).test(text);
}

function buildSourceSummary(
  algo: AlgorithmEntry,
  approach: AlgorithmApproach,
  guide: LearningGuide,
  sourceText: string,
  isDetailedSource: boolean
) {
  if (isDetailedSource) {
    return truncateWords(sourceText, 44);
  }

  const overview = cleanMarkdown(algo.overview);
  const approachName = approach.name && approach.name !== "Optimal" ? ` using the ${approach.name} approach` : "";
  return `${overview || `${algo.title} asks you to compute the required result from the input`}${approachName}. The useful lens is ${guide.label.toLowerCase()}: ${guide.reason}.`;
}

function explainComplexity(
  kind: "time" | "space",
  value: string,
  existingExplanation: string | undefined,
  guide: LearningGuide
) {
  const cleanExisting = cleanMarkdown(existingExplanation || "");
  if (cleanExisting.length > 30 && !isUnknownComplexity(value)) {
    return cleanExisting;
  }

  const valueText = value || "not specified";
  const normalized = normalize(valueText).replace(/\s+/g, "");

  if (isUnknownComplexity(valueText)) {
    return `The source entry does not give a precise ${kind} bound. Read the loops, recursion, and auxiliary structures in the implementation to confirm the final bound.`;
  }

  if (kind === "time") {
    if (normalized.includes("nlogn")) {
      return `The listed ${valueText} time usually comes from sorting or divide-and-conquer work. After that setup, the remaining scan or merge step is typically linear.`;
    }
    if (normalized.includes("logn")) {
      return `The listed ${valueText} time comes from repeatedly shrinking the search space, which is the core reason ${guide.label.toLowerCase()} is effective here.`;
    }
    if (normalized.includes("n^2") || normalized.includes("n2") || normalized.includes("m*n") || normalized.includes("n*m")) {
      return `The listed ${valueText} time means the solution compares or fills combinations across two dimensions, such as nested loops or a two-dimensional state table.`;
    }
    if (normalized.includes("2^") || normalized.includes("factorial")) {
      return `The listed ${valueText} time reflects a branching choice tree. Pruning and early exits matter because the worst case grows exponentially.`;
    }
    if (normalized.includes("n")) {
      return `The listed ${valueText} time means each input item is processed a bounded number of times while maintaining the approach state.`;
    }
    if (normalized.includes("1")) {
      return `The listed ${valueText} time means the answer is computed with a fixed amount of work independent of input size.`;
    }
  }

  if (normalized.includes("1")) {
    return `The listed ${valueText} space means the algorithm keeps only a fixed set of variables besides the input and output.`;
  }
  if (normalized.includes("logn")) {
    return `The listed ${valueText} space is usually from recursion depth or a divide-and-conquer call stack.`;
  }
  if (normalized.includes("n^2") || normalized.includes("n2") || normalized.includes("m*n") || normalized.includes("n*m")) {
    return `The listed ${valueText} space indicates a table or structure that stores states across two input dimensions.`;
  }
  if (normalized.includes("n")) {
    return `The listed ${valueText} space means the solution may store information proportional to the input, such as a map, stack, queue, copy, or DP array.`;
  }

  return `The listed ${valueText} ${kind} bound follows from the dominant operation in this approach. Confirm it by counting the largest loop, recursion tree, or auxiliary data structure.`;
}

function cleanMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[#>*_[\]()|]/g, " ")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value: string) {
  return cleanMarkdown(value).toLowerCase();
}

function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function truncateWords(value: string, limit: number) {
  const words = value.split(/\s+/);
  if (words.length <= limit) return value;
  return `${words.slice(0, limit).join(" ")}...`;
}

function isUnknownComplexity(value: string) {
  return !value || value.includes("?") || normalize(value).includes("unknown");
}
