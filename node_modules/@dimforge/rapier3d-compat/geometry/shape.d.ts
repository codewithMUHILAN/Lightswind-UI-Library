import { Vector, Rotation } from "../math";
import { RawColliderSet, RawShape } from "../raw";
import { ShapeContact } from "./contact";
import { PointProjection } from "./point";
import { Ray, RayIntersection } from "./ray";
import { ShapeTOI } from "./toi";
import { ColliderHandle } from "./collider";
export declare abstract class Shape {
    abstract intoRaw(): RawShape;
    /**
     * The concrete type of this shape.
     */
    abstract get type(): ShapeType;
    /**
     * instant mode without cache
     */
    static fromRaw(rawSet: RawColliderSet, handle: ColliderHandle): Shape;
    /**
     * Computes the time of impact between two moving shapes.
     * @param shapePos1 - The initial position of this sahpe.
     * @param shapeRot1 - The rotation of this shape.
     * @param shapeVel1 - The velocity of this shape.
     * @param shape2 - The second moving shape.
     * @param shapePos2 - The initial position of the second shape.
     * @param shapeRot2 - The rotation of the second shape.
     * @param shapeVel2 - The velocity of the second shape.
     * @param maxToi - The maximum time when the impact can happen.
     * @param stopAtPenetration - If set to `false`, the linear shape-cast won’t immediately stop if
     *   the shape is penetrating another shape at its starting point **and** its trajectory is such
     *   that it’s on a path to exist that penetration state.
     * @returns If the two moving shapes collider at some point along their trajectories, this returns the
     *  time at which the two shape collider as well as the contact information during the impact. Returns
     *  `null`if the two shapes never collide along their paths.
     */
    castShape(shapePos1: Vector, shapeRot1: Rotation, shapeVel1: Vector, shape2: Shape, shapePos2: Vector, shapeRot2: Rotation, shapeVel2: Vector, maxToi: number, stopAtPenetration: boolean): ShapeTOI | null;
    /**
     * Tests if this shape intersects another shape.
     *
     * @param shapePos1 - The position of this shape.
     * @param shapeRot1 - The rotation of this shape.
     * @param shape2  - The second shape to test.
     * @param shapePos2 - The position of the second shape.
     * @param shapeRot2 - The rotation of the second shape.
     * @returns `true` if the two shapes intersect, `false` if they don’t.
     */
    intersectsShape(shapePos1: Vector, shapeRot1: Rotation, shape2: Shape, shapePos2: Vector, shapeRot2: Rotation): boolean;
    /**
     * Computes one pair of contact points between two shapes.
     *
     * @param shapePos1 - The initial position of this sahpe.
     * @param shapeRot1 - The rotation of this shape.
     * @param shape2 - The second shape.
     * @param shapePos2 - The initial position of the second shape.
     * @param shapeRot2 - The rotation of the second shape.
     * @param prediction - The prediction value, if the shapes are separated by a distance greater than this value, test will fail.
     * @returns `null` if the shapes are separated by a distance greater than prediction, otherwise contact details. The result is given in world-space.
     */
    contactShape(shapePos1: Vector, shapeRot1: Rotation, shape2: Shape, shapePos2: Vector, shapeRot2: Rotation, prediction: number): ShapeContact | null;
    containsPoint(shapePos: Vector, shapeRot: Rotation, point: Vector): boolean;
    projectPoint(shapePos: Vector, shapeRot: Rotation, point: Vector, solid: boolean): PointProjection;
    intersectsRay(ray: Ray, shapePos: Vector, shapeRot: Rotation, maxToi: number): boolean;
    castRay(ray: Ray, shapePos: Vector, shapeRot: Rotation, maxToi: number, solid: boolean): number;
    castRayAndGetNormal(ray: Ray, shapePos: Vector, shapeRot: Rotation, maxToi: number, solid: boolean): RayIntersection;
}
/**
 * An enumeration representing the type of a shape.
 */
export declare enum ShapeType {
    Ball = 0,
    Cuboid = 1,
    Capsule = 2,
    Segment = 3,
    Polyline = 4,
    Triangle = 5,
    TriMesh = 6,
    HeightField = 7,
    ConvexPolyhedron = 9,
    Cylinder = 10,
    Cone = 11,
    RoundCuboid = 12,
    RoundTriangle = 13,
    RoundCylinder = 14,
    RoundCone = 15,
    RoundConvexPolyhedron = 16,
    HalfSpace = 17
}
/**
 * A shape that is a sphere in 3D and a circle in 2D.
 */
export declare class Ball extends Shape {
    readonly type = ShapeType.Ball;
    /**
     * The balls radius.
     */
    radius: number;
    /**
     * Creates a new ball with the given radius.
     * @param radius - The balls radius.
     */
    constructor(radius: number);
    intoRaw(): RawShape;
}
export declare class HalfSpace extends Shape {
    readonly type = ShapeType.HalfSpace;
    /**
     * The outward normal of the half-space.
     */
    normal: Vector;
    /**
     * Creates a new halfspace delimited by an infinite plane.
     *
     * @param normal - The outward normal of the plane.
     */
    constructor(normal: Vector);
    intoRaw(): RawShape;
}
/**
 * A shape that is a box in 3D and a rectangle in 2D.
 */
export declare class Cuboid extends Shape {
    readonly type = ShapeType.Cuboid;
    /**
     * The half extent of the cuboid along each coordinate axis.
     */
    halfExtents: Vector;
    /**
     * Creates a new 3D cuboid.
     * @param hx - The half width of the cuboid.
     * @param hy - The half height of the cuboid.
     * @param hz - The half depth of the cuboid.
     */
    constructor(hx: number, hy: number, hz: number);
    intoRaw(): RawShape;
}
/**
 * A shape that is a box in 3D and a rectangle in 2D, with round corners.
 */
export declare class RoundCuboid extends Shape {
    readonly type = ShapeType.RoundCuboid;
    /**
     * The half extent of the cuboid along each coordinate axis.
     */
    halfExtents: Vector;
    /**
     * The radius of the cuboid's round border.
     */
    borderRadius: number;
    /**
     * Creates a new 3D cuboid.
     * @param hx - The half width of the cuboid.
     * @param hy - The half height of the cuboid.
     * @param hz - The half depth of the cuboid.
     * @param borderRadius - The radius of the borders of this cuboid. This will
     *   effectively increase the half-extents of the cuboid by this radius.
     */
    constructor(hx: number, hy: number, hz: number, borderRadius: number);
    intoRaw(): RawShape;
}
/**
 * A shape that is a capsule.
 */
export declare class Capsule extends Shape {
    readonly type = ShapeType.Capsule;
    /**
     * The radius of the capsule's basis.
     */
    radius: number;
    /**
     * The capsule's half height, along the `y` axis.
     */
    halfHeight: number;
    /**
     * Creates a new capsule with the given radius and half-height.
     * @param halfHeight - The balls half-height along the `y` axis.
     * @param radius - The balls radius.
     */
    constructor(halfHeight: number, radius: number);
    intoRaw(): RawShape;
}
/**
 * A shape that is a segment.
 */
export declare class Segment extends Shape {
    readonly type = ShapeType.Segment;
    /**
     * The first point of the segment.
     */
    a: Vector;
    /**
     * The second point of the segment.
     */
    b: Vector;
    /**
     * Creates a new segment shape.
     * @param a - The first point of the segment.
     * @param b - The second point of the segment.
     */
    constructor(a: Vector, b: Vector);
    intoRaw(): RawShape;
}
/**
 * A shape that is a segment.
 */
export declare class Triangle extends Shape {
    readonly type = ShapeType.Triangle;
    /**
     * The first point of the triangle.
     */
    a: Vector;
    /**
     * The second point of the triangle.
     */
    b: Vector;
    /**
     * The second point of the triangle.
     */
    c: Vector;
    /**
     * Creates a new triangle shape.
     *
     * @param a - The first point of the triangle.
     * @param b - The second point of the triangle.
     * @param c - The third point of the triangle.
     */
    constructor(a: Vector, b: Vector, c: Vector);
    intoRaw(): RawShape;
}
/**
 * A shape that is a triangle with round borders and a non-zero thickness.
 */
export declare class RoundTriangle extends Shape {
    readonly type = ShapeType.RoundTriangle;
    /**
     * The first point of the triangle.
     */
    a: Vector;
    /**
     * The second point of the triangle.
     */
    b: Vector;
    /**
     * The second point of the triangle.
     */
    c: Vector;
    /**
     * The radius of the triangles's rounded edges and vertices.
     * In 3D, this is also equal to half the thickness of the round triangle.
     */
    borderRadius: number;
    /**
     * Creates a new triangle shape with round corners.
     *
     * @param a - The first point of the triangle.
     * @param b - The second point of the triangle.
     * @param c - The third point of the triangle.
     * @param borderRadius - The radius of the borders of this triangle. In 3D,
     *   this is also equal to half the thickness of the triangle.
     */
    constructor(a: Vector, b: Vector, c: Vector, borderRadius: number);
    intoRaw(): RawShape;
}
/**
 * A shape that is a triangle mesh.
 */
export declare class Polyline extends Shape {
    readonly type = ShapeType.Polyline;
    /**
     * The vertices of the polyline.
     */
    vertices: Float32Array;
    /**
     * The indices of the segments.
     */
    indices: Uint32Array;
    /**
     * Creates a new polyline shape.
     *
     * @param vertices - The coordinates of the polyline's vertices.
     * @param indices - The indices of the polyline's segments. If this is `null` or not provided, then
     *    the vertices are assumed to form a line strip.
     */
    constructor(vertices: Float32Array, indices?: Uint32Array);
    intoRaw(): RawShape;
}
/**
 * A shape that is a triangle mesh.
 */
export declare class TriMesh extends Shape {
    readonly type = ShapeType.TriMesh;
    /**
     * The vertices of the triangle mesh.
     */
    vertices: Float32Array;
    /**
     * The indices of the triangles.
     */
    indices: Uint32Array;
    /**
     * Creates a new triangle mesh shape.
     *
     * @param vertices - The coordinates of the triangle mesh's vertices.
     * @param indices - The indices of the triangle mesh's triangles.
     */
    constructor(vertices: Float32Array, indices: Uint32Array);
    intoRaw(): RawShape;
}
/**
 * A shape that is a convex polygon.
 */
export declare class ConvexPolyhedron extends Shape {
    readonly type = ShapeType.ConvexPolyhedron;
    /**
     * The vertices of the convex polygon.
     */
    vertices: Float32Array;
    /**
     * The indices of the convex polygon.
     */
    indices?: Uint32Array | null;
    /**
     * Creates a new convex polygon shape.
     *
     * @param vertices - The coordinates of the convex polygon's vertices.
     * @param indices - The index buffer of this convex mesh. If this is `null`
     *   or `undefined`, the convex-hull of the input vertices will be computed
     *   automatically. Otherwise, it will be assumed that the mesh you provide
     *   is already convex.
     */
    constructor(vertices: Float32Array, indices?: Uint32Array | null);
    intoRaw(): RawShape;
}
/**
 * A shape that is a convex polygon.
 */
export declare class RoundConvexPolyhedron extends Shape {
    readonly type = ShapeType.RoundConvexPolyhedron;
    /**
     * The vertices of the convex polygon.
     */
    vertices: Float32Array;
    /**
     * The indices of the convex polygon.
     */
    indices?: Uint32Array;
    /**
     * The radius of the convex polyhedron's rounded edges and vertices.
     */
    borderRadius: number;
    /**
     * Creates a new convex polygon shape.
     *
     * @param vertices - The coordinates of the convex polygon's vertices.
     * @param indices - The index buffer of this convex mesh. If this is `null`
     *   or `undefined`, the convex-hull of the input vertices will be computed
     *   automatically. Otherwise, it will be assumed that the mesh you provide
     *   is already convex.
     * @param borderRadius - The radius of the borders of this convex polyhedron.
     */
    constructor(vertices: Float32Array, indices: Uint32Array | null | undefined, borderRadius: number);
    intoRaw(): RawShape;
}
/**
 * A shape that is a heightfield.
 */
export declare class Heightfield extends Shape {
    readonly type = ShapeType.HeightField;
    /**
     * The number of rows in the heights matrix.
     */
    nrows: number;
    /**
     * The number of columns in the heights matrix.
     */
    ncols: number;
    /**
     * The heights of the heightfield along its local `y` axis,
     * provided as a matrix stored in column-major order.
     */
    heights: Float32Array;
    /**
     * The dimensions of the heightfield's local `x,z` plane.
     */
    scale: Vector;
    /**
     * Creates a new heightfield shape.
     *
     * @param nrows − The number of rows in the heights matrix.
     * @param ncols - The number of columns in the heights matrix.
     * @param heights - The heights of the heightfield along its local `y` axis,
     *                  provided as a matrix stored in column-major order.
     * @param scale - The dimensions of the heightfield's local `x,z` plane.
     */
    constructor(nrows: number, ncols: number, heights: Float32Array, scale: Vector);
    intoRaw(): RawShape;
}
/**
 * A shape that is a 3D cylinder.
 */
export declare class Cylinder extends Shape {
    readonly type = ShapeType.Cylinder;
    /**
     * The radius of the cylinder's basis.
     */
    radius: number;
    /**
     * The cylinder's half height, along the `y` axis.
     */
    halfHeight: number;
    /**
     * Creates a new cylinder with the given radius and half-height.
     * @param halfHeight - The balls half-height along the `y` axis.
     * @param radius - The balls radius.
     */
    constructor(halfHeight: number, radius: number);
    intoRaw(): RawShape;
}
/**
 * A shape that is a 3D cylinder with round corners.
 */
export declare class RoundCylinder extends Shape {
    readonly type = ShapeType.RoundCylinder;
    /**
     * The radius of the cylinder's basis.
     */
    radius: number;
    /**
     * The cylinder's half height, along the `y` axis.
     */
    halfHeight: number;
    /**
     * The radius of the cylinder's rounded edges and vertices.
     */
    borderRadius: number;
    /**
     * Creates a new cylinder with the given radius and half-height.
     * @param halfHeight - The balls half-height along the `y` axis.
     * @param radius - The balls radius.
     * @param borderRadius - The radius of the borders of this cylinder.
     */
    constructor(halfHeight: number, radius: number, borderRadius: number);
    intoRaw(): RawShape;
}
/**
 * A shape that is a 3D cone.
 */
export declare class Cone extends Shape {
    readonly type = ShapeType.Cone;
    /**
     * The radius of the cone's basis.
     */
    radius: number;
    /**
     * The cone's half height, along the `y` axis.
     */
    halfHeight: number;
    /**
     * Creates a new cone with the given radius and half-height.
     * @param halfHeight - The balls half-height along the `y` axis.
     * @param radius - The balls radius.
     */
    constructor(halfHeight: number, radius: number);
    intoRaw(): RawShape;
}
/**
 * A shape that is a 3D cone with round corners.
 */
export declare class RoundCone extends Shape {
    readonly type = ShapeType.RoundCone;
    /**
     * The radius of the cone's basis.
     */
    radius: number;
    /**
     * The cone's half height, along the `y` axis.
     */
    halfHeight: number;
    /**
     * The radius of the cylinder's rounded edges and vertices.
     */
    borderRadius: number;
    /**
     * Creates a new cone with the given radius and half-height.
     * @param halfHeight - The balls half-height along the `y` axis.
     * @param radius - The balls radius.
     * @param borderRadius - The radius of the borders of this cone.
     */
    constructor(halfHeight: number, radius: number, borderRadius: number);
    intoRaw(): RawShape;
}
