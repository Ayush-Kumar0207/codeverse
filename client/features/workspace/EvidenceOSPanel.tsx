"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  History,
  Network,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Trophy,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isReviewPreview } from "./evidence/EvidencePrimitives";
function EvidenceFeatureLoading() {
  return (
    <div className="grid min-h-[280px] place-items-center rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8">
      <div className="w-full max-w-sm space-y-3" role="status" aria-label="Loading selected proof tool">
        <div className="h-2 w-24 animate-pulse rounded-full bg-cyan-300/35" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-white/10" />
        <div className="h-3 w-3/5 animate-pulse rounded-full bg-white/[0.07]" />
      </div>
    </div>
  );
}

const EvidenceProofView = dynamic(
  () => import("./evidence/EvidenceProofView").then((module) => module.EvidenceProofView),
  { ssr: false, loading: EvidenceFeatureLoading }
);
const EvidenceReplayView = dynamic(
  () => import("./evidence/EvidenceReplayView").then((module) => module.EvidenceReplayView),
  { ssr: false, loading: EvidenceFeatureLoading }
);
const EvidenceBoardView = dynamic(
  () => import("./evidence/EvidenceBoardView").then((module) => module.EvidenceBoardView),
  { ssr: false, loading: EvidenceFeatureLoading }
);
const EvidenceVerifyView = dynamic(
  () => import("./evidence/EvidenceVerifyTwinViews").then((module) => module.EvidenceVerifyView),
  { ssr: false, loading: EvidenceFeatureLoading }
);
const EvidenceTwinView = dynamic(
  () => import("./evidence/EvidenceVerifyTwinViews").then((module) => module.EvidenceTwinView),
  { ssr: false, loading: EvidenceFeatureLoading }
);
const EvidenceArenaView = dynamic(
  () => import("./evidence/EvidenceArenaView").then((module) => module.EvidenceArenaView),
  { ssr: false, loading: EvidenceFeatureLoading }
);

type EvidenceSection = "proof" | "replay" | "board" | "verify" | "twin" | "arena";

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
  expanded?: boolean;
  onRequestExpanded?: () => void;
  onCreatePackage: (input: { title: string; requirement: string; rationale: string; rollback: string }) => Promise<void>;
  onVerifyPackage: (packageId: string) => Promise<boolean>;
  onRunReview: (requirement: string, rollback: string) => Promise<void>;
  onGenerateChallenge: () => Promise<UnderstandingChallenge>;
  onSubmitUnderstanding: (answers: Record<string, string>) => Promise<unknown>;
  onBranchFromEvent: (event: EngineeringEvent) => Promise<boolean>;
  onVerifyReplay: (sessionId: string) => Promise<boolean>;
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

const sectionMeta: Array<{
  value: EvidenceSection;
  title: string;
  technical: string;
  description: string;
  icon: typeof PackageCheck;
  tone: string;
}> = [
  {
    value: "proof",
    title: "Prove my work",
    technical: "Attestation",
    description: "Package what changed, why it changed, and how to undo it safely.",
    icon: PackageCheck,
    tone: "text-cyan-200 bg-cyan-400/10 border-cyan-400/20",
  },
  {
    value: "replay",
    title: "Replay changes",
    technical: "Replay",
    description: "Step through the session and return to any recorded moment.",
    icon: History,
    tone: "text-indigo-200 bg-indigo-400/10 border-indigo-400/20",
  },
  {
    value: "board",
    title: "Get an AI review",
    technical: "Review board",
    description: "Ask multiple reviewers to challenge the same change from different angles.",
    icon: Bot,
    tone: "text-violet-200 bg-violet-400/10 border-violet-400/20",
  },
  {
    value: "verify",
    title: "Check understanding",
    technical: "Verification",
    description: "Confirm that the person behind the change can explain and defend it.",
    icon: BrainCircuit,
    tone: "text-emerald-200 bg-emerald-400/10 border-emerald-400/20",
  },
  {
    value: "twin",
    title: "See what could break",
    technical: "Project twin",
    description: "Preview affected files, tests, and risks before the change ships.",
    icon: Network,
    tone: "text-sky-200 bg-sky-400/10 border-sky-400/20",
  },
  {
    value: "arena",
    title: "Practice a scenario",
    technical: "Arena",
    description: "Run a guided engineering challenge alone or with a team.",
    icon: Trophy,
    tone: "text-amber-200 bg-amber-400/10 border-amber-400/20",
  },
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
  expanded = false,
  onRequestExpanded,
  onCreatePackage,
  onVerifyPackage,
  onRunReview,
  onGenerateChallenge,
  onSubmitUnderstanding,
  onBranchFromEvent,
  onVerifyReplay,
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
  const [section, setSection] = useState<EvidenceSection | null>(null);
  const latestPackage = snapshot.packages.at(-1);
  const latestReview = snapshot.reviews.at(-1);
  const completedReviewCount = snapshot.reviews.filter((review) => !isReviewPreview(review)).length;
  const activeMeta = sectionMeta.find((item) => item.value === section);
  const readiness = coverage >= 85 ? "Ready to share" : coverage >= 60 ? "Nearly ready" : "Needs attention";

  const openSection = (nextSection: EvidenceSection) => {
    setSection(nextSection);
    onRequestExpanded?.();
  };

  const returnToOverview = () => {
    setSection(null);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#080d16]">
        <div className="flex flex-col items-center gap-3 text-sm text-slate-400">
          <RefreshCw className="h-5 w-5 animate-spin text-cyan-300" />
          Preparing your proof center…
        </div>
      </div>
    );
  }

  const activeView = section === "proof" ? (
    <EvidenceProofView snapshot={snapshot} coverage={coverage} focusedLocation={focusedLocation} syncing={syncing} onCreatePackage={onCreatePackage} onVerifyPackage={onVerifyPackage} />
  ) : section === "replay" ? (
    <EvidenceReplayView events={snapshot.events} sessions={snapshot.replay} syncing={syncing} onBranchFromEvent={onBranchFromEvent} onVerifyReplay={onVerifyReplay} />
  ) : section === "board" ? (
    <EvidenceBoardView latestPackage={latestPackage} latestReview={latestReview} syncing={syncing} onRunReview={onRunReview} />
  ) : section === "verify" ? (
    <EvidenceVerifyView challenge={challenge} latestVerification={snapshot.verifications.at(-1)} syncing={syncing} onGenerateChallenge={onGenerateChallenge} onSubmitUnderstanding={onSubmitUnderstanding} />
  ) : section === "twin" ? (
    <EvidenceTwinView twin={twin} />
  ) : section === "arena" ? (
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
  ) : null;


  return (
    <div className="flex h-full min-h-0 flex-col bg-[#080d16] text-slate-100">
      <header className="shrink-0 border-b border-white/[0.07] bg-[#0a101b]/95 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {section ? (
              <button
                type="button"
                onClick={returnToOverview}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100"
                aria-label="Back to Proof Center"
                title="Back to Proof Center"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-white">{activeMeta?.title || "Proof Center"}</h2>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {activeMeta?.description || "Understand what changed and whether it is ready to share."}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {!section && (
              <Badge className={cn(
                "hidden h-7 rounded-lg border px-2.5 text-[10px] font-medium sm:inline-flex",
                snapshot.integrity.verified
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                  : "border-rose-400/20 bg-rose-400/10 text-rose-200"
              )}>
                <Check className="mr-1.5 h-3 w-3" />
                {snapshot.integrity.verified ? "Chain verified" : "Check failed"}
              </Badge>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              title="Export a privacy-safe proof report"
              aria-label="Export evidence report"
              onClick={() => void onExportEvidence("redacted")}
              className="h-9 rounded-xl border-white/10 bg-white/[0.03] px-3 text-xs text-slate-300 hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100"
            >
              <Download className="h-3.5 w-3.5 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </header>

      {!section ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn("mx-auto space-y-5 p-4", expanded ? "max-w-6xl sm:p-6 lg:p-8" : "max-w-2xl")}>
            <section className={cn(
              "overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.11),transparent_42%),linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.015))]",
              expanded ? "p-7" : "p-5"
            )}>
              <div className={cn("flex flex-col gap-5", expanded && "lg:flex-row lg:items-end lg:justify-between")}>
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    {readiness}
                  </div>
                  <h3 className={cn("mt-3 font-semibold tracking-tight text-white", expanded ? "text-xl lg:text-3xl" : "text-xl")}>
                    {coverage}% of this change is explained.
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                    CodeVerse has linked the change to its execution history, review, understanding, and recovery plan.
                  </p>
                </div>
                <div className="flex min-w-[220px] items-center gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-cyan-100"
                    style={{ background: "radial-gradient(circle at center, #0a101b 54%, transparent 56%), conic-gradient(#22d3ee " + coverage + "%, rgba(148,163,184,.12) 0)" }}
                    aria-label={"Evidence coverage " + coverage + "%"}
                  >
                    {coverage}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Proof coverage</div>
                    <div className="mt-0.5 text-xs text-slate-500">Updates as evidence is added</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-5">
                {[
                  [snapshot.events.length, "Recorded events"],
                  [snapshot.integrity.checkedEvents, "Sealed events"],
                  [completedReviewCount, "Completed reviews"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <div className="text-lg font-semibold text-white">{value}</div>
                    <div className="mt-0.5 text-[11px] leading-4 text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </section>


            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-white">What would you like to do?</h3>
                <p className="mt-1 text-xs text-slate-500">Choose a goal. CodeVerse will open only the tools you need.</p>
              </div>
              <div className={cn("grid gap-3", expanded ? "md:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2")}>
                {sectionMeta.map(({ value, title, technical, description, icon: Icon, tone }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => openSection(value)}
                    className="group flex min-h-36 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-black/20"
                    aria-label={title + " — " + technical}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", tone)}>
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-slate-300" />
                    </div>
                    <div className="mt-4 text-sm font-semibold text-white">{title}</div>
                    <p className="mt-1.5 text-xs leading-5 text-slate-500">{description}</p>
                    <span className="mt-auto pt-3 text-[10px] font-medium text-slate-600">{technical}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className={cn("grid gap-3", expanded && "lg:grid-cols-2")}>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Latest proof package</h3>
                    <p className="mt-1 text-xs text-slate-500">{latestPackage?.title || "No package created yet"}</p>
                  </div>
                  <Badge className={cn(
                    "rounded-lg border px-2 py-1 text-[10px]",
                    latestPackage?.status === "ready"
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                      : "border-amber-400/20 bg-amber-400/10 text-amber-200"
                  )}>
                    {latestPackage ? latestPackage.score + "%" : "Not started"}
                  </Badge>
                </div>
                <button onClick={() => openSection("proof")} className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-cyan-200 hover:text-cyan-100">
                  Review package <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-indigo-300" />
                  <h3 className="text-sm font-semibold text-white">Recent activity</h3>
                </div>
                <div className="mt-3 space-y-2">
                  {snapshot.events.slice(-2).reverse().map((event) => (
                    <div key={event.id} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300" />
                      <span className="line-clamp-1">{event.summary}</span>
                    </div>
                  ))}
                  {!snapshot.events.length && <p className="text-xs text-slate-500">Your recorded changes will appear here.</p>}
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {expanded && (
            <aside className="hidden w-60 shrink-0 flex-col border-r border-white/[0.07] bg-[#090e18] p-3 xl:flex">
              <div className="px-2 pb-2 pt-1 text-[11px] font-medium text-slate-500">Proof tools</div>
              <nav className="space-y-1" aria-label="Proof tools">
                {sectionMeta.map(({ value, title, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSection(value)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                      section === value
                        ? "bg-cyan-400/10 text-cyan-100"
                        : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{title}</span>
                  </button>
                ))}
              </nav>
              <button
                type="button"
                onClick={returnToOverview}
                className="mt-auto flex items-center gap-2 rounded-xl border border-white/[0.08] px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Overview
              </button>
            </aside>
          )}
          <main className="min-w-0 flex-1 overflow-y-auto bg-[#080d16]">
            <div className={cn("mx-auto", expanded ? "max-w-6xl p-3 lg:p-6" : "max-w-2xl")}>{activeView}</div>
          </main>
        </div>
      )}

      {(notice || syncing || offline) && (
        <div role="status" className="shrink-0 border-t border-white/[0.07] bg-[#0a101b] px-4 py-2.5 text-xs text-slate-500">
          {syncing ? "Saving and sealing your latest evidence…" : notice || "Working locally — your proof will sync when the connection returns."}
        </div>
      )}
    </div>
  );
}
