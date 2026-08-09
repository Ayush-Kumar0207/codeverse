"use client";

import { motion } from "framer-motion";
import { Cloud, Database, Laptop, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SyncPhase = "idle" | "queued" | "uploading" | "verifying" | "complete" | "failed";

interface NetworkTopologyProps {
  status: "idle" | "syncing" | "synced" | "pending" | "error";
  phase: SyncPhase;
  isSynced: boolean;
}

export function NetworkTopology({ status, phase, isSynced }: NetworkTopologyProps) {
  const hasError = status === "error";
  const isPending = status === "pending";
  const isSyncing = status === "syncing";
  const activeLeg = isSyncing ? (phase === "verifying" ? 1 : 0) : -1;
  const completedLegs = isSynced ? 2 : isSyncing && phase === "verifying" ? 1 : 0;
  const stateLabel = hasError
    ? "Sync could not continue"
    : isPending
      ? "Saved on device — retry queued"
      : isSyncing
        ? phase === "verifying" ? "Verifying snapshot history" : "Uploading to cloud"
        : isSynced
          ? "Snapshot verified"
          : "Local changes waiting";
  const paths = ["M 82 82 L 200 82", "M 200 82 L 318 82"];

  return (
    <div
      className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/30"
      role="img"
      aria-label={`Settings sync topology: ${stateLabel}`}
      data-testid="settings-sync-topology"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
      <div className={cn(
        "absolute left-1/2 top-4 -translate-x-1/2 rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em]",
        hasError && "border-rose-400/20 bg-rose-400/10 text-rose-300",
        isPending && "border-amber-300/25 bg-amber-300/10 text-amber-200",
        isSyncing && "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
        !hasError && !isPending && !isSyncing && isSynced && "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        !hasError && !isPending && !isSyncing && !isSynced && "border-white/10 bg-white/[0.04] text-white/40"
      )}>
        {stateLabel}
      </div>

      <svg width="100%" height="160" viewBox="0 0 400 160" className="absolute inset-x-0 top-8 opacity-90" aria-hidden="true">
        {paths.map((path, index) => {
          const isActive = index === activeLeg;
          const isComplete = index < completedLegs;
          const stroke = hasError && index === 0
            ? "rgba(251,113,133,0.7)"
            : isPending && index === 0
              ? "rgba(252,211,77,0.55)"
              : isComplete
                ? "rgba(52,211,153,0.65)"
                : isActive
                  ? "hsl(var(--primary))"
                  : "rgba(255,255,255,0.12)";

          return (
            <motion.path
              key={path}
              d={path}
              fill="none"
              stroke={stroke}
              strokeWidth={isComplete ? 2.5 : 2}
              strokeDasharray={isComplete ? "0" : "6 6"}
              animate={isActive ? { strokeDashoffset: [0, -24] } : { strokeDashoffset: 0 }}
              transition={isActive ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0.25 }}
            />
          );
        })}

        {isSyncing && phase === "uploading" && <SyncPacket from={82} to={200} />}
        {isSyncing && phase === "verifying" && <SyncPacket from={200} to={318} />}
      </svg>

      <div className="absolute inset-x-0 top-[4.7rem] flex items-center justify-between px-7 sm:px-14">
        <NodeIcon icon={Laptop} label="This device" state="active" />
        <NodeIcon
          icon={Cloud}
          label="Cloud API"
          state={hasError ? "error" : isPending ? "pending" : isSyncing || isSynced ? "active" : "idle"}
          pulse={isSyncing && phase === "uploading"}
        />
        <NodeIcon
          icon={Database}
          label="Snapshot history"
          state={isSyncing && phase === "verifying" || isSynced ? "active" : "idle"}
          pulse={isSyncing && phase === "verifying"}
        />
      </div>
    </div>
  );
}

function SyncPacket({ from, to }: { from: number; to: number }) {
  return (
    <motion.circle
      r="4"
      cy="82"
      fill="hsl(var(--primary))"
      initial={{ cx: from, opacity: 0 }}
      animate={{ cx: to, opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      style={{ filter: "drop-shadow(0 0 8px hsl(var(--primary)))" }}
    />
  );
}

function NodeIcon({
  icon: Icon,
  label,
  state,
  pulse = false,
}: {
  icon: LucideIcon;
  label: string;
  state: "idle" | "active" | "pending" | "error";
  pulse?: boolean;
}) {
  return (
    <div className="flex w-24 flex-col items-center gap-2 text-center">
      <motion.div
        animate={{ scale: pulse ? [1, 1.08, 1] : 1 }}
        transition={pulse ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
        className={cn(
          "relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border bg-black/70 transition-colors",
          state === "active" && "border-primary/50 text-primary shadow-[0_0_24px_hsl(var(--primary)/0.16)]",
          state === "idle" && "border-white/10 text-white/25",
          state === "pending" && "border-amber-300/40 text-amber-200",
          state === "error" && "border-rose-400/40 text-rose-300"
        )}
      >
        <Icon className="h-5 w-5" />
        {state === "active" && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-black bg-emerald-300" />}
        {state === "pending" && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-black bg-amber-300" />}
      </motion.div>
      <span className={cn(
        "text-[9px] font-bold uppercase tracking-[0.16em]",
        state === "active" && "text-primary",
        state === "idle" && "text-white/25",
        state === "pending" && "text-amber-200",
        state === "error" && "text-rose-300"
      )}>
        {label}
      </span>
    </div>
  );
}
