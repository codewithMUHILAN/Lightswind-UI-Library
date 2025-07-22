import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import { cn } from '../lib/utils';
const ThreeDHoverGallery = ({ images = [
    'https://images.pexels.com/photos/26797335/pexels-photo-26797335/free-photo-of-scenic-view-of-mountains.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/12194487/pexels-photo-12194487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/32423809/pexels-photo-32423809/free-photo-of-aerial-view-of-kayaking-at-robberg-south-africa.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/32296519/pexels-photo-32296519/free-photo-of-rocky-coastline-of-cape-point-with-turquoise-waters.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/32396739/pexels-photo-32396739/free-photo-of-serene-motorcycle-ride-through-bamboo-grove.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/32304900/pexels-photo-32304900/free-photo-of-scenic-view-of-cape-town-s-twelve-apostles.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/32437034/pexels-photo-32437034/free-photo-of-fisherman-holding-freshly-caught-red-drum-fish.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/32469847/pexels-photo-32469847/free-photo-of-deer-drinking-from-natural-water-source-in-wilderness.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
], itemWidth = 3, itemHeight = 12, gap = 0.4, perspective = 35, hoverScale = 10, transitionDuration = 1.25, backgroundColor, grayscaleStrength = 1, brightnessLevel = 0.5, activeWidth = 28, rotationAngle = 35, zDepth = 8.5, enableKeyboardNavigation = true, autoPlay = false, autoPlayDelay = 3000, className, style, onImageClick, onImageHover, onImageFocus }) => {
    const containerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const autoPlayRef = useRef(null);
    useEffect(() => {
        if (autoPlay && images.length > 0) {
            autoPlayRef.current = setInterval(() => {
                setActiveIndex(prev => {
                    const nextIndex = prev === null ? 0 : (prev + 1) % images.length;
                    return nextIndex;
                });
            }, autoPlayDelay);
            return () => {
                if (autoPlayRef.current) {
                    clearInterval(autoPlayRef.current);
                }
            };
        }
    }, [autoPlay, autoPlayDelay, images.length]);
    const handleImageClick = (index, image) => {
        setActiveIndex(activeIndex === index ? null : index);
        onImageClick?.(index, image);
    };
    const handleImageHover = (index, image) => {
        if (!autoPlay) {
            setActiveIndex(index);
        }
        onImageHover?.(index, image);
    };
    const handleImageLeave = () => {
        if (!autoPlay) {
            setActiveIndex(null);
        }
    };
    const handleImageFocus = (index, image) => {
        setFocusedIndex(index);
        onImageFocus?.(index, image);
    };
    const handleKeyDown = (event, index) => {
        if (!enableKeyboardNavigation)
            return;
        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                handleImageClick(index, images[index]);
                break;
            case 'ArrowLeft':
                event.preventDefault();
                const prevIndex = index > 0 ? index - 1 : images.length - 1;
                containerRef.current?.children[prevIndex]?.focus();
                break;
            case 'ArrowRight':
                event.preventDefault();
                const nextIndex = index < images.length - 1 ? index + 1 : 0;
                containerRef.current?.children[nextIndex]?.focus();
                break;
        }
    };
    const getItemStyle = (index) => {
        const isActive = activeIndex === index;
        const isFocused = focusedIndex === index;
        return {
            width: isActive ? `${activeWidth}vw` : `calc(${itemWidth}vw + ${itemWidth}vh)`,
            height: `calc(${itemHeight}vw + ${itemHeight}vh)`,
            backgroundImage: `url(${images[index]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#222',
            cursor: 'pointer',
            filter: isActive || isFocused ? 'inherit' : `grayscale(${grayscaleStrength}) brightness(${brightnessLevel})`,
            transform: isActive ? `translateZ(calc(${hoverScale}vw + ${hoverScale}vh))` : 'none',
            transition: `transform ${transitionDuration}s cubic-bezier(.1, .7, 0, 1), filter 3s cubic-bezier(.1, .7, 0, 1), width ${transitionDuration}s cubic-bezier(.1, .7, 0, 1)`,
            willChange: 'transform, filter, width',
            zIndex: isActive ? 100 : 'auto',
            margin: isActive ? '0 0.45vw' : '0',
            outline: isFocused ? '2px solid #3b82f6' : 'none',
            outlineOffset: '2px'
        };
    };
    return (_jsx("div", { className: cn("flex items-center justify-center min-h-screen w-full", className), style: { backgroundColor, ...style }, children: _jsx("div", { ref: containerRef, className: "flex gap-2 md:gap-4", style: {
                perspective: `calc(${perspective}vw + ${perspective}vh)`,
                gap: `${gap}rem`
            }, children: images.map((image, index) => (_jsx("div", { className: "relative will-change-transform", style: getItemStyle(index), tabIndex: enableKeyboardNavigation ? 0 : -1, onClick: () => handleImageClick(index, image), onMouseEnter: () => handleImageHover(index, image), onMouseLeave: handleImageLeave, onFocus: () => handleImageFocus(index, image), onBlur: () => setFocusedIndex(null), onKeyDown: (e) => handleKeyDown(e, index), role: "button", "aria-label": `Image ${index + 1} of ${images.length}`, "aria-pressed": activeIndex === index }, index))) }) }));
};
export default ThreeDHoverGallery;
