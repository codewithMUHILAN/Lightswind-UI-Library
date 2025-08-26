"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { motion } from "framer-motion";
const RippleLoader = ({
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
  return _jsxs("div", {
    className: "relative",
    style: { width: size, height: size },
    children: [
      rippleBoxes.map((box, i) =>
        _jsx(
          motion.div,
          {
            className: "absolute rounded-full border-t backdrop-blur-[5px]",
            style: {
              inset: box.inset,
              zIndex: box.zIndex,
              borderColor: `rgba(100,100,100,${box.opacity})`,
              background:
                "linear-gradient(0deg, rgba(50, 50, 50, 0.2), rgba(100, 100, 100, 0.2))",
            },
            animate: {
              scale: [1, 1.3, 1],
              boxShadow: [
                "rgba(0, 0, 0, 0.3) 0px 10px 10px 0px",
                "rgba(0, 0, 0, 0.3) 0px 30px 20px 0px",
                "rgba(0, 0, 0, 0.3) 0px 10px 10px 0px",
              ],
            },
            transition: {
              repeat: Infinity,
              duration,
              delay: box.delay,
              ease: "easeInOut",
            },
          },
          i
        )
      ),
      _jsx("div", {
        className: "absolute inset-0 grid place-content-center p-[30%]",
        children: _jsx(motion.span, {
          className: "w-full h-full",
          animate: { color: [logoColor, "#ffffff", logoColor] },
          transition: {
            repeat: Infinity,
            duration,
            ease: "easeInOut",
          },
          children: _jsx("span", {
            className: "w-full h-full",
            style: { display: "inline-block", width: "100%", height: "100%" },
            children:
              icon &&
              React.cloneElement(icon, {
                style: {
                  width: "100%",
                  height: "100%",
                  fill: "currentColor",
                },
              }),
          }),
        }),
      }),
    ],
  });
};
export default RippleLoader;
