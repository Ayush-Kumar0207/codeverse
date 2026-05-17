"use client";

import { motion } from "framer-motion";
import { Cloud, Laptop, Server, type LucideIcon } from "lucide-react";

interface NetworkTopologyProps {
  status: "idle" | "syncing" | "synced" | "error";
  isSynced: boolean;
}

export function NetworkTopology({ status, isSynced }: NetworkTopologyProps) {
  return (
    <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black/30">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
      <svg width="400" height="150" viewBox="0 0 400 150" className="opacity-80">
        {/* Connection Paths */}
        <path
          d="M 100 75 L 200 75"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M 300 75 L 200 75"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Sync Packets - Left to Center */}
        {status === "syncing" && (
          <motion.circle
            r="3"
            cy="75"
            fill="var(--primary)"
            initial={{ cx: 100, opacity: 0 }}
            animate={{ 
               cx: 200,
               opacity: [0, 1, 0]
            }}
            transition={{ 
                cx: { duration: 1.5, repeat: Infinity, ease: "linear" },
                opacity: { duration: 1.5, repeat: Infinity, ease: "linear" }
            }}
            style={{ 
                filter: "drop-shadow(0 0 8px var(--primary))"
            }}
          />
        )}

        {/* Sync Packets - Center to Right */}
        {status === "syncing" && (
          <motion.circle
            r="3"
            cy="75"
            fill="var(--primary)"
            initial={{ cx: 200, opacity: 0 }}
            animate={{ 
               cx: 300,
               opacity: [0, 1, 0]
            }}
            transition={{ 
                cx: { duration: 1.5, delay: 0.5, repeat: Infinity, ease: "linear" },
                opacity: { duration: 1.5, delay: 0.5, repeat: Infinity, ease: "linear" }
            }}
            style={{ 
                filter: "drop-shadow(0 0 8px var(--primary))"
            }}
          />
        )}
      </svg>

      {/* Node Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-8 sm:px-16">
        <NodeIcon icon={Laptop} label="Local Node" active={true} />
        <NodeIcon icon={Cloud} label="Cloud Hub" active={isSynced} isHub />
        <NodeIcon icon={Server} label="Backup Node" active={false} />
      </div>
    </div>
  );
}

function NodeIcon({ icon: Icon, label, active, isHub }: { icon: LucideIcon, label: string, active: boolean, isHub?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div 
        animate={{ 
          scale: active ? 1.1 : 1,
          borderColor: active ? "var(--primary)" : "rgba(255,255,255,0.05)"
        }}
        className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-md border bg-black/60 transition-colors ${isHub && active ? 'border-primary/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : ''}`}
      >
        <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-white/20"}`} />
        {active && (
          <motion.div 
            layoutId="active-ring"
            className="absolute inset-0 rounded-md border border-primary animate-pulse"
          />
        )}
      </motion.div>
      <span className={`text-[9px] uppercase font-bold tracking-[0.2em] ${active ? "text-primary" : "text-white/20"}`}>
        {label}
      </span>
    </div>
  );
}
