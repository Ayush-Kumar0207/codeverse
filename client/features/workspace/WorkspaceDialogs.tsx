"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface WorkspaceDialogsProps {
  activeFile: string;
  canEdit: boolean;
  fileCount: number;
  newFileName: string;
  showNewFile: boolean;
  showDelete: boolean;
  onNewFileNameChange: (value: string) => void;
  onNewFileOpenChange: (open: boolean) => void;
  onDeleteOpenChange: (open: boolean) => void;
  onCreate: () => void;
  onDelete: () => void;
}

export function WorkspaceDialogs({
  activeFile,
  canEdit,
  fileCount,
  newFileName,
  showNewFile,
  showDelete,
  onNewFileNameChange,
  onNewFileOpenChange,
  onDeleteOpenChange,
  onCreate,
  onDelete,
}: WorkspaceDialogsProps) {
  return (
    <>
      <Dialog open={showNewFile} onOpenChange={onNewFileOpenChange}>
        <DialogContent className="border-slate-800 bg-[#0a0f19] text-slate-100 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new file</DialogTitle>
            <DialogDescription className="text-slate-500">Enter a filename with its extension.</DialogDescription>
          </DialogHeader>
          <Input
            value={newFileName}
            onChange={(event) => onNewFileNameChange(event.target.value)}
            placeholder="index.js"
            className="mt-4 border-slate-800 bg-[#070b12] text-slate-100 focus:border-indigo-500"
            autoFocus
          />
          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => onNewFileOpenChange(false)}>Cancel</Button>
            <Button className="bg-indigo-500 text-white hover:bg-indigo-400" onClick={onCreate} disabled={!canEdit}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDelete} onOpenChange={onDeleteOpenChange}>
        <DialogContent className="border-slate-800 bg-[#0a0f19] text-slate-100 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-rose-300">Delete file</DialogTitle>
            <DialogDescription className="text-slate-500">
              {fileCount <= 1
                ? "This is the last file in the workspace, so it cannot be deleted."
                : `Are you sure you want to delete ${activeFile}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => onDeleteOpenChange(false)}>Cancel</Button>
            <Button variant="destructive" onClick={onDelete} disabled={!canEdit || fileCount <= 1}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
