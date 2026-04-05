"use client";

import React, { useRef, MouseEvent, useId } from "react";
import { cn } from "@/app/component2/utils";

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
    imageUrl: string;
    title: string;
    icon?: React.ReactNode;
}

export const MagicCard = ({
    imageUrl,
    title,
    icon,
    className,
    ...props
}: MagicCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const id = useId();
    // Sanitize ID for use in URL
    const filterId = `magic-card-blur-${id.replace(/:/g, '')}`;

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const relativeX = e.clientX - centerX;
        const relativeY = e.clientY - centerY;

        // Normalize to -1 to 1 range
        const x = (relativeX / (rect.width / 2)).toFixed(3);
        const y = (relativeY / (rect.height / 2)).toFixed(3);

        card.style.setProperty('--pointer-x', x);
        card.style.setProperty('--pointer-y', y);
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        // Reset to default "off-screen" position, matching the default fallback
        card.style.setProperty('--pointer-x', '-10');
        card.style.setProperty('--pointer-y', '-10');
    };

    return (
        <article
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "group relative aspect-[4/3] w-[300px] cursor-pointer rounded-xl outline outline-2 outline-neutral-200 dark:outline-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-all duration-300 active:scale-[0.99] active:translate-y-px [container-type:size]",
                className
            )}
            {...props}
        >
            {/* Inner Content Wrapper */}
            <div className="absolute inset-0 grid place-items-center gap-2 overflow-hidden rounded-xl [clip-path:inset(0_round_12px)]">

                {/* Magic Image Layer (Effect) */}
                <div
                    className="img-container absolute inset-0 grid place-items-center opacity-25 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        transform: 'translateZ(0)',
                        filter: `url(#${filterId}) saturate(5) brightness(1.3) contrast(1.4)`,
                        translate: 'calc(var(--pointer-x, -10) * 50cqi) calc(var(--pointer-y, -10) * 50cqh)',
                        scale: '3.4',
                        willChange: 'transform, filter'
                    }}
                >
                    <img src={imageUrl} alt="" className="w-[100px] select-none" />
                </div>

                {/* Main Image */}
                <img src={imageUrl} alt="" className="relative z-[2] w-[100px] select-none" />

                {/* Title */}
                <h2 className="relative z-[4] m-0 text-base font-medium select-none text-neutral-900 dark:text-neutral-100">
                    {title}
                </h2>
            </div>

            {/* Border/Glass Effect */}
            <div
                className="pointer-events-none absolute inset-0 z-[2] rounded-xl border-[3px] border-transparent [transform:translateZ(0)] [clip-path:inset(0_round_12px)] backdrop-blur-sm backdrop-saturate-[4.2] backdrop-brightness-[2.5] backdrop-contrast-[2.5]"
                style={{
                    mask: 'linear-gradient(#fff 0 100%) border-box, linear-gradient(#fff 0 100%) padding-box',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor', // Webkit fallback for exclude behavior
                }}
            />

            {/* SVG Filter Definition */}
            <svg className="absolute h-0 w-0 overflow-visible opacity-0 pointer-events-none">
                <defs>
                    <filter id={filterId} width="500%" height="500%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="28" />
                    </filter>
                </defs>
            </svg>
        </article>
    );
};
