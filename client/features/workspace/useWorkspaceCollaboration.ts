"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";
import type { SharedProject } from "@shared/types/project";
import type { CollaborationAccess, PresenceUser } from "./types";
import { normalizeIdentity, sanitizeDemoUserName } from "./workspace-utils";

interface WorkspaceUser {
  _id?: string;
  username?: string;
  email?: string;
  avatar?: string;
}

interface CollaborationOptions {
  socket: Socket | null;
  roomId: string;
  project: SharedProject | null;
  user?: WorkspaceUser | null;
  activeFile: string;
  setActiveFile: Dispatch<SetStateAction<string>>;
  setFiles: Dispatch<SetStateAction<Record<string, string>>>;
  demoRole?: string | null;
  demoUser?: string | null;
}

export function useWorkspaceCollaboration({
  socket,
  roomId,
  project,
  user,
  activeFile,
  setActiveFile,
  setFiles,
  demoRole,
  demoUser,
}: CollaborationOptions) {
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [collaborationAccess, setCollaborationAccess] = useState<CollaborationAccess>({
    collaboratorsCanEdit: true,
  });
  const [permissionNotice, setPermissionNotice] = useState("");
  const [inviteCopied, setInviteCopied] = useState(false);
  const [removedFromWorkspace, setRemovedFromWorkspace] = useState(false);

  const isProjectOrganizer = useMemo(() => {
    if (!project) return false;
    if (project.isDemo) return demoRole !== "collaborator";

    const owner = normalizeIdentity(project.owner);
    if (!owner) return true;

    return [user?._id, user?.username, user?.email]
      .map((value) => normalizeIdentity(value))
      .filter(Boolean)
      .includes(owner);
  }, [demoRole, project, user?._id, user?.email, user?.username]);

  const collaborationIdentity = useMemo(() => {
    if (user?.username) {
      return { username: user.username, userId: user._id || user.username, avatar: user.avatar };
    }
    if (!project?.isDemo) return null;

    const username = isProjectOrganizer ? "Demo Organizer" : sanitizeDemoUserName(demoUser);
    return {
      username,
      userId: `${isProjectOrganizer ? "demo-organizer" : "demo-collaborator"}:${roomId}:${normalizeIdentity(username)}`,
      avatar: undefined,
    };
  }, [demoUser, isProjectOrganizer, project?.isDemo, roomId, user]);

  const canEditWorkspace =
    !removedFromWorkspace && (isProjectOrganizer || collaborationAccess.collaboratorsCanEdit);

  const emitWorkspaceFilesChange = useCallback(
    (nextFiles: Record<string, string>, nextActiveFile: string) => {
      socket?.emit(SOCKET_EVENTS.FILES_CHANGE, {
        roomId,
        files: nextFiles,
        activeFile: nextActiveFile,
      });
    },
    [roomId, socket]
  );

  const handleToggleTeamEditing = useCallback(() => {
    if (!isProjectOrganizer) return;

    const collaboratorsCanEdit = !collaborationAccess.collaboratorsCanEdit;
    setCollaborationAccess((previous) => ({
      ...previous,
      collaboratorsCanEdit,
      organizerUsername: collaborationIdentity?.username || previous.organizerUsername,
      organizerUserId: collaborationIdentity?.userId || previous.organizerUserId,
    }));
    setPermissionNotice("");
    socket?.emit(SOCKET_EVENTS.EDIT_PERMISSION_UPDATE, { roomId, collaboratorsCanEdit });
  }, [collaborationAccess.collaboratorsCanEdit, collaborationIdentity, isProjectOrganizer, roomId, socket]);

  const handleCopyInviteLink = useCallback(() => {
    if (!isProjectOrganizer || typeof window === "undefined") return;

    const demoAccess = project?.isDemo ? "?demoRole=collaborator" : "";
    const inviteUrl = `${window.location.origin}/editor/${encodeURIComponent(roomId)}${demoAccess}`;
    setInviteCopied(true);
    setPermissionNotice("Invite link copied. Anyone you share it with can join this workspace.");
    window.setTimeout(() => setInviteCopied(false), 1800);

    if (!navigator.clipboard?.writeText) {
      setPermissionNotice(`Copy this invite link: ${inviteUrl}`);
      return;
    }
    void navigator.clipboard.writeText(inviteUrl).catch(() => {
      setPermissionNotice(`Copy this invite link: ${inviteUrl}`);
    });
  }, [isProjectOrganizer, project?.isDemo, roomId]);

  const handleRemoveCollaborator = useCallback(
    (collaborator: PresenceUser) => {
      if (!isProjectOrganizer || collaborator.username === collaborationIdentity?.username) return;
      socket?.emit(SOCKET_EVENTS.REMOVE_COLLABORATOR, {
        roomId,
        username: collaborator.username,
        socketId: collaborator.socketId,
      });
    },
    [collaborationIdentity?.username, isProjectOrganizer, roomId, socket]
  );

  useEffect(() => {
    setRemovedFromWorkspace(false);
  }, [roomId]);

  useEffect(() => {
    if (!socket || !collaborationIdentity || !project || removedFromWorkspace) return;

    socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId,
      user: {
        ...collaborationIdentity,
        isOrganizer: isProjectOrganizer,
        organizerKnown: Boolean(project.owner && !project.isDemo),
        status: "Editing",
      },
    });

    setActiveUsers((previous) => {
      const ownPresence = {
        ...collaborationIdentity,
        status: "Editing",
        role: isProjectOrganizer ? "organizer" : "collaborator",
        canEdit: canEditWorkspace,
      } satisfies PresenceUser;
      return [ownPresence, ...previous.filter((activeUser) => activeUser.username !== collaborationIdentity.username)];
    });

    const handleUserJoined = (data: PresenceUser | PresenceUser[]) => {
      setActiveUsers((previous) => {
        const merged = [...previous];
        for (const joinedUser of Array.isArray(data) ? data : [data]) {
          if (!joinedUser?.username) continue;
          const existingIndex = merged.findIndex((candidate) => candidate.username === joinedUser.username);
          if (existingIndex >= 0) merged[existingIndex] = { ...merged[existingIndex], ...joinedUser };
          else merged.push({ ...joinedUser, status: joinedUser.status || "Joined" });
        }
        return merged;
      });
    };
    const handleUserLeft = (data: PresenceUser) => {
      setActiveUsers((previous) => previous.filter((candidate) => candidate.username !== data.username));
    };
    const handlePresenceUpdate = (data: PresenceUser) => {
      setActiveUsers((previous) =>
        previous.map((candidate) => candidate.username === data.username ? { ...candidate, status: data.status } : candidate)
      );
    };
    const handleCollaboratorRemoved = (payload: { roomId?: string; username?: string; reason?: string }) => {
      if (payload.roomId && payload.roomId !== roomId) return;
      if (payload.username && payload.username !== collaborationIdentity.username) return;
      setRemovedFromWorkspace(true);
      setPermissionNotice(payload.reason || "You were removed from this workspace by the organizer.");
      setActiveUsers((previous) => previous.filter((candidate) => candidate.username !== collaborationIdentity.username));
    };

    socket.on(SOCKET_EVENTS.USER_JOINED, handleUserJoined);
    socket.on(SOCKET_EVENTS.USER_LEFT, handleUserLeft);
    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, handlePresenceUpdate);
    socket.on(SOCKET_EVENTS.COLLABORATOR_REMOVED, handleCollaboratorRemoved);
    return () => {
      socket.off(SOCKET_EVENTS.USER_JOINED, handleUserJoined);
      socket.off(SOCKET_EVENTS.USER_LEFT, handleUserLeft);
      socket.off(SOCKET_EVENTS.PRESENCE_UPDATE, handlePresenceUpdate);
      socket.off(SOCKET_EVENTS.COLLABORATOR_REMOVED, handleCollaboratorRemoved);
    };
  }, [canEditWorkspace, collaborationIdentity, isProjectOrganizer, project, removedFromWorkspace, roomId, socket]);

  useEffect(() => {
    if (!socket) return;

    const updateConnectionState = () => setSocketConnected(Boolean(socket.connected));
    const handlePong = (payload: { sentAt?: number }) => {
      if (typeof payload?.sentAt === "number") setLatencyMs(Math.max(1, Date.now() - payload.sentAt));
      updateConnectionState();
    };
    const sendPing = () => {
      updateConnectionState();
      socket.emit(SOCKET_EVENTS.REALTIME_PING, { roomId, sentAt: Date.now() });
    };

    socket.on("connect", updateConnectionState);
    socket.on("disconnect", updateConnectionState);
    socket.on(SOCKET_EVENTS.REALTIME_PONG, handlePong);
    sendPing();
    const interval = window.setInterval(sendPing, 5000);
    return () => {
      window.clearInterval(interval);
      socket.off("connect", updateConnectionState);
      socket.off("disconnect", updateConnectionState);
      socket.off(SOCKET_EVENTS.REALTIME_PONG, handlePong);
    };
  }, [roomId, socket]);

  useEffect(() => {
    if (!socket) return;
    const handleSyncCode = (payload: string | { files?: Record<string, string> }) => {
      if (typeof payload === "string") {
        setFiles((previous) => ({ ...previous, [activeFile]: payload }));
        return;
      }
      if (payload?.files) {
        const syncedFiles = Object.fromEntries(
          Object.entries(payload.files).filter(([fileName]) => fileName !== "__active__")
        );
        if (Object.keys(syncedFiles).length) setFiles((previous) => ({ ...previous, ...syncedFiles }));
      }
    };
    socket.on(SOCKET_EVENTS.SYNC_CODE, handleSyncCode);
    return () => { socket.off(SOCKET_EVENTS.SYNC_CODE, handleSyncCode); };
  }, [activeFile, setFiles, socket]);

  useEffect(() => {
    if (!socket) return;
    const handleRemoteCodeChange = (payload: string | { fileName?: string; code?: string }) => {
      const nextCode = typeof payload === "string" ? payload : payload?.code;
      const nextFileName = typeof payload === "string" ? activeFile : payload?.fileName;
      if (typeof nextCode !== "string" || !nextFileName || nextFileName === activeFile) return;
      setFiles((previous) => previous[nextFileName] === nextCode ? previous : { ...previous, [nextFileName]: nextCode });
    };
    const handleFilesChange = (payload: { roomId?: string; files?: Record<string, string>; activeFile?: string }) => {
      if ((payload.roomId && payload.roomId !== roomId) || !payload.files) return;
      setFiles(payload.files);
      const nextActiveFile = Object.hasOwn(payload.files, activeFile) ? activeFile : Object.keys(payload.files)[0] || "";
      if (nextActiveFile) setActiveFile(nextActiveFile);
    };
    socket.on(SOCKET_EVENTS.CODE_CHANGE, handleRemoteCodeChange);
    socket.on(SOCKET_EVENTS.FILES_CHANGE, handleFilesChange);
    return () => {
      socket.off(SOCKET_EVENTS.CODE_CHANGE, handleRemoteCodeChange);
      socket.off(SOCKET_EVENTS.FILES_CHANGE, handleFilesChange);
    };
  }, [activeFile, roomId, setActiveFile, setFiles, socket]);

  useEffect(() => {
    if (!socket) return;

    const applyPermissionState = (state: CollaborationAccess) => {
      const collaboratorsCanEdit = state.collaboratorsCanEdit !== false;
      setCollaborationAccess({ ...state, collaboratorsCanEdit });
      setActiveUsers((previous) => previous.map((activeUser) => {
        const organizer = activeUser.role === "organizer" ||
          (!!state.organizerUsername && activeUser.username === state.organizerUsername) ||
          (!!state.organizerUserId && activeUser.userId === state.organizerUserId);
        return { ...activeUser, role: organizer ? "organizer" : activeUser.role, canEdit: organizer || collaboratorsCanEdit };
      }));
    };
    const handlePermissionState = (payload: CollaborationAccess & { roomId?: string }) => {
      if (payload.roomId && payload.roomId !== roomId) return;
      applyPermissionState(payload);
      setPermissionNotice("");
    };
    const handlePermissionDenied = (payload: {
      roomId?: string;
      reason?: string;
      state?: CollaborationAccess;
      files?: Record<string, string> | null;
    }) => {
      if (payload.roomId && payload.roomId !== roomId) return;
      if (payload.state) applyPermissionState(payload.state);
      if (payload.files) setFiles((previous) => ({ ...previous, ...payload.files }));
      setPermissionNotice(payload.reason || "Editing is currently organizer-only.");
    };
    socket.on(SOCKET_EVENTS.EDIT_PERMISSION_STATE, handlePermissionState);
    socket.on(SOCKET_EVENTS.EDIT_PERMISSION_DENIED, handlePermissionDenied);
    return () => {
      socket.off(SOCKET_EVENTS.EDIT_PERMISSION_STATE, handlePermissionState);
      socket.off(SOCKET_EVENTS.EDIT_PERMISSION_DENIED, handlePermissionDenied);
    };
  }, [roomId, setFiles, socket]);

  useEffect(() => {
    if (!socket || !collaborationIdentity || !activeFile) return;
    socket.emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
      roomId,
      username: collaborationIdentity.username,
      status: `Editing ${activeFile}`,
    });
  }, [activeFile, collaborationIdentity, roomId, socket]);

  return {
    activeUsers,
    latencyMs,
    socketConnected,
    collaborationAccess,
    permissionNotice,
    setPermissionNotice,
    inviteCopied,
    removedFromWorkspace,
    isProjectOrganizer,
    collaborationIdentity,
    canEditWorkspace,
    emitWorkspaceFilesChange,
    handleToggleTeamEditing,
    handleCopyInviteLink,
    handleRemoveCollaborator,
  };
}
