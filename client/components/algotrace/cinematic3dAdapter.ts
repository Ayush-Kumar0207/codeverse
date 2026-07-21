import type { StateData, StateValue } from "./AutoVisualizer";
import type {
  Cinematic3DEdge,
  Cinematic3DItem,
  Cinematic3DLayout,
  Cinematic3DPalette,
  Cinematic3DPointer,
  Cinematic3DProfile,
  Cinematic3DSceneData,
} from "./cinematic3dTypes";

const MAX_SCENE_ITEMS = 64;

const FAMILY_PALETTES: Record<string, Cinematic3DPalette> = {
  array: palette(0x22d3ee, 0x818cf8, 0xfbbf24, 0xfb7185, 0x34d399, 0x2563eb),
  "two-pointers": palette(0x22d3ee, 0xa78bfa, 0xfbbf24, 0xfb7185, 0x34d399, 0x2563eb),
  "sliding-window": palette(0x38bdf8, 0x2dd4bf, 0xfacc15, 0xfb7185, 0x4ade80, 0x1d4ed8),
  "binary-search": palette(0x60a5fa, 0xc084fc, 0xfbbf24, 0xfb7185, 0x34d399, 0x1e40af),
  prefix: palette(0x38bdf8, 0x818cf8, 0xfacc15, 0xf472b6, 0x2dd4bf, 0x1d4ed8),
  sorting: palette(0x22d3ee, 0xa78bfa, 0xfbbf24, 0xfb7185, 0x34d399, 0x2563eb),
  matrix: palette(0x2dd4bf, 0x60a5fa, 0xfde047, 0xfb7185, 0x4ade80, 0x1d4ed8),
  "dynamic-programming": palette(0x818cf8, 0x22d3ee, 0xfbbf24, 0xfb7185, 0x34d399, 0x3730a3),
  graph: palette(0x38bdf8, 0xa78bfa, 0xfacc15, 0xfb7185, 0x34d399, 0x1d4ed8),
  tree: palette(0x34d399, 0x60a5fa, 0xfbbf24, 0xfb7185, 0x86efac, 0x1e40af),
  "linked-list": palette(0x2dd4bf, 0x818cf8, 0xfbbf24, 0xfb7185, 0x4ade80, 0x2563eb),
  "stack-queue": palette(0xc084fc, 0x38bdf8, 0xfacc15, 0xfb7185, 0x34d399, 0x4338ca),
  heap: palette(0xf59e0b, 0x60a5fa, 0xfde047, 0xfb7185, 0x34d399, 0x1d4ed8),
  recursion: palette(0xa78bfa, 0x22d3ee, 0xfbbf24, 0xfb7185, 0x34d399, 0x4338ca),
  trie: palette(0x2dd4bf, 0x818cf8, 0xfacc15, 0xfb7185, 0x4ade80, 0x1d4ed8),
  bit: palette(0x22d3ee, 0x60a5fa, 0xfde047, 0xfb7185, 0x34d399, 0x1e40af),
  string: palette(0xf0abfc, 0x38bdf8, 0xfbbf24, 0xfb7185, 0x34d399, 0x4338ca),
  math: palette(0x60a5fa, 0x2dd4bf, 0xfacc15, 0xfb7185, 0x34d399, 0x1d4ed8),
  greedy: palette(0x34d399, 0x60a5fa, 0xfbbf24, 0xfb7185, 0x86efac, 0x1d4ed8),
};

const MODE_BY_LAYOUT: Record<Cinematic3DLayout, string> = {
  bars: "Spatial value field",
  grid: "Layered state grid",
  network: "Frontier network",
  tree: "Recursive tree",
  "linked-list": "Pointer chain",
  heap: "Priority tree",
  stack: "Container stack",
  frames: "Call-frame staircase",
  bits: "Bit plane",
};

export function buildCinematic3DSceneData(state: StateData): Cinematic3DSceneData {
  const algorithm = getRecord(state.algorithm);
  const profileRecord = getRecord(state.cinematic3d);
  const kind = normalizeKind(asString(state.kind) || asString(algorithm?.family) || "array");
  const extracted = extractScene(state, kind);
  const variables = getRecord(state.variables) || {};
  const windowRecord = getRecord(state.window);
  const left = asNumber(windowRecord?.left);
  const right = asNumber(windowRecord?.right);
  const profile = buildProfile(state, algorithm, profileRecord, kind, extracted.layout);

  return {
    algorithmTitle: asString(algorithm?.title) || profile.title || "Algorithm",
    family: asString(algorithm?.family) || humanize(kind),
    kind,
    layout: extracted.layout,
    step: asNumber(state.step) ?? 1,
    totalSteps: Math.max(1, asNumber(state.totalSteps) ?? 1),
    progress: clamp(asNumber(state.progress) ?? 0, 0, 100),
    headline: asString(state.headline) || asString(state.phase) || "Cinematic trace",
    narrative:
      asString(state.narrative) ||
      asString(state.explanation) ||
      "Watch the active data structure change with each decision.",
    decision: asString(state.decision) || "Apply the next rule while preserving the invariant.",
    invariant:
      asString(state.invariant) ||
      "The highlighted state is the part of the problem still relevant to the answer.",
    items: extracted.items.slice(0, MAX_SCENE_ITEMS),
    edges: extracted.edges,
    pointers: getPointers(state.pointers),
    retired: normalizedSet(state.retired),
    solution: normalizedSet(state.solution),
    activeCells: normalizedSet(state.activeCells),
    window: typeof left === "number" && typeof right === "number" ? { left, right } : null,
    variables,
    profile,
  };
}

export function primaryCinematicMetric(data: Cinematic3DSceneData) {
  const interestingKeys = [
    "answer",
    "result",
    "currentSum",
    "bestSum",
    "best",
    "profit",
    "maxProfit",
    "count",
    "candidate",
    "prefix",
    "root",
    "current",
    "swap",
    "duplicate",
  ];
  const match = interestingKeys.find((key) => data.variables[key] !== undefined);
  if (match) return `${humanize(match)}: ${formatMetric(data.variables[match])}`;
  if (data.pointers.length) {
    return data.pointers.map((pointer) => `${pointer.label}: ${pointer.index}`).join("  ·  ");
  }
  return data.profile.mode;
}

function extractScene(
  state: StateData,
  kind: string
): { layout: Cinematic3DLayout; items: Cinematic3DItem[]; edges: Cinematic3DEdge[] } {
  const graph = getRecord(state.graph);
  if (graph) return extractNetwork(graph, "network");

  const tree = getRecord(state.tree);
  if (tree) return extractNetwork(tree, kind === "trie" ? "tree" : "tree");

  const matrix = getMatrix(state.matrix) || getMatrix(state.dpTable) || getMatrix(state.dp_table);
  if (matrix) return extractGrid(matrix);

  const list = getArray(state.list);
  if (list) return extractList(list);

  const heap = getArray(state.heap);
  if (heap) return extractHeap(heap);

  const frames = getArray(state.recursionFrames);
  if (frames) return extractFrames(frames);

  const bits = getArray(state.bits);
  if (bits) return extractBits(bits);

  const stack = getArray(state.stack);
  const queue = getArray(state.queue);
  if (kind === "stack-queue" && ((stack && stack.length) || (queue && queue.length))) {
    return extractStack(stack?.length ? stack : queue || [], stack?.length ? "stack" : "queue");
  }

  const values =
    getArray(state.values) ||
    getArray(state.working_array) ||
    getArray(state.chars) ||
    getArray(state.dpRow) ||
    getArray(state.choices) ||
    (queue?.length ? queue : null) ||
    [];
  return { layout: "bars", items: values.map(toLinearItem), edges: [] };
}

function extractGrid(matrix: StateValue[][]) {
  const items: Cinematic3DItem[] = [];
  matrix.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const label = formatLabel(value, `${rowIndex},${columnIndex}`);
      items.push({
        id: `${rowIndex}-${columnIndex}`,
        index: items.length,
        label,
        value: asNumber(value) ?? 0,
        row: rowIndex,
        column: columnIndex,
        raw: value,
      });
    });
  });
  return { layout: "grid" as const, items, edges: [] };
}

function extractNetwork(record: Record<string, StateValue>, layout: "network" | "tree") {
  const nodes = getArray(record.nodes) || [];
  const items = nodes.map((node, index) => {
    const item = getRecord(node);
    const id = formatLabel(item?.id, String(index));
    return {
      id,
      index,
      label: formatLabel(item?.label, id),
      value: asNumber(item?.value) ?? asNumber(item?.label) ?? index + 1,
      state: asString(item?.state) || undefined,
      level: asNumber(item?.level),
      position: asNumber(item?.position),
      raw: node,
    } satisfies Cinematic3DItem;
  });
  const edges = (getArray(record.edges) || [])
    .map((edge) => {
      const item = getRecord(edge);
      const from = formatLabel(item?.from, "");
      const to = formatLabel(item?.to, "");
      if (!from || !to) return null;
      return {
        from,
        to,
        label: asString(item?.label) || undefined,
        state: asString(item?.state) || undefined,
      };
    })
    .filter(Boolean) as Cinematic3DEdge[];
  return { layout, items, edges };
}

function extractList(list: StateValue[]) {
  const items = list.map((node, index) => {
    const item = getRecord(node);
    const id = formatLabel(item?.id, String(index));
    const value = item?.value ?? node;
    return {
      id,
      index,
      label: formatLabel(value, id),
      value: asNumber(value) ?? index + 1,
      state: asString(item?.state) || undefined,
      raw: node,
    } satisfies Cinematic3DItem;
  });
  const edges = items.slice(1).map((item, index) => ({ from: items[index].id, to: item.id }));
  return { layout: "linked-list" as const, items, edges };
}

function extractHeap(heap: StateValue[]) {
  const items = heap.map(toLinearItem);
  const edges = items.slice(1).map((item) => ({
    from: items[Math.floor((item.index - 1) / 2)].id,
    to: item.id,
  }));
  return { layout: "heap" as const, items, edges };
}

function extractFrames(frames: StateValue[]) {
  const items = frames.map((frame, index) => {
    const item = getRecord(frame);
    return {
      id: `frame-${index}`,
      index,
      label: formatLabel(item?.label, `frame ${index + 1}`),
      value: index + 1,
      state: asString(item?.state) || undefined,
      raw: frame,
    } satisfies Cinematic3DItem;
  });
  return { layout: "frames" as const, items, edges: [] };
}

function extractBits(rows: StateValue[]) {
  const items: Cinematic3DItem[] = [];
  rows.forEach((row, rowIndex) => {
    const record = getRecord(row);
    const group = formatLabel(record?.label, `row ${rowIndex + 1}`);
    const bitString = formatLabel(record?.value, "");
    const active = normalizedSet(record?.active);
    Array.from(bitString).forEach((bit, columnIndex) => {
      const bitPosition = bitString.length - columnIndex - 1;
      items.push({
        id: `${rowIndex}-${columnIndex}`,
        index: items.length,
        label: bit,
        value: bit === "1" ? 1 : 0,
        state: active.has(String(bitPosition)) ? "active" : undefined,
        row: rowIndex,
        column: columnIndex,
        group,
        raw: bit,
      });
    });
  });
  return { layout: "bits" as const, items, edges: [] };
}

function extractStack(values: StateValue[], group: string) {
  const items = values.map((value, index) => ({ ...toLinearItem(value, index), group }));
  return { layout: "stack" as const, items, edges: [] };
}

function toLinearItem(value: StateValue, index: number): Cinematic3DItem {
  const label = formatLabel(value, String(index));
  const interval = parseInterval(label);
  return {
    id: String(index),
    index,
    label,
    value: asNumber(value) ?? interval?.end ?? index + 1,
    interval,
    raw: value,
  };
}

function buildProfile(
  state: StateData,
  algorithm: Record<string, StateValue> | null,
  profile: Record<string, StateValue> | null,
  kind: string,
  layout: Cinematic3DLayout
): Cinematic3DProfile {
  const profilePalette = getRecord(profile?.palette);
  const fallback = FAMILY_PALETTES[kind] || FAMILY_PALETTES.array;
  return {
    id: asString(profile?.id) || asString(algorithm?.id) || "cinematic",
    title:
      asString(profile?.title) ||
      `${asString(algorithm?.title) || asString(state.headline) || "Algorithm"} spatial trace`,
    family: asString(algorithm?.family) || asString(profile?.family) || humanize(kind),
    mode:
      asString(profile?.mode) && asString(profile?.mode) !== "Shared 3D grammar"
        ? asString(profile?.mode)
        : MODE_BY_LAYOUT[layout],
    palette: {
      primary: colorFrom(profilePalette?.primary, fallback.primary),
      secondary: colorFrom(profilePalette?.secondary, fallback.secondary),
      accent: colorFrom(profilePalette?.accent, fallback.accent),
      danger: colorFrom(profilePalette?.danger, fallback.danger),
      success: colorFrom(profilePalette?.success, fallback.success),
      neutral: colorFrom(profilePalette?.neutral, fallback.neutral),
    },
  };
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
    .filter(Boolean) as Cinematic3DPointer[];
}

function getMatrix(value: StateValue | undefined) {
  const rows = getArray(value);
  if (!rows || !rows.every(Array.isArray)) return null;
  return rows as StateValue[][];
}

function normalizedSet(value: StateValue | undefined) {
  const values = getArray(value) || [];
  return new Set(values.map((item) => String(item)));
}

function normalizeKind(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function parseInterval(label: string) {
  const match = label.match(/-?\d+(?:\.\d+)?/g);
  if (!match || match.length < 2) return undefined;
  const start = Number(match[0]);
  const end = Number(match[1]);
  return Number.isFinite(start) && Number.isFinite(end) ? { start, end } : undefined;
}

function formatMetric(value: StateValue) {
  if (Array.isArray(value)) return value.slice(0, 5).map(String).join(", ");
  if (value && typeof value === "object") return `${Object.keys(value).length} entries`;
  return String(value);
}

function formatLabel(value: StateValue | undefined, fallback: string) {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

function colorFrom(value: StateValue | undefined, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().replace("#", "0x");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getArray(value: StateValue | undefined): StateValue[] | null {
  return Array.isArray(value) ? value : null;
}

function getRecord(value: StateValue | undefined): Record<string, StateValue> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, StateValue>)
    : null;
}

function asString(value: StateValue | undefined) {
  return typeof value === "string" ? value : "";
}

function asNumber(value: StateValue | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function humanize(value: string) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function palette(
  primary: number,
  secondary: number,
  accent: number,
  danger: number,
  success: number,
  neutral: number
): Cinematic3DPalette {
  return { primary, secondary, accent, danger, success, neutral };
}
