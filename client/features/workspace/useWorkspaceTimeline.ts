"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { WorkspaceSnapshot } from "./types";
import { createWorkspaceSnapshotSignature } from "./workspace-utils";

const MAX_WORKSPACE_SNAPSHOTS = 80;

interface TimelineOptions {
  roomId: string;
  files: Record<string, string>;
  activeFile: string;
  isOrganizer: boolean;
  setFiles: Dispatch<SetStateAction<Record<string, string>>>;
  setActiveFile: Dispatch<SetStateAction<string>>;
  setNotice: Dispatch<SetStateAction<string>>;
  emitFilesChange: (files: Record<string, string>, activeFile: string) => void;
  ready: boolean;
}

export function useWorkspaceTimeline({
  roomId,
  files,
  activeFile,
  isOrganizer,
  setFiles,
  setActiveFile,
  setNotice,
  emitFilesChange,
  ready,
}: TimelineOptions) {
  const [snapshots, setSnapshots] = useState<WorkspaceSnapshot[]>([]);
  const [currentSnapshotId, setCurrentSnapshotId] = useState<string | null>(null);
  const lastSignatureRef = useRef("");
  const skipNextAutoSnapshotRef = useRef(false);
  const storageKey = useMemo(() => `codeverse:workspace-timeline:${roomId}`, [roomId]);

  const createSnapshot = useCallback(
    (label = "Auto snapshot", snapshotFiles = files, snapshotActiveFile = activeFile) => {
      if (!isOrganizer || Object.keys(snapshotFiles).length === 0) return null;

      const signature = createWorkspaceSnapshotSignature(snapshotFiles);
      if (signature === lastSignatureRef.current) return null;

      const snapshot: WorkspaceSnapshot = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        files: { ...snapshotFiles },
        activeFile: snapshotActiveFile,
        label,
      };
      lastSignatureRef.current = signature;
      setSnapshots((previous) =>
        [snapshot, ...previous]
          .slice(0, MAX_WORKSPACE_SNAPSHOTS)
          .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
      );
      setCurrentSnapshotId(snapshot.id);
      return snapshot;
    },
    [activeFile, files, isOrganizer]
  );

  const restoreSnapshot = useCallback(
    (snapshot: WorkspaceSnapshot) => {
      if (!isOrganizer) {
        setNotice("Timeline controls are available only to the organizer.");
        return;
      }

      createSnapshot("Before timeline restore", files, activeFile);
      skipNextAutoSnapshotRef.current = true;
      lastSignatureRef.current = createWorkspaceSnapshotSignature(snapshot.files);
      setFiles(snapshot.files);
      const nextActiveFile = Object.hasOwn(snapshot.files, snapshot.activeFile)
        ? snapshot.activeFile
        : Object.keys(snapshot.files)[0] || "";
      if (nextActiveFile) setActiveFile(nextActiveFile);
      setCurrentSnapshotId(snapshot.id);
      setNotice(`Restored workspace to ${new Date(snapshot.createdAt).toLocaleString()}.`);
      emitFilesChange(snapshot.files, nextActiveFile);
    },
    [activeFile, createSnapshot, emitFilesChange, files, isOrganizer, setActiveFile, setFiles, setNotice]
  );

  const currentIndex = useMemo(() => {
    if (!snapshots.length) return -1;
    if (!currentSnapshotId) return 0;
    const index = snapshots.findIndex((snapshot) => snapshot.id === currentSnapshotId);
    return index >= 0 ? index : 0;
  }, [currentSnapshotId, snapshots]);

  const restoreByTime = useCallback(
    (isoTimestamp: string) => {
      const targetTime = Date.parse(isoTimestamp);
      if (!Number.isFinite(targetTime) || !snapshots.length) return;
      const sorted = [...snapshots].sort(
        (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)
      );
      const snapshot = sorted.find((candidate) => Date.parse(candidate.createdAt) <= targetTime) || sorted.at(-1);
      if (snapshot) restoreSnapshot(snapshot);
    },
    [restoreSnapshot, snapshots]
  );

  const step = useCallback(
    (direction: "back" | "forward") => {
      const nextIndex = direction === "back" ? currentIndex + 1 : currentIndex - 1;
      const snapshot = snapshots[nextIndex];
      if (snapshot) restoreSnapshot(snapshot);
    },
    [currentIndex, restoreSnapshot, snapshots]
  );

  const returnToLatest = useCallback(() => {
    if (snapshots[0]) restoreSnapshot(snapshots[0]);
  }, [restoreSnapshot, snapshots]);

  useEffect(() => {
    if (!isOrganizer || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        setSnapshots([]);
        setCurrentSnapshotId(null);
        lastSignatureRef.current = "";
        return;
      }
      const parsed = JSON.parse(raw) as WorkspaceSnapshot[];
      const validSnapshots = Array.isArray(parsed)
        ? parsed.filter((snapshot) => snapshot?.id && snapshot?.createdAt && snapshot?.files)
        : [];
      setSnapshots(validSnapshots);
      setCurrentSnapshotId(validSnapshots[0]?.id || null);
      lastSignatureRef.current = validSnapshots[0]
        ? createWorkspaceSnapshotSignature(validSnapshots[0].files)
        : "";
    } catch {
      setSnapshots([]);
      setCurrentSnapshotId(null);
      lastSignatureRef.current = "";
    }
  }, [isOrganizer, storageKey]);

  useEffect(() => {
    if (!isOrganizer || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(snapshots));
    } catch {
      // Storage can be unavailable in privacy mode; the in-memory timeline remains usable.
    }
  }, [isOrganizer, snapshots, storageKey]);

  useEffect(() => {
    if (!ready || !isOrganizer || Object.keys(files).length === 0) return;
    if (skipNextAutoSnapshotRef.current) {
      skipNextAutoSnapshotRef.current = false;
      return;
    }
    const timeout = window.setTimeout(() => createSnapshot("Auto snapshot"), 1600);
    return () => window.clearTimeout(timeout);
  }, [activeFile, createSnapshot, files, isOrganizer, ready]);

  return {
    workspaceSnapshots: snapshots,
    currentSnapshotId,
    currentTimelineIndex: currentIndex,
    createWorkspaceSnapshot: createSnapshot,
    restoreWorkspaceSnapshot: restoreSnapshot,
    restoreWorkspaceSnapshotByTime: restoreByTime,
    stepWorkspaceTimeline: step,
    returnToLatestWorkspaceSnapshot: returnToLatest,
  };
}
