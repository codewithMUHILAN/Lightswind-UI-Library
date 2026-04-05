"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface Node {
    id: string;
    content: React.ReactNode;
    position: { x: number; y: number }; // absolute positions
}

interface Connection {
    from: string; // source node id
    to: string;   // target node id
    direction?: "horizontal" | "vertical"; // optional override
}

interface ConnectionGraphProps {
    nodes: Node[];
    connections: Connection[];
    beamColor?: string;
    beamDuration?: number; // ms
    className?: string;
}

const ConnectionGraph: React.FC<ConnectionGraphProps> = ({
    nodes,
    connections,
    beamColor = "#ff4500",
    beamDuration = 2000,
    className,
}) => {
    return (
        <div className={cn("relative w-full h-full", className)}>
            {/* Render Nodes */}
            {nodes.map((node) => (
                <div
                    key={node.id}
                    className="absolute flex items-center justify-center rounded-xl 
          shadow-lg bg-white dark:bg-neutral-900 border border-neutral-200 
          dark:border-neutral-700 w-28 h-28"
                    style={{ left: node.position.x, top: node.position.y }}
                >
                    {node.content}
                </div>
            ))}

            {/* Render Connections */}
            {connections.map((conn, i) => {
                const from = nodes.find((n) => n.id === conn.from);
                const to = nodes.find((n) => n.id === conn.to);
                if (!from || !to) return null;

                const x1 = from.position.x + 56; // center offset
                const y1 = from.position.y + 56;
                const x2 = to.position.x + 56;
                const y2 = to.position.y + 56;

                const isHorizontal = Math.abs(y1 - y2) < Math.abs(x1 - x2);

                return (
                    <svg
                        key={i}
                        className="absolute pointer-events-none overflow-visible"
                        style={{ left: 0, top: 0 }}
                    >
                        {/* Line */}
                        <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="rgba(200,200,200,0.4)"
                            strokeWidth={2}
                        />

                        {/* Beam animation */}
                        <motion.circle
                            r={6}
                            fill={beamColor}
                            initial={{ x: x1, y: y1, opacity: 0 }}
                            animate={{
                                x: [x1, x2],
                                y: [y1, y2],
                                opacity: [0, 1, 1, 0],
                            }}
                            transition={{
                                duration: beamDuration / 1000,
                                repeat: Infinity,
                                ease: "easeInOut",
                                repeatDelay: Math.random() * 2, // random splash timing
                            }}
                        />

                        {/* Splash at the end */}
                        <motion.circle
                            r={0}
                            cx={x2}
                            cy={y2}
                            fill={beamColor}
                            animate={{ r: [0, 10, 0], opacity: [0, 0.8, 0] }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                repeatDelay: beamDuration / 1000 + Math.random() * 2,
                            }}
                        />
                    </svg>
                );
            })}
        </div>
    );
};

export default ConnectionGraph;
