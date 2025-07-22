import type { TypedArray } from "./ctypes";
import { Vector2, Vector3 } from "three";
/**
 * Helpers for converting buffers to and from Three.js objects
 */
export declare function bufferToVectors(buffer: TypedArray, stride: 3): Vector3[];
export declare function bufferToVectors(buffer: TypedArray, stride: 2): Vector2[];
/**
 * Transforms a passed Vector2 or Vector3 array to a points buffer
 *
 * @param vectorArray
 * @returns
 */
export declare function vectorsToBuffer(vectorArray: Vector2[] | Vector3[]): Float32Array;
