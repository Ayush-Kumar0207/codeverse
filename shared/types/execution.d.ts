import type { SupportedLanguage } from "./language";

export interface ExecutionRequest {
  code: string;
  language: SupportedLanguage;
  roomId: string;
  user: string;
}

export interface ExecutionOutput {
  user: string;
  output: string;
}

export interface ExecutionError {
  user: string;
  error: string;
}

