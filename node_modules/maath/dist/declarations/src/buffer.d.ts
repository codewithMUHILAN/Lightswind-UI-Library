/**
 * Conventions:
 * 1. try to avoid threejs dependencies, TBD how to solve them
 * 2. use overload signatures to support stride 2 and 3 with ok typing
 */
import { Quaternion } from "three";
import type { TypedArray, MyVector2, MyVector3 } from "./ctypes";
import * as v2 from "./vector2";
import * as v3 from "./vector3";
export declare function swizzle(buffer: TypedArray, stride?: number, swizzle?: string): TypedArray;
/**
 * @param buffer A stride 2 points buffer
 * @param valueGenerator A function that returns the value of the z axis at index i
 * @returns
 */
export declare function addAxis(buffer: TypedArray, size: number, valueGenerator?: (j: number) => number): TypedArray;
/**
 * Lerps bufferA and bufferB into final
 *
 * @param bufferA
 * @param bufferB
 * @param final
 * @param t
 */
export declare function lerp(bufferA: TypedArray, bufferB: TypedArray, final: TypedArray, t: number): void;
/**
 *
 * Translate all points in the passed buffer by the passed translactionVector.
 *
 * @param buffer
 * @param translationVector
 * @returns
 */
export declare function translate(buffer: TypedArray, translationVector: MyVector2 | MyVector3): TypedArray;
export declare function rotate(buffer: TypedArray, rotation: {
    q: Quaternion;
    center?: number[];
}): TypedArray;
export declare function map(buffer: TypedArray, stride: 2, fn: (v: v2.V2, i: number) => number[]): TypedArray;
export declare function map(buffer: TypedArray, stride: 3, fn: (v: v3.V3, i: number) => number[]): TypedArray;
/**
 * Reduces passed buffer
 */
declare type IReduceCallback<T> = (final: T, point: v2.V2, i: number) => T;
export declare function reduce<T>(b: TypedArray, stride: 2, callback: IReduceCallback<T>, acc: T): T;
export declare function reduce<T>(b: TypedArray, stride: 3, callback: IReduceCallback<T>, acc: T): T;
declare type ExpandOptions = {
    center?: [number, number];
    distance: number;
};
export declare function expand(b: TypedArray, stride: 2 | 3, opts: ExpandOptions): TypedArray;
export declare function center(myBuffer: TypedArray, stride: 2): v2.V2;
export declare function center(myBuffer: TypedArray, stride: 3): v3.V3;
declare type ISortingCallback<T> = (a: T, b: T) => number;
export declare function sort(myBuffer: TypedArray, stride: 2, callback: ISortingCallback<v2.V2>): TypedArray;
export declare function sort(myBuffer: TypedArray, stride: 3, callback: ISortingCallback<v3.V3>): TypedArray;
export {};
