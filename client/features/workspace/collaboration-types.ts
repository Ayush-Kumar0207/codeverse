export interface CollaborationRuntimeState {
  mode: "redis" | "single-node" | "connecting";
  revision: number;
  syncReady: boolean;
  pendingOperations: number;
  recovered: boolean;
}
