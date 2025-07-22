/**
 * The minimal basic Event that can be dispatched by a {@link EventDispatcher<>}.
 */
export interface BaseEvent<TEventType extends string = string> {
    readonly type: TEventType;
    target: any;
}
/**
 * The minimal expected contract of a fired Event that was dispatched by a {@link EventDispatcher<>}.
 */
export interface Event<TEventType extends string = string, TTarget = unknown> {
    readonly type: TEventType;
    readonly target: TTarget;
}
export type EventListener<TEventData, TEventType extends string, TTarget> = (event: TEventData & Event<TEventType, TTarget>) => void;
export declare class EventDispatcher<TEventMap extends {} = {}> {
    private _listeners;
    /**
     * Adds a listener to an event type.
     * @param type The type of event to listen to.
     * @param listener The function that gets called when the event is fired.
     */
    addEventListener<T extends Extract<keyof TEventMap, string>>(type: T, listener: EventListener<TEventMap[T], T, this>): void;
    /**
     * Checks if listener is added to an event type.
     * @param type The type of event to listen to.
     * @param listener The function that gets called when the event is fired.
     */
    hasEventListener<T extends Extract<keyof TEventMap, string>>(type: T, listener: EventListener<TEventMap[T], T, this>): boolean;
    /**
     * Removes a listener from an event type.
     * @param type The type of the listener that gets removed.
     * @param listener The listener function that gets removed.
     */
    removeEventListener<T extends Extract<keyof TEventMap, string>>(type: T, listener: EventListener<TEventMap[T], T, this>): void;
    /**
     * Fire an event type.
     * @param event The event that gets fired.
     */
    dispatchEvent<T extends Extract<keyof TEventMap, string>>(event: BaseEvent<T> & TEventMap[T]): void;
}
