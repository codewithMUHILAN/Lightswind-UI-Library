import React from "react";
export interface CompMarqueeItem {
    id: string;
    content: React.ReactNode;
    href?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
}
export interface ThreeDCompMarqueeProps {
    compItems: CompMarqueeItem[];
    className?: string;
    onCompItemClick?: (item: CompMarqueeItem, index: number) => void;
}
export declare const ThreeDCompMarquee: React.FC<ThreeDCompMarqueeProps>;
export default ThreeDCompMarquee;
