import * as THREE from "three";
import type {
  Cinematic3DEdge,
  Cinematic3DHover,
  Cinematic3DItem,
  Cinematic3DPalette,
  Cinematic3DSceneData,
} from "./cinematic3dTypes";

const CANVAS_TEST_ID = "universal-cinematic-canvas";
const BACKGROUND = 0x030712;
const pointerToneColors: Record<string, number> = {
  cyan: 0x22d3ee,
  violet: 0xa78bfa,
  emerald: 0x34d399,
  rose: 0xfb7185,
  amber: 0xfbbf24,
  blue: 0x60a5fa,
};

type AnimatedObject = THREE.Object3D & {
  userData: {
    phase?: number;
    curve?: THREE.Curve<THREE.Vector3>;
    index?: number;
    label?: string;
  };
};

type CameraControls = {
  theta: number;
  elevation: number;
  radius: number;
  target: THREE.Vector3;
};

export class Cinematic3DEngine {
  private readonly host: HTMLDivElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(40, 1, 0.1, 160);
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly timer = new THREE.Timer();
  private readonly controls: CameraControls = {
    theta: 0.16,
    elevation: 4.8,
    radius: 13,
    target: new THREE.Vector3(0, 1.4, 0),
  };
  private readonly defaultControls: CameraControls = {
    theta: 0.16,
    elevation: 4.8,
    radius: 13,
    target: new THREE.Vector3(0, 1.4, 0),
  };
  private readonly resizeObserver: ResizeObserver;
  private readonly intersectionObserver: IntersectionObserver | null;
  private readonly reducedMotion: boolean;
  private readonly onHover: (item: Cinematic3DHover | null) => void;
  private readonly focusMode: boolean;
  private readonly keyLight = new THREE.DirectionalLight(0xffffff, 3.35);
  private readonly primaryLight = new THREE.PointLight(0x22d3ee, 5.8, 22);
  private readonly successLight = new THREE.PointLight(0x34d399, 4.8, 22);

  private stage = new THREE.Group();
  private interactive: THREE.Object3D[] = [];
  private pulsing: AnimatedObject[] = [];
  private flowDots: AnimatedObject[] = [];
  private positions = new Map<number, THREE.Vector3>();
  private frame = 0;
  private visible = true;
  private disposed = false;
  private dragging = false;
  private lastX = 0;
  private lastY = 0;

  constructor(
    host: HTMLDivElement,
    {
      focusMode,
      onHover,
    }: {
      focusMode: boolean;
      onHover: (item: Cinematic3DHover | null) => void;
    }
  ) {
    this.host = host;
    this.focusMode = focusMode;
    this.onHover = onHover;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.timer.connect(document);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      precision: "highp",
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.focusMode ? 2.5 : 2.25));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.26;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.domElement.dataset.testid = CANVAS_TEST_ID;
    this.renderer.domElement.style.display = "block";
    this.renderer.domElement.style.height = "100%";
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.touchAction = "none";
    this.renderer.domElement.setAttribute("role", "img");
    this.renderer.domElement.setAttribute("aria-label", "Interactive 3D algorithm state");
    this.host.replaceChildren(this.renderer.domElement);

    this.scene.background = new THREE.Color(BACKGROUND);
    this.scene.fog = new THREE.Fog(BACKGROUND, 20, 56);
    this.scene.add(new THREE.HemisphereLight(0xe6f7ff, 0x0b1728, 1.95));
    this.keyLight.position.set(-5, 10, 7);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.set(2048, 2048);
    this.primaryLight.position.set(-5, 4, 3);
    this.successLight.position.set(5, 5, -2);
    this.scene.add(this.keyLight, this.primaryLight, this.successLight, this.stage);

    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(this.host);
    this.intersectionObserver =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            this.visible = entry?.isIntersecting ?? true;
            if (this.visible) this.startLoop();
            else this.stopLoop();
          });
    this.intersectionObserver?.observe(this.host);

    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", this.handlePointerDown);
    canvas.addEventListener("pointerup", this.handlePointerUp);
    canvas.addEventListener("pointercancel", this.handlePointerUp);
    canvas.addEventListener("pointermove", this.handlePointerMove);
    canvas.addEventListener("pointerleave", this.handlePointerLeave);
    canvas.addEventListener("wheel", this.handleWheel, { passive: false });
    this.resize();
    this.startLoop();
  }

  setData(data: Cinematic3DSceneData) {
    if (this.disposed) return;

    this.scene.remove(this.stage);
    disposeObject(this.stage);
    this.stage = new THREE.Group();
    this.interactive = [];
    this.pulsing = [];
    this.flowDots = [];
    this.positions.clear();
    this.primaryLight.color.setHex(data.profile.palette.primary);
    this.successLight.color.setHex(data.profile.palette.success);
    this.renderer.domElement.setAttribute(
      "aria-label",
      `${data.algorithmTitle}, ${data.profile.mode}, step ${data.step} of ${data.totalSteps}`
    );

    buildStage(
      this.stage,
      data,
      this.positions,
      this.interactive,
      this.pulsing,
      this.flowDots
    );
    this.scene.add(this.stage);
    this.fitCamera();
    this.render();
    this.startLoop();
  }

  resetCamera() {
    this.controls.theta = this.defaultControls.theta;
    this.controls.elevation = this.defaultControls.elevation;
    this.controls.radius = this.defaultControls.radius;
    this.controls.target.copy(this.defaultControls.target);
    this.render();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.stopLoop();
    this.resizeObserver.disconnect();
    this.intersectionObserver?.disconnect();
    const canvas = this.renderer.domElement;
    canvas.removeEventListener("pointerdown", this.handlePointerDown);
    canvas.removeEventListener("pointerup", this.handlePointerUp);
    canvas.removeEventListener("pointercancel", this.handlePointerUp);
    canvas.removeEventListener("pointermove", this.handlePointerMove);
    canvas.removeEventListener("pointerleave", this.handlePointerLeave);
    canvas.removeEventListener("wheel", this.handleWheel);
    disposeObject(this.stage);
    this.renderer.dispose();
    this.timer.dispose();
    this.renderer.forceContextLoss();
    this.host.replaceChildren();
  }

  private readonly resize = () => {
    if (this.disposed) return;
    const rect = this.host.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.focusMode ? 2.5 : 2.25));
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.fov = width < 520 ? 50 : width < 760 ? 42 : this.focusMode ? 32 : 36;
    this.camera.updateProjectionMatrix();
    if (this.stage.children.length) this.fitCamera();
    this.render();
  };

  private readonly handlePointerDown = (event: PointerEvent) => {
    this.dragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.renderer.domElement.setPointerCapture(event.pointerId);
  };

  private readonly handlePointerUp = (event: PointerEvent) => {
    this.dragging = false;
    if (this.renderer.domElement.hasPointerCapture(event.pointerId)) {
      this.renderer.domElement.releasePointerCapture(event.pointerId);
    }
  };

  private readonly handlePointerMove = (event: PointerEvent) => {
    if (this.dragging) {
      this.controls.theta -= (event.clientX - this.lastX) * 0.005;
      this.controls.elevation = THREE.MathUtils.clamp(
        this.controls.elevation + (event.clientY - this.lastY) * 0.014,
        2.3,
        9.5
      );
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      this.render();
      return;
    }

    const rect = this.renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.updateCamera();
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.interactive, false)[0]?.object;
    this.onHover(
      hit
        ? {
            index: Number(hit.userData.index),
            label: String(hit.userData.label),
          }
        : null
    );
  };

  private readonly handlePointerLeave = () => {
    this.dragging = false;
    this.onHover(null);
  };

  private readonly handleWheel = (event: WheelEvent) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    this.controls.radius = THREE.MathUtils.clamp(
      this.controls.radius + event.deltaY * 0.012,
      5.8,
      38
    );
    this.defaultControls.radius = this.controls.radius;
    this.render();
  };

  private fitCamera() {
    const box = cameraBoundsFor(this.stage);
    if (box.isEmpty()) {
      this.defaultControls.radius = 12;
      this.defaultControls.elevation = 4.8;
      this.defaultControls.target.set(0, 1.4, 0);
    } else {
      const size = box.getSize(new THREE.Vector3());
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const verticalFov = THREE.MathUtils.degToRad(this.camera.fov);
      const horizontalFov =
        2 * Math.atan(Math.tan(verticalFov / 2) * Math.max(0.1, this.camera.aspect));
      const widthDistance = size.x / 2 / Math.max(0.1, Math.tan(horizontalFov / 2));
      const heightDistance = size.y / 2 / Math.max(0.1, Math.tan(verticalFov / 2));
      const fitDistance = Math.max(widthDistance, heightDistance) + size.z * 0.46;
      const cameraMargin = this.focusMode ? 1.02 : 1.08;
      this.defaultControls.radius = THREE.MathUtils.clamp(fitDistance * cameraMargin, 7.4, 36);
      this.defaultControls.target.copy(sphere.center);
      this.defaultControls.target.y = Math.max(0.62, sphere.center.y * 0.84);
      this.defaultControls.elevation = THREE.MathUtils.clamp(
        this.defaultControls.target.y + this.defaultControls.radius * 0.28 + 1.15,
        3.5,
        9.2
      );
    }
    this.controls.theta = this.defaultControls.theta;
    this.controls.elevation = this.defaultControls.elevation;
    this.controls.radius = this.defaultControls.radius;
    this.controls.target.copy(this.defaultControls.target);
  }

  private updateCamera() {
    this.camera.position.set(
      this.controls.target.x + Math.sin(this.controls.theta) * this.controls.radius,
      this.controls.elevation,
      this.controls.target.z + Math.cos(this.controls.theta) * this.controls.radius
    );
    this.camera.lookAt(this.controls.target);
  }

  private render() {
    if (this.disposed) return;
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
  }

  private startLoop() {
    if (this.disposed || !this.visible || this.reducedMotion || this.frame) {
      if (this.reducedMotion) this.render();
      return;
    }

    const tick = (timestamp: number) => {
      this.frame = 0;
      if (this.disposed || !this.visible) return;
      this.timer.update(timestamp);
      const elapsed = this.timer.getElapsed();
      this.pulsing.forEach((object) => {
        const phase = Number(object.userData.phase || 0);
        const pulse = 1 + Math.sin(elapsed * 2.45 + phase) * 0.045;
        object.scale.setScalar(pulse);
      });
      this.flowDots.forEach((object) => {
        const curve = object.userData.curve;
        if (!curve) return;
        const phase = Number(object.userData.phase || 0);
        object.position.copy(curve.getPointAt((elapsed * 0.15 + phase) % 1));
      });
      this.render();
      this.frame = window.requestAnimationFrame(tick);
    };
    this.frame = window.requestAnimationFrame(tick);
  }

  private stopLoop() {
    if (!this.frame) return;
    window.cancelAnimationFrame(this.frame);
    this.frame = 0;
  }
}

function buildStage(
  stage: THREE.Group,
  data: Cinematic3DSceneData,
  positions: Map<number, THREE.Vector3>,
  interactive: THREE.Object3D[],
  pulsing: AnimatedObject[],
  flowDots: AnimatedObject[]
) {
  if (!data.items.length) {
    addEmptyState(stage, data);
    return;
  }

  switch (data.layout) {
    case "grid":
      addGridScene(stage, data, positions, interactive, pulsing);
      break;
    case "network":
    case "tree":
    case "linked-list":
    case "heap":
      addNodeScene(stage, data, positions, interactive, pulsing);
      break;
    case "stack":
      addStackScene(stage, data, positions, interactive, pulsing);
      break;
    case "frames":
      addFrameScene(stage, data, positions, interactive, pulsing);
      break;
    case "bits":
      addBitScene(stage, data, positions, interactive, pulsing);
      break;
    default:
      addBarScene(stage, data, positions, interactive, pulsing);
  }

  addPointers(stage, data, positions, pulsing);
  addPointerFlow(stage, data, positions, pulsing, flowDots);
  addSceneBadge(stage, data);
}

function addBarScene(
  stage: THREE.Group,
  data: Cinematic3DSceneData,
  positions: Map<number, THREE.Vector3>,
  interactive: THREE.Object3D[],
  pulsing: AnimatedObject[]
) {
  const spacing = data.items.some((item) => item.interval) ? 1.86 : 1.45;
  const stageWidth = Math.max(9.5, (data.items.length - 1) * spacing + 3.2);
  const startX = -((data.items.length - 1) * spacing) / 2;
  const maxAbs = Math.max(1, ...data.items.map((item) => Math.abs(item.value)));
  addPlatform(stage, stageWidth, 3.8, data.profile.palette);

  data.items.forEach((item) => {
    const position = new THREE.Vector3(startX + item.index * spacing, 0, 0);
    positions.set(item.index, position);
    const marked = itemMarked(data, item);
    const isPointer = data.pointers.some((pointer) => pointer.index === item.index);
    const retired = itemRetired(data, item);
    const color = colorForItem(data, item, { marked, isPointer, retired });
    const height = item.interval
      ? 0.5
      : 0.68 + (Math.abs(item.value) / maxAbs) * 3.35;
    const width = item.interval
      ? THREE.MathUtils.clamp((item.interval.end - item.interval.start) * 0.36 + 0.72, 0.82, 2.5)
      : 0.82;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, item.interval ? 0.9 : 0.82, 2, 2, 2),
      itemMaterial(color, marked || isPointer, retired)
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(position.x, height / 2 + 0.14, 0);
    registerItem(mesh, item, interactive, pulsing, marked || isPointer);
    stage.add(mesh);

    addLabel(stage, item.label, new THREE.Vector3(position.x, 0.3, 0.88), color, 0.68);
  });

  addWindow(stage, data, positions);
}

function addGridScene(
  stage: THREE.Group,
  data: Cinematic3DSceneData,
  positions: Map<number, THREE.Vector3>,
  interactive: THREE.Object3D[],
  pulsing: AnimatedObject[]
) {
  const rows = Math.max(1, ...data.items.map((item) => (item.row ?? 0) + 1));
  const columns = Math.max(1, ...data.items.map((item) => (item.column ?? 0) + 1));
  const spacing = 1.08;
  const width = Math.max(8.5, columns * spacing + 2.3);
  const depth = Math.max(5.5, rows * spacing + 2.1);
  const maxAbs = Math.max(1, ...data.items.map((item) => Math.abs(item.value)));
  addPlatform(stage, width, depth, data.profile.palette);

  data.items.forEach((item) => {
    const x = ((item.column ?? 0) - (columns - 1) / 2) * spacing;
    const z = ((item.row ?? 0) - (rows - 1) / 2) * spacing;
    const height = 0.32 + (Math.abs(item.value) / maxAbs) * 1.25;
    const marked = itemMarked(data, item);
    const color = colorForItem(data, item, { marked });
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.88, height, 0.88, 2, 1, 2),
      itemMaterial(color, marked, false)
    );
    mesh.position.set(x, height / 2 + 0.12, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    positions.set(item.index, new THREE.Vector3(x, height + 0.12, z));
    registerItem(mesh, item, interactive, pulsing, marked);
    stage.add(mesh);
    addLabel(stage, item.label, new THREE.Vector3(x, height + 0.36, z), color, 0.36);
  });
}

function addNodeScene(
  stage: THREE.Group,
  data: Cinematic3DSceneData,
  positions: Map<number, THREE.Vector3>,
  interactive: THREE.Object3D[],
  pulsing: AnimatedObject[]
) {
  const nodePositions = calculateNodePositions(data);
  const bounds = new THREE.Box3();
  nodePositions.forEach((position) => bounds.expandByPoint(position));
  const size = bounds.getSize(new THREE.Vector3());
  addPlatform(
    stage,
    Math.max(9, size.x + 3.5),
    Math.max(5.5, size.z + 3.5),
    data.profile.palette
  );

  data.items.forEach((item) => {
    const position = nodePositions.get(item.id) || new THREE.Vector3();
    positions.set(item.index, position.clone());
  });

  data.edges.forEach((edge, edgeIndex) =>
    addEdge(stage, edge, edgeIndex, nodePositions, data.profile.palette)
  );

  data.items.forEach((item) => {
    const position = nodePositions.get(item.id) || new THREE.Vector3();
    const marked = itemMarked(data, item);
    const isPointer = data.pointers.some((pointer) => pointer.index === item.index);
    const retired = itemRetired(data, item);
    const color = colorForItem(data, item, { marked, isPointer, retired });
    const geometry =
      data.layout === "linked-list"
        ? new THREE.BoxGeometry(1.05, 0.78, 0.78, 3, 2, 2)
        : data.layout === "network"
          ? new THREE.IcosahedronGeometry(0.52, 2)
          : new THREE.SphereGeometry(0.5, 24, 16);
    const mesh = new THREE.Mesh(geometry, itemMaterial(color, marked || isPointer, retired));
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    registerItem(mesh, item, interactive, pulsing, marked || isPointer || item.state === "active");
    stage.add(mesh);
    addLabel(
      stage,
      item.label,
      position.clone().add(new THREE.Vector3(0, 0.9, 0)),
      color,
      item.label.length > 8 ? 0.7 : 0.38
    );
  });
}

function addStackScene(
  stage: THREE.Group,
  data: Cinematic3DSceneData,
  positions: Map<number, THREE.Vector3>,
  interactive: THREE.Object3D[],
  pulsing: AnimatedObject[]
) {
  const height = Math.max(4.5, data.items.length * 0.72 + 2);
  addPlatform(stage, 8.5, 5.5, data.profile.palette);
  const railMaterial = new THREE.MeshBasicMaterial({
    color: data.profile.palette.primary,
    transparent: true,
    opacity: 0.34,
  });
  [-1.25, 1.25].forEach((x) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, height, 0.04), railMaterial.clone());
    rail.position.set(x, height / 2, 0);
    stage.add(rail);
  });
  data.items.forEach((item) => {
    const y = 0.5 + item.index * 0.72;
    const marked = item.index === data.items.length - 1 || itemMarked(data, item);
    const color = colorForItem(data, item, { marked });
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.25, 0.56, 1.05, 2, 2, 2),
      itemMaterial(color, marked, false)
    );
    mesh.position.set(0, y, 0);
    mesh.castShadow = true;
    positions.set(item.index, mesh.position.clone());
    registerItem(mesh, item, interactive, pulsing, marked);
    stage.add(mesh);
    addLabel(stage, item.label, new THREE.Vector3(0, y + 0.08, 0.58), color, 0.5);
  });
}

function addFrameScene(
  stage: THREE.Group,
  data: Cinematic3DSceneData,
  positions: Map<number, THREE.Vector3>,
  interactive: THREE.Object3D[],
  pulsing: AnimatedObject[]
) {
  addPlatform(stage, 10, 7, data.profile.palette);
  data.items.forEach((item) => {
    const position = new THREE.Vector3(
      (item.index - (data.items.length - 1) / 2) * 0.75,
      0.58 + item.index * 0.7,
      -item.index * 0.72
    );
    const marked = item.state === "active" || itemMarked(data, item);
    const color = colorForItem(data, item, { marked });
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.52, 1.28, 3, 2, 2),
      itemMaterial(color, marked, item.state === "done")
    );
    mesh.position.copy(position);
    mesh.castShadow = true;
    positions.set(item.index, position.clone());
    registerItem(mesh, item, interactive, pulsing, marked);
    stage.add(mesh);
    addLabel(
      stage,
      item.label,
      position.clone().add(new THREE.Vector3(0, 0.08, 0.69)),
      color,
      1.15
    );
  });
}

function addBitScene(
  stage: THREE.Group,
  data: Cinematic3DSceneData,
  positions: Map<number, THREE.Vector3>,
  interactive: THREE.Object3D[],
  pulsing: AnimatedObject[]
) {
  const rows = Math.max(1, ...data.items.map((item) => (item.row ?? 0) + 1));
  const columns = Math.max(1, ...data.items.map((item) => (item.column ?? 0) + 1));
  addPlatform(stage, Math.max(9, columns * 0.95 + 4), Math.max(5.5, rows * 1.25 + 2.5), data.profile.palette);

  data.items.forEach((item) => {
    const x = ((item.column ?? 0) - (columns - 1) / 2) * 0.95 + 1;
    const z = ((item.row ?? 0) - (rows - 1) / 2) * 1.25;
    const marked = item.state === "active";
    const color = item.value ? (marked ? data.profile.palette.accent : data.profile.palette.primary) : 0x334155;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, item.value ? 0.78 : 0.34, 0.72, 2, 2, 2),
      itemMaterial(color, marked, false)
    );
    mesh.position.set(x, item.value ? 0.52 : 0.3, z);
    mesh.castShadow = true;
    positions.set(item.index, mesh.position.clone());
    registerItem(mesh, item, interactive, pulsing, marked);
    stage.add(mesh);
    addLabel(stage, item.label, new THREE.Vector3(x, 1.08, z), color, 0.32);
    if (item.column === 0 && item.group) {
      addLabel(stage, item.group, new THREE.Vector3(x - 2.15, 0.6, z), data.profile.palette.secondary, 1.1);
    }
  });
}

function addEmptyState(stage: THREE.Group, data: Cinematic3DSceneData) {
  addPlatform(stage, 8.5, 5.5, data.profile.palette);
  const orb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.9, 3),
    new THREE.MeshStandardMaterial({
      color: data.profile.palette.primary,
      emissive: data.profile.palette.primary,
      emissiveIntensity: 0.28,
      roughness: 0.3,
      metalness: 0.25,
      wireframe: true,
    })
  );
  orb.position.y = 1.5;
  stage.add(orb);
  addSceneBadge(stage, data);
}

function calculateNodePositions(data: Cinematic3DSceneData) {
  const positions = new Map<string, THREE.Vector3>();
  if (data.layout === "network") {
    const radius = Math.max(2.7, data.items.length * 0.48);
    data.items.forEach((item, index) => {
      const angle = -Math.PI / 2 + (index / Math.max(1, data.items.length)) * Math.PI * 2;
      positions.set(
        item.id,
        new THREE.Vector3(
          Math.cos(angle) * radius,
          1.05 + (index % 2) * 0.42,
          Math.sin(angle) * radius * 0.68
        )
      );
    });
    return positions;
  }

  if (data.layout === "linked-list") {
    const spacing = 2;
    const start = -((data.items.length - 1) * spacing) / 2;
    data.items.forEach((item) => {
      positions.set(item.id, new THREE.Vector3(start + item.index * spacing, 1.05, 0));
    });
    return positions;
  }

  const levels = data.items.map((item) =>
    data.layout === "heap"
      ? Math.floor(Math.log2(item.index + 1))
      : item.level ?? Math.floor(Math.log2(item.index + 1))
  );
  const maxLevel = Math.max(0, ...levels);
  data.items.forEach((item) => {
    const level = levels[item.index] ?? 0;
    let x: number;
    if (typeof item.position === "number") {
      x = item.position * 2.05;
    } else {
      const firstAtLevel = 2 ** level - 1;
      const positionAtLevel = item.index - firstAtLevel;
      const countAtLevel = 2 ** level;
      const span = Math.max(2, 2 ** Math.max(0, maxLevel - level) * 1.35);
      x = (positionAtLevel - (countAtLevel - 1) / 2) * span;
    }
    const y = 0.95 + (maxLevel - level) * 1.65;
    positions.set(item.id, new THREE.Vector3(x, y, 0));
  });
  return positions;
}

function addEdge(
  stage: THREE.Group,
  edge: Cinematic3DEdge,
  edgeIndex: number,
  positions: Map<string, THREE.Vector3>,
  palette: Cinematic3DPalette
) {
  const start = positions.get(edge.from);
  const end = positions.get(edge.to);
  if (!start || !end) return;
  const active = edge.state === "active";
  const color = active ? palette.accent : palette.secondary;
  const line = cylinderBetween(start, end, active ? 0.035 : 0.022, color, active ? 0.88 : 0.42);
  stage.add(line);
  if (edge.label) {
    const direction = end.clone().sub(start);
    const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x);
    if (perpendicular.lengthSq() < 0.0001) perpendicular.set(0, 0, 1);
    const side = edgeIndex % 2 === 0 ? 1 : -1;
    perpendicular
      .normalize()
      .multiplyScalar(side * (0.38 + (edgeIndex % 3) * 0.14));
    const labelPosition = start
      .clone()
      .add(end)
      .multiplyScalar(0.5)
      .add(perpendicular);
    labelPosition.y += 0.42 + (edgeIndex % 4) * 0.14;
    addLabel(stage, edge.label, labelPosition, color, 0.34);
  }
}

function addPlatform(stage: THREE.Group, width: number, depth: number, palette: Cinematic3DPalette) {
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.18, depth),
    new THREE.MeshStandardMaterial({ color: 0x0b1728, roughness: 0.58, metalness: 0.16 })
  );
  base.position.y = -0.08;
  base.receiveShadow = true;
  stage.add(base);
  const surface = new THREE.Mesh(
    new THREE.BoxGeometry(Math.max(1, width - 0.65), 0.035, Math.max(1, depth - 0.55)),
    new THREE.MeshBasicMaterial({ color: palette.primary, transparent: true, opacity: 0.13 })
  );
  surface.position.y = 0.04;
  stage.add(surface);
  const grid = new THREE.GridHelper(
    Math.max(width, depth) - 0.8,
    Math.max(6, Math.round(Math.max(width, depth))),
    palette.primary,
    0x132238
  );
  const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
  gridMaterials.forEach((material) => {
    material.transparent = true;
    material.opacity = 0.3;
  });
  grid.position.y = 0.065;
  stage.add(grid);
}

function addWindow(
  stage: THREE.Group,
  data: Cinematic3DSceneData,
  positions: Map<number, THREE.Vector3>
) {
  if (!data.window) return;
  const left = positions.get(data.window.left);
  const right = positions.get(data.window.right);
  if (!left || !right) return;
  const width = Math.max(0.8, Math.abs(right.x - left.x) + 1.25);
  const corridor = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.035, 2.45),
    new THREE.MeshBasicMaterial({
      color: data.profile.palette.accent,
      transparent: true,
      opacity: 0.14,
    })
  );
  corridor.position.set((left.x + right.x) / 2, 0.19, (left.z + right.z) / 2);
  stage.add(corridor);
}

function addPointers(
  stage: THREE.Group,
  data: Cinematic3DSceneData,
  positions: Map<number, THREE.Vector3>,
  pulsing: AnimatedObject[]
) {
  data.pointers.forEach((pointer, order) => {
    const position = positions.get(pointer.index);
    if (!position) return;
    const color = pointerToneColors[pointer.tone || "cyan"] || data.profile.palette.primary;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.68, 0.035, 12, 48),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.84 })
    ) as AnimatedObject;
    ring.rotation.x = Math.PI / 2;
    ring.position.copy(position);
    ring.position.y = Math.max(0.35, position.y + 0.08 + order * 0.05);
    ring.userData.phase = order * 0.65;
    stage.add(ring);
    pulsing.push(ring);

    const tagPosition = position.clone().add(new THREE.Vector3(0, 1.55 + order * 0.38, 0));
    addLabel(stage, pointer.label.toUpperCase(), tagPosition, color, 0.88);
    stage.add(
      cylinderBetween(
        position.clone().add(new THREE.Vector3(0, 0.35, 0)),
        tagPosition.clone().add(new THREE.Vector3(0, -0.2, 0)),
        0.016,
        color,
        0.58
      )
    );
  });
}

function addPointerFlow(
  stage: THREE.Group,
  data: Cinematic3DSceneData,
  positions: Map<number, THREE.Vector3>,
  pulsing: AnimatedObject[],
  flowDots: AnimatedObject[]
) {
  const active = data.pointers
    .map((pointer) => positions.get(pointer.index))
    .filter(Boolean) as THREE.Vector3[];
  if (active.length < 2) return;
  const first = active[0];
  const last = active[active.length - 1];
  const midpoint = first.clone().add(last).multiplyScalar(0.5);
  const lift = 1.8 + Math.min(2.4, first.distanceTo(last) * 0.22);
  const curve = new THREE.CatmullRomCurve3([
    first.clone().add(new THREE.Vector3(0, 0.6, 0)),
    midpoint.clone().add(new THREE.Vector3(0, lift, -0.45)),
    last.clone().add(new THREE.Vector3(0, 0.6, 0)),
  ]);
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 48, 0.025, 10, false),
    new THREE.MeshBasicMaterial({
      color: data.profile.palette.secondary,
      transparent: true,
      opacity: 0.72,
    })
  ) as AnimatedObject;
  tube.userData.phase = 1;
  stage.add(tube);
  pulsing.push(tube);

  for (let index = 0; index < 3; index += 1) {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 14, 10),
      new THREE.MeshBasicMaterial({
        color: data.profile.palette.accent,
        transparent: true,
        opacity: 0.9,
      })
    ) as AnimatedObject;
    dot.userData.curve = curve;
    dot.userData.phase = index / 3;
    stage.add(dot);
    flowDots.push(dot);
  }
}

function addSceneBadge(stage: THREE.Group, data: Cinematic3DSceneData) {
  const box = new THREE.Box3().setFromObject(stage);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const badge = createTextSprite(data.profile.title, {
    textColor: "#fefce8",
    background: "rgba(2,6,23,0.86)",
    border: hexColor(data.profile.palette.accent),
    minimumWidth: 768,
  });
  badge.position.set(
    center.x,
    Math.max(3.8, box.max.y + 1),
    box.min.z - Math.max(0.35, size.z * 0.08)
  );
  const badgeHeight = 0.82;
  const badgeAspect = Number(badge.userData.textureAspect) || 4;
  badge.scale.set(badgeHeight * badgeAspect, badgeHeight, 1);
  badge.userData.excludeFromCameraFit = true;
  stage.add(badge);
}

function addLabel(
  stage: THREE.Group,
  text: string,
  position: THREE.Vector3,
  color: number,
  width: number
) {
  const label = createTextSprite(text, {
    textColor: "#effbff",
    background: "rgba(2,6,23,0.96)",
    border: hexColor(color),
  });
  label.position.copy(position);
  const compactLabel = width <= 0.42;
  const labelHeight = compactLabel ? 0.42 : width < 0.6 ? 0.52 : 0.64;
  const textureAspect = Number(label.userData.textureAspect) || 4;
  label.scale.set(labelHeight * textureAspect, labelHeight, 1);
  stage.add(label);
}

function createTextSprite(
  text: string,
  options: { textColor: string; background: string; border: string; minimumWidth?: number }
) {
  const canvas = document.createElement("canvas");
  const visibleText = text.slice(0, 32);
  const logicalWidth = Math.min(
    1024,
    Math.max(options.minimumWidth ?? 384, 260 + visibleText.length * 56)
  );
  const logicalHeight = 256;
  const textureScale = 1;
  canvas.width = logicalWidth * textureScale;
  canvas.height = logicalHeight * textureScale;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.Sprite();
  context.scale(textureScale, textureScale);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.clearRect(0, 0, logicalWidth, logicalHeight);
  context.fillStyle = options.background;
  roundedRect(context, 18, 18, logicalWidth - 36, logicalHeight - 36, 26);
  context.fill();
  context.lineWidth = 5;
  context.strokeStyle = options.border;
  context.stroke();
  context.fillStyle = options.textColor;
  context.font = "800 88px Inter, Segoe UI, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(visibleText, logicalWidth / 2, logicalHeight / 2 + 2, logicalWidth - 92);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;
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
  sprite.userData.textureAspect = logicalWidth / logicalHeight;
  return sprite;
}

function itemMaterial(color: number, emphasized: boolean, muted: boolean) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: emphasized ? 0.48 : 0.2,
    roughness: 0.36,
    metalness: 0.18,
    transparent: true,
    opacity: muted ? 0.72 : 0.98,
  });
}

function colorForItem(
  data: Cinematic3DSceneData,
  item: Cinematic3DItem,
  flags: { marked?: boolean; isPointer?: boolean; retired?: boolean }
) {
  if (flags.marked || item.state === "done") return data.profile.palette.success;
  if (flags.retired) return 0x52617a;
  if (item.state === "active" || flags.isPointer) return data.profile.palette.primary;
  if (item.state === "frontier" || item.state === "waiting") return data.profile.palette.accent;
  if (item.value < 0 && data.layout === "bars") return data.profile.palette.danger;
  return data.profile.palette.neutral;
}

function itemMarked(data: Cinematic3DSceneData, item: Cinematic3DItem) {
  return setHasItem(data.solution, item) || setHasItem(data.activeCells, item);
}

function itemRetired(data: Cinematic3DSceneData, item: Cinematic3DItem) {
  return setHasItem(data.retired, item) || item.state === "unseen";
}

function setHasItem(set: Set<string>, item: Cinematic3DItem) {
  return (
    set.has(String(item.index)) ||
    set.has(item.id) ||
    set.has(item.label) ||
    (typeof item.row === "number" &&
      typeof item.column === "number" &&
      set.has(`${item.row}-${item.column}`))
  );
}

function registerItem(
  mesh: THREE.Mesh,
  item: Cinematic3DItem,
  interactive: THREE.Object3D[],
  pulsing: AnimatedObject[],
  pulse: boolean
) {
  mesh.userData = { index: item.index, label: item.label, phase: item.index * 0.31 };
  interactive.push(mesh);
  if (pulse) pulsing.push(mesh as AnimatedObject);
}

function cylinderBetween(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  color: number,
  opacity: number
) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, Math.max(length, 0.001), 12),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
  );
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function cameraBoundsFor(root: THREE.Object3D) {
  const bounds = new THREE.Box3();
  root.updateWorldMatrix(true, true);
  root.traverse((object) => {
    if (object.userData.excludeFromCameraFit) return;
    const renderable = object as THREE.Object3D & {
      geometry?: THREE.BufferGeometry;
    };
    if (!renderable.geometry) return;
    const objectBounds = new THREE.Box3().setFromObject(object);
    if (!objectBounds.isEmpty()) bounds.union(objectBounds);
  });
  return bounds;
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    const renderable = object as THREE.Object3D & {
      geometry?: THREE.BufferGeometry;
      material?: THREE.Material | THREE.Material[];
    };
    renderable.geometry?.dispose();
    const materials = Array.isArray(renderable.material)
      ? renderable.material
      : renderable.material
        ? [renderable.material]
        : [];
    materials.forEach((material) => {
      const mapped = material as THREE.Material & { map?: THREE.Texture };
      mapped.map?.dispose();
      material.dispose();
    });
  });
}

function hexColor(color: number) {
  return `#${color.toString(16).padStart(6, "0")}`;
}
