"use client";

import { useState } from "react";
import { BrainCircuit, Bot, Check, History, Network, PackageCheck, RefreshCw, ShieldCheck, Trophy, Download } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { EvidenceProofView } from "./evidence/EvidenceProofView";
import { EvidenceReplayView } from "./evidence/EvidenceReplayView";
import { EvidenceBoardView } from "./evidence/EvidenceBoardView";
import { EvidenceTwinView, EvidenceVerifyView } from "./evidence/EvidenceVerifyTwinViews";
import { EvidenceArenaView } from "./evidence/EvidenceArenaView";

interface EvidenceOSPanelProps {
  snapshot: EvidenceOSSnapshot;
  twin: EngineeringDigitalTwin;
  challenge: UnderstandingChallenge | null;
  arenaScenarios: ArenaScenario[];
  arenaLeaderboard: ArenaLeaderboardEntry[];
  activeArena: ArenaSession | null;
  loading: boolean;
  syncing: boolean;
  offline: boolean;
  notice: string;
  coverage: number;
  focusedLocation: { fileName: string; lineNumber: number; column: number } | null;
  onCreatePackage: (input: { title: string; requirement: string; rationale: string; rollback: string }) => Promise<void>;
  onVerifyPackage: (packageId: string) => Promise<boolean>;
  onRunReview: (requirement: string, rollback: string) => Promise<void>;
  onGenerateChallenge: () => Promise<UnderstandingChallenge>;
  onSubmitUnderstanding: (answers: Record<string, string>) => Promise<unknown>;
  onBranchFromEvent: (event: EngineeringEvent) => Promise<boolean>;
  onCreateArenaTemplate: (input: ArenaScenarioTemplateInput) => Promise<ArenaScenario>;
  onStartArena: (scenarioId: string, privacyMode: "full" | "redacted", teamLobby?: boolean) => Promise<boolean>;
  onBeginArena: () => Promise<boolean>;
  onJoinArena: (lobbyCode: string) => Promise<boolean>;
  onMatchmakeArena: (scenarioId: string, privacyMode: "full" | "redacted") => Promise<boolean>;
  onRecordArenaNote: (summary: string) => Promise<void>;
  onSubmitArena: () => Promise<unknown>;
  onVerifyArenaReport: (sessionId: string) => Promise<boolean>;
  onExportEvidence: (privacy?: "full" | "redacted") => Promise<void>;
}

const sectionTabs = [
  { value: "proof", label: "Attestation", icon: PackageCheck },
  { value: "replay", label: "Replay", icon: History },
  { value: "board", label: "Board", icon: Bot },
  { value: "verify", label: "Verify", icon: BrainCircuit },
  { value: "twin", label: "Twin", icon: Network },
  { value: "arena", label: "Arena", icon: Trophy },
];

export function EvidenceOSPanel({
  snapshot,
  twin,
  challenge,
  arenaScenarios,
  arenaLeaderboard,
  activeArena,
  loading,
  syncing,
  offline,
  notice,
  coverage,
  focusedLocation,
  onCreatePackage,
  onVerifyPackage,
  onRunReview,
  onGenerateChallenge,
  onSubmitUnderstanding,
  onBranchFromEvent,
  onCreateArenaTemplate,
  onStartArena,
  onBeginArena,
  onJoinArena,
  onMatchmakeArena,
  onRecordArenaNote,
  onSubmitArena,
  onVerifyArenaReport,
  onExportEvidence,
}: EvidenceOSPanelProps) {
  const [section, setSection] = useState("proof");

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#080d16]">
        <div className="flex flex-col items-center gap-3 text-xs text-slate-400">
          <RefreshCw className="h-5 w-5 animate-spin text-cyan-300" />
          Reconstructing engineering evidence
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#080d16] text-slate-100">
      <div className="shrink-0 border-b border-slate-800 bg-[linear-gradient(135deg,rgba(34,211,238,0.08),transparent_50%,rgba(99,102,241,0.08))] px-3 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan-400/20 bg-cyan-400/10">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-wide">EvidenceOS</div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500">Trustworthy engineering</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              title="Export redacted evidence report"
              aria-label="Export evidence report"
              onClick={() => void onExportEvidence("redacted")}
              className="rounded border border-slate-700 bg-slate-900 p-1 text-slate-400 hover:text-cyan-200"
            >
              <Download className="h-3 w-3" />
            </button>
            <Badge className={cn(
              "h-5 rounded border px-1.5 text-[8px] uppercase tracking-widest",
              offline ? "border-amber-400/25 bg-amber-400/10 text-amber-200" : "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
            )}>
              {offline ? "Local proof" : "Synced proof"}
            </Badge>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[9px] text-slate-500">
          <span className={cn("flex items-center gap-1", snapshot.integrity.verified ? "text-emerald-300" : "text-rose-300")}>
            <Check className="h-3 w-3" />
            Chain {snapshot.integrity.verified ? "verified" : "broken"}
          </span>
          <span>•</span><span>{snapshot.events.length} events</span>
          <span>•</span><span>{snapshot.integrity.checkedEvents} sealed</span>
        </div>
      </div>

      <Tabs value={section} onValueChange={setSection} className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 overflow-x-auto border-b border-slate-800 px-2 no-scrollbar">
          <TabsList className="h-10 w-max min-w-full gap-0.5 rounded-none bg-transparent p-0">
            {sectionTabs.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="h-8 gap-1 rounded px-2 text-[9px] uppercase tracking-wider text-slate-500 data-[state=active]:bg-cyan-400/10 data-[state=active]:text-cyan-200"
              >
                <Icon className="h-3 w-3" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <TabsContent value="proof" className="m-0">
            <EvidenceProofView snapshot={snapshot} coverage={coverage} focusedLocation={focusedLocation} syncing={syncing} onCreatePackage={onCreatePackage} onVerifyPackage={onVerifyPackage} />
          </TabsContent>
          <TabsContent value="replay" className="m-0">
            <EvidenceReplayView events={snapshot.events} sessions={snapshot.replay} syncing={syncing} onBranchFromEvent={onBranchFromEvent} />
          </TabsContent>
          <TabsContent value="board" className="m-0">
            <EvidenceBoardView latestPackage={snapshot.packages.at(-1)} latestReview={snapshot.reviews.at(-1)} syncing={syncing} onRunReview={onRunReview} />
          </TabsContent>
          <TabsContent value="verify" className="m-0">
            <EvidenceVerifyView challenge={challenge} latestVerification={snapshot.verifications.at(-1)} syncing={syncing} onGenerateChallenge={onGenerateChallenge} onSubmitUnderstanding={onSubmitUnderstanding} />
          </TabsContent>
          <TabsContent value="twin" className="m-0">
            <EvidenceTwinView twin={twin} />
          </TabsContent>
          <TabsContent value="arena" className="m-0">
            <EvidenceArenaView
              scenarios={arenaScenarios}
              sessions={snapshot.arenas}
              leaderboard={arenaLeaderboard}
              activeArena={activeArena}
              syncing={syncing}
              onCreateTemplate={onCreateArenaTemplate}
              onStart={onStartArena}
              onBegin={onBeginArena}
              onJoin={onJoinArena}
              onMatchmake={onMatchmakeArena}
              onRecordNote={onRecordArenaNote}
              onSubmit={onSubmitArena}
              onVerifyReport={onVerifyArenaReport}
            />
          </TabsContent>
        </div>
      </Tabs>

      {(notice || syncing) && (
        <div role="status" className="shrink-0 border-t border-slate-800 bg-[#0b121e] px-3 py-2 text-[9px] leading-relaxed text-slate-400">
          {syncing ? "Sealing engineering evidence…" : notice}
        </div>
      )}
    </div>
  );
}

