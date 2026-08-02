"use client";

import { useEffect, useState } from "react";
import { Bot, RefreshCw, Sparkles } from "lucide-react";
import type { ChangeEvidencePackage, ReviewBoardRun } from "@shared/types/evidence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EvidenceStatusIcon } from "./EvidencePrimitives";

interface EvidenceBoardViewProps {
  latestPackage?: ChangeEvidencePackage;
  latestReview?: ReviewBoardRun;
  syncing: boolean;
  onRunReview: (requirement: string, rollback: string) => Promise<void>;
}

export function EvidenceBoardView({ latestPackage, latestReview, syncing, onRunReview }: EvidenceBoardViewProps) {
  const [requirement, setRequirement] = useState("");
  const [rollback, setRollback] = useState("");

  useEffect(() => {
    if (!latestPackage) return;
    setRequirement((value) => value || latestPackage.requirement);
    setRollback((value) => value || latestPackage.rollback);
  }, [latestPackage]);

  return (
    <div className="space-y-3 p-3">
      <section className="rounded-lg border border-violet-400/15 bg-violet-400/[0.04] p-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-violet-300" />
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200">Adversarial review board</h3>
            <p className="mt-0.5 text-[9px] text-slate-500">Seven agents attack the same change</p>
          </div>
        </div>
        <Textarea
          aria-label="Review requirement"
          value={requirement}
          onChange={(event) => setRequirement(event.target.value)}
          placeholder="Requirement under review"
          className="mt-3 min-h-16 border-slate-700 bg-[#080d16] text-[10px]"
        />
        <Textarea
          aria-label="Review rollback strategy"
          value={rollback}
          onChange={(event) => setRollback(event.target.value)}
          placeholder="Rollback strategy"
          className="mt-2 min-h-14 border-slate-700 bg-[#080d16] text-[10px]"
        />
        <Button
          disabled={syncing}
          onClick={() => void onRunReview(requirement, rollback)}
          className="mt-2 h-8 w-full bg-violet-500 text-[9px] font-bold uppercase tracking-wider text-white hover:bg-violet-400"
        >
          {syncing ? <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5" />}
          Convene review board
        </Button>
      </section>

      {latestReview && (
        <>
          <section className="rounded-lg border border-slate-800 bg-[#0b121e] p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-slate-500">Board verdict</div>
                <div className="mt-1 text-sm font-bold capitalize">{latestReview.verdict.replace("-", " ")}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-violet-300">{latestReview.score}</div>
                <div className="text-[8px] uppercase tracking-wider text-slate-600">confidence</div>
              </div>
            </div>
          </section>
          <section className="rounded-lg border border-slate-800 bg-[#0b121e] p-3">
            <div className="flex items-center justify-between text-[8px] uppercase tracking-wider text-slate-500">
              <span>Patch digest</span><span className="text-violet-300">{latestReview.rounds.length} rounds · {latestReview.consensus}% consensus</span>
            </div>
            <div className="mt-1 truncate font-mono text-[7px] text-slate-600">{latestReview.patchDigest}</div>
            <div className="mt-1 text-[7px] text-slate-500">
              {latestReview.isolation?.independentProcesses || latestReview.agents.length} isolated workers
              {latestReview.initialPatchDigest && latestReview.initialPatchDigest !== latestReview.patchDigest ? " · revised artifact " + latestReview.initialPatchDigest.slice(0, 8) + " → " + latestReview.patchDigest.slice(0, 8) : " · artifact unchanged"}
            </div>
            {!!latestReview.builderActions?.length && (
              <div className="mt-2 rounded border border-emerald-400/15 bg-emerald-400/[0.04] p-2 text-[8px] leading-relaxed text-emerald-200/80">
                {latestReview.builderActions.map((action) => action.action).join(" ")}
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-1">
              {latestReview.executedTools.map((tool) => (
                <Badge key={tool} className="border-violet-400/15 bg-violet-400/[0.05] text-[6px] text-violet-300">{tool}</Badge>
              ))}
            </div>
            {latestReview.rounds.map((round) => (
              <div key={round.round} className="mt-2 rounded border border-slate-800 bg-[#080d16] p-2">
                <div className="text-[7px] font-bold uppercase tracking-wider text-slate-500">Round {round.round} · {round.phase}</div>
                <div className="mt-1 text-[8px] leading-relaxed text-slate-400">{round.builderResponse}</div>
              </div>
            ))}
          </section>
          <section className="space-y-2">
            {latestReview.agents.map((agent) => (
              <article key={agent.id} className="rounded-md border border-slate-800 bg-[#0b121e] p-2.5">
                <div className="flex items-center gap-2">
                  <EvidenceStatusIcon status={agent.status} />
                  <h4 className="text-[10px] font-semibold">{agent.name}</h4>
                  <Badge className="ml-auto rounded border-slate-700 bg-slate-900 text-[7px] uppercase text-slate-500">{agent.status}</Badge>
                </div>
                <p className="mt-1.5 text-[9px] leading-relaxed text-slate-500">{agent.summary}</p>
                {agent.toolRuns?.map((run) => (
                  <div key={run.outputDigest} className="mt-1.5 flex items-center justify-between rounded border border-slate-800 bg-[#080d16] px-2 py-1 text-[7px]">
                    <span className="text-violet-300">{run.tool}</span>
                    <span className={run.status === "passed" ? "text-emerald-300" : "text-rose-300"}>{run.status} · {run.durationMs}ms</span>
                  </div>
                ))}
                {agent.findings.slice(0, 2).map((finding) => (
                  <div key={finding.id} className="mt-2 rounded border border-amber-400/15 bg-amber-400/[0.04] p-2">
                    <div className="text-[9px] font-semibold text-amber-200">{finding.title}</div>
                    <div className="mt-1 text-[8px] leading-relaxed text-slate-500">{finding.detail}</div>
                  </div>
                ))}
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

