"use client";

import { motion } from "framer-motion";
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
  note?: string;
}

const STEPS = [
  { id: "sync", label: "Collect Workspace Files", icon: Rocket },
  { id: "build", label: "Prepare Static Assets", icon: ShieldCheck },
  { id: "deploy", label: "Publish Local Route", icon: Globe },
];

export default function DeploymentModal({
  isOpen,
  onClose,
  deploymentUrl,
  error,
  projectName,
  note,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !deploymentUrl && !error) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isOpen, deploymentUrl, error]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/40"
      >
        {/* Progress header */}
        <div className="relative overflow-hidden border-b border-border p-8">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-muted">
             <motion.div 
               className="h-full bg-primary shadow-lg shadow-primary/30"
               initial={{ width: "0%" }}
               animate={{ width: deploymentUrl ? "100%" : `${(currentStep + 1) * 33}%` }}
               transition={{ duration: 1 }}
             />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight uppercase">Deployment Engine</h2>
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
                  <div className={`p-1.5 rounded-full ${index < currentStep ? "bg-emerald-500/20 text-emerald-400" : index === currentStep ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
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
               Deployment failed: {error}
            </div>
          ) : (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-6 text-center"
             >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Deployment Ready</h3>
                <p className="text-xs text-muted-foreground">
                  {note || "Your project is now served by the local CodeVerse deployment server."}
                </p>
                
                <a
                  className="group flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-border bg-muted/50 p-3 transition-colors hover:bg-muted"
                  href={deploymentUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                   <span className="text-[10px] font-mono text-primary truncate flex-1 text-left">{deploymentUrl}</span>
                   <ExternalLink className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                </a>

                <div className="pt-4 flex gap-3">
                   <Button variant="outline" className="h-9 flex-1 border-border text-[10px]" onClick={onClose}>Dismiss</Button>
                   <a
                     className="group/button inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-primary px-2.5 text-[10px] font-medium text-primary-foreground transition-all hover:bg-primary/80"
                     href={deploymentUrl}
                     target="_blank"
                     rel="noreferrer"
                   >
                      Visit Deployment
                   </a>
                </div>
             </motion.div>
          )}
        </div>

        {/* Console output footer (God-Level touch) */}
        {!deploymentUrl && !error && (
          <div className="relative h-32 overflow-hidden bg-muted/60 p-4 font-mono text-[10px] text-muted-foreground">
             <div className="space-y-1">
               <div className="text-emerald-400/70">[{new Date().toLocaleTimeString()}] FILES_READY: Collecting workspace files...</div>
               <div>[{new Date().toLocaleTimeString()}] STATIC_BUILD: Preparing browser assets...</div>
               <div>[{new Date().toLocaleTimeString()}] ROUTE_CHECK: Reserving deployment URL...</div>
               {currentStep >= 1 && <div className="text-primary/70">[{new Date().toLocaleTimeString()}] INDEX_READY: Confirming application entry point...</div>}
               {currentStep >= 2 && <div className="text-primary/70">[{new Date().toLocaleTimeString()}] PUBLISH_READY: Serving project from backend...</div>}
             </div>
             <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-card to-transparent" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
