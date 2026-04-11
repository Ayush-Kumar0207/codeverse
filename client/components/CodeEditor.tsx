"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useCallback } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monacoType from "monaco-editor";
import { useSocket } from "@/hooks/useSocket";
import { useCodeAutoComplete } from "@/hooks/useCodeAutoComplete";
import { useLanguageDetection, getLanguageFromFilename } from "@/hooks/useLanguageDetection";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";
import { usePresenceCursors } from "@/hooks/usePresenceCursors";
import { useSettings } from "@/context/SettingsContext";
import { useAudioHaptics } from "@/hooks/useAudioHaptics";
import { useKineticFlow } from "@/hooks/useKineticFlow";

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
  onZoneEnter?: () => void;
  onZoneExit?: () => void;
};

const CodeEditor = forwardRef<CodeEditorHandle, Props>(({ 
  value, 
  onChange, 
  activeFile, 
  roomId, 
  currentUser,
  onZoneEnter,
  onZoneExit 
}, ref) => {
  const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monacoType | null>(null);
  const languageRef = useRef(getLanguageFromFilename(activeFile));
  const { socket, on } = useSocket(roomId);
  const { settings } = useSettings();
  const { playKeySound } = useAudioHaptics();

  const language = useLanguageDetection(activeFile);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  // Hook 1: Semantic AI Autocomplete (Ghost Text)
  useCodeAutoComplete(monacoRef, languageRef);

  // Hook 2: Presence Cursors
  usePresenceCursors(editorRef.current, monacoRef.current, socket, roomId, currentUser);

  // Hook 3: Kinetic Flow & Hyper-Focus
  useKineticFlow({ 
    editor: editorRef.current, 
    onZoneEnter, 
    onZoneExit 
  });

  useImperativeHandle(ref, () => ({
    getCode: () => editorRef.current?.getValue() || "",
    setCode: (newVal: string) => {
      if (editorRef.current && newVal !== editorRef.current.getValue()) {
        editorRef.current.setValue(newVal);
      }
    },
  }));

  // Handle socket code sync
  useEffect(() => {
    const handleCodeChange = (newCode: string) => {
      if (editorRef.current && newCode !== editorRef.current.getValue()) {
        editorRef.current.setValue(newCode);
      }
    };
    on(SOCKET_EVENTS.CODE_CHANGE, handleCodeChange);
  }, [on]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Apply settings-driven options
    editor.updateOptions({
      tabSize: settings.editor.tabSize,
      insertSpaces: true,
      fontSize: 14 * settings.appearance.scale, // Scale font with UI
      suggestOnTriggerCharacters: settings.editor.autocomplete,
      inlineSuggest: { enabled: settings.editor.autocomplete }, // Enable ghost text
    });
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
      socket.emit(SOCKET_EVENTS.CODE_CHANGE, { roomId, code: newValue });
    }
  };

  // Bind Keyboard Events for Audio Haptics
  const handleEditorKeyDown = (e: monacoType.IKeyboardEvent) => {
    // We use the browser's key property for semantic mapping
    playKeySound(e.browserEvent.key);
  };

  return (
    <div className="w-full h-full border border-primary/10 rounded-xl shadow-2xl overflow-hidden glass-effect bg-black/40 relative">
      <Editor
        height="100%"
        theme="vs-dark"
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
      />
      {/* Hidden overlay to capture keys if necessary, but Monaco provides an onKeyDown event */}
      <div className="absolute inset-0 pointer-events-none" onKeyDownCapture={(e) => playKeySound(e.key)} />
    </div>
  );
});

CodeEditor.displayName = "CodeEditor";
export default CodeEditor;
