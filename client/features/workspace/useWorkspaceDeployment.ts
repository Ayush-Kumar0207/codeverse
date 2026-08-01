"use client";

import { useCallback, useState } from "react";
import { deployProject } from "@/services/deployment";
function recordDeployment(type: string, summary: string, payload: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent("codeverse:evidence", {
    detail: { type, summary, source: "deployment", payload },
  }));
}


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
    recordDeployment("deployment.attempted", "Deployment attempt started.", { projectId, files: Object.keys(files) });
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
      recordDeployment("deployment.succeeded", "Workspace deployment succeeded.", { projectId, url: response.publicUrl || response.url });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to initiate Aegis propagation.";
      setDeploymentError(message);
      recordDeployment("deployment.failed", "Workspace deployment failed.", { projectId, error: message });
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
