"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSettings } from "@/context/SettingsContext";

export function useAudioHaptics() {
  const { settings, apm } = useSettings();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Initialize Audio Context on first interaction
    const initAudio = () => {
      if (audioCtxRef.current) return;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = 1;
      
      const gain = ctx.createGain();
      gain.gain.value = 0.15; // Global volume

      filter.connect(gain);
      gain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      filterRef.current = filter;
      gainNodeRef.current = gain;
    };

    window.addEventListener("keydown", initAudio, { once: true });
    return () => window.removeEventListener("keydown", initAudio);
  }, []);

  // APM Coupling: Shift Low-pass frequency based on typing speed
  useEffect(() => {
    if (!filterRef.current || !audioCtxRef.current) return;
    
    // Higher APM = lower cutoff (muffled/bassier)
    // 0 APM -> 15000Hz (clear)
    // 300 APM -> 400Hz (deep bass)
    const baseFreq = 15000;
    const targetFreq = Math.max(400, baseFreq - (apm * 50));
    
    filterRef.current.frequency.setTargetAtTime(targetFreq, audioCtxRef.current.currentTime, 0.1);
  }, [apm]);

  const playKeySound = useCallback((key: string) => {
    if (!audioCtxRef.current || !filterRef.current || settings.audio.profile === "none") return;
    
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    // Semantic Haptics Frequency Mapping
    let freq = 400; // Standard click
    let type: OscillatorType = "square";
    let decay = 0.05;

    if (key === ";") {
      freq = 60; // Deep thunk
      type = "sine";
      decay = 0.15;
    } else if (["{", "}", "[", "]"].includes(key)) {
      freq = 1200; // Crisp snap
      type = "triangle";
      decay = 0.03;
    } else if (key === "Enter") {
      freq = 150; // Heavy return
      type = "sawtooth";
      decay = 0.1;
    }

    // Apply Profile variations
    if (settings.audio.profile === "synth") {
      type = "sine";
      freq *= 1.5;
    }

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Quick ramp for tactile feel
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.005);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decay);

    osc.connect(env);
    env.connect(filterRef.current);

    osc.start();
    osc.stop(ctx.currentTime + decay + 0.01);
  }, [settings.audio.profile]);

  return { playKeySound };
}
