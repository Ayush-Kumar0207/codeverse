import type { SupportedLanguage } from "./language";

export interface SharedProject {
  _id?: string;
  title: string;
  language: SupportedLanguage;
  owner?: string;
  isDemo?: boolean;
  code?: string;
  files?: Record<string, string>;
  activeFile?: string;
  createdAt?: string;
  updatedAt?: string;
  storage?: "cloud" | "device" | "pending";
  collaborationRole?: "organizer" | "editor" | "viewer";
}
