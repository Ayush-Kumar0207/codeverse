import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveCodeVersion } from "@/services/code";

export interface SaveActions {
  handleSave: () => Promise<void>;
  onSaveSuccess: () => void;
}

export function useCodeSave(
  activeFile: string,
  code: string,
  onSaveSuccess?: () => void
) {
  const { user, token } = useAuth();

  const handleSave = useCallback(async () => {
    if (!user || !token) {
      alert("Login required to save.");
      return;
    }

    try {
      await saveCodeVersion({
        code,
        userId: user._id || "",
        fileName: activeFile,
      });
      alert("✅ Saved and snapshot created.");
      onSaveSuccess?.();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save.");
    }
  }, [user, token, activeFile, code, onSaveSuccess]);

  return { handleSave };
}
