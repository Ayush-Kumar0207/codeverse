import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WorkspaceTeamPanel } from "@/features/workspace/WorkspaceTeamPanel";

vi.mock("@/components/ChatBox", () => ({
  default: () => <div data-testid="team-chat">Team chat</div>,
}));

const organizer = {
  username: "Demo Organizer",
  role: "organizer" as const,
  canEdit: true,
};

describe("WorkspaceTeamPanel", () => {
  it("exposes organizer invite and editing controls", async () => {
    const user = userEvent.setup();
    const onCopyInvite = vi.fn();
    const onToggleEditing = vi.fn();
    render(
      <WorkspaceTeamPanel
        roomId="room"
        activeUsers={[organizer]}
        currentUsername={organizer.username}
        collaborationAccess={{ collaboratorsCanEdit: true }}
        canEdit
        isOrganizer
        inviteCopied={false}
        removed={false}
        notice=""
        onCopyInvite={onCopyInvite}
        onToggleEditing={onToggleEditing}
        onRemoveCollaborator={vi.fn()}
      />
    );
    await user.click(screen.getByRole("button", { name: /copy workspace invite link/i }));
    await user.click(screen.getByRole("switch"));
    expect(onCopyInvite).toHaveBeenCalledOnce();
    expect(onToggleEditing).toHaveBeenCalledOnce();
    expect(screen.getByTestId("team-chat")).toBeInTheDocument();
  });

  it("shows view-only state and organizer identity to collaborators", () => {
    render(
      <WorkspaceTeamPanel
        roomId="room"
        activeUsers={[organizer, { username: "Reviewer", role: "collaborator", canEdit: false }]}
        currentUsername="Reviewer"
        collaborationAccess={{ collaboratorsCanEdit: false, organizerUsername: organizer.username }}
        canEdit={false}
        isOrganizer={false}
        inviteCopied={false}
        removed={false}
        notice="Editing is currently organizer-only."
        onCopyInvite={vi.fn()}
        onToggleEditing={vi.fn()}
        onRemoveCollaborator={vi.fn()}
      />
    );
    expect(screen.getByText("View only")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("organizer-only");
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
  });

  it("allows an organizer to remove another collaborator", async () => {
    const user = userEvent.setup();
    const collaborator = { username: "Reviewer", role: "collaborator" as const, canEdit: true };
    const onRemoveCollaborator = vi.fn();
    render(
      <WorkspaceTeamPanel
        roomId="room"
        activeUsers={[organizer, collaborator]}
        currentUsername={organizer.username}
        collaborationAccess={{ collaboratorsCanEdit: true }}
        canEdit
        isOrganizer
        inviteCopied={false}
        removed={false}
        notice=""
        onCopyInvite={vi.fn()}
        onToggleEditing={vi.fn()}
        onRemoveCollaborator={onRemoveCollaborator}
      />
    );
    await user.click(screen.getByRole("button", { name: "Remove Reviewer" }));
    expect(onRemoveCollaborator).toHaveBeenCalledWith(collaborator);
  });
});
