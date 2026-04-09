import { useState, useCallback } from "react";
import type { SharedProject } from "@shared/types/project";

export interface FileManager {
  files: Record<string, string>;
  setFiles: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  activeFile: string;
  setActiveFile: (file: string) => void;
  newFileName: string;
  setNewFileName: (name: string) => void;
  showNewFileModal: boolean;
  setShowNewFileModal: (show: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  initializeProjectFiles: (project: SharedProject) => void;
  createFile: () => boolean;
  deleteActiveFile: () => void;
}

export function useEditorFileManager(): FileManager {
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const initializeProjectFiles = useCallback((project: SharedProject) => {
    const defaultFiles: Record<string, string> = {
      "main.js": "console.log('Hello, CodeVerse!');",
      "README.md": `# ${project.title}\n\nLanguage: ${project.language}`,
    };

    if (project.language === "python") {
      defaultFiles["main.py"] = "print('Hello, CodeVerse!')";
      delete defaultFiles["main.js"];
    } else if (project.language === "cpp") {
      defaultFiles["main.cpp"] = '#include <iostream>\nint main() { std::cout << "Hello, CodeVerse!"; }';
      delete defaultFiles["main.js"];
    } else if (project.language === "java") {
      defaultFiles["Main.java"] = 'public class Main { public static void main(String[] args) { System.out.println("Hello, CodeVerse!"); } }';
      delete defaultFiles["main.js"];
    } else if (project.language === "c") {
      defaultFiles["main.c"] = '#include <stdio.h>\nint main() { printf("Hello, CodeVerse!\\n"); return 0; }';
      delete defaultFiles["main.js"];
    } else if (project.language === "html") {
      defaultFiles["index.html"] = "<!DOCTYPE html>\n<html>\n<body><h1>Hello, CodeVerse!</h1></body>\n</html>";
      defaultFiles["style.css"] = "body { font-family: Arial; }";
      defaultFiles["script.js"] = "console.log('Script loaded');";
      delete defaultFiles["main.js"];
    }

    setFiles(defaultFiles);
    setActiveFile(Object.keys(defaultFiles)[0]);
  }, []);

  const createFile = useCallback(() => {
    if (!newFileName.trim() || files[newFileName]) {
      return false;
    }
    setFiles((prev) => ({ ...prev, [newFileName]: "" }));
    setActiveFile(newFileName);
    setNewFileName("");
    setShowNewFileModal(false);
    return true;
  }, [newFileName, files]);

  const deleteActiveFile = useCallback(() => {
    if (!activeFile || Object.keys(files).length === 1) {
      alert("Cannot delete the last file.");
      return;
    }
    const remaining = Object.keys(files).filter((f) => f !== activeFile);
    setFiles((prev) => {
      const updated = { ...prev };
      delete updated[activeFile];
      return updated;
    });
    setActiveFile(remaining[0]);
    setShowDeleteConfirm(false);
  }, [activeFile, files]);

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
  };
}
