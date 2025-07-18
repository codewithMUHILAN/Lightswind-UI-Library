import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
export const DynamicNavigation = ({ links, theme = "dark", backgroundColor, textColor, highlightColor, glowIntensity = 5, className, showLabelsOnMobile = false, onLinkClick, activeLink, enableRipple = true, }) => {
    const navRef = useRef(null);
    const highlightRef = useRef(null);
    const [active, setActive] = useState(activeLink || (links.length > 0 ? links[0].id : null));
    // Calculate theme-based styles
    const getThemeStyles = () => {
        switch (theme) {
            case "light":
                return {
                    bg: "bg-white",
                    border: "border-gray-200",
                    text: "text-gray-800",
                    highlight: "bg-gray-100",
                    glow: "shadow-md",
                };
            case "primary":
                return {
                    bg: "bg-primary",
                    border: "border-primary/30",
                    text: "text-primary-foreground",
                    highlight: "bg-primary-foreground/10",
                    glow: "shadow-lg shadow-primary/20",
                };
            case "custom":
                return {
                    bg: backgroundColor ? "" : "bg-black",
                    border: "border-gray-700",
                    text: textColor ? "" : "text-white",
                    highlight: highlightColor ? "" : "bg-white/10",
                    glow: `shadow-[0_0_${glowIntensity}px_rgba(255,255,255,0.3)]`,
                };
            case "dark":
            default:
                return {
                    bg: "bg-black",
                    border: "border-gray-700",
                    text: "text-white",
                    highlight: "bg-white/10",
                    glow: `shadow-[0_0_${glowIntensity}px_rgba(255,255,255,0.3)]`,
                };
        }
    };
    const themeStyles = getThemeStyles();
    // Update highlight position based on active link
    const updateHighlightPosition = (id) => {
        if (!navRef.current || !highlightRef.current)
            return;
        const linkElement = navRef.current.querySelector(`#nav-item-${id || active}`);
        if (!linkElement)
            return;
        const { left, width } = linkElement.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();
        highlightRef.current.style.transform = `translateX(${left - navRect.left}px)`;
        highlightRef.current.style.width = `${width}px`;
    };
    // Create ripple effect
    const createRipple = (event) => {
        if (!enableRipple)
            return;
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - diameter / 2}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - diameter / 2}px`;
        circle.classList.add("absolute", "bg-white", "rounded-full", "pointer-events-none", "opacity-30", "animate-ripple");
        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) {
            ripple.remove();
        }
        button.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    };
    // Handle link click
    const handleLinkClick = (id, event) => {
        if (enableRipple) {
            createRipple(event);
        }
        setActive(id);
        if (onLinkClick) {
            onLinkClick(id);
        }
    };
    // Handle link hover
    const handleLinkHover = (id) => {
        if (!navRef.current || !highlightRef.current)
            return;
        updateHighlightPosition(id);
    };
    // Set initial highlight position and update on window resize
    useEffect(() => {
        updateHighlightPosition();
        const handleResize = () => {
            updateHighlightPosition();
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [active, links]);
    // Update when active link changes externally
    useEffect(() => {
        if (activeLink && activeLink !== active) {
            setActive(activeLink);
        }
    }, [activeLink]);
    // Apply custom styles
    const customStyles = {
        backgroundColor: theme === "custom" && backgroundColor ? backgroundColor : undefined,
        color: theme === "custom" && textColor ? textColor : undefined,
    };
    const highlightStyles = {
        backgroundColor: theme === "custom" && highlightColor ? highlightColor : undefined,
    };
    return (_jsxs("nav", { ref: navRef, className: cn(`relative rounded-full px-2 backdrop-blur-md border border-gray-200 dark:border-gray-800 
        shadow-lg transition-all duration-300`, themeStyles.bg, themeStyles.border, themeStyles.glow, className), style: customStyles, children: [_jsx("div", { ref: highlightRef, className: cn(`absolute top-0 left-0 h-full rounded-full transition-all 
          duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-0`, themeStyles.highlight), style: highlightStyles }), _jsx("ul", { className: "flex justify-between items-center gap-1 py-2 relative z-10", children: links.map((link) => (_jsx("li", { className: "flex-1 rounded-full", id: `nav-item-${link.id}`, children: _jsxs("a", { href: link.href, className: cn(`flex gap-2 items-center justify-center h-8 md:h-10 text-xs md:text-sm 
                rounded-full font-medium transition-all duration-300 hover:scale-105 
                relative overflow-hidden`, themeStyles.text, active === link.id && "font-semibold"), onClick: (e) => {
                            e.preventDefault();
                            handleLinkClick(link.id, e);
                        }, onMouseEnter: () => handleLinkHover(link.id), children: [link.icon && (_jsx("span", { className: "text-current text-xs md:text-sm ", children: link.icon })), _jsx("span", { className: cn(showLabelsOnMobile ? "flex" : "hidden sm:flex"), children: link.label })] }) }, link.id))) }), _jsx("style", { dangerouslySetInnerHTML: {
                    __html: `        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s linear;
        }
 `,
                } })] }));
};
export default DynamicNavigation;
