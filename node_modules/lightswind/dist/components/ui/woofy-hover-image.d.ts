import React from 'react';
export interface WoofyHoverImageProps {
    src: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    effectType?: 'inversion' | 'blackWhite' | 'sepia' | 'duotone' | 'pixelate' | 'blur';
    maskRadius?: number;
    turbulenceIntensity?: number;
    animationSpeed?: number;
    appearDuration?: number;
    disappearDuration?: number;
    effectIntensity?: number;
    invertMask?: boolean;
    duotoneColor1?: string;
    duotoneColor2?: string;
    onHover?: () => void;
    onLeave?: () => void;
}
declare const WoofyHoverImage: React.FC<WoofyHoverImageProps>;
export default WoofyHoverImage;
