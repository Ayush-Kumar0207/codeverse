"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export type TreeNode = {
  id: string;
  value: number;
  x: number;
  y: number;
};

interface BSTVisualizerProps {
  currentNodeId: string | null;
  stepIndex: number;
  traversalPath: string[];
}

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

export default function BSTVisualizer({ currentNodeId, stepIndex, traversalPath }: BSTVisualizerProps) {
  const viewWidth = 500;
  const viewHeight = 330;

  const points = useMemo(() => {
    return traversalPath
      .map((id) => nodes.find((n) => n.id === id))
      .filter((n): n is TreeNode => Boolean(n))
      .map((n) => ({
        x: n.x,
        y: n.y,
      }));
  }, [traversalPath]);

  return (
    <div className="relative flex-1 overflow-hidden bg-slate-950/50 rounded-lg border border-white/5"
         style={{
           backgroundImage: "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.05) 1px, transparent 0)",
           backgroundSize: "20px 20px",
         }}>
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pointerGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.2)" />
            <stop offset="100%" stopColor="rgba(167,139,250,0.2)" />
          </linearGradient>
        </defs>

        {/* Edges */}
        {edges.map(([a, b]) => {
          const from = nodes.find((n) => n.id === a)!;
          const to = nodes.find((n) => n.id === b)!;
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="url(#edgeGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = node.id === currentNodeId;
          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{ duration: 0.5, delay: parseInt(node.id.slice(1)) * 0.1 }}
            >
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill={isActive ? "rgba(167,139,250,0.2)" : "rgba(15,23,42,0.8)"}
                stroke={isActive ? "#a78bfa" : "rgba(56,189,248,0.4)"}
                strokeWidth={isActive ? "3" : "2"}
                filter={isActive ? "url(#nodeGlow)" : ""}
                animate={{
                  scale: isActive ? 1.15 : 1,
                }}
              />
              <text
                x={node.x}
                y={node.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[12px] font-bold select-none ${
                  isActive ? "fill-white" : "fill-slate-400"
                }`}
              >
                {node.value}
              </text>
            </motion.g>
          );
        })}

        {/* Traversal Pointer */}
        {points.length > 0 && (
          <motion.circle
            r="24"
            fill="transparent"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeDasharray="4 4"
            filter="url(#pointerGlow)"
            animate={{
              cx: points[stepIndex]?.x ?? points[0].x,
              cy: points[stepIndex]?.y ?? points[0].y,
              rotate: 360,
            }}
            transition={{
              cx: { duration: 0.5, ease: "easeInOut" },
              cy: { duration: 0.5, ease: "easeInOut" },
              rotate: { duration: 10, repeat: Infinity, ease: "linear" }
            }}
          />
        )}
      </svg>
    </div>
  );
}

export { nodes, edges };
