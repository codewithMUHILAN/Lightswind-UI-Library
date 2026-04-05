import React, { useEffect, useRef } from 'react';

// Define the component's props for flexibility and professionalism
interface FallBeamBackgroundProps {
    /**
     * Optional Tailwind CSS class name to apply to the main container.
     * Useful for layout adjustments or margins.
     */
    className?: string;
    /**
     * Number of lines (beams) to render. Default is 20.
     */
    lineCount?: number;
    /**
     * Text to display over the beam effect.
     */
    displayText?: string;
    /**
     * Tailwind color class for the glowing beam trail.
     * E.g., 'blue-400', 'green-400', 'red-400'. Default is 'cyan-400'.
     */
    beamColorClass?: string;
}

/**
 * A lightweight, theme-aware falling beam background component.
 * It dynamically creates vertical beam lines via JavaScript/React and applies CSS animations.
 *
 * NOTE: Ensure the parent container has a defined height/width and `position: relative`
 * for the background to cover it correctly.
 */
const FallBeamBackground: React.FC<FallBeamBackgroundProps> = ({
    className = '',
    lineCount = 20,
    displayText,
    // Note: Changed default to 'cyan-400' as per original comment suggestion
    beamColorClass = 'cyan-400', 
}) => {
    // 💡 FIX: Corrected the type from HTMLDivDivElement to HTMLDivElement
    const containerRef = useRef<HTMLDivElement>(null);

    // --- CSS Styles for the effect ---
    const dynamicStyles = `
    .fall-beam-line {
      position: absolute;
      width: 1px;
      /* Background for the line itself (dim white) */
      height: 100%; /* Cover the full height of the container */
      z-index: 10;
    }

    .fall-beam-line::after {
      content: "";
      position: absolute;
      left: 0;
      width: 100%;
      height: 80px;
      /* Dynamic beam glow color gradient */
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        var(--beam-glow-color)
      );
      animation: fall var(--ani-duration) var(--ani-delay) linear infinite;
    }

    @keyframes fall {
      0% { top: -100px; }
      100% { top: 100%; }
    }
    `;

    // Map Tailwind color to an RGB or RGBA value for the CSS variable
    // This function might need expansion for broader color support.
    const getColorValue = (colorClass: string): string => {
        switch (colorClass) {
            case 'green-400': return 'rgba(74, 222, 128, 0.8)'; // green-400
            case 'cyan-400': return 'rgba(34, 211, 238, 0.8)';  // cyan-400
            case 'blue-400': return 'rgba(96, 165, 250, 0.8)';  // blue-400
            case 'red-400': return 'rgba(248, 113, 113, 0.8)';  // red-400
            case 'indigo-400': return 'rgba(129, 140, 248, 0.8)'; // indigo-400
            default: return 'rgba(34, 211, 238, 0.8)'; // Default to cyan
        }
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Clear any previous lines before rendering new ones (important for re-renders)
        container.querySelectorAll('.fall-beam-line').forEach(line => line.remove());

        const glowColor = getColorValue(beamColorClass);

        for (let i = 1; i <= lineCount; i++) {
            const line = document.createElement("div");
            line.classList.add("fall-beam-line");

            // Calculate the 'left' position with a slight random jitter
            const leftPosition = `${i * (100 / lineCount) + Math.random() * 5 - 5}%`;

            // Random animation duration and delay for a natural look
            const duration = 8 + Math.random() * 10 + "s";
            const delay = -Math.random() * 10 + "s";

            // Apply CSS variables for the animation and color
            line.style.setProperty("left", leftPosition);
            line.style.setProperty("--ani-duration", duration);
            line.style.setProperty("--ani-delay", delay);
            line.style.setProperty("--beam-glow-color", glowColor);

            container.appendChild(line);
        }

        // Cleanup function to remove elements when component unmounts
        return () => {
            container.querySelectorAll('.fall-beam-line').forEach(line => line.remove());
        };
    }, [lineCount, beamColorClass]); // Re-run effect if these props change

    return (
        <>
            {/* Apply dynamic styles once */}
            <style>{dynamicStyles}</style>

            {/* Main container: 
            - absolute inset-0 covers the parent fully.
            - bg-transparent allows parent background to show through.
            */}
            <div
                ref={containerRef}
                className={`absolute inset-0 z-0 overflow-hidden bg-transparent ${className}`}
            >
                {displayText && (
                    // Text overlay
                    <h1 className="relative z-20 grid place-content-center h-full font-sans text-4xl sm:text-5xl lg:text-7xl font-bold text-white p-4 text-center">
                        {displayText}
                        {/* Gradient to fade the text bottom into the background */}
                        <div className="absolute inset-0 z-30 pointer-events-none" style={{
                            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.95) 100%)'
                        }} />
                    </h1>
                )}

                {/* The lines are rendered dynamically in the useEffect hook */}
            </div>
        </>
    );
};

export default FallBeamBackground;