"use client";

import dynamic from "next/dynamic";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { ChevronDown, ChevronUp, Maximize2, Minimize2, Play, Save, Trash2 } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import VersionHistory from "@/components/VersionHistory";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ExecutionOutputType } from "@/hooks/useCodeExecution";
import { cn } from "@/lib/utils";
import type { FullscreenPanel, WorkspaceSnapshot } from "./types";
import { WorkspaceFileIcon } from "./WorkspaceFileIcon";
import { WorkspaceVisualPreview } from "./WorkspaceVisualPreview";

const TerminalPanel = dynamic(() => import("@/components/TerminalPanel"), { ssr: false });
const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#0b0f17] text-xs font-medium text-slate-500">
      Loading editor
    </div>
  ),
});

interface WorkspaceEditorPanelProps {
  isCompactLayout: boolean;
  isEditorFullscreen: boolean;
  isOutputFullscreen: boolean;
  setFullscreenPanel: Dispatch<SetStateAction<FullscreenPanel>>;
  files: Record<string, string>;
  setFiles: Dispatch<SetStateAction<Record<string, string>>>;
  activeFile: string;
  setActiveFile: Dispatch<SetStateAction<string>>;
  roomId: string;
  currentUser: string;
  canEditWorkspace: boolean;
  setPermissionNotice: Dispatch<SetStateAction<string>>;
  setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>;
  handleSave: () => void;
  handleRun: () => Promise<void>;
  loading: boolean;
  bottomPanelRef: RefObject<ImperativePanelHandle | null>;
  bottomCollapsed: boolean;
  setBottomCollapsed: Dispatch<SetStateAction<boolean>>;
  toggleBottomPanel: () => void;
  activeBottomTab: string;
  setActiveBottomTab: Dispatch<SetStateAction<string>>;
  output: string;
  outputType: ExecutionOutputType;
  language: string;
  code: string;
  combinedPreview: string;
  userId: string;
  applyCodeToActiveFile: (code: string) => void;
  handleCompare: (code: string, date: string) => void;
  refreshCount: number;
  isProjectOrganizer: boolean;
  removedFromWorkspace: boolean;
  workspaceSnapshots: WorkspaceSnapshot[];
  currentSnapshotId: string | null;
  createWorkspaceSnapshot: (label?: string, files?: Record<string, string>, activeFile?: string) => WorkspaceSnapshot | null;
  restoreWorkspaceSnapshot: (snapshot: WorkspaceSnapshot) => void;
  restoreWorkspaceSnapshotByTime: (timestamp: string) => void;
  stepWorkspaceTimeline: (direction: "back" | "forward") => void;
  returnToLatestWorkspaceSnapshot: () => void;
  currentTimelineIndex: number;
}

export function WorkspaceEditorPanel({
  isCompactLayout,
  isEditorFullscreen,
  isOutputFullscreen,
  setFullscreenPanel,
  files,
  setFiles,
  activeFile,
  setActiveFile,
  roomId,
  currentUser,
  canEditWorkspace,
  setPermissionNotice,
  setShowDeleteConfirm,
  handleSave,
  handleRun,
  loading,
  bottomPanelRef,
  bottomCollapsed,
  setBottomCollapsed,
  toggleBottomPanel,
  activeBottomTab,
  setActiveBottomTab,
  output,
  outputType,
  language,
  code,
  combinedPreview,
  userId,
  applyCodeToActiveFile,
  handleCompare,
  refreshCount,
  isProjectOrganizer,
  removedFromWorkspace,
  workspaceSnapshots,
  currentSnapshotId,
  createWorkspaceSnapshot,
  restoreWorkspaceSnapshot,
  restoreWorkspaceSnapshotByTime,
  stepWorkspaceTimeline,
  returnToLatestWorkspaceSnapshot,
  currentTimelineIndex,
}: WorkspaceEditorPanelProps) {
  return (
          <Panel
            defaultSize={isCompactLayout ? 100 : 58}
            minSize={isCompactLayout ? 100 : 34}
            className={cn(
              "flex flex-col bg-[#070b12]",
              "max-lg:!flex-[1_1_100%] max-lg:!w-full",
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
                          <WorkspaceFileIcon fileName={file} />
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
                     value={files[activeFile] || ""}
                     onChange={(newCode: string) =>
                       setFiles((prev) => ({ ...prev, [activeFile]: newCode }))
                     }
                     activeFile={activeFile}
                     roomId={roomId}
                     currentUser={currentUser}
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
                defaultSize={30}
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
                           <WorkspaceVisualPreview
                             activeFile={activeFile}
                             language={language}
                             activeContent={files[activeFile] ?? code ?? ""}
                             combinedPreview={combinedPreview}
                           />
                        </TabsContent>
                        <TabsContent value="history" className="h-full m-0 bg-[#05070b]">
                          <VersionHistory
                            userId={userId}
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
                              } else {
                                setPermissionNotice("Workspace unchanged; the latest snapshot already covers this state.");
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
  );
}
