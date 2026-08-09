"use client";

import { Cloud, GitMerge, LoaderCircle, RotateCcw, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CollaborationRuntimeState } from "./collaboration-types";

export function CollaborationStatusStrip({ state }: { state: CollaborationRuntimeState }) {
  const distributed = state.mode === "redis";
  const connecting = state.mode === "connecting" || !state.syncReady;
  const pending = state.pendingOperations > 0;

  return (
    <div
      className="grid grid-cols-3 gap-px border-b border-white/[0.07] bg-white/[0.07]"
      aria-label="Collaboration synchronization status"
      data-testid="collaboration-runtime-status"
    >
      <div className="flex min-w-0 items-center gap-2 bg-[#090e18] px-3 py-2.5">
        {distributed ? <Cloud className="h-3.5 w-3.5 text-cyan-300" /> : <Server className="h-3.5 w-3.5 text-amber-300" />}
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
            {distributed ? "Distributed" : connecting ? "Connecting" : "Single node"}
          </p>
          <p className="truncate text-[10px] text-slate-600">{distributed ? "Redis mesh" : "Local fallback"}</p>
        </div>
      </div>
      <div className="flex min-w-0 items-center gap-2 bg-[#090e18] px-3 py-2.5">
        {connecting || pending
          ? <LoaderCircle className="h-3.5 w-3.5 animate-spin text-indigo-300" />
          : <GitMerge className="h-3.5 w-3.5 text-emerald-300" />}
        <div className="min-w-0">
          <p className={cn(
            "truncate text-[10px] font-semibold uppercase tracking-[0.14em]",
            connecting ? "text-slate-400" : pending ? "text-indigo-200" : "text-emerald-200"
          )}>
            {connecting ? "Joining" : pending ? `${state.pendingOperations} pending` : "Converged"}
          </p>
          <p className="truncate text-[10px] text-slate-600">CRDT revision {state.revision}</p>
        </div>
      </div>
      <div className="flex min-w-0 items-center gap-2 bg-[#090e18] px-3 py-2.5">
        <RotateCcw className={cn("h-3.5 w-3.5", state.recovered ? "text-emerald-300" : "text-slate-500")} />
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
            {state.recovered ? "Recovered" : "Protected"}
          </p>
          <p className="truncate text-[10px] text-slate-600">Signed reconnect</p>
        </div>
      </div>
    </div>
  );
}
