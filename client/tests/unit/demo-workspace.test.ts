import { describe, expect, it } from "vitest";
import { AT_ALGORITHMS } from "@/data/algos";
import { createDemoWorkspace } from "@/features/workspace/demo-workspace";

describe("demo workspace factory", () => {
  it("builds the complete ScoreLens public demo", () => {
    const workspace = createDemoWorkspace();
    expect(workspace.project.title).toBe("ScoreLens");
    expect(workspace.activeFile).toBe("index.html");
    expect(Object.keys(workspace.files)).toEqual([
      "index.html",
      "style.css",
      "script.js",
      "tracer.js",
      "README.md",
    ]);
    expect(workspace.files["index.html"]).toContain('id="score-form"');
    expect(workspace.files["tracer.js"]).toContain("recordTrace");
  });

  it("builds an algorithm workspace with a runnable solution and problem brief", () => {
    const algorithm = AT_ALGORITHMS.find((candidate) => candidate.approaches[0]?.implementations?.length);
    expect(algorithm).toBeDefined();
    const workspace = createDemoWorkspace({ algoId: algorithm!.id, preferredLanguage: "C++" });
    expect(workspace.project.title).toBe(algorithm!.title);
    expect(workspace.files["PROBLEM.md"]).toContain(`# ${algorithm!.title}`);
    expect(Object.keys(workspace.files).some((fileName) => fileName.startsWith("solution."))).toBe(true);
  });

  it("selects the cinematic trace when 3D mode is requested", () => {
    const algorithm = AT_ALGORITHMS[0];
    const workspace = createDemoWorkspace({ algoId: algorithm.id, visualizerMode: "3d" });
    expect(workspace.activeFile).toBe("cinematic-3d.js");
    expect(workspace.files["cinematic-3d.js"]).toContain("recordTrace");
  });
});
