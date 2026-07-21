"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Maximize2, RotateCcw, TriangleAlert } from "lucide-react";
import type { StateData } from "./AutoVisualizer";
import { buildCinematic3DSceneData, primaryCinematicMetric } from "./cinematic3dAdapter";
import { Cinematic3DEngine } from "./cinematic3dEngine";
import type { Cinematic3DHover } from "./cinematic3dTypes";

export default function UniversalCinematic3D({
  state,
  focusMode = false,
  onFocusScene,
}: {
  state: StateData;
  previousState?: StateData | null;
  focusMode?: boolean;
  onFocusScene?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Cinematic3DEngine | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<Cinematic3DHover | null>(null);
  const [rendererError, setRendererError] = useState("");
  const sceneData = useMemo(() => buildCinematic3DSceneData(state), [state]);
  const latestSceneData = useRef(sceneData);
  latestSceneData.current = sceneData;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const next = container.getBoundingClientRect().width < 720;
      setIsCompact((current) => (current === next ? current : next));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;
    setRendererError("");

    try {
      const engine = new Cinematic3DEngine(host, {
        focusMode,
        onHover: setHoveredItem,
      });
      engineRef.current = engine;
      engine.setData(latestSceneData.current);
    } catch (error) {
      setRendererError(
        error instanceof Error
          ? error.message
          : "This device could not initialize the 3D renderer."
      );
    }

    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [focusMode]);

  useEffect(() => {
    engineRef.current?.setData(sceneData);
  }, [sceneData]);

  if (focusMode) {
    return (
      <div
        ref={containerRef}
        className="relative h-full min-h-0 overflow-hidden bg-[#030712] text-white"
        data-testid="universal-cinematic-3d-focus"
        data-visualizer="codeverse-cinematic-3d"
        data-layout="focus"
      >
        <div ref={mountRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-[#020617]/95 via-[#020617]/75 to-transparent px-4 pb-12 pt-4 sm:px-6 sm:pt-6">
          <div className="max-w-2xl rounded-xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-black/40 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]"><span className="rounded-md bg-cyan-300/15 px-2 py-1 text-cyan-100">{sceneData.family}</span><span className="rounded-md bg-emerald-300/15 px-2 py-1 text-emerald-100">Step {sceneData.step} / {sceneData.totalSteps}</span></div>
            <h2 className="mt-2 text-base font-bold leading-6 text-white sm:text-xl">{sceneData.headline}</h2>
            <p className="mt-1 max-w-xl text-xs leading-5 text-slate-200 sm:text-sm sm:leading-6">{sceneData.narrative}</p>
            <p className="mt-2 text-xs font-semibold text-amber-100 sm:text-sm">{sceneData.decision}</p>
          </div>
        </div>
        {rendererError && <RendererFallback message={rendererError} />}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex h-full min-h-0 flex-col overflow-x-hidden overflow-y-auto overscroll-contain bg-[#030712] text-white custom-scrollbar"
      data-testid="universal-cinematic-3d"
      data-visualizer="codeverse-cinematic-3d"
      data-family={sceneData.kind}
      data-scene-layout={sceneData.layout}
      data-layout={isCompact ? "compact" : "wide"}
    >
      <div
        className={`z-10 shrink-0 border-b border-white/10 bg-[#050a12]/95 shadow-lg shadow-black/25 backdrop-blur-md ${
          isCompact
            ? "space-y-3 px-3 py-3"
            : "grid grid-cols-[minmax(0,1fr)_minmax(260px,330px)] gap-4 px-5 py-3"
        }`}
      >
        <section className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="cyan">Cinematic 3D</StatusPill>
            <StatusPill tone="emerald">
              Step {sceneData.step} / {sceneData.totalSteps}
            </StatusPill>
            <StatusPill tone="amber">{sceneData.family}</StatusPill>
          </div>
          <h2
            className={`${
              isCompact ? "mt-2 text-sm leading-5" : "mt-2 text-lg leading-6"
            } break-words font-semibold text-white`}
          >
            {sceneData.headline}
          </h2>
          <p
            className={`${
              isCompact ? "mt-1 text-xs leading-5" : "mt-1 text-sm leading-6"
            } break-words text-slate-300`}
          >
            {sceneData.narrative}
          </p>
        </section>

        <section className="min-w-0 rounded-md border border-white/10 bg-white/[0.05] p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Active state
          </div>
          <div className="mt-2 min-w-0 break-words font-mono text-lg font-bold text-white">
            {primaryCinematicMetric(sceneData)}
          </div>
          <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(min(100%,72px),1fr))] gap-2 text-xs">
            <MiniMetric
              label="Objects"
              value={String(sceneData.items.length)}
              tone="text-cyan-200"
            />
            <MiniMetric
              label="Progress"
              value={`${Math.round(sceneData.progress)}%`}
              tone="text-emerald-200"
            />
            <MiniMetric
              label="Scene"
              value={sceneData.profile.mode}
              tone="text-violet-200"
            />
          </div>
        </section>
      </div>

      <div
        className={`${
          isCompact
            ? "min-h-[340px] flex-[1_0_340px]"
            : "min-h-[clamp(420px,56vh,640px)] flex-[1_1_520px]"
        } relative overflow-hidden`}
      >
        {onFocusScene && (
          <button
            type="button"
            onClick={onFocusScene}
            className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-slate-950/70 text-slate-200 shadow-lg shadow-black/30 backdrop-blur transition hover:bg-slate-900 hover:text-white"
            aria-label="Focus 3D scene"
            title="Focus 3D scene"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}
        <div ref={mountRef} className="absolute inset-0" />
        {rendererError && <RendererFallback message={rendererError} />}
      </div>

      <div
        className={`z-10 shrink-0 border-t border-white/10 bg-[#050a12]/95 shadow-lg shadow-black/30 backdrop-blur-md ${
          isCompact ? "px-3 py-3" : "px-5 py-3"
        }`}
      >
        <div
          className={
            isCompact
              ? "space-y-3"
              : "grid grid-cols-[minmax(0,1fr)_260px_auto] items-center gap-4"
          }
        >
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Decision
            </div>
            <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-100">
              {sceneData.decision}
            </p>
            <p className="mt-1 break-words text-xs leading-5 text-slate-400">
              {sceneData.invariant}
            </p>
          </div>
          <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>Trace progress</span>
              <span>{Math.round(sceneData.progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-300 transition-[width] duration-500"
                style={{ width: `${sceneData.progress}%` }}
              />
            </div>
            <p className="mt-2 break-words text-xs leading-5 text-slate-400">
              {hoveredItem
                ? `Object ${hoveredItem.index + 1}: ${hoveredItem.label}`
                : sceneData.profile.title}
            </p>
          </div>
          <button
            type="button"
            onClick={() => engineRef.current?.resetCamera()}
            className={`${
              isCompact ? "h-9 w-9" : "h-10 w-10"
            } inline-flex items-center justify-center rounded-md border border-white/10 bg-white/[0.08] text-slate-200 transition hover:bg-white/[0.15]`}
            aria-label="Reset 3D camera"
            title="Reset 3D camera"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RendererFallback({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#030712] px-6 text-center">
      <div className="max-w-md">
        <TriangleAlert className="mx-auto h-7 w-7 text-amber-300" aria-hidden="true" />
        <p className="mt-3 text-sm font-semibold text-slate-100">3D rendering is unavailable</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">{message}</p>
      </div>
    </div>
  );
}

function StatusPill({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "cyan" | "emerald" | "amber";
}) {
  const className =
    tone === "cyan"
      ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
      : tone === "emerald"
        ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
        : "border-amber-300/30 bg-amber-300/10 text-amber-100";
  return (
    <span
      className={`rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${className}`}
    >
      {children}
    </span>
  );
}

function MiniMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-2">
      <div className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </div>
      <div className={`mt-1 truncate font-mono text-sm font-bold ${tone}`}>{value}</div>
    </div>
  );
}
