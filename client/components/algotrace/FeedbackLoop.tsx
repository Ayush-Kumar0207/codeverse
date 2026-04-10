"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Send, CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackLoopProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function FeedbackLoop({ isVisible, onClose }: FeedbackLoopProps) {
  const [feedbackType, setFeedbackType] = useState<"up" | "down" | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async () => {
    setStatus("submitting");
    const payload = {
      codeSnippet: "// Mock trace snippet",
      traceOutput: ["50", "30", "20", "40", "70", "60", "80"],
      userFeedback: feedbackType === "up" ? "Positive" : comment,
    };
    console.log("Routing to Neural Architect for Self-Correction:", payload);

    setStatus("success");
    setTimeout(() => {
      onClose();
      setTimeout(() => {
        setStatus("idle");
        setFeedbackType(null);
        setComment("");
      }, 500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ height: 0, opacity: 0, scale: 0.95 }}
          className="w-full max-w-sm z-50 overflow-hidden"
        >
          {/* Refactored: Unobtrusive Toast-like floating pill */}
          <div className="p-3 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl glass-effect relative">
            <button 
              onClick={onClose}
              className="absolute top-1.5 right-1.5 p-1 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>

            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 py-1 text-center"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <h3 className="text-white text-[11px] font-bold">Feedback Sent</h3>
                  <p className="text-slate-400 text-[9px]">Successfully routed to Neural Architect</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 pr-4">
                  <div className="overflow-hidden">
                    <h3 className="text-white text-[11px] font-bold truncate">Trace Complete</h3>
                    <p className="text-slate-400 text-[8px] uppercase tracking-wider truncate">Visualization accurate?</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant={feedbackType === "up" ? "default" : "ghost"}
                      size="icon"
                      className={`h-7 w-7 ${feedbackType === "up" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400"}`}
                      onClick={() => {
                        setFeedbackType("up");
                        handleSubmit();
                      }}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant={feedbackType === "down" ? "default" : "ghost"}
                      size="icon"
                      className={`h-7 w-7 ${feedbackType === "down" ? "bg-rose-500/20 text-rose-400" : "text-slate-400"}`}
                      onClick={() => setFeedbackType("down")}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {feedbackType === "down" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="pt-1 space-y-2">
                        <Textarea
                          placeholder="What was wrong?"
                          className="bg-black/40 border-white/5 focus:border-indigo-500/50 resize-none h-16 text-[11px] text-slate-300"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <Button 
                          className="w-full h-8 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold"
                          onClick={handleSubmit}
                          disabled={status === "submitting"}
                        >
                          <Send className="w-3 h-3 mr-2" />
                          {status === "submitting" ? "Submitting..." : "Submit Correction"}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
