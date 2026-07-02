"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Send, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackLoopProps {
  isVisible: boolean;
  onClose: () => void;
  codeSnippet?: string;
  traceOutput?: unknown[];
  compact?: boolean;
}

export default function FeedbackLoop({
  isVisible,
  onClose,
  codeSnippet = "",
  traceOutput = [],
  compact = false,
}: FeedbackLoopProps) {
  const [feedbackType, setFeedbackType] = useState<"up" | "down" | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const reset = () => {
    setStatus("idle");
    setFeedbackType(null);
    setComment("");
  };

  const handleSubmit = async (type = feedbackType) => {
    setStatus("submitting");
    const payload = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
      timestamp: new Date().toISOString(),
      codeSnippet: codeSnippet.slice(0, 4000),
      traceOutput: traceOutput.slice(0, 50),
      userFeedback: type === "up" ? "Positive" : comment,
    };

    const existing = JSON.parse(localStorage.getItem("codeverse-algotrace-feedback") || "[]");
    localStorage.setItem("codeverse-algotrace-feedback", JSON.stringify([payload, ...existing].slice(0, 50)));

    setStatus("success");
    setTimeout(() => {
      onClose();
      setTimeout(reset, 300);
    }, 1400);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          className={compact ? "w-full min-w-0 max-w-2xl" : "w-full max-w-md"}
        >
          <div className={`relative rounded-md border border-slate-800 bg-slate-950 ${compact ? "px-3 py-2 shadow-sm" : "px-4 py-3 shadow-xl"}`}>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close feedback"
              className="absolute right-2 top-2 rounded p-1 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {status === "success" ? (
              <div className="flex items-center gap-3 pr-6">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <div>
                  <div className="text-sm font-semibold text-slate-100">Feedback saved</div>
                  <div className="text-xs text-slate-500">Thanks for helping tune the trace view.</div>
                </div>
              </div>
            ) : (
              <div className={compact ? "space-y-2 pr-6" : "space-y-3 pr-6"}>
                <div className={compact ? "flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" : ""}>
                  <div className="min-w-0">
                    <div className={compact ? "truncate text-xs font-semibold text-slate-100" : "text-sm font-semibold text-slate-100"}>Was this trace useful?</div>
                    <div className={compact ? "hidden text-[11px] text-slate-500 xl:block" : "text-xs text-slate-500"}>Your note is stored locally for this workspace.</div>
                  </div>

                  <div className={compact ? "flex shrink-0 items-center gap-2" : "mt-3 flex items-center gap-2"}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                      onClick={() => {
                        setFeedbackType("up");
                        handleSubmit("up");
                      }}
                    >
                      <ThumbsUp className="mr-2 h-3.5 w-3.5" />
                      Helpful
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                      onClick={() => setFeedbackType("down")}
                    >
                      <ThumbsDown className="mr-2 h-3.5 w-3.5" />
                      Needs work
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {feedbackType === "down" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <Textarea
                        placeholder="What should be clearer?"
                        className="h-20 resize-none border-slate-800 bg-slate-950 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                      />
                      <Button
                        className="h-8 w-full bg-indigo-500 text-xs font-semibold text-white hover:bg-indigo-400"
                        onClick={() => handleSubmit("down")}
                        disabled={status === "submitting"}
                      >
                        <Send className="mr-2 h-3.5 w-3.5" />
                        {status === "submitting" ? "Saving" : "Save feedback"}
                      </Button>
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
