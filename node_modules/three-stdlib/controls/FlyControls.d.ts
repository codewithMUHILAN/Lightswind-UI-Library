import { Camera } from 'three';
import { EventDispatcher } from './EventDispatcher';
export interface FlyControlsEventMap {
    /**
     * Fires when the camera has been transformed by the controls.
     */
    change: {};
}
declare class FlyControls extends EventDispatcher<FlyControlsEventMap> {
    object: Camera;
    domElement: HTMLElement | Document;
    movementSpeed: number;
    rollSpeed: number;
    dragToLook: boolean;
    autoForward: boolean;
    private changeEvent;
    private EPS;
    private tmpQuaternion;
    private mouseStatus;
    private movementSpeedMultiplier;
    private moveState;
    private moveVector;
    private rotationVector;
    constructor(object: Camera, domElement?: HTMLElement | Document);
    private keydown;
    private keyup;
    private pointerdown;
    private pointermove;
    private pointerup;
    private lastQuaternion;
    private lastPosition;
    update: (delta: number) => void;
    private updateMovementVector;
    private updateRotationVector;
    private getContainerDimensions;
    connect: (domElement: HTMLElement | Document) => void;
    dispose: () => void;
}
export { FlyControls };
