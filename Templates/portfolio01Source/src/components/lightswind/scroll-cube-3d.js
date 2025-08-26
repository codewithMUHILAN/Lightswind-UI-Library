"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../lib/utils";
gsap.registerPlugin(ScrollTrigger);
const ScrollCube3D = ({ items = [], showTitles = true, cubeSize = 380, scrollHeight = 1600, theme = "dark", className, onItemClick, }) => {
    const sectionRef = useRef(null);
    const cubeRef = useRef(null);
    const timelineRef = useRef(null);
    const themeClasses = {
        dark: "bg-black text-white",
        light: "bg-white text-black",
    };
    const cardClasses = {
        dark: "bg-card border-border shadow-[0_15px_30px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] border-border/20",
        light: "bg-card border-border shadow-[0_15px_30px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] border-border/20",
    };
    useEffect(() => {
        if (!cubeRef.current || !sectionRef.current || items.length === 0)
            return;
        const cube = cubeRef.current;
        const section = sectionRef.current;
        // Clear previous content
        cube.innerHTML = "";
        // Create cube faces
        const faces = ["front-cube", "right-cube", "back-cube", "left-cube"];
        const transforms = [
            `translateZ(${cubeSize / 2}px)`,
            `rotateY(90deg) translateZ(${cubeSize / 2}px)`,
            `rotateY(180deg) translateZ(${cubeSize / 2}px)`,
            `rotateY(-90deg) translateZ(${cubeSize / 2}px)`,
        ];
        // Ensure we have 4 items by cycling through provided items
        const cubeItems = Array.from({ length: 4 }, (_, index) => items[index % items.length]);
        cubeItems.forEach((item, index) => {
            const faceDiv = document.createElement("div");
            faceDiv.className = cn(faces[index], "h-full w-full absolute flex flex-col justify-end items-center [backface-visibility:hidden] rounded-xl overflow-hidden transition-all duration-300 ease-in-out cursor-pointer", cardClasses[theme]);
            faceDiv.style.transform = transforms[index];
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.title;
            img.className = "w-full h-full object-cover absolute top-0 left-0 [transform:translateZ(0)] grayscale-[50%] transition-all duration-300 ease-in-out hover:grayscale-0 hover:scale-105";
            faceDiv.appendChild(img);
            if (showTitles) {
                const title = document.createElement("h2");
                title.className = cn("relative z-10 text-xl font-semibold p-4 pb-6", theme === "dark" ? "text-white" : "text-black");
                title.textContent = item.title;
                faceDiv.appendChild(title);
            }
            // Handle clicks
            faceDiv.addEventListener("click", () => {
                if (item.href) {
                    window.open(item.href, item.target || "_self");
                }
                if (onItemClick) {
                    onItemClick(item, index);
                }
            });
            cube.appendChild(faceDiv);
        });
        // Create GSAP timeline with ScrollTrigger
        if (timelineRef.current) {
            timelineRef.current.kill();
        }
        // Set the section height to accommodate the scroll animation
        const totalHeight = scrollHeight + window.innerHeight;
        section.style.height = `${totalHeight}px`;
        timelineRef.current = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: `+=${scrollHeight}`,
                scrub: 1.5,
                pin: ".cube-sticky-container",
                anticipatePin: 1,
            },
        });
        timelineRef.current
            .to(cube, {
            rotationY: -90,
            duration: 1,
            ease: "power2.inOut",
        })
            .to(cube, {
            rotationY: -180,
            duration: 1,
            ease: "power2.inOut",
        })
            .to(cube, {
            rotationY: -270,
            duration: 1,
            ease: "power2.inOut",
        })
            .to(cube, {
            rotationY: -360,
            duration: 1,
        });
        timelineRef.current.set(cube, { rotationY: 0 });
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.trigger === section) {
                    trigger.kill();
                }
            });
        };
    }, [items, cubeSize, scrollHeight, showTitles, theme, onItemClick]);
    if (items.length === 0) {
        return (_jsx("div", { className: cn("w-full h-screen flex items-center justify-center", themeClasses[theme]), children: _jsx("p", { className: "text-muted-foreground", children: "No items provided for the cube carousel" }) }));
    }
    const totalSectionHeight = scrollHeight + window.innerHeight;
    return (_jsx("div", { ref: sectionRef, className: cn("relative w-full overflow-hidden", themeClasses[theme], className), style: {
            height: `${totalSectionHeight}px`
        }, children: _jsx("div", { className: "cube-sticky-container sticky top-0 w-full h-screen flex justify-center items-center", children: _jsx("div", { className: "flex justify-center items-center", style: {
                    height: `${cubeSize}px`,
                    width: `${cubeSize}px`,
                    perspective: "1200px",
                }, children: _jsx("div", { ref: cubeRef, className: "relative", style: {
                        width: `${cubeSize}px`,
                        height: `${cubeSize}px`,
                        transformStyle: "preserve-3d",
                    } }) }) }) }));
};
export default ScrollCube3D;
