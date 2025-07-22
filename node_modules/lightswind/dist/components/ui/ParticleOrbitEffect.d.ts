import React from "react";
export interface ParticleOrbitEffectProps {
    className?: string;
    style?: React.CSSProperties;
    particleCount?: number;
    radius?: number;
    particleSpeed?: number;
    radiusScale?: number;
    intensity?: number;
    fadeOpacity?: number;
    colorRange?: [number, number];
    disabled?: boolean;
    followMouse?: boolean;
    autoColors?: boolean;
    particleSize?: number;
}
declare const ParticleOrbitEffect: React.FC<ParticleOrbitEffectProps>;
export default ParticleOrbitEffect;
