"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import * as THREE from "three";
import type { StateData, StateValue } from "./AutoVisualizer";

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

const visualizerName = "two-sum-cinematic-3d";
const pointerColors: Record<string, number> = {
  cyan: 0x22d3ee,
  violet: 0xa78bfa,
  emerald: 0x34d399,
  rose: 0xfb7185,
  amber: 0xfbbf24,
};

export default function TwoSumCinematic3D({
  state,
}: {
  state: StateData;
  previousState?: StateData | null;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredTower, setHoveredTower] = useState<HoveredTower | null>(null);
  const [resetNonce, setResetNonce] = useState(0);
  const sceneData = useMemo(() => buildSceneData(state), [state]);
  const leftValue = sceneData.values[sceneData.leftIndex] ?? 0;
  const rightValue = sceneData.values[sceneData.rightIndex] ?? 0;

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
    renderer.domElement.dataset.testid = "two-sum-cinematic-canvas";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.width = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.Fog(0x030712, 13, 25);

    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 100);
    const lookAt = new THREE.Vector3(0, 1.85, 0);
    const controls = { theta: 0.18, elevation: 4.55, radius: sceneData.values.length > 6 ? 13.4 : 12.2 };
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
        controls.elevation = THREE.MathUtils.clamp(controls.elevation + (event.clientY - lastY) * 0.015, 2.75, 6.7);
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
      event.preventDefault();
      controls.radius = THREE.MathUtils.clamp(controls.radius + event.deltaY * 0.01, 8.8, 17.5);
    };

    const handlePointerLeave = () => setHoveredTower(null);

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointercancel", handlePointerUp);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    renderer.domElement.addEventListener("wheel", handleWheel, { passive: false });

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      const elapsed = clock.getElapsedTime();
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
        object.position.copy(curve.getPointAt((elapsed * 0.18 + phase) % 1));
        object.scale.setScalar(0.85 + Math.sin(elapsed * 4 + phase * 8) * 0.12);
      }

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
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.removeEventListener("wheel", handleWheel);
      disposeScene(scene);
      renderer.dispose();
      host.innerHTML = "";
    };
  }, [sceneData, resetNonce]);

  return (
    <div className="relative h-full min-h-[520px] overflow-hidden bg-[#030712] text-white" data-testid="two-sum-cinematic-3d" data-visualizer={visualizerName}>
      <div ref={mountRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute left-3 right-3 top-3 z-10 flex flex-col gap-3 lg:left-4 lg:right-4 lg:top-4 lg:flex-row lg:items-start lg:justify-between">
        <section className="max-w-[520px] rounded-lg border border-white/10 bg-[#050a12]/[0.82] px-3.5 py-3 shadow-2xl shadow-black/35 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="cyan">Cinematic 3D</StatusPill>
            <StatusPill tone="emerald">Step {sceneData.step} / {sceneData.totalSteps}</StatusPill>
            <StatusPill tone={comparisonPillTone(sceneData.comparison)}>{comparisonLabel(sceneData.comparison)}</StatusPill>
          </div>
          <h2 className="mt-2 text-base font-semibold leading-6 text-white sm:text-lg">{sceneData.headline}</h2>
          <p className="mt-1 max-w-[50rem] text-xs leading-5 text-slate-300 sm:text-sm">{sceneData.narrative}</p>
        </section>

        <section className="w-full rounded-lg border border-white/10 bg-[#050a12]/[0.82] p-3 shadow-2xl shadow-black/35 backdrop-blur-md sm:w-[330px]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Active comparison</div>
          <div className="mt-2 flex items-end justify-between gap-3">
            <div className="font-mono text-xl font-bold text-white">{leftValue} + {rightValue}</div>
            <div className={`font-mono text-xl font-bold ${comparisonTextClass(sceneData.comparison)}`}>{sceneData.currentSum}</div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <MiniMetric label="Target" value={String(sceneData.target)} tone="text-amber-200" />
            <MiniMetric label="Left" value={`${sceneData.leftIndex}:${leftValue}`} tone="text-cyan-200" />
            <MiniMetric label="Right" value={`${sceneData.rightIndex}:${rightValue}`} tone="text-violet-200" />
          </div>
        </section>
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 rounded-lg border border-white/10 bg-[#050a12]/[0.84] p-3 shadow-2xl shadow-black/40 backdrop-blur-md lg:inset-x-4 lg:bottom-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px_auto] lg:items-center">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Decision</div>
            <p className="mt-1 text-sm font-semibold leading-5 text-slate-100">{sceneData.decision}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{sceneData.invariant}</p>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>Trace progress</span>
              <span>{Math.round(sceneData.progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full ${progressClass(sceneData.comparison)}`} style={{ width: `${sceneData.progress}%` }} />
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              {hoveredTower ? `Index ${hoveredTower.index}: value ${hoveredTower.value} is ${hoveredTower.role}.` : sceneData.lesson}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setResetNonce((value) => value + 1)}
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.08] text-slate-200 transition hover:bg-white/[0.15]"
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
  scene.add(new THREE.HemisphereLight(0xcdefff, 0x08111c, 1.55));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
  keyLight.position.set(-4.5, 9, 6.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  scene.add(keyLight);

  const leftGlow = new THREE.PointLight(0x22d3ee, 5.5, 11);
  leftGlow.position.set(-5.4, 3.2, 2.8);
  scene.add(leftGlow);
  const rightGlow = new THREE.PointLight(0xa78bfa, 4.8, 11);
  rightGlow.position.set(5, 3.8, 2.2);
  scene.add(rightGlow);
  const answerGlow = new THREE.PointLight(data.comparison === "match" ? 0x34d399 : 0xfbbf24, data.comparison === "match" ? 7 : 3.2, 13);
  answerGlow.position.set(0, 4.8, -1.6);
  scene.add(answerGlow);

  const spacing = 1.72;
  const stageWidth = Math.max(10.4, (data.values.length - 1) * spacing + 3.4);
  const startX = -((data.values.length - 1) * spacing) / 2;
  const maxValue = Math.max(1, data.target, ...data.values);
  const heights = data.values.map((value) => 0.75 + (value / maxValue) * 3.35);
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
      new THREE.CylinderGeometry(0.42, 0.48, height, 48, 1),
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
    tower.position.set(x, height / 2 + 0.12, 0);
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
    new THREE.BoxGeometry(width, 0.18, 3.65),
    new THREE.MeshStandardMaterial({ color: 0x07111d, metalness: 0.22, roughness: 0.82 })
  );
  platform.receiveShadow = true;
  stageGroup.add(platform);

  const surface = new THREE.Mesh(
    new THREE.PlaneGeometry(width - 0.55, 3.18),
    new THREE.MeshBasicMaterial({ color: 0x0f1b2a, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
  );
  surface.rotation.x = -Math.PI / 2;
  surface.position.y = 0.095;
  stageGroup.add(surface);

  stageGroup.add(
    cylinderBetween(new THREE.Vector3(-width / 2 + 0.35, 0.16, 1.86), new THREE.Vector3(width / 2 - 0.35, 0.16, 1.86), 0.025, 0x38bdf8, 0.22),
    cylinderBetween(new THREE.Vector3(-width / 2 + 0.35, 0.16, -1.86), new THREE.Vector3(width / 2 - 0.35, 0.16, -1.86), 0.025, 0xa78bfa, 0.2)
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
    fontSize: 58,
  });
  label.position.set(x, 0.38, 1.42);
  label.scale.set(featured ? 0.62 : 0.48, featured ? 0.26 : 0.22, 1);
  stageGroup.add(label);

  const tick = createTextSprite(`i${index}`, {
    textColor: retired ? "#475569" : "#94a3b8",
    background: "rgba(2,6,23,0.35)",
    border: "rgba(148,163,184,0.2)",
    fontSize: 42,
  });
  tick.position.set(x, 0.25, 1.78);
  tick.scale.set(0.38, 0.16, 1);
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
    fontSize: 50,
  });
  tag.position.set(x, towerHeight + 0.92, -0.08);
  tag.scale.set(1.08, 0.34, 1);
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
  const badge = createTextSprite(`TARGET ${data.target}`, { textColor: "#fef3c7", background: "rgba(69,26,3,0.72)", border: "#fbbf24", fontSize: 50 });
  badge.position.set(0, 4.9, -1.45);
  badge.scale.set(1.28, 0.34, 1);
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
    fontSize: 54,
  });
  equation.position.set(midpointX, arcLift + 0.48, -0.42);
  equation.scale.set(1.52, 0.38, 1);
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
  if (data.solution.has(index)) return { color: 0x10b981, cap: 0x6ee7b7, emissive: 0x064e3b, emissiveIntensity: 0.88 };
  if (pointer) {
    const color = pointerColors[pointer.tone || "cyan"] || 0x22d3ee;
    return { color, cap: color, emissive: color, emissiveIntensity: 0.5 };
  }
  if (data.retired.has(index)) return { color: 0x273449, cap: 0x475569, emissive: 0x020617, emissiveIntensity: 0.06 };
  return { color: 0x1d4ed8, cap: 0x60a5fa, emissive: 0x082f49, emissiveIntensity: 0.18 };
}

function colorForComparison(comparison: string) {
  if (comparison === "match") return 0x34d399;
  if (comparison === "too-high") return 0xfb7185;
  if (comparison === "too-low") return 0x22d3ee;
  return 0xfbbf24;
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
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Sprite();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = options.background;
  roundedRect(ctx, 22, 31, canvas.width - 44, canvas.height - 62, 26);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = options.border;
  ctx.stroke();
  ctx.fillStyle = options.textColor;
  ctx.font = `800 ${options.fontSize}px Inter, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
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
