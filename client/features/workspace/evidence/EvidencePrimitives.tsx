import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function EvidenceStatusIcon({ status }: { status: string }) {
  if (status === "passed" || status === "approved" || status === "ready") {
    return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />;
  }
  if (status === "blocked" || status === "failed" || status === "missing") {
    return <XCircle className="h-3.5 w-3.5 text-rose-300" />;
  }
  return <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />;
}

export function EvidenceScoreBar({ value }: { value: number }) {
  return (
    <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-800">
      <div
        style={{ width: value + "%" }}
        className={cn("h-full rounded-full transition-[width]", value >= 80 ? "bg-emerald-400" : value >= 60 ? "bg-amber-300" : "bg-rose-400")}
      />
    </div>
  );
}

export function eventAccent(type: string) {
  if (type.includes("failed")) return "border-rose-400/35 bg-rose-400/10 text-rose-200";
  if (type.includes("passed") || type.includes("succeeded")) return "border-emerald-400/35 bg-emerald-400/10 text-emerald-200";
  if (type.startsWith("ai.")) return "border-violet-400/35 bg-violet-400/10 text-violet-200";
  if (type.startsWith("review") || type.startsWith("understanding")) return "border-cyan-400/35 bg-cyan-400/10 text-cyan-200";
  return "border-slate-700 bg-slate-900 text-slate-300";
}

