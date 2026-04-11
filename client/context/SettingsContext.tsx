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

interface SettingsContextType {
  settings: SettingsConfig;
  setSettings: (settings: SettingsConfig) => void;
  updateSetting: <T extends keyof SettingsConfig>(category: T, updates: Partial<SettingsConfig[T]>) => void;
  jsonConfig: string;
  setJsonConfig: (json: string) => void;
  apm: number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<SettingsConfig>(DEFAULT_SETTINGS);
  const [jsonConfig, setJsonState] = useState<string>(JSON.stringify(DEFAULT_SETTINGS, null, 2));
  const [apm, setApm] = useState(0);
  const keystrokesRef = useRef<number[]>([]);

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

  const updateSetting = useCallback(<T extends keyof SettingsConfig>(category: T, updates: Partial<SettingsConfig[T]>) => {
    setSettingsState(prev => {
      const next = {
        ...prev,
        [category]: { ...prev[category], ...updates }
      };
      setJsonState(JSON.stringify(next, null, 2));
      localStorage.setItem("codeverse-settings", JSON.stringify(next));
      return next;
    });
  }, []);

  const setJsonConfig = useCallback((json: string) => {
    setJsonState(json);
    try {
      const parsed = JSON.parse(json);
      // Basic validation should go here
      setSettingsState(parsed);
      localStorage.setItem("codeverse-settings", json);
    } catch (e) {
      // Keep JSON state but don't apply until valid
    }
  }, []);

  // APM Engine Logic
  useEffect(() => {
    const handleKeydown = () => {
      keystrokesRef.current.push(Date.now());
    };
    window.addEventListener("keydown", handleKeydown);

    const interval = setInterval(() => {
      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      // Filter out keys older than 1 minute
      keystrokesRef.current = keystrokesRef.current.filter(t => t > oneMinuteAgo);
      setApm(keystrokesRef.current.length);
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

  return (
    <SettingsContext.Provider value={{ settings, setSettings, updateSetting, jsonConfig, setJsonConfig, apm }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
