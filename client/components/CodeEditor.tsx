"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monacoType from "monaco-editor";
import { useSocket } from "@/hooks/useSocket";
import { suggestCode } from "@/services/ai";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";

type Props = {
  value: string;
  onChange: (value: string) => void;
  activeFile: string;
  roomId: string;
};

export type CodeEditorHandle = {
  getCode: () => string;
  setCode: (code: string) => void;
};

const getLanguageFromFilename = (filename: string): string => {
  const ext = filename.split(".").pop();
  switch (ext) {
    case "js":
    case "mjs":
      return "javascript";
    case "ts":
      return "typescript";
    case "py":
      return "python";
    case "cpp":
    case "cc":
    case "cxx":
      return "cpp";
    case "c":
      return "c";
    case "java":
      return "java";
    case "html":
      return "html";
    case "css":
      return "css";
    case "json":
      return "json";
    case "md":
      return "markdown";
    default:
      return "plaintext";
  }
};

const CodeEditor = forwardRef<CodeEditorHandle, Props>(({ value, onChange, activeFile, roomId }, ref) => {
  const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monacoType | null>(null);
  const registeredLanguages = useRef<Set<string>>(new Set());
  const { socket, on, off } = useSocket(roomId);

  useImperativeHandle(ref, () => ({
    getCode: () => editorRef.current?.getValue() || "",
    setCode: (code: string) => {
      if (editorRef.current && code !== editorRef.current.getValue()) {
        editorRef.current.setValue(code);
      }
    },
  }));

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

    return () => {
      off(SOCKET_EVENTS.CODE_CHANGE, handleCodeChange);
      off(SOCKET_EVENTS.SYNC_CODE, handleSyncCode);
    };
  }, [off, on]);

  useEffect(() => {
    if (!monacoRef.current) return;

    const language = getLanguageFromFilename(activeFile);
    if (registeredLanguages.current.has(language)) return;

    const disposable = monacoRef.current.languages.registerCompletionItemProvider(language, {
      triggerCharacters: [".", "(", " ", "="],
      provideCompletionItems: async (model, position) => {
        try {
          const res = await suggestCode(
            `continue this code and give suggested code which user may write after what he has written and suggested autocomplete code should be from after the code till where user have already typed and not from the beginning:-${model.getLineContent(position.lineNumber).trim()}`,
            "codellama"
          );

          const raw = res.suggestion || "";
          const suggestionText =
            raw.split("```")[1]?.split("\n").slice(1).join("\n").trim() ||
            raw.split("\n").slice(0, 5).join("\n").trim();

          if (!suggestionText) return { suggestions: [] };

          return {
            suggestions: [
              {
                label: "💡 AI Suggestion",
                kind: monacoRef.current!.languages.CompletionItemKind.Snippet,
                insertText: suggestionText,
                insertTextRules: monacoRef.current!.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endColumn: position.column,
                },
              },
            ],
          };
        } catch (err) {
          console.error("❌ AI autocomplete failed", err);
          return { suggestions: [] };
        }
      },
    });

    registeredLanguages.current.add(language);

    return () => disposable.dispose();
  }, [activeFile]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  return (
    <div className="w-full h-[80vh] border rounded-xl shadow-md">
      <Editor
        height="100%"
        theme="vs-dark"
        language={getLanguageFromFilename(activeFile)}
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

