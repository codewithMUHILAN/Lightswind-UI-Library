/* tslint:disable */
/* eslint-disable */
/**
* @returns {string}
*/
export function version(): string;
/**
*/
export enum RawRigidBodyType {
  Dynamic = 0,
  Fixed = 1,
  KinematicPositionBased = 2,
  KinematicVelocityBased = 3,
}
/**
*/
export enum RawFeatureType {
  Vertex = 0,
  Edge = 1,
  Face = 2,
  Unknown = 3,
}
/**
*/
export enum RawMotorModel {
  AccelerationBased = 0,
  ForceBased = 1,
}
/**
*/
export enum RawShapeType {
  Ball = 0,
  Cuboid = 1,
  Capsule = 2,
  Segment = 3,
  Polyline = 4,
  Triangle = 5,
  TriMesh = 6,
  HeightField = 7,
  Compound = 8,
  ConvexPolyhedron = 9,
  Cylinder = 10,
  Cone = 11,
  RoundCuboid = 12,
  RoundTriangle = 13,
  RoundCylinder = 14,
  RoundCone = 15,
  RoundConvexPolyhedron = 16,
  HalfSpace = 17,
}
/**
*/
export enum RawJointAxis {
  X = 0,
  Y = 1,
  Z = 2,
  AngX = 3,
  AngY = 4,
  AngZ = 5,
}
/**
*/
export enum RawJointType {
  Revolute = 0,
  Fixed = 1,
  Prismatic = 2,
  Rope = 3,
  Spring = 4,
  Spherical = 5,
  Generic = 6,
}
/**
*/
export class RawBroadPhase {
  free(): void;
/**
*/
  constructor();
}
/**
*/
export class RawCCDSolver {
  free(): void;
/**
*/
  constructor();
}
/**
*/
export class RawCharacterCollision {
  free(): void;
/**
*/
  constructor();
/**
* @returns {number}
*/
  handle(): number;
/**
* @returns {RawVector}
*/
  translationDeltaApplied(): RawVector;
/**
* @returns {RawVector}
*/
  translationDeltaRemaining(): RawVector;
/**
* @returns {number}
*/
  toi(): number;
/**
* @returns {RawVector}
*/
  worldWitness1(): RawVector;
/**
* @returns {RawVector}
*/
  worldWitness2(): RawVector;
/**
* @returns {RawVector}
*/
  worldNormal1(): RawVector;
/**
* @returns {RawVector}
*/
  worldNormal2(): RawVector;
}
/**
*/
export class RawColliderSet {
  free(): void;
/**
* The world-space translation of this collider.
* @param {number} handle
* @returns {RawVector}
*/
  coTranslation(handle: number): RawVector;
/**
* The world-space orientation of this collider.
* @param {number} handle
* @returns {RawRotation}
*/
  coRotation(handle: number): RawRotation;
/**
* Sets the translation of this collider.
*
* # Parameters
* - `x`: the world-space position of the collider along the `x` axis.
* - `y`: the world-space position of the collider along the `y` axis.
* - `z`: the world-space position of the collider along the `z` axis.
* - `wakeUp`: forces the collider to wake-up so it is properly affected by forces if it
* wasn't moving before modifying its position.
* @param {number} handle
* @param {number} x
* @param {number} y
* @param {number} z
*/
  coSetTranslation(handle: number, x: number, y: number, z: number): void;
/**
* @param {number} handle
* @param {number} x
* @param {number} y
* @param {number} z
*/
  coSetTranslationWrtParent(handle: number, x: number, y: number, z: number): void;
/**
* Sets the rotation quaternion of this collider.
*
* This does nothing if a zero quaternion is provided.
*
* # Parameters
* - `x`: the first vector component of the quaternion.
* - `y`: the second vector component of the quaternion.
* - `z`: the third vector component of the quaternion.
* - `w`: the scalar component of the quaternion.
* - `wakeUp`: forces the collider to wake-up so it is properly affected by forces if it
* wasn't moving before modifying its position.
* @param {number} handle
* @param {number} x
* @param {number} y
* @param {number} z
* @param {number} w
*/
  coSetRotation(handle: number, x: number, y: number, z: number, w: number): void;
/**
* @param {number} handle
* @param {number} x
* @param {number} y
* @param {number} z
* @param {number} w
*/
  coSetRotationWrtParent(handle: number, x: number, y: number, z: number, w: number): void;
/**
* Is this collider a sensor?
* @param {number} handle
* @returns {boolean}
*/
  coIsSensor(handle: number): boolean;
/**
* The type of the shape of this collider.
* @param {number} handle
* @returns {RawShapeType}
*/
  coShapeType(handle: number): RawShapeType;
/**
* @param {number} handle
* @returns {RawVector | undefined}
*/
  coHalfspaceNormal(handle: number): RawVector | undefined;
/**
* The half-extents of this collider if it is has a cuboid shape.
* @param {number} handle
* @returns {RawVector | undefined}
*/
  coHalfExtents(handle: number): RawVector | undefined;
/**
* Set the half-extents of this collider if it has a cuboid shape.
* @param {number} handle
* @param {RawVector} newHalfExtents
*/
  coSetHalfExtents(handle: number, newHalfExtents: RawVector): void;
/**
* The radius of this collider if it is a ball, capsule, cylinder, or cone shape.
* @param {number} handle
* @returns {number | undefined}
*/
  coRadius(handle: number): number | undefined;
/**
* Set the radius of this collider if it is a ball, capsule, cylinder, or cone shape.
* @param {number} handle
* @param {number} newRadius
*/
  coSetRadius(handle: number, newRadius: number): void;
/**
* The half height of this collider if it is a capsule, cylinder, or cone shape.
* @param {number} handle
* @returns {number | undefined}
*/
  coHalfHeight(handle: number): number | undefined;
/**
* Set the half height of this collider if it is a capsule, cylinder, or cone shape.
* @param {number} handle
* @param {number} newHalfheight
*/
  coSetHalfHeight(handle: number, newHalfheight: number): void;
/**
* The radius of the round edges of this collider.
* @param {number} handle
* @returns {number | undefined}
*/
  coRoundRadius(handle: number): number | undefined;
/**
* Set the radius of the round edges of this collider.
* @param {number} handle
* @param {number} newBorderRadius
*/
  coSetRoundRadius(handle: number, newBorderRadius: number): void;
/**
* The vertices of this triangle mesh, polyline, convex polyhedron, segment, triangle or convex polyhedron, if it is one.
* @param {number} handle
* @returns {Float32Array | undefined}
*/
  coVertices(handle: number): Float32Array | undefined;
/**
* The indices of this triangle mesh, polyline, or convex polyhedron, if it is one.
* @param {number} handle
* @returns {Uint32Array | undefined}
*/
  coIndices(handle: number): Uint32Array | undefined;
/**
* The height of this heightfield if it is one.
* @param {number} handle
* @returns {Float32Array | undefined}
*/
  coHeightfieldHeights(handle: number): Float32Array | undefined;
/**
* The scaling factor applied of this heightfield if it is one.
* @param {number} handle
* @returns {RawVector | undefined}
*/
  coHeightfieldScale(handle: number): RawVector | undefined;
/**
* The number of rows on this heightfield's height matrix, if it is one.
* @param {number} handle
* @returns {number | undefined}
*/
  coHeightfieldNRows(handle: number): number | undefined;
/**
* The number of columns on this heightfield's height matrix, if it is one.
* @param {number} handle
* @returns {number | undefined}
*/
  coHeightfieldNCols(handle: number): number | undefined;
/**
* The unique integer identifier of the collider this collider is attached to.
* @param {number} handle
* @returns {number | undefined}
*/
  coParent(handle: number): number | undefined;
/**
* @param {number} handle
* @param {boolean} enabled
*/
  coSetEnabled(handle: number, enabled: boolean): void;
/**
* @param {number} handle
* @returns {boolean}
*/
  coIsEnabled(handle: number): boolean;
/**
* The friction coefficient of this collider.
* @param {number} handle
* @returns {number}
*/
  coFriction(handle: number): number;
/**
* The restitution coefficient of this collider.
* @param {number} handle
* @returns {number}
*/
  coRestitution(handle: number): number;
/**
* The density of this collider.
* @param {number} handle
* @returns {number}
*/
  coDensity(handle: number): number;
/**
* The mass of this collider.
* @param {number} handle
* @returns {number}
*/
  coMass(handle: number): number;
/**
* The volume of this collider.
* @param {number} handle
* @returns {number}
*/
  coVolume(handle: number): number;
/**
* The collision groups of this collider.
* @param {number} handle
* @returns {number}
*/
  coCollisionGroups(handle: number): number;
/**
* The solver groups of this collider.
* @param {number} handle
* @returns {number}
*/
  coSolverGroups(handle: number): number;
/**
* The physics hooks enabled for this collider.
* @param {number} handle
* @returns {number}
*/
  coActiveHooks(handle: number): number;
/**
* The collision types enabled for this collider.
* @param {number} handle
* @returns {number}
*/
  coActiveCollisionTypes(handle: number): number;
/**
* The events enabled for this collider.
* @param {number} handle
* @returns {number}
*/
  coActiveEvents(handle: number): number;
/**
* The total force magnitude beyond which a contact force event can be emitted.
* @param {number} handle
* @returns {number}
*/
  coContactForceEventThreshold(handle: number): number;
/**
* @param {number} handle
* @param {RawVector} point
* @returns {boolean}
*/
  coContainsPoint(handle: number, point: RawVector): boolean;
/**
* @param {number} handle
* @param {RawVector} colliderVel
* @param {RawShape} shape2
* @param {RawVector} shape2Pos
* @param {RawRotation} shape2Rot
* @param {RawVector} shape2Vel
* @param {number} maxToi
* @param {boolean} stop_at_penetration
* @returns {RawShapeTOI | undefined}
*/
  coCastShape(handle: number, colliderVel: RawVector, shape2: RawShape, shape2Pos: RawVector, shape2Rot: RawRotation, shape2Vel: RawVector, maxToi: number, stop_at_penetration: boolean): RawShapeTOI | undefined;
/**
* @param {number} handle
* @param {RawVector} collider1Vel
* @param {number} collider2handle
* @param {RawVector} collider2Vel
* @param {number} max_toi
* @param {boolean} stop_at_penetration
* @returns {RawShapeColliderTOI | undefined}
*/
  coCastCollider(handle: number, collider1Vel: RawVector, collider2handle: number, collider2Vel: RawVector, max_toi: number, stop_at_penetration: boolean): RawShapeColliderTOI | undefined;
/**
* @param {number} handle
* @param {RawShape} shape2
* @param {RawVector} shapePos2
* @param {RawRotation} shapeRot2
* @returns {boolean}
*/
  coIntersectsShape(handle: number, shape2: RawShape, shapePos2: RawVector, shapeRot2: RawRotation): boolean;
/**
* @param {number} handle
* @param {RawShape} shape2
* @param {RawVector} shapePos2
* @param {RawRotation} shapeRot2
* @param {number} prediction
* @returns {RawShapeContact | undefined}
*/
  coContactShape(handle: number, shape2: RawShape, shapePos2: RawVector, shapeRot2: RawRotation, prediction: number): RawShapeContact | undefined;
/**
* @param {number} handle
* @param {number} collider2handle
* @param {number} prediction
* @returns {RawShapeContact | undefined}
*/
  coContactCollider(handle: number, collider2handle: number, prediction: number): RawShapeContact | undefined;
/**
* @param {number} handle
* @param {RawVector} point
* @param {boolean} solid
* @returns {RawPointProjection}
*/
  coProjectPoint(handle: number, point: RawVector, solid: boolean): RawPointProjection;
/**
* @param {number} handle
* @param {RawVector} rayOrig
* @param {RawVector} rayDir
* @param {number} maxToi
* @returns {boolean}
*/
  coIntersectsRay(handle: number, rayOrig: RawVector, rayDir: RawVector, maxToi: number): boolean;
/**
* @param {number} handle
* @param {RawVector} rayOrig
* @param {RawVector} rayDir
* @param {number} maxToi
* @param {boolean} solid
* @returns {number}
*/
  coCastRay(handle: number, rayOrig: RawVector, rayDir: RawVector, maxToi: number, solid: boolean): number;
/**
* @param {number} handle
* @param {RawVector} rayOrig
* @param {RawVector} rayDir
* @param {number} maxToi
* @param {boolean} solid
* @returns {RawRayIntersection | undefined}
*/
  coCastRayAndGetNormal(handle: number, rayOrig: RawVector, rayDir: RawVector, maxToi: number, solid: boolean): RawRayIntersection | undefined;
/**
* @param {number} handle
* @param {boolean} is_sensor
*/
  coSetSensor(handle: number, is_sensor: boolean): void;
/**
* @param {number} handle
* @param {number} restitution
*/
  coSetRestitution(handle: number, restitution: number): void;
/**
* @param {number} handle
* @param {number} friction
*/
  coSetFriction(handle: number, friction: number): void;
/**
* @param {number} handle
* @returns {number}
*/
  coFrictionCombineRule(handle: number): number;
/**
* @param {number} handle
* @param {number} rule
*/
  coSetFrictionCombineRule(handle: number, rule: number): void;
/**
* @param {number} handle
* @returns {number}
*/
  coRestitutionCombineRule(handle: number): number;
/**
* @param {number} handle
* @param {number} rule
*/
  coSetRestitutionCombineRule(handle: number, rule: number): void;
/**
* @param {number} handle
* @param {number} groups
*/
  coSetCollisionGroups(handle: number, groups: number): void;
/**
* @param {number} handle
* @param {number} groups
*/
  coSetSolverGroups(handle: number, groups: number): void;
/**
* @param {number} handle
* @param {number} hooks
*/
  coSetActiveHooks(handle: number, hooks: number): void;
/**
* @param {number} handle
* @param {number} events
*/
  coSetActiveEvents(handle: number, events: number): void;
/**
* @param {number} handle
* @param {number} types
*/
  coSetActiveCollisionTypes(handle: number, types: number): void;
/**
* @param {number} handle
* @param {RawShape} shape
*/
  coSetShape(handle: number, shape: RawShape): void;
/**
* @param {number} handle
* @param {number} threshold
*/
  coSetContactForceEventThreshold(handle: number, threshold: number): void;
/**
* @param {number} handle
* @param {number} density
*/
  coSetDensity(handle: number, density: number): void;
/**
* @param {number} handle
* @param {number} mass
*/
  coSetMass(handle: number, mass: number): void;
/**
* @param {number} handle
* @param {number} mass
* @param {RawVector} centerOfMass
* @param {RawVector} principalAngularInertia
* @param {RawRotation} angularInertiaFrame
*/
  coSetMassProperties(handle: number, mass: number, centerOfMass: RawVector, principalAngularInertia: RawVector, angularInertiaFrame: RawRotation): void;
/**
*/
  constructor();
/**
* @returns {number}
*/
  len(): number;
/**
* @param {number} handle
* @returns {boolean}
*/
  contains(handle: number): boolean;
/**
* @param {boolean} enabled
* @param {RawShape} shape
* @param {RawVector} translation
* @param {RawRotation} rotation
* @param {number} massPropsMode
* @param {number} mass
* @param {RawVector} centerOfMass
* @param {RawVector} principalAngularInertia
* @param {RawRotation} angularInertiaFrame
* @param {number} density
* @param {number} friction
* @param {number} restitution
* @param {number} frictionCombineRule
* @param {number} restitutionCombineRule
* @param {boolean} isSensor
* @param {number} collisionGroups
* @param {number} solverGroups
* @param {number} activeCollisionTypes
* @param {number} activeHooks
* @param {number} activeEvents
* @param {number} contactForceEventThreshold
* @param {boolean} hasParent
* @param {number} parent
* @param {RawRigidBodySet} bodies
* @returns {number | undefined}
*/
  createCollider(enabled: boolean, shape: RawShape, translation: RawVector, rotation: RawRotation, massPropsMode: number, mass: number, centerOfMass: RawVector, principalAngularInertia: RawVector, angularInertiaFrame: RawRotation, density: number, friction: number, restitution: number, frictionCombineRule: number, restitutionCombineRule: number, isSensor: boolean, collisionGroups: number, solverGroups: number, activeCollisionTypes: number, activeHooks: number, activeEvents: number, contactForceEventThreshold: number, hasParent: boolean, parent: number, bodies: RawRigidBodySet): number | undefined;
/**
* Removes a collider from this set and wake-up the rigid-body it is attached to.
* @param {number} handle
* @param {RawIslandManager} islands
* @param {RawRigidBodySet} bodies
* @param {boolean} wakeUp
*/
  remove(handle: number, islands: RawIslandManager, bodies: RawRigidBodySet, wakeUp: boolean): void;
/**
* Checks if a collider with the given integer handle exists.
* @param {number} handle
* @returns {boolean}
*/
  isHandleValid(handle: number): boolean;
/**
* Applies the given JavaScript function to the integer handle of each collider managed by this collider set.
*
* # Parameters
* - `f(handle)`: the function to apply to the integer handle of each collider managed by this collider set. Called as `f(handle)`.
* @param {Function} f
*/
  forEachColliderHandle(f: Function): void;
}
/**
*/
export class RawContactForceEvent {
  free(): void;
/**
* The first collider involved in the contact.
* @returns {number}
*/
  collider1(): number;
/**
* The second collider involved in the contact.
* @returns {number}
*/
  collider2(): number;
/**
* The sum of all the forces between the two colliders.
* @returns {RawVector}
*/
  total_force(): RawVector;
/**
* The sum of the magnitudes of each force between the two colliders.
*
* Note that this is **not** the same as the magnitude of `self.total_force`.
* Here we are summing the magnitude of all the forces, instead of taking
* the magnitude of their sum.
* @returns {number}
*/
  total_force_magnitude(): number;
/**
* The world-space (unit) direction of the force with strongest magnitude.
* @returns {RawVector}
*/
  max_force_direction(): RawVector;
/**
* The magnitude of the largest force at a contact point of this contact pair.
* @returns {number}
*/
  max_force_magnitude(): number;
}
/**
*/
export class RawContactManifold {
  free(): void;
/**
* @returns {RawVector}
*/
  normal(): RawVector;
/**
* @returns {RawVector}
*/
  local_n1(): RawVector;
/**
* @returns {RawVector}
*/
  local_n2(): RawVector;
/**
* @returns {number}
*/
  subshape1(): number;
/**
* @returns {number}
*/
  subshape2(): number;
/**
* @returns {number}
*/
  num_contacts(): number;
/**
* @param {number} i
* @returns {RawVector | undefined}
*/
  contact_local_p1(i: number): RawVector | undefined;
/**
* @param {number} i
* @returns {RawVector | undefined}
*/
  contact_local_p2(i: number): RawVector | undefined;
/**
* @param {number} i
* @returns {number}
*/
  contact_dist(i: number): number;
/**
* @param {number} i
* @returns {number}
*/
  contact_fid1(i: number): number;
/**
* @param {number} i
* @returns {number}
*/
  contact_fid2(i: number): number;
/**
* @param {number} i
* @returns {number}
*/
  contact_impulse(i: number): number;
/**
* @param {number} i
* @returns {number}
*/
  contact_tangent_impulse_x(i: number): number;
/**
* @param {number} i
* @returns {number}
*/
  contact_tangent_impulse_y(i: number): number;
/**
* @returns {number}
*/
  num_solver_contacts(): number;
/**
* @param {number} i
* @returns {RawVector | undefined}
*/
  solver_contact_point(i: number): RawVector | undefined;
/**
* @param {number} i
* @returns {number}
*/
  solver_contact_dist(i: number): number;
/**
* @param {number} i
* @returns {number}
*/
  solver_contact_friction(i: number): number;
/**
* @param {number} i
* @returns {number}
*/
  solver_contact_restitution(i: number): number;
/**
* @param {number} i
* @returns {RawVector}
*/
  solver_contact_tangent_velocity(i: number): RawVector;
}
/**
*/
export class RawContactPair {
  free(): void;
/**
* @returns {number}
*/
  collider1(): number;
/**
* @returns {number}
*/
  collider2(): number;
/**
* @returns {number}
*/
  numContactManifolds(): number;
/**
* @param {number} i
* @returns {RawContactManifold | undefined}
*/
  contactManifold(i: number): RawContactManifold | undefined;
}
/**
*/
export class RawDebugRenderPipeline {
  free(): void;
/**
*/
  constructor();
/**
* @returns {Float32Array}
*/
  vertices(): Float32Array;
/**
* @returns {Float32Array}
*/
  colors(): Float32Array;
/**
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawImpulseJointSet} impulse_joints
* @param {RawMultibodyJointSet} multibody_joints
* @param {RawNarrowPhase} narrow_phase
*/
  render(bodies: RawRigidBodySet, colliders: RawColliderSet, impulse_joints: RawImpulseJointSet, multibody_joints: RawMultibodyJointSet, narrow_phase: RawNarrowPhase): void;
}
/**
*/
export class RawDeserializedWorld {
  free(): void;
/**
* @returns {RawVector | undefined}
*/
  takeGravity(): RawVector | undefined;
/**
* @returns {RawIntegrationParameters | undefined}
*/
  takeIntegrationParameters(): RawIntegrationParameters | undefined;
/**
* @returns {RawIslandManager | undefined}
*/
  takeIslandManager(): RawIslandManager | undefined;
/**
* @returns {RawBroadPhase | undefined}
*/
  takeBroadPhase(): RawBroadPhase | undefined;
/**
* @returns {RawNarrowPhase | undefined}
*/
  takeNarrowPhase(): RawNarrowPhase | undefined;
/**
* @returns {RawRigidBodySet | undefined}
*/
  takeBodies(): RawRigidBodySet | undefined;
/**
* @returns {RawColliderSet | undefined}
*/
  takeColliders(): RawColliderSet | undefined;
/**
* @returns {RawImpulseJointSet | undefined}
*/
  takeImpulseJoints(): RawImpulseJointSet | undefined;
/**
* @returns {RawMultibodyJointSet | undefined}
*/
  takeMultibodyJoints(): RawMultibodyJointSet | undefined;
}
/**
*/
export class RawDynamicRayCastVehicleController {
  free(): void;
/**
* @param {number} chassis
*/
  constructor(chassis: number);
/**
* @returns {number}
*/
  current_vehicle_speed(): number;
/**
* @returns {number}
*/
  chassis(): number;
/**
* @returns {number}
*/
  index_up_axis(): number;
/**
* @param {number} axis
*/
  set_index_up_axis(axis: number): void;
/**
* @returns {number}
*/
  index_forward_axis(): number;
/**
* @param {number} axis
*/
  set_index_forward_axis(axis: number): void;
/**
* @param {RawVector} chassis_connection_cs
* @param {RawVector} direction_cs
* @param {RawVector} axle_cs
* @param {number} suspension_rest_length
* @param {number} radius
*/
  add_wheel(chassis_connection_cs: RawVector, direction_cs: RawVector, axle_cs: RawVector, suspension_rest_length: number, radius: number): void;
/**
* @returns {number}
*/
  num_wheels(): number;
/**
* @param {number} dt
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawQueryPipeline} queries
* @param {number} filter_flags
* @param {number | undefined} filter_groups
* @param {Function} filter_predicate
*/
  update_vehicle(dt: number, bodies: RawRigidBodySet, colliders: RawColliderSet, queries: RawQueryPipeline, filter_flags: number, filter_groups: number | undefined, filter_predicate: Function): void;
/**
* @param {number} i
* @returns {RawVector | undefined}
*/
  wheel_chassis_connection_point_cs(i: number): RawVector | undefined;
/**
* @param {number} i
* @param {RawVector} value
*/
  set_wheel_chassis_connection_point_cs(i: number, value: RawVector): void;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_suspension_rest_length(i: number): number | undefined;
/**
* @param {number} i
* @param {number} value
*/
  set_wheel_suspension_rest_length(i: number, value: number): void;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_max_suspension_travel(i: number): number | undefined;
/**
* @param {number} i
* @param {number} value
*/
  set_wheel_max_suspension_travel(i: number, value: number): void;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_radius(i: number): number | undefined;
/**
* @param {number} i
* @param {number} value
*/
  set_wheel_radius(i: number, value: number): void;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_suspension_stiffness(i: number): number | undefined;
/**
* @param {number} i
* @param {number} value
*/
  set_wheel_suspension_stiffness(i: number, value: number): void;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_suspension_compression(i: number): number | undefined;
/**
* @param {number} i
* @param {number} value
*/
  set_wheel_suspension_compression(i: number, value: number): void;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_suspension_relaxation(i: number): number | undefined;
/**
* @param {number} i
* @param {number} value
*/
  set_wheel_suspension_relaxation(i: number, value: number): void;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_max_suspension_force(i: number): number | undefined;
/**
* @param {number} i
* @param {number} value
*/
  set_wheel_max_suspension_force(i: number, value: number): void;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_brake(i: number): number | undefined;
/**
* @param {number} i
* @param {number} value
*/
  set_wheel_brake(i: number, value: number): void;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_steering(i: number): number | undefined;
/**
* @param {number} i
* @param {number} value
*/
  set_wheel_steering(i: number, value: number): void;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_engine_force(i: number): number | undefined;
/**
* @param {number} i
* @param {number} value
*/
  set_wheel_engine_force(i: number, value: number): void;
/**
* @param {number} i
* @returns {RawVector | undefined}
*/
  wheel_direction_cs(i: number): RawVector | undefined;
/**
* @param {number} i
* @param {RawVector} value
*/
  set_wheel_direction_cs(i: number, value: RawVector): void;
/**
* @param {number} i
* @returns {RawVector | undefined}
*/
  wheel_axle_cs(i: number): RawVector | undefined;
/**
* @param {number} i
* @param {RawVector} value
*/
  set_wheel_axle_cs(i: number, value: RawVector): void;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_friction_slip(i: number): number | undefined;
/**
* @param {number} i
* @param {number} value
*/
  set_wheel_friction_slip(i: number, value: number): void;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_side_friction_stiffness(i: number): number | undefined;
/**
* @param {number} i
* @param {number} stiffness
*/
  set_wheel_side_friction_stiffness(i: number, stiffness: number): void;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_rotation(i: number): number | undefined;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_forward_impulse(i: number): number | undefined;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_side_impulse(i: number): number | undefined;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_suspension_force(i: number): number | undefined;
/**
* @param {number} i
* @returns {RawVector | undefined}
*/
  wheel_contact_normal_ws(i: number): RawVector | undefined;
/**
* @param {number} i
* @returns {RawVector | undefined}
*/
  wheel_contact_point_ws(i: number): RawVector | undefined;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_suspension_length(i: number): number | undefined;
/**
* @param {number} i
* @returns {RawVector | undefined}
*/
  wheel_hard_point_ws(i: number): RawVector | undefined;
/**
* @param {number} i
* @returns {boolean}
*/
  wheel_is_in_contact(i: number): boolean;
/**
* @param {number} i
* @returns {number | undefined}
*/
  wheel_ground_object(i: number): number | undefined;
}
/**
* A structure responsible for collecting events generated
* by the physics engine.
*/
export class RawEventQueue {
  free(): void;
/**
* Creates a new event collector.
*
* # Parameters
* - `autoDrain`: setting this to `true` is strongly recommended. If true, the collector will
* be automatically drained before each `world.step(collector)`. If false, the collector will
* keep all events in memory unless it is manually drained/cleared; this may lead to unbounded use of
* RAM if no drain is performed.
* @param {boolean} autoDrain
*/
  constructor(autoDrain: boolean);
/**
* Applies the given javascript closure on each collision event of this collector, then clear
* the internal collision event buffer.
*
* # Parameters
* - `f(handle1, handle2, started)`:  JavaScript closure applied to each collision event. The
* closure should take three arguments: two integers representing the handles of the colliders
* involved in the collision, and a boolean indicating if the collision started (true) or stopped
* (false).
* @param {Function} f
*/
  drainCollisionEvents(f: Function): void;
/**
* @param {Function} f
*/
  drainContactForceEvents(f: Function): void;
/**
* Removes all events contained by this collector.
*/
  clear(): void;
}
/**
*/
export class RawGenericJoint {
  free(): void;
/**
* Creates a new joint descriptor that builds generic joints.
*
* Generic joints allow arbitrary axes of freedom to be selected
* for the joint from the available 6 degrees of freedom.
* @param {RawVector} anchor1
* @param {RawVector} anchor2
* @param {RawVector} axis
* @param {number} lockedAxes
* @returns {RawGenericJoint | undefined}
*/
  static generic(anchor1: RawVector, anchor2: RawVector, axis: RawVector, lockedAxes: number): RawGenericJoint | undefined;
/**
* @param {number} rest_length
* @param {number} stiffness
* @param {number} damping
* @param {RawVector} anchor1
* @param {RawVector} anchor2
* @returns {RawGenericJoint}
*/
  static spring(rest_length: number, stiffness: number, damping: number, anchor1: RawVector, anchor2: RawVector): RawGenericJoint;
/**
* @param {number} length
* @param {RawVector} anchor1
* @param {RawVector} anchor2
* @returns {RawGenericJoint}
*/
  static rope(length: number, anchor1: RawVector, anchor2: RawVector): RawGenericJoint;
/**
* Create a new joint descriptor that builds spherical joints.
*
* A spherical joints allows three relative rotational degrees of freedom
* by preventing any relative translation between the anchors of the
* two attached rigid-bodies.
* @param {RawVector} anchor1
* @param {RawVector} anchor2
* @returns {RawGenericJoint}
*/
  static spherical(anchor1: RawVector, anchor2: RawVector): RawGenericJoint;
/**
* Creates a new joint descriptor that builds a Prismatic joint.
*
* A prismatic joint removes all the degrees of freedom between the
* affected bodies, except for the translation along one axis.
*
* Returns `None` if any of the provided axes cannot be normalized.
* @param {RawVector} anchor1
* @param {RawVector} anchor2
* @param {RawVector} axis
* @param {boolean} limitsEnabled
* @param {number} limitsMin
* @param {number} limitsMax
* @returns {RawGenericJoint | undefined}
*/
  static prismatic(anchor1: RawVector, anchor2: RawVector, axis: RawVector, limitsEnabled: boolean, limitsMin: number, limitsMax: number): RawGenericJoint | undefined;
/**
* Creates a new joint descriptor that builds a Fixed joint.
*
* A fixed joint removes all the degrees of freedom between the affected bodies.
* @param {RawVector} anchor1
* @param {RawRotation} axes1
* @param {RawVector} anchor2
* @param {RawRotation} axes2
* @returns {RawGenericJoint}
*/
  static fixed(anchor1: RawVector, axes1: RawRotation, anchor2: RawVector, axes2: RawRotation): RawGenericJoint;
/**
* Create a new joint descriptor that builds Revolute joints.
*
* A revolute joint removes all degrees of freedom between the affected
* bodies except for the rotation along one axis.
* @param {RawVector} anchor1
* @param {RawVector} anchor2
* @param {RawVector} axis
* @returns {RawGenericJoint | undefined}
*/
  static revolute(anchor1: RawVector, anchor2: RawVector, axis: RawVector): RawGenericJoint | undefined;
}
/**
*/
export class RawImpulseJointSet {
  free(): void;
/**
* The type of this joint.
* @param {number} handle
* @returns {RawJointType}
*/
  jointType(handle: number): RawJointType;
/**
* The unique integer identifier of the first rigid-body this joint it attached to.
* @param {number} handle
* @returns {number}
*/
  jointBodyHandle1(handle: number): number;
/**
* The unique integer identifier of the second rigid-body this joint is attached to.
* @param {number} handle
* @returns {number}
*/
  jointBodyHandle2(handle: number): number;
/**
* The angular part of the joint’s local frame relative to the first rigid-body it is attached to.
* @param {number} handle
* @returns {RawRotation}
*/
  jointFrameX1(handle: number): RawRotation;
/**
* The angular part of the joint’s local frame relative to the second rigid-body it is attached to.
* @param {number} handle
* @returns {RawRotation}
*/
  jointFrameX2(handle: number): RawRotation;
/**
* The position of the first anchor of this joint.
*
* The first anchor gives the position of the points application point on the
* local frame of the first rigid-body it is attached to.
* @param {number} handle
* @returns {RawVector}
*/
  jointAnchor1(handle: number): RawVector;
/**
* The position of the second anchor of this joint.
*
* The second anchor gives the position of the points application point on the
* local frame of the second rigid-body it is attached to.
* @param {number} handle
* @returns {RawVector}
*/
  jointAnchor2(handle: number): RawVector;
/**
* Sets the position of the first local anchor
* @param {number} handle
* @param {RawVector} newPos
*/
  jointSetAnchor1(handle: number, newPos: RawVector): void;
/**
* Sets the position of the second local anchor
* @param {number} handle
* @param {RawVector} newPos
*/
  jointSetAnchor2(handle: number, newPos: RawVector): void;
/**
* Are contacts between the rigid-bodies attached by this joint enabled?
* @param {number} handle
* @returns {boolean}
*/
  jointContactsEnabled(handle: number): boolean;
/**
* Sets whether contacts are enabled between the rigid-bodies attached by this joint.
* @param {number} handle
* @param {boolean} enabled
*/
  jointSetContactsEnabled(handle: number, enabled: boolean): void;
/**
* Are the limits for this joint enabled?
* @param {number} handle
* @param {RawJointAxis} axis
* @returns {boolean}
*/
  jointLimitsEnabled(handle: number, axis: RawJointAxis): boolean;
/**
* Return the lower limit along the given joint axis.
* @param {number} handle
* @param {RawJointAxis} axis
* @returns {number}
*/
  jointLimitsMin(handle: number, axis: RawJointAxis): number;
/**
* If this is a prismatic joint, returns its upper limit.
* @param {number} handle
* @param {RawJointAxis} axis
* @returns {number}
*/
  jointLimitsMax(handle: number, axis: RawJointAxis): number;
/**
* Enables and sets the joint limits
* @param {number} handle
* @param {RawJointAxis} axis
* @param {number} min
* @param {number} max
*/
  jointSetLimits(handle: number, axis: RawJointAxis, min: number, max: number): void;
/**
* @param {number} handle
* @param {RawJointAxis} axis
* @param {RawMotorModel} model
*/
  jointConfigureMotorModel(handle: number, axis: RawJointAxis, model: RawMotorModel): void;
/**
* @param {number} handle
* @param {RawJointAxis} axis
* @param {number} targetVel
* @param {number} factor
*/
  jointConfigureMotorVelocity(handle: number, axis: RawJointAxis, targetVel: number, factor: number): void;
/**
* @param {number} handle
* @param {RawJointAxis} axis
* @param {number} targetPos
* @param {number} stiffness
* @param {number} damping
*/
  jointConfigureMotorPosition(handle: number, axis: RawJointAxis, targetPos: number, stiffness: number, damping: number): void;
/**
* @param {number} handle
* @param {RawJointAxis} axis
* @param {number} targetPos
* @param {number} targetVel
* @param {number} stiffness
* @param {number} damping
*/
  jointConfigureMotor(handle: number, axis: RawJointAxis, targetPos: number, targetVel: number, stiffness: number, damping: number): void;
/**
*/
  constructor();
/**
* @param {RawGenericJoint} params
* @param {number} parent1
* @param {number} parent2
* @param {boolean} wake_up
* @returns {number}
*/
  createJoint(params: RawGenericJoint, parent1: number, parent2: number, wake_up: boolean): number;
/**
* @param {number} handle
* @param {boolean} wakeUp
*/
  remove(handle: number, wakeUp: boolean): void;
/**
* @returns {number}
*/
  len(): number;
/**
* @param {number} handle
* @returns {boolean}
*/
  contains(handle: number): boolean;
/**
* Applies the given JavaScript function to the integer handle of each joint managed by this physics world.
*
* # Parameters
* - `f(handle)`: the function to apply to the integer handle of each joint managed by this set. Called as `f(collider)`.
* @param {Function} f
*/
  forEachJointHandle(f: Function): void;
/**
* Applies the given JavaScript function to the integer handle of each joint attached to the given rigid-body.
*
* # Parameters
* - `f(handle)`: the function to apply to the integer handle of each joint attached to the rigid-body. Called as `f(collider)`.
* @param {number} body
* @param {Function} f
*/
  forEachJointAttachedToRigidBody(body: number, f: Function): void;
}
/**
*/
export class RawIntegrationParameters {
  free(): void;
/**
*/
  constructor();
/**
*/
  switchToStandardPgsSolver(): void;
/**
*/
  switchToSmallStepsPgsSolver(): void;
/**
*/
  allowedLinearError: number;
/**
*/
  dt: number;
/**
*/
  erp: number;
/**
*/
  maxCcdSubsteps: number;
/**
*/
  minIslandSize: number;
/**
*/
  numAdditionalFrictionIterations: number;
/**
*/
  numInternalPgsIterations: number;
/**
*/
  numSolverIterations: number;
/**
*/
  predictionDistance: number;
}
/**
*/
export class RawIslandManager {
  free(): void;
/**
*/
  constructor();
/**
* Applies the given JavaScript function to the integer handle of each active rigid-body
* managed by this island manager.
*
* After a short time of inactivity, a rigid-body is automatically deactivated ("asleep") by
* the physics engine in order to save computational power. A sleeping rigid-body never moves
* unless it is moved manually by the user.
*
* # Parameters
* - `f(handle)`: the function to apply to the integer handle of each active rigid-body managed by this
*   set. Called as `f(collider)`.
* @param {Function} f
*/
  forEachActiveRigidBodyHandle(f: Function): void;
}
/**
*/
export class RawKinematicCharacterController {
  free(): void;
/**
* @param {number} offset
*/
  constructor(offset: number);
/**
* @returns {RawVector}
*/
  up(): RawVector;
/**
* @param {RawVector} vector
*/
  setUp(vector: RawVector): void;
/**
* @returns {number}
*/
  offset(): number;
/**
* @param {number} value
*/
  setOffset(value: number): void;
/**
* @returns {boolean}
*/
  slideEnabled(): boolean;
/**
* @param {boolean} enabled
*/
  setSlideEnabled(enabled: boolean): void;
/**
* @returns {number | undefined}
*/
  autostepMaxHeight(): number | undefined;
/**
* @returns {number | undefined}
*/
  autostepMinWidth(): number | undefined;
/**
* @returns {boolean | undefined}
*/
  autostepIncludesDynamicBodies(): boolean | undefined;
/**
* @returns {boolean}
*/
  autostepEnabled(): boolean;
/**
* @param {number} maxHeight
* @param {number} minWidth
* @param {boolean} includeDynamicBodies
*/
  enableAutostep(maxHeight: number, minWidth: number, includeDynamicBodies: boolean): void;
/**
*/
  disableAutostep(): void;
/**
* @returns {number}
*/
  maxSlopeClimbAngle(): number;
/**
* @param {number} angle
*/
  setMaxSlopeClimbAngle(angle: number): void;
/**
* @returns {number}
*/
  minSlopeSlideAngle(): number;
/**
* @param {number} angle
*/
  setMinSlopeSlideAngle(angle: number): void;
/**
* @returns {number | undefined}
*/
  snapToGroundDistance(): number | undefined;
/**
* @param {number} distance
*/
  enableSnapToGround(distance: number): void;
/**
*/
  disableSnapToGround(): void;
/**
* @returns {boolean}
*/
  snapToGroundEnabled(): boolean;
/**
* @param {number} dt
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawQueryPipeline} queries
* @param {number} collider_handle
* @param {RawVector} desired_translation_delta
* @param {boolean} apply_impulses_to_dynamic_bodies
* @param {number | undefined} character_mass
* @param {number} filter_flags
* @param {number | undefined} filter_groups
* @param {Function} filter_predicate
*/
  computeColliderMovement(dt: number, bodies: RawRigidBodySet, colliders: RawColliderSet, queries: RawQueryPipeline, collider_handle: number, desired_translation_delta: RawVector, apply_impulses_to_dynamic_bodies: boolean, character_mass: number | undefined, filter_flags: number, filter_groups: number | undefined, filter_predicate: Function): void;
/**
* @returns {RawVector}
*/
  computedMovement(): RawVector;
/**
* @returns {boolean}
*/
  computedGrounded(): boolean;
/**
* @returns {number}
*/
  numComputedCollisions(): number;
/**
* @param {number} i
* @param {RawCharacterCollision} collision
* @returns {boolean}
*/
  computedCollision(i: number, collision: RawCharacterCollision): boolean;
}
/**
*/
export class RawMultibodyJointSet {
  free(): void;
/**
* The type of this joint.
* @param {number} handle
* @returns {RawJointType}
*/
  jointType(handle: number): RawJointType;
/**
* The angular part of the joint’s local frame relative to the first rigid-body it is attached to.
* @param {number} handle
* @returns {RawRotation}
*/
  jointFrameX1(handle: number): RawRotation;
/**
* The angular part of the joint’s local frame relative to the second rigid-body it is attached to.
* @param {number} handle
* @returns {RawRotation}
*/
  jointFrameX2(handle: number): RawRotation;
/**
* The position of the first anchor of this joint.
*
* The first anchor gives the position of the points application point on the
* local frame of the first rigid-body it is attached to.
* @param {number} handle
* @returns {RawVector}
*/
  jointAnchor1(handle: number): RawVector;
/**
* The position of the second anchor of this joint.
*
* The second anchor gives the position of the points application point on the
* local frame of the second rigid-body it is attached to.
* @param {number} handle
* @returns {RawVector}
*/
  jointAnchor2(handle: number): RawVector;
/**
* Are contacts between the rigid-bodies attached by this joint enabled?
* @param {number} handle
* @returns {boolean}
*/
  jointContactsEnabled(handle: number): boolean;
/**
* Sets whether contacts are enabled between the rigid-bodies attached by this joint.
* @param {number} handle
* @param {boolean} enabled
*/
  jointSetContactsEnabled(handle: number, enabled: boolean): void;
/**
* Are the limits for this joint enabled?
* @param {number} handle
* @param {RawJointAxis} axis
* @returns {boolean}
*/
  jointLimitsEnabled(handle: number, axis: RawJointAxis): boolean;
/**
* Return the lower limit along the given joint axis.
* @param {number} handle
* @param {RawJointAxis} axis
* @returns {number}
*/
  jointLimitsMin(handle: number, axis: RawJointAxis): number;
/**
* If this is a prismatic joint, returns its upper limit.
* @param {number} handle
* @param {RawJointAxis} axis
* @returns {number}
*/
  jointLimitsMax(handle: number, axis: RawJointAxis): number;
/**
*/
  constructor();
/**
* @param {RawGenericJoint} params
* @param {number} parent1
* @param {number} parent2
* @param {boolean} wakeUp
* @returns {number}
*/
  createJoint(params: RawGenericJoint, parent1: number, parent2: number, wakeUp: boolean): number;
/**
* @param {number} handle
* @param {boolean} wakeUp
*/
  remove(handle: number, wakeUp: boolean): void;
/**
* @param {number} handle
* @returns {boolean}
*/
  contains(handle: number): boolean;
/**
* Applies the given JavaScript function to the integer handle of each joint managed by this physics world.
*
* # Parameters
* - `f(handle)`: the function to apply to the integer handle of each joint managed by this set. Called as `f(collider)`.
* @param {Function} f
*/
  forEachJointHandle(f: Function): void;
/**
* Applies the given JavaScript function to the integer handle of each joint attached to the given rigid-body.
*
* # Parameters
* - `f(handle)`: the function to apply to the integer handle of each joint attached to the rigid-body. Called as `f(collider)`.
* @param {number} body
* @param {Function} f
*/
  forEachJointAttachedToRigidBody(body: number, f: Function): void;
}
/**
*/
export class RawNarrowPhase {
  free(): void;
/**
*/
  constructor();
/**
* @param {number} handle1
* @param {Function} f
*/
  contact_pairs_with(handle1: number, f: Function): void;
/**
* @param {number} handle1
* @param {number} handle2
* @returns {RawContactPair | undefined}
*/
  contact_pair(handle1: number, handle2: number): RawContactPair | undefined;
/**
* @param {number} handle1
* @param {Function} f
*/
  intersection_pairs_with(handle1: number, f: Function): void;
/**
* @param {number} handle1
* @param {number} handle2
* @returns {boolean}
*/
  intersection_pair(handle1: number, handle2: number): boolean;
}
/**
*/
export class RawPhysicsPipeline {
  free(): void;
/**
*/
  constructor();
/**
* @param {RawVector} gravity
* @param {RawIntegrationParameters} integrationParameters
* @param {RawIslandManager} islands
* @param {RawBroadPhase} broadPhase
* @param {RawNarrowPhase} narrowPhase
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawImpulseJointSet} joints
* @param {RawMultibodyJointSet} articulations
* @param {RawCCDSolver} ccd_solver
*/
  step(gravity: RawVector, integrationParameters: RawIntegrationParameters, islands: RawIslandManager, broadPhase: RawBroadPhase, narrowPhase: RawNarrowPhase, bodies: RawRigidBodySet, colliders: RawColliderSet, joints: RawImpulseJointSet, articulations: RawMultibodyJointSet, ccd_solver: RawCCDSolver): void;
/**
* @param {RawVector} gravity
* @param {RawIntegrationParameters} integrationParameters
* @param {RawIslandManager} islands
* @param {RawBroadPhase} broadPhase
* @param {RawNarrowPhase} narrowPhase
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawImpulseJointSet} joints
* @param {RawMultibodyJointSet} articulations
* @param {RawCCDSolver} ccd_solver
* @param {RawEventQueue} eventQueue
* @param {object} hookObject
* @param {Function} hookFilterContactPair
* @param {Function} hookFilterIntersectionPair
*/
  stepWithEvents(gravity: RawVector, integrationParameters: RawIntegrationParameters, islands: RawIslandManager, broadPhase: RawBroadPhase, narrowPhase: RawNarrowPhase, bodies: RawRigidBodySet, colliders: RawColliderSet, joints: RawImpulseJointSet, articulations: RawMultibodyJointSet, ccd_solver: RawCCDSolver, eventQueue: RawEventQueue, hookObject: object, hookFilterContactPair: Function, hookFilterIntersectionPair: Function): void;
}
/**
*/
export class RawPointColliderProjection {
  free(): void;
/**
* @returns {number}
*/
  colliderHandle(): number;
/**
* @returns {RawVector}
*/
  point(): RawVector;
/**
* @returns {boolean}
*/
  isInside(): boolean;
/**
* @returns {RawFeatureType}
*/
  featureType(): RawFeatureType;
/**
* @returns {number | undefined}
*/
  featureId(): number | undefined;
}
/**
*/
export class RawPointProjection {
  free(): void;
/**
* @returns {RawVector}
*/
  point(): RawVector;
/**
* @returns {boolean}
*/
  isInside(): boolean;
}
/**
*/
export class RawQueryPipeline {
  free(): void;
/**
*/
  constructor();
/**
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
*/
  update(bodies: RawRigidBodySet, colliders: RawColliderSet): void;
/**
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawVector} rayOrig
* @param {RawVector} rayDir
* @param {number} maxToi
* @param {boolean} solid
* @param {number} filter_flags
* @param {number | undefined} filter_groups
* @param {number | undefined} filter_exclude_collider
* @param {number | undefined} filter_exclude_rigid_body
* @param {Function} filter_predicate
* @returns {RawRayColliderToi | undefined}
*/
  castRay(bodies: RawRigidBodySet, colliders: RawColliderSet, rayOrig: RawVector, rayDir: RawVector, maxToi: number, solid: boolean, filter_flags: number, filter_groups: number | undefined, filter_exclude_collider: number | undefined, filter_exclude_rigid_body: number | undefined, filter_predicate: Function): RawRayColliderToi | undefined;
/**
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawVector} rayOrig
* @param {RawVector} rayDir
* @param {number} maxToi
* @param {boolean} solid
* @param {number} filter_flags
* @param {number | undefined} filter_groups
* @param {number | undefined} filter_exclude_collider
* @param {number | undefined} filter_exclude_rigid_body
* @param {Function} filter_predicate
* @returns {RawRayColliderIntersection | undefined}
*/
  castRayAndGetNormal(bodies: RawRigidBodySet, colliders: RawColliderSet, rayOrig: RawVector, rayDir: RawVector, maxToi: number, solid: boolean, filter_flags: number, filter_groups: number | undefined, filter_exclude_collider: number | undefined, filter_exclude_rigid_body: number | undefined, filter_predicate: Function): RawRayColliderIntersection | undefined;
/**
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawVector} rayOrig
* @param {RawVector} rayDir
* @param {number} maxToi
* @param {boolean} solid
* @param {Function} callback
* @param {number} filter_flags
* @param {number | undefined} filter_groups
* @param {number | undefined} filter_exclude_collider
* @param {number | undefined} filter_exclude_rigid_body
* @param {Function} filter_predicate
*/
  intersectionsWithRay(bodies: RawRigidBodySet, colliders: RawColliderSet, rayOrig: RawVector, rayDir: RawVector, maxToi: number, solid: boolean, callback: Function, filter_flags: number, filter_groups: number | undefined, filter_exclude_collider: number | undefined, filter_exclude_rigid_body: number | undefined, filter_predicate: Function): void;
/**
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawVector} shapePos
* @param {RawRotation} shapeRot
* @param {RawShape} shape
* @param {number} filter_flags
* @param {number | undefined} filter_groups
* @param {number | undefined} filter_exclude_collider
* @param {number | undefined} filter_exclude_rigid_body
* @param {Function} filter_predicate
* @returns {number | undefined}
*/
  intersectionWithShape(bodies: RawRigidBodySet, colliders: RawColliderSet, shapePos: RawVector, shapeRot: RawRotation, shape: RawShape, filter_flags: number, filter_groups: number | undefined, filter_exclude_collider: number | undefined, filter_exclude_rigid_body: number | undefined, filter_predicate: Function): number | undefined;
/**
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawVector} point
* @param {boolean} solid
* @param {number} filter_flags
* @param {number | undefined} filter_groups
* @param {number | undefined} filter_exclude_collider
* @param {number | undefined} filter_exclude_rigid_body
* @param {Function} filter_predicate
* @returns {RawPointColliderProjection | undefined}
*/
  projectPoint(bodies: RawRigidBodySet, colliders: RawColliderSet, point: RawVector, solid: boolean, filter_flags: number, filter_groups: number | undefined, filter_exclude_collider: number | undefined, filter_exclude_rigid_body: number | undefined, filter_predicate: Function): RawPointColliderProjection | undefined;
/**
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawVector} point
* @param {number} filter_flags
* @param {number | undefined} filter_groups
* @param {number | undefined} filter_exclude_collider
* @param {number | undefined} filter_exclude_rigid_body
* @param {Function} filter_predicate
* @returns {RawPointColliderProjection | undefined}
*/
  projectPointAndGetFeature(bodies: RawRigidBodySet, colliders: RawColliderSet, point: RawVector, filter_flags: number, filter_groups: number | undefined, filter_exclude_collider: number | undefined, filter_exclude_rigid_body: number | undefined, filter_predicate: Function): RawPointColliderProjection | undefined;
/**
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawVector} point
* @param {Function} callback
* @param {number} filter_flags
* @param {number | undefined} filter_groups
* @param {number | undefined} filter_exclude_collider
* @param {number | undefined} filter_exclude_rigid_body
* @param {Function} filter_predicate
*/
  intersectionsWithPoint(bodies: RawRigidBodySet, colliders: RawColliderSet, point: RawVector, callback: Function, filter_flags: number, filter_groups: number | undefined, filter_exclude_collider: number | undefined, filter_exclude_rigid_body: number | undefined, filter_predicate: Function): void;
/**
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawVector} shapePos
* @param {RawRotation} shapeRot
* @param {RawVector} shapeVel
* @param {RawShape} shape
* @param {number} maxToi
* @param {boolean} stop_at_penetration
* @param {number} filter_flags
* @param {number | undefined} filter_groups
* @param {number | undefined} filter_exclude_collider
* @param {number | undefined} filter_exclude_rigid_body
* @param {Function} filter_predicate
* @returns {RawShapeColliderTOI | undefined}
*/
  castShape(bodies: RawRigidBodySet, colliders: RawColliderSet, shapePos: RawVector, shapeRot: RawRotation, shapeVel: RawVector, shape: RawShape, maxToi: number, stop_at_penetration: boolean, filter_flags: number, filter_groups: number | undefined, filter_exclude_collider: number | undefined, filter_exclude_rigid_body: number | undefined, filter_predicate: Function): RawShapeColliderTOI | undefined;
/**
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawVector} shapePos
* @param {RawRotation} shapeRot
* @param {RawShape} shape
* @param {Function} callback
* @param {number} filter_flags
* @param {number | undefined} filter_groups
* @param {number | undefined} filter_exclude_collider
* @param {number | undefined} filter_exclude_rigid_body
* @param {Function} filter_predicate
*/
  intersectionsWithShape(bodies: RawRigidBodySet, colliders: RawColliderSet, shapePos: RawVector, shapeRot: RawRotation, shape: RawShape, callback: Function, filter_flags: number, filter_groups: number | undefined, filter_exclude_collider: number | undefined, filter_exclude_rigid_body: number | undefined, filter_predicate: Function): void;
/**
* @param {RawVector} aabbCenter
* @param {RawVector} aabbHalfExtents
* @param {Function} callback
*/
  collidersWithAabbIntersectingAabb(aabbCenter: RawVector, aabbHalfExtents: RawVector, callback: Function): void;
}
/**
*/
export class RawRayColliderIntersection {
  free(): void;
/**
* @returns {number}
*/
  colliderHandle(): number;
/**
* @returns {RawVector}
*/
  normal(): RawVector;
/**
* @returns {number}
*/
  toi(): number;
/**
* @returns {RawFeatureType}
*/
  featureType(): RawFeatureType;
/**
* @returns {number | undefined}
*/
  featureId(): number | undefined;
}
/**
*/
export class RawRayColliderToi {
  free(): void;
/**
* @returns {number}
*/
  colliderHandle(): number;
/**
* @returns {number}
*/
  toi(): number;
}
/**
*/
export class RawRayIntersection {
  free(): void;
/**
* @returns {RawVector}
*/
  normal(): RawVector;
/**
* @returns {number}
*/
  toi(): number;
/**
* @returns {RawFeatureType}
*/
  featureType(): RawFeatureType;
/**
* @returns {number | undefined}
*/
  featureId(): number | undefined;
}
/**
*/
export class RawRigidBodySet {
  free(): void;
/**
* The world-space translation of this rigid-body.
* @param {number} handle
* @returns {RawVector}
*/
  rbTranslation(handle: number): RawVector;
/**
* The world-space orientation of this rigid-body.
* @param {number} handle
* @returns {RawRotation}
*/
  rbRotation(handle: number): RawRotation;
/**
* Put the given rigid-body to sleep.
* @param {number} handle
*/
  rbSleep(handle: number): void;
/**
* Is this rigid-body sleeping?
* @param {number} handle
* @returns {boolean}
*/
  rbIsSleeping(handle: number): boolean;
/**
* Is the velocity of this rigid-body not zero?
* @param {number} handle
* @returns {boolean}
*/
  rbIsMoving(handle: number): boolean;
/**
* The world-space predicted translation of this rigid-body.
*
* If this rigid-body is kinematic this value is set by the `setNextKinematicTranslation`
* method and is used for estimating the kinematic body velocity at the next timestep.
* For non-kinematic bodies, this value is currently unspecified.
* @param {number} handle
* @returns {RawVector}
*/
  rbNextTranslation(handle: number): RawVector;
/**
* The world-space predicted orientation of this rigid-body.
*
* If this rigid-body is kinematic this value is set by the `setNextKinematicRotation`
* method and is used for estimating the kinematic body velocity at the next timestep.
* For non-kinematic bodies, this value is currently unspecified.
* @param {number} handle
* @returns {RawRotation}
*/
  rbNextRotation(handle: number): RawRotation;
/**
* Sets the translation of this rigid-body.
*
* # Parameters
* - `x`: the world-space position of the rigid-body along the `x` axis.
* - `y`: the world-space position of the rigid-body along the `y` axis.
* - `z`: the world-space position of the rigid-body along the `z` axis.
* - `wakeUp`: forces the rigid-body to wake-up so it is properly affected by forces if it
* wasn't moving before modifying its position.
* @param {number} handle
* @param {number} x
* @param {number} y
* @param {number} z
* @param {boolean} wakeUp
*/
  rbSetTranslation(handle: number, x: number, y: number, z: number, wakeUp: boolean): void;
/**
* Sets the rotation quaternion of this rigid-body.
*
* This does nothing if a zero quaternion is provided.
*
* # Parameters
* - `x`: the first vector component of the quaternion.
* - `y`: the second vector component of the quaternion.
* - `z`: the third vector component of the quaternion.
* - `w`: the scalar component of the quaternion.
* - `wakeUp`: forces the rigid-body to wake-up so it is properly affected by forces if it
* wasn't moving before modifying its position.
* @param {number} handle
* @param {number} x
* @param {number} y
* @param {number} z
* @param {number} w
* @param {boolean} wakeUp
*/
  rbSetRotation(handle: number, x: number, y: number, z: number, w: number, wakeUp: boolean): void;
/**
* Sets the linear velocity of this rigid-body.
* @param {number} handle
* @param {RawVector} linvel
* @param {boolean} wakeUp
*/
  rbSetLinvel(handle: number, linvel: RawVector, wakeUp: boolean): void;
/**
* Sets the angular velocity of this rigid-body.
* @param {number} handle
* @param {RawVector} angvel
* @param {boolean} wakeUp
*/
  rbSetAngvel(handle: number, angvel: RawVector, wakeUp: boolean): void;
/**
* If this rigid body is kinematic, sets its future translation after the next timestep integration.
*
* This should be used instead of `rigidBody.setTranslation` to make the dynamic object
* interacting with this kinematic body behave as expected. Internally, Rapier will compute
* an artificial velocity for this rigid-body from its current position and its next kinematic
* position. This velocity will be used to compute forces on dynamic bodies interacting with
* this body.
*
* # Parameters
* - `x`: the world-space position of the rigid-body along the `x` axis.
* - `y`: the world-space position of the rigid-body along the `y` axis.
* - `z`: the world-space position of the rigid-body along the `z` axis.
* @param {number} handle
* @param {number} x
* @param {number} y
* @param {number} z
*/
  rbSetNextKinematicTranslation(handle: number, x: number, y: number, z: number): void;
/**
* If this rigid body is kinematic, sets its future rotation after the next timestep integration.
*
* This should be used instead of `rigidBody.setRotation` to make the dynamic object
* interacting with this kinematic body behave as expected. Internally, Rapier will compute
* an artificial velocity for this rigid-body from its current position and its next kinematic
* position. This velocity will be used to compute forces on dynamic bodies interacting with
* this body.
*
* # Parameters
* - `x`: the first vector component of the quaternion.
* - `y`: the second vector component of the quaternion.
* - `z`: the third vector component of the quaternion.
* - `w`: the scalar component of the quaternion.
* @param {number} handle
* @param {number} x
* @param {number} y
* @param {number} z
* @param {number} w
*/
  rbSetNextKinematicRotation(handle: number, x: number, y: number, z: number, w: number): void;
/**
* @param {number} handle
* @param {RawColliderSet} colliders
*/
  rbRecomputeMassPropertiesFromColliders(handle: number, colliders: RawColliderSet): void;
/**
* @param {number} handle
* @param {number} mass
* @param {boolean} wake_up
*/
  rbSetAdditionalMass(handle: number, mass: number, wake_up: boolean): void;
/**
* @param {number} handle
* @param {number} mass
* @param {RawVector} centerOfMass
* @param {RawVector} principalAngularInertia
* @param {RawRotation} angularInertiaFrame
* @param {boolean} wake_up
*/
  rbSetAdditionalMassProperties(handle: number, mass: number, centerOfMass: RawVector, principalAngularInertia: RawVector, angularInertiaFrame: RawRotation, wake_up: boolean): void;
/**
* The linear velocity of this rigid-body.
* @param {number} handle
* @returns {RawVector}
*/
  rbLinvel(handle: number): RawVector;
/**
* The angular velocity of this rigid-body.
* @param {number} handle
* @returns {RawVector}
*/
  rbAngvel(handle: number): RawVector;
/**
* @param {number} handle
* @param {boolean} locked
* @param {boolean} wake_up
*/
  rbLockTranslations(handle: number, locked: boolean, wake_up: boolean): void;
/**
* @param {number} handle
* @param {boolean} allow_x
* @param {boolean} allow_y
* @param {boolean} allow_z
* @param {boolean} wake_up
*/
  rbSetEnabledTranslations(handle: number, allow_x: boolean, allow_y: boolean, allow_z: boolean, wake_up: boolean): void;
/**
* @param {number} handle
* @param {boolean} locked
* @param {boolean} wake_up
*/
  rbLockRotations(handle: number, locked: boolean, wake_up: boolean): void;
/**
* @param {number} handle
* @param {boolean} allow_x
* @param {boolean} allow_y
* @param {boolean} allow_z
* @param {boolean} wake_up
*/
  rbSetEnabledRotations(handle: number, allow_x: boolean, allow_y: boolean, allow_z: boolean, wake_up: boolean): void;
/**
* @param {number} handle
* @returns {number}
*/
  rbDominanceGroup(handle: number): number;
/**
* @param {number} handle
* @param {number} group
*/
  rbSetDominanceGroup(handle: number, group: number): void;
/**
* @param {number} handle
* @param {boolean} enabled
*/
  rbEnableCcd(handle: number, enabled: boolean): void;
/**
* The mass of this rigid-body.
* @param {number} handle
* @returns {number}
*/
  rbMass(handle: number): number;
/**
* The inverse of the mass of a rigid-body.
*
* If this is zero, the rigid-body is assumed to have infinite mass.
* @param {number} handle
* @returns {number}
*/
  rbInvMass(handle: number): number;
/**
* The inverse mass taking into account translation locking.
* @param {number} handle
* @returns {RawVector}
*/
  rbEffectiveInvMass(handle: number): RawVector;
/**
* The center of mass of a rigid-body expressed in its local-space.
* @param {number} handle
* @returns {RawVector}
*/
  rbLocalCom(handle: number): RawVector;
/**
* The world-space center of mass of the rigid-body.
* @param {number} handle
* @returns {RawVector}
*/
  rbWorldCom(handle: number): RawVector;
/**
* The inverse of the principal angular inertia of the rigid-body.
*
* Components set to zero are assumed to be infinite along the corresponding principal axis.
* @param {number} handle
* @returns {RawVector}
*/
  rbInvPrincipalInertiaSqrt(handle: number): RawVector;
/**
* The principal vectors of the local angular inertia tensor of the rigid-body.
* @param {number} handle
* @returns {RawRotation}
*/
  rbPrincipalInertiaLocalFrame(handle: number): RawRotation;
/**
* The angular inertia along the principal inertia axes of the rigid-body.
* @param {number} handle
* @returns {RawVector}
*/
  rbPrincipalInertia(handle: number): RawVector;
/**
* The square-root of the world-space inverse angular inertia tensor of the rigid-body,
* taking into account rotation locking.
* @param {number} handle
* @returns {RawSdpMatrix3}
*/
  rbEffectiveWorldInvInertiaSqrt(handle: number): RawSdpMatrix3;
/**
* The effective world-space angular inertia (that takes the potential rotation locking into account) of
* this rigid-body.
* @param {number} handle
* @returns {RawSdpMatrix3}
*/
  rbEffectiveAngularInertia(handle: number): RawSdpMatrix3;
/**
* Wakes this rigid-body up.
*
* A dynamic rigid-body that does not move during several consecutive frames will
* be put to sleep by the physics engine, i.e., it will stop being simulated in order
* to avoid useless computations.
* This methods forces a sleeping rigid-body to wake-up. This is useful, e.g., before modifying
* the position of a dynamic body so that it is properly simulated afterwards.
* @param {number} handle
*/
  rbWakeUp(handle: number): void;
/**
* Is Continuous Collision Detection enabled for this rigid-body?
* @param {number} handle
* @returns {boolean}
*/
  rbIsCcdEnabled(handle: number): boolean;
/**
* The number of colliders attached to this rigid-body.
* @param {number} handle
* @returns {number}
*/
  rbNumColliders(handle: number): number;
/**
* Retrieves the `i-th` collider attached to this rigid-body.
*
* # Parameters
* - `at`: The index of the collider to retrieve. Must be a number in `[0, this.numColliders()[`.
*         This index is **not** the same as the unique identifier of the collider.
* @param {number} handle
* @param {number} at
* @returns {number}
*/
  rbCollider(handle: number, at: number): number;
/**
* The status of this rigid-body: fixed, dynamic, or kinematic.
* @param {number} handle
* @returns {RawRigidBodyType}
*/
  rbBodyType(handle: number): RawRigidBodyType;
/**
* Set a new status for this rigid-body: fixed, dynamic, or kinematic.
* @param {number} handle
* @param {RawRigidBodyType} status
* @param {boolean} wake_up
*/
  rbSetBodyType(handle: number, status: RawRigidBodyType, wake_up: boolean): void;
/**
* Is this rigid-body fixed?
* @param {number} handle
* @returns {boolean}
*/
  rbIsFixed(handle: number): boolean;
/**
* Is this rigid-body kinematic?
* @param {number} handle
* @returns {boolean}
*/
  rbIsKinematic(handle: number): boolean;
/**
* Is this rigid-body dynamic?
* @param {number} handle
* @returns {boolean}
*/
  rbIsDynamic(handle: number): boolean;
/**
* The linear damping coefficient of this rigid-body.
* @param {number} handle
* @returns {number}
*/
  rbLinearDamping(handle: number): number;
/**
* The angular damping coefficient of this rigid-body.
* @param {number} handle
* @returns {number}
*/
  rbAngularDamping(handle: number): number;
/**
* @param {number} handle
* @param {number} factor
*/
  rbSetLinearDamping(handle: number, factor: number): void;
/**
* @param {number} handle
* @param {number} factor
*/
  rbSetAngularDamping(handle: number, factor: number): void;
/**
* @param {number} handle
* @param {boolean} enabled
*/
  rbSetEnabled(handle: number, enabled: boolean): void;
/**
* @param {number} handle
* @returns {boolean}
*/
  rbIsEnabled(handle: number): boolean;
/**
* @param {number} handle
* @returns {number}
*/
  rbGravityScale(handle: number): number;
/**
* @param {number} handle
* @param {number} factor
* @param {boolean} wakeUp
*/
  rbSetGravityScale(handle: number, factor: number, wakeUp: boolean): void;
/**
* Resets to zero all user-added forces added to this rigid-body.
* @param {number} handle
* @param {boolean} wakeUp
*/
  rbResetForces(handle: number, wakeUp: boolean): void;
/**
* Resets to zero all user-added torques added to this rigid-body.
* @param {number} handle
* @param {boolean} wakeUp
*/
  rbResetTorques(handle: number, wakeUp: boolean): void;
/**
* Adds a force at the center-of-mass of this rigid-body.
*
* # Parameters
* - `force`: the world-space force to apply on the rigid-body.
* - `wakeUp`: should the rigid-body be automatically woken-up?
* @param {number} handle
* @param {RawVector} force
* @param {boolean} wakeUp
*/
  rbAddForce(handle: number, force: RawVector, wakeUp: boolean): void;
/**
* Applies an impulse at the center-of-mass of this rigid-body.
*
* # Parameters
* - `impulse`: the world-space impulse to apply on the rigid-body.
* - `wakeUp`: should the rigid-body be automatically woken-up?
* @param {number} handle
* @param {RawVector} impulse
* @param {boolean} wakeUp
*/
  rbApplyImpulse(handle: number, impulse: RawVector, wakeUp: boolean): void;
/**
* Adds a torque at the center-of-mass of this rigid-body.
*
* # Parameters
* - `torque`: the world-space torque to apply on the rigid-body.
* - `wakeUp`: should the rigid-body be automatically woken-up?
* @param {number} handle
* @param {RawVector} torque
* @param {boolean} wakeUp
*/
  rbAddTorque(handle: number, torque: RawVector, wakeUp: boolean): void;
/**
* Applies an impulsive torque at the center-of-mass of this rigid-body.
*
* # Parameters
* - `torque impulse`: the world-space torque impulse to apply on the rigid-body.
* - `wakeUp`: should the rigid-body be automatically woken-up?
* @param {number} handle
* @param {RawVector} torque_impulse
* @param {boolean} wakeUp
*/
  rbApplyTorqueImpulse(handle: number, torque_impulse: RawVector, wakeUp: boolean): void;
/**
* Adds a force at the given world-space point of this rigid-body.
*
* # Parameters
* - `force`: the world-space force to apply on the rigid-body.
* - `point`: the world-space point where the impulse is to be applied on the rigid-body.
* - `wakeUp`: should the rigid-body be automatically woken-up?
* @param {number} handle
* @param {RawVector} force
* @param {RawVector} point
* @param {boolean} wakeUp
*/
  rbAddForceAtPoint(handle: number, force: RawVector, point: RawVector, wakeUp: boolean): void;
/**
* Applies an impulse at the given world-space point of this rigid-body.
*
* # Parameters
* - `impulse`: the world-space impulse to apply on the rigid-body.
* - `point`: the world-space point where the impulse is to be applied on the rigid-body.
* - `wakeUp`: should the rigid-body be automatically woken-up?
* @param {number} handle
* @param {RawVector} impulse
* @param {RawVector} point
* @param {boolean} wakeUp
*/
  rbApplyImpulseAtPoint(handle: number, impulse: RawVector, point: RawVector, wakeUp: boolean): void;
/**
* @param {number} handle
* @returns {number}
*/
  rbAdditionalSolverIterations(handle: number): number;
/**
* @param {number} handle
* @param {number} iters
*/
  rbSetAdditionalSolverIterations(handle: number, iters: number): void;
/**
* An arbitrary user-defined 32-bit integer
* @param {number} handle
* @returns {number}
*/
  rbUserData(handle: number): number;
/**
* Sets the user-defined 32-bit integer of this rigid-body.
*
* # Parameters
* - `data`: an arbitrary user-defined 32-bit integer.
* @param {number} handle
* @param {number} data
*/
  rbSetUserData(handle: number, data: number): void;
/**
*/
  constructor();
/**
* @param {boolean} enabled
* @param {RawVector} translation
* @param {RawRotation} rotation
* @param {number} gravityScale
* @param {number} mass
* @param {boolean} massOnly
* @param {RawVector} centerOfMass
* @param {RawVector} linvel
* @param {RawVector} angvel
* @param {RawVector} principalAngularInertia
* @param {RawRotation} angularInertiaFrame
* @param {boolean} translationEnabledX
* @param {boolean} translationEnabledY
* @param {boolean} translationEnabledZ
* @param {boolean} rotationEnabledX
* @param {boolean} rotationEnabledY
* @param {boolean} rotationEnabledZ
* @param {number} linearDamping
* @param {number} angularDamping
* @param {RawRigidBodyType} rb_type
* @param {boolean} canSleep
* @param {boolean} sleeping
* @param {boolean} ccdEnabled
* @param {number} dominanceGroup
* @param {number} additional_solver_iterations
* @returns {number}
*/
  createRigidBody(enabled: boolean, translation: RawVector, rotation: RawRotation, gravityScale: number, mass: number, massOnly: boolean, centerOfMass: RawVector, linvel: RawVector, angvel: RawVector, principalAngularInertia: RawVector, angularInertiaFrame: RawRotation, translationEnabledX: boolean, translationEnabledY: boolean, translationEnabledZ: boolean, rotationEnabledX: boolean, rotationEnabledY: boolean, rotationEnabledZ: boolean, linearDamping: number, angularDamping: number, rb_type: RawRigidBodyType, canSleep: boolean, sleeping: boolean, ccdEnabled: boolean, dominanceGroup: number, additional_solver_iterations: number): number;
/**
* @param {number} handle
* @param {RawIslandManager} islands
* @param {RawColliderSet} colliders
* @param {RawImpulseJointSet} joints
* @param {RawMultibodyJointSet} articulations
*/
  remove(handle: number, islands: RawIslandManager, colliders: RawColliderSet, joints: RawImpulseJointSet, articulations: RawMultibodyJointSet): void;
/**
* The number of rigid-bodies on this set.
* @returns {number}
*/
  len(): number;
/**
* Checks if a rigid-body with the given integer handle exists.
* @param {number} handle
* @returns {boolean}
*/
  contains(handle: number): boolean;
/**
* Applies the given JavaScript function to the integer handle of each rigid-body managed by this set.
*
* # Parameters
* - `f(handle)`: the function to apply to the integer handle of each rigid-body managed by this set. Called as `f(collider)`.
* @param {Function} f
*/
  forEachRigidBodyHandle(f: Function): void;
/**
* @param {RawColliderSet} colliders
*/
  propagateModifiedBodyPositionsToColliders(colliders: RawColliderSet): void;
}
/**
* A rotation quaternion.
*/
export class RawRotation {
  free(): void;
/**
* @param {number} x
* @param {number} y
* @param {number} z
* @param {number} w
*/
  constructor(x: number, y: number, z: number, w: number);
/**
* The identity quaternion.
* @returns {RawRotation}
*/
  static identity(): RawRotation;
/**
* The `w` component of this quaternion.
*/
  readonly w: number;
/**
* The `x` component of this quaternion.
*/
  readonly x: number;
/**
* The `y` component of this quaternion.
*/
  readonly y: number;
/**
* The `z` component of this quaternion.
*/
  readonly z: number;
}
/**
*/
export class RawSdpMatrix3 {
  free(): void;
/**
* Row major list of the upper-triangular part of the symmetric matrix.
* @returns {Float32Array}
*/
  elements(): Float32Array;
}
/**
*/
export class RawSerializationPipeline {
  free(): void;
/**
*/
  constructor();
/**
* @param {RawVector} gravity
* @param {RawIntegrationParameters} integrationParameters
* @param {RawIslandManager} islands
* @param {RawBroadPhase} broadPhase
* @param {RawNarrowPhase} narrowPhase
* @param {RawRigidBodySet} bodies
* @param {RawColliderSet} colliders
* @param {RawImpulseJointSet} impulse_joints
* @param {RawMultibodyJointSet} multibody_joints
* @returns {Uint8Array | undefined}
*/
  serializeAll(gravity: RawVector, integrationParameters: RawIntegrationParameters, islands: RawIslandManager, broadPhase: RawBroadPhase, narrowPhase: RawNarrowPhase, bodies: RawRigidBodySet, colliders: RawColliderSet, impulse_joints: RawImpulseJointSet, multibody_joints: RawMultibodyJointSet): Uint8Array | undefined;
/**
* @param {Uint8Array} data
* @returns {RawDeserializedWorld | undefined}
*/
  deserializeAll(data: Uint8Array): RawDeserializedWorld | undefined;
}
/**
*/
export class RawShape {
  free(): void;
/**
* @param {number} hx
* @param {number} hy
* @param {number} hz
* @returns {RawShape}
*/
  static cuboid(hx: number, hy: number, hz: number): RawShape;
/**
* @param {number} hx
* @param {number} hy
* @param {number} hz
* @param {number} borderRadius
* @returns {RawShape}
*/
  static roundCuboid(hx: number, hy: number, hz: number, borderRadius: number): RawShape;
/**
* @param {number} radius
* @returns {RawShape}
*/
  static ball(radius: number): RawShape;
/**
* @param {RawVector} normal
* @returns {RawShape}
*/
  static halfspace(normal: RawVector): RawShape;
/**
* @param {number} halfHeight
* @param {number} radius
* @returns {RawShape}
*/
  static capsule(halfHeight: number, radius: number): RawShape;
/**
* @param {number} halfHeight
* @param {number} radius
* @returns {RawShape}
*/
  static cylinder(halfHeight: number, radius: number): RawShape;
/**
* @param {number} halfHeight
* @param {number} radius
* @param {number} borderRadius
* @returns {RawShape}
*/
  static roundCylinder(halfHeight: number, radius: number, borderRadius: number): RawShape;
/**
* @param {number} halfHeight
* @param {number} radius
* @returns {RawShape}
*/
  static cone(halfHeight: number, radius: number): RawShape;
/**
* @param {number} halfHeight
* @param {number} radius
* @param {number} borderRadius
* @returns {RawShape}
*/
  static roundCone(halfHeight: number, radius: number, borderRadius: number): RawShape;
/**
* @param {Float32Array} vertices
* @param {Uint32Array} indices
* @returns {RawShape}
*/
  static polyline(vertices: Float32Array, indices: Uint32Array): RawShape;
/**
* @param {Float32Array} vertices
* @param {Uint32Array} indices
* @returns {RawShape}
*/
  static trimesh(vertices: Float32Array, indices: Uint32Array): RawShape;
/**
* @param {number} nrows
* @param {number} ncols
* @param {Float32Array} heights
* @param {RawVector} scale
* @returns {RawShape}
*/
  static heightfield(nrows: number, ncols: number, heights: Float32Array, scale: RawVector): RawShape;
/**
* @param {RawVector} p1
* @param {RawVector} p2
* @returns {RawShape}
*/
  static segment(p1: RawVector, p2: RawVector): RawShape;
/**
* @param {RawVector} p1
* @param {RawVector} p2
* @param {RawVector} p3
* @returns {RawShape}
*/
  static triangle(p1: RawVector, p2: RawVector, p3: RawVector): RawShape;
/**
* @param {RawVector} p1
* @param {RawVector} p2
* @param {RawVector} p3
* @param {number} borderRadius
* @returns {RawShape}
*/
  static roundTriangle(p1: RawVector, p2: RawVector, p3: RawVector, borderRadius: number): RawShape;
/**
* @param {Float32Array} points
* @returns {RawShape | undefined}
*/
  static convexHull(points: Float32Array): RawShape | undefined;
/**
* @param {Float32Array} points
* @param {number} borderRadius
* @returns {RawShape | undefined}
*/
  static roundConvexHull(points: Float32Array, borderRadius: number): RawShape | undefined;
/**
* @param {Float32Array} vertices
* @param {Uint32Array} indices
* @returns {RawShape | undefined}
*/
  static convexMesh(vertices: Float32Array, indices: Uint32Array): RawShape | undefined;
/**
* @param {Float32Array} vertices
* @param {Uint32Array} indices
* @param {number} borderRadius
* @returns {RawShape | undefined}
*/
  static roundConvexMesh(vertices: Float32Array, indices: Uint32Array, borderRadius: number): RawShape | undefined;
/**
* @param {RawVector} shapePos1
* @param {RawRotation} shapeRot1
* @param {RawVector} shapeVel1
* @param {RawShape} shape2
* @param {RawVector} shapePos2
* @param {RawRotation} shapeRot2
* @param {RawVector} shapeVel2
* @param {number} maxToi
* @param {boolean} stop_at_penetration
* @returns {RawShapeTOI | undefined}
*/
  castShape(shapePos1: RawVector, shapeRot1: RawRotation, shapeVel1: RawVector, shape2: RawShape, shapePos2: RawVector, shapeRot2: RawRotation, shapeVel2: RawVector, maxToi: number, stop_at_penetration: boolean): RawShapeTOI | undefined;
/**
* @param {RawVector} shapePos1
* @param {RawRotation} shapeRot1
* @param {RawShape} shape2
* @param {RawVector} shapePos2
* @param {RawRotation} shapeRot2
* @returns {boolean}
*/
  intersectsShape(shapePos1: RawVector, shapeRot1: RawRotation, shape2: RawShape, shapePos2: RawVector, shapeRot2: RawRotation): boolean;
/**
* @param {RawVector} shapePos1
* @param {RawRotation} shapeRot1
* @param {RawShape} shape2
* @param {RawVector} shapePos2
* @param {RawRotation} shapeRot2
* @param {number} prediction
* @returns {RawShapeContact | undefined}
*/
  contactShape(shapePos1: RawVector, shapeRot1: RawRotation, shape2: RawShape, shapePos2: RawVector, shapeRot2: RawRotation, prediction: number): RawShapeContact | undefined;
/**
* @param {RawVector} shapePos
* @param {RawRotation} shapeRot
* @param {RawVector} point
* @returns {boolean}
*/
  containsPoint(shapePos: RawVector, shapeRot: RawRotation, point: RawVector): boolean;
/**
* @param {RawVector} shapePos
* @param {RawRotation} shapeRot
* @param {RawVector} point
* @param {boolean} solid
* @returns {RawPointProjection}
*/
  projectPoint(shapePos: RawVector, shapeRot: RawRotation, point: RawVector, solid: boolean): RawPointProjection;
/**
* @param {RawVector} shapePos
* @param {RawRotation} shapeRot
* @param {RawVector} rayOrig
* @param {RawVector} rayDir
* @param {number} maxToi
* @returns {boolean}
*/
  intersectsRay(shapePos: RawVector, shapeRot: RawRotation, rayOrig: RawVector, rayDir: RawVector, maxToi: number): boolean;
/**
* @param {RawVector} shapePos
* @param {RawRotation} shapeRot
* @param {RawVector} rayOrig
* @param {RawVector} rayDir
* @param {number} maxToi
* @param {boolean} solid
* @returns {number}
*/
  castRay(shapePos: RawVector, shapeRot: RawRotation, rayOrig: RawVector, rayDir: RawVector, maxToi: number, solid: boolean): number;
/**
* @param {RawVector} shapePos
* @param {RawRotation} shapeRot
* @param {RawVector} rayOrig
* @param {RawVector} rayDir
* @param {number} maxToi
* @param {boolean} solid
* @returns {RawRayIntersection | undefined}
*/
  castRayAndGetNormal(shapePos: RawVector, shapeRot: RawRotation, rayOrig: RawVector, rayDir: RawVector, maxToi: number, solid: boolean): RawRayIntersection | undefined;
}
/**
*/
export class RawShapeColliderTOI {
  free(): void;
/**
* @returns {number}
*/
  colliderHandle(): number;
/**
* @returns {number}
*/
  toi(): number;
/**
* @returns {RawVector}
*/
  witness1(): RawVector;
/**
* @returns {RawVector}
*/
  witness2(): RawVector;
/**
* @returns {RawVector}
*/
  normal1(): RawVector;
/**
* @returns {RawVector}
*/
  normal2(): RawVector;
}
/**
*/
export class RawShapeContact {
  free(): void;
/**
* @returns {number}
*/
  distance(): number;
/**
* @returns {RawVector}
*/
  point1(): RawVector;
/**
* @returns {RawVector}
*/
  point2(): RawVector;
/**
* @returns {RawVector}
*/
  normal1(): RawVector;
/**
* @returns {RawVector}
*/
  normal2(): RawVector;
}
/**
*/
export class RawShapeTOI {
  free(): void;
/**
* @returns {number}
*/
  toi(): number;
/**
* @returns {RawVector}
*/
  witness1(): RawVector;
/**
* @returns {RawVector}
*/
  witness2(): RawVector;
/**
* @returns {RawVector}
*/
  normal1(): RawVector;
/**
* @returns {RawVector}
*/
  normal2(): RawVector;
}
/**
* A vector.
*/
export class RawVector {
  free(): void;
/**
* Creates a new vector filled with zeros.
* @returns {RawVector}
*/
  static zero(): RawVector;
/**
* Creates a new 3D vector from its two components.
*
* # Parameters
* - `x`: the `x` component of this 3D vector.
* - `y`: the `y` component of this 3D vector.
* - `z`: the `z` component of this 3D vector.
* @param {number} x
* @param {number} y
* @param {number} z
*/
  constructor(x: number, y: number, z: number);
/**
* Create a new 3D vector from this vector with its components rearranged as `{x, y, z}`.
*
* This will effectively return a copy of `this`. This method exist for completeness with the
* other swizzling functions.
* @returns {RawVector}
*/
  xyz(): RawVector;
/**
* Create a new 3D vector from this vector with its components rearranged as `{y, x, z}`.
* @returns {RawVector}
*/
  yxz(): RawVector;
/**
* Create a new 3D vector from this vector with its components rearranged as `{z, x, y}`.
* @returns {RawVector}
*/
  zxy(): RawVector;
/**
* Create a new 3D vector from this vector with its components rearranged as `{x, z, y}`.
* @returns {RawVector}
*/
  xzy(): RawVector;
/**
* Create a new 3D vector from this vector with its components rearranged as `{y, z, x}`.
* @returns {RawVector}
*/
  yzx(): RawVector;
/**
* Create a new 3D vector from this vector with its components rearranged as `{z, y, x}`.
* @returns {RawVector}
*/
  zyx(): RawVector;
/**
* The `x` component of this vector.
*/
  x: number;
/**
* The `y` component of this vector.
*/
  y: number;
/**
* The `z` component of this vector.
*/
  z: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly version: (a: number) => void;
  readonly __wbg_rawkinematiccharactercontroller_free: (a: number) => void;
  readonly rawkinematiccharactercontroller_new: (a: number) => number;
  readonly rawkinematiccharactercontroller_setUp: (a: number, b: number) => void;
  readonly rawkinematiccharactercontroller_setOffset: (a: number, b: number) => void;
  readonly rawkinematiccharactercontroller_slideEnabled: (a: number) => number;
  readonly rawkinematiccharactercontroller_setSlideEnabled: (a: number, b: number) => void;
  readonly rawkinematiccharactercontroller_autostepMaxHeight: (a: number, b: number) => void;
  readonly rawkinematiccharactercontroller_autostepMinWidth: (a: number, b: number) => void;
  readonly rawkinematiccharactercontroller_autostepIncludesDynamicBodies: (a: number) => number;
  readonly rawkinematiccharactercontroller_autostepEnabled: (a: number) => number;
  readonly rawkinematiccharactercontroller_enableAutostep: (a: number, b: number, c: number, d: number) => void;
  readonly rawkinematiccharactercontroller_disableAutostep: (a: number) => void;
  readonly rawkinematiccharactercontroller_maxSlopeClimbAngle: (a: number) => number;
  readonly rawkinematiccharactercontroller_setMaxSlopeClimbAngle: (a: number, b: number) => void;
  readonly rawkinematiccharactercontroller_minSlopeSlideAngle: (a: number) => number;
  readonly rawkinematiccharactercontroller_setMinSlopeSlideAngle: (a: number, b: number) => void;
  readonly rawkinematiccharactercontroller_snapToGroundDistance: (a: number, b: number) => void;
  readonly rawkinematiccharactercontroller_enableSnapToGround: (a: number, b: number) => void;
  readonly rawkinematiccharactercontroller_disableSnapToGround: (a: number) => void;
  readonly rawkinematiccharactercontroller_snapToGroundEnabled: (a: number) => number;
  readonly rawkinematiccharactercontroller_computeColliderMovement: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number) => void;
  readonly rawkinematiccharactercontroller_computedMovement: (a: number) => number;
  readonly rawkinematiccharactercontroller_computedGrounded: (a: number) => number;
  readonly rawkinematiccharactercontroller_numComputedCollisions: (a: number) => number;
  readonly rawkinematiccharactercontroller_computedCollision: (a: number, b: number, c: number) => number;
  readonly __wbg_rawcharactercollision_free: (a: number) => void;
  readonly rawcharactercollision_new: () => number;
  readonly rawcharactercollision_handle: (a: number) => number;
  readonly rawcharactercollision_translationDeltaApplied: (a: number) => number;
  readonly rawcharactercollision_translationDeltaRemaining: (a: number) => number;
  readonly rawcharactercollision_toi: (a: number) => number;
  readonly rawcharactercollision_worldWitness1: (a: number) => number;
  readonly rawcharactercollision_worldWitness2: (a: number) => number;
  readonly rawcharactercollision_worldNormal1: (a: number) => number;
  readonly rawcharactercollision_worldNormal2: (a: number) => number;
  readonly __wbg_rawdynamicraycastvehiclecontroller_free: (a: number) => void;
  readonly rawdynamicraycastvehiclecontroller_new: (a: number) => number;
  readonly rawdynamicraycastvehiclecontroller_current_vehicle_speed: (a: number) => number;
  readonly rawdynamicraycastvehiclecontroller_chassis: (a: number) => number;
  readonly rawdynamicraycastvehiclecontroller_index_up_axis: (a: number) => number;
  readonly rawdynamicraycastvehiclecontroller_set_index_up_axis: (a: number, b: number) => void;
  readonly rawdynamicraycastvehiclecontroller_index_forward_axis: (a: number) => number;
  readonly rawdynamicraycastvehiclecontroller_set_index_forward_axis: (a: number, b: number) => void;
  readonly rawdynamicraycastvehiclecontroller_add_wheel: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly rawdynamicraycastvehiclecontroller_num_wheels: (a: number) => number;
  readonly rawdynamicraycastvehiclecontroller_update_vehicle: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_chassis_connection_point_cs: (a: number, b: number) => number;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_chassis_connection_point_cs: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_suspension_rest_length: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_suspension_rest_length: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_max_suspension_travel: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_travel: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_radius: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_radius: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_suspension_stiffness: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_suspension_stiffness: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_suspension_compression: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_suspension_compression: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_suspension_relaxation: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_suspension_relaxation: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_max_suspension_force: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_force: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_brake: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_brake: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_steering: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_steering: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_engine_force: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_engine_force: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_direction_cs: (a: number, b: number) => number;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_direction_cs: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_axle_cs: (a: number, b: number) => number;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_axle_cs: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_friction_slip: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_friction_slip: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_side_friction_stiffness: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_set_wheel_side_friction_stiffness: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_rotation: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_forward_impulse: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_side_impulse: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_suspension_force: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_contact_normal_ws: (a: number, b: number) => number;
  readonly rawdynamicraycastvehiclecontroller_wheel_contact_point_ws: (a: number, b: number) => number;
  readonly rawdynamicraycastvehiclecontroller_wheel_suspension_length: (a: number, b: number, c: number) => void;
  readonly rawdynamicraycastvehiclecontroller_wheel_hard_point_ws: (a: number, b: number) => number;
  readonly rawdynamicraycastvehiclecontroller_wheel_is_in_contact: (a: number, b: number) => number;
  readonly rawdynamicraycastvehiclecontroller_wheel_ground_object: (a: number, b: number, c: number) => void;
  readonly __wbg_rawccdsolver_free: (a: number) => void;
  readonly rawccdsolver_new: () => number;
  readonly rawimpulsejointset_jointType: (a: number, b: number) => number;
  readonly rawimpulsejointset_jointBodyHandle1: (a: number, b: number) => number;
  readonly rawimpulsejointset_jointBodyHandle2: (a: number, b: number) => number;
  readonly rawimpulsejointset_jointFrameX1: (a: number, b: number) => number;
  readonly rawimpulsejointset_jointFrameX2: (a: number, b: number) => number;
  readonly rawimpulsejointset_jointAnchor1: (a: number, b: number) => number;
  readonly rawimpulsejointset_jointAnchor2: (a: number, b: number) => number;
  readonly rawimpulsejointset_jointSetAnchor1: (a: number, b: number, c: number) => void;
  readonly rawimpulsejointset_jointSetAnchor2: (a: number, b: number, c: number) => void;
  readonly rawimpulsejointset_jointContactsEnabled: (a: number, b: number) => number;
  readonly rawimpulsejointset_jointSetContactsEnabled: (a: number, b: number, c: number) => void;
  readonly rawimpulsejointset_jointLimitsEnabled: (a: number, b: number, c: number) => number;
  readonly rawimpulsejointset_jointLimitsMin: (a: number, b: number, c: number) => number;
  readonly rawimpulsejointset_jointLimitsMax: (a: number, b: number, c: number) => number;
  readonly rawimpulsejointset_jointSetLimits: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly rawimpulsejointset_jointConfigureMotorModel: (a: number, b: number, c: number, d: number) => void;
  readonly rawimpulsejointset_jointConfigureMotorVelocity: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly rawimpulsejointset_jointConfigureMotorPosition: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly rawimpulsejointset_jointConfigureMotor: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly __wbg_rawimpulsejointset_free: (a: number) => void;
  readonly rawimpulsejointset_new: () => number;
  readonly rawimpulsejointset_createJoint: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rawimpulsejointset_remove: (a: number, b: number, c: number) => void;
  readonly rawimpulsejointset_len: (a: number) => number;
  readonly rawimpulsejointset_contains: (a: number, b: number) => number;
  readonly rawimpulsejointset_forEachJointHandle: (a: number, b: number) => void;
  readonly rawimpulsejointset_forEachJointAttachedToRigidBody: (a: number, b: number, c: number) => void;
  readonly __wbg_rawintegrationparameters_free: (a: number) => void;
  readonly rawintegrationparameters_new: () => number;
  readonly rawintegrationparameters_dt: (a: number) => number;
  readonly rawintegrationparameters_erp: (a: number) => number;
  readonly rawintegrationparameters_numSolverIterations: (a: number) => number;
  readonly rawintegrationparameters_numAdditionalFrictionIterations: (a: number) => number;
  readonly rawintegrationparameters_numInternalPgsIterations: (a: number) => number;
  readonly rawintegrationparameters_set_dt: (a: number, b: number) => void;
  readonly rawintegrationparameters_set_erp: (a: number, b: number) => void;
  readonly rawintegrationparameters_set_allowedLinearError: (a: number, b: number) => void;
  readonly rawintegrationparameters_set_predictionDistance: (a: number, b: number) => void;
  readonly rawintegrationparameters_set_numSolverIterations: (a: number, b: number) => void;
  readonly rawintegrationparameters_set_numAdditionalFrictionIterations: (a: number, b: number) => void;
  readonly rawintegrationparameters_set_numInternalPgsIterations: (a: number, b: number) => void;
  readonly rawintegrationparameters_switchToStandardPgsSolver: (a: number) => void;
  readonly rawintegrationparameters_switchToSmallStepsPgsSolver: (a: number) => void;
  readonly __wbg_rawislandmanager_free: (a: number) => void;
  readonly rawislandmanager_new: () => number;
  readonly rawislandmanager_forEachActiveRigidBodyHandle: (a: number, b: number) => void;
  readonly __wbg_rawgenericjoint_free: (a: number) => void;
  readonly rawgenericjoint_generic: (a: number, b: number, c: number, d: number) => number;
  readonly rawgenericjoint_spring: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rawgenericjoint_rope: (a: number, b: number, c: number) => number;
  readonly rawgenericjoint_spherical: (a: number, b: number) => number;
  readonly rawgenericjoint_prismatic: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly rawgenericjoint_fixed: (a: number, b: number, c: number, d: number) => number;
  readonly rawgenericjoint_revolute: (a: number, b: number, c: number) => number;
  readonly rawmultibodyjointset_jointType: (a: number, b: number) => number;
  readonly rawmultibodyjointset_jointFrameX1: (a: number, b: number) => number;
  readonly rawmultibodyjointset_jointFrameX2: (a: number, b: number) => number;
  readonly rawmultibodyjointset_jointAnchor1: (a: number, b: number) => number;
  readonly rawmultibodyjointset_jointAnchor2: (a: number, b: number) => number;
  readonly rawmultibodyjointset_jointContactsEnabled: (a: number, b: number) => number;
  readonly rawmultibodyjointset_jointSetContactsEnabled: (a: number, b: number, c: number) => void;
  readonly rawmultibodyjointset_jointLimitsEnabled: (a: number, b: number, c: number) => number;
  readonly rawmultibodyjointset_jointLimitsMin: (a: number, b: number, c: number) => number;
  readonly rawmultibodyjointset_jointLimitsMax: (a: number, b: number, c: number) => number;
  readonly __wbg_rawmultibodyjointset_free: (a: number) => void;
  readonly rawmultibodyjointset_new: () => number;
  readonly rawmultibodyjointset_createJoint: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rawmultibodyjointset_remove: (a: number, b: number, c: number) => void;
  readonly rawmultibodyjointset_contains: (a: number, b: number) => number;
  readonly rawmultibodyjointset_forEachJointHandle: (a: number, b: number) => void;
  readonly rawmultibodyjointset_forEachJointAttachedToRigidBody: (a: number, b: number, c: number) => void;
  readonly rawrigidbodyset_rbTranslation: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbRotation: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbSleep: (a: number, b: number) => void;
  readonly rawrigidbodyset_rbIsSleeping: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbIsMoving: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbNextTranslation: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbNextRotation: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbSetTranslation: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly rawrigidbodyset_rbSetRotation: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly rawrigidbodyset_rbSetLinvel: (a: number, b: number, c: number, d: number) => void;
  readonly rawrigidbodyset_rbSetAngvel: (a: number, b: number, c: number, d: number) => void;
  readonly rawrigidbodyset_rbSetNextKinematicTranslation: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly rawrigidbodyset_rbSetNextKinematicRotation: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly rawrigidbodyset_rbRecomputeMassPropertiesFromColliders: (a: number, b: number, c: number) => void;
  readonly rawrigidbodyset_rbSetAdditionalMass: (a: number, b: number, c: number, d: number) => void;
  readonly rawrigidbodyset_rbSetAdditionalMassProperties: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly rawrigidbodyset_rbLinvel: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbAngvel: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbLockTranslations: (a: number, b: number, c: number, d: number) => void;
  readonly rawrigidbodyset_rbSetEnabledTranslations: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly rawrigidbodyset_rbLockRotations: (a: number, b: number, c: number, d: number) => void;
  readonly rawrigidbodyset_rbSetEnabledRotations: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly rawrigidbodyset_rbDominanceGroup: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbSetDominanceGroup: (a: number, b: number, c: number) => void;
  readonly rawrigidbodyset_rbEnableCcd: (a: number, b: number, c: number) => void;
  readonly rawrigidbodyset_rbMass: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbInvMass: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbEffectiveInvMass: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbLocalCom: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbWorldCom: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbInvPrincipalInertiaSqrt: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbPrincipalInertiaLocalFrame: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbPrincipalInertia: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbEffectiveWorldInvInertiaSqrt: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbEffectiveAngularInertia: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbWakeUp: (a: number, b: number) => void;
  readonly rawrigidbodyset_rbIsCcdEnabled: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbNumColliders: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbCollider: (a: number, b: number, c: number) => number;
  readonly rawrigidbodyset_rbBodyType: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbSetBodyType: (a: number, b: number, c: number, d: number) => void;
  readonly rawrigidbodyset_rbIsFixed: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbIsKinematic: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbIsDynamic: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbLinearDamping: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbAngularDamping: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbSetLinearDamping: (a: number, b: number, c: number) => void;
  readonly rawrigidbodyset_rbSetAngularDamping: (a: number, b: number, c: number) => void;
  readonly rawrigidbodyset_rbSetEnabled: (a: number, b: number, c: number) => void;
  readonly rawrigidbodyset_rbIsEnabled: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbGravityScale: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbSetGravityScale: (a: number, b: number, c: number, d: number) => void;
  readonly rawrigidbodyset_rbResetForces: (a: number, b: number, c: number) => void;
  readonly rawrigidbodyset_rbResetTorques: (a: number, b: number, c: number) => void;
  readonly rawrigidbodyset_rbAddForce: (a: number, b: number, c: number, d: number) => void;
  readonly rawrigidbodyset_rbApplyImpulse: (a: number, b: number, c: number, d: number) => void;
  readonly rawrigidbodyset_rbAddTorque: (a: number, b: number, c: number, d: number) => void;
  readonly rawrigidbodyset_rbApplyTorqueImpulse: (a: number, b: number, c: number, d: number) => void;
  readonly rawrigidbodyset_rbAddForceAtPoint: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly rawrigidbodyset_rbApplyImpulseAtPoint: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly rawrigidbodyset_rbAdditionalSolverIterations: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbSetAdditionalSolverIterations: (a: number, b: number, c: number) => void;
  readonly rawrigidbodyset_rbUserData: (a: number, b: number) => number;
  readonly rawrigidbodyset_rbSetUserData: (a: number, b: number, c: number) => void;
  readonly __wbg_rawrigidbodyset_free: (a: number) => void;
  readonly rawrigidbodyset_new: () => number;
  readonly rawrigidbodyset_createRigidBody: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number, x: number, y: number, z: number) => number;
  readonly rawrigidbodyset_remove: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly rawrigidbodyset_contains: (a: number, b: number) => number;
  readonly rawrigidbodyset_forEachRigidBodyHandle: (a: number, b: number) => void;
  readonly rawrigidbodyset_propagateModifiedBodyPositionsToColliders: (a: number, b: number) => void;
  readonly __wbg_rawbroadphase_free: (a: number) => void;
  readonly rawbroadphase_new: () => number;
  readonly rawcolliderset_coTranslation: (a: number, b: number) => number;
  readonly rawcolliderset_coRotation: (a: number, b: number) => number;
  readonly rawcolliderset_coSetTranslation: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly rawcolliderset_coSetTranslationWrtParent: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly rawcolliderset_coSetRotation: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly rawcolliderset_coSetRotationWrtParent: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly rawcolliderset_coIsSensor: (a: number, b: number) => number;
  readonly rawcolliderset_coShapeType: (a: number, b: number) => number;
  readonly rawcolliderset_coHalfspaceNormal: (a: number, b: number) => number;
  readonly rawcolliderset_coHalfExtents: (a: number, b: number) => number;
  readonly rawcolliderset_coSetHalfExtents: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coRadius: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetRadius: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coHalfHeight: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetHalfHeight: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coRoundRadius: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetRoundRadius: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coVertices: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coIndices: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coHeightfieldHeights: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coHeightfieldScale: (a: number, b: number) => number;
  readonly rawcolliderset_coHeightfieldNRows: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coHeightfieldNCols: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coParent: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetEnabled: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coIsEnabled: (a: number, b: number) => number;
  readonly rawcolliderset_coFriction: (a: number, b: number) => number;
  readonly rawcolliderset_coRestitution: (a: number, b: number) => number;
  readonly rawcolliderset_coDensity: (a: number, b: number) => number;
  readonly rawcolliderset_coMass: (a: number, b: number) => number;
  readonly rawcolliderset_coVolume: (a: number, b: number) => number;
  readonly rawcolliderset_coCollisionGroups: (a: number, b: number) => number;
  readonly rawcolliderset_coSolverGroups: (a: number, b: number) => number;
  readonly rawcolliderset_coActiveHooks: (a: number, b: number) => number;
  readonly rawcolliderset_coActiveCollisionTypes: (a: number, b: number) => number;
  readonly rawcolliderset_coActiveEvents: (a: number, b: number) => number;
  readonly rawcolliderset_coContactForceEventThreshold: (a: number, b: number) => number;
  readonly rawcolliderset_coContainsPoint: (a: number, b: number, c: number) => number;
  readonly rawcolliderset_coCastShape: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
  readonly rawcolliderset_coCastCollider: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly rawcolliderset_coIntersectsShape: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rawcolliderset_coContactShape: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly rawcolliderset_coContactCollider: (a: number, b: number, c: number, d: number) => number;
  readonly rawcolliderset_coProjectPoint: (a: number, b: number, c: number, d: number) => number;
  readonly rawcolliderset_coIntersectsRay: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rawcolliderset_coCastRay: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly rawcolliderset_coCastRayAndGetNormal: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly rawcolliderset_coSetSensor: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetRestitution: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetFriction: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coFrictionCombineRule: (a: number, b: number) => number;
  readonly rawcolliderset_coSetFrictionCombineRule: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coRestitutionCombineRule: (a: number, b: number) => number;
  readonly rawcolliderset_coSetRestitutionCombineRule: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetCollisionGroups: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetSolverGroups: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetActiveHooks: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetActiveEvents: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetActiveCollisionTypes: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetShape: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetContactForceEventThreshold: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetDensity: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetMass: (a: number, b: number, c: number) => void;
  readonly rawcolliderset_coSetMassProperties: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly __wbg_rawcolliderset_free: (a: number) => void;
  readonly rawcolliderset_new: () => number;
  readonly rawcolliderset_len: (a: number) => number;
  readonly rawcolliderset_contains: (a: number, b: number) => number;
  readonly rawcolliderset_createCollider: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number, x: number, y: number, z: number) => void;
  readonly rawcolliderset_remove: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly rawcolliderset_forEachColliderHandle: (a: number, b: number) => void;
  readonly __wbg_rawshapecontact_free: (a: number) => void;
  readonly __wbg_rawnarrowphase_free: (a: number) => void;
  readonly rawnarrowphase_new: () => number;
  readonly rawnarrowphase_contact_pairs_with: (a: number, b: number, c: number) => void;
  readonly rawnarrowphase_contact_pair: (a: number, b: number, c: number) => number;
  readonly rawnarrowphase_intersection_pairs_with: (a: number, b: number, c: number) => void;
  readonly rawnarrowphase_intersection_pair: (a: number, b: number, c: number) => number;
  readonly __wbg_rawcontactmanifold_free: (a: number) => void;
  readonly rawcontactpair_collider1: (a: number) => number;
  readonly rawcontactpair_collider2: (a: number) => number;
  readonly rawcontactpair_numContactManifolds: (a: number) => number;
  readonly rawcontactpair_contactManifold: (a: number, b: number) => number;
  readonly rawcontactmanifold_normal: (a: number) => number;
  readonly rawcontactmanifold_local_n1: (a: number) => number;
  readonly rawcontactmanifold_local_n2: (a: number) => number;
  readonly rawcontactmanifold_subshape1: (a: number) => number;
  readonly rawcontactmanifold_subshape2: (a: number) => number;
  readonly rawcontactmanifold_num_contacts: (a: number) => number;
  readonly rawcontactmanifold_contact_local_p1: (a: number, b: number) => number;
  readonly rawcontactmanifold_contact_local_p2: (a: number, b: number) => number;
  readonly rawcontactmanifold_contact_dist: (a: number, b: number) => number;
  readonly rawcontactmanifold_contact_fid1: (a: number, b: number) => number;
  readonly rawcontactmanifold_contact_fid2: (a: number, b: number) => number;
  readonly rawcontactmanifold_contact_impulse: (a: number, b: number) => number;
  readonly rawcontactmanifold_contact_tangent_impulse_x: (a: number, b: number) => number;
  readonly rawcontactmanifold_contact_tangent_impulse_y: (a: number, b: number) => number;
  readonly rawcontactmanifold_num_solver_contacts: (a: number) => number;
  readonly rawcontactmanifold_solver_contact_point: (a: number, b: number) => number;
  readonly rawcontactmanifold_solver_contact_dist: (a: number, b: number) => number;
  readonly rawcontactmanifold_solver_contact_friction: (a: number, b: number) => number;
  readonly rawcontactmanifold_solver_contact_restitution: (a: number, b: number) => number;
  readonly rawcontactmanifold_solver_contact_tangent_velocity: (a: number, b: number) => number;
  readonly __wbg_rawpointprojection_free: (a: number) => void;
  readonly rawpointprojection_point: (a: number) => number;
  readonly rawpointprojection_isInside: (a: number) => number;
  readonly __wbg_rawpointcolliderprojection_free: (a: number) => void;
  readonly rawpointcolliderprojection_colliderHandle: (a: number) => number;
  readonly rawpointcolliderprojection_point: (a: number) => number;
  readonly rawpointcolliderprojection_isInside: (a: number) => number;
  readonly rawpointcolliderprojection_featureType: (a: number) => number;
  readonly rawpointcolliderprojection_featureId: (a: number, b: number) => void;
  readonly __wbg_rawrayintersection_free: (a: number) => void;
  readonly rawraycolliderintersection_normal: (a: number) => number;
  readonly rawraycolliderintersection_toi: (a: number) => number;
  readonly __wbg_rawraycollidertoi_free: (a: number) => void;
  readonly __wbg_rawshape_free: (a: number) => void;
  readonly rawshape_cuboid: (a: number, b: number, c: number) => number;
  readonly rawshape_roundCuboid: (a: number, b: number, c: number, d: number) => number;
  readonly rawshape_ball: (a: number) => number;
  readonly rawshape_halfspace: (a: number) => number;
  readonly rawshape_capsule: (a: number, b: number) => number;
  readonly rawshape_cylinder: (a: number, b: number) => number;
  readonly rawshape_roundCylinder: (a: number, b: number, c: number) => number;
  readonly rawshape_cone: (a: number, b: number) => number;
  readonly rawshape_roundCone: (a: number, b: number, c: number) => number;
  readonly rawshape_polyline: (a: number, b: number, c: number, d: number) => number;
  readonly rawshape_trimesh: (a: number, b: number, c: number, d: number) => number;
  readonly rawshape_heightfield: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rawshape_segment: (a: number, b: number) => number;
  readonly rawshape_triangle: (a: number, b: number, c: number) => number;
  readonly rawshape_roundTriangle: (a: number, b: number, c: number, d: number) => number;
  readonly rawshape_convexHull: (a: number, b: number) => number;
  readonly rawshape_roundConvexHull: (a: number, b: number, c: number) => number;
  readonly rawshape_convexMesh: (a: number, b: number, c: number, d: number) => number;
  readonly rawshape_roundConvexMesh: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rawshape_castShape: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => number;
  readonly rawshape_intersectsShape: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly rawshape_contactShape: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly rawshape_containsPoint: (a: number, b: number, c: number, d: number) => number;
  readonly rawshape_projectPoint: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rawshape_intersectsRay: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly rawshape_castRay: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly rawshape_castRayAndGetNormal: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly rawshapetoi_witness1: (a: number) => number;
  readonly rawshapetoi_normal1: (a: number) => number;
  readonly rawshapetoi_normal2: (a: number) => number;
  readonly __wbg_rawshapecollidertoi_free: (a: number) => void;
  readonly rawshapecollidertoi_witness2: (a: number) => number;
  readonly rawrotation_new: (a: number, b: number, c: number, d: number) => number;
  readonly rawrotation_identity: () => number;
  readonly rawrotation_x: (a: number) => number;
  readonly rawvector_zero: () => number;
  readonly rawvector_new: (a: number, b: number, c: number) => number;
  readonly rawvector_set_x: (a: number, b: number) => void;
  readonly rawvector_set_z: (a: number, b: number) => void;
  readonly rawvector_xyz: (a: number) => number;
  readonly rawvector_yxz: (a: number) => number;
  readonly rawvector_zxy: (a: number) => number;
  readonly rawvector_xzy: (a: number) => number;
  readonly rawvector_yzx: (a: number) => number;
  readonly rawvector_zyx: (a: number) => number;
  readonly rawsdpmatrix3_elements: (a: number) => number;
  readonly __wbg_rawdebugrenderpipeline_free: (a: number) => void;
  readonly rawdebugrenderpipeline_new: () => number;
  readonly rawdebugrenderpipeline_vertices: (a: number) => number;
  readonly rawdebugrenderpipeline_colors: (a: number) => number;
  readonly rawdebugrenderpipeline_render: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly __wbg_raweventqueue_free: (a: number) => void;
  readonly __wbg_rawcontactforceevent_free: (a: number) => void;
  readonly rawcontactforceevent_collider2: (a: number) => number;
  readonly rawcontactforceevent_total_force: (a: number) => number;
  readonly rawcontactforceevent_total_force_magnitude: (a: number) => number;
  readonly rawcontactforceevent_max_force_direction: (a: number) => number;
  readonly rawcontactforceevent_max_force_magnitude: (a: number) => number;
  readonly raweventqueue_new: (a: number) => number;
  readonly raweventqueue_drainCollisionEvents: (a: number, b: number) => void;
  readonly raweventqueue_drainContactForceEvents: (a: number, b: number) => void;
  readonly raweventqueue_clear: (a: number) => void;
  readonly __wbg_rawphysicspipeline_free: (a: number) => void;
  readonly rawphysicspipeline_new: () => number;
  readonly rawphysicspipeline_step: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => void;
  readonly rawphysicspipeline_stepWithEvents: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number) => void;
  readonly __wbg_rawquerypipeline_free: (a: number) => void;
  readonly rawquerypipeline_new: () => number;
  readonly rawquerypipeline_update: (a: number, b: number, c: number) => void;
  readonly rawquerypipeline_castRay: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number) => number;
  readonly rawquerypipeline_castRayAndGetNormal: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number) => number;
  readonly rawquerypipeline_intersectionsWithRay: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number) => void;
  readonly rawquerypipeline_intersectionWithShape: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number) => void;
  readonly rawquerypipeline_projectPoint: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => number;
  readonly rawquerypipeline_projectPointAndGetFeature: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => number;
  readonly rawquerypipeline_intersectionsWithPoint: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
  readonly rawquerypipeline_castShape: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number) => number;
  readonly rawquerypipeline_intersectionsWithShape: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number) => void;
  readonly rawquerypipeline_collidersWithAabbIntersectingAabb: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_rawdeserializedworld_free: (a: number) => void;
  readonly rawdeserializedworld_takeGravity: (a: number) => number;
  readonly rawdeserializedworld_takeIntegrationParameters: (a: number) => number;
  readonly rawdeserializedworld_takeIslandManager: (a: number) => number;
  readonly rawdeserializedworld_takeBroadPhase: (a: number) => number;
  readonly rawdeserializedworld_takeNarrowPhase: (a: number) => number;
  readonly rawdeserializedworld_takeBodies: (a: number) => number;
  readonly rawdeserializedworld_takeColliders: (a: number) => number;
  readonly rawdeserializedworld_takeImpulseJoints: (a: number) => number;
  readonly rawdeserializedworld_takeMultibodyJoints: (a: number) => number;
  readonly rawserializationpipeline_new: () => number;
  readonly rawserializationpipeline_serializeAll: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => number;
  readonly rawserializationpipeline_deserializeAll: (a: number, b: number) => number;
  readonly rawintegrationparameters_set_minIslandSize: (a: number, b: number) => void;
  readonly rawintegrationparameters_set_maxCcdSubsteps: (a: number, b: number) => void;
  readonly rawvector_set_y: (a: number, b: number) => void;
  readonly rawkinematiccharactercontroller_up: (a: number) => number;
  readonly rawshapecontact_normal2: (a: number) => number;
  readonly rawshapecontact_point1: (a: number) => number;
  readonly rawshapecontact_point2: (a: number) => number;
  readonly rawrayintersection_normal: (a: number) => number;
  readonly rawshapecollidertoi_witness1: (a: number) => number;
  readonly rawshapecontact_normal1: (a: number) => number;
  readonly rawshapecollidertoi_normal1: (a: number) => number;
  readonly rawshapecollidertoi_normal2: (a: number) => number;
  readonly rawshapetoi_witness2: (a: number) => number;
  readonly rawkinematiccharactercontroller_offset: (a: number) => number;
  readonly rawintegrationparameters_predictionDistance: (a: number) => number;
  readonly rawintegrationparameters_minIslandSize: (a: number) => number;
  readonly rawintegrationparameters_maxCcdSubsteps: (a: number) => number;
  readonly rawrigidbodyset_len: (a: number) => number;
  readonly rawshapecontact_distance: (a: number) => number;
  readonly rawrayintersection_featureType: (a: number) => number;
  readonly rawraycolliderintersection_colliderHandle: (a: number) => number;
  readonly rawrayintersection_toi: (a: number) => number;
  readonly rawraycolliderintersection_featureType: (a: number) => number;
  readonly rawraycollidertoi_colliderHandle: (a: number) => number;
  readonly rawraycollidertoi_toi: (a: number) => number;
  readonly rawshapecollidertoi_colliderHandle: (a: number) => number;
  readonly rawshapecollidertoi_toi: (a: number) => number;
  readonly rawshapetoi_toi: (a: number) => number;
  readonly rawrotation_y: (a: number) => number;
  readonly rawrotation_z: (a: number) => number;
  readonly rawrotation_w: (a: number) => number;
  readonly rawvector_x: (a: number) => number;
  readonly rawvector_y: (a: number) => number;
  readonly rawvector_z: (a: number) => number;
  readonly rawcontactforceevent_collider1: (a: number) => number;
  readonly rawintegrationparameters_allowedLinearError: (a: number) => number;
  readonly rawcolliderset_isHandleValid: (a: number, b: number) => number;
  readonly __wbg_rawserializationpipeline_free: (a: number) => void;
  readonly rawrayintersection_featureId: (a: number, b: number) => void;
  readonly rawraycolliderintersection_featureId: (a: number, b: number) => void;
  readonly __wbg_rawcontactpair_free: (a: number) => void;
  readonly __wbg_rawraycolliderintersection_free: (a: number) => void;
  readonly __wbg_rawshapetoi_free: (a: number) => void;
  readonly __wbg_rawrotation_free: (a: number) => void;
  readonly __wbg_rawvector_free: (a: number) => void;
  readonly __wbg_rawsdpmatrix3_free: (a: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
