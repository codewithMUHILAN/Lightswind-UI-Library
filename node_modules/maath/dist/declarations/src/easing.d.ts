import { Vector2, Vector3, Vector4, Euler, Color, Matrix4, Quaternion, Spherical, ColorRepresentation } from "three";
export declare const rsqw: (t: number, delta?: number, a?: number, f?: number) => number;
export declare const exp: (t: number) => number;
export declare const linear: (t: number) => number;
export declare const sine: {
    in: (x: number) => number;
    out: (x: number) => number;
    inOut: (x: number) => number;
};
export declare const cubic: {
    in: (x: number) => number;
    out: (x: number) => number;
    inOut: (x: number) => number;
};
export declare const quint: {
    in: (x: number) => number;
    out: (x: number) => number;
    inOut: (x: number) => number;
};
export declare const circ: {
    in: (x: number) => number;
    out: (x: number) => number;
    inOut: (x: number) => number;
};
export declare const quart: {
    in: (t: number) => number;
    out: (t: number) => number;
    inOut: (t: number) => number;
};
export declare const expo: {
    in: (x: number) => number;
    out: (x: number) => number;
    inOut: (x: number) => number;
};
/**
 * Damp, based on Game Programming Gems 4 Chapter 1.10
 *   Return value indicates whether the animation is still running.
 */
export declare function damp(
/** The object */
current: {
    [key: string]: any;
}, 
/** The key to animate */
prop: string, 
/** To goal value */
target: number, 
/** Approximate time to reach the target. A smaller value will reach the target faster. */
smoothTime?: number, 
/** Frame delta, for refreshrate independence */
delta?: number, 
/** Optionally allows you to clamp the maximum speed. If smoothTime is 0.25s and looks OK
 *  going between two close points but not for points far apart as it'll move very rapid,
 *  then a maxSpeed of e.g. 1 which will clamp the speed to 1 unit per second, it may now
 *  take much longer than smoothTime to reach the target if it is far away. */
maxSpeed?: number, 
/** Easing function */
easing?: (t: number) => number, 
/** End of animation precision */
eps?: number): boolean;
export declare function dampLookAt(current: THREE.Object3D, target: number | [x: number, y: number, z: number] | Vector3, smoothTime?: number, delta?: number, maxSpeed?: number, easing?: (t: number) => number, eps?: number): void;
/**
 * DampAngle, with a shortest-path
 */
export declare function dampAngle(current: {
    [key: string]: any;
}, prop: string, target: number, smoothTime?: number, delta?: number, maxSpeed?: number, easing?: (t: number) => number, eps?: number): boolean;
export declare function damp2(current: Vector2, target: number | [x: number, y: number] | Vector2, smoothTime?: number, delta?: number, maxSpeed?: number, easing?: (t: number) => number, eps?: number): boolean;
export declare function damp3(current: Vector3, target: number | [x: number, y: number, z: number] | Vector3, smoothTime?: number, delta?: number, maxSpeed?: number, easing?: (t: number) => number, eps?: number): boolean;
export declare function damp4(current: Vector4, target: number | [x: number, y: number, z: number, w: number] | Vector4, smoothTime?: number, delta?: number, maxSpeed?: number, easing?: (t: number) => number, eps?: number): boolean;
declare type EulerOrder = "XYZ" | "YXZ" | "ZXY" | "ZYX" | "YZX" | "XZY";
export declare function dampE(current: Euler, target: [x: number, y: number, z: number, order?: EulerOrder] | Euler, smoothTime?: number, delta?: number, maxSpeed?: number, easing?: (t: number) => number, eps?: number): boolean;
export declare function dampC(current: Color, target: ColorRepresentation | [r: number, g: number, b: number], smoothTime?: number, delta?: number, maxSpeed?: number, easing?: (t: number) => number, eps?: number): boolean;
export declare function dampQ(current: Quaternion, target: [x: number, y: number, z: number, w: number] | Quaternion, smoothTime?: number, delta?: number, maxSpeed?: number, easing?: (t: number) => number, eps?: number): boolean;
export declare function dampS(current: Spherical, target: [radius: number, phi: number, theta: number] | Spherical, smoothTime?: number, delta?: number, maxSpeed?: number, easing?: (t: number) => number, eps?: number): boolean;
export declare function dampM(current: Matrix4, target: [
    n11: number,
    n12: number,
    n13: number,
    n14: number,
    n21: number,
    n22: number,
    n23: number,
    n24: number,
    n31: number,
    n32: number,
    n33: number,
    n34: number,
    n41: number,
    n42: number,
    n43: number,
    n44: number
] | Matrix4, smoothTime?: number, delta?: number, maxSpeed?: number, easing?: (t: number) => number, eps?: number): boolean;
export {};
