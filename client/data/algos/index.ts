import { AlgorithmEntry } from "./types";
import { arraysAlgorithms } from "./arrays";
import { binarySearchAlgorithms } from "./binary_search";
import { treesAlgorithms } from "./trees";
import { dpAlgorithms } from "./dynamic_programming";
import { linkedListAlgorithms } from "./linked_list";
import { graphsAlgorithms } from "./graphs";
import { mathAlgorithms } from "./math";
import { stringsAlgorithms } from "./strings";
import { recursionAlgorithms } from "./recursion";
import { bstAlgorithms } from "./bst";
import { greedyAlgorithms } from "./greedy";
import { triesAlgorithms } from "./tries";
import { sortingAlgorithms } from "./sorting";
import { stackQueueAlgorithms } from "./stacks_queues";
import { generatedStriverAlgorithms } from "./generated_striver_algos";

// Aggregator registry for all algorithm modules
export const AT_ALGORITHMS: AlgorithmEntry[] = [
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
  ...generatedStriverAlgorithms
];

export * from "./types";
