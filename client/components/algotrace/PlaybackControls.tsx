"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward, type LucideIcon } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  activeStep: number;
  totalSteps: number;
}

export default function PlaybackControls({
  isPlaying,
  setIsPlaying,
  onNext,
  onPrev,
  onReset,
  activeStep,
  totalSteps,
}: PlaybackControlsProps) {
  const atStart = activeStep <= 0;
  const atEnd = activeStep >= totalSteps - 1;
  const canPlay = totalSteps > 1;

  return (
    <div className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-950/90 px-3 py-2 shadow-sm">
      <ControlButton label="Reset trace" onClick={onReset} icon={RotateCcw} disabled={atStart} />
      <ControlButton label="Previous step" onClick={onPrev} icon={SkipBack} disabled={atStart} />

      <button
        type="button"
        onClick={() => setIsPlaying(!isPlaying)}
        disabled={!canPlay || atEnd}
        aria-label={isPlaying ? "Pause trace" : "Play trace"}
        title={isPlaying ? "Pause trace" : "Play trace"}
        className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-500 text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
      >
        {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
      </button>

      <ControlButton label="Next step" onClick={onNext} icon={SkipForward} disabled={atEnd} />
      <div className="ml-1 min-w-14 text-right font-mono text-[11px] text-slate-400">
        {activeStep + 1}/{Math.max(totalSteps, 1)}
      </div>
    </div>
  );
}

function ControlButton({
  onClick,
  icon: Icon,
  label,
  disabled = false,
}: {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 disabled:cursor-not-allowed disabled:text-slate-700 disabled:hover:bg-transparent"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
