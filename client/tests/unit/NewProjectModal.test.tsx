import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import NewProjectModal from "@/components/NewProjectModal";

vi.mock("@/hooks/useProjectCreation", () => ({
  useProjectCreation: () => ({
    handleCreate: vi.fn().mockResolvedValue(undefined),
    isAuthenticated: true,
  }),
}));

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>New Project</button>
      {open && <NewProjectModal onClose={() => setOpen(false)} />}
    </>
  );
}

describe("NewProjectModal keyboard accessibility", () => {
  it("exposes dialog semantics and an accessible name", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "New Project" }));

    const dialog = screen.getByRole("dialog", { name: "New Project" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription(
      "Choose a name and language for your workspace."
    );
  });

  it("opens from the keyboard and focuses the project-title field", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    expect(screen.getByRole("button", { name: "New Project" })).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(screen.getByLabelText("Project Title")).toHaveFocus();
  });

  it("keeps tab order inside the dialog in both directions", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "New Project" }));

    const titleInput = screen.getByLabelText("Project Title");
    await user.keyboard("My API");

    await user.tab();
    expect(screen.getByLabelText("Language")).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Create Project" })).toHaveFocus();

    // Forward from the last focusable wraps to the first.
    await user.tab();
    expect(
      screen.getByRole("button", { name: "Close new project dialog" })
    ).toHaveFocus();

    // Backward from the first focusable wraps to the last.
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Create Project" })).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByLabelText("Language")).toHaveFocus();
    await user.tab({ shift: true });
    expect(titleInput).toHaveFocus();
  });

  it("closes on Escape and restores focus to the opener", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const opener = screen.getByRole("button", { name: "New Project" });
    await user.click(opener);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
