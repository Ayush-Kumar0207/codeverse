import { useState, useEffect } from "react";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";

export type ExecutionOutputType = "terminal" | "visual";

interface SocketLike {
  on: (event: string, handler: (data: unknown) => void) => void;
  off: (event: string, handler: (data: unknown) => void) => void;
}

export interface ExecutionState {
  output: string;
  outputType: ExecutionOutputType;
  loading: boolean;
  setOutput: (output: string) => void;
  setOutputType: (type: ExecutionOutputType) => void;
  setLoading: (loading: boolean) => void;
}

export function useCodeExecution(
  socket: SocketLike | null
): ExecutionState {
  const [output, setOutput] = useState("");
  const [outputType, setOutputType] = useState<ExecutionOutputType>("terminal");
  const [loading, setLoading] = useState(false);

  // Listen for socket execution events
  useEffect(() => {
    if (!socket) return;

    const handleExecutionResult = (data: unknown) => {
      const result = data as { output?: string; type?: ExecutionOutputType };
      setOutput(result.output || "");
      setOutputType(result.type || "terminal");
      setLoading(false);
    };

    const handleExecutionError = (data: unknown) => {
      const result = data as { error?: string };
      setOutput(`❌ Execution failed: ${result.error || "Unknown socket error"}`);
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
