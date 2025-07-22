import { RawVector, RawRotation } from "./raw";
import { RawSdpMatrix3 } from "./raw";
export interface Vector {
    x: number;
    y: number;
    z: number;
}
/**
 * A 3D vector.
 */
export declare class Vector3 implements Vector {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
}
export declare class VectorOps {
    static new(x: number, y: number, z: number): Vector;
    static intoRaw(v: Vector): RawVector;
    static zeros(): Vector;
    static fromRaw(raw: RawVector): Vector;
    static copy(out: Vector, input: Vector): void;
}
export interface Rotation {
    x: number;
    y: number;
    z: number;
    w: number;
}
/**
 * A quaternion.
 */
export declare class Quaternion implements Rotation {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x: number, y: number, z: number, w: number);
}
export declare class RotationOps {
    static identity(): Rotation;
    static fromRaw(raw: RawRotation): Rotation;
    static intoRaw(rot: Rotation): RawRotation;
    static copy(out: Rotation, input: Rotation): void;
}
/**
 * A 3D symmetric-positive-definite matrix.
 */
export declare class SdpMatrix3 {
    /**
     * Row major list of the upper-triangular part of the symmetric matrix.
     */
    elements: Float32Array;
    /**
     * Matrix element at row 1, column 1.
     */
    get m11(): number;
    /**
     * Matrix element at row 1, column 2.
     */
    get m12(): number;
    /**
     * Matrix element at row 2, column 1.
     */
    get m21(): number;
    /**
     * Matrix element at row 1, column 3.
     */
    get m13(): number;
    /**
     * Matrix element at row 3, column 1.
     */
    get m31(): number;
    /**
     * Matrix element at row 2, column 2.
     */
    get m22(): number;
    /**
     * Matrix element at row 2, column 3.
     */
    get m23(): number;
    /**
     * Matrix element at row 3, column 2.
     */
    get m32(): number;
    /**
     * Matrix element at row 3, column 3.
     */
    get m33(): number;
    constructor(elements: Float32Array);
}
export declare class SdpMatrix3Ops {
    static fromRaw(raw: RawSdpMatrix3): SdpMatrix3;
}
