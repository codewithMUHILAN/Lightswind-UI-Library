import React from "react";
export interface Image3DGalleryProps {
    images?: string[];
    width?: number;
    height?: number;
    spacing?: number;
    rotationAngle?: number;
    borderRadius?: number;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    className?: string;
    style?: React.CSSProperties;
    onImageClick?: (index: number) => void;
}
/**
 * ThreeDImageGallery Component
 * Renders a responsive 3D image gallery with interactive and auto-rotate features.
 */
declare const ThreeDImageGallery: React.FC<Image3DGalleryProps>;
export default ThreeDImageGallery;
