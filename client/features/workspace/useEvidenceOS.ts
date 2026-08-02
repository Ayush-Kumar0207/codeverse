"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  ArenaLeaderboardEntry,
  ArenaScenario,
  ArenaScenarioTemplateInput,
  ArenaSession,
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
  localDigest,
  localWorkspaceDigest,
  rebaseLocalEvidenceTail,
  verifyLocalUnderstanding,
  type EvidenceEventInput,
} from "@/lib/evidence-local";
import {
  createLocalArenaTemplate,
  buildLocalArenaPreview,
  localArenaScenarios,
  localLeaderboard,
  startLocalArena,
} from "@/lib/arena-local";
import {
  beginArenaLobby,
  executeReplayVerification,
  fetchArenaLeaderboard,
  fetchArenaScenarios,
  fetchEvidenceExport,
  fetchEvidenceSnapshot,
  joinArenaLobbyByCode,
  matchmakeArenaSession,
  postArenaAction,
  postArenaScenarioTemplate,
  postDigitalTwin,
  postEvidenceEvent,
  postEvidencePackage,
  postReviewBoard,
  postUnderstandingChallenge,
  postUnderstandingVerification,
  startArenaSession,
  submitArenaSession,
  verifyArenaSignedReport,
  verifyEvidencePackage,
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

function captureWorkspace(files: Record<string, string>) {
  const capturedFiles = compactFiles(files);
  const sourceDigest = localWorkspaceDigest(files);
  const capturedDigest = localWorkspaceDigest(capturedFiles);
  return { capturedFiles, sourceDigest, complete: sourceDigest === capturedDigest };
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
  const [arenaScenarios, setArenaScenarios] = useState<ArenaScenario[]>(localArenaScenarios);
  const [arenaLeaderboard, setArenaLeaderboard] = useState<ArenaLeaderboardEntry[]>([]);
  const [activeArena, setActiveArena] = useState<ArenaSession | null>(null);
  const challengeStartedAt = useRef(0);
  const externalFocusChangesRef = useRef(0);
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
    const localIndex = current.events.findIndex((candidate) => candidate.id === localId);
    if (localIndex < 0) return;
    const events = current.events.filter((candidate) => candidate.id !== event.id || candidate.id === localId);
    const replacementIndex = events.findIndex((candidate) => candidate.id === localId);
    if (replacementIndex < 0) return;
    events[replacementIndex] = event;
    commit({ ...current, events: rebaseLocalEvidenceTail(events, replacementIndex + 1) });
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
    const capture = captureWorkspace(files);
    const lockfile = Object.entries(files).find(([name]) => /(?:^|\/)(?:package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?)$/i.test(name.replace(/\\/g, "/")));
    let dependencyVersions: Record<string, string> = {};
    try {
      const packageFile = Object.entries(files).find(([name]) => /(?:^|\/)package\.json$/i.test(name.replace(/\\/g, "/")));
      if (packageFile) {
        const manifest = JSON.parse(packageFile[1]) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
        dependencyVersions = { ...manifest.dependencies, ...manifest.devDependencies };
      }
    } catch {
      dependencyVersions = {};
    }
    void (async () => {
      await recordEvent({
        type: "session.started",
        summary: "Engineering session started with evidence capture enabled.",
        source: "session",
        payload: { activeFile, files: Object.keys(files), sourceDigest: capture.sourceDigest, snapshotComplete: capture.complete },
      });
      await recordEvent({
        type: "session.environment",
        summary: capture.complete ? "Captured reproducible runtime, dependency, and source manifest." : "Captured a partial replay snapshot; exact source digest is retained.",
        source: "session-recorder",
        payload: {
          files: capture.capturedFiles,
          activeFile,
          manifest: {
            runtime: typeof navigator !== "undefined" ? navigator.userAgent : "browser-runtime-unavailable",
            platform: typeof navigator !== "undefined" ? navigator.platform || "web" : "web",
            architecture: "browser-sandbox",
            lockfileHash: lockfile ? localDigest({ name: lockfile[0], content: lockfile[1] }) : undefined,
            sourceDigest: capture.sourceDigest,
            snapshotComplete: capture.complete,
            dependencyVersions,
            environmentKeys: ["NEXT_PUBLIC_API_BASE_URL"],
            environment: { NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "" },
          },
        },
      });
    })();
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
      const capture = captureWorkspace(files);
      void recordEvent({
        type: "code.changed",
        summary: "Updated " + activeFile + (capture.complete ? " with a replayable workspace snapshot." : " with a partial replay snapshot."),
        source: "editor",
        fileName: activeFile,
        payload: {
          files: capture.capturedFiles,
          activeFile,
          bytes: Object.values(capture.capturedFiles).reduce((sum, content) => sum + content.length, 0),
          sourceDigest: capture.sourceDigest,
          snapshotComplete: capture.complete,
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
    let timeout: number | undefined;
    const handleFocus = (event: Event) => {
      const detail = (event as CustomEvent<{ fileName: string; lineNumber: number; column: number }>).detail;
      if (!detail?.fileName || !Number.isFinite(detail.lineNumber)) return;
      setFocusedLocation(detail);
      if (timeout) window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        void recordEvent({
          type: "cursor.moved",
          summary: "Cursor moved to " + detail.fileName + ":" + detail.lineNumber + ":" + detail.column + ".",
          source: "editor",
          fileName: detail.fileName,
          payload: detail,
        });
      }, 450);
    };
    window.addEventListener("codeverse:evidence-focus", handleFocus);
    return () => {
      if (timeout) window.clearTimeout(timeout);
      window.removeEventListener("codeverse:evidence-focus", handleFocus);
    };
  }, [recordEvent]);


  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && challengeStartedAt.current > 0) externalFocusChangesRef.current += 1;
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
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
    const running = snapshot.arenas.find((session) => session.status === "running" || session.status === "lobby") || null;
    setActiveArena(running);
    if (isDemo || offline) {
      setArenaScenarios(localArenaScenarios);
      setArenaLeaderboard(localLeaderboard(snapshot.arenas));
      return;
    }
    void Promise.all([fetchArenaScenarios(), fetchArenaLeaderboard()])
      .then(([scenarios, leaderboard]) => {
        setArenaScenarios(scenarios);
        setArenaLeaderboard(leaderboard);
      })
      .catch(() => {
        setArenaScenarios(localArenaScenarios);
        setArenaLeaderboard(localLeaderboard(snapshot.arenas));
      });
  }, [isDemo, offline, snapshot.arenas]);

  useEffect(() => {
    if (!ready || !Object.keys(files).length) return;
    const timeout = window.setTimeout(() => {
      const localTwin = createLocalTwin(files, activeFile, snapshotRef.current.events);
      setTwin(localTwin);
      const capture = captureWorkspace(files);
      if (isDemo || offline || !capture.complete) return;
      void postDigitalTwin(projectId, { files: capture.capturedFiles, activeFile, events: snapshotRef.current.events.slice(-200) })
        .then(setTwin)
        .catch(() => setOffline(true));
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [activeFile, files, isDemo, offline, projectId, ready]);

  const runReview = useCallback(async (requirement: string, rollback: string) => {
    setSyncing(true);
    const local = createLocalReview(projectId, files, requirement, rollback);
    let completed = local;
    const capture = captureWorkspace(files);
    commit({ ...snapshotRef.current, reviews: [...snapshotRef.current.reviews, local] });
    try {
      if (!isDemo && !offline) {
        if (!capture.complete) {
          setNotice("Unverified review preview only; the exact workspace exceeds the server evidence limit.");
          return;
        }
        const review = await postReviewBoard(projectId, {
          files: capture.capturedFiles,
          requirement,
          rollback,
          sessionId: activeSessionId.current,
          rootCause: snapshotRef.current.packages.at(-1)?.rationale || requirement,

        });
        completed = review;
        commit({
          ...snapshotRef.current,
          reviews: [...snapshotRef.current.reviews.filter((item) => item.id !== local.id), review],
        });
        commit(await fetchEvidenceSnapshot(projectId));
      } else {
        setNotice("Unverified local review preview; isolated analysis requires the server.");
        return;
      }
      setNotice("Review board completed: " + completed.verdict.replace("-", " ") + ".");
    } catch {
      setOffline(true);
      setNotice("Unverified local review preview; backend analysis is unavailable.");
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
    const capture = captureWorkspace(files);
    if (!capture.complete) {
      setNotice("Proof package was not created: exact artifact capture exceeds the evidence upload limit. Narrow the workspace or split the change.");
      setSyncing(false);
      return;
    }
    const proofFiles = capture.capturedFiles;
    const subjectDigest = capture.sourceDigest;
    await recordEvent({
      type: "artifact.attested",
      summary: "Sealed exact workspace artifact " + subjectDigest.slice(0, 12) + ".",
      source: "proof-engine",
      payload: { files: proofFiles, activeFile, sourceDigest: subjectDigest, subjectDigest },
    });
    const local = createLocalPackage(projectId, proofFiles, actor, input, snapshotRef.current);
    commit({ ...snapshotRef.current, packages: [...snapshotRef.current.packages, local] });
    try {
      if (!isDemo && !offline) {
        const evidencePackage = await postEvidencePackage(projectId, {
          ...input,
          files: proofFiles,
          sessionId: activeSessionId.current,
          requireRollbackDrill: true,
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
  }, [activeFile, commit, currentUser, files, isDemo, offline, projectId, recordEvent]);

  const verifyPackage = useCallback(async (packageId: string) => {
    if (isDemo || offline) {
      const item = snapshotRef.current.packages.find((candidate) => candidate.id === packageId);
      if (!item) return false;
      setNotice("Local evidence is an unverified preview; authenticated verification requires the server signing service.");
      return false;
    }
    try {
      const verification = await verifyEvidencePackage(projectId, packageId);
      setNotice(verification.verified
        ? "Proof signature and all artifact attestations verified."
        : "Proof verification found invalid attestations: " + verification.invalidAttestations.join(", "));
      return verification.verified;
    } catch {
      setNotice("Proof verification is unavailable.");
      return false;
    }
  }, [isDemo, offline, projectId]);

  const generateChallenge = useCallback(async () => {
    const code = files[activeFile] || "";
    const capture = captureWorkspace(files);
    const challengeFiles = capture.complete ? capture.capturedFiles : { [activeFile]: code };
    const workspaceDigest = localWorkspaceDigest(challengeFiles);
    const local = createLocalChallenge(projectId, activeFile, code, workspaceDigest);
    challengeStartedAt.current = Date.now();
    externalFocusChangesRef.current = 0;
    setChallenge(local);
    if (isDemo || offline) return local;
    try {
      const result = await postUnderstandingChallenge(projectId, { fileName: activeFile, code, files: challengeFiles });
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
    const signals = {
      elapsedMs: Math.max(0, Date.now() - challengeStartedAt.current),
      revisionCount: Object.values(answers).filter((answer) => answer.includes("\n")).length,
      idleResumes: 0,
      pasteCount: snapshotRef.current.events.filter((event) => event.type === "clipboard.pasted" && Date.parse(event.occurredAt) >= challengeStartedAt.current).length,
      externalFocusChanges: externalFocusChangesRef.current,
    };
    const local = verifyLocalUnderstanding(challenge, answers, signals);
    try {
      const verification = !isDemo && !offline
        ? await postUnderstandingVerification(projectId, {
            challengeId: challenge.id,
            fileName: activeFile,
            code: files[activeFile] || "",
            answers,
            sessionId: activeSessionId.current,
            actor: { name: currentUser || "Guest", kind: "human" },
            workspaceDigest: challenge.codeDigest,
            files: captureWorkspace(files).complete ? captureWorkspace(files).capturedFiles : { [activeFile]: files[activeFile] || "" },
            expiresAt: challenge.expiresAt,
            signals,
          })
        : local;
      commit({ ...snapshotRef.current, verifications: [...snapshotRef.current.verifications, verification] });
      if (!isDemo && !offline) commit(await fetchEvidenceSnapshot(projectId));
      setNotice(isDemo || offline
        ? "Unverified understanding preview; executable compiler and runtime probes require the server."
        : verification.passed ? "Understanding verified." : "Understanding needs a stronger executable answer.");
      return verification;
    } catch {
      commit({ ...snapshotRef.current, verifications: [...snapshotRef.current.verifications, local] });
      setOffline(true);
      setNotice("Unverified understanding preview saved locally; executable server probes are unavailable.");
      return local;
    } finally {
      setSyncing(false);
    }
  }, [activeFile, challenge, commit, currentUser, files, isDemo, offline, projectId, recordEvent]);

  const verifyReplay = useCallback(async (sessionId: string) => {
    if (isDemo || offline) {
      setNotice("Server-executed replay requires the synced EvidenceOS sandbox.");
      return false;
    }
    setSyncing(true);
    try {
      const report = await executeReplayVerification(projectId, sessionId, {
        newSessionId: activeSessionId.current,
        actor: { name: currentUser || "Guest", kind: "human" },
      });
      commit(await fetchEvidenceSnapshot(projectId));
      setNotice(report.verified
        ? "Sealed workspace re-executed in " + report.actual.engine + " and matched every recorded digest."
        : "Server replay executed but diverged from the sealed result.");
      return report.verified;
    } catch {
      setNotice("Sealed replay execution is unavailable or its deterministic inputs are incomplete.");
      return false;
    } finally {
      setSyncing(false);
    }
  }, [commit, currentUser, isDemo, offline, projectId]);

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

  const createArenaTemplate = useCallback(async (input: ArenaScenarioTemplateInput) => {
    setSyncing(true);
    try {
      const created = !isDemo && !offline
        ? await postArenaScenarioTemplate(input)
        : createLocalArenaTemplate(input);
      setArenaScenarios((current) => [...current.filter((item) => item.id !== created.id), created]);
      setNotice("Evaluator scenario template created and ready for assignment.");
      return created;
    } catch {
      const created = createLocalArenaTemplate(input);
      setArenaScenarios((current) => [...current, created]);
      setOffline(true);
      setNotice("Scenario template saved locally; cloud sync is unavailable.");
      return created;
    } finally {
      setSyncing(false);
    }
  }, [isDemo, offline]);

  const startArena = useCallback(async (scenarioId: string, privacyMode: "full" | "redacted", teamLobby = false) => {
    setSyncing(true);
    const local = startLocalArena(projectId, scenarioId, currentUser || "Candidate", privacyMode, teamLobby, arenaScenarios);
    setFiles(local.files);
    const firstFile = Object.keys(local.files)[0];
    if (firstFile) setActiveFile(firstFile);
    commit({ ...snapshotRef.current, arenas: [...snapshotRef.current.arenas, local.session] });
    setActiveArena(local.session);
    try {
      if (!isDemo && !offline) {
        const serverSession = await startArenaSession(projectId, { scenarioId, consentRecorded: true, privacyMode, lobby: teamLobby });
        commit({
          ...snapshotRef.current,
          arenas: [...snapshotRef.current.arenas.filter((item) => item.id !== local.session.id), serverSession],
        });
        setActiveArena(serverSession);
        commit(await fetchEvidenceSnapshot(projectId));
      } else {
        await recordEvent({
          type: teamLobby ? "arena.action" : "arena.started",
          summary: teamLobby ? "Team arena lobby created." : "Arena scenario " + scenarioId + " started.",
          source: "engineering-arena",
          payload: { arenaSessionId: local.session.id, scenarioId, deadlineAt: local.session.deadlineAt },
        });
      }
      setNotice(teamLobby ? "Team arena lobby created; share the code, then begin the timer." : "Engineering arena started. Evidence capture and timer are active.");
      return true;
    } catch {
      setOffline(true);
      setNotice("Arena started locally; server sync is unavailable.");
      return true;
    } finally {
      setSyncing(false);
    }
  }, [arenaScenarios, commit, currentUser, isDemo, offline, projectId, recordEvent, setActiveFile, setFiles]);

  const joinArena = useCallback(async (lobbyCode: string) => {
    if (isDemo || offline) {
      setNotice("Joining a shared lobby requires the synced EvidenceOS service.");
      return false;
    }
    setSyncing(true);
    try {
      const session = await joinArenaLobbyByCode(projectId, lobbyCode, currentUser || "Team member");
      if (session.workspace && Object.keys(session.workspace).length) {
        setFiles(session.workspace);
        const firstFile = Object.keys(session.workspace)[0];
        if (firstFile) setActiveFile(firstFile);
      }
      commit({
        ...snapshotRef.current,
        arenas: [...snapshotRef.current.arenas.filter((item) => item.id !== session.id), session],
      });
      setActiveArena(session);
      setNotice("Joined team arena lobby " + (session.lobbyCode || "") + ".");
      return true;
    } catch {
      setNotice("No joinable arena lobby matched that code.");
      return false;
    } finally {
      setSyncing(false);
    }
  }, [commit, currentUser, isDemo, offline, projectId, setActiveFile, setFiles]);

  const matchmakeArena = useCallback(async (scenarioId: string, privacyMode: "full" | "redacted") => {
    if (isDemo || offline) return startArena(scenarioId, privacyMode, true);
    setSyncing(true);
    try {
      const result = await matchmakeArenaSession(projectId, { scenarioId, privacyMode, name: currentUser || "Candidate" });
      const session = result.session;
      if (session.workspace && Object.keys(session.workspace).length) {
        setFiles(session.workspace);
        const firstFile = Object.keys(session.workspace)[0];
        if (firstFile) setActiveFile(firstFile);
      }
      commit({ ...snapshotRef.current, arenas: [...snapshotRef.current.arenas.filter((item) => item.id !== session.id), session] });
      setActiveArena(session);
      setNotice(result.matched ? "Matched into an existing engineering team." : "No team was waiting, so a new lobby was created.");
      return true;
    } catch {
      setNotice("Arena matchmaking is temporarily unavailable.");
      return false;
    } finally {
      setSyncing(false);
    }
  }, [commit, currentUser, isDemo, offline, projectId, setActiveFile, setFiles, startArena]);

  const beginArena = useCallback(async () => {
    if (!activeArena || activeArena.status !== "lobby") return false;
    const scenario = arenaScenarios.find((item) => item.id === activeArena.scenarioId);
    const now = new Date();
    const local: ArenaSession = {
      ...activeArena,
      status: "running",
      startedAt: now.toISOString(),
      deadlineAt: new Date(now.getTime() + (scenario?.timeLimitMinutes || 45) * 60_000).toISOString(),
    };
    commit({
      ...snapshotRef.current,
      arenas: snapshotRef.current.arenas.map((item) => item.id === activeArena.id ? local : item),
    });
    setActiveArena(local);
    try {
      if (!isDemo && !offline) {
        const serverSession = await beginArenaLobby(projectId, activeArena.id);
        commit({
          ...snapshotRef.current,
          arenas: snapshotRef.current.arenas.map((item) => item.id === serverSession.id ? serverSession : item),
        });
        setActiveArena(serverSession);
      } else {
        await recordEvent({
          type: "arena.started",
          summary: "Team arena lobby started the timed incident.",
          source: "engineering-arena",
          payload: { arenaSessionId: local.id, participants: local.participants.length, deadlineAt: local.deadlineAt },
        });
      }
      setNotice("Team lobby started; timer and evidence grading are active.");
      return true;
    } catch {
      setOffline(true);
      return true;
    }
  }, [activeArena, arenaScenarios, commit, isDemo, offline, projectId, recordEvent]);

  const recordArenaNote = useCallback(async (summary: string) => {
    if (!activeArena || !summary.trim()) return;
    const action = {
      id: "local-action-" + Date.now(),
      type: "decision.recorded" as const,
      summary: summary.trim(),
      occurredAt: new Date().toISOString(),
    };
    const updated = { ...activeArena, actions: [...activeArena.actions, action] };
    commit({
      ...snapshotRef.current,
      arenas: snapshotRef.current.arenas.map((item) => item.id === activeArena.id ? updated : item),
    });
    setActiveArena(updated);
    await recordEvent({
      type: "decision.recorded",
      summary: action.summary,
      source: "engineering-arena",
      payload: { arenaSessionId: activeArena.id },
    });
    if (!isDemo && !offline) {
      try {
        const serverSession = await postArenaAction(projectId, activeArena.id, { type: action.type, summary: action.summary });
        commit({
          ...snapshotRef.current,
          arenas: snapshotRef.current.arenas.map((item) => item.id === serverSession.id ? serverSession : item),
        });
        setActiveArena(serverSession);
      } catch {
        setOffline(true);
      }
    }
  }, [activeArena, commit, isDemo, offline, projectId, recordEvent]);

  const submitArena = useCallback(async () => {
    if (!activeArena) return null;
    setSyncing(true);
    const local = buildLocalArenaPreview(activeArena, activeArena.privacyMode || "full");
    commit({
      ...snapshotRef.current,
      arenas: snapshotRef.current.arenas.map((item) => item.id === activeArena.id ? local.session : item),
    });
    setActiveArena(null);
    try {
      const graded = !isDemo && !offline
        ? await submitArenaSession(projectId, activeArena.id, { files })
        : local.session;
      commit({
        ...snapshotRef.current,
        arenas: snapshotRef.current.arenas.map((item) => item.id === activeArena.id || item.id === graded.id ? graded : item),
      });
      if (!isDemo && !offline) commit(await fetchEvidenceSnapshot(projectId));
      else {
        await recordEvent({
          type: "arena.completed",
          summary: "Arena scenario saved as an unverified local preview.",
          source: "engineering-arena",
          payload: { arenaSessionId: graded.id, reportDigest: graded.signedReport?.digest },
        });
      }
      setArenaLeaderboard(localLeaderboard(snapshotRef.current.arenas));
      setNotice(!isDemo && !offline ? "Arena submitted, acceptance-tested, and independently signed." : "Arena saved as an unverified local preview.");
      return graded;
    } catch {
      setOffline(true);
      setNotice("Arena saved locally as an unverified preview; authenticated grading requires the server sandbox.");
      return local.session;
    } finally {
      setSyncing(false);
    }
  }, [activeArena, commit, files, isDemo, offline, projectId, recordEvent]);

  const verifyArenaReport = useCallback(async (sessionId: string) => {
    if (isDemo || offline) {
      setNotice("Local Arena submissions are unverified previews; authenticated grading requires the server sandbox.");
      return false;
    }
    try {
      const verification = await verifyArenaSignedReport(projectId, sessionId);
      setNotice(verification.verified ? "Signed assessment report verified." : "Assessment report signature verification failed.");
      return verification.verified;
    } catch {
      setNotice("Assessment report verification is unavailable.");
      return false;
    }
  }, [isDemo, offline, projectId]);

  const exportEvidence = useCallback(async (privacy: "full" | "redacted" = "redacted") => {
    const fallback = {
      report: {
        ...snapshotRef.current,
        schema: "codeverse-evidence-export/v2",
        projectId,
        generatedAt: new Date().toISOString(),
        privacyMode: privacy,
        events: snapshotRef.current.events.map((event) => privacy === "redacted" && ["chat.message", "ai.prompted", "ai.responded"].includes(event.type)
          ? { ...event, payload: { redacted: true } }
          : event),
      },
      digest: localDigest(snapshotRef.current),
    };
    let exported: { report: unknown; digest: string } = fallback;
    if (!isDemo && !offline) {
      try {
        exported = await fetchEvidenceExport(projectId, privacy);
      } catch {
        setOffline(true);
      }
    }
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "codeverse-evidence-" + projectId + "-" + privacy + ".json";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Evidence export generated with " + privacy + " privacy.");
  }, [isDemo, offline, projectId]);

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
    arenaScenarios,
    arenaLeaderboard,
    activeArena,
    loading,
    syncing,
    offline,
    notice,
    evidenceCoverage,
    sessionId: activeSessionId.current,
    recordEvent,
    runReview,
    createPackage,
    verifyPackage,
    generateChallenge,
    submitUnderstanding,
    branchFromEvent,
    verifyReplay,
    createArenaTemplate,
    startArena,
    joinArena,
    matchmakeArena,
    beginArena,
    recordArenaNote,
    submitArena,
    verifyArenaReport,
    exportEvidence,
  };
}

