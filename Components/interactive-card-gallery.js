import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../lib/utils";
const CardItem = ({ title, description, imageSrc, buttonText, buttonLink, imageAlt, accentColor = "yellow", onClick, }) => {
    const handleClick = (e) => {
        if (buttonLink) {
            if (!onClick)
                return;
            e.preventDefault();
        }
        onClick?.();
    };
    return (_jsxs("div", { className: "relative flex items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg group h-full", children: [_jsx("div", { className: "absolute inset-0 bg-cover bg-center transform transition-transform duration-700 ease-out group-hover:scale-110", style: {
                    backgroundImage: `url('${imageSrc}')`,
                } }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" }), _jsxs("div", { className: "relative flex flex-col items-center text-white p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out", children: [_jsx("h2", { className: "text-lg font-bold", children: title }), _jsx("p", { className: "mt-2 italic text-sm", children: description }), _jsx("button", { className: `mt-4 px-4 py-2 bg-black text-white font-bold text-xs uppercase tracking-wide rounded-lg hover:bg-gray-800 focus:outline-none focus:ring focus:ring-${accentColor}-400`, onClick: handleClick, children: buttonText })] })] }));
};
export function InteractiveCardGallery({ cards, className, cardHeight = "h-64", columns = 4, hoverScale = 1.1, transitionDuration = 700, }) {
    const getGridCols = () => {
        switch (columns) {
            case 1: return "grid-cols-1";
            case 2: return "sm:grid-cols-2";
            case 3: return "sm:grid-cols-2 lg:grid-cols-3";
            case 4:
            default: return "sm:grid-cols-2 lg:grid-cols-4";
        }
    };
    return (_jsx("div", { className: cn(`grid gap-4 p-4 max-w-screen-lg mx-auto ${getGridCols()}`, className), style: {
            "--hover-scale": hoverScale,
            "--transition-duration": `${transitionDuration}ms`
        }, children: cards.map((card, index) => (_jsx("div", { className: cn("group", cardHeight), children: _jsx(CardItem, { ...card }) }, index))) }));
}
