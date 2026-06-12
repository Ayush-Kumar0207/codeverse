import type * as monacoType from "monaco-editor";
import type { ThemeType } from "@/context/SettingsContext";

type EditorThemePalette = {
  annotation: string;
  attribute: string;
  background: string;
  comment: string;
  constant: string;
  control: string;
  cursor: string;
  delimiter: string;
  foreground: string;
  function: string;
  identifier: string;
  indent: string;
  activeIndent: string;
  keyword: string;
  line: string;
  lineNumber: string;
  activeLineNumber: string;
  number: string;
  operator: string;
  parameter: string;
  property: string;
  regexp: string;
  selection: string;
  string: string;
  tag: string;
  type: string;
};

export const editorThemePalettes: Record<ThemeType, EditorThemePalette> = {
  midnight: {
    annotation: "f0abfc",
    attribute: "7dd3fc",
    background: "#0b0f17",
    comment: "64748b",
    constant: "fde68a",
    control: "c4b5fd",
    cursor: "#818cf8",
    delimiter: "94a3b8",
    foreground: "#dbeafe",
    function: "67e8f9",
    identifier: "bfdbfe",
    indent: "#1f2937",
    activeIndent: "#475569",
    keyword: "a5b4fc",
    line: "#111827",
    lineNumber: "#64748b",
    activeLineNumber: "#e2e8f0",
    number: "fbbf24",
    operator: "f9a8d4",
    parameter: "fdba74",
    property: "93c5fd",
    regexp: "fda4af",
    selection: "#334155",
    string: "86efac",
    tag: "f472b6",
    type: "5eead4",
  },
  hacker: {
    annotation: "67e8f9",
    attribute: "bef264",
    background: "#031109",
    comment: "3f7a59",
    constant: "fde047",
    control: "34d399",
    cursor: "#34d399",
    delimiter: "86efac",
    foreground: "#b7f7d0",
    function: "22d3ee",
    identifier: "bbf7d0",
    indent: "#123524",
    activeIndent: "#2f855a",
    keyword: "4ade80",
    line: "#092014",
    lineNumber: "#3f7a59",
    activeLineNumber: "#bbf7d0",
    number: "facc15",
    operator: "67e8f9",
    parameter: "fbbf24",
    property: "a7f3d0",
    regexp: "fb7185",
    selection: "#064e3b",
    string: "a3e635",
    tag: "2dd4bf",
    type: "5eead4",
  },
  solarized: {
    annotation: "d8b4fe",
    attribute: "67e8f9",
    background: "#062330",
    comment: "6d93a2",
    constant: "fbbf24",
    control: "c4b5fd",
    cursor: "#22d3ee",
    delimiter: "94b8c4",
    foreground: "#c6e7ec",
    function: "22d3ee",
    identifier: "bae6fd",
    indent: "#164e63",
    activeIndent: "#0891b2",
    keyword: "60a5fa",
    line: "#0b3342",
    lineNumber: "#6d93a2",
    activeLineNumber: "#e0f2fe",
    number: "f59e0b",
    operator: "f472b6",
    parameter: "fdba74",
    property: "7dd3fc",
    regexp: "fb7185",
    selection: "#155e75",
    string: "facc15",
    tag: "2dd4bf",
    type: "5eead4",
  },
  amoled: {
    annotation: "f0abfc",
    attribute: "7dd3fc",
    background: "#000000",
    comment: "737373",
    constant: "fbbf24",
    control: "c4b5fd",
    cursor: "#a78bfa",
    delimiter: "a3a3a3",
    foreground: "#f5f5f5",
    function: "67e8f9",
    identifier: "e0e7ff",
    indent: "#171717",
    activeIndent: "#525252",
    keyword: "a78bfa",
    line: "#0a0a0a",
    lineNumber: "#737373",
    activeLineNumber: "#ffffff",
    number: "fbbf24",
    operator: "f472b6",
    parameter: "fdba74",
    property: "93c5fd",
    regexp: "fb7185",
    selection: "#2e1065",
    string: "34d399",
    tag: "f472b6",
    type: "2dd4bf",
  },
};

export function defineCodeVerseTheme(monaco: typeof monacoType, theme: ThemeType) {
  const palette = editorThemePalettes[theme];

  monaco.editor.defineTheme("codeverse-active", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: palette.comment, fontStyle: "italic" },
      { token: "comment.doc", foreground: palette.comment, fontStyle: "italic" },
      { token: "keyword", foreground: palette.keyword, fontStyle: "bold" },
      { token: "keyword.control", foreground: palette.control, fontStyle: "bold" },
      { token: "type", foreground: palette.type },
      { token: "type.identifier", foreground: palette.type },
      { token: "class", foreground: palette.type },
      { token: "interface", foreground: palette.type },
      { token: "namespace", foreground: palette.type },
      { token: "function", foreground: palette.function },
      { token: "function.declaration", foreground: palette.function },
      { token: "identifier", foreground: palette.identifier },
      { token: "variable", foreground: palette.identifier },
      { token: "variable.predefined", foreground: palette.constant },
      { token: "parameter", foreground: palette.parameter },
      { token: "property", foreground: palette.property },
      { token: "string", foreground: palette.string },
      { token: "string.escape", foreground: palette.constant },
      { token: "number", foreground: palette.number },
      { token: "number.hex", foreground: palette.number },
      { token: "constant", foreground: palette.constant },
      { token: "operator", foreground: palette.operator },
      { token: "delimiter", foreground: palette.delimiter },
      { token: "delimiter.bracket", foreground: palette.delimiter },
      { token: "regexp", foreground: palette.regexp },
      { token: "tag", foreground: palette.tag },
      { token: "attribute.name", foreground: palette.attribute },
      { token: "annotation", foreground: palette.annotation },
      { token: "metatag", foreground: palette.annotation },
    ],
    colors: {
      "editor.background": palette.background,
      "editor.foreground": palette.foreground,
      "editor.lineHighlightBackground": palette.line,
      "editorLineNumber.foreground": palette.lineNumber,
      "editorLineNumber.activeForeground": palette.activeLineNumber,
      "editorCursor.foreground": palette.cursor,
      "editor.selectionBackground": palette.selection,
      "editor.inactiveSelectionBackground": `${palette.selection}88`,
      "editorIndentGuide.background1": palette.indent,
      "editorIndentGuide.activeBackground1": palette.activeIndent,
      "editorBracketMatch.border": `#${palette.control}`,
      "editorBracketHighlight.foreground1": `#${palette.control}`,
      "editorBracketHighlight.foreground2": `#${palette.function}`,
      "editorBracketHighlight.foreground3": `#${palette.string}`,
      "editorBracketHighlight.foreground4": `#${palette.number}`,
      "editorBracketHighlight.foreground5": `#${palette.operator}`,
      "editorBracketHighlight.foreground6": `#${palette.type}`,
    },
  });
}
