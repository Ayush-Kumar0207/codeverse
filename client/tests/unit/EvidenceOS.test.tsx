import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EvidenceOSPanel } from "@/features/workspace/EvidenceOSPanel";
import {
  createDemoEvidenceSnapshot,
  createLocalChallenge,
  createLocalReview,
  createLocalTwin,
  verifyLocalUnderstanding,
} from "@/lib/evidence-local";

const files = {
  "index.html": "<script src='./script.js'></script>",
  "script.js": "function summarizeScores(input) { if (!input.length) return []; return input.map(Number); }",
  "script.test.js": "test('empty', () => summarizeScores([]));",
};

describe("EvidenceOS", () => {
  it("builds review, understanding, replay, and impact evidence from one workspace", () => {
    const snapshot = createDemoEvidenceSnapshot("demo-sandbox", files, "Demo Organizer");
    const review = createLocalReview(
      "demo-sandbox",
      files,
      "Handle empty score input.",
      "Restore the prior snapshot."
    );
    const challenge = createLocalChallenge("demo-sandbox", "script.js", files["script.js"]);
    const answers = Object.fromEntries(challenge.questions.map((question) => [
      question.id,
      "Validate the input at the trust boundary, preserve valid output state, and route empty input through the explicit error guard without changing shared state.",
    ]));
    const verification = verifyLocalUnderstanding(challenge, answers);
    const twin = createLocalTwin(files, "script.js");

    expect(snapshot.integrity.verified).toBe(true);
    expect(snapshot.packages[0].status).toBe("ready");
    expect(review.agents).toHaveLength(7);
    expect(verification.passed).toBe(true);
    expect(twin.impact.affectedFiles).toContain("index.html");
  });

  it("exposes the complete EvidenceOS workflow in the workspace panel", async () => {
    const user = userEvent.setup();
    const snapshot = createDemoEvidenceSnapshot("demo-sandbox", files, "Demo Organizer");
    const twin = createLocalTwin(files, "script.js");
    const challenge = createLocalChallenge("demo-sandbox", "script.js", files["script.js"]);
    const onBranchFromEvent = vi.fn().mockResolvedValue(true);

    render(
      <EvidenceOSPanel
        snapshot={snapshot}
        twin={twin}
        challenge={challenge}
        loading={false}
        syncing={false}
        offline={false}
        notice=""
        coverage={92}
        focusedLocation={{ fileName: "script.js", lineNumber: 2, column: 1 }}
        onCreatePackage={vi.fn().mockResolvedValue(undefined)}
        onRunReview={vi.fn().mockResolvedValue(undefined)}
        onGenerateChallenge={vi.fn().mockResolvedValue(challenge)}
        onSubmitUnderstanding={vi.fn().mockResolvedValue(undefined)}
        onBranchFromEvent={onBranchFromEvent}
      />
    );

    expect(screen.getByLabelText(/evidence coverage 92%/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Line evidence inspector")).toHaveTextContent("script.js:2");
    expect(screen.getByText("Latest proof package")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /replay/i }));
    expect(screen.getByText("Session replay")).toBeInTheDocument();
    const branchButton = screen.getByRole("button", { name: /branch from this moment/i });
    if (!branchButton.hasAttribute("disabled")) {
      await user.click(branchButton);
      expect(onBranchFromEvent).toHaveBeenCalledOnce();
    }

    await user.click(screen.getByRole("tab", { name: /board/i }));
    expect(screen.getByText("Adversarial review board")).toBeInTheDocument();
    expect(screen.getAllByText("Security Agent").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("tab", { name: /verify/i }));
    expect(screen.getByText("Human understanding")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /twin/i }));
    expect(screen.getByText("Engineering digital twin")).toBeInTheDocument();
  });
});

