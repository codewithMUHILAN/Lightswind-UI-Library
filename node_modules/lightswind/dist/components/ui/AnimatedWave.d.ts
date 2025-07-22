import React from 'react';
export interface AnimatedWaveProps {
    /** Custom CSS class name */
    className?: string;
    /** Wave animation speed (default: 0.015) */
    speed?: number;
    /** Wave amplitude/scale (default: 30) */
    amplitude?: number;
    /** Wave smoothness factor (default: 300) */
    smoothness?: number;
    /** Enable wireframe mode (default: true) */
    wireframe?: boolean;
    /** Wave color (CSS color string) */
    waveColor?: string;
    /** Wave opacity (0-1, default: 1) */
    opacity?: number;
    /** Enable mouse interaction (default: true) */
    mouseInteraction?: boolean;
    /** Render quality - higher = more detail but slower (default: 'medium') */
    quality?: 'low' | 'medium' | 'high';
    /** Camera field of view (default: 60) */
    fov?: number;
    /** Wave position Y offset (default: -300) */
    waveOffsetY?: number;
    /** Wave rotation in degrees (default: 29.8) */
    waveRotation?: number;
    /** Camera position Z offset (default: -1000) */
    cameraDistance?: number;
    /** Auto-detect background color from parent to determine contrasting wave color */
    autoDetectBackground?: boolean;
    /** Background color for manual override (for the container div) */
    backgroundColor?: string;
    /** Wave ease factor (default: 12) */
    ease?: number;
    /** Mouse influence on wave distortion (default: 0.5) */
    mouseDistortionStrength?: number;
    /** How smooth the mouse distortion is (default: 100) */
    mouseDistortionSmoothness?: number;
    /** Time factor for mouse distortion decay (default: 0.0005) */
    mouseDistortionDecay?: number;
    /** Strength of the shrinking/scaling effect (default: 0.7) */
    mouseShrinkScaleStrength?: number;
    /** Radius of the shrinking/scaling effect (default: 200) */
    mouseShrinkScaleRadius?: number;
}
declare const AnimatedWave: React.FC<AnimatedWaveProps>;
export default AnimatedWave;
