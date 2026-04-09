import type { SupportedLanguage } from "./language";

export interface SharedProject {
  _id?: string;
  title: string;
  language: SupportedLanguage;
  owner?: string;
  isDemo?: boolean;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
}

