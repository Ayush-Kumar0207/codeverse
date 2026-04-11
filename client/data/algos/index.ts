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
];

// Create a lookup Set to guarantee O(1) deduplication of IDs
const curatedIds = new Set(curatedAlgorithms.map(a => a.id));

// Aggregator registry for all algorithm modules, filtering out any generated ones that have been curated
export const AT_ALGORITHMS: AlgorithmEntry[] = [
  ...curatedAlgorithms,
  ...generatedStriverAlgorithms.filter(a => !curatedIds.has(a.id))
];

export * from "./types";
