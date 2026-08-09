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
  onSaveSuccess?: () => void,
  saveWorkspace?: () => Promise<void>
) {
  const { user, token } = useAuth();

  const handleSave = useCallback(async () => {
    if (!user || !token) {
      alert("Login required to save.");
      return;
    }

    try {
      await Promise.all([
        saveCodeVersion({
          code,
          userId: user._id || "",
          fileName: activeFile,
        }),
        saveWorkspace?.(),
      ]);
      alert("Saved to cloud with a versioned checkpoint.");
      onSaveSuccess?.();
      window.dispatchEvent(new CustomEvent("codeverse:evidence", {
        detail: { type: "snapshot.created", summary: "Saved a durable workspace checkpoint.", source: "version-history", fileName: activeFile, payload: { bytes: code.length } },
      }));
    } catch (err) {
      console.error(err);
      alert("Your workspace is safe on this device, but the cloud save is still pending. Please retry when storage is available.");
    }
  }, [user, token, activeFile, code, onSaveSuccess, saveWorkspace]);

  return { handleSave };
}
