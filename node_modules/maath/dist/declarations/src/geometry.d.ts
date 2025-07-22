import * as THREE from "three";
export declare class RoundedPlaneGeometry extends THREE.BufferGeometry {
    parameters: {
        width: number;
        height: number;
        radius: number;
        segments: number;
    };
    constructor(width?: number, height?: number, radius?: number, segments?: number);
}
export declare function applyCylindricalUV(bufferGeometry: THREE.BufferGeometry): THREE.BufferGeometry;
export declare function applySphereUV(bufferGeometry: THREE.BufferGeometry): THREE.BufferGeometry;
export declare function applyBoxUV(bufferGeometry: THREE.BufferGeometry): THREE.BufferGeometry;
