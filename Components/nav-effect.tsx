"use client";

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface NavEffectProps {
  children: React.ReactNode;
  effectType?: "underline" | "overline" | "box" | "slide" | "grow";
  underlineColor?: string;
  underlineHeight?: string;
  duration?: number;
  fontSize?: string;
  className?: string;
  boxBgColor?: string;
}

const NavEffect: React.FC<NavEffectProps> = ({
  children,
  effectType = "underline",
  underlineColor = "currentColor",
  underlineHeight = "2px",
  duration = 0.3,
  fontSize = "text-sm md:text-base",
  className = "",
  boxBgColor = "rgba(0, 0, 0, 0.1)",
}) => {
  const renderEffect = () => {
    switch (effectType) {
      case "underline":
        return (
          <motion.span
            variants={{
              initial: { width: 0, opacity: 0 },
              hover: {
                width: "100%",
                opacity: 1,
                transition: { duration, ease: "easeInOut" },
              },
            }}
            style={{
              backgroundColor: underlineColor,
              height: underlineHeight,
              bottom: "0px",
              left: "0px",
              borderRadius: "9999px",
            }}
            className="absolute w-full"
          />
        );

      case "overline":
        return (
          <motion.span
            variants={{
              initial: { width: 0, opacity: 0 },
              hover: {
                width: "100%",
                opacity: 1,
                transition: { duration, ease: "easeInOut" },
              },
            }}
            style={{
              backgroundColor: underlineColor,
              height: underlineHeight,
              top: "0px",
              left: "0px",
              borderRadius: "9999px",
            }}
            className="absolute w-full"
          />
        );

      case "box":
        return (
          <motion.div
            variants={{
              initial: { opacity: 0, scale: 0.95 },
              hover: {
                opacity: 1,
                scale: 1,
                transition: { duration, ease: "easeOut" },
              },
            }}
            style={{
              backgroundColor: boxBgColor,
              borderRadius: "8px",
            }}
            className="absolute inset-0 -z-10"
          />
        );

      case "slide":
        return (
          <motion.span
            variants={{
              initial: { x: "-100%", opacity: 0 },
              hover: {
                x: "0%",
                opacity: 1,
                transition: { duration, ease: "easeInOut" },
              },
            }}
            style={{
              backgroundColor: underlineColor,
              height: underlineHeight,
              borderRadius: "9999px",
            }}
            className="absolute bottom-0 left-0 w-full"
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.li
      whileHover="hover"
      initial="initial"
      animate="initial"
      whileTap="hover"
      className={clsx(
        "relative inline-flex flex-col items-center justify-center cursor-pointer font-medium transition-colors",
        fontSize,
        className
      )}
      variants={
        effectType === "grow"
          ? {
              initial: { scale: 1 },
              hover: {
                scale: 1.1,
                transition: { duration, ease: "easeInOut" },
              },
            }
          : undefined
      }
    >
      <span className="relative inline-block pb-[2px]">
        {children}
        {renderEffect()}
      </span>
    </motion.li>
  );
};

export default NavEffect;
