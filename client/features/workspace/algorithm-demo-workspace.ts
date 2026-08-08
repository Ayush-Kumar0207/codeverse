import { AT_ALGORITHMS } from "@/data/algos";
import { getCinematicVisualizerCode } from "@/lib/cinematic-visualizers";
import type { DemoWorkspaceOptions, DemoWorkspaceSeed } from "./demo-workspace";

function getExtension(language: string) {
  if (language === "Python") return "py";
  if (language === "C++") return "cpp";
  if (language === "Java") return "java";
  return "js";
}

export function createAlgorithmWorkspace(options: DemoWorkspaceOptions): DemoWorkspaceSeed | null {
  const algorithm = options.algoId
    ? AT_ALGORITHMS.find((candidate) => candidate.id === options.algoId)
    : undefined;
  if (!algorithm) return null;

  const files: Record<string, string> = {};
  const approach = algorithm.approaches[0];
  const cinematicCode = options.visualizerMode === "3d" ? getCinematicVisualizerCode(algorithm) : "";
  const traceFileName = cinematicCode ? "cinematic-3d.js" : algorithm.visualizerCode ? "tracer.js" : "";
  let activeFile = traceFileName;

  if (traceFileName) files[traceFileName] = cinematicCode || algorithm.visualizerCode || "";

  approach?.implementations?.forEach((implementation) => {
    const fileName = `solution.${getExtension(implementation.language)}`;
    files[fileName] = implementation.code;
    if (!traceFileName && (!activeFile || implementation.language.toLowerCase() === options.preferredLanguage?.toLowerCase())) {
      activeFile = fileName;
    }
  });

  const useCases = algorithm.useCases.length
    ? algorithm.useCases.map((useCase) => `- ${useCase}`).join("\n")
    : "- Practice the core idea with the included sample runner.";
  files["PROBLEM.md"] = [`# ${algorithm.title}`, "", algorithm.overview, "", "## Use Cases", useCases].join("\n");

  return {
    project: { _id: `algo-${algorithm.id}`, title: algorithm.title, language: "javascript", isDemo: true, code: "" },
    files,
    activeFile: activeFile || "PROBLEM.md",
  };
}