import { useCallback, useMemo } from "react";
import type { SupportedLanguage } from "@shared/types/language";

export interface PreviewState {
  combinedPreview: string;
  openPreviewInBrowser: () => void;
}

export function useHtmlPreview(
  files: Record<string, string>,
  language: SupportedLanguage
): PreviewState {
  const combinedPreview = useMemo(() => {
    const html = files["index.html"] || "";
    const css = files["style.css"] || "";
    const js = files["script.js"] || "";
    const htmlWithLanguage = html.replace(/<html\b/i, `<html data-preview-language="${language}"`);
    const withoutLocalScript = htmlWithLanguage.replace(
      /<script\b[^>]*\bsrc=["']\.\/script\.js["'][^>]*>\s*<\/script>/gi,
      ""
    );
    const styleTag = `<style data-codeverse-preview-style>${css}</style>`;
    const scriptTag = `<script data-codeverse-preview-script>${js}<\/script>`;
    const withStyle = withoutLocalScript.includes("</head>")
      ? withoutLocalScript.replace("</head>", `${styleTag}</head>`)
      : `${styleTag}${withoutLocalScript}`;

    return withStyle.includes("</body>")
      ? withStyle.replace("</body>", `${scriptTag}</body>`)
      : `${withStyle}${scriptTag}`;
  }, [files, language]);

  const openPreviewInBrowser = useCallback(() => {
    const blob = new Blob([combinedPreview], { type: "text/html" });
    window.open(URL.createObjectURL(blob), "_blank");
  }, [combinedPreview]);

  return {
    combinedPreview,
    openPreviewInBrowser,
  };
}
