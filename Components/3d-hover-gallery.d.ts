import React from 'react';
export interface ThreeDHoverGalleryProps {
    images?: string[];
    itemWidth?: number;
    itemHeight?: number;
    gap?: number;
    perspective?: number;
    hoverScale?: number;
    transitionDuration?: number;
    backgroundColor?: string;
    grayscaleStrength?: number;
    brightnessLevel?: number;
    activeWidth?: number;
    rotationAngle?: number;
    zDepth?: number;
    enableKeyboardNavigation?: boolean;
    autoPlay?: boolean;
    autoPlayDelay?: number;
    className?: string;
    style?: React.CSSProperties;
    onImageClick?: (index: number, image: string) => void;
    onImageHover?: (index: number, image: string) => void;
    onImageFocus?: (index: number, image: string) => void;
}
declare const ThreeDHoverGallery: React.FC<ThreeDHoverGalleryProps>;
export default ThreeDHoverGallery;
