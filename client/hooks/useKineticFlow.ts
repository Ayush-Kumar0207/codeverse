"use client";

import { useEffect, useRef, useState } from "react";
import * as monacoType from "monaco-editor";
import { useSettings } from "@/context/SettingsContext";

interface KineticFlowOptions {
  editor: monacoType.editor.IStandaloneCodeEditor | null;
  onZoneEnter?: () => void;
  onZoneExit?: () => void;
}

export function useKineticFlow({ editor, onZoneEnter, onZoneExit }: KineticFlowOptions) {
  const { apm, settings } = useSettings();
  const [isHyperFocus, setIsHyperFocus] = useState(false);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const decorationsRef = useRef<string[]>([]);

  // APM Threshold Logic for "The Zone"
  useEffect(() => {
    if (apm > 60) {
      if (!isHyperFocus) {
        // Must maintain APM > 60 for 2 seconds to enter "The Zone"
        if (!focusTimeoutRef.current) {
          focusTimeoutRef.current = setTimeout(() => {
            setIsHyperFocus(true);
            onZoneEnter?.();
          }, 2000);
        }
      } else {
        // Reset exit timeout if still typing fast
        if (focusTimeoutRef.current) {
          clearTimeout(focusTimeoutRef.current);
          focusTimeoutRef.current = null;
        }
      }
    } else {
      if (isHyperFocus) {
        // Exit zone if APM < 60 for 5 seconds
        if (!focusTimeoutRef.current) {
          focusTimeoutRef.current = setTimeout(() => {
            setIsHyperFocus(false);
            onZoneExit?.();
          }, 5000);
        }
      } else {
        // Cancel entry if slowed down
        if (focusTimeoutRef.current) {
          clearTimeout(focusTimeoutRef.current);
          focusTimeoutRef.current = null;
        }
      }
    }
  }, [apm, isHyperFocus, onZoneEnter, onZoneExit]);

  // Contextual Dimming & Visual Power Meter
  useEffect(() => {
    if (!editor || !settings.kinetics.neonOverdrive) return;

    const updateDecorations = () => {
      const selection = editor.getSelection();
      const model = editor.getModel();
      if (!selection || !model) return;

      const activeLine = selection.startLineNumber;
      const lineCount = model.getLineCount();
      
      const newDecorations: monacoType.editor.IModelDeltaDecoration[] = [];

      // Power Meter Gutter (Neon line on the far left)
      newDecorations.push({
        range: new monacoType.Range(1, 1, lineCount, 1),
        options: {
          isWholeLine: false,
          linesDecorationsClassName: "apm-power-gutter",
        }
      });

      // Hyper-Focus Dimming
      if (isHyperFocus) {
        // Dim everything except current logical block (simplified to current line + 5 around for now)
        // A truly "God-Level" version would parse AST to find function boundaries
        const startDim = Math.max(1, activeLine - 5);
        const endDim = Math.min(lineCount, activeLine + 5);

        if (startDim > 1) {
          newDecorations.push({
            range: new monacoType.Range(1, 1, startDim - 1, 1),
            options: { isWholeLine: true, inlineClassName: "code-dimmed" }
          });
        }
        if (endDim < lineCount) {
          newDecorations.push({
            range: new monacoType.Range(endDim + 1, 1, lineCount, 1),
            options: { isWholeLine: true, inlineClassName: "code-dimmed" }
          });
        }
      }

      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
    };

    const disposable = editor.onDidChangeCursorSelection(updateDecorations);
    updateDecorations(); // Initial call

    return () => {
      disposable.dispose();
      editor.deltaDecorations(decorationsRef.current, []);
    };
  }, [editor, isHyperFocus, settings.kinetics.neonOverdrive]);

  return { isHyperFocus };
}
