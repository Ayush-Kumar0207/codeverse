import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EvidenceOSPanel } from "@/features/workspace/EvidenceOSPanel";
import { localArenaScenarios } from "@/lib/arena-local";
import {
  createDemoEvidenceSnapshot,
  createLocalChallenge,
  createLocalReview,
  createLocalTwin,
  deriveEvidenceSnapshot,
  localDigest,
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
    const answers = Object.fromEntries(challenge.questions.map((question) => {
      const answer = question.focus === "purpose"
        ? "The input becomes validated state and then numeric output because summarizeScores maps each value."
        : question.focus === "prediction"
          ? "When input is empty, the first branch returns an empty result because mapping never runs."
          : question.focus === "modification"
            ? "if (!Array.isArray(input)) throw new Error('validate input'); return summarizeScores(input);"
            : question.focus === "debugging"
              ? "The first unsafe operation reads length from null, so the failing trace stops there."
              : question.focus === "dataflow"
                ? "untrusted input -> validate trust boundary -> trusted state -> output"
                : "For a batch, preserve the invariant for each input before producing each output.";
      return [question.id, answer];
    }));
    const verification = verifyLocalUnderstanding(challenge, answers);
    const twin = createLocalTwin(files, "script.js");

    expect(localDigest("abc")).toBe("6cc43f858fbb763301637b5af970e2a46b46f461f27e5a0f41e009c59b827b25");
    expect(snapshot.integrity.verified).toBe(true);
    const tampered = deriveEvidenceSnapshot({ ...snapshot, events: [{ ...snapshot.events[0], summary: "tampered" }, ...snapshot.events.slice(1)] });
    expect(tampered.integrity.verified).toBe(false);
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
    const onCreateArenaTemplate = vi.fn().mockResolvedValue({ ...localArenaScenarios[0], id: "custom" });
    const onJoinArena = vi.fn().mockResolvedValue(true);
    const onMatchmakeArena = vi.fn().mockResolvedValue(true);

    render(
      <EvidenceOSPanel
        snapshot={snapshot}
        twin={twin}
        challenge={challenge}
        arenaScenarios={localArenaScenarios}
        arenaLeaderboard={[]}
        activeArena={null}
        loading={false}
        syncing={false}
        offline={false}
        notice=""
        coverage={92}
        focusedLocation={{ fileName: "script.js", lineNumber: 2, column: 1 }}
        onCreatePackage={vi.fn().mockResolvedValue(undefined)}
        onVerifyPackage={vi.fn().mockResolvedValue(true)}
        onRunReview={vi.fn().mockResolvedValue(undefined)}
        onGenerateChallenge={vi.fn().mockResolvedValue(challenge)}
        onSubmitUnderstanding={vi.fn().mockResolvedValue(undefined)}
        onBranchFromEvent={onBranchFromEvent}
        onCreateArenaTemplate={onCreateArenaTemplate}
        onStartArena={vi.fn().mockResolvedValue(true)}
        onBeginArena={vi.fn().mockResolvedValue(true)}
        onJoinArena={onJoinArena}
        onMatchmakeArena={onMatchmakeArena}
        onRecordArenaNote={vi.fn().mockResolvedValue(undefined)}
        onSubmitArena={vi.fn().mockResolvedValue(null)}
        onVerifyArenaReport={vi.fn().mockResolvedValue(true)}
        onExportEvidence={vi.fn().mockResolvedValue(undefined)}
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

    await user.click(screen.getByRole("tab", { name: /arena/i }));
    expect(screen.getByText("Engineering arena")).toBeInTheDocument();
    expect(screen.getByText("Evaluator scenario builder")).toBeInTheDocument();
    await user.click(screen.getByLabelText(/consent to evidence recording for this shared assessment/i));
    await user.type(screen.getByLabelText("Arena lobby code"), "TEAM1234");
    await user.click(screen.getByRole("button", { name: "Join" }));
    expect(onJoinArena).toHaveBeenCalledWith("TEAM1234");
    expect(screen.getByRole("button", { name: /quick match/i })).toBeInTheDocument();
  });
});

