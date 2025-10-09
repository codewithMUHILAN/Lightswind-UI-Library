"use client";
import React, { useMemo } from "react";
import { motion, Transition } from "framer-motion";
import { Sun, Cloud, MessageSquare, Briefcase, Zap } from "lucide-react";

// --- Types ---
type OrbitConfig = {
  id: number;
  radiusFactor: number;
  speed: number; // seconds per rotation
  icon: React.ReactNode;
  iconSize: number;
  orbitColor?: string;
  orbitThickness?: number;
};

type BeamCircleProps = {
  size?: number;
  orbits?: OrbitConfig[];
  centerIcon?: React.ReactNode;
};

// --- Default Orbits ---
const defaultOrbits: OrbitConfig[] = [
  {
    id: 1,
    radiusFactor: 0.15,
    speed: 7,
    icon: <Zap className="text-yellow-400" />,
    iconSize: 20,
    orbitColor: "rgba(255, 193, 7, 0.4)",
    orbitThickness: 1.5,
  },
  {
    id: 2,
    radiusFactor: 0.35,
    speed: 12,
    icon: <MessageSquare className="text-sky-500" />,
    iconSize: 24,
    orbitThickness: 1.5,
  },
  {
    id: 3,
    radiusFactor: 0.55,
    speed: 9,
    icon: <Briefcase className="text-green-500" />,
    iconSize: 28,
    orbitColor: "rgba(76, 175, 80, 0.4)",
    orbitThickness: 2,
  },
  {
    id: 4,
    radiusFactor: 0.75,
    speed: 15,
    icon: <Cloud className="text-slate-400" />,
    iconSize: 32,
    orbitThickness: 1,
  },
];

// --- Component ---
const BeamCircle: React.FC<BeamCircleProps> = ({
  size = 300,
  orbits: customOrbits,
  centerIcon,
}) => {
  const orbitsData = useMemo(() => customOrbits || defaultOrbits, [customOrbits]);
  const halfSize = size / 2;

  // --- Define linear easing manually ---
  const linearEase = (t: number) => t;

  const rotationTransition = (duration: number): Transition => ({
    repeat: Infinity,
    duration,
    ease: linearEase, // ✅ Works properly now
  });

  // --- Center Icon ---
  const CenterIcon = useMemo(
    () => (
      <motion.div
        className="rounded-full shadow-lg bg-foreground grid place-content-center"
        style={{ width: halfSize * 0.2, height: halfSize * 0.2 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" as any }}
      >
        {centerIcon ? (
          centerIcon
        ) : (
          <Sun className="text-background" size={halfSize * 0.1} />
        )}
      </motion.div>
    ),
    [halfSize, centerIcon]
  );

  return (
    <div className="flex justify-center items-center p-4 bg-transparent">
      <div className="relative" style={{ width: size, height: size }}>
        {orbitsData.map((orbit) => {
          const orbitDiameter = size * orbit.radiusFactor;
          const orbitRadius = orbitDiameter / 2;
          const containerSize = size;

          return (
            <React.Fragment key={orbit.id}>
              {/* Orbit Line */}
              <div
                className={`absolute rounded-full border border-dashed ${
                  orbit.orbitColor ? "" : "border-foreground/30 dark:border-foreground/40"
                }`}
                style={{
                  width: orbitDiameter,
                  height: orbitDiameter,
                  top: halfSize - orbitRadius,
                  left: halfSize - orbitRadius,
                  borderColor: orbit.orbitColor || undefined,
                  borderWidth: orbit.orbitThickness || 1,
                }}
              />

              {/* Rotating Container */}
              <motion.div
                className="absolute inset-0"
                style={{ width: containerSize, height: containerSize }}
                animate={{ rotate: 360 }}
                transition={rotationTransition(orbit.speed)}
              >
                {/* Traveling Icon */}
                <div
                  className="absolute"
                  style={{
                    top: halfSize,
                    left: halfSize + orbitRadius,
                    transform: `translate(-50%, -50%)`,
                  }}
                >
                  <motion.div
                    className="rounded-full shadow-md grid place-content-center bg-foreground p-1"
                    style={{ width: orbit.iconSize, height: orbit.iconSize }}
                    animate={{ rotate: -360 }}
                    transition={rotationTransition(orbit.speed)}
                  >
                    {React.cloneElement(orbit.icon as React.ReactElement, {
                      size: orbit.iconSize * 0.6,
                    })}
                  </motion.div>
                </div>
              </motion.div>
            </React.Fragment>
          );
        })}

        {/* Central Icon */}
        <div className="absolute inset-0 grid place-content-center z-10">{CenterIcon}</div>
      </div>

      <style jsx global>{`
        body {
          font-family: "Inter", sans-serif;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default BeamCircle;
