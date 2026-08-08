"use client";

import { useState } from "react";
import {
  ChevronDown,
  FileSearch,
  GitCommitHorizontal,
  PackageCheck,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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

const scoreLabels: Array<[keyof EvidenceOSSnapshot["scorecard"], string, string]> = [
  ["finalCorrectness", "Correctness", "Does the result work?"],
  ["problemSolvingProcess", "Approach", "Was the path intentional?"],
  ["debuggingAbility", "Debugging", "Can failures be traced?"],
  ["testQuality", "Test quality", "Are risky paths covered?"],
  ["codeComprehension", "Understanding", "Can the change be explained?"],
  ["securityAwareness", "Safety", "Were trust boundaries checked?"],
];

export function EvidenceProofView({
  snapshot,
  coverage,
  focusedLocation,
  syncing,
  onCreatePackage,
  onVerifyPackage,
}: EvidenceProofViewProps) {
  const latestPackage = snapshot.packages.at(-1);
  const latestReview = snapshot.reviews.at(-1);
  const focusedChange = focusedLocation
    ? [...snapshot.events].reverse().find((event) => event.fileName === focusedLocation.fileName && event.type === "code.changed")
    : undefined;
  const [packageMode, setPackageMode] = useState(!latestPackage);
  const [openPanel, setOpenPanel] = useState<"trail" | "quality" | null>(null);
  const [form, setForm] = useState({ title: "", requirement: "", rationale: "", rollback: "" });
  const passedChecks = latestPackage?.checks.filter((item) => item.status === "passed").length || 0;
  const readiness = latestPackage?.status === "ready" ? "Ready to share" : "A few details are still missing";

  return (
    <div className="space-y-4 p-2 lg:p-0">
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_38%),rgba(255,255,255,0.025)] p-5 lg:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-200">
              <ShieldCheck className="h-4 w-4" />
              Change proof
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              {coverage}% of this change has supporting evidence.
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              The essentials stay up front. Quality scores, graph links, signatures, and hashes are available when you need to inspect them.
            </p>
          </div>
          <div
            className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
            style={{ background: "conic-gradient(#22d3ee " + coverage + "%, rgba(148,163,184,.12) 0)" }}
            aria-label={"Evidence coverage " + coverage + "%"}
          >
            <div className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-[#0a101b] shadow-inner">
              <strong className="text-2xl font-semibold text-white">{coverage}</strong>
              <span className="text-[10px] text-slate-500">coverage</span>
            </div>
          </div>
        </div>
      </section>

      {focusedLocation && (
        <section className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.035] p-4" aria-label="Line evidence inspector">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10">
                <FileSearch className="h-4 w-4 text-cyan-200" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-white">Why this line exists</div>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {latestPackage?.rationale || "No rationale has been linked to this line yet."}
                </p>
              </div>
            </div>
            <Badge className="max-w-full shrink-0 truncate rounded-lg border-cyan-400/15 bg-cyan-400/10 font-mono text-[10px] text-cyan-100">
              {focusedLocation.fileName}:{focusedLocation.lineNumber}
            </Badge>
          </div>
          <div className="mt-4 grid gap-2 border-t border-white/[0.07] pt-4 sm:grid-cols-3">
            <div>
              <div className="text-[10px] text-slate-600">Changed by</div>
              <div className="mt-1 truncate text-xs text-slate-300">
                {focusedChange ? focusedChange.actor.name + " · " + focusedChange.source : "Awaiting a captured edit"}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-600">Requirement</div>
              <div className="mt-1 line-clamp-1 text-xs text-slate-300">{latestPackage?.requirement || "Not linked"}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-600">Review</div>
              <div className="mt-1 text-xs capitalize text-slate-300">{latestReview?.verdict.replace("-", " ") || "Not reviewed"}</div>
            </div>
          </div>
        </section>
      )}


      {latestPackage && !packageMode ? (
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="text-xs text-slate-500">Latest proof package</div>
              <h3 className="mt-1.5 text-lg font-semibold text-white">{latestPackage.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{latestPackage.requirement || "No requirement linked yet."}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
                latestPackage.status === "ready" ? "bg-emerald-400/10 text-emerald-200" : "bg-amber-400/10 text-amber-200"
              )}>
                {latestPackage.score}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{readiness}</div>
                <div className="mt-0.5 text-[11px] text-slate-500">{passedChecks} of {latestPackage.checks.length} essentials complete</div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {latestPackage.checks.map((item) => (
              <div key={item.id} className="flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-black/15 p-3" title={item.detail}>
                <EvidenceStatusIcon status={item.status} />
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-200">{item.label}</div>
                  <div className="mt-0.5 line-clamp-1 text-[11px] text-slate-600">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-2 border-t border-white/[0.07] pt-4 sm:flex-row">
            <Button
              className="h-10 rounded-xl bg-cyan-400 px-4 text-xs font-semibold text-slate-950 hover:bg-cyan-300"
              onClick={() => void onVerifyPackage(latestPackage.id)}
              disabled={syncing}
            >
              <ShieldCheck className="mr-2 h-4 w-4" /> Verify package
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-xl border-white/10 bg-transparent px-4 text-xs text-slate-300 hover:bg-white/[0.05]"
              onClick={() => setPackageMode(true)}
            >
              Create a new package
            </Button>
          </div>

          <details className="group mt-4 rounded-xl border border-white/[0.07] bg-black/15">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-medium text-slate-400">
              Technical verification
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <div className="space-y-3 border-t border-white/[0.07] p-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
                  <div className="text-[10px] text-slate-600">Change digest</div>
                  <div className="mt-1 truncate font-mono text-[10px] text-cyan-200">{latestPackage.changeDigest}</div>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
                  <div className="text-[10px] text-slate-600">Package signature</div>
                  <div className="mt-1 truncate font-mono text-[10px] text-slate-400">{latestPackage.signature}</div>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {latestPackage.attestations.map((item) => (
                  <div key={item.id} title={item.detail} className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 text-xs">
                    <EvidenceStatusIcon status={item.status === "verified" ? "passed" : item.status === "failed" ? "missing" : "warning"} />
                    <span className="truncate capitalize text-slate-400">{item.kind}</span>
                  </div>
                ))}
              </div>
              {latestPackage.signatureIssuer && (
                <p className="text-[10px] text-slate-600">
                  Issued by {latestPackage.signatureIssuer} · key {latestPackage.signatureKeyId} · {latestPackage.signatureAlgorithm}
                </p>
              )}
            </div>
          </details>
        </section>
      ) : (
        <section className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.025] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white">Create a proof package</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">Explain the change in four plain-language steps. You can update it later.</p>
            </div>
            {latestPackage && (
              <button onClick={() => setPackageMode(false)} className="text-xs text-slate-500 hover:text-white">Cancel</button>
            )}
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-medium text-slate-300">What changed?</span>
              <Input
                aria-label="Change title"
                value={form.title}
                onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))}
                placeholder="Example: Handle empty score lists"
                className="h-11 rounded-xl border-white/10 bg-black/20 text-sm"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium text-slate-300">What requirement does it meet?</span>
              <Textarea
                aria-label="Linked requirement"
                value={form.requirement}
                onChange={(event) => setForm((value) => ({ ...value, requirement: event.target.value }))}
                placeholder="Describe the user or business need"
                className="min-h-24 rounded-xl border-white/10 bg-black/20 text-sm"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium text-slate-300">Why this approach?</span>
              <Textarea
                aria-label="Change rationale"
                value={form.rationale}
                onChange={(event) => setForm((value) => ({ ...value, rationale: event.target.value }))}
                placeholder="Explain the cause and your decision"
                className="min-h-24 rounded-xl border-white/10 bg-black/20 text-sm"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium text-slate-300">How can it be safely undone?</span>
              <Textarea
                aria-label="Rollback strategy"
                value={form.rollback}
                onChange={(event) => setForm((value) => ({ ...value, rollback: event.target.value }))}
                placeholder="Describe the recovery plan"
                className="min-h-24 rounded-xl border-white/10 bg-black/20 text-sm"
              />
            </label>
          </div>
          <Button
            disabled={syncing || !form.title.trim()}
            onClick={async () => {
              await onCreatePackage(form);
              setPackageMode(false);
            }}
            className="mt-5 h-11 rounded-xl bg-cyan-400 px-5 text-xs font-semibold text-slate-950 hover:bg-cyan-300"
          >
            <PackageCheck className="mr-2 h-4 w-4" /> Save and seal package
          </Button>
        </section>
      )}


      <section>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-white">Explore supporting evidence</h3>
          <p className="mt-1 text-xs text-slate-500">Open a visual only when it helps answer your next question.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setOpenPanel((value) => value === "trail" ? null : "trail")}
            className={cn(
              "group overflow-hidden rounded-2xl border p-4 text-left transition",
              openPanel === "trail"
                ? "border-cyan-400/25 bg-cyan-400/[0.06]"
                : "border-white/[0.08] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.05]"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10">
                <GitCommitHorizontal className="h-4 w-4 text-cyan-200" />
              </span>
              <div className="flex items-center gap-1.5">
                {snapshot.graph.nodes.slice(-4).map((node, index) => (
                  <span key={node.id} className="flex items-center">
                    <span className={cn(
                      "h-2.5 w-2.5 rounded-full border-2",
                      node.status === "passed" ? "border-emerald-300" : node.status === "failed" ? "border-rose-300" : "border-cyan-300"
                    )} />
                    {index < Math.min(snapshot.graph.nodes.length, 4) - 1 && <span className="h-px w-3 bg-slate-700" />}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 text-sm font-semibold text-white">How is everything connected?</div>
            <p className="mt-1.5 text-xs leading-5 text-slate-500">Follow the path from requirement to change, execution, and review.</p>
            <span className="mt-3 inline-flex text-[11px] font-medium text-cyan-200">{snapshot.graph.nodes.length} linked items</span>
          </button>

          <button
            type="button"
            onClick={() => setOpenPanel((value) => value === "quality" ? null : "quality")}
            className={cn(
              "group overflow-hidden rounded-2xl border p-4 text-left transition",
              openPanel === "quality"
                ? "border-indigo-400/25 bg-indigo-400/[0.06]"
                : "border-white/[0.08] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.05]"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-400/10">
                <Sparkles className="h-4 w-4 text-indigo-200" />
              </span>
              <div className="flex h-8 items-end gap-1">
                {scoreLabels.map(([key]) => {
                  const value = snapshot.scorecard[key];
                  return typeof value === "number" ? (
                    <span key={key} className="w-1.5 rounded-full bg-indigo-300/60" style={{ height: Math.max(6, Math.round(value / 4)) }} />
                  ) : null;
                })}
              </div>
            </div>
            <div className="mt-4 text-sm font-semibold text-white">How strong is the evidence?</div>
            <p className="mt-1.5 text-xs leading-5 text-slate-500">See the six quality signals behind the overall coverage number.</p>
            <span className="mt-3 inline-flex text-[11px] font-medium text-indigo-200">View quality signals</span>
          </button>
        </div>
      </section>

      {openPanel === "quality" && (
        <section className="rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.025] p-5" aria-label="Assessment scorecard">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-white">Evidence quality</h3>
            <p className="mt-1 text-xs text-slate-500">Each score explains one part of confidence in the change.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {scoreLabels.map(([key, label, help]) => {
              const value = snapshot.scorecard[key];
              return typeof value === "number" ? (
                <div key={key} className="rounded-xl border border-white/[0.07] bg-black/15 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-200">{label}</span>
                    <span className="font-mono text-xs text-indigo-200">{value}</span>
                  </div>
                  <EvidenceScoreBar value={value} />
                  <p className="mt-2 text-[11px] text-slate-600">{help}</p>
                </div>
              ) : null;
            })}
          </div>
        </section>
      )}

      {openPanel === "trail" && (
        <section className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.025] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white">Evidence trail</h3>
              <p className="mt-1 text-xs text-slate-500">A readable story of how this change earned trust.</p>
            </div>
            <ScanSearch className="h-5 w-5 text-cyan-200" />
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="space-y-2">
              {snapshot.graph.edges.slice(-6).map((edge) => (
                <div key={edge.id} className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                  <span className="truncate rounded-lg border border-white/[0.07] bg-black/15 px-3 py-2 text-[11px] text-slate-400">
                    {snapshot.graph.nodes.find((node) => node.id === edge.source)?.label || edge.source}
                  </span>
                  <Badge className="border-cyan-400/15 bg-cyan-400/[0.06] text-[9px] text-cyan-200">{edge.relation}</Badge>
                  <span className="truncate rounded-lg border border-white/[0.07] bg-black/15 px-3 py-2 text-[11px] text-slate-400">
                    {snapshot.graph.nodes.find((node) => node.id === edge.target)?.label || edge.target}
                  </span>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-black/15 p-4">
              {snapshot.graph.nodes.slice(-8).map((node, index, nodes) => (
                <div key={node.id} className="relative flex gap-3 pb-4 last:pb-0">
                  {index < nodes.length - 1 && <div className="absolute bottom-0 left-[7px] top-4 w-px bg-slate-700" />}
                  <div className={cn(
                    "relative z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 bg-[#0a101b]",
                    node.status === "passed" ? "border-emerald-400" : node.status === "failed" ? "border-rose-400" : node.status === "warning" ? "border-amber-300" : "border-cyan-400"
                  )} />
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium capitalize text-slate-600">{node.kind}</div>
                    <div className="mt-0.5 line-clamp-2 text-xs text-slate-300">{node.label}</div>
                  </div>
                </div>
              ))}
              {!snapshot.graph.nodes.length && <div className="py-6 text-center text-xs text-slate-500">Record a change to begin the evidence trail.</div>}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

