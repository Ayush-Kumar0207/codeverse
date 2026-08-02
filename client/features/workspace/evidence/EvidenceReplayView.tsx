"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CircleDashed, GitBranch, Play, RotateCcw, TestTube2 } from "lucide-react";
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
}

export function EvidenceReplayView({ events, sessions, syncing, onBranchFromEvent }: EvidenceReplayViewProps) {
  const replayEvents = useMemo(() => [...events].sort((left, right) => left.sequence - right.sequence), [events]);
  const [index, setIndex] = useState(Math.max(0, replayEvents.length - 1));
  const [compareIndex, setCompareIndex] = useState(0);
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
    <div className="space-y-3 p-3">
      <section className="rounded-lg border border-slate-800 bg-[#0b121e] p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">Session replay</h3>
            <p className="mt-0.5 text-[9px] text-slate-500">Causal history between commits</p>
          </div>
          <Badge className="border-cyan-400/20 bg-cyan-400/10 text-[8px] text-cyan-200">#{selected?.sequence || 0}</Badge>
        </div>
        <input
          aria-label="Replay engineering session"
          type="range"
          min={0}
          max={Math.max(0, replayEvents.length - 1)}
          value={Math.min(index, Math.max(0, replayEvents.length - 1))}
          onChange={(event) => setIndex(Number(event.target.value))}
          className="mt-4 w-full accent-cyan-400"
        />
        <div className="mt-2 flex items-center justify-between">
          <button
            aria-label="Previous evidence event"
            disabled={index <= 0}
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            className="rounded border border-slate-700 p-1 text-slate-400 disabled:opacity-30"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-[9px] text-slate-500">
            {selected ? new Date(selected.occurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "No events"}
          </span>
          <button
            aria-label="Next evidence event"
            disabled={index >= replayEvents.length - 1}
            onClick={() => setIndex((value) => Math.min(replayEvents.length - 1, value + 1))}
            className="rounded border border-slate-700 p-1 text-slate-400 disabled:opacity-30"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      {replaySession && (
        <section className={cn(
          "rounded-lg border p-3",
          replaySession.deterministic ? "border-emerald-400/20 bg-emerald-400/[0.04]" : "border-amber-400/20 bg-amber-400/[0.04]"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">Reproducibility manifest</div>
              <div className="mt-1 text-[10px] text-slate-300">{replaySession.manifest.runtime}</div>
            </div>
            <Badge className={cn(
              "border text-[7px] uppercase",
              replaySession.deterministic ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200" : "border-amber-400/25 bg-amber-400/10 text-amber-200"
            )}>
              {replaySession.deterministic ? "Deterministic" : "Inputs missing"}
            </Badge>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[8px]">
            <div className="rounded border border-slate-800 bg-[#080d16] p-2">
              <span className="text-slate-600">Lockfile</span>
              <div className="mt-1 truncate font-mono text-slate-300">{replaySession.manifest.lockfileHash || "not captured"}</div>
            </div>
            <div className="rounded border border-slate-800 bg-[#080d16] p-2">
              <span className="text-slate-600">Replay digest</span>
              <div className="mt-1 truncate font-mono text-slate-300">{replaySession.replayDigest}</div>
            </div>
          </div>
          {!replaySession.deterministic && (
            <div className="mt-2 text-[8px] leading-relaxed text-amber-200/70">
              Missing: {replaySession.missingInputs.join(", ")}
            </div>
          )}
          {selectedFrame?.cursor && (
            <div className="mt-2 text-[8px] text-cyan-200">
              Cursor {selectedFrame.cursor.fileName}:{selectedFrame.cursor.lineNumber}:{selectedFrame.cursor.column}
            </div>
          )}
        </section>
      )}

      {replayEvents.length > 1 && (
        <section className="rounded-lg border border-slate-800 bg-[#0b121e] p-3">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-slate-500">
            <RotateCcw className="h-3.5 w-3.5" /> Compare alternate moments
          </div>
          <input
            aria-label="Comparison evidence event"
            type="range"
            min={0}
            max={Math.max(0, replayEvents.length - 1)}
            value={Math.min(compareIndex, replayEvents.length - 1)}
            onChange={(event) => setCompareIndex(Number(event.target.value))}
            className="mt-3 w-full accent-indigo-400"
          />
          <div className="mt-2 text-[8px] text-slate-500">
            #{comparison?.sequence || 0} → #{selected?.sequence || 0}: {changedFiles.length} file{changedFiles.length === 1 ? "" : "s"} differ
          </div>
        </section>
      )}

      {selected && (
        <section className="rounded-lg border border-slate-800 bg-[#0b121e] p-3">
          <div className="flex items-center justify-between gap-2">
            <Badge className={cn("rounded border text-[8px]", eventAccent(selected.type))}>{selected.type}</Badge>
            <span className="text-[8px] uppercase tracking-wider text-slate-600">{selected.source}</span>
          </div>
          <h3 className="mt-3 text-xs font-semibold leading-relaxed">{selected.summary}</h3>
          <div className="mt-2 flex items-center gap-2 text-[9px] text-slate-500">
            <span>{selected.actor.kind === "ai" ? "AI" : selected.actor.name}</span>
            {selected.fileName && <><span>•</span><span>{selected.fileName}</span></>}
          </div>
          <div className="mt-3 rounded border border-emerald-400/15 bg-emerald-400/[0.04] p-2 font-mono text-[8px] text-emerald-300/80">
            SHA-256 {selected.integrityHash.slice(0, 20)}…
          </div>
          <Button
            disabled={!selected.payload.files || syncing}
            onClick={() => void onBranchFromEvent(selected)}
            className="mt-3 h-8 w-full bg-indigo-500 text-[9px] font-bold uppercase tracking-wider text-white hover:bg-indigo-400"
          >
            <GitBranch className="mr-1.5 h-3.5 w-3.5" /> Branch from this moment
          </Button>
        </section>
      )}

      <section className="space-y-1.5">
        {replayEvents.slice(-10).reverse().map((event) => (
          <button
            key={event.id}
            onClick={() => setIndex(replayEvents.findIndex((candidate) => candidate.id === event.id))}
            className={cn(
              "flex w-full items-center gap-2 rounded-md border p-2 text-left",
              selected?.id === event.id ? "border-cyan-400/30 bg-cyan-400/10" : "border-slate-800 bg-[#0b121e]"
            )}
          >
            <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded border", eventAccent(event.type))}>
              {event.type.startsWith("code") ? <Play className="h-3 w-3" /> : event.type.startsWith("test") ? <TestTube2 className="h-3 w-3" /> : <CircleDashed className="h-3 w-3" />}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[9px] text-slate-300">{event.summary}</div>
              <div className="mt-0.5 text-[8px] uppercase tracking-wider text-slate-600">#{event.sequence} · {event.type}</div>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
}

