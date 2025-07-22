import { Vector } from "../math";
import { Collider, ColliderSet, InteractionGroups } from "../geometry";
import { QueryFilterFlags, QueryPipeline } from "../pipeline";
import { RigidBody, RigidBodySet } from "../dynamics";
/**
 * A character controller to simulate vehicles using ray-casting for the wheels.
 */
export declare class DynamicRayCastVehicleController {
    private raw;
    private bodies;
    private colliders;
    private queries;
    private _chassis;
    constructor(chassis: RigidBody, bodies: RigidBodySet, colliders: ColliderSet, queries: QueryPipeline);
    /** @internal */
    free(): void;
    /**
     * Updates the vehicle’s velocity based on its suspension, engine force, and brake.
     *
     * This directly updates the velocity of its chassis rigid-body.
     *
     * @param dt - Time increment used to integrate forces.
     * @param filterFlags - Flag to exclude categories of objects from the wheels’ ray-cast.
     * @param filterGroups - Only colliders compatible with these groups will be hit by the wheels’ ray-casts.
     * @param filterPredicate - Callback to filter out which collider will be hit by the wheels’ ray-casts.
     */
    updateVehicle(dt: number, filterFlags?: QueryFilterFlags, filterGroups?: InteractionGroups, filterPredicate?: (collider: Collider) => boolean): void;
    /**
     * The current forward speed of the vehicle.
     */
    currentVehicleSpeed(): number;
    /**
     * The rigid-body used as the chassis.
     */
    chassis(): RigidBody;
    /**
     * The chassis’ local _up_ direction (`0 = x, 1 = y, 2 = z`).
     */
    get indexUpAxis(): number;
    /**
     * Sets the chassis’ local _up_ direction (`0 = x, 1 = y, 2 = z`).
     */
    set indexUpAxis(axis: number);
    /**
     * The chassis’ local _forward_ direction (`0 = x, 1 = y, 2 = z`).
     */
    get indexForwardAxis(): number;
    /**
     * Sets the chassis’ local _forward_ direction (`0 = x, 1 = y, 2 = z`).
     */
    set setIndexForwardAxis(axis: number);
    /**
     * Adds a new wheel attached to this vehicle.
     * @param chassisConnectionCs  - The position of the wheel relative to the chassis.
     * @param directionCs - The direction of the wheel’s suspension, relative to the chassis. The ray-casting will
     *                      happen following this direction to detect the ground.
     * @param axleCs - The wheel’s axle axis, relative to the chassis.
     * @param suspensionRestLength - The rest length of the wheel’s suspension spring.
     * @param radius - The wheel’s radius.
     */
    addWheel(chassisConnectionCs: Vector, directionCs: Vector, axleCs: Vector, suspensionRestLength: number, radius: number): void;
    /**
     * The number of wheels attached to this vehicle.
     */
    numWheels(): number;
    /**
     * The position of the i-th wheel, relative to the chassis.
     */
    wheelChassisConnectionPointCs(i: number): Vector | null;
    /**
     * Sets the position of the i-th wheel, relative to the chassis.
     */
    setWheelChassisConnectionPointCs(i: number, value: Vector): void;
    /**
     * The rest length of the i-th wheel’s suspension spring.
     */
    wheelSuspensionRestLength(i: number): number | null;
    /**
     * Sets the rest length of the i-th wheel’s suspension spring.
     */
    setWheelSuspensionRestLength(i: number, value: number): void;
    /**
     * The maximum distance the i-th wheel suspension can travel before and after its resting length.
     */
    wheelMaxSuspensionTravel(i: number): number | null;
    /**
     * Sets the maximum distance the i-th wheel suspension can travel before and after its resting length.
     */
    setWheelMaxSuspensionTravel(i: number, value: number): void;
    /**
     * The i-th wheel’s radius.
     */
    wheelRadius(i: number): number | null;
    /**
     * Sets the i-th wheel’s radius.
     */
    setWheelRadius(i: number, value: number): void;
    /**
     * The i-th wheel’s suspension stiffness.
     *
     * Increase this value if the suspension appears to not push the vehicle strong enough.
     */
    wheelSuspensionStiffness(i: number): number | null;
    /**
     * Sets the i-th wheel’s suspension stiffness.
     *
     * Increase this value if the suspension appears to not push the vehicle strong enough.
     */
    setWheelSuspensionStiffness(i: number, value: number): void;
    /**
     * The i-th wheel’s suspension’s damping when it is being compressed.
     */
    wheelSuspensionCompression(i: number): number | null;
    /**
     * The i-th wheel’s suspension’s damping when it is being compressed.
     */
    setWheelSuspensionCompression(i: number, value: number): void;
    /**
     * The i-th wheel’s suspension’s damping when it is being released.
     *
     * Increase this value if the suspension appears to overshoot.
     */
    wheelSuspensionRelaxation(i: number): number | null;
    /**
     * Sets the i-th wheel’s suspension’s damping when it is being released.
     *
     * Increase this value if the suspension appears to overshoot.
     */
    setWheelSuspensionRelaxation(i: number, value: number): void;
    /**
     * The maximum force applied by the i-th wheel’s suspension.
     */
    wheelMaxSuspensionForce(i: number): number | null;
    /**
     * Sets the maximum force applied by the i-th wheel’s suspension.
     */
    setWheelMaxSuspensionForce(i: number, value: number): void;
    /**
     * The maximum amount of braking impulse applied on the i-th wheel to slow down the vehicle.
     */
    wheelBrake(i: number): number | null;
    /**
     * Set the maximum amount of braking impulse applied on the i-th wheel to slow down the vehicle.
     */
    setWheelBrake(i: number, value: number): void;
    /**
     * The steering angle (radians) for the i-th wheel.
     */
    wheelSteering(i: number): number | null;
    /**
     * Sets the steering angle (radians) for the i-th wheel.
     */
    setWheelSteering(i: number, value: number): void;
    /**
     * The forward force applied by the i-th wheel on the chassis.
     */
    wheelEngineForce(i: number): number | null;
    /**
     * Sets the forward force applied by the i-th wheel on the chassis.
     */
    setWheelEngineForce(i: number, value: number): void;
    /**
     * The direction of the i-th wheel’s suspension, relative to the chassis.
     *
     * The ray-casting will happen following this direction to detect the ground.
     */
    wheelDirectionCs(i: number): Vector | null;
    /**
     * Sets the direction of the i-th wheel’s suspension, relative to the chassis.
     *
     * The ray-casting will happen following this direction to detect the ground.
     */
    setWheelDirectionCs(i: number, value: Vector): void;
    /**
     * The i-th wheel’s axle axis, relative to the chassis.
     *
     * The axis index defined as 0 = X, 1 = Y, 2 = Z.
     */
    wheelAxleCs(i: number): Vector | null;
    /**
     * Sets the i-th wheel’s axle axis, relative to the chassis.
     *
     * The axis index defined as 0 = X, 1 = Y, 2 = Z.
     */
    setWheelAxleCs(i: number, value: Vector): void;
    /**
     * Parameter controlling how much traction the tire has.
     *
     * The larger the value, the more instantaneous braking will happen (with the risk of
     * causing the vehicle to flip if it’s too strong).
     */
    wheelFrictionSlip(i: number): number | null;
    /**
     * Sets the parameter controlling how much traction the tire has.
     *
     * The larger the value, the more instantaneous braking will happen (with the risk of
     * causing the vehicle to flip if it’s too strong).
     */
    setWheelFrictionSlip(i: number, value: number): void;
    /**
     * The multiplier of friction between a tire and the collider it’s on top of.
     *
     * The larger the value, the stronger side friction will be.
     */
    wheelSideFrictionStiffness(i: number): number | null;
    /**
     * The multiplier of friction between a tire and the collider it’s on top of.
     *
     * The larger the value, the stronger side friction will be.
     */
    setWheelSideFrictionStiffness(i: number, value: number): void;
    /**
     *  The i-th wheel’s current rotation angle (radians) on its axle.
     */
    wheelRotation(i: number): number | null;
    /**
     *  The forward impulses applied by the i-th wheel on the chassis.
     */
    wheelForwardImpulse(i: number): number | null;
    /**
     *  The side impulses applied by the i-th wheel on the chassis.
     */
    wheelSideImpulse(i: number): number | null;
    /**
     *  The force applied by the i-th wheel suspension.
     */
    wheelSuspensionForce(i: number): number | null;
    /**
     *  The (world-space) contact normal between the i-th wheel and the floor.
     */
    wheelContactNormal(i: number): Vector | null;
    /**
     *  The (world-space) point hit by the wheel’s ray-cast for the i-th wheel.
     */
    wheelContactPoint(i: number): Vector | null;
    /**
     *  The suspension length for the i-th wheel.
     */
    wheelSuspensionLength(i: number): number | null;
    /**
     *  The (world-space) starting point of the ray-cast for the i-th wheel.
     */
    wheelHardPoint(i: number): Vector | null;
    /**
     *  Is the i-th wheel in contact with the ground?
     */
    wheelIsInContact(i: number): boolean;
    /**
     *  The collider hit by the ray-cast for the i-th wheel.
     */
    wheelGroundObject(i: number): Collider | null;
}
