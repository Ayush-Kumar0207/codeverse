"use client";

import { useCallback, useMemo, useState } from "react";
import { DEFAULT_LANGUAGE_FILES, LANGUAGE_FILE_MAP } from "@shared/constants/languages";
import { getLanguageFromFilename } from "./useLanguageDetection";
import type { SharedProject } from "@shared/types/project";
import type { SupportedLanguage } from "@shared/types/language";

const LANGUAGE_STARTERS: Partial<Record<SupportedLanguage, { file: string; code: string }>> = {
  javascript: {
    file: "script.js",
    code: "const message = 'Hello, CodeVerse!';\nconsole.log(message);\n",
  },
  typescript: {
    file: "main.ts",
    code: "const message: string = 'Hello, CodeVerse!';\nconsole.log(message);\n",
  },
  python: {
    file: "main.py",
    code: "def main():\n    print('Hello, CodeVerse!')\n\n\nif __name__ == '__main__':\n    main()\n",
  },
  cpp: {
    file: "main.cpp",
    code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    cout << "Hello, CodeVerse!" << endl;\n    return 0;\n}\n',
  },
  c: {
    file: "main.c",
    code: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello, CodeVerse!\\n");\n    return 0;\n}\n',
  },
  java: {
    file: "Main.java",
    code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeVerse!");\n    }\n}\n',
  },
  json: {
    file: "data.json",
    code: '{\n  "name": "CodeVerse",\n  "ready": true\n}\n',
  },
  markdown: {
    file: "README.md",
    code: "# CodeVerse Notes\n\nStart writing here.\n",
  },
  plaintext: {
    file: "notes.txt",
    code: "CodeVerse notes\n",
  },
};

const HTML_STARTER_FILES: Record<string, string> = {
  "index.html": "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <title>CodeVerse Launchpad</title>\n    <link rel=\"stylesheet\" href=\"./style.css\" />\n  </head>\n  <body>\n    <main class=\"shell\">\n      <h1>Interactive Launchpad</h1>\n      <p id=\"status\">Click the button to calculate a real signal.</p>\n      <button id=\"run\">Analyze</button>\n    </main>\n    <script src=\"./script.js\"></script>\n  </body>\n</html>",
  "style.css": "body {\n  margin: 0;\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  background: #101827;\n  color: white;\n  font-family: Inter, system-ui, sans-serif;\n}\n\n.shell {\n  width: min(560px, 90vw);\n  padding: 32px;\n  border: 1px solid rgba(255, 255, 255, 0.14);\n  border-radius: 16px;\n  background: rgba(255, 255, 255, 0.08);\n}\n\nbutton {\n  border: 0;\n  border-radius: 10px;\n  background: #4f46e5;\n  color: white;\n  cursor: pointer;\n  font-weight: 700;\n  padding: 10px 16px;\n}\n",
  "script.js": "const scores = [72, 88, 91, 64];\n\ndocument.querySelector('#run').addEventListener('click', () => {\n  const best = Math.max(...scores);\n  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;\n  document.querySelector('#status').textContent = `Average ${average.toFixed(1)} | Best ${best}`;\n});\n",
};

function readmeFor(project: SharedProject) {
  return `# ${project.title}\n\nLanguage: ${project.language}\n\nUse the Run button to execute or preview this workspace.`;
}

function getProjectStarter(project: SharedProject) {
  if (project.language === "html") {
    return {
      files: {
        ...HTML_STARTER_FILES,
        "README.md": readmeFor(project),
      },
      activeFile: "index.html",
    };
  }

  const mappedFile = LANGUAGE_FILE_MAP[project.language as keyof typeof LANGUAGE_FILE_MAP];
  const fallback = LANGUAGE_STARTERS[project.language] || {
    file: mappedFile || "main.txt",
    code: mappedFile ? DEFAULT_LANGUAGE_FILES[mappedFile] || "" : "",
  };
  const fileName = fallback.file;

  return {
    files: {
      [fileName]: project.code || fallback.code || DEFAULT_LANGUAGE_FILES[fileName] || "",
      "README.md": readmeFor(project),
    },
    activeFile: fileName,
  };
}

function defaultContentForFile(name: string) {
  const lower = name.toLowerCase();

  if (lower.endsWith(".html")) return HTML_STARTER_FILES["index.html"];
  if (lower.endsWith(".css")) return "body {\n  margin: 0;\n}\n";
  if (lower.endsWith(".js")) return "console.log('Hello from CodeVerse');\n";
  if (lower.endsWith(".ts")) return "const message: string = 'Hello from CodeVerse';\nconsole.log(message);\n";
  if (lower.endsWith(".py")) return "print('Hello from CodeVerse')\n";
  if (lower.endsWith(".cpp") || lower.endsWith(".cc") || lower.endsWith(".cxx")) return LANGUAGE_STARTERS.cpp?.code || "";
  if (lower.endsWith(".c")) return LANGUAGE_STARTERS.c?.code || "";
  if (lower.endsWith(".java")) return LANGUAGE_STARTERS.java?.code || "";
  if (lower.endsWith(".md")) return "# New Markdown\n";
  if (lower.endsWith(".json")) return "{\n  \n}\n";

  return "";
}

type FileMutationResult = {
  files: Record<string, string>;
  activeFile: string;
};

export function useEditorState() {
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const initializeProjectFiles = useCallback((nextProject: SharedProject | null) => {
    if (!nextProject) return;

    const starter = getProjectStarter(nextProject);
    setFiles(starter.files);
    setActiveFile(starter.activeFile);
  }, []);

  const createFile = useCallback((): FileMutationResult | false => {
    const name = newFileName.trim();
    if (!name || files[name]) {
      return false;
    }

    const nextFiles = { ...files, [name]: defaultContentForFile(name) };
    setFiles(nextFiles);
    setActiveFile(name);
    setNewFileName("");
    setShowNewFileModal(false);
    return { files: nextFiles, activeFile: name };
  }, [files, newFileName]);

  const deleteActiveFile = useCallback((): FileMutationResult | false => {
    if (!activeFile || Object.keys(files).length <= 1) {
      alert("Cannot delete the last file.");
      setShowDeleteConfirm(false);
      return false;
    }

    const fileNames = Object.keys(files);
    const currentIndex = fileNames.indexOf(activeFile);
    const updated = { ...files };
    delete updated[activeFile];
    const remaining = Object.keys(updated);
    const next = remaining[Math.max(0, currentIndex - 1)] || remaining[0] || "";
    setFiles(updated);
    setActiveFile(next);
    setShowDeleteConfirm(false);
    return { files: updated, activeFile: next };
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

