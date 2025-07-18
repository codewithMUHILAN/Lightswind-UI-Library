import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion'; // Import Variants

interface ScrollListProps<T> {
    data: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    itemHeight?: number;
}

const ScrollList = <T,>({ data, renderItem, itemHeight = 155 }: ScrollListProps<T>) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(0);

    const { scrollYProgress } = useScroll({ container: listRef });

    useEffect(() => {
        const updateFocusedItem = () => {
            if (!listRef.current) return;

            const container = listRef.current;
            const children = Array.from(container.children) as HTMLDivElement[];
            const scrollTop = container.scrollTop;
            const containerCenter = container.clientHeight / 2;

            let closestItemIndex = 0;
            let minDistanceToCenter = Infinity;

            children.forEach((child, index) => {
                const itemTop = child.offsetTop;
                const itemHeight = child.offsetHeight;
                const itemCenter = itemTop + itemHeight / 2;

                const distanceToCenter = Math.abs((itemCenter - scrollTop) - containerCenter);

                if (distanceToCenter < minDistanceToCenter) {
                    minDistanceToCenter = distanceToCenter;
                    closestItemIndex = index;
                }
            });

            setFocusedIndex(closestItemIndex);
        };

        updateFocusedItem();
        const listElement = listRef.current;
        if (listElement) {
            listElement.addEventListener('scroll', updateFocusedItem);
        }

        return () => {
            if (listElement) {
                listElement.removeEventListener('scroll', updateFocusedItem);
            }
        };
    }, [data, itemHeight]);

    // Explicitly type itemVariants as Variants
    const itemVariants: Variants = { // <-- Added explicit type here
        hidden: { opacity: 0, scale: 0.7, transition: { duration: 0.35, ease: "easeOut" } },
        focused: { opacity: 1, scale: 1, zIndex: 10, transition: { duration: 0.35, ease: "easeOut" } },
        next: { opacity: 1, scale: 0.95, zIndex: 5, transition: { duration: 0.35, ease: "easeOut" } },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } }
    };

    return (
        <div
            ref={listRef}
            className="scroll-list__wrp scrollbar-hidden mx-auto w-full"
            style={{ height: '400px', overflowY: 'auto' }}
        >
            {data.map((item, index) => {
                let variant = "hidden";
                if (index === focusedIndex) {
                    variant = "focused";
                } else if (index === focusedIndex + 1) {
                    variant = "next";
                } else {
                    const isBeyondFocused = index > focusedIndex;
                    const isWithinVisibleRange = Math.abs(index - focusedIndex) <= 2;
                    if (isWithinVisibleRange && !isBeyondFocused) {
                        variant = "visible";
                    } else if (isBeyondFocused && Math.abs(index - focusedIndex) <= 2) {
                        variant = "visible";
                    }
                }

                return (
                    <motion.div
                        key={index}
                        className="scroll-list__item  mx-auto w-full"
                        variants={itemVariants}
                        initial="hidden"
                        animate={variant}
                        style={{ height: itemHeight ? `${itemHeight}px` : 'auto' }}
                    >
                        {renderItem(item, index)}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ScrollList;