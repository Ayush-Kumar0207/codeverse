"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  Zap,
  Sliders,
  Code,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { NetworkTopology } from "@/components/NetworkTopology";
import { useSettings, ThemeType, ScaleType, AudioProfile, Snapshot } from "@/context/SettingsContext";

export default function SettingsHub() {
  const [activeTab, setActiveTab] = useState("appearance");
  const { 
    settings, 
    updateSetting, 
    jsonConfig, 
    setJsonConfig, 
    apm, 
    diagnostics, 
    toggleStressMode, 
    flushMemory,
    syncStatus,
    snapshots,
    performSync,
    rollback,
    isSynced
  } = useSettings();
  const [showCode, setShowCode] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null);
  const [isDiffExpanded, setIsDiffExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center">
      {/* Ambient Background Visuals */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] glow-orb opacity-30 select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] glow-orb-secondary opacity-20 select-none" />
      <div className="fixed inset-0 noise-bg pointer-events-none opacity-20" />

      <main className="w-full max-w-7xl px-8 py-12 relative z-10 flex flex-col gap-12">
        
        {/* Header / Brand */}
        <div className="flex justify-between items-end">
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
              <span className="text-foreground">Kernel</span> <span className="text-primary italic">Config</span>
            </h1>
            <p className="text-muted-foreground text-sm font-mono uppercase tracking-[0.1em] mt-2 opacity-60">
              Node: codeverse-core-v2 // Status: Secure // Flow State: {apm} APM
            </p>
          </motion.div>

          <button 
            onClick={() => setShowCode(!showCode)}
            className={cn(
               "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border border-white/5",
               showCode ? "bg-primary text-white" : "text-muted-foreground hover:bg-white/5"
            )}
          >
            <Code className="w-4 h-4" />
            {showCode ? "Exit Code View" : "UI-as-Code"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           
           {/* Sidebar Navigation */}
           <div className="lg:col-span-3 flex flex-col gap-4 sticky top-12">
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
           <div className={cn("transition-all duration-500", showCode ? "lg:col-span-5" : "lg:col-span-9")}>
              <AnimatePresence mode="wait">
                {activeTab === "appearance" && (
                  <motion.div 
                    key="appearance"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                     <ConfigCard title="Theme Engine" icon={Monitor}>
                        <div className="flex flex-col gap-4">
                           {(["midnight", "hacker", "solarized", "amoled"] as ThemeType[]).map((t) => (
                             <ThemeOption 
                                key={t} 
                                label={t} 
                                active={settings.appearance.theme === t} 
                                onClick={() => updateSetting("appearance", { theme: t })}
                             />
                           ))}
                        </div>
                     </ConfigCard>

                     <ConfigCard title="Kinetic Effects" icon={Zap}>
                        <div className="space-y-4">
                          <SettingToggle 
                            label="Ambient Glow Orbs" 
                            active={settings.kinetics.glowOrbs} 
                            onToggle={() => updateSetting("kinetics", { glowOrbs: !settings.kinetics.glowOrbs })}
                          />
                          <SettingToggle 
                            label="Interface Animations" 
                            active={settings.kinetics.animations} 
                            onToggle={() => updateSetting("kinetics", { animations: !settings.kinetics.animations })}
                          />
                          <SettingToggle 
                            label="Neon Overdrive (APM Driven)" 
                            active={settings.kinetics.neonOverdrive} 
                            onToggle={() => updateSetting("kinetics", { neonOverdrive: !settings.kinetics.neonOverdrive })}
                          />
                          <SettingToggle 
                             label="Force Reduced Motion" 
                             active={settings.kinetics.reducedMotionOverride} 
                             onToggle={() => updateSetting("kinetics", { reducedMotionOverride: !settings.kinetics.reducedMotionOverride })}
                          />
                        </div>
                     </ConfigCard>

                     <ConfigCard 
                        title={`Interface Scale: ${Math.round(settings.appearance.scale * 100)}%`} 
                        icon={Sliders} 
                        className="md:col-span-2"
                     >
                          <div className="px-2 py-4">
                             <input 
                               type="range" 
                               min="0.75" 
                               max="1.25" 
                               step="0.01"
                               value={settings.appearance.scale}
                               onChange={(e) => {
                                 updateSetting("appearance", { scale: parseFloat(e.target.value) });
                               }}
                               className="w-full accent-primary bg-white/5 rounded-lg appearance-none h-1.5 cursor-pointer" 
                             />
                             <div className="flex justify-between mt-2 text-[10px] uppercase font-bold text-muted-foreground tracking-widest opacity-50">
                                <span>Minimum (75%)</span>
                                <span>Standard (100%)</span>
                                <span>Maximum (125%)</span>
                             </div>
                          </div>
                     </ConfigCard>
                  </motion.div>
                )}

                {activeTab === "editor" && (
                  <motion.div 
                    key="editor"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                     <ConfigCard title="Intellisense" icon={Cpu}>
                        <div className="space-y-4">
                          <SettingToggle 
                            label="AI Autocomplete" 
                            active={settings.editor.autocomplete} 
                            onToggle={() => updateSetting("editor", { autocomplete: !settings.editor.autocomplete })}
                          />
                          <SettingToggle label="Context-Aware Logic" active />
                        </div>
                     </ConfigCard>

                     <ConfigCard title="Formatting" icon={Terminal}>
                        <div className="grid grid-cols-1 gap-4">
                           <div className="flex flex-col gap-1">
                              <span className="text-[10px] uppercase font-bold text-muted-foreground">Tab Multiplier</span>
                              <div className="flex gap-2">
                                 {[2, 4, 8].map(n => (
                                   <button 
                                     key={n} 
                                     onClick={() => updateSetting("editor", { tabSize: n as any })}
                                     className={cn(
                                       "px-4 py-2 rounded-lg border border-white/5 font-mono text-xs hover:bg-white/5 transition-all", 
                                       settings.editor.tabSize === n ? "text-primary border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "text-muted-foreground"
                                     )}
                                   >
                                     {n}
                                   </button>
                                 ))}
                              </div>
                           </div>
                           <SettingToggle 
                             label="Format on Save" 
                             active={settings.editor.formatOnSave} 
                             onToggle={() => updateSetting("editor", { formatOnSave: !settings.editor.formatOnSave })}
                           />
                        </div>
                     </ConfigCard>

                     <ConfigCard title="Acoustic Haptics" icon={Activity} className="md:col-span-2">
                        <div className="flex gap-4">
                           {(["none", "mechanical", "synth"] as AudioProfile[]).map((p) => (
                             <button
                               key={p}
                               onClick={() => updateSetting("audio", { profile: p })}
                               className={cn(
                                 "flex-1 px-4 py-3 rounded-xl border border-white/5 font-bold text-xs uppercase tracking-widest transition-all",
                                 settings.audio.profile === p ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-white/5"
                               )}
                             >
                               {p}
                             </button>
                           ))}
                        </div>
                     </ConfigCard>
                  </motion.div>
                )}

                {activeTab === "diagnostics" && (
                  <motion.div 
                     key="diagnostics"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="flex flex-col gap-6"
                  >
                     <div className="glass-effect rounded-3xl border-white/5 p-8 flex flex-col gap-8 relative overflow-hidden">
                        {/* Neural Pulse Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] -mr-32 -mt-32 animate-pulse" />
                        
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                 <Database className="w-6 h-6" />
                              </div>
                              <div>
                                 <h3 className="text-xl font-bold font-outfit uppercase">System Health</h3>
                                 <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Neural Heartbeat // Active</p>
                              </div>
                           </div>
                           
                           <div className="flex gap-2">
                               <Button 
                                 variant="outline" 
                                 size="sm" 
                                 onClick={toggleStressMode}
                                 className={cn("h-8 text-[10px] font-bold uppercase tracking-widest border-white/20 text-slate-400 hover:text-white transition-all", diagnostics.stressMode && "bg-destructive/20 border-destructive/50 text-destructive")}
                               >
                                Trigger Heap Stress
                              </Button>
                               <Button 
                                 variant="outline" 
                                 size="sm" 
                                 onClick={flushMemory}
                                 className="h-8 text-[10px] font-bold uppercase tracking-widest border-white/20 text-slate-400 hover:text-primary hover:border-primary/50 transition-all"
                               >
                                Flush Memory
                              </Button>
                           </div>

                           <div className="flex flex-col items-end">
                              <span className={cn(
                                "text-3xl font-black font-outfit uppercase tracking-tighter transition-colors duration-500",
                                diagnostics.stressMode ? "text-destructive" : "text-green-400"
                              )}>
                                {diagnostics.stressMode ? "Critical" : "Healthy"}
                              </span>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Cluster Status</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                           <StatCard 
                             label="Node Latency" 
                             val={`${diagnostics.latency}ms`} 
                             data={diagnostics.latency} 
                             color="#60A5FA" 
                             max={100}
                           />
                           <StatCard 
                             label="Memory Usage" 
                             val={`${(diagnostics.memory / 1024).toFixed(2)}GB`} 
                             data={diagnostics.memory} 
                             color="#C084FC" 
                             max={2048}
                           />
                           <StatCard 
                             label="Thread Load" 
                             val={`${Math.round(diagnostics.load)}%`} 
                             data={diagnostics.load} 
                             color="#4ADE80" 
                             max={100}
                           />
                        </div>

                        <div className="flex flex-col gap-3 relative z-10">
                           <div className="flex items-center gap-2 opacity-50">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Real Telemetry Log</span>
                           </div>
                           <div className="bg-black/60 p-5 rounded-2xl border border-white/5 font-mono text-[11px] h-40 overflow-y-auto flex flex-col gap-1 custom-scrollbar">
                              {diagnostics.logs.map((log) => (
                                <div key={log.id} className="flex gap-4 group">
                                   <span className="text-white/20 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                   <span className={cn(
                                     "font-bold shrink-0 w-16",
                                     log.type === 'sys' && "text-blue-400",
                                     log.type === 'sync' && "text-purple-400",
                                     log.type === 'neural' && "text-primary",
                                     log.type === 'critical' && "text-destructive"
                                   )}>
                                     {log.type.toUpperCase()}
                                   </span>
                                   <span className="text-white/70 group-hover:text-white transition-colors">{log.msg}</span>
                                </div>
                              ))}
                              <div className="pt-2 text-primary/40 animate-pulse">_ system awaiting neural pulse...</div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === "cloud" && (
                  <motion.div 
                    key="cloud"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-8"
                  >
                    {/* Topology Header */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                               <Cloud className="w-5 h-5" />
                            </div>
                            <div>
                               <h3 className="text-lg font-bold text-white font-outfit uppercase">Network Topology</h3>
                               <p className="text-[10px] text-white/50 uppercase tracking-widest">Enterprise Sync Engine // Status: {syncStatus.toUpperCase()}</p>
                            </div>
                         </div>
                         <Button 
                            onClick={() => performSync(true)} 
                            disabled={syncStatus === 'syncing'}
                            className="bg-primary/20 text-primary border-primary/30 hover:bg-primary hover:text-white uppercase font-black text-[10px] tracking-widest h-10 px-6 shadow-2xl transition-all"
                         >
                            {syncStatus === 'syncing' ? "Synchronizing..." : "Initiate Sync"}
                         </Button>
                      </div>
                      <NetworkTopology status={syncStatus} isSynced={isSynced} />
                    </div>

                    {/* Temporal Timeline */}
                    <div className="glass-effect rounded-3xl border-white/5 p-8 flex flex-col gap-8">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                         <Clock className="w-4 h-4 text-primary" />
                         <h3 className="text-sm font-bold text-white uppercase tracking-widest">Temporal Config History</h3>
                      </div>

                      <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                         {snapshots.length === 0 ? (
                           <div className="flex flex-col items-center justify-center gap-3 py-10 opacity-30">
                              <AlertCircle className="w-8 h-8 text-white" />
                              <span className="text-[10px] uppercase font-bold text-white tracking-widest">No Temporal Nodes Detected</span>
                           </div>
                         ) : snapshots.map((snap) => (
                           <div key={snap.id} className="flex flex-col gap-3">
                              <button 
                                onClick={() => {
                                  setSelectedSnapshot(snap);
                                  setIsDiffExpanded(selectedSnapshot?.id !== snap.id || !isDiffExpanded);
                                }}
                                className={cn(
                                  "flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                                  selectedSnapshot?.id === snap.id ? "bg-primary/10 border-primary/40 shadow-lg" : "bg-white/5 border-white/5 hover:border-white/10"
                                )}
                              >
                                 <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <div className="flex flex-col">
                                       <span className="font-mono text-[11px] font-bold text-white/90">{snap.hash}</span>
                                       <span className="text-[9px] text-white/40 uppercase font-medium">{new Date(snap.timestamp).toLocaleString()}</span>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <span className="text-[10px] uppercase font-black text-white/20">Snapshot Active</span>
                                    <Code className="w-3 h-3 text-white/20" />
                                 </div>
                              </button>

                              {/* Diff Preview Expansion */}
                              <AnimatePresence>
                                {selectedSnapshot?.id === snap.id && isDiffExpanded && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                     <div className="p-5 rounded-xl bg-black/40 border border-primary/20 flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                           <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Diff Preview // Configuration Hash</span>
                                           <span className="text-[10px] font-mono text-white/40">{snap.id}</span>
                                        </div>
                                        <div className="bg-black/60 p-4 rounded-lg font-mono text-[10px] text-blue-300/80 overflow-x-auto">
                                           <pre>{JSON.stringify(snap.config, null, 2)}</pre>
                                        </div>
                                        <Button 
                                          onClick={() => rollback(snap.config, snap.hash)}
                                          className="w-full bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive hover:text-white uppercase font-black text-[11px] tracking-[0.2em] h-10 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                                        >
                                          Rollback to this state
                                        </Button>
                                     </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                           </div>
                         ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "security" && (
                  <motion.div 
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="glass-effect rounded-3xl border-white/5 p-8 flex flex-col items-center justify-center gap-4 text-center py-20">
                       <Shield className="w-16 h-16 text-primary/20 mb-2" />
                       <h3 className="text-xl font-bold font-outfit uppercase">Security Protocols</h3>
                       <p className="text-sm text-muted-foreground max-w-sm">Encryption keys and biometric handshake settings are managed at the Kernel level. Section initialization pending.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           {/* UI-as-Code Pane */}
           <AnimatePresence>
             {showCode && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="lg:col-span-4 h-full sticky top-12 overflow-hidden"
                >
                   <div className="glass-effect rounded-2xl border-primary/20 p-6 flex flex-col gap-4 h-[600px] shadow-2xl shadow-primary/10">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                         <div className="flex items-center gap-3">
                            <Code className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Config JSON</h3>
                         </div>
                         <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                         </div>
                      </div>
                      <textarea 
                        spellCheck={false}
                        value={jsonConfig}
                        onChange={(e) => setJsonConfig(e.target.value)}
                        className="flex-1 bg-black/40 rounded-xl p-4 font-mono text-[11px] text-blue-300 outline-none border border-white/5 resize-none leading-relaxed"
                      />
                      <p className="text-[10px] text-muted-foreground uppercase text-center opacity-50">Manual edits are applied in real-time.</p>
                   </div>
                </motion.div>
             )}
           </AnimatePresence>

        </div>

      </main>
    </div>
  );
}

function ConfigCard({ title, icon: Icon, children, className }: { title: string, icon: any, children: React.ReactNode, className?: string }) {
  return (
    <div className="glass-effect rounded-2xl border-white/5 p-6 flex flex-col gap-4 shadow-lg bg-[hsl(var(--card-bg))]">
       <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
          <Icon className="w-4 h-4 text-primary" />
          <h3 className="text-xs text-slate-400 font-bold uppercase tracking-widest">{title}</h3>
       </div>
       {children}
    </div>
  );
}

function ThemeOption({ label, active, onClick }: { label: ThemeType, active: boolean, onClick: () => void }) {
  const colors: Record<ThemeType, string> = {
    midnight: "bg-[#6366F1]",
    hacker: "bg-[#2ECC71]",
    solarized: "bg-[#2AA198]",
    amoled: "bg-white"
  };

  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-3 rounded-xl border transition-all",
        active ? "bg-black/40 border-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "bg-white/5 border-white/5 hover:border-white/10"
      )}
    >
       <span className={cn("text-xs font-bold uppercase tracking-widest", active ? "text-primary" : "text-muted-foreground")}>{label}</span>
       <div className={cn("w-3 h-3 rounded-full", colors[label], active && "shadow-[0_0_8px_currentColor]")} />
    </button>
  );
}

function SettingToggle({ label, active, onToggle }: { label: string, active?: boolean, onToggle?: () => void }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer" onClick={onToggle}>
       <span className={cn("text-xs font-bold transition-colors uppercase tracking-tight", active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>{label}</span>
       <div className={cn(
         "w-8 h-4 rounded-full relative transition-all duration-300",
         active ? "bg-primary shadow-[0_0_12px_rgba(99,102,241,0.6)]" : "bg-white/10"
       )}>
          <motion.div 
            animate={{ left: active ? 18 : 2 }}
            className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"
          />
       </div>
    </div>
  );
}

function StatCard({ label, val, data, color, max }: { label: string, val: string, data: number, color: string, max: number }) {
  return (
    <div className="bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col gap-3 group hover:border-white/10 transition-all">
       <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
          <span className="text-sm font-black font-mono text-white/90">{val}</span>
       </div>
       <div className="h-12 w-full">
          <Sparkline data={data} color={color} max={max} />
       </div>
    </div>
  );
}

function Sparkline({ data, color, max }: { data: number, color: string, max: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<number[]>([]);

  useEffect(() => {
    // Keep last 30 points
    dataRef.current = [...dataRef.current, data].slice(-30);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw Line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const step = width / 29;
    dataRef.current.forEach((val, i) => {
      const x = i * step;
      const y = height - (Math.min(val, max) / max * (height - 4)) - 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Gradient Area
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, `${color}44`);
    grad.addColorStop(1, `${color}00`);
    ctx.fillStyle = grad;
    ctx.fill();

  }, [data, color, max]);

  return <canvas ref={canvasRef} width={200} height={50} className="w-full h-full" />;
}
