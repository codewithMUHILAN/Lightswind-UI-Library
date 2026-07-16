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
    const targetProgressRef = useRef(50); // For smooth damping
    const isDownRef = useRef(false);
    const startXRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);

    // Array of refs to children elements
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    // Cache for DOM updates to prevent layout thrashing
    const cacheRef = useRef<Record<number, { transform: string, zIndex: string, opacity: string }>>({});

    const numItems = items.length;

    // --- Animation Loop ---
    const update = useCallback(() => {
        if (!itemRefs.current.length) return;

        // Lerp for buttery smoothness
        progressRef.current += (targetProgressRef.current - progressRef.current) * 0.1;

        const progress = progressRef.current;
        const clamped = Math.max(0, Math.min(progress, 100));

        // Continuous index
        const activeFloat = clamped / 100 * (numItems - 1);

        itemRefs.current.forEach((el, index) => {
            if (!el) return;

            const denominator = numItems > 1 ? numItems - 1 : 1;
            const ratio = (index - activeFloat) / denominator; // -1 (leftmost) to 1 (rightmost)

            const tx = ratio * 800;
            const ty = ratio * 200;
            const rot = ratio * 120;

            const dist = Math.abs(index - activeFloat);
            const z = numItems - dist;

            const opacity = (z / numItems) * 3 - 2;

            const newTransform = `translate3d(${tx}%, ${ty}%, 0) rotate(${rot}deg)`;
            const newZIndex = Math.round(z * 10).toString();
            const newOpacity = Math.max(0, Math.min(1, opacity)).toString();

            if (!cacheRef.current[index]) {
                cacheRef.current[index] = { transform: '', zIndex: '', opacity: '' };
            }

            const cache = cacheRef.current[index];

            // Only update DOM if changed (prevents thrashing)
            if (cache.transform !== newTransform) {
                el.style.transform = newTransform;
                cache.transform = newTransform;
            }
            if (cache.zIndex !== newZIndex) {
                el.style.zIndex = newZIndex;
                cache.zIndex = newZIndex;
            }

            const inner = el.querySelector('.slider-item-content') as HTMLElement;
            if (inner && cache.opacity !== newOpacity) {
                inner.style.opacity = newOpacity;
                cache.opacity = newOpacity;
            }
        });
        // Removed rafRef.current = requestAnimationFrame(update); from here
    }, [numItems]);

    // Start loop
    useEffect(() => {
        let active = true;

        const loop = () => {
            if (active) {
                update();
                rafRef.current = requestAnimationFrame(loop);
            }
        };

        // Initialize the loop
        rafRef.current = requestAnimationFrame(loop);

        return () => {
            active = false;
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [update]);

    // --- Interaction Handlers ---
    const handleWheel = useCallback((e: WheelEvent) => {
        const wheelProgress = e.deltaY * speedWheel;
        const current = targetProgressRef.current;
        const next = current + wheelProgress;

        if ((next < 0 && e.deltaY < 0) || (next > 100 && e.deltaY > 0)) {
            return;
        }

        e.preventDefault();
        targetProgressRef.current = Math.max(0, Math.min(100, next));
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
        const current = targetProgressRef.current;
        const next = Math.max(0, Math.min(100, current + diff));

        targetProgressRef.current = next;
        startXRef.current = x;
    }, [speedDrag]);

    const handleMouseUp = useCallback(() => {
        isDownRef.current = false;
    }, []);

    const handleClick = useCallback((item: SliderItemData, index: number) => {
        const denominator = numItems > 1 ? numItems - 1 : 1;
        targetProgressRef.current = (index / denominator) * 100;

        if (onItemClick) onItemClick(item, index);
    }, [numItems, onItemClick]);

    // --- Listeners ---
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const wheelOpts = { passive: false };
        container.addEventListener('wheel', handleWheel, wheelOpts);
        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('touchstart', handleMouseDown, { passive: true });

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleMouseMove, { passive: true });
        window.addEventListener('touchend', handleMouseUp);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('mousedown', handleMouseDown);
            container.removeEventListener('touchstart', handleMouseDown);

            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden bg-black"
            style={containerStyle}
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