import { jsx as _jsx } from "react/jsx-runtime";
// "use client"; directive is correctly placed at the top
import { useRef, useMemo } from "react"; // Added useMemo
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "../lib/utils"; // Assuming cn utility is available
const sizeClasses = {
  xs: "text-xs md:text-xs",
  sm: "text-lg md:text-xl",
  md: "text-xl md:text-2xl lg:text-3xl",
  lg: "text-2xl md:text-3xl lg:text-4xl xl:text-5xl",
  xl: "text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
  "2xl": "text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
};
const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};
const variantClasses = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  accent: "text-accent-foreground",
  primary: "text-primary",
};
export function ScrollReveal({
  children,
  containerClassName,
  textClassName,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  staggerDelay = 0.05,
  threshold = 0.5,
  duration = 0.8,
  springConfig = {
    damping: 25,
    stiffness: 100,
    mass: 1,
  },
  size = "lg",
  align = "left",
  variant = "default",
}) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    amount: threshold,
    once: false,
  });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  // Transform rotation based on scroll
  const rotation = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [baseRotation, 0, 0]
  );
  // Split text into words and spaces, ensuring each part is an object
  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    // Split by spaces, keeping the spaces as separate elements in the array.
    // Each 'part' will either be a word or a sequence of spaces.
    return text
      .split(/(\s+)/)
      .map((part, index) => {
        // Return an object for both words and spaces, with a 'type' property
        // to differentiate them in the rendering loop.
        return {
          value: part,
          isSpace: part.match(/^\s+$/) && part.length > 0, // Check if it's a non-empty string of only whitespace
          originalIndex: index, // Keep original index for stable keys
        };
      })
      .filter((item) => item.value.length > 0); // Filter out any empty strings that might result from split
  }, [children]);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };
  const wordVariants = {
    hidden: {
      opacity: baseOpacity,
      filter: enableBlur ? `blur(${blurStrength}px)` : "blur(0px)",
      y: 20,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        // Removed `type: "spring"` here. Framer Motion infers "spring"
        // when damping, stiffness, or mass are present.
        ...springConfig,
        duration, // This is a common property for all transition types
      },
    },
  };
  return _jsx(motion.div, {
    ref: containerRef,
    style: { rotate: rotation },
    className: cn("my-5 transform-gpu", containerClassName),
    children: _jsx(motion.p, {
      className: cn(
        "leading-relaxed ",
        sizeClasses[size],
        alignClasses[align],
        variantClasses[variant],
        textClassName
      ),
      variants: containerVariants,
      initial: "hidden",
      // Changed to `isInView` to match the behavior of triggering on view
      animate: isInView ? "visible" : "hidden",
      children: splitText.map(
        (
          item // Map over 'item' directly as it's always an object
        ) =>
          item.isSpace
            ? // Render spaces as a regular span
              _jsx(
                "span",
                { children: item.value },
                `space-${item.originalIndex}`
              )
            : // Render words as motion.span for animation
              _jsx(
                motion.span,
                {
                  className: "inline-block",
                  variants: wordVariants,
                  children: item.value,
                },
                `word-${item.originalIndex}`
              )
      ),
    }),
  });
}
export default ScrollReveal;
