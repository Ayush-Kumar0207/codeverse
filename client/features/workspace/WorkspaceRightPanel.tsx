"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";
import dynamic from "next/dynamic";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { Panel } from "react-resizable-panels";
import ChatBox from "@/components/ChatBox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { CollaborationAccess, FullscreenPanel, PresenceUser } from "./types";
import type { useEvidenceOS } from "./useEvidenceOS";
import { EvidenceOSPanel } from "./EvidenceOSPanel";
import { WorkspaceTeamPanel } from "./WorkspaceTeamPanel";

const AlgoTraceCanvas = dynamic(() => import("@/components/algotrace/AlgoTraceCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#070b12] text-xs font-medium text-slate-500">
      Loading visualization...
    </div>
  ),
});

interface WorkspaceRightPanelProps {
  rightPanelRef: RefObject<ImperativePanelHandle | null>;
  isCompactLayout: boolean;
  isAssistantFullscreen: boolean;
  rightTab: string;
  setRightTab: Dispatch<SetStateAction<string>>;
  setRightCollapsed: Dispatch<SetStateAction<boolean>>;
  setFullscreenPanel: Dispatch<SetStateAction<FullscreenPanel>>;
  roomId: string;
  assistantContext: string;
  activeUsers: PresenceUser[];
  currentUsername?: string;
  collaborationAccess: CollaborationAccess;
  canEditWorkspace: boolean;
  isProjectOrganizer: boolean;
  inviteCopied: boolean;
  removedFromWorkspace: boolean;
  permissionNotice: string;
  handleCopyInviteLink: () => void;
  handleToggleTeamEditing: () => void;
  handleRemoveCollaborator: (collaborator: PresenceUser) => void;
  algoTraceCode: string;
  algoId?: string | null;
  presentationMode: boolean;
  visualizerMode?: string | null;
  narrationRequested: boolean;
  evidenceOS: ReturnType<typeof useEvidenceOS>;
}

export function WorkspaceRightPanel({
  rightPanelRef,
  isCompactLayout,
  isAssistantFullscreen,
  rightTab,
  setRightTab,
  setRightCollapsed,
  setFullscreenPanel,
  roomId,
  assistantContext,
  activeUsers,
  currentUsername,
  collaborationAccess,
  canEditWorkspace,
  isProjectOrganizer,
  inviteCopied,
  removedFromWorkspace,
  permissionNotice,
  handleCopyInviteLink,
  handleToggleTeamEditing,
  handleRemoveCollaborator,
  algoTraceCode,
  algoId,
  presentationMode,
  visualizerMode,
  narrationRequested,
  evidenceOS,
}: WorkspaceRightPanelProps) {
  return (
          <Panel
            ref={rightPanelRef}
            defaultSize={isCompactLayout ? 0 : 27}
            minSize={isCompactLayout ? 0 : 22}
            maxSize={38}
            collapsible
            collapsedSize={0}
            onCollapse={() => setRightCollapsed(true)}
            onExpand={() => setRightCollapsed(false)}
            className={cn(
              "flex flex-col border-l border-slate-800 bg-[#0a0f19]",
              !isAssistantFullscreen && "max-lg:hidden",
              isAssistantFullscreen && "fixed inset-0 z-50 h-screen !w-screen !flex-none border border-slate-800 shadow-2xl shadow-black/60"
            )}
          >
            <Tabs value={rightTab} onValueChange={setRightTab} className="flex h-full min-h-0 flex-col">
              <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-800 px-1 xl:px-3">
                <TabsList className="h-8 gap-0.5 rounded-md border border-slate-800 bg-[#070b12] p-1">
                  <TabsTrigger
                    value="assistant"
                    className="h-6 rounded px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500 data-[state=active]:bg-indigo-500/15 data-[state=active]:text-indigo-200 xl:px-3"
                  >
                    Assistant
                  </TabsTrigger>
                  <TabsTrigger
                    value="team"
                    className="h-6 rounded px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500 data-[state=active]:bg-indigo-500/15 data-[state=active]:text-indigo-200 xl:px-3"
                  >
                    Team
                  </TabsTrigger>
                  <TabsTrigger
                    value="evidence"
                    className="h-6 rounded px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500 data-[state=active]:bg-cyan-500/15 data-[state=active]:text-cyan-200 xl:px-3"
                  >
                    Proof
                  </TabsTrigger>
                  <TabsTrigger
                    value="algotrace"
                    className="h-6 rounded px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500 data-[state=active]:bg-indigo-500/15 data-[state=active]:text-indigo-200 xl:px-3"
                  >
                    Trace
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-1">
                  {(rightTab === "assistant" || rightTab === "evidence") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                      onClick={() => {
                        if (isAssistantFullscreen) {
                          setFullscreenPanel(null);
                          if (window.matchMedia("(max-width: 1023px)").matches) {
                            rightPanelRef.current?.collapse();
                            setRightCollapsed(true);
                          }
                          return;
                        }
                        rightPanelRef.current?.expand();
                        setRightCollapsed(false);
                        setFullscreenPanel("assistant");
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
                  <WorkspaceTeamPanel
                    roomId={roomId}
                    activeUsers={activeUsers}
                    currentUsername={currentUsername}
                    collaborationAccess={collaborationAccess}
                    canEdit={canEditWorkspace}
                    isOrganizer={isProjectOrganizer}
                    inviteCopied={inviteCopied}
                    removed={removedFromWorkspace}
                    notice={permissionNotice}
                    onCopyInvite={handleCopyInviteLink}
                    onToggleEditing={handleToggleTeamEditing}
                    onRemoveCollaborator={handleRemoveCollaborator}
                  />
                </TabsContent>
                <TabsContent value="evidence" className="m-0 h-full min-h-0">
                  <EvidenceOSPanel
                    snapshot={evidenceOS.snapshot}
                    twin={evidenceOS.twin}
                    challenge={evidenceOS.challenge}
                    arenaScenarios={evidenceOS.arenaScenarios}
                    arenaLeaderboard={evidenceOS.arenaLeaderboard}
                    activeArena={evidenceOS.activeArena}
                    loading={evidenceOS.loading}
                    syncing={evidenceOS.syncing}
                    offline={evidenceOS.offline}
                    notice={evidenceOS.notice}
                    coverage={evidenceOS.evidenceCoverage}
                    focusedLocation={evidenceOS.focusedLocation}
                    onCreatePackage={evidenceOS.createPackage}
                    onVerifyPackage={evidenceOS.verifyPackage}
                    onRunReview={evidenceOS.runReview}
                    onGenerateChallenge={evidenceOS.generateChallenge}
                    onSubmitUnderstanding={evidenceOS.submitUnderstanding}
                    onBranchFromEvent={evidenceOS.branchFromEvent}
                    onVerifyReplay={evidenceOS.verifyReplay}
                    onCreateArenaTemplate={evidenceOS.createArenaTemplate}
                    onStartArena={evidenceOS.startArena}
                    onBeginArena={evidenceOS.beginArena}
                    onJoinArena={evidenceOS.joinArena}
                    onMatchmakeArena={evidenceOS.matchmakeArena}
                    onRecordArenaNote={evidenceOS.recordArenaNote}
                    onSubmitArena={evidenceOS.submitArena}
                    onVerifyArenaReport={evidenceOS.verifyArenaReport}
                    onExportEvidence={evidenceOS.exportEvidence}
                  />
                </TabsContent>
                <TabsContent value="algotrace" className="m-0 h-full min-h-0">
                  <AlgoTraceCanvas
                    editorCode={algoTraceCode}
                    autoRun={Boolean(algoId)}
                    presentationMode={presentationMode}
                    preferSceneFocus={visualizerMode === "3d"}
                    autoNarrate={narrationRequested}
                    explanationHref={algoId ? `/encyclopedia?algo=${encodeURIComponent(algoId)}` : undefined}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </Panel>
  );
}