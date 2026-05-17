"use client";

import { useEffect, useRef, useState } from "react";

interface TerminalPanelProps {
  onData?: (data: string) => void;
  output?: string;
}

const STARTUP_LINES = [
  "CodeVerse sandbox ready",
  "Runtime: JavaScript execution layer enabled",
];

export default function TerminalPanel({ onData, output }: TerminalPanelProps) {
  const [lines, setLines] = useState<string[]>(STARTUP_LINES);
  const [command, setCommand] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!output) return;

    setLines((current) => [
      ...current,
      "",
      ...String(output).replace(/\r/g, "").split("\n"),
    ]);
  }, [output]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  const submitCommand = () => {
    const trimmed = command.trim();
    if (!trimmed) {
      setLines((current) => [...current, "user@codeverse:~$"]);
      onData?.("\r");
      return;
    }

    setLines((current) => [
      ...current,
      `user@codeverse:~$ ${trimmed}`,
      `Command queued locally: ${trimmed}`,
    ]);
    onData?.(`${trimmed}\r`);
    setCommand("");
  };

  return (
    <div className="h-full w-full overflow-hidden bg-[#05070b] text-slate-200">
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto px-4 py-3 font-mono text-[12px] leading-6 custom-scrollbar"
      >
        {lines.map((line, index) => (
          <div
            key={`${line}-${index}`}
            className={
              line.startsWith("user@codeverse")
                ? "text-emerald-300"
                : line.toLowerCase().includes("error")
                  ? "text-rose-300"
                  : "text-slate-300"
            }
          >
            {line || "\u00a0"}
          </div>
        ))}

        <div className="flex items-center gap-2 text-emerald-300">
          <span>user@codeverse:~$</span>
          <input
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitCommand();
              }
            }}
            aria-label="Terminal command"
            className="min-w-0 flex-1 border-none bg-transparent p-0 text-slate-100 caret-indigo-400 outline-none placeholder:text-slate-600 focus:ring-0"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
