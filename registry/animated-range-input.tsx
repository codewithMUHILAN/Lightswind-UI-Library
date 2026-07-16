import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedRangeInputProps {
  value: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
  labelId: string;
  fillColor?: string;
}

const AnimatedRangeInput: React.FC<AnimatedRangeInputProps> = ({
  value,
  onChange,
  icon,
  labelId,
  fillColor = "#ff5722", // Orange
}) => {
  // Handle reverse direction: Top = 100, Bottom = 0
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = Number(e.target.value);
    const correctedValue = 100 - rawValue;
    onChange(correctedValue);
  };

  return (
    <div className="relative flex items-center justify-center w-40 h-60 font-primarylw">
      {/* Left side icon */}
      <div className="absolute -left-10 flex flex-col items-center gap-2">
        <div className="text-black text-xl">{icon}</div>
      </div>

      {/* Slider container */}
      <div className="relative flex items-center justify-center w-16 h-full rounded-xl border border-gray-300 overflow-hidden bg-white">
        {/* Animated Fill (based on `value`) */}
        <AnimatePresence>
          <motion.div
            key="fill"
            initial={{ height: 0 }}
            animate={{ height: `${value}%` }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              backgroundColor: fillColor,
              zIndex: 1,
              borderRadius: "inherit",
            }}
          />
        </AnimatePresence>

        {/* Value display */}
        <span className="absolute text-black text-sm font-bold z-10">
          {value}%
        </span>

        {/* Hidden rotated input */}
        <input
          id={labelId}
          type="range"
          min={0}
          max={100}
          step={1}
          value={100 - value} // reverse direction
          onChange={handleChange}
          style={{
            transform: "rotate(-90deg)",
            width: "100%",
            height: "100%",
            position: "relative",
            zIndex: 2,
            background: "transparent",
            WebkitAppearance: "none", // necessary for WebKit
            appearance: "none", // for Firefox
            cursor: "pointer",

          }}
        />
      </div>
    </div>
  );
};

export default AnimatedRangeInput;
