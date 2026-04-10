"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  ShieldCheck, 
  Globe, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  Loader2,
  Server
} from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  deploymentUrl?: string;
  error?: string;
  projectName: string;
}

const STEPS = [
  { id: "sync", label: "Neural Workspace Sync", icon: Rocket },
  { id: "build", label: "Aegis Asset Optimization", icon: ShieldCheck },
  { id: "deploy", label: "Edge Propagation", icon: Globe },
];

export default function DeploymentModal({
  isOpen,
  onClose,
  deploymentUrl,
  error,
  projectName,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    if (isOpen && !deploymentUrl && !error) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isOpen, deploymentUrl, error]);

  useEffect(() => {
    if (deploymentUrl) {
      setIsFinishing(true);
    }
  }, [deploymentUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-[0_20px_100px_rgba(99,102,241,0.2)] overflow-hidden glass-effect"
      >
        {/* Progress header */}
        <div className="p-8 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5">
             <motion.div 
               className="h-full bg-primary shadow-[0_0_20px_rgba(99,102,241,0.8)]"
               initial={{ width: "0%" }}
               animate={{ width: deploymentUrl ? "100%" : `${(currentStep + 1) * 33}%` }}
               transition={{ duration: 1 }}
             />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight uppercase">Aegis Deployment Engine</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{projectName}</p>
              </div>
            </div>
            {!deploymentUrl && !error && (
               <Loader2 className="w-5 h-5 text-primary animate-spin" />
            )}
            {(deploymentUrl || error) && (
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {!deploymentUrl && !error ? (
            <div className="space-y-4">
              {STEPS.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`flex items-center gap-4 transition-all duration-500 ${index <= currentStep ? "opacity-100 translate-x-0" : "opacity-30 translate-x-4"}`}
                >
                  <div className={`p-1.5 rounded-full ${index < currentStep ? "bg-green-500/20 text-green-500" : index === currentStep ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"}`}>
                    {index < currentStep ? <CheckCircle2 className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${index === currentStep ? "text-primary" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs font-bold">
               ❌ CRITICAL ERROR: {error}
            </div>
          ) : (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-6 bg-green-500/5 border border-green-500/20 rounded-xl text-center space-y-4"
             >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">System Propagated</h3>
                <p className="text-xs text-muted-foreground">Successfully deployed to global edge infrastructure.</p>
                
                <div className="p-3 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between gap-4 group cursor-pointer hover:bg-black/60 transition-colors" onClick={() => window.open(deploymentUrl, '_blank')}>
                   <span className="text-[10px] font-mono text-primary truncate flex-1 text-left">{deploymentUrl}</span>
                   <ExternalLink className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                </div>

                <div className="pt-4 flex gap-3">
                   <Button variant="outline" className="flex-1 text-[10px] h-9 border-white/10" onClick={onClose}>Dismiss</Button>
                   <Button className="flex-1 text-[10px] h-9 bg-primary" onClick={() => window.open(deploymentUrl, '_blank')}>
                      Visit Deployment
                   </Button>
                </div>
             </motion.div>
          )}
        </div>

        {/* Console output footer (God-Level touch) */}
        {!deploymentUrl && !error && (
          <div className="p-4 bg-black/60 font-mono text-[10px] text-muted-foreground h-32 overflow-hidden relative">
             <div className="space-y-1">
               <div className="text-green-500/70">[{new Date().toLocaleTimeString()}] COMPRESSION_ACTIVE: Compacting workspace assets...</div>
               <div>[{new Date().toLocaleTimeString()}] NEURAL_SYNC: Optimizing project weight...</div>
               <div>[{new Date().toLocaleTimeString()}] PROFILING: Analyzing entry points...</div>
               {currentStep >= 1 && <div className="text-primary/70">[{new Date().toLocaleTimeString()}] AEGIS_BRIDGE: Connecting to edge node group alpha...</div>}
               {currentStep >= 2 && <div className="text-primary/70">[{new Date().toLocaleTimeString()}] PROPAGATION: Distributing static blocks...</div>}
             </div>
             <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
