"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import type { Socket } from "socket.io-client";
import { useCodeExecution } from "@/hooks/useCodeExecution";
import type { ExecutionOutputType } from "@/hooks/useCodeExecution";
import { getLanguageFromFilename } from "@/hooks/useLanguageDetection";
import { executeCode } from "@/services/execution";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";

interface WorkspaceExecutionOptions {
  socket: Socket | null;
  roomId: string;
  username: string;
  activeFile: string;
  files: Record<string, string>;
  fallbackCode: string;
  openBottomPanel: () => void;
}

function formatExecutionError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { error?: unknown; message?: unknown } | undefined;
    const message = typeof data?.error === "string"
      ? data.error
      : typeof data?.message === "string"
        ? data.message
        : error.message;
    return status ? `Execution request failed (${status}).\n${message}` : `Execution request failed.\n${message}`;
  }
  return error instanceof Error ? error.message : "Error during execution.";
}

export function useWorkspaceExecution({
  socket,
  roomId,
  username,
  activeFile,
  files,
  fallbackCode,
  openBottomPanel,
}: WorkspaceExecutionOptions) {
  const { output, outputType, loading, setOutput, setOutputType, setLoading } = useCodeExecution(socket);
  const [activeBottomTab, setActiveBottomTab] = useState("terminal");

  const handleRun = useCallback(async () => {
    const executableFile = activeFile === "tracer.js" && files["solution.js"] ? "solution.js" : activeFile;
    const executableCode = files[executableFile] || fallbackCode;
    const language = getLanguageFromFilename(executableFile);

    setLoading(true);
    openBottomPanel();
    setActiveBottomTab(["html", "css", "markdown"].includes(language) ? "output" : "terminal");
    socket?.emit(SOCKET_EVENTS.EXECUTION_START, { user: username, roomId, language });

    try {
      const response = await executeCode({
        code: executableCode,
        language,
        roomId,
        user: username,
        fileName: executableFile,
      });
      setOutput(response.output || "No output");
      setOutputType((response.type as ExecutionOutputType) || "terminal");
      setActiveBottomTab(response.type === "visual" ? "output" : "terminal");
    } catch (error) {
      setOutput(formatExecutionError(error));
      setOutputType("terminal");
      setActiveBottomTab("terminal");
    } finally {
      setLoading(false);
    }
  }, [activeFile, fallbackCode, files, openBottomPanel, roomId, setLoading, setOutput, setOutputType, socket, username]);

  return { output, outputType, loading, activeBottomTab, setActiveBottomTab, handleRun };
}
