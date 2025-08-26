import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Star } from "lucide-react";
import { cn } from "../lib/utils"; // Adjust path if needed
import { CountUp } from "./count-up";
export const TrustedUsers = ({ avatars, rating = 5, totalUsersText = 1000, // ✅ default as number
caption = "Trusted by", className = "", starColorClass = "text-yellow-400", ringColors = [], }) => {
    return (_jsxs("div", { className: cn(`flex items-center justify-center gap-6 bg-transparent
          text-foreground py-4 px-4`, className), children: [_jsx("div", { className: "flex -space-x-4", children: avatars.map((src, i) => (_jsx("div", { className: `w-10 h-10 rounded-full overflow-hidden ring-1 ring-offset-2 ring-offset-black ${ringColors[i] || "ring-blue-900"}`, children: _jsx("img", { src: src, alt: `Avatar ${i + 1}`, className: "w-full h-full object-cover", loading: "lazy" // Add lazy loading
                        , decoding: "async" // Suggest asynchronous decoding
                     }) }, i))) }), _jsxs("div", { className: "flex flex-col items-start gap-1", children: [_jsx("div", { className: `flex gap-1 ${starColorClass}`, children: Array.from({ length: rating }).map((_, i) => (_jsx(Star, { fill: "currentColor", className: "w-4 h-4" }, i))) }), _jsxs("span", { className: "text-foreground text-xs md:text-md font-medium", children: [caption, _jsx(CountUp, { value: totalUsersText, duration: 2, separator: ",", className: "ml-1 text-lg", suffix: "+", colorScheme: "gradient" }), "users"] })] })] }));
};
