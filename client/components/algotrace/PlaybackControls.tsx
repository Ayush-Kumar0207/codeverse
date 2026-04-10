"use client";

import { motion } from "framer-motion";
import { SkipBack, Pause, Play, SkipForward, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaybackControlsProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
}

export default function PlaybackControls({
  isPlaying,
  setIsPlaying,
  onNext,
  onPrev,
  onReset,
}: PlaybackControlsProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="z-10"
    >
      {/* Phase 4: Floating Control Deck (glassmorphic pill) */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-indigo-500/10">
        <ControlButton onClick={onReset} icon={RotateCcw} />
        <ControlButton onClick={onPrev} icon={SkipBack} />
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center justify-center w-10 h-10 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full transition-colors shadow-lg shadow-indigo-500/20"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </motion.button>

        <ControlButton onClick={onNext} icon={SkipForward} />
        {/* Added a spacer or logic for the end? No, just the controls */}
      </div>
    </motion.div>
  );
}

function ControlButton({ onClick, icon: Icon }: { onClick: () => void; icon: any }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="p-2 text-slate-400 hover:text-white transition-colors"
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );
}
