// components/Carousel3D.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useEffect, useState, } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/app/component2/ui/card";
import { useIsMobile } from "../hooks/use-mobile";
import Link from "next/link";
const Carousel3D = ({ items, autoRotate = true, rotateInterval = 4000, cardHeight = 500, title = "From Textile to Intelligence", subtitle = "Customer Cases", tagline = "Explore how our textile sensor technology is revolutionizing multiple industries with intelligent fabric solutions tailored to specific needs.", isMobileSwipe = true, }) => {
    const [active, setActive] = useState(0);
    const carouselRef = useRef(null);
    const [isInView, setIsInView] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const isMobile = useIsMobile();
    const minSwipeDistance = 50;
    useEffect(() => {
        if (autoRotate && isInView && !isHovering) {
            const interval = setInterval(() => {
                setActive((prev) => (prev + 1) % items.length);
            }, rotateInterval);
            return () => clearInterval(interval);
        }
    }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.2 });
        return () => observer.disconnect();
    }, []);
    const onTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(null);
    };
    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd)
            return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) {
            setActive((prev) => (prev + 1) % items.length);
        }
        else if (distance < -minSwipeDistance) {
            setActive((prev) => (prev - 1 + items.length) % items.length);
        }
    };
    const getCardAnimationClass = (index) => {
        if (index === active)
            return "scale-100 opacity-100 z-20";
        if (index === (active + 1) % items.length)
            return "translate-x-[40%] scale-95 opacity-60 z-10";
        if (index === (active - 1 + items.length) % items.length)
            return "translate-x-[-40%] scale-95 opacity-60 z-10";
        return "scale-90 opacity-0";
    };
    return (_jsx("section", { id: "carousel3d", className: "bg-transparent min-w-full mx-aut \r\n    flex items-center justify-center", children: _jsx("div", { className: "w-full px-4 sm:px-6 lg:px-8 \r\n      min-w-[350px] md:min-w-[1000px] max-w-7xl  ", children: _jsxs("div", { className: "relative overflow-hidden h-[550px] ", onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false), onTouchStart: onTouchStart, onTouchMove: onTouchMove, onTouchEnd: onTouchEnd, ref: carouselRef, children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-full flex items-center justify-center ", children: items.map((item, index) => (_jsx("div", { className: `absolute top-0 w-full max-w-md transform transition-all duration-500 ${getCardAnimationClass(index)}`, children: _jsxs(Card, { className: `overflow-hidden bg-background h-[${cardHeight}px] border shadow-sm 
                hover:shadow-md flex flex-col`, children: [_jsxs("div", { className: "relative bg-black p-6 flex items-center justify-center h-48 overflow-hidden", style: {
                                            backgroundImage: `url(${item.imageUrl})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }, children: [_jsx("div", { className: "absolute inset-0 bg-black/50" }), _jsxs("div", { className: "relative z-10 text-center text-white", children: [_jsx("h3", { className: "text-2xl font-bold mb-2", children: item.brand.toUpperCase() }), _jsx("div", { className: "w-12 h-1 bg-white mx-auto mb-2" }), _jsx("p", { className: "text-sm ", children: item.title })] })] }), _jsxs(CardContent, { className: "p-6 flex flex-col flex-grow", children: [_jsx("h3", { className: "text-xl font-bold mb-1 text-foreground", children: item.title }), _jsx("p", { className: "text-gray-500 text-sm font-medium mb-2", children: item.brand }), _jsx("p", { className: "text-gray-600 text-sm flex-grow", children: item.description }), _jsxs("div", { className: "mt-4", children: [_jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: item.tags.map((tag, idx) => (_jsx("span", { className: "px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs animate-pulse-slow", children: tag }, idx))) }), _jsxs(Link, { href: item.link, className: "text-gray-500 flex items-center hover:underline relative group", onClick: () => {
                                                            if (item.link.startsWith("/")) {
                                                                window.scrollTo(0, 0);
                                                            }
                                                        }, children: [_jsx("span", { className: "relative z-10", children: "Learn more" }), _jsx(ArrowRight, { className: "ml-2 w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" }), _jsx("span", { className: "absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full" })] })] })] })] }) }, item.id))) }), !isMobile && (_jsxs(_Fragment, { children: [_jsx("button", { className: "absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white z-30 shadow-md transition-all hover:scale-110", onClick: () => setActive((prev) => (prev - 1 + items.length) % items.length), "aria-label": "Previous", children: _jsx(ChevronLeft, { className: "w-5 h-5" }) }), _jsx("button", { className: "absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white z-30 shadow-md transition-all hover:scale-110", onClick: () => setActive((prev) => (prev + 1) % items.length), "aria-label": "Next", children: _jsx(ChevronRight, { className: "w-5 h-5" }) })] })), _jsx("div", { className: "absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-3 z-30", children: items.map((_, idx) => (_jsx("button", { className: `w-2 h-2 rounded-full transition-all duration-300 ${active === idx
                                ? "bg-gray-500 w-5"
                                : "bg-gray-200 hover:bg-gray-300"}`, onClick: () => setActive(idx), "aria-label": `Go to item ${idx + 1}` }, idx))) })] }) }) }));
};
export default Carousel3D;
