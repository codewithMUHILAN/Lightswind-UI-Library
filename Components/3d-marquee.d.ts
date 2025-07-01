import React from "react";
export interface MarqueeImage {
    src: string;
    alt: string;
    href?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
}
export interface ThreeDMarqueeProps {
    images: MarqueeImage[];
    className?: string;
    onImageClick?: (image: MarqueeImage, index: number) => void;
}
export declare const ThreeDMarquee: React.FC<ThreeDMarqueeProps>;
export default ThreeDMarquee;
