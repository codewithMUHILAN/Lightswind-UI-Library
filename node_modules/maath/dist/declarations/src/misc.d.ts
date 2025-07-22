import { Matrix3, Plane, Vector2, Vector3 } from "three";
import type { TypedArray } from "./ctypes";
import { V3 } from "./vector3";
import { V2 } from "./vector2";
/**
 * Clamps a value between a range.
 */
export declare function clamp(value: number, min: number, max: number): number;
export declare function repeat(t: number, length: number): number;
export declare function deltaAngle(current: number, target: number): number;
/**
 * Converts degrees to radians.
 */
export declare function degToRad(degrees: number): number;
/**
 * Converts radians to degrees.
 */
export declare function radToDeg(radians: number): number;
export declare function fibonacciOnSphere(buffer: TypedArray, { radius }: {
    radius?: number | undefined;
}): void;
export declare function vectorEquals(a: any, b: any, eps?: number): boolean;
/**
 * Sorts vectors in lexicographic order, works with both v2 and v3
 *
 *  Use as:
 *  const sorted = arrayOfVectors.sort(lexicographicOrder)
 */
export declare function lexicographic(a: Vector2 | Vector3, b: Vector2 | Vector3): number;
/**
 * Convex Hull
 *
 * Returns an array of 2D Vectors representing the convex hull of a set of 2D Vectors
 */
/**
 * Calculate the convex hull of a set of points
 */
export declare function convexHull(_points: Vector2[]): Vector2[];
export declare function remap(x: number, [low1, high1]: number[], [low2, high2]: number[]): number;
/**
 *
 * https://www.desmos.com/calculator/vsnmlaljdu
 *
 * Ease-in-out, goes to -Infinite before 0 and Infinite after 1
 *
 * @param t
 * @returns
 */
export declare function fade(t: number): number;
/**
 *
 * Returns the result of linearly interpolating between input A and input B by input T.
 *
 * @param v0
 * @param v1
 * @param t
 * @returns
 */
export declare function lerp(v0: number, v1: number, t: number): number;
/**
 *
 * Returns the linear parameter that produces the interpolant specified by input T within the range of input A to input B.
 *
 * @param v0
 * @param v1
 * @param t
 * @returns
 */
export declare function inverseLerp(v0: number, v1: number, t: number): number;
/**
 *
 */
export declare function normalize(x: number, y: number, z: number): number[];
/**
 *
 */
export declare function pointOnCubeToPointOnSphere(x: number, y: number, z: number): number[];
/**
 * Give two unit vectors a and b, returns the transformation matrix that rotates a onto b.
 *
 * */
export declare function rotateVectorOnVector(a: Vector3, b: Vector3): Matrix3;
export declare function pointToCoordinate(x: number, y: number, z: number): number[];
export declare function coordinateToPoint(lat: number, lon: number): number[];
/**
 * Given a plane and a segment, return the intersection point if it exists or null it doesn't.
 */
export declare function planeSegmentIntersection(plane: Plane, segment: Vector3[]): null | Vector3;
/**
 * Given a plane and a point, return the distance.
 */
export declare function pointToPlaneDistance(p: Vector3, plane: Plane): number;
export declare function getIndexFrom3D(coords: V3, sides: V3): number;
export declare function get3DFromIndex(index: number, size: V3): V3;
export declare function getIndexFrom2D(coords: V2, size: V2): number;
export declare function get2DFromIndex(index: number, columns: number): V2;
