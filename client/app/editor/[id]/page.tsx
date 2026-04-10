"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AT_ALGORITHMS } from "@/data/algos";
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
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { fetchProjectById } from "@/services/projects";
import { executeCode } from "@/services/execution";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";
import type { SharedProject } from "@shared/types/project";
import DiffViewer from "@/components/DiffViewer";
import DeploymentModal from "@/components/DeploymentModal";
import { deployProject } from "@/services/deployment";
import dynamic from "next/dynamic";

const TerminalPanel = dynamic(() => import("@/components/TerminalPanel"), {
  ssr: false,
});

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
import { PresenceHeader } from "@/components/ActivityBar";
import AlgoTraceCanvas from "@/components/algotrace/AlgoTraceCanvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface PresenceUser {
  username: string;
  avatar?: string;
  status?: string;
}

export default function EditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const algoId = searchParams?.get("algo");
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const roomId = id || "room1";
  const editorRef = useRef<CodeEditorHandle>(null);
  const { user } = useAuth();
  const { socket } = useSocket(roomId);

  const [project, setProject] = useState<SharedProject | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);

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
  const { output, outputType, loading, setOutput, setOutputType, setLoading } = useCodeExecution(
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

  // Chronos Diff Engine State
  const [showDiffViewer, setShowDiffViewer] = useState(false);
  const [versionCode, setVersionCode] = useState("");
  const [versionDate, setVersionDate] = useState("");

  // AI assistant hook with Project Context
  const projectContext = Object.entries(files)
    .map(([name, content]) => `File: ${name}\nContent:\n${content}\n---\n`)
    .join("");

  const {
    prompt: aiPrompt,
    setPrompt: setAiPrompt,
    suggestion,
    loading: aiLoading,
    handleAsk,
    handleKeyDown: handleAiKeyDown,
  } = useAIAssistant({ code, context: projectContext });

  const handleCompare = (code: string, date: string) => {
    setVersionCode(code);
    setVersionDate(date);
    setShowDiffViewer(true);
  };

  const handleRevertFromDiff = () => {
    setFiles((prev) => ({ ...prev, [activeFile]: versionCode }));
    setShowDiffViewer(false);
  };

  // Aegis Deployment State
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [deploymentError, setDeploymentError] = useState("");

  const handleBeginDeployment = async () => {
    setIsDeploying(true);
    setDeploymentUrl("");
    setDeploymentError("");

    try {
      const res = await deployProject({
        projectId: id as string,
        files
      });
      setDeploymentUrl(res.url);
    } catch (err: any) {
      console.error(err);
      setDeploymentError(err.message || "Failed to initiate Aegis propagation.");
    }
  };

  // Load project
  useEffect(() => {
    if (!id) return;

    if (id === "demo-sandbox") {
      let initialCode = "// --- CodeVerse Simulation Mode ---\n\nfunction boot() {\n  console.log('System initialized.');\n  return 'GOD-LEVEL UI DETECTED';\n}\n\nboot();";
      
      // Dynamic Encyclopedia Payload Injection
      if (algoId) {
        const algo = AT_ALGORITHMS.find(a => a.id === algoId);
        if (algo && algo.visualizerCode) {
           initialCode = algo.visualizerCode;
        }
      }

      // Initialize with High-Fidelity Demo State
      const demoProject: SharedProject = {
        _id: "demo-sandbox",
        title: "Simulation Environment",
        language: "javascript",
        isDemo: true,
        code: initialCode,
      };
      setProject(demoProject);
      initializeProjectFiles(demoProject);
      return;
    }

    fetchProjectById(id)
      .then((res) => {
        setProject(res.project);
        initializeProjectFiles(res.project);
      })
      .catch((err) => {
        console.error("Failed to load project", err);
      });
  }, [id, initializeProjectFiles]);

  // Presence Logic
  useEffect(() => {
    if (!socket || !user) return;

    // Set initial user
    setActiveUsers([{ username: user.username, avatar: user.avatar, status: "Editing" }]);

    socket.on(SOCKET_EVENTS.USER_JOINED, (data: any) => {
      setActiveUsers(prev => {
        const exists = prev.find(u => u.username === data.username);
        if (exists) return prev;
        return [...prev, { username: data.username, avatar: data.avatar, status: "Joined" }];
      });
    });

    socket.on(SOCKET_EVENTS.USER_LEFT, (data: any) => {
      setActiveUsers(prev => prev.filter(u => u.username !== data.username));
    });

    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, (data: any) => {
      setActiveUsers(prev => prev.map(u => 
        u.username === data.username ? { ...u, status: data.status } : u
      ));
    });

    return () => {
      socket.off(SOCKET_EVENTS.USER_JOINED);
      socket.off(SOCKET_EVENTS.USER_LEFT);
      socket.off(SOCKET_EVENTS.PRESENCE_UPDATE);
    };
  }, [socket, user]);

  // Emit presence update when active file changes
  useEffect(() => {
    if (!socket || !user || !activeFile) return;
    
    socket.emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
      roomId,
      username: user.username,
      status: `Editing ${activeFile}`
    });
  }, [activeFile, socket, user, roomId]);

  // Handle code execution with Adaptive Logic
  const [activeBottomTab, setActiveBottomTab] = useState("terminal");

  const handleRun = async () => {
    setLoading(true);
    setBottomCollapsed(false);
    
    // Adaptive logic: If web file, we might skip the backend if it's purely static, 
    // but the backend now handles this perfectly with 'visual' type.
    
    socket?.emit(SOCKET_EVENTS.EXECUTION_START, {
      user: user?.username || "Guest",
      roomId,
      language,
    });
    
    // Switch to appropriate tab based on language immediately for better UX
    if (["html", "css", "markdown"].includes(language)) {
       setActiveBottomTab("output");
    } else {
       setActiveBottomTab("terminal");
    }

    try {
      const res = await executeCode({
        code,
        language,
        roomId,
        user: user?.username || "Guest",
        fileName: activeFile
      });
      
      setOutput(res.output || "✅ No output");
      setOutputType((res.type as any) || "terminal");
      
      // Intelligent Tab Switching based on backend response
      if (res.type === "visual") {
         setActiveBottomTab("output");
      } else {
         setActiveBottomTab("terminal");
      }
    } catch (err: any) {
      console.error(err);
      setOutput(err.message || "❌ Error during execution.");
      setOutputType("terminal");
      setActiveBottomTab("terminal");
    } finally {
      setLoading(false);
    }
  };

  // Internal Visual Preview Component
  const VisualPreview = () => {
    if (language === "markdown" || activeFile.endsWith(".md")) {
       return (
         <div className="p-6 prose prose-invert max-w-none h-full overflow-auto bg-background/50">
            <ReactMarkdown>{output || code}</ReactMarkdown>
         </div>
       );
    }

    // For HTML/CSS
    const previewContent = language === "html" ? output || code : combinedPreview;
    
    return (
      <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
         <div className="h-7 bg-slate-100 border-b flex items-center px-4 gap-2 shrink-0">
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
               <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="text-[10px] font-mono text-slate-400 truncate">preview://simulation-environment/index.html</div>
         </div>
         <iframe 
            srcDoc={previewContent}
            title="Preview"
            className="flex-1 w-full border-none shadow-inner"
            sandbox="allow-scripts"
         />
      </div>
    );
  };

  // Panel refs
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const bottomPanelRef = useRef<ImperativePanelHandle>(null);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [bottomCollapsed, setBottomCollapsed] = useState(true);

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
      <div className="h-full flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Initializing Midnight Shell...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background overflow-hidden font-sans border-l border-white/5">
        <PresenceHeader 
          projectTitle={project.title} 
          users={activeUsers}
          showBackButton
          backHref="/"
          onDeploy={handleBeginDeployment}
        />

        <PanelGroup direction="horizontal" className="flex-1">
          <Panel
            ref={leftPanelRef}
            defaultSize={15}
            minSize={10}
            maxSize={25}
            collapsible
            collapsedSize={0}
            onCollapse={() => setLeftCollapsed(true)}
            onExpand={() => setLeftCollapsed(false)}
            className="flex flex-col bg-[var(--sidebar-background)] border-r border-[var(--sidebar-border)]"
          >
            <div className="h-9 flex items-center justify-between px-3 border-b border-[var(--sidebar-border)] bg-black/20">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Explorer
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-white/5"
                  onClick={() => setShowNewFileModal(true)}
                >
                  <FilePlus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-0.5">
                <AnimatePresence>
                  {Object.keys(files).map((file, index) => (
                    <motion.div
                      key={file}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <button
                        onClick={() => setActiveFile(file)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-all duration-200 group relative",
                          file === activeFile
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        {getFileIcon(file)}
                        <span className="truncate">{file}</span>
                        {file === activeFile && (
                          <motion.div
                            layoutId="active-indicator"
                            className="absolute left-0 w-1 h-4 bg-primary rounded-r-full"
                          />
                        )}
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </Panel>

          <PanelResizeHandle className="w-[1px] bg-white/5 hover:bg-primary/30 transition-colors" />

          <Panel defaultSize={60} minSize={30} className="flex flex-col bg-background">
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={20} className="flex flex-col">
                <div className="h-9 flex items-center bg-black/20 border-b border-white/5 overflow-x-auto no-scrollbar">
                  {Object.keys(files).map((file) => (
                    <button
                      key={file}
                      onClick={() => setActiveFile(file)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-[11px] border-r border-white/5 min-w-fit transition-all relative group",
                        file === activeFile
                          ? "bg-background text-foreground"
                          : "bg-black/40 text-muted-foreground hover:bg-black/20"
                      )}
                    >
                      {getFileIcon(file)}
                      <span className="truncate max-w-[150px]">{file}</span>
                      {file === activeFile && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                      <X
                        className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </button>
                  ))}
                </div>

                <div className="flex-1 relative bg-[var(--editor-background)]">
                    <CodeEditor
                     ref={editorRef}
                     value={files[activeFile] || ""}
                     onChange={(newCode: string) =>
                       setFiles((prev) => ({ ...prev, [activeFile]: newCode }))
                     }
                     activeFile={activeFile}
                     roomId={roomId}
                     currentUser={user?.username || "Guest"}
                   />
                  
                  {/* Global Actions Overlay */}
                  <div className="absolute top-4 right-6 flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" onClick={handleSave} className="h-8 shadow-2xl">
                        <Save className="w-3.5 h-3.5 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" onClick={handleRun} disabled={loading} className="h-8 shadow-2xl bg-primary hover:bg-primary/90">
                        <Play className="w-3.5 h-3.5 mr-2" />
                        Run
                      </Button>
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-[1px] bg-white/5 hover:bg-primary/30 transition-colors" />

              <Panel
                ref={bottomPanelRef}
                defaultSize={30}
                minSize={8}
                collapsible
                collapsedSize={4}
                onCollapse={() => setBottomCollapsed(true)}
                onExpand={() => setBottomCollapsed(false)}
                className="flex flex-col bg-black/40"
              >
                <Tabs value={activeBottomTab} onValueChange={setActiveBottomTab} className="h-full flex flex-col">
                   <div className="h-8 flex items-center justify-between px-3 border-b border-white/5 bg-black/20 shrink-0">
                     <TabsList className="bg-transparent h-7 p-0 gap-4">
                        <TabsTrigger 
                           value="terminal" 
                           className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-7 px-0"
                        >
                           Terminal
                        </TabsTrigger>
                        <TabsTrigger 
                           value="output" 
                           className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-7 px-0"
                        >
                           Output
                        </TabsTrigger>
                     </TabsList>
                     <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setBottomCollapsed(!bottomCollapsed)}>
                       {bottomCollapsed ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                     </Button>
                   </div>

                   {!bottomCollapsed && (
                     <div className="flex-1 overflow-hidden">
                        <TabsContent value="terminal" className="h-full m-0 bg-black/40">
                           <TerminalPanel 
                              output={outputType === "terminal" ? output : `✅ Visual output ready in 'Output' tab.\n[Neural Identity synced]`} 
                              onData={() => {}}
                           />
                        </TabsContent>
                        <TabsContent value="output" className="h-full m-0 bg-black/60 p-4">
                           <VisualPreview />
                        </TabsContent>
                        <TabsContent value="history" className="h-full m-0 bg-black/20">
                          <VersionHistory
                            userId={user?._id || "demo"}
                            fileName={activeFile}
                            onRevert={(newCode) => setFiles((prev) => ({ ...prev, [activeFile]: newCode }))}
                            onCompare={handleCompare}
                            refreshSignal={refreshCount}
                          />
                        </TabsContent>
                     </div>
                   )}
                </Tabs>
              </Panel>
            </PanelGroup>
          </Panel>

          <AnimatePresence>
            {showDiffViewer && (
              <DiffViewer
                originalCode={versionCode}
                modifiedCode={files[activeFile]}
                fileName={activeFile}
                versionDate={versionDate}
                onClose={() => setShowDiffViewer(false)}
                onRevert={handleRevertFromDiff}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            <DeploymentModal
              isOpen={isDeploying}
              onClose={() => setIsDeploying(false)}
              deploymentUrl={deploymentUrl}
              error={deploymentError}
              projectName={project.title}
            />
          </AnimatePresence>

          <PanelResizeHandle className="w-[1px] bg-white/5 hover:bg-primary/30 transition-colors" />

          <Panel
            ref={rightPanelRef}
            defaultSize={25}
            minSize={15}
            maxSize={35}
            collapsible
            collapsedSize={0}
            onCollapse={() => setRightCollapsed(true)}
            onExpand={() => setRightCollapsed(false)}
            className="flex flex-col bg-[var(--sidebar-background)] border-l border-[var(--sidebar-border)]"
          >
            <Tabs defaultValue="assistant" className="h-full">
              <div className="h-9 flex items-center justify-between px-3 border-b border-[var(--sidebar-border)] bg-black/20">
                <TabsList className="h-7">
                  <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
                  <TabsTrigger value="algotrace">AlgoTrace</TabsTrigger>
                </TabsList>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => rightPanelRef.current?.collapse()}
                  aria-label="Collapse right panel"
                  title="Collapse right panel"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                <TabsContent value="assistant" className="h-full m-0">
                  <ChatBox roomId={roomId} />
                  <Separator className="bg-white/5" />
                  <div className="p-4 bg-black/20 border-t border-white/5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Capabilities</div>
                    <div className="space-y-2">
                      <div className="px-2 py-1.5 bg-white/5 rounded text-[10px] text-foreground/70">Debug current selection</div>
                      <div className="px-2 py-1.5 bg-white/5 rounded text-[10px] text-foreground/70">Refactor active file</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="algotrace" className="h-full m-0">
                  <AlgoTraceCanvas editorCode={code} />
                </TabsContent>
              </div>
            </Tabs>
          </Panel>
        </PanelGroup>

        {/* Floating Toggle for explorer if collapsed */}
        {leftCollapsed && (
           <Button 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-4 rounded-l-none bg-primary p-0"
            onClick={() => leftPanelRef.current?.expand()}
           >
            <ChevronRight className="w-3 h-3" />
           </Button>
        )}
        
        {/* Floating Toggle for AI if collapsed */}
        {rightCollapsed && (
           <Button 
            className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-4 rounded-r-none bg-primary p-0"
            onClick={() => rightPanelRef.current?.expand()}
            aria-label="Expand right panel"
            title="Expand right panel"
           >
            <ChevronLeft className="w-3 h-3" />
           </Button>
        )}

        {/* Dialogs */}
        <Dialog open={showNewFileModal} onOpenChange={setShowNewFileModal}>
          <DialogContent className="sm:max-w-[425px] bg-card border-primary/20 glass-effect">
            <DialogHeader>
              <DialogTitle className="font-outfit font-black tracking-tight text-gradient">CREATE NEW FILE</DialogTitle>
              <DialogDescription className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                Enter filename with extension (e.g. main.py)
              </DialogDescription>
            </DialogHeader>
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="index.js"
              className="mt-4 bg-black/40 border-white/5 focus:border-primary/50"
              autoFocus
            />
            <DialogFooter className="mt-6">
              <Button variant="ghost" onClick={() => setShowNewFileModal(false)}>Cancel</Button>
              <Button onClick={() => { createFile(); setShowNewFileModal(false); }}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-[425px] bg-card border-primary/20 glass-effect">
            <DialogHeader>
              <DialogTitle className="text-destructive font-outfit font-black tracking-tight uppercase">Delete File</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {activeFile}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
                <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                <Button variant="destructive" onClick={deleteActiveFile}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
