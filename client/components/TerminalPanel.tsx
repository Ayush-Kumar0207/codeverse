"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

interface TerminalPanelProps {
  onData?: (data: string) => void;
  output?: string;
}

export default function TerminalPanel({ onData, output }: TerminalPanelProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm with Midnight Theme
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 12,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      theme: {
        background: "transparent",
        foreground: "#94a3b8", // slate-400
        cursor: "#6366f1",     // indigo-500
        selectionBackground: "rgba(99, 102, 241, 0.3)",
        black: "#020617",
        red: "#ef4444",
        green: "#22c55e",
        yellow: "#eab308",
        blue: "#3b82f6",
        magenta: "#a855f7",
        cyan: "#06b6d4",
        white: "#f8fafc",
      },
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    term.open(terminalRef.current);
    
    const tryFit = () => {
      try {
        fitAddon.fit();
      } catch (e) {
        // Ignore xterm fit errors when container is 0x0 or unmounted
      }
    };

    // Initial fit with frame delay to ensure DOM is painted
    requestAnimationFrame(() => {
      tryFit();
    });

    term.writeln("\x1b[38;5;99mCODEVERSE\x1b[0m \x1b[38;5;214mv2.0.4-STABLE\x1b[0m");
    term.writeln("Ready for enterprise execution secure_layer=enabled");
    term.write("\r\n\x1b[32muser@codeverse\x1b[0m:\x1b[34m~\x1b[0m$ ");

    term.onData((data) => {
      // Handle basic interactivity for 'God-Level' feel
      if (data === "\r") {
        term.write("\r\n\x1b[32muser@codeverse\x1b[0m:\x1b[34m~\x1b[0m$ ");
      } else if (data === "\u007f") { // Backspace
        // Basic backspace handling (simplified)
        term.write("\b \b");
      } else {
        term.write(data);
      }
      onData?.(data);
    });

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Use ResizeObserver for accurate container tracking inside resizable panels
    const resizeObserver = new ResizeObserver(() => {
       requestAnimationFrame(() => tryFit());
    });
    
    if (terminalRef.current) {
        resizeObserver.observe(terminalRef.current);
    }

    return () => {
      term.dispose();
      resizeObserver.disconnect();
    };
  }, [onData]);

  // Handle incoming output from execution or sockets
  useEffect(() => {
    if (output && xtermRef.current) {
        xtermRef.current.writeln(`\r\n${output}`);
        xtermRef.current.write("\x1b[32muser@codeverse\x1b[0m:\x1b[34m~\x1b[0m$ ");
    }
  }, [output]);

  return (
    <div className="w-full h-full bg-transparent p-2">
      <div ref={terminalRef} className="w-full h-full overflow-hidden" />
    </div>
  );
}
