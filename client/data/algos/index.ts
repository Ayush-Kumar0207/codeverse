import { AlgorithmEntry } from "./types";
import { arraysAlgorithms } from "./arrays";
import { binarySearchAlgorithms } from "./binary_search";
import { treesAlgorithms } from "./trees";
import { dpAlgorithms } from "./dynamic_programming";
import { linkedListAlgorithms } from "./linked_list";
import { graphsAlgorithms } from "./graphs";
import { mathAlgorithms } from "./math";
import { bitManipulationAlgorithms } from "./bit_manipulation";
import { stringsAlgorithms } from "./strings";
import { recursionAlgorithms } from "./recursion";
import { bstAlgorithms } from "./bst";
import { greedyAlgorithms } from "./greedy";
import { triesAlgorithms } from "./tries";
import { sortingAlgorithms } from "./sorting";
import { stackQueueAlgorithms } from "./stacks_queues";
import { graphsAdvancedAlgorithms } from "./graphs_advanced";
import { heapAlgorithms } from "./heaps";
import { advancedDsAlgorithms } from "./advanced_ds";
import { patternsAlgorithms } from "./patterns";
import { generatedStriverAlgorithms } from "./generated_striver_algos";

// Base curated algorithms across all standard topics
const curatedAlgorithms: AlgorithmEntry[] = [
  ...arraysAlgorithms,
  ...binarySearchAlgorithms,
  ...treesAlgorithms,
  ...dpAlgorithms,
  ...linkedListAlgorithms,
  ...graphsAlgorithms,
  ...mathAlgorithms,
  ...stringsAlgorithms,
  ...recursionAlgorithms,
  ...bstAlgorithms,
  ...greedyAlgorithms,
  ...triesAlgorithms,
  ...sortingAlgorithms,
  ...stackQueueAlgorithms,
  ...graphsAdvancedAlgorithms,
  ...bitManipulationAlgorithms,
  ...heapAlgorithms,
  ...advancedDsAlgorithms,
  ...patternsAlgorithms,
];

// Create a lookup Set to guarantee O(1) deduplication of IDs
const curatedIds = new Set(curatedAlgorithms.map(a => a.id));

const isPlaceholderApproach = (algo: AlgorithmEntry) =>
  algo.approaches.some((approach) => {
    const d = approach.description || "";
    const hasGenericDescription =
      d.includes("Standard production-grade implementation of") ||
      d.includes("### 🧠 Concept");
    const hasStubImplementation = approach.implementations.some((impl) => {
      const code = impl.code || "";
      return (
        code.includes("pass") ||
        code.includes("...args") ||
        code.includes("// Logic for") ||
        code.includes("// Optimal") ||
        code.includes("High-performance")
      );
    });
    return hasGenericDescription && hasStubImplementation;
  });

const mergeImplementationsByLanguage = (
  primary: AlgorithmEntry["approaches"][number]["implementations"],
  secondary: AlgorithmEntry["approaches"][number]["implementations"]
) => {
  const byLanguage = new Map<string, { language: string; code: string }>();
  for (const impl of primary) byLanguage.set(impl.language.toLowerCase(), impl);
  for (const impl of secondary) {
    const key = impl.language.toLowerCase();
    if (!byLanguage.has(key)) byLanguage.set(key, impl);
  }
  return Array.from(byLanguage.values());
};

const generatedById = new Map(
  generatedStriverAlgorithms
    .filter((algo) => !isPlaceholderApproach(algo))
    .map((algo) => [algo.id, algo] as const)
);

const mergedCuratedAlgorithms: AlgorithmEntry[] = curatedAlgorithms.map((algo) => {
  const generatedVariant = generatedById.get(algo.id);
  if (!generatedVariant || !algo.approaches.length || !generatedVariant.approaches.length) {
    return algo;
  }

  const curatedApproach = algo.approaches[0];
  const generatedApproach = generatedVariant.approaches[0];
  const mergedFirstApproach = {
    ...curatedApproach,
    implementations: mergeImplementationsByLanguage(
      curatedApproach.implementations,
      generatedApproach.implementations
    ),
    timeComplexityExplanation:
      curatedApproach.timeComplexityExplanation || generatedApproach.timeComplexityExplanation,
    spaceComplexityExplanation:
      curatedApproach.spaceComplexityExplanation || generatedApproach.spaceComplexityExplanation,
  };

  return {
    ...algo,
    approaches: [mergedFirstApproach, ...algo.approaches.slice(1)],
  };
});

// Aggregator registry for all algorithm modules, filtering out any generated ones that have been curated
export const AT_ALGORITHMS: AlgorithmEntry[] = [
  ...mergedCuratedAlgorithms,
  ...generatedStriverAlgorithms.filter(
    (a) => !curatedIds.has(a.id) && !isPlaceholderApproach(a)
  ),
];

export * from "./types";
