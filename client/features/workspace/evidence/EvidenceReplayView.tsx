"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  GitBranch,
  History,
  Layers3,
  Play,
  RotateCcw,
  TestTube2,
} from "lucide-react";
import type { EngineeringEvent, EngineeringReplaySession } from "@shared/types/evidence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { eventAccent } from "./EvidencePrimitives";

interface EvidenceReplayViewProps {
  events: EngineeringEvent[];
  sessions: EngineeringReplaySession[];
  syncing: boolean;
  onBranchFromEvent: (event: EngineeringEvent) => Promise<boolean>;
  onVerifyReplay: (sessionId: string) => Promise<boolean>;
}

export function EvidenceReplayView({ events, sessions, syncing, onBranchFromEvent, onVerifyReplay }: EvidenceReplayViewProps) {
  const replayEvents = useMemo(() => [...events].sort((left, right) => left.sequence - right.sequence), [events]);
  const [index, setIndex] = useState(Math.max(0, replayEvents.length - 1));
  const [compareIndex, setCompareIndex] = useState(0);
  const [showCompare, setShowCompare] = useState(false);
  const selected = replayEvents[index];
  const comparison = replayEvents[compareIndex];
  const replaySession = sessions.find((session) => session.sessionId === selected?.sessionId) || sessions.at(-1);
  const selectedFrame = replaySession?.frames.find((frame) => frame.eventId === selected?.id);
  const comparisonFrame = replaySession?.frames.find((frame) => frame.eventId === comparison?.id);
  const changedFiles = selectedFrame && comparisonFrame
    ? [...new Set([...Object.keys(selectedFrame.files), ...Object.keys(comparisonFrame.files)])]
        .filter((name) => selectedFrame.files[name] !== comparisonFrame.files[name])
    : [];

  useEffect(() => setIndex(Math.max(0, replayEvents.length - 1)), [replayEvents.length]);

  return (
    <div className="space-y-4 p-2 lg:p-0">
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_40%),rgba(255,255,255,0.025)] p-5 lg:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-200">
              <History className="h-4 w-4" /> Change replay
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">Travel through the work, one moment at a time.</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Select any recorded moment to see what happened, who made it, and whether you can safely branch from there.
            </p>
          </div>
          <Badge className="h-8 rounded-lg border-indigo-400/20 bg-indigo-400/10 px-3 text-xs text-indigo-100">
            Moment {selected?.sequence || 0} of {replayEvents.length}
          </Badge>
        </div>

        <div className="mt-6">
          <div className="relative h-10">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />
            <div
              className="absolute left-0 top-1/2 h-px bg-indigo-300 transition-all"
              style={{ width: replayEvents.length > 1 ? (index / (replayEvents.length - 1)) * 100 + "%" : "0%" }}
            />
            <input
              aria-label="Replay engineering session"
              type="range"
              min={0}
              max={Math.max(0, replayEvents.length - 1)}
              value={Math.min(index, Math.max(0, replayEvents.length - 1))}
              onChange={(event) => setIndex(Number(event.target.value))}
              className="absolute inset-0 z-10 w-full cursor-pointer opacity-0"
            />
            {replayEvents.slice(-12).map((event) => {
              const eventIndex = replayEvents.findIndex((item) => item.id === event.id);
              const left = replayEvents.length > 1 ? (eventIndex / (replayEvents.length - 1)) * 100 : 0;
              return (
                <span
                  key={event.id}
                  className={cn(
                    "absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition",
                    eventIndex === index ? "h-5 w-5 border-indigo-200 bg-indigo-400 shadow-[0_0_18px_rgba(129,140,248,.55)]" : eventIndex < index ? "border-indigo-300 bg-[#0a101b]" : "border-slate-700 bg-[#0a101b]"
                  )}
                  style={{ left: left + "%" }}
                />
              );
            })}
          </div>
          <div className="mt-1 flex items-center justify-between">
            <button
              aria-label="Previous evidence event"
              disabled={index <= 0}
              onClick={() => setIndex((value) => Math.max(0, value - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-slate-500">
              {selected ? new Date(selected.occurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "No recorded moments"}
            </span>
            <button
              aria-label="Next evidence event"
              disabled={index >= replayEvents.length - 1}
              onClick={() => setIndex((value) => Math.min(replayEvents.length - 1, value + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>


      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,.75fr)]">
        {selected ? (
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="flex items-start justify-between gap-3">
              <Badge className={cn("rounded-lg border px-2.5 py-1 text-[10px]", eventAccent(selected.type))}>{selected.type}</Badge>
              <span className="text-[11px] text-slate-600">{selected.source}</span>
            </div>
            <h3 className="mt-5 text-xl font-semibold leading-7 text-white">{selected.summary}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{selected.actor.kind === "ai" ? "AI collaborator" : selected.actor.name}</span>
              {selected.fileName && <><span>•</span><span>{selected.fileName}</span></>}
              {selectedFrame?.cursor && <><span>•</span><span>line {selectedFrame.cursor.lineNumber}</span></>}
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                disabled={!selected.payload.files || syncing}
                onClick={() => void onBranchFromEvent(selected)}
                className="h-10 rounded-xl bg-indigo-500 px-4 text-xs font-semibold text-white hover:bg-indigo-400"
              >
                <GitBranch className="mr-2 h-4 w-4" /> Continue from this moment
              </Button>
              {replayEvents.length > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setShowCompare((value) => !value)}
                  className="h-10 rounded-xl border-white/10 bg-transparent px-4 text-xs text-slate-300 hover:bg-white/[0.05]"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Compare with another moment
                </Button>
              )}
            </div>

            {showCompare && replayEvents.length > 1 && (
              <div className="mt-5 rounded-xl border border-indigo-400/15 bg-indigo-400/[0.035] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Layers3 className="h-4 w-4 text-indigo-200" /> What changed between these moments?
                </div>
                <input
                  aria-label="Comparison evidence event"
                  type="range"
                  min={0}
                  max={Math.max(0, replayEvents.length - 1)}
                  value={Math.min(compareIndex, replayEvents.length - 1)}
                  onChange={(event) => setCompareIndex(Number(event.target.value))}
                  className="mt-4 w-full accent-indigo-400"
                />
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Moment {comparison?.sequence || 0}</span>
                  <span>{changedFiles.length} file{changedFiles.length === 1 ? "" : "s"} changed</span>
                  <span>Moment {selected.sequence}</span>
                </div>
                {!!changedFiles.length && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {changedFiles.map((fileName) => (
                      <Badge key={fileName} className="border-white/[0.08] bg-black/20 font-mono text-[10px] text-slate-400">{fileName}</Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <details className="group mt-5 rounded-xl border border-white/[0.07] bg-black/15">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-medium text-slate-400">
                Technical event details
                <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              </summary>
              <div className="border-t border-white/[0.07] p-4">
                <div className="text-[10px] text-slate-600">Integrity hash</div>
                <div className="mt-1 truncate font-mono text-[10px] text-emerald-300/80">SHA-256 {selected.integrityHash}</div>
              </div>
            </details>
          </section>
        ) : (
          <section className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-slate-500">
            Your recorded moments will appear here.
          </section>
        )}

        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3">
          <div className="px-2 py-2">
            <h3 className="text-sm font-semibold text-white">Session moments</h3>
            <p className="mt-1 text-xs text-slate-500">Choose a moment to inspect it.</p>
          </div>
          <div className="mt-2 max-h-[430px] space-y-1.5 overflow-y-auto pr-1">
            {replayEvents.slice(-12).reverse().map((event) => (
              <button
                key={event.id}
                onClick={() => setIndex(replayEvents.findIndex((candidate) => candidate.id === event.id))}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition",
                  selected?.id === event.id
                    ? "border-indigo-400/20 bg-indigo-400/[0.08]"
                    : "border-transparent bg-black/10 hover:border-white/[0.07] hover:bg-white/[0.035]"
                )}
              >
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border", eventAccent(event.type))}>
                  {event.type.startsWith("code") ? <Play className="h-3.5 w-3.5" /> : event.type.startsWith("test") ? <TestTube2 className="h-3.5 w-3.5" /> : <CircleDashed className="h-3.5 w-3.5" />}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs text-slate-300">{event.summary}</div>
                  <div className="mt-1 text-[10px] text-slate-600">Moment {event.sequence} · {event.type}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>


      {replaySession && (
        <section className={cn(
          "rounded-2xl border p-5",
          replaySession.deterministic ? "border-emerald-400/15 bg-emerald-400/[0.025]" : "border-amber-400/15 bg-amber-400/[0.025]"
        )}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                replaySession.deterministic
                  ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-200"
                  : "border-amber-400/15 bg-amber-400/10 text-amber-200"
              )}>
                {replaySession.deterministic ? <CheckCircle2 className="h-4 w-4" /> : <CircleDashed className="h-4 w-4" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {replaySession.deterministic ? "This session can be recreated exactly" : "This session needs more information"}
                </h3>
                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                  {replaySession.deterministic
                    ? "The runtime and required inputs were captured, so CodeVerse can safely re-run the work."
                    : "Capture the missing inputs before relying on an exact replay: " + replaySession.missingInputs.join(", ")}
                </p>
              </div>
            </div>
            <Button
              disabled={syncing || !replaySession.deterministic}
              onClick={() => void onVerifyReplay(replaySession.sessionId)}
              className="h-10 shrink-0 rounded-xl bg-emerald-400 px-4 text-xs font-semibold text-emerald-950 hover:bg-emerald-300"
            >
              <Play className="mr-2 h-4 w-4" /> Re-run this session
            </Button>
          </div>
          <details className="group mt-4 rounded-xl border border-white/[0.07] bg-black/15">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-medium text-slate-400">
              Reproducibility manifest
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <div className="grid gap-3 border-t border-white/[0.07] p-4 sm:grid-cols-3">
              <div>
                <div className="text-[10px] text-slate-600">Runtime</div>
                <div className="mt-1 line-clamp-2 text-xs text-slate-300">{replaySession.manifest.runtime}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-600">Lockfile</div>
                <div className="mt-1 truncate font-mono text-[10px] text-slate-300">{replaySession.manifest.lockfileHash || "Not captured"}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-600">Replay digest</div>
                <div className="mt-1 truncate font-mono text-[10px] text-slate-300">{replaySession.replayDigest}</div>
              </div>
            </div>
          </details>
        </section>
      )}
    </div>
  );
}

