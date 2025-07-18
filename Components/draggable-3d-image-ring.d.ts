export interface Draggable3DImageRingProps {
    /** Array of image URLs to display in the ring */
    images: string[];
    /** Container width in pixels (will be scaled) */
    width?: number;
    /** Container height in pixels (will be scaled) */
    height?: number;
    /** 3D perspective value */
    perspective?: number;
    /** Distance of images from center (z-depth) */
    imageDistance?: number;
    /** Initial rotation of the ring */
    initialRotation?: number;
    /** Animation duration for entrance */
    animationDuration?: number;
    /** Stagger delay between images */
    staggerDelay?: number;
    /** Hover opacity for non-hovered images */
    hoverOpacity?: number;
    /** Custom container className */
    containerClassName?: string;
    /** Custom ring className */
    ringClassName?: string;
    /** Custom image className */
    imageClassName?: string;
    /** Background color of the stage */
    backgroundColor?: string;
    /** Enable/disable drag functionality */
    draggable?: boolean;
    /** Animation ease for entrance */
    ease?: string;
    /** Breakpoint for mobile responsiveness (e.g., 768 for iPad mini) */
    mobileBreakpoint?: number;
    /** Scale factor for mobile (e.g., 0.7 for 70% size) */
    mobileScaleFactor?: number;
}
export declare function Draggable3DImageRing({ images, width, height, perspective, imageDistance, initialRotation, animationDuration, staggerDelay, hoverOpacity, containerClassName, ringClassName, imageClassName, backgroundColor, draggable, ease, mobileBreakpoint, mobileScaleFactor, }: Draggable3DImageRingProps): import("react/jsx-runtime").JSX.Element;
export default Draggable3DImageRing;
