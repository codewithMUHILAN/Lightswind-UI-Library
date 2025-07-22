import React from 'react';
export interface Image3DGalleryProps {
    images?: string[];
    width?: number;
    height?: number;
    boxWidth?: number;
    boxHeight?: number;
    parallaxStrength?: number;
    animationSpeed?: number;
    spacing?: number;
    rotationAngle?: number;
    borderRadius?: number;
    edgeSoftness?: number;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    ambientLightIntensity?: number;
    enableMouseControl?: boolean;
    enableTouchControl?: boolean;
    perspective?: number;
    cameraDistance?: number;
    backgroundColor?: string;
    className?: string;
    style?: React.CSSProperties;
    onImageClick?: (index: number) => void;
    onSceneReady?: () => void;
}
declare const ThreeDImageGallery: React.FC<Image3DGalleryProps>;
export default ThreeDImageGallery;
