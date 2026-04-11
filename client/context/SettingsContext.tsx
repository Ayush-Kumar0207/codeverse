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

export interface Snapshot {
  id: string;
  timestamp: number;
  config: SettingsConfig;
  hash: string;
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

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth() || { user: null, token: null };
  const [settings, setSettingsState] = useState<SettingsConfig>(DEFAULT_SETTINGS);
  const [jsonConfig, setJsonState] = useState<string>(JSON.stringify(DEFAULT_SETTINGS, null, 2));
  const [apm, setApm] = useState(0);
  const [diagnostics, setDiagnostics] = useState<SettingsContextType['diagnostics']>({
    latency: 0,
    memory: 0,
    load: 12,
    logs: [{ id: 'init', msg: 'Neural heart initialized.', type: 'sys', timestamp: Date.now() }],
    stressMode: false
  });
  const [syncStatus, setSyncStatus] = useState<SettingsContextType['syncStatus']>('idle');
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [lastPushedHash, setLastPushedHash] = useState<string | null>(null);

  const currentHash = useMemo(() => btoa(JSON.stringify(settings)), [settings]);
  const isSynced = useMemo(() => {
    if (!lastPushedHash) return false;
    return currentHash === lastPushedHash;
  }, [currentHash, lastPushedHash]);

  const keystrokesRef = useRef<number[]>([]);
  const lastApmRef = useRef(0);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("codeverse-settings");
    const savedHash = localStorage.getItem("codeverse-last-pushed-hash");
    
    if (savedHash) setLastPushedHash(savedHash);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettingsState(parsed);
        setJsonState(JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.error("Failed to parse saved settings", e);
      }
    }
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
      logs: [{ id: Math.random().toString(36), msg, type, timestamp: Date.now() }, ...prev.logs].slice(0, 15)
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
    const id = Math.random().toString(36).substring(7);
    const hash = Math.random().toString(16).substring(2, 8).toUpperCase();
    const newSnapshot: Snapshot = {
      id,
      timestamp: Date.now(),
      config: JSON.parse(JSON.stringify(settings)),
      hash: `CFG-${hash}`
    };
    
    setSnapshots(prev => {
      // Avoid duplicate pulses
      if (prev.length > 0 && JSON.stringify(prev[0].config) === JSON.stringify(newSnapshot.config)) {
        return prev;
      }
      return [newSnapshot, ...prev].slice(0, 20);
    });
    
    logEvent(`Snapshot created: ${newSnapshot.hash}`, 'sys');
  }, [settings, logEvent]);

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
          const cloudSnapshots = data.history.map((s: any) => ({
            id: s.id,
            timestamp: new Date(s.created_at).getTime(),
            config: s.config,
            hash: `CFG-${s.id.substring(0, 6).toUpperCase()}`
          }));
          setSnapshots(cloudSnapshots);
        }
      }
    } catch (err: any) {
      setSyncStatus('error');
      const errorMsg = err.response?.data?.message || err.message || "Cloud Hub push failed.";
      logEvent(`Network Error: ${errorMsg}`, "critical");
    } finally {
      if (manual) setTimeout(() => setSyncStatus('idle'), 2000);
      else setSyncStatus('idle');
    }
  }, [token, settings, currentHash, logEvent]);

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
          const cloudSnapshots = historyData.history.map((s: any) => ({
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
          const localIsFresh = JSON.stringify(settings) === JSON.stringify(DEFAULT_SETTINGS);

          if (localIsFresh) {
            // Case A: Auto-apply
            setSettingsState(cloudConfig);
            setJsonState(JSON.stringify(cloudConfig, null, 2));
            setLastPushedHash(cloudHash);
            localStorage.setItem("codeverse-last-pushed-hash", cloudHash);
            logEvent("Retro-Sync: Cloud config applied (Case A).", "sys");
          } else if (cloudHash !== currentHash) {
            // Case B: Conflict
            logEvent("Retro-Sync: Conflict detected. Local state modified (Case B).", "critical");
          } else {
            // Perfectly in sync
            setLastPushedHash(cloudHash);
            localStorage.setItem("codeverse-last-pushed-hash", cloudHash);
            logEvent("Retro-Sync: Cloud hub identity verified.", "sync");
          }
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || "Cloud identity verification failed.";
        logEvent(`Retro-Sync Error: ${errorMsg}`, "critical");
        console.error("Retro-Sync failed", err);
      }
    };

    initSync();
  }, [token]); // Trigger on login

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
    } catch (e) {
      logEvent("Diagnostic Error: Invalid JSON structure detected.", "critical");
    }
  }, [logEvent]);

  const toggleStressMode = useCallback(() => {
    setDiagnostics(prev => ({ ...prev, stressMode: !prev.stressMode }));
    logEvent("System Alert: Artificial Heap Stress Triggered.", "critical");
  }, [logEvent]);

  const flushMemory = useCallback(() => {
    setDiagnostics(prev => ({ ...prev, stressMode: false }));
    logEvent("Garbage Collection: V8 Heap Purge complete.", "sys");
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
  }, []);

  // Global Side Effects (CSS Variables)
  useEffect(() => {
    const root = document.documentElement;
    
    // Theme
    document.documentElement.setAttribute("data-theme", settings.appearance.theme);

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
      // Simulated metrics with real-time jitter
      const memoryBase = (window.performance as any)?.memory?.usedJSHeapSize 
        ? Math.round((window.performance as any).memory.usedJSHeapSize / 1024 / 1024)
        : 120;
      
      const jitter = Math.random() * 5;
      const stressAdd = diagnostics.stressMode ? 800 + Math.random() * 200 : 0;
      
      setDiagnostics(prev => ({
        ...prev,
        latency: Math.round(12 + Math.random() * 8), // Real implementation would be a fetch to /api/health
        memory: memoryBase + stressAdd + jitter,
        load: Math.min(100, (apm / 4) + (diagnostics.stressMode ? 40 : 5) + (Math.random() * 5))
      }));
    }, 2000);

    return () => clearInterval(heartbeat);
  }, [apm, diagnostics.stressMode]);

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
