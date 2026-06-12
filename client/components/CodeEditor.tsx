"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import Editor, { BeforeMount, OnMount } from "@monaco-editor/react";
import * as monacoType from "monaco-editor";
import { useSocket } from "@/hooks/useSocket";
import { useCodeAutoComplete } from "@/hooks/useCodeAutoComplete";
import { useLanguageDetection, getLanguageFromFilename } from "@/hooks/useLanguageDetection";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";
import { usePresenceCursors } from "@/hooks/usePresenceCursors";
import { useSettings } from "@/context/SettingsContext";
import { useAudioHaptics } from "@/hooks/useAudioHaptics";
import { useKineticFlow } from "@/hooks/useKineticFlow";
import { defineCodeVerseTheme } from "@/lib/codeverse-monaco-theme";

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
  readOnly?: boolean;
  readOnlyMessage?: string;
  onZoneEnter?: () => void;
  onZoneExit?: () => void;
};

const createEditorOptions = (
  settings: ReturnType<typeof useSettings>["settings"]
): monacoType.editor.IStandaloneEditorConstructionOptions => ({
  automaticLayout: true,
  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: "on",
  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  fontLigatures: true,
  fontSize: Math.round(14 * settings.appearance.scale),
  insertSpaces: true,
  lineDecorationsWidth: 12,
  lineNumbersMinChars: 3,
  minimap: { enabled: false },
  overviewRulerBorder: false,
  padding: { top: 16, bottom: 16 },
  renderLineHighlight: "line",
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  quickSuggestions: settings.editor.autocomplete
    ? { other: true, comments: true, strings: true }
    : false,
  suggestOnTriggerCharacters: settings.editor.autocomplete,
  suggest: {
    preview: true,
    showSnippets: true,
    showWords: true,
    snippetsPreventQuickSuggestions: false,
  },
  tabSize: settings.editor.tabSize,
  wordWrap: "on",
  inlineSuggest: { enabled: settings.editor.autocomplete },
});

const CodeEditor = forwardRef<CodeEditorHandle, Props>(
  (
    {
      value,
      onChange,
      activeFile,
      roomId,
      currentUser,
      readOnly = false,
      readOnlyMessage = "The organizer has paused editing for collaborators.",
      onZoneEnter,
      onZoneExit,
    },
    ref
  ) => {
    const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<typeof monacoType | null>(null);
    const languageRef = useRef(getLanguageFromFilename(activeFile));
    const applyingRemoteChangeRef = useRef(false);
    const onChangeRef = useRef(onChange);
    const { socket, on } = useSocket(roomId);
    const { settings } = useSettings();
    const { playKeySound } = useAudioHaptics();
    const [monacoReadyTick, setMonacoReadyTick] = useState(0);

    const language = useLanguageDetection(activeFile);
    const editorOptions = useMemo(
      () => ({
        ...createEditorOptions(settings),
        readOnly,
        domReadOnly: readOnly,
        readOnlyMessage: { value: readOnlyMessage },
      }),
      [readOnly, readOnlyMessage, settings]
    );

    useEffect(() => {
      languageRef.current = language;
    }, [language]);

    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    useCodeAutoComplete(monacoRef, languageRef, monacoReadyTick);
    usePresenceCursors(editorRef.current, monacoRef.current, socket, roomId, currentUser);
    useKineticFlow({
      editor: editorRef.current,
      onZoneEnter,
      onZoneExit,
    });

    useImperativeHandle(ref, () => ({
      getCode: () => editorRef.current?.getValue() || "",
      setCode: (newVal: string) => {
        if (editorRef.current && newVal !== editorRef.current.getValue()) {
          editorRef.current.setValue(newVal);
        }
      },
    }));

    useEffect(() => {
      editorRef.current?.updateOptions(editorOptions);
    }, [editorOptions]);

    useEffect(() => {
      if (!monacoRef.current) return;
      defineCodeVerseTheme(monacoRef.current, settings.appearance.theme);
      monacoRef.current.editor.setTheme("codeverse-active");
    }, [settings.appearance.theme]);

    useEffect(() => {
      const handleCodeChange = (payload: string | { fileName?: string; code?: string }) => {
        const nextCode = typeof payload === "string" ? payload : payload?.code;
        const nextFileName = typeof payload === "string" ? activeFile : payload?.fileName;

        if (typeof nextCode !== "string" || nextFileName !== activeFile) return;

        applyingRemoteChangeRef.current = true;
        onChangeRef.current(nextCode);

        if (editorRef.current && nextCode !== editorRef.current.getValue()) {
          editorRef.current.setValue(nextCode);
        }

        window.setTimeout(() => {
          applyingRemoteChangeRef.current = false;
        }, 0);
      };

      on(SOCKET_EVENTS.CODE_CHANGE, handleCodeChange);
      return () => {
        socket.off(SOCKET_EVENTS.CODE_CHANGE, handleCodeChange);
      };
    }, [activeFile, on, socket]);

    const handleBeforeMount: BeforeMount = (monaco) => {
      defineCodeVerseTheme(monaco, settings.appearance.theme);
    };

    const handleEditorMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      setMonacoReadyTick((tick) => tick + 1);
      defineCodeVerseTheme(monaco, settings.appearance.theme);
      monaco.editor.setTheme("codeverse-active");
      editor.updateOptions(editorOptions);
      editor.layout();

      editor.onKeyDown((event) => {
        playKeySound(event.browserEvent.key);
      });
    };

    const handleEditorChange = (newValue: string | undefined) => {
      if (newValue === undefined) return;
      if (applyingRemoteChangeRef.current) return;
      onChange(newValue);
      if (readOnly) return;
      socket.emit(SOCKET_EVENTS.CODE_CHANGE, { roomId, fileName: activeFile, code: newValue });
    };

    return (
      <div className="h-full w-full overflow-hidden bg-editor-background">
        <Editor
          height="100%"
          path={activeFile}
          theme="codeverse-active"
          language={language}
          value={value}
          loading={
            <div className="flex h-full items-center justify-center bg-editor-background text-xs text-muted-foreground">
              Loading editor
            </div>
          }
          options={editorOptions}
          beforeMount={handleBeforeMount}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
        />
      </div>
    );
  }
);

CodeEditor.displayName = "CodeEditor";
export default CodeEditor;
