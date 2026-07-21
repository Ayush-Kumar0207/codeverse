"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Binary,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Database,
  GitBranch,
  Layers3,
  MessageCircle,
  Route,
  Sparkles,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import TwoSumCinematic3D from "./TwoSumCinematic3D";
import UniversalCinematic3D from "./UniversalCinematic3D";

export type StateValue =
  | string
  | number
  | boolean
  | null
  | StateValue[]
  | { [key: string]: StateValue };

export type StateData = Record<string, StateValue>;

interface AutoVisualizerProps {
  state?: StateData | null;
  previousState?: StateData | null;
  focusMode?: boolean;
  onFocusScene?: () => void;
}

type PointerMarker = {
  label: string;
  index: number;
  tone?: string;
};

const NARRATIVE_KEYS = ["explanation", "narrative", "focus_message", "calculation", "tip", "message"];
const pendingAssistantPromptKey = "codeverse:pending-ai-prompt";
const SMART_KEYS = new Set([
  "visualizer",
  "kind",
  "algorithm",
  "step",
  "totalSteps",
  "progress",
  "phase",
  "headline",
  "explanation",
  "narrative",
  "beginnerPrompt",
  "invariant",
  "focus",
  "decision",
  "implementationFocus",
  "problemLens",
  "sampleId",
  "simulationId",
  "values",
  "working_array",
  "chars",
  "matrix",
  "dpTable",
  "dp_table",
  "dpRow",
  "graph",
  "tree",
  "list",
  "stack",
  "queue",
  "heap",
  "bits",
  "recursionFrames",
  "callStack",
  "choices",
  "pointers",
  "window",
  "solution",
  "retired",
  "activeCells",
  "variables",
  "memory",
  "target",
]);

const INTERNAL_REGISTER_KEYS = new Set(["samplerun", "sampleid", "debugid"]);

const toneClasses: Record<string, string> = {
  cyan: "border-cyan-400/40 bg-cyan-400/15 text-cyan-100 shadow-cyan-950/30",
  violet: "border-violet-400/40 bg-violet-400/15 text-violet-100 shadow-violet-950/30",
  amber: "border-amber-400/40 bg-amber-400/15 text-amber-100 shadow-amber-950/30",
  emerald: "border-emerald-400/40 bg-emerald-400/15 text-emerald-100 shadow-emerald-950/30",
  rose: "border-rose-400/40 bg-rose-400/15 text-rose-100 shadow-rose-950/30",
  slate: "border-slate-700 bg-slate-900/70 text-slate-300 shadow-black/20",
};

export default function AutoVisualizer({ state, previousState, focusMode = false, onFocusScene }: AutoVisualizerProps) {
  const entries = state && typeof state === "object" ? Object.entries(state) : [];

  if (isTwoSumCinematic3D(state)) {
    return <TwoSumCinematic3D state={state} previousState={previousState} focusMode={focusMode} onFocusScene={onFocusScene} />;
  }

  if (isUniversalCinematic3D(state)) {
    return <UniversalCinematic3D state={state} previousState={previousState} focusMode={focusMode} onFocusScene={onFocusScene} />;
  }

  if (entries.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-8 text-center">
        <div>
          <Sparkles className="mx-auto mb-3 h-5 w-5 text-slate-500" />
          <div className="text-sm font-medium text-slate-300">No trace state yet</div>
          <div className="mt-1 text-xs text-slate-500">Run a simulation to generate a guided visualization.</div>
        </div>
      </div>
    );
  }

  if (isSmartTrace(state)) {
    return <SmartTraceView state={state} previousState={previousState} guidedMode={focusMode} />;
  }

  const narrativeData = entries.filter(([key]) => NARRATIVE_KEYS.includes(key.toLowerCase()));
  const standardData = entries.filter(([key]) => !NARRATIVE_KEYS.includes(key.toLowerCase()));

  return (
    <div className="h-full overflow-y-auto px-5 py-5 custom-scrollbar">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
        {narrativeData.length > 0 && (
          <div className="space-y-3">
            {narrativeData.map(([key, value]) => (
              <NarrativeRibbon key={key} title={key} message={value} fullState={state || {}} />
            ))}
          </div>
        )}

        {standardData.length > 0 ? (
          <div className="grid gap-4">
            {standardData.map(([key, value]) => (
              <section key={key} className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {humanizeKey(key)}
                </h3>
                <VisualizerRouter data={value} />
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function isTwoSumCinematic3D(state?: StateData | null): state is StateData {
  return asString(state?.visualizer) === "two-sum-cinematic-3d";
}

function isUniversalCinematic3D(state?: StateData | null): state is StateData {
  return asString(state?.visualizer) === "codeverse-cinematic-3d";
}

function SmartTraceView({
  state,
  previousState,
  guidedMode = false,
}: {
  state: StateData;
  previousState?: StateData | null;
  guidedMode?: boolean;
}) {
  const algorithm = getRecord(state.algorithm);
  const title = asString(algorithm?.title) || "Algorithm simulation";
  const family = asString(algorithm?.family) || humanizeKey(asString(state.kind) || "trace");
  const step = asNumber(state.step) || 1;
  const totalSteps = asNumber(state.totalSteps) || 1;
  const progress = Math.max(0, Math.min(100, asNumber(state.progress) || Math.round((step / totalSteps) * 100)));
  const guide = buildStepGuide(state, previousState);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [focusPhase, setFocusPhase] = useState(0);

  useEffect(() => setFocusPhase(0), [step]);

  useEffect(() => {
    if (!guidedMode || focusPhase >= 3) return;
    const timer = window.setTimeout(() => setFocusPhase((current) => Math.min(3, current + 1)), 3400);
    return () => window.clearTimeout(timer);
  }, [focusPhase, guidedMode, step]);

  useEffect(() => {
    if (!guidedMode) return;
    const timer = window.setTimeout(() => {
      const target = viewportRef.current?.querySelector('[data-trace-focus="' + focusPhase + '"]');
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [focusPhase, guidedMode, step]);

  const phaseInsight = focusPhase === 0
    ? { title: "Orient", icon: <Sparkles className="h-4 w-4" />, body: guide.plain }
    : focusPhase === 1
      ? { title: "Observe", icon: <Activity className="h-4 w-4" />, body: guide.observe }
      : focusPhase === 2
        ? { title: "Decide", icon: <Target className="h-4 w-4" />, body: guide.why }
        : { title: "Remember", icon: <CheckCircle2 className="h-4 w-4" />, body: guide.remember };

  return (
    <div ref={viewportRef} className="h-full overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_32%),#070b12] px-3 py-3 custom-scrollbar">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3">
        {guidedMode && <FocusRail activePhase={focusPhase} />}
        <motion.section
          data-trace-focus={0}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "overflow-hidden rounded-xl border bg-[#0d1422]/90 shadow-2xl shadow-black/25 transition-all duration-500",
            guidedMode && focusPhase === 0
              ? "border-emerald-300/70 ring-2 ring-emerald-300/30 shadow-[0_0_42px_rgba(52,211,153,0.2)]"
              : "border-indigo-400/20"
          )}
        >
          <div className="border-b border-white/10 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-indigo-400/25 bg-indigo-400/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-200">{family}</span>
                  <span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200">Step {step} / {totalSteps}</span>
                </div>
                <h2 className="text-base font-semibold leading-6 text-white sm:text-lg">{asString(state.headline) || title}</h2>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">{asString(state.narrative)}</p>
              </div>
              <div className="grid min-w-[180px] gap-2 rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Progress</div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-900"><motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400" initial={{ width: 0 }} animate={{ width: String(progress) + "%" }} /></div>
                <div className="flex items-center justify-between text-xs text-slate-400"><span>{asString(state.phase) || "Trace"}</span><span>{progress}%</span></div>
              </div>
            </div>
          </div>

          <div className="border-b border-white/10 p-3">
            <LearningGuide guide={guide} guidedMode={guidedMode} activePhase={focusPhase} />
          </div>

          <div className="grid gap-3 p-3 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
            <div
              data-trace-focus={1}
              className={cn(
                "space-y-3 rounded-xl transition-all duration-500",
                guidedMode && focusPhase === 1 && "ring-2 ring-cyan-300/60 shadow-[0_0_42px_rgba(34,211,238,0.2)]"
              )}
            >
              <StageRouter state={state} />
              <TimelineRail step={step} totalSteps={totalSteps} />
            </div>
            {guidedMode ? (
              <motion.div
                key={focusPhase}
                data-trace-focus={focusPhase >= 2 ? focusPhase : undefined}
                initial={{ opacity: 0.45, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "self-start rounded-xl ring-2 shadow-[0_0_42px_rgba(167,139,250,0.18)]",
                  focusPhase >= 2 ? "ring-violet-300/60" : "ring-white/5"
                )}
              >
                <InsightCard icon={phaseInsight.icon} title={phaseInsight.title}>{phaseInsight.body}</InsightCard>
                {focusPhase === 3 && asString(state.implementationFocus) ? (
                  <div className="mt-3"><InsightCard icon={<Code2 className="h-4 w-4" />} title="Code connection"><span className="font-mono text-xs">{asString(state.implementationFocus)}</span></InsightCard></div>
                ) : null}
              </motion.div>
            ) : (
              <div className="space-y-3">
                <InsightCard icon={<BrainCircuit className="h-4 w-4" />} title="Beginner focus">{asString(state.beginnerPrompt) || "Watch the highlighted state change before reading the code."}</InsightCard>
                {asString(state.problemLens) ? <InsightCard icon={<Sparkles className="h-4 w-4" />} title="Problem lens">{asString(state.problemLens)}</InsightCard> : null}
                <InsightCard icon={<Target className="h-4 w-4" />} title="Decision">{asString(state.decision) || "This step preserves the algorithm invariant."}</InsightCard>
                {asString(state.implementationFocus) ? <InsightCard icon={<Code2 className="h-4 w-4" />} title="Implementation focus"><span className="font-mono text-xs">{asString(state.implementationFocus)}</span></InsightCard> : null}
                <InsightCard icon={<CheckCircle2 className="h-4 w-4" />} title="Invariant">{asString(state.invariant) || "The stored state remains correct after this transition."}</InsightCard>
                <VariablePanel state={state} />
              </div>
            )}
          </div>
        </motion.section>

        {!guidedMode && <InspectorPanel state={state} />}
      </div>
    </div>
  );
}

const FOCUS_PHASES = ["Orient", "Observe", "Decide", "Remember"];

function FocusRail({ activePhase }: { activePhase: number }) {
  return (
    <div className="sticky top-0 z-20 rounded-xl border border-emerald-300/20 bg-[#08111b]/95 p-2 shadow-xl shadow-black/30 backdrop-blur-xl" data-testid="guided-focus-rail">
      <div className="grid grid-cols-4 gap-1.5">
        {FOCUS_PHASES.map((label, index) => (
          <div key={label} className={cn("rounded-lg border px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] transition-all sm:text-xs", index === activePhase ? "border-emerald-300/60 bg-emerald-300/15 text-emerald-100 shadow-[0_0_24px_rgba(52,211,153,0.18)]" : index < activePhase ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-white/[0.03] text-slate-500")}>
            <span className="mr-1 font-mono">{index + 1}</span>{label}
          </div>
        ))}
      </div>
    </div>
  );
}

function StageRouter({ state }: { state: StateData }) {
  const matrix = getMatrix(state.matrix) || getMatrix(state.dpTable) || getMatrix(state.dp_table);
  const graph = getRecord(state.graph);
  const tree = getRecord(state.tree);
  const list = getArray(state.list);
  const heap = getArray(state.heap);
  const stack = getArray(state.stack);
  const queue = getArray(state.queue);
  const frames = getArray(state.recursionFrames);
  const bits = getArray(state.bits);
  const values = getArray(state.values) || getArray(state.working_array) || getArray(state.chars) || getArray(state.dpRow);

  if (graph) return <GraphStage graph={graph} />;
  if (tree) return <TreeStage tree={tree} />;
  if (list) return <LinkedListStage list={list} state={state} />;
  if (matrix) return <MatrixStage matrix={matrix} state={state} />;
  if (heap) return <HeapStage heap={heap} state={state} />;
  if (stack || queue) return <StackQueueStage stack={stack || []} queue={queue || []} />;
  if (frames) return <RecursionStage frames={frames} choices={getArray(state.choices)} />;
  if (bits) return <BitStage bits={bits} />;
  if (values) return <ArrayStage values={values} state={state} />;

  return (
    <div className="rounded-xl border border-white/10 bg-[#090f19] p-5">
      <VisualizerRouter data={state} />
    </div>
  );
}

function ArrayStage({ values, state }: { values: StateValue[]; state: StateData }) {
  const pointers = getPointers(state);
  const pointerByIndex = new Map(pointers.map((pointer) => [pointer.index, pointer]));
  const solution = new Set(getNumberArray(state.solution));
  const retired = new Set(getNumberArray(state.retired));
  const window = getRecord(state.window);
  const left = asNumber(window?.left);
  const right = asNumber(window?.right);

  return (
    <div className="rounded-xl border border-white/10 bg-[#090f19] p-4 shadow-2xl shadow-black/20">
      <StageHeader icon={<Activity className="h-4 w-4" />} title="Live data lane" subtitle="Highlighted cells show the exact state being reasoned about." />
      <div className="mt-4 overflow-x-auto pb-2">
        <div className="flex min-w-max items-end gap-2">
          {values.map((value, index) => {
            const pointer = pointerByIndex.get(index);
            const inWindow = typeof left === "number" && typeof right === "number" && index >= left && index <= right;
            const tone = solution.has(index)
              ? "emerald"
              : pointer?.tone || (retired.has(index) ? "slate" : inWindow ? "cyan" : "default");

            return (
              <motion.div layout key={index} className="flex min-w-12 flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-14 min-w-12 items-center justify-center rounded-lg border px-3 font-mono text-sm shadow-lg transition",
                    tone === "default" ? "border-slate-800 bg-slate-950 text-slate-300 shadow-black/20" : toneClasses[tone] || toneClasses.slate,
                    retired.has(index) && "opacity-45"
                  )}
                >
                  {stringifyValue(value)}
                </div>
                <div className="h-9 text-center">
                  <div className="font-mono text-[10px] text-slate-600">{index}</div>
                  {pointer && <div className="mt-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-slate-200">{pointer.label}</div>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MatrixStage({ matrix, state }: { matrix: StateValue[][]; state: StateData }) {
  const cols = Math.max(matrix[0]?.length || 1, 1);
  const activeCells = new Set((getArray(state.activeCells) || []).map((cell) => stringifyValue(cell)));

  return (
    <div className="rounded-xl border border-white/10 bg-[#090f19] p-4 shadow-2xl shadow-black/20">
      <StageHeader icon={<Database className="h-4 w-4" />} title="Matrix field" subtitle="Rows, columns, and DP cells light up as the transition touches them." />
      <div className="mt-4 max-w-full overflow-auto rounded-lg border border-slate-800 bg-black/20 p-3">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(46px, 1fr))` }}>
          {matrix.map((row, rowIndex) =>
            row.map((cell, cellIndex) => {
              const id = `${rowIndex}-${cellIndex}`;
              const active = activeCells.has(id);
              return (
                <motion.div
                  layout
                  key={id}
                  className={cn(
                    "flex h-12 min-w-12 items-center justify-center rounded-lg border font-mono text-sm transition",
                    active ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100 shadow-lg shadow-cyan-950/30" : "border-slate-800 bg-slate-950 text-slate-300"
                  )}
                >
                  {stringifyValue(cell)}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function GraphStage({ graph }: { graph: Record<string, StateValue> }) {
  const nodes = (getArray(graph.nodes) || []).map((node) => getRecord(node)).filter(Boolean) as Record<string, StateValue>[];
  const edges = (getArray(graph.edges) || []).map((edge) => getRecord(edge)).filter(Boolean) as Record<string, StateValue>[];
  const width = 620;
  const height = 330;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 112;
  const positions = new Map<string, { x: number; y: number }>();

  nodes.forEach((node, index) => {
    const angle = -Math.PI / 2 + (index / Math.max(nodes.length, 1)) * Math.PI * 2;
    positions.set(asString(node.id) || String(index), {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  });

  return (
    <div className="rounded-xl border border-white/10 bg-[#090f19] p-4 shadow-2xl shadow-black/20">
      <StageHeader icon={<Route className="h-4 w-4" />} title="Graph frontier map" subtitle="Nodes change color as they move from unseen to frontier to resolved." />
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-black/20">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[330px] w-full">
          <defs>
            <filter id="graphGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {edges.map((edge, index) => {
            const from = positions.get(asString(edge.from) || "");
            const to = positions.get(asString(edge.to) || "");
            if (!from || !to) return null;
            const active = asString(edge.state) === "active";
            return (
              <g key={`${asString(edge.from)}-${asString(edge.to)}-${index}`}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={active ? "#22d3ee" : "#334155"} strokeWidth={active ? 3 : 1.5} />
                {edge.label ? (
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 6} textAnchor="middle" className="fill-slate-400 text-[12px] font-semibold">
                    {asString(edge.label)}
                  </text>
                ) : null}
              </g>
            );
          })}
          {nodes.map((node, index) => {
            const id = asString(node.id) || String(index);
            const position = positions.get(id) || { x: centerX, y: centerY };
            const state = asString(node.state) || "unseen";
            const color = graphNodeColor(state);
            return (
              <g key={id} filter={state === "active" || state === "source" ? "url(#graphGlow)" : undefined}>
                <circle cx={position.x} cy={position.y} r="27" fill={color.fill} stroke={color.stroke} strokeWidth="2" />
                <text x={position.x} y={position.y + 5} textAnchor="middle" className="fill-white text-sm font-bold">
                  {asString(node.label) || id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function TreeStage({ tree }: { tree: Record<string, StateValue> }) {
  const nodes = (getArray(tree.nodes) || []).map((node) => getRecord(node)).filter(Boolean) as Record<string, StateValue>[];
  const edges = (getArray(tree.edges) || []).map((edge) => getRecord(edge)).filter(Boolean) as Record<string, StateValue>[];
  const width = 620;
  const height = 350;
  const positions = new Map<string, { x: number; y: number }>();

  nodes.forEach((node, index) => {
    const id = asString(node.id) || String(index);
    const level = asNumber(node.level) || 0;
    const position = asNumber(node.position) || 0;
    positions.set(id, {
      x: width / 2 + position * 150,
      y: 48 + level * 86,
    });
  });

  return (
    <div className="rounded-xl border border-white/10 bg-[#090f19] p-4 shadow-2xl shadow-black/20">
      <StageHeader icon={<GitBranch className="h-4 w-4" />} title="Tree call structure" subtitle="Follow the active node and watch answers return upward." />
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-black/20">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[350px] w-full">
          {edges.map((edge, index) => {
            const from = positions.get(asString(edge.from) || "");
            const to = positions.get(asString(edge.to) || "");
            if (!from || !to) return null;
            return <line key={index} x1={from.x} y1={from.y + 24} x2={to.x} y2={to.y - 24} stroke="#334155" strokeWidth="2" />;
          })}
          {nodes.map((node, index) => {
            const id = asString(node.id) || String(index);
            const position = positions.get(id) || { x: width / 2, y: 48 };
            const color = graphNodeColor(asString(node.state) || "unseen");
            return (
              <g key={id}>
                <circle cx={position.x} cy={position.y} r="25" fill={color.fill} stroke={color.stroke} strokeWidth="2" />
                <text x={position.x} y={position.y + 5} textAnchor="middle" className="fill-white text-sm font-bold">
                  {asString(node.label) || id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function LinkedListStage({ list, state }: { list: StateValue[]; state: StateData }) {
  const pointers = getPointers(state);
  const pointerByIndex = new Map(pointers.map((pointer) => [pointer.index, pointer]));

  return (
    <div className="rounded-xl border border-white/10 bg-[#090f19] p-4 shadow-2xl shadow-black/20">
      <StageHeader icon={<Route className="h-4 w-4" />} title="Linked-list pointer lane" subtitle="Each arrow is a reference that must be preserved or rewired carefully." />
      <div className="mt-4 overflow-x-auto pb-2">
        <div className="flex min-w-max items-center gap-3">
          {list.map((item, index) => {
            const node = getRecord(item);
            const pointer = pointerByIndex.get(index);
            const value = node ? node.value : item;
            const stateName = node ? asString(node.state) : "";
            const tone = stateName === "done" ? "emerald" : stateName === "active" ? "cyan" : stateName === "frontier" ? "violet" : "slate";
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div className={cn("flex h-14 min-w-16 items-center justify-center rounded-lg border px-4 font-mono text-sm shadow-lg", toneClasses[tone])}>
                    {stringifyValue(value)}
                  </div>
                  <div className="h-7 text-center">{pointer && <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-slate-200">{pointer.label}</span>}</div>
                </div>
                {index < list.length - 1 && <div className="mb-8 text-slate-600">-&gt;</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HeapStage({ heap, state }: { heap: StateValue[]; state: StateData }) {
  const pointers = getPointers(state);
  const active = new Set(pointers.map((pointer) => pointer.index));

  return (
    <div className="rounded-xl border border-white/10 bg-[#090f19] p-4 shadow-2xl shadow-black/20">
      <StageHeader icon={<Layers3 className="h-4 w-4" />} title="Heap priority tree" subtitle="The root is the current priority winner; swaps repair parent-child order." />
      <div className="mt-4 grid gap-3">
        {[0, 1, 2].map((level) => {
          const start = 2 ** level - 1;
          const end = Math.min(2 ** (level + 1) - 1, heap.length);
          const row = heap.slice(start, end);
          if (row.length === 0) return null;
          return (
            <div key={level} className="flex justify-center gap-3">
              {row.map((value, offset) => {
                const index = start + offset;
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex h-12 min-w-12 items-center justify-center rounded-lg border px-3 font-mono text-sm",
                      active.has(index) || index === 0 ? toneClasses.emerald : "border-slate-800 bg-slate-950 text-slate-300"
                    )}
                  >
                    {stringifyValue(value)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StackQueueStage({ stack, queue }: { stack: StateValue[]; queue: StateValue[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#090f19] p-4 shadow-2xl shadow-black/20">
      <StageHeader icon={<Layers3 className="h-4 w-4" />} title="Container state" subtitle="The live container stores unresolved candidates in a strict order." />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ContainerColumn title="Stack top" items={[...stack].reverse()} />
        <ContainerColumn title="Queue front" items={queue} />
      </div>
    </div>
  );
}

function ContainerColumn({ title, items }: { title: string; items: StateValue[] }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-black/20 p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</div>
      <div className="flex min-h-28 flex-col-reverse justify-start gap-2">
        {items.length === 0 ? <div className="text-sm text-slate-600">empty</div> : null}
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border border-indigo-400/25 bg-indigo-400/10 px-3 py-2 text-center font-mono text-sm text-indigo-100">
            {stringifyValue(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

function RecursionStage({ frames, choices }: { frames: StateValue[]; choices?: StateValue[] | null }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#090f19] p-4 shadow-2xl shadow-black/20">
      <StageHeader icon={<GitBranch className="h-4 w-4" />} title="Call-stack timeline" subtitle="Each frame is one active promise the recursion must finish." />
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="space-y-2">
          {frames.map((frame, index) => {
            const record = getRecord(frame);
            const label = asString(record?.label) || stringifyValue(frame);
            const state = asString(record?.state) || "waiting";
            return (
              <div key={index} className={cn("rounded-lg border px-3 py-2 font-mono text-sm", state === "active" ? toneClasses.cyan : state === "done" ? toneClasses.emerald : toneClasses.slate)}>
                {label}
              </div>
            );
          })}
        </div>
        <div className="rounded-lg border border-slate-800 bg-black/20 p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Choices</div>
          <div className="flex flex-wrap gap-2">
            {(choices || []).map((choice, index) => (
              <span key={index} className="rounded-md border border-violet-400/25 bg-violet-400/10 px-2 py-1 text-xs font-semibold text-violet-100">
                {stringifyValue(choice)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BitStage({ bits }: { bits: StateValue[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#090f19] p-4 shadow-2xl shadow-black/20">
      <StageHeader icon={<Binary className="h-4 w-4" />} title="Bit lanes" subtitle="Read columns vertically; each column is a bit position." />
      <div className="mt-4 space-y-3 rounded-lg border border-slate-800 bg-black/20 p-4">
        {bits.map((row, index) => {
          const record = getRecord(row);
          const label = asString(record?.label) || `row ${index + 1}`;
          const value = asString(record?.value) || stringifyValue(row);
          const active = new Set(getNumberArray(record?.active));
          return (
            <div key={index} className="grid grid-cols-[90px_1fr] items-center gap-3">
              <div className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</div>
              <div className="flex gap-1">
                {value.split("").map((bit, bitIndex) => (
                  <span key={bitIndex} className={cn("flex h-9 w-8 items-center justify-center rounded border font-mono text-sm", active.has(bitIndex) ? toneClasses.amber : "border-slate-800 bg-slate-950 text-slate-300")}>
                    {bit}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VariablePanel({ state }: { state: StateData }) {
  const variables = getRecord(state.variables);
  const memory = getRecord(state.memory);
  const algorithm = getRecord(state.algorithm);
  const visibleVariables = variables ? omitInternalRegisters(variables) : {};

  return (
    <div className="rounded-xl border border-white/10 bg-[#090f19] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Database className="h-4 w-4 text-cyan-300" />
        <h3 className="text-sm font-semibold text-white">State registers</h3>
      </div>
      <ObjectTable data={{ ...(algorithm ? { time: algorithm.timeComplexity, space: algorithm.spaceComplexity } : {}), ...visibleVariables, ...(memory ? { memory } : {}) }} />
    </div>
  );
}

function TimelineRail({ step, totalSteps }: { step: number; totalSteps: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#090f19] p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Simulation timeline</div>
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }, (_, index) => index + 1).map((item) => (
          <div key={item} className={cn("h-2 flex-1 rounded-full", item <= step ? "bg-indigo-400" : "bg-slate-800")} />
        ))}
      </div>
    </div>
  );
}

function InspectorPanel({ state }: { state: StateData }) {
  const extras = Object.entries(state).filter(([key]) => !SMART_KEYS.has(key));
  if (extras.length === 0) return null;

  return (
    <details className="rounded-xl border border-white/10 bg-[#090f19] p-4 text-sm text-slate-300">
      <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        Raw trace fields
      </summary>
      <div className="mt-4 grid gap-3">
        {extras.map(([key, value]) => (
          <div key={key} className="rounded-lg border border-slate-800 bg-black/20 p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{humanizeKey(key)}</div>
            <VisualizerRouter data={value} />
          </div>
        ))}
      </div>
    </details>
  );
}

function StageHeader({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg border border-indigo-400/20 bg-indigo-400/10 p-2 text-indigo-300">{icon}</div>
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function InsightCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#090f19] p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
        <span className="text-indigo-300">{icon}</span>
        {title}
      </div>
      <p className="text-sm leading-6 text-slate-300">{children}</p>
    </div>
  );
}

type StepGuide = {
  plain: string;
  observe: string;
  changed: string;
  why: string;
  remember: string;
  code: string;
};

function LearningGuide({
  guide,
  guidedMode = false,
  activePhase = 0,
}: {
  guide: StepGuide;
  guidedMode?: boolean;
  activePhase?: number;
}) {
  const items = [
    ["Look here first", guide.observe],
    ["What changed", guide.changed],
    ["Why this is safe", guide.why],
    ["Carry forward", guide.remember],
    ["Code connection", guide.code],
  ];
  const guidedItem = activePhase === 0 ? ["Question in plain words", guide.plain] : items[Math.min(activePhase - 1, 3)];

  return (
    <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg border border-cyan-400/25 bg-cyan-400/10 p-2 text-cyan-200"><BrainCircuit className="h-4 w-4" /></div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-white">{guidedMode ? ["Focus ", activePhase + 1, ": ", guidedItem[0]].join("") : "Step explained from zero"}</div>
          {guidedMode ? (
            <motion.p key={activePhase} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="mt-2 text-base leading-7 text-slate-100">{guidedItem[1]}</motion.p>
          ) : (
            <>
              <p className="mt-1 text-sm leading-6 text-slate-200">{guide.plain}</p>
              <div className="mt-3 grid gap-2 xl:grid-cols-5">
                {items.map(([title, body], index) => (
                  <div key={title} className="rounded-lg border border-white/10 bg-black/20 p-3">
                    <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-200"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/15 font-mono text-[10px]">{index + 1}</span>{title}</div>
                    <p className="text-xs leading-5 text-slate-300">{body}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function buildStepGuide(state: StateData, previousState?: StateData | null): StepGuide {
  const headline = asString(state.headline) || `Step ${asString(state.step) || "now"}`;
  const narrative = asString(state.narrative) || asString(state.explanation);
  const decision = asString(state.decision);
  const invariant = asString(state.invariant);
  const implementationFocus = asString(state.implementationFocus);

  return {
    plain: narrative
      ? `${headline} In plain words, this step is asking one small question and updating only the state needed to answer it. ${narrative}`
      : `${headline} This frame shows one safe move of the algorithm, not the whole solution at once.`,
    observe: describeFocus(state),
    changed: describeChanges(state, previousState),
    why: decision
      ? `${decision} The algorithm is allowed to do this because the earlier processed part has already proved enough information for this choice.`
      : "Use the highlighted state to decide the next safe move. The step is valid when it keeps the algorithm's promise true.",
    remember: invariant
      ? `${invariant} After this frame, keep this promise in mind before moving to the next step.`
      : "After this frame, remember only the highlighted state and the shown registers; the algorithm has compressed the past into those facts.",
    code: implementationFocus
      ? `This visual move corresponds to: ${implementationFocus}. Read it left to right: compute the new candidate, then store the best/latest state.`
      : "The code for this step updates the highlighted pointer, cell, container, or register shown in the visual lane.",
  };
}

function describeFocus(state: StateData) {
  const pointers = getPointers(state);
  const values = getLinearValues(state);

  if (pointers.length > 0) {
    return pointers
      .slice(0, 3)
      .map((pointer) => {
        const value = values ? values[pointer.index] : undefined;
        const valueText = typeof value !== "undefined" ? `, value ${shortValue(value)}` : "";
        return `Find ${pointer.label} at index ${pointer.index}${valueText}. That is the exact item this step is reasoning about.`;
      })
      .join(" ");
  }

  const activeCells = getArray(state.activeCells);
  if (activeCells && activeCells.length > 0) {
    return `Look at cell ${activeCells.map(shortValue).slice(0, 4).join(", ")}. Those cells are where the table rule is being applied right now.`;
  }

  const window = getRecord(state.window);
  const left = asNumber(window?.left);
  const right = asNumber(window?.right);
  if (typeof left === "number" && typeof right === "number") {
    return `Look at the window from index ${left} to ${right}. Everything inside it is the current candidate group; everything outside is context.`;
  }

  const graph = getRecord(state.graph) || getRecord(state.tree);
  const activeNodes = getActiveNodeLabels(graph);
  if (activeNodes.length > 0) {
    return `Look at node ${activeNodes.slice(0, 4).join(", ")}. The algorithm is deciding what to do with that node before moving outward.`;
  }

  const stack = getArray(state.stack);
  const queue = getArray(state.queue);
  if (stack && stack.length > 0) {
    return `Look at the top of the stack: ${shortValue(stack[stack.length - 1])}. A stack always works from the most recently added unresolved item.`;
  }
  if (queue && queue.length > 0) {
    return `Look at the front of the queue: ${shortValue(queue[0])}. A queue always works from the oldest waiting item.`;
  }

  return "Start with the highlighted visual state, then read the registers. Together they tell you what the algorithm currently knows.";
}

function describeChanges(state: StateData, previousState?: StateData | null) {
  if (!previousState) {
    return "This is the starting snapshot. Nothing has changed yet; the step is setting up the first useful facts.";
  }

  const changes = [
    ...describePointerChanges(state, previousState),
    ...describeValueChanges(state, previousState),
    ...describeVariableChanges(state, previousState),
  ];

  if (changes.length === 0) {
    return "The raw values did not change much here. The important change is conceptual: a pointer, candidate, or proof has advanced.";
  }

  return changes.slice(0, 4).join(" ");
}

function describePointerChanges(state: StateData, previousState: StateData) {
  const current = getPointers(state);
  const previous = new Map(getPointers(previousState).map((pointer) => [pointer.label, pointer.index]));
  const changes: string[] = [];

  for (const pointer of current) {
    const oldIndex = previous.get(pointer.label);
    if (typeof oldIndex === "number" && oldIndex !== pointer.index) {
      changes.push(`${pointer.label} moved from index ${oldIndex} to ${pointer.index}.`);
    } else if (typeof oldIndex !== "number") {
      changes.push(`${pointer.label} appeared at index ${pointer.index}.`);
    }
  }

  return changes;
}

function describeValueChanges(state: StateData, previousState: StateData) {
  const current = getLinearValues(state);
  const previous = getLinearValues(previousState);
  if (!current || !previous) return [];

  const changes: string[] = [];
  current.forEach((value, index) => {
    if (stableValue(value) !== stableValue(previous[index])) {
      changes.push(`Index ${index} changed from ${shortValue(previous[index])} to ${shortValue(value)}.`);
    }
  });

  return changes;
}

function describeVariableChanges(state: StateData, previousState: StateData) {
  const current = getRecord(state.variables);
  const previous = getRecord(previousState.variables);
  if (!current || !previous) return [];

  return Object.entries(current)
    .filter(([key]) => !isInternalRegisterKey(key))
    .filter(([key, value]) => stableValue(value) !== stableValue(previous[key]))
    .slice(0, 4)
    .map(([key, value]) => `${humanizeKey(key)} became ${shortValue(value)}.`);
}

function getLinearValues(state: StateData) {
  return getArray(state.values) || getArray(state.working_array) || getArray(state.array) || getArray(state.chars) || getArray(state.dpRow) || getArray(state.nums);
}

function getActiveNodeLabels(graph: Record<string, StateValue> | null) {
  if (!graph) return [];
  return (getArray(graph.nodes) || [])
    .map((node) => getRecord(node))
    .filter((node): node is Record<string, StateValue> => Boolean(node))
    .filter((node) => ["active", "source", "frontier"].includes(asString(node.state)))
    .map((node) => asString(node.label) || asString(node.id))
    .filter(Boolean);
}

function stableValue(value: StateValue | undefined) {
  if (typeof value === "undefined") return "undefined";
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

function shortValue(value: StateValue | undefined) {
  const raw = stableValue(value);
  return raw.length > 42 ? `${raw.slice(0, 39)}...` : raw;
}

function NarrativeRibbon({
  title,
  message,
  fullState,
}: {
  title: string;
  message: StateValue;
  fullState: StateData;
}) {
  const handleAskAI = () => {
    const detail = {
      stateContext: fullState,
      question: `Explain this trace step: "${humanizeKey(title)}".`,
    };

    window.sessionStorage.setItem(pendingAssistantPromptKey, JSON.stringify(detail));
    window.dispatchEvent(new CustomEvent("codeverse:open-assistant-panel"));
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("algotrace:ask_ai", { detail }));
    }, 120);
  };

  return (
    <motion.div
      initial={{ y: -4, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4"
    >
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
            {humanizeKey(title)}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-100">{stringifyValue(message)}</p>
        </div>
        <button
          type="button"
          onClick={handleAskAI}
          title="Ask AI about this step"
          aria-label="Ask AI about this trace step"
          className="inline-flex h-8 items-center gap-2 rounded-md border border-slate-700 px-2.5 text-xs text-slate-300 transition-colors hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-100"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Ask
        </button>
      </div>
    </motion.div>
  );
}

function VisualizerRouter({ data }: { data: StateValue }) {
  if (Array.isArray(data)) {
    if (data.length > 0 && Array.isArray(data[0])) {
      return <MatrixGrid data={data as StateValue[][]} />;
    }
    return <LinearArray data={data} />;
  }

  if (typeof data === "object" && data !== null) {
    return <GenericObject data={data as Record<string, StateValue>} />;
  }

  return <VariableChip data={data} />;
}

function MatrixGrid({ data }: { data: StateValue[][] }) {
  const cols = Math.max(data[0]?.length || 1, 1);

  return (
    <div className="max-w-full overflow-auto rounded-md border border-slate-800 bg-[#070b12] p-3 custom-scrollbar">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(36px, 1fr))` }}>
        {data.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <motion.div
              layout
              key={`${rowIndex}-${cellIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-9 min-w-9 items-center justify-center rounded border border-slate-700/70 bg-slate-900 px-2 font-mono text-xs text-slate-100"
            >
              {stringifyValue(cell)}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function LinearArray({ data }: { data: StateValue[] }) {
  return (
    <div className="max-w-full overflow-hidden pb-1">
      <div className="flex flex-wrap gap-2">
        {data.map((item, index) => (
          <motion.div
            layout
            key={index}
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div
              title={stringifyValue(item)}
              className="flex h-10 max-w-40 min-w-10 items-center justify-center overflow-hidden truncate whitespace-nowrap rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 font-mono text-xs text-indigo-100"
            >
              {stringifyValue(item)}
            </div>
            <span className="mt-1 font-mono text-[10px] text-slate-600">{index}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function VariableChip({ data }: { data: StateValue }) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 font-mono text-sm text-emerald-200"
    >
      {String(data)}
    </motion.div>
  );
}

function GenericObject({ data }: { data: Record<string, StateValue> }) {
  return (
    <div className="max-w-full overflow-hidden rounded-md border border-slate-800 bg-[#070b12] p-3 font-mono text-xs">
      <ObjectTable data={data} />
    </div>
  );
}

function ObjectTable({ data }: { data: Record<string, StateValue | undefined> }) {
  const entries = Object.entries(data).filter(([key, value]) => typeof value !== "undefined" && !isInternalRegisterKey(key));
  if (entries.length === 0) return <div className="text-sm text-slate-600">No registers for this step.</div>;

  return (
    <div className="grid gap-1 font-mono text-xs">
      {entries.map(([key, value]) => (
        <div key={key} className="grid grid-cols-[minmax(90px,0.42fr)_1fr] gap-3 py-1">
          <span className="truncate text-slate-500">{humanizeKey(key)}</span>
          <span className="truncate text-slate-200">{stringifyValue(value as StateValue)}</span>
        </div>
      ))}
    </div>
  );
}

function isSmartTrace(state?: StateData | null): state is StateData {
  return Boolean(state && (state.visualizer || state.kind || state.headline || state.algorithm));
}

function isInternalRegisterKey(key: string) {
  return INTERNAL_REGISTER_KEYS.has(key.replace(/[\s_-]/g, "").toLowerCase());
}

function omitInternalRegisters(data: Record<string, StateValue>) {
  return Object.fromEntries(Object.entries(data).filter(([key]) => !isInternalRegisterKey(key)));
}

function stringifyValue(value: StateValue | undefined) {
  if (typeof value === "undefined") return "";
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}

function getRecord(value: StateValue | undefined): Record<string, StateValue> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, StateValue>;
}

function getArray(value: StateValue | undefined): StateValue[] | null {
  return Array.isArray(value) ? value : null;
}

function getMatrix(value: StateValue | undefined): StateValue[][] | null {
  if (!Array.isArray(value) || value.length === 0 || !Array.isArray(value[0])) return null;
  return value as StateValue[][];
}

function asString(value: StateValue | undefined) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function asNumber(value: StateValue | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
  }
  return undefined;
}

function getNumberArray(value: StateValue | undefined) {
  const array = getArray(value);
  if (!array) return [];
  return array.map(asNumber).filter((item): item is number => typeof item === "number");
}

function getPointers(state: StateData): PointerMarker[] {
  const rawPointers = getArray(state.pointers) || [];
  const pointers: PointerMarker[] = [];

  for (const item of rawPointers) {
    const record = getRecord(item);
    const index = asNumber(record?.index);
    if (!record || typeof index !== "number") continue;
    pointers.push({
      label: asString(record.label) || "ptr",
      index,
      tone: asString(record.tone) || "cyan",
    });
  }

  const legacyPointers: Array<[string, string, string]> = [
    ["left_index", "left", "cyan"],
    ["right_index", "right", "violet"],
    ["current_i", "i", "amber"],
    ["current_w", "w", "emerald"],
  ];

  for (const [key, label, tone] of legacyPointers) {
    const index = asNumber(state[key]);
    if (typeof index === "number") pointers.push({ label, index, tone });
  }

  return pointers;
}

function graphNodeColor(state: string) {
  if (state === "source" || state === "active") return { fill: "#312e81", stroke: "#818cf8" };
  if (state === "frontier") return { fill: "#164e63", stroke: "#22d3ee" };
  if (state === "done") return { fill: "#064e3b", stroke: "#34d399" };
  return { fill: "#0f172a", stroke: "#475569" };
}

function humanizeKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}
