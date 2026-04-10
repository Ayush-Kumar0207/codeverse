"use client";

import { motion } from "framer-motion";
import React from "react";

// Types
export type StateData = Record<string, any>;

interface AutoVisualizerProps {
  state: StateData;
}

export default function AutoVisualizer({ state }: AutoVisualizerProps) {
  // If no state, empty container
  if (!state || Object.keys(state).length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-sm">
        No state data available.
      </div>
    );
  }

  const narrativeKeys = ["explanation", "narrative", "focus_message", "calculation", "tip"];
  const narrativeData = Object.entries(state).filter(([k]) => narrativeKeys.includes(k.toLowerCase()));
  const standardData = Object.entries(state).filter(([k]) => !narrativeKeys.includes(k.toLowerCase()));

  return (
    <div className="w-full h-full p-4 pb-24 overflow-y-auto flex flex-col items-center justify-start gap-8 custom-scrollbar">
      
      {/* 1. Beginner-Friendly Narrative Ribbon */}
      {narrativeData.length > 0 && (
        <div className="w-full max-w-2xl shrink-0 flex flex-col gap-3 z-10 sticky top-0">
          {narrativeData.map(([key, value]) => (
            <NarrativeRibbon key={key} title={key} message={value} fullState={state} />
          ))}
        </div>
      )}

      {/* 2. Standard Universal Auto-Layout */}
      {standardData.map(([key, value]) => {
        return (
          <div key={key} className="flex flex-col items-center max-w-full">
            <h3 className="mb-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              {key}
            </h3>
            <VisualizerRouter data={value} varName={key} />
          </div>
        );
      })}
    </div>
  );
}

function NarrativeRibbon({ title, message, fullState }: { title: string, message: any, fullState: StateData }) {
  const handleAskAI = () => {
    window.dispatchEvent(new CustomEvent('algotrace:ask_ai', { 
      detail: { 
        stateContext: fullState,
        question: `I don't understand this trace step: "${title.replace(/_/g, ' ')}". Can you explicitly explain it?`
      } 
    }));
  };

  return (
    <motion.div 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-indigo-900/60 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 shadow-[0_10px_30px_rgba(99,102,241,0.15)] flex gap-4 items-start relative group"
    >
      <div className="mt-0.5 min-w-[20px]">
        {/* Sparkle Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
      </div>
      <div className="flex-1 pr-16">
        <h4 className="text-[10px] font-black tracking-[0.15em] text-indigo-300 uppercase mb-1">
          {title.replace(/_/g, ' ')}
        </h4>
        <p className="text-sm font-medium text-emerald-50 leading-relaxed font-sans mt-1">
          {typeof message === 'object' ? JSON.stringify(message) : String(message)}
        </p>
      </div>
      
      {/* Ask AI Bridge Button */}
      <button 
        onClick={handleAskAI}
        title="Ask AI about this specific step"
        className="absolute right-4 top-4 px-3 py-1.5 bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-200 border border-white/10 hover:border-indigo-500/40 text-slate-300 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all shadow-lg flex items-center gap-1.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
        Ask AI
      </button>
    </motion.div>
  );
}

// Routes to the correct rendering engine based on data type
function VisualizerRouter({ data, varName }: { data: any; varName: string }) {
  if (Array.isArray(data)) {
    if (data.length > 0 && Array.isArray(data[0])) {
      return <MatrixGrid data={data} />;
    }
    return <LinearArray data={data} />;
  }
  
  if (typeof data === "object" && data !== null) {
    // Fallback for objects (could be trees or graphs later)
    return <GenericObject data={data} />;
  }

  return <VariableChip data={data} />;
}

// ---------------------------------------------------------
// 2D Matrix Engine (Knapsack, Floyd-Warshall, DP Tables)
// ---------------------------------------------------------
function MatrixGrid({ data }: { data: any[][] }) {
  const rows = data.length;
  const cols = data[0]?.length || 0;

  return (
    // The key to "Zoom automatically, then pan" is max-w-full and overflow-auto.
    // By giving cells a min-width, they shrink until min-w, then trigger scroll.
    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 shadow-xl max-w-full overflow-auto custom-scrollbar">
      <div 
        className="grid gap-1" 
        style={{ 
          gridTemplateColumns: `repeat(${cols}, minmax(32px, 1fr))` 
        }}
      >
        {data.map((row, rIdx) => 
          row.map((cell, cIdx) => (
            <motion.div
              layout
              key={`${rIdx}-${cIdx}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: (rIdx * cols + cIdx) * 0.01 }}
              className="flex items-center justify-center min-w-[32px] h-[32px] md:min-w-[40px] md:h-[40px] bg-slate-800 border border-slate-700/50 rounded-sm text-[10px] md:text-xs text-white font-mono overflow-hidden text-ellipsis whitespace-nowrap px-1"
            >
              {typeof cell === 'object' ? JSON.stringify(cell) : String(cell)}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 1D Linear Array Engine (Sorting, Lists)
// ---------------------------------------------------------
function LinearArray({ data }: { data: any[] }) {
  return (
    <div className="max-w-full overflow-auto custom-scrollbar pb-2">
      <div className="flex gap-1">
        {data.map((item, idx) => (
          <motion.div
            layout
            key={idx}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center justify-center min-w-[40px] h-[40px] px-2 bg-indigo-500/10 border border-indigo-500/30 rounded-md text-[10px] sm:text-xs text-indigo-100 font-mono shadow-sm">
              {typeof item === 'object' ? JSON.stringify(item) : String(item)}
            </div>
            <span className="mt-1 text-[8px] text-slate-500 font-mono">{idx}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Primitive Variable Engine (Numbers, Strings, Booleans)
// ---------------------------------------------------------
function VariableChip({ data }: { data: any }) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 font-mono text-sm shadow-sm"
    >
      {String(data)}
    </motion.div>
  );
}

// ---------------------------------------------------------
// Generic Object Fallback (Key-Value representation)
// ---------------------------------------------------------
function GenericObject({ data }: { data: Record<string, any> }) {
  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-lg p-3 text-xs font-mono max-w-full overflow-hidden text-ellipsis">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="flex gap-2 py-0.5">
          <span className="text-slate-400">{k}:</span>
          <span className="text-white truncate">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
        </div>
      ))}
    </div>
  );
}
