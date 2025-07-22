/// <reference types="webxr" />
import * as THREE from 'three';
import * as React from 'react';
import { UseBoundStore } from 'zustand';
import { AttachType, Instance, InstanceProps, LocalState } from './renderer';
import { Dpr, Renderer, RootState, Size } from './store';
/** @ts-ignore */
declare type _DeprecatedXRFrame = THREE.XRFrame;
/** @ts-ignore */
export declare type _XRFrame = THREE.WebGLRenderTargetOptions extends {
    samples?: number;
} ? XRFrame : _DeprecatedXRFrame;
/**
 * Returns `true` with correct TS type inference if an object has a configurable color space (since r152).
 */
export declare const hasColorSpace: <T extends object | Renderer | THREE.Texture, P = T extends Renderer ? {
    outputColorSpace: string;
} : {
    colorSpace: string;
}>(object: T) => object is T & P;
export declare type ColorManagementRepresentation = {
    enabled: boolean | never;
} | {
    legacyMode: boolean | never;
};
/**
 * The current THREE.ColorManagement instance, if present.
 */
export declare const getColorManagement: () => ColorManagementRepresentation | null;
export declare type Camera = THREE.OrthographicCamera | THREE.PerspectiveCamera;
export declare const isOrthographicCamera: (def: Camera) => def is THREE.OrthographicCamera;
export declare const isRef: (obj: any) => obj is React.MutableRefObject<unknown>;
/**
 * An SSR-friendly useLayoutEffect.
 *
 * React currently throws a warning when using useLayoutEffect on the server.
 * To get around it, we can conditionally useEffect on the server (no-op) and
 * useLayoutEffect elsewhere.
 *
 * @see https://github.com/facebook/react/issues/14927
 */
export declare const useIsomorphicLayoutEffect: typeof React.useLayoutEffect;
export declare function useMutableCallback<T>(fn: T): React.MutableRefObject<T>;
export declare type SetBlock = false | Promise<null> | null;
export declare type UnblockProps = {
    set: React.Dispatch<React.SetStateAction<SetBlock>>;
    children: React.ReactNode;
};
export declare function Block({ set }: Omit<UnblockProps, 'children'>): null;
export declare class ErrorBoundary extends React.Component<{
    set: React.Dispatch<Error | undefined>;
    children: React.ReactNode;
}, {
    error: boolean;
}> {
    state: {
        error: boolean;
    };
    static getDerivedStateFromError: () => {
        error: boolean;
    };
    componentDidCatch(err: Error): void;
    render(): React.ReactNode;
}
export declare const DEFAULT = "__default";
export declare const DEFAULTS: Map<any, any>;
export declare type DiffSet = {
    memoized: {
        [key: string]: any;
    };
    changes: [key: string, value: unknown, isEvent: boolean, keys: string[]][];
};
export declare const isDiffSet: (def: any) => def is DiffSet;
export declare type ClassConstructor = {
    new (): void;
};
export declare type ObjectMap = {
    nodes: {
        [name: string]: THREE.Object3D;
    };
    materials: {
        [name: string]: THREE.Material;
    };
};
export declare function calculateDpr(dpr: Dpr): number;
/**
 * Returns instance root state
 */
export declare const getRootState: (obj: THREE.Object3D) => RootState | undefined;
/**
 * Returns the instances initial (outmost) root
 */
export declare function findInitialRoot(child: Instance): UseBoundStore<RootState, import("zustand").StoreApi<RootState>>;
export declare type EquConfig = {
    /** Compare arrays by reference equality a === b (default), or by shallow equality */
    arrays?: 'reference' | 'shallow';
    /** Compare objects by reference equality a === b (default), or by shallow equality */
    objects?: 'reference' | 'shallow';
    /** If true the keys in both a and b must match 1:1 (default), if false a's keys must intersect b's */
    strict?: boolean;
};
export declare const is: {
    obj: (a: any) => boolean;
    fun: (a: any) => a is Function;
    str: (a: any) => a is string;
    num: (a: any) => a is number;
    boo: (a: any) => a is boolean;
    und: (a: any) => boolean;
    arr: (a: any) => boolean;
    equ(a: any, b: any, { arrays, objects, strict }?: EquConfig): boolean;
};
/**
 * Collects nodes and materials from a THREE.Object3D.
 */
export declare function buildGraph(object: THREE.Object3D): ObjectMap;
export declare function dispose<TObj extends {
    dispose?: () => void;
    type?: string;
    [key: string]: any;
}>(obj: TObj): void;
export declare function prepare<T = THREE.Object3D>(object: T, state?: Partial<LocalState>): T;
export declare function attach(parent: Instance, child: Instance, type: AttachType): void;
export declare function detach(parent: Instance, child: Instance, type: AttachType): void;
declare type MaybeInstance = Omit<Instance, '__r3f'> & {
    __r3f?: LocalState;
};
export declare function diffProps(instance: MaybeInstance, { children: cN, key: kN, ref: rN, ...props }: InstanceProps, { children: cP, key: kP, ref: rP, ...previous }?: InstanceProps, remove?: boolean): DiffSet;
export declare function applyProps(instance: MaybeInstance, data: InstanceProps | DiffSet): MaybeInstance;
export declare function invalidateInstance(instance: MaybeInstance): void;
export declare function updateInstance(instance: MaybeInstance): void;
export declare function updateCamera(camera: Camera & {
    manual?: boolean;
}, size: Size): void;
export {};
