import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { fetchCodeVersions } from "@/services/code";
import type { SharedVersion } from "@shared/types/version";

type Props = {
  userId: string;
  fileName: string;
  onRevert: (code: string) => void;
  onCompare: (versionCode: string, date: string) => void; // ✅ Add onCompare
  refreshSignal?: number;
};

export default function VersionHistory({
  userId,
  fileName,
  onRevert,
  onCompare,
  refreshSignal,
}: Props) {
  const [versions, setVersions] = useState<SharedVersion[]>([]);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await fetchCodeVersions({ userId, fileName });
        setVersions(res.versions);
      } catch (err) {
        console.error("Failed to fetch versions", err);
      }
    };

    fetchVersions();
  }, [userId, fileName, refreshSignal]);

  return (
    <div className="flex flex-col h-full bg-black/20">
      <div className="p-4 border-b border-white/5 bg-black/40">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Clock className="w-3 h-3 text-primary" />
          Chronos Timeline
        </h3>
      </div>
      <ul className="flex-1 overflow-auto p-2 space-y-2">
        {versions.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center text-muted-foreground opacity-30 italic">
            <Clock className="w-8 h-8 mb-2" />
            <p className="text-[10px] uppercase tracking-tighter">No snapshots recorded</p>
          </div>
        )}
        {versions.map((version) => (
          <li
            key={version._id}
            className="group flex flex-col gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/5 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-foreground/80">
                {new Date(version.createdAt || Date.now()).toLocaleString()}
              </span>
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onCompare(version.code, new Date(version.createdAt || "").toLocaleString())}
                  className="px-2.5 py-1 text-[9px] font-bold uppercase bg-white/10 hover:bg-white/20 text-foreground rounded border border-white/10 transition-colors"
                >
                  Compare
                </button>
                <button
                  onClick={() => onRevert(version.code)}
                  className="px-2.5 py-1 text-[9px] font-bold uppercase bg-primary/20 hover:bg-primary/30 text-primary rounded border border-primary/20 transition-colors"
                >
                  Restore
                </button>
              </div>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
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
