import generatedCppApproaches from "./generated_cpp_approaches.json";
import curatedCppVariants from "./curated_cpp_variants.json";
import type { AlgorithmApproach, AlgorithmEntry, CodeImplementation } from "./types";

interface GeneratedCppApproach {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
  sourceUrl?: string;
  sourceApproach?: string;
}

const generatedCatalog = generatedCppApproaches as Record<string, GeneratedCppApproach[]>;
const curatedCatalog = curatedCppVariants as Record<string, GeneratedCppApproach[]>;
const catalog = Object.fromEntries(
  [...new Set([...Object.keys(generatedCatalog), ...Object.keys(curatedCatalog)])].map((id) => [
    id,
    [...(generatedCatalog[id] || []), ...(curatedCatalog[id] || [])],
  ])
) as Record<string, GeneratedCppApproach[]>;

const isCpp = (implementation: CodeImplementation) => {
  const language = implementation.language.trim().toLowerCase();
  return language === "c++" || language === "cpp" || language === "cxx";
};

const normalizedApproachName = (name: string) =>
  name.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const approachTier = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("brute")) return "brute";
  if (normalized.includes("better")) return "better";
  if (normalized.includes("optimal") || normalized.includes("optimized")) return "optimal";
  return "";
};

const guideLine = (value: string, maximum = 180) =>
  value
    .replace(/[#*_`$]/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .replace(/\/\//g, "/ /")
    .replace(/\*\//g, "* /")
    .trim()
    .slice(0, maximum);

const withPremiumGuide = (
  algorithm: AlgorithmEntry,
  generated: GeneratedCppApproach
) => {
  const keyIdea = guideLine(generated.description, 220);
  return [
    "// CodeVerse solution guide",
    `// Problem: ${guideLine(algorithm.title)}`,
    `// Strategy: ${guideLine(generated.name)}`,
    `// Key idea: ${keyIdea}`,
    `// Complexity: time ${guideLine(generated.timeComplexity)} | auxiliary space ${guideLine(generated.spaceComplexity)}`,
    ...(generated.sourceUrl ? [`// Reference: ${generated.sourceUrl}`] : []),
    "",
    generated.code.trim(),
    "",
  ].join("\n");
};

const mergeCpp = (
  algorithm: AlgorithmEntry,
  approach: AlgorithmApproach,
  generated: GeneratedCppApproach
): AlgorithmApproach => ({
  ...approach,
  implementations: [
    ...approach.implementations.filter((implementation) => !isCpp(implementation)),
    { language: "C++", code: withPremiumGuide(algorithm, generated) },
  ],
});

export function completeCppApproaches(algorithms: AlgorithmEntry[]): AlgorithmEntry[] {
  return algorithms.map((algorithm) => {
    const generated = catalog[algorithm.id];
    if (!generated?.length) return algorithm;

    const unusedOriginals = new Set(algorithm.approaches.map((_, index) => index));
    const generatedInTeachingOrder = [...generated].sort((left, right) => {
      const rank = (name: string) => {
        const tier = approachTier(name);
        if (tier === "brute") return 0;
        if (tier === "better") return 1;
        if (tier === "optimal") return 2;
        return 1.5;
      };
      return rank(left.name) - rank(right.name);
    });

    const mergedApproaches = generatedInTeachingOrder.map((candidate) => {
      const tier = approachTier(candidate.name);
      const exactIndex = algorithm.approaches.findIndex(
        (approach, approachIndex) =>
          unusedOriginals.has(approachIndex)
          && normalizedApproachName(approach.name) === normalizedApproachName(candidate.name)
      );
      const tierIndex = exactIndex < 0
        ? algorithm.approaches.findIndex(
            (approach, approachIndex) =>
              unusedOriginals.has(approachIndex) && tier && approachTier(approach.name) === tier
          )
        : exactIndex;
      const fallbackIndex =
        tierIndex < 0
        && generatedInTeachingOrder.length === 1
        && algorithm.approaches.length === 1
        && unusedOriginals.has(0)
          ? 0
          : tierIndex;
      if (fallbackIndex >= 0) {
        unusedOriginals.delete(fallbackIndex);
        return mergeCpp(algorithm, algorithm.approaches[fallbackIndex], candidate);
      }
      return {
        name: candidate.name,
        description: candidate.description,
        timeComplexity: candidate.timeComplexity,
        spaceComplexity: candidate.spaceComplexity,
        implementations: [{ language: "C++", code: withPremiumGuide(algorithm, candidate) }],
      };
    });

    for (const originalIndex of unusedOriginals) mergedApproaches.push(algorithm.approaches[originalIndex]);

    return { ...algorithm, approaches: mergedApproaches };
  });
}
