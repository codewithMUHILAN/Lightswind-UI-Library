import * as THREE from 'three';
import * as React from 'react';
import { GetState, SetState, StoreApi, UseBoundStore } from 'zustand';
import { DomEvent, EventManager, PointerCaptureTarget, ThreeEvent } from './events';
import { _XRFrame, Camera } from './utils';
import { Advance, Invalidate } from './loop';
export declare const privateKeys: readonly ["set", "get", "setSize", "setFrameloop", "setDpr", "events", "invalidate", "advance", "size", "viewport"];
export declare type PrivateKeys = typeof privateKeys[number];
export interface Intersection extends THREE.Intersection {
    eventObject: THREE.Object3D;
}
export declare type Subscription = {
    ref: React.MutableRefObject<RenderCallback>;
    priority: number;
    store: UseBoundStore<RootState, StoreApi<RootState>>;
};
export declare type Dpr = number | [min: number, max: number];
export declare type Size = {
    width: number;
    height: number;
    top: number;
    left: number;
    /** @deprecated `updateStyle` is now disabled for OffscreenCanvas and will be removed in v9. */
    updateStyle?: boolean;
};
export declare type Viewport = Size & {
    /** The initial pixel ratio */
    initialDpr: number;
    /** Current pixel ratio */
    dpr: number;
    /** size.width / viewport.width */
    factor: number;
    /** Camera distance */
    distance: number;
    /** Camera aspect ratio: width / height */
    aspect: number;
};
export declare type RenderCallback = (state: RootState, delta: number, frame?: _XRFrame) => void;
export declare type Performance = {
    /** Current performance normal, between min and max */
    current: number;
    /** How low the performance can go, between 0 and max */
    min: number;
    /** How high the performance can go, between min and max */
    max: number;
    /** Time until current returns to max in ms */
    debounce: number;
    /** Sets current to min, puts the system in regression */
    regress: () => void;
};
export declare type Renderer = {
    render: (scene: THREE.Scene, camera: THREE.Camera) => any;
};
export declare const isRenderer: (def: any) => boolean;
export declare type InternalState = {
    active: boolean;
    priority: number;
    frames: number;
    lastEvent: React.MutableRefObject<DomEvent | null>;
    interaction: THREE.Object3D[];
    hovered: Map<string, ThreeEvent<DomEvent>>;
    subscribers: Subscription[];
    capturedMap: Map<number, Map<THREE.Object3D, PointerCaptureTarget>>;
    initialClick: [x: number, y: number];
    initialHits: THREE.Object3D[];
    subscribe: (callback: React.MutableRefObject<RenderCallback>, priority: number, store: UseBoundStore<RootState, StoreApi<RootState>>) => () => void;
};
export declare type RootState = {
    /** Set current state */
    set: SetState<RootState>;
    /** Get current state */
    get: GetState<RootState>;
    /** The instance of the renderer */
    gl: THREE.WebGLRenderer;
    /** Default camera */
    camera: Camera & {
        manual?: boolean;
    };
    /** Default scene */
    scene: THREE.Scene;
    /** Default raycaster */
    raycaster: THREE.Raycaster;
    /** Default clock */
    clock: THREE.Clock;
    /** Event layer interface, contains the event handler and the node they're connected to */
    events: EventManager<any>;
    /** XR interface */
    xr: {
        connect: () => void;
        disconnect: () => void;
    };
    /** Currently used controls */
    controls: THREE.EventDispatcher | null;
    /** Normalized event coordinates */
    pointer: THREE.Vector2;
    /** @deprecated Normalized event coordinates, use "pointer" instead! */
    mouse: THREE.Vector2;
    legacy: boolean;
    /** Shortcut to gl.outputColorSpace = THREE.LinearSRGBColorSpace */
    linear: boolean;
    /** Shortcut to gl.toneMapping = NoTonemapping */
    flat: boolean;
    /** Render loop flags */
    frameloop: 'always' | 'demand' | 'never';
    /** Adaptive performance interface */
    performance: Performance;
    /** Reactive pixel-size of the canvas */
    size: Size;
    /** Reactive size of the viewport in threejs units */
    viewport: Viewport & {
        getCurrentViewport: (camera?: Camera, target?: THREE.Vector3 | Parameters<THREE.Vector3['set']>, size?: Size) => Omit<Viewport, 'dpr' | 'initialDpr'>;
    };
    /** Flags the canvas for render, but doesn't render in itself */
    invalidate: (frames?: number) => void;
    /** Advance (render) one step */
    advance: (timestamp: number, runGlobalEffects?: boolean) => void;
    /** Shortcut to setting the event layer */
    setEvents: (events: Partial<EventManager<any>>) => void;
    /**
     * Shortcut to manual sizing
     */
    setSize: (width: number, height: number, 
    /** @deprecated `updateStyle` is now disabled for OffscreenCanvas and will be removed in v9. */
    updateStyle?: boolean, top?: number, left?: number) => void;
    /** Shortcut to manual setting the pixel ratio */
    setDpr: (dpr: Dpr) => void;
    /** Shortcut to frameloop flags */
    setFrameloop: (frameloop?: 'always' | 'demand' | 'never') => void;
    /** When the canvas was clicked but nothing was hit */
    onPointerMissed?: (event: MouseEvent) => void;
    /** If this state model is layered (via createPortal) then this contains the previous layer */
    previousRoot?: UseBoundStore<RootState, StoreApi<RootState>>;
    /** Internals */
    internal: InternalState;
};
declare const context: React.Context<UseBoundStore<RootState, StoreApi<RootState>>>;
declare const createStore: (invalidate: Invalidate, advance: Advance) => UseBoundStore<RootState>;
export { createStore, context };
