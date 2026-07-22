"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { useAuth } from "@/context/AuthContext";
import { useEditorState } from "@/hooks/useEditorState";
import { getLanguageFromFilename } from "@/hooks/useLanguageDetection";
import { useSocket } from "@/hooks/useSocket";
import { useCodeSave } from "@/hooks/useCodeSave";
import { useHtmlPreview } from "@/hooks/useHtmlPreview";
import { fetchProjectById } from "@/services/projects";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";
import type { SharedProject } from "@shared/types/project";
import { createDemoWorkspace } from "@/features/workspace/demo-workspace";
import { buildAssistantWorkspaceContext } from "@/features/workspace/workspace-utils";
import { useWorkspaceCollaboration } from "@/features/workspace/useWorkspaceCollaboration";
import { useWorkspaceTimeline } from "@/features/workspace/useWorkspaceTimeline";
import { useWorkspaceDeployment } from "@/features/workspace/useWorkspaceDeployment";
import { useWorkspaceExecution } from "@/features/workspace/useWorkspaceExecution";
import { useWorkspaceLayout } from "@/features/workspace/useWorkspaceLayout";
import { WorkspaceDialogs } from "@/features/workspace/WorkspaceDialogs";
import { WorkspaceEditorPanel } from "@/features/workspace/WorkspaceEditorPanel";
import { WorkspaceRightPanel } from "@/features/workspace/WorkspaceRightPanel";
import { WorkspaceExplorerPanel } from "@/features/workspace/WorkspaceExplorerPanel";
import DiffViewer from "@/components/DiffViewer";
import DeploymentModal from "@/components/DeploymentModal";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PresenceHeader } from "@/components/ActivityBar";

// Icons
import {
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function WorkspaceShell() {
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
  const visualizerMode = searchParams?.get("viz");
  const presentationMode = searchParams?.get("presentation") === "1";
  const narrationRequested = searchParams?.get("narrate") === "1";
  const demoRole = searchParams?.get("demoRole");
  const demoUser = searchParams?.get("demoUser");

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const roomId = id || "room1";
  const { user } = useAuth();
  const { socket } = useSocket(roomId);

  const [project, setProject] = useState<SharedProject | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
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

  const {
    leftPanelRef,
    rightPanelRef,
    bottomPanelRef,
    leftCollapsed,
    setLeftCollapsed,
    rightCollapsed,
    setRightCollapsed,
    bottomCollapsed,
    setBottomCollapsed,
    rightTab,
    setRightTab,
    fullscreenPanel,
    setFullscreenPanel,
    isCompactLayout,
    isEditorFullscreen,
    isExplorerFullscreen,
    isAssistantFullscreen,
    isOutputFullscreen,
    toggleBottomPanel,
    openBottomPanel,
  } = useWorkspaceLayout(Boolean(project), algoId ? "algotrace" : "assistant");

  const {
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
  } = useWorkspaceCollaboration({
    socket,
    roomId,
    project,
    user,
    activeFile,
    setActiveFile,
    setFiles,
    demoRole,
    demoUser,
  });
  const {
    output,
    outputType,
    loading,
    activeBottomTab,
    setActiveBottomTab,
    handleRun,
  } = useWorkspaceExecution({
    socket,
    roomId,
    username: user?.username || collaborationIdentity?.username || "Guest",
    activeFile,
    files,
    fallbackCode: code,
    openBottomPanel,
  });

  // Code save hook
  const { handleSave } = useCodeSave(activeFile, code, () => {
    setRefreshCount((prev) => prev + 1);
  });

  // HTML preview hook
  const { combinedPreview } = useHtmlPreview(files, language);

  const algoTraceCode = useMemo(() => {
    const tracer = files["tracer.js"];
    if (tracer?.trim()) return tracer;

    const activeLanguage = getLanguageFromFilename(activeFile);
    if (activeLanguage === "javascript" && activeFile !== "script.js") {
      return files[activeFile] || "";
    }

    return "";
  }, [activeFile, files]);

  const assistantContext = useMemo(() => {
    const fileList = Object.keys(files).join(", ");
    const workspaceContext = buildAssistantWorkspaceContext(files, activeFile);

    return [
      `Project: ${project?.title || "CodeVerse workspace"}`,
      `Active file: ${activeFile}`,
      `Language: ${language}`,
      `Workspace files: ${fileList}`,
      "",
      "Workspace file context:",
      workspaceContext || "No files loaded.",
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

  const {
    isDeploying,
    setIsDeploying,
    deploymentUrl,
    deploymentError,
    deploymentNote,
    handleBeginDeployment,
  } = useWorkspaceDeployment(id || roomId, files);
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

  const {
    workspaceSnapshots,
    currentSnapshotId,
    currentTimelineIndex,
    createWorkspaceSnapshot,
    restoreWorkspaceSnapshot,
    restoreWorkspaceSnapshotByTime,
    stepWorkspaceTimeline,
    returnToLatestWorkspaceSnapshot,
  } = useWorkspaceTimeline({
    roomId,
    files,
    activeFile,
    isOrganizer: isProjectOrganizer,
    setFiles,
    setActiveFile,
    setNotice: setPermissionNotice,
    emitFilesChange: emitWorkspaceFilesChange,
    ready: Boolean(project),
  });
  // Load project
  useEffect(() => {
    if (!id) return;

    if (id === "demo-sandbox") {
      const preferredLanguage = typeof window !== "undefined"
        ? window.localStorage.getItem("algo-trace-preferred-lang")
        : null;
      const demoWorkspace = createDemoWorkspace({ algoId, visualizerMode, preferredLanguage });

      setProject(demoWorkspace.project);
      setFiles(demoWorkspace.files);
      setActiveFile(demoWorkspace.activeFile);
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
  }, [id, algoId, visualizerMode, initializeProjectFiles, setActiveFile, setFiles]);

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

        <PanelGroup key={isCompactLayout ? "compact" : "wide"} direction="horizontal" className="flex-1">
          <WorkspaceExplorerPanel
            panelRef={leftPanelRef}
            compact={isCompactLayout}
            fullscreen={isExplorerFullscreen}
            files={files}
            activeFile={activeFile}
            canEdit={canEditWorkspace}
            setActiveFile={setActiveFile}
            setNotice={setPermissionNotice}
            onCollapse={() => setLeftCollapsed(true)}
            onExpand={() => setLeftCollapsed(false)}
            onCloseFullscreen={() => {
              setFullscreenPanel(null);
              setLeftCollapsed(true);
              leftPanelRef.current?.collapse();
            }}
            onCreateFile={() => setShowNewFileModal(true)}
            onRequestDelete={(fileName) => {
              setActiveFile(fileName);
              setShowDeleteConfirm(true);
            }}
          />
          <PanelResizeHandle className={cn(
            "w-[1px] bg-slate-800 transition-colors hover:bg-indigo-500/50",
            "max-lg:hidden"
          )} />

          <WorkspaceEditorPanel
            isCompactLayout={isCompactLayout}
            isEditorFullscreen={isEditorFullscreen}
            isOutputFullscreen={isOutputFullscreen}
            setFullscreenPanel={setFullscreenPanel}
            files={files}
            setFiles={setFiles}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            roomId={roomId}
            currentUser={collaborationIdentity?.username || "Guest"}
            canEditWorkspace={canEditWorkspace}
            setPermissionNotice={setPermissionNotice}
            setShowDeleteConfirm={setShowDeleteConfirm}
            handleSave={handleSave}
            handleRun={handleRun}
            loading={loading}
            bottomPanelRef={bottomPanelRef}
            bottomCollapsed={bottomCollapsed}
            setBottomCollapsed={setBottomCollapsed}
            toggleBottomPanel={toggleBottomPanel}
            activeBottomTab={activeBottomTab}
            setActiveBottomTab={setActiveBottomTab}
            output={output}
            outputType={outputType}
            language={language}
            code={code}
            combinedPreview={combinedPreview}
            userId={user?._id || "demo"}
            applyCodeToActiveFile={applyCodeToActiveFile}
            handleCompare={handleCompare}
            refreshCount={refreshCount}
            isProjectOrganizer={isProjectOrganizer}
            removedFromWorkspace={removedFromWorkspace}
            workspaceSnapshots={workspaceSnapshots}
            currentSnapshotId={currentSnapshotId}
            createWorkspaceSnapshot={createWorkspaceSnapshot}
            restoreWorkspaceSnapshot={restoreWorkspaceSnapshot}
            restoreWorkspaceSnapshotByTime={restoreWorkspaceSnapshotByTime}
            stepWorkspaceTimeline={stepWorkspaceTimeline}
            returnToLatestWorkspaceSnapshot={returnToLatestWorkspaceSnapshot}
            currentTimelineIndex={currentTimelineIndex}
          />
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
              note={deploymentNote}
            />
          </AnimatePresence>

          <PanelResizeHandle className={cn(
            "w-[1px] bg-slate-800 transition-colors hover:bg-indigo-500/50",
            "max-lg:hidden"
          )} />

          <WorkspaceRightPanel
            rightPanelRef={rightPanelRef}
            isCompactLayout={isCompactLayout}
            isAssistantFullscreen={isAssistantFullscreen}
            rightTab={rightTab}
            setRightTab={setRightTab}
            setRightCollapsed={setRightCollapsed}
            setFullscreenPanel={setFullscreenPanel}
            roomId={roomId}
            assistantContext={assistantContext}
            activeUsers={activeUsers}
            currentUsername={collaborationIdentity?.username}
            collaborationAccess={collaborationAccess}
            canEditWorkspace={canEditWorkspace}
            isProjectOrganizer={isProjectOrganizer}
            inviteCopied={inviteCopied}
            removedFromWorkspace={removedFromWorkspace}
            permissionNotice={permissionNotice}
            handleCopyInviteLink={handleCopyInviteLink}
            handleToggleTeamEditing={handleToggleTeamEditing}
            handleRemoveCollaborator={handleRemoveCollaborator}
            algoTraceCode={algoTraceCode}
            algoId={algoId}
            presentationMode={presentationMode}
            visualizerMode={visualizerMode}
            narrationRequested={narrationRequested}
          />
        </PanelGroup>

        {/* Floating Toggle for explorer if collapsed */}
        {!fullscreenPanel && (
           <Button
            className={cn(
              "absolute left-0 top-1/2 h-8 w-5 -translate-y-1/2 rounded-l-none bg-indigo-500 p-0 text-white hover:bg-indigo-400",
              !leftCollapsed && "lg:hidden"
            )}
            onClick={() => {
              leftPanelRef.current?.expand();
              setLeftCollapsed(false);
              if (window.matchMedia("(max-width: 1023px)").matches) setFullscreenPanel("explorer");
            }}
            aria-label="Expand explorer"
            title="Expand explorer"
           >
            <ChevronRight className="w-3 h-3" />
           </Button>
        )}

        {/* Floating Toggle for AI if collapsed */}
        {!fullscreenPanel && (
           <Button
            className={cn(
              "absolute right-0 top-1/2 h-8 w-5 -translate-y-1/2 rounded-r-none bg-indigo-500 p-0 text-white hover:bg-indigo-400",
              !rightCollapsed && "lg:hidden"
            )}
            onClick={() => {
              rightPanelRef.current?.expand();
              setRightCollapsed(false);
              if (window.matchMedia("(max-width: 1023px)").matches) setFullscreenPanel("assistant");
            }}
            aria-label="Expand assistant"
            title="Expand assistant"
           >
            <ChevronLeft className="w-3 h-3" />
           </Button>
        )}

        <WorkspaceDialogs
          activeFile={activeFile}
          canEdit={canEditWorkspace}
          fileCount={Object.keys(files).length}
          newFileName={newFileName}
          showNewFile={showNewFileModal}
          showDelete={showDeleteConfirm}
          onNewFileNameChange={setNewFileName}
          onNewFileOpenChange={setShowNewFileModal}
          onDeleteOpenChange={setShowDeleteConfirm}
          onCreate={handleCreateFile}
          onDelete={handleDeleteActiveFile}
        />
      </div>
    </TooltipProvider>
  );
}
