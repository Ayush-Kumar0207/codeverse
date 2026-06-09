import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, History, RotateCcw, Save } from "lucide-react";
import { fetchCodeVersions } from "@/services/code";
import type { SharedVersion } from "@shared/types/version";

export interface WorkspaceSnapshot {
  id: string;
  createdAt: string;
  files: Record<string, string>;
  activeFile: string;
  label: string;
}

type Props = {
  userId: string;
  fileName: string;
  onRevert: (code: string) => void;
  onCompare: (versionCode: string, date: string) => void;
  refreshSignal?: number;
  isOrganizer?: boolean;
  workspaceSnapshots?: WorkspaceSnapshot[];
  currentSnapshotId?: string | null;
  onCreateWorkspaceSnapshot?: () => void;
  onRestoreWorkspaceSnapshot?: (snapshot: WorkspaceSnapshot) => void;
  onRestoreWorkspaceSnapshotByTime?: (timestamp: string) => void;
  onStepWorkspaceSnapshot?: (direction: "back" | "forward") => void;
  onReturnToLatestWorkspaceSnapshot?: () => void;
  canStepBack?: boolean;
  canStepForward?: boolean;
};

function toLocalInputValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export default function VersionHistory({
  userId,
  fileName,
  onRevert,
  onCompare,
  refreshSignal,
  isOrganizer = true,
  workspaceSnapshots = [],
  currentSnapshotId = null,
  onCreateWorkspaceSnapshot,
  onRestoreWorkspaceSnapshot,
  onRestoreWorkspaceSnapshotByTime,
  onStepWorkspaceSnapshot,
  onReturnToLatestWorkspaceSnapshot,
  canStepBack = false,
  canStepForward = false,
}: Props) {
  const [versions, setVersions] = useState<SharedVersion[]>([]);
  const [targetTime, setTargetTime] = useState("");

  const sortedWorkspaceSnapshots = useMemo(
    () =>
      [...workspaceSnapshots].sort(
        (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)
      ),
    [workspaceSnapshots]
  );

  useEffect(() => {
    if (!targetTime && sortedWorkspaceSnapshots[0]) {
      setTargetTime(toLocalInputValue(sortedWorkspaceSnapshots[0].createdAt));
    }
  }, [sortedWorkspaceSnapshots, targetTime]);

  useEffect(() => {
    if (!isOrganizer) return;

    const fetchVersions = async () => {
      try {
        const res = await fetchCodeVersions({ userId, fileName });
        setVersions(res.versions);
      } catch (err) {
        console.error("Failed to fetch versions", err);
      }
    };

    fetchVersions();
  }, [fileName, isOrganizer, refreshSignal, userId]);

  if (!isOrganizer) {
    return (
      <div className="flex h-full flex-col bg-black/20">
        <div className="border-b border-white/5 bg-black/40 p-4">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Clock className="h-3 w-3 text-primary" />
            Chronos Timeline
          </h3>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 text-center text-xs text-muted-foreground">
          Workspace timeline and restore controls are available only to the organizer.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-black/20">
      <div className="border-b border-white/5 bg-black/40 p-4">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Clock className="h-3 w-3 text-primary" />
          Chronos Timeline
        </h3>
      </div>

      <div className="border-b border-white/5 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <History className="h-3 w-3 text-cyan-300" />
            Workspace state
          </div>
          <button
            onClick={onCreateWorkspaceSnapshot}
            className="inline-flex h-7 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 text-[9px] font-bold uppercase tracking-widest text-foreground/80 transition hover:bg-white/10"
          >
            <Save className="h-3 w-3" />
            Snapshot
          </button>
        </div>

        <div className="mb-2 flex gap-1.5">
          <button
            onClick={() => onStepWorkspaceSnapshot?.("back")}
            disabled={!canStepBack}
            className="inline-flex h-7 flex-1 items-center justify-center gap-1 rounded border border-white/10 bg-white/5 text-[9px] font-bold uppercase tracking-widest text-foreground/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </button>
          <button
            onClick={() => onStepWorkspaceSnapshot?.("forward")}
            disabled={!canStepForward}
            className="inline-flex h-7 flex-1 items-center justify-center gap-1 rounded border border-white/10 bg-white/5 text-[9px] font-bold uppercase tracking-widest text-foreground/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Forward
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            onClick={onReturnToLatestWorkspaceSnapshot}
            disabled={!sortedWorkspaceSnapshots.length || currentSnapshotId === sortedWorkspaceSnapshots[0]?.id}
            className="inline-flex h-7 flex-1 items-center justify-center gap-1 rounded border border-primary/20 bg-primary/10 text-[9px] font-bold uppercase tracking-widest text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Latest
          </button>
        </div>

        <div className="flex gap-1.5">
          <input
            type="datetime-local"
            value={targetTime}
            onChange={(event) => setTargetTime(event.target.value)}
            className="h-8 min-w-0 flex-1 rounded border border-white/10 bg-black/30 px-2 text-[10px] text-foreground outline-none focus:border-primary/50"
          />
          <button
            onClick={() => onRestoreWorkspaceSnapshotByTime?.(targetTime)}
            disabled={!targetTime || !sortedWorkspaceSnapshots.length}
            className="inline-flex h-8 items-center gap-1 rounded border border-primary/20 bg-primary/10 px-2 text-[9px] font-bold uppercase tracking-widest text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <RotateCcw className="h-3 w-3" />
            Restore
          </button>
        </div>

        <div className="mt-2 max-h-32 space-y-1 overflow-auto pr-1">
          {sortedWorkspaceSnapshots.length === 0 ? (
            <div className="rounded border border-white/5 bg-white/5 px-3 py-2 text-[10px] text-muted-foreground">
              No workspace states yet.
            </div>
          ) : (
            sortedWorkspaceSnapshots.slice(0, 8).map((snapshot) => (
              <button
                key={snapshot.id}
                onClick={() => onRestoreWorkspaceSnapshot?.(snapshot)}
                className={`flex w-full items-center justify-between gap-2 rounded border px-2 py-1.5 text-left text-[10px] transition ${
                  snapshot.id === currentSnapshotId
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-white/5 bg-white/5 text-foreground/70 hover:bg-white/10"
                }`}
              >
                <span className="truncate">{snapshot.label}</span>
                <span className="shrink-0 font-mono text-[9px] text-muted-foreground">
                  {new Date(snapshot.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <ul className="flex-1 space-y-2 overflow-auto p-2">
        {versions.length === 0 && (
          <div className="flex h-40 flex-col items-center justify-center text-muted-foreground opacity-30 italic">
            <Clock className="mb-2 h-8 w-8" />
            <p className="text-[10px] uppercase tracking-tighter">No snapshots recorded</p>
          </div>
        )}
        {versions.map((version) => (
          <li
            key={version._id}
            className="group flex flex-col gap-3 rounded-lg border border-white/5 bg-white/5 p-3 transition-all duration-300 hover:bg-white/10"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-foreground/80">
                {new Date(version.createdAt || Date.now()).toLocaleString()}
              </span>
              <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => onCompare(version.code, new Date(version.createdAt || "").toLocaleString())}
                  className="rounded border border-white/10 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase text-foreground transition-colors hover:bg-white/20"
                >
                  Compare
                </button>
                <button
                  onClick={() => onRevert(version.code)}
                  className="rounded border border-primary/20 bg-primary/20 px-2.5 py-1 text-[9px] font-bold uppercase text-primary transition-colors hover:bg-primary/30"
                >
                  Restore
                </button>
              </div>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="h-full bg-primary/30"
               />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
