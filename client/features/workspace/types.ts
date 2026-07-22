export interface PresenceUser {
  username: string;
  avatar?: string;
  status?: string;
  role?: "organizer" | "collaborator";
  canEdit?: boolean;
  userId?: string;
  socketId?: string;
}

export interface CollaborationAccess {
  collaboratorsCanEdit: boolean;
  organizerUsername?: string;
  organizerUserId?: string;
}

export interface WorkspaceSnapshot {
  id: string;
  createdAt: string;
  files: Record<string, string>;
  activeFile: string;
  label: string;
}

export type FullscreenPanel = "editor" | "explorer" | "assistant" | "output" | null;
