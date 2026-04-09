"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  ImperativePanelHandle,
} from "react-resizable-panels";
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

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggleSimple } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

// Icons
import {
  FilePlus,
  Trash2,
  Save,
  Play,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  FileCode,
  FileText,
  Terminal,
  X,
  Maximize2,
  Minimize2,
  ExternalLink,
  Settings,
  MessageSquare,
  History,
  Folder,
} from "lucide-react";

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

  // Panel refs for programmatic resizing
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const bottomPanelRef = useRef<ImperativePanelHandle>(null);

  // Panel collapse states
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [bottomCollapsed, setBottomCollapsed] = useState(true);

  // Get file icon based on extension
  const getFileIcon = (filename: string) => {
    if (filename.endsWith(".md")) return <FileText className="h-4 w-4 text-blue-400" />;
    if (filename.endsWith(".html")) return <FileCode className="h-4 w-4 text-orange-400" />;
    if (filename.endsWith(".css")) return <FileCode className="h-4 w-4 text-blue-300" />;
    if (filename.endsWith(".js") || filename.endsWith(".ts") || filename.endsWith(".jsx") || filename.endsWith(".tsx"))
      return <FileCode className="h-4 w-4 text-yellow-400" />;
    if (filename.endsWith(".py")) return <FileCode className="h-4 w-4 text-green-400" />;
    return <FileCode className="h-4 w-4 text-muted-foreground" />;
  };

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading Project...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-screen flex flex-col bg-background overflow-hidden font-sans">
        {/* Professional IDE Header */}
        <header className="h-12 flex items-center justify-between px-4 border-b bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="flex items-center justify-center h-7 w-7 rounded bg-gradient-to-br from-primary to-accent">
                <span className="text-xs font-bold text-primary-foreground">CV</span>
              </div>
              <h1 className="text-sm font-semibold tracking-tight">
                {project.title}
                <span className="text-muted-foreground font-normal"> — {project.language}</span>
              </h1>
            </motion.div>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewFileModal(true)}
                    className="h-8 gap-1.5"
                  >
                    <FilePlus className="h-4 w-4" />
                    <span className="hidden sm:inline">New File</span>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>Create new file</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={!activeFile}
                    className="h-8 gap-1.5 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>Delete current file</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-5 mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSave}
                    className="h-8 gap-1.5"
                  >
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>Save changes</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    onClick={handleRun}
                    disabled={loading}
                    className="h-8 gap-1.5 bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4" />
                    <span className="hidden sm:inline">{loading ? "Running..." : "Run"}</span>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>Execute code</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-5 mx-1" />

            <ThemeToggleSimple variant="ghost" size="sm" />
          </div>
        </header>

        {/* Resizable IDE Layout */}
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Left Sidebar - File Explorer */}
          <Panel
            ref={leftPanelRef}
            defaultSize={15}
            minSize={10}
            maxSize={25}
            collapsible
            collapsedSize={0}
            onCollapse={() => setLeftCollapsed(true)}
            onExpand={() => setLeftCollapsed(false)}
            className="flex flex-col bg-sidebar border-r"
          >
            <div className="h-9 flex items-center justify-between px-3 border-b">
              <span className="text-xs font-semibold text-sidebar-foreground uppercase tracking-wider">
                Explorer
              </span>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setShowNewFileModal(true)}
                    >
                      <FilePlus className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New file</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => leftPanelRef.current?.collapse()}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Collapse sidebar</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground">
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>{project.title}</span>
                </div>
                <AnimatePresence>
                  {Object.keys(files).map((file, index) => (
                    <motion.div
                      key={file}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <button
                        onClick={() => setActiveFile(file)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-sm transition-colors",
                          file === activeFile
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        {getFileIcon(file)}
                        <span className="truncate">{file}</span>
                        {file === activeFile && (
                          <motion.div
                            layoutId="active-file-indicator"
                            className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                          />
                        )}
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </Panel>

          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

          {/* Center Panel - Editor */}
          <Panel defaultSize={60} minSize={30} className="flex flex-col">
            <PanelGroup direction="vertical">
              {/* Editor Area */}
              <Panel defaultSize={70} minSize={20} className="flex flex-col">
                {/* Tabs */}
                <div className="h-9 flex items-center bg-muted/30 border-b overflow-x-auto">
                  <AnimatePresence mode="popLayout">
                    {Object.keys(files).map((file) => (
                      <motion.button
                        key={file}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onClick={() => setActiveFile(file)}
                        className={cn(
                          "group flex items-center gap-2 px-3 py-2 text-xs border-r min-w-fit transition-colors",
                          file === activeFile
                            ? "bg-background text-foreground border-t-2 border-t-primary"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {getFileIcon(file)}
                        <span className="truncate max-w-[120px]">{file}</span>
                        {file === activeFile && (
                          <X
                            className="h-3 w-3 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (Object.keys(files).length > 1) {
                                const filesList = Object.keys(files);
                                const currentIndex = filesList.indexOf(file);
                                const nextFile = filesList[currentIndex + 1] || filesList[currentIndex - 1];
                                if (nextFile) setActiveFile(nextFile);
                              }
                            }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Editor Content */}
                <div className="flex-1 relative">
                  {activeFile.endsWith(".md") ? (
                    <div className="h-full flex flex-col">
                      <div className="flex-1">
                        <CodeEditor
                          ref={editorRef}
                          value={files[activeFile]}
                          onChange={(newCode) =>
                            setFiles((prev) => ({ ...prev, [activeFile]: newCode }))
                          }
                          activeFile={activeFile}
                          roomId={roomId}
                        />
                      </div>
                      <ScrollArea className="h-1/2 border-t">
                        <div className="p-4 prose prose-invert max-w-none">
                          <ReactMarkdown>{files[activeFile]}</ReactMarkdown>
                        </div>
                      </ScrollArea>
                    </div>
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

                  {/* HTML Preview Overlay */}
                  <AnimatePresence>
                    {language === "html" && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute top-4 right-4 w-96 bg-card border rounded-lg shadow-lg overflow-hidden"
                      >
                        <div className="h-8 flex items-center justify-between px-3 border-b bg-muted/50">
                          <span className="text-xs font-medium">Preview</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={openPreviewInBrowser}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <iframe
                          className="w-full h-64 bg-white"
                          sandbox="allow-scripts allow-same-origin"
                          srcDoc={combinedPreview}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Panel>

              <PanelResizeHandle className="h-1 bg-border hover:bg-primary/50 transition-colors" />

              {/* Bottom Panel - Terminal/Output */}
              <Panel
                ref={bottomPanelRef}
                defaultSize={30}
                minSize={10}
                collapsible
                collapsedSize={5}
                onCollapse={() => setBottomCollapsed(true)}
                onExpand={() => setBottomCollapsed(false)}
                className="flex flex-col bg-card"
              >
                <div className="h-8 flex items-center justify-between px-3 border-b bg-muted/30">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => bottomPanelRef.current?.expand()}
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-medium transition-colors",
                        !bottomCollapsed && "text-foreground"
                      )}
                    >
                      <Terminal className="h-3.5 w-3.5" />
                      <span>Terminal</span>
                    </button>
                    <button
                      onClick={() => bottomPanelRef.current?.expand()}
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-medium transition-colors",
                        !bottomCollapsed && "text-foreground"
                      )}
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Output</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setOutput("")}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        bottomCollapsed
                          ? bottomPanelRef.current?.expand()
                          : bottomPanelRef.current?.collapse()
                      }
                    >
                      {bottomCollapsed ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {!bottomCollapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 p-3 font-mono text-sm overflow-auto"
                    >
                      {output ? (
                        <pre
                          className={cn(
                            "whitespace-pre-wrap",
                            output.includes("Error") || output.includes("❌")
                              ? "text-red-400"
                              : output.includes("⚠️")
                              ? "text-yellow-400"
                              : "text-green-400"
                          )}
                        >
                          {output}
                        </pre>
                      ) : (
                        <span className="text-muted-foreground">
                          Run your code to see output here...
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

          {/* Right Sidebar - Chat & History */}
          <Panel
            ref={rightPanelRef}
            defaultSize={25}
            minSize={15}
            maxSize={35}
            collapsible
            collapsedSize={0}
            onCollapse={() => setRightCollapsed(true)}
            onExpand={() => setRightCollapsed(false)}
            className="flex flex-col bg-sidebar border-l"
          >
            <div className="h-9 flex items-center justify-between px-3 border-b">
              <span className="text-xs font-semibold text-sidebar-foreground uppercase tracking-wider">
                Collaboration
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => rightPanelRef.current?.collapse()}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Chat Section */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="h-8 flex items-center gap-2 px-3 border-b bg-muted/30">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">Chat</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ChatBox roomId={roomId} />
                </div>
              </div>

              <Separator />

              {/* Version History Section */}
              {user && user._id && (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="h-8 flex items-center gap-2 px-3 border-b bg-muted/30">
                    <History className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Version History</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <VersionHistory
                      userId={user._id}
                      fileName={activeFile}
                      onRevert={(nextCode) =>
                        setFiles((prev) => ({ ...prev, [activeFile]: nextCode }))
                      }
                      refreshSignal={refreshCount}
                    />
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>

        {/* Collapsed Sidebar Toggles */}
        {leftCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-l-none shadow-lg"
                  onClick={() => leftPanelRef.current?.expand()}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Show Explorer</TooltipContent>
            </Tooltip>
          </motion.div>
        )}

        {rightCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-r-none shadow-lg"
                  onClick={() => rightPanelRef.current?.expand()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Show Collaboration</TooltipContent>
            </Tooltip>
          </motion.div>
        )}

        {/* New File Dialog */}
        <Dialog open={showNewFileModal} onOpenChange={setShowNewFileModal}>
          <DialogContent className="sm:max-w-[425px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FilePlus className="h-5 w-5 text-primary" />
                  Create New File
                </DialogTitle>
                <DialogDescription>
                  Enter a filename with extension (e.g., example.py, index.js)
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="example.py"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      const created = createFile();
                      if (!created) alert("Invalid or duplicate filename.");
                    }
                  }}
                  className="col-span-3"
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewFileModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const created = createFile();
                    if (!created) alert("Invalid or duplicate filename.");
                  }}
                >
                  Create File
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-[425px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Delete File
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete <strong>{activeFile}</strong>? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={deleteActiveFile}>
                  Delete
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
