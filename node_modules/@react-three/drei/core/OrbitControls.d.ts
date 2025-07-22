import { ReactThreeFiber } from '@react-three/fiber';
import { Camera, Event } from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ForwardRefComponent } from '../helpers/ts-utils';
type ExtractCallback<T, E extends string> = T extends {
    addEventListener(event: E, callback: infer C): void;
} ? C : never;
export type OrbitControlsChangeEvent = Parameters<ExtractCallback<OrbitControlsImpl, 'change'>>[0];
export type OrbitControlsProps = Omit<ReactThreeFiber.Overwrite<ReactThreeFiber.Object3DNode<OrbitControlsImpl, typeof OrbitControlsImpl>, {
    camera?: Camera;
    domElement?: HTMLElement;
    enableDamping?: boolean;
    makeDefault?: boolean;
    onChange?: (e?: OrbitControlsChangeEvent) => void;
    onEnd?: (e?: Event) => void;
    onStart?: (e?: Event) => void;
    regress?: boolean;
    target?: ReactThreeFiber.Vector3;
    keyEvents?: boolean | HTMLElement;
}>, 'ref'>;
export declare const OrbitControls: ForwardRefComponent<OrbitControlsProps, OrbitControlsImpl>;
export {};
