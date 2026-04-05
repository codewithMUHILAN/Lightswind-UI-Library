'use client'
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Type Definitions ---
interface Slide {
    id: number;
    src: string;
    href: string;
}

interface ThreeDImageCarouselProps {
    /** The array of image data for the slider. */
    slides: Slide[];
    /** Number of visible items in the slider (3 or 5). Default is 5. */
    itemCount?: 3 | 5;
    /** Enables/Disables automatic sliding. Default is false. */
    autoplay?: boolean;
    /** Delay in seconds for autoplay. Default is 3. */
    delay?: number;
    /** Pauses autoplay when the mouse hovers over the slider. Default is true. */
    pauseOnHover?: boolean;
    /** Tailwind class for the main container (e.g., margins, padding). */
    className?: string;
}

// --- MINIMIZED CSS Styles (Only core 3D positioning and responsiveness remain) ---
const EMBEDDED_CSS = `
/* --- Cascade Slider Styles --- */

.cascade-slider_container {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    z-index: 20; 
    user-select: none;
    -webkit-user-select: none; 
    touch-action: pan-y;
}

.cascade-slider_slides {
    position: relative;
    height: 100%; 
}

.cascade-slider_item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%) scale(0.3); 
    transition: all 1s ease; 
    opacity: 0;
    z-index: 1; 
    cursor: grab; 
}
.cascade-slider_item.now {
    cursor: default;
}
.cascade-slider_item:active {
    cursor: grabbing;
}

/* Slide Positioning Classes (Core 3D Logic - MUST REMAIN IN CSS) */
.cascade-slider_item.next {
    left: 50%;
    transform: translateY(-50%) translateX(-120%) scale(0.6);
    opacity: 1;
    z-index: 4; 
}
.cascade-slider_item.prev {
    left: 50%;
    transform: translateY(-50%) translateX(20%) scale(0.6);
    opacity: 1;
    z-index: 4; 
}
.cascade-slider_item.now {
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%) scale(1);
    opacity: 1;
    z-index: 5; 
}

/* Arrows - Structural CSS remains for positioning/size */
.cascade-slider_arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    cursor: pointer;
    z-index: 6; 
    transform: translate(0, -50%);
    width: 40px; 
    height: 40px; 
    transition: all 0.3s ease;
    /* Tailwind will handle color/bg */
}

/* Arrow Positioning Fix (Responsive CSS) */
@media screen and (max-width: 575px) {
    .cascade-slider_arrow-left { 
        left: 5px; 
    }
    .cascade-slider_arrow-right { 
        right: 5px; 
    }
}
@media screen and (min-width: 576px) {
    .cascade-slider_arrow-left { left: -4%; }
    .cascade-slider_arrow-right { right: -4%; }
}

/* Images */
.cascade-slider_slides img {
    max-width: 150px;
    height: auto; 
    border-radius: 35px;
    display: block;
    transition: filter 1s ease;
}
/* Tailwind handles the grayscale filter on hover if desired, but keeping the state-based one is better */
.cascade-slider_item:not(.now) img {
    filter: grayscale(0.95);
}

/* --- Media Queries (Minimized to only include structural layout changes) --- */
@media screen and (min-width: 414px) {
    .cascade-slider_container { height: 40vh; }
    .cascade-slider_slides img { max-width: 200px; }
}
@media screen and (min-width: 576px) {
    .cascade-slider_container { height: 60vh; }
    .cascade-slider_slides img { max-width: 270px; }
}
@media screen and (min-width: 768px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-125%) scale(0.6); }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(25%) scale(0.6); }
    .cascade-slider_slides img { max-width: 250px; }
}
@media screen and (min-width: 991px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-115%) scale(0.55); z-index: 4; }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(15%) scale(0.55); z-index: 4; }
    .cascade-slider_item.next2 { transform: translateY(-50%) translateX(-150%) scale(0.37); z-index: 1; }
    .cascade-slider_item.prev2 { transform: translateY(-50%) translateX(50%) scale(0.37); z-index: 2; }
    .cascade-slider_slides img { max-width: 300px; }
    .cascade-slider_container { height: 37vh; }
}
@media screen and (min-width: 1100px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-130%) scale(0.55); }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(30%) scale(0.55); }
    .cascade-slider_item.next2 { transform: translateY(-50%) translateX(-180%) scale(0.37); }
    .cascade-slider_item.prev2 { transform: translateY(-50%) translateX(80%) scale(0.37); }
    .cascade-slider_slides img { max-width: 350px; }
}
`;


// --- Helper Function: Get Slide Classes ---
const getSlideClasses = (index: number, activeIndex: number, total: number, visibleCount: 3 | 5): string => {
    const diff = index - activeIndex;
    if (diff === 0) return 'now';
    if (diff === 1 || diff === -total + 1) return 'next';
    if (visibleCount === 5 && (diff === 2 || diff === -total + 2)) return 'next2';
    if (diff === -1 || diff === total - 1) return 'prev';
    if (visibleCount === 5 && (diff === -2 || diff === total - 2)) return 'prev2';
    return '';
};


// --- ThreeDImageCarousel Component Logic ---
export const ThreeDImageCarousel: React.FC<ThreeDImageCarouselProps> = ({
    slides,
    itemCount = 5,
    autoplay = false,
    delay = 3,
    pauseOnHover = true,
    className = '',
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const autoplayIntervalRef = useRef<number | null>(null);
    const total = slides.length;

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const swipeThreshold = 50;

    const navigate = useCallback((direction: 'next' | 'prev') => {
        setActiveIndex(current => {
            if (direction === 'next') {
                return (current + 1) % total;
            } else {
                return (current - 1 + total) % total;
            }
        });
    }, [total]);

    const startAutoplay = useCallback(() => {
        if (autoplay && total > 1) {
            if (autoplayIntervalRef.current) {
                clearInterval(autoplayIntervalRef.current);
            }
            autoplayIntervalRef.current = window.setInterval(() => {
                navigate('next');
            }, delay * 1000);
        }
    }, [autoplay, delay, navigate, total]);

    const stopAutoplay = useCallback(() => {
        if (autoplayIntervalRef.current) {
            clearInterval(autoplayIntervalRef.current);
            autoplayIntervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        startAutoplay();
        return () => { stopAutoplay(); };
    }, [startAutoplay, stopAutoplay]);

    // Handler to stop autoplay on hover
    const handleMouseEnter = () => {
        if (autoplay && pauseOnHover) {
            stopAutoplay();
        }
    };

    // Handler to start autoplay on mouse exit AND handle drag cancellation
    const handleExit = (e: React.MouseEvent) => {
        // 1. Autoplay resume logic
        if (autoplay && pauseOnHover) {
            startAutoplay();
        }

        // 2. Drag cancellation logic (Equivalent to the removed onMouseLeaveDrag)
        if (isDragging) {
            handleEnd(e.clientX);
        }
    };

    // --- Touch/Mouse Drag Logic ---
    const handleStart = (clientX: number) => {
        setIsDragging(true);
        setStartX(clientX);
        stopAutoplay();
    };

    const handleEnd = (clientX: number) => {
        if (!isDragging) return;

        const distance = clientX - startX;

        if (Math.abs(distance) > swipeThreshold) {
            if (distance < 0) {
                navigate('next'); // Swipe left (negative distance) -> show next slide
            } else {
                navigate('prev'); // Swipe right (positive distance) -> show previous slide
            }
        }

        setIsDragging(false);
        setStartX(0);
        // Autoplay is resumed by the useEffect on state change or by handleExit/onMouseUp
    };

    const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
    const onMouseUp = (e: React.MouseEvent) => {
        handleEnd(e.clientX);
        startAutoplay(); // Resume autoplay when mouse button is released
    };

    const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
    const onTouchEnd = (e: React.TouchEvent) => {
        handleEnd(e.changedTouches[0].clientX);
        startAutoplay(); // Resume autoplay after touch interaction
    };

    return (
        <>
            {/* 1. EMBEDDED CSS with mobile arrow fix and minimal styling */}
            <style dangerouslySetInnerHTML={{ __html: EMBEDDED_CSS }} />

            {/* 2. SLIDER HTML STRUCTURE */}
            <div
                className={`cascade-slider_container ${className} bg-transparent 
                min-w-[600px]`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleExit}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <div className="cascade-slider_slides">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`cascade-slider_item ${getSlideClasses(index, activeIndex, total, itemCount)}`}
                            data-slide-number={index}
                        >
                            <a href={slide.href}>
                                <img src={slide.src} alt={`Slide ${index + 1}`}
                                    // Fallback for image loading
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = `https://placehold.co/350x200/4F46E5/ffffff?text=Slide%20${index + 1}`;
                                    }}
                                />
                            </a>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows (Fully Tailwind-styled) */}
                {total > 1 && (
                    <>
                        <span
                            className="cascade-slider_arrow cascade-slider_arrow-left rounded-full bg-black/30 text-white p-2 hover:bg-black/60 transition-colors duration-300"
                            onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
                            data-action="prev"
                        >
                            <ArrowLeftCircle size={30} />
                        </span>
                        <span
                            className="cascade-slider_arrow cascade-slider_arrow-right rounded-full bg-black/30 text-white p-2 hover:bg-black/60 transition-colors duration-300"
                            onClick={(e) => { e.stopPropagation(); navigate('next'); }}
                            data-action="next"
                        >
                            <ArrowRightCircle size={30} />
                        </span>
                    </>
                )}
            </div>
        </>
    );
};

export default ThreeDImageCarousel;