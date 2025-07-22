/**
 * from https://github.com/gsimone/things/tree/main/packages/three-raycaster-helper
 */
import { BufferGeometry, InstancedMesh, Intersection, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Object3D, Raycaster, SphereGeometry } from 'three';
declare class RaycasterHelper extends Object3D {
    numberOfHitsToVisualize: number;
    raycaster: Raycaster;
    hits: Intersection[];
    origin: Mesh<SphereGeometry, MeshBasicMaterial>;
    near: Line<BufferGeometry, LineBasicMaterial>;
    far: Line<BufferGeometry, LineBasicMaterial>;
    nearToFar: Line<BufferGeometry, LineBasicMaterial>;
    originToNear: Line<BufferGeometry, LineBasicMaterial>;
    hitPoints: InstancedMesh;
    colors: {
        near: number;
        far: number;
        originToNear: number;
        nearToFar: number;
        origin: number[];
    };
    constructor(raycaster: Raycaster, numberOfHitsToVisualize?: number);
    setColors: (colors?: Partial<{
        near: number;
        far: number;
        originToNear: number;
        nearToFar: number;
        origin: number[];
    }> | undefined) => void;
    update: () => void;
    dispose: () => void;
}
export { RaycasterHelper };
