import { useEffect, useRef } from "react";
import { suggestCode } from "@/services/ai";
import type { editor } from "monaco-editor";

export function useCodeAutoComplete(
  monacoRef: React.MutableRefObject<any>,
  languageRef: React.MutableRefObject<string>,
  registeredLanguages: React.MutableRefObject<Set<string>>
) {
  const providerRef = useRef<any>(null);

  useEffect(() => {
    if (!monacoRef.current) return;

    const monaco = monacoRef.current;
    const language = languageRef.current;

    // Only register once per language
    if (registeredLanguages.current.has(language)) {
      return;
    }

    try {
      // Register completion item provider for this language
      const disposable = monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: async (model: editor.ITextModel, position: any) => {
          try {
            // Get current line text
            const lineText = model.getLineContent(position.lineNumber);
            const columnText = lineText.substring(0, position.column);

            // Only trigger on specific patterns (comments, etc.)
            if (!columnText.includes("//") && !columnText.includes("/*")) {
              return { suggestions: [] };
            }

            // Call AI service
            const code = model.getValue();
            const response = await suggestCode(columnText);

            if (!response?.suggestion) {
              return { suggestions: [] };
            }

            // Parse markdown code blocks if present
            const codeBlockMatch = response.suggestion.match(/```[\w]*\n([\s\S]*?)\n```/);
            const extractedCode = codeBlockMatch ? codeBlockMatch[1] : response.suggestion;

            // Return as completion item
            return {
              suggestions: [
                {
                  label: "AI Suggestion",
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: extractedCode,
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  range: {
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                  },
                },
              ],
            };
          } catch (err) {
            console.error("Completion provider error:", err);
            return { suggestions: [] };
          }
        },
      });

      registeredLanguages.current.add(language);
      providerRef.current = disposable;

      return () => {
        disposable?.dispose?.();
      };
    } catch (err) {
      console.error("Failed to register completion provider:", err);
    }
  }, [monacoRef, languageRef, registeredLanguages]);

  return {
    providerRef,
  };
}
