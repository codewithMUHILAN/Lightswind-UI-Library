import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, AnimatePresence } from "framer-motion";
const AnimatedRangeInput = ({ value, onChange, icon, labelId, fillColor = "#ff5722", // Orange
 }) => {
    // Handle reverse direction: Top = 100, Bottom = 0
    const handleChange = (e) => {
        const rawValue = Number(e.target.value);
        const correctedValue = 100 - rawValue;
        onChange(correctedValue);
    };
    return (_jsxs("div", { className: "relative flex items-center justify-center w-40 h-60 font-primarylw", children: [_jsx("div", { className: "absolute -left-10 flex flex-col items-center gap-2", children: _jsx("div", { className: "text-black text-xl", children: icon }) }), _jsxs("div", { className: "relative flex items-center justify-center w-16 h-full rounded-xl border border-gray-300 overflow-hidden bg-white", children: [_jsx(AnimatePresence, { children: _jsx(motion.div, { initial: { height: 0 }, animate: { height: `${value}%` }, exit: { height: 0 }, transition: { duration: 0.3 }, style: {
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                backgroundColor: fillColor,
                                zIndex: 1,
                                borderRadius: "inherit",
                            } }, "fill") }), _jsxs("span", { className: "absolute text-black text-sm font-bold z-10", children: [value, "%"] }), _jsx("input", { id: labelId, type: "range", min: 0, max: 100, step: 1, value: 100 - value, onChange: handleChange, style: {
                            transform: "rotate(-90deg)",
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            zIndex: 2,
                            background: "transparent",
                            WebkitAppearance: "none", // necessary for WebKit
                            appearance: "none", // for Firefox
                            cursor: "pointer",
                        } })] })] }));
};
export default AnimatedRangeInput;
