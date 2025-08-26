import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState, useRef } from "react";
import { cn } from "../lib/utils";
import { Loader2 } from "lucide-react";
import { cva } from "class-variance-authority";
// Variants for button styling
const confettiButtonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
            outline: "border bg-background hover:bg-accent hover:text-accent-foreground",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
            gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700",
        },
        size: {
            default: "h-10 px-4 py-2 rounded-md",
            sm: "h-8 px-3 py-1 rounded-md text-sm",
            lg: "h-12 px-6 py-3 rounded-md text-lg",
            xl: "h-14 px-8 py-4 rounded-md text-xl",
            icon: "h-10 w-10 rounded-full",
            pill: "h-10 px-6 py-2 rounded-full",
        },
        animation: {
            none: "",
            pulse: "animate-pulse",
            bounce: "hover:animate-bounce",
            scale: "active:scale-95",
            shake: "hover:animate-[wiggle_0.3s_ease-in-out]",
            glow: "hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]",
            expand: "active:scale-110 transition-transform",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
        animation: "scale",
    },
});
const ConfettiButton = React.forwardRef(({ className, variant, size, animation, asChild = false, children, icon, iconPosition = "left", loading = false, confettiOptions = {
    particleCount: 100,
    spread: 70,
}, autoConfetti = false, triggerOnHover = false, ...props }, ref) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const buttonRef = useRef(null);
    // Load confetti script dynamically
    useEffect(() => {
        if (!window.confetti) {
            const script = document.createElement("script");
            script.src =
                "https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js";
            script.async = true;
            script.onload = () => setScriptLoaded(true);
            document.body.appendChild(script);
            return () => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            };
        }
        else {
            setScriptLoaded(true);
        }
    }, []);
    // Auto confetti on mount if needed
    useEffect(() => {
        if (scriptLoaded && autoConfetti && window.confetti && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;
            window.confetti({
                ...confettiOptions,
                origin: { x, y },
            });
        }
    }, [scriptLoaded, autoConfetti, confettiOptions]);
    const triggerConfetti = () => {
        if (scriptLoaded && window.confetti && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;
            window.confetti({
                ...confettiOptions,
                origin: { x, y },
            });
        }
    };
    return (_jsxs("button", { ref: (node) => {
            if (typeof ref === "function")
                ref(node);
            else if (ref)
                ref.current = node;
            buttonRef.current = node;
        }, className: cn(confettiButtonVariants({ variant, size, animation }), className), onClick: (e) => {
            if (scriptLoaded) {
                triggerConfetti();
            }
            props.onClick?.(e);
        }, onMouseEnter: triggerOnHover ? () => triggerConfetti() : undefined, disabled: loading || props.disabled, ...props, children: [loading && _jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }), !loading && icon && iconPosition === "left" && (_jsx("span", { className: "mr-1", children: icon })), children, !loading && icon && iconPosition === "right" && (_jsx("span", { className: "ml-1", children: icon }))] }));
});
ConfettiButton.displayName = "ConfettiButton";
export { ConfettiButton, confettiButtonVariants };
