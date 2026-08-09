import { beforeEach, describe, expect, it } from "vitest";
import {
  getDeviceProjectLibrary,
  getLastOpenedProjectId,
  mergeCloudProjectLibrary,
  recoverProjectFromTimeline,
  rememberCreatedProject,
} from "@/services/project-library";

describe("device project recovery", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("reconstructs a lost project from its newest workspace snapshot", () => {
    window.localStorage.setItem(
      "codeverse:workspace-timeline:lost-project",
      JSON.stringify([
        {
          id: "snapshot-2",
          createdAt: "2026-08-09T01:30:00.000Z",
          activeFile: "main.cpp",
          label: "Auto snapshot",
          files: {
            "main.cpp": "int main() { return 0; }",
            "README.md": "# testfirst\n\nLanguage: cpp",
          },
        },
      ])
    );

    const project = recoverProjectFromTimeline("lost-project", "kumarayush70049");

    expect(project).toMatchObject({
      _id: "lost-project",
      title: "testfirst",
      language: "cpp",
      owner: "kumarayush70049",
      storage: "device",
    });
    expect(getDeviceProjectLibrary("kumarayush70049").projects).toHaveLength(1);
  });

  it("keeps a newly created project until the cloud confirms it", () => {
    rememberCreatedProject("Ayush", {
      _id: "pending-project",
      title: "Fresh workspace",
      language: "typescript",
    });

    const local = getDeviceProjectLibrary("ayush").projects[0];
    expect(local.storage).toBe("pending");
    expect(getLastOpenedProjectId("AYUSH")).toBe("pending-project");

    const merged = mergeCloudProjectLibrary("ayush", [
      { _id: "pending-project", title: "Fresh workspace", language: "typescript" },
    ]);
    expect(merged.projects[0].storage).toBe("cloud");
    expect(merged.recoveredCount).toBe(0);
  });
});
