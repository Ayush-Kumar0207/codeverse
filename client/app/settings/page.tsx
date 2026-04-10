"use client";

import { motion } from "framer-motion";
import { 
  Palette, 
  Settings2, 
  Terminal, 
  Cpu, 
  Database, 
  Cloud, 
  Monitor, 
  Shield, 
  Activity,
  ChevronRight,
  Zap,
  Sliders
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SettingsHub() {
  const [activeTab, setActiveTab] = useState("appearance");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center">
      {/* Ambient Background Visuals */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] glow-orb opacity-30 select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] glow-orb-secondary opacity-20 select-none" />
      <div className="fixed inset-0 noise-bg pointer-events-none opacity-20" />

      <main className="w-full max-w-6xl px-8 py-12 relative z-10 flex flex-col gap-12">
        
        {/* Header / Brand */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
             <div className="h-0.5 w-12 bg-primary" />
             <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">System Overrides</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter">
            Kernel <span className="text-primary italic">Config</span>
          </h1>
          <p className="text-muted-foreground text-sm font-mono uppercase tracking-[0.1em] mt-2 opacity-60">
            Node: codeverse-core-v2 // Status: Secure // Latecy: 14ms
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Sidebar Navigation */}
           <div className="lg:col-span-3 flex flex-col gap-4">
              {[
                { id: "appearance", label: "Appearance", icon: Palette },
                { id: "editor", label: "Editor Tuning", icon: Settings2 },
                { id: "diagnostics", label: "Diagnostics", icon: Activity },
                { id: "cloud", label: "Cloud Sync", icon: Cloud },
                { id: "security", label: "Security", icon: Shield },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm uppercase tracking-widest",
                    activeTab === item.id 
                      ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
           </div>

           {/* Configuration Modules */}
           <div className="lg:col-span-9 flex flex-col gap-8">
              
              {/* Module: Appearance */}
              {activeTab === "appearance" && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                   <ConfigCard title="Theme Engine" icon={Monitor}>
                      <div className="flex flex-col gap-4">
                         <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                            <span className="text-sm font-bold">Midnight Dark</span>
                            <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                         </div>
                         <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 opacity-50">
                            <span className="text-sm font-bold">Hacker High Contrast</span>
                            <div className="w-4 h-4 rounded-full border border-white/20" />
                         </div>
                      </div>
                   </ConfigCard>

                   <ConfigCard title="Kinetic Effects" icon={Zap}>
                      <div className="space-y-4">
                        <SettingToggle label="Ambient Glow Orbs" active />
                        <SettingToggle label="Interface Animations" active />
                        <SettingToggle label="Neon Overdrive" />
                      </div>
                   </ConfigCard>

                   <ConfigCard title="Interface Scale" icon={Sliders} className="md:col-span-2">
                       <div className="px-2 py-4">
                          <input type="range" className="w-full accent-primary bg-white/5 rounded-lg appearance-none h-1.5 cursor-pointer" />
                          <div className="flex justify-between mt-2 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                             <span>Compact</span>
                             <span>Standard</span>
                             <span>Expanded</span>
                          </div>
                       </div>
                   </ConfigCard>
                </motion.div>
              )}

              {/* Module: Editor Tuning */}
              {activeTab === "editor" && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                   <ConfigCard title="Intellisense" icon={Cpu}>
                      <div className="space-y-4">
                        <SettingToggle label="AI Autocomplete" active />
                        <SettingToggle label="Context-Aware Logic" active />
                        <SettingToggle label="Neural Pair Programming" />
                      </div>
                   </ConfigCard>

                   <ConfigCard title="Formatting" icon={Terminal}>
                      <div className="grid grid-cols-1 gap-4">
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Tab Multiplier</span>
                            <div className="flex gap-2">
                               {[2, 4, 8].map(n => (
                                 <button key={n} className={cn("px-4 py-2 rounded-lg border border-white/5 font-mono text-xs hover:bg-white/5", n === 2 ? "text-primary border-primary/50" : "text-muted-foreground")}>{n}</button>
                               ))}
                            </div>
                         </div>
                         <SettingToggle label="Format on Save" active />
                      </div>
                   </ConfigCard>
                </motion.div>
              )}

              {/* Module: Diagnostics */}
              {activeTab === "diagnostics" && (
                <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex flex-col gap-6"
                >
                   <div className="glass-effect rounded-3xl border-white/5 p-8 flex flex-col gap-8">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                               <Database className="w-6 h-6" />
                            </div>
                            <div>
                               <h3 className="text-xl font-bold font-outfit uppercase">System Health</h3>
                               <p className="text-xs text-muted-foreground uppercase tracking-widest">Diagnostic Report // Finalized 11:27</p>
                            </div>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="text-3xl font-black text-green-400 font-outfit">OK</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Cluster Status</span>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <StatBar label="Node Latency" val="14ms" percent={12} color="bg-blue-400" />
                         <StatBar label="Memory Usage" val="1.2GB" percent={45} color="bg-purple-400" />
                         <StatBar label="Thread Load" val="Active" percent={82} color="bg-green-400" />
                      </div>

                      <div className="bg-black/40 p-5 rounded-2xl border border-white/5 font-mono text-xs space-y-2">
                         <p className="text-green-400">[SYSTEM] Connection established to US-East-1 cluster.</p>
                         <p className="text-blue-400">[SYNC] Initialized database handshake in 42ms.</p>
                         <p className="text-muted-foreground/50">[IDLE] Waiting for kernel instructions...</p>
                      </div>
                   </div>
                </motion.div>
              )}

           </div>

        </div>

      </main>
    </div>
  );
}

function ConfigCard({ title, icon: Icon, children, className }: { title: string, icon: any, children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("glass-effect rounded-2xl border-white/5 p-6 flex flex-col gap-4", className)}>
       <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
          <Icon className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
       </div>
       {children}
    </div>
  );
}

function SettingToggle({ label, active }: { label: string, active?: boolean }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
       <span className={cn("text-xs font-bold transition-colors", active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>{label}</span>
       <div className={cn(
         "w-8 h-4 rounded-full relative transition-all duration-300",
         active ? "bg-primary shadow-[0_0_10px_rgba(99,102,241,0.4)]" : "bg-white/10"
       )}>
          <div className={cn(
            "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300",
            active ? "left-4.5" : "left-0.5"
          )} />
       </div>
    </div>
  );
}

function StatBar({ label, val, percent, color }: { label: string, val: string, percent: number, color: string }) {
  return (
    <div className="flex flex-col gap-2">
       <div className="flex justify-between items-end">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">{label}</span>
          <span className="text-sm font-black font-outfit">{val}</span>
       </div>
       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn("h-full", color)} 
          />
       </div>
    </div>
  );
}
