import React from "react";
export interface ParticleConfig {
    x: number;
    y: number;
    vx: number;
    vy: number;
    scale: number;
    rotation: number;
    rotationDirection: string;
    siner: number;
    steps: number;
    friction: number;
    element: Element | null;
}
export interface AnimatedBubbleParticlesProps {
    /** Container class name */
    className?: string;
    /** Background color (used if no background class provided in className) */
    backgroundColor?: string;
    /** Particle color */
    particleColor?: string;
    /** Particle size in pixels */
    particleSize?: number;
    /** Spawn interval in milliseconds */
    spawnInterval?: number;
    /** Container height */
    height?: string;
    /** Container width */
    width?: string;
    /** Enable gooey blur effect */
    enableGooEffect?: boolean;
    /** Blur strength for goo effect */
    blurStrength?: number;
    /** Pause animation when window is not focused */
    pauseOnBlur?: boolean;
    /** Z-index for layering */
    zIndex?: number;
    /** Friction range for particle movement */
    friction?: {
        min: number;
        max: number;
    };
    /** Scale range for particles */
    scaleRange?: {
        min: number;
        max: number;
    };
    /** Content to be displayed inside the particle container */
    children?: React.ReactNode;
}
declare const AnimatedBubbleParticles: React.FC<AnimatedBubbleParticlesProps>;
export { AnimatedBubbleParticles };
export default AnimatedBubbleParticles;
