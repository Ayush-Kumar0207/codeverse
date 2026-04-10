"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, StepBack, StepForward, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type TreeNode = {
  id: string;
  value: number;
  x: number;
  y: number;
};

const nodes: TreeNode[] = [
  { id: "n1", value: 50, x: 250, y: 70 },
  { id: "n2", value: 30, x: 150, y: 160 },
  { id: "n3", value: 70, x: 350, y: 160 },
  { id: "n4", value: 20, x: 95, y: 250 },
  { id: "n5", value: 40, x: 205, y: 250 },
  { id: "n6", value: 60, x: 295, y: 250 },
  { id: "n7", value: 80, x: 405, y: 250 },
];

const edges = [
  ["n1", "n2"],
  ["n1", "n3"],
  ["n2", "n4"],
  ["n2", "n5"],
  ["n3", "n6"],
  ["n3", "n7"],
] as const;

const traversalPath = ["n1", "n2", "n4", "n5", "n3", "n6", "n7"];

export default function AlgoTraceCanvas() {
  const viewWidth = 100;
  const viewHeight = 100;
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % traversalPath.length);
    }, 850);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const points = useMemo(() => {
    return traversalPath
      .map((id) => nodes.find((n) => n.id === id))
      .filter((n): n is TreeNode => Boolean(n))
      .map((n) => ({
        x: (n.x / 500) * viewWidth,
        y: (n.y / 330) * viewHeight,
      }));
  }, []);

  const currentNodeId = traversalPath[stepIndex];
  const currentValue = nodes.find((n) => n.id === currentNodeId)?.value ?? "-";
  const traversalLabel = "Pre-order";
  const stepValue = `${stepIndex + 1}/${traversalPath.length}`;

  const goNext = () => {
    setStepIndex((prev) => (prev + 1) % traversalPath.length);
  };

  const goPrev = () => {
    setStepIndex((prev) => (prev - 1 + traversalPath.length) % traversalPath.length);
  };

  const reset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div
        className="relative flex-1 overflow-hidden border-b border-white/10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.14) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="pointerGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {edges.map(([a, b]) => {
            const from = nodes.find((n) => n.id === a)!;
            const to = nodes.find((n) => n.id === b)!;
            const x1 = (from.x / 500) * viewWidth;
            const y1 = (from.y / 330) * viewHeight;
            const x2 = (to.x / 500) * viewWidth;
            const y2 = (to.y / 330) * viewHeight;
            return (
              <line
                key={`${a}-${b}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(99,102,241,0.45)"
                strokeWidth="0.55"
                strokeLinecap="round"
              />
            );
          })}

          {nodes.map((node) => (
            <motion.g
              key={node.id}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{
                scale: node.id === currentNodeId ? 1.08 : 1,
                opacity: node.id === currentNodeId ? 1 : 0.9,
              }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              style={{
                transformOrigin: `${(node.x / 500) * viewWidth}px ${(node.y / 330) * viewHeight}px`,
              }}
            >
              <circle
                cx={(node.x / 500) * viewWidth}
                cy={(node.y / 330) * viewHeight}
                r="4.8"
                fill="rgba(255,255,255,0.06)"
                stroke={
                  node.id === currentNodeId
                    ? "rgba(167,139,250,0.95)"
                    : "rgba(56,189,248,0.45)"
                }
                strokeWidth={node.id === currentNodeId ? "0.75" : "0.45"}
                filter="url(#nodeGlow)"
              />
              <text
                x={(node.x / 500) * viewWidth}
                y={(node.y / 330) * viewHeight + 0.7}
                textAnchor="middle"
                className="fill-cyan-100 text-[4px] font-bold"
              >
                {node.value}
              </text>
            </motion.g>
          ))}

          {points.length > 1 && (
            <motion.circle
              r="5.8"
              fill="transparent"
              stroke="rgba(167,139,250,0.9)"
              strokeWidth="0.65"
              filter="url(#pointerGlow)"
              animate={{
                cx: points[stepIndex]?.x ?? points[0].x,
                cy: points[stepIndex]?.y ?? points[0].y,
              }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            />
          )}
        </svg>

        <div className="absolute left-3 top-3 right-3 flex flex-col gap-1 pointer-events-none">
          <div className="w-fit max-w-full rounded-md border border-violet-400/20 bg-black/40 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-200">
            AlgoTrace • BST Traversal ({traversalLabel})
          </div>
          <div className="w-fit max-w-full rounded-md border border-cyan-400/20 bg-black/40 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-200">
            Node {currentValue} • Step {stepValue}
          </div>
        </div>
      </div>

      <div className="h-14 border-t border-white/10 bg-black/40 backdrop-blur-md px-3 flex items-center justify-center gap-2">
        <Button size="icon-sm" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={goPrev}>
          <StepBack className="h-4 w-4" />
        </Button>
        <Button
          size="icon-sm"
          variant="secondary"
          className="text-primary"
          onClick={() => setIsPlaying((prev) => !prev)}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button size="icon-sm" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={goNext}>
          <StepForward className="h-4 w-4" />
        </Button>
        <Button size="icon-sm" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={reset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

