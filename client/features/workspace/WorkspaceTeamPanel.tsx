"use client";

import ChatBox from "@/components/ChatBox";
import { Check, Eye, Lock, MessageSquare, ShieldCheck, Unlock, UserMinus, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CollaborationAccess, PresenceUser } from "./types";

interface WorkspaceTeamPanelProps {
  roomId: string;
  activeUsers: PresenceUser[];
  currentUsername?: string;
  collaborationAccess: CollaborationAccess;
  canEdit: boolean;
  isOrganizer: boolean;
  inviteCopied: boolean;
  removed: boolean;
  notice: string;
  onCopyInvite: () => void;
  onToggleEditing: () => void;
  onRemoveCollaborator: (collaborator: PresenceUser) => void;
}

export function WorkspaceTeamPanel({
  roomId,
  activeUsers,
  currentUsername,
  collaborationAccess,
  canEdit,
  isOrganizer,
  inviteCopied,
  removed,
  notice,
  onCopyInvite,
  onToggleEditing,
  onRemoveCollaborator,
}: WorkspaceTeamPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col" data-testid="workspace-team-panel">
      <div className="flex shrink-0 items-center gap-2 border-b border-slate-800 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        <MessageSquare className="h-3.5 w-3.5 text-indigo-300" />
        <span>Collaborator Chat</span>
        <div className="ml-auto flex items-center gap-2">
          {isOrganizer && (
            <button
              type="button"
              onClick={onCopyInvite}
              className="inline-flex h-7 items-center gap-1.5 rounded-md border border-indigo-400/20 bg-indigo-400/10 px-2 text-[10px] font-semibold uppercase tracking-widest text-indigo-200 transition-colors hover:bg-indigo-400/15"
              aria-label="Copy workspace invite link"
            >
              {inviteCopied ? <Check className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
              {inviteCopied ? "Copied" : "Invite"}
            </button>
          )}
          {isOrganizer ? (
            <button
              type="button"
              role="switch"
              aria-checked={collaborationAccess.collaboratorsCanEdit}
              onClick={onToggleEditing}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[10px] font-semibold uppercase tracking-widest transition-colors",
                collaborationAccess.collaboratorsCanEdit
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15"
                  : "border-amber-400/20 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
              )}
              title="Toggle collaborator editing"
            >
              {collaborationAccess.collaboratorsCanEdit
                ? <Unlock className="h-3.5 w-3.5" />
                : <Lock className="h-3.5 w-3.5" />}
              {collaborationAccess.collaboratorsCanEdit ? "Team edit" : "Owner edit"}
            </button>
          ) : (
            <div
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[10px] font-semibold uppercase tracking-widest",
                canEdit
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                  : "border-amber-400/20 bg-amber-400/10 text-amber-200"
              )}
              title={collaborationAccess.organizerUsername
                ? `Organizer: ${collaborationAccess.organizerUsername}`
                : "Organizer controls editing"}
            >
              {canEdit ? <ShieldCheck className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {canEdit ? "Can edit" : "View only"}
            </div>
          )}
        </div>
      </div>

      {notice && (
        <div className="border-b border-amber-400/10 bg-amber-400/5 px-3 py-2 text-xs text-amber-200" role="status">
          {notice}
        </div>
      )}

      <div className="border-b border-slate-800 px-3 py-2" aria-label="Active collaborators">
        <div className="flex flex-wrap gap-2">
          {activeUsers.map((activeUser) => {
            const isSelf = activeUser.username === currentUsername;
            const canRemove = isOrganizer && !isSelf && activeUser.role !== "organizer";
            return (
              <div
                key={`${activeUser.socketId || activeUser.username}-${activeUser.username}`}
                className="flex h-8 max-w-full items-center gap-2 rounded-md border border-slate-800 bg-slate-950/70 px-2 text-xs text-slate-300"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-[9px] font-semibold uppercase text-indigo-200">
                  {activeUser.username.slice(0, 2)}
                </span>
                <span className="max-w-[120px] truncate">{activeUser.username}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-600">
                  {activeUser.role === "organizer" ? "Organizer" : activeUser.canEdit === false ? "View" : "Edit"}
                </span>
                {canRemove && (
                  <button
                    type="button"
                    onClick={() => onRemoveCollaborator(activeUser)}
                    className="ml-1 flex h-6 w-6 items-center justify-center rounded text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-300"
                    aria-label={`Remove ${activeUser.username}`}
                  >
                    <UserMinus className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {removed ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
            You no longer have access to this workspace.
          </div>
        ) : (
          <ChatBox roomId={roomId} aiMode={false} channel="team" placeholder="Message everyone in this workspace..." />
        )}
      </div>
    </div>
  );
}
