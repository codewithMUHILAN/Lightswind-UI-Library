"use client";

import React, { useState, useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils";

export interface SourceItem {
  id: string;
  label?: string;
  icon?: React.ReactNode;
  type?: "default" | "skeleton" | "custom";
  badge?: string;
  href?: string;
  color?: string;
}

export interface KnowledgeConvergenceProps {
  /** Root container extra CSS classes */
  className?: string;
  /** Main focal point title on the right */
  title?: string;
  /** Badge text displayed next to main title */
  badgeText?: string;
  /** Toggle badge display */
  showBadge?: boolean;
  /** Custom list of source nodes on the left */
  sources?: SourceItem[];
  /** Primary connection glowing dot & beam accent color */
  dotColor?: string;
  /** Color theme override ('light' | 'dark' | 'system') */
  theme?: "light" | "dark" | "system";
  /** Background ambient spotlight glow intensity */
  glowIntensity?: "low" | "medium" | "high";
  /** Optional click handler for title or target node */
  onTargetClick?: () => void;
}

/* Built-in Brand Icons */
const YouTubeIcon = () => (
  <div className="w-5 h-5 flex items-center justify-center rounded bg-red-600 text-white shrink-0 shadow-xs">
    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  </div>
);

const MediumIcon = () => (
  <div className="w-5 h-5 flex items-center justify-center rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shrink-0 shadow-xs font-serif font-black text-xs">
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  </div>
);

const GitHubIcon = () => (
  <div className="w-5 h-5 flex items-center justify-center rounded bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100 shrink-0 shadow-xs">
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  </div>
);

const LeetCodeIcon = () => (
  <div className="w-5 h-5 flex items-center justify-center rounded bg-amber-500/10 text-amber-500 shrink-0 border border-amber-500/20 font-bold text-xs">
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.17 5.79a1.374 1.374 0 0 0-.012 1.936l1.372 1.372a1.374 1.374 0 0 0 1.936 0L14.7 4.86a1.374 1.374 0 0 0 0-1.936l-1.37-1.37A1.374 1.374 0 0 0 13.483 0zm-8.23 8.23a1.374 1.374 0 0 0-.972.402L.402 12.512a1.374 1.374 0 0 0 0 1.944l3.88 3.88a1.374 1.374 0 0 0 1.944 0l1.372-1.372a1.374 1.374 0 0 0 0-1.944l-2.408-2.408 2.408-2.408a1.374 1.374 0 0 0 0-1.944l-1.372-1.372a1.374 1.374 0 0 0-.972-.432zM16.14 11.23a1.374 1.374 0 0 0-.972.402l-1.372 1.372a1.374 1.374 0 0 0 0 1.944l2.408 2.408-2.408 2.408a1.374 1.374 0 0 0 0 1.944l1.372 1.372a1.374 1.374 0 0 0 1.944 0l3.88-3.88a1.374 1.374 0 0 0 0-1.944l-3.88-3.88a1.374 1.374 0 0 0-.972-.402z" />
    </svg>
  </div>
);

const DocsIcon = () => (
  <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
    <div className="absolute left-0 top-0 w-3.5 h-4 bg-blue-600 rounded-xs flex items-center justify-center text-white text-[8px] font-black shadow-xs z-10 border border-white/20">
      W
    </div>
    <div className="absolute right-0 bottom-0 w-3.5 h-4 bg-red-600 rounded-xs flex items-center justify-center text-white text-[7px] font-bold shadow-xs border border-white/20">
      PDF
    </div>
  </div>
);

/* Exact Header Lightswind Logo */
const HeaderLogo = () => (
  <div className="relative flex items-center justify-center shrink-0">
    <img
      src="/logo.svg"
      alt="Lightswind UI"
      className="h-8 w-auto rounded-full shadow-sm"
    />
  </div>
);

const defaultSourcesList: SourceItem[] = [
  { id: "skel-top", type: "skeleton" },
  { id: "youtube", label: "YouTube", icon: <YouTubeIcon /> },
  { id: "medium", label: "Medium", icon: <MediumIcon /> },
  { id: "github", label: "GitHub", icon: <GitHubIcon /> },
  { id: "leetcode", label: "Leetcode", icon: <LeetCodeIcon /> },
  { id: "docs", label: "PDF, Word, other docs", icon: <DocsIcon /> },
  { id: "skel-bottom", type: "skeleton" },
];

export const KnowledgeConvergence: React.FC<KnowledgeConvergenceProps> = ({
  className,
  title = "Lightswind UI",
  badgeText = "v3.1",
  showBadge = true,
  sources = defaultSourcesList,
  dotColor = "#0284c7", // Skyblue Theme Accent
  glowIntensity = "high",
  onTargetClick,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const filterId = useId();

  // Normalized 1000 x 600 viewBox layout coordinate system
  const viewBoxWidth = 1000;
  const viewBoxHeight = 600;

  // Left card connection point coordinates directly centered on pill dots
  const leftX = 232;
  const targetX = 635;
  const targetY = 300;

  // Vertical distribution centered around 300
  const sourceCount = sources.length;
  const totalHeight = 440;
  const startY = 80;
  const stepY = sourceCount > 1 ? totalHeight / (sourceCount - 1) : 0;

  const getSourceY = (index: number) => startY + index * stepY;

  return (
    <div
      className={cn(
        "relative w-full min-h-[480px] lg:min-h-[560px] rounded-3xl overflow-hidden select-none flex items-center justify-center p-4 sm:p-8 bg-transparent text-slate-800 dark:text-slate-100",
        className
      )}
    >
      {/* Responsive Hub Canvas */}
      <div className="relative w-full max-w-5xl h-full flex flex-col md:flex-row items-center justify-between gap-6 z-10">
        
        {/* SVG Skyblue Bezier Beams & Animated Energy Trails */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Skyblue Neon Beam Stream Gradient */}
            <linearGradient id={`${filterId}-stream-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.75" />
              <stop offset="80%" stopColor="#0284c7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
            </linearGradient>

            {/* Soft Glow Filter for Electric Beams */}
            <filter id={`${filterId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glowing Particle Filter */}
            <filter id={`${filterId}-dot-glow`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Render Bezier Stream Lines */}
          <g>
            {sources.map((src, i) => {
              const srcY = getSourceY(i);
              const isHovered = hoveredId === src.id;
              const isAnyHovered = hoveredId !== null;

              // Bezier curve calculations connecting pill node dots to hub node
              const pathD = `M ${leftX} ${srcY} C ${leftX + 180} ${srcY}, ${targetX - 180} ${targetY}, ${targetX} ${targetY}`;

              return (
                <g key={src.id}>
                  {/* Skyblue Vector Stream */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={`url(#${filterId}-stream-grad)`}
                    strokeWidth={isHovered ? 3.8 : 2}
                    strokeOpacity={isHovered ? 1 : isAnyHovered ? 0.25 : 0.6}
                    filter={`url(#${filterId}-glow)`}
                    className="transition-all duration-300"
                  />

                  {/* Pulsing Light Dotted Stream */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={dotColor}
                    strokeWidth={isHovered ? 2.5 : 1.3}
                    strokeDasharray="8 16"
                    strokeOpacity={isHovered ? 1 : 0.4}
                    className="transition-all duration-300"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="48"
                      to="0"
                      dur={isHovered ? "0.9s" : "2.2s"}
                      repeatCount="indefinite"
                    />
                  </path>

                  {/* Skyblue Primary Energy Flow Dot */}
                  <circle r={isHovered ? 4.5 : 3.5} fill="#0284c7" filter={`url(#${filterId}-dot-glow)`}>
                    <animateMotion
                      path={pathD}
                      dur={isHovered ? "1.3s" : `${2.0 + (i % 3) * 0.4}s`}
                      repeatCount="indefinite"
                      begin={`${(i * 0.3) % 2}s`}
                    />
                  </circle>

                  {/* Secondary Cyan Energy Particle */}
                  <circle r="2.2" fill="#38bdf8" opacity="0.9">
                    <animateMotion
                      path={pathD}
                      dur={isHovered ? "1.3s" : `${2.0 + (i % 3) * 0.4}s`}
                      repeatCount="indefinite"
                      begin={`${((i * 0.3) % 2) + 1.0}s`}
                    />
                  </circle>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Left Side: Source Nodes Stack with Light & Dark Theme Adaptivity */}
        <div className="relative z-20 flex flex-col justify-between h-[440px] w-full md:w-auto min-w-[235px]">
          {sources.map((src) => {
            const isHovered = hoveredId === src.id;

            if (src.type === "skeleton") {
              return (
                <div
                  key={src.id}
                  onMouseEnter={() => setHoveredId(src.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-800/40 border border-slate-300/60 dark:border-slate-700/50 backdrop-blur-xs w-44 opacity-60 transition-all duration-300 hover:opacity-100"
                >
                  <div className="h-2.5 w-24 rounded-full bg-slate-400/40 dark:bg-slate-600/40 animate-pulse" />
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_10px_#0284c7]"
                    style={{ backgroundColor: dotColor }}
                  />
                </div>
              );
            }

            return (
              <motion.div
                key={src.id}
                onMouseEnter={() => setHoveredId(src.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ scale: 1.03, x: 5 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className={cn(
                  "relative flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer select-none",
                  // Light Mode: clean light card with dark text | Dark Mode: slate dark card with white text
                  "bg-slate-100/90 dark:bg-[#0e1629]/90 border-slate-300/80 dark:border-slate-800/80 shadow-xs backdrop-blur-md",
                  "hover:bg-white dark:hover:bg-[#14203a] hover:border-sky-500/50 hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]",
                  isHovered && "border-sky-500 bg-white dark:bg-[#162442] dark:border-sky-400"
                )}
              >
                {/* Source Icon & Title */}
                <div className="flex items-center gap-3">
                  {src.icon}
                  <span className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-100">
                    {src.label}
                  </span>
                </div>

                {/* Glowing Connection Dot */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-transform duration-300",
                      isHovered && "scale-130"
                    )}
                    style={{
                      backgroundColor: dotColor,
                      boxShadow: `0 0 10px ${dotColor}, 0 0 18px ${dotColor}`,
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-60 pointer-events-none"
                    style={{ backgroundColor: dotColor }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: Lightswind UI Target Node & Header Logo */}
        <div className="relative z-20 flex items-center gap-5 my-auto md:pl-8">
          {/* Central Hub Node Pulsing Dot */}
          <div className="relative flex items-center justify-center shrink-0">
            {/* Glowing Halo */}
            <div
              className="absolute w-14 h-14 rounded-full opacity-70 animate-pulse pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${dotColor} 0%, transparent 70%)`,
                filter: "blur(6px)",
              }}
            />
            {/* Central Skyblue Node Core */}
            <div
              className="w-4 h-4 rounded-full relative z-10 transition-transform duration-300 hover:scale-125 cursor-pointer"
              style={{
                backgroundColor: dotColor,
                boxShadow: `0 0 14px ${dotColor}, 0 0 28px ${dotColor}`,
              }}
              onClick={onTargetClick}
            />
            <div
              className="absolute w-9 h-9 rounded-full border border-sky-500/50 animate-ping pointer-events-none"
            />
          </div>

          {/* Header Lightswind Logo & Clean Title (No Underline) */}
          <div className="flex items-center gap-3">
            {/* Exact Logo from Header */}
            <HeaderLogo />

            {/* Title Text (Adaptive Light/Dark Theme) */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>

            {/* Status Pill Badge */}
            {showBadge && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300 border border-sky-500/20 dark:border-sky-400/30 backdrop-blur-md shadow-xs">
                {badgeText}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default KnowledgeConvergence;
