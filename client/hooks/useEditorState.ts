"use client";

import { useCallback, useMemo, useState } from "react";
import { DEFAULT_LANGUAGE_FILES, LANGUAGE_FILE_MAP } from "@shared/constants/languages";
import { getLanguageFromFilename } from "./useLanguageDetection";
import type { SharedProject } from "@shared/types/project";

export function useEditorState() {
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const initializeProjectFiles = useCallback((nextProject: SharedProject | null) => {
    if (!nextProject) return;

    const baseFiles: Record<string, string> = {
      "index.html": DEFAULT_LANGUAGE_FILES["index.html"],
      "style.css": DEFAULT_LANGUAGE_FILES["style.css"],
      "script.js": DEFAULT_LANGUAGE_FILES["script.js"],
      "README.md": DEFAULT_LANGUAGE_FILES["README.md"],
    };

    const languageFile = LANGUAGE_FILE_MAP[nextProject.language];
    if (languageFile && !baseFiles[languageFile]) {
      baseFiles[languageFile] = DEFAULT_LANGUAGE_FILES[languageFile] || "";
    }

    setFiles(baseFiles);
    setActiveFile(languageFile || "index.html");
  }, []);

  const createFile = useCallback(() => {
    const name = newFileName.trim();
    if (!name || files[name]) {
      return false;
    }

    const defaultContent = name.endsWith(".html")
      ? "<!DOCTYPE html>\n<html><head><title>New File</title></head><body>\n</body></html>"
      : name.endsWith(".css")
        ? "body { }"
        : name.endsWith(".js")
          ? "console.log('New JS file');"
          : name.endsWith(".md")
            ? "# New Markdown"
            : "";

    setFiles((prev) => ({ ...prev, [name]: defaultContent }));
    setActiveFile(name);
    setNewFileName("");
    setShowNewFileModal(false);
    return true;
  }, [files, newFileName]);

  const deleteActiveFile = useCallback(() => {
    const updated = { ...files };
    delete updated[activeFile];
    const next = Object.keys(updated)[0] || "";
    setFiles(updated);
    setActiveFile(next);
    setShowDeleteConfirm(false);
  }, [activeFile, files]);

  const language = useMemo(() => getLanguageFromFilename(activeFile), [activeFile]);
  const code = files[activeFile] || "";

  return {
    files,
    setFiles,
    activeFile,
    setActiveFile,
    newFileName,
    setNewFileName,
    showNewFileModal,
    setShowNewFileModal,
    showDeleteConfirm,
    setShowDeleteConfirm,
    initializeProjectFiles,
    createFile,
    deleteActiveFile,
    language,
    code,
    getLanguageFromFilename,
  };
}

