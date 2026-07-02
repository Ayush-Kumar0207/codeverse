"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import type { StateData, StateValue } from "./AutoVisualizer";

type PointerState = {
  label: string;
  index: number;
  tone?: string;
};

type HoveredTower = {
  index: number;
  value: number;
  role: string;
};

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
  cyan: 0x38d5ff,
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

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    host.innerHTML = "";
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.dataset.testid = "two-sum-cinematic-canvas";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.width = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.FogExp2(0x07111f, 0.035);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const lookAt = new THREE.Vector3(0, 1.75, 0);
    const controls = {
      theta: 0.35,
      elevation: 3.3,
      radius: sceneData.values.length > 6 ? 13.8 : 12.3,
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const towerMeshes: THREE.Object3D[] = [];
    const pulseMeshes: THREE.Object3D[] = [];
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    buildThreeScene(scene, stageGroup, sceneData, towerMeshes, pulseMeshes);

    let width = 1;
    let height = 1;
    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
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
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        controls.theta -= dx * 0.006;
        controls.elevation = THREE.MathUtils.clamp(controls.elevation + dy * 0.018, 2.1, 7.2);
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
      const index = Number(hit.userData.index);
      const value = Number(hit.userData.value);
      const role = String(hit.userData.role || "candidate");
      setHoveredTower({ index, value, role });
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      controls.radius = THREE.MathUtils.clamp(controls.radius + event.deltaY * 0.01, 8.4, 18);
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointercancel", handlePointerUp);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("wheel", handleWheel, { passive: false });

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      updateCamera();
      stageGroup.rotation.y = Math.sin(elapsed * 0.34) * 0.018;
      for (const object of pulseMeshes) {
        const base = 1 + Math.sin(elapsed * 3.2 + (object.userData.phase || 0)) * 0.06;
        object.scale.setScalar(base);
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
      renderer.domElement.removeEventListener("wheel", handleWheel);
      disposeScene(scene);
      renderer.dispose();
      host.innerHTML = "";
    };
  }, [sceneData, resetNonce]);

  return (
    <div
      className="relative h-full min-h-[520px] overflow-hidden bg-[#030712] text-white"
      data-testid="two-sum-cinematic-3d"
      data-visualizer={visualizerName}
    >
      <div ref={mountRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl rounded-lg border border-white/10 bg-black/45 p-3 shadow-2xl shadow-black/40 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
              Cinematic 3D
            </span>
            <span className="rounded-md border border-emerald-300/30 bg-emerald-300/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
              Step {sceneData.step} / {sceneData.totalSteps}
            </span>
          </div>
          <h2 className="mt-2 text-base font-semibold leading-6 text-white sm:text-lg">{sceneData.headline}</h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-300 sm:text-sm">{sceneData.narrative}</p>
        </div>

        <div className="grid min-w-[220px] grid-cols-2 gap-2 rounded-lg border border-white/10 bg-black/45 p-3 shadow-2xl shadow-black/40 backdrop-blur-md">
          <Metric label="Target" value={String(sceneData.target)} tone="text-amber-200" />
          <Metric label="Current Sum" value={String(sceneData.currentSum)} tone={comparisonTone(sceneData.comparison)} />
          <Metric label="Left" value={`${sceneData.leftIndex} -> ${sceneData.values[sceneData.leftIndex] ?? "-"}`} tone="text-cyan-200" />
          <Metric label="Right" value={`${sceneData.rightIndex} -> ${sceneData.values[sceneData.rightIndex] ?? "-"}`} tone="text-violet-200" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 grid gap-3 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-white/10 bg-black/50 p-3 shadow-2xl shadow-black/40 backdrop-blur-md">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Decision</p>
              <p className="mt-1 text-sm font-semibold leading-5 text-slate-100">{sceneData.decision}</p>
            </div>
            <div className="h-2 min-w-[160px] overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-amber-300 to-emerald-300" style={{ width: `${sceneData.progress}%` }} />
            </div>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-300">{sceneData.invariant}</p>
        </div>

        <div className="relative rounded-lg border border-white/10 bg-black/50 p-3 shadow-2xl shadow-black/40 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setResetNonce((value) => value + 1)}
            className="pointer-events-auto absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/10 text-slate-200 transition hover:bg-white/20"
            aria-label="Reset 3D camera"
            title="Reset 3D camera"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <p className="pr-10 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Scene lens</p>
          <p className="mt-1 pr-8 text-sm leading-5 text-slate-100">{sceneData.lesson}</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">Drag to orbit. Scroll to zoom. Hover a tower to inspect its role.</p>
          {hoveredTower ? (
            <div className="mt-2 rounded-md border border-white/10 bg-white/10 px-2.5 py-2 text-xs text-slate-200">
              Index {hoveredTower.index}: value {hoveredTower.value} is {hoveredTower.role}.
            </div>
          ) : null}
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
  const leftIndex = leftPointer?.index ?? asNumber(getRecord(state.window)?.left) ?? 0;
  const rightIndex = rightPointer?.index ?? asNumber(getRecord(state.window)?.right) ?? Math.max(values.length - 1, 0);

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
    invariant: asString(state.invariant) || "The answer remains between the two pointers.",
    lesson: asString(cinematic?.lesson) || "The scene shows which pairs are still possible.",
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
  pulseMeshes: THREE.Object3D[]
) {
  scene.add(new THREE.HemisphereLight(0xc7ecff, 0x0d1320, 1.4));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(-4, 8, 7);
  scene.add(keyLight);

  const cyanLight = new THREE.PointLight(0x22d3ee, 8, 12);
  cyanLight.position.set(-5, 3.5, -2.5);
  scene.add(cyanLight);

  const amberLight = new THREE.PointLight(0xf59e0b, 5, 12);
  amberLight.position.set(4, 3.8, 3);
  scene.add(amberLight);

  const solutionLight = new THREE.PointLight(0x34d399, data.comparison === "match" ? 10 : 3, 14);
  solutionLight.position.set(0, 4.2, -1.2);
  scene.add(solutionLight);

  const grid = new THREE.GridHelper(16, 16, 0x1f9bdb, 0x122033);
  grid.position.y = -0.03;
  grid.material.opacity = 0.28;
  grid.material.transparent = true;
  stageGroup.add(grid);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 9),
    new THREE.MeshStandardMaterial({
      color: 0x06111f,
      roughness: 0.95,
      metalness: 0.1,
      transparent: true,
      opacity: 0.76,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.055;
  stageGroup.add(floor);

  const spacing = 2.2;
  const startX = -((data.values.length - 1) * spacing) / 2;
  const heights = data.values.map((value) => Math.max(0.7, value / 3.3));
  const positions = data.values.map((_, index) => new THREE.Vector3(startX + index * spacing, 0, 0));
  const pointerByIndex = new Map(data.pointers.map((pointer) => [pointer.index, pointer]));

  addSearchCorridor(stageGroup, positions, data.leftIndex, data.rightIndex);
  addTargetGate(stageGroup, data, positions);

  data.values.forEach((value, index) => {
    const role = data.solution.has(index)
      ? "solution"
      : pointerByIndex.has(index)
        ? `${pointerByIndex.get(index)?.label || "pointer"} pointer`
        : data.retired.has(index)
          ? "retired"
          : "candidate";
    const tone = toneForIndex(index, data, pointerByIndex);
    const height = heights[index];
    const x = positions[index].x;
    const material = new THREE.MeshStandardMaterial({
      color: tone.color,
      emissive: tone.emissive,
      emissiveIntensity: tone.emissiveIntensity,
      metalness: 0.35,
      roughness: 0.28,
      transparent: true,
      opacity: data.retired.has(index) && !data.solution.has(index) ? 0.34 : 0.94,
    });
    const tower = new THREE.Mesh(new THREE.BoxGeometry(1.05, height, 1.05, 4, 12, 4), material);
    tower.position.set(x, height / 2, 0);
    tower.userData = { index, value, role };
    stageGroup.add(tower);
    towerMeshes.push(tower);

    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.62, 0.12, 40),
      new THREE.MeshStandardMaterial({
        color: tone.cap,
        emissive: tone.emissive,
        emissiveIntensity: tone.emissiveIntensity + 0.15,
        metalness: 0.5,
        roughness: 0.2,
        transparent: true,
        opacity: data.retired.has(index) && !data.solution.has(index) ? 0.45 : 0.98,
      })
    );
    cap.position.set(x, height + 0.08, 0);
    stageGroup.add(cap);

    const valueLabel = createTextSprite(String(value), {
      textColor: data.retired.has(index) && !data.solution.has(index) ? "#94a3b8" : "#f8fafc",
      background: data.solution.has(index) ? "rgba(16,185,129,0.95)" : "rgba(2,6,23,0.78)",
      border: data.solution.has(index) ? "#a7f3d0" : "#38bdf8",
      fontSize: 72,
    });
    valueLabel.position.set(x, height + 0.78, -0.1);
    valueLabel.scale.set(1.25, 0.62, 1);
    stageGroup.add(valueLabel);

    const indexLabel = createTextSprite(`i=${index}`, {
      textColor: "#cbd5e1",
      background: "rgba(15,23,42,0.72)",
      border: "rgba(148,163,184,0.65)",
      fontSize: 44,
    });
    indexLabel.position.set(x, 0.22, 1.05);
    indexLabel.scale.set(0.82, 0.34, 1);
    stageGroup.add(indexLabel);

    if (data.retired.has(index) && !data.solution.has(index)) {
      addRetiredTile(stageGroup, x);
    }

    const pointerState = pointerByIndex.get(index);
    if (pointerState) {
      addPointerBeacon(stageGroup, pointerState, x, height, pulseMeshes);
    }
  });

  addPairBridge(stageGroup, data, positions, heights, pulseMeshes);
  addEliminationWalls(stageGroup, data, positions);
}

function addSearchCorridor(stageGroup: THREE.Group, positions: THREE.Vector3[], leftIndex: number, rightIndex: number) {
  const left = positions[Math.max(0, Math.min(leftIndex, positions.length - 1))]?.x ?? 0;
  const right = positions[Math.max(0, Math.min(rightIndex, positions.length - 1))]?.x ?? 0;
  const width = Math.max(1.4, Math.abs(right - left) + 1.45);
  const center = (left + right) / 2;
  const corridor = new THREE.Mesh(
    new THREE.PlaneGeometry(width, 2.25),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.11, side: THREE.DoubleSide })
  );
  corridor.rotation.x = -Math.PI / 2;
  corridor.position.set(center, 0.01, 0);
  stageGroup.add(corridor);

  const leftRail = cylinderBetween(new THREE.Vector3(center - width / 2, 0.04, -1.12), new THREE.Vector3(center + width / 2, 0.04, -1.12), 0.018, 0xfbbf24, 0.42);
  const rightRail = cylinderBetween(new THREE.Vector3(center - width / 2, 0.04, 1.12), new THREE.Vector3(center + width / 2, 0.04, 1.12), 0.018, 0xfbbf24, 0.42);
  stageGroup.add(leftRail, rightRail);
}

function addTargetGate(stageGroup: THREE.Group, data: SceneData, positions: THREE.Vector3[]) {
  const first = positions[0]?.x ?? -5;
  const last = positions[positions.length - 1]?.x ?? 5;
  const gateY = 3.25;
  const leftPost = cylinderBetween(new THREE.Vector3(first - 0.85, 0.15, 1.65), new THREE.Vector3(first - 0.85, gateY, 1.65), 0.035, 0xf59e0b, 0.48);
  const rightPost = cylinderBetween(new THREE.Vector3(last + 0.85, 0.15, 1.65), new THREE.Vector3(last + 0.85, gateY, 1.65), 0.035, 0xf59e0b, 0.48);
  const topRail = cylinderBetween(new THREE.Vector3(first - 0.85, gateY, 1.65), new THREE.Vector3(last + 0.85, gateY, 1.65), 0.035, 0xf59e0b, 0.48);
  stageGroup.add(leftPost, rightPost, topRail);

  const label = createTextSprite(`TARGET ${data.target}`, {
    textColor: "#fef3c7",
    background: "rgba(120,53,15,0.72)",
    border: "#fbbf24",
    fontSize: 52,
  });
  label.position.set(0, gateY + 0.48, 1.65);
  label.scale.set(1.8, 0.5, 1);
  stageGroup.add(label);
}

function addRetiredTile(stageGroup: THREE.Group, x: number) {
  const tile = new THREE.Mesh(
    new THREE.PlaneGeometry(1.32, 2.8),
    new THREE.MeshBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.11, side: THREE.DoubleSide })
  );
  tile.rotation.x = -Math.PI / 2;
  tile.position.set(x, 0.025, 0);
  stageGroup.add(tile);

  const crossA = cylinderBetween(new THREE.Vector3(x - 0.48, 0.09, -0.65), new THREE.Vector3(x + 0.48, 0.09, 0.65), 0.02, 0xfb7185, 0.35);
  const crossB = cylinderBetween(new THREE.Vector3(x - 0.48, 0.09, 0.65), new THREE.Vector3(x + 0.48, 0.09, -0.65), 0.02, 0xfb7185, 0.35);
  stageGroup.add(crossA, crossB);
}

function addPointerBeacon(stageGroup: THREE.Group, pointer: PointerState, x: number, towerHeight: number, pulseMeshes: THREE.Object3D[]) {
  const color = pointerColors[pointer.tone || "cyan"] || 0x38d5ff;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.78, 0.035, 12, 80),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.86 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(x, towerHeight + 0.25, 0);
  ring.userData.phase = pointer.index * 0.6;
  stageGroup.add(ring);
  pulseMeshes.push(ring);

  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.26, 0.72, 36),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, metalness: 0.35, roughness: 0.2 })
  );
  cone.rotation.x = Math.PI;
  cone.position.set(x, towerHeight + 1.25, -0.72);
  stageGroup.add(cone);

  const label = createTextSprite(pointer.label.toUpperCase(), {
    textColor: "#ffffff",
    background: "rgba(2,6,23,0.82)",
    border: `#${color.toString(16).padStart(6, "0")}`,
    fontSize: 46,
  });
  label.position.set(x, towerHeight + 1.78, -0.72);
  label.scale.set(1, 0.34, 1);
  stageGroup.add(label);
}

function addPairBridge(
  stageGroup: THREE.Group,
  data: SceneData,
  positions: THREE.Vector3[],
  heights: number[],
  pulseMeshes: THREE.Object3D[]
) {
  const left = positions[data.leftIndex];
  const right = positions[data.rightIndex];
  if (!left || !right) return;

  const leftTop = new THREE.Vector3(left.x, heights[data.leftIndex] + 0.75, -0.08);
  const rightTop = new THREE.Vector3(right.x, heights[data.rightIndex] + 0.75, -0.08);
  const bridgeColor = data.comparison === "match" ? 0x34d399 : data.comparison === "too-high" ? 0xfb7185 : 0x38bdf8;
  const bridge = cylinderBetween(leftTop, rightTop, 0.045, bridgeColor, 0.78);
  bridge.userData.phase = 1.8;
  stageGroup.add(bridge);
  pulseMeshes.push(bridge);

  const mid = new THREE.Vector3().addVectors(leftTop, rightTop).multiplyScalar(0.5);
  const sumLabel = createTextSprite(`${data.values[data.leftIndex]} + ${data.values[data.rightIndex]} = ${data.currentSum}`, {
    textColor: "#ffffff",
    background: data.comparison === "match" ? "rgba(6,95,70,0.9)" : "rgba(15,23,42,0.88)",
    border: data.comparison === "match" ? "#86efac" : "#60a5fa",
    fontSize: 52,
  });
  sumLabel.position.set(mid.x, Math.max(leftTop.y, rightTop.y) + 0.75, -0.2);
  sumLabel.scale.set(1.85, 0.48, 1);
  stageGroup.add(sumLabel);

  if (data.comparison === "match") {
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(Math.max(0.95, Math.abs(right.x - left.x) / 2 + 0.85), 0.045, 16, 120),
      new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.48 })
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.set(mid.x, 0.22, 0);
    halo.userData.phase = 0.4;
    stageGroup.add(halo);
    pulseMeshes.push(halo);
  }
}

function addEliminationWalls(stageGroup: THREE.Group, data: SceneData, positions: THREE.Vector3[]) {
  const eliminated = Array.from(data.retired).filter((index) => !data.solution.has(index));
  eliminated.forEach((index) => {
    const x = positions[index]?.x;
    if (typeof x !== "number") return;
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(1.25, 2.35),
      new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
    );
    wall.position.set(x, 1.18, -1.02);
    stageGroup.add(wall);
  });
}

function toneForIndex(index: number, data: SceneData, pointerByIndex: Map<number, PointerState>) {
  if (data.solution.has(index)) {
    return { color: 0x10b981, cap: 0x6ee7b7, emissive: 0x065f46, emissiveIntensity: 0.82 };
  }
  const pointer = pointerByIndex.get(index);
  if (pointer) {
    const color = pointerColors[pointer.tone || "cyan"] || 0x38d5ff;
    return { color, cap: color, emissive: color, emissiveIntensity: 0.45 };
  }
  if (data.retired.has(index)) {
    return { color: 0x334155, cap: 0x64748b, emissive: 0x020617, emissiveIntensity: 0.08 };
  }
  return { color: 0x2563eb, cap: 0x60a5fa, emissive: 0x1d4ed8, emissiveIntensity: 0.18 };
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

function createTextSprite(
  text: string,
  options: {
    textColor: string;
    background: string;
    border: string;
    fontSize: number;
  }
) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Sprite();

  const radius = 30;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = options.background;
  roundedRect(ctx, 18, 24, canvas.width - 36, canvas.height - 48, radius);
  ctx.fill();
  ctx.lineWidth = 5;
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
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  return new THREE.Sprite(material);
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
    if (Array.isArray(material)) {
      material.forEach(disposeMaterial);
    } else {
      disposeMaterial(material);
    }
  });
}

function disposeMaterial(material?: THREE.Material | THREE.Material[]) {
  if (!material || Array.isArray(material)) return;
  const mat = material as THREE.Material & { map?: THREE.Texture };
  mat.map?.dispose();
  material.dispose();
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.06] px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className={`mt-1 font-mono text-sm font-bold ${tone}`}>{value}</div>
    </div>
  );
}

function comparisonTone(comparison: string) {
  if (comparison === "match") return "text-emerald-200";
  if (comparison === "too-high") return "text-rose-200";
  if (comparison === "too-low") return "text-cyan-200";
  return "text-slate-100";
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
