import * as _THREE from 'three';
export interface THREESubset {
    Vector2: typeof _THREE.Vector2;
    Vector3: typeof _THREE.Vector3;
    Vector4: typeof _THREE.Vector4;
    Quaternion: typeof _THREE.Quaternion;
    Matrix4: typeof _THREE.Matrix4;
    Spherical: typeof _THREE.Spherical;
    Box3: typeof _THREE.Box3;
    Sphere: typeof _THREE.Sphere;
    Raycaster: typeof _THREE.Raycaster;
    [key: string]: any;
}
export type Ref = {
    value: number;
};
export declare const MOUSE_BUTTON: {
    readonly LEFT: 1;
    readonly RIGHT: 2;
    readonly MIDDLE: 4;
};
export type MOUSE_BUTTON = typeof MOUSE_BUTTON[keyof typeof MOUSE_BUTTON];
export declare const ACTION: Readonly<{
    readonly NONE: 0;
    readonly ROTATE: 1;
    readonly TRUCK: 2;
    readonly SCREEN_PAN: 4;
    readonly OFFSET: 8;
    readonly DOLLY: 16;
    readonly ZOOM: 32;
    readonly TOUCH_ROTATE: 64;
    readonly TOUCH_TRUCK: 128;
    readonly TOUCH_SCREEN_PAN: 256;
    readonly TOUCH_OFFSET: 512;
    readonly TOUCH_DOLLY: 1024;
    readonly TOUCH_ZOOM: 2048;
    readonly TOUCH_DOLLY_TRUCK: 4096;
    readonly TOUCH_DOLLY_SCREEN_PAN: 8192;
    readonly TOUCH_DOLLY_OFFSET: 16384;
    readonly TOUCH_DOLLY_ROTATE: 32768;
    readonly TOUCH_ZOOM_TRUCK: 65536;
    readonly TOUCH_ZOOM_OFFSET: 131072;
    readonly TOUCH_ZOOM_SCREEN_PAN: 262144;
    readonly TOUCH_ZOOM_ROTATE: 524288;
}>;
export type ACTION = number;
export interface PointerInput {
    pointerId: number;
    clientX: number;
    clientY: number;
    deltaX: number;
    deltaY: number;
    mouseButton: MOUSE_BUTTON | null;
}
type mouseButtonAction = typeof ACTION.ROTATE | typeof ACTION.TRUCK | typeof ACTION.SCREEN_PAN | typeof ACTION.OFFSET | typeof ACTION.DOLLY | typeof ACTION.ZOOM | typeof ACTION.NONE;
type mouseWheelAction = typeof ACTION.ROTATE | typeof ACTION.TRUCK | typeof ACTION.SCREEN_PAN | typeof ACTION.OFFSET | typeof ACTION.DOLLY | typeof ACTION.ZOOM | typeof ACTION.NONE;
type singleTouchAction = typeof ACTION.TOUCH_ROTATE | typeof ACTION.TOUCH_TRUCK | typeof ACTION.TOUCH_SCREEN_PAN | typeof ACTION.TOUCH_OFFSET | typeof ACTION.DOLLY | typeof ACTION.ZOOM | typeof ACTION.NONE;
type multiTouchAction = typeof ACTION.TOUCH_DOLLY_ROTATE | typeof ACTION.TOUCH_DOLLY_TRUCK | typeof ACTION.TOUCH_DOLLY_OFFSET | typeof ACTION.TOUCH_ZOOM_ROTATE | typeof ACTION.TOUCH_ZOOM_TRUCK | typeof ACTION.TOUCH_ZOOM_OFFSET | typeof ACTION.TOUCH_DOLLY | typeof ACTION.TOUCH_ZOOM | typeof ACTION.TOUCH_ROTATE | typeof ACTION.TOUCH_TRUCK | typeof ACTION.TOUCH_SCREEN_PAN | typeof ACTION.TOUCH_OFFSET | typeof ACTION.NONE;
export interface MouseButtons {
    left: mouseButtonAction;
    middle: mouseButtonAction;
    right: mouseButtonAction;
    wheel: mouseWheelAction;
}
export interface Touches {
    one: singleTouchAction;
    two: multiTouchAction;
    three: multiTouchAction;
}
export declare const DOLLY_DIRECTION: {
    readonly NONE: 0;
    readonly IN: 1;
    readonly OUT: -1;
};
export type DOLLY_DIRECTION = typeof DOLLY_DIRECTION[keyof typeof DOLLY_DIRECTION];
export interface FitToOptions {
    cover: boolean;
    paddingLeft: number;
    paddingRight: number;
    paddingBottom: number;
    paddingTop: number;
}
export interface CameraControlsEventMap {
    update: {
        type: 'update';
    };
    wake: {
        type: 'wake';
    };
    rest: {
        type: 'rest';
    };
    sleep: {
        type: 'sleep';
    };
    transitionstart: {
        type: 'transitionstart';
    };
    controlstart: {
        type: 'controlstart';
    };
    control: {
        type: 'control';
    };
    controlend: {
        type: 'controlend';
    };
}
export declare function isPerspectiveCamera(camera: _THREE.Camera): camera is _THREE.PerspectiveCamera;
export declare function isOrthographicCamera(camera: _THREE.Camera): camera is _THREE.OrthographicCamera;
export {};
