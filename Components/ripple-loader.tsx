"use client";
import React from "react";
import { motion } from "framer-motion";

type RippleLoaderProps = {
  icon?: React.ReactNode;
  size?: number;
  duration?: number; // in seconds
  logoColor?: string;
};

const RippleLoader: React.FC<RippleLoaderProps> = ({
  icon,
  size = 250,
  duration = 2, // use number for easier calculations
  logoColor = "grey",
}) => {
  const baseInset = 40;
  const rippleBoxes = Array.from({ length: 5 }, (_, i) => ({
    inset: `${baseInset - i * 10}%`,
    zIndex: 99 - i,
    delay: i * 0.2,
    opacity: 1 - i * 0.2,
  }));

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      {rippleBoxes.map((box, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-t backdrop-blur-[5px]"
          style={{
            inset: box.inset,
            zIndex: box.zIndex,
            borderColor: `rgba(100,100,100,${box.opacity})`,
            background:
              "linear-gradient(0deg, rgba(50, 50, 50, 0.2), rgba(100, 100, 100, 0.2))",
          }}
          animate={{
            scale: [1, 1.3, 1],
            boxShadow: [
              "rgba(0, 0, 0, 0.3) 0px 10px 10px 0px",
              "rgba(0, 0, 0, 0.3) 0px 30px 20px 0px",
              "rgba(0, 0, 0, 0.3) 0px 10px 10px 0px",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration,
            delay: box.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-0 grid place-content-center p-[30%]">
        <motion.span
          className="w-full h-full"
          animate={{ color: [logoColor, "#ffffff", logoColor] }}
          transition={{
            repeat: Infinity,
            duration,
            ease: "easeInOut",
          }}
        >
          <span
            className="w-full h-full"
            style={{ display: "inline-block", width: "100%", height: "100%" }}
          >
            {icon &&
              React.cloneElement(icon as React.ReactElement, {
                style: {
                  width: "100%",
                  height: "100%",
                  fill: "currentColor",
                },
              })}
          </span>
        </motion.span>
      </div>
    </div>
  );
};

export default RippleLoader;
