"use client";

import { useEffect, useMemo, useRef } from "react";
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import type * as monacoType from "monaco-editor";
import { useSettings } from "@/context/SettingsContext";
import { defineCodeVerseTheme } from "@/lib/codeverse-monaco-theme";

const languageAliases: Record<string, string> = {
  "c++": "cpp",
  cpp: "cpp",
  java: "java",
  javascript: "javascript",
  js: "javascript",
  python: "python",
  py: "python",
  typescript: "typescript",
  ts: "typescript",
};

export default function SyntaxCodeViewer({
  code,
  language,
  fileName,
  activeLine,
  onLineSelect,
}: {
  code: string;
  language: string;
  fileName: string;
  activeLine?: number | null;
  onLineSelect?: (line: number) => void;
}) {
  const { settings } = useSettings();
  const monacoRef = useRef<typeof monacoType | null>(null);
  const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<monacoType.editor.IEditorDecorationsCollection | null>(null);
  const onLineSelectRef = useRef(onLineSelect);
  const editorLanguage = languageAliases[language.toLowerCase()] || language.toLowerCase();
  const height = useMemo(() => {
    const lineCount = code.split("\n").length;
    return Math.min(560, Math.max(220, lineCount * 28 + 32));
  }, [code]);

  const defineTheme: BeforeMount = (monaco) => {
    defineCodeVerseTheme(monaco, settings.appearance.theme);
  };

  const mountEditor: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    defineCodeVerseTheme(monaco, settings.appearance.theme);
    monaco.editor.setTheme("codeverse-active");
    decorationsRef.current = editor.createDecorationsCollection();
    editor.onMouseDown((event) => {
      const lineNumber = event.target.position?.lineNumber;
      if (lineNumber && onLineSelectRef.current) onLineSelectRef.current(lineNumber - 1);
    });
    editor.layout();
  };

  useEffect(() => {
    onLineSelectRef.current = onLineSelect;
  }, [onLineSelect]);

  useEffect(() => {
    if (!monacoRef.current) return;
    defineCodeVerseTheme(monacoRef.current, settings.appearance.theme);
    monacoRef.current.editor.setTheme("codeverse-active");
  }, [settings.appearance.theme]);

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const decorations = decorationsRef.current;
    if (!editor || !monaco || !decorations) return;

    if (activeLine === null || activeLine === undefined) {
      decorations.clear();
      return;
    }

    const lineNumber = activeLine + 1;
    decorations.set([
      {
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: "narration-code-line",
        },
      },
    ]);
    editor.revealLineInCenterIfOutsideViewport(lineNumber);
  }, [activeLine]);

  return (
    <div className="syntax-code-viewer bg-editor-background" style={{ height }}>
      <Editor
        path={`encyclopedia/${fileName}`}
        value={code}
        language={editorLanguage}
        theme="codeverse-active"
        beforeMount={defineTheme}
        onMount={mountEditor}
        options={{
          automaticLayout: true,
          bracketPairColorization: { enabled: true, independentColorPoolPerBracketType: true },
          contextmenu: false,
          folding: true,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          fontLigatures: true,
          fontSize: Math.round(14 * settings.appearance.scale),
          glyphMargin: false,
          guides: { bracketPairs: true, indentation: true },
          lineDecorationsWidth: 12,
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          minimap: { enabled: false },
          overviewRulerBorder: false,
          padding: { top: 16, bottom: 16 },
          readOnly: true,
          renderLineHighlight: "none",
          scrollBeyondLastLine: false,
          scrollbar: { horizontalScrollbarSize: 8, verticalScrollbarSize: 8 },
          stickyScroll: { enabled: false },
          wordWrap: "on",
        }}
      />
    </div>
  );
}
