/// <reference types="offscreencanvas" />
import * as THREE from 'three';
import * as React from 'react';
import { UseBoundStore } from 'zustand';
import * as ReactThreeFiber from '../three-types';
import { Renderer, context, RootState, Size, Dpr, Performance, PrivateKeys } from './store';
import { extend, Root } from './renderer';
import { addEffect, addAfterEffect, addTail, flushGlobalEffects, Invalidate, Advance } from './loop';
import { EventManager, ComputeFunction } from './events';
import { dispose, getRootState, Camera, buildGraph } from './utils';
import type { Properties } from '../three-types';
declare type Canvas = HTMLCanvasElement | OffscreenCanvas;
declare const roots: Map<Canvas, Root>;
declare const invalidate: Invalidate, advance: Advance;
declare const reconciler: import("react-reconciler").Reconciler<UseBoundStore<RootState, import("zustand").StoreApi<RootState>>, import("./renderer").Instance, void, import("./renderer").Instance, import("./renderer").Instance>, applyProps: typeof import("./utils").applyProps;
declare type GLProps = Renderer | ((canvas: Canvas) => Renderer) | Partial<Properties<THREE.WebGLRenderer> | THREE.WebGLRendererParameters> | undefined;
export declare type RenderProps<TCanvas extends Canvas> = {
    /** A threejs renderer instance or props that go into the default renderer */
    gl?: GLProps;
    /** Dimensions to fit the renderer to. Will measure canvas dimensions if omitted */
    size?: Size;
    /**
     * Enables shadows (by default PCFsoft). Can accept `gl.shadowMap` options for fine-tuning,
     * but also strings: 'basic' | 'percentage' | 'soft' | 'variance'.
     * @see https://threejs.org/docs/#api/en/renderers/WebGLRenderer.shadowMap
     */
    shadows?: boolean | 'basic' | 'percentage' | 'soft' | 'variance' | Partial<THREE.WebGLShadowMap>;
    /**
     * Disables three r139 color management.
     * @see https://threejs.org/docs/#manual/en/introduction/Color-management
     */
    legacy?: boolean;
    /** Switch off automatic sRGB color space and gamma correction */
    linear?: boolean;
    /** Use `THREE.NoToneMapping` instead of `THREE.ACESFilmicToneMapping` */
    flat?: boolean;
    /** Creates an orthographic camera */
    orthographic?: boolean;
    /**
     * R3F's render mode. Set to `demand` to only render on state change or `never` to take control.
     * @see https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#on-demand-rendering
     */
    frameloop?: 'always' | 'demand' | 'never';
    /**
     * R3F performance options for adaptive performance.
     * @see https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#movement-regression
     */
    performance?: Partial<Omit<Performance, 'regress'>>;
    /** Target pixel ratio. Can clamp between a range: `[min, max]` */
    dpr?: Dpr;
    /** Props that go into the default raycaster */
    raycaster?: Partial<THREE.Raycaster>;
    /** A `THREE.Scene` instance or props that go into the default scene */
    scene?: THREE.Scene | Partial<ReactThreeFiber.Object3DNode<THREE.Scene, typeof THREE.Scene>>;
    /** A `THREE.Camera` instance or props that go into the default camera */
    camera?: (Camera | Partial<ReactThreeFiber.Object3DNode<THREE.Camera, typeof THREE.Camera> & ReactThreeFiber.Object3DNode<THREE.PerspectiveCamera, typeof THREE.PerspectiveCamera> & ReactThreeFiber.Object3DNode<THREE.OrthographicCamera, typeof THREE.OrthographicCamera>>) & {
        /** Flags the camera as manual, putting projection into your own hands */
        manual?: boolean;
    };
    /** An R3F event manager to manage elements' pointer events */
    events?: (store: UseBoundStore<RootState>) => EventManager<HTMLElement>;
    /** Callback after the canvas has rendered (but not yet committed) */
    onCreated?: (state: RootState) => void;
    /** Response for pointer clicks that have missed any target */
    onPointerMissed?: (event: MouseEvent) => void;
};
export declare type ReconcilerRoot<TCanvas extends Canvas> = {
    configure: (config?: RenderProps<TCanvas>) => ReconcilerRoot<TCanvas>;
    render: (element: React.ReactNode) => UseBoundStore<RootState>;
    unmount: () => void;
};
declare function createRoot<TCanvas extends Canvas>(canvas: TCanvas): ReconcilerRoot<TCanvas>;
declare function render<TCanvas extends Canvas>(children: React.ReactNode, canvas: TCanvas, config: RenderProps<TCanvas>): UseBoundStore<RootState>;
declare function unmountComponentAtNode<TCanvas extends Canvas>(canvas: TCanvas, callback?: (canvas: TCanvas) => void): void;
export declare type InjectState = Partial<Omit<RootState, PrivateKeys> & {
    events?: {
        enabled?: boolean;
        priority?: number;
        compute?: ComputeFunction;
        connected?: any;
    };
    size?: Size;
}>;
declare function createPortal(children: React.ReactNode, container: THREE.Object3D, state?: InjectState): JSX.Element;
/**
 * Force React to flush any updates inside the provided callback synchronously and immediately.
 * All the same caveats documented for react-dom's `flushSync` apply here (see https://react.dev/reference/react-dom/flushSync).
 * Nevertheless, sometimes one needs to render synchronously, for example to keep DOM and 3D changes in lock-step without
 * having to revert to a non-React solution.
 */
declare function flushSync<R>(fn: () => R): R;
declare const act: any;
export * from './hooks';
export { context, render, createRoot, unmountComponentAtNode, createPortal, reconciler, applyProps, dispose, invalidate, advance, extend, addEffect, addAfterEffect, addTail, flushGlobalEffects, flushSync, getRootState, act, buildGraph, roots as _roots, };
