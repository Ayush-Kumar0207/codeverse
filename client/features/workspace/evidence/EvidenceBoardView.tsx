"use client";

import { useEffect, useState } from "react";
import { Bot, CheckCircle2, ChevronDown, CircleDashed, RefreshCw, SearchCheck, Sparkles, Users } from "lucide-react";
import type { ChangeEvidencePackage, ReviewBoardRun } from "@shared/types/evidence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { EvidenceStatusIcon, isReviewPreview } from "./EvidencePrimitives";

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

  const keyFindings = latestReview?.agents.flatMap((agent) =>
    agent.findings.map((finding) => ({ ...finding, agent: agent.name }))
  ).slice(0, 6) || [];
  const isPreview = isReviewPreview(latestReview);
  const executedTools = latestReview?.executedTools.filter((tool) => !tool.endsWith("-unverified-preview")) || [];

  return (
    <div className="space-y-4 p-2 lg:p-0">
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.16),transparent_40%),rgba(255,255,255,0.025)] p-5 lg:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10">
            <Bot className="h-5 w-5 text-violet-200" />
          </div>
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-violet-200">Independent AI review</div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">Get a second opinion before you ship.</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Seven focused reviewers inspect the same change for correctness, tests, security, usability, and recovery risk.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
        <div>
          <h3 className="text-base font-semibold text-white">What should the reviewers check?</h3>
          <p className="mt-1 text-xs text-slate-500">The latest proof package is filled in automatically. Adjust it if the review needs a narrower focus.</p>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-medium text-slate-300">Expected outcome</span>
            <Textarea
              aria-label="Review requirement"
              value={requirement}
              onChange={(event) => setRequirement(event.target.value)}
              placeholder="What must this change accomplish?"
              className="min-h-28 rounded-xl border-white/10 bg-black/20 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium text-slate-300">Recovery plan</span>
            <Textarea
              aria-label="Review rollback strategy"
              value={rollback}
              onChange={(event) => setRollback(event.target.value)}
              placeholder="How will you safely undo the change?"
              className="min-h-28 rounded-xl border-white/10 bg-black/20 text-sm"
            />
          </label>
        </div>
        <Button
          disabled={syncing}
          onClick={() => void onRunReview(requirement, rollback)}
          className="mt-5 h-11 rounded-xl bg-violet-500 px-5 text-xs font-semibold text-white hover:bg-violet-400"
        >
          {syncing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Start independent review
        </Button>
      </section>


      {latestReview && (
        <>
          <section className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.025] p-5">
            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div>
                <div className="flex items-center gap-2 text-xs text-violet-200">
                  {isPreview ? <CircleDashed className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  {isPreview ? "Review ready to run" : "Review complete"}
                </div>
                <h3 className="mt-2 text-2xl font-semibold capitalize text-white">
                  {isPreview ? "Server review not run" : latestReview.verdict.replace("-", " ")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {isPreview
                    ? "This preview shows which specialists will review the change. Connect the review service to run their checks and produce a verdict."
                    : `${latestReview.consensus}% of reviewers agree after ${latestReview.rounds.length} review round${latestReview.rounds.length === 1 ? "" : "s"}.`}
                </p>
              </div>
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-violet-400/20 bg-violet-400/10">
                <div className="text-3xl font-semibold text-violet-200">{isPreview ? "—" : latestReview.score}</div>
                <div className="text-[10px] text-slate-500">{isPreview ? "not scored" : "confidence"}</div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/10">
                <SearchCheck className="h-4 w-4 text-violet-200" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">What the review found</h3>
                <p className="mt-1 text-xs text-slate-500">The most important findings, without the agent-by-agent noise.</p>
              </div>
            </div>
            {keyFindings.length ? (
              <div className="mt-5 grid gap-3 lg:grid-cols-2">
                {keyFindings.map((finding) => (
                  <article key={finding.id} className="rounded-xl border border-amber-400/10 bg-amber-400/[0.025] p-4">
                    <div className="text-sm font-medium text-amber-100">{finding.title}</div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{finding.detail}</p>
                    <div className="mt-3 text-[10px] text-slate-600">{finding.agent}</div>
                  </article>
                ))}
              </div>
            ) : isPreview ? (
              <div className="mt-5 rounded-xl border border-slate-400/10 bg-white/[0.02] p-4 text-sm text-slate-400">
                No findings yet — the server-backed review still needs to run.
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] p-4 text-sm text-emerald-200">
                No blocking findings were raised.
              </div>
            )}
          </section>

          <details className="group rounded-2xl border border-white/[0.08] bg-white/[0.025]">
            <summary className="flex cursor-pointer list-none items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-violet-200" />
                <div>
                  <div className="text-sm font-medium text-white">Reviewer and tool details</div>
                  <div className="mt-1 text-xs text-slate-500">{latestReview.agents.length} review roles · {executedTools.length} tools run</div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500 transition group-open:rotate-180" />
            </summary>
            <div className="space-y-3 border-t border-white/[0.07] p-5">
              {!isPreview && executedTools.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {executedTools.map((tool) => (
                    <Badge key={tool} className="border-violet-400/15 bg-violet-400/[0.06] text-[10px] text-violet-200">{tool}</Badge>
                  ))}
                </div>
              )}
              <div className="grid gap-3 lg:grid-cols-2">
                {latestReview.agents.map((agent) => (
                  <article key={agent.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-4">
                    <div className="flex items-center gap-2">
                      {isPreview ? <CircleDashed className="h-3.5 w-3.5 text-slate-500" /> : <EvidenceStatusIcon status={agent.status} />}
                      <h4 className="text-sm font-medium text-white">{agent.name}</h4>
                      <Badge className={cn(
                        "ml-auto rounded-lg border text-[9px]",
                        isPreview
                          ? "border-slate-400/15 bg-white/[0.04] text-slate-400"
                          : agent.status === "passed"
                            ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-200"
                            : "border-amber-400/15 bg-amber-400/10 text-amber-200"
                      )}>{isPreview ? "Not run" : agent.status}</Badge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {isPreview ? "Waiting for the server review to run this specialist check." : agent.summary}
                    </p>
                    {isPreview ? (
                      <div className="mt-2 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 text-[10px] text-slate-600">
                        No tool result yet
                      </div>
                    ) : agent.toolRuns?.map((run) => (
                      <div key={run.outputDigest} className="mt-2 flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 text-[10px]">
                        <span className="text-violet-200">{run.tool}</span>
                        <span className={run.status === "passed" ? "text-emerald-300" : "text-rose-300"}>{run.status} · {run.durationMs}ms</span>
                      </div>
                    ))}
                  </article>
                ))}
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-black/15 p-4">
                <div className="text-[10px] text-slate-600">Patch digest</div>
                <div className="mt-1 truncate font-mono text-[10px] text-slate-400">{latestReview.patchDigest}</div>
              </div>
            </div>
          </details>
        </>
      )}
    </div>
  );
}

