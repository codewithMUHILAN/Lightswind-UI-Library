"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "../lib/utils";
import { ChevronLeft, ChevronRight, Palette } from "lucide-react";
const Carousel3D = ({ cards = [], cardWidth = 300, cardHeight = 360, radius = 400, autoRotate = false, autoRotateInterval = 3000, pauseOnHover = true, enableGlitchEffect = true, enableGlowEffect = true, showControls = true, showThemeToggle = false, dragSensitivity = 0.2, transitionDuration = 0.5, className, onCardClick, onCardFlip, onRotate, }) => {
    const carouselRef = useRef(null);
    const containerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [theta, setTheta] = useState(0);
    const [flippedCards, setFlippedCards] = useState(new Set());
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [initialTheta, setInitialTheta] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const didDragRef = useRef(false);
    const autoRotateRef = useRef();
    const totalCards = cards.length;
    const anglePerCard = totalCards > 0 ? 360 / totalCards : 0;
    const responsiveRadius = typeof window !== "undefined" && window.innerWidth <= 768
        ? Math.min(radius * 0.7, 300)
        : radius;
    const responsiveCardWidth = typeof window !== "undefined" && window.innerWidth <= 768
        ? Math.min(cardWidth * 0.8, 250)
        : cardWidth;
    const responsiveCardHeight = typeof window !== "undefined" && window.innerWidth <= 768
        ? Math.min(cardHeight * 0.8, 350)
        : cardHeight;
    // Arrange cards in 3D circle
    const arrangeCards = useCallback(() => {
        if (!carouselRef.current)
            return;
        const cardElements = carouselRef.current.querySelectorAll(".carousel-card");
        cardElements.forEach((card, index) => {
            const cardAngle = anglePerCard * index;
            const element = card;
            element.style.transform = `rotateY(${cardAngle}deg) translateZ(${responsiveRadius}px)`;
            element.dataset.index = index.toString();
        });
    }, [anglePerCard, responsiveRadius]);
    // Rotate carousel
    const rotateCarousel = useCallback((instant = false) => {
        if (!carouselRef.current)
            return;
        if (instant) {
            carouselRef.current.style.transition = "none";
        }
        else {
            carouselRef.current.style.transition = `transform ${transitionDuration}s ease`;
        }
        carouselRef.current.style.transform = `rotateY(${theta}deg)`;
        // Calculate current index based on rotation
        let normalizedTheta = ((theta % 360) + 360) % 360;
        let closestAngleDiff = Infinity;
        let newCurrentIndex = 0;
        for (let index = 0; index < totalCards; index++) {
            const cardInitialAngle = anglePerCard * index;
            let effectiveCardAngle = (cardInitialAngle - normalizedTheta + 360) % 360;
            let diff = Math.abs(effectiveCardAngle - 0);
            if (diff > 180) {
                diff = 360 - diff;
            }
            if (diff < closestAngleDiff) {
                closestAngleDiff = diff;
                newCurrentIndex = index;
            }
        }
        if (newCurrentIndex !== currentIndex) {
            setCurrentIndex(newCurrentIndex);
            onRotate?.(newCurrentIndex);
        }
        if (instant) {
            setTimeout(() => {
                if (carouselRef.current) {
                    carouselRef.current.style.transition = `transform ${transitionDuration}s ease`;
                }
            }, 10);
        }
    }, [
        theta,
        anglePerCard,
        totalCards,
        currentIndex,
        transitionDuration,
        onRotate,
    ]);
    // Navigation
    const navigateCarousel = useCallback((direction) => {
        setTheta((prevTheta) => prevTheta + direction * anglePerCard);
    }, [anglePerCard]);
    // Card flip handler
    const handleCardClick = useCallback((index) => {
        if (didDragRef.current) {
            didDragRef.current = false;
            return;
        }
        const card = cards[index];
        if (!card)
            return;
        onCardClick?.(card, index);
        if (index === currentIndex) {
            setFlippedCards((prev) => {
                const newSet = new Set(prev);
                const isFlipped = !prev.has(index);
                if (isFlipped) {
                    newSet.add(index);
                }
                else {
                    newSet.delete(index);
                }
                onCardFlip?.(card, index, isFlipped);
                return newSet;
            });
        }
        else {
            const targetTheta = -index * anglePerCard;
            setFlippedCards((prev) => {
                const newSet = new Set(prev);
                newSet.delete(currentIndex);
                return newSet;
            });
            setTheta(targetTheta);
            const carouselElement = carouselRef.current;
            if (carouselElement) {
                let transitionHandledForThisClick = false;
                const onTransitionEnd = (event) => {
                    if (event.propertyName !== "transform")
                        return;
                    if (transitionHandledForThisClick)
                        return;
                    transitionHandledForThisClick = true;
                    carouselElement.removeEventListener("transitionend", onTransitionEnd);
                    setCurrentIndex((latestCurrentIndex) => {
                        if (latestCurrentIndex === index) {
                            setFlippedCards((prev) => {
                                const newSet = new Set(prev);
                                const isFlipped = !prev.has(index);
                                if (isFlipped) {
                                    newSet.add(index);
                                }
                                else {
                                    newSet.delete(index);
                                }
                                onCardFlip?.(card, index, isFlipped);
                                return newSet;
                            });
                        }
                        return latestCurrentIndex;
                    });
                };
                carouselElement.addEventListener("transitionend", onTransitionEnd);
            }
        }
    }, [cards, currentIndex, anglePerCard, onCardClick, onCardFlip]);
    // Drag handlers
    const handleDragStart = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
        didDragRef.current = false;
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        setStartX(clientX);
        setInitialTheta(theta);
        if (carouselRef.current) {
            carouselRef.current.style.transition = "none";
        }
    }, [theta]);
    const handleDrag = useCallback((e) => {
        if (!isDragging)
            return;
        e.preventDefault();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const diffX = clientX - startX;
        if (Math.abs(diffX) > 20) {
            didDragRef.current = true;
        }
        const newTheta = initialTheta + diffX * dragSensitivity;
        setTheta(newTheta);
        if (carouselRef.current) {
            carouselRef.current.style.transform = `rotateY(${newTheta}deg)`;
        }
    }, [isDragging, startX, initialTheta, dragSensitivity]);
    const handleDragEnd = useCallback(() => {
        if (!isDragging)
            return;
        setIsDragging(false);
        if (carouselRef.current) {
            carouselRef.current.style.transition = `transform ${transitionDuration}s ease`;
        }
        const closestMultiple = Math.round(theta / anglePerCard);
        const snappedTheta = closestMultiple * anglePerCard;
        setTheta(snappedTheta);
    }, [isDragging, theta, anglePerCard, transitionDuration]);
    // Keyboard navigation
    const handleKeyDown = useCallback((e) => {
        if (e.key === "ArrowLeft") {
            navigateCarousel(-1);
        }
        else if (e.key === "ArrowRight") {
            navigateCarousel(1);
        }
        else if (e.key === "Enter" || e.key === " ") {
            handleCardClick(currentIndex);
        }
    }, [navigateCarousel, handleCardClick, currentIndex]);
    // Auto-rotation
    useEffect(() => {
        if (autoRotate && !isDragging && !isHovered) {
            autoRotateRef.current = setInterval(() => {
                navigateCarousel(1);
            }, autoRotateInterval);
            return () => {
                if (autoRotateRef.current) {
                    clearInterval(autoRotateRef.current);
                }
            };
        }
    }, [autoRotate, isDragging, isHovered, autoRotateInterval, navigateCarousel]);
    // Setup effects for initial arrangement and rotation
    useEffect(() => {
        arrangeCards();
        rotateCarousel(true);
    }, [arrangeCards, rotateCarousel]);
    // Effect to apply rotation whenever 'theta' changes
    useEffect(() => {
        rotateCarousel();
    }, [theta, rotateCarousel]);
    // Global event listeners for drag and keyboard interactions
    useEffect(() => {
        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("touchmove", handleDrag, { passive: false });
        document.addEventListener("mouseup", handleDragEnd);
        document.addEventListener("touchend", handleDragEnd);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousemove", handleDrag);
            document.removeEventListener("touchmove", handleDrag);
            document.removeEventListener("mouseup", handleDragEnd);
            document.removeEventListener("touchend", handleDragEnd);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleDrag, handleDragEnd, handleKeyDown]);
    // Resize handler to re-arrange cards and adjust rotation
    useEffect(() => {
        const handleResize = () => {
            arrangeCards();
            const targetTheta = -currentIndex * anglePerCard;
            setTheta(targetTheta);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [arrangeCards, currentIndex, anglePerCard]);
    if (cards.length === 0) {
        return (_jsx("div", { className: "flex items-center justify-center h-96 text-muted-foreground", children: "No cards provided for the carousel" }));
    }
    return (_jsxs("div", { className: cn("relative w-full", className), style: {
            height: `${Math.max(responsiveCardHeight + 100, 500)}px`,
            touchAction: "none",
        }, onMouseEnter: () => pauseOnHover && setIsHovered(true), onMouseLeave: () => pauseOnHover && setIsHovered(false), children: [_jsx("div", { ref: containerRef, className: "relative w-full h-full flex justify-center items-center", style: {
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                }, children: _jsx("div", { ref: carouselRef, className: "relative", style: {
                        width: `${responsiveRadius * 2}px`,
                        height: `${responsiveRadius * 2}px`,
                        transformStyle: "preserve-3d",
                        transition: `transform ${transitionDuration}s ease`,
                        cursor: isDragging ? "grabbing" : "grab",
                    }, onMouseDown: handleDragStart, onTouchStart: handleDragStart, children: cards.map((card, index) => (_jsx("div", { className: "carousel-card absolute cursor-pointer", style: {
                            width: `${responsiveCardWidth}px`,
                            height: `${responsiveCardHeight}px`,
                            left: "50%",
                            top: "50%",
                            marginLeft: `${-responsiveCardWidth / 2}px`,
                            marginTop: `${-responsiveCardHeight / 2}px`,
                            transformStyle: "preserve-3d",
                            transition: "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        }, onClick: () => handleCardClick(index), children: _jsxs("div", { className: "relative w-full h-full", style: {
                                transformStyle: "preserve-3d",
                                transition: "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                transform: flippedCards.has(index)
                                    ? "rotateY(180deg)"
                                    : "rotateY(0deg)",
                            }, children: [_jsx("div", { className: "absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl \r\n       dark:shadow-gray-500/30", style: {
                                        backfaceVisibility: "hidden",
                                        background: "linear-gradient(135deg, hsl(var(--card) / 0.9), hsl(var(--card) / 0.8))",
                                        border: "1px solid hsl(var(--border) / 0.3)",
                                    }, children: _jsxs("div", { className: "p-5 h-full flex flex-col relative text-card-foreground", children: [_jsx("div", { className: "text-xs uppercase tracking-wider mb-1 text-muted-foreground font-medium", children: card.category }), _jsx("h3", { className: "text-xl font-bold mb-2 text-foreground", children: card.title }), _jsxs("div", { className: "w-full relative rounded-lg overflow-hidden", style: {
                                                    background: "hsl(var(--muted) / 0.3)",
                                                    paddingTop: "75%",
                                                    position: "relative",
                                                    marginBottom: "5rem", // Set bottom margin to 5rem
                                                }, children: [card.imageUrl ? (_jsx("img", { src: card.imageUrl, alt: card.title, className: "absolute inset-0 w-full h-full object-cover" // object-cover to fill
                                                     })) : (_jsx("div", { className: "absolute inset-0 flex items-center justify-center text-muted-foreground z-10 relative", style: { fontSize: "3rem" }, children: card.icon })), enableGlitchEffect && (_jsx("div", { className: "absolute inset-0 opacity-70 animate-pulse", style: {
                                                            background: "linear-gradient(45deg, transparent 65%, hsl(var(--primary) / 0.1) 70%, transparent 75%)",
                                                            backgroundSize: "200% 200%",
                                                            animation: "glitch 3s linear infinite",
                                                        } })), enableGlowEffect && (_jsx("div", { className: "absolute inset-0 rounded-lg pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" // rounded-lg for image area
                                                        , style: {
                                                            background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1), transparent 70%)",
                                                        } }))] }), _jsx("p", { className: "text-xs text-muted-foreground overflow-hidden \r\n                      text-ellipsis absolute top-[17.7rem]", children: card.preview })] }) }), _jsx("div", { className: "absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl", style: {
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                        background: "linear-gradient(135deg, hsl(var(--card) / 0.95), hsl(var(--card) / 0.9))",
                                        border: "1px solid hsl(var(--border) / 0.3)",
                                    }, children: _jsxs("div", { className: "p-5 h-full flex flex-col text-card-foreground", children: [_jsx("h3", { className: "text-xl font-bold mb-4 text-foreground", children: card.title }), _jsxs("p", { className: "text-sm text-muted-foreground mb-5 flex-grow leading-relaxed overflow-auto", children: [" ", card.content] }), _jsx("div", { className: "flex flex-col gap-2 text-xs text-muted-foreground" })] }) })] }) }, card.id))) }) }), showControls && (_jsxs("div", { className: "absolute bottom-6 left-1/2 transform \r\n        -translate-x-1/2  flex items-center gap-4 z-10 top-[33rem]", children: [_jsx("button", { onClick: () => navigateCarousel(-1), className: "w-10 h-10 rounded-full bg-background/80 border border-border text-foreground hover:bg-background/90 hover:scale-110 transition-all duration-200 flex items-center justify-center \r\n            shadow-lg backdrop-blur-sm", "aria-label": "Previous card", children: _jsx(ChevronLeft, { className: "w-5 h-5" }) }), _jsx("button", { onClick: () => navigateCarousel(1), className: "w-10 h-10 rounded-full bg-background/80 border border-border text-foreground hover:bg-background/90 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-lg backdrop-blur-sm", "aria-label": "Next card", children: _jsx(ChevronRight, { className: "w-5 h-5" }) }), showThemeToggle && (_jsx("button", { onClick: () => {
                            const isDark = document.documentElement.classList.contains("dark");
                            document.documentElement.classList.toggle("dark", !isDark);
                        }, className: "w-10 h-10 rounded-full bg-background/80 border border-border text-foreground hover:bg-background/90 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-lg backdrop-blur-sm", "aria-label": "Toggle theme", children: _jsx(Palette, { className: "w-5 h-5" }) }))] })), _jsx("style", { jsx: true, children: `
        @keyframes glitch {
          0% {
            background-position: 0 0;
          }
          25% {
            background-position: 100% 0;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0 100%;
          }
          100% {
            background-position: 0 0;
          }
        }
      ` })] }));
};
export default Carousel3D;
