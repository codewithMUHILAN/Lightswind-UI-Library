interface ColorRGB {
    r: number;
    g: number;
    b: number;
}
interface SmokeyCursorProps {
    simulationResolution?: number;
    dyeResolution?: number;
    captureResolution?: number;
    densityDissipation?: number;
    velocityDissipation?: number;
    pressure?: number;
    pressureIterations?: number;
    curl?: number;
    splatRadius?: number;
    splatForce?: number;
    enableShading?: boolean;
    colorUpdateSpeed?: number;
    backgroundColor?: ColorRGB;
    transparent?: boolean;
    className?: string;
    disabled?: boolean;
    intensity?: number;
    followMouse?: boolean;
    autoColors?: boolean;
}
export default function SmokeyCursor({ simulationResolution, dyeResolution, captureResolution, densityDissipation, velocityDissipation, pressure, pressureIterations, curl, splatRadius, splatForce, enableShading, colorUpdateSpeed, backgroundColor, transparent, className, disabled, intensity, followMouse, autoColors, }: SmokeyCursorProps): import("react/jsx-runtime").JSX.Element;
export {};
