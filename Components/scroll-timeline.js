import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring,
// Add this import if you haven't already and plan to use specific easing types
// Easing,
 } from "framer-motion";
import { cn } from "../lib/utils";
import { Card, CardContent } from "../ui/card";
import { Calendar } from "lucide-react";
const DEFAULT_EVENTS = [
    {
        year: "2023",
        title: "Major Achievement",
        subtitle: "Organization Name",
        description: "Description of the achievement or milestone reached during this time period.",
    },
    {
        year: "2022",
        title: "Important Milestone",
        subtitle: "Organization Name",
        description: "Details about this significant milestone and its impact.",
    },
    {
        year: "2021",
        title: "Key Event",
        subtitle: "Organization Name",
        description: "Information about this key event in the timeline.",
    },
];
export const ScrollTimeline = ({ events = DEFAULT_EVENTS, title = "Timeline", subtitle = "Scroll to explore the journey", animationOrder = "sequential", cardAlignment = "alternating", lineColor = "bg-primary/30", activeColor = "bg-primary", progressIndicator = true, cardVariant = "default", cardEffect = "none", parallaxIntensity = 0.2, progressLineWidth = 2, progressLineCap = "round", dateFormat = "badge", revealAnimation = "fade", className = "", connectorStyle = "line", perspective = false, darkMode = false, smoothScroll = true, }) => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [scrollProgress, setScrollProgress] = useState(0);
    const timelineRefs = useRef([]); // This is correctly typed
    // Scroll progress tracking
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"],
    });
    // Smoothed scroll progress for animations
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });
    // Update state on scroll
    useEffect(() => {
        const unsubscribe = scrollYProgress.onChange((v) => {
            setScrollProgress(v);
            // Calculate active card based on scroll position
            const newIndex = Math.floor(v * events.length);
            if (newIndex !== activeIndex &&
                newIndex >= 0 &&
                newIndex < events.length) {
                setActiveIndex(newIndex);
            }
        });
        return () => unsubscribe();
    }, [scrollYProgress, events.length, activeIndex]);
    // Card animation variants
    const getCardVariants = (index) => {
        const baseDelay = animationOrder === "simultaneous"
            ? 0
            : animationOrder === "staggered"
                ? index * 0.2
                : index * 0.3;
        const initialStates = {
            fade: { opacity: 0, y: 20 },
            slide: {
                x: cardAlignment === "left"
                    ? -100
                    : cardAlignment === "right"
                        ? 100
                        : index % 2 === 0
                            ? -100
                            : 100,
                opacity: 0,
            },
            scale: { scale: 0.8, opacity: 0 },
            flip: { rotateY: 90, opacity: 0 },
            none: { opacity: 1 },
        };
        return {
            initial: initialStates[revealAnimation],
            whileInView: {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                rotateY: 0,
                transition: {
                    duration: 0.7,
                    delay: baseDelay,
                    ease: [0.25, 0.1, 0.25, 1.0], // Fixed: Explicitly cast as a tuple
                },
            },
            viewport: { once: false, margin: "-100px" },
        };
    };
    // Generate connector style classes
    const getConnectorClasses = () => {
        const baseClasses = cn("absolute left-1/2 transform -translate-x-1/2", lineColor);
        switch (connectorStyle) {
            case "dots":
                return cn(baseClasses, "w-1 rounded-full");
            case "dashed":
                return cn(baseClasses, `w-[${progressLineWidth}px] [mask-image:linear-gradient(to_bottom,black_33%,transparent_33%,transparent_66%,black_66%)] [mask-size:1px_12px]`);
            case "line":
            default:
                return cn(baseClasses, `w-[${progressLineWidth}px]`);
        }
    };
    // Generate card classes based on variant and effect
    const getCardClasses = (index) => {
        const baseClasses = "relative z-10 rounded-lg transition-all duration-300";
        // Variant classes
        const variantClasses = {
            default: "bg-card border shadow-sm",
            elevated: "bg-card border border-border/40 shadow-md",
            outlined: "bg-card/50 backdrop-blur border-2 border-primary/20",
            filled: "bg-primary/10 border border-primary/30",
        };
        // Effect classes
        const effectClasses = {
            none: "",
            glow: "hover:shadow-[0_0_15px_rgba(var(--primary-rgb)/0.5)]",
            shadow: "hover:shadow-lg hover:-translate-y-1",
            bounce: "hover:scale-[1.03] hover:shadow-md active:scale-[0.97]",
        };
        // Card alignment classes
        const alignmentClasses = cardAlignment === "alternating"
            ? index % 2 === 0
                ? "lg:ml-auto lg:mr-[15%]"
                : "lg:mr-auto lg:ml-[15%]"
            : cardAlignment === "left"
                ? "lg:mr-auto lg:ml-0"
                : "lg:ml-auto lg:mr-0";
        const perspectiveClass = perspective
            ? "transform transition-transform hover:rotate-y-1 hover:rotate-x-1"
            : "";
        return cn(baseClasses, variantClasses[cardVariant], effectClasses[cardEffect], alignmentClasses, perspectiveClass, "w-full lg:w-[calc(50%-40px)]");
    };
    return (_jsxs("div", { ref: scrollRef, className: cn("relative min-h-screen w-full overflow-hidden", darkMode ? "bg-zinc-900 text-zinc-100" : "", className), children: [_jsxs("div", { className: "text-center py-16 px-4", children: [_jsx("h2", { className: "text-3xl md:text-5xl font-bold mb-4", children: title }), _jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: subtitle })] }), _jsx("div", { className: "relative max-w-6xl mx-auto px-4 pb-24", children: _jsxs("div", { className: "relative mx-auto", children: [_jsx("div", { className: cn(getConnectorClasses(), "h-full absolute top-0") }), progressIndicator && (_jsx(motion.div, { className: cn("absolute top-0 w-1 rounded-t-full", activeColor), style: {
                                height: smoothProgress,
                                width: progressLineWidth,
                                left: "50%",
                                transform: "translateX(-50%)",
                                borderRadius: progressLineCap === "round" ? "999px" : "0px",
                            } })), _jsx("div", { className: "relative z-10", children: events.map((event, index) => {
                                // Calculate parallax effect
                                const yOffset = useTransform(smoothProgress, [0, 1], [parallaxIntensity * 100, -parallaxIntensity * 100]);
                                return (_jsxs("div", { ref: (el) => {
                                        // Change this line
                                        timelineRefs.current[index] = el;
                                    }, className: cn("relative flex flex-col lg:flex-row items-center mb-20 py-4", cardAlignment === "alternating"
                                        ? index % 2 === 0
                                            ? "lg:justify-end"
                                            : "lg:justify-start"
                                        : cardAlignment === "left"
                                            ? "lg:justify-start"
                                            : "lg:justify-end"), children: [_jsx("div", { className: "absolute left-1/2 top-0 transform -translate-x-1/2 z-10", children: _jsx("div", { className: cn("w-6 h-6 rounded-full border-4  border-gray-200 dark:border-gray-800 transition-colors duration-300", index <= activeIndex
                                                    ? "border-primary bg-background"
                                                    : "border border-gray-200 dark:border-gray-800 bg-card") }) }), _jsx(motion.div, { className: getCardClasses(index), variants: getCardVariants(index), initial: "initial", whileInView: "whileInView", viewport: { once: false, margin: "-100px" }, style: parallaxIntensity > 0 ? { y: yOffset } : undefined, children: _jsx(Card, { children: _jsxs(CardContent, { className: "p-6", children: [dateFormat === "badge" ? (_jsxs("div", { className: "flex items-center mb-2", children: [event.icon || (_jsx(Calendar, { className: "h-4 w-4 mr-2 text-primary" })), _jsx("span", { className: cn("text-sm font-bold", event.color
                                                                        ? `text-${event.color}`
                                                                        : "text-primary"), children: event.year })] })) : (_jsx("p", { className: "text-lg font-bold text-primary mb-2", children: event.year })), _jsx("h3", { className: "text-xl font-bold mb-1", children: event.title }), event.subtitle && (_jsx("p", { className: "text-muted-foreground font-medium mb-2", children: event.subtitle })), _jsx("p", { className: "text-muted-foreground", children: event.description })] }) }) })] }, event.id || index));
                            }) })] }) })] }));
};
