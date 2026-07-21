"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Maximize2, RotateCcw } from "lucide-react";
import * as THREE from "three";
import type { StateData, StateValue } from "./AutoVisualizer";
import { twoSumCinematic3DPreset } from "./cinematic3dPresets";

type PointerState = { label: string; index: number; tone?: string };
type HoveredTower = { index: number; value: number; role: string };
type SceneData = {
  values: number[];
  target: number;
  currentSum: number;
  step: number;
  totalSteps: number;
  progress: number;
  headline: string;
  narrative: string;
  decision: string;
  invariant: string;
  lesson: string;
  comparison: string;
  pointers: PointerState[];
  retired: Set<number>;
  solution: Set<number>;
  leftIndex: number;
  rightIndex: number;
};

const scenePreset = twoSumCinematic3DPreset;
const visualizerName = scenePreset.visualizer;
const pointerColors = scenePreset.colors.pointers as Record<string, number>;
const comparisonColors = scenePreset.colors.comparison as Record<string, number>;

export default function TwoSumCinematic3D({
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
  const [hoveredTower, setHoveredTower] = useState<HoveredTower | null>(null);
  const [resetNonce, setResetNonce] = useState(0);
  const [isCompact, setIsCompact] = useState(false);
  const sceneData = useMemo(() => buildSceneData(state), [state]);
  const leftValue = sceneData.values[sceneData.leftIndex] ?? 0;
  const rightValue = sceneData.values[sceneData.rightIndex] ?? 0;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateLayout = () => {
      const rect = container.getBoundingClientRect();
      const nextCompact = rect.width < scenePreset.layout.compactWidth;
      setIsCompact((current) => (current === nextCompact ? current : nextCompact));
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    host.innerHTML = "";
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, scenePreset.renderer.maxPixelRatio));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = scenePreset.renderer.toneMappingExposure;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.dataset.testid = scenePreset.rendererTestId;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.width = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(scenePreset.scene.background);
    scene.fog = new THREE.Fog(scenePreset.scene.fog.color, scenePreset.scene.fog.near, scenePreset.scene.fog.far);

    const camera = new THREE.PerspectiveCamera(scenePreset.camera.fov.wide, 1, 0.1, 100);
    const lookAt = new THREE.Vector3(scenePreset.camera.lookAt[0], scenePreset.camera.lookAt[1], scenePreset.camera.lookAt[2]);
    const baseRadius: number = sceneData.values.length > 6 ? scenePreset.camera.radius.dense : scenePreset.camera.radius.default;
    const controls: { theta: number; elevation: number; radius: number } = {
      theta: scenePreset.camera.theta,
      elevation: scenePreset.camera.elevation,
      radius: baseRadius,
    };
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const towerMeshes: THREE.Object3D[] = [];
    const pulseMeshes: THREE.Object3D[] = [];
    const flowDots: THREE.Object3D[] = [];
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    buildThreeScene(scene, stageGroup, sceneData, towerMeshes, pulseMeshes, flowDots);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = width < 520 ? scenePreset.camera.fov.compact : width < 760 ? scenePreset.camera.fov.medium : scenePreset.camera.fov.wide;
      controls.radius = Math.max(controls.radius, width < 520 ? baseRadius + scenePreset.camera.radius.compactBoost : width < 760 ? baseRadius + scenePreset.camera.radius.mediumBoost : baseRadius);
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const updateCamera = () => {
      camera.position.set(
        Math.sin(controls.theta) * controls.radius,
        controls.elevation,
        Math.cos(controls.theta) * controls.radius
      );
      camera.lookAt(lookAt);
    };

    const handlePointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const handlePointerUp = (event: PointerEvent) => {
      dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (dragging) {
        controls.theta -= (event.clientX - lastX) * 0.005;
        controls.elevation = THREE.MathUtils.clamp(controls.elevation + (event.clientY - lastY) * 0.015, scenePreset.camera.elevationRange[0], scenePreset.camera.elevationRange[1]);
        lastX = event.clientX;
        lastY = event.clientY;
        return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(towerMeshes, false)[0]?.object;
      if (!hit) {
        setHoveredTower(null);
        return;
      }
      setHoveredTower({
        index: Number(hit.userData.index),
        value: Number(hit.userData.value),
        role: String(hit.userData.role || "candidate"),
      });
    };

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      controls.radius = THREE.MathUtils.clamp(controls.radius + event.deltaY * 0.01, scenePreset.camera.radius.min, scenePreset.camera.radius.max);
    };

    const handlePointerLeave = () => setHoveredTower(null);

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointercancel", handlePointerUp);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    renderer.domElement.addEventListener("wheel", handleWheel, { passive: false });

    const timer = new THREE.Timer();
    timer.connect(document);
    let frame = 0;
    const animate = () => {
      timer.update();
      const elapsed = timer.getElapsed();
      updateCamera();

      for (const object of pulseMeshes) {
        const phase = Number(object.userData.phase || 0);
        const pulse = 1 + Math.sin(elapsed * 2.7 + phase) * 0.055;
        object.scale.set(pulse, pulse, pulse);
      }

      for (const object of flowDots) {
        const curve = object.userData.curve as THREE.Curve<THREE.Vector3> | undefined;
        if (!curve) continue;
        const phase = Number(object.userData.phase || 0);
        const progress = THREE.MathUtils.euclideanModulo(elapsed * 0.18 + phase, 1);
        curve.getPointAt(progress, object.position);
        object.scale.setScalar(0.85 + Math.sin(elapsed * 4 + phase * 8) * 0.12);
      }

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      timer.dispose();
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointercancel", handlePointerUp);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.removeEventListener("wheel", handleWheel);
      disposeScene(scene);
      renderer.dispose();
      host.innerHTML = "";
    };
  }, [sceneData, resetNonce]);

  if (focusMode) {
    return (
      <div
        ref={containerRef}
        className="grid h-full min-h-0 grid-rows-[auto_minmax(260px,1fr)] overflow-hidden bg-[#030712] text-white lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:grid-rows-1"
        data-testid="two-sum-cinematic-3d-focus"
        data-visualizer={visualizerName}
        data-layout="focus"
      >
        <aside className="z-10 max-h-[38vh] overflow-y-auto border-b border-white/10 bg-[#071019] px-4 py-4 shadow-2xl shadow-black/30 custom-scrollbar sm:px-5 lg:max-h-none lg:border-b-0 lg:border-r lg:px-6 lg:py-6">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
            <span className="rounded-md bg-cyan-300/15 px-2 py-1 text-cyan-100">Two pointers</span>
            <span className="rounded-md bg-emerald-300/15 px-2 py-1 text-emerald-100">Step {sceneData.step} / {sceneData.totalSteps}</span>
          </div>
          <h2 className="mt-3 text-lg font-bold leading-7 text-white">{sceneData.headline}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-200">{sceneData.narrative}</p>
          <div className="mt-4 rounded-lg border border-amber-300/15 bg-amber-300/[0.07] p-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-200">Current decision</div>
            <p className="mt-1 text-sm font-semibold leading-6 text-amber-50">{sceneData.decision}</p>
          </div>
        </aside>
        <div className="relative min-h-0 overflow-hidden">
          <div ref={mountRef} className="absolute inset-0" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain bg-[#030712] text-white custom-scrollbar"
      data-testid="two-sum-cinematic-3d"
      data-visualizer={visualizerName}
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
            <StatusPill tone="emerald">Step {sceneData.step} / {sceneData.totalSteps}</StatusPill>
            <StatusPill tone={comparisonPillTone(sceneData.comparison)}>{comparisonLabel(sceneData.comparison)}</StatusPill>
          </div>
          <h2 className={`${isCompact ? "mt-2 text-sm leading-5" : "mt-2 text-lg leading-6"} break-words font-semibold text-white`}>
            {sceneData.headline}
          </h2>
          <p className={`${isCompact ? "mt-1 text-xs leading-5" : "mt-1 text-sm leading-6"} break-words text-slate-300`}>
            {sceneData.narrative}
          </p>
        </section>

        <section className="min-w-0 rounded-md border border-white/10 bg-white/[0.05] p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Active comparison</div>
          <div className="mt-2 flex min-w-0 items-end justify-between gap-3">
            <div className="min-w-0 break-words font-mono text-lg font-bold text-white">{leftValue} + {rightValue}</div>
            <div className={`shrink-0 font-mono text-lg font-bold ${comparisonTextClass(sceneData.comparison)}`}>{sceneData.currentSum}</div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <MiniMetric label="Target" value={String(sceneData.target)} tone="text-amber-200" />
            <MiniMetric label="Left" value={`${sceneData.leftIndex}:${leftValue}`} tone="text-cyan-200" />
            <MiniMetric label="Right" value={`${sceneData.rightIndex}:${rightValue}`} tone="text-violet-200" />
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
              <div className={`h-full rounded-full ${progressClass(sceneData.comparison)}`} style={{ width: `${sceneData.progress}%` }} />
            </div>
            <p className="mt-2 break-words text-xs leading-5 text-slate-400">
              {hoveredTower ? `Index ${hoveredTower.index}: value ${hoveredTower.value} is ${hoveredTower.role}.` : sceneData.lesson}
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

function buildSceneData(state: StateData): SceneData {
  const values = getNumberArray(state.values);
  const variables = getRecord(state.variables);
  const cinematic = getRecord(state.cinematic);
  const pointers = getPointers(state.pointers);
  const leftPointer = pointers.find((pointer) => pointer.label.toLowerCase().includes("left"));
  const rightPointer = pointers.find((pointer) => pointer.label.toLowerCase().includes("right"));
  const windowState = getRecord(state.window);
  const leftIndex = leftPointer?.index ?? asNumber(windowState?.left) ?? 0;
  const rightIndex = rightPointer?.index ?? asNumber(windowState?.right) ?? Math.max(values.length - 1, 0);

  return {
    values,
    target: asNumber(state.target) ?? asNumber(variables?.target) ?? 17,
    currentSum: asNumber(cinematic?.sum) ?? asNumber(variables?.currentSum) ?? (values[leftIndex] || 0) + (values[rightIndex] || 0),
    step: asNumber(state.step) ?? 1,
    totalSteps: asNumber(state.totalSteps) ?? 1,
    progress: asNumber(state.progress) ?? 0,
    headline: asString(state.headline) || "Two Sum 3D simulation",
    narrative: asString(state.narrative) || "",
    decision: asString(state.decision) || "Compare the active pair with the target.",
    invariant: asString(state.invariant) || "The answer remains inside the active search corridor.",
    lesson: asString(cinematic?.lesson) || "The highlighted corridor is the only search space still alive.",
    comparison: asString(cinematic?.comparison) || "compare",
    pointers,
    retired: new Set(getNumberArray(state.retired)),
    solution: new Set(getNumberArray(state.solution)),
    leftIndex,
    rightIndex,
  };
}

function buildThreeScene(
  scene: THREE.Scene,
  stageGroup: THREE.Group,
  data: SceneData,
  towerMeshes: THREE.Object3D[],
  pulseMeshes: THREE.Object3D[],
  flowDots: THREE.Object3D[]
) {
  scene.add(new THREE.HemisphereLight(scenePreset.lights.hemisphere.sky, scenePreset.lights.hemisphere.ground, scenePreset.lights.hemisphere.intensity));
  const keyLight = new THREE.DirectionalLight(scenePreset.lights.key.color, scenePreset.lights.key.intensity);
  keyLight.position.set(scenePreset.lights.key.position[0], scenePreset.lights.key.position[1], scenePreset.lights.key.position[2]);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  scene.add(keyLight);

  const leftGlow = new THREE.PointLight(scenePreset.lights.accents.left.color, scenePreset.lights.accents.left.intensity, scenePreset.lights.accents.left.distance);
  leftGlow.position.set(scenePreset.lights.accents.left.position[0], scenePreset.lights.accents.left.position[1], scenePreset.lights.accents.left.position[2]);
  scene.add(leftGlow);
  const rightGlow = new THREE.PointLight(scenePreset.lights.accents.right.color, scenePreset.lights.accents.right.intensity, scenePreset.lights.accents.right.distance);
  rightGlow.position.set(scenePreset.lights.accents.right.position[0], scenePreset.lights.accents.right.position[1], scenePreset.lights.accents.right.position[2]);
  scene.add(rightGlow);
  const answerGlow = new THREE.PointLight(data.comparison === "match" ? colorForComparison("match") : colorForComparison("compare"), data.comparison === "match" ? scenePreset.lights.accents.answer.matchIntensity : scenePreset.lights.accents.answer.defaultIntensity, scenePreset.lights.accents.answer.distance);
  answerGlow.position.set(scenePreset.lights.accents.answer.position[0], scenePreset.lights.accents.answer.position[1], scenePreset.lights.accents.answer.position[2]);
  scene.add(answerGlow);

  const spacing = scenePreset.stage.spacing;
  const stageWidth = Math.max(scenePreset.stage.minWidth, (data.values.length - 1) * spacing + scenePreset.stage.widthPadding);
  const startX = -((data.values.length - 1) * spacing) / 2;
  const maxValue = Math.max(1, data.target, ...data.values);
  const heights = data.values.map((value) => scenePreset.towers.minHeight + (value / maxValue) * scenePreset.towers.heightScale);
  const positions = data.values.map((_, index) => new THREE.Vector3(startX + index * spacing, 0, 0));
  const pointerByIndex = new Map(data.pointers.map((pointer) => [pointer.index, pointer]));

  addStage(stageGroup, stageWidth);
  addSearchCorridor(stageGroup, positions, data.leftIndex, data.rightIndex);

  data.values.forEach((value, index) => {
    const pointer = pointerByIndex.get(index);
    const role = roleForIndex(index, data, pointer);
    const tone = toneForIndex(index, data, pointer);
    const height = heights[index];
    const x = positions[index].x;
    const active = Boolean(pointer);
    const solution = data.solution.has(index);
    const retired = data.retired.has(index) && !solution;

    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(scenePreset.towers.topRadius, scenePreset.towers.bottomRadius, height, scenePreset.towers.segments, 1),
      new THREE.MeshPhysicalMaterial({
        color: tone.color,
        emissive: tone.emissive,
        emissiveIntensity: tone.emissiveIntensity,
        metalness: 0.26,
        roughness: 0.34,
        clearcoat: 0.45,
        clearcoatRoughness: 0.32,
        transparent: true,
        opacity: retired ? 0.3 : active || solution ? 0.98 : 0.78,
      })
    );
    tower.position.set(x, height / 2 + scenePreset.towers.baseYOffset, 0);
    tower.castShadow = true;
    tower.receiveShadow = true;
    tower.userData = { index, value, role };
    stageGroup.add(tower);
    towerMeshes.push(tower);

    const topCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.43, 0.13, 48),
      new THREE.MeshStandardMaterial({
        color: tone.cap,
        emissive: tone.emissive,
        emissiveIntensity: tone.emissiveIntensity + (active ? 0.18 : 0.04),
        metalness: 0.38,
        roughness: 0.2,
        transparent: true,
        opacity: retired ? 0.36 : 0.92,
      })
    );
    topCap.position.set(x, height + 0.19, 0);
    topCap.castShadow = true;
    stageGroup.add(topCap);

    addBaseValue(stageGroup, value, index, x, retired, active || solution);
    if (retired) addRetiredShade(stageGroup, x);
    if (pointer) addPointerFocus(stageGroup, pointer, value, x, height, pulseMeshes);
    if (solution) addSolutionHalo(stageGroup, x, height, pulseMeshes);
  });

  addTargetBadge(stageGroup, data);
  addPairBridge(stageGroup, data, positions, heights, pulseMeshes, flowDots);
}

function addStage(stageGroup: THREE.Group, width: number) {
  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(width, scenePreset.stage.platformHeight, scenePreset.stage.depth),
    new THREE.MeshStandardMaterial({ color: 0x07111d, metalness: 0.22, roughness: 0.82 })
  );
  platform.receiveShadow = true;
  stageGroup.add(platform);

  const surface = new THREE.Mesh(
    new THREE.PlaneGeometry(width - scenePreset.stage.surfaceInset, scenePreset.stage.surfaceDepth),
    new THREE.MeshBasicMaterial({ color: 0x0f1b2a, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
  );
  surface.rotation.x = -Math.PI / 2;
  surface.position.y = 0.095;
  stageGroup.add(surface);

  stageGroup.add(
    cylinderBetween(new THREE.Vector3(-width / 2 + 0.35, 0.16, scenePreset.stage.railZ), new THREE.Vector3(width / 2 - 0.35, 0.16, scenePreset.stage.railZ), 0.025, 0x38bdf8, 0.22),
    cylinderBetween(new THREE.Vector3(-width / 2 + 0.35, 0.16, -scenePreset.stage.railZ), new THREE.Vector3(width / 2 - 0.35, 0.16, -scenePreset.stage.railZ), 0.025, 0xa78bfa, 0.2)
  );
}

function addSearchCorridor(stageGroup: THREE.Group, positions: THREE.Vector3[], leftIndex: number, rightIndex: number) {
  const left = positions[Math.max(0, Math.min(leftIndex, positions.length - 1))]?.x ?? 0;
  const right = positions[Math.max(0, Math.min(rightIndex, positions.length - 1))]?.x ?? 0;
  const width = Math.max(1.2, Math.abs(right - left) + 1.35);
  const center = (left + right) / 2;
  const band = new THREE.Mesh(
    new THREE.PlaneGeometry(width, 2.7),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
  );
  band.rotation.x = -Math.PI / 2;
  band.position.set(center, 0.125, 0);
  stageGroup.add(band);
  stageGroup.add(cylinderBetween(new THREE.Vector3(center - width / 2, 0.18, -1.34), new THREE.Vector3(center + width / 2, 0.18, -1.34), 0.02, 0xfbbf24, 0.42));
}

function addBaseValue(stageGroup: THREE.Group, value: number, index: number, x: number, retired: boolean, featured: boolean) {
  const label = createTextSprite(String(value), {
    textColor: retired ? "#64748b" : featured ? "#ffffff" : "#cbd5e1",
    background: featured ? "rgba(8,47,73,0.82)" : "rgba(2,6,23,0.58)",
    border: featured ? "#67e8f9" : "rgba(148,163,184,0.36)",
    fontSize: scenePreset.labels.baseValue.fontSize,
  });
  label.position.set(x, 0.38, 1.42);
  const labelScale = featured ? scenePreset.labels.baseValue.featuredScale : scenePreset.labels.baseValue.defaultScale;
  label.scale.set(labelScale[0], labelScale[1], labelScale[2]);
  stageGroup.add(label);

  const tick = createTextSprite(`i${index}`, {
    textColor: retired ? "#475569" : "#94a3b8",
    background: "rgba(2,6,23,0.35)",
    border: "rgba(148,163,184,0.2)",
    fontSize: scenePreset.labels.indexTick.fontSize,
  });
  tick.position.set(x, 0.25, 1.78);
  tick.scale.set(scenePreset.labels.indexTick.scale[0], scenePreset.labels.indexTick.scale[1], scenePreset.labels.indexTick.scale[2]);
  stageGroup.add(tick);
}

function addRetiredShade(stageGroup: THREE.Group, x: number) {
  const shade = new THREE.Mesh(
    new THREE.PlaneGeometry(1.08, 2.86),
    new THREE.MeshBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.1, side: THREE.DoubleSide })
  );
  shade.rotation.x = -Math.PI / 2;
  shade.position.set(x, 0.14, 0);
  stageGroup.add(shade);
}

function addPointerFocus(stageGroup: THREE.Group, pointer: PointerState, value: number, x: number, towerHeight: number, pulseMeshes: THREE.Object3D[]) {
  const color = pointerColors[pointer.tone || "cyan"] || 0x22d3ee;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.035, 16, 96), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }));
  ring.rotation.x = Math.PI / 2;
  ring.position.set(x, 0.2, 0);
  ring.userData.phase = pointer.index * 0.7;
  stageGroup.add(ring);
  pulseMeshes.push(ring);

  stageGroup.add(cylinderBetween(new THREE.Vector3(x, 0.24, 0), new THREE.Vector3(x, towerHeight + 0.52, 0), 0.018, color, 0.28));
  const tag = createTextSprite(`${pointer.label.toUpperCase()}  ${value}`, {
    textColor: "#ffffff",
    background: "rgba(2,6,23,0.82)",
    border: `#${color.toString(16).padStart(6, "0")}`,
    fontSize: scenePreset.labels.pointerTag.fontSize,
  });
  tag.position.set(x, towerHeight + 0.92, -0.08);
  tag.scale.set(scenePreset.labels.pointerTag.scale[0], scenePreset.labels.pointerTag.scale[1], scenePreset.labels.pointerTag.scale[2]);
  stageGroup.add(tag);
}

function addSolutionHalo(stageGroup: THREE.Group, x: number, towerHeight: number, pulseMeshes: THREE.Object3D[]) {
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.036, 16, 96), new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.72 }));
  halo.rotation.x = Math.PI / 2;
  halo.position.set(x, towerHeight + 0.38, 0);
  halo.userData.phase = 0.3;
  stageGroup.add(halo);
  pulseMeshes.push(halo);
}

function addTargetBadge(stageGroup: THREE.Group, data: SceneData) {
  const badge = createTextSprite(`TARGET ${data.target}`, { textColor: "#fef3c7", background: "rgba(69,26,3,0.72)", border: "#fbbf24", fontSize: scenePreset.labels.targetBadge.fontSize });
  badge.position.set(0, 4.9, -1.45);
  badge.scale.set(scenePreset.labels.targetBadge.scale[0], scenePreset.labels.targetBadge.scale[1], scenePreset.labels.targetBadge.scale[2]);
  stageGroup.add(badge);
}

function addPairBridge(
  stageGroup: THREE.Group,
  data: SceneData,
  positions: THREE.Vector3[],
  heights: number[],
  pulseMeshes: THREE.Object3D[],
  flowDots: THREE.Object3D[]
) {
  const left = positions[data.leftIndex];
  const right = positions[data.rightIndex];
  if (!left || !right) return;

  const bridgeColor = colorForComparison(data.comparison);
  const start = new THREE.Vector3(left.x, heights[data.leftIndex] + 0.52, 0);
  const end = new THREE.Vector3(right.x, heights[data.rightIndex] + 0.52, 0);
  const midpointX = (start.x + end.x) / 2;
  const arcLift = Math.max(start.y, end.y) + Math.max(0.7, Math.abs(end.x - start.x) * 0.16);
  const curve = new THREE.CatmullRomCurve3([start, new THREE.Vector3(midpointX, arcLift, -0.42), end]);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.035, 14, false), new THREE.MeshBasicMaterial({ color: bridgeColor, transparent: true, opacity: 0.82 }));
  tube.userData.phase = 1.2;
  stageGroup.add(tube);
  pulseMeshes.push(tube);

  for (let index = 0; index < 3; index += 1) {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.095, 24, 16), new THREE.MeshBasicMaterial({ color: bridgeColor, transparent: true, opacity: 0.85 }));
    dot.userData.curve = curve;
    dot.userData.phase = index / 3;
    stageGroup.add(dot);
    flowDots.push(dot);
  }

  const equation = createTextSprite(`${data.values[data.leftIndex]} + ${data.values[data.rightIndex]} = ${data.currentSum}`, {
    textColor: "#ffffff",
    background: data.comparison === "match" ? "rgba(6,78,59,0.86)" : "rgba(2,6,23,0.82)",
    border: `#${bridgeColor.toString(16).padStart(6, "0")}`,
    fontSize: scenePreset.labels.equation.fontSize,
  });
  equation.position.set(midpointX, arcLift + 0.48, -0.42);
  equation.scale.set(scenePreset.labels.equation.scale[0], scenePreset.labels.equation.scale[1], scenePreset.labels.equation.scale[2]);
  stageGroup.add(equation);

  if (data.comparison === "match") {
    const solutionSpan = new THREE.Mesh(
      new THREE.TorusGeometry(Math.max(0.84, Math.abs(end.x - start.x) / 2 + 0.42), 0.032, 16, 128),
      new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.48 })
    );
    solutionSpan.rotation.x = Math.PI / 2;
    solutionSpan.position.set(midpointX, 0.24, 0);
    solutionSpan.userData.phase = 0.8;
    stageGroup.add(solutionSpan);
    pulseMeshes.push(solutionSpan);
  }
}

function roleForIndex(index: number, data: SceneData, pointer?: PointerState) {
  if (data.solution.has(index)) return "part of the answer";
  if (pointer) return `${pointer.label} pointer`;
  if (data.retired.has(index)) return "already eliminated";
  if (index >= data.leftIndex && index <= data.rightIndex) return "still possible";
  return "outside the active corridor";
}

function toneForIndex(index: number, data: SceneData, pointer?: PointerState) {
  if (data.solution.has(index)) return scenePreset.colors.towers.solution;
  if (pointer) {
    const color = pointerColors[pointer.tone || "cyan"] || 0x22d3ee;
    return { color, cap: color, emissive: color, emissiveIntensity: 0.5 };
  }
  if (data.retired.has(index)) return scenePreset.colors.towers.retired;
  return scenePreset.colors.towers.default;
}

function colorForComparison(comparison: string) {
  return comparisonColors[comparison] ?? comparisonColors.compare;
}

function cylinderBetween(start: THREE.Vector3, end: THREE.Vector3, radius: number, color: number, opacity: number) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(radius, radius, Math.max(length, 0.001), 24);
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function createTextSprite(text: string, options: { textColor: string; background: string; border: string; fontSize: number }) {
  const canvas = document.createElement("canvas");
  const logicalWidth = 768;
  const logicalHeight = 256;
  const textureScale = scenePreset.labels.textureScale;
  canvas.width = logicalWidth * textureScale;
  canvas.height = logicalHeight * textureScale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Sprite();

  ctx.scale(textureScale, textureScale);
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
  ctx.fillText(text, logicalWidth / 2, logicalHeight / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    alphaTest: 0.01,
    toneMapped: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.renderOrder = 100;
  return sprite;
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

function StatusPill({ children, tone }: { children: ReactNode; tone: "cyan" | "emerald" | "rose" | "amber" | "slate" }) {
  const className =
    tone === "cyan"
      ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
      : tone === "emerald"
        ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
        : tone === "rose"
          ? "border-rose-300/30 bg-rose-300/10 text-rose-100"
          : tone === "amber"
            ? "border-amber-300/30 bg-amber-300/10 text-amber-100"
            : "border-slate-300/20 bg-slate-300/10 text-slate-100";
  return <span className={`rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${className}`}>{children}</span>;
}

function MiniMetric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-2">
      <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className={`mt-1 font-mono text-sm font-bold ${tone}`}>{value}</div>
    </div>
  );
}

function comparisonPillTone(comparison: string): "cyan" | "emerald" | "rose" | "amber" | "slate" {
  if (comparison === "match") return "emerald";
  if (comparison === "too-high") return "rose";
  if (comparison === "too-low") return "cyan";
  return "amber";
}

function comparisonLabel(comparison: string) {
  if (comparison === "match") return "match";
  if (comparison === "too-high") return "sum too high";
  if (comparison === "too-low") return "sum too low";
  return "compare";
}

function comparisonTextClass(comparison: string) {
  if (comparison === "match") return "text-emerald-200";
  if (comparison === "too-high") return "text-rose-200";
  if (comparison === "too-low") return "text-cyan-200";
  return "text-amber-200";
}

function progressClass(comparison: string) {
  if (comparison === "match") return "bg-emerald-300";
  if (comparison === "too-high") return "bg-rose-300";
  if (comparison === "too-low") return "bg-cyan-300";
  return "bg-amber-300";
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
