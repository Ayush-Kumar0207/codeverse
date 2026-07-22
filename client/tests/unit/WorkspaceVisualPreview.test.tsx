import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspaceVisualPreview } from "@/features/workspace/WorkspaceVisualPreview";

describe("WorkspaceVisualPreview", () => {
  it("renders markdown as readable content", () => {
    render(
      <WorkspaceVisualPreview
        activeFile="README.md"
        language="markdown"
        activeContent="# Workspace guide"
        combinedPreview=""
      />
    );
    expect(screen.getByRole("heading", { name: "Workspace guide" })).toBeInTheDocument();
  });

  it("sandboxes live web previews", () => {
    render(
      <WorkspaceVisualPreview
        activeFile="index.html"
        language="html"
        activeContent="<h1>Hello</h1>"
        combinedPreview="<h1>Hello</h1>"
      />
    );
    const frame = screen.getByTitle("Workspace preview");
    expect(frame).toHaveAttribute("sandbox", "allow-scripts");
    expect(frame).toHaveAttribute("srcdoc", "<h1>Hello</h1>");
  });
});
