import type { AlgorithmApproach, AlgorithmEntry } from "@/data/algos";
import {
  buildAlgorithmLearningProfile as buildFamilyLearningProfile,
  type AlgorithmLearningProfile,
} from "@/lib/algo-learning";

type StrategyGuide = {
  label: string;
  mentalModel: string;
  executionSteps: string[];
  invariant: string;
  whyItWorks: string;
  edgeCases: string[];
  interviewNotes: string[];
};

const strategyGuides = {
  exhaustive: {
    label: "Exhaustive search",
    mentalModel:
      "Treat every valid candidate as a box that must be opened. Generate candidates in a fixed order, test each one against the requirement, and stop early only when the requested answer has been proved.",
    executionSteps: [
      "Define exactly what constitutes one valid candidate and initialize the result for the no-match case.",
      "Enumerate the complete candidate space with loop or recursion boundaries that never reuse an item illegally.",
      "Evaluate the current candidate against the target condition.",
      "Return or record the candidate as soon as the problem's success condition is satisfied.",
      "Finish only after every remaining candidate has either been checked or safely ruled out.",
    ],
    invariant:
      "Before each iteration, every candidate earlier in the enumeration order has already been checked exactly once and none has been skipped.",
    whyItWorks:
      "The candidate enumeration is complete. Therefore, if a valid answer exists, one iteration must inspect it; if none is found, the full search proves that no answer exists.",
    edgeCases: [
      "Inputs too small to form one candidate",
      "Loop bounds that accidentally reuse the same element",
      "Duplicate values that represent distinct indices",
    ],
    interviewNotes: [
      "Use this as the correctness baseline before proposing an optimization.",
      "State the exact size of the candidate space and derive the complexity from it.",
    ],
  },
  hashing: {
    label: "Hash lookup",
    mentalModel:
      "Turn repeated searching into remembered state. As each value arrives, ask whether the complementary state is already in a hash table, then store the current value for later positions.",
    executionSteps: [
      "Choose what the hash table must store: presence, count, earliest index, latest index, or an accumulated result.",
      "Seed any neutral state required for an answer that begins at the first position.",
      "Scan the input once and derive the lookup key needed by the current value.",
      "Query before inserting when the same element is not allowed to satisfy its own lookup.",
      "Store or update the current state and return the result when a matching lookup succeeds.",
    ],
    invariant:
      "At each position, the hash table represents exactly the eligible information from positions already processed.",
    whyItWorks:
      "The lookup encodes the missing part of the condition, so one expected constant-time query replaces a repeated scan of the processed prefix.",
    edgeCases: [
      "Query-before-insert ordering when an item cannot match itself",
      "Duplicate keys and whether counts or indices must be preserved",
      "Worst-case hashing behavior and memory proportional to the input",
    ],
    interviewNotes: [
      "Say what each key and value in the table means.",
      "Explain the time-for-space trade-off compared with exhaustive search.",
    ],
  },
  counting: {
    label: "Frequency counting",
    mentalModel:
      "Compress the input into a small frequency summary, then rebuild or answer from those counts. The first pass learns how many items belong to each category; the next phase places each category in its final region.",
    executionSteps: [
      "Create one counter or bucket for every allowed category.",
      "Scan the input and increment the bucket that represents each value.",
      "Translate the final counts into output boundaries or answer contributions.",
      "Write each category into its count-derived region without exceeding that region.",
      "Verify that the total number of written items equals the original input size.",
    ],
    invariant:
      "After the counting pass, the buckets sum to the input length; during reconstruction, the written prefix contains exactly the categories whose counts have been consumed.",
    whyItWorks:
      "When the value domain is known and small, the frequency vector contains all information needed to reconstruct the required grouping or compute the answer.",
    edgeCases: [
      "A category with zero occurrences",
      "All values belonging to one category",
      "Inputs containing a value outside the assumed domain",
    ],
    interviewNotes: [
      "Distinguish constant-size category storage from input-sized auxiliary storage.",
      "Mention whether reconstruction makes the method one-pass or two-pass.",
    ],
  },
  sorting: {
    label: "Sort then scan",
    mentalModel:
      "Pay once to impose order, then exploit adjacency or monotonic movement. Sorting turns a globally scattered relationship into a local scan with predictable decisions.",
    executionSteps: [
      "Preserve original indices first if the output refers to the unsorted input.",
      "Sort the values or value-index records with the ordering required by the problem.",
      "Scan the ordered data while maintaining only the state needed for the current relation.",
      "Use order to skip duplicates, merge neighbors, or discard an impossible side.",
      "Translate the ordered result back to the required output representation.",
    ],
    invariant:
      "The processed sorted prefix is finalized, and ordering guarantees that any unprocessed candidate appears at or after the current position.",
    whyItWorks:
      "Sorting exposes monotonic structure. Once ordered, the scan can make decisions about whole ranges instead of repeatedly searching the original arrangement.",
    edgeCases: [
      "Original indices or stable ordering must be preserved",
      "Duplicate values at adjacent sorted positions",
      "Whether mutating the input is permitted",
    ],
    interviewNotes: [
      "Include sorting in the total time complexity.",
      "Explain what useful property becomes true only after sorting.",
    ],
  },
} satisfies Record<string, StrategyGuide>;

type DescriptionSections = Record<string, string[]>;

export function buildAlgorithmLearningProfile(
  algorithm: AlgorithmEntry,
  approach: AlgorithmApproach
): AlgorithmLearningProfile {
  const base = buildFamilyLearningProfile(algorithm, approach);
  const strategy = detectStrategy(approach);
  const sections = parseDescriptionSections(approach.description || "");
  const approachName = approach.name || "Selected approach";
  const cleanDescription = cleanMarkup(approach.description || "");
  const sourceSummary = cleanDescription
    ? `${approachName}: ${truncateWords(cleanDescription, 64)}`
    : `${approachName} solves ${algorithm.title} with the stated ${approach.timeComplexity} time and ${approach.spaceComplexity} auxiliary-space bounds.`;
  const exactMentalModel = sectionText(sections, ["core intuition", "core concept", "intuition", "mental model"]);
  const exactSteps = sectionItems(sections, ["execution strategy", "step by step", "steps", "algorithm", "procedure"]);
  const exactInvariant = sectionText(sections, ["invariant"]);
  const exactWhy = sectionText(sections, ["why this works", "why it works", "correctness"]);
  const exactEdges = sectionItems(sections, ["mistakes to avoid", "edge cases", "pitfalls"]);
  const exactNotes = sectionItems(sections, ["interview notes", "codeverse tip", "tips", "notes"]);
  const tier = approachTier(approachName);
  const tierPerspective = tierExplanation(tier);
  const selectedGuide = strategy || base;
  const steps = exactSteps.length >= 2 ? exactSteps : selectedGuide.executionSteps;
  const edgeCases = exactEdges.length > 0 ? exactEdges : selectedGuide.edgeCases;
  const interviewNotes = exactNotes.length > 0 ? exactNotes : selectedGuide.interviewNotes;

  return {
    ...base,
    family: strategy?.label || base.family,
    coverage: cleanDescription.split(/\s+/).length >= 55 ? "Curated" : "Expanded",
    sourceSummary,
    mentalModel: `${approachName}: ${exactMentalModel || selectedGuide.mentalModel} ${tierPerspective}`,
    executionSteps: steps.map((step, index) =>
      index === 0 ? `${approachName} — ${stripApproachPrefix(step, approachName)}` : step
    ),
    invariant: `${approachName} invariant: ${exactInvariant || selectedGuide.invariant}`,
    whyItWorks: `${approachName}: ${exactWhy || selectedGuide.whyItWorks} Its declared trade-off is ${approach.timeComplexity} time and ${approach.spaceComplexity} auxiliary space.`,
    edgeCases: prefixFirst(edgeCases, approachName),
    interviewNotes: [
      `Present ${approachName} as the ${tierInterviewCue(tier)} for this problem.`,
      ...interviewNotes,
    ].slice(0, 5),
    timeExplanation: explainSelectedComplexity("time", approachName, approach.timeComplexity, approach.timeComplexityExplanation, strategy?.label || base.family),
    spaceExplanation: explainSelectedComplexity("space", approachName, approach.spaceComplexity, approach.spaceComplexityExplanation, strategy?.label || base.family),
  };
}

function detectStrategy(approach: AlgorithmApproach): StrategyGuide | null {
  const code = approach.implementations.map((implementation) => implementation.code).join("\n");
  const source = `${approach.name}\n${approach.description}\n${code}`.toLowerCase();
  const hasTwoBoundaryPointers = /\b(left|low|start)\b[\s\S]{0,180}\b(right|high|end)\b/.test(source);

  if (/unordered_(?:map|set)|hash\s*(?:map|set|table)|hashmap|hashset/.test(source)) {
    return strategyGuides.hashing;
  }
  if (/\b(?:cnt|count|freq)(?:0|1|2|\[)|frequency (?:array|table|count)|counting array/.test(source)) {
    return strategyGuides.counting;
  }
  if (/\bsort\s*\(/.test(source) && !hasTwoBoundaryPointers) {
    return strategyGuides.sorting;
  }
  const loopCount = (source.match(/\b(?:for|while)\s*\(/g) || []).length;
  if (
    (/brute|exhaustive|directly enumerat/.test(source) && loopCount >= 2)
    || /check (?:every|all) (?:pair|candidate|combination)/.test(source)
  ) {
    return strategyGuides.exhaustive;
  }
  return null;
}

function parseDescriptionSections(description: string): DescriptionSections {
  const sections: DescriptionSections = { intro: [] };
  let activeSection = "intro";

  for (const rawLine of description.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const heading = line.match(/^#{1,6}\s+(.+)$/);
    if (heading) {
      activeSection = cleanMarkup(heading[1]).toLowerCase();
      sections[activeSection] ||= [];
      continue;
    }
    const cleanLine = cleanMarkup(line.replace(/^(?:[-*+]|\d+\.)\s+/, ""));
    if (cleanLine) sections[activeSection].push(cleanLine);
  }
  return sections;
}

function sectionText(sections: DescriptionSections, names: string[]) {
  const entries = Object.entries(sections).find(([heading]) =>
    names.some((name) => heading.includes(name))
  );
  return entries?.[1].join(" ") || "";
}

function sectionItems(sections: DescriptionSections, names: string[]) {
  const entries = Object.entries(sections).find(([heading]) =>
    names.some((name) => heading.includes(name))
  );
  return entries?.[1].filter(Boolean) || [];
}

function approachTier(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes("brute")) return "brute";
  if (normalized.includes("better")) return "better";
  if (normalized.includes("optimal") || normalized.includes("optimized")) return "optimal";
  return "alternative";
}

function tierExplanation(tier: ReturnType<typeof approachTier>) {
  if (tier === "brute") return "This variant prioritizes a transparent correctness baseline over asymptotic efficiency.";
  if (tier === "better") return "This variant removes a major source of repeated work, usually by keeping additional reusable state.";
  if (tier === "optimal") return "This variant targets the strongest practical complexity while preserving the proof behind every discarded candidate or compressed state.";
  return "Treat this as a distinct trade-off, and compare its state, complexity, and implementation constraints with the other available variants.";
}

function tierInterviewCue(tier: ReturnType<typeof approachTier>) {
  if (tier === "brute") return "correctness baseline";
  if (tier === "better") return "intermediate optimization and time-space trade-off";
  if (tier === "optimal") return "preferred final optimization with its proof";
  return "alternative implementation trade-off";
}

function prefixFirst(items: string[], approachName: string) {
  if (items.length === 0) return [`${approachName}: verify the smallest valid input and every boundary implied by this variant.`];
  return items.map((item, index) => (index === 0 ? `${approachName}: ${item}` : item));
}

function stripApproachPrefix(value: string, approachName: string) {
  const normalizedValue = value.toLowerCase();
  const normalizedName = approachName.toLowerCase();
  return normalizedValue.startsWith(normalizedName)
    ? value.slice(approachName.length).replace(/^\s*[-—:]\s*/, "")
    : value;
}

function explainSelectedComplexity(
  kind: "time" | "space",
  approachName: string,
  value: string,
  existingExplanation: string | undefined,
  strategyLabel: string
) {
  const explicit = cleanMarkup(existingExplanation || "");
  if (explicit.length >= 30) return `${approachName}: ${explicit}`;

  const valueText = value || "not specified";
  const normalized = valueText
    .toLowerCase()
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/s+/g, "");

  if (kind === "time") {
    if (normalized.includes("2^") || normalized.includes("factorial") || normalized.includes("n!")) {
      return `${approachName}: ${valueText} time reflects a branching candidate tree. The number of states grows exponentially, so pruning and early termination determine practical performance.`;
    }
    if (normalized.includes("n^3") || normalized.includes("n*n*n")) {
      return `${approachName}: ${valueText} time represents work across three nested dimensions or choices. Each additional input element expands all three levels of the dominant enumeration.`;
    }
    if (normalized.includes("n^2") || normalized.includes("n*n") || normalized.includes("m*n") || normalized.includes("n*m")) {
      return `${approachName}: ${valueText} time comes from examining pairs or a two-dimensional state space. The dominant work grows with the product of those dimensions.`;
    }
    if (normalized.includes("nlogn")) {
      return `${approachName}: ${valueText} time is dominated by sorting or divide-and-conquer preparation; the remaining ${strategyLabel.toLowerCase()} work is at most linear.`;
    }
    if (normalized.includes("logn")) {
      return `${approachName}: ${valueText} time follows from repeatedly shrinking the remaining search space by a constant factor.`;
    }
    if (/o\([^)]*n[^)]*\)/.test(normalized)) {
      return `${approachName}: ${valueText} time means the implementation processes each input item a bounded number of times while maintaining its ${strategyLabel.toLowerCase()} state.`;
    }
    if (normalized.includes("o(1)")) {
      return `${approachName}: ${valueText} time uses a fixed amount of work independent of input size.`;
    }
  } else {
    if (normalized.includes("o(1)")) {
      return `${approachName}: ${valueText} auxiliary space keeps only a fixed set of counters, pointers, or scalar variables beyond the input and output.`;
    }
    if (normalized.includes("n^2") || normalized.includes("m*n") || normalized.includes("n*m")) {
      return `${approachName}: ${valueText} auxiliary space stores a table or structure spanning two input dimensions.`;
    }
    if (normalized.includes("logn")) {
      return `${approachName}: ${valueText} auxiliary space usually comes from recursion depth or divide-and-conquer bookkeeping.`;
    }
    if (/o\([^)]*n[^)]*\)/.test(normalized)) {
      return `${approachName}: ${valueText} auxiliary space stores information proportional to the input, such as a map, table, queue, stack, or copied records.`;
    }
  }

  return `${approachName}: the declared ${valueText} ${kind} bound follows from the dominant ${strategyLabel.toLowerCase()} operation in this implementation.`;
}

function cleanMarkup(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[#>*_[\]()|]/g, " ")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateWords(value: string, limit: number) {
  const words = value.split(/\s+/).filter(Boolean);
  return words.length <= limit ? value : `${words.slice(0, limit).join(" ")}...`;
}
