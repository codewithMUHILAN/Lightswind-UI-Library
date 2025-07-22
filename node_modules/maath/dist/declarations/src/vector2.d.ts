/**
 *
 */
export declare type V2 = [x: number, y: number];
export declare function zero(): V2;
export declare function one(): V2;
export declare function add(a: V2, b: V2): V2;
export declare function addValue(a: V2, n: number): V2;
export declare function sub(a: V2, b: V2): V2;
export declare function subValue(a: V2, n: number): V2;
export declare function scale(a: V2, n: number): V2;
export declare function dot(a: V2, b: V2): number;
/**
 * Calculate the squared length of a vector.
 * Use this when comparing two vectors instead of length, as it's more efficient (no sqrt)
 */
export declare function lengthSqr(a: V2): number;
/**
 * Calculate the length of a vector.
 * If you only need to compare lenghts, consider using the more efficient lengthSqr
 */
export declare function length(a: V2): number;
export declare function distance(a: V2, b: V2): number;
