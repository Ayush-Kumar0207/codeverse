"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { AnimatePresence, motion } from "framer-motion";
import { FilePlus, Minimize2, Trash2 } from "lucide-react";
import { Panel } from "react-resizable-panels";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { WorkspaceFileIcon } from "./WorkspaceFileIcon";

interface WorkspaceExplorerPanelProps {
  panelRef: RefObject<ImperativePanelHandle | null>;
  compact: boolean;
  fullscreen: boolean;
  files: Record<string, string>;
  activeFile: string;
  canEdit: boolean;
  setActiveFile: Dispatch<SetStateAction<string>>;
  setNotice: Dispatch<SetStateAction<string>>;
  onCollapse: () => void;
  onExpand: () => void;
  onCloseFullscreen: () => void;
  onCreateFile: () => void;
  onRequestDelete: (fileName: string) => void;
}

export function WorkspaceExplorerPanel({
  panelRef,
  compact,
  fullscreen,
  files,
  activeFile,
  canEdit,
  setActiveFile,
  setNotice,
  onCollapse,
  onExpand,
  onCloseFullscreen,
  onCreateFile,
  onRequestDelete,
}: WorkspaceExplorerPanelProps) {
  return (
    <Panel
      ref={panelRef}
      defaultSize={compact ? 0 : 15}
      minSize={compact ? 0 : 12}
      maxSize={24}
      collapsible
      collapsedSize={0}
      onCollapse={onCollapse}
      onExpand={onExpand}
      className={cn(
        "flex flex-col border-r border-slate-800 bg-[#0a0f19]",
        !fullscreen && "max-lg:hidden",
        fullscreen && "fixed inset-0 z-50 h-screen !w-screen !flex-none border border-slate-800 shadow-2xl shadow-black/60"
      )}
    >
      <div className="flex h-10 items-center justify-between border-b border-slate-800 px-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Explorer</span>
        <div className="flex items-center gap-1">
          {fullscreen && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              onClick={onCloseFullscreen}
              aria-label="Close explorer"
            >
              <Minimize2 className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 text-slate-400 hover:bg-slate-800 hover:text-slate-100",
              !canEdit && "cursor-not-allowed opacity-45"
            )}
            onClick={onCreateFile}
            disabled={!canEdit}
            aria-label="Create file"
            title={canEdit ? "Create file" : "Organizer-only editing"}
          >
            <FilePlus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          <AnimatePresence>
            {Object.keys(files).map((fileName, index) => (
              <motion.div
                key={fileName}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: index * 0.02 }}
              >
                <div
                  className={cn(
                    "group relative flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-xs transition-colors",
                    fileName === activeFile
                      ? "bg-indigo-500/15 text-indigo-200"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                  )}
                >
                  <button
                    onClick={() => setActiveFile(fileName)}
                    className="flex min-w-0 flex-1 items-center gap-2 rounded px-1 py-0.5 text-left"
                    aria-label={`Open ${fileName}`}
                  >
                    <WorkspaceFileIcon fileName={fileName} />
                    <span className="truncate">{fileName}</span>
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      if (!canEdit) {
                        setNotice("Editing is currently organizer-only.");
                        return;
                      }
                      onRequestDelete(fileName);
                    }}
                    disabled={!canEdit}
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded text-slate-500 opacity-70 transition hover:bg-rose-500/10 hover:text-rose-300 group-hover:opacity-100",
                      !canEdit && "cursor-not-allowed opacity-35 hover:bg-transparent hover:text-slate-500"
                    )}
                    aria-label={`Delete ${fileName}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  {fileName === activeFile && (
                    <motion.div layoutId="active-indicator" className="absolute left-0 h-4 w-1 rounded-r-full bg-indigo-400" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </Panel>
  );
}
