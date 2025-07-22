import { Camera, Object3D, Raycaster } from 'three';
import { EventDispatcher } from './EventDispatcher';
export interface DragControlsEventMap {
    /**
     * Fires when the pointer is moved onto a 3D object, or onto one of its children.
     */
    hoveron: {
        object: Object3D;
    };
    /**
     * Fires when the pointer is moved out of a 3D object.
     */
    hoveroff: {
        object: Object3D;
    };
    /**
     * Fires when the user starts to drag a 3D object.
     */
    dragstart: {
        object: Object3D;
    };
    /**
     * Fires when the user drags a 3D object.
     */
    drag: {
        object: Object3D;
    };
    /**
     * Fires when the user has finished dragging a 3D object.
     */
    dragend: {
        object: Object3D;
    };
}
declare class DragControls extends EventDispatcher<DragControlsEventMap> {
    enabled: boolean;
    transformGroup: boolean;
    private _objects;
    private _camera;
    private _domElement;
    private _plane;
    private _raycaster;
    private _mouse;
    private _offset;
    private _intersection;
    private _worldPosition;
    private _inverseMatrix;
    private _intersections;
    private _selected;
    private _hovered;
    constructor(_objects: Object3D[], _camera: Camera, _domElement: HTMLElement);
    activate: () => void;
    deactivate: () => void;
    dispose: () => void;
    getObjects: () => Object3D[];
    getRaycaster: () => Raycaster;
    private onMouseMove;
    private onMouseDown;
    private onMouseCancel;
    private onPointerMove;
    private onPointerDown;
    private onPointerCancel;
    private onTouchMove;
    private onTouchStart;
    private onTouchEnd;
}
export { DragControls };
