/**
 *
 */
export declare type V3 = [x: number, y: number, z: number];
export declare function zero(): V3;
export declare function one(): V3;
export declare function add(a: V3, b: V3): V3;
export declare function addValue(a: V3, n: number): V3;
export declare function sub(a: V3, b: V3): V3;
export declare function subValue(a: V3, n: number): V3;
export declare function scale(a: V3, n: number): V3;
export declare function dot(a: V3, b: V3): number;
export declare function cross(a: V3, b: V3): V3;
/**
 * Calculate the squared length of a vector.
 * Use this when comparing two vectors instead of length, as it's more efficient (no sqrt)
 */
export declare function lengthSqr(a: V3): number;
/**
 * Calculate the length of a vector.
 * If you only need to compare lenghts, consider using the more efficient lengthSqr
 */
export declare function length(a: V3): number;
export declare function distance(a: V3, b: V3): number;
