"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AutoVisualizer, { StateData } from "./AutoVisualizer";
import PlaybackControls from "./PlaybackControls";
import FeedbackLoop from "./FeedbackLoop";
import { Button } from "@/components/ui/button";
import { Beaker } from "lucide-react";

// Mock Knapsack State (DP Matrix + Weights/Values Arrays)
const dpTraceData: StateData[] = [
  {
    targetCapacity: 5,
    items: [
      { weight: 2, value: 3 },
      { weight: 3, value: 4 },
    ],
    dp_table: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 3, 3, 3, 3],
      [0, 0, 3, 4, 4, 7]
    ],
    explanation: "Knapsack DP: Final State"
  },
  {
     dp_table: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 3, 3, 3, 3],
      [0, 0, 3, 4, 4, 0] // filling the last cell
    ],
    current_i: 2,
    current_w: 5,
    explanation: "Knapsack DP: Calculating max(dp[i-1][w], val + dp[i-1][w-wt])"
  }
];

export default function AlgoTraceCanvas({ editorCode = "" }: { editorCode?: string }) {
  const [history, setHistory] = useState<StateData[]>([dpTraceData[0]]);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Testing Hook to inject ANY JSON payload
  useEffect(() => {
    const handleInject = (e: any) => {
      const { trace } = e.detail; // Array of states
      if (trace && Array.isArray(trace)) {
        setHistory(trace);
        setActiveStep(0);
        setIsPlaying(false);
        setShowFeedback(false);
      }
    };
    window.addEventListener("algotrace:inject", handleInject);
    return () => window.removeEventListener("algotrace:inject", handleInject);
  }, []);

  const runLocalCode = () => {
    let capturedTrace: StateData[] = [];
    
    // Sandbox environment function exposed to the user code
    const recordTrace = (state: any) => {
      try {
        // Deep copy the state to prevent reference mutation loops
        capturedTrace.push(JSON.parse(JSON.stringify(state)));
      } catch (e) {
        capturedTrace.push({ error: "Failed to serialize state. Did you pass a circular structure?" });
      }
    };

    try {
      // Execute the editor code in the browser sandbox, supplying the recordTrace function
      const runner = new Function('recordTrace', editorCode);
      runner(recordTrace);
      
      if (capturedTrace.length > 0) {
        setHistory(capturedTrace);
        setActiveStep(0);
        setIsPlaying(false);
        setShowFeedback(false);
      } else {
        setHistory([{ 
          status: "Warning", 
          message: "Code executed successfully, but no states were captured.", 
          tip: "Add recordTrace({ my_vars: ... }) to your code!" 
        }]);
      }
    } catch (e: any) {
      // If the user writes a syntax error, we neatly capture it and visualize the error state.
      setHistory([{ 
        Sandbox_Error: e.name, 
        message: e.message,
        line: "Check editor code syntax"
      }]);
    }
  };

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && activeStep < history.length - 1) {
      timer = setInterval(() => {
        setActiveStep((prev) => {
           const next = prev + 1;
           if(next >= history.length - 1) {
             setIsPlaying(false);
             setTimeout(() => setShowFeedback(true), 1000);
           }
           return next;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeStep, history.length]);

  return (
    // Cinematic Full Screen Feature
    <motion.div 
      layout
      initial={false}
      className={`flex flex-col bg-slate-950 overflow-hidden select-none ${
        isFullscreen 
          ? "fixed inset-0 z-[100] border-0 shadow-2xl" 
          : "relative h-full w-full"
      }`}
    >
      
      {/* Background Dots */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%">
          <pattern id="dotGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" className="fill-slate-700" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dotGrid)" />
        </svg>
      </div>

      {/* Header (Flex-none: stays at top) */}
      <div className="relative z-10 flex-none flex items-center justify-between px-6 py-4 bg-slate-900/40 backdrop-blur-md border-b border-white/5 font-outfit">
        <div className="flex flex-col">
          <h2 className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase">
            Universal Auto-Visualizer
          </h2>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">
            Memory Projection Mode
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <Button 
            variant="outline" 
            size="sm" 
            className="h-7 px-3 text-[10px] font-bold text-emerald-300 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            onClick={runLocalCode}
          >
            <Beaker className="w-3 h-3 mr-2" />
            ANALYZE ACTIVE FILE
          </Button>

          <div className="flex flex-col items-end min-w-[40px]">
            <span className="text-[10px] font-mono text-slate-400">STEP</span>
            <span className="text-xs font-mono font-bold text-white tracking-tighter">
              {activeStep + 1} / {history.length}
            </span>
          </div>

          <div className="w-px h-6 bg-white/10 mx-2" />

          {/* Cinematic Full Screen Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-white"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Cinematic Mode"
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8V5a2 2 0 0 1 2-2h3m13 0h-3a2 2 0 0 0-2 2v3m0 13v-3a2 2 0 0 1 2-2h3M8 21v-3a2 2 0 0 0-2-2H3"/></svg>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Area (Flex-1 overflow-hidden: canvas scrolls inside) */}
      <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col">
         <AutoVisualizer state={history[activeStep]} />
      </div>

      {/* Control Deck Area with built-in Feedback Drawer */}
      <div className="relative z-20 flex-none w-full p-6 bg-slate-950 border-t border-white/5 flex flex-col items-center justify-center gap-4">
         <FeedbackLoop 
           isVisible={showFeedback}
           onClose={() => setShowFeedback(false)}
         />
         <PlaybackControls 
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onNext={() => setActiveStep(prev => Math.min(prev + 1, history.length - 1))}
            onPrev={() => setActiveStep(prev => Math.max(prev - 1, 0))}
            onReset={() => setActiveStep(0)}
          />
      </div>

    </motion.div>
  );
}
