import { Collider } from "./collider";
import { Vector } from "../math";
import { RawShapeTOI, RawShapeColliderTOI } from "../raw";
import { ColliderSet } from "./collider_set";
/**
 * The intersection between a ray and a collider.
 */
export declare class ShapeTOI {
    /**
     * The time of impact of the two shapes.
     */
    toi: number;
    /**
     * The local-space contact point on the first shape, at
     * the time of impact.
     */
    witness1: Vector;
    /**
     * The local-space contact point on the second shape, at
     * the time of impact.
     */
    witness2: Vector;
    /**
     * The local-space normal on the first shape, at
     * the time of impact.
     */
    normal1: Vector;
    /**
     * The local-space normal on the second shape, at
     * the time of impact.
     */
    normal2: Vector;
    constructor(toi: number, witness1: Vector, witness2: Vector, normal1: Vector, normal2: Vector);
    static fromRaw(colliderSet: ColliderSet, raw: RawShapeTOI): ShapeTOI;
}
/**
 * The intersection between a ray and a collider.
 */
export declare class ShapeColliderTOI extends ShapeTOI {
    /**
     * The handle of the collider hit by the ray.
     */
    collider: Collider;
    constructor(collider: Collider, toi: number, witness1: Vector, witness2: Vector, normal1: Vector, normal2: Vector);
    static fromRaw(colliderSet: ColliderSet, raw: RawShapeColliderTOI): ShapeColliderTOI;
}
