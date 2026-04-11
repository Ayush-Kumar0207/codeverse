"use client";

import { motion } from "framer-motion";
import { Cloud, Laptop, Server } from "lucide-react";

interface NetworkTopologyProps {
  status: "idle" | "syncing" | "synced" | "error";
  isSynced: boolean;
}

export function NetworkTopology({ status, isSynced }: NetworkTopologyProps) {
  return (
    <div className="w-full h-48 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
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
            fill="var(--primary)"
            initial={{ "--offset-dist": "0%", opacity: 0 } as any}
            animate={{ 
               "--offset-dist": "100%",
               opacity: [0, 1, 0]
            }}
            transition={{ 
                "--offset-dist": { duration: 1.5, repeat: Infinity, ease: "linear" },
                opacity: { duration: 1.5, repeat: Infinity, ease: "linear" }
            }}
            style={{ 
                offsetPath: "path('M 100 75 L 200 75')",
                offsetDistance: "var(--offset-dist)",
                filter: "drop-shadow(0 0 8px var(--primary))"
            } as any}
          />
        )}

        {/* Sync Packets - Center to Right */}
        {status === "syncing" && (
          <motion.circle
            r="3"
            fill="var(--primary)"
            initial={{ "--offset-dist": "0%", opacity: 0 } as any}
            animate={{ 
               "--offset-dist": "100%",
               opacity: [0, 1, 0]
            }}
            transition={{ 
                "--offset-dist": { duration: 1.5, delay: 0.5, repeat: Infinity, ease: "linear" },
                opacity: { duration: 1.5, delay: 0.5, repeat: Infinity, ease: "linear" }
            }}
            style={{ 
                offsetPath: "path('M 200 75 L 300 75')",
                offsetDistance: "var(--offset-dist)",
                filter: "drop-shadow(0 0 8px var(--primary))"
            } as any}
          />
        )}
      </svg>

      {/* Node Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-16">
        <NodeIcon icon={Laptop} label="Local Node" active={true} />
        <NodeIcon icon={Cloud} label="Cloud Hub" active={isSynced} isHub />
        <NodeIcon icon={Server} label="Backup Node" active={false} />
      </div>

      {/* Ambient Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
    </div>
  );
}

function NodeIcon({ icon: Icon, label, active, isHub }: { icon: any, label: string, active: boolean, isHub?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div 
        animate={{ 
          scale: active ? 1.1 : 1,
          borderColor: active ? "var(--primary)" : "rgba(255,255,255,0.05)"
        }}
        className={`w-12 h-12 rounded-xl border flex items-center justify-center bg-black/60 relative z-10 transition-colors ${isHub ? 'shadow-[0_0_20px_rgba(99,102,241,0.2)] border-primary/20' : ''}`}
      >
        <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-white/20"}`} />
        {active && (
          <motion.div 
            layoutId="active-ring"
            className="absolute inset-0 rounded-xl border border-primary animate-pulse"
          />
        )}
      </motion.div>
      <span className={`text-[9px] uppercase font-bold tracking-[0.2em] ${active ? "text-primary" : "text-white/20"}`}>
        {label}
      </span>
    </div>
  );
}
