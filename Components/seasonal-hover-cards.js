import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../lib/utils";
const SeasonCard = ({ title, subtitle, description, imageSrc, imageAlt, className, }) => {
    return (_jsxs("div", { className: cn("group relative flex flex-col justify-end p-6 w-full md:w-1/3 h-[350px] lg:h-[450px] bg-black rounded-lg overflow-hidden shadow-lg transition-all duration-500 hover:w-2/3", className), children: [_jsx("img", { src: imageSrc, className: "absolute inset-0 w-full h-full object-cover object-center", alt: imageAlt || title }), _jsx("div", { className: "absolute inset-0 bg-black bg-opacity-60" }), _jsxs("div", { className: "relative md:absolute md:bottom-20 z-10 space-y-2", children: [_jsx("h2", { className: "text-xl font-bold text-white", children: title }), _jsx("p", { className: "text-sm text-gray-300", children: subtitle })] }), _jsx("div", { className: "mt-4 transform translate-y-6 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0", children: _jsx("p", { className: "text-lg text-white", children: description }) })] }));
};
export function SeasonalHoverCards({ cards, className, }) {
    return (_jsx("div", { className: cn("flex flex-wrap md:flex-nowrap gap-4 w-full px-4", className), children: cards.map((card, index) => (_jsx(SeasonCard, { title: card.title, subtitle: card.subtitle, description: card.description, imageSrc: card.imageSrc, imageAlt: card.imageAlt }, index))) }));
}
