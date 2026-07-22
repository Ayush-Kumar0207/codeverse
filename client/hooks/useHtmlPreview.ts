import { useCallback, useMemo } from "react";
import type { SupportedLanguage } from "@shared/types/language";

export interface PreviewState {
  combinedPreview: string;
  openPreviewInBrowser: () => void;
}

function escapeClosingElement(value: string, element: "script" | "style") {
  const needle = `</${element}`;
  let output = "";
  let cursor = 0;
  const lower = value.toLowerCase();

  while (cursor < value.length) {
    const match = lower.indexOf(needle, cursor);
    if (match < 0) return output + value.slice(cursor);
    output += value.slice(cursor, match) + `<\\/${value.slice(match + 2, match + 2 + element.length)}`;
    cursor = match + needle.length;
  }
  return output;
}

function removeBundledScript(html: string) {
  let output = "";
  let cursor = 0;
  const lower = html.toLowerCase();

  while (cursor < html.length) {
    const opening = lower.indexOf("<script", cursor);
    if (opening < 0) return output + html.slice(cursor);
    const openingEnd = lower.indexOf(">", opening);
    if (openingEnd < 0) return output + html.slice(cursor);
    const closing = lower.indexOf("</script>", openingEnd + 1);
    if (closing < 0) return output + html.slice(cursor);

    const tag = lower.slice(opening, openingEnd + 1).split(" ").join("");
    const localSource = tag.includes('src="./script.js"') ||
      tag.includes("src='./script.js'") ||
      tag.includes('src="script.js"') ||
      tag.includes("src='script.js'") ||
      tag.includes('src="/script.js"') ||
      tag.includes("src='/script.js'");

    output += html.slice(cursor, opening);
    if (!localSource) output += html.slice(opening, closing + 9);
    cursor = closing + 9;
  }
  return output;
}

function insertBeforeClosingElement(html: string, element: "head" | "body", content: string) {
  const index = html.toLowerCase().lastIndexOf(`</${element}>`);
  return index < 0 ? html + content : html.slice(0, index) + content + html.slice(index);
}

function composePreview(html: string, css: string, javascript: string, language: SupportedLanguage) {
  const source = removeBundledScript(html || "<!doctype html><html><head></head><body></body></html>");
  const style = `<style data-codeverse-preview-style>${escapeClosingElement(css, "style")}</style>`;
  const script = `<script data-codeverse-preview-script>${escapeClosingElement(javascript, "script")}</script>`;
  const languageMeta = `<meta name="codeverse-preview-language" content="${language}">`;
  return insertBeforeClosingElement(insertBeforeClosingElement(source, "head", languageMeta + style), "body", script);
}

export function useHtmlPreview(files: Record<string, string>, language: SupportedLanguage): PreviewState {
  const combinedPreview = useMemo(
    () => composePreview(files["index.html"] || "", files["style.css"] || "", files["script.js"] || "", language),
    [files, language]
  );

  const openPreviewInBrowser = useCallback(() => {
    const blobUrl = URL.createObjectURL(new Blob([combinedPreview], { type: "text/html" }));
    window.open(blobUrl, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  }, [combinedPreview]);

  return { combinedPreview, openPreviewInBrowser };
}
