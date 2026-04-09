import type { PreviewLanguage } from "./language";

export interface SharedFile {
  name: string;
  language: PreviewLanguage;
  content: string;
  project?: string;
  createdAt?: string;
  updatedAt?: string;
}

