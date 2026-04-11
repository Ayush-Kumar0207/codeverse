import { useEffect, useRef } from "react";
import { suggestCode } from "@/services/ai";
import * as monacoType from "monaco-editor";
import { useSettings } from "@/context/SettingsContext";

export function useCodeAutoComplete(
  monacoRef: React.MutableRefObject<typeof monacoType | null>,
  languageRef: React.MutableRefObject<string>
) {
  const { settings } = useSettings();
  const providerRef = useRef<monacoType.IDisposable | null>(null);

  useEffect(() => {
    if (!monacoRef.current || !settings.editor.autocomplete) {
      providerRef.current?.dispose();
      providerRef.current = null;
      return;
    }

    const monaco = monacoRef.current;
    const language = languageRef.current;

    try {
      // Register INLINE completion provider (Ghost Text)
      const disposable = monaco.languages.registerInlineCompletionsProvider(language, {
        provideInlineCompletions: async (model, position) => {
          try {
            // Get current line text for context
            const lineText = model.getLineContent(position.lineNumber);
            const columnText = lineText.substring(0, position.column);

            // Simple heuristic for triggering AI
            if (columnText.trim().length < 3) return { items: [] };

            const response = await suggestCode({ prompt: model.getValue() });

            if (!response?.suggestion) return { items: [] };

            // Parse suggestion
            const codeBlockMatch = response.suggestion.match(/```[\w]*\n([\s\S]*?)\n```/);
            const extractedCode = codeBlockMatch ? codeBlockMatch[1] : response.suggestion;

            return {
              items: [
                {
                  insertText: extractedCode,
                  range: new monaco.Range(
                    position.lineNumber,
                    position.column,
                    position.lineNumber,
                    position.column + extractedCode.length
                  ),
                },
              ],
            };
          } catch (err) {
            return { items: [] };
          }
        },
        freeInlineCompletions: () => {},
      });

      providerRef.current = disposable;

      return () => {
        disposable.dispose();
      };
    } catch (err) {
      console.error("Failed to register inline completion provider:", err);
    }
  }, [monacoRef, languageRef, settings.editor.autocomplete]);

  return {
    providerRef,
  };
}
