"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import React, { useContext, useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

// Assuming you have a utility function for Tailwind CSS class merging
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface ScrollVelocityRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  baseVelocity?: number;
  direction?: 1 | -1;
}

/**
 * Utility function to wrap a value within a min/max range for continuous looping.
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @param v The value to wrap.
 */
export const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// --- Context for Shared Scroll Velocity ---
const ScrollVelocityContext = React.createContext<MotionValue<number> | null>(
  null
);

// --- ScrollVelocityContainer (Parent Component) ---
export function ScrollVelocityContainer({
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

  // Transforms the smooth scroll velocity into a factor used to control the marquee speed.
  const velocityFactor = useTransform(smoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    // Clamps the magnitude to a max of 5 for reasonable speed
    const magnitude = Math.min(5, (Math.abs(v) / 1000) * 5);
    return sign * magnitude;
  });

  return (
    <ScrollVelocityContext.Provider value={velocityFactor}>
      <div className={cn("relative w-full", className)} {...props}>
        {children}
      </div>
    </ScrollVelocityContext.Provider>
  );
}

// --- ScrollVelocityRow (Router) ---
// Decides whether to use shared context or local velocity calculation.
export function ScrollVelocityRow(props: ScrollVelocityRowProps) {
  const sharedVelocityFactor = useContext(ScrollVelocityContext);
  if (sharedVelocityFactor) {
    return (
      <ScrollVelocityRowImpl {...props} velocityFactor={sharedVelocityFactor} />
    );
  }
  return <ScrollVelocityRowLocal {...props} />;
}

// --- ScrollVelocityRow Implementation (Core Logic) ---
interface ScrollVelocityRowImplProps extends ScrollVelocityRowProps {
  velocityFactor: MotionValue<number>;
}

function ScrollVelocityRowImpl({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
  velocityFactor,
  ...props
}: ScrollVelocityRowImplProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numCopies, setNumCopies] = useState(1);
  const x = useMotionValue(0);

  // State added to handle pause on hover
  const [isHovered, setIsHovered] = useState(false);

  const prevTimeRef = useRef(0);
  const unitWidthRef = useRef(0);
  const baseXRef = useRef(0);

  // Optimize: Check if container is in view
  const isInView = useInView(containerRef, { margin: "20%" });

  // ResizeObserver to determine how many copies are needed for continuous loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      const block = container.querySelector(
        ".scroll-velocity-block"
      ) as HTMLDivElement;
      if (!block) return;

      const blockWidth = block.scrollWidth;
      unitWidthRef.current = blockWidth;

      if (blockWidth > 0) {
        // Calculate copies: need at least 3, or enough to cover the screen plus padding
        const nextCopies = Math.max(
          3,
          Math.ceil(containerWidth / blockWidth) + 2
        );
        setNumCopies(nextCopies);
      }
    });

    ro.observe(container);

    return () => ro.disconnect();
  }, []);

  // Frame-by-frame animation logic
  useAnimationFrame((time) => {
    if (!isInView || isHovered) {
      prevTimeRef.current = time;
      return;
    }

    const dt = (time - prevTimeRef.current) / 1000;
    prevTimeRef.current = time;

    const unitWidth = unitWidthRef.current;
    if (unitWidth <= 0) return;

    const velocity = velocityFactor.get();
    const speedMultiplier = Math.min(5, Math.abs(velocity));
    const scrollDirection = velocity >= 0 ? 1 : -1;
    const currentDirection = direction * scrollDirection;

    // Calculate how far to move this frame
    const pixelsPerSecond = (unitWidth * baseVelocity) / 100;
    const moveBy =
      currentDirection * pixelsPerSecond * (1 + speedMultiplier) * dt;

    // Update position and apply the wrap function for seamless looping
    const newX = baseXRef.current + moveBy;
    baseXRef.current = wrap(0, unitWidth, newX);
    x.set(baseXRef.current);
  });

  const childrenArray = React.Children.toArray(children);

  return (
    <div
      ref={containerRef}
      className={cn("w-full overflow-hidden whitespace-nowrap", className)}
      {...props}
      // Handlers to control the hover state
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="inline-flex will-change-transform transform-gpu"
        // Use useTransform to invert the x value for a left-to-right scroll effect
        style={{ x: useTransform(x, (v) => `${-v}px`) }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "inline-flex shrink-0",
              // Mark the first copy to measure its width for looping
              i === 0 && "scroll-velocity-block"
            )}
            aria-hidden={i !== 0} // Hide extra copies from screen readers
          >
            {childrenArray}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// --- ScrollVelocityRowLocal (Fallback for standalone usage) ---
function ScrollVelocityRowLocal(props: ScrollVelocityRowProps) {
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
    <ScrollVelocityRowImpl {...props} velocityFactor={localVelocityFactor} />
  );
}
