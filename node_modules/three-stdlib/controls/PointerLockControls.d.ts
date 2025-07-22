import { Camera, Vector3 } from 'three';
import { EventDispatcher } from './EventDispatcher';
export interface PointerLockControlsEventMap {
    /**
     * Fires when the user moves the mouse.
     */
    change: {};
    /**
     * Fires when the pointer lock status is "locked" (in other words: the mouse is captured).
     */
    lock: {};
    /**
     * Fires when the pointer lock status is "unlocked" (in other words: the mouse is not captured anymore).
     */
    unlock: {};
}
declare class PointerLockControls extends EventDispatcher<PointerLockControlsEventMap> {
    camera: Camera;
    domElement?: HTMLElement;
    isLocked: boolean;
    minPolarAngle: number;
    maxPolarAngle: number;
    pointerSpeed: number;
    constructor(camera: Camera, domElement?: HTMLElement);
    private onMouseMove;
    private onPointerlockChange;
    private onPointerlockError;
    connect: (domElement: HTMLElement) => void;
    disconnect: () => void;
    dispose: () => void;
    getObject: () => Camera;
    private direction;
    getDirection: (v: Vector3) => Vector3;
    moveForward: (distance: number) => void;
    moveRight: (distance: number) => void;
    lock: () => void;
    unlock: () => void;
}
export { PointerLockControls };
