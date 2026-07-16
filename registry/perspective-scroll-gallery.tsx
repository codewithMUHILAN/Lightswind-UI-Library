"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  MotionValue,
} from "framer-motion";

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
}

export interface PerspectiveScrollGalleryProps {
  items?: GalleryItem[];
  className?: string;
}

const DEFAULT_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Neural Interface",
    subtitle: "Bridging human cognition with machine intelligence through seamless bio-digital pathways.",
    tag: "AI / Cognition",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "g2",
    title: "Quantum Lattice",
    subtitle: "Entangled particles forming stable computational qubits at near-absolute-zero temperatures.",
    tag: "Quantum Computing",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "g3",
    title: "Orbital Station",
    subtitle: "Modular habitat ring deployed in low-Earth orbit, self-sustaining for 12-month missions.",
    tag: "Aerospace",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "g4",
    title: "BioSync Engine",
    subtitle: "Genomic sequencing pipeline resolving 10,000 base pairs per second in real-time.",
    tag: "Biotech",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "g5",
    title: "Deep Render",
    subtitle: "Photon-accurate GPU path-tracer achieving cinematic realism at interactive frame rates.",
    tag: "Graphics",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900&auto=format&fit=crop&q=80",
  },
];

// ─── Ambient glow blob (own component so hook stays at top level) ─────────────
function AmbientGlow({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const bg = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "radial-gradient(ellipse at 30% 60%, rgba(139,92,246,0.22) 0%, transparent 60%)",
      "radial-gradient(ellipse at 55% 40%, rgba(6,182,212,0.22) 0%, transparent 60%)",
      "radial-gradient(ellipse at 60% 50%, rgba(14,165,233,0.22) 0%, transparent 60%)",
      "radial-gradient(ellipse at 40% 65%, rgba(16,185,129,0.22) 0%, transparent 60%)",
      "radial-gradient(ellipse at 70% 40%, rgba(245,158,11,0.22) 0%, transparent 60%)",
    ]
  );
  return <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: bg }} />;
}

// ─── Right-edge dot indicator ─────────────────────────────────────────────────
function ScrollDots({ total, scrollYProgress }: { total: number; scrollYProgress: MotionValue<number> }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      setActive(Math.min(total - 1, Math.floor(v * total)));
    });
  }, [scrollYProgress, total]);

  return (
    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30 pointer-events-none">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-500 ${
            i === active ? "w-1.5 h-7 bg-white" : "w-1.5 h-1.5 bg-white/30"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Counter display ─────────────────────────────────────────────────────────
function Counter({ total, scrollYProgress }: { total: number; scrollYProgress: MotionValue<number> }) {
  const [n, setN] = useState(1);
  useEffect(() => {
    return scrollYProgress.onChange((v) => setN(Math.min(total, Math.floor(v * total) + 1)));
  }, [scrollYProgress, total]);
  return (
    <span className="text-[11px] font-mono text-white/30 tabular-nums">
      {String(n).padStart(2, "0")}&nbsp;/&nbsp;{String(total).padStart(2, "0")}
    </span>
  );
}

// ─── Single card driven by scroll ────────────────────────────────────────────
function GalleryCard({
  item,
  index,
  total,
  scrollContainerRef,
}: {
  item: GalleryItem;
  index: number;
  total: number;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}) {
  const [isInView, setIsInView] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rawTX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
  const rawTY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);
  const tiltX = useSpring(rawTX, { stiffness: 130, damping: 18 });
  const tiltY = useSpring(rawTY, { stiffness: 130, damping: 18 });

  const { scrollYProgress } = useScroll({ container: scrollContainerRef });

  const start = index / total;
  const end   = (index + 1) / total;
  const mid   = (start + end) / 2;

  const cardX       = useTransform(scrollYProgress, [start, mid, end], ["140%",  "0%", "-140%"]);
  const cardScale   = useTransform(scrollYProgress, [start, mid, end], [0.80,    1,    0.80]);
  const cardOpacity = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  const cardRotY    = useTransform(scrollYProgress, [start, mid, end], [30,      0,    -30]);
  const imageX      = useTransform(scrollYProgress, [start, mid, end], ["7%", "0%", "-7%"]);

  useEffect(() => {
    return cardOpacity.onChange((v) => setIsInView(v > 0.12));
  }, [cardOpacity]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top)  / r.height - 0.5);
  }
  function onLeave() { mouseX.set(0); mouseY.set(0); }

  return (
    <motion.div
      style={{ x: cardX, scale: cardScale, opacity: cardOpacity, rotateY: cardRotY }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <motion.div
        style={{ rotateX: tiltX, rotateY: tiltY }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{ scale: 1.025 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative pointer-events-auto
          w-[310px] sm:w-[460px] md:w-[560px] lg:w-[660px]
          h-[400px] md:h-[480px]
          rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
      >
        {/* Parallax background */}
        <motion.div className="absolute inset-0 w-[120%] -left-[10%]" style={{ x: imageX }}>
          <img src={item.image} alt={item.title} className="w-full h-full object-cover select-none" draggable={false} />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />

        {/* Border glow */}
        <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-white/25 transition-colors duration-500" />

        {/* Tag — top right */}
        <motion.div
          className="absolute top-5 right-5"
          initial={{ opacity: 0, y: -8 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
          transition={{ delay: 0.12, duration: 0.35 }}
        >
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white/80 bg-white/10 border border-white/15 backdrop-blur-md">
            {item.tag}
          </span>
        </motion.div>

        {/* Index — top left */}
        <div className="absolute top-5 left-5 font-mono text-[11px] font-bold text-white/30">
          {String(index + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(total).padStart(2, "0")}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ delay: 0.18, duration: 0.45, ease: "easeOut" }}
            className="space-y-2.5"
          >
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">{item.title}</h3>
            <p className="text-sm text-white/55 leading-relaxed max-w-md">{item.subtitle}</p>
            <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Scroll to explore</span>
              <span className="text-white/40 text-xl">↗</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export const PerspectiveScrollGallery: React.FC<PerspectiveScrollGalleryProps> = ({
  items = DEFAULT_ITEMS,
  className = "",
}) => {
  // The SCROLL CONTAINER — this is what the user scrolls inside
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ container: scrollRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });

  return (
    // Fixed-height outer wrapper — does NOT scroll itself
    <div className={`relative w-full h-[620px] md:h-[700px] rounded-2xl overflow-hidden ${className}`}>

      {/* ── The actual scroll container ── */}
      <div
        ref={scrollRef}
        className="w-full h-full overflow-y-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Tall inner div — gives us the scroll "runway" */}
        <div style={{ height: `${items.length * 100}%` }}>

          {/* Sticky panel — always centred inside the scroll container */}
          <div className="sticky top-0 h-[620px] md:h-[700px] w-full overflow-hidden bg-zinc-950">

            {/* Dot grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06] z-0"
              style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
            />

            {/* Ambient colour blob */}
            <AmbientGlow scrollYProgress={scrollYProgress} />

            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 px-7 py-5 flex justify-between items-center z-20 pointer-events-none">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Perspective Gallery</span>
                <span className="text-white/10 text-[8px] font-mono">{items.length} works</span>
              </div>
              <Counter total={items.length} scrollYProgress={scrollYProgress} />
            </div>

            {/* Cards layer — all stacked absolutely, driven by scroll */}
            <div className="absolute inset-0" style={{ perspective: "1200px" }}>
              {items.map((item, i) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={i}
                  total={items.length}
                  scrollContainerRef={scrollRef as React.RefObject<HTMLDivElement>}
                />
              ))}
            </div>

            {/* Right progress dots */}
            <ScrollDots total={items.length} scrollYProgress={scrollYProgress} />

            {/* Bottom gradient progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-20">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-amber-400"
                style={{ scaleX: smoothProgress, transformOrigin: "left" }}
              />
            </div>

            {/* Scroll mouse cue */}
            <div className="absolute bottom-7 left-7 z-20 pointer-events-none">
              <div className="flex items-center gap-2 opacity-30">
                <div className="w-5 h-8 rounded-full border border-white/40 flex items-start justify-center p-1">
                  <motion.div
                    className="w-1 h-2 rounded-full bg-white"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  />
                </div>
                <span className="text-white text-[10px] font-mono uppercase tracking-widest">Scroll</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
