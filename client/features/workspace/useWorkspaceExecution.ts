"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import type { Socket } from "socket.io-client";
import { useCodeExecution } from "@/hooks/useCodeExecution";
import { localDigest, localWorkspaceDigest } from "@/lib/evidence-local";
import type { ExecutionOutputType } from "@/hooks/useCodeExecution";
import { getLanguageFromFilename } from "@/hooks/useLanguageDetection";
import { executeCode } from "@/services/execution";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";
import type { EngineeringEventType } from "@shared/types/evidence";

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

function emitEvidence(type: EngineeringEventType, summary: string, fileName: string, payload: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent("codeverse:evidence", {
    detail: {
      type,
      summary,
      source: "runner",
      fileName,
      payload,
    },
  }));
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
    const sourceDigest = localWorkspaceDigest(files);
    const executionStartedAt = Date.now();
    const traceId = localDigest({ roomId, executableFile, sourceDigest, startedAt: executionStartedAt }).slice(0, 32);

    setLoading(true);
    openBottomPanel();
    setActiveBottomTab(["html", "css", "markdown"].includes(language) ? "output" : "terminal");
    socket?.emit(SOCKET_EVENTS.EXECUTION_START, { user: username, roomId, language });
    emitEvidence(
      "trace.observed",
      "Started deterministic execution trace for " + executableFile + ".",
      executableFile,
      { traceId, service: "shared-runner", language, bytes: executableCode.length, sourceDigest }
    );


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
      const executionOutput = response.output || "";
      const outputDigest = localDigest(executionOutput);
      emitEvidence(
        "command.executed",
        "Executed " + executableFile + " with exit code 0.",
        executableFile,
        {
          command: "run " + executableFile,
          language,
          exitCode: 0,
          outputDigest,
          traceId,
          sourceDigest,
          subjectDigest: sourceDigest,
          files,
        }
      );
      const evidenceType: EngineeringEventType = /(?:test|spec)/i.test(executableFile) ? "test.passed" : "runtime.succeeded";
      emitEvidence(
        evidenceType,
        executableFile + " completed successfully.",
        executableFile,
        { language, output: executionOutput.slice(0, 4000), outputDigest, traceId, sourceDigest, subjectDigest: sourceDigest, files, stats: response.stats || {} }
      );
      emitEvidence(
        "performance.measurement",
        "Measured end-to-end execution latency for " + executableFile + ".",
        executableFile,
        { durationMs: Math.max(0, Date.now() - executionStartedAt), traceId, sourceDigest, subjectDigest: sourceDigest, files, stats: response.stats || {} }
      );
    } catch (error) {
      const errorMessage = formatExecutionError(error);
      setOutput(errorMessage);
      const outputDigest = localDigest(errorMessage);
      emitEvidence(
        "command.executed",
        "Executed " + executableFile + " with exit code 1.",
        executableFile,
        {
          command: "run " + executableFile,
          language,
          exitCode: 1,
          outputDigest,
          traceId,
          sourceDigest,
          subjectDigest: sourceDigest,
          files,
        }
      );
      emitEvidence(
        /(?:test|spec)/i.test(executableFile) ? "test.failed" : "runtime.failed",
        executableFile + " failed during execution.",
        executableFile,
        { language, error: errorMessage.slice(0, 4000), outputDigest, traceId, sourceDigest, subjectDigest: sourceDigest, files }
      );
      setOutputType("terminal");
      setActiveBottomTab("terminal");
    } finally {
      setLoading(false);
    }
  }, [activeFile, fallbackCode, files, openBottomPanel, roomId, setLoading, setOutput, setOutputType, socket, username]);

  return { output, outputType, loading, activeBottomTab, setActiveBottomTab, handleRun };
}
