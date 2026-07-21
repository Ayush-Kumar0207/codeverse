"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Activity, Beaker, Maximize2, Minimize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import AutoVisualizer, { StateData, StateValue } from "./AutoVisualizer";
import PlaybackControls from "./PlaybackControls";
import FeedbackLoop from "./FeedbackLoop";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EMPTY_TRACE: StateData = {
  status: "Ready",
  message: "Run a simulation to generate guided trace states.",
};

const NON_EXECUTABLE_TRACE: StateData = {
  status: "Ready",
  message: "Select a JavaScript trace file or open script.js to run a simulation.",
};

function looksLikeNonExecutableSource(source: string) {
  const trimmed = source.trimStart();
  return (
    !trimmed ||
    trimmed.startsWith("<") ||
    trimmed.startsWith("#") ||
    /^```/.test(trimmed) ||
    /^(\s*)?(body|html|:root|\.|#)[\s.{:#[]/.test(trimmed)
  );
}

export default function AlgoTraceCanvas({
  editorCode = "",
  autoRun = false,
  presentationMode = false,
  preferSceneFocus = false,
  autoNarrate = false,
}: {
  editorCode?: string;
  autoRun?: boolean;
  presentationMode?: boolean;
  preferSceneFocus?: boolean;
  autoNarrate?: boolean;
}) {
  const [history, setHistory] = useState<StateData[]>([EMPTY_TRACE]);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(presentationMode);
  const [isSceneFocus, setIsSceneFocus] = useState(false);
  const [narrationEnabled, setNarrationEnabled] = useState(autoNarrate);
  const lastAutoRunCodeRef = useRef("");

  const safeHistory = useMemo(() => (history.length > 0 ? history : [EMPTY_TRACE]), [history]);
  const activeIndex = Math.min(activeStep, safeHistory.length - 1);
  const activeState = safeHistory[activeIndex] || EMPTY_TRACE;
  const previousState = activeIndex > 0 ? safeHistory[activeIndex - 1] : null;
  const isCinematic3D = activeState?.visualizer === "two-sum-cinematic-3d" || activeState?.visualizer === "codeverse-cinematic-3d";

  useEffect(() => {
    if (activeStep > safeHistory.length - 1) {
      setActiveStep(safeHistory.length - 1);
    }
  }, [activeStep, safeHistory.length]);

  useEffect(() => {
    const handleInject = (event: Event) => {
      const { trace } = (event as CustomEvent<{ trace?: unknown[] }>).detail || {};
      if (!Array.isArray(trace)) return;

      setHistory(normalizeTrace(trace));
      setActiveStep(0);
      setIsPlaying(false);
      setShowFeedback(false);
      setIsSceneFocus(false);
    };

    window.addEventListener("algotrace:inject", handleInject);
    return () => window.removeEventListener("algotrace:inject", handleInject);
  }, []);

  const runLocalCode = useCallback(() => {
    setIsSceneFocus(false);

    if (looksLikeNonExecutableSource(editorCode)) {
      setHistory([NON_EXECUTABLE_TRACE]);
      setActiveStep(0);
      setIsPlaying(false);
      setShowFeedback(false);
      return;
    }

    const capturedTrace: StateData[] = [];

    const recordTrace = (state: unknown) => {
      capturedTrace.push(toTraceState(state));
    };

    try {
      const runner = new Function("recordTrace", editorCode);
      runner(recordTrace);

      setHistory(
        capturedTrace.length > 0
          ? capturedTrace
          : [
              {
                status: "Completed",
                message: "The file ran without captured trace states.",
              },
            ]
      );
      setActiveStep(0);
      setIsPlaying(presentationMode && capturedTrace.length > 1);
      setShowFeedback(false);
    } catch (error: unknown) {
      setHistory([
        {
          error: error instanceof Error ? error.name : "SandboxError",
          message: error instanceof Error ? error.message : "Unknown sandbox error",
        },
      ]);
      setActiveStep(0);
      setIsPlaying(false);
      setShowFeedback(false);
    }
  }, [editorCode, presentationMode]);

  useEffect(() => {
    if (!autoRun || !editorCode.trim() || lastAutoRunCodeRef.current === editorCode) return;

    const timer = window.setTimeout(() => {
      lastAutoRunCodeRef.current = editorCode;
      runLocalCode();
    }, 220);
    return () => window.clearTimeout(timer);
  }, [autoRun, editorCode, runLocalCode]);

  useEffect(() => {
    if (!isCinematic3D) {
      setIsSceneFocus(false);
      return;
    }
    if (presentationMode && preferSceneFocus) setIsSceneFocus(true);
  }, [isCinematic3D, preferSceneFocus, presentationMode]);

  const narrationText = useMemo(
    () => buildNarration(activeState, activeIndex, safeHistory.length),
    [activeIndex, activeState, safeHistory.length]
  );

  useEffect(() => {
    if (!narrationEnabled || !presentationMode || !("speechSynthesis" in window)) return;
    if (activeState === EMPTY_TRACE || activeState === NON_EXECUTABLE_TRACE) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(narrationText);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) =>
      /natural|google|aria|jenny|samantha/i.test(voice.name) && /^en/i.test(voice.lang)
    ) || voices.find((voice) => /^en/i.test(voice.lang)) || null;
    utterance.rate = 0.94;
    utterance.pitch = 1.02;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);

    return () => window.speechSynthesis.cancel();
  }, [activeState, narrationEnabled, narrationText, presentationMode]);

  useEffect(() => {
    if (!isSceneFocus) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSceneFocus(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSceneFocus]);

  const toggleFocusPlayback = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (safeHistory.length <= 1) return;
    if (activeIndex >= safeHistory.length - 1) setActiveStep(0);
    setShowFeedback(false);
    setIsPlaying(true);
  }, [activeIndex, isPlaying, safeHistory.length]);

  useEffect(() => {
    if (!isPlaying) return;

    if (activeIndex >= safeHistory.length - 1) {
      setIsPlaying(false);
      setShowFeedback(true);
      return;
    }

    const wordCount = narrationText.split(/\s+/).filter(Boolean).length;
    const delay = narrationEnabled
      ? Math.min(16000, Math.max(6500, wordCount * 285 + 1100))
      : presentationMode
        ? 14500
        : 1200;
    const timer = window.setTimeout(() => {
      setActiveStep((current) => Math.min(current + 1, safeHistory.length - 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isPlaying, narrationEnabled, narrationText, presentationMode, safeHistory.length]);

  const canvas = (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-[#070b12] text-slate-100",
        isFullscreen ? "fixed inset-0 z-[100] border-0 shadow-2xl" : "relative h-full w-full"
      )}
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-[#0a0f19] px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
            <Activity className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-100">AlgoTrace</div>
            <div className="truncate text-xs text-slate-500">Step {activeIndex + 1} of {safeHistory.length}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 hover:bg-slate-800",
              narrationEnabled ? "text-emerald-300" : "text-slate-500 hover:text-slate-100"
            )}
            onClick={() => setNarrationEnabled((current) => !current)}
            title={narrationEnabled ? "Turn narration off" : "Turn narration on"}
            aria-label={narrationEnabled ? "Turn narration off" : "Turn narration on"}
            aria-pressed={narrationEnabled}
          >
            {narrationEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
            onClick={runLocalCode}
          >
            <Beaker className="mr-2 h-3.5 w-3.5" />
            Run Simulation
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            onClick={() => setIsFullscreen((current) => !current)}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain custom-scrollbar">
        {!isSceneFocus && (
          <AutoVisualizer
            state={activeState}
            previousState={previousState}
            focusMode={isFullscreen}
            onFocusScene={isCinematic3D ? () => setIsSceneFocus(true) : undefined}
          />
        )}
      </div>

      <div
        className={cn(
          "shrink-0 border-t border-slate-800 bg-[#0a0f19] px-4 py-3",
          showFeedback ? "grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center" : "flex items-center justify-center"
        )}
      >
        <FeedbackLoop
          isVisible={showFeedback}
          onClose={() => setShowFeedback(false)}
          codeSnippet={editorCode}
          traceOutput={safeHistory}
          compact
        />
        <div className={cn("flex justify-center", showFeedback && "xl:justify-end")}>
          <PlaybackControls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onNext={() => setActiveStep((current) => Math.min(current + 1, safeHistory.length - 1))}
            onPrev={() => setActiveStep((current) => Math.max(current - 1, 0))}
            onReset={() => {
              setActiveStep(0);
              setIsPlaying(false);
            }}
            activeStep={activeIndex}
            totalSteps={safeHistory.length}
          />
        </div>
      </div>

      {isSceneFocus && isCinematic3D && (
        <div className="fixed inset-0 z-[120] bg-[#030712] text-white">
          <AutoVisualizer state={activeState} previousState={previousState} focusMode />
          <div className="pointer-events-none absolute left-4 top-4 z-30 rounded-lg border border-white/10 bg-slate-950/75 px-3 py-2 text-xs text-slate-300 shadow-xl backdrop-blur-md">
            <span className="font-semibold text-white">Step {activeIndex + 1} of {safeHistory.length}</span>
            <span className="ml-2 text-slate-400">{narrationEnabled ? "Narration on" : "Narration off"}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsSceneFocus(false)}
            className="absolute right-4 top-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-slate-950/70 text-slate-200 shadow-lg shadow-black/30 backdrop-blur transition hover:bg-slate-900 hover:text-white"
            aria-label="Exit 3D focus"
            title="Exit 3D focus"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center px-4">
            <button
              type="button"
              onClick={toggleFocusPlayback}
              disabled={safeHistory.length <= 1}
              className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-md border border-emerald-300/20 bg-emerald-400 text-slate-950 shadow-2xl shadow-black/40 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
              aria-label={isPlaying ? "Pause 3D focus" : "Play 3D focus"}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return isFullscreen && typeof document !== "undefined"
    ? createPortal(canvas, document.body)
    : canvas;
}

function buildNarration(state: StateData, activeIndex: number, totalSteps: number) {
  const algorithm = state.algorithm && typeof state.algorithm === "object" && !Array.isArray(state.algorithm)
    ? state.algorithm as Record<string, StateValue>
    : null;
  const title = typeof algorithm?.title === "string" ? algorithm.title : "this algorithm";
  const text = (key: string) => typeof state[key] === "string" ? state[key] as string : "";
  const introduction = activeIndex === 0
    ? `Welcome to ${title}. ${text("problemLens") || "We will turn the problem into a sequence of small, verifiable decisions."}`
    : "";
  return [
    introduction,
    `Step ${activeIndex + 1} of ${totalSteps}.`,
    text("headline"),
    text("narrative") || text("explanation"),
    text("decision") ? `Decision: ${text("decision")}` : "",
    text("invariant") ? `Keep this invariant: ${text("invariant")}` : "",
  ].filter(Boolean).join(" ").slice(0, 850);
}

function normalizeTrace(trace: unknown[]) {
  const normalized = trace.map(toTraceState);
  return normalized.length > 0 ? normalized : [EMPTY_TRACE];
}

function toTraceState(state: unknown): StateData {
  try {
    const cloned = JSON.parse(JSON.stringify(state)) as unknown;
    if (cloned && typeof cloned === "object" && !Array.isArray(cloned)) {
      return cloned as StateData;
    }
    return { value: stringifyUnknown(cloned) };
  } catch {
    return { error: "Failed to serialize trace state" };
  }
}

function stringifyUnknown(value: unknown) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
