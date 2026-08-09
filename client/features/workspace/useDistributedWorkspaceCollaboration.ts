"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Socket } from "socket.io-client";
import * as Y from "yjs";
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
  files: Record<string, string>;
  activeFile: string;
  setActiveFile: Dispatch<SetStateAction<string>>;
  setFiles: Dispatch<SetStateAction<Record<string, string>>>;
  demoRole?: string | null;
  demoUser?: string | null;
  inviteToken?: string | null;
}

type JoinState = {
  collaborationMode: "redis" | "single-node" | "connecting";
  revision: number;
  syncReady: boolean;
  pendingOperations: number;
  recovered: boolean;
  instanceId?: string;
  role?: "organizer" | "editor" | "viewer";
};

function encodeUpdate(update: Uint8Array) {
  let binary = "";
  for (let index = 0; index < update.length; index += 1) binary += String.fromCharCode(update[index]);
  return window.btoa(binary);
}

function decodeUpdate(update: string) {
  const binary = window.atob(update);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function materializeFiles(doc: Y.Doc) {
  const files: Record<string, string> = {};
  for (const [fileName, value] of doc.getMap<Y.Text>("files").entries()) {
    if (value instanceof Y.Text) files[fileName] = value.toString();
  }
  return files;
}

function replaceText(text: Y.Text, nextValue: string) {
  const currentValue = text.toString();
  if (currentValue === nextValue) return;
  let prefix = 0;
  while (prefix < currentValue.length && prefix < nextValue.length && currentValue[prefix] === nextValue[prefix]) prefix += 1;
  let currentSuffix = currentValue.length;
  let nextSuffix = nextValue.length;
  while (
    currentSuffix > prefix && nextSuffix > prefix &&
    currentValue[currentSuffix - 1] === nextValue[nextSuffix - 1]
  ) {
    currentSuffix -= 1;
    nextSuffix -= 1;
  }
  if (currentSuffix > prefix) text.delete(prefix, currentSuffix - prefix);
  if (nextSuffix > prefix) text.insert(prefix, nextValue.slice(prefix, nextSuffix));
}

function synchronizeDocFiles(doc: Y.Doc, files: Record<string, string>, origin: string) {
  const fileMap = doc.getMap<Y.Text>("files");
  doc.transact(() => {
    for (const fileName of [...fileMap.keys()]) {
      if (!Object.hasOwn(files, fileName)) fileMap.delete(fileName);
    }
    for (const [fileName, content] of Object.entries(files)) {
      let text = fileMap.get(fileName);
      if (!(text instanceof Y.Text)) {
        text = new Y.Text();
        fileMap.set(fileName, text);
      }
      replaceText(text, content);
    }
  }, origin);
}

function sameFiles(left: Record<string, string>, right: Record<string, string>) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return leftKeys.length === rightKeys.length && leftKeys.every((key) => right[key] === left[key]);
}

function reconnectKey(roomId: string) {
  return `codeverse:collaboration-reconnect:${roomId}`;
}

export function useWorkspaceCollaboration({
  socket,
  roomId,
  project,
  user,
  files,
  activeFile,
  setActiveFile,
  setFiles,
  demoRole,
  demoUser,
  inviteToken,
}: CollaborationOptions) {
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [collaborationAccess, setCollaborationAccess] = useState<CollaborationAccess>({ collaboratorsCanEdit: true });
  const [permissionNotice, setPermissionNotice] = useState("");
  const [inviteCopied, setInviteCopied] = useState(false);
  const [removedFromWorkspace, setRemovedFromWorkspace] = useState(false);
  const [joinState, setJoinState] = useState<JoinState>({
    collaborationMode: "connecting",
    revision: 0,
    syncReady: false,
    pendingOperations: 0,
    recovered: false,
  });
  const docRef = useRef<Y.Doc | null>(null);
  const filesRef = useRef(files);
  const activeFileRef = useRef(activeFile);

  useEffect(() => { filesRef.current = files; }, [files]);
  useEffect(() => { activeFileRef.current = activeFile; }, [activeFile]);

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
    if (user?.username) return { username: user.username, userId: user._id || user.username, avatar: user.avatar };
    if (!project?.isDemo) return null;
    const username = isProjectOrganizer ? "Demo Organizer" : sanitizeDemoUserName(demoUser);
    return {
      username,
      userId: `${isProjectOrganizer ? "demo-organizer" : "demo-collaborator"}:${roomId}:${normalizeIdentity(username)}`,
      avatar: undefined,
    };
  }, [demoUser, isProjectOrganizer, project?.isDemo, roomId, user]);

  const canEditWorkspace = !removedFromWorkspace &&
    joinState.role !== "viewer" &&
    (isProjectOrganizer || collaborationAccess.collaboratorsCanEdit);

  useEffect(() => {
    if (!socket || !project || !collaborationIdentity) return;
    const doc = new Y.Doc();
    docRef.current = doc;
    setJoinState((state) => ({ ...state, syncReady: false, revision: 0, pendingOperations: 0 }));

    const handleLocalUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin !== "local") return;
      const operationId = window.crypto.randomUUID();
      setJoinState((state) => ({ ...state, pendingOperations: state.pendingOperations + 1 }));
      socket.emit(SOCKET_EVENTS.CRDT_UPDATE, {
        roomId,
        activeFile: activeFileRef.current,
        operationId,
        update: encodeUpdate(update),
        clientAt: Date.now(),
      });
    };
    doc.on("update", handleLocalUpdate);

    const emitJoin = () => {
      const reconnectToken = window.sessionStorage.getItem(reconnectKey(roomId)) || "";
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
        roomId,
        user: {
          ...collaborationIdentity,
          isOrganizer: isProjectOrganizer,
          organizerKnown: Boolean(project.owner && !project.isDemo),
          status: `Editing ${activeFileRef.current || "workspace"}`,
        },
        inviteToken: inviteToken || "",
        reconnectToken,
        initialFiles: filesRef.current,
        activeFile: activeFileRef.current,
      });
    };

    const handleJoined = (payload: {
      roomId?: string;
      collaborationMode?: "redis" | "single-node";
      revision?: number;
      recovered?: boolean;
      reconnectToken?: string;
      instanceId?: string;
      role?: "organizer" | "editor" | "viewer";
    }) => {
      if (payload.roomId !== roomId) return;
      if (payload.reconnectToken) window.sessionStorage.setItem(reconnectKey(roomId), payload.reconnectToken);
      setPermissionNotice("");
      setJoinState((state) => ({
        ...state,
        collaborationMode: payload.collaborationMode || "single-node",
        revision: Number(payload.revision || 0),
        recovered: Boolean(payload.recovered),
        instanceId: payload.instanceId,
        role: payload.role,
      }));
    };
    const handleJoinError = (payload: { roomId?: string; message?: string }) => {
      if (payload.roomId !== roomId) return;
      setPermissionNotice(payload.message || "Unable to join this collaboration room.");
    };
    const applyRemoteUpdate = (payload: {
      roomId?: string;
      update?: string;
      files?: Record<string, string>;
      activeFile?: string;
      revision?: number;
    }) => {
      if (payload.roomId && payload.roomId !== roomId) return;
      if (payload.update) Y.applyUpdate(doc, decodeUpdate(payload.update), "remote");
      const materialized = payload.files || materializeFiles(doc);
      if (Object.keys(materialized).length) setFiles(materialized);
      const nextActiveFile = payload.activeFile && Object.hasOwn(materialized, payload.activeFile)
        ? payload.activeFile
        : activeFileRef.current;
      if (nextActiveFile && nextActiveFile !== activeFileRef.current) setActiveFile(nextActiveFile);
      setJoinState((state) => ({ ...state, syncReady: true, revision: Math.max(state.revision, Number(payload.revision || 0)) }));
    };
    const handleAck = (payload: { ok?: boolean; revision?: number }) => {
      setJoinState((state) => ({
        ...state,
        pendingOperations: Math.max(0, state.pendingOperations - 1),
        revision: Math.max(state.revision, Number(payload.revision || 0)),
      }));
      if (payload.ok === false) setPermissionNotice("A collaborative edit could not be confirmed. The workspace will resynchronize automatically.");
    };

    socket.on("connect", emitJoin);
    socket.on(SOCKET_EVENTS.ROOM_JOINED, handleJoined);
    socket.on(SOCKET_EVENTS.ROOM_JOIN_ERROR, handleJoinError);
    socket.on(SOCKET_EVENTS.CRDT_SYNC, applyRemoteUpdate);
    socket.on(SOCKET_EVENTS.CRDT_UPDATE, applyRemoteUpdate);
    socket.on(SOCKET_EVENTS.CRDT_ACK, handleAck);
    emitJoin();

    return () => {
      doc.off("update", handleLocalUpdate);
      doc.destroy();
      if (docRef.current === doc) docRef.current = null;
      socket.off("connect", emitJoin);
      socket.off(SOCKET_EVENTS.ROOM_JOINED, handleJoined);
      socket.off(SOCKET_EVENTS.ROOM_JOIN_ERROR, handleJoinError);
      socket.off(SOCKET_EVENTS.CRDT_SYNC, applyRemoteUpdate);
      socket.off(SOCKET_EVENTS.CRDT_UPDATE, applyRemoteUpdate);
      socket.off(SOCKET_EVENTS.CRDT_ACK, handleAck);
    };
  }, [collaborationIdentity, inviteToken, isProjectOrganizer, project, roomId, setActiveFile, setFiles, socket]);

  useEffect(() => {
    const doc = docRef.current;
    if (!doc || !joinState.syncReady) return;
    const materialized = materializeFiles(doc);
    if (sameFiles(materialized, files)) return;
    synchronizeDocFiles(doc, files, "local");
  }, [files, joinState.syncReady]);

  const emitWorkspaceFilesChange = useCallback((nextFiles: Record<string, string>, nextActiveFile: string) => {
    const doc = docRef.current;
    if (doc && joinState.syncReady) {
      activeFileRef.current = nextActiveFile;
      synchronizeDocFiles(doc, nextFiles, "local");
      return;
    }
    socket?.emit(SOCKET_EVENTS.FILES_CHANGE, {
      roomId,
      files: nextFiles,
      activeFile: nextActiveFile,
      operationId: window.crypto.randomUUID(),
    });
  }, [joinState.syncReady, roomId, socket]);

  const handleToggleTeamEditing = useCallback(() => {
    if (!isProjectOrganizer) return;
    const collaboratorsCanEdit = !collaborationAccess.collaboratorsCanEdit;
    setCollaborationAccess((previous) => ({ ...previous, collaboratorsCanEdit }));
    setPermissionNotice("");
    socket?.emit(SOCKET_EVENTS.EDIT_PERMISSION_UPDATE, { roomId, collaboratorsCanEdit });
  }, [collaborationAccess.collaboratorsCanEdit, isProjectOrganizer, roomId, socket]);

  const handleCopyInviteLink = useCallback(() => {
    if (!isProjectOrganizer || typeof window === "undefined" || !socket) return;
    const copy = (token = "") => {
      const params = new URLSearchParams();
      if (project?.isDemo) params.set("demoRole", "collaborator");
      if (token) params.set("invite", token);
      const query = params.toString();
      const inviteUrl = `${window.location.origin}/editor/${encodeURIComponent(roomId)}${query ? `?${query}` : ""}`;
      setInviteCopied(true);
      setPermissionNotice("Secure editor invite copied. It expires automatically.");
      window.setTimeout(() => setInviteCopied(false), 1800);
      void navigator.clipboard?.writeText(inviteUrl).catch(() => setPermissionNotice(`Copy this invite link: ${inviteUrl}`));
    };
    if (project?.isDemo) {
      copy();
      return;
    }
    socket.timeout(5000).emit(
      SOCKET_EVENTS.ROOM_INVITE_CREATE,
      { roomId, role: "editor" },
      (error: Error | null, response: { ok?: boolean; token?: string; message?: string }) => {
        if (error || !response?.ok || !response.token) {
          setPermissionNotice(response?.message || "The secure invite could not be created. Try again when collaboration reconnects.");
          return;
        }
        copy(response.token);
      }
    );
  }, [isProjectOrganizer, project?.isDemo, roomId, socket]);

  const handleRemoveCollaborator = useCallback((collaborator: PresenceUser) => {
    if (!isProjectOrganizer || collaborator.username === collaborationIdentity?.username) return;
    socket?.emit(SOCKET_EVENTS.REMOVE_COLLABORATOR, { roomId, username: collaborator.username, socketId: collaborator.socketId });
  }, [collaborationIdentity?.username, isProjectOrganizer, roomId, socket]);

  useEffect(() => {
    setRemovedFromWorkspace(false);
  }, [roomId]);

  useEffect(() => {
    if (!socket || !collaborationIdentity) return;
    const handleUserJoined = (data: PresenceUser | PresenceUser[]) => {
      setActiveUsers((previous) => {
        const merged = [...previous];
        for (const joined of Array.isArray(data) ? data : [data]) {
          if (!joined?.username) continue;
          const index = merged.findIndex((candidate) => candidate.userId
            ? candidate.userId === joined.userId
            : candidate.username === joined.username);
          if (index >= 0) merged[index] = { ...merged[index], ...joined };
          else merged.push({ ...joined, status: joined.status || "Joined" });
        }
        return merged;
      });
    };
    const handleUserLeft = (data: PresenceUser) => setActiveUsers((users) => users.filter((candidate) => candidate.socketId !== data.socketId));
    const handlePresenceUpdate = (data: PresenceUser) => setActiveUsers((users) => users.map((candidate) => candidate.socketId === data.socketId ? { ...candidate, ...data } : candidate));
    const handleRemoved = (payload: { roomId?: string; username?: string; reason?: string }) => {
      if (payload.roomId && payload.roomId !== roomId) return;
      if (payload.username && payload.username !== collaborationIdentity.username) return;
      setRemovedFromWorkspace(true);
      setPermissionNotice(payload.reason || "You were removed from this workspace by the organizer.");
    };
    socket.on(SOCKET_EVENTS.USER_JOINED, handleUserJoined);
    socket.on(SOCKET_EVENTS.USER_LEFT, handleUserLeft);
    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, handlePresenceUpdate);
    socket.on(SOCKET_EVENTS.COLLABORATOR_REMOVED, handleRemoved);
    return () => {
      socket.off(SOCKET_EVENTS.USER_JOINED, handleUserJoined);
      socket.off(SOCKET_EVENTS.USER_LEFT, handleUserLeft);
      socket.off(SOCKET_EVENTS.PRESENCE_UPDATE, handlePresenceUpdate);
      socket.off(SOCKET_EVENTS.COLLABORATOR_REMOVED, handleRemoved);
    };
  }, [collaborationIdentity, roomId, socket]);

  useEffect(() => {
    if (!socket) return;
    const updateConnection = () => setSocketConnected(Boolean(socket.connected));
    const handlePong = (payload: { sentAt?: number }) => {
      if (typeof payload.sentAt === "number") setLatencyMs(Math.max(1, Date.now() - payload.sentAt));
      updateConnection();
    };
    const sendPing = () => socket.emit(SOCKET_EVENTS.REALTIME_PING, { roomId, sentAt: Date.now() });
    socket.on("connect", updateConnection);
    socket.on("disconnect", updateConnection);
    socket.on(SOCKET_EVENTS.REALTIME_PONG, handlePong);
    updateConnection();
    sendPing();
    const interval = window.setInterval(sendPing, 5000);
    return () => {
      window.clearInterval(interval);
      socket.off("connect", updateConnection);
      socket.off("disconnect", updateConnection);
      socket.off(SOCKET_EVENTS.REALTIME_PONG, handlePong);
    };
  }, [roomId, socket]);

  useEffect(() => {
    if (!socket) return;
    const applyPermissionState = (state: CollaborationAccess & { roomId?: string }) => {
      if (state.roomId && state.roomId !== roomId) return;
      setCollaborationAccess({ ...state, collaboratorsCanEdit: state.collaboratorsCanEdit !== false });
    };
    const handleDenied = (payload: { roomId?: string; reason?: string; state?: CollaborationAccess; files?: Record<string, string> }) => {
      if (payload.roomId && payload.roomId !== roomId) return;
      if (payload.state) applyPermissionState(payload.state);
      if (payload.files) setFiles(payload.files);
      setPermissionNotice(payload.reason || "Editing is currently organizer-only.");
    };
    socket.on(SOCKET_EVENTS.EDIT_PERMISSION_STATE, applyPermissionState);
    socket.on(SOCKET_EVENTS.EDIT_PERMISSION_DENIED, handleDenied);
    return () => {
      socket.off(SOCKET_EVENTS.EDIT_PERMISSION_STATE, applyPermissionState);
      socket.off(SOCKET_EVENTS.EDIT_PERMISSION_DENIED, handleDenied);
    };
  }, [roomId, setFiles, socket]);

  useEffect(() => {
    if (!socket || !collaborationIdentity || !activeFile) return;
    socket.emit(SOCKET_EVENTS.PRESENCE_UPDATE, { roomId, status: `Editing ${activeFile}` });
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
    collaborationMode: joinState.collaborationMode,
    collaborationRevision: joinState.revision,
    collaborationSyncReady: joinState.syncReady,
    collaborationPendingOperations: joinState.pendingOperations,
    collaborationRecovered: joinState.recovered,
  };
}
