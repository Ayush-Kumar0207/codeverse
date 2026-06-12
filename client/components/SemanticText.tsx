import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const semanticGroups = {
  complexity: [
    "constant time", "linear time", "logarithmic time", "quadratic time", "exponential time",
    "time complexity", "space complexity", "O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)",
  ],
  concept: [
    "two pointers", "sliding window", "binary search", "dynamic programming", "prefix sum",
    "hash map", "priority queue", "linked list", "binary tree", "search tree", "graph traversal",
    "breadth-first search", "depth-first search", "union-find", "monotonic stack", "backtracking",
    "current window", "candidate set", "base case", "stopping condition",
  ],
  operation: [
    "expand the right boundary", "shrink the left boundary", "move the left boundary",
    "move the right boundary", "update the answer", "discard half", "restore the invariant",
    "maintain the invariant", "process each element", "visit each node", "compare the midpoint",
  ],
} as const;

type SemanticKind = keyof typeof semanticGroups;

const semanticTerms = Object.entries(semanticGroups)
  .flatMap(([kind, terms]) => terms.map((term) => ({ kind: kind as SemanticKind, term })))
  .sort((a, b) => b.term.length - a.term.length);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const semanticPattern = new RegExp(
  `(${semanticTerms.map(({ term }) => escapeRegExp(term)).join("|")})`,
  "gi"
);
const MAX_HIGHLIGHTS_PER_BLOCK = 3;

function classifySemanticTerm(value: string): SemanticKind | null {
  const normalized = value.toLowerCase();
  return semanticTerms.find(({ term }) => term.toLowerCase() === normalized)?.kind || null;
}

function highlightText(value: string, state: { count: number; kinds: Set<SemanticKind> }) {
  const parts = value.split(semanticPattern);

  return (
    <>
      {parts.map((part, index) => {
        const kind = classifySemanticTerm(part);
        const shouldHighlight =
          kind &&
          state.count < MAX_HIGHLIGHTS_PER_BLOCK &&
          (!state.kinds.has(kind) || state.kinds.size === 1);

        if (shouldHighlight && kind) {
          state.count += 1;
          state.kinds.add(kind);
        }

        return shouldHighlight && kind ? (
          <span key={`${part}-${index}`} className={`semantic-${kind}`}>
            {part}
          </span>
        ) : (
          <Fragment key={`${part}-${index}`}>{part}</Fragment>
        );
      })}
    </>
  );
}

function highlightNode(node: ReactNode, state: { count: number; kinds: Set<SemanticKind> }): ReactNode {
  if (typeof node === "string") return highlightText(node, state);
  if (Array.isArray(node)) {
    return node.map((child, index) => <Fragment key={index}>{highlightNode(child, state)}</Fragment>);
  }
  return node;
}

export default function SemanticText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const highlightState = { count: 0, kinds: new Set<SemanticKind>() };

  return (
    <span className={cn("semantic-text", className)}>
      {highlightNode(children, highlightState)}
    </span>
  );
}
