// import { useRef } from 'react';
import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, onChange }) {
  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue={code}
      theme="vs-dark"
      onChange={onChange}
    />
  );
}
