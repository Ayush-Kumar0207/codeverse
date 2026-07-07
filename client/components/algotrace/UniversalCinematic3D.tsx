"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Maximize2, RotateCcw } from "lucide-react";
import * as THREE from "three";
import type { StateData, StateValue } from "./AutoVisualizer";

type PointerState = { label: string; index: number; tone?: string };
type SceneItem = { raw: StateValue; label: string; value: number; interval?: { start: number; end: number } };
type SceneProfile = { id: string; title: string; family: string; palette: Palette; mode: string };
type Palette = { primary: number; secondary: number; accent: number; danger: number; success: number; neutral: number };
type SceneData = {
  algorithmTitle: string;
  family: string;
  step: number;
  totalSteps: number;
  progress: number;
  headline: string;
  narrative: string;
  decision: string;
  invariant: string;
  items: SceneItem[];
  pointers: PointerState[];
  retired: Set<number>;
  solution: Set<number>;
  activeCells: Set<number>;
  window: { left: number; right: number } | null;
  variables: Record<string, StateValue>;
  profile: SceneProfile;
};

const UNIVERSAL_TEST_ID = "universal-cinematic-canvas";
const DEFAULT_PALETTE: Palette = {
  primary: 0x22d3ee,
  secondary: 0xa78bfa,
  accent: 0xfbbf24,
  danger: 0xfb7185,
  success: 0x34d399,
  neutral: 0x1d4ed8,
};
const pointerToneColors: Record<string, number> = {
  cyan: 0x22d3ee,
  violet: 0xa78bfa,
  emerald: 0x34d399,
  rose: 0xfb7185,
  amber: 0xfbbf24,
  blue: 0x60a5fa,
};

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
  const [isCompact, setIsCompact] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<{ index: number; label: string } | null>(null);
  const [resetNonce, setResetNonce] = useState(0);
  const sceneData = useMemo(() => buildSceneData(state), [state]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const rect = container.getBoundingClientRect();
      setIsCompact((current) => {
        const next = rect.width < 720;
        return current === next ? current : next;
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    host.innerHTML = "";
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.dataset.testid = UNIVERSAL_TEST_ID;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.width = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.Fog(0x030712, 13, 28);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const lookAt = new THREE.Vector3(0, 1.5, 0);
    const controls = { theta: 0.14, elevation: 4.65, radius: sceneData.items.length > 8 ? 14.4 : 12.8 };
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const interactive: THREE.Object3D[] = [];
    const pulsing: THREE.Object3D[] = [];
    const flowDots: THREE.Object3D[] = [];
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    buildScene(scene, stageGroup, sceneData, interactive, pulsing, flowDots);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = width < 520 ? 52 : width < 760 ? 46 : focusMode ? 36 : 39;
      controls.radius = Math.max(controls.radius, width < 520 ? 15.8 : width < 760 ? 14.6 : controls.radius);
      camera.updateProjectionMatrix();
    };

    const updateCamera = () => {
      camera.position.set(
        Math.sin(controls.theta) * controls.radius,
        controls.elevation,
        Math.cos(controls.theta) * controls.radius
      );
      camera.lookAt(lookAt);
    };

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const handlePointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const handlePointerUp = (event: PointerEvent) => {
      dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (dragging) {
        controls.theta -= (event.clientX - lastX) * 0.005;
        controls.elevation = THREE.MathUtils.clamp(controls.elevation + (event.clientY - lastY) * 0.014, 2.7, 7.2);
        lastX = event.clientX;
        lastY = event.clientY;
        return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(interactive, false)[0]?.object;
      setHoveredItem(hit ? { index: Number(hit.userData.index), label: String(hit.userData.label) } : null);
    };

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      controls.radius = THREE.MathUtils.clamp(controls.radius + event.deltaY * 0.01, 8.8, 18.5);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointercancel", handlePointerUp);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", () => setHoveredItem(null));
    renderer.domElement.addEventListener("wheel", handleWheel, { passive: false });

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      updateCamera();
      pulsing.forEach((object) => {
        const phase = Number(object.userData.phase || 0);
        const pulse = 1 + Math.sin(elapsed * 2.6 + phase) * 0.05;
        object.scale.set(pulse, pulse, pulse);
      });
      flowDots.forEach((object) => {
        const curve = object.userData.curve as THREE.Curve<THREE.Vector3> | undefined;
        if (!curve) return;
        const phase = Number(object.userData.phase || 0);
        object.position.copy(curve.getPointAt((elapsed * 0.16 + phase) % 1));
      });
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointercancel", handlePointerUp);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("wheel", handleWheel);
      disposeScene(scene);
      renderer.dispose();
      host.innerHTML = "";
    };
  }, [focusMode, resetNonce, sceneData]);

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
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain bg-[#030712] text-white custom-scrollbar"
      data-testid="universal-cinematic-3d"
      data-visualizer="codeverse-cinematic-3d"
      data-layout={isCompact ? "compact" : "wide"}
    >
      <div className={`z-10 shrink-0 border-b border-white/10 bg-[#050a12]/95 shadow-lg shadow-black/25 backdrop-blur-md ${isCompact ? "space-y-3 px-3 py-3" : "grid grid-cols-[minmax(0,1fr)_minmax(260px,330px)] gap-4 px-5 py-3"}`}>
        <section className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="cyan">Cinematic 3D</StatusPill>
            <StatusPill tone="emerald">Step {sceneData.step} / {sceneData.totalSteps}</StatusPill>
            <StatusPill tone="amber">{sceneData.family}</StatusPill>
          </div>
          <h2 className={`${isCompact ? "mt-2 text-sm leading-5" : "mt-2 text-lg leading-6"} break-words font-semibold text-white`}>
            {sceneData.headline}
          </h2>
          <p className={`${isCompact ? "mt-1 text-xs leading-5" : "mt-1 text-sm leading-6"} break-words text-slate-300`}>
            {sceneData.narrative}
          </p>
        </section>

        <section className="min-w-0 rounded-md border border-white/10 bg-white/[0.05] p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Active state</div>
          <div className="mt-2 min-w-0 break-words font-mono text-lg font-bold text-white">{primaryMetric(sceneData)}</div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <MiniMetric label="Items" value={String(sceneData.items.length)} tone="text-cyan-200" />
            <MiniMetric label="Progress" value={`${Math.round(sceneData.progress)}%`} tone="text-emerald-200" />
            <MiniMetric label="Focus" value={sceneData.profile.mode} tone="text-violet-200" />
          </div>
        </section>
      </div>

      <div className={`${isCompact ? "min-h-[340px] flex-[1_0_340px]" : "min-h-[clamp(420px,56vh,640px)] flex-[1_1_520px]"} relative overflow-hidden`}>
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
      </div>

      <div className={`z-10 shrink-0 border-t border-white/10 bg-[#050a12]/95 shadow-lg shadow-black/30 backdrop-blur-md ${isCompact ? "px-3 py-3" : "px-5 py-3"}`}>
        <div className={isCompact ? "space-y-3" : "grid grid-cols-[minmax(0,1fr)_260px_auto] items-center gap-4"}>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Decision</div>
            <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-100">{sceneData.decision}</p>
            <p className="mt-1 break-words text-xs leading-5 text-slate-400">{sceneData.invariant}</p>
          </div>
          <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>Trace progress</span>
              <span>{Math.round(sceneData.progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-emerald-300" style={{ width: `${sceneData.progress}%` }} />
            </div>
            <p className="mt-2 break-words text-xs leading-5 text-slate-400">
              {hoveredItem ? `Index ${hoveredItem.index}: ${hoveredItem.label}` : sceneData.profile.title}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setResetNonce((value) => value + 1)}
            className={`${isCompact ? "h-9 w-9" : "h-10 w-10"} inline-flex items-center justify-center rounded-md border border-white/10 bg-white/[0.08] text-slate-200 transition hover:bg-white/[0.15]`}
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

function buildScene(scene: THREE.Scene, stage: THREE.Group, data: SceneData, interactive: THREE.Object3D[], pulsing: THREE.Object3D[], flowDots: THREE.Object3D[]) {
  scene.add(new THREE.HemisphereLight(0xcdefff, 0x08111c, 1.55));
  const key = new THREE.DirectionalLight(0xffffff, 2.7);
  key.position.set(-4.5, 9, 6.5);
  key.castShadow = true;
  scene.add(key);
  const accent = new THREE.PointLight(data.profile.palette.primary, 4.8, 12);
  accent.position.set(-4.8, 3.4, 2.8);
  scene.add(accent);
  const answer = new THREE.PointLight(data.profile.palette.success, 4.2, 13);
  answer.position.set(4.5, 4.6, -1.4);
  scene.add(answer);

  const spacing = data.items.some((item) => item.interval) ? 1.86 : 1.48;
  const stageWidth = Math.max(10, (data.items.length - 1) * spacing + 3.3);
  const startX = -((data.items.length - 1) * spacing) / 2;
  const maxAbs = Math.max(1, ...data.items.map((item) => Math.abs(item.value)));
  const positions = data.items.map((_, index) => new THREE.Vector3(startX + index * spacing, 0, 0));
  addStage(stage, stageWidth, data.profile.palette);
  addWindow(stage, positions, data.window, data.profile.palette);

  data.items.forEach((item, index) => {
    const position = positions[index];
    const isPointer = data.pointers.some((pointer) => pointer.index === index);
    const isSolution = data.solution.has(index) || data.activeCells.has(index);
    const isRetired = data.retired.has(index);
    const tone = isSolution ? data.profile.palette.success : isRetired ? 0x334155 : item.value < 0 ? data.profile.palette.danger : isPointer ? data.profile.palette.primary : data.profile.palette.neutral;
    const height = item.interval ? 0.48 : 0.62 + (Math.abs(item.value) / maxAbs) * 2.85;
    const width = item.interval ? THREE.MathUtils.clamp((item.interval.end - item.interval.start) * 0.38 + 0.7, 0.8, 2.6) : 0.72;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, item.interval ? 0.82 : 0.72, 4, 1, 4),
      new THREE.MeshStandardMaterial({ color: tone, emissive: tone, emissiveIntensity: isPointer || isSolution ? 0.32 : 0.1, roughness: 0.46, metalness: 0.2, transparent: true, opacity: isRetired ? 0.38 : 0.94 })
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(position.x, height / 2 + 0.1, 0);
    mesh.userData = { index, label: item.label };
    stage.add(mesh);
    interactive.push(mesh);
    if (isPointer || isSolution) pulsing.push(mesh);

    const label = createTextSprite(item.label, { textColor: "#e5f9ff", background: "rgba(2,6,23,0.78)", border: `#${tone.toString(16).padStart(6, "0")}`, fontSize: 56 });
    label.position.set(position.x, 0.14, 0.72);
    label.scale.set(item.label.length > 5 ? 0.62 : 0.48, 0.2, 1);
    stage.add(label);
  });

  addPointers(stage, data, positions, pulsing);
  addFlow(stage, data, positions, pulsing, flowDots);
  addSceneBadge(stage, data);
}

function addStage(stage: THREE.Group, width: number, palette: Palette) {
  const base = new THREE.Mesh(new THREE.BoxGeometry(width, 0.18, 3.8), new THREE.MeshStandardMaterial({ color: 0x07111f, roughness: 0.65, metalness: 0.18 }));
  base.position.y = -0.05;
  base.receiveShadow = true;
  stage.add(base);
  const surface = new THREE.Mesh(new THREE.BoxGeometry(width - 0.8, 0.04, 3.15), new THREE.MeshBasicMaterial({ color: palette.primary, transparent: true, opacity: 0.08 }));
  surface.position.set(0, 0.06, 0);
  stage.add(surface);
  [-1.65, 1.65].forEach((z) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(width - 0.5, 0.025, 0.025), new THREE.MeshBasicMaterial({ color: palette.primary, transparent: true, opacity: 0.45 }));
    rail.position.set(0, 0.2, z);
    stage.add(rail);
  });
}

function addWindow(stage: THREE.Group, positions: THREE.Vector3[], windowState: SceneData["window"], palette: Palette) {
  if (!windowState || !positions[windowState.left] || !positions[windowState.right]) return;
  const left = positions[windowState.left].x;
  const right = positions[windowState.right].x;
  const width = Math.max(0.7, right - left + 1.3);
  const corridor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.035, 2.55), new THREE.MeshBasicMaterial({ color: palette.accent, transparent: true, opacity: 0.13 }));
  corridor.position.set((left + right) / 2, 0.24, 0);
  stage.add(corridor);
}

function addPointers(stage: THREE.Group, data: SceneData, positions: THREE.Vector3[], pulsing: THREE.Object3D[]) {
  data.pointers.forEach((pointer, order) => {
    const position = positions[pointer.index];
    if (!position) return;
    const color = pointerToneColors[pointer.tone || "cyan"] || data.profile.palette.primary;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 16, 96), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.82 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.set(position.x, 0.34 + order * 0.04, 0);
    ring.userData.phase = order * 0.6;
    stage.add(ring);
    pulsing.push(ring);

    const tag = createTextSprite(pointer.label.toUpperCase(), { textColor: "#ffffff", background: "rgba(2,6,23,0.78)", border: `#${color.toString(16).padStart(6, "0")}`, fontSize: 62 });
    tag.position.set(position.x, 3.7 + order * 0.36, -0.1);
    tag.scale.set(1.08, 0.35, 1);
    stage.add(tag);

    const line = cylinderBetween(new THREE.Vector3(position.x, 0.45, 0), new THREE.Vector3(position.x, 3.36 + order * 0.36, -0.08), 0.018, color, 0.62);
    stage.add(line);
  });
}

function addFlow(stage: THREE.Group, data: SceneData, positions: THREE.Vector3[], pulsing: THREE.Object3D[], flowDots: THREE.Object3D[]) {
  const indices = data.pointers.map((pointer) => pointer.index).filter((index) => positions[index]);
  if (indices.length < 2) return;
  const first = positions[Math.min(...indices)];
  const last = positions[Math.max(...indices)];
  const midpoint = (first.x + last.x) / 2;
  const lift = 4.2 + Math.min(1.7, Math.abs(last.x - first.x) * 0.18);
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(first.x, 2.3, -0.25),
    new THREE.Vector3(midpoint, lift, -0.55),
    new THREE.Vector3(last.x, 2.3, -0.25),
  ]);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.03, 14, false), new THREE.MeshBasicMaterial({ color: data.profile.palette.secondary, transparent: true, opacity: 0.75 }));
  tube.userData.phase = 1;
  stage.add(tube);
  pulsing.push(tube);
  for (let index = 0; index < 3; index += 1) {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 16), new THREE.MeshBasicMaterial({ color: data.profile.palette.accent, transparent: true, opacity: 0.86 }));
    dot.userData.curve = curve;
    dot.userData.phase = index / 3;
    stage.add(dot);
    flowDots.push(dot);
  }
}

function addSceneBadge(stage: THREE.Group, data: SceneData) {
  const badge = createTextSprite(data.profile.title, { textColor: "#fefce8", background: "rgba(2,6,23,0.82)", border: `#${data.profile.palette.accent.toString(16).padStart(6, "0")}`, fontSize: 56 });
  badge.position.set(0, 5.25, -1.45);
  badge.scale.set(2.4, 0.52, 1);
  stage.add(badge);
}

function buildSceneData(state: StateData): SceneData {
  const algorithm = getRecord(state.algorithm);
  const profileRecord = getRecord(state.cinematic3d);
  const values = getArray(state.values) || getArray(state.working_array) || [];
  const items = values.map(toSceneItem);
  const pointers = getPointers(state.pointers);
  const windowRecord = getRecord(state.window);
  const variables = getRecord(state.variables) || {};
  const profile = buildProfile(state, algorithm, profileRecord);
  const left = asNumber(windowRecord?.left);
  const right = asNumber(windowRecord?.right);

  return {
    algorithmTitle: asString(algorithm?.title) || "Algorithm",
    family: asString(algorithm?.family) || humanize(asString(state.kind) || "trace"),
    step: asNumber(state.step) ?? 1,
    totalSteps: asNumber(state.totalSteps) ?? 1,
    progress: asNumber(state.progress) ?? 0,
    headline: asString(state.headline) || asString(state.phase) || "Cinematic trace",
    narrative: asString(state.narrative) || asString(state.explanation) || "Watch the active data structure change with each decision.",
    decision: asString(state.decision) || "Apply the next rule while preserving the invariant.",
    invariant: asString(state.invariant) || "The highlighted state is the part of the problem still relevant to the answer.",
    items,
    pointers,
    retired: new Set(getNumberArray(state.retired)),
    solution: new Set(getNumberArray(state.solution)),
    activeCells: new Set(getNumberArray(state.activeCells)),
    window: typeof left === "number" && typeof right === "number" ? { left, right } : null,
    variables,
    profile,
  };
}

function buildProfile(state: StateData, algorithm: Record<string, StateValue> | null, profile: Record<string, StateValue> | null): SceneProfile {
  const paletteRecord = getRecord(profile?.palette);
  return {
    id: asString(profile?.id) || asString(algorithm?.id) || "cinematic",
    title: asString(profile?.title) || asString(algorithm?.title) || "Cinematic 3D",
    family: asString(profile?.family) || asString(algorithm?.family) || asString(state.kind) || "trace",
    mode: asString(profile?.mode) || humanize(asString(state.kind) || "trace"),
    palette: {
      primary: colorFrom(paletteRecord?.primary, DEFAULT_PALETTE.primary),
      secondary: colorFrom(paletteRecord?.secondary, DEFAULT_PALETTE.secondary),
      accent: colorFrom(paletteRecord?.accent, DEFAULT_PALETTE.accent),
      danger: colorFrom(paletteRecord?.danger, DEFAULT_PALETTE.danger),
      success: colorFrom(paletteRecord?.success, DEFAULT_PALETTE.success),
      neutral: colorFrom(paletteRecord?.neutral, DEFAULT_PALETTE.neutral),
    },
  };
}

function toSceneItem(value: StateValue, index: number): SceneItem {
  const label = typeof value === "string" ? value : String(asNumber(value) ?? value ?? index);
  const interval = parseInterval(label);
  const numeric = asNumber(value) ?? interval?.end ?? index + 1;
  return { raw: value, label, value: numeric, interval };
}

function parseInterval(label: string) {
  const match = label.match(/-?\d+(?:\.\d+)?/g);
  if (!match || match.length < 2) return undefined;
  const start = Number(match[0]);
  const end = Number(match[1]);
  return Number.isFinite(start) && Number.isFinite(end) ? { start, end } : undefined;
}

function primaryMetric(data: SceneData) {
  const interestingKeys = ["currentSum", "bestSum", "profit", "count", "candidate", "prefix", "maxProfit", "answer", "swap", "duplicate"];
  const match = interestingKeys.find((key) => data.variables[key] !== undefined);
  if (match) return `${match}: ${String(data.variables[match])}`;
  return data.pointers.length ? data.pointers.map((pointer) => `${pointer.label}:${pointer.index}`).join("  ") : data.profile.mode;
}

function createTextSprite(text: string, options: { textColor: string; background: string; border: string; fontSize: number }) {
  const canvas = document.createElement("canvas");
  const logicalWidth = 768;
  const logicalHeight = 256;
  const scale = 3;
  canvas.width = logicalWidth * scale;
  canvas.height = logicalHeight * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Sprite();
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, logicalWidth, logicalHeight);
  ctx.fillStyle = options.background;
  roundedRect(ctx, 34, 42, logicalWidth - 68, logicalHeight - 84, 34);
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = options.border;
  ctx.stroke();
  ctx.fillStyle = options.textColor;
  ctx.font = `850 ${options.fontSize}px Inter, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.slice(0, 24), logicalWidth / 2, logicalHeight / 2 + 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;
  return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, alphaTest: 0.01 }));
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function cylinderBetween(start: THREE.Vector3, end: THREE.Vector3, radius: number, color: number, opacity: number) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, Math.max(length, 0.001), 20), new THREE.MeshBasicMaterial({ color, transparent: true, opacity }));
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function disposeScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) material.forEach(disposeMaterial);
    else disposeMaterial(material);
  });
}

function disposeMaterial(material?: THREE.Material | THREE.Material[]) {
  if (!material || Array.isArray(material)) return;
  const mat = material as THREE.Material & { map?: THREE.Texture };
  mat.map?.dispose();
  material.dispose();
}

function StatusPill({ children, tone }: { children: ReactNode; tone: "cyan" | "emerald" | "amber" }) {
  const className = tone === "cyan" ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100" : tone === "emerald" ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : "border-amber-300/30 bg-amber-300/10 text-amber-100";
  return <span className={`rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${className}`}>{children}</span>;
}

function MiniMetric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-2">
      <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className={`mt-1 truncate font-mono text-sm font-bold ${tone}`}>{value}</div>
    </div>
  );
}

function getPointers(value: StateValue | undefined) {
  const array = getArray(value);
  if (!array) return [];
  return array
    .map((item) => {
      const record = getRecord(item);
      const label = asString(record?.label);
      const index = asNumber(record?.index);
      if (!label || typeof index !== "number") return null;
      return { label, index, tone: asString(record?.tone) || undefined };
    })
    .filter(Boolean) as PointerState[];
}

function colorFrom(value: StateValue | undefined, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().replace("#", "0x");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getNumberArray(value: StateValue | undefined) {
  const array = getArray(value);
  if (!array) return [];
  return array.map((item) => asNumber(item)).filter((item): item is number => typeof item === "number");
}

function getArray(value: StateValue | undefined): StateValue[] | null {
  return Array.isArray(value) ? value : null;
}

function getRecord(value: StateValue | undefined): Record<string, StateValue> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, StateValue>) : null;
}

function asString(value: StateValue | undefined) {
  return typeof value === "string" ? value : "";
}

function asNumber(value: StateValue | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function humanize(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}