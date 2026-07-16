"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";

export interface DeckLayer {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  // Dynamic content renderer function based on active/hovered state and loop progress
  content: React.ReactNode | ((isActive: boolean, progress: number) => React.ReactNode);
  badge?: string;
}

export interface ThreeDHolographicDeckProps {
  layers?: DeckLayer[];
  spreadDistance?: number; // How far apart the layers spread on hover (in pixels)
  tiltStrength?: number;    // Mouse tilt intensity
  className?: string;
}

const DEFAULT_LAYERS: DeckLayer[] = [
  {
    id: "layer-1",
    title: "Client Interface Layer",
    subtitle: "Front-End Presentation",
    description: "Hardware-accelerated rendering layer displaying modern interactive UI assets with silky smooth responsive framerates.",
    badge: "Interactive UI",
    content: (isActive: boolean, progress: number) => (
      <div className="w-full h-full bg-indigo-500/10 dark:bg-indigo-400/5 border border-indigo-500/20 dark:border-indigo-400/10 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-md">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400/80" />
            <span className="w-2 h-2 rounded-full bg-yellow-400/80" />
            <span className="w-2 h-2 rounded-full bg-green-400/80" />
          </div>
          <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-550 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">v2.4.0</span>
        </div>
        <div className="my-3 space-y-2">
          <div className="h-6 w-2/3 bg-indigo-500/20 rounded-md relative overflow-hidden">
            {isActive && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            )}
          </div>
          <div className="h-2 w-full bg-indigo-500/10 rounded-sm" />
          <div className="h-2 w-4/5 bg-indigo-500/10 rounded-sm" />
        </div>
        
        {/* Dynamic Progress Loading Bar */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-[8px] font-mono text-zinc-400 dark:text-zinc-500 font-bold">
            <span>{isActive ? "Compiling Assets..." : "Renderer Standby"}</span>
            <span>{isActive ? `${Math.round(progress)}%` : "0%"}</span>
          </div>
          <div className="h-1.5 w-full bg-indigo-500/15 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              style={{ width: isActive ? `${progress}%` : "0%" }}
              className="h-full bg-indigo-500 dark:bg-indigo-450 rounded-full transition-all duration-75 ease-out"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "layer-2",
    title: "Logic Processing Deck",
    subtitle: "State Management Engine",
    description: "Central reactive system managing state mutation streams, cache invalidations, and pipeline optimizations.",
    badge: "React State",
    content: (isActive: boolean, progress: number) => (
      <div className="w-full h-full bg-emerald-500/10 dark:bg-emerald-400/5 border border-emerald-500/20 dark:border-emerald-400/10 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">Logic Core</span>
          <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 font-bold">RTT: {isActive ? "4ms" : "12ms"}</span>
        </div>
        
        <div className="my-2 grid grid-cols-2 gap-2">
          <div className="p-2 bg-emerald-500/5 border border-emerald-500/15 rounded-lg flex flex-col justify-center">
            <span className="text-[8px] text-zinc-455 dark:text-zinc-555 block">CPU load</span>
            <span className="text-xs font-black text-emerald-500 dark:text-emerald-400">
              {isActive ? `${Math.round(12 + (72.2 * (progress / 100)))}%` : "12.0%"}
            </span>
          </div>
          <div className="p-2 bg-emerald-500/5 border border-emerald-500/15 rounded-lg flex flex-col justify-center">
            <span className="text-[8px] text-zinc-455 dark:text-zinc-555 block">Thread Sync</span>
            <span className="text-xs font-black text-emerald-500 dark:text-emerald-400">
              {isActive ? "ACTIVE" : "IDLE"}
            </span>
          </div>
        </div>
        
        {/* Dynamic Progress Loading Bar */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-[8px] font-mono text-zinc-400 dark:text-zinc-500 font-bold">
            <span>{isActive ? "Resolving State..." : "Process Paused"}</span>
            <span>{isActive ? `${Math.round(progress)}%` : "0%"}</span>
          </div>
          <div className="h-1.5 w-full bg-emerald-500/15 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              style={{ width: isActive ? `${progress}%` : "0%" }}
              className="h-full bg-emerald-500 dark:bg-emerald-450 rounded-full transition-all duration-75 ease-out"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "layer-3",
    title: "Vector DB Storage",
    subtitle: "Embeddings Data Vault",
    description: "Highly optimized vector indexing subsystem serving sub-millisecond similarity scans on spatial data models.",
    badge: "Vector DB",
    content: (isActive: boolean, progress: number) => (
      <div className="w-full h-full bg-amber-500/10 dark:bg-amber-400/5 border border-amber-500/20 dark:border-amber-400/10 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-md">
        <div className="flex justify-between items-center text-[10px] font-mono text-amber-500 dark:text-amber-400 font-bold">
          <span>INDEX_VECTOR</span>
          <span>1536_DIM</span>
        </div>
        <div className="my-2 space-y-1">
          <div className="flex items-center justify-between text-[9px] text-zinc-400 dark:text-zinc-555">
            <span>Latency</span>
            <span className="font-bold text-amber-500 dark:text-amber-400">{isActive ? "0.12ms" : "0.84ms"}</span>
          </div>
          <div className="flex items-center justify-between text-[9px] text-zinc-400 dark:text-zinc-555">
            <span>Precision Score</span>
            <span className="font-bold text-amber-550 dark:text-amber-455">{isActive ? `${Math.round(99.98 + (0.01 * (progress / 100)))}%` : "99.98%"}</span>
          </div>
        </div>
        
        {/* Dynamic Progress Loading Bar */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-[8px] font-mono text-zinc-400 dark:text-zinc-500 font-bold">
            <span>{isActive ? "Indexing Vectors..." : "Database Standby"}</span>
            <span>{isActive ? `${Math.round(progress)}%` : "0%"}</span>
          </div>
          <div className="h-1.5 w-full bg-amber-500/15 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              style={{ width: isActive ? `${progress}%` : "0%" }}
              className="h-full bg-amber-550 dark:bg-amber-455 rounded-full transition-all duration-75 ease-out"
            />
          </div>
        </div>
      </div>
    ),
  },
];

export const ThreeDHolographicDeck: React.FC<ThreeDHolographicDeckProps> = ({
  layers = DEFAULT_LAYERS,
  spreadDistance = 75,
  tiltStrength = 14,
  className = "",
}) => {
  const [hovered, setHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const autoplayDuration = 3500; // 3.5 seconds per card

  // Autoplay ticker loop logic
  useEffect(() => {
    if (hovered) return;
    
    const intervalTime = 30; // 30ms ticks
    const step = (intervalTime / autoplayDuration) * 100;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((prevIndex) => (prevIndex + 1) % layers.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);
    
    return () => clearInterval(timer);
  }, [hovered, layers.length]);

  const activeLayer = layers[activeIndex];

  // Mouse tilt values using framer-motion springs
  const rotateX = useSpring(0, { stiffness: 100, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates between -0.5 and 0.5
    const relX = (e.clientX - rect.left) / width - 0.5;
    const relY = (e.clientY - rect.top) / height - 0.5;
    
    rotateX.set(-relY * tiltStrength);
    rotateY.set(relX * tiltStrength);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div 
      className={`relative w-full h-[650px] md:h-[750px] flex flex-col lg:flex-row items-center justify-between rounded-3xl overflow-hidden bg-transparent p-4 md:p-12 ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {/* Interactive Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10" style={{
        backgroundImage: "radial-gradient(circle, #71717a 1px, transparent 1px)",
        backgroundSize: "20px 20px"
      }} />

      {/* Dynamic scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20 z-0">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent absolute top-0 left-0 animate-[scan_5s_linear_infinite]" />
      </div>

      {/* Main 3D Interactive Deck Container */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          setHovered(true);
          setProgress(100);
        }}
        className="w-full lg:w-[60%] h-[360px] md:h-[450px] flex items-center justify-center relative cursor-pointer z-10 select-none"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          className="relative w-[280px] md:w-[360px] h-[220px] md:h-[260px] transform-style-3d transition-shadow duration-300"
          style={{
            rotateX,
            rotateY,
          }}
        >
          {/* Subtle neon glowing laser box lines connecting the corners in 3D */}
          {hovered && (
            <div className="absolute inset-0 border border-dashed border-indigo-500/20 dark:border-indigo-400/10 pointer-events-none rounded-2xl transform-style-3d">
              {/* Back vertical lines */}
              <div className="absolute w-[1px] h-[225px] bg-gradient-to-t from-indigo-500/40 to-transparent bottom-0 left-0 transform origin-bottom -rotate-x-90" style={{ transform: `translateZ(${-spreadDistance * (layers.length - 1)}px)` }} />
              <div className="absolute w-[1px] h-[225px] bg-gradient-to-t from-indigo-500/40 to-transparent bottom-0 right-0 transform origin-bottom -rotate-x-90" style={{ transform: `translateZ(${-spreadDistance * (layers.length - 1)}px)` }} />
            </div>
          )}

          {layers.map((layer, index) => {
            const isTargeted = activeIndex === index;
            
            // The cards are ALWAYS spread out in an isometric deck layout to maintain 3D stack visibility.
            // When targeted (active), the card dynamically flies forward to the front (40px).
            // Otherwise, it sits at its designated index depth.
            const zTranslation = isTargeted ? 40 : -index * spreadDistance;
            const xShift = isTargeted ? 20 : index * -20;
            const yShift = isTargeted ? 15 : index * -25;

            return (
              <motion.div
                key={layer.id}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  setHovered(true);
                  setActiveIndex(index);
                  setProgress(100);
                }}
                className={`absolute inset-0 rounded-2xl shadow-xl transition-all duration-550 transform-style-3d border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md ${
                  isTargeted 
                    ? "ring-2 ring-indigo-500/50 dark:ring-indigo-400/50 shadow-indigo-500/10 dark:shadow-indigo-400/5 scale-[1.03]" 
                    : ""
                }`}
                style={{
                  transform: `translate3d(${xShift}px, ${yShift}px, ${zTranslation}px)`,
                  zIndex: isTargeted ? 100 : layers.length - index,
                }}
              >
                {/* Laser scan outline running across the active layer */}
                {isTargeted && (
                  <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden border border-indigo-500/60 dark:border-indigo-400/60">
                    <div className="w-[150%] h-[200px] bg-gradient-to-t from-indigo-500/10 via-transparent to-transparent absolute -top-[200px] left-0 animate-[laserScan_3s_ease-in-out_infinite]" style={{ transform: "rotate(-12deg)" }} />
                  </div>
                )}

                {/* Layer contents */}
                {typeof layer.content === "function"
                  ? layer.content(isTargeted, progress)
                  : typeof layer.content === "string"
                    ? <div className="w-full h-full bg-cover bg-center rounded-2xl" style={{ backgroundImage: `url(${layer.content})` }} />
                    : layer.content
                }

                {/* Left vertical connection lines for the corner deck depth */}
                {hovered && index < layers.length - 1 && (
                  <div className="absolute bottom-0 left-0 w-[1px] h-[75px] bg-gradient-to-t from-indigo-500/30 to-indigo-500/10 origin-bottom transform -rotate-x-90 pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Floating Description Details / Interactive Focus Panel */}
      <div className="w-full lg:w-[40%] flex flex-col gap-4 relative z-10">
        <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 bg-white/20 dark:bg-zinc-950/20 backdrop-blur-sm flex flex-col gap-4 max-w-md mx-auto lg:ml-auto">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Architectural Layer Deck</span>
            <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">Holographic Deck</h3>
          </div>

          <div className="min-h-[140px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {activeLayer ? (
                <motion.div
                  key={activeLayer.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    {activeLayer.badge && (
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {activeLayer.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">{activeLayer.subtitle}</span>
                  </div>
                  <h4 className="text-md font-bold text-zinc-800 dark:text-zinc-100">{activeLayer.title}</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{activeLayer.description}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-2"
                >
                  <h4 className="text-md font-semibold text-zinc-700 dark:text-zinc-300">Hover over the Stack</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed">
                    Move your cursor onto the holographic display to expand it into an exploded 3D view of nested processing layers. Hover individual layers to inspect metrics.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            {layers.map((layer, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={layer.id}
                  onMouseEnter={() => {
                    setHovered(true);
                    setActiveIndex(index);
                    setProgress(100);
                  }}
                  className={`w-full relative overflow-hidden flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-xs font-semibold text-left cursor-pointer ${
                    isActive 
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400" 
                      : "bg-white/80 dark:bg-zinc-900/60 border-zinc-200/50 dark:border-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className="relative z-10">{layer.title}</span>
                  <span className={`relative z-10 text-[10px] transition-transform duration-300 ${isActive ? "translate-x-1 font-black text-indigo-500" : "text-zinc-400"}`}>→</span>
                  
                  {/* Subtle bottom edge progress loader on the active menu */}
                  {isActive && (
                    <div 
                      className="absolute bottom-0 left-0 h-[2.5px] bg-indigo-500 dark:bg-indigo-400 transition-all duration-75 ease-out" 
                      style={{ width: `${progress}%` }} 
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
