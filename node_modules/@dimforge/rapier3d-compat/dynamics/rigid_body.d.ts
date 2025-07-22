import { RawRigidBodySet } from "../raw";
import { Rotation, Vector } from "../math";
import { SdpMatrix3 } from "../math";
import { Collider, ColliderSet } from "../geometry";
/**
 * The integer identifier of a collider added to a `ColliderSet`.
 */
export declare type RigidBodyHandle = number;
/**
 * The simulation status of a rigid-body.
 */
export declare enum RigidBodyType {
    /**
     * A `RigidBodyType::Dynamic` body can be affected by all external forces.
     */
    Dynamic = 0,
    /**
     * A `RigidBodyType::Fixed` body cannot be affected by external forces.
     */
    Fixed = 1,
    /**
     * A `RigidBodyType::KinematicPositionBased` body cannot be affected by any external forces but can be controlled
     * by the user at the position level while keeping realistic one-way interaction with dynamic bodies.
     *
     * One-way interaction means that a kinematic body can push a dynamic body, but a kinematic body
     * cannot be pushed by anything. In other words, the trajectory of a kinematic body can only be
     * modified by the user and is independent from any contact or joint it is involved in.
     */
    KinematicPositionBased = 2,
    /**
     * A `RigidBodyType::KinematicVelocityBased` body cannot be affected by any external forces but can be controlled
     * by the user at the velocity level while keeping realistic one-way interaction with dynamic bodies.
     *
     * One-way interaction means that a kinematic body can push a dynamic body, but a kinematic body
     * cannot be pushed by anything. In other words, the trajectory of a kinematic body can only be
     * modified by the user and is independent from any contact or joint it is involved in.
     */
    KinematicVelocityBased = 3
}
/**
 * A rigid-body.
 */
export declare class RigidBody {
    private rawSet;
    private colliderSet;
    readonly handle: RigidBodyHandle;
    /**
     * An arbitrary user-defined object associated with this rigid-body.
     */
    userData?: unknown;
    constructor(rawSet: RawRigidBodySet, colliderSet: ColliderSet, handle: RigidBodyHandle);
    /** @internal */
    finalizeDeserialization(colliderSet: ColliderSet): void;
    /**
     * Checks if this rigid-body is still valid (i.e. that it has
     * not been deleted from the rigid-body set yet.
     */
    isValid(): boolean;
    /**
     * Locks or unlocks the ability of this rigid-body to translate.
     *
     * @param locked - If `true`, this rigid-body will no longer translate due to forces and impulses.
     * @param wakeUp - If `true`, this rigid-body will be automatically awaken if it is currently asleep.
     */
    lockTranslations(locked: boolean, wakeUp: boolean): void;
    /**
     * Locks or unlocks the ability of this rigid-body to rotate.
     *
     * @param locked - If `true`, this rigid-body will no longer rotate due to torques and impulses.
     * @param wakeUp - If `true`, this rigid-body will be automatically awaken if it is currently asleep.
     */
    lockRotations(locked: boolean, wakeUp: boolean): void;
    /**
     * Locks or unlocks the ability of this rigid-body to translate along individual coordinate axes.
     *
     * @param enableX - If `false`, this rigid-body will no longer translate due to torques and impulses, along the X coordinate axis.
     * @param enableY - If `false`, this rigid-body will no longer translate due to torques and impulses, along the Y coordinate axis.
     * @param enableZ - If `false`, this rigid-body will no longer translate due to torques and impulses, along the Z coordinate axis.
     * @param wakeUp - If `true`, this rigid-body will be automatically awaken if it is currently asleep.
     */
    setEnabledTranslations(enableX: boolean, enableY: boolean, enableZ: boolean, wakeUp: boolean): void;
    /**
     * Locks or unlocks the ability of this rigid-body to translate along individual coordinate axes.
     *
     * @param enableX - If `false`, this rigid-body will no longer translate due to torques and impulses, along the X coordinate axis.
     * @param enableY - If `false`, this rigid-body will no longer translate due to torques and impulses, along the Y coordinate axis.
     * @param enableZ - If `false`, this rigid-body will no longer translate due to torques and impulses, along the Z coordinate axis.
     * @param wakeUp - If `true`, this rigid-body will be automatically awaken if it is currently asleep.
     * @deprecated use `this.setEnabledTranslations` with the same arguments instead.
     */
    restrictTranslations(enableX: boolean, enableY: boolean, enableZ: boolean, wakeUp: boolean): void;
    /**
     * Locks or unlocks the ability of this rigid-body to rotate along individual coordinate axes.
     *
     * @param enableX - If `false`, this rigid-body will no longer rotate due to torques and impulses, along the X coordinate axis.
     * @param enableY - If `false`, this rigid-body will no longer rotate due to torques and impulses, along the Y coordinate axis.
     * @param enableZ - If `false`, this rigid-body will no longer rotate due to torques and impulses, along the Z coordinate axis.
     * @param wakeUp - If `true`, this rigid-body will be automatically awaken if it is currently asleep.
     */
    setEnabledRotations(enableX: boolean, enableY: boolean, enableZ: boolean, wakeUp: boolean): void;
    /**
     * Locks or unlocks the ability of this rigid-body to rotate along individual coordinate axes.
     *
     * @param enableX - If `false`, this rigid-body will no longer rotate due to torques and impulses, along the X coordinate axis.
     * @param enableY - If `false`, this rigid-body will no longer rotate due to torques and impulses, along the Y coordinate axis.
     * @param enableZ - If `false`, this rigid-body will no longer rotate due to torques and impulses, along the Z coordinate axis.
     * @param wakeUp - If `true`, this rigid-body will be automatically awaken if it is currently asleep.
     * @deprecated use `this.setEnabledRotations` with the same arguments instead.
     */
    restrictRotations(enableX: boolean, enableY: boolean, enableZ: boolean, wakeUp: boolean): void;
    /**
     * The dominance group, in [-127, +127] this rigid-body is part of.
     */
    dominanceGroup(): number;
    /**
     * Sets the dominance group of this rigid-body.
     *
     * @param group - The dominance group of this rigid-body. Must be a signed integer in the range [-127, +127].
     */
    setDominanceGroup(group: number): void;
    /**
     * The number of additional solver iterations that will be run for this
     * rigid-body and everything that interacts with it directly or indirectly
     * through contacts or joints.
     */
    additionalSolverIterations(): number;
    /**
     * Sets the number of additional solver iterations that will be run for this
     * rigid-body and everything that interacts with it directly or indirectly
     * through contacts or joints.
     *
     * Compared to increasing the global `World.numSolverIteration`, setting this
     * value lets you increase accuracy on only a subset of the scene, resulting in reduced
     * performance loss.
     *
     * @param iters - The new number of additional solver iterations (default: 0).
     */
    setAdditionalSolverIterations(iters: number): void;
    /**
     * Enable or disable CCD (Continuous Collision Detection) for this rigid-body.
     *
     * @param enabled - If `true`, CCD will be enabled for this rigid-body.
     */
    enableCcd(enabled: boolean): void;
    /**
     * The world-space translation of this rigid-body.
     */
    translation(): Vector;
    /**
     * The world-space orientation of this rigid-body.
     */
    rotation(): Rotation;
    /**
     * The world-space next translation of this rigid-body.
     *
     * If this rigid-body is kinematic this value is set by the `setNextKinematicTranslation`
     * method and is used for estimating the kinematic body velocity at the next timestep.
     * For non-kinematic bodies, this value is currently unspecified.
     */
    nextTranslation(): Vector;
    /**
     * The world-space next orientation of this rigid-body.
     *
     * If this rigid-body is kinematic this value is set by the `setNextKinematicRotation`
     * method and is used for estimating the kinematic body velocity at the next timestep.
     * For non-kinematic bodies, this value is currently unspecified.
     */
    nextRotation(): Rotation;
    /**
     * Sets the translation of this rigid-body.
     *
     * @param tra - The world-space position of the rigid-body.
     * @param wakeUp - Forces the rigid-body to wake-up so it is properly affected by forces if it
     *                 wasn't moving before modifying its position.
     */
    setTranslation(tra: Vector, wakeUp: boolean): void;
    /**
     * Sets the linear velocity of this rigid-body.
     *
     * @param vel - The linear velocity to set.
     * @param wakeUp - Forces the rigid-body to wake-up if it was asleep.
     */
    setLinvel(vel: Vector, wakeUp: boolean): void;
    /**
     * The scale factor applied to the gravity affecting
     * this rigid-body.
     */
    gravityScale(): number;
    /**
     * Sets the scale factor applied to the gravity affecting
     * this rigid-body.
     *
     * @param factor - The scale factor to set. A value of 0.0 means
     *   that this rigid-body will on longer be affected by gravity.
     * @param wakeUp - Forces the rigid-body to wake-up if it was asleep.
     */
    setGravityScale(factor: number, wakeUp: boolean): void;
    /**
     * Sets the rotation quaternion of this rigid-body.
     *
     * This does nothing if a zero quaternion is provided.
     *
     * @param rotation - The rotation to set.
     * @param wakeUp - Forces the rigid-body to wake-up so it is properly affected by forces if it
     * wasn't moving before modifying its position.
     */
    setRotation(rot: Rotation, wakeUp: boolean): void;
    /**
     * Sets the angular velocity fo this rigid-body.
     *
     * @param vel - The angular velocity to set.
     * @param wakeUp - Forces the rigid-body to wake-up if it was asleep.
     */
    setAngvel(vel: Vector, wakeUp: boolean): void;
    /**
     * If this rigid body is kinematic, sets its future translation after the next timestep integration.
     *
     * This should be used instead of `rigidBody.setTranslation` to make the dynamic object
     * interacting with this kinematic body behave as expected. Internally, Rapier will compute
     * an artificial velocity for this rigid-body from its current position and its next kinematic
     * position. This velocity will be used to compute forces on dynamic bodies interacting with
     * this body.
     *
     * @param t - The kinematic translation to set.
     */
    setNextKinematicTranslation(t: Vector): void;
    /**
     * If this rigid body is kinematic, sets its future rotation after the next timestep integration.
     *
     * This should be used instead of `rigidBody.setRotation` to make the dynamic object
     * interacting with this kinematic body behave as expected. Internally, Rapier will compute
     * an artificial velocity for this rigid-body from its current position and its next kinematic
     * position. This velocity will be used to compute forces on dynamic bodies interacting with
     * this body.
     *
     * @param rot - The kinematic rotation to set.
     */
    setNextKinematicRotation(rot: Rotation): void;
    /**
     * The linear velocity of this rigid-body.
     */
    linvel(): Vector;
    /**
     * The angular velocity of this rigid-body.
     */
    angvel(): Vector;
    /**
     * The mass of this rigid-body.
     */
    mass(): number;
    /**
     * The inverse mass taking into account translation locking.
     */
    effectiveInvMass(): Vector;
    /**
     * The inverse of the mass of a rigid-body.
     *
     * If this is zero, the rigid-body is assumed to have infinite mass.
     */
    invMass(): number;
    /**
     * The center of mass of a rigid-body expressed in its local-space.
     */
    localCom(): Vector;
    /**
     * The world-space center of mass of the rigid-body.
     */
    worldCom(): Vector;
    /**
     * The inverse of the principal angular inertia of the rigid-body.
     *
     * Components set to zero are assumed to be infinite along the corresponding principal axis.
     */
    invPrincipalInertiaSqrt(): Vector;
    /**
     * The angular inertia along the principal inertia axes of the rigid-body.
     */
    principalInertia(): Vector;
    /**
     * The principal vectors of the local angular inertia tensor of the rigid-body.
     */
    principalInertiaLocalFrame(): Rotation;
    /**
     * The square-root of the world-space inverse angular inertia tensor of the rigid-body,
     * taking into account rotation locking.
     */
    effectiveWorldInvInertiaSqrt(): SdpMatrix3;
    /**
     * The effective world-space angular inertia (that takes the potential rotation locking into account) of
     * this rigid-body.
     */
    effectiveAngularInertia(): SdpMatrix3;
    /**
     * Put this rigid body to sleep.
     *
     * A sleeping body no longer moves and is no longer simulated by the physics engine unless
     * it is waken up. It can be woken manually with `this.wakeUp()` or automatically due to
     * external forces like contacts.
     */
    sleep(): void;
    /**
     * Wakes this rigid-body up.
     *
     * A dynamic rigid-body that does not move during several consecutive frames will
     * be put to sleep by the physics engine, i.e., it will stop being simulated in order
     * to avoid useless computations.
     * This methods forces a sleeping rigid-body to wake-up. This is useful, e.g., before modifying
     * the position of a dynamic body so that it is properly simulated afterwards.
     */
    wakeUp(): void;
    /**
     * Is CCD enabled for this rigid-body?
     */
    isCcdEnabled(): boolean;
    /**
     * The number of colliders attached to this rigid-body.
     */
    numColliders(): number;
    /**
     * Retrieves the `i-th` collider attached to this rigid-body.
     *
     * @param i - The index of the collider to retrieve. Must be a number in `[0, this.numColliders()[`.
     *         This index is **not** the same as the unique identifier of the collider.
     */
    collider(i: number): Collider;
    /**
     * Sets whether this rigid-body is enabled or not.
     *
     * @param enabled - Set to `false` to disable this rigid-body and all its attached colliders.
     */
    setEnabled(enabled: boolean): void;
    /**
     * Is this rigid-body enabled?
     */
    isEnabled(): boolean;
    /**
     * The status of this rigid-body: static, dynamic, or kinematic.
     */
    bodyType(): RigidBodyType;
    /**
     * Set a new status for this rigid-body: static, dynamic, or kinematic.
     */
    setBodyType(type: RigidBodyType, wakeUp: boolean): void;
    /**
     * Is this rigid-body sleeping?
     */
    isSleeping(): boolean;
    /**
     * Is the velocity of this rigid-body not zero?
     */
    isMoving(): boolean;
    /**
     * Is this rigid-body static?
     */
    isFixed(): boolean;
    /**
     * Is this rigid-body kinematic?
     */
    isKinematic(): boolean;
    /**
     * Is this rigid-body dynamic?
     */
    isDynamic(): boolean;
    /**
     * The linear damping coefficient of this rigid-body.
     */
    linearDamping(): number;
    /**
     * The angular damping coefficient of this rigid-body.
     */
    angularDamping(): number;
    /**
     * Sets the linear damping factor applied to this rigid-body.
     *
     * @param factor - The damping factor to set.
     */
    setLinearDamping(factor: number): void;
    /**
     * Recompute the mass-properties of this rigid-bodies based on its currently attached colliders.
     */
    recomputeMassPropertiesFromColliders(): void;
    /**
     * Sets the rigid-body's additional mass.
     *
     * The total angular inertia of the rigid-body will be scaled automatically based on this additional mass. If this
     * scaling effect isn’t desired, use Self::additional_mass_properties instead of this method.
     *
     * This is only the "additional" mass because the total mass of the rigid-body is equal to the sum of this
     * additional mass and the mass computed from the colliders (with non-zero densities) attached to this rigid-body.
     *
     * That total mass (which includes the attached colliders’ contributions) will be updated at the name physics step,
     * or can be updated manually with `this.recomputeMassPropertiesFromColliders`.
     *
     * This will override any previous additional mass-properties set by `this.setAdditionalMass`,
     * `this.setAdditionalMassProperties`, `RigidBodyDesc::setAdditionalMass`, or
     * `RigidBodyDesc.setAdditionalMassfProperties` for this rigid-body.
     *
     * @param mass - The additional mass to set.
     * @param wakeUp - If `true` then the rigid-body will be woken up if it was put to sleep because it did not move for a while.
     */
    setAdditionalMass(mass: number, wakeUp: boolean): void;
    /**
     * Sets the rigid-body's additional mass-properties.
     *
     * This is only the "additional" mass-properties because the total mass-properties of the rigid-body is equal to the
     * sum of this additional mass-properties and the mass computed from the colliders (with non-zero densities) attached
     * to this rigid-body.
     *
     * That total mass-properties (which include the attached colliders’ contributions) will be updated at the name
     * physics step, or can be updated manually with `this.recomputeMassPropertiesFromColliders`.
     *
     * This will override any previous mass-properties set by `this.setAdditionalMass`,
     * `this.setAdditionalMassProperties`, `RigidBodyDesc.setAdditionalMass`, or `RigidBodyDesc.setAdditionalMassProperties`
     * for this rigid-body.
     *
     * If `wake_up` is true then the rigid-body will be woken up if it was put to sleep because it did not move for a while.
     */
    setAdditionalMassProperties(mass: number, centerOfMass: Vector, principalAngularInertia: Vector, angularInertiaLocalFrame: Rotation, wakeUp: boolean): void;
    /**
     * Sets the linear damping factor applied to this rigid-body.
     *
     * @param factor - The damping factor to set.
     */
    setAngularDamping(factor: number): void;
    /**
     * Resets to zero the user forces (but not torques) applied to this rigid-body.
     *
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    resetForces(wakeUp: boolean): void;
    /**
     * Resets to zero the user torques applied to this rigid-body.
     *
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    resetTorques(wakeUp: boolean): void;
    /**
     * Adds a force at the center-of-mass of this rigid-body.
     *
     * @param force - the world-space force to add to the rigid-body.
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    addForce(force: Vector, wakeUp: boolean): void;
    /**
     * Applies an impulse at the center-of-mass of this rigid-body.
     *
     * @param impulse - the world-space impulse to apply on the rigid-body.
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    applyImpulse(impulse: Vector, wakeUp: boolean): void;
    /**
     * Adds a torque at the center-of-mass of this rigid-body.
     *
     * @param torque - the world-space torque to add to the rigid-body.
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    addTorque(torque: Vector, wakeUp: boolean): void;
    /**
     * Applies an impulsive torque at the center-of-mass of this rigid-body.
     *
     * @param torqueImpulse - the world-space torque impulse to apply on the rigid-body.
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    applyTorqueImpulse(torqueImpulse: Vector, wakeUp: boolean): void;
    /**
     * Adds a force at the given world-space point of this rigid-body.
     *
     * @param force - the world-space force to add to the rigid-body.
     * @param point - the world-space point where the impulse is to be applied on the rigid-body.
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    addForceAtPoint(force: Vector, point: Vector, wakeUp: boolean): void;
    /**
     * Applies an impulse at the given world-space point of this rigid-body.
     *
     * @param impulse - the world-space impulse to apply on the rigid-body.
     * @param point - the world-space point where the impulse is to be applied on the rigid-body.
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    applyImpulseAtPoint(impulse: Vector, point: Vector, wakeUp: boolean): void;
}
export declare class RigidBodyDesc {
    enabled: boolean;
    translation: Vector;
    rotation: Rotation;
    gravityScale: number;
    mass: number;
    massOnly: boolean;
    centerOfMass: Vector;
    translationsEnabledX: boolean;
    translationsEnabledY: boolean;
    linvel: Vector;
    angvel: Vector;
    principalAngularInertia: Vector;
    angularInertiaLocalFrame: Rotation;
    translationsEnabledZ: boolean;
    rotationsEnabledX: boolean;
    rotationsEnabledY: boolean;
    rotationsEnabledZ: boolean;
    linearDamping: number;
    angularDamping: number;
    status: RigidBodyType;
    canSleep: boolean;
    sleeping: boolean;
    ccdEnabled: boolean;
    dominanceGroup: number;
    additionalSolverIterations: number;
    userData?: unknown;
    constructor(status: RigidBodyType);
    /**
     * A rigid-body descriptor used to build a dynamic rigid-body.
     */
    static dynamic(): RigidBodyDesc;
    /**
     * A rigid-body descriptor used to build a position-based kinematic rigid-body.
     */
    static kinematicPositionBased(): RigidBodyDesc;
    /**
     * A rigid-body descriptor used to build a velocity-based kinematic rigid-body.
     */
    static kinematicVelocityBased(): RigidBodyDesc;
    /**
     * A rigid-body descriptor used to build a fixed rigid-body.
     */
    static fixed(): RigidBodyDesc;
    /**
     * A rigid-body descriptor used to build a dynamic rigid-body.
     *
     * @deprecated The method has been renamed to `.dynamic()`.
     */
    static newDynamic(): RigidBodyDesc;
    /**
     * A rigid-body descriptor used to build a position-based kinematic rigid-body.
     *
     * @deprecated The method has been renamed to `.kinematicPositionBased()`.
     */
    static newKinematicPositionBased(): RigidBodyDesc;
    /**
     * A rigid-body descriptor used to build a velocity-based kinematic rigid-body.
     *
     * @deprecated The method has been renamed to `.kinematicVelocityBased()`.
     */
    static newKinematicVelocityBased(): RigidBodyDesc;
    /**
     * A rigid-body descriptor used to build a fixed rigid-body.
     *
     * @deprecated The method has been renamed to `.fixed()`.
     */
    static newStatic(): RigidBodyDesc;
    setDominanceGroup(group: number): RigidBodyDesc;
    /**
     * Sets the number of additional solver iterations that will be run for this
     * rigid-body and everything that interacts with it directly or indirectly
     * through contacts or joints.
     *
     * Compared to increasing the global `World.numSolverIteration`, setting this
     * value lets you increase accuracy on only a subset of the scene, resulting in reduced
     * performance loss.
     *
     * @param iters - The new number of additional solver iterations (default: 0).
     */
    setAdditionalSolverIterations(iters: number): RigidBodyDesc;
    /**
     * Sets whether the created rigid-body will be enabled or disabled.
     * @param enabled − If set to `false` the rigid-body will be disabled at creation.
     */
    setEnabled(enabled: boolean): RigidBodyDesc;
    /**
     * Sets the initial translation of the rigid-body to create.
     *
     * @param tra - The translation to set.
     */
    setTranslation(x: number, y: number, z: number): RigidBodyDesc;
    /**
     * Sets the initial rotation of the rigid-body to create.
     *
     * @param rot - The rotation to set.
     */
    setRotation(rot: Rotation): RigidBodyDesc;
    /**
     * Sets the scale factor applied to the gravity affecting
     * the rigid-body being built.
     *
     * @param scale - The scale factor. Set this to `0.0` if the rigid-body
     *   needs to ignore gravity.
     */
    setGravityScale(scale: number): RigidBodyDesc;
    /**
     * Sets the initial mass of the rigid-body being built, before adding colliders' contributions.
     *
     * @param mass − The initial mass of the rigid-body to create.
     */
    setAdditionalMass(mass: number): RigidBodyDesc;
    /**
     * Sets the initial linear velocity of the rigid-body to create.
     *
     * @param x - The linear velocity to set along the `x` axis.
     * @param y - The linear velocity to set along the `y` axis.
     * @param z - The linear velocity to set along the `z` axis.
     */
    setLinvel(x: number, y: number, z: number): RigidBodyDesc;
    /**
     * Sets the initial angular velocity of the rigid-body to create.
     *
     * @param vel - The angular velocity to set.
     */
    setAngvel(vel: Vector): RigidBodyDesc;
    /**
     * Sets the mass properties of the rigid-body being built.
     *
     * Note that the final mass properties of the rigid-bodies depends
     * on the initial mass-properties of the rigid-body (set by this method)
     * to which is added the contributions of all the colliders with non-zero density
     * attached to this rigid-body.
     *
     * Therefore, if you want your provided mass properties to be the final
     * mass properties of your rigid-body, don't attach colliders to it, or
     * only attach colliders with densities equal to zero.
     *
     * @param mass − The initial mass of the rigid-body to create.
     * @param centerOfMass − The initial center-of-mass of the rigid-body to create.
     * @param principalAngularInertia − The initial principal angular inertia of the rigid-body to create.
     *                                  These are the eigenvalues of the angular inertia matrix.
     * @param angularInertiaLocalFrame − The initial local angular inertia frame of the rigid-body to create.
     *                                   These are the eigenvectors of the angular inertia matrix.
     */
    setAdditionalMassProperties(mass: number, centerOfMass: Vector, principalAngularInertia: Vector, angularInertiaLocalFrame: Rotation): RigidBodyDesc;
    /**
     * Allow translation of this rigid-body only along specific axes.
     * @param translationsEnabledX - Are translations along the X axis enabled?
     * @param translationsEnabledY - Are translations along the y axis enabled?
     * @param translationsEnabledZ - Are translations along the Z axis enabled?
     */
    enabledTranslations(translationsEnabledX: boolean, translationsEnabledY: boolean, translationsEnabledZ: boolean): RigidBodyDesc;
    /**
     * Allow translation of this rigid-body only along specific axes.
     * @param translationsEnabledX - Are translations along the X axis enabled?
     * @param translationsEnabledY - Are translations along the y axis enabled?
     * @param translationsEnabledZ - Are translations along the Z axis enabled?
     * @deprecated use `this.enabledTranslations` with the same arguments instead.
     */
    restrictTranslations(translationsEnabledX: boolean, translationsEnabledY: boolean, translationsEnabledZ: boolean): RigidBodyDesc;
    /**
     * Locks all translations that would have resulted from forces on
     * the created rigid-body.
     */
    lockTranslations(): RigidBodyDesc;
    /**
     * Allow rotation of this rigid-body only along specific axes.
     * @param rotationsEnabledX - Are rotations along the X axis enabled?
     * @param rotationsEnabledY - Are rotations along the y axis enabled?
     * @param rotationsEnabledZ - Are rotations along the Z axis enabled?
     */
    enabledRotations(rotationsEnabledX: boolean, rotationsEnabledY: boolean, rotationsEnabledZ: boolean): RigidBodyDesc;
    /**
     * Allow rotation of this rigid-body only along specific axes.
     * @param rotationsEnabledX - Are rotations along the X axis enabled?
     * @param rotationsEnabledY - Are rotations along the y axis enabled?
     * @param rotationsEnabledZ - Are rotations along the Z axis enabled?
     * @deprecated use `this.enabledRotations` with the same arguments instead.
     */
    restrictRotations(rotationsEnabledX: boolean, rotationsEnabledY: boolean, rotationsEnabledZ: boolean): RigidBodyDesc;
    /**
     * Locks all rotations that would have resulted from forces on
     * the created rigid-body.
     */
    lockRotations(): RigidBodyDesc;
    /**
     * Sets the linear damping of the rigid-body to create.
     *
     * This will progressively slowdown the translational movement of the rigid-body.
     *
     * @param damping - The angular damping coefficient. Should be >= 0. The higher this
     *                  value is, the stronger the translational slowdown will be.
     */
    setLinearDamping(damping: number): RigidBodyDesc;
    /**
     * Sets the angular damping of the rigid-body to create.
     *
     * This will progressively slowdown the rotational movement of the rigid-body.
     *
     * @param damping - The angular damping coefficient. Should be >= 0. The higher this
     *                  value is, the stronger the rotational slowdown will be.
     */
    setAngularDamping(damping: number): RigidBodyDesc;
    /**
     * Sets whether or not the rigid-body to create can sleep.
     *
     * @param can - true if the rigid-body can sleep, false if it can't.
     */
    setCanSleep(can: boolean): RigidBodyDesc;
    /**
     * Sets whether or not the rigid-body is to be created asleep.
     *
     * @param can - true if the rigid-body should be in sleep, default false.
     */
    setSleeping(sleeping: boolean): RigidBodyDesc;
    /**
     * Sets whether Continuous Collision Detection (CCD) is enabled for this rigid-body.
     *
     * @param enabled - true if the rigid-body has CCD enabled.
     */
    setCcdEnabled(enabled: boolean): RigidBodyDesc;
    /**
     * Sets the user-defined object of this rigid-body.
     *
     * @param userData - The user-defined object to set.
     */
    setUserData(data?: unknown): RigidBodyDesc;
}
