import { useMemo } from "react";
import type { SupportedLanguage } from "@shared/types/language";

export function useLanguageDetection(filename: string): SupportedLanguage {
  return useMemo(() => {
    const languageMap: Record<string, SupportedLanguage> = {
      py: "python",
      cpp: "cpp",
      cxx: "cpp",
      cc: "cpp",
      java: "java",
      js: "javascript",
      mjs: "javascript",
      ts: "typescript",
      c: "c",
      html: "html",
      css: "css",
      md: "markdown",
      json: "json",
    };

    const ext = filename.split(".").pop()?.toLowerCase();
    return ext && ext in languageMap ? languageMap[ext] : "plaintext";
  }, [filename]);
}

/**
 * Detect language from filename extension
 * Used in multiple places (CodeEditor, useEditorState)
 */
export function getLanguageFromFilename(filename: string): SupportedLanguage {
  const languageMap: Record<string, SupportedLanguage> = {
    py: "python",
    cpp: "cpp",
    cxx: "cpp",
    cc: "cpp",
    java: "java",
    js: "javascript",
    mjs: "javascript",
    ts: "typescript",
    c: "c",
    html: "html",
    css: "css",
    md: "markdown",
    json: "json",
  };

  const ext = filename.split(".").pop()?.toLowerCase();
  return ext && ext in languageMap ? languageMap[ext] : "plaintext";
}
