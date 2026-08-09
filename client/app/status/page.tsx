"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ArrowLeft, Cloud, Database, RefreshCw, Radio, Server, ShieldCheck } from "lucide-react";
import { getApiBaseUrl } from "@/services/runtime-config";
import { cn } from "@/lib/utils";

type ComponentStatus = {
  status: "operational" | "degraded" | "outage";
  ready: boolean;
  latencyMs?: number;
  detail?: string;
  mode?: string;
  distributed?: boolean;
  uptimeSeconds?: number;
  release?: string;
};

type PublicStatus = {
  status: "operational" | "degraded" | "partial-outage";
  checkedAt: string;
  components: {
    api: ComponentStatus;
    database: ComponentStatus;
    collaboration: ComponentStatus;
  };
  realtime?: {
    connectedSockets: number;
    totalConnections: number;
    totalReconnects: number;
    crdtUpdates: number;
    duplicateOperations: number;
    latencyMs: { samples: number; p50: number | null; p95: number | null; p99: number | null };
  } | null;
  slo: {
    availabilityTarget: number;
    collaborationP95TargetMs: number;
    reconnectSuccessTarget: number;
  };
};

const componentMeta = {
  api: { label: "API Core", icon: Server },
  database: { label: "Durable Storage", icon: Database },
  collaboration: { label: "Collaboration Mesh", icon: Radio },
} as const;

function statusCopy(status?: PublicStatus["status"]) {
  if (status === "operational") return { title: "All systems operational", detail: "CodeVerse is ready for editing, synchronization, and evidence workflows." };
  if (status === "degraded") return { title: "Operating with reduced redundancy", detail: "Core work remains available while one component is using a safe fallback." };
  if (status === "partial-outage") return { title: "A service needs attention", detail: "Local work remains protected while the affected cloud component recovers." };
  return { title: "Checking production systems", detail: "Contacting the API, database, and collaboration mesh." };
}

export default function StatusPage() {
  const [status, setStatus] = useState<PublicStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [roundTripMs, setRoundTripMs] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const startedAt = performance.now();
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/status`, { cache: "no-store" });
      const payload = await response.json() as PublicStatus;
      if (!response.ok && response.status !== 503) throw new Error("Status service did not respond normally");
      setStatus(payload);
      setRoundTripMs(Math.round(performance.now() - startedAt));
      setError("");
    } catch {
      setError("The public status feed is temporarily unreachable. Your open workspace remains on this device.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(), 30_000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  const copy = statusCopy(status?.status);
  const operational = status?.status === "operational";

  return (
    <main className="min-h-screen bg-[#05090d] px-4 py-8 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-white/[0.08] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-200">
              <ArrowLeft className="h-4 w-4" /> Back to CodeVerse
            </Link>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
              <Activity className="h-4 w-4" /> Production status
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{copy.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">{copy.detail}</p>
          </div>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08] disabled:opacity-60"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh status
          </button>
        </header>

        <section className={cn(
          "mt-8 flex items-center gap-4 rounded-2xl border px-5 py-4",
          operational ? "border-emerald-400/20 bg-emerald-400/[0.06]" : "border-amber-400/20 bg-amber-400/[0.06]"
        )} role="status">
          <span className={cn("relative flex h-3 w-3 rounded-full", operational ? "bg-emerald-300" : "bg-amber-300")}>
            <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-35" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{error || (operational ? "Production checks are passing" : "Resilient service mode is active")}</p>
            <p className="mt-1 text-xs text-slate-500">
              {status ? `Checked ${new Date(status.checkedAt).toLocaleString()}${roundTripMs ? ` · ${roundTripMs} ms round trip` : ""}` : "Awaiting first response"}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {status && Object.entries(status.components).map(([key, component]) => {
            const meta = componentMeta[key as keyof typeof componentMeta];
            const Icon = meta.icon;
            return (
              <article key={key} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06]">
                    <Icon className="h-5 w-5 text-cyan-200" />
                  </div>
                  <span className={cn(
                    "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                    component.status === "operational"
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                      : component.status === "degraded"
                        ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
                        : "border-rose-400/20 bg-rose-400/10 text-rose-200"
                  )}>{component.status}</span>
                </div>
                <h2 className="mt-5 text-lg font-semibold">{meta.label}</h2>
                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">{component.detail || "Production probe completed."}</p>
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4 text-xs text-slate-500">
                  <span>{component.mode || (component.ready ? "Ready" : "Unavailable")}</span>
                  <span>{component.latencyMs != null ? `${component.latencyMs} ms` : component.uptimeSeconds != null ? `${component.uptimeSeconds}s uptime` : "Live"}</span>
                </div>
              </article>
            );
          })}
          {!status && [0, 1, 2].map((item) => <div key={item} className="h-60 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.025]" />)}
        </section>

        {status?.realtime && (
          <section className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                  <GitMergeIcon /> Live collaboration telemetry
                </div>
                <h2 className="mt-3 text-2xl font-semibold">Measured at the realtime core</h2>
              </div>
              <div className="inline-flex items-center gap-2 text-xs text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-300" /> No project content is exposed</div>
            </div>
            <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3 lg:grid-cols-6">
              {[
                ["Connected", status.realtime.connectedSockets],
                ["Sessions", status.realtime.totalConnections],
                ["Reconnects", status.realtime.totalReconnects],
                ["CRDT updates", status.realtime.crdtUpdates],
                ["p95 latency", status.realtime.latencyMs.p95 == null ? "—" : `${status.realtime.latencyMs.p95} ms`],
                ["p99 latency", status.realtime.latencyMs.p99 == null ? "—" : `${status.realtime.latencyMs.p99} ms`],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#090e18] px-4 py-4">
                  <p className="text-xl font-semibold text-slate-100">{value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-8 flex flex-col gap-3 border-t border-white/[0.08] py-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>Automatic refresh every 30 seconds</span>
          <span>SLO: {status?.slo.availabilityTarget ?? 99.9}% availability · p95 collaboration under {status?.slo.collaborationP95TargetMs ?? 150} ms</span>
        </footer>
      </div>
    </main>
  );
}

function GitMergeIcon() {
  return <Cloud className="h-4 w-4" />;
}
