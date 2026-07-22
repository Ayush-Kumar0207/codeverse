"use client";

import { useCallback, useState } from "react";
import { deployProject } from "@/services/deployment";

export function useWorkspaceDeployment(projectId: string, files: Record<string, string>) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [deploymentError, setDeploymentError] = useState("");
  const [deploymentNote, setDeploymentNote] = useState("");

  const handleBeginDeployment = useCallback(async () => {
    setIsDeploying(true);
    setDeploymentUrl("");
    setDeploymentError("");
    setDeploymentNote("");
    try {
      const response = await deployProject({ projectId, files });
      setDeploymentUrl(response.publicUrl || response.url);
      setDeploymentNote(
        response.publicUrl
          ? `Public tunnel active. Local route: ${response.url}`
          : response.bridgeUrl
            ? `Served locally. Static bridge: ${response.bridgeUrl}`
            : ""
      );
    } catch (error) {
      setDeploymentError(error instanceof Error ? error.message : "Failed to initiate Aegis propagation.");
    }
  }, [files, projectId]);

  return {
    isDeploying,
    setIsDeploying,
    deploymentUrl,
    deploymentError,
    deploymentNote,
    handleBeginDeployment,
  };
}
