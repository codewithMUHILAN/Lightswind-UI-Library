"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { cn } from "../lib/utils"; // Optional utility for className merging
const SlidingCards = ({ cards, className = "", cardSize = "w-24 h-24", onCardClick, }) => {
    const cardStackRef = useRef(null);
    const cardsRef = useRef([]);
    useEffect(() => {
        const cardStack = cardStackRef.current;
        if (!cardStack)
            return;
        cardsRef.current = Array.from(cardStack.querySelectorAll(".card"));
        let isSwiping = false;
        let startX = 0;
        let currentX = 0;
        let animationFrameId = null;
        const getDuration = () => 300;
        const getActiveCard = () => cardsRef.current[0];
        const updatePositions = () => {
            cardsRef.current.forEach((card, i) => {
                const offset = i + 1;
                card.style.zIndex = `${100 - offset}`;
                card.style.transform = `perspective(700px) translateZ(${-12 * offset}px) translateY(${7 * offset}px) translateX(0px) rotateY(0deg)`;
                card.style.opacity = `1`;
            });
        };
        const applySwipeStyles = (deltaX) => {
            const card = getActiveCard();
            if (!card)
                return;
            const rotate = deltaX * 0.2;
            const opacity = 1 - Math.min(Math.abs(deltaX) / 100, 1) * 0.75;
            card.style.transform = `perspective(700px) translateZ(-12px) translateY(7px) translateX(${deltaX}px) rotateY(${rotate}deg)`;
            card.style.opacity = `${opacity}`;
        };
        const handleStart = (clientX) => {
            if (isSwiping)
                return;
            isSwiping = true;
            startX = currentX = clientX;
            const card = getActiveCard();
            card && (card.style.transition = "none");
        };
        const handleMove = (clientX) => {
            if (!isSwiping)
                return;
            if (animationFrameId)
                cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                currentX = clientX;
                const deltaX = currentX - startX;
                applySwipeStyles(deltaX);
                if (Math.abs(deltaX) > 50)
                    handleEnd();
            });
        };
        const handleEnd = () => {
            if (!isSwiping)
                return;
            if (animationFrameId)
                cancelAnimationFrame(animationFrameId);
            const deltaX = currentX - startX;
            const threshold = 50;
            const duration = getDuration();
            const card = getActiveCard();
            if (card) {
                card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
                if (Math.abs(deltaX) > threshold) {
                    const direction = Math.sign(deltaX);
                    card.style.transform = `perspective(700px) translateZ(-12px) translateY(7px) translateX(${direction * 300}px) rotateY(${direction * 20}deg)`;
                    setTimeout(() => {
                        card.style.transform = `perspective(700px) translateZ(-12px) translateY(7px) translateX(${direction * 300}px) rotateY(${-direction * 20}deg)`;
                    }, duration / 2);
                    setTimeout(() => {
                        cardsRef.current = [...cardsRef.current.slice(1), card];
                        updatePositions();
                    }, duration);
                }
                else {
                    applySwipeStyles(0);
                }
            }
            isSwiping = false;
            startX = currentX = 0;
        };
        cardStack.addEventListener("pointerdown", (e) => handleStart(e.clientX));
        cardStack.addEventListener("pointermove", (e) => handleMove(e.clientX));
        cardStack.addEventListener("pointerup", handleEnd);
        updatePositions();
    }, []);
    return (_jsx("section", { ref: cardStackRef, className: cn("relative w-64 h-[22rem] grid place-content-center touch-none select-none", className), children: cards.map(({ id, icon, bgClass = "bg-gradient-to-br from-pink-300 to-orange-200" }, index) => (_jsx("article", { onClick: () => onCardClick?.(index), className: cn("card absolute inset-4 grid place-content-center rounded-xl border border-gray-400 shadow-md cursor-grab transition-transform ease-in-out", bgClass), children: _jsx("span", { className: cn("aspect-square grid place-content-center", cardSize), children: icon || (_jsx("svg", { className: "w-full h-full fill-white drop-shadow-md", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 16 16", children: _jsx("circle", { cx: "8", cy: "8", r: "6" }) })) }) }, id))) }));
};
export default SlidingCards;
