"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react";
import apiClient from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export type ThemeType = "midnight" | "hacker" | "solarized" | "amoled";
export type ScaleType = number;
export type AudioProfile = "none" | "mechanical" | "synth";

export interface SettingsConfig {
  appearance: {
    theme: ThemeType;
    scale: ScaleType;
  };
  kinetics: {
    glowOrbs: boolean;
    animations: boolean;
    neonOverdrive: boolean;
    reducedMotionOverride: boolean;
  };
  editor: {
    autocomplete: boolean;
    formatOnSave: boolean;
    tabSize: 2 | 4 | 8;
  };
  audio: {
    profile: AudioProfile;
  };
}

const DEFAULT_SETTINGS: SettingsConfig = {
  appearance: {
    theme: "midnight",
    scale: 1,
  },
  kinetics: {
    glowOrbs: true,
    animations: true,
    neonOverdrive: false,
    reducedMotionOverride: false,
  },
  editor: {
    autocomplete: true,
    formatOnSave: true,
    tabSize: 2,
  },
  audio: {
    profile: "none",
  },
};

const THEME_OPTIONS: ThemeType[] = ["midnight", "hacker", "solarized", "amoled"];
const AUDIO_OPTIONS: AudioProfile[] = ["none", "mechanical", "synth"];

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null ? value as Record<string, unknown> : {};

const normalizeSettingsConfig = (value: unknown): SettingsConfig => {
  const candidate = asRecord(value);
  const appearance = asRecord(candidate.appearance);
  const kinetics = asRecord(candidate.kinetics);
  const editor = asRecord(candidate.editor);
  const audio = asRecord(candidate.audio);

  const theme = typeof appearance.theme === "string" && THEME_OPTIONS.includes(appearance.theme as ThemeType)
    ? appearance.theme as ThemeType
    : DEFAULT_SETTINGS.appearance.theme;
  const scale = typeof appearance.scale === "number" && Number.isFinite(appearance.scale)
    ? Math.min(1.25, Math.max(0.75, appearance.scale))
    : DEFAULT_SETTINGS.appearance.scale;
  const tabSize = [2, 4, 8].includes(editor.tabSize as number)
    ? editor.tabSize as 2 | 4 | 8
    : DEFAULT_SETTINGS.editor.tabSize;
  const audioProfile = AUDIO_OPTIONS.includes(audio.profile as AudioProfile)
    ? audio.profile as AudioProfile
    : DEFAULT_SETTINGS.audio.profile;

  return {
    appearance: {
      theme,
      scale,
    },
    kinetics: {
      glowOrbs: typeof kinetics.glowOrbs === "boolean" ? kinetics.glowOrbs : DEFAULT_SETTINGS.kinetics.glowOrbs,
      animations: typeof kinetics.animations === "boolean" ? kinetics.animations : DEFAULT_SETTINGS.kinetics.animations,
      neonOverdrive: typeof kinetics.neonOverdrive === "boolean" ? kinetics.neonOverdrive : DEFAULT_SETTINGS.kinetics.neonOverdrive,
      reducedMotionOverride:
        typeof kinetics.reducedMotionOverride === "boolean"
          ? kinetics.reducedMotionOverride
          : DEFAULT_SETTINGS.kinetics.reducedMotionOverride,
    },
    editor: {
      autocomplete: typeof editor.autocomplete === "boolean" ? editor.autocomplete : DEFAULT_SETTINGS.editor.autocomplete,
      formatOnSave: typeof editor.formatOnSave === "boolean" ? editor.formatOnSave : DEFAULT_SETTINGS.editor.formatOnSave,
      tabSize,
    },
    audio: {
      profile: audioProfile,
    },
  };
};

export interface Snapshot {
  id: string;
  timestamp: number;
  config: SettingsConfig;
  hash: string;
}

interface CloudSettingsSnapshot {
  id: string;
  created_at: string;
  config: SettingsConfig;
}

interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
  };
}

interface SettingsContextType {
  settings: SettingsConfig;
  setSettings: (settings: SettingsConfig) => void;
  updateSetting: <T extends keyof SettingsConfig>(category: T, updates: Partial<SettingsConfig[T]>) => void;
  jsonConfig: string;
  setJsonConfig: (json: string) => void;
  apm: number;
  diagnostics: {
    latency: number;
    memory: number;
    load: number;
    logs: { id: string; msg: string; type: 'sys' | 'sync' | 'neural' | 'critical'; timestamp: number }[];
    stressMode: boolean;
  };
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  snapshots: Snapshot[];
  currentHash: string;
  lastPushedHash: string | null;
  isSynced: boolean;
  performSync: (manual?: boolean) => Promise<void>;
  rollback: (targetConfig: SettingsConfig, hash: string) => void;
  logEvent: (msg: string, type: 'sys' | 'sync' | 'neural' | 'critical') => void;
  toggleStressMode: () => void;
  flushMemory: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const shortHash = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase().padEnd(6, "0");

const getErrorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "object" && err !== null) {
    const maybeResponse = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
    return maybeResponse.response?.data?.error || maybeResponse.response?.data?.message || maybeResponse.message || fallback;
  }

  return fallback;
};

const isUnauthorizedError = (err: unknown) => {
  if (typeof err !== "object" || err === null) return false;

  const maybeResponse = err as { response?: { status?: number; data?: { statusCode?: number } } };
  return maybeResponse.response?.status === 401 || maybeResponse.response?.data?.statusCode === 401;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, logout } = useAuth();
  const [settings, setSettingsState] = useState<SettingsConfig>(DEFAULT_SETTINGS);
  const [jsonConfig, setJsonState] = useState<string>(JSON.stringify(DEFAULT_SETTINGS, null, 2));
  const [apm, setApm] = useState(0);
  const [diagnostics, setDiagnostics] = useState<SettingsContextType['diagnostics']>({
    latency: 0,
    memory: 0,
    load: 12,
    logs: [{ id: 'init', msg: 'Neural heart initialized.', type: 'sys', timestamp: 0 }],
    stressMode: false
  });
  const [syncStatus, setSyncStatus] = useState<SettingsContextType['syncStatus']>('idle');
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [lastPushedHash, setLastPushedHash] = useState<string | null>(null);

  const currentHash = useMemo(() => btoa(JSON.stringify(settings)), [settings]);
  const settingsRef = useRef(settings);
  const currentHashRef = useRef(currentHash);
  const isSynced = useMemo(() => {
    if (!lastPushedHash) return false;
    return currentHash === lastPushedHash;
  }, [currentHash, lastPushedHash]);

  const keystrokesRef = useRef<number[]>([]);
  const lastApmRef = useRef(0);

  useEffect(() => {
    settingsRef.current = settings;
    currentHashRef.current = currentHash;
  }, [settings, currentHash]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("codeverse-settings");
    const savedHash = localStorage.getItem("codeverse-last-pushed-hash");
    
    if (savedHash) setLastPushedHash(savedHash);

    if (saved) {
      try {
        const parsed = normalizeSettingsConfig(JSON.parse(saved));
        setSettingsState(parsed);
        setJsonState(JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.error("Failed to parse saved settings", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "codeverse-settings" || !event.newValue) return;

      try {
        const parsed = normalizeSettingsConfig(JSON.parse(event.newValue));
        setSettingsState(parsed);
        setJsonState(JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.error("Failed to sync settings from storage", e);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Update logic with persistence
  const setSettings = useCallback((newSettings: SettingsConfig) => {
    setSettingsState(newSettings);
    setJsonState(JSON.stringify(newSettings, null, 2));
    localStorage.setItem("codeverse-settings", JSON.stringify(newSettings));
  }, []);

  const logEvent = useCallback((msg: string, type: 'sys' | 'sync' | 'neural' | 'critical') => {
    setDiagnostics(prev => ({
      ...prev,
      logs: [{ id: makeId(), msg, type, timestamp: Date.now() }, ...prev.logs].slice(0, 15)
    }));
  }, []);

  const updateSetting = useCallback(<T extends keyof SettingsConfig>(category: T, updates: Partial<SettingsConfig[T]>) => {
    setSettingsState(prev => {
      const next = {
        ...prev,
        [category]: { ...prev[category], ...updates }
      };
      setJsonState(JSON.stringify(next, null, 2));
      localStorage.setItem("codeverse-settings", JSON.stringify(next));
      
      const key = Object.keys(updates)[0];
      logEvent(`Sync: ${category}.${key} update persisted.`, 'sync');
      
      return next;
    });
  }, [logEvent]);

  const saveSnapshot = useCallback(() => {
    const newSnapshot: Snapshot = {
      id: makeId(),
      timestamp: Date.now(),
      config: JSON.parse(JSON.stringify(settings)),
      hash: `CFG-${shortHash(currentHash)}`
    };
    
    setSnapshots(prev => {
      // Avoid duplicate pulses
      if (prev.length > 0 && JSON.stringify(prev[0].config) === JSON.stringify(newSnapshot.config)) {
        return prev;
      }
      return [newSnapshot, ...prev].slice(0, 20);
    });
    
    logEvent(`Snapshot created: ${newSnapshot.hash}`, 'sys');
  }, [settings, currentHash, logEvent]);

  const performSync = useCallback(async (manual = false) => {
    if (!token) return;
    
    setSyncStatus('syncing');
    if (manual) logEvent("Manual Sync initiated: Committing to cloud hub...", "sync");
    
    try {
      const response = await apiClient.post("/api/settings/sync", { config: settings });

      if (response.status === 201) {
        setSyncStatus('synced');
        setLastPushedHash(currentHash);
        localStorage.setItem("codeverse-last-pushed-hash", currentHash);
        logEvent("Sync Protocol: Cloud Hub push verified (201).", "sync");
        
        // Refresh history after sync
        const { data } = await apiClient.get("/api/settings/history");
        if (data.history) {
          const cloudSnapshots = data.history.map((s: CloudSettingsSnapshot) => ({
            id: s.id,
            timestamp: new Date(s.created_at).getTime(),
            config: s.config,
            hash: `CFG-${s.id.substring(0, 6).toUpperCase()}`
          }));
          setSnapshots(cloudSnapshots);
        }
      }
    } catch (err: unknown) {
      if (isUnauthorizedError(err)) {
        setSyncStatus('idle');
        setLastPushedHash(null);
        localStorage.removeItem("codeverse-last-pushed-hash");
        logEvent("Session expired: Cloud sync paused. Please sign in again.", "critical");
        logout();
        return;
      }

      setSyncStatus('error');
      const errorMsg = getErrorMessage(err, "Cloud Hub push failed.");
      logEvent(`Network Error: ${errorMsg}`, "critical");
    } finally {
      if (manual) setTimeout(() => setSyncStatus('idle'), 2000);
      else setSyncStatus('idle');
    }
  }, [token, settings, currentHash, logEvent, logout]);

  const rollback = useCallback((targetConfig: SettingsConfig, hash: string) => {
    setSettingsState(targetConfig);
    setJsonState(JSON.stringify(targetConfig, null, 2));
    localStorage.setItem("codeverse-settings", JSON.stringify(targetConfig));
    logEvent(`Rollback: Reverted to ${hash}`, 'critical');
  }, [logEvent]);

  // Retroactive Sync (On Login)
  useEffect(() => {
    const initSync = async () => {
      if (!token) return;
      
      try {
        const { data: latestData } = await apiClient.get("/api/settings/latest");

        // Load History too
        const { data: historyData } = await apiClient.get("/api/settings/history");

        if (historyData.history) {
          const cloudSnapshots = historyData.history.map((s: CloudSettingsSnapshot) => ({
            id: s.id,
            timestamp: new Date(s.created_at).getTime(),
            config: s.config,
            hash: `CFG-${s.id.substring(0, 6).toUpperCase()}`
          }));
          setSnapshots(cloudSnapshots);
        }

        if (latestData.snapshot) {
          const cloudConfig = latestData.snapshot.config;
          const cloudHash = btoa(JSON.stringify(cloudConfig));
          const localIsFresh = JSON.stringify(settingsRef.current) === JSON.stringify(DEFAULT_SETTINGS);

          if (localIsFresh) {
            // Case A: Auto-apply
            setSettingsState(cloudConfig);
            setJsonState(JSON.stringify(cloudConfig, null, 2));
            setLastPushedHash(cloudHash);
            localStorage.setItem("codeverse-last-pushed-hash", cloudHash);
            logEvent("Retro-Sync: Cloud config applied (Case A).", "sys");
          } else if (cloudHash !== currentHashRef.current) {
            // Case B: Conflict
            logEvent("Retro-Sync: Conflict detected. Local state modified (Case B).", "critical");
          } else {
            // Perfectly in sync
            setLastPushedHash(cloudHash);
            localStorage.setItem("codeverse-last-pushed-hash", cloudHash);
            logEvent("Retro-Sync: Cloud hub identity verified.", "sync");
          }
        }
      } catch (err: unknown) {
        if (isUnauthorizedError(err)) {
          setLastPushedHash(null);
          localStorage.removeItem("codeverse-last-pushed-hash");
          logEvent("Retro-Sync paused: Session expired. Please sign in again.", "critical");
          logout();
          return;
        }

        const errorMsg = getErrorMessage(err, "Cloud identity verification failed.");
        logEvent(`Retro-Sync Error: ${errorMsg}`, "critical");
      }
    };

    initSync();
  }, [token, logEvent, logout]); // Trigger on login

  // Debounced Auto-Snapshot & Auto-Push (Optimistic)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveSnapshot();
      if (token && !isSynced) {
        performSync();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [settings, token, isSynced, saveSnapshot, performSync]);

  const setJsonConfig = useCallback((json: string) => {
    setJsonState(json);
    try {
      const parsed = JSON.parse(json);
      setSettingsState(parsed);
      localStorage.setItem("codeverse-settings", json);
      logEvent("Neural JSON re-serialization success.", "sys");
    } catch {
      logEvent("Diagnostic Error: Invalid JSON structure detected.", "critical");
    }
  }, [logEvent]);

  const toggleStressMode = useCallback(() => {
    setDiagnostics(prev => ({ ...prev, stressMode: !prev.stressMode }));
    logEvent("Diagnostics: Stress overlay toggled for UI responsiveness testing.", "critical");
  }, [logEvent]);

  const flushMemory = useCallback(() => {
    setDiagnostics(prev => ({ ...prev, stressMode: false }));
    logEvent("Diagnostics: Stress overlay cleared. Live browser/server readings restored.", "sys");
  }, [logEvent]);

  // APM Engine Logic
  useEffect(() => {
    const handleKeydown = () => {
      keystrokesRef.current.push(Date.now());
    };
    window.addEventListener("keydown", handleKeydown);

    const interval = setInterval(() => {
      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      keystrokesRef.current = keystrokesRef.current.filter(t => t > oneMinuteAgo);
      const newApm = keystrokesRef.current.length;
      setApm(newApm);

      // Milestone Detection
      const milestones = [60, 100, 150, 200];
      milestones.forEach(m => {
        if (newApm >= m && lastApmRef.current < m) {
          logEvent(`Neuro-State Transition: ${m} APM threshold breached.`, 'neural');
        }
      });
      lastApmRef.current = newApm;
    }, 1000);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      clearInterval(interval);
    };
  }, [logEvent]);

  // Global Side Effects (CSS Variables)
  useEffect(() => {
    const root = document.documentElement;
    
    // Theme
    root.setAttribute("data-theme", settings.appearance.theme);
    document.body?.setAttribute("data-theme", settings.appearance.theme);
    root.classList.add("dark");
    root.style.colorScheme = "dark";

    // Scale
    root.style.setProperty("--ui-scale", `${settings.appearance.scale}rem`);

    // Kinetics
    root.classList.toggle("kinetic-disabled", !settings.kinetics.animations);
    root.classList.toggle("glow-disabled", !settings.kinetics.glowOrbs);
    root.classList.toggle("neon-override", settings.kinetics.neonOverdrive);

    // Flow State APM Mapping
    // Neon power scales from 0 to 1 based on APM (capped at 300)
    const neonPower = Math.min(apm / 300, 1).toFixed(2);
    root.style.setProperty("--neon-power", neonPower);
    
    // Reduced Motion handling
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMotionDisabled = settings.kinetics.reducedMotionOverride || (prefersReduced && !settings.kinetics.animations);
    root.classList.toggle("reduced-motion", isMotionDisabled);

  }, [settings, apm]);

  // Heartbeat Engine
  useEffect(() => {
    const heartbeat = setInterval(async () => {
      const started = performance.now();
      const browserPerformance = window.performance as PerformanceWithMemory;
      const browserMemory = browserPerformance.memory?.usedJSHeapSize
        ? Math.round(browserPerformance.memory.usedJSHeapSize / 1024 / 1024)
        : 0;

      try {
        const { data } = await apiClient.get("/api/health");
        const latency = Math.max(1, Math.round(performance.now() - started));
        const serverMemory = data?.memory?.heapUsedMb || 0;
        const memory = browserMemory ? browserMemory + serverMemory : serverMemory;
        const loadFromServer = Number(data?.load || 0);

        setDiagnostics(prev => ({
          ...prev,
          latency,
          memory: Math.round(memory + (prev.stressMode ? 800 : 0)),
          load: Math.min(100, Math.round((apm / 4) + loadFromServer * 10 + (prev.stressMode ? 40 : 0)))
        }));
      } catch {
        setDiagnostics(prev => ({
          ...prev,
          latency: 0,
          memory: Math.round((browserMemory || prev.memory || 0) + (prev.stressMode ? 800 : 0)),
          load: Math.min(100, Math.round((apm / 4) + (prev.stressMode ? 40 : 0)))
        }));
      }
    }, 2000);

    return () => clearInterval(heartbeat);
  }, [apm]);

  return (
    <SettingsContext.Provider value={{ 
      settings, setSettings, updateSetting, jsonConfig, setJsonConfig, apm, 
      diagnostics, logEvent, toggleStressMode, flushMemory,
      syncStatus, snapshots, performSync, rollback,
      currentHash, lastPushedHash, isSynced
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
