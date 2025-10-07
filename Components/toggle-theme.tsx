"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { cn } from "../lib/utils"

// 1. Define the possible animation types (UPDATED to include all demo types)
// NOTE: Type is renamed from 'AnimationType' to 'ThemeAnimationType' 
// to avoid conflicts if used with the demo file in the same scope, 
// though the original 'AnimationType' is kept for minimal change.
type AnimationType =
    | "none"
    | "circle-spread"
    | "round-morph"
    | "swipe-left"
    | "swipe-up"
    | "diag-down-right"
    | "fade-in-out"
    | "shrink-grow"
    | "flip-x-in"
    | "split-vertical"
    | "swipe-right"
    | "swipe-down"
    | "wave-ripple"

// 2. Interface is renamed
interface ToggleThemeProps
    extends React.ComponentPropsWithoutRef<"button"> {
    duration?: number
    animationType?: AnimationType
}

// 3. Component and export are renamed
export const ToggleTheme = ({
    className,
    duration = 400,
    animationType = "circle-spread",
    ...props
}: ToggleThemeProps) => {
    const [isDark, setIsDark] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"))
        }

        updateTheme()

        const observer = new MutationObserver(updateTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        })

        return () => observer.disconnect()
    }, [])

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current) return

        // Wait for the DOM update to complete within the View Transition
        await document.startViewTransition(() => {
            flushSync(() => {
                const newTheme = !isDark
                setIsDark(newTheme)
                document.documentElement.classList.toggle("dark")
                localStorage.setItem("theme", newTheme ? "dark" : "light")
            })
        }).ready

        // Calculate coordinates and dimensions for spatial animations
        const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect()
        const x = left + width / 2
        const y = top + height / 2
        const maxRadius = Math.hypot(
            Math.max(left, window.innerWidth - left),
            Math.max(top, window.innerHeight - top)
        )
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight


        // 4. Implement a switch to handle all animation types
        switch (animationType) {

            // --- Existing/Refined Types ---

            case "circle-spread":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${maxRadius}px at ${x}px ${y}px)`,
                        ],
                    },
                    {
                        duration,
                        easing: "ease-in-out",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "round-morph":
                document.documentElement.animate(
                    [
                        { opacity: 0, transform: "scale(0.8) rotate(5deg)" },
                        { opacity: 1, transform: "scale(1) rotate(0deg)" },
                    ],
                    {
                        duration: duration * 1.2,
                        easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "swipe-left":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `inset(0 0 0 ${viewportWidth}px)`,
                            `inset(0 0 0 0)`,
                        ],
                    },
                    {
                        duration,
                        easing: "cubic-bezier(0.2, 0, 0, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "swipe-up":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `inset(${viewportHeight}px 0 0 0)`,
                            `inset(0 0 0 0)`,
                        ],
                    },
                    {
                        duration,
                        easing: "cubic-bezier(0.2, 0, 0, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break


            // --- New Advanced Types ---

            case "diag-down-right":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `polygon(0 0, 0 0, 0 0, 0 0)`,
                            `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                        ],
                    },
                    {
                        duration: duration * 1.5,
                        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "fade-in-out":
                document.documentElement.animate(
                    {
                        opacity: [0, 1],
                    },
                    {
                        duration: duration * 0.5,
                        easing: "ease-in-out",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "shrink-grow":
                document.documentElement.animate(
                    [
                        { transform: "scale(0.9)", opacity: 0 },
                        { transform: "scale(1)", opacity: 1 },
                    ],
                    {
                        duration: duration * 1.2,
                        easing: "cubic-bezier(0.19, 1, 0.22, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                document.documentElement.animate(
                    [
                        { transform: "scale(1)", opacity: 1 },
                        { transform: "scale(1.05)", opacity: 0 },
                    ],
                    {
                        duration: duration * 1.2,
                        easing: "cubic-bezier(0.19, 1, 0.22, 1)",
                        pseudoElement: "::view-transition-old(root)",
                    }
                )
                break

            case "flip-x-in":
                const styleElement = document.createElement('style');
                styleElement.textContent = `
                    ::view-transition-group(root) { perspective: 1000px; }
                    ::view-transition-old(root) { transform-origin: center; animation: flip-out 400ms forwards; }
                    ::view-transition-new(root) { transform-origin: center; animation: flip-in 400ms forwards; }
                    
                    @keyframes flip-out { from { transform: rotateY(0deg); opacity: 1; } to { transform: rotateY(-90deg); opacity: 0; } }
                    @keyframes flip-in { from { transform: rotateY(90deg); opacity: 0; } to { transform: rotateY(0deg); opacity: 1; } }
                `;
                document.head.appendChild(styleElement);
                break

            case "split-vertical":
                document.documentElement.animate(
                    [{ opacity: 0 }, { opacity: 1 }],
                    {
                        duration: duration * 0.75,
                        easing: "ease-in",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                document.documentElement.animate(
                    [
                        { clipPath: 'inset(0 0 0 0)', transform: 'none' },
                        { clipPath: 'inset(0 40% 0 40%)', transform: 'scale(1.2)' },
                        { clipPath: 'inset(0 50% 0 50%)', transform: 'scale(1)' },
                    ],
                    {
                        duration: duration * 1.5,
                        easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                        pseudoElement: "::view-transition-old(root)",
                    }
                )
                break

            // --- IMPLEMENTATION FOR MISSING TYPES ---

            case "swipe-right":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `inset(0 ${viewportWidth}px 0 0)`,
                            `inset(0 0 0 0)`,
                        ],
                    },
                    {
                        duration,
                        easing: "cubic-bezier(0.2, 0, 0, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "swipe-down":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `inset(0 0 ${viewportHeight}px 0)`,
                            `inset(0 0 0 0)`,
                        ],
                    },
                    {
                        duration,
                        easing: "cubic-bezier(0.2, 0, 0, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "wave-ripple":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0% at 50% 50%)`,
                            `circle(${maxRadius}px at 50% 50%)`,
                        ],
                    },
                    {
                        duration: duration * 1.5,
                        easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "none":
            default:
                // No custom animation runs
                break
        }

    }, [isDark, duration, animationType])

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleTheme}
                className={cn(
                    "p-2 rounded-full transition-colors duration-300",
                    isDark ? "hover:text-amber-400" : "hover:text-blue-500",
                    className
                )}
                {...props}
            >
                {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>

            {/* This inline <style> block is necessary to override the default 
                view transition animation for all JS-based effects.
            */}
            {animationType !== 'flip-x-in' && (
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                            ::view-transition-old(root),
                            ::view-transition-new(root) {
                                animation: none;
                                mix-blend-mode: normal;
                            }
                        `,
                    }}
                />
            )}
        </>
    )
}
