"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { ThemeProvider } from "next-themes";
import axios from "axios";
import socket from "@/lib/socket";

import { useAuth } from "@/context/AuthContext";
import CodeEditor, { CodeEditorHandle } from "@/components/CodeEditor";
import ChatBox from "@/components/ChatBox";
import VersionHistory from "@/components/VersionHistory";
import ReactMarkdown from "react-markdown";

// 🔠 Types
type Project = {
  _id: string;
  title: string;
  language: "javascript" | "python" | "cpp" | "c" | "java";
};

type LanguageExtensionMap = {
  [key in Project["language"]]: string;
};

type DefaultCodeMap = {
  [key: string]: string;
};

export default function EditorPage() {
  const { id } = useParams();
  const editorRef = useRef<CodeEditorHandle>(null);
  const { user, token } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const [activeFile, setActiveFile] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const ROOM_ID = id;

  // 🎯 Fetch project details on load
  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5000/api/projects/${id}`)
      .then((res) => {
        setProject(res.data.project);
        const initialLang = res.data.project.language as keyof LanguageExtensionMap;

        const baseFiles: Record<string, string> = {
          "index.html": "<!DOCTYPE html>\n<html>\n<head><title>New Project</title></head><body>\n<h1>Hello World!</h1>\n</body></html>",
          "style.css": "body {\n  font-family: sans-serif;\n}",
          "script.js": "console.log('Hello JS');",
          "README.md": "# Welcome to CodeVerse\n\nEdit your markdown here.",
        };

        const extMap: LanguageExtensionMap = {
          javascript: "script.js",
          python: "main.py",
          cpp: "main.cpp",
          c: "main.c",
          java: "Main.java",
        };

        const defaultCodeMap: DefaultCodeMap = {
          "main.py": "print('Hello Python')",
          "main.cpp": "#include<iostream>\nint main(){ std::cout << \"Hello C++\"; return 0; }",
          "main.c": "#include<stdio.h>\nint main(){ printf(\"Hello C\"); return 0; }",
          "Main.java": "public class Main { public static void main(String[] args) { System.out.println(\"Hello Java\"); } }",
        };

        const languageFile = extMap[initialLang];
        if (languageFile && !baseFiles[languageFile]) {
          baseFiles[languageFile] = defaultCodeMap[languageFile] || "";
        }

        setFiles(baseFiles);
        setActiveFile(languageFile || "index.html");
      })
      .catch((err) => {
        console.error("Failed to load project", err);
      });
  }, [id]);

  const getLanguage = (filename: string) => {
    if (filename.endsWith(".html")) return "html";
    if (filename.endsWith(".css")) return "css";
    if (filename.endsWith(".js")) return "javascript";
    if (filename.endsWith(".py")) return "python";
    if (filename.endsWith(".java")) return "java";
    if (filename.endsWith(".cpp")) return "cpp";
    if (filename.endsWith(".c")) return "c";
    if (filename.endsWith(".md")) return "markdown";
    return "plaintext";
  };

  const language = getLanguage(activeFile);
  const code = files[activeFile] || "";

  const handleRun = async () => {
    const unsupported = ["html", "css", "markdown"];
    if (unsupported.includes(language)) {
      setOutput("⚠️ This file doesn't require execution.");
      return;
    }

    setLoading(true);
    socket.emit("execution:start", { user: user?.username || "Guest", roomId: ROOM_ID, language });
    setOutput("⏳ Running...");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/execute",
        {
          code,
          language,
          roomId: ROOM_ID,
          user: user?.username || "Guest",
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setOutput(res.data.output || "✅ No output");
    } catch (err) {
      console.error(err);
      setOutput("❌ Error during execution.");
      socket.emit("execution:error", { user: user?.username || "Guest", roomId: ROOM_ID, error: "Execution failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !token) {
      alert("Login required to save.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/code/save",
        {
          code,
          userId: user._id,
          fileName: activeFile,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Saved and snapshot created.");
      setRefreshCount((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save.");
    }
  };

  const handleCreateFile = () => {
    const name = newFileName.trim();
    if (!name || files[name]) {
      alert("Invalid or duplicate name.");
      return;
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
  };

  const handleDeleteFile = () => {
    const updated = { ...files };
    delete updated[activeFile];
    const next = Object.keys(updated)[0] || "";
    setFiles(updated);
    setActiveFile(next);
    setShowDeleteConfirm(false);
  };

  useEffect(() => {
    socket.on("execution:result", (data) => {
      setOutput(`👤 ${data.user}:\n${data.output}`);
    });

    socket.on("execution:error", (data) => {
      setOutput(`❌ ${data.user}'s code failed:\n${data.error}`);
    });

    return () => {
      socket.off("execution:start");
      socket.off("execution:result");
      socket.off("execution:error");
    };
  }, []);

  const combinedPreview = `
    ${files["index.html"] || ""}
    <style>${files["style.css"] || ""}</style>
    <script>${files["script.js"] || ""}</script>
  `;

  if (!project) return <p className="p-10">Loading Project...</p>;

  return (
    <ThemeProvider attribute="class">
      <div className="h-screen grid grid-rows-[auto_1fr] font-mono">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-3 border-b border-gray-800 bg-[#0e0e16]">
          <h1 className="text-2xl font-bold text-purple-400">CodeVerse IDE</h1>
          <div className="flex gap-3">
            <button onClick={() => setShowNewFileModal(true)} className="bg-blue-600 px-3 py-1 text-sm rounded">+ File</button>
            <button onClick={() => setShowDeleteConfirm(true)} disabled={!activeFile} className="bg-red-600 px-3 py-1 text-sm rounded">Delete</button>
            <button onClick={handleSave} className="bg-purple-600 px-4 py-1 rounded text-sm">Save</button>
            <button onClick={handleRun} className="bg-green-600 px-4 py-1 rounded text-sm">{loading ? "Running..." : "Run"}</button>
          </div>
        </header>

        {/* Layout */}
        <div className="grid grid-cols-[220px_1fr_350px] h-full overflow-hidden">
          {/* Sidebar */}
          <aside className="bg-[#1b1b2f] p-4 border-r border-gray-800 overflow-auto">
            <h2 className="text-sm text-gray-400 mb-2 font-semibold">Files</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              {Object.keys(files).map((file) => (
                <li key={file} className={`cursor-pointer px-2 py-1 rounded ${file === activeFile ? "bg-purple-600 text-white" : "hover:text-purple-400"}`} onClick={() => setActiveFile(file)}>
                  {file}
                </li>
              ))}
            </ul>
          </aside>

          {/* Editor */}
          <main className="bg-[#1e1e2e] p-4 overflow-auto flex flex-col">
            <h2 className="text-lg text-white font-semibold mb-2">{project.title} — {project.language}</h2>
            {activeFile.endsWith(".md") ? (
              <>
                <CodeEditor
                  ref={editorRef}
                  value={files[activeFile]}
                  onChange={(newCode) => setFiles((prev) => ({ ...prev, [activeFile]: newCode }))}
                  activeFile={activeFile}
                />
                <div className="mt-4 p-4 bg-white text-black rounded shadow prose max-w-full">
                  <ReactMarkdown>{files[activeFile]}</ReactMarkdown>
                </div>
              </>
            ) : (
              <CodeEditor
                ref={editorRef}
                value={code}
                onChange={(newCode) => setFiles((prev) => ({ ...prev, [activeFile]: newCode }))}
                activeFile={activeFile}
              />
            )}

            {language === "html" && (
              <>
                <div className="mt-4 border border-gray-700 rounded">
                  <iframe className="w-full h-96" sandbox="allow-scripts allow-same-origin" srcDoc={combinedPreview} />
                </div>
                <button onClick={() => {
                  const blob = new Blob([combinedPreview], { type: "text/html" });
                  window.open(URL.createObjectURL(blob), "_blank");
                }} className="mt-2 px-4 py-2 bg-blue-600 rounded text-white text-sm">
                  Open in Browser
                </button>
              </>
            )}

            {output && language !== "html" && !activeFile.endsWith(".md") && (
              <div className="mt-4 p-4 bg-black text-white border border-gray-700 rounded">
                <strong className="text-green-400">Output:</strong>
                <pre className="whitespace-pre-wrap text-green-300">{output}</pre>
              </div>
            )}
          </main>

          {/* Chat + Versions */}
          <aside className="bg-[#1b1b2f] p-4 border-l border-gray-800 hidden lg:flex flex-col gap-4 overflow-auto">
            <ChatBox />
            {user && user._id && (
              <VersionHistory
                userId={user._id}
                fileName={activeFile}
                onRevert={(code) => setFiles((prev) => ({ ...prev, [activeFile]: code }))}
                refreshSignal={refreshCount}
              />
            )}
          </aside>
        </div>

        {/* Modals */}
        {showNewFileModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1e1e2e] p-6 rounded border w-96 shadow">
              <h3 className="text-white text-lg mb-4">New File</h3>
              <input type="text" placeholder="example.py" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} className="w-full px-3 py-2 bg-[#0f172a] border border-gray-600 rounded text-white mb-4" />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowNewFileModal(false)} className="bg-gray-600 px-3 py-1 rounded text-sm">Cancel</button>
                <button onClick={handleCreateFile} className="bg-blue-600 px-3 py-1 rounded text-sm">Create</button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-[#1e1e2e] p-6 rounded border w-96 shadow">
              <h3 className="text-white text-lg mb-4">Delete &quot;{activeFile}&quot;?</h3>
              <p className="text-sm text-gray-400 mb-4">Are you sure you want to delete this file?</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-600 px-3 py-1 rounded text-sm">Cancel</button>
                <button onClick={handleDeleteFile} className="bg-red-600 px-3 py-1 rounded text-sm">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
