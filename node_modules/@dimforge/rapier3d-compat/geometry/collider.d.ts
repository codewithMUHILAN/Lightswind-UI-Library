import { Rotation, Vector } from "../math";
import { CoefficientCombineRule, RigidBody, RigidBodySet } from "../dynamics";
import { ActiveHooks, ActiveEvents } from "../pipeline";
import { InteractionGroups } from "./interaction_groups";
import { Shape, ShapeType } from "./shape";
import { Ray, RayIntersection } from "./ray";
import { PointProjection } from "./point";
import { ShapeColliderTOI, ShapeTOI } from "./toi";
import { ShapeContact } from "./contact";
import { ColliderSet } from "./collider_set";
/**
 * Flags affecting whether collision-detection happens between two colliders
 * depending on the type of rigid-bodies they are attached to.
 */
export declare enum ActiveCollisionTypes {
    /**
     * Enable collision-detection between a collider attached to a dynamic body
     * and another collider attached to a dynamic body.
     */
    DYNAMIC_DYNAMIC = 1,
    /**
     * Enable collision-detection between a collider attached to a dynamic body
     * and another collider attached to a kinematic body.
     */
    DYNAMIC_KINEMATIC = 12,
    /**
     * Enable collision-detection between a collider attached to a dynamic body
     * and another collider attached to a fixed body (or not attached to any body).
     */
    DYNAMIC_FIXED = 2,
    /**
     * Enable collision-detection between a collider attached to a kinematic body
     * and another collider attached to a kinematic body.
     */
    KINEMATIC_KINEMATIC = 52224,
    /**
     * Enable collision-detection between a collider attached to a kinematic body
     * and another collider attached to a fixed body (or not attached to any body).
     */
    KINEMATIC_FIXED = 8704,
    /**
     * Enable collision-detection between a collider attached to a fixed body (or
     * not attached to any body) and another collider attached to a fixed body (or
     * not attached to any body).
     */
    FIXED_FIXED = 32,
    /**
     * The default active collision types, enabling collisions between a dynamic body
     * and another body of any type, but not enabling collisions between two non-dynamic bodies.
     */
    DEFAULT = 15,
    /**
     * Enable collisions between any kind of rigid-bodies (including between two non-dynamic bodies).
     */
    ALL = 60943
}
/**
 * The integer identifier of a collider added to a `ColliderSet`.
 */
export declare type ColliderHandle = number;
/**
 * A geometric entity that can be attached to a body so it can be affected
 * by contacts and proximity queries.
 */
export declare class Collider {
    private colliderSet;
    readonly handle: ColliderHandle;
    private _shape;
    private _parent;
    constructor(colliderSet: ColliderSet, handle: ColliderHandle, parent: RigidBody | null, shape?: Shape);
    /** @internal */
    finalizeDeserialization(bodies: RigidBodySet): void;
    private ensureShapeIsCached;
    /**
     * The shape of this collider.
     */
    get shape(): Shape;
    /**
     * Checks if this collider is still valid (i.e. that it has
     * not been deleted from the collider set yet).
     */
    isValid(): boolean;
    /**
     * The world-space translation of this rigid-body.
     */
    translation(): Vector;
    /**
     * The world-space orientation of this rigid-body.
     */
    rotation(): Rotation;
    /**
     * Is this collider a sensor?
     */
    isSensor(): boolean;
    /**
     * Sets whether or not this collider is a sensor.
     * @param isSensor - If `true`, the collider will be a sensor.
     */
    setSensor(isSensor: boolean): void;
    /**
     * Sets the new shape of the collider.
     * @param shape - The collider’s new shape.
     */
    setShape(shape: Shape): void;
    /**
     * Sets whether this collider is enabled or not.
     *
     * @param enabled - Set to `false` to disable this collider (its parent rigid-body won’t be disabled automatically by this).
     */
    setEnabled(enabled: boolean): void;
    /**
     * Is this collider enabled?
     */
    isEnabled(): boolean;
    /**
     * Sets the restitution coefficient of the collider to be created.
     *
     * @param restitution - The restitution coefficient in `[0, 1]`. A value of 0 (the default) means no bouncing behavior
     *                   while 1 means perfect bouncing (though energy may still be lost due to numerical errors of the
     *                   constraints solver).
     */
    setRestitution(restitution: number): void;
    /**
     * Sets the friction coefficient of the collider to be created.
     *
     * @param friction - The friction coefficient. Must be greater or equal to 0. This is generally smaller than 1. The
     *                   higher the coefficient, the stronger friction forces will be for contacts with the collider
     *                   being built.
     */
    setFriction(friction: number): void;
    /**
     * Gets the rule used to combine the friction coefficients of two colliders
     * colliders involved in a contact.
     */
    frictionCombineRule(): CoefficientCombineRule;
    /**
     * Sets the rule used to combine the friction coefficients of two colliders
     * colliders involved in a contact.
     *
     * @param rule − The combine rule to apply.
     */
    setFrictionCombineRule(rule: CoefficientCombineRule): void;
    /**
     * Gets the rule used to combine the restitution coefficients of two colliders
     * colliders involved in a contact.
     */
    restitutionCombineRule(): CoefficientCombineRule;
    /**
     * Sets the rule used to combine the restitution coefficients of two colliders
     * colliders involved in a contact.
     *
     * @param rule − The combine rule to apply.
     */
    setRestitutionCombineRule(rule: CoefficientCombineRule): void;
    /**
     * Sets the collision groups used by this collider.
     *
     * Two colliders will interact iff. their collision groups are compatible.
     * See the documentation of `InteractionGroups` for details on teh used bit pattern.
     *
     * @param groups - The collision groups used for the collider being built.
     */
    setCollisionGroups(groups: InteractionGroups): void;
    /**
     * Sets the solver groups used by this collider.
     *
     * Forces between two colliders in contact will be computed iff their solver
     * groups are compatible.
     * See the documentation of `InteractionGroups` for details on the used bit pattern.
     *
     * @param groups - The solver groups used for the collider being built.
     */
    setSolverGroups(groups: InteractionGroups): void;
    /**
     * Get the physics hooks active for this collider.
     */
    activeHooks(): number;
    /**
     * Set the physics hooks active for this collider.
     *
     * Use this to enable custom filtering rules for contact/intersecstion pairs involving this collider.
     *
     * @param activeHooks - The hooks active for contact/intersection pairs involving this collider.
     */
    setActiveHooks(activeHooks: ActiveHooks): void;
    /**
     * The events active for this collider.
     */
    activeEvents(): ActiveEvents;
    /**
     * Set the events active for this collider.
     *
     * Use this to enable contact and/or intersection event reporting for this collider.
     *
     * @param activeEvents - The events active for contact/intersection pairs involving this collider.
     */
    setActiveEvents(activeEvents: ActiveEvents): void;
    /**
     * Gets the collision types active for this collider.
     */
    activeCollisionTypes(): ActiveCollisionTypes;
    /**
     * Sets the total force magnitude beyond which a contact force event can be emitted.
     *
     * @param threshold - The new force threshold.
     */
    setContactForceEventThreshold(threshold: number): void;
    /**
     * The total force magnitude beyond which a contact force event can be emitted.
     */
    contactForceEventThreshold(): number;
    /**
     * Set the collision types active for this collider.
     *
     * @param activeCollisionTypes - The hooks active for contact/intersection pairs involving this collider.
     */
    setActiveCollisionTypes(activeCollisionTypes: ActiveCollisionTypes): void;
    /**
     * Sets the uniform density of this collider.
     *
     * This will override any previous mass-properties set by `this.setDensity`,
     * `this.setMass`, `this.setMassProperties`, `ColliderDesc.density`,
     * `ColliderDesc.mass`, or `ColliderDesc.massProperties` for this collider.
     *
     * The mass and angular inertia of this collider will be computed automatically based on its
     * shape.
     */
    setDensity(density: number): void;
    /**
     * Sets the mass of this collider.
     *
     * This will override any previous mass-properties set by `this.setDensity`,
     * `this.setMass`, `this.setMassProperties`, `ColliderDesc.density`,
     * `ColliderDesc.mass`, or `ColliderDesc.massProperties` for this collider.
     *
     * The angular inertia of this collider will be computed automatically based on its shape
     * and this mass value.
     */
    setMass(mass: number): void;
    /**
     * Sets the mass of this collider.
     *
     * This will override any previous mass-properties set by `this.setDensity`,
     * `this.setMass`, `this.setMassProperties`, `ColliderDesc.density`,
     * `ColliderDesc.mass`, or `ColliderDesc.massProperties` for this collider.
     */
    setMassProperties(mass: number, centerOfMass: Vector, principalAngularInertia: Vector, angularInertiaLocalFrame: Rotation): void;
    /**
     * Sets the translation of this collider.
     *
     * @param tra - The world-space position of the collider.
     */
    setTranslation(tra: Vector): void;
    /**
     * Sets the translation of this collider relative to its parent rigid-body.
     *
     * Does nothing if this collider isn't attached to a rigid-body.
     *
     * @param tra - The new translation of the collider relative to its parent.
     */
    setTranslationWrtParent(tra: Vector): void;
    /**
     * Sets the rotation quaternion of this collider.
     *
     * This does nothing if a zero quaternion is provided.
     *
     * @param rotation - The rotation to set.
     */
    setRotation(rot: Rotation): void;
    /**
     * Sets the rotation quaternion of this collider relative to its parent rigid-body.
     *
     * This does nothing if a zero quaternion is provided or if this collider isn't
     * attached to a rigid-body.
     *
     * @param rotation - The rotation to set.
     */
    setRotationWrtParent(rot: Rotation): void;
    /**
     * The type of the shape of this collider.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    shapeType(): ShapeType;
    /**
     * The half-extents of this collider if it is a cuboid shape.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    halfExtents(): Vector;
    /**
     * Sets the half-extents of this collider if it is a cuboid shape.
     *
     * @param newHalfExtents - desired half extents.
     */
    setHalfExtents(newHalfExtents: Vector): void;
    /**
     * The radius of this collider if it is a ball, cylinder, capsule, or cone shape.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    radius(): number;
    /**
     * Sets the radius of this collider if it is a ball, cylinder, capsule, or cone shape.
     *
     * @param newRadius - desired radius.
     */
    setRadius(newRadius: number): void;
    /**
     * The radius of the round edges of this collider if it is a round cylinder.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    roundRadius(): number;
    /**
     * Sets the radius of the round edges of this collider if it has round edges.
     *
     * @param newBorderRadius - desired round edge radius.
     */
    setRoundRadius(newBorderRadius: number): void;
    /**
     * The half height of this collider if it is a cylinder, capsule, or cone shape.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    halfHeight(): number;
    /**
     * Sets the half height of this collider if it is a cylinder, capsule, or cone shape.
     *
     * @param newHalfheight - desired half height.
     */
    setHalfHeight(newHalfheight: number): void;
    /**
     * If this collider has a triangle mesh, polyline, convex polygon, or convex polyhedron shape,
     * this returns the vertex buffer of said shape.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    vertices(): Float32Array;
    /**
     * If this collider has a triangle mesh, polyline, or convex polyhedron shape,
     * this returns the index buffer of said shape.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    indices(): Uint32Array | undefined;
    /**
     * If this collider has a heightfield shape, this returns the heights buffer of
     * the heightfield.
     * In 3D, the returned height matrix is provided in column-major order.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    heightfieldHeights(): Float32Array;
    /**
     * If this collider has a heightfield shape, this returns the scale
     * applied to it.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    heightfieldScale(): Vector;
    /**
     * If this collider has a heightfield shape, this returns the number of
     * rows of its height matrix.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    heightfieldNRows(): number;
    /**
     * If this collider has a heightfield shape, this returns the number of
     * columns of its height matrix.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    heightfieldNCols(): number;
    /**
     * The rigid-body this collider is attached to.
     */
    parent(): RigidBody | null;
    /**
     * The friction coefficient of this collider.
     */
    friction(): number;
    /**
     * The restitution coefficient of this collider.
     */
    restitution(): number;
    /**
     * The density of this collider.
     */
    density(): number;
    /**
     * The mass of this collider.
     */
    mass(): number;
    /**
     * The volume of this collider.
     */
    volume(): number;
    /**
     * The collision groups of this collider.
     */
    collisionGroups(): InteractionGroups;
    /**
     * The solver groups of this collider.
     */
    solverGroups(): InteractionGroups;
    /**
     * Tests if this collider contains a point.
     *
     * @param point - The point to test.
     */
    containsPoint(point: Vector): boolean;
    /**
     * Find the projection of a point on this collider.
     *
     * @param point - The point to project.
     * @param solid - If this is set to `true` then the collider shapes are considered to
     *   be plain (if the point is located inside of a plain shape, its projection is the point
     *   itself). If it is set to `false` the collider shapes are considered to be hollow
     *   (if the point is located inside of an hollow shape, it is projected on the shape's
     *   boundary).
     */
    projectPoint(point: Vector, solid: boolean): PointProjection | null;
    /**
     * Tests if this collider intersects the given ray.
     *
     * @param ray - The ray to cast.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the length of the ray to `ray.dir.norm() * maxToi`.
     */
    intersectsRay(ray: Ray, maxToi: number): boolean;
    castShape(collider1Vel: Vector, shape2: Shape, shape2Pos: Vector, shape2Rot: Rotation, shape2Vel: Vector, maxToi: number, stopAtPenetration: boolean): ShapeTOI | null;
    castCollider(collider1Vel: Vector, collider2: Collider, collider2Vel: Vector, maxToi: number, stopAtPenetration: boolean): ShapeColliderTOI | null;
    intersectsShape(shape2: Shape, shapePos2: Vector, shapeRot2: Rotation): boolean;
    /**
     * Computes one pair of contact points between the shape owned by this collider and the given shape.
     *
     * @param shape2 - The second shape.
     * @param shape2Pos - The initial position of the second shape.
     * @param shape2Rot - The rotation of the second shape.
     * @param prediction - The prediction value, if the shapes are separated by a distance greater than this value, test will fail.
     * @returns `null` if the shapes are separated by a distance greater than prediction, otherwise contact details. The result is given in world-space.
     */
    contactShape(shape2: Shape, shape2Pos: Vector, shape2Rot: Rotation, prediction: number): ShapeContact | null;
    /**
     * Computes one pair of contact points between the collider and the given collider.
     *
     * @param collider2 - The second collider.
     * @param prediction - The prediction value, if the shapes are separated by a distance greater than this value, test will fail.
     * @returns `null` if the shapes are separated by a distance greater than prediction, otherwise contact details. The result is given in world-space.
     */
    contactCollider(collider2: Collider, prediction: number): ShapeContact | null;
    castRay(ray: Ray, maxToi: number, solid: boolean): number;
    /**
     * Find the closest intersection between a ray and this collider.
     *
     * This also computes the normal at the hit point.
     * @param ray - The ray to cast.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the length of the ray to `ray.dir.norm() * maxToi`.
     * @param solid - If `false` then the ray will attempt to hit the boundary of a shape, even if its
     *   origin already lies inside of a shape. In other terms, `true` implies that all shapes are plain,
     *   whereas `false` implies that all shapes are hollow for this ray-cast.
     */
    castRayAndGetNormal(ray: Ray, maxToi: number, solid: boolean): RayIntersection | null;
}
export declare enum MassPropsMode {
    Density = 0,
    Mass = 1,
    MassProps = 2
}
export declare class ColliderDesc {
    enabled: boolean;
    shape: Shape;
    massPropsMode: MassPropsMode;
    mass: number;
    centerOfMass: Vector;
    principalAngularInertia: Vector;
    angularInertiaLocalFrame: Rotation;
    density: number;
    friction: number;
    restitution: number;
    rotation: Rotation;
    translation: Vector;
    isSensor: boolean;
    collisionGroups: InteractionGroups;
    solverGroups: InteractionGroups;
    frictionCombineRule: CoefficientCombineRule;
    restitutionCombineRule: CoefficientCombineRule;
    activeEvents: ActiveEvents;
    activeHooks: ActiveHooks;
    activeCollisionTypes: ActiveCollisionTypes;
    contactForceEventThreshold: number;
    /**
     * Initializes a collider descriptor from the collision shape.
     *
     * @param shape - The shape of the collider being built.
     */
    constructor(shape: Shape);
    /**
     * Create a new collider descriptor with a ball shape.
     *
     * @param radius - The radius of the ball.
     */
    static ball(radius: number): ColliderDesc;
    /**
     * Create a new collider descriptor with a capsule shape.
     *
     * @param halfHeight - The half-height of the capsule, along the `y` axis.
     * @param radius - The radius of the capsule basis.
     */
    static capsule(halfHeight: number, radius: number): ColliderDesc;
    /**
     * Creates a new segment shape.
     *
     * @param a - The first point of the segment.
     * @param b - The second point of the segment.
     */
    static segment(a: Vector, b: Vector): ColliderDesc;
    /**
     * Creates a new triangle shape.
     *
     * @param a - The first point of the triangle.
     * @param b - The second point of the triangle.
     * @param c - The third point of the triangle.
     */
    static triangle(a: Vector, b: Vector, c: Vector): ColliderDesc;
    /**
     * Creates a new triangle shape with round corners.
     *
     * @param a - The first point of the triangle.
     * @param b - The second point of the triangle.
     * @param c - The third point of the triangle.
     * @param borderRadius - The radius of the borders of this triangle. In 3D,
     *   this is also equal to half the thickness of the triangle.
     */
    static roundTriangle(a: Vector, b: Vector, c: Vector, borderRadius: number): ColliderDesc;
    /**
     * Creates a new collider descriptor with a polyline shape.
     *
     * @param vertices - The coordinates of the polyline's vertices.
     * @param indices - The indices of the polyline's segments. If this is `undefined` or `null`,
     *    the vertices are assumed to describe a line strip.
     */
    static polyline(vertices: Float32Array, indices?: Uint32Array | null): ColliderDesc;
    /**
     * Creates a new collider descriptor with a triangle mesh shape.
     *
     * @param vertices - The coordinates of the triangle mesh's vertices.
     * @param indices - The indices of the triangle mesh's triangles.
     */
    static trimesh(vertices: Float32Array, indices: Uint32Array): ColliderDesc;
    /**
     * Creates a new collider descriptor with a cuboid shape.
     *
     * @param hx - The half-width of the rectangle along its local `x` axis.
     * @param hy - The half-width of the rectangle along its local `y` axis.
     * @param hz - The half-width of the rectangle along its local `z` axis.
     */
    static cuboid(hx: number, hy: number, hz: number): ColliderDesc;
    /**
     * Creates a new collider descriptor with a rectangular shape with round borders.
     *
     * @param hx - The half-width of the rectangle along its local `x` axis.
     * @param hy - The half-width of the rectangle along its local `y` axis.
     * @param hz - The half-width of the rectangle along its local `z` axis.
     * @param borderRadius - The radius of the cuboid's borders.
     */
    static roundCuboid(hx: number, hy: number, hz: number, borderRadius: number): ColliderDesc;
    /**
     * Creates a new collider descriptor with a heightfield shape.
     *
     * @param nrows − The number of rows in the heights matrix.
     * @param ncols - The number of columns in the heights matrix.
     * @param heights - The heights of the heightfield along its local `y` axis,
     *                  provided as a matrix stored in column-major order.
     * @param scale - The scale factor applied to the heightfield.
     */
    static heightfield(nrows: number, ncols: number, heights: Float32Array, scale: Vector): ColliderDesc;
    /**
     * Create a new collider descriptor with a cylinder shape.
     *
     * @param halfHeight - The half-height of the cylinder, along the `y` axis.
     * @param radius - The radius of the cylinder basis.
     */
    static cylinder(halfHeight: number, radius: number): ColliderDesc;
    /**
     * Create a new collider descriptor with a cylinder shape with rounded corners.
     *
     * @param halfHeight - The half-height of the cylinder, along the `y` axis.
     * @param radius - The radius of the cylinder basis.
     * @param borderRadius - The radius of the cylinder's rounded edges and vertices.
     */
    static roundCylinder(halfHeight: number, radius: number, borderRadius: number): ColliderDesc;
    /**
     * Create a new collider descriptor with a cone shape.
     *
     * @param halfHeight - The half-height of the cone, along the `y` axis.
     * @param radius - The radius of the cone basis.
     */
    static cone(halfHeight: number, radius: number): ColliderDesc;
    /**
     * Create a new collider descriptor with a cone shape with rounded corners.
     *
     * @param halfHeight - The half-height of the cone, along the `y` axis.
     * @param radius - The radius of the cone basis.
     * @param borderRadius - The radius of the cone's rounded edges and vertices.
     */
    static roundCone(halfHeight: number, radius: number, borderRadius: number): ColliderDesc;
    /**
     * Computes the convex-hull of the given points and use the resulting
     * convex polyhedron as the shape for this new collider descriptor.
     *
     * @param points - The point that will be used to compute the convex-hull.
     */
    static convexHull(points: Float32Array): ColliderDesc | null;
    /**
     * Creates a new collider descriptor that uses the given set of points assumed
     * to form a convex polyline (no convex-hull computation will be done).
     *
     * @param vertices - The vertices of the convex polyline.
     */
    static convexMesh(vertices: Float32Array, indices?: Uint32Array | null): ColliderDesc | null;
    /**
     * Computes the convex-hull of the given points and use the resulting
     * convex polyhedron as the shape for this new collider descriptor. A
     * border is added to that convex polyhedron to give it round corners.
     *
     * @param points - The point that will be used to compute the convex-hull.
     * @param borderRadius - The radius of the round border added to the convex polyhedron.
     */
    static roundConvexHull(points: Float32Array, borderRadius: number): ColliderDesc | null;
    /**
     * Creates a new collider descriptor that uses the given set of points assumed
     * to form a round convex polyline (no convex-hull computation will be done).
     *
     * @param vertices - The vertices of the convex polyline.
     * @param borderRadius - The radius of the round border added to the convex polyline.
     */
    static roundConvexMesh(vertices: Float32Array, indices: Uint32Array | null, borderRadius: number): ColliderDesc | null;
    /**
     * Sets the position of the collider to be created relative to the rigid-body it is attached to.
     */
    setTranslation(x: number, y: number, z: number): ColliderDesc;
    /**
     * Sets the rotation of the collider to be created relative to the rigid-body it is attached to.
     *
     * @param rot - The rotation of the collider to be created relative to the rigid-body it is attached to.
     */
    setRotation(rot: Rotation): ColliderDesc;
    /**
     * Sets whether or not the collider being created is a sensor.
     *
     * A sensor collider does not take part of the physics simulation, but generates
     * proximity events.
     *
     * @param sensor - Set to `true` of the collider built is to be a sensor.
     */
    setSensor(sensor: boolean): ColliderDesc;
    /**
     * Sets whether the created collider will be enabled or disabled.
     * @param enabled − If set to `false` the collider will be disabled at creation.
     */
    setEnabled(enabled: boolean): ColliderDesc;
    /**
     * Sets the density of the collider being built.
     *
     * The mass and angular inertia tensor will be computed automatically based on this density and the collider’s shape.
     *
     * @param density - The density to set, must be greater or equal to 0. A density of 0 means that this collider
     *                  will not affect the mass or angular inertia of the rigid-body it is attached to.
     */
    setDensity(density: number): ColliderDesc;
    /**
     * Sets the mass of the collider being built.
     *
     * The angular inertia tensor will be computed automatically based on this mass and the collider’s shape.
     *
     * @param mass - The mass to set, must be greater or equal to 0.
     */
    setMass(mass: number): ColliderDesc;
    /**
     * Sets the mass properties of the collider being built.
     *
     * This replaces the mass-properties automatically computed from the collider's density and shape.
     * These mass-properties will be added to the mass-properties of the rigid-body this collider will be attached to.
     *
     * @param mass − The mass of the collider to create.
     * @param centerOfMass − The center-of-mass of the collider to create.
     * @param principalAngularInertia − The initial principal angular inertia of the collider to create.
     *                                  These are the eigenvalues of the angular inertia matrix.
     * @param angularInertiaLocalFrame − The initial local angular inertia frame of the collider to create.
     *                                   These are the eigenvectors of the angular inertia matrix.
     */
    setMassProperties(mass: number, centerOfMass: Vector, principalAngularInertia: Vector, angularInertiaLocalFrame: Rotation): ColliderDesc;
    /**
     * Sets the restitution coefficient of the collider to be created.
     *
     * @param restitution - The restitution coefficient in `[0, 1]`. A value of 0 (the default) means no bouncing behavior
     *                   while 1 means perfect bouncing (though energy may still be lost due to numerical errors of the
     *                   constraints solver).
     */
    setRestitution(restitution: number): ColliderDesc;
    /**
     * Sets the friction coefficient of the collider to be created.
     *
     * @param friction - The friction coefficient. Must be greater or equal to 0. This is generally smaller than 1. The
     *                   higher the coefficient, the stronger friction forces will be for contacts with the collider
     *                   being built.
     */
    setFriction(friction: number): ColliderDesc;
    /**
     * Sets the rule used to combine the friction coefficients of two colliders
     * colliders involved in a contact.
     *
     * @param rule − The combine rule to apply.
     */
    setFrictionCombineRule(rule: CoefficientCombineRule): ColliderDesc;
    /**
     * Sets the rule used to combine the restitution coefficients of two colliders
     * colliders involved in a contact.
     *
     * @param rule − The combine rule to apply.
     */
    setRestitutionCombineRule(rule: CoefficientCombineRule): ColliderDesc;
    /**
     * Sets the collision groups used by this collider.
     *
     * Two colliders will interact iff. their collision groups are compatible.
     * See the documentation of `InteractionGroups` for details on teh used bit pattern.
     *
     * @param groups - The collision groups used for the collider being built.
     */
    setCollisionGroups(groups: InteractionGroups): ColliderDesc;
    /**
     * Sets the solver groups used by this collider.
     *
     * Forces between two colliders in contact will be computed iff their solver
     * groups are compatible.
     * See the documentation of `InteractionGroups` for details on the used bit pattern.
     *
     * @param groups - The solver groups used for the collider being built.
     */
    setSolverGroups(groups: InteractionGroups): ColliderDesc;
    /**
     * Set the physics hooks active for this collider.
     *
     * Use this to enable custom filtering rules for contact/intersecstion pairs involving this collider.
     *
     * @param activeHooks - The hooks active for contact/intersection pairs involving this collider.
     */
    setActiveHooks(activeHooks: ActiveHooks): ColliderDesc;
    /**
     * Set the events active for this collider.
     *
     * Use this to enable contact and/or intersection event reporting for this collider.
     *
     * @param activeEvents - The events active for contact/intersection pairs involving this collider.
     */
    setActiveEvents(activeEvents: ActiveEvents): ColliderDesc;
    /**
     * Set the collision types active for this collider.
     *
     * @param activeCollisionTypes - The hooks active for contact/intersection pairs involving this collider.
     */
    setActiveCollisionTypes(activeCollisionTypes: ActiveCollisionTypes): ColliderDesc;
    /**
     * Sets the total force magnitude beyond which a contact force event can be emitted.
     *
     * @param threshold - The force threshold to set.
     */
    setContactForceEventThreshold(threshold: number): ColliderDesc;
}
