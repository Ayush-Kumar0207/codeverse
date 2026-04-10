import { useState, useCallback, useEffect } from "react";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";
import type { SupportedLanguage } from "@shared/types/language";

export type ExecutionOutputType = "terminal" | "visual";

export interface ExecutionState {
  output: string;
  outputType: ExecutionOutputType;
  loading: boolean;
  setOutput: (output: string) => void;
  setOutputType: (type: ExecutionOutputType) => void;
  setLoading: (loading: boolean) => void;
}

export function useCodeExecution(
  socket: any,
  language: SupportedLanguage,
  code: string,
  roomId: string,
  user: { username: string } | null
): ExecutionState {
  const [output, setOutput] = useState("");
  const [outputType, setOutputType] = useState<ExecutionOutputType>("terminal");
  const [loading, setLoading] = useState(false);

  // Listen for socket execution events
  useEffect(() => {
    if (!socket) return;

    const handleExecutionResult = (data: { user: string; output: string; type?: ExecutionOutputType }) => {
      setOutput(data.output);
      setOutputType(data.type || "terminal");
      setLoading(false);
    };

    const handleExecutionError = (data: { user: string; error: string }) => {
      setOutput(`❌ Execution failed: ${data.error}`);
      setOutputType("terminal");
      setLoading(false);
    };

    socket.on(SOCKET_EVENTS.EXECUTION_RESULT, handleExecutionResult);
    socket.on(SOCKET_EVENTS.EXECUTION_ERROR, handleExecutionError);

    return () => {
      socket.off(SOCKET_EVENTS.EXECUTION_RESULT, handleExecutionResult);
      socket.off(SOCKET_EVENTS.EXECUTION_ERROR, handleExecutionError);
    };
  }, [socket]);

  return {
    output,
    outputType,
    loading,
    setOutput,
    setOutputType,
    setLoading,
  };
}
