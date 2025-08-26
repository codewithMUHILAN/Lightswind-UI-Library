import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const MotionDiv = motion.div;

export default function HeroBackground() {
  return (
    <div
      className="fixed left-0 top-0 min-h-screen 
      w-full overflow-hidden"
    >
      {/* Background Gradient Layer */}
      <div
        className={cn(
          "absolute inset-0 z-0 w-full h-full transition-colors duration-500",
          // Light mode: soft blue → deep blue → black
          "bg-[radial-gradient(80%_50%_at_50%_0%,#b9d7ff_0%,#4a90e2_30%,#001024_100%)]",
          // Dark mode: dark blue → deep navy → almost black
          "dark:bg-[radial-gradient(80%_50%_at_50%_0%,#0b1a2f_0%,#001b40_30%,#000000_100%)]"
        )}
      ></div>

      {/* Foreground Content */}
      <MotionDiv
        className="relative z-10 flex flex-col items-center justify-start min-h-screen space-y-6 pt-32"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        }}
      >
        {/* Example button */}
        <button
          className={cn(
            "px-6 py-3 rounded-full font-semibold text-base shadow-lg transition-colors duration-300",
            "bg-white text-black hover:bg-gray-100", // Light mode
            "dark:bg-black dark:text-white dark:hover:bg-gray-900" // Dark mode
          )}
        >
          Get Started
        </button>
      </MotionDiv>
    </div>
  );
}
