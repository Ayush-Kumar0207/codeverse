"use client";

import axios from "axios";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AT_ALGORITHMS } from "@/data/algos";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  ImperativePanelHandle,
} from "react-resizable-panels";
import { useAuth } from "@/context/AuthContext";
import CodeEditor, { CodeEditorHandle } from "@/components/CodeEditor";
import ChatBox from "@/components/ChatBox";
import VersionHistory from "@/components/VersionHistory";
import { useEditorState } from "@/hooks/useEditorState";
import { getLanguageFromFilename } from "@/hooks/useLanguageDetection";
import { useSocket } from "@/hooks/useSocket";
import { useCodeExecution } from "@/hooks/useCodeExecution";
import type { ExecutionOutputType } from "@/hooks/useCodeExecution";
import { useCodeSave } from "@/hooks/useCodeSave";
import { useHtmlPreview } from "@/hooks/useHtmlPreview";
import { fetchProjectById } from "@/services/projects";
import { executeCode } from "@/services/execution";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";
import type { SharedProject } from "@shared/types/project";
import DiffViewer from "@/components/DiffViewer";
import DeploymentModal from "@/components/DeploymentModal";
import { deployProject } from "@/services/deployment";
import dynamic from "next/dynamic";

const TerminalPanel = dynamic(() => import("@/components/TerminalPanel"), {
  ssr: false,
});

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PresenceHeader } from "@/components/ActivityBar";
import AlgoTraceCanvas from "@/components/algotrace/AlgoTraceCanvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import {
  FilePlus,
  Save,
  Play,
  Trash2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  FileCode,
  FileText,
  MessageSquare,
  Maximize2,
  Minimize2,
  Lock,
  Unlock,
  ShieldCheck,
  Eye,
  UserMinus,
} from "lucide-react";

interface PresenceUser {
  username: string;
  avatar?: string;
  status?: string;
  role?: "organizer" | "collaborator";
  canEdit?: boolean;
  userId?: string;
  socketId?: string;
}

interface CollaborationAccess {
  collaboratorsCanEdit: boolean;
  organizerUsername?: string;
  organizerUserId?: string;
}

interface WorkspaceSnapshot {
  id: string;
  createdAt: string;
  files: Record<string, string>;
  activeFile: string;
  label: string;
}

type FullscreenPanel = "editor" | "assistant" | "output" | null;

function normalizeIdentity(value?: string | null) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

const MAX_WORKSPACE_SNAPSHOTS = 80;

function formatExecutionError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { error?: unknown; message?: unknown } | undefined;
    const serverMessage =
      typeof data?.error === "string"
        ? data.error
        : typeof data?.message === "string"
          ? data.message
          : error.message;

    return status
      ? `Execution request failed (${status}).\n${serverMessage}`
      : `Execution request failed.\n${serverMessage}`;
  }

  return error instanceof Error ? error.message : "Error during execution.";
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050910] text-sm font-semibold text-slate-300">
          Loading workspace...
        </div>
      }
    >
      <EditorWorkspace />
    </Suspense>
  );
}

function EditorWorkspace() {
  const params = useParams();
  const searchParams = useSearchParams();
  const algoId = searchParams?.get("algo");
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const roomId = id || "room1";
  const editorRef = useRef<CodeEditorHandle>(null);
  const { user } = useAuth();
  const { socket } = useSocket(roomId);

  const [project, setProject] = useState<SharedProject | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [collaborationAccess, setCollaborationAccess] = useState<CollaborationAccess>({
    collaboratorsCanEdit: true,
  });
  const [permissionNotice, setPermissionNotice] = useState("");
  const [removedFromWorkspace, setRemovedFromWorkspace] = useState(false);
  const [workspaceSnapshots, setWorkspaceSnapshots] = useState<WorkspaceSnapshot[]>([]);
  const [currentSnapshotId, setCurrentSnapshotId] = useState<string | null>(null);
  const lastSnapshotSignatureRef = useRef("");
  const skipNextTimelineSnapshotRef = useRef(false);

  const {
    files,
    setFiles,
    activeFile,
    setActiveFile,
    newFileName,
    setNewFileName,
    showNewFileModal,
    setShowNewFileModal,
    showDeleteConfirm,
    setShowDeleteConfirm,
    initializeProjectFiles,
    createFile,
    deleteActiveFile,
    language,
    code,
  } = useEditorState();

  const isProjectOrganizer = useMemo(() => {
    if (!project) return false;
    if (project.isDemo) return true;

    const owner = normalizeIdentity(project.owner);
    if (!owner) return true;

    const userIdentities = [user?._id, user?.username, user?.email]
      .map((value) => normalizeIdentity(value))
      .filter(Boolean);

    return userIdentities.includes(owner);
  }, [project, user?._id, user?.email, user?.username]);

  const canEditWorkspace =
    !removedFromWorkspace && (isProjectOrganizer || collaborationAccess.collaboratorsCanEdit);

  const timelineStorageKey = useMemo(
    () => `codeverse:workspace-timeline:${roomId}`,
    [roomId]
  );

  // Code execution hook
  const { output, outputType, loading, setOutput, setOutputType, setLoading } = useCodeExecution(socket);

  // Code save hook
  const { handleSave } = useCodeSave(activeFile, code, () => {
    setRefreshCount((prev) => prev + 1);
  });

  // HTML preview hook
  const { combinedPreview } = useHtmlPreview(files, language);

  const assistantContext = useMemo(() => {
    const activeContent = files[activeFile] || "";
    const activeSnippet =
      activeContent.length > 1500 ? `${activeContent.slice(0, 1500)}\n...[active file truncated for fast AI]` : activeContent;
    const fileList = Object.keys(files).join(", ");

    return [
      `Project: ${project?.title || "CodeVerse workspace"}`,
      `Active file: ${activeFile}`,
      `Language: ${language}`,
      `Workspace files: ${fileList}`,
      "",
      "Active file content:",
      activeSnippet,
    ].join("\n");
  }, [activeFile, files, language, project?.title]);

  // Chronos Diff Engine State
  const [showDiffViewer, setShowDiffViewer] = useState(false);
  const [versionCode, setVersionCode] = useState("");
  const [versionDate, setVersionDate] = useState("");

  const handleCompare = (code: string, date: string) => {
    setVersionCode(code);
    setVersionDate(date);
    setShowDiffViewer(true);
  };

  const applyCodeToActiveFile = (nextCode: string) => {
    if (!canEditWorkspace) {
      setPermissionNotice("Editing is currently organizer-only.");
      return;
    }

    setFiles((prev) => ({ ...prev, [activeFile]: nextCode }));
    socket?.emit(SOCKET_EVENTS.CODE_CHANGE, { roomId, fileName: activeFile, code: nextCode });
  };

  const handleRevertFromDiff = () => {
    applyCodeToActiveFile(versionCode);
    setShowDiffViewer(false);
  };

  // Aegis Deployment State
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [deploymentError, setDeploymentError] = useState("");

  const handleBeginDeployment = async () => {
    setIsDeploying(true);
    setDeploymentUrl("");
    setDeploymentError("");

    try {
      const res = await deployProject({
        projectId: id as string,
        files
      });
      setDeploymentUrl(res.url);
    } catch (err: unknown) {
      console.warn("Deployment failed", err);
      setDeploymentError(err instanceof Error ? err.message : "Failed to initiate Aegis propagation.");
    }
  };

  const emitWorkspaceFilesChange = useCallback((nextFiles: Record<string, string>, nextActiveFile: string) => {
    socket?.emit(SOCKET_EVENTS.FILES_CHANGE, {
      roomId,
      files: nextFiles,
      activeFile: nextActiveFile,
    });
  }, [roomId, socket]);

  const handleCreateFile = () => {
    if (!canEditWorkspace) {
      setPermissionNotice("Editing is currently organizer-only.");
      return;
    }

    const created = createFile();
    if (created) {
      setPermissionNotice("");
      emitWorkspaceFilesChange(created.files, created.activeFile);
    }
  };

  const handleDeleteActiveFile = () => {
    if (!canEditWorkspace) {
      setPermissionNotice("Editing is currently organizer-only.");
      return;
    }

    const deleted = deleteActiveFile();
    if (deleted) {
      setPermissionNotice("");
      emitWorkspaceFilesChange(deleted.files, deleted.activeFile);
    }
  };

  const handleToggleTeamEditing = () => {
    if (!isProjectOrganizer) return;

    const collaboratorsCanEdit = !collaborationAccess.collaboratorsCanEdit;
    setCollaborationAccess((prev) => ({
      ...prev,
      collaboratorsCanEdit,
      organizerUsername: user?.username || prev.organizerUsername,
      organizerUserId: user?._id || prev.organizerUserId,
    }));
    setPermissionNotice("");

    socket?.emit(SOCKET_EVENTS.EDIT_PERMISSION_UPDATE, {
      roomId,
      collaboratorsCanEdit,
    });
  };

  const handleRemoveCollaborator = (collaborator: PresenceUser) => {
    if (!isProjectOrganizer || collaborator.username === user?.username) return;

    socket?.emit(SOCKET_EVENTS.REMOVE_COLLABORATOR, {
      roomId,
      username: collaborator.username,
      socketId: collaborator.socketId,
    });
  };

  const getWorkspaceSnapshotSignature = useCallback((nextFiles: Record<string, string>) => {
    return JSON.stringify(Object.entries(nextFiles).sort(([left], [right]) => left.localeCompare(right)));
  }, []);

  const createWorkspaceSnapshot = useCallback(
    (
      label = "Auto snapshot",
      snapshotFiles: Record<string, string> = files,
      snapshotActiveFile: string = activeFile
    ) => {
      if (!isProjectOrganizer || Object.keys(snapshotFiles).length === 0) return null;

      const signature = getWorkspaceSnapshotSignature(snapshotFiles);
      if (signature === lastSnapshotSignatureRef.current) return null;

      const snapshot: WorkspaceSnapshot = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        files: { ...snapshotFiles },
        activeFile: snapshotActiveFile,
        label,
      };

      lastSnapshotSignatureRef.current = signature;
      setWorkspaceSnapshots((prev) => {
        const next = [snapshot, ...prev].slice(0, MAX_WORKSPACE_SNAPSHOTS);
        return next.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
      });
      setCurrentSnapshotId(snapshot.id);
      return snapshot;
    },
    [activeFile, files, getWorkspaceSnapshotSignature, isProjectOrganizer]
  );

  const restoreWorkspaceSnapshot = useCallback(
    (snapshot: WorkspaceSnapshot) => {
      if (!isProjectOrganizer) {
        setPermissionNotice("Timeline controls are available only to the organizer.");
        return;
      }

      createWorkspaceSnapshot("Before timeline restore", files, activeFile);
      skipNextTimelineSnapshotRef.current = true;
      lastSnapshotSignatureRef.current = getWorkspaceSnapshotSignature(snapshot.files);
      setFiles(snapshot.files);
      const nextActiveFile = Object.prototype.hasOwnProperty.call(snapshot.files, snapshot.activeFile)
        ? snapshot.activeFile
        : Object.keys(snapshot.files)[0] || "";
      if (nextActiveFile) setActiveFile(nextActiveFile);
      setCurrentSnapshotId(snapshot.id);
      setPermissionNotice(`Restored workspace to ${new Date(snapshot.createdAt).toLocaleString()}.`);
      emitWorkspaceFilesChange(snapshot.files, nextActiveFile);
    },
    [
      activeFile,
      createWorkspaceSnapshot,
      emitWorkspaceFilesChange,
      files,
      getWorkspaceSnapshotSignature,
      isProjectOrganizer,
      setActiveFile,
      setFiles,
    ]
  );

  const currentTimelineIndex = useMemo(() => {
    if (workspaceSnapshots.length === 0) return -1;
    if (!currentSnapshotId) return 0;
    const index = workspaceSnapshots.findIndex((snapshot) => snapshot.id === currentSnapshotId);
    return index >= 0 ? index : 0;
  }, [currentSnapshotId, workspaceSnapshots]);

  const restoreWorkspaceSnapshotByTime = useCallback(
    (isoTimestamp: string) => {
      const targetTime = Date.parse(isoTimestamp);
      if (!Number.isFinite(targetTime) || workspaceSnapshots.length === 0) return;

      const sorted = [...workspaceSnapshots].sort(
        (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)
      );
      const snapshot =
        sorted.find((candidate) => Date.parse(candidate.createdAt) <= targetTime) ||
        sorted[sorted.length - 1];

      if (snapshot) restoreWorkspaceSnapshot(snapshot);
    },
    [restoreWorkspaceSnapshot, workspaceSnapshots]
  );

  const stepWorkspaceTimeline = useCallback(
    (direction: "back" | "forward") => {
      const nextIndex = direction === "back" ? currentTimelineIndex + 1 : currentTimelineIndex - 1;
      const snapshot = workspaceSnapshots[nextIndex];
      if (snapshot) restoreWorkspaceSnapshot(snapshot);
    },
    [currentTimelineIndex, restoreWorkspaceSnapshot, workspaceSnapshots]
  );

  const returnToLatestWorkspaceSnapshot = useCallback(() => {
    const latest = workspaceSnapshots[0];
    if (latest) restoreWorkspaceSnapshot(latest);
  }, [restoreWorkspaceSnapshot, workspaceSnapshots]);

  // Load project
  useEffect(() => {
    if (!id) return;
    setRemovedFromWorkspace(false);

    if (id === "demo-sandbox") {
      // Dynamic Encyclopedia Payload Extraction
      let resolvedAlgo = null;
      if (algoId) {
         resolvedAlgo = AT_ALGORITHMS.find(a => a.id === algoId);
      }

      if (resolvedAlgo) {
         // Seed the editor with all Algorithm representations
         const demoProject: SharedProject = {
            _id: `algo-${resolvedAlgo.id}`,
            title: resolvedAlgo.title,
            language: "javascript",
            isDemo: true,
            code: ""
         };
         setProject(demoProject);
         
         const firstApproach = resolvedAlgo.approaches[0];
         const algoFiles: Record<string, string> = {};
         
         // Top priority: the generated trace script, so "Open Visualizer" starts in simulation mode.
         let firstFileName = "";
         const traceFileName = resolvedAlgo.visualizerCode ? "tracer.js" : "";
         if (resolvedAlgo.visualizerCode) {
             algoFiles[traceFileName] = resolvedAlgo.visualizerCode;
             firstFileName = traceFileName;
         }
         
         if (firstApproach && firstApproach.implementations) {
            const preferredLang = typeof window !== 'undefined' ? localStorage.getItem("algo-trace-preferred-lang") : null;
            
            firstApproach.implementations.forEach(impl => {
                const ext = impl.language === "Python" ? "py" :
                            impl.language === "C++" ? "cpp" :
                            impl.language === "Java" ? "java" : "js";
                const filename = `solution.${ext}`;
                algoFiles[filename] = impl.code;
                
                // Prioritize the user's preferred language for the active file
                if (!traceFileName && (!firstFileName || (preferredLang && impl.language.toLowerCase() === preferredLang.toLowerCase()))) {
                    firstFileName = filename;
                }
            });
         }
         
         const useCasesMarkdown = resolvedAlgo.useCases.length
            ? resolvedAlgo.useCases.map((useCase) => `- ${useCase}`).join("\n")
            : "- Practice the core idea with the included sample runner.";

         algoFiles["PROBLEM.md"] = [
            `# ${resolvedAlgo.title}`,
            "",
            resolvedAlgo.overview,
            "",
            "## Use Cases",
            useCasesMarkdown,
         ].join("\n");
         
         setFiles(algoFiles);
         setActiveFile(firstFileName || "PROBLEM.md");
         return;
      }

      // Standard web workspace
      const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ScoreLens</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <main class="app-shell">
      <section class="hero">
        <p class="eyebrow">ScoreLens</p>
        <h1>Fast score summary</h1>
        <p>Paste any set of numbers and get a clean total, average, highest value, and count.</p>
      </section>

      <section class="workspace" aria-label="Score calculator">
        <form id="score-form" class="input-panel">
          <label for="scores">Scores</label>
          <textarea id="scores" rows="6">72, 88, 91, 64</textarea>
          <button type="submit">Calculate</button>
        </form>

        <section class="result-grid" aria-live="polite">
          <article>
            <span>Total</span>
            <strong id="total">-</strong>
          </article>
          <article>
            <span>Average</span>
            <strong id="average">-</strong>
          </article>
          <article>
            <span>Best</span>
            <strong id="best">-</strong>
          </article>
          <article>
            <span>Count</span>
            <strong id="count">-</strong>
          </article>
        </section>
      </section>
    </main>

    <script src="./script.js"></script>
  </body>
</html>`;
      const styleCss = `:root {
  color-scheme: dark;
  --bg: #071018;
  --surface: #0d1a24;
  --surface-strong: #102636;
  --line: rgba(189, 213, 234, 0.18);
  --text: #f5f8fb;
  --muted: #9fb3c7;
  --accent: #53d7b7;
  --accent-strong: #20a4f3;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at 18% 12%, rgba(83, 215, 183, 0.18), transparent 28rem),
    linear-gradient(135deg, #071018, #0a121c 55%, #061012);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.app-shell {
  width: min(1120px, calc(100vw - 40px));
  margin: 0 auto;
  padding: 64px 0;
}

.hero {
  max-width: 720px;
  margin-bottom: 36px;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(42px, 7vw, 84px);
  line-height: 0.96;
}

.hero p:last-child {
  color: var(--muted);
  font-size: clamp(18px, 2vw, 22px);
  line-height: 1.6;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(320px, 1.1fr);
  gap: 24px;
}

.input-panel,
.result-grid article {
  border: 1px solid var(--line);
  background: rgba(13, 26, 36, 0.82);
  border-radius: 18px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.32);
}

.input-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

label {
  color: var(--muted);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

textarea {
  min-height: 180px;
  resize: vertical;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #071018;
  color: var(--text);
  font: 18px/1.6 "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  padding: 16px;
  outline: none;
}

textarea:focus {
  border-color: rgba(83, 215, 183, 0.72);
  box-shadow: 0 0 0 3px rgba(83, 215, 183, 0.12);
}

button {
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  color: #041018;
  cursor: pointer;
  font-size: 16px;
  font-weight: 900;
  padding: 14px 18px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.result-grid article {
  min-height: 170px;
  padding: 24px;
}

.result-grid span {
  color: var(--muted);
  display: block;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.result-grid strong {
  display: block;
  font-size: clamp(36px, 6vw, 66px);
  line-height: 1;
  margin-top: 26px;
}

@media (max-width: 820px) {
  .workspace,
  .result-grid {
    grid-template-columns: 1fr;
  }
}`;
      const scriptJs = `const form = document.querySelector("#score-form");
const scoresInput = document.querySelector("#scores");

const fields = {
  total: document.querySelector("#total"),
  average: document.querySelector("#average"),
  best: document.querySelector("#best"),
  count: document.querySelector("#count"),
};

function parseScores(value) {
  return (value.match(/-?\\d+(?:\\.\\d+)?/g) || [])
    .map(Number)
    .filter(Number.isFinite);
}

function summarizeScores(scores) {
  if (scores.length === 0) {
    return { total: "-", average: "-", best: "-", count: "-" };
  }

  const total = scores.reduce((sum, score) => sum + score, 0);
  return {
    total,
    average: Number((total / scores.length).toFixed(2)),
    best: Math.max(...scores),
    count: scores.length,
  };
}

function renderSummary(summary) {
  fields.total.textContent = summary.total;
  fields.average.textContent = summary.average;
  fields.best.textContent = summary.best;
  fields.count.textContent = summary.count;
}

function updateSummary() {
  renderSummary(summarizeScores(parseScores(scoresInput.value)));
}

scoresInput.addEventListener("input", updateSummary);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateSummary();
});

updateSummary();`;
      
      const demoProject: SharedProject = {
        _id: "demo-sandbox",
        title: "ScoreLens",
        language: "html",
        isDemo: true,
        code: indexHtml,
      };
      setProject(demoProject);
      setFiles({
        "index.html": indexHtml,
        "style.css": styleCss,
        "script.js": scriptJs,
        "README.md": "# ScoreLens\n\nA working single-page web app that calculates totals, averages, best scores, and item counts from any numeric list.\n\n## Files\n- index.html: Page structure\n- style.css: Visual design\n- script.js: Score parsing and calculation logic",
      });
      setActiveFile("index.html");
      return;
    }

    fetchProjectById(id)
      .then((res) => {
        setProject(res.project);
        initializeProjectFiles(res.project);
      })
      .catch((err) => {
        console.warn("Failed to load project", err);
      });
  }, [id, algoId, initializeProjectFiles, setActiveFile, setFiles]);

  useEffect(() => {
    if (!isProjectOrganizer || typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(timelineStorageKey);
      if (!raw) {
        setWorkspaceSnapshots([]);
        setCurrentSnapshotId(null);
        lastSnapshotSignatureRef.current = "";
        return;
      }

      const parsed = JSON.parse(raw) as WorkspaceSnapshot[];
      const validSnapshots = Array.isArray(parsed)
        ? parsed.filter((snapshot) => snapshot?.id && snapshot?.createdAt && snapshot?.files)
        : [];
      setWorkspaceSnapshots(validSnapshots);
      setCurrentSnapshotId(validSnapshots[0]?.id || null);
      lastSnapshotSignatureRef.current = validSnapshots[0]
        ? getWorkspaceSnapshotSignature(validSnapshots[0].files)
        : "";
    } catch (error) {
      console.warn("Failed to load workspace timeline", error);
      setWorkspaceSnapshots([]);
      setCurrentSnapshotId(null);
    }
  }, [getWorkspaceSnapshotSignature, isProjectOrganizer, timelineStorageKey]);

  useEffect(() => {
    if (!isProjectOrganizer || typeof window === "undefined") return;

    try {
      window.localStorage.setItem(timelineStorageKey, JSON.stringify(workspaceSnapshots));
    } catch (error) {
      console.warn("Failed to persist workspace timeline", error);
    }
  }, [isProjectOrganizer, timelineStorageKey, workspaceSnapshots]);

  useEffect(() => {
    if (!project || !isProjectOrganizer || Object.keys(files).length === 0) return;

    if (skipNextTimelineSnapshotRef.current) {
      skipNextTimelineSnapshotRef.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      createWorkspaceSnapshot("Auto snapshot");
    }, 1600);

    return () => window.clearTimeout(timeout);
  }, [activeFile, createWorkspaceSnapshot, files, isProjectOrganizer, project]);

  // Presence Logic
  useEffect(() => {
    if (!socket || !user || !project || removedFromWorkspace) return;

    socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId,
      user: {
        username: user.username,
        avatar: user.avatar,
        userId: user._id,
        isOrganizer: isProjectOrganizer,
        organizerKnown: Boolean(project.owner && !project.isDemo),
        status: "Editing",
      },
    });

    // Set initial user
    setActiveUsers((prev) => {
      const ownPresence = {
        username: user.username,
        avatar: user.avatar,
        userId: user._id,
        status: "Editing",
        role: isProjectOrganizer ? "organizer" : "collaborator",
        canEdit: canEditWorkspace,
      } satisfies PresenceUser;

      return [ownPresence, ...prev.filter((activeUser) => activeUser.username !== user.username)];
    });

    const handleUserJoined = (data: PresenceUser | PresenceUser[]) => {
      setActiveUsers(prev => {
        const joinedUsers = Array.isArray(data) ? data : [data];
        const merged = [...prev];
        joinedUsers.forEach((joinedUser) => {
          if (!joinedUser?.username) return;
          const existingIndex = merged.findIndex((u) => u.username === joinedUser.username);
          if (existingIndex >= 0) {
            merged[existingIndex] = { ...merged[existingIndex], ...joinedUser };
          } else {
            merged.push({ username: joinedUser.username, avatar: joinedUser.avatar, status: joinedUser.status || "Joined" });
          }
        });
        return merged;
      });
    };

    const handleUserLeft = (data: PresenceUser) => {
      setActiveUsers(prev => prev.filter(u => u.username !== data.username));
    };

    const handlePresenceUpdate = (data: PresenceUser) => {
      setActiveUsers(prev => prev.map(u => 
        u.username === data.username ? { ...u, status: data.status } : u
      ));
    };

    const handleCollaboratorRemoved = (payload: { roomId?: string; username?: string; reason?: string }) => {
      if (payload.roomId && payload.roomId !== roomId) return;
      if (payload.username && payload.username !== user.username) return;

      setRemovedFromWorkspace(true);
      setPermissionNotice(payload.reason || "You were removed from this workspace by the organizer.");
      setActiveUsers((prev) => prev.filter((activeUser) => activeUser.username !== user.username));
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
  }, [canEditWorkspace, isProjectOrganizer, project, removedFromWorkspace, roomId, socket, user]);

  useEffect(() => {
    if (!socket) return;

    const updateConnectionState = () => {
      setSocketConnected(Boolean((socket as { connected?: boolean }).connected));
    };

    const handlePong = (payload: { sentAt?: number }) => {
      if (typeof payload?.sentAt === "number") {
        setLatencyMs(Math.max(1, Date.now() - payload.sentAt));
      }
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
        setFiles((prev) => ({ ...prev, [activeFile]: payload }));
        return;
      }

      if (payload?.files) {
        const syncedFiles = Object.fromEntries(
          Object.entries(payload.files).filter(([fileName]) => fileName !== "__active__")
        );
        if (Object.keys(syncedFiles).length > 0) {
          setFiles((prev) => ({ ...prev, ...syncedFiles }));
        }
      }
    };

    socket.on(SOCKET_EVENTS.SYNC_CODE, handleSyncCode);
    return () => {
      socket.off(SOCKET_EVENTS.SYNC_CODE, handleSyncCode);
    };
  }, [activeFile, setFiles, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleRemoteCodeChange = (payload: string | { fileName?: string; code?: string }) => {
      const nextCode = typeof payload === "string" ? payload : payload?.code;
      const nextFileName = typeof payload === "string" ? activeFile : payload?.fileName;

      if (typeof nextCode !== "string" || !nextFileName || nextFileName === activeFile) return;

      setFiles((prev) =>
        prev[nextFileName] === nextCode ? prev : { ...prev, [nextFileName]: nextCode }
      );
    };

    const handleFilesChange = (payload: { roomId?: string; files?: Record<string, string>; activeFile?: string }) => {
      if (payload.roomId && payload.roomId !== roomId) return;
      if (!payload.files || typeof payload.files !== "object") return;

      setFiles(payload.files);
      const nextActiveFile = Object.prototype.hasOwnProperty.call(payload.files, activeFile)
        ? activeFile
        : Object.keys(payload.files)[0] || "";

      if (nextActiveFile) {
        setActiveFile(nextActiveFile);
      }
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

    const handlePermissionState = (payload: CollaborationAccess & { roomId?: string }) => {
      if (payload.roomId && payload.roomId !== roomId) return;
      const collaboratorsCanEdit = payload.collaboratorsCanEdit !== false;

      setCollaborationAccess({
        collaboratorsCanEdit,
        organizerUsername: payload.organizerUsername,
        organizerUserId: payload.organizerUserId,
      });
      setActiveUsers((prev) =>
        prev.map((activeUser) => {
          const isOrganizer =
            activeUser.role === "organizer" ||
            (!!payload.organizerUsername && activeUser.username === payload.organizerUsername) ||
            (!!payload.organizerUserId && activeUser.userId === payload.organizerUserId);

          return {
            ...activeUser,
            role: isOrganizer ? "organizer" : activeUser.role,
            canEdit: isOrganizer || collaboratorsCanEdit,
          };
        })
      );
      setPermissionNotice("");
    };

    const handlePermissionDenied = (payload: {
      roomId?: string;
      reason?: string;
      state?: CollaborationAccess;
      files?: Record<string, string> | null;
    }) => {
      if (payload.roomId && payload.roomId !== roomId) return;

      if (payload.state) {
        const collaboratorsCanEdit = payload.state.collaboratorsCanEdit !== false;

        setCollaborationAccess({
          collaboratorsCanEdit,
          organizerUsername: payload.state.organizerUsername,
          organizerUserId: payload.state.organizerUserId,
        });
        setActiveUsers((prev) =>
          prev.map((activeUser) => {
            const isOrganizer =
              activeUser.role === "organizer" ||
              (!!payload.state?.organizerUsername && activeUser.username === payload.state.organizerUsername) ||
              (!!payload.state?.organizerUserId && activeUser.userId === payload.state.organizerUserId);

            return {
              ...activeUser,
              role: isOrganizer ? "organizer" : activeUser.role,
              canEdit: isOrganizer || collaboratorsCanEdit,
            };
          })
        );
      }

      if (payload.files) {
        setFiles((prev) => ({ ...prev, ...payload.files }));
      }

      setPermissionNotice(payload.reason || "Editing is currently organizer-only.");
    };

    socket.on(SOCKET_EVENTS.EDIT_PERMISSION_STATE, handlePermissionState);
    socket.on(SOCKET_EVENTS.EDIT_PERMISSION_DENIED, handlePermissionDenied);

    return () => {
      socket.off(SOCKET_EVENTS.EDIT_PERMISSION_STATE, handlePermissionState);
      socket.off(SOCKET_EVENTS.EDIT_PERMISSION_DENIED, handlePermissionDenied);
    };
  }, [roomId, setFiles, socket]);

  // Emit presence update when active file changes
  useEffect(() => {
    if (!socket || !user || !activeFile) return;
    
    socket.emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
      roomId,
      username: user.username,
      status: `Editing ${activeFile}`
    });
  }, [activeFile, socket, user, roomId]);

  // Handle code execution with Adaptive Logic
  const [activeBottomTab, setActiveBottomTab] = useState("terminal");

  const handleRun = async () => {
    const executableFile = activeFile === "tracer.js" && files["solution.js"] ? "solution.js" : activeFile;
    const executableCode = files[executableFile] || code;
    const executableLanguage = getLanguageFromFilename(executableFile);

    setLoading(true);
    setBottomCollapsed(false);
    bottomPanelRef.current?.expand();
    
    // Adaptive logic: If web file, we might skip the backend if it's purely static, 
    // but the backend now handles this perfectly with 'visual' type.
    
    socket?.emit(SOCKET_EVENTS.EXECUTION_START, {
      user: user?.username || "Guest",
      roomId,
      language: executableLanguage,
    });
    
    // Switch to appropriate tab based on language immediately for better UX
    if (["html", "css", "markdown"].includes(executableLanguage)) {
       setActiveBottomTab("output");
    } else {
       setActiveBottomTab("terminal");
    }

    try {
      const res = await executeCode({
        code: executableCode,
        language: executableLanguage,
        roomId,
        user: user?.username || "Guest",
        fileName: executableFile
      });
      
      setOutput(res.output || "No output");
      setOutputType((res.type as ExecutionOutputType) || "terminal");
      
      // Intelligent Tab Switching based on backend response
      if (res.type === "visual") {
         setActiveBottomTab("output");
      } else {
         setActiveBottomTab("terminal");
      }
    } catch (err: unknown) {
      console.warn("Execution failed", err);
      setOutput(formatExecutionError(err));
      setOutputType("terminal");
      setActiveBottomTab("terminal");
    } finally {
      setLoading(false);
    }
  };

  // Internal Visual Preview Component
  const VisualPreview = () => {
    const activeContent = files[activeFile] ?? code ?? "";

    if (language === "markdown" || activeFile.endsWith(".md")) {
       const markdownContent = activeContent.replace(/\\n/g, "\n");
       return (
         <div className="h-full overflow-auto bg-[#05070b] p-6 custom-scrollbar">
            <div className="prose prose-invert max-w-none prose-headings:tracking-normal prose-a:text-cyan-300 prose-code:rounded prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-100 prose-pre:border prose-pre:border-slate-800 prose-pre:bg-slate-950 prose-li:marker:text-slate-500">
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
            </div>
         </div>
       );
    }

    // For HTML/CSS/JS, always preview the current workspace files live.
    const previewContent = combinedPreview;
    
    return (
      <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
         <div className="h-7 bg-slate-100 border-b flex items-center px-4 gap-2 shrink-0">
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
               <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="text-[10px] font-mono text-slate-400 truncate">preview://simulation-environment/index.html</div>
         </div>
         <iframe 
            srcDoc={previewContent}
            title="Preview"
            className="flex-1 w-full border-none shadow-inner"
            sandbox="allow-scripts"
         />
      </div>
    );
  };

  // Panel refs
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const bottomPanelRef = useRef<ImperativePanelHandle>(null);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [bottomCollapsed, setBottomCollapsed] = useState(false);
  const [rightTab, setRightTab] = useState(algoId ? "algotrace" : "assistant");
  const [fullscreenPanel, setFullscreenPanel] = useState<FullscreenPanel>(null);
  const isEditorFullscreen = fullscreenPanel === "editor";
  const isAssistantFullscreen = fullscreenPanel === "assistant";
  const isOutputFullscreen = fullscreenPanel === "output";

  useEffect(() => {
    if (!fullscreenPanel) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFullscreenPanel(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [fullscreenPanel]);

  useEffect(() => {
    const openAssistantPanel = () => {
      rightPanelRef.current?.expand();
      setRightCollapsed(false);
      setRightTab("assistant");
    };

    window.addEventListener("codeverse:open-assistant-panel", openAssistantPanel);
    return () => window.removeEventListener("codeverse:open-assistant-panel", openAssistantPanel);
  }, []);

  const toggleBottomPanel = () => {
    if (bottomCollapsed) {
      bottomPanelRef.current?.expand();
      setBottomCollapsed(false);
      return;
    }

    bottomPanelRef.current?.collapse();
    setBottomCollapsed(true);
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith(".md")) return <FileText className="h-4 w-4 text-blue-400" />;
    if (filename.endsWith(".html")) return <FileCode className="h-4 w-4 text-orange-400" />;
    if (filename.endsWith(".css")) return <FileCode className="h-4 w-4 text-blue-300" />;
    if (filename.endsWith(".js") || filename.endsWith(".ts") || filename.endsWith(".jsx") || filename.endsWith(".tsx"))
      return <FileCode className="h-4 w-4 text-yellow-400" />;
    if (filename.endsWith(".py")) return <FileCode className="h-4 w-4 text-green-400" />;
    return <FileCode className="h-4 w-4 text-muted-foreground" />;
  };

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Initializing Midnight Shell...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col overflow-hidden border-l border-slate-800 bg-[#070b12] font-sans text-slate-100">
        <PresenceHeader 
          projectTitle={project.title} 
          users={activeUsers}
          showBackButton
          backHref="/dashboard"
          onDeploy={handleBeginDeployment}
          latencyMs={latencyMs}
          connected={socketConnected}
        />

        <PanelGroup direction="horizontal" className="flex-1">
          <Panel
            ref={leftPanelRef}
            defaultSize={15}
            minSize={12}
            maxSize={24}
            collapsible
            collapsedSize={0}
            onCollapse={() => setLeftCollapsed(true)}
            onExpand={() => setLeftCollapsed(false)}
            className="flex flex-col border-r border-slate-800 bg-[#0a0f19]"
          >
            <div className="flex h-10 items-center justify-between border-b border-slate-800 px-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Explorer
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 text-slate-400 hover:bg-slate-800 hover:text-slate-100",
                    !canEditWorkspace && "cursor-not-allowed opacity-45"
                  )}
                  onClick={() => setShowNewFileModal(true)}
                  disabled={!canEditWorkspace}
                  aria-label="Create file"
                  title={canEditWorkspace ? "Create file" : "Organizer-only editing"}
                >
                  <FilePlus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                <AnimatePresence>
                  {Object.keys(files).map((file, index) => (
                    <motion.div
                      key={file}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <div
                        className={cn(
                          "group relative flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-xs transition-colors",
                          file === activeFile
                            ? "bg-indigo-500/15 text-indigo-200"
                            : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                        )}
                      >
                        <button
                          onClick={() => setActiveFile(file)}
                          className="flex min-w-0 flex-1 items-center gap-2 rounded px-1 py-0.5 text-left"
                          aria-label={`Open ${file}`}
                          title={file}
                        >
                          {getFileIcon(file)}
                          <span className="truncate">{file}</span>
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            if (!canEditWorkspace) {
                              setPermissionNotice("Editing is currently organizer-only.");
                              return;
                            }
                            setActiveFile(file);
                            setShowDeleteConfirm(true);
                          }}
                          disabled={!canEditWorkspace}
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded text-slate-500 opacity-70 transition hover:bg-rose-500/10 hover:text-rose-300 group-hover:opacity-100",
                            !canEditWorkspace && "cursor-not-allowed opacity-35 hover:bg-transparent hover:text-slate-500"
                          )}
                          aria-label={`Delete ${file}`}
                          title={canEditWorkspace ? `Delete ${file}` : "Organizer-only editing"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        {file === activeFile && (
                          <motion.div
                            layoutId="active-indicator"
                            className="absolute left-0 h-4 w-1 rounded-r-full bg-indigo-400"
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </Panel>

          <PanelResizeHandle className="w-[1px] bg-slate-800 transition-colors hover:bg-indigo-500/50" />

          <Panel
            defaultSize={58}
            minSize={34}
            className={cn(
              "flex flex-col bg-[#070b12]",
              isEditorFullscreen && "fixed inset-0 z-50 h-screen w-screen border border-slate-800 shadow-2xl shadow-black/60"
            )}
          >
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={20} className="flex flex-col">
                <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-800 bg-[#0a0f19]">
                  <div className="flex min-w-0 flex-1 items-center overflow-x-auto no-scrollbar">
                    {Object.keys(files).map((file) => (
                      <div
                        key={file}
                        className={cn(
                          "group relative flex h-11 min-w-fit items-center gap-1 border-r border-slate-800 px-2 text-xs transition-colors",
                          file === activeFile
                            ? "bg-[#0b0f17] text-slate-100"
                            : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
                        )}
                      >
                        <button
                          onClick={() => setActiveFile(file)}
                          className="flex min-w-0 items-center gap-2 rounded px-2 py-2"
                          aria-label={`Open ${file}`}
                          title={file}
                        >
                          {getFileIcon(file)}
                          <span className="max-w-[160px] truncate">{file}</span>
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            if (!canEditWorkspace) {
                              setPermissionNotice("Editing is currently organizer-only.");
                              return;
                            }
                            setActiveFile(file);
                            setShowDeleteConfirm(true);
                          }}
                          disabled={!canEditWorkspace}
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded text-slate-500 opacity-70 transition hover:bg-rose-500/10 hover:text-rose-300 group-hover:opacity-100",
                            !canEditWorkspace && "cursor-not-allowed opacity-35 hover:bg-transparent hover:text-slate-500"
                          )}
                          aria-label={`Delete ${file}`}
                          title={canEditWorkspace ? `Delete ${file}` : "Organizer-only editing"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        {file === activeFile && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex shrink-0 items-center gap-2 border-l border-slate-800 px-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFullscreenPanel(isEditorFullscreen ? null : "editor")}
                      className="h-8 w-8 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                      aria-label={isEditorFullscreen ? "Exit editor fullscreen" : "Editor fullscreen"}
                      title={isEditorFullscreen ? "Exit editor fullscreen" : "Editor fullscreen"}
                    >
                      {isEditorFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSave}
                      disabled={!canEditWorkspace}
                      title={canEditWorkspace ? "Save" : "Organizer-only editing"}
                      className="h-8 text-slate-300 hover:bg-slate-800 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <Save className="mr-2 h-3.5 w-3.5" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleRun}
                      disabled={loading}
                      className="h-8 bg-indigo-500 text-white hover:bg-indigo-400"
                    >
                      <Play className="mr-2 h-3.5 w-3.5" />
                      {loading ? "Running" : "Run"}
                    </Button>
                  </div>
                </div>

                <div className="relative flex-1 bg-[#0b0f17]">
                    <CodeEditor
                     ref={editorRef}
                     value={files[activeFile] || ""}
                     onChange={(newCode: string) =>
                       setFiles((prev) => ({ ...prev, [activeFile]: newCode }))
                     }
                     activeFile={activeFile}
                     roomId={roomId}
                     currentUser={user?.username || "Guest"}
                     readOnly={!canEditWorkspace}
                     readOnlyMessage="The organizer has paused team editing."
                   />
                   {!canEditWorkspace && (
                     <div className="pointer-events-none absolute right-4 top-4 rounded-md border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-amber-200 shadow-lg shadow-black/20">
                       View only
                     </div>
                   )}
                </div>
              </Panel>

              <PanelResizeHandle className="h-[1px] bg-slate-800 transition-colors hover:bg-indigo-500/50" />

              <Panel
                ref={bottomPanelRef}
                defaultSize={28}
                minSize={10}
                collapsible
                collapsedSize={5}
                onCollapse={() => setBottomCollapsed(true)}
                onExpand={() => setBottomCollapsed(false)}
                className={cn(
                  "flex flex-col bg-[#05070b]",
                  isOutputFullscreen && "fixed inset-0 z-50 h-screen w-screen border border-slate-800 shadow-2xl shadow-black/60"
                )}
              >
                <Tabs value={activeBottomTab} onValueChange={setActiveBottomTab} className="h-full flex flex-col">
                   <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-800 bg-[#0a0f19] px-3">
                     <TabsList className="h-8 gap-1 bg-transparent p-0">
                        <TabsTrigger 
                           value="terminal" 
                           className="h-8 rounded-md px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
                        >
                           Terminal
                        </TabsTrigger>
                        <TabsTrigger 
                           value="output" 
                           className="h-8 rounded-md px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
                        >
                           Output
                        </TabsTrigger>
                        <TabsTrigger 
                           value="history" 
                           className="h-8 rounded-md px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
                        >
                           History
                        </TabsTrigger>
                     </TabsList>
                     <div className="flex items-center gap-1">
                       {activeBottomTab === "output" && !bottomCollapsed && (
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-7 w-7 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                           onClick={() => setFullscreenPanel(isOutputFullscreen ? null : "output")}
                           aria-label={isOutputFullscreen ? "Exit output fullscreen" : "Output fullscreen"}
                           title={isOutputFullscreen ? "Exit output fullscreen" : "Output fullscreen"}
                         >
                           {isOutputFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                         </Button>
                       )}
                       {!isOutputFullscreen && (
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-7 w-7 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                           onClick={toggleBottomPanel}
                           aria-label={bottomCollapsed ? "Expand bottom panel" : "Collapse bottom panel"}
                           title={bottomCollapsed ? "Expand bottom panel" : "Collapse bottom panel"}
                         >
                           {bottomCollapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                         </Button>
                       )}
                     </div>
                   </div>

                   {!bottomCollapsed && (
                     <div className="min-h-0 flex-1 overflow-hidden">
                        <TabsContent value="terminal" className="h-full m-0 bg-[#05070b]">
                           <TerminalPanel 
                              output={outputType === "terminal" ? output : "Visual output ready in the Output tab."} 
                              onData={() => {}}
                           />
                        </TabsContent>
                        <TabsContent value="output" className="h-full m-0 bg-[#05070b] p-4">
                           <VisualPreview />
                        </TabsContent>
                        <TabsContent value="history" className="h-full m-0 bg-[#05070b]">
                          <VersionHistory
                            userId={user?._id || "demo"}
                            fileName={activeFile}
                            onRevert={canEditWorkspace ? applyCodeToActiveFile : () => setPermissionNotice("Editing is currently organizer-only.")}
                            onCompare={handleCompare}
                            refreshSignal={refreshCount}
                            isOrganizer={isProjectOrganizer && !removedFromWorkspace}
                            workspaceSnapshots={workspaceSnapshots}
                            currentSnapshotId={currentSnapshotId}
                            onCreateWorkspaceSnapshot={() => {
                              const snapshot = createWorkspaceSnapshot("Manual snapshot");
                              if (snapshot) {
                                setPermissionNotice(`Saved workspace snapshot at ${new Date(snapshot.createdAt).toLocaleString()}.`);
                              }
                            }}
                            onRestoreWorkspaceSnapshot={restoreWorkspaceSnapshot}
                            onRestoreWorkspaceSnapshotByTime={restoreWorkspaceSnapshotByTime}
                            onStepWorkspaceSnapshot={stepWorkspaceTimeline}
                            onReturnToLatestWorkspaceSnapshot={returnToLatestWorkspaceSnapshot}
                            canStepBack={currentTimelineIndex >= 0 && currentTimelineIndex < workspaceSnapshots.length - 1}
                            canStepForward={currentTimelineIndex > 0}
                          />
                        </TabsContent>
                     </div>
                   )}
                </Tabs>
              </Panel>
            </PanelGroup>
          </Panel>

          <AnimatePresence>
            {showDiffViewer && (
              <DiffViewer
                originalCode={versionCode}
                modifiedCode={files[activeFile]}
                fileName={activeFile}
                versionDate={versionDate}
                onClose={() => setShowDiffViewer(false)}
                onRevert={handleRevertFromDiff}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            <DeploymentModal
              isOpen={isDeploying}
              onClose={() => setIsDeploying(false)}
              deploymentUrl={deploymentUrl}
              error={deploymentError}
              projectName={project.title}
            />
          </AnimatePresence>

          <PanelResizeHandle className="w-[1px] bg-slate-800 transition-colors hover:bg-indigo-500/50" />

          <Panel
            ref={rightPanelRef}
            defaultSize={27}
            minSize={22}
            maxSize={38}
            collapsible
            collapsedSize={0}
            onCollapse={() => setRightCollapsed(true)}
            onExpand={() => setRightCollapsed(false)}
            className={cn(
              "flex flex-col border-l border-slate-800 bg-[#0a0f19]",
              isAssistantFullscreen && "fixed inset-0 z-50 h-screen w-screen border border-slate-800 shadow-2xl shadow-black/60"
            )}
          >
            <Tabs value={rightTab} onValueChange={setRightTab} className="flex h-full min-h-0 flex-col">
              <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-800 px-3">
                <TabsList className="h-8 gap-1 rounded-md border border-slate-800 bg-[#070b12] p-1">
                  <TabsTrigger
                    value="assistant"
                    className="h-6 rounded px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 data-[state=active]:bg-indigo-500/15 data-[state=active]:text-indigo-200"
                  >
                    Assistant
                  </TabsTrigger>
                  <TabsTrigger
                    value="team"
                    className="h-6 rounded px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 data-[state=active]:bg-indigo-500/15 data-[state=active]:text-indigo-200"
                  >
                    Team
                  </TabsTrigger>
                  <TabsTrigger
                    value="algotrace"
                    className="h-6 rounded px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 data-[state=active]:bg-indigo-500/15 data-[state=active]:text-indigo-200"
                  >
                    Trace
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-1">
                  {rightTab === "assistant" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                      onClick={() => {
                        rightPanelRef.current?.expand();
                        setRightCollapsed(false);
                        setFullscreenPanel(isAssistantFullscreen ? null : "assistant");
                      }}
                      aria-label={isAssistantFullscreen ? "Exit assistant fullscreen" : "Assistant fullscreen"}
                      title={isAssistantFullscreen ? "Exit assistant fullscreen" : "Assistant fullscreen"}
                    >
                      {isAssistantFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </Button>
                  )}
                  {!isAssistantFullscreen && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                      onClick={() => rightPanelRef.current?.collapse()}
                      aria-label="Collapse right panel"
                      title="Collapse right panel"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <TabsContent value="assistant" className="m-0 h-full min-h-0">
                  <ChatBox roomId={roomId} context={assistantContext} aiMode channel="ai" />
                </TabsContent>

                <TabsContent value="team" className="m-0 h-full min-h-0">
                  <div className="flex h-full min-h-0 flex-col">
                    <div className="flex shrink-0 items-center gap-2 border-b border-slate-800 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      <MessageSquare className="h-3.5 w-3.5 text-indigo-300" />
                      <span>Collaborator Chat</span>
                      <div className="ml-auto flex items-center gap-2">
                        {isProjectOrganizer ? (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={collaborationAccess.collaboratorsCanEdit}
                            onClick={handleToggleTeamEditing}
                            className={cn(
                              "inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[10px] font-semibold uppercase tracking-widest transition-colors",
                              collaborationAccess.collaboratorsCanEdit
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15"
                                : "border-amber-400/20 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
                            )}
                            title="Toggle collaborator editing"
                          >
                            {collaborationAccess.collaboratorsCanEdit ? (
                              <Unlock className="h-3.5 w-3.5" />
                            ) : (
                              <Lock className="h-3.5 w-3.5" />
                            )}
                            {collaborationAccess.collaboratorsCanEdit ? "Team edit" : "Owner edit"}
                          </button>
                        ) : (
                          <div
                            className={cn(
                              "inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[10px] font-semibold uppercase tracking-widest",
                              canEditWorkspace
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                                : "border-amber-400/20 bg-amber-400/10 text-amber-200"
                            )}
                            title={
                              collaborationAccess.organizerUsername
                                ? `Organizer: ${collaborationAccess.organizerUsername}`
                                : "Organizer controls editing"
                            }
                          >
                            {canEditWorkspace ? <ShieldCheck className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            {canEditWorkspace ? "Can edit" : "View only"}
                          </div>
                        )}
                      </div>
                    </div>
                    {permissionNotice && (
                      <div className="border-b border-amber-400/10 bg-amber-400/5 px-3 py-2 text-xs text-amber-200">
                        {permissionNotice}
                      </div>
                    )}
                    <div className="border-b border-slate-800 px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        {activeUsers.map((activeUser) => {
                          const isSelf = activeUser.username === user?.username;
                          const canRemove =
                            isProjectOrganizer &&
                            !isSelf &&
                            activeUser.role !== "organizer";

                          return (
                            <div
                              key={`${activeUser.socketId || activeUser.username}-${activeUser.username}`}
                              className="flex h-8 max-w-full items-center gap-2 rounded-md border border-slate-800 bg-slate-950/70 px-2 text-xs text-slate-300"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-[9px] font-semibold uppercase text-indigo-200">
                                {activeUser.username?.slice(0, 2)}
                              </span>
                              <span className="max-w-[120px] truncate">{activeUser.username}</span>
                              <span className="text-[10px] uppercase tracking-widest text-slate-600">
                                {activeUser.role === "organizer"
                                  ? "Organizer"
                                  : activeUser.canEdit === false
                                    ? "View"
                                    : "Edit"}
                              </span>
                              {canRemove && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCollaborator(activeUser)}
                                  className="ml-1 flex h-6 w-6 items-center justify-center rounded text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-300"
                                  aria-label={`Remove ${activeUser.username}`}
                                  title={`Remove ${activeUser.username}`}
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
                      {removedFromWorkspace ? (
                        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                          You no longer have access to this workspace.
                        </div>
                      ) : (
                        <ChatBox
                          roomId={roomId}
                          aiMode={false}
                          channel="team"
                          placeholder="Message everyone in this workspace..."
                        />
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="algotrace" className="m-0 h-full min-h-0">
                  <AlgoTraceCanvas
                    editorCode={files["tracer.js"] || files[activeFile] || ""}
                    autoRun={Boolean(algoId)}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </Panel>
        </PanelGroup>

        {/* Floating Toggle for explorer if collapsed */}
        {leftCollapsed && !fullscreenPanel && (
           <Button 
            className="absolute left-0 top-1/2 h-8 w-5 -translate-y-1/2 rounded-l-none bg-indigo-500 p-0 text-white hover:bg-indigo-400"
            onClick={() => leftPanelRef.current?.expand()}
           >
            <ChevronRight className="w-3 h-3" />
           </Button>
        )}
        
        {/* Floating Toggle for AI if collapsed */}
        {rightCollapsed && !fullscreenPanel && (
           <Button 
            className="absolute right-0 top-1/2 h-8 w-5 -translate-y-1/2 rounded-r-none bg-indigo-500 p-0 text-white hover:bg-indigo-400"
            onClick={() => rightPanelRef.current?.expand()}
            aria-label="Expand right panel"
            title="Expand right panel"
           >
            <ChevronLeft className="w-3 h-3" />
           </Button>
        )}

        {/* Dialogs */}
        <Dialog open={showNewFileModal} onOpenChange={setShowNewFileModal}>
          <DialogContent className="border-slate-800 bg-[#0a0f19] text-slate-100 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create new file</DialogTitle>
              <DialogDescription className="text-slate-500">
                Enter filename with extension (e.g. main.py)
              </DialogDescription>
            </DialogHeader>
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="index.js"
              className="mt-4 border-slate-800 bg-[#070b12] text-slate-100 focus:border-indigo-500"
              autoFocus
            />
            <DialogFooter className="mt-6">
              <Button variant="ghost" onClick={() => setShowNewFileModal(false)}>Cancel</Button>
              <Button
                className="bg-indigo-500 text-white hover:bg-indigo-400"
                onClick={handleCreateFile}
                disabled={!canEditWorkspace}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="border-slate-800 bg-[#0a0f19] text-slate-100 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-rose-300">Delete file</DialogTitle>
              <DialogDescription className="text-slate-500">
                {Object.keys(files).length <= 1
                  ? "This is the last file in the workspace, so it cannot be deleted."
                  : `Are you sure you want to delete ${activeFile}?`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
                <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteActiveFile}
                  disabled={!canEditWorkspace || Object.keys(files).length <= 1}
                >
                  Delete
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
