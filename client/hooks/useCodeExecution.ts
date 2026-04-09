import { useState, useCallback, useEffect } from "react";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";
import type { SupportedLanguage } from "@shared/types/language";

export interface ExecutionState {
  output: string;
  loading: boolean;
  setOutput: (output: string) => void;
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
  const [loading, setLoading] = useState(false);

  // Listen for socket execution events
  useEffect(() => {
    if (!socket) return;

    const handleExecutionResult = (data: { user: string; output: string }) => {
      setOutput(`👤 ${data.user}:\n${data.output}`);
      setLoading(false);
    };

    const handleExecutionError = (data: { user: string; error: string }) => {
      setOutput(`❌ ${data.user}'s code failed:\n${data.error}`);
      setLoading(false);
    };

    socket.on(SOCKET_EVENTS.EXECUTION_RESULT, handleExecutionResult);
    socket.on(SOCKET_EVENTS.EXECUTION_ERROR, handleExecutionError);

    return () => {
      // Note: Not removing listeners to avoid disrupting other components
    };
  }, [socket]);

  return {
    output,
    loading,
    setOutput,
    setLoading,
  };
}
