"use client";

import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import axios from "axios";
import * as monacoType from "monaco-editor";
import debounce from "lodash.debounce";
import socket from "@/lib/socket";

const ROOM_ID = "room1";

type Props = {
  value: string;
  onChange: (value: string) => void;
  activeFile: string;
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

const CodeEditor = forwardRef<CodeEditorHandle, Props>(
  ({ value, onChange, activeFile }, ref) => {
    const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<typeof monacoType | null>(null);
    const registeredLanguages = useRef<Set<string>>(new Set());
    const aiRequestInProgress = useRef(false);

    useImperativeHandle(ref, () => ({
      getCode: () => editorRef.current?.getValue() || "",
      setCode: (code: string) => {
        if (editorRef.current && code !== editorRef.current.getValue()) {
          editorRef.current.setValue(code);
        }
      },
    }));

    useEffect(() => {
      socket.emit("joinRoom", ROOM_ID);

      socket.on("codeChange", (newCode: string) => {
        if (editorRef.current && newCode !== editorRef.current.getValue()) {
          editorRef.current.setValue(newCode);
        }
      });

      socket.on("syncCode", (initialCode: string) => {
        if (editorRef.current) {
          editorRef.current.setValue(initialCode);
        }
      });

      return () => {
        socket.disconnect();
      };
    }, []);

    const debouncedAICompletionRef = useRef(
      debounce(async (model: monacoType.editor.ITextModel, position: monacoType.Position) => {
        const currentLine = model.getLineContent(position.lineNumber).trim();

        const prompt = `continue this code and give suggested code which user may write after what he has written and suggested autocomplete code should be from after the code till where user have already typed and not from the beginning:-${currentLine}`;

        console.log("🔍 Prompt to AI:", prompt);

        try {
          const res = await axios.post("http://localhost:5000/api/ai/suggest", {
            prompt,
            model: "codellama",
          });

          const raw = res.data?.suggestion || "";
          const suggestionText =
            raw.split("```")[1]?.split("\n").slice(1).join("\n").trim() ||
            raw.split("\n").slice(0, 5).join("\n").trim();

          console.log("💡 AI suggestion received:", suggestionText);

          if (!suggestionText) return { suggestions: [] };

          return {
            suggestions: [
              {
                label: "💡 AI Suggestion",
                kind: monacoRef.current!.languages.CompletionItemKind.Snippet,
                insertText: suggestionText,
                insertTextRules:
                  monacoRef.current!.languages.CompletionItemInsertTextRule.InsertAsSnippet,
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
        } finally {
          aiRequestInProgress.current = false;
        }
      }, 500)
    );

    useEffect(() => {
      if (!monacoRef.current) return;

      const language = getLanguageFromFilename(activeFile);
      if (registeredLanguages.current.has(language)) return;

      console.log("📦 Registering AI suggestion provider for:", language);

      monacoRef.current.languages.registerCompletionItemProvider(language, {
        triggerCharacters: [".", "(", " ", "="],
        provideCompletionItems: (model, position) => {
          console.log("✨ AI provider triggered for", language);
          return debouncedAICompletionRef.current(model, position);
        },
      });

      registeredLanguages.current.add(language);
    }, [activeFile]);

    const handleEditorMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      console.log("🚀 Monaco editor mounted");
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
              socket.emit("codeChange", { roomId: ROOM_ID, code: newValue });
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
  }
);

CodeEditor.displayName = "CodeEditor";
export default CodeEditor;
