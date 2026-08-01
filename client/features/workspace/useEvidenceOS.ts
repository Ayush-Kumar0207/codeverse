"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  EngineeringDigitalTwin,
  EngineeringEvent,
  EvidenceOSSnapshot,
  UnderstandingChallenge,
} from "@shared/types/evidence";
import {
  appendLocalEvidenceEvent,
  createDemoEvidenceSnapshot,
  createLocalChallenge,
  createLocalPackage,
  createLocalReview,
  createLocalTwin,
  deriveEvidenceSnapshot,
  emptyEvidenceSnapshot,
  verifyLocalUnderstanding,
  type EvidenceEventInput,
} from "@/lib/evidence-local";
import {
  fetchEvidenceSnapshot,
  postDigitalTwin,
  postEvidenceEvent,
  postEvidencePackage,
  postReviewBoard,
  postUnderstandingChallenge,
  postUnderstandingVerification,
} from "@/services/evidence";

interface UseEvidenceOSOptions {
  projectId: string;
  files: Record<string, string>;
  activeFile: string;
  currentUser: string;
  ready: boolean;
  setFiles: Dispatch<SetStateAction<Record<string, string>>>;
  setActiveFile: Dispatch<SetStateAction<string>>;
}

function sessionId() {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  return "session-" + id;
}

function fileSignature(files: Record<string, string>) {
  let hash = 2166136261;
  const input = Object.entries(files)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, content]) => name + "\u0000" + content)
    .join("\u0001");
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return String(hash >>> 0);
}

function compactFiles(files: Record<string, string>) {
  let budget = 170_000;
  const result: Record<string, string> = {};
  for (const [name, content] of Object.entries(files).slice(0, 60)) {
    if (budget <= 0) break;
    const value = content.slice(0, Math.min(35_000, budget));
    result[name] = value;
    budget -= value.length + name.length;
  }
  return result;
}

function readLocalSnapshot(projectId: string) {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem("codeverse:evidence:" + projectId);
    if (!value) return null;
    return deriveEvidenceSnapshot(JSON.parse(value) as EvidenceOSSnapshot);
  } catch {
    return null;
  }
}

export function useEvidenceOS({
  projectId,
  files,
  activeFile,
  currentUser,
  ready,
  setFiles,
  setActiveFile,
}: UseEvidenceOSOptions) {
  const isDemo = projectId === "demo-sandbox";
  const activeSessionId = useRef(sessionId());
  const snapshotRef = useRef<EvidenceOSSnapshot>(emptyEvidenceSnapshot(projectId));
  const [snapshot, setSnapshot] = useState<EvidenceOSSnapshot>(() => emptyEvidenceSnapshot(projectId));
  const [twin, setTwin] = useState<EngineeringDigitalTwin>(() => createLocalTwin(files, activeFile));
  const [challenge, setChallenge] = useState<UnderstandingChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [offline, setOffline] = useState(false);
  const [notice, setNotice] = useState("");
  const [focusedLocation, setFocusedLocation] = useState<{ fileName: string; lineNumber: number; column: number } | null>(null);
  const signatureRef = useRef("");
  const loadedProjectRef = useRef("");

  const commit = useCallback((next: EvidenceOSSnapshot) => {
    const derived = deriveEvidenceSnapshot(next);
    snapshotRef.current = derived;
    setSnapshot(derived);
    return derived;
  }, []);

  const replaceServerEvent = useCallback((localId: string, event: EngineeringEvent) => {
    const current = snapshotRef.current;
    commit({
      ...current,
      events: [...current.events.filter((candidate) => candidate.id !== localId && candidate.id !== event.id), event],
    });
  }, [commit]);

  const recordEvent = useCallback(async (input: EvidenceEventInput) => {
    const local = appendLocalEvidenceEvent(
      snapshotRef.current,
      activeSessionId.current,
      currentUser || "Guest",
      input
    );
    commit(local.snapshot);

    if (isDemo) return;
    try {
      const event = await postEvidenceEvent(projectId, {
        ...input,
        sessionId: activeSessionId.current,
      });
      replaceServerEvent(local.event.id, event);
      setOffline(false);
    } catch {
      setOffline(true);
      setNotice("Evidence is safe in this browser and will remain available offline.");
    }
  }, [commit, currentUser, isDemo, projectId, replaceServerEvent]);

  useEffect(() => {
    if (!ready || !projectId || loadedProjectRef.current === projectId) return;
    loadedProjectRef.current = projectId;
    let active = true;
    setLoading(true);

    if (isDemo) {
      const seeded = createDemoEvidenceSnapshot(projectId, files, currentUser || "Demo Organizer");
      commit(seeded);
      signatureRef.current = fileSignature(files);
      setTwin(createLocalTwin(files, activeFile));
      setLoading(false);
      return;
    }

    fetchEvidenceSnapshot(projectId)
      .then((result) => {
        if (!active) return;
        commit(result);
        setOffline(false);
      })
      .catch(() => {
        if (!active) return;
        commit(readLocalSnapshot(projectId) || emptyEvidenceSnapshot(projectId));
        setOffline(true);
        setNotice("Backend evidence sync is unavailable; this session is recording locally.");
      })
      .finally(() => {
        if (!active) return;
        signatureRef.current = fileSignature(files);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [activeFile, commit, currentUser, files, isDemo, projectId, ready]);

  useEffect(() => {
    if (loading || !ready) return;
    if (snapshotRef.current.events.some((event) => event.sessionId === activeSessionId.current && event.type === "session.started")) return;
    void recordEvent({
      type: "session.started",
      summary: "Engineering session started with evidence capture enabled.",
      source: "session",
      payload: { activeFile, files: Object.keys(files) },
    });
  }, [activeFile, files, loading, ready, recordEvent]);

  useEffect(() => {
    if (loading || !ready || !Object.keys(files).length) return;
    const signature = fileSignature(files);
    if (!signatureRef.current) {
      signatureRef.current = signature;
      return;
    }
    if (signature === signatureRef.current) return;
    const timeout = window.setTimeout(() => {
      signatureRef.current = signature;
      const fileSnapshot = compactFiles(files);
      void recordEvent({
        type: "code.changed",
        summary: "Updated " + activeFile + " with a replayable workspace snapshot.",
        source: "editor",
        fileName: activeFile,
        payload: {
          files: fileSnapshot,
          activeFile,
          bytes: Object.values(fileSnapshot).reduce((sum, content) => sum + content.length, 0),
        },
      });
    }, 1800);
    return () => window.clearTimeout(timeout);
  }, [activeFile, files, loading, ready, recordEvent]);

  useEffect(() => {
    const handleEvidenceEvent = (event: Event) => {
      const detail = (event as CustomEvent<EvidenceEventInput>).detail;
      if (detail?.type && detail?.summary) void recordEvent(detail);
    };
    window.addEventListener("codeverse:evidence", handleEvidenceEvent);
    return () => window.removeEventListener("codeverse:evidence", handleEvidenceEvent);
  }, [recordEvent]);
  useEffect(() => {
    const handleFocus = (event: Event) => {
      const detail = (event as CustomEvent<{ fileName: string; lineNumber: number; column: number }>).detail;
      if (detail?.fileName && Number.isFinite(detail.lineNumber)) {
        setFocusedLocation(detail);
      }
    };
    window.addEventListener("codeverse:evidence-focus", handleFocus);
    return () => window.removeEventListener("codeverse:evidence-focus", handleFocus);
  }, []);


  useEffect(() => {
    if (!projectId || loading) return;
    try {
      window.localStorage.setItem("codeverse:evidence:" + projectId, JSON.stringify(snapshot));
    } catch {
      // The in-memory ledger remains usable when browser storage is unavailable.
    }
  }, [loading, projectId, snapshot]);

  useEffect(() => {
    if (!ready || !Object.keys(files).length) return;
    const timeout = window.setTimeout(() => {
      const localTwin = createLocalTwin(files, activeFile);
      setTwin(localTwin);
      if (isDemo || offline) return;
      void postDigitalTwin(projectId, { files: compactFiles(files), activeFile })
        .then(setTwin)
        .catch(() => setOffline(true));
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [activeFile, files, isDemo, offline, projectId, ready]);

  const runReview = useCallback(async (requirement: string, rollback: string) => {
    setSyncing(true);
    const local = createLocalReview(projectId, files, requirement, rollback);
    commit({ ...snapshotRef.current, reviews: [...snapshotRef.current.reviews, local] });
    try {
      if (!isDemo && !offline) {
        const review = await postReviewBoard(projectId, {
          files: compactFiles(files),
          requirement,
          rollback,
          sessionId: activeSessionId.current,
        });
        commit({
          ...snapshotRef.current,
          reviews: [...snapshotRef.current.reviews.filter((item) => item.id !== local.id), review],
        });
        commit(await fetchEvidenceSnapshot(projectId));
      } else {
        await recordEvent({
          type: "review.completed",
          summary: "Adversarial review completed with verdict " + local.verdict + ".",
          source: "review-board",
          actor: { name: "AI review board", kind: "ai" },
          payload: { reviewId: local.id, verdict: local.verdict, score: local.score },
        });
      }
      setNotice("Review board completed: " + local.verdict.replace("-", " ") + ".");
    } catch {
      setOffline(true);
      setNotice("Review completed locally; backend sync is unavailable.");
    } finally {
      setSyncing(false);
    }
  }, [commit, files, isDemo, offline, projectId, recordEvent]);

  const createPackage = useCallback(async (input: {
    title: string;
    requirement: string;
    rationale: string;
    rollback: string;
  }) => {
    setSyncing(true);
    const actor = { name: currentUser || "Guest", kind: "human" as const };
    const local = createLocalPackage(projectId, files, actor, input, snapshotRef.current);
    commit({ ...snapshotRef.current, packages: [...snapshotRef.current.packages, local] });
    try {
      if (!isDemo && !offline) {
        const evidencePackage = await postEvidencePackage(projectId, {
          ...input,
          files: compactFiles(files),
        });
        commit({
          ...snapshotRef.current,
          packages: [...snapshotRef.current.packages.filter((item) => item.id !== local.id), evidencePackage],
        });
      }
      setNotice("Proof package created with " + local.score + "% evidence coverage.");
    } catch {
      setOffline(true);
      setNotice("Proof package saved locally; backend sync is unavailable.");
    } finally {
      setSyncing(false);
    }
  }, [commit, currentUser, files, isDemo, offline, projectId]);

  const generateChallenge = useCallback(async () => {
    const code = files[activeFile] || "";
    const local = createLocalChallenge(projectId, activeFile, code);
    setChallenge(local);
    if (isDemo || offline) return local;
    try {
      const result = await postUnderstandingChallenge(projectId, { fileName: activeFile, code });
      setChallenge(result);
      return result;
    } catch {
      setOffline(true);
      return local;
    }
  }, [activeFile, files, isDemo, offline, projectId]);

  const submitUnderstanding = useCallback(async (answers: Record<string, string>) => {
    if (!challenge) return null;
    setSyncing(true);
    const local = verifyLocalUnderstanding(challenge, answers);
    try {
      const verification = !isDemo && !offline
        ? await postUnderstandingVerification(projectId, {
            challengeId: challenge.id,
            fileName: activeFile,
            code: files[activeFile] || "",
            answers,
            sessionId: activeSessionId.current,
            actor: { name: currentUser || "Guest", kind: "human" },
          })
        : local;
      commit({ ...snapshotRef.current, verifications: [...snapshotRef.current.verifications, verification] });
      if (!isDemo && !offline) commit(await fetchEvidenceSnapshot(projectId));
      if (isDemo || offline) {
        await recordEvent({
          type: "understanding.verified",
          summary: "Understanding verification scored " + verification.score + "%.",
          source: "understanding-verifier",
          fileName: activeFile,
          payload: { verificationId: verification.id, score: verification.score, passed: verification.passed },
        });
      }
      setNotice(verification.passed ? "Understanding verified." : "Understanding needs a stronger explanation.");
      return verification;
    } catch {
      commit({ ...snapshotRef.current, verifications: [...snapshotRef.current.verifications, local] });
      setOffline(true);
      setNotice("Understanding score saved locally.");
      return local;
    } finally {
      setSyncing(false);
    }
  }, [activeFile, challenge, commit, currentUser, files, isDemo, offline, projectId, recordEvent]);

  const branchFromEvent = useCallback(async (event: EngineeringEvent) => {
    const eventFiles = event.payload.files;
    if (!eventFiles || typeof eventFiles !== "object" || Array.isArray(eventFiles)) {
      setNotice("This event has no replayable file snapshot.");
      return false;
    }
    const restored = Object.fromEntries(
      Object.entries(eventFiles).filter((entry): entry is [string, string] => typeof entry[1] === "string")
    );
    if (!Object.keys(restored).length) {
      setNotice("This event has no replayable file snapshot.");
      return false;
    }
    setFiles(restored);
    const restoredActiveFile = typeof event.payload.activeFile === "string" && Object.hasOwn(restored, event.payload.activeFile)
      ? event.payload.activeFile
      : Object.keys(restored)[0];
    if (restoredActiveFile) setActiveFile(restoredActiveFile);
    await recordEvent({
      type: "branch.created",
      summary: "Branched workspace from evidence event #" + event.sequence + ".",
      source: "replay",
      causedBy: event.id,
      payload: { files: restored, activeFile: restoredActiveFile, sourceEventId: event.id },
    });
    setNotice("Workspace branched from " + new Date(event.occurredAt).toLocaleTimeString() + ".");
    return true;
  }, [recordEvent, setActiveFile, setFiles]);

  const evidenceCoverage = useMemo(() => {
    const latest = snapshot.packages.at(-1);
    if (latest) return latest.score;
    const values = Object.values(snapshot.scorecard).filter((value): value is number => typeof value === "number");
    const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    return Math.max(0, Math.min(100, Math.round(average)));
  }, [snapshot]);

  return {
    snapshot,
    twin,
    focusedLocation,
    challenge,
    loading,
    syncing,
    offline,
    notice,
    evidenceCoverage,
    sessionId: activeSessionId.current,
    recordEvent,
    runReview,
    createPackage,
    generateChallenge,
    submitUnderstanding,
    branchFromEvent,
  };
}

