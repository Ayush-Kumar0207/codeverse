"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";
import dynamic from "next/dynamic";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { Bot, ChevronRight, Maximize2, Minimize2, ShieldCheck, Users, Workflow } from "lucide-react";
import { Panel } from "react-resizable-panels";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { CollaborationAccess, FullscreenPanel, PresenceUser } from "./types";
import type { useEvidenceOS } from "./useEvidenceOS";

const AlgoTraceCanvas = dynamic(() => import("@/components/algotrace/AlgoTraceCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#070b12] text-xs font-medium text-slate-500">
      Loading visualization...
    </div>
  ),
});const ChatBox = dynamic(() => import("@/components/ChatBox"), {
  ssr: false,
  loading: () => <RightToolLoading label="Opening AI assistant" />,
});
const WorkspaceTeamPanel = dynamic(
  () => import("./WorkspaceTeamPanel").then((module) => module.WorkspaceTeamPanel),
  { ssr: false, loading: () => <RightToolLoading label="Opening team space" /> }
);
const EvidenceOSPanel = dynamic(
  () => import("./EvidenceOSPanel").then((module) => module.EvidenceOSPanel),
  { ssr: false, loading: () => <RightToolLoading label="Opening Proof Center" /> }
);

function RightToolLoading({ label }: { label: string }) {
  return (
    <div className="grid h-full min-h-[240px] place-items-center bg-[#090e18] p-6" role="status">
      <div className="w-full max-w-xs space-y-3">
        <div className="h-2 w-20 animate-pulse rounded-full bg-cyan-300/35" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-white/10" />
        <p className="text-xs font-medium text-slate-500">{label}…</p>
      </div>
    </div>
  );
}

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
              "flex flex-col border-l border-white/[0.07] bg-[#090e18]",
              !isAssistantFullscreen && "max-lg:hidden",
              isAssistantFullscreen && "fixed inset-0 z-50 h-screen !w-screen !flex-none border border-slate-800 shadow-2xl shadow-black/60"
            )}
          >
            <Tabs value={rightTab} onValueChange={setRightTab} className="flex h-full min-h-0 flex-col">
              <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-white/[0.07] bg-[#090e18]/95 px-2 backdrop-blur-xl">
                <TabsList className="h-9 gap-0.5 rounded-xl border border-white/[0.07] bg-black/20 p-1">
                  <TabsTrigger
                    value="assistant"
                    className="h-7 gap-1.5 rounded-lg px-2 text-[11px] font-medium text-slate-500 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white xl:px-3"
                  >
                    <Bot className="h-3.5 w-3.5" /> AI
                  </TabsTrigger>
                  <TabsTrigger
                    value="team"
                    className="h-7 gap-1.5 rounded-lg px-2 text-[11px] font-medium text-slate-500 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white xl:px-3"
                  >
                    <Users className="h-3.5 w-3.5" /> Team
                  </TabsTrigger>
                  <TabsTrigger
                    value="evidence"
                    className="h-7 gap-1.5 rounded-lg px-2 text-[11px] font-medium text-slate-500 data-[state=active]:bg-cyan-400/10 data-[state=active]:text-cyan-100 xl:px-3"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" /> Proof
                  </TabsTrigger>
                  <TabsTrigger
                    value="algotrace"
                    className="h-7 gap-1.5 rounded-lg px-2 text-[11px] font-medium text-slate-500 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white xl:px-3"
                  >
                    <Workflow className="h-3.5 w-3.5" /> Trace
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
                      aria-label={isAssistantFullscreen ? "Return tools to side panel" : "Expand current tool"}
                      title={isAssistantFullscreen ? "Return to workspace" : "Open in focused view"}
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
                    expanded={isAssistantFullscreen}
                    onRequestExpanded={() => {
                      rightPanelRef.current?.expand();
                      setRightCollapsed(false);
                      setFullscreenPanel("assistant");
                    }}
                    onReturnOverview={() => {
                      if (!isCompactLayout) setFullscreenPanel(null);
                    }}
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
