'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity, useAnimationFrame, useMotionValue, } from 'motion/react';
import { wrap } from '@motionone/utils';
import { cn } from '../lib/utils';
export default function TextScrollMarquee({ children, baseVelocity = 1, className, scrollDependent = false, delay = 0, direction = 'left', }) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400,
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
        clamp: false,
    });
    // ✅ Use modular wrap from -100% to 0% for seamless loop
    const x = useTransform(baseX, (v) => `${wrap(-100, 0, v % 100)}%`);
    const directionFactor = useRef(direction === 'left' ? 1 : -1);
    const hasStarted = useRef(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            hasStarted.current = true;
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);
    useEffect(() => {
        directionFactor.current = direction === 'left' ? 1 : -1;
    }, [direction]);
    useAnimationFrame((t, delta) => {
        if (!hasStarted.current)
            return;
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
        if (scrollDependent) {
            if (velocityFactor.get() < 0) {
                directionFactor.current = -1;
            }
            else if (velocityFactor.get() > 0) {
                directionFactor.current = 1;
            }
        }
        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });
    return (_jsx("div", { className: "overflow-hidden whitespace-nowrap flex flex-nowrap", children: _jsx(motion.div, { className: "flex whitespace-nowrap gap-10 flex-nowrap", style: { x }, children: [...Array(4)].map((_, index) => (_jsx("span", { className: cn('block text-[5vw]', className), children: children }, index))) }) }));
}
