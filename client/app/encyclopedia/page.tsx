"use client";

import { useState } from "react";
import { AT_ALGORITHMS, AlgorithmEntry, AlgorithmApproach } from "@/data/algorithms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, BookOpen, Code2, Link as LinkIcon, Cpu, HardDrive, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function EncyclopediaPage() {
  const [activeAlgo, setActiveAlgo] = useState<AlgorithmEntry>(AT_ALGORITHMS[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeApproachIdx, setActiveApproachIdx] = useState(0);
  const [selectedLang, setSelectedLang] = useState("JavaScript");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredAlgos = AT_ALGORITHMS.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // When switching algorithms, reset approach to 0
  const handleSelectAlgo = (algo: AlgorithmEntry) => {
    setActiveAlgo(algo);
    setActiveApproachIdx(0);
  };

  const activeApproach = activeAlgo.approaches[activeApproachIdx] || activeAlgo.approaches[0];

  return (
    <div className="h-screen flex w-full bg-slate-950 text-foreground font-sans overflow-hidden">
      
      {/* Left List Pane (Hidden in Fullscreen) */}
      {!isFullscreen && (
        <div className="w-[320px] flex-none border-r border-white/5 flex flex-col bg-slate-900/50 relative z-20">
          <div className="p-5 border-b border-white/5 bg-slate-900/80 backdrop-blur-md">
            <h2 className="text-xs font-black tracking-widest uppercase text-slate-300 flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Algorithm Codex
            </h2>
            <input 
              type="text" 
              placeholder="Search algorithms..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 shadow-inner max-w-full truncate flex-1 focus:ring-1"
            />
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1.5">
              {filteredAlgos.map((algo) => {
                const isActive = activeAlgo.id === algo.id;
                const difficultyColor = 
                  algo.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                  algo.difficulty === "Medium" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                  "bg-rose-500/20 text-rose-400 border-rose-500/30";
                  
                return (
                  <button
                    key={algo.id}
                    onClick={() => handleSelectAlgo(algo)}
                    className={"w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex flex-col gap-2 " + (isActive ? "bg-indigo-500/10 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]" : "hover:bg-white/5 border border-transparent")}
                  >
                    <div className="flex justify-between items-center w-full gap-2">
                      <span className={"text-xs font-bold leading-tight " + (isActive ? "text-indigo-300" : "text-slate-300")}>{algo.title}</span>
                      <span className={"text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase shrink-0 " + difficultyColor}>
                        {algo.difficulty}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium tracking-wide">{algo.category} • Fre: {algo.frequencyLevel}</span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Right Detail Pane */}
      <motion.div 
        layout
        className={isFullscreen 
          ? "fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-hidden" 
          : "flex-1 flex flex-col overflow-hidden relative"
        }
      >
         <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400 via-slate-900 to-black mix-blend-screen" />
         
         <div className="absolute top-6 right-8 flex gap-3 z-50">
            {activeAlgo.visualizerCode && (
              <a 
                href={"/editor/demo-sandbox?mode=demo&algo=" + activeAlgo.id}
                title="Inject Code into IDE"
                className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-md transition-colors"
                target="_blank" rel="noreferrer"
              >
                <Code2 className="w-5 h-5" />
              </a>
            )}
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Toggle Focus Mode"
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-md transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
         </div>
         
         <div className="flex-1 relative z-10 px-8 md:px-16 py-12 overflow-y-auto">
            <div className={"mx-auto space-y-12 transition-all duration-300 pb-32 " + (isFullscreen ? "max-w-6xl" : "max-w-4xl")}>
               
               {/* 1. Header Section */}
               <div className="space-y-4 pr-32">
                  <div className="flex flex-wrap items-center gap-2">
                     <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] rounded uppercase tracking-widest font-bold">
                       {activeAlgo.category}
                     </span>
                     <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] rounded uppercase tracking-widest font-bold font-mono">
                       {activeAlgo.frequencyLevel} Frequency
                     </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">{activeAlgo.title}</h1>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                     {activeAlgo.overview}
                  </p>
                  
                  {activeAlgo.useCases && activeAlgo.useCases.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 py-1.5 mr-2">Use Cases:</span>
                        {activeAlgo.useCases.map((uc, i) => (
                           <span key={i} className="text-[10px] px-2.5 py-1 bg-white/5 border border-white/10 rounded text-slate-300">
                             {uc}
                           </span>
                        ))}
                     </div>
                  )}
               </div>

               {/* 2. Visualizer Native Injection Banner */}
               {activeAlgo.visualizerCode && (
                  <div className="bg-gradient-to-r from-indigo-900/60 to-slate-900/40 border border-indigo-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_40px_rgba(99,102,241,0.05)]">
                     <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-indigo-400" />
                          Interactive Coaching Available
                        </h3>
                        <p className="text-xs text-indigo-200/70 mt-1 max-w-lg leading-relaxed">
                          This algorithm comes with a pre-configured Auto-Visualizer script. Inject it into the CodeVerse simulation environment to trace the pointers and logic natively.
                        </p>
                     </div>
                     <a 
                       href={"/editor/demo-sandbox?mode=demo&algo=" + activeAlgo.id}
                       className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2 shrink-0 w-full md:w-auto justify-center"
                     >
                       <Code2 className="w-4 h-4" />
                       Activate Simulation
                     </a>
                  </div>
               )}

               {/* 3. Multi-Tier Architecture Section */}
               <div className="space-y-6">
                  
                  {/* Approach Tabs */}
                  <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar mask-image-gradient-r">
                    {activeAlgo.approaches.map((appr, idx) => (
                       <button
                         key={idx}
                         onClick={() => setActiveApproachIdx(idx)}
                         className={"px-5 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0 uppercase tracking-widest flex items-center gap-2 " + (
                           activeApproachIdx === idx 
                           ? "bg-white text-black shadow-lg" 
                           : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                         )}
                       >
                         Method {idx + 1}: {appr.name}
                       </button>
                    ))}
                  </div>

                  {/* Active Approach Display */}
                  <AnimatePresence mode="wait">
                    <motion.div
                       key={activeApproachIdx}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       transition={{ duration: 0.2 }}
                       className="space-y-8"
                    >
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-3">
                             <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                               <Sparkles className="w-5 h-5 text-emerald-400" />
                               Step-by-Step Methodology
                             </h3>
                             <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-headings:text-indigo-300 prose-strong:text-indigo-400 bg-white/5 p-6 rounded-2xl border border-white/5 shadow-inner">
                               <ReactMarkdown>{activeApproach.description}</ReactMarkdown>
                             </div>
                          </div>
                          
                          <div className="space-y-4 flex flex-col justify-center">
                             <div className="bg-slate-900/80 border border-white/5 p-4 rounded-xl flex items-center gap-4">
                               <div className={"p-3 rounded-lg " + (activeApproach.timeComplexity.includes("2^") || activeApproach.timeComplexity.includes("N^") ? "bg-rose-500/10 text-rose-400" : activeApproach.timeComplexity.includes("log") ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400")}>
                                  <Cpu className="w-5 h-5" />
                               </div>
                               <div>
                                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Time Complexity</div>
                                  <div className="font-mono font-bold text-white text-base">{activeApproach.timeComplexity}</div>
                               </div>
                             </div>
                             
                             <div className="bg-slate-900/80 border border-white/5 p-4 rounded-xl flex items-center gap-4">
                               <div className={"p-3 rounded-lg " + (activeApproach.spaceComplexity.includes("N") ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400")}>
                                  <HardDrive className="w-5 h-5" />
                               </div>
                               <div>
                                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Space Complexity</div>
                                  <div className="font-mono font-bold text-white text-base">{activeApproach.spaceComplexity}</div>
                               </div>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-3 pt-4 border-t border-white/5 mt-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-2">
                              System Implementation
                            </h3>
                            
                            {/* Polyglot Language Switcher */}
                            <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                              {activeApproach.implementations.map((impl) => (
                                <button
                                  key={impl.language}
                                  onClick={() => setSelectedLang(impl.language)}
                                  className={"px-3 py-1.5 text-[10px] font-bold rounded flex-1 sm:flex-none uppercase tracking-wider transition-all " + (
                                    selectedLang === impl.language
                                    ? "bg-indigo-500 text-white shadow-md"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                  )}
                                >
                                  {impl.language}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="relative group rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                             <div className="absolute top-0 left-0 right-0 h-8 bg-black/60 flex items-center justify-between px-4 gap-2 border-b border-white/5 z-10">
                               <div className="flex items-center gap-2">
                                 <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                                 <div className="ml-2 text-[9px] font-mono text-slate-400">{activeAlgo.id}-{activeApproach.name.toLowerCase().replace(/ /g, '-')}.{
                                    selectedLang === "Python" ? "py" : 
                                    selectedLang === "Java" ? "java" : 
                                    selectedLang === "C++" ? "cpp" : "js"
                                 }</div>
                               </div>
                               <button 
                                 className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
                                 onClick={() => navigator.clipboard.writeText(
                                   activeApproach.implementations.find(impl => impl.language === selectedLang)?.code || activeApproach.implementations[0].code
                                 )}
                               >
                                 Copy snippet
                               </button>
                             </div>
                             <pre className="bg-[#0D0D0D] p-6 pt-12 overflow-x-auto text-sm font-mono text-slate-300 leading-loose min-h-[150px]">
                               <code>
                                 {activeApproach.implementations.find(impl => impl.language === selectedLang)?.code || activeApproach.implementations[0].code}
                               </code>
                             </pre>
                          </div>
                       </div>
                       
                    </motion.div>
                  </AnimatePresence>
               </div>
            </div>
         </div>
      </motion.div>

    </div>
  );
}
