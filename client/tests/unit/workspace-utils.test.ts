import { describe, expect, it } from "vitest";
import {
  buildAssistantWorkspaceContext,
  clipForAssistant,
  createWorkspaceSnapshotSignature,
  normalizeIdentity,
  sanitizeDemoUserName,
} from "@/features/workspace/workspace-utils";

describe("workspace utilities", () => {
  it("normalizes identities before ownership comparisons", () => {
    expect(normalizeIdentity("  Owner@Example.COM ")).toBe("owner@example.com");
    expect(normalizeIdentity(null)).toBe("");
  });

  it("clips long assistant context while preserving its beginning and end", () => {
    const source = `${"a".repeat(100)}${"z".repeat(100)}`;
    const clipped = clipForAssistant(source, 100);
    expect(clipped.length).toBeLessThanOrEqual(100);
    expect(clipped).toContain("file shortened for assistant context");
    expect(clipped.startsWith("a")).toBe(true);
    expect(clipped.endsWith("z")).toBe(true);
  });

  it("prioritizes the active file and caps the total assistant payload", () => {
    const files = {
      "secondary.ts": "s".repeat(5000),
      "active.ts": "a".repeat(5000),
      "third.ts": "t".repeat(5000),
    };
    const context = buildAssistantWorkspaceContext(files, "active.ts");
    expect(context.startsWith("File: active.ts")).toBe(true);
    expect(context.length).toBeLessThanOrEqual(7100);
  });

  it("creates stable snapshot signatures regardless of object insertion order", () => {
    expect(createWorkspaceSnapshotSignature({ "b.ts": "2", "a.ts": "1" }))
      .toBe(createWorkspaceSnapshotSignature({ "a.ts": "1", "b.ts": "2" }));
  });

  it("sanitizes demo collaborator names", () => {
    expect(sanitizeDemoUserName(" <Reviewer!> ")).toBe("Reviewer");
    expect(sanitizeDemoUserName("***")).toBe("Demo Collaborator");
    expect(sanitizeDemoUserName("x".repeat(80))).toHaveLength(32);
  });
});
