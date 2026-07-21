"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pause, Play, RotateCcw, Square, Volume2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { narrationVoiceProfile, toSpeakableNarration, type NarrationLine } from "@/lib/narration";

type NarrationState = {
  activeIndex: number | null;
  isPaused: boolean;
  isPlaying: boolean;
  startFrom: (index: number) => void;
};

const NarrationContext = createContext<NarrationState | null>(null);

const preferredVoiceNames = [
  "natural",
  "neural",
  "aria",
  "jenny",
  "samantha",
  "serena",
  "google uk english female",
];

function selectVoice(voices: SpeechSynthesisVoice[]) {
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  return (
    preferredVoiceNames
      .map((name) => englishVoices.find((voice) => voice.name.toLowerCase().includes(name)))
      .find(Boolean) ||
    englishVoices[0] ||
    voices[0]
  );
}

export default function NarratedSlab({
  id,
  title,
  label,
  icon: Icon,
  iconClassName,
  headerActions,
  lines,
  children,
  className,
}: {
  id: string;
  title: string;
  label?: string;
  icon: LucideIcon;
  iconClassName?: string;
  headerActions?: ReactNode;
  lines: NarrationLine[];
  children: ReactNode | ((state: NarrationState) => ReactNode);
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const sessionRef = useRef(0);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
  }, []);

  const stop = useCallback(() => {
    sessionRef.current += 1;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const synthesis = window.speechSynthesis;
      if (synthesis.speaking || synthesis.pending || synthesis.paused) synthesis.cancel();
    }
    setActiveIndex(null);
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const speakFrom = useCallback(
    (startIndex: number) => {
      if (!isSupported || lines.length === 0) return;

      window.dispatchEvent(new CustomEvent("codeverse:narration-start", { detail: { id } }));
      const synthesis = window.speechSynthesis;
      if (synthesis.speaking || synthesis.pending || synthesis.paused) synthesis.cancel();
      const session = sessionRef.current + 1;
      sessionRef.current = session;
      const voice = selectVoice(synthesis.getVoices());

      const speakLine = (index: number) => {
        if (sessionRef.current !== session) return;
        if (index >= lines.length) {
          setActiveIndex(null);
          setIsPlaying(false);
          setIsPaused(false);
          return;
        }

        const line = lines[index];
        const voiceProfile = narrationVoiceProfile(line, index, lines.length);
        const utterance = new SpeechSynthesisUtterance(toSpeakableNarration(line));
        utterance.rate = voiceProfile.rate;
        utterance.pitch = voiceProfile.pitch;
        utterance.volume = voiceProfile.volume;
        if (voice) utterance.voice = voice;
        setActiveIndex(index);
        setIsPlaying(true);
        setIsPaused(false);
        utterance.onstart = () => {
          if (sessionRef.current !== session) return;
          setActiveIndex(index);
        };
        utterance.onend = () => {
          if (sessionRef.current !== session) return;
          window.setTimeout(() => speakLine(index + 1), voiceProfile.pauseAfterMs);
        };
        utterance.onerror = () => {
          if (sessionRef.current !== session) return;
          setActiveIndex(null);
          setIsPlaying(false);
          setIsPaused(false);
        };
        synthesis.speak(utterance);
      };

      window.setTimeout(() => speakLine(Math.min(Math.max(startIndex, 0), lines.length - 1)), 24);
    },
    [id, isSupported, lines]
  );

  const togglePause = useCallback(() => {
    if (!isPlaying) {
      speakFrom(activeIndex ?? 0);
      return;
    }
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [activeIndex, isPaused, isPlaying, speakFrom]);

  useEffect(() => {
    const handleOtherNarrator = (event: Event) => {
      const sourceId = (event as CustomEvent<{ id?: string }>).detail?.id;
      if (sourceId && sourceId !== id && (isPlaying || isPaused)) stop();
    };
    window.addEventListener("codeverse:narration-start", handleOtherNarrator);
    return () => window.removeEventListener("codeverse:narration-start", handleOtherNarrator);
  }, [id, isPaused, isPlaying, stop]);

  useEffect(() => stop, [id, stop]);

  const state = useMemo(
    () => ({ activeIndex, isPaused, isPlaying, startFrom: speakFrom }),
    [activeIndex, isPaused, isPlaying, speakFrom]
  );

  return (
    <NarrationContext.Provider value={state}>
      <article className={cn("narrated-slab", className)}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className={cn("narrated-slab-icon", iconClassName)}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white">{title}</h3>
              {label && <p className="mt-1 truncate text-xs font-medium text-slate-500">{label}</p>}
            </div>
          </div>
          {(headerActions || activeIndex !== null) && (
            <div className="flex max-w-full shrink-0 items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {headerActions}
              {activeIndex !== null && (
                <span className="shrink-0 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-slate-400">
                  {activeIndex + 1} / {lines.length}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-5">{typeof children === "function" ? children(state) : children}</div>

        <div className="narrated-slab-controls">
          <div className="mr-auto flex min-w-0 items-center gap-2 text-xs text-slate-500">
            <Volume2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {isSupported ? (activeIndex === null ? "Select a line or listen from the beginning" : `Narrating line ${activeIndex + 1}`) : "Narration is unavailable in this browser"}
            </span>
          </div>
          {isSupported && (
            <>
              {!isPlaying ? (
                <button className="narration-action narration-action-primary" onClick={() => speakFrom(0)} title="Listen from the beginning">
                  <Play className="h-3.5 w-3.5" />
                  Listen
                </button>
              ) : (
                <button className="narration-icon-action" onClick={togglePause} title={isPaused ? "Resume narration" : "Pause narration"} aria-label={isPaused ? "Resume narration" : "Pause narration"}>
                  {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                </button>
              )}
              <button className="narration-icon-action" onClick={() => speakFrom(0)} title="Restart narration" aria-label="Restart narration">
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button className="narration-icon-action" onClick={stop} title="Stop narration" aria-label="Stop narration">
                <Square className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </article>
    </NarrationContext.Provider>
  );
}

export function NarratedLine({
  index,
  children,
  className,
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(NarrationContext);
  if (!context) return <div className={className}>{children}</div>;

  return (
    <div
      className={cn("narration-line", context.activeIndex === index && "narration-line-active", className)}
      onClick={() => context.startFrom(index)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          context.startFrom(index);
        }
      }}
      role="button"
      tabIndex={0}
      title="Start narration from this line"
    >
      {children}
    </div>
  );
}
