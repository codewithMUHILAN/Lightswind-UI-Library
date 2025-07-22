import * as THREE from 'three';
import { PointsProps, MaterialNode } from '@react-three/fiber';
import { ForwardRefComponent } from '../helpers/ts-utils';
interface Props {
    count?: number;
    speed?: number | Float32Array;
    opacity?: number | Float32Array;
    color?: THREE.ColorRepresentation | Float32Array;
    size?: number | Float32Array;
    scale?: number | [number, number, number] | THREE.Vector3;
    noise?: number | [number, number, number] | THREE.Vector3 | Float32Array;
}
declare class SparklesImplMaterial extends THREE.ShaderMaterial {
    constructor();
    get time(): number;
    set time(value: number);
    get pixelRatio(): number;
    set pixelRatio(value: number);
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            sparklesImplMaterial: MaterialNode<SparklesImplMaterial, typeof SparklesImplMaterial>;
        }
    }
}
export declare const Sparkles: ForwardRefComponent<Props & PointsProps, THREE.Points>;
export {};
