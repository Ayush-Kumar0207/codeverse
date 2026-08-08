"use client";

import { useState } from "react";
import { AlertTriangle, ArrowDown, BrainCircuit, ChevronDown, ChevronLeft, ChevronRight, FileCode2, GitMerge, Network, TestTube2 } from "lucide-react";
import type {
  EngineeringDigitalTwin,
  UnderstandingChallenge,
  UnderstandingVerification,
} from "@shared/types/evidence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EvidenceVerifyViewProps {
  challenge: UnderstandingChallenge | null;
  latestVerification?: UnderstandingVerification;
  syncing: boolean;
  onGenerateChallenge: () => Promise<UnderstandingChallenge>;
  onSubmitUnderstanding: (answers: Record<string, string>) => Promise<unknown>;
}

export function EvidenceVerifyView({
  challenge,
  latestVerification,
  syncing,
  onGenerateChallenge,
  onSubmitUnderstanding,
}: EvidenceVerifyViewProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const question = challenge?.questions[currentQuestion];
  const progress = challenge?.questions.length
    ? Math.round(((currentQuestion + 1) / challenge.questions.length) * 100)
    : 0;

  return (
    <div className="space-y-4 p-2 lg:p-0">
      <section className="overflow-hidden rounded-2xl border border-emerald-400/15 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.14),transparent_42%),rgba(52,211,153,0.025)] p-5 lg:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
            <BrainCircuit className="h-5 w-5 text-emerald-200" />
          </div>
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-emerald-200">Understanding check</div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">Can you explain this change?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              A short, guided conversation confirms that the person behind the code understands its purpose, behavior, and risks.
            </p>
          </div>
        </div>
        {!challenge && (
          <Button
            onClick={() => void onGenerateChallenge()}
            className="mt-6 h-11 rounded-xl bg-emerald-400 px-5 text-xs font-semibold text-emerald-950 hover:bg-emerald-300"
          >
            Start a quick understanding check
          </Button>
        )}
      </section>

      {challenge && question && (
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Question {currentQuestion + 1} of {challenge.questions.length}
            </div>
            <Badge className="rounded-lg border-emerald-400/15 bg-emerald-400/10 text-[10px] capitalize text-emerald-200">
              {question.focus}
            </Badge>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.07]">
            <div className="h-full rounded-full bg-emerald-300 transition-all" style={{ width: progress + "%" }} />
          </div>

          <div className="mx-auto max-w-3xl py-8">
            <h3 className="text-xl font-semibold leading-8 text-white">{question.prompt}</h3>
            <label className="mt-6 block">
              <span className="text-xs font-medium text-slate-300">Your explanation</span>
              <Textarea
                aria-label={"Answer question " + (currentQuestion + 1)}
                value={answers[question.id] || ""}
                onChange={(event) => setAnswers((value) => ({ ...value, [question.id]: event.target.value }))}
                placeholder="Explain it in your own words. A concrete example helps."
                className="mt-2 min-h-36 rounded-xl border-white/10 bg-black/20 text-sm leading-6"
              />
            </label>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
            <Button
              variant="outline"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((value) => Math.max(0, value - 1))}
              className="h-10 rounded-xl border-white/10 bg-transparent px-4 text-xs text-slate-300 hover:bg-white/[0.05]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {currentQuestion < challenge.questions.length - 1 ? (
              <Button
                disabled={!(answers[question.id] || "").trim()}
                onClick={() => setCurrentQuestion((value) => Math.min(challenge.questions.length - 1, value + 1))}
                className="h-10 rounded-xl bg-emerald-400 px-4 text-xs font-semibold text-emerald-950 hover:bg-emerald-300"
              >
                Next question <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                disabled={syncing || challenge.questions.some((item) => !(answers[item.id] || "").trim())}
                onClick={() => void onSubmitUnderstanding(answers)}
                className="h-10 rounded-xl bg-emerald-400 px-4 text-xs font-semibold text-emerald-950 hover:bg-emerald-300"
              >
                Check my answers
              </Button>
            )}
          </div>
        </section>
      )}

      {latestVerification && (
        <section className={cn(
          "rounded-2xl border p-5",
          latestVerification.passed ? "border-emerald-400/15 bg-emerald-400/[0.025]" : "border-amber-400/15 bg-amber-400/[0.025]"
        )}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs text-slate-500">Latest understanding result</div>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {latestVerification.passed ? "Understanding verified" : "A little more explanation is needed"}
              </h3>
              <p className="mt-1 text-xs text-slate-500">{latestVerification.fileName}</p>
            </div>
            <div className={cn(
              "flex h-20 w-20 flex-col items-center justify-center rounded-full border",
              latestVerification.passed
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                : "border-amber-400/20 bg-amber-400/10 text-amber-200"
            )}>
              <div className="text-2xl font-semibold">{latestVerification.score}</div>
              <div className="text-[9px] text-slate-500">score</div>
            </div>
          </div>

          <details className="group mt-5 rounded-xl border border-white/[0.07] bg-black/15">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-medium text-slate-400">
              Scoring and behavioral details
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <div className="space-y-3 border-t border-white/[0.07] p-4">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(latestVerification.dimensions).map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
                    <div className="text-[10px] capitalize text-slate-600">{label}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-300">{value}</div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] leading-5 text-slate-600">
                Behavioral continuity {latestVerification.behavioralSignals.continuity}% · {latestVerification.behavioralSignals.revisionCount} revisions · {latestVerification.behavioralSignals.pasteCount} paste events · {latestVerification.behavioralSignals.externalFocusChanges} focus changes · {Math.round(latestVerification.behavioralSignals.elapsedMs / 1000)}s elapsed
              </p>
              {latestVerification.executionEvidence && (
                <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] p-3 text-[10px] leading-5 text-slate-500">
                  Compiler {latestVerification.executionEvidence.compiler?.engine || "unavailable"} · {latestVerification.executionEvidence.compiler?.language || "unknown language"} · empty {latestVerification.executionEvidence.emptyBoundary?.result || "unavailable"} · null {latestVerification.executionEvidence.nullBoundary?.result || "unavailable"}
                </div>
              )}
              <div className="truncate font-mono text-[10px] text-slate-600">{latestVerification.codeDigest}</div>
            </div>
          </details>
        </section>
      )}
    </div>
  );
}
export function EvidenceTwinView({ twin }: { twin: EngineeringDigitalTwin }) {
  const impactTone = twin.impact.blastRadius === "high"
    ? "border-rose-400/20 bg-rose-400/10 text-rose-200"
    : twin.impact.blastRadius === "medium"
      ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
      : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";

  return (
    <div className="space-y-4 p-2 lg:p-0">
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_40%),rgba(255,255,255,0.025)] p-5 lg:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-200">
              <Network className="h-4 w-4" /> Change impact
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">What could this change affect?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Follow the predicted path from the active file to connected code, then see what should be checked before shipping.
            </p>
          </div>
          <Badge className={cn("h-8 rounded-lg border px-3 text-xs capitalize", impactTone)}>
            {twin.impact.blastRadius === "high" ? "wide" : twin.impact.blastRadius} impact
          </Badge>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-5">
          <div>
            <div className="text-xl font-semibold text-white">{twin.nodes.length}</div>
            <div className="mt-0.5 text-[11px] text-slate-500">Components mapped</div>
          </div>
          <div>
            <div className="text-xl font-semibold text-white">{twin.edges.length}</div>
            <div className="mt-0.5 text-[11px] text-slate-500">Relationships found</div>
          </div>
          <div>
            <div className="text-xl font-semibold text-sky-200">{twin.impact.confidence}%</div>
            <div className="mt-0.5 text-[11px] text-slate-500">Prediction confidence</div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 lg:p-6" aria-label="Change impact path">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Impact path</h3>
          <p className="mt-1 text-xs text-slate-500">Read this top to bottom: change, reach, then action.</p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/10">
                <FileCode2 className="h-4 w-4 text-sky-200" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-500">You are changing</div>
                <div className="mt-1 truncate font-mono text-sm text-white">{twin.impact.activeFile || "No active file"}</div>
              </div>
            </div>
          </div>

          <div className="flex h-12 items-center justify-center">
            <div className="flex h-12 w-7 flex-col items-center">
              <div className="h-8 w-px bg-gradient-to-b from-sky-300/70 to-indigo-300/40" />
              <ArrowDown className="h-4 w-4 text-indigo-300" />
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.035] p-4">
            <div className="flex items-center gap-2">
              <GitMerge className="h-4 w-4 text-indigo-200" />
              <h4 className="text-sm font-medium text-white">It may reach these files</h4>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {twin.impact.affectedFiles.map((file) => (
                <div key={file} className="flex min-w-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-black/15 px-3 py-2.5 font-mono text-xs text-slate-300">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-300" />
                  <span className="truncate">{file}</span>
                </div>
              ))}
              {!twin.impact.affectedFiles.length && (
                <div className="text-xs text-slate-500">No directly connected file was detected.</div>
              )}
            </div>
          </div>

          <div className="flex h-12 items-center justify-center">
            <div className="flex h-12 w-7 flex-col items-center">
              <div className="h-8 w-px bg-gradient-to-b from-indigo-300/50 to-emerald-300/40" />
              <ArrowDown className="h-4 w-4 text-emerald-300" />
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.035] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <TestTube2 className="h-4 w-4 text-emerald-300" /> Tests to run
              </div>
              <div className="mt-3 space-y-2">
                {twin.impact.testsToRun.map((test) => (
                  <div key={test} className="flex items-start gap-2 text-xs leading-5 text-slate-400">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                    <span>{test}</span>
                  </div>
                ))}
                {!twin.impact.testsToRun.length && <div className="text-xs text-slate-500">No additional test was suggested.</div>}
              </div>
            </div>
            <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.035] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <AlertTriangle className="h-4 w-4 text-amber-300" /> Risks to watch
              </div>
              <div className="mt-3 space-y-2">
                {twin.impact.risks.map((risk) => (
                  <div key={risk} className="flex items-start gap-2 text-xs leading-5 text-slate-400">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                    <span>{risk}</span>
                  </div>
                ))}
                {!twin.impact.risks.length && <div className="text-xs text-slate-500">No specific risk was predicted.</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <details className="group rounded-2xl border border-white/[0.08] bg-white/[0.025]">
        <summary className="flex cursor-pointer list-none items-center justify-between p-5">
          <div>
            <div className="text-sm font-medium text-white">Technical project model</div>
            <div className="mt-1 text-xs text-slate-500">Telemetry, compiler analysis, and mapped components</div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500 transition group-open:rotate-180" />
        </summary>
        <div className="space-y-4 border-t border-white/[0.07] p-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Object.entries(twin.telemetry).map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/[0.07] bg-black/15 p-3 text-center">
                <div className="text-lg font-semibold text-sky-200">{value}</div>
                <div className="mt-1 truncate text-[10px] capitalize text-slate-600">{label}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-black/15 p-4 text-xs leading-5 text-slate-500">
            {twin.analysis?.engine || "Compiler unavailable"} · {twin.analysis?.languages?.join(", ") || "JS/TS"} · {twin.analysis?.runtimeCorrelations || 0} runtime correlations · {twin.impact.securityBoundaries.length} security boundaries · {twin.impact.apiConsumers.length} API consumers · {twin.impact.migrationsRequired.length} migrations
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {twin.nodes.slice(0, 18).map((node) => (
              <div key={node.id} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/15 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.06]">
                  <Network className="h-3.5 w-3.5 text-sky-200" />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-mono text-xs text-slate-300">{node.label}</div>
                  <div className="mt-0.5 text-[10px] capitalize text-slate-600">{node.kind}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
