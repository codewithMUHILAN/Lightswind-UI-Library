"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
export const MorphingNavigation = ({ links, scrollThreshold = 100, enablePageBlur = true, theme = "glass", backgroundColor, textColor, borderColor, initialTop = 70, compactTop = 20, animationDuration = 1, className, onLinkClick, onMenuToggle, enableSmoothTransitions = true, customHamburgerIcon, disableAutoMorph = false, }) => {
    const [isSticky, setIsSticky] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navRef = useRef(null);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const getThemeStyles = useCallback(() => {
        switch (theme) {
            case "dark":
                return {
                    nav: "bg-black/80 border-gray-800",
                    text: "text-white",
                    button: "bg-black/50 border-gray-700",
                };
            case "light":
                return {
                    nav: "bg-white/80 border-gray-200",
                    text: "text-gray-900",
                    button: "bg-white/50 border-gray-300",
                };
            case "custom":
                return {
                    nav: backgroundColor ? "" : "bg-white/5 border-white/10",
                    text: textColor ? "" : "text-white",
                    button: "bg-black/30 border-white/10",
                };
            case "glass":
            default:
                return {
                    nav: "bg-white/5 border-white/10",
                    text: "text-foreground",
                    button: "bg-black/30 border-white/10",
                };
        }
    }, [theme, backgroundColor, textColor]);
    const themeStyles = getThemeStyles();
    useEffect(() => {
        if (disableAutoMorph && !isMobile)
            return;
        const handleScroll = () => {
            if (isMobile) {
                setIsSticky(true);
                setIsMenuOpen(false);
            }
            else {
                setIsSticky(window.scrollY >= scrollThreshold);
                setIsMenuOpen(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [scrollThreshold, disableAutoMorph, isMobile]);
    const handleMenuToggle = () => {
        const open = !isMenuOpen;
        setIsMenuOpen(open);
        if (isMobile && open) {
            setIsSticky(true);
        }
        else if (isMobile && !open) {
            setIsSticky(window.scrollY >= scrollThreshold);
        }
        else {
            setIsSticky(false);
        }
        onMenuToggle?.(open);
    };
    const handleLinkClick = (link, e) => {
        e.preventDefault();
        setIsMenuOpen(false);
        onLinkClick?.(link);
        if (enableSmoothTransitions) {
            const target = document.querySelector(link.href);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target) && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isMenuOpen]);
    const customStyles = {
        backgroundColor: theme === "custom" ? backgroundColor : undefined,
        color: theme === "custom" ? textColor : undefined,
        borderColor: theme === "custom" ? borderColor : undefined,
    };
    return (_jsxs(_Fragment, { children: [_jsx(AnimatePresence, { children: enablePageBlur && isMenuOpen && (_jsx(motion.div, { className: "fixed inset-0 bg-black/20 backdrop-blur-sm z-40", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } })) }), _jsx(motion.header, { className: cn("fixed top-4 z-50 w-full", className), initial: false, animate: {
                    top: isMobile ? compactTop : isSticky ? compactTop : initialTop,
                }, transition: { duration: animationDuration }, children: _jsxs(motion.nav, { ref: navRef, className: cn("flex justify-center items-center mx-auto backdrop-blur-md border fixed", themeStyles.nav, themeStyles.text, {
                        "left-1/2 -translate-x-1/2": !isMobile && !isSticky,
                        "left-0 right-0": isMobile || isSticky,
                        "sm:w-[70px] sm:h-[70px] sm:rounded-full": isMobile,
                    }), animate: {
                        height: isMobile ? 70 : isSticky ? 90 : 100,
                        width: isMobile ? 70 : isSticky ? 90 : 500,
                        borderRadius: 9999,
                    }, transition: { duration: animationDuration }, style: { top: 0, ...customStyles }, children: [_jsx(AnimatePresence, { children: !isMobile && !isSticky &&
                                links.map((link, i) => (_jsxs(motion.a, { href: link.href, onClick: (e) => handleLinkClick(link, e), initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0 }, transition: { delay: i * 0.1 }, className: "px-5 py-2.5 text-sm font-bold lowercase tracking-wide", children: [link.icon && _jsx("span", { className: "mr-2 inline-block", children: link.icon }), link.label] }, link.id))) }), _jsx(motion.button, { onClick: handleMenuToggle, className: cn("absolute w-[60px] h-[60px] rounded-full outline-none border cursor-pointer", themeStyles.button, {
                                hidden: !isSticky && !isMobile,
                                block: isMobile || isSticky,
                            }), animate: { scale: isMobile || isSticky ? 1 : 0 }, transition: { delay: isMobile || isSticky ? 0.2 : 0 }, children: customHamburgerIcon || (_jsxs("div", { className: "flex flex-col items-center justify-center h-full", children: [_jsx("span", { className: "block w-4 h-0.5 bg-current my-1" }), _jsx("span", { className: "block w-4 h-0.5 bg-current my-1" }), _jsx("span", { className: "block w-4 h-0.5 bg-current my-1" })] })) })] }) }), _jsx(AnimatePresence, { children: isMenuOpen && (_jsx(motion.div, { className: "fixed inset-0 z-40 flex items-center justify-center", initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.3 }, children: _jsx(motion.div, { className: cn("p-8 rounded-2xl backdrop-blur-md border w-11/12 max-w-sm", themeStyles.nav, themeStyles.text), style: customStyles, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx("div", { className: "flex flex-col space-y-4", children: links.map((link) => (_jsxs("a", { href: link.href, onClick: (e) => handleLinkClick(link, e), className: "font-bold text-lg tracking-wide lowercase hover:scale-105 transition-transform", children: [link.icon && _jsx("span", { className: "inline-block mr-3", children: link.icon }), link.label] }, link.id))) }) }) })) })] }));
};
export default MorphingNavigation;
