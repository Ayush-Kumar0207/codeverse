"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

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
  performSync: () => Promise<void>;
  rollback: (id: string) => void;
  logEvent: (msg: string, type: 'sys' | 'sync' | 'neural' | 'critical') => void;
  toggleStressMode: () => void;
  flushMemory: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const keystrokesRef = useRef<number[]>([]);
  const lastApmRef = useRef(0);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("codeverse-settings");
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

  const performSync = useCallback(async () => {
    setSyncStatus('syncing');
    logEvent("Network Handshake: Initializing topology sync...", "sync");
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setSyncStatus('synced');
    logEvent("Sync Protocol: Cloud Hub handshake complete.", "sync");
    
    setTimeout(() => setSyncStatus('idle'), 2000);
  }, [logEvent]);

  const rollback = useCallback((id: string) => {
    const target = snapshots.find(s => s.id === id);
    if (target) {
      setSettingsState(target.config);
      setJsonState(JSON.stringify(target.config, null, 2));
      localStorage.setItem("codeverse-settings", JSON.stringify(target.config));
      logEvent(`Rollback: Reverted to ${target.hash}`, 'critical');
    }
  }, [snapshots, logEvent]);

  // Debounced Auto-Snapshot
  useEffect(() => {
    const timer = setTimeout(() => {
      saveSnapshot();
    }, 2000);
    return () => clearTimeout(timer);
  }, [settings, saveSnapshot]);

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
      syncStatus, snapshots, performSync, rollback
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
