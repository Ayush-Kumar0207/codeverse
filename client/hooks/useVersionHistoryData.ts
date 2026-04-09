import { useState, useEffect } from "react";
import { fetchCodeVersions } from "@/services/code";
import type { SharedVersion } from "@shared/types/version";

export function useVersionHistoryData(
  userId: string,
  fileName: string,
  refreshSignal: number
) {
  const [versions, setVersions] = useState<SharedVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId || !fileName) return;

    const loadVersions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchCodeVersions({ userId, fileName });
        setVersions(res.versions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load versions");
        console.error("Error loading versions:", err);
      } finally {
        setLoading(false);
      }
    };

    loadVersions();
  }, [userId, fileName, refreshSignal]);

  return {
    versions,
    loading,
    error,
  };
}
