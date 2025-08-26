"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Copy, Terminal, Check } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
const TerminalCard = ({ command, language = "tsx", className }) => {
    const [copied, setCopied] = useState(false);
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    // Typing animation logic
    useEffect(() => {
        let timeout;
        if (index < command.length) {
            timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + command.charAt(index));
                setIndex((prev) => prev + 1);
            }, 40); // typing speed
        }
        else {
            setIsComplete(true);
            timeout = setTimeout(() => {
                setDisplayedText("");
                setIndex(0);
                setIsComplete(false);
            }, 2000); // restart delay
        }
        return () => clearTimeout(timeout);
    }, [index, command]);
    // Copy handler
    const handleCopy = () => {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (_jsxs("div", { className: cn("border rounded-lg backdrop-blur-md min-w-[300px] max-w-full", "bg-white/70 border-gray-300 text-black", "dark:bg-white/10 dark:border-gray-400/30 dark:text-white", className), children: [_jsxs("div", { className: "flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-[#202425] rounded-t-lg text-sm font-semibold text-gray-700 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Terminal, { className: "w-4 h-4 text-blue-500" }), "Terminal"] }), _jsx("button", { className: "p-1 border rounded transition hover:border-gray-600 dark:hover:border-white text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white", onClick: handleCopy, "aria-label": "Copy to clipboard", children: copied ? _jsx(Check, { className: "w-4 h-4 text-green-500" }) : _jsx(Copy, { className: "w-4 h-4" }) })] }), _jsx("div", { className: "rounded-b-lg text-sm font-mono p-3 bg-black text-white dark:bg-black max-h-[300px] overflow-auto", children: isComplete ? (_jsx(SyntaxHighlighter, { language: language, style: oneDark, customStyle: { background: "transparent", margin: 0, padding: 0 }, children: command })) : (_jsxs(motion.pre, { className: "whitespace-pre-wrap", children: [displayedText, _jsx(motion.span, { className: "inline-block w-1 bg-white ml-1", animate: { opacity: [0, 1] }, transition: { duration: 0.6, repeat: Infinity } })] })) })] }));
};
export default TerminalCard;
