import type { StateValue } from "./AutoVisualizer";

export type Cinematic3DLayout =
  | "bars"
  | "grid"
  | "network"
  | "tree"
  | "linked-list"
  | "heap"
  | "stack"
  | "frames"
  | "bits";

export type Cinematic3DPalette = {
  primary: number;
  secondary: number;
  accent: number;
  danger: number;
  success: number;
  neutral: number;
};

export type Cinematic3DPointer = {
  label: string;
  index: number;
  tone?: string;
};

export type Cinematic3DItem = {
  id: string;
  index: number;
  label: string;
  value: number;
  state?: string;
  row?: number;
  column?: number;
  level?: number;
  position?: number;
  group?: string;
  interval?: { start: number; end: number };
  raw: StateValue;
};

export type Cinematic3DEdge = {
  from: string;
  to: string;
  label?: string;
  state?: string;
};

export type Cinematic3DProfile = {
  id: string;
  title: string;
  family: string;
  mode: string;
  palette: Cinematic3DPalette;
};

export type Cinematic3DSceneData = {
  algorithmTitle: string;
  family: string;
  kind: string;
  layout: Cinematic3DLayout;
  step: number;
  totalSteps: number;
  progress: number;
  headline: string;
  narrative: string;
  decision: string;
  invariant: string;
  items: Cinematic3DItem[];
  edges: Cinematic3DEdge[];
  pointers: Cinematic3DPointer[];
  retired: Set<string>;
  solution: Set<string>;
  activeCells: Set<string>;
  window: { left: number; right: number } | null;
  variables: Record<string, StateValue>;
  profile: Cinematic3DProfile;
};

export type Cinematic3DHover = {
  index: number;
  label: string;
};
