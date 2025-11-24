import React, { useState, useEffect, useCallback, useRef, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Type Definitions ---

/**
 * @interface SliderItemData
 * Defines the structure for each item in the slider.
 */
export interface SliderItemData { 
    /** The main title to display on the slider item. */
    title: string;
    /** The numeric label (e.g., '01', '02'). */
    num: string;
    /** The URL for the image content. */
    imageUrl: string;
    /** Optional: Additional data for the onClick handler. */
    data?: any;
}

/**
 * @interface ThreeDSliderProps
 * Defines the public interface for the reusable 3D Slider component.
 */
interface ThreeDSliderProps {
    /** The array of data objects to populate the slider items. */
    items: SliderItemData[];
    /** Speed factor for mouse wheel scrolling (e.g., 0.02). */
    speedWheel?: number;
    /** Speed factor for mouse/touch dragging (e.g., -0.1). */
    speedDrag?: number;
    /** Custom styles for the main slider container. */
    containerStyle?: CSSProperties;
    /** Optional handler for when a slider item is clicked. */
    onItemClick?: (item: SliderItemData, index: number) => void;
}

// --- Utility Functions ---

/**
 * Calculates a z-index for each item to create the 3D stacking effect.
 * The active item gets the highest zIndex, and items further away have lower zIndex.
 */
const getZindex = (length: number, activeIndex: number): number[] => {
    return Array.from({ length }).map((_, i) =>
        (activeIndex === i) ? length : length - Math.abs(activeIndex - i)
    );
};

// --- Sub-Component: SliderItem ---

interface SliderItemProps {
    item: SliderItemData;
    index: number;
    length: number;
    active: number;
    zIndex: number;
    onClick: () => void;
}

/**
 * Renders a single slider item with Framer Motion for 3D transform animations.
 */
const SliderItem: React.FC<SliderItemProps> = ({ item, index, length, active, zIndex, onClick }) => {
    // 1. Calculate the 'activeRatio' (0 for active, near 1 or -1 for furthest)
    const denominator = length > 1 ? length - 1 : 1; 
    const activeRatio = (index - active) / denominator;

    // 2. Calculate the core 3D transform properties based on the original logic
    const x = activeRatio * 800;    // translateX percentage
    const y = activeRatio * 200;    // translateY percentage
    const rotate = activeRatio * 120; // rotation in degrees
    
    // 3. Calculate opacity based on zIndex for the fade effect
    const opacity = (zIndex / length) * 3 - 2;

    // Define the Framer Motion 'style' object for animation
    const motionStyle = {
        // The core 3D transformation
        x: `${x}%`, // 'x' property in Framer Motion handles translateX
        y: `${y}%`, // 'y' property in Framer Motion handles translateY
        rotate: `${rotate}deg`,
        
        // Z-Index for stacking order
        zIndex: zIndex,
    };
    
    return (
        <motion.div
            className={`
                absolute top-1/2 left-1/2 cursor-pointer select-none rounded-xl 
                shadow-2xl bg-black transform-origin-[0%_100%] pointer-events-auto
                w-[var(--width)] h-[var(--height)]
                -mt-[calc(var(--height)/2)] -ml-[calc(var(--width)/2)]
                overflow-hidden
            `}
            // Set dynamic CSS variables for width/height (mimicking the original clamp function)
            style={{ 
                '--width': 'clamp(150px, 30vw, 300px)',
                '--height': 'clamp(200px, 40vw, 400px)',
            } as CSSProperties & { [key: string]: any }}
            
            // Framer Motion animation properties
            initial={false}
            animate={motionStyle}
            transition={{
                duration: 0.8,
                ease: [0, 0.02, 0, 1], // The original cubic-bezier transition
            }}
            onClick={onClick}
        >
            <div 
                className="absolute inset-0 z-10 transition-opacity duration-800 ease-[cubic-bezier(0,0.02,0,1)] font-['Orelo-sw-db']"
                // Apply the calculated opacity to the inner box for content visibility control
                style={{ opacity: opacity }}
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
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover pointer-events-none" />
            </div>
        </motion.div>
    );
};

// --- Main Component: ThreeDSlider ---

const ThreeDSlider: React.FC<ThreeDSliderProps> = ({
    items,
    speedWheel = 0.02,
    speedDrag = -0.1,
    containerStyle = {},
    onItemClick,
}) => {
    const [progress, setProgress] = useState(50);
    const [isDown, setIsDown] = useState(false);
    const startXRef = useRef(0);
    // sliderRef REMOVED (No longer needed as listeners are global on document)
    
    const numItems = items.length;
    // Clamping progress ensures the active index stays within bounds
    const clampedProgress = Math.max(0, Math.min(progress, 100));
    const active = Math.floor(clampedProgress / 100 * (numItems - 1));
    const zIndices = getZindex(numItems, active);

    // --- Handlers using useCallback ---

    const handleWheel = useCallback((e: WheelEvent) => {
        const wheelProgress = e.deltaY * speedWheel;
        setProgress(p => p + wheelProgress);
    }, [speedWheel]);

    /** Safely extracts clientX from MouseEvent or TouchEvent */
    const getClientX = (e: MouseEvent | TouchEvent): number | null => {
        if ('touches' in e && e.touches.length > 0) {
            return e.touches[0].clientX;
        } else if ('clientX' in e) {
            return e.clientX;
        }
        return null;
    };

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDown) return;

        const clientX = getClientX(e);
        if (clientX === null) return; 

        const mouseProgress = (clientX - startXRef.current) * speedDrag;
        setProgress(p => p + mouseProgress);
        startXRef.current = clientX;
    }, [isDown, speedDrag]);

    const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
        setIsDown(true);
        const clientX = getClientX(e);
        if (clientX !== null) {
            startXRef.current = clientX;
        }
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDown(false);
    }, []);

    const handleItemClick = useCallback((item: SliderItemData, index: number) => {
        // Scroll to the clicked item
        const denominator = numItems > 1 ? numItems - 1 : 1;
        const newProgress = (index / denominator) * 100;
        setProgress(newProgress);

        // Execute the user-provided handler
        if (onItemClick) {
            onItemClick(item, index);
        }
    }, [numItems, onItemClick]);

    // --- Effects for Global Event Listeners ---

    useEffect(() => {
        // Attach all interaction listeners globally to 'document'
        document.addEventListener('wheel', handleWheel);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchstart', handleMouseDown);
        document.addEventListener('touchmove', handleMouseMove);
        document.addEventListener('touchend', handleMouseUp);

        // Cleanup function: remove listeners on unmount
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
        >
            <div 
                className="relative z-10 h-[80vh] overflow-hidden pointer-events-none scale-[0.75] w-full" 
                // Removed the unused 'ref={sliderRef}' property here
            >
                <AnimatePresence>
                    {items.map((item, index) => (
                        <SliderItem
                            key={index}
                            item={item}
                            index={index}
                            length={numItems}
                            active={active}
                            zIndex={zIndices[index]}
                            onClick={() => handleItemClick(item, index)}
                        />
                    ))}
                </AnimatePresence>
            </div>
            
            {/* Static layout text refactored with Tailwind CSS */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Vertical Line from original layout:before */}
                <div className="absolute top-0 left-[90px] w-[10px] h-full border border-y-0 border-white/15"></div>
                
                {/* Box text from original layout .box */}
                <div 
                    className="absolute bottom-0 left-[30px] text-white/40 rotate-[-90deg] 
                                transform-origin-[0%_10%] text-[9px] uppercase leading-relaxed"
                >
                    Code With Muhilan
                </div>
            </div>
        </div>
    );
};

export default ThreeDSlider;
