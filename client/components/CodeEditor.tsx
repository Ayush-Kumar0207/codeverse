"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monacoType from "monaco-editor";
import { useSocket } from "@/hooks/useSocket";
import { useCodeAutoComplete } from "@/hooks/useCodeAutoComplete";
import { useLanguageDetection, getLanguageFromFilename } from "@/hooks/useLanguageDetection";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";
import { usePresenceCursors } from "@/hooks/usePresenceCursors";

interface UserIdentity {
  username: string;
}

export type CodeEditorHandle = {
  getCode: () => string;
  setCode: (code: string) => void;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  activeFile: string;
  roomId: string;
  currentUser?: string;
};

const CodeEditor = forwardRef<CodeEditorHandle, Props>(({ value, onChange, activeFile, roomId, currentUser }, ref) => {
  const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monacoType | null>(null);
  const registeredLanguages = useRef<Set<string>>(new Set());
  const languageRef = useRef(getLanguageFromFilename(activeFile));
  const { socket, on } = useSocket(roomId);

  const language = useLanguageDetection(activeFile);

  // Use the AI autocomplete hook
  useCodeAutoComplete(monacoRef, languageRef, registeredLanguages);

  // Use the presence cursors hook
  usePresenceCursors(editorRef.current, monacoRef.current, socket, roomId, currentUser);

  useImperativeHandle(ref, () => ({
    getCode: () => editorRef.current?.getValue() || "",
    setCode: (code: string) => {
      if (editorRef.current && code !== editorRef.current.getValue()) {
        editorRef.current.setValue(code);
      }
    },
  }));

  // Handle socket code sync events
  useEffect(() => {
    const handleCodeChange = (newCode: string) => {
      if (editorRef.current && newCode !== editorRef.current.getValue()) {
        editorRef.current.setValue(newCode);
      }
    };

    const handleSyncCode = (initialCode: string) => {
      if (editorRef.current) {
        editorRef.current.setValue(initialCode);
      }
    };

    on(SOCKET_EVENTS.CODE_CHANGE, handleCodeChange);
    on(SOCKET_EVENTS.SYNC_CODE, handleSyncCode);
  }, [on]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  return (
    <div className="w-full h-full border border-primary/20 rounded-xl shadow-2xl overflow-hidden glass-effect bg-black/20">
      <Editor
        height="100%"
        theme="vs-dark"
        language={language}
        value={value}
        onChange={(newValue) => {
          if (newValue !== undefined) {
            onChange(newValue);
            socket.emit(SOCKET_EVENTS.CODE_CHANGE, { roomId, code: newValue });
          }
        }}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          wordWrap: "on",
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  );
});

CodeEditor.displayName = "CodeEditor";
export default CodeEditor;

