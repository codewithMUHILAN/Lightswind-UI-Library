import type { TypedArray } from "../ctypes";
export declare class FlashGen {
    nextBurstTime: number;
    nextFlashEndTime: number;
    flashesDone: number;
    isFlashing: boolean;
    currentCount: number;
    flashIntensity: number;
    isDecaying: boolean;
    autoBurst: boolean;
    decaySpeed: number;
    minInterval: number;
    maxInterval: number;
    minDuration: number;
    maxDuration: number;
    count: number;
    constructor(props: {
        decaySpeed?: number;
        minInterval?: number;
        maxInterval?: number;
        minDuration?: number;
        maxDuration?: number;
        count?: number;
    });
    scheduleNextBurst(currentTime: number): void;
    burst(): void;
    update(currentTime: number, delta: number): number;
}
export declare class Generator {
    seed: string | number;
    constructor(seed: string | number);
    init: (seed: number | string) => void;
    value: () => number;
}
/***
 * [3D] Sphere
 */
declare type Sphere = {
    radius?: number;
    center?: number[];
};
export declare function onSphere(buffer: TypedArray, sphere?: Sphere, rng?: Generator): TypedArray;
export declare function inSphere(buffer: TypedArray, sphere?: Sphere, rng?: Generator): TypedArray;
/***
 * [2D] Circle
 */
declare type Circle = {
    radius?: number;
    center?: number[];
};
export declare function inCircle(buffer: TypedArray, circle?: Circle, rng?: Generator): TypedArray;
export declare function onCircle(buffer: TypedArray, circle?: Circle, rng?: Generator): TypedArray;
/**
 * [2D] Plane
 */
declare type Rect = {
    sides: number | number[];
};
export declare function inRect<T extends TypedArray>(buffer: T, rect?: Rect, rng?: Generator): T;
export declare function onRect(buffer: TypedArray, rect?: Rect, rng?: Generator): TypedArray;
/***
 * [3D] Box
 */
export declare function inBox(buffer: TypedArray, box?: Box, rng?: Generator): TypedArray;
declare type Box = {
    sides?: number[] | number;
    center?: number[];
};
export declare function onBox(buffer: TypedArray, box?: Box, rng?: Generator): TypedArray;
export * as noise from "./noise";
