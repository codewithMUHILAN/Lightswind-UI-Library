import React, { useState, useEffect, useCallback, useRef, CSSProperties } from 'react';

// --- Type Definitions ---

export interface SliderItemData {
    title: string;
    num: string;
    imageUrl: string;
    data?: any;
}

interface ThreeDSliderProps {
    items: SliderItemData[];
    speedWheel?: number;
    speedDrag?: number;
    containerStyle?: CSSProperties;
    onItemClick?: (item: SliderItemData, index: number) => void;
}

// --- Sub-Component: SliderItem (Pure DOM, no Motion overhead) ---

interface SliderItemProps {
    item: SliderItemData;
    index: number;
    onClick: () => void;
}

// We use forwardRef to expose the DOM element to the parent for direct manipulation
const SliderItem = React.forwardRef<HTMLDivElement, SliderItemProps>(({ item, onClick }, ref) => {
    return (
        <div
            ref={ref}
            className="absolute top-1/2 left-1/2 cursor-pointer select-none rounded-xl 
                shadow-2xl bg-black transform-origin-[0%_100%] pointer-events-auto
                w-[var(--width)] h-[var(--height)]
                -mt-[calc(var(--height)/2)] -ml-[calc(var(--width)/2)]
                overflow-hidden will-change-transform"
            style={{
                '--width': 'clamp(150px, 30vw, 300px)',
                '--height': 'clamp(200px, 40vw, 400px)',
                transition: 'none', // Critical: handle animation purely via JS
                display: 'block', // Ensure initial visibility
            } as CSSProperties & { [key: string]: any }}
            onClick={onClick}
        >
            <div
                className="slider-item-content absolute inset-0 z-10 transition-opacity duration-300 ease-out will-change-opacity"
                style={{ opacity: 1 }} // Initial opacity
            >
                {/* Overlay for gradient effect */}
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent via-50% to-black/50"></div>

                {/* Title */}
                <div className="absolute z-10 text-white bottom-5 left-5 text-[clamp(20px,3vw,30px)] drop-shadow-md">
                    {item.title}
                </div>

                {/* Number */}
                <div className="absolute z-10 text-white top-2.5 left-5 text-[clamp(20px,10vw,80px)]">
                    {item.num}
                </div>

                {/* Image */}
                <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                    decoding="async"
                />
            </div>
        </div>
    );
});

SliderItem.displayName = 'SliderItem';

// --- Main Component: ThreeDSlider ---

const ThreeDSlider: React.FC<ThreeDSliderProps> = ({
    items,
    speedWheel = 0.05,
    speedDrag = -0.15,
    containerStyle = {},
    onItemClick,
}) => {
    // Refs for state that updates 60fps without re-renders
    const progressRef = useRef(50);
    const targetProgressRef = useRef(50); // For smooth damping (optional, or direct mapping)
    const isDownRef = useRef(false);
    const startXRef = useRef(0);
    const isHoveringRef = useRef(false); // Ref for immediate access in loop
    const rafRef = useRef<number | null>(null);

    // Array of refs to children elements
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const numItems = items.length;

    // React state only for mounting/initialization if needed
    // We strictly avoid setState during scroll 

    // --- Animation Loop ---
    const update = useCallback(() => {
        if (!itemRefs.current.length) return;

        const progress = progressRef.current;
        const clamped = Math.max(0, Math.min(progress, 100));

        // Continuous index
        const activeFloat = clamped / 100 * (numItems - 1);

        itemRefs.current.forEach((el, index) => {
            if (!el) return;

            // Calculate relationship to active item
            const denominator = numItems > 1 ? numItems - 1 : 1;
            // activeRatio: how far this item is from the Active cursor
            // range: e.g. -2, -1, 0 (active), 1, 2...
            const activeRatio = (index - activeFloat);

            // Core 3D Transform Math
            // We can tune these multipliers for the visual stack
            const x = activeRatio * 120;     // Spacing: 120% width difference? No, looks like 800 previously
            const y = activeRatio * 20;      // Vertical cascade
            const rotate = activeRatio * 15; // Rotation cascade

            // Original logic:
            // x = activeRatio * 800 (percentage?) 
            // In the ref implementation, let's use percent for consistency with original or px?
            // Original: x = activeRatio * 800 + '%'
            // activeRatio in original was (index - active) / (length - 1) which is normalized -1 to 1?
            // Actually: activeRatio = (index - active) / denominator.
            // Wait, previous code: (index - active) / denominator
            // If active is 0 and index is 5 (length 6), ratio is 5/5 = 1.

            const normalizedRatio = activeRatio / denominator; // This is almost 0 for active, small for neighbors
            // Let's stick to the previous feeling but optimized.

            // Re-evaluating the visual math from previous code:
            // const activeRatio = (index - active) / denominator;
            // const x = activeRatio * 800; // %
            // const y = activeRatio * 200; // %
            // const rotate = activeRatio * 120; // deg

            // Let's use exactly that math for visual fidelity
            // NOTE: activeFloat is the actual index (0..n), so we don't need to divide by denominator again if we want to match 'active' from before
            // Previous 'active' was integer index. Here activeFloat is float index.
            // Ratio calculation:
            const ratio = (index - activeFloat) / denominator; // -1 (leftmost) to 1 (rightmost)

            const tx = ratio * 800;
            const ty = ratio * 200;
            const rot = ratio * 120;

            const zIndex = Math.round(numItems - Math.abs(index - activeFloat));
            // Or use the discrete distance for cleaner z-sorting
            // const zIndex = numItems - Math.abs(index - Math.round(activeFloat));

            // discrete z-index for stacking order
            // We need a stable z-index.
            const dist = Math.abs(index - activeFloat);
            const z = numItems - dist; // continuous z? CSS z-index needs int

            // Opacity
            const opacity = (z / numItems) * 3 - 2; // fade out distant items

            // Optimize: simple matrix3d or individual properties
            // Individual is often faster for browser composition layers
            el.style.transform = `translate3d(${tx}%, ${ty}%, 0) rotate(${rot}deg)`;
            el.style.zIndex = Math.round(z * 10).toString(); // Higher precision z-index logic if allowed, or just round

            // Inner content opacity
            const inner = el.querySelector('.slider-item-content') as HTMLElement;
            if (inner) {
                inner.style.opacity = Math.max(0, Math.min(1, opacity)).toString();
            }
        });

        rafRef.current = requestAnimationFrame(update);
    }, [numItems]);

    // Start loop
    useEffect(() => {
        rafRef.current = requestAnimationFrame(update);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [update]);


    // --- Interaction Handlers ---

    const handleWheel = useCallback((e: WheelEvent) => {
        if (!isHoveringRef.current) return;

        const wheelProgress = e.deltaY * speedWheel;
        const current = progressRef.current;
        const next = current + wheelProgress;

        // Check boundaries
        if ((next < 0 && e.deltaY < 0) || (next > 100 && e.deltaY > 0)) {
            // Let page scroll
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        progressRef.current = Math.max(0, Math.min(100, next));
        // No setState here! The loop picks it up.
    }, [speedWheel]);

    const getClientX = (e: MouseEvent | TouchEvent) => {
        if ('touches' in e) return e.touches[0].clientX;
        return (e as MouseEvent).clientX;
    };

    const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
        isDownRef.current = true;
        const x = getClientX(e);
        if (x !== undefined) startXRef.current = x;
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDownRef.current) return;

        const x = getClientX(e);
        if (x === undefined) return;

        const diff = (x - startXRef.current) * speedDrag;
        const current = progressRef.current;
        const next = Math.max(0, Math.min(100, current + diff));

        progressRef.current = next;
        startXRef.current = x;
    }, [speedDrag]);

    const handleMouseUp = useCallback(() => {
        isDownRef.current = false;
    }, []);

    const handleClick = useCallback((item: SliderItemData, index: number) => {
        // Smooth scroll to this item?
        // For performance, snap or simple lerp logic could be added to the loop
        // For now, instant snap to keep it simple and responsive
        const denominator = numItems > 1 ? numItems - 1 : 1;
        progressRef.current = (index / denominator) * 100;

        if (onItemClick) onItemClick(item, index);
    }, [numItems, onItemClick]);


    // --- Global Listeners ---
    useEffect(() => {
        const wheelOpts = { passive: false };
        document.addEventListener('wheel', handleWheel, wheelOpts);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchstart', handleMouseDown, { passive: true });
        document.addEventListener('touchmove', handleMouseMove, { passive: true });
        document.addEventListener('touchend', handleMouseUp);

        return () => {
            document.removeEventListener('wheel', handleWheel);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchstart', handleMouseDown);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-black"
            style={containerStyle}
            onMouseEnter={() => isHoveringRef.current = true}
            onMouseLeave={() => isHoveringRef.current = false}
        >
            <div className="relative z-10 h-[80vh] overflow-hidden pointer-events-none scale-[0.75] w-full">
                {items.map((item, index) => (
                    <SliderItem
                        key={`slider-item-${index}`}
                        ref={(el) => { itemRefs.current[index] = el; }}
                        item={item}
                        index={index}
                        onClick={() => handleClick(item, index)}
                    />
                ))}
            </div>
            {/* Static layout text */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-[90px] w-[10px] h-full border border-y-0 border-white/15"></div>
                <div className="absolute bottom-0 left-[30px] text-white/40 rotate-[-90deg] transform-origin-[0%_10%] text-[9px] uppercase leading-relaxed">
                    Code With Muhilan
                </div>
            </div>
        </div>
    );
};

export default ThreeDSlider;