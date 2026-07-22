import { useEffect, useRef } from "react";
import * as monacoType from "monaco-editor";
import { useSettings } from "@/context/SettingsContext";

type Snippet = {
  label: string;
  insertText: string;
  detail: string;
  documentation?: string;
};

const CODEVERSE_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "cpp",
  "c",
  "java",
  "html",
  "css",
  "markdown",
  "json",
  "plaintext",
];

const SNIPPETS: Record<string, Snippet[]> = {
  javascript: [
    { label: "cv: function", insertText: "function ${1:name}(${2:args}) {\n  ${0}\n}", detail: "Function declaration" },
    { label: "cv: arrow", insertText: "const ${1:name} = (${2:args}) => {\n  ${0}\n};", detail: "Arrow function" },
    { label: "cv: for-of", insertText: "for (const ${1:item} of ${2:items}) {\n  ${0}\n}", detail: "Iterate values" },
    { label: "cv: async fetch", insertText: "const response = await fetch(${1:url});\nconst data = await response.json();\n${0}", detail: "Fetch JSON" },
    { label: "cv: query", insertText: "const ${1:element} = document.querySelector('${2:selector}');", detail: "DOM query" },
    { label: "cv: listener", insertText: "${1:element}.addEventListener('${2:click}', (${3:event}) => {\n  ${0}\n});", detail: "Event listener" },
  ],
  typescript: [
    { label: "cv: typed function", insertText: "function ${1:name}(${2:args}): ${3:void} {\n  ${0}\n}", detail: "Typed function" },
    { label: "cv: interface", insertText: "interface ${1:Name} {\n  ${2:key}: ${3:string};\n}", detail: "Interface" },
    { label: "cv: type", insertText: "type ${1:Name} = {\n  ${2:key}: ${3:string};\n};", detail: "Object type" },
    { label: "cv: async fetch", insertText: "const response = await fetch(${1:url});\nconst data = await response.json() as ${2:unknown};\n${0}", detail: "Typed fetch" },
  ],
  python: [
    { label: "cv: main", insertText: "def main():\n    ${0:pass}\n\n\nif __name__ == \"__main__\":\n    main()", detail: "Python entry point" },
    { label: "cv: function", insertText: "def ${1:name}(${2:args}):\n    ${0:pass}", detail: "Function definition" },
    { label: "cv: class", insertText: "class ${1:Name}:\n    def __init__(self, ${2:args}):\n        ${0:pass}", detail: "Class skeleton" },
    { label: "cv: enumerate", insertText: "for ${1:index}, ${2:item} in enumerate(${3:items}):\n    ${0}", detail: "Enumerate loop" },
    { label: "cv: try", insertText: "try:\n    ${1:pass}\nexcept ${2:Exception} as error:\n    ${0:print(error)}", detail: "Try/except" },
  ],
  cpp: [
    { label: "cv: main", insertText: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ${0}\n    return 0;\n}", detail: "C++ main template" },
    { label: "cv: vector", insertText: "vector<${1:int}> ${2:values};", detail: "Vector declaration" },
    { label: "cv: for-i", insertText: "for (int ${1:i} = 0; ${1:i} < ${2:n}; ++${1:i}) {\n    ${0}\n}", detail: "Indexed loop" },
    { label: "cv: for-each", insertText: "for (const auto& ${1:item} : ${2:items}) {\n    ${0}\n}", detail: "Range loop" },
    { label: "cv: lambda", insertText: "auto ${1:name} = [&](${2:args}) {\n    ${0}\n};", detail: "Lambda" },
    { label: "cv: print vector", insertText: "for (int i = 0; i < (int)${1:values}.size(); ++i) {\n    if (i) cout << ' ';\n    cout << ${1:values}[i];\n}\ncout << '\\n';", detail: "Print vector" },
  ],
  c: [
    { label: "cv: main", insertText: "#include <stdio.h>\n\nint main(void) {\n    ${0}\n    return 0;\n}", detail: "C main template" },
    { label: "cv: for-i", insertText: "for (int ${1:i} = 0; ${1:i} < ${2:n}; ++${1:i}) {\n    ${0}\n}", detail: "Indexed loop" },
    { label: "cv: printf", insertText: "printf(\"${1:%d\\\\n}\", ${2:value});", detail: "Print formatted output" },
  ],
  java: [
    { label: "cv: main", insertText: "public class ${1:Main} {\n    public static void main(String[] args) {\n        ${0}\n    }\n}", detail: "Java main class" },
    { label: "cv: method", insertText: "public ${1:void} ${2:name}(${3:args}) {\n    ${0}\n}", detail: "Method" },
    { label: "cv: for-i", insertText: "for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n    ${0}\n}", detail: "Indexed loop" },
    { label: "cv: print", insertText: "System.out.println(${1:value});", detail: "Print line" },
  ],
  html: [
    { label: "cv: html page", insertText: "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <title>${1:Document}</title>\n  </head>\n  <body>\n    ${0}\n  </body>\n</html>", detail: "HTML document" },
    { label: "cv: section", insertText: "<section class=\"${1:section}\">\n  <h2>${2:Heading}</h2>\n  <p>${0}</p>\n</section>", detail: "Content section" },
    { label: "cv: button", insertText: "<button type=\"button\" id=\"${1:action}\">${2:Action}</button>", detail: "Button" },
    { label: "cv: form", insertText: "<form id=\"${1:form}\">\n  <label for=\"${2:input}\">${3:Label}</label>\n  <input id=\"${2:input}\" name=\"${2:input}\" />\n  <button type=\"submit\">${4:Submit}</button>\n</form>", detail: "Accessible form" },
  ],
  css: [
    { label: "cv: reset", insertText: "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n}", detail: "CSS reset" },
    { label: "cv: grid", insertText: "display: grid;\ngrid-template-columns: repeat(${1:3}, minmax(0, 1fr));\ngap: ${2:1rem};", detail: "Responsive grid" },
    { label: "cv: card", insertText: "border: 1px solid rgba(255, 255, 255, 0.12);\nborder-radius: 8px;\nbackground: rgba(255, 255, 255, 0.06);\npadding: ${1:1rem};", detail: "Compact card" },
  ],
  markdown: [
    { label: "cv: section", insertText: "## ${1:Section}\n\n${0}", detail: "Markdown section" },
    { label: "cv: checklist", insertText: "- [ ] ${1:Task}\n- [ ] ${2:Task}\n- [ ] ${0:Task}", detail: "Checklist" },
    { label: "cv: code block", insertText: "```$1\n${0}\n```", detail: "Code fence" },
  ],
  json: [
    { label: "cv: object", insertText: "{\n  \"${1:key}\": ${2:\"value\"}\n}", detail: "JSON object" },
    { label: "cv: array", insertText: "[\n  ${1}\n]", detail: "JSON array" },
  ],
  plaintext: [
    { label: "cv: note", insertText: "Title: ${1:Note}\n\n${0}", detail: "Note outline" },
  ],
};

const KEYWORD_SUGGESTIONS: Record<string, string[]> = {
  javascript: ["const", "let", "return", "async", "await", "map", "filter", "reduce", "querySelector", "addEventListener"],
  typescript: ["type", "interface", "readonly", "Partial", "Record", "Promise", "unknown", "never"],
  python: ["def", "class", "return", "range", "enumerate", "zip", "len", "list", "dict", "set"],
  cpp: ["vector", "string", "unordered_map", "priority_queue", "sort", "lower_bound", "push_back", "cout", "cin"],
  c: ["printf", "scanf", "malloc", "free", "sizeof", "struct"],
  java: ["public", "private", "static", "ArrayList", "HashMap", "StringBuilder", "System.out.println"],
  html: ["main", "section", "article", "button", "input", "label", "script", "link"],
  css: ["display", "grid-template-columns", "align-items", "justify-content", "background", "border-radius"],
};

function getWordRange(monaco: typeof monacoType, model: monacoType.editor.ITextModel, position: monacoType.Position) {
  const word = model.getWordUntilPosition(position);
  return new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
}

function currentPrefix(model: monacoType.editor.ITextModel, position: monacoType.Position) {
  return model.getLineContent(position.lineNumber).slice(0, position.column - 1);
}

function extractSymbols(model: monacoType.editor.ITextModel, monaco: typeof monacoType, range: monacoType.IRange) {
  const text = model.getValue();
  const seen = new Set<string>();
  const suggestions: monacoType.languages.CompletionItem[] = [];
  const add = (name: string, kind: monacoType.languages.CompletionItemKind, detail: string) => {
    if (!name || name.length < 2 || seen.has(name)) return;
    seen.add(name);
    suggestions.push({
      label: name,
      kind,
      insertText: name,
      detail,
      range,
      sortText: `1-${name}`,
    });
  };

  for (const match of text.matchAll(/\b(?:function|def)\s+([A-Za-z_$][\w$]*)/g)) {
    add(match[1], monaco.languages.CompletionItemKind.Function, "Function in this file");
  }
  for (const match of text.matchAll(/\bclass\s+([A-Za-z_$][\w$]*)/g)) {
    add(match[1], monaco.languages.CompletionItemKind.Class, "Class in this file");
  }
  for (const match of text.matchAll(/\b(?:const|let|var|int|long|double|float|char|String|auto)\s+([A-Za-z_$][\w$]*)/g)) {
    add(match[1], monaco.languages.CompletionItemKind.Variable, "Variable in this file");
  }
  for (const match of text.matchAll(/\b([A-Za-z_$][\w$]*)\s*=/g)) {
    add(match[1], monaco.languages.CompletionItemKind.Variable, "Assigned symbol in this file");
  }
  for (const match of text.matchAll(/id=["']([A-Za-z][\w-]*)["']/g)) {
    add(`#${match[1]}`, monaco.languages.CompletionItemKind.Reference, "DOM id in this file");
  }
  for (const match of text.matchAll(/class=["']([^"']+)["']/g)) {
    match[1].split(/\s+/).forEach((className) => add(`.${className}`, monaco.languages.CompletionItemKind.Reference, "CSS class in this file"));
  }

  return suggestions.slice(0, 80);
}

function snippetSuggestions(language: string, monaco: typeof monacoType, range: monacoType.IRange) {
  return (SNIPPETS[language] || []).map((snippet, index) => ({
    label: snippet.label,
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: snippet.insertText,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: snippet.detail,
    documentation: snippet.documentation || "CodeVerse smart snippet",
    range,
    sortText: `0-${index.toString().padStart(2, "0")}`,
  }));
}

function keywordSuggestions(language: string, monaco: typeof monacoType, range: monacoType.IRange) {
  return (KEYWORD_SUGGESTIONS[language] || []).map((keyword) => ({
    label: keyword,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: keyword,
    detail: "Language helper",
    range,
    sortText: `2-${keyword}`,
  }));
}

function inlineSuggestionFor(language: string, prefix: string) {
  const trimmed = prefix.trim();

  if ((language === "javascript" || language === "typescript") && /\bconsole\.$/.test(trimmed)) {
    return "log($1);";
  }
  if ((language === "javascript" || language === "typescript") && /\bdocument\.querySelector\($/.test(trimmed)) {
    return "'$1')";
  }
  if (language === "python" && trimmed === "if __name__") {
    return ' == "__main__":';
  }
  if (language === "cpp" && trimmed === "cout") {
    return " << $1 << endl;";
  }
  if (language === "java" && trimmed === "System.out") {
    return ".println($1);";
  }
  if (language === "html" && trimmed.endsWith("<")) {
    return "section class=\"$1\">\n  $0\n</section>";
  }
  if (language === "css" && /display\s*:\s*$/.test(prefix)) {
    return "grid;";
  }

  return "";
}

export function useCodeAutoComplete(
  monacoRef: React.MutableRefObject<typeof monacoType | null>,
  languageRef: React.MutableRefObject<string>,
  readyKey = 0
) {
  const { settings } = useSettings();
  const disposablesRef = useRef<monacoType.IDisposable[]>([]);

  useEffect(() => {
    disposablesRef.current.forEach((disposable) => disposable.dispose());
    disposablesRef.current = [];

    if (!monacoRef.current || !settings.editor.autocomplete) {
      return;
    }

    const monaco = monacoRef.current;

    try {
      const registered = CODEVERSE_LANGUAGES.flatMap((language) => [
        monaco.languages.registerCompletionItemProvider(language, {
          triggerCharacters: [".", "<", "#", ":", " ", "@"],
          provideCompletionItems: (model, position) => {
            const range = getWordRange(monaco, model, position);
            const activeLanguage = model.getLanguageId() || languageRef.current || language;
            const suggestions = [
              ...snippetSuggestions(activeLanguage, monaco, range),
              ...extractSymbols(model, monaco, range),
              ...keywordSuggestions(activeLanguage, monaco, range),
            ];

            return { suggestions };
          },
        }),
        monaco.languages.registerInlineCompletionsProvider(language, {
          provideInlineCompletions: (model, position) => {
            const activeLanguage = model.getLanguageId() || languageRef.current || language;
            const insertText = inlineSuggestionFor(activeLanguage, currentPrefix(model, position));

            if (!insertText) return { items: [] };

            return {
              items: [
                {
                  insertText,
                  range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                },
              ],
            };
          },
          disposeInlineCompletions: () => {},
        }),
      ]);

      disposablesRef.current = registered;

      return () => {
        registered.forEach((disposable) => disposable.dispose());
        disposablesRef.current = [];
      };
    } catch (err) {
      console.error("Failed to register completion providers:", err);
    }
  }, [monacoRef, languageRef, readyKey, settings.editor.autocomplete]);

  return {
    providerRef: disposablesRef,
  };
}
