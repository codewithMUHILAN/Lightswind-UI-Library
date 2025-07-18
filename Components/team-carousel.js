"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
export const TeamCarousel = ({ members, title = "OUR TEAM", titleSize = "2xl", titleColor = "rgb(8, 42, 123)", background = "#000", cardWidth = 280, cardHeight = 380, cardRadius = 20, showArrows = true, showDots = true, keyboardNavigation = true, touchNavigation = true, animationDuration = 800, autoPlay = 0, pauseOnHover = true, visibleCards = 2, sideCardScale = 0.9, sideCardOpacity = 0.8, grayscaleEffect = true, className, cardClassName, titleClassName, infoPosition = "bottom", infoTextColor = "rgb(8, 42, 123)", infoBackground = "transparent", onMemberChange, onCardClick, initialIndex = 0, }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isAnimating, setIsAnimating] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const updateCarousel = useCallback(function (newIndex) {
        if (isAnimating || members.length === 0)
            return;
        setIsAnimating(true);
        var nextIndex = (newIndex + members.length) % members.length;
        setCurrentIndex(nextIndex);
        onMemberChange?.(members[nextIndex], nextIndex);
        setTimeout(function () {
            setIsAnimating(false);
        }, animationDuration);
    }, [isAnimating, members, animationDuration, onMemberChange]);
    const getCardPosition = function (index) {
        var offset = (index - currentIndex + members.length) % members.length;
        if (offset === 0)
            return 'center';
        if (offset === 1)
            return 'right-1';
        if (offset === 2)
            return 'right-2';
        if (offset === members.length - 1)
            return 'left-1';
        if (offset === members.length - 2)
            return 'left-2';
        return 'hidden';
    };
    const getCardStyles = function (position) {
        var baseTransform = 'translateY(-50%)';
        switch (position) {
            case 'center':
                return {
                    transform: baseTransform + ' scale(1.1) translateZ(0)',
                    zIndex: 10,
                    opacity: 1,
                };
            case 'left-1':
                return {
                    transform: baseTransform + ' translateX(-' + cardWidth * 0.7 + 'px) scale(' + sideCardScale + ') translateZ(-100px)',
                    zIndex: 5,
                    opacity: sideCardOpacity,
                };
            case 'left-2':
                return {
                    transform: baseTransform + ' translateX(-' + cardWidth * 1.4 + 'px) scale(' + sideCardScale * 0.9 + ') translateZ(-300px)',
                    zIndex: 1,
                    opacity: sideCardOpacity * 0.7,
                };
            case 'right-1':
                return {
                    transform: baseTransform + ' translateX(' + cardWidth * 0.7 + 'px) scale(' + sideCardScale + ') translateZ(-100px)',
                    zIndex: 5,
                    opacity: sideCardOpacity,
                };
            case 'right-2':
                return {
                    transform: baseTransform + ' translateX(' + cardWidth * 1.4 + 'px) scale(' + sideCardScale * 0.9 + ') translateZ(-300px)',
                    zIndex: 1,
                    opacity: sideCardOpacity * 0.7,
                };
            default:
                return {
                    transform: baseTransform + ' scale(0.8)',
                    opacity: 0,
                    pointerEvents: 'none',
                };
        }
    };
    // Auto-play functionality
    useEffect(function () {
        if (autoPlay > 0) {
            var interval = setInterval(function () {
                updateCarousel(currentIndex + 1);
            }, autoPlay);
            return function () {
                return clearInterval(interval);
            };
        }
    }, [autoPlay, currentIndex, updateCarousel]);
    // Keyboard navigation
    useEffect(function () {
        if (!keyboardNavigation)
            return;
        var handleKeyDown = function (e) {
            if (e.key === 'ArrowLeft') {
                updateCarousel(currentIndex - 1);
            }
            else if (e.key === 'ArrowRight') {
                updateCarousel(currentIndex + 1);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return function () {
            return document.removeEventListener('keydown', handleKeyDown);
        };
    }, [keyboardNavigation, currentIndex, updateCarousel]);
    // Touch navigation
    var handleTouchStart = function (e) {
        if (!touchNavigation)
            return;
        setTouchStart(e.targetTouches[0].clientX);
    };
    var handleTouchMove = function (e) {
        if (!touchNavigation)
            return;
        setTouchEnd(e.targetTouches[0].clientX);
    };
    var handleTouchEnd = function () {
        if (!touchNavigation)
            return;
        var swipeThreshold = 50;
        var diff = touchStart - touchEnd;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                updateCarousel(currentIndex + 1);
            }
            else {
                updateCarousel(currentIndex - 1);
            }
        }
    };
    var titleSizeClasses = {
        sm: 'text-4xl',
        md: 'text-5xl',
        lg: 'text-6xl',
        xl: 'text-7xl',
        '2xl': 'text-8xl',
    };
    return (_jsxs("div", { className: cn("min-h-screen flex flex-col items-center justify-center overflow-hidden", className), style: { background: background }, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd, children: [title && (_jsx("h1", { className: cn("font-black uppercase tracking-tight absolute top-12 left-1/2 transform -translate-x-1/2 pointer-events-none whitespace-nowrap", titleSizeClasses[titleSize], titleClassName), style: {
                    color: 'transparent', // Keep only one color declaration here
                    background: "linear-gradient(to bottom, " + titleColor + "35 30%, transparent 76%)",
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                }, children: title })), _jsxs("div", { className: "w-full max-w-6xl relative mt-20", style: {
                    height: cardHeight + 100,
                    perspective: '1000px',
                }, children: [showArrows && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: function () {
                                    return updateCarousel(currentIndex - 1);
                                }, className: "absolute left-5 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center z-20 transition-all duration-300 hover:scale-110", children: _jsx(ChevronLeft, { className: "w-6 h-6" }) }), _jsx("button", { onClick: function () {
                                    return updateCarousel(currentIndex + 1);
                                }, className: "absolute right-5 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center z-20 transition-all duration-300 hover:scale-110", children: _jsx(ChevronRight, { className: "w-6 h-6" }) })] })), _jsx("div", { className: "w-full h-full flex justify-center items-center relative", style: { transformStyle: 'preserve-3d' }, children: members.map(function (member, index) {
                            var position = getCardPosition(index);
                            var styles = getCardStyles(position);
                            return (_jsxs("div", { className: cn("absolute bg-white overflow-hidden shadow-2xl cursor-pointer transition-all", cardClassName), style: {
                                    width: cardWidth,
                                    height: cardHeight,
                                    borderRadius: cardRadius,
                                    top: '90%',
                                    left: '50%',
                                    marginLeft: -cardWidth / 2,
                                    marginTop: -cardHeight / 2,
                                    transitionDuration: animationDuration + "ms", // String concatenation
                                    transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                    ...styles,
                                }, onClick: function () {
                                    updateCarousel(index);
                                    onCardClick?.(member, index);
                                }, children: [_jsx("img", { src: member.image, alt: member.name, className: "w-full h-full object-cover transition-all duration-800", style: {
                                            filter: position !== 'center' && grayscaleEffect ? 'grayscale(100%)' : 'none',
                                        } }), infoPosition === 'overlay' && (_jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4 text-center", style: {
                                            background: infoBackground || "linear-gradient(transparent, rgba(0,0,0,0.8))", // String concatenation
                                            color: infoTextColor,
                                        }, children: [_jsx("h3", { className: "text-lg font-bold", children: member.name }), _jsx("p", { className: "text-sm opacity-90", children: member.role })] }))] }, member.id));
                        }) })] }), infoPosition === 'bottom' && members[currentIndex] && (_jsxs("div", { className: "text-center mt-10 transition-all duration-500", children: [_jsxs("h2", { className: "text-4xl font-bold mb-3 relative inline-block", style: { color: infoTextColor }, children: [members[currentIndex].name, _jsx("span", { className: "absolute top-full left-0 w-full h-0.5 mt-2", style: { background: infoTextColor } })] }), _jsx("p", { className: "text-xl font-medium opacity-80 uppercase tracking-wider", style: { color: infoTextColor }, children: members[currentIndex].role }), members[currentIndex].bio && (_jsx("p", { className: "text-base mt-4 max-w-lg mx-auto opacity-70", children: members[currentIndex].bio }))] })), showDots && (_jsx("div", { className: "flex justify-center gap-3 mt-15 ", children: members.map(function (_, index) {
                    return (_jsx("button", { onClick: function () {
                            return updateCarousel(index);
                        }, className: cn("w-3 h-3 rounded-full transition-all duration-300", index === currentIndex
                            ? "scale-125"
                            : "hover:scale-110"), style: {
                            background: index === currentIndex
                                ? infoTextColor
                                : infoTextColor + "40", // String concatenation
                        } }, index));
                }) }))] }));
};
export default TeamCarousel;
