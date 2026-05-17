"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Check,
  Clock,
  Cloud,
  Code,
  Cpu,
  Database,
  Gauge,
  Keyboard,
  Monitor,
  Palette,
  RotateCcw,
  Settings2,
  Shield,
  Sliders,
  Terminal,
  Volume2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { NetworkTopology } from "@/components/NetworkTopology";
import { cn } from "@/lib/utils";
import { AudioProfile, Snapshot, ThemeType, useSettings } from "@/context/SettingsContext";

const settingsTabs = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "editor", label: "Editor", icon: Settings2 },
  { id: "diagnostics", label: "Diagnostics", icon: Activity },
  { id: "cloud", label: "Cloud Sync", icon: Cloud },
  { id: "security", label: "Security", icon: Shield },
] as const;

type SettingsTab = (typeof settingsTabs)[number]["id"];

const tabMeta: Record<SettingsTab, { title: string; kicker: string }> = {
  appearance: {
    title: "Appearance",
    kicker: "Theme, motion, and interface density",
  },
  editor: {
    title: "Editor",
    kicker: "Completion, formatting, and feedback preferences",
  },
  diagnostics: {
    title: "Diagnostics",
    kicker: "Local runtime health and telemetry",
  },
  cloud: {
    title: "Cloud Sync",
    kicker: "Snapshot history and configuration sync",
  },
  security: {
    title: "Security",
    kicker: "Session, storage, and access posture",
  },
};

const themeDetails: Record<ThemeType, { label: string; tone: string; swatch: string; note: string }> = {
  midnight: {
    label: "Midnight",
    tone: "Balanced",
    swatch: "bg-indigo-500",
    note: "Default dark IDE palette",
  },
  hacker: {
    label: "Hacker",
    tone: "High signal",
    swatch: "bg-emerald-400",
    note: "Terminal-forward contrast",
  },
  solarized: {
    label: "Solarized",
    tone: "Cool",
    swatch: "bg-cyan-400",
    note: "Soft cyan-blue workspace",
  },
  amoled: {
    label: "AMOLED",
    tone: "Pure dark",
    swatch: "bg-white",
    note: "Minimal glow, maximum black",
  },
};

const audioProfiles: { id: AudioProfile; label: string; icon: LucideIcon }[] = [
  { id: "none", label: "Silent", icon: Volume2 },
  { id: "mechanical", label: "Mechanical", icon: Keyboard },
  { id: "synth", label: "Synth", icon: Zap },
];

export default function SettingsHub() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");
  const [showCode, setShowCode] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null);
  const [isDiffExpanded, setIsDiffExpanded] = useState(false);

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
    isSynced,
  } = useSettings();

  const activeMeta = tabMeta[activeTab];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 noise-bg opacity-30" />
        <div className="settings-grid-bg absolute inset-0 opacity-50" />
        <div className="settings-top-glow absolute inset-x-0 top-0 h-64" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-[1520px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusPill label="CODEVERSE-CORE-V2" />
              <StatusPill label="SECURE" tone="success" />
              <StatusPill label={`${apm} APM`} tone="primary" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Workspace Settings</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Tune the shell, editor, motion layer, diagnostics, and sync behavior from one control surface.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SyncBadge status={syncStatus} isSynced={isSynced} />
            <button
              type="button"
              aria-pressed={showCode}
              onClick={() => setShowCode((value) => !value)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-md border px-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                showCode
                  ? "border-primary/60 bg-primary text-primary-foreground"
                  : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-foreground"
              )}
            >
              <Code className="h-4 w-4" />
              {showCode ? "Close JSON" : "UI as Code"}
            </button>
          </div>
        </header>

        <div
          className={cn(
            "grid gap-5 xl:items-start",
            showCode ? "xl:grid-cols-[17rem_minmax(0,1fr)_26rem]" : "xl:grid-cols-[17rem_minmax(0,1fr)]"
          )}
        >
          <aside className="xl:sticky xl:top-5">
            <div className="grid gap-2 rounded-md border border-border bg-card/90 p-2 shadow-xl shadow-black/20 sm:grid-cols-2 xl:grid-cols-1">
              {settingsTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition-colors",
                    activeTab === id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-black/20"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-2 rounded-md border border-border bg-card/70 p-4 text-sm">
              <RailStat label="Theme" value={themeDetails[settings.appearance.theme].label} />
              <RailStat label="Scale" value={`${Math.round(settings.appearance.scale * 100)}%`} />
              <RailStat label="Audio" value={settings.audio.profile === "none" ? "Silent" : settings.audio.profile} />
            </div>
          </aside>

          <section className="min-w-0 rounded-md border border-border bg-card/80 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-1 border-b border-border px-4 py-4 sm:px-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{activeMeta.kicker}</div>
              <h2 className="text-xl font-semibold text-foreground">{activeMeta.title}</h2>
            </div>

            <div className="p-4 sm:p-5">
              <AnimatePresence mode="wait">
                {activeTab === "appearance" && (
                  <TabMotion key="appearance">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.82fr)]">
                      <SettingsPanel title="Theme Engine" icon={Monitor}>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {(["midnight", "hacker", "solarized", "amoled"] as ThemeType[]).map((theme) => (
                            <ThemeOption
                              key={theme}
                              theme={theme}
                              active={settings.appearance.theme === theme}
                              onClick={() => updateSetting("appearance", { theme })}
                            />
                          ))}
                        </div>
                      </SettingsPanel>

                      <SettingsPanel title="Kinetic Effects" icon={Zap}>
                        <div className="grid gap-3">
                          <SettingToggle
                            label="Ambient glow"
                            active={settings.kinetics.glowOrbs}
                            onToggle={() => updateSetting("kinetics", { glowOrbs: !settings.kinetics.glowOrbs })}
                          />
                          <SettingToggle
                            label="Interface animation"
                            active={settings.kinetics.animations}
                            onToggle={() => updateSetting("kinetics", { animations: !settings.kinetics.animations })}
                          />
                          <SettingToggle
                            label="APM neon overdrive"
                            active={settings.kinetics.neonOverdrive}
                            onToggle={() => updateSetting("kinetics", { neonOverdrive: !settings.kinetics.neonOverdrive })}
                          />
                          <SettingToggle
                            label="Reduced motion"
                            active={settings.kinetics.reducedMotionOverride}
                            onToggle={() =>
                              updateSetting("kinetics", {
                                reducedMotionOverride: !settings.kinetics.reducedMotionOverride,
                              })
                            }
                          />
                        </div>
                      </SettingsPanel>

                      <SettingsPanel
                        title={`Interface Scale: ${Math.round(settings.appearance.scale * 100)}%`}
                        icon={Sliders}
                        className="lg:col-span-2"
                      >
                        <div className="px-1 py-3">
                          <input
                            aria-label="Interface scale"
                            type="range"
                            min="0.75"
                            max="1.25"
                            step="0.01"
                            value={settings.appearance.scale}
                            onChange={(event) =>
                              updateSetting("appearance", { scale: Number.parseFloat(event.target.value) })
                            }
                            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                          />
                          <div className="mt-3 grid grid-cols-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            <span>75%</span>
                            <span className="text-center">100%</span>
                            <span className="text-right">125%</span>
                          </div>
                        </div>
                      </SettingsPanel>
                    </div>
                  </TabMotion>
                )}

                {activeTab === "editor" && (
                  <TabMotion key="editor">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <SettingsPanel title="Intellisense" icon={Cpu}>
                        <div className="grid gap-3">
                          <SettingToggle
                            label="AI autocomplete"
                            active={settings.editor.autocomplete}
                            onToggle={() => updateSetting("editor", { autocomplete: !settings.editor.autocomplete })}
                          />
                          <SettingToggle label="Context aware logic" active />
                        </div>
                      </SettingsPanel>

                      <SettingsPanel title="Formatting" icon={Terminal}>
                        <div className="grid gap-5">
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              Tab size
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {([2, 4, 8] as const).map((tabSize) => (
                                <button
                                  key={tabSize}
                                  type="button"
                                  onClick={() => updateSetting("editor", { tabSize })}
                                  className={cn(
                                    "h-10 rounded-md border text-sm font-semibold transition-colors",
                                    settings.editor.tabSize === tabSize
                                      ? "border-primary/70 bg-primary/15 text-primary"
                                      : "border-border bg-muted/25 text-muted-foreground hover:border-primary/35 hover:text-foreground"
                                  )}
                                >
                                  {tabSize}
                                </button>
                              ))}
                            </div>
                          </div>
                          <SettingToggle
                            label="Format on save"
                            active={settings.editor.formatOnSave}
                            onToggle={() => updateSetting("editor", { formatOnSave: !settings.editor.formatOnSave })}
                          />
                        </div>
                      </SettingsPanel>

                      <SettingsPanel title="Acoustic Haptics" icon={Volume2} className="lg:col-span-2">
                        <div className="grid gap-3 sm:grid-cols-3">
                          {audioProfiles.map(({ id, label, icon: Icon }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => updateSetting("audio", { profile: id })}
                              className={cn(
                                "flex h-14 items-center justify-between rounded-md border px-4 text-left transition-colors",
                                settings.audio.profile === id
                                  ? "border-primary/70 bg-primary/15 text-foreground"
                                  : "border-border bg-muted/25 text-muted-foreground hover:border-primary/35 hover:text-foreground"
                              )}
                            >
                              <span className="text-sm font-semibold">{label}</span>
                              <Icon className="h-4 w-4" />
                            </button>
                          ))}
                        </div>
                      </SettingsPanel>
                    </div>
                  </TabMotion>
                )}

                {activeTab === "diagnostics" && (
                  <TabMotion key="diagnostics">
                    <div className="grid gap-4">
                      <div className="flex flex-col gap-4 rounded-md border border-border bg-muted/20 p-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                            <Database className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">System Health</div>
                            <div className="text-xs text-muted-foreground">
                              {diagnostics.stressMode ? "Stress mode active" : "Live telemetry active"}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleStressMode}
                            className={cn(
                              "h-9 rounded-md border-border bg-muted/25 text-xs font-semibold text-muted-foreground hover:text-foreground",
                              diagnostics.stressMode && "border-destructive/50 bg-destructive/15 text-destructive"
                            )}
                          >
                            Trigger Stress
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={flushMemory}
                            className="h-9 rounded-md border-border bg-muted/25 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          >
                            Flush Memory
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <StatCard label="Node Latency" value={`${diagnostics.latency}ms`} data={diagnostics.latency} color="#60A5FA" max={100} />
                        <StatCard
                          label="Memory Usage"
                          value={`${(diagnostics.memory / 1024).toFixed(2)}GB`}
                          data={diagnostics.memory}
                          color="#34D399"
                          max={2048}
                        />
                        <StatCard
                          label="Thread Load"
                          value={`${Math.round(diagnostics.load)}%`}
                          data={diagnostics.load}
                          color="#F59E0B"
                          max={100}
                        />
                      </div>

                      <SettingsPanel title="Telemetry Log" icon={Gauge}>
                        <div className="max-h-64 overflow-y-auto rounded-md border border-border bg-background/70 p-3 font-mono text-xs">
                          {diagnostics.logs.map((log) => (
                            <div key={log.id} className="grid grid-cols-[4.5rem_4.5rem_1fr] gap-3 border-b border-white/5 py-2 last:border-b-0">
                              <span className="text-muted-foreground/70">
                                {new Date(log.timestamp).toLocaleTimeString([], {
                                  hour12: false,
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })}
                              </span>
                              <span
                                className={cn(
                                  "font-semibold uppercase",
                                  log.type === "sys" && "text-blue-300",
                                  log.type === "sync" && "text-cyan-300",
                                  log.type === "neural" && "text-primary",
                                  log.type === "critical" && "text-destructive"
                                )}
                              >
                                {log.type}
                              </span>
                              <span className="min-w-0 text-foreground/85">{log.msg}</span>
                            </div>
                          ))}
                        </div>
                      </SettingsPanel>
                    </div>
                  </TabMotion>
                )}

                {activeTab === "cloud" && (
                  <TabMotion key="cloud">
                    <div className="grid gap-4">
                      <div className="flex flex-col gap-4 rounded-md border border-border bg-muted/20 p-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
                            <Cloud className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">Network Topology</div>
                            <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                              {syncStatus === "syncing" ? "Synchronizing" : isSynced ? "Synced" : "Local changes"}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => performSync(true)}
                          disabled={syncStatus === "syncing"}
                          className="h-10 rounded-md bg-primary px-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {syncStatus === "syncing" ? "Syncing" : "Sync Now"}
                        </Button>
                      </div>

                      <NetworkTopology status={syncStatus} isSynced={isSynced} />

                      <SettingsPanel title="Config History" icon={Clock}>
                        <div className="grid max-h-[28rem] gap-3 overflow-y-auto pr-1">
                          {snapshots.length === 0 ? (
                            <EmptyState icon={AlertCircle} title="No snapshots yet" />
                          ) : (
                            snapshots.map((snapshot) => (
                              <SnapshotRow
                                key={snapshot.id}
                                snapshot={snapshot}
                                selected={selectedSnapshot?.id === snapshot.id}
                                expanded={selectedSnapshot?.id === snapshot.id && isDiffExpanded}
                                onSelect={() => {
                                  setSelectedSnapshot(snapshot);
                                  setIsDiffExpanded(selectedSnapshot?.id !== snapshot.id || !isDiffExpanded);
                                }}
                                onRollback={() => rollback(snapshot.config, snapshot.hash)}
                              />
                            ))
                          )}
                        </div>
                      </SettingsPanel>
                    </div>
                  </TabMotion>
                )}

                {activeTab === "security" && (
                  <TabMotion key="security">
                    <div className="grid gap-4 lg:grid-cols-3">
                      <SecurityStatus title="Authenticated Shell" value="Guarded" tone="success" />
                      <SecurityStatus title="Local Config" value="Persisted" tone="primary" />
                      <SecurityStatus title="Cloud Sync" value={isSynced ? "Aligned" : "Local"} tone={isSynced ? "success" : "warning"} />
                      <SettingsPanel title="Security Posture" icon={Shield} className="lg:col-span-3">
                        <div className="grid gap-3 md:grid-cols-3">
                          <PostureItem label="Route guard" value="Active" />
                          <PostureItem label="Token storage" value="Browser local" />
                          <PostureItem label="Rollback safety" value={`${snapshots.length} snapshots`} />
                        </div>
                      </SettingsPanel>
                    </div>
                  </TabMotion>
                )}
              </AnimatePresence>
            </div>
          </section>

          <AnimatePresence>
            {showCode && (
              <motion.aside
                key="json-pane"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="min-w-0 xl:sticky xl:top-5"
              >
                <JsonPane value={jsonConfig} onChange={setJsonConfig} />
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function TabMotion({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.div>
  );
}

function StatusPill({ label, tone = "default" }: { label: string; tone?: "default" | "success" | "primary" }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-md border px-3 text-[10px] font-semibold uppercase tracking-[0.18em]",
        tone === "default" && "border-border bg-muted/30 text-muted-foreground",
        tone === "success" && "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        tone === "primary" && "border-primary/30 bg-primary/10 text-primary"
      )}
    >
      {label}
    </span>
  );
}

function SyncBadge({ status, isSynced }: { status: "idle" | "syncing" | "synced" | "error"; isSynced: boolean }) {
  const label = status === "syncing" ? "Syncing" : status === "error" ? "Sync Error" : isSynced ? "Synced" : "Local";
  return (
    <div className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-muted/30 px-3 text-sm text-foreground">
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "error" && "bg-destructive",
          status === "syncing" && "bg-amber-300",
          status !== "error" && status !== "syncing" && isSynced && "bg-emerald-300",
          status !== "error" && status !== "syncing" && !isSynced && "bg-primary"
        )}
      />
      {label}
    </div>
  );
}

function RailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 py-2 last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="truncate text-xs font-semibold capitalize text-foreground">{value}</span>
    </div>
  );
}

function SettingsPanel({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-md border border-border bg-card/85 p-4 shadow-lg shadow-black/10", className)}>
      <div className="mb-4 flex items-center gap-3 border-b border-border pb-3">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function ThemeOption({
  theme,
  active,
  onClick,
}: {
  theme: ThemeType;
  active: boolean;
  onClick: () => void;
}) {
  const meta = themeDetails[theme];

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex min-h-24 flex-col justify-between rounded-md border p-4 text-left transition-colors",
        active
          ? "border-primary/70 bg-primary/15 text-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.16)]"
          : "border-border bg-muted/25 text-foreground hover:border-primary/35 hover:bg-muted/40"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">{meta.label}</span>
        <span className={cn("h-3 w-3 rounded-full", meta.swatch)} />
      </div>
      <div>
        <div className="text-xs font-medium text-muted-foreground">{meta.note}</div>
        <div className="mt-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <span>{meta.tone}</span>
          {active && <Check className="h-3.5 w-3.5 text-primary" />}
        </div>
      </div>
    </button>
  );
}

function SettingToggle({ label, active = false, onToggle }: { label: string; active?: boolean; onToggle?: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      disabled={!onToggle}
      onClick={onToggle}
      className={cn(
        "flex min-h-12 items-center justify-between gap-4 rounded-md border border-border bg-muted/25 px-4 text-left transition-colors hover:border-primary/35 hover:bg-muted/40 disabled:opacity-70",
        active && "border-primary/35 bg-primary/10"
      )}
    >
      <span className={cn("text-sm font-semibold", active ? "text-foreground" : "text-muted-foreground")}>{label}</span>
      <span className="flex shrink-0 items-center gap-2">
        <span className={cn("w-7 text-right text-[10px] font-semibold uppercase tracking-[0.14em]", active ? "text-primary" : "text-muted-foreground")}>
          {active ? "On" : "Off"}
        </span>
        <span
          className={cn(
            "relative h-6 w-11 rounded-full border p-0.5 transition-colors",
            active ? "border-primary/45 bg-primary shadow-[0_0_14px_hsl(var(--primary)/0.28)]" : "border-border bg-secondary"
          )}
        >
          <motion.span
            animate={{ x: active ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="block h-5 w-5 rounded-full bg-white shadow-sm ring-1 ring-black/10"
          />
        </span>
      </span>
    </button>
  );
}

function StatCard({
  label,
  value,
  data,
  color,
  max,
}: {
  label: string;
  value: string;
  data: number;
  color: string;
  max: number;
}) {
  return (
    <div className="rounded-md border border-border bg-card/85 p-4">
      <div className="mb-3 flex items-end justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
        <span className="font-mono text-sm font-semibold text-foreground">{value}</span>
      </div>
      <div className="h-14">
        <Sparkline data={data} color={color} max={max} />
      </div>
    </div>
  );
}

function Sparkline({ data, color, max }: { data: number; color: string; max: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<number[]>([]);

  useEffect(() => {
    dataRef.current = [...dataRef.current, data].slice(-30);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const step = width / 29;
    dataRef.current.forEach((value, index) => {
      const x = index * step;
      const y = height - (Math.min(value, max) / max) * (height - 4) - 2;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${color}44`);
    gradient.addColorStop(1, `${color}00`);
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [data, color, max]);

  return <canvas ref={canvasRef} width={240} height={64} className="h-full w-full" />;
}

function EmptyState({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border text-muted-foreground">
      <Icon className="h-6 w-6" />
      <span className="text-sm font-semibold">{title}</span>
    </div>
  );
}

function SnapshotRow({
  snapshot,
  selected,
  expanded,
  onSelect,
  onRollback,
}: {
  snapshot: Snapshot;
  selected: boolean;
  expanded: boolean;
  onSelect: () => void;
  onRollback: () => void;
}) {
  return (
    <div className="rounded-md border border-border bg-muted/25">
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full items-center justify-between gap-4 rounded-md px-4 py-3 text-left transition-colors",
          selected && "bg-primary/10"
        )}
      >
        <div className="min-w-0">
          <div className="truncate font-mono text-xs font-semibold text-foreground">{snapshot.hash}</div>
          <div className="mt-1 text-xs text-muted-foreground">{new Date(snapshot.timestamp).toLocaleString()}</div>
        </div>
        <Code className={cn("h-4 w-4 shrink-0", selected ? "text-primary" : "text-muted-foreground")} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border p-4">
              <pre className="max-h-56 overflow-auto rounded-md border border-border bg-background/70 p-3 font-mono text-xs leading-5 text-primary">
                {JSON.stringify(snapshot.config, null, 2)}
              </pre>
              <button
                type="button"
                onClick={onRollback}
                className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 text-xs font-semibold uppercase tracking-[0.16em] text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Rollback
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SecurityStatus({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: "success" | "primary" | "warning";
}) {
  return (
    <div className="rounded-md border border-border bg-card/85 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</div>
      <div
        className={cn(
          "mt-3 text-2xl font-semibold",
          tone === "success" && "text-emerald-300",
          tone === "primary" && "text-primary",
          tone === "warning" && "text-amber-300"
        )}
      >
        {value}
      </div>
    </div>
  );
}

function PostureItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/25 p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function JsonPane({ value, onChange }: { value: string; onChange: (json: string) => void }) {
  return (
    <div className="rounded-md border border-primary/25 bg-card/95 shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Config JSON</h3>
        </div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-400/70" />
          <span className="h-2 w-2 rounded-full bg-amber-300/70" />
          <span className="h-2 w-2 rounded-full bg-emerald-300/70" />
        </div>
      </div>
      <textarea
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[34rem] w-full resize-none rounded-b-md bg-background/80 p-4 font-mono text-xs leading-5 text-primary outline-none"
      />
    </div>
  );
}
