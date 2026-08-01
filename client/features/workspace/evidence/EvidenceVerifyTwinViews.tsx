"use client";

import { useState } from "react";
import { AlertTriangle, BrainCircuit, Network, TestTube2 } from "lucide-react";
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

  return (
    <div className="space-y-3 p-3">
      <section className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.04] p-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-emerald-300" />
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200">Human understanding</h3>
            <p className="mt-0.5 text-[9px] text-slate-500">Prove you can explain and defend the code</p>
          </div>
        </div>
        {!challenge && (
          <Button
            onClick={() => void onGenerateChallenge()}
            className="mt-3 h-8 w-full bg-emerald-400 text-[9px] font-bold uppercase tracking-wider text-emerald-950 hover:bg-emerald-300"
          >
            Generate understanding check
          </Button>
        )}
      </section>

      {challenge && (
        <section className="space-y-3">
          {challenge.questions.map((question, index) => (
            <label key={question.id} className="block rounded-lg border border-slate-800 bg-[#0b121e] p-3">
              <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                {index + 1}. {question.focus}
              </span>
              <span className="mt-1.5 block text-[10px] leading-relaxed text-slate-300">{question.prompt}</span>
              <Textarea
                aria-label={"Answer question " + (index + 1)}
                value={answers[question.id] || ""}
                onChange={(event) => setAnswers((value) => ({ ...value, [question.id]: event.target.value }))}
                placeholder="Explain with a concrete execution path..."
                className="mt-2 min-h-20 border-slate-700 bg-[#080d16] text-[10px]"
              />
            </label>
          ))}
          <Button
            disabled={syncing || challenge.questions.some((question) => !(answers[question.id] || "").trim())}
            onClick={() => void onSubmitUnderstanding(answers)}
            className="h-8 w-full bg-emerald-400 text-[9px] font-bold uppercase tracking-wider text-emerald-950 hover:bg-emerald-300"
          >
            Verify my understanding
          </Button>
        </section>
      )}

      {latestVerification && (
        <section className={cn(
          "rounded-lg border p-3",
          latestVerification.passed ? "border-emerald-400/20 bg-emerald-400/[0.05]" : "border-amber-400/20 bg-amber-400/[0.05]"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-500">Verified understanding</div>
              <div className="mt-1 text-xs font-semibold">{latestVerification.fileName}</div>
            </div>
            <div className={cn("text-2xl font-black", latestVerification.passed ? "text-emerald-300" : "text-amber-300")}>
              {latestVerification.score}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export function EvidenceTwinView({ twin }: { twin: EngineeringDigitalTwin }) {
  return (
    <div className="space-y-3 p-3">
      <section className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Engineering digital twin</h3>
            <p className="mt-0.5 text-[9px] text-slate-500">Relationships + predicted blast radius</p>
          </div>
          <Badge className={cn(
            "rounded border text-[8px] uppercase",
            twin.impact.blastRadius === "high"
              ? "border-rose-400/25 bg-rose-400/10 text-rose-200"
              : twin.impact.blastRadius === "medium"
                ? "border-amber-400/25 bg-amber-400/10 text-amber-200"
                : "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
          )}>
            {twin.impact.blastRadius} impact
          </Badge>
        </div>
        <div className="mt-3 rounded border border-slate-800 bg-[#080d16] p-2">
          <div className="text-[8px] uppercase tracking-wider text-slate-600">Active component</div>
          <div className="mt-1 truncate font-mono text-[10px] text-cyan-200">{twin.impact.activeFile || "No active file"}</div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <div className="rounded-md border border-slate-800 bg-[#0b121e] p-2.5">
          <div className="text-lg font-black">{twin.nodes.length}</div>
          <div className="text-[8px] uppercase tracking-wider text-slate-600">components</div>
        </div>
        <div className="rounded-md border border-slate-800 bg-[#0b121e] p-2.5">
          <div className="text-lg font-black">{twin.edges.length}</div>
          <div className="text-[8px] uppercase tracking-wider text-slate-600">relationships</div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-800 bg-[#0b121e] p-3">
        <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Predicted affected files</h4>
        <div className="mt-2 space-y-1.5">
          {twin.impact.affectedFiles.map((file) => (
            <div key={file} className="flex items-center gap-2 rounded border border-slate-800 bg-[#080d16] px-2 py-1.5 font-mono text-[9px]">
              <Network className="h-3 w-3 text-cyan-300" /><span className="truncate">{file}</span>
            </div>
          ))}
          {!twin.impact.affectedFiles.length && <div className="text-[9px] text-slate-600">No directly connected file detected.</div>}
        </div>
      </section>

      <section className="rounded-lg border border-slate-800 bg-[#0b121e] p-3">
        <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Evidence to collect</h4>
        <div className="mt-2 space-y-2">
          {twin.impact.testsToRun.map((test) => (
            <div key={test} className="flex items-center gap-2 text-[9px] text-emerald-300">
              <TestTube2 className="h-3 w-3" /><span className="truncate">{test}</span>
            </div>
          ))}
          {twin.impact.risks.map((risk) => (
            <div key={risk} className="flex items-center gap-2 text-[9px] text-amber-300">
              <AlertTriangle className="h-3 w-3" /><span>{risk}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-1.5">
        {twin.nodes.slice(0, 18).map((node) => (
          <div key={node.id} className="flex items-center gap-2 rounded-md border border-slate-800 bg-[#0b121e] p-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-cyan-400/15 bg-cyan-400/[0.05]">
              <Network className="h-3 w-3 text-cyan-300" />
            </div>
            <div className="min-w-0">
              <div className="truncate font-mono text-[9px]">{node.label}</div>
              <div className="text-[8px] uppercase tracking-wider text-slate-600">{node.kind}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

