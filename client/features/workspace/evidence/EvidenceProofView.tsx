"use client";

import { useState } from "react";
import { PackageCheck, ScanSearch } from "lucide-react";
import type { EvidenceOSSnapshot } from "@shared/types/evidence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { EvidenceScoreBar, EvidenceStatusIcon } from "./EvidencePrimitives";

interface EvidenceProofViewProps {
  snapshot: EvidenceOSSnapshot;
  coverage: number;
  focusedLocation: { fileName: string; lineNumber: number; column: number } | null;
  syncing: boolean;
  onCreatePackage: (input: { title: string; requirement: string; rationale: string; rollback: string }) => Promise<void>;
  onVerifyPackage: (packageId: string) => Promise<boolean>;
}

const scoreLabels: Array<[keyof EvidenceOSSnapshot["scorecard"], string]> = [
  ["finalCorrectness", "Correct"],
  ["problemSolvingProcess", "Process"],
  ["debuggingAbility", "Debug"],
  ["testQuality", "Tests"],
  ["codeComprehension", "Understood"],
  ["securityAwareness", "Security"],
];

export function EvidenceProofView({ snapshot, coverage, focusedLocation, syncing, onCreatePackage, onVerifyPackage }: EvidenceProofViewProps) {
  const latestPackage = snapshot.packages.at(-1);
  const focusedChange = focusedLocation
    ? [...snapshot.events].reverse().find((event) => event.fileName === focusedLocation.fileName && event.type === "code.changed")
    : undefined;
  const latestReview = snapshot.reviews.at(-1);
  const [packageMode, setPackageMode] = useState(false);
  const [form, setForm] = useState({ title: "", requirement: "", rationale: "", rollback: "" });

  return (
    <div className="space-y-3 p-3">
      {focusedLocation && (
        <section className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.04] p-3" aria-label="Line evidence inspector">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-200">Line evidence</div>
            <Badge className="max-w-[60%] truncate rounded border-cyan-400/20 bg-cyan-400/10 font-mono text-[8px] text-cyan-200">
              {focusedLocation.fileName}:{focusedLocation.lineNumber}
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-[72px_minmax(0,1fr)] gap-x-2 gap-y-1.5 text-[9px]">
            <span className="text-slate-600">Provenance</span>
            <span className="truncate text-slate-300">{focusedChange ? focusedChange.actor.name + " · " + focusedChange.source : "Awaiting a captured edit"}</span>
            <span className="text-slate-600">Why</span>
            <span className="line-clamp-2 text-slate-300">{latestPackage?.rationale || "No rationale linked yet"}</span>
            <span className="text-slate-600">Requirement</span>
            <span className="line-clamp-2 text-slate-300">{latestPackage?.requirement || "Unlinked"}</span>
            <span className="text-slate-600">Tests</span>
            <span className="text-slate-300">{snapshot.events.filter((event) => event.type.startsWith("test.")).length} recorded runs</span>
            <span className="text-slate-600">Review</span>
            <span className="capitalize text-slate-300">{latestReview?.verdict.replace("-", " ") || "Not reviewed"}</span>
          </div>
        </section>
      )}

      <section className="rounded-lg border border-slate-800 bg-[#0b121e] p-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
            style={{ background: "conic-gradient(#22d3ee " + coverage + "%, #1e293b 0)" }}
            aria-label={"Evidence coverage " + coverage + "%"}
          >
            <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-[#0b121e]">
              <strong className="text-lg leading-none">{coverage}</strong>
              <span className="text-[8px] uppercase tracking-wider text-slate-500">proof</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Evidence coverage</div>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
              Changes connect to execution, review, comprehension, and rollback evidence.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2" aria-label="Assessment scorecard">
        {scoreLabels.map(([key, label]) => {
          const value = snapshot.scorecard[key];
          return typeof value === "number" ? (
            <div key={key} className="rounded-md border border-slate-800 bg-[#0b121e] p-2">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-slate-500">
                <span>{label}</span><span className="font-mono text-slate-200">{value}</span>
              </div>
              <EvidenceScoreBar value={value} />
            </div>
          ) : null;
        })}
      </section>

      <section className="rounded-lg border border-slate-800 bg-[#0b121e]">
        <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">Engineering evidence graph</h3>
            <p className="mt-0.5 text-[9px] text-slate-500">Requirement → change → proof → review</p>
          </div>
          <ScanSearch className="h-4 w-4 text-cyan-300" />
        </div>
        <div className="max-h-56 overflow-y-auto p-3">
          {snapshot.graph.edges.slice(-8).map((edge) => (
            <div key={edge.id} className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-1 text-[7px]">
              <span className="truncate rounded border border-slate-800 bg-[#080d16] px-1.5 py-1 text-slate-500">
                {snapshot.graph.nodes.find((node) => node.id === edge.source)?.label || edge.source}
              </span>
              <Badge className="border-cyan-400/15 bg-cyan-400/[0.05] px-1 text-[6px] uppercase text-cyan-300">{edge.relation}</Badge>
              <span className="truncate rounded border border-slate-800 bg-[#080d16] px-1.5 py-1 text-slate-500">
                {snapshot.graph.nodes.find((node) => node.id === edge.target)?.label || edge.target}
              </span>
            </div>
          ))}
          <div className="mt-3 border-t border-slate-800 pt-3">
          {snapshot.graph.nodes.slice(-8).map((node, index, nodes) => (
            <div key={node.id} className="relative flex gap-2 pb-3 last:pb-0">
              {index < nodes.length - 1 && <div className="absolute bottom-0 left-[7px] top-4 w-px bg-slate-700" />}
              <div className={cn(
                "relative z-10 mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 bg-[#0b121e]",
                node.status === "passed" ? "border-emerald-400" : node.status === "failed" ? "border-rose-400" : node.status === "warning" ? "border-amber-300" : "border-cyan-400"
              )} />
              <div className="min-w-0">
                <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">{node.kind}</div>
                <div className="line-clamp-2 text-[10px] text-slate-300">{node.label}</div>
              </div>
            </div>
          ))}
          {!snapshot.graph.nodes.length && <div className="py-5 text-center text-[10px] text-slate-500">Record a change to begin the evidence graph.</div>}
          </div>
        </div>
      </section>

      {latestPackage && !packageMode ? (
        <section className="rounded-lg border border-slate-800 bg-[#0b121e] p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Latest proof package</div>
              <h3 className="mt-1 text-xs font-semibold">{latestPackage.title}</h3>
            </div>
            <Badge className={cn(
              "rounded border text-[8px] uppercase",
              latestPackage.status === "ready" ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200" : "border-amber-400/25 bg-amber-400/10 text-amber-200"
            )}>
              {latestPackage.score}%
            </Badge>
          </div>
          <div className="mt-3 space-y-1.5">
            {latestPackage.checks.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-[10px] text-slate-400" title={item.detail}>
                <EvidenceStatusIcon status={item.status} /><span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded border border-slate-800 bg-[#080d16] p-2">
            <div className="flex items-center justify-between text-[8px]">
              <span className="uppercase tracking-wider text-slate-600">Exact artifact</span>
              <span className={latestPackage.exactArtifactVerified ? "text-emerald-300" : "text-amber-300"}>
                {latestPackage.exactArtifactVerified ? "verified" : "not fully bound"}
              </span>
            </div>
            <div className="mt-1 truncate font-mono text-[7px] text-cyan-300">{latestPackage.changeDigest}</div>
            <div className="mt-1 truncate font-mono text-[7px] text-slate-600">{latestPackage.signature}</div>
            {latestPackage.signatureIssuer && (
              <div className="mt-1 text-[7px] text-slate-500">Issuer {latestPackage.signatureIssuer} · key {latestPackage.signatureKeyId} · {latestPackage.signatureAlgorithm}</div>
            )}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {latestPackage.attestations.map((item) => (
              <div key={item.id} title={item.detail} className="flex items-center gap-1.5 rounded border border-slate-800 bg-[#080d16] px-2 py-1.5 text-[8px]">
                <EvidenceStatusIcon status={item.status === "verified" ? "passed" : item.status === "failed" ? "missing" : "warning"} />
                <span className="truncate capitalize text-slate-400">{item.kind}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-emerald-400/25 bg-emerald-400/[0.05] text-[8px] uppercase tracking-wider text-emerald-200"
              onClick={() => void onVerifyPackage(latestPackage.id)}
            >
              Verify proof
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-slate-700 bg-transparent text-[8px] uppercase tracking-wider"
              onClick={() => setPackageMode(true)}
            >
              New package
            </Button>
          </div>
        </section>
      ) : (
        <section className="space-y-2 rounded-lg border border-cyan-400/15 bg-cyan-400/[0.03] p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Create proof package</h3>
            {latestPackage && <button onClick={() => setPackageMode(false)} className="text-[9px] text-slate-500">Cancel</button>}
          </div>
          <Input
            aria-label="Change title"
            value={form.title}
            onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))}
            placeholder="Change title"
            className="h-8 border-slate-700 bg-[#080d16] text-[10px]"
          />
          <Textarea
            aria-label="Linked requirement"
            value={form.requirement}
            onChange={(event) => setForm((value) => ({ ...value, requirement: event.target.value }))}
            placeholder="Requirement this change satisfies"
            className="min-h-16 border-slate-700 bg-[#080d16] text-[10px]"
          />
          <Textarea
            aria-label="Change rationale"
            value={form.rationale}
            onChange={(event) => setForm((value) => ({ ...value, rationale: event.target.value }))}
            placeholder="Root cause and why this approach"
            className="min-h-16 border-slate-700 bg-[#080d16] text-[10px]"
          />
          <Textarea
            aria-label="Rollback strategy"
            value={form.rollback}
            onChange={(event) => setForm((value) => ({ ...value, rollback: event.target.value }))}
            placeholder="Safe rollback strategy"
            className="min-h-14 border-slate-700 bg-[#080d16] text-[10px]"
          />
          <Button
            disabled={syncing || !form.title.trim()}
            onClick={async () => {
              await onCreatePackage(form);
              setPackageMode(false);
            }}
            className="h-8 w-full bg-cyan-400 text-[9px] font-bold uppercase tracking-wider text-slate-950 hover:bg-cyan-300"
          >
            <PackageCheck className="mr-1.5 h-3.5 w-3.5" /> Seal evidence package
          </Button>
        </section>
      )}
    </div>
  );
}

