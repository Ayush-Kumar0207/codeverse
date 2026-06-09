"use client";

import { DiffEditor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import { X, Clock, ArrowLeftRight } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  originalCode: string;
  modifiedCode: string;
  fileName: string;
  onClose: () => void;
  onRevert: () => void;
  versionDate?: string;
}

export default function DiffViewer({
  originalCode,
  modifiedCode,
  fileName,
  onClose,
  onRevert,
  versionDate,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-4 z-[100] flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/50"
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-border bg-muted/40 px-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ArrowLeftRight className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight uppercase">Chronos Diff Engine</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Comparing: {fileName} {versionDate && `• Snapshot: ${versionDate}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:bg-muted"
          >
            <X className="w-4 h-4 mr-2" />
            Dismiss
          </Button>
          <Button
            size="sm"
            onClick={onRevert}
            className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
          >
            <Clock className="w-4 h-4 mr-2" />
            Restore This Version
          </Button>
        </div>
      </div>

      {/* Diff Editor Container */}
      <div className="flex-1 bg-background/40">
        <DiffEditor
          original={originalCode}
          modified={modifiedCode}
          language={fileName.split('.').pop() === 'py' ? 'python' : 'javascript'}
          theme="vs-dark"
          options={{
            renderSideBySide: true,
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            renderOverviewRuler: false,
            diffWordWrap: "on",
            originalEditable: false,
          }}
        />
      </div>

      {/* Footer Legend */}
      <div className="flex h-10 items-center gap-6 border-t border-border bg-muted/40 px-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Original Snapshot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Current Workspace</span>
        </div>
      </div>
    </motion.div>
  );
}
