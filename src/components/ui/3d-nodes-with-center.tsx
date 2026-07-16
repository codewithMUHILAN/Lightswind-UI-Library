"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import { cn } from "@/components/lib/utils";
import { Zap, Database, Shield, Cloud, Globe, Cpu } from "lucide-react";
// Interface for each Node Item
export interface NodeItem {
  id: string | number;
  label: string;
  tooltip?: string;
  icon?: React.ComponentType<any> | React.ReactNode;
  iconClassName?: string;
  href?: string;
  onClick?: () => void;
}

// Props interface for the component
export interface ThreeDNodesCenterProps {
  className?: string;
  nodes?: NodeItem[];
  centerLogo?: string | React.ReactNode;
  brandText?: string;
  lineColorLight?: string;
  lineColorDark?: string;
  glowColor?: string;
}

export const ThreeDNodesCenter: React.FC<ThreeDNodesCenterProps> = ({
  className,
  nodes,
  centerLogo,
  brandText = "@Lightswind UI",
  lineColorLight = "#cbd5e1", // slate-300
  lineColorDark = "#3f3f46",   // zinc-700
  glowColor = "#3b82f6",       // blue-500
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const centerHubRef = useRef<HTMLDivElement>(null);
  const brandTextRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeItem | null>(null);

  // Default fallback nodes if none provided
  const defaultNodes: NodeItem[] = [
    { id: "l1", label: "Analytics Engine", tooltip: "High throughput data queries", icon: Zap },
    { id: "l2", label: "Cloud Sync", tooltip: "Real-time replica clusters", icon: Cloud },
    { id: "l3", label: "Secure Vault", tooltip: "Advanced access protection", icon: Shield },
    { id: "r1", label: "Data Lake", tooltip: "Scalable object-store nodes", icon: Database },
    { id: "r2", label: "Global Edge", tooltip: "Distributed CDN relays", icon: Globe },
    { id: "r3", label: "Neural Model", tooltip: "Hardware accelerated compute", icon: Cpu },
  ];

  const activeNodes = nodes && nodes.length > 0 ? nodes : defaultNodes;

  // Exact left/top percentages matching the SVG curves endpoints (based on 800x450 canvas)
  const nodePositions = [
    { left: "20%", top: "26.67%", floatType: "up" },    // L1: 160 / 800, 120 / 450
    { left: "15%", top: "50.00%", floatType: "down" },  // L2: 120 / 800, 225 / 450
    { left: "20%", top: "73.33%", floatType: "up" },    // L3: 160 / 800, 330 / 450
    { left: "80%", top: "26.67%", floatType: "down" },  // R1: 640 / 800, 120 / 450
    { left: "85%", top: "50.00%", floatType: "up" },    // R2: 680 / 800, 225 / 450
    { left: "80%", top: "73.33%", floatType: "down" },  // R3: 640 / 800, 330 / 450
  ];

  useEffect(() => {
    // 1. Initial SVG Line Draw-in
    pathsRef.current.forEach((path) => {
      if (!path) return;
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0.1,
      });
      gsap.to(path, {
        strokeDashoffset: 0,
        opacity: 0.8,
        duration: 1.8,
        ease: "power2.inOut",
        delay: 0.2,
      });
    });

    // 2. Initial Center Hub scale pop-in
    if (centerHubRef.current) {
      gsap.fromTo(
        centerHubRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.5)" }
      );
    }

    // 3. Staggered node entry
    nodesRef.current.forEach((node, i) => {
      if (!node) return;
      gsap.fromTo(
        node,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          delay: 0.4 + i * 0.1,
          ease: "back.out(2)",
        }
      );
    });

    // 4. Staggered brand text fade in
    if (brandTextRef.current) {
      gsap.fromTo(
        brandTextRef.current,
        { opacity: 0, y: -10 },
        { opacity: 0.8, y: 0, duration: 1, delay: 0.8, ease: "power2.out" }
      );
    }

    // 5. Persistent Organic Floating Tweens
    const tweens: gsap.core.Tween[] = [];

    // Center Hub organic float
    if (centerHubRef.current) {
      const centerTween = gsap.to(centerHubRef.current, {
        y: 8,
        x: 2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      tweens.push(centerTween);
    }

    // Node boxes organic float
    nodesRef.current.forEach((node, i) => {
      if (!node) return;
      const pos = nodePositions[i % nodePositions.length];
      const floatDir = pos.floatType === "up" ? 12 : -12;
      const floatTween = gsap.to(node, {
        y: floatDir,
        duration: 3 + (i % 3) * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2,
      });
      tweens.push(floatTween);
    });

    return () => {
      tweens.forEach((t) => t.kill());
      gsap.killTweensOf("*");
    };
  }, []);

  // Spring Hover Interactions
  const handleMouseEnterNode = (e: React.MouseEvent<HTMLDivElement>, node: NodeItem) => {
    setHoveredNode(node);
    gsap.to(e.currentTarget, {
      scale: 1.15,
      duration: 0.3,
      ease: "back.out(2.2)",
      overwrite: "auto",
    });
  };

  const handleMouseLeaveNode = (e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredNode(null);
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  // Helper to render dynamic Icon
  const renderIcon = (iconInput: any, customClassName?: string) => {
    if (!iconInput) return null;
    if (typeof iconInput === "function" || (typeof iconInput === "object" && iconInput.render)) {
      const IconComponent = iconInput;
      return (
        <IconComponent
          className={cn(
            "w-6 h-6 md:w-8 md:h-8 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 transition-colors",
            customClassName
          )}
        />
      );
    }
    return iconInput; // Plain React Node or text
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full aspect-[800/450] min-h-[350px] overflow-hidden bg-transparent flex items-center justify-center select-none",
        className
      )}
    >


      {/* SVG Connecting Paths */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 800 450"
        preserveAspectRatio="xMidYMid meet"
      >
        <g strokeWidth="2.5" strokeLinecap="round" fill="none">
          {/* L1: Left Top */}
          <path
            ref={(el) => { pathsRef.current[0] = el; }}
            d="M 400 225 C 250 225, 200 120, 160 120"
            className="stroke-slate-300/80 dark:stroke-zinc-700/60"
          />
          {/* L2: Left Middle */}
          <path
            ref={(el) => { pathsRef.current[1] = el; }}
            d="M 400 225 C 250 225, 180 225, 120 225"
            className="stroke-slate-300/80 dark:stroke-zinc-700/60"
          />
          {/* L3: Left Bottom */}
          <path
            ref={(el) => { pathsRef.current[2] = el; }}
            d="M 400 225 C 250 225, 200 330, 160 330"
            className="stroke-slate-300/80 dark:stroke-zinc-700/60"
          />
          {/* R1: Right Top */}
          <path
            ref={(el) => { pathsRef.current[3] = el; }}
            d="M 400 225 C 550 225, 600 120, 640 120"
            className="stroke-slate-300/80 dark:stroke-zinc-700/60"
          />
          {/* R2: Right Middle */}
          <path
            ref={(el) => { pathsRef.current[4] = el; }}
            d="M 400 225 C 550 225, 620 225, 680 225"
            className="stroke-slate-300/80 dark:stroke-zinc-700/60"
          />
          {/* R3: Right Bottom */}
          <path
            ref={(el) => { pathsRef.current[5] = el; }}
            d="M 400 225 C 550 225, 600 330, 640 330"
            className="stroke-slate-300/80 dark:stroke-zinc-700/60"
          />
        </g>
      </svg>

      {/* Central Hub Core */}
      <div
        ref={centerHubRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <div className="relative group cursor-pointer">
          {/* Pulse Radial Glimmer */}
          <div className="absolute -inset-6 rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-xl opacity-80 group-hover:scale-125 transition-transform duration-500" />
          
          {/* Ambient Glow rings */}
          <div className="absolute -inset-4 rounded-full border border-blue-400/20 dark:border-blue-500/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none" />
          <div className="absolute -inset-8 rounded-full border border-blue-400/10 dark:border-blue-500/5 animate-[ping_4.5s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none" />

          {/* Core Clay Capsule */}
          <div className="w-[84px] h-[84px] md:w-[110px] md:h-[110px] rounded-full bg-slate-50 dark:bg-zinc-800 border border-slate-200/50 dark:border-zinc-700/40 flex items-center justify-center shadow-[10px_15px_30px_rgba(0,0,0,0.06),-5px_-5px_15px_rgba(255,255,255,0.95),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.05)] dark:shadow-[10px_15px_30px_rgba(0,0,0,0.4),-5px_-5px_15px_rgba(255,255,255,0.03),inset_2px_2px_4px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-105">
            {centerLogo ? (
              typeof centerLogo === "string" ? (
                <img src={centerLogo} alt="Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
              ) : (
                centerLogo
              )
            ) : (
              <img
                src="/logo.svg"
                alt="Lightswind UI"
                className="w-12 h-12 md:w-16 md:h-16 object-contain filter drop-shadow-[0_2px_8px_rgba(59,130,246,0.25)] dark:brightness-110"
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating Interactive Nodes */}
      {activeNodes.map((node, i) => {
        const pos = nodePositions[i % nodePositions.length];
        const isLinked = !!node.href;

        // Interactive node box markup
        const nodeCard = (
          <div
            ref={(el) => { nodesRef.current[i] = el; }}
            style={{
              position: "absolute",
              left: pos.left,
              top: pos.top,
              transform: "translate(-50%, -50%)",
            }}
            className="z-20 group"
          >
            <div
              onMouseEnter={(e) => handleMouseEnterNode(e, node)}
              onMouseLeave={handleMouseLeaveNode}
              onClick={node.onClick}
              className={cn(
                "w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 select-none group-hover:border-blue-400/40 dark:group-hover:border-blue-500/30",
                "bg-slate-50 border border-slate-200/50 shadow-[8px_12px_20px_rgba(0,0,0,0.06),-4px_-4px_12px_rgba(255,255,255,0.95),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.05)]",
                "dark:bg-zinc-800 dark:border-zinc-700/40 dark:shadow-[8px_12px_20px_rgba(0,0,0,0.35),-4px_-4px_12px_rgba(255,255,255,0.02),inset_2px_2px_4px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.55)]",
                (node.onClick || isLinked) ? "cursor-pointer" : "cursor-default"
              )}
            >
              {renderIcon(node.icon, node.iconClassName)}
            </div>
          </div>
        );

        // Render as Link if link is provided
        return (
          <div key={node.id}>
            {isLinked ? (
              <Link href={node.href || "/"}>
                {nodeCard}
              </Link>
            ) : (
              nodeCard
            )}
          </div>
        );
      })}

      {/* Premium Floating Overlay Tooltip Card */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute bottom-6 z-30 px-5 py-3 rounded-xl border border-slate-200/60 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-xl flex flex-col items-center text-center max-w-[280px]"
          >
            <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-zinc-100">
              {hoveredNode.label}
            </h4>
            {hoveredNode.tooltip && (
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-normal font-medium">
                {hoveredNode.tooltip}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
