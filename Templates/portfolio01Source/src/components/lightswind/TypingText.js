"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import React, { useEffect, useState, } from "react";
import { cn } from "../lib/utils";
export const TypingText = ({ children, as: Component = "div", className = "", delay = 0, duration = 2, fontSize = "text-4xl", fontWeight = "font-bold", color = "text-white", letterSpacing = "tracking-wide", align = "left", loop = false, }) => {
    const [textContent, setTextContent] = useState("");
    useEffect(() => {
        const extractText = (node) => {
            if (typeof node === "string" || typeof node === "number") {
                return node.toString();
            }
            if (Array.isArray(node)) {
                return node.map(extractText).join("");
            }
            if (React.isValidElement(node) &&
                typeof node.props.children !== "undefined") {
                return extractText(node.props.children);
            }
            return "";
        };
        setTextContent(extractText(children));
    }, [children]);
    const characters = textContent.split("").map((char) => char === " " ? "\u00A0" : char);
    const characterVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: (i) => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: delay + i * (duration / characters.length),
                duration: 0.3,
                ease: "easeInOut",
            },
        }),
    };
    return (_jsx(Component, { className: cn("inline-flex", className, fontSize, fontWeight, color, letterSpacing, align === "center"
            ? "justify-center text-center"
            : align === "right"
                ? "justify-end text-right"
                : "justify-start text-left"), children: _jsx(motion.span, { className: "inline-block", initial: "hidden", animate: "visible", "aria-label": textContent, role: "text", children: characters.map((char, index) => (_jsx(motion.span, { className: "inline-block", variants: characterVariants, custom: index, initial: "hidden", animate: "visible", children: char }, `${char}-${index}`))) }) }));
};
