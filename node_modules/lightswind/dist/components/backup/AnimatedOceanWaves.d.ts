import React from "react";
export interface AnimatedOceanWavesProps {
    /** Height of the ocean container (CSS value, e.g. '5%', '80px') */
    height?: string;
    /** Background color or gradient for the ocean container */
    oceanBackground?: string;
    /** Wave SVG url (default is the blue wave) */
    waveImageUrl?: string;
    /** Wave animation duration in seconds */
    waveDuration?: number;
    /** Offset between the two wave layers (in px, for parallax effect) */
    waveOffset?: number;
    /** Opacity of the front/back wave layers */
    frontWaveOpacity?: number;
    backWaveOpacity?: number;
    /** Additional container className */
    className?: string;
    /** Additional inline style for the outer container */
    style?: React.CSSProperties;
    /** Z-index of the ocean (allows layering) */
    zIndex?: number;
}
export declare const AnimatedOceanWaves: React.FC<AnimatedOceanWavesProps>;
export default AnimatedOceanWaves;
