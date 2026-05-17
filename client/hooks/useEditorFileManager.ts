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
      defaultFiles["index.html"] = "<!DOCTYPE html>\n<html>\n<head>\n  <title>CodeVerse Launchpad</title>\n  <link rel=\"stylesheet\" href=\"style.css\" />\n</head>\n<body>\n  <main class=\"shell\">\n    <h1>Interactive Launchpad</h1>\n    <p id=\"status\">Click the button to calculate a real signal.</p>\n    <button id=\"run\">Analyze</button>\n  </main>\n  <script src=\"script.js\"></script>\n</body>\n</html>";
      defaultFiles["style.css"] = "body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: Inter, system-ui, sans-serif; background: #101827; color: white; }\n.shell { width: min(520px, 90vw); padding: 32px; border: 1px solid rgba(255,255,255,.14); border-radius: 16px; background: rgba(255,255,255,.08); }\nbutton { padding: 10px 16px; border: 0; border-radius: 10px; background: #4f46e5; color: white; font-weight: 700; }";
      defaultFiles["script.js"] = "const scores = [72, 88, 91, 64];\ndocument.querySelector('#run').addEventListener('click', () => {\n  const best = Math.max(...scores);\n  const average = scores.reduce((a, b) => a + b, 0) / scores.length;\n  document.querySelector('#status').textContent = `Average ${average.toFixed(1)} | Best ${best}`;\n});";
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
