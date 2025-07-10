"use client";
import React from "react";

export default function OutputConsole({ output }: { output: string }) {
  return (
    <div className="bg-black text-green-400 font-mono text-sm p-3 mt-4 rounded-lg border border-gray-700 h-40 overflow-auto">
      <h3 className="font-semibold text-white mb-1">Output:</h3>
      <pre>{output || "// No output yet"}</pre>
    </div>
  );
}
