import * as THREE from 'three';
import { UseBoundStore } from 'zustand';
import Reconciler from 'react-reconciler';
import { prepare, applyProps } from './utils';
import { RootState } from './store';
import { EventHandlers } from './events';
export declare type Root = {
    fiber: Reconciler.FiberRoot;
    store: UseBoundStore<RootState>;
};
export declare type LocalState = {
    type: string;
    root: UseBoundStore<RootState>;
    objects: Instance[];
    parent: Instance | null;
    primitive?: boolean;
    eventCount: number;
    handlers: Partial<EventHandlers>;
    attach?: AttachType;
    previousAttach: any;
    memoizedProps: {
        [key: string]: any;
    };
    autoRemovedBeforeAppend?: boolean;
};
export declare type AttachFnType = (parent: Instance, self: Instance) => () => void;
export declare type AttachType = string | AttachFnType;
export declare type BaseInstance = Omit<THREE.Object3D, 'children' | 'attach' | 'add' | 'remove' | 'raycast'> & {
    __r3f: LocalState;
    children: Instance[];
    remove: (...object: Instance[]) => Instance;
    add: (...object: Instance[]) => Instance;
    raycast?: (raycaster: THREE.Raycaster, intersects: THREE.Intersection[]) => void;
};
export declare type Instance = BaseInstance & {
    [key: string]: any;
};
export declare type InstanceProps = {
    [key: string]: unknown;
} & {
    args?: any[];
    object?: object;
    visible?: boolean;
    dispose?: null;
    attach?: AttachType;
};
interface Catalogue {
    [name: string]: {
        new (...args: any): Instance;
    };
}
export declare const catalogue: Catalogue;
declare const extend: (objects: object) => void;
declare function createRenderer<TCanvas>(_roots: Map<TCanvas, Root>, _getEventPriority?: () => any): {
    reconciler: Reconciler.Reconciler<UseBoundStore<RootState, import("zustand").StoreApi<RootState>>, Instance, void, Instance, Instance>;
    applyProps: typeof applyProps;
};
export { prepare, createRenderer, extend };
