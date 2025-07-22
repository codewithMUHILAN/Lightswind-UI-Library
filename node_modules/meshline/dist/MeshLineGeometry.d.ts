import * as THREE from 'three';
export type PointsRepresentation = THREE.BufferGeometry | Float32Array | THREE.Vector3[] | THREE.Vector2[] | THREE.Vector3Tuple[] | THREE.Vector2Tuple[] | number[];
export type WidthCallback = (p: number) => any;
export declare class MeshLineGeometry extends THREE.BufferGeometry {
    type: string;
    isMeshLine: boolean;
    positions: number[];
    previous: number[];
    next: number[];
    side: number[];
    width: number[];
    indices_array: number[];
    uvs: number[];
    counters: number[];
    widthCallback: WidthCallback | null;
    _attributes: {
        position: THREE.BufferAttribute;
        previous: THREE.BufferAttribute;
        next: THREE.BufferAttribute;
        side: THREE.BufferAttribute;
        width: THREE.BufferAttribute;
        uv: THREE.BufferAttribute;
        index: THREE.BufferAttribute;
        counters: THREE.BufferAttribute;
    };
    _points: Float32Array | number[];
    points: Float32Array | number[];
    matrixWorld: THREE.Matrix4;
    constructor();
    setMatrixWorld(matrixWorld: THREE.Matrix4): void;
    setPoints(points: PointsRepresentation, wcb?: WidthCallback): void;
    compareV3(a: number, b: number): boolean;
    copyV3(a: number): THREE.Vector3Tuple;
    process(): void;
    /**
     * Fast method to advance the line by one position.  The oldest position is removed.
     * @param position
     */
    advance({ x, y, z }: THREE.Vector3): void;
}
