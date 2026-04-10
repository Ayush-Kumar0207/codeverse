"use client";

import { useEffect, useRef } from "react";
import * as monacoType from "monaco-editor";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";

interface RemoteCursor {
  username: string;
  line: number;
  column: number;
  color: string;
}

export const usePresenceCursors = (
  editor: monacoType.editor.IStandaloneCodeEditor | null,
  monaco: typeof monacoType | null,
  socket: any,
  roomId: string,
  currentUser?: string
) => {
  const decorationsRef = useRef<Record<string, string[]>>({});

  useEffect(() => {
    if (!editor || !monaco || !socket) return;

    const colors = [
      "#6366f1", // indigo
      "#ec4899", // pink
      "#22c55e", // green
      "#eab308", // yellow
      "#3b82f6", // blue
      "#a855f7", // purple
    ];

    const getHashColor = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    };

    const handleCursorMove = (data: { username: string; position: { lineNumber: number; column: number } }) => {
      if (data.username === currentUser) return;

      const userColor = getHashColor(data.username);
      const { lineNumber, column } = data.position;

      // Unique class name for this user's cursor
      const className = `cursor-${data.username.replace(/\s+/g, '-')}`;
      
      // Injection of CSS for the cursor color
      if (!document.getElementById(className)) {
        const style = document.createElement('style');
        style.id = className;
        style.innerHTML = `
          .${className} {
            background-color: ${userColor};
            width: 2px !important;
          }
          .${className}-label {
            background-color: ${userColor};
            color: white;
            font-size: 10px;
            padding: 2px 4px;
            border-radius: 2px;
            position: absolute;
            top: -14px;
            white-space: nowrap;
            font-family: inherit;
            pointer-events: none;
            z-index: 10;
          }
        `;
        document.head.appendChild(style);
      }

      const newDecorations: monacoType.editor.IModelDeltaDecoration[] = [
        {
          range: new monaco.Range(lineNumber, column, lineNumber, column),
          options: {
            className: className,
            hoverMessage: { value: data.username },
            after: {
               content: data.username,
               inlineClassName: `${className}-label`
            }
          },
        },
      ];

      decorationsRef.current[data.username] = editor.deltaDecorations(
        decorationsRef.current[data.username] || [],
        newDecorations
      );
    };

    const socketHandler = (data: any) => handleCursorMove(data);
    socket.on(SOCKET_EVENTS.CURSOR_MOVE, socketHandler);

    // Track own cursor
    const disposable = editor.onDidChangeCursorPosition((e) => {
      socket.emit(SOCKET_EVENTS.CURSOR_MOVE, {
        roomId,
        username: currentUser || "Guest",
        position: e.position,
      });
    });

    return () => {
      socket.off(SOCKET_EVENTS.CURSOR_MOVE, socketHandler);
      disposable.dispose();
      // Cleanup styles
      Object.keys(decorationsRef.current).forEach(user => {
        const el = document.getElementById(`cursor-${user.replace(/\s+/g, '-')}`);
        if (el) el.remove();
      });
    };
  }, [editor, monaco, socket, roomId, currentUser]);
};
