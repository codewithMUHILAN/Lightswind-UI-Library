import React from "react";
export interface CubeItem {
    title: string;
    image: string;
    href?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
}
interface ScrollCube3DProps {
    items: CubeItem[];
    showTitles?: boolean;
    cubeSize?: number;
    scrollHeight?: number;
    theme?: "dark" | "light";
    className?: string;
    onItemClick?: (item: CubeItem, index: number) => void;
}
declare const ScrollCube3D: React.FC<ScrollCube3DProps>;
export default ScrollCube3D;
