// ThreeDScrollTrigger.tsx
"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useContext,
} from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { cn } from "../lib/utils";

/* -------------------------
   Utility: wrap (unchanged)
   ------------------------- */
export const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

/* -----------------------------------
   Context to share velocity between rows
   ----------------------------------- */
const ThreeDScrollTriggerContext =
  React.createContext<MotionValue<number> | null>(null);

/* --------------------------
   Container that provides velocity
   -------------------------- */
export function ThreeDScrollTriggerContainer({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // map to a bounded factor [-5...5] with smoother behaviour
  const velocityFactor = useTransform(smoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, (Math.abs(v) / 1000) * 5);
    return sign * magnitude;
  });

  return (
    <ThreeDScrollTriggerContext.Provider value={velocityFactor}>
      <div className={cn("relative w-full", className)} {...props}>
        {children}
      </div>
    </ThreeDScrollTriggerContext.Provider>
  );
}

/* --------------------------
   Row entry that chooses shared or local velocity
   -------------------------- */
export function ThreeDScrollTriggerRow(props: ThreeDScrollTriggerRowProps) {
  const sharedVelocityFactor = useContext(ThreeDScrollTriggerContext);
  if (sharedVelocityFactor) {
    return (
      <ThreeDScrollTriggerRowImpl
        {...props}
        velocityFactor={sharedVelocityFactor}
      />
    );
  }
  return <ThreeDScrollTriggerRowLocal {...props} />;
}

/* --------------------------
   Props
   -------------------------- */
interface ThreeDScrollTriggerRowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  baseVelocity?: number; // pixels relative multiplier
  direction?: 1 | -1;
  resetIntervalMs?: number; // <-- NEW: interval for rebasing (default 5000)
}

/* --------------------------
   Impl with velocity passed in
   -------------------------- */
interface ThreeDScrollTriggerRowImplProps extends ThreeDScrollTriggerRowProps {
  velocityFactor: MotionValue<number>;
}

function ThreeDScrollTriggerRowImpl({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
  velocityFactor,
  ...props
}: ThreeDScrollTriggerRowImplProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numCopies, setNumCopies] = useState(3);
  const x = useMotionValue(0);

  const prevTimeRef = useRef<number | null>(null);
  const unitWidthRef = useRef(0);
  const baseXRef = useRef(0);

  // Memoized children
  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

  const BlockContent = useMemo(() => {
    return (
      <div className="inline-flex shrink-0" style={{ contain: "paint" }}>
        {childrenArray}
      </div>
    );
  }, [childrenArray]);

  // Measure block width
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const block = container.querySelector(".threed-scroll-trigger-block") as HTMLElement;
    if (block) {
      unitWidthRef.current = block.scrollWidth;
      // keep just enough to cover the viewport + 1
      const containerWidth = container.offsetWidth;
      const needed = Math.max(2, Math.ceil(containerWidth / unitWidthRef.current) + 1);
      setNumCopies(needed);
    }
  }, [childrenArray]);

  // Animation loop
  useAnimationFrame((time) => {
    if (prevTimeRef.current == null) prevTimeRef.current = time;
    const dt = Math.max(0, (time - prevTimeRef.current) / 1000);
    prevTimeRef.current = time;

    const unitWidth = unitWidthRef.current;
    if (unitWidth <= 0) return;

    const velocity = velocityFactor.get();
    const speedMultiplier = Math.min(5, Math.abs(velocity));
    const scrollDirection = velocity >= 0 ? 1 : -1;
    const currentDirection = direction * scrollDirection;

    const pixelsPerSecond = (unitWidth * baseVelocity) / 100;
    const moveBy = currentDirection * pixelsPerSecond * (1 + speedMultiplier) * dt;

    const newX = baseXRef.current + moveBy;
    // ✅ instead of wrap, shift back when > unitWidth
    if (newX > unitWidth) {
      baseXRef.current = newX - unitWidth;
    } else if (newX < -unitWidth) {
      baseXRef.current = newX + unitWidth;
    } else {
      baseXRef.current = newX;
    }

    x.set(baseXRef.current);
  });

  const xTransform = useTransform(x, (v) => `translate3d(${-v}px,0,0)`);

  return (
    <div
      ref={containerRef}
      className={cn("w-full overflow-hidden whitespace-nowrap", className)}
      {...props}
    >
      <motion.div
        className="inline-flex will-change-transform transform-gpu"
        style={{ transform: xTransform }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "inline-flex shrink-0",
              i === 0 ? "threed-scroll-trigger-block" : ""
            )}
          >
            {BlockContent}
          </div>
        ))}
      </motion.div>
    </div>
  );
}


/* --------------------------
   Local row (if no shared velocity)
   -------------------------- */
function ThreeDScrollTriggerRowLocal(props: ThreeDScrollTriggerRowProps) {
  const { scrollY } = useScroll();
  const localVelocity = useVelocity(scrollY);
  const localSmoothVelocity = useSpring(localVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const localVelocityFactor = useTransform(localSmoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, (Math.abs(v) / 1000) * 5);
    return sign * magnitude;
  });

  return (
    <ThreeDScrollTriggerRowImpl
      {...props}
      velocityFactor={localVelocityFactor}
    />
  );
}

export default ThreeDScrollTriggerRow;
