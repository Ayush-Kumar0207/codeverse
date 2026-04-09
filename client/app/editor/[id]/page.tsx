"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ThemeProvider } from "next-themes";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/context/AuthContext";
import CodeEditor, { CodeEditorHandle } from "@/components/CodeEditor";
import ChatBox from "@/components/ChatBox";
import VersionHistory from "@/components/VersionHistory";
import { useEditorState } from "@/hooks/useEditorState";
import { useSocket } from "@/hooks/useSocket";
import { useCodeExecution } from "@/hooks/useCodeExecution";
import { useCodeSave } from "@/hooks/useCodeSave";
import { useHtmlPreview } from "@/hooks/useHtmlPreview";
import { fetchProjectById } from "@/services/projects";
import { executeCode } from "@/services/execution";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";
import type { SharedProject } from "@shared/types/project";

export default function EditorPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const roomId = id || "room1";
  const editorRef = useRef<CodeEditorHandle>(null);
  const { user } = useAuth();
  const { socket } = useSocket(roomId);

  const [project, setProject] = useState<SharedProject | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const {
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
  } = useEditorState();

  // Code execution hook
  const { output, loading, setOutput, setLoading } = useCodeExecution(
    socket,
    language,
    code,
    roomId,
    user ? { username: user.username } : null
  );

  // Code save hook
  const { handleSave } = useCodeSave(activeFile, code, () => {
    setRefreshCount((prev) => prev + 1);
  });

  // HTML preview hook
  const { combinedPreview, openPreviewInBrowser } = useHtmlPreview(files, language);

  // Load project
  useEffect(() => {
    if (!id) return;

    fetchProjectById(id)
      .then((res) => {
        setProject(res.project);
        initializeProjectFiles(res.project);
      })
      .catch((err) => {
        console.error("Failed to load project", err);
      });
  }, [id, initializeProjectFiles]);

  // Handle code execution
  const handleRun = async () => {
    // Check if language requires execution
    if (["html", "css", "markdown"].includes(language)) {
      setOutput("⚠️ This file doesn't require execution.");
      return;
    }

    const supportedLanguages: string[] = ["javascript", "python", "cpp", "c", "java"];
    if (!supportedLanguages.includes(language)) {
      setOutput("⚠️ Unsupported language.");
      return;
    }

    setLoading(true);
    socket?.emit(SOCKET_EVENTS.EXECUTION_START, {
      user: user?.username || "Guest",
      roomId,
      language,
    });
    setOutput("⏳ Running...");

    try {
      const res = await executeCode({
        code,
        language,
        roomId,
        user: user?.username || "Guest",
      });
      setOutput(res.output || "✅ No output");
    } catch (err) {
      console.error(err);
      setOutput("❌ Error during execution.");
      socket?.emit(SOCKET_EVENTS.EXECUTION_ERROR, {
        user: user?.username || "Guest",
        roomId,
        error: "Execution failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!project) return <p className="p-10">Loading Project...</p>;

  return (
    <ThemeProvider attribute="class">
      <div className="h-screen grid grid-rows-[auto_1fr] font-mono">
        {/* Header with controls */}
        <header className="flex justify-between items-center px-6 py-3 border-b border-gray-800 bg-[#0e0e16]">
          <h1 className="text-2xl font-bold text-purple-400">CodeVerse IDE</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowNewFileModal(true)}
              className="bg-blue-600 px-3 py-1 text-sm rounded"
            >
              + File
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={!activeFile}
              className="bg-red-600 px-3 py-1 text-sm rounded disabled:opacity-50"
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              className="bg-purple-600 px-4 py-1 rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={handleRun}
              className="bg-green-600 px-4 py-1 rounded text-sm"
            >
              {loading ? "Running..." : "Run"}
            </button>
          </div>
        </header>

        {/* Main editor layout */}
        <div className="grid grid-cols-[220px_1fr_350px] h-full overflow-hidden">
          {/* File sidebar */}
          <aside className="bg-[#1b1b2f] p-4 border-r border-gray-800 overflow-auto">
            <h2 className="text-sm text-gray-400 mb-2 font-semibold">Files</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              {Object.keys(files).map((file) => (
                <li
                  key={file}
                  className={`cursor-pointer px-2 py-1 rounded ${
                    file === activeFile
                      ? "bg-purple-600 text-white"
                      : "hover:text-purple-400"
                  }`}
                  onClick={() => setActiveFile(file)}
                >
                  {file}
                </li>
              ))}
            </ul>
          </aside>

          {/* Code editor */}
          <main className="bg-[#1e1e2e] p-4 overflow-auto flex flex-col">
            <h2 className="text-lg text-white font-semibold mb-2">
              {project.title} — {project.language}
            </h2>
            {activeFile.endsWith(".md") ? (
              <>
                <CodeEditor
                  ref={editorRef}
                  value={files[activeFile]}
                  onChange={(newCode) =>
                    setFiles((prev) => ({ ...prev, [activeFile]: newCode }))
                  }
                  activeFile={activeFile}
                  roomId={roomId}
                />
                <div className="mt-4 p-4 bg-white text-black rounded shadow prose max-w-full">
                  <ReactMarkdown>{files[activeFile]}</ReactMarkdown>
                </div>
              </>
            ) : (
              <CodeEditor
                ref={editorRef}
                value={code}
                onChange={(newCode) =>
                  setFiles((prev) => ({ ...prev, [activeFile]: newCode }))
                }
                activeFile={activeFile}
                roomId={roomId}
              />
            )}

            {/* HTML preview */}
            {language === "html" && (
              <>
                <div className="mt-4 border border-gray-700 rounded">
                  <iframe
                    className="w-full h-96"
                    sandbox="allow-scripts allow-same-origin"
                    srcDoc={combinedPreview}
                  />
                </div>
                <button
                  onClick={openPreviewInBrowser}
                  className="mt-2 px-4 py-2 bg-blue-600 rounded text-white text-sm"
                >
                  Open in Browser
                </button>
              </>
            )}

            {/* Code output */}
            {output &&
              language !== "html" &&
              !activeFile.endsWith(".md") && (
                <div className="mt-4 p-4 bg-black text-white border border-gray-700 rounded">
                  <strong className="text-green-400">Output:</strong>
                  <pre className="whitespace-pre-wrap text-green-300">
                    {output}
                  </pre>
                </div>
              )}
          </main>

          {/* Sidebar: Chat and Version History */}
          <aside className="bg-[#1b1b2f] p-4 border-l border-gray-800 hidden lg:flex flex-col gap-4 overflow-auto">
            <ChatBox roomId={roomId} />
            {user && user._id && (
              <VersionHistory
                userId={user._id}
                fileName={activeFile}
                onRevert={(nextCode) =>
                  setFiles((prev) => ({ ...prev, [activeFile]: nextCode }))
                }
                refreshSignal={refreshCount}
              />
            )}
          </aside>
        </div>

        {/* New File Modal */}
        {showNewFileModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1e1e2e] p-6 rounded border w-96 shadow">
              <h3 className="text-white text-lg mb-4">New File</h3>
              <input
                type="text"
                placeholder="example.py"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f172a] border border-gray-600 rounded text-white mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNewFileModal(false)}
                  className="bg-gray-600 px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const created = createFile();
                    if (!created) alert("Invalid or duplicate name.");
                  }}
                  className="bg-blue-600 px-3 py-1 rounded text-sm"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-[#1e1e2e] p-6 rounded border w-96 shadow">
              <h3 className="text-white text-lg mb-4">
                Delete &quot;{activeFile}&quot;?
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Are you sure you want to delete this file?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-600 px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteActiveFile}
                  className="bg-red-600 px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
