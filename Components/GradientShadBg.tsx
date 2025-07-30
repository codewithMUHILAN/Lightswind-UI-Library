import { motion } from "framer-motion";
// import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "../utils";

const MotionDiv = motion.div;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function GradientShadBg() {
  return (
    <div
      className="absolute left-0 top-0 min-h-screen 
    w-full overflow-hidden"
    >
      {/* Background Gradient Layer */}
      <div
        className="absolute inset-0 z-0 w-full h-full 
                       bg-[radial-gradient(97.14%56.45%_at_51.63%_0%,#00357c_0%,#004aad_30%,#000_100%)]"
        style={{
          opacity: 0.1, // or 0.5, 0.25, etc. to reduce intensity
        }}
      ></div>
      {/* "></div> */}

      {/* Dot Pattern Overlay */}
      {/* <DotPattern
        className={cn(
          "absolute inset-0 z-0 [mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]"
        )}
      /> */}

      {/* Foreground Content */}
      <MotionDiv
        className="relative z-10 flex flex-col items-center justify-start min-h-screen space-y-6 pt-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Your content here */}
      </MotionDiv>
    </div>
  );
}
