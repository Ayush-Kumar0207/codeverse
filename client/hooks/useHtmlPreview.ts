import { useCallback, useState } from "react";
import type { SupportedLanguage } from "@shared/types/language";

export interface PreviewState {
  combinedPreview: string;
  openPreviewInBrowser: () => void;
}

export function useHtmlPreview(
  files: Record<string, string>,
  language: SupportedLanguage
): PreviewState {
  const [combinedPreview] = useState(() => {
    return `
      ${files["index.html"] || ""}
      <style>${files["style.css"] || ""}</style>
      <script>${files["script.js"] || ""}</script>
    `;
  });

  const openPreviewInBrowser = useCallback(() => {
    const blob = new Blob([combinedPreview], { type: "text/html" });
    window.open(URL.createObjectURL(blob), "_blank");
  }, [combinedPreview]);

  return {
    combinedPreview,
    openPreviewInBrowser,
  };
}
