export interface Draggable3DImageRingProps {
    /** Array of image URLs to display in the ring */
    images: string[];
    /** Container width in pixels (will be scaled) */
    width?: number;
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
    /** Power for the drag end inertia animation (higher means faster stop) */
    inertiaPower?: number;
    /** Time constant for the drag end inertia animation (duration of deceleration in ms) */
    inertiaTimeConstant?: number;
    /** Multiplier for initial velocity when drag ends (influences initial "spin") */
    inertiaVelocityMultiplier?: number;
}
export declare function Draggable3DImageRing({ images, width, perspective, imageDistance, initialRotation, animationDuration, staggerDelay, hoverOpacity, containerClassName, ringClassName, imageClassName, backgroundColor, draggable, ease, mobileBreakpoint, mobileScaleFactor, inertiaPower, // Default power for inertia
inertiaTimeConstant, // Default time constant for inertia
inertiaVelocityMultiplier, }: Draggable3DImageRingProps): import("react/jsx-runtime").JSX.Element;
export default Draggable3DImageRing;
