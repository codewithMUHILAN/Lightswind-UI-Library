import * as THREE from 'three';
import { EventHandlers } from './core/events';
import { AttachType } from './core/renderer';
export declare type Properties<T> = {
    [K in keyof T as T[K] extends (...args: Array<any>) => any ? never : K]: T[K];
};
export declare type NonFunctionKeys<T> = {
    [K in keyof T]-?: T[K] extends Function ? never : K;
}[keyof T];
export declare type Overwrite<T, O> = Omit<T, NonFunctionKeys<O>> & O;
/**
 * If **T** contains a constructor, @see ConstructorParameters must be used, otherwise **T**.
 */
declare type Args<T> = T extends new (...args: any) => any ? ConstructorParameters<T> : T;
export declare type Euler = THREE.Euler | Parameters<THREE.Euler['set']>;
export declare type Matrix4 = THREE.Matrix4 | Parameters<THREE.Matrix4['set']> | Readonly<THREE.Matrix4['set']>;
/**
 * Turn an implementation of THREE.Vector in to the type that an r3f component would accept as a prop.
 */
declare type VectorLike<VectorClass extends THREE.Vector2 | THREE.Vector3 | THREE.Vector4> = VectorClass | Parameters<VectorClass['set']> | Readonly<Parameters<VectorClass['set']>> | Parameters<VectorClass['setScalar']>[0];
export declare type Vector2 = VectorLike<THREE.Vector2>;
export declare type Vector3 = VectorLike<THREE.Vector3>;
export declare type Vector4 = VectorLike<THREE.Vector4>;
export declare type Color = ConstructorParameters<typeof THREE.Color> | THREE.Color | number | string;
export declare type ColorArray = typeof THREE.Color | [color: THREE.ColorRepresentation];
export declare type Layers = THREE.Layers | Parameters<THREE.Layers['set']>[0];
export declare type Quaternion = THREE.Quaternion | Parameters<THREE.Quaternion['set']>;
export declare type AttachCallback = string | ((child: any, parentInstance: any) => void);
export interface NodeProps<T, P> {
    attach?: AttachType;
    /** Constructor arguments */
    args?: Args<P>;
    children?: React.ReactNode;
    ref?: React.Ref<T>;
    key?: React.Key;
    onUpdate?: (self: T) => void;
}
export declare type ExtendedColors<T> = {
    [K in keyof T]: T[K] extends THREE.Color | undefined ? Color : T[K];
};
export declare type Node<T, P> = [T] extends [{
    thisShouldNeverHappen: 'unless the object is of type any';
}] ? ExtendedColors<Overwrite<Partial<{}>, NodeProps<{}, {}>>> : ExtendedColors<Overwrite<Partial<T>, NodeProps<T, P>>>;
export declare type Object3DNode<T, P> = Overwrite<Node<T, P>, {
    position?: Vector3;
    up?: Vector3;
    scale?: Vector3;
    rotation?: Euler;
    matrix?: Matrix4;
    quaternion?: Quaternion;
    layers?: Layers;
    dispose?: (() => void) | null;
}> & EventHandlers;
export declare type BufferGeometryNode<T extends THREE.BufferGeometry, P> = Node<T, P>;
export declare type MaterialNode<T extends THREE.Material, P> = Node<T, P>;
export declare type LightNode<T extends THREE.Light, P> = Object3DNode<T, P>;
export declare type Object3DProps = Object3DNode<THREE.Object3D, typeof THREE.Object3D>;
export declare type AudioListenerProps = Object3DNode<THREE.AudioListener, typeof THREE.AudioListener>;
export declare type PositionalAudioProps = Object3DNode<THREE.PositionalAudio, typeof THREE.PositionalAudio>;
export declare type MeshProps = Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
export declare type InstancedMeshProps = Object3DNode<THREE.InstancedMesh, typeof THREE.InstancedMesh>;
/** @ts-ignore */
export declare type BatchedMeshProps = Object3DNode<THREE.BatchedMesh, typeof THREE.BatchedMesh>;
export declare type SceneProps = Object3DNode<THREE.Scene, typeof THREE.Scene>;
export declare type SpriteProps = Object3DNode<THREE.Sprite, typeof THREE.Sprite>;
export declare type LODProps = Object3DNode<THREE.LOD, typeof THREE.LOD>;
export declare type SkinnedMeshProps = Object3DNode<THREE.SkinnedMesh, typeof THREE.SkinnedMesh>;
export declare type SkeletonProps = Object3DNode<THREE.Skeleton, typeof THREE.Skeleton>;
export declare type BoneProps = Object3DNode<THREE.Bone, typeof THREE.Bone>;
export declare type LineSegmentsProps = Object3DNode<THREE.LineSegments, typeof THREE.LineSegments>;
export declare type LineLoopProps = Object3DNode<THREE.LineLoop, typeof THREE.LineLoop>;
export declare type PointsProps = Object3DNode<THREE.Points, typeof THREE.Points>;
export declare type GroupProps = Object3DNode<THREE.Group, typeof THREE.Group>;
export declare type CameraProps = Object3DNode<THREE.Camera, typeof THREE.Camera>;
export declare type PerspectiveCameraProps = Object3DNode<THREE.PerspectiveCamera, typeof THREE.PerspectiveCamera>;
export declare type OrthographicCameraProps = Object3DNode<THREE.OrthographicCamera, typeof THREE.OrthographicCamera>;
export declare type CubeCameraProps = Object3DNode<THREE.CubeCamera, typeof THREE.CubeCamera>;
export declare type ArrayCameraProps = Object3DNode<THREE.ArrayCamera, typeof THREE.ArrayCamera>;
export declare type InstancedBufferGeometryProps = BufferGeometryNode<THREE.InstancedBufferGeometry, typeof THREE.InstancedBufferGeometry>;
export declare type BufferGeometryProps = BufferGeometryNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>;
/** @ts-ignore */
export declare type BoxBufferGeometryProps = BufferGeometryNode<THREE.BoxBufferGeometry, typeof THREE.BoxBufferGeometry>;
export declare type CircleBufferGeometryProps = BufferGeometryNode<
/** @ts-ignore */
THREE.CircleBufferGeometry, 
/** @ts-ignore */
typeof THREE.CircleBufferGeometry>;
/** @ts-ignore */
export declare type ConeBufferGeometryProps = BufferGeometryNode<THREE.ConeBufferGeometry, typeof THREE.ConeBufferGeometry>;
export declare type CylinderBufferGeometryProps = BufferGeometryNode<
/** @ts-ignore */
THREE.CylinderBufferGeometry, 
/** @ts-ignore */
typeof THREE.CylinderBufferGeometry>;
export declare type DodecahedronBufferGeometryProps = BufferGeometryNode<
/** @ts-ignore */
THREE.DodecahedronBufferGeometry, 
/** @ts-ignore */
typeof THREE.DodecahedronBufferGeometry>;
export declare type ExtrudeBufferGeometryProps = BufferGeometryNode<
/** @ts-ignore */
THREE.ExtrudeBufferGeometry, 
/** @ts-ignore */
typeof THREE.ExtrudeBufferGeometry>;
export declare type IcosahedronBufferGeometryProps = BufferGeometryNode<
/** @ts-ignore */
THREE.IcosahedronBufferGeometry, 
/** @ts-ignore */
typeof THREE.IcosahedronBufferGeometry>;
/** @ts-ignore */
export declare type LatheBufferGeometryProps = BufferGeometryNode<THREE.LatheBufferGeometry, typeof THREE.LatheBufferGeometry>;
export declare type OctahedronBufferGeometryProps = BufferGeometryNode<
/** @ts-ignore */
THREE.OctahedronBufferGeometry, 
/** @ts-ignore */
typeof THREE.OctahedronBufferGeometry>;
/** @ts-ignore */
export declare type PlaneBufferGeometryProps = BufferGeometryNode<THREE.PlaneBufferGeometry, typeof THREE.PlaneBufferGeometry>;
export declare type PolyhedronBufferGeometryProps = BufferGeometryNode<
/** @ts-ignore */
THREE.PolyhedronBufferGeometry, 
/** @ts-ignore */
typeof THREE.PolyhedronBufferGeometry>;
/** @ts-ignore */
export declare type RingBufferGeometryProps = BufferGeometryNode<THREE.RingBufferGeometry, typeof THREE.RingBufferGeometry>;
/** @ts-ignore */
export declare type ShapeBufferGeometryProps = BufferGeometryNode<THREE.ShapeBufferGeometry, typeof THREE.ShapeBufferGeometry>;
export declare type SphereBufferGeometryProps = BufferGeometryNode<
/** @ts-ignore */
THREE.SphereBufferGeometry, 
/** @ts-ignore */
typeof THREE.SphereBufferGeometry>;
export declare type TetrahedronBufferGeometryProps = BufferGeometryNode<
/** @ts-ignore */
THREE.TetrahedronBufferGeometry, 
/** @ts-ignore */
typeof THREE.TetrahedronBufferGeometry>;
/** @ts-ignore */
export declare type TorusBufferGeometryProps = BufferGeometryNode<THREE.TorusBufferGeometry, typeof THREE.TorusBufferGeometry>;
export declare type TorusKnotBufferGeometryProps = BufferGeometryNode<
/** @ts-ignore */
THREE.TorusKnotBufferGeometry, 
/** @ts-ignore */
typeof THREE.TorusKnotBufferGeometry>;
/** @ts-ignore */
export declare type TubeBufferGeometryProps = BufferGeometryNode<THREE.TubeBufferGeometry, typeof THREE.TubeBufferGeometry>;
export declare type WireframeGeometryProps = BufferGeometryNode<THREE.WireframeGeometry, typeof THREE.WireframeGeometry>;
export declare type TetrahedronGeometryProps = BufferGeometryNode<THREE.TetrahedronGeometry, typeof THREE.TetrahedronGeometry>;
export declare type OctahedronGeometryProps = BufferGeometryNode<THREE.OctahedronGeometry, typeof THREE.OctahedronGeometry>;
export declare type IcosahedronGeometryProps = BufferGeometryNode<THREE.IcosahedronGeometry, typeof THREE.IcosahedronGeometry>;
export declare type DodecahedronGeometryProps = BufferGeometryNode<THREE.DodecahedronGeometry, typeof THREE.DodecahedronGeometry>;
export declare type PolyhedronGeometryProps = BufferGeometryNode<THREE.PolyhedronGeometry, typeof THREE.PolyhedronGeometry>;
export declare type TubeGeometryProps = BufferGeometryNode<THREE.TubeGeometry, typeof THREE.TubeGeometry>;
export declare type TorusKnotGeometryProps = BufferGeometryNode<THREE.TorusKnotGeometry, typeof THREE.TorusKnotGeometry>;
export declare type TorusGeometryProps = BufferGeometryNode<THREE.TorusGeometry, typeof THREE.TorusGeometry>;
export declare type SphereGeometryProps = BufferGeometryNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
export declare type RingGeometryProps = BufferGeometryNode<THREE.RingGeometry, typeof THREE.RingGeometry>;
export declare type PlaneGeometryProps = BufferGeometryNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
export declare type LatheGeometryProps = BufferGeometryNode<THREE.LatheGeometry, typeof THREE.LatheGeometry>;
export declare type ShapeGeometryProps = BufferGeometryNode<THREE.ShapeGeometry, typeof THREE.ShapeGeometry>;
export declare type ExtrudeGeometryProps = BufferGeometryNode<THREE.ExtrudeGeometry, typeof THREE.ExtrudeGeometry>;
export declare type EdgesGeometryProps = BufferGeometryNode<THREE.EdgesGeometry, typeof THREE.EdgesGeometry>;
export declare type ConeGeometryProps = BufferGeometryNode<THREE.ConeGeometry, typeof THREE.ConeGeometry>;
export declare type CylinderGeometryProps = BufferGeometryNode<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>;
export declare type CircleGeometryProps = BufferGeometryNode<THREE.CircleGeometry, typeof THREE.CircleGeometry>;
export declare type BoxGeometryProps = BufferGeometryNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
export declare type CapsuleGeometryProps = BufferGeometryNode<THREE.CapsuleGeometry, typeof THREE.CapsuleGeometry>;
export declare type MaterialProps = MaterialNode<THREE.Material, [THREE.MaterialParameters]>;
export declare type ShadowMaterialProps = MaterialNode<THREE.ShadowMaterial, [THREE.ShaderMaterialParameters]>;
export declare type SpriteMaterialProps = MaterialNode<THREE.SpriteMaterial, [THREE.SpriteMaterialParameters]>;
export declare type RawShaderMaterialProps = MaterialNode<THREE.RawShaderMaterial, [THREE.ShaderMaterialParameters]>;
export declare type ShaderMaterialProps = MaterialNode<THREE.ShaderMaterial, [THREE.ShaderMaterialParameters]>;
export declare type PointsMaterialProps = MaterialNode<THREE.PointsMaterial, [THREE.PointsMaterialParameters]>;
export declare type MeshPhysicalMaterialProps = MaterialNode<THREE.MeshPhysicalMaterial, [THREE.MeshPhysicalMaterialParameters]>;
export declare type MeshStandardMaterialProps = MaterialNode<THREE.MeshStandardMaterial, [THREE.MeshStandardMaterialParameters]>;
export declare type MeshPhongMaterialProps = MaterialNode<THREE.MeshPhongMaterial, [THREE.MeshPhongMaterialParameters]>;
export declare type MeshToonMaterialProps = MaterialNode<THREE.MeshToonMaterial, [THREE.MeshToonMaterialParameters]>;
export declare type MeshNormalMaterialProps = MaterialNode<THREE.MeshNormalMaterial, [THREE.MeshNormalMaterialParameters]>;
export declare type MeshLambertMaterialProps = MaterialNode<THREE.MeshLambertMaterial, [THREE.MeshLambertMaterialParameters]>;
export declare type MeshDepthMaterialProps = MaterialNode<THREE.MeshDepthMaterial, [THREE.MeshDepthMaterialParameters]>;
export declare type MeshDistanceMaterialProps = MaterialNode<THREE.MeshDistanceMaterial, [THREE.MeshDistanceMaterialParameters]>;
export declare type MeshBasicMaterialProps = MaterialNode<THREE.MeshBasicMaterial, [THREE.MeshBasicMaterialParameters]>;
export declare type MeshMatcapMaterialProps = MaterialNode<THREE.MeshMatcapMaterial, [THREE.MeshMatcapMaterialParameters]>;
export declare type LineDashedMaterialProps = MaterialNode<THREE.LineDashedMaterial, [THREE.LineDashedMaterialParameters]>;
export declare type LineBasicMaterialProps = MaterialNode<THREE.LineBasicMaterial, [THREE.LineBasicMaterialParameters]>;
export declare type PrimitiveProps = {
    object: object;
} & {
    [properties: string]: any;
};
export declare type LightProps = LightNode<THREE.Light, typeof THREE.Light>;
export declare type SpotLightShadowProps = Node<THREE.SpotLightShadow, typeof THREE.SpotLightShadow>;
export declare type SpotLightProps = LightNode<THREE.SpotLight, typeof THREE.SpotLight>;
export declare type PointLightProps = LightNode<THREE.PointLight, typeof THREE.PointLight>;
export declare type RectAreaLightProps = LightNode<THREE.RectAreaLight, typeof THREE.RectAreaLight>;
export declare type HemisphereLightProps = LightNode<THREE.HemisphereLight, typeof THREE.HemisphereLight>;
export declare type DirectionalLightShadowProps = Node<THREE.DirectionalLightShadow, typeof THREE.DirectionalLightShadow>;
export declare type DirectionalLightProps = LightNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
export declare type AmbientLightProps = LightNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
export declare type LightShadowProps = Node<THREE.LightShadow, typeof THREE.LightShadow>;
/** @ts-ignore */
export declare type AmbientLightProbeProps = LightNode<THREE.AmbientLightProbe, typeof THREE.AmbientLightProbe>;
/** @ts-ignore */
export declare type HemisphereLightProbeProps = LightNode<THREE.HemisphereLightProbe, typeof THREE.HemisphereLightProbe>;
export declare type LightProbeProps = LightNode<THREE.LightProbe, typeof THREE.LightProbe>;
export declare type SpotLightHelperProps = Object3DNode<THREE.SpotLightHelper, typeof THREE.SpotLightHelper>;
export declare type SkeletonHelperProps = Object3DNode<THREE.SkeletonHelper, typeof THREE.SkeletonHelper>;
export declare type PointLightHelperProps = Object3DNode<THREE.PointLightHelper, typeof THREE.PointLightHelper>;
export declare type HemisphereLightHelperProps = Object3DNode<THREE.HemisphereLightHelper, typeof THREE.HemisphereLightHelper>;
export declare type GridHelperProps = Object3DNode<THREE.GridHelper, typeof THREE.GridHelper>;
export declare type PolarGridHelperProps = Object3DNode<THREE.PolarGridHelper, typeof THREE.PolarGridHelper>;
export declare type DirectionalLightHelperProps = Object3DNode<THREE.DirectionalLightHelper, typeof THREE.DirectionalLightHelper>;
export declare type CameraHelperProps = Object3DNode<THREE.CameraHelper, typeof THREE.CameraHelper>;
export declare type BoxHelperProps = Object3DNode<THREE.BoxHelper, typeof THREE.BoxHelper>;
export declare type Box3HelperProps = Object3DNode<THREE.Box3Helper, typeof THREE.Box3Helper>;
export declare type PlaneHelperProps = Object3DNode<THREE.PlaneHelper, typeof THREE.PlaneHelper>;
export declare type ArrowHelperProps = Object3DNode<THREE.ArrowHelper, typeof THREE.ArrowHelper>;
export declare type AxesHelperProps = Object3DNode<THREE.AxesHelper, typeof THREE.AxesHelper>;
export declare type TextureProps = Node<THREE.Texture, typeof THREE.Texture>;
export declare type VideoTextureProps = Node<THREE.VideoTexture, typeof THREE.VideoTexture>;
export declare type DataTextureProps = Node<THREE.DataTexture, typeof THREE.DataTexture>;
/** @ts-ignore */
export declare type DataTexture3DProps = Node<THREE.DataTexture3D, typeof THREE.DataTexture3D>;
export declare type CompressedTextureProps = Node<THREE.CompressedTexture, typeof THREE.CompressedTexture>;
export declare type CubeTextureProps = Node<THREE.CubeTexture, typeof THREE.CubeTexture>;
export declare type CanvasTextureProps = Node<THREE.CanvasTexture, typeof THREE.CanvasTexture>;
export declare type DepthTextureProps = Node<THREE.DepthTexture, typeof THREE.DepthTexture>;
export declare type RaycasterProps = Node<THREE.Raycaster, typeof THREE.Raycaster>;
export declare type Vector2Props = Node<THREE.Vector2, typeof THREE.Vector2>;
export declare type Vector3Props = Node<THREE.Vector3, typeof THREE.Vector3>;
export declare type Vector4Props = Node<THREE.Vector4, typeof THREE.Vector4>;
export declare type EulerProps = Node<THREE.Euler, typeof THREE.Euler>;
export declare type Matrix3Props = Node<THREE.Matrix3, typeof THREE.Matrix3>;
export declare type Matrix4Props = Node<THREE.Matrix4, typeof THREE.Matrix4>;
export declare type QuaternionProps = Node<THREE.Quaternion, typeof THREE.Quaternion>;
export declare type BufferAttributeProps = Node<THREE.BufferAttribute, typeof THREE.BufferAttribute>;
export declare type Float16BufferAttributeProps = Node<THREE.Float16BufferAttribute, typeof THREE.Float16BufferAttribute>;
export declare type Float32BufferAttributeProps = Node<THREE.Float32BufferAttribute, typeof THREE.Float32BufferAttribute>;
/** @ts-ignore */
export declare type Float64BufferAttributeProps = Node<THREE.Float64BufferAttribute, typeof THREE.Float64BufferAttribute>;
export declare type Int8BufferAttributeProps = Node<THREE.Int8BufferAttribute, typeof THREE.Int8BufferAttribute>;
export declare type Int16BufferAttributeProps = Node<THREE.Int16BufferAttribute, typeof THREE.Int16BufferAttribute>;
export declare type Int32BufferAttributeProps = Node<THREE.Int32BufferAttribute, typeof THREE.Int32BufferAttribute>;
export declare type Uint8BufferAttributeProps = Node<THREE.Uint8BufferAttribute, typeof THREE.Uint8BufferAttribute>;
export declare type Uint16BufferAttributeProps = Node<THREE.Uint16BufferAttribute, typeof THREE.Uint16BufferAttribute>;
export declare type Uint32BufferAttributeProps = Node<THREE.Uint32BufferAttribute, typeof THREE.Uint32BufferAttribute>;
export declare type InstancedBufferAttributeProps = Node<THREE.InstancedBufferAttribute, typeof THREE.InstancedBufferAttribute>;
export declare type ColorProps = Node<THREE.Color, ColorArray>;
export declare type FogProps = Node<THREE.Fog, typeof THREE.Fog>;
export declare type FogExp2Props = Node<THREE.FogExp2, typeof THREE.FogExp2>;
export declare type ShapeProps = Node<THREE.Shape, typeof THREE.Shape>;
export interface ThreeElements {
    object3D: Object3DProps;
    audioListener: AudioListenerProps;
    positionalAudio: PositionalAudioProps;
    mesh: MeshProps;
    batchedMesh: BatchedMeshProps;
    instancedMesh: InstancedMeshProps;
    scene: SceneProps;
    sprite: SpriteProps;
    lOD: LODProps;
    skinnedMesh: SkinnedMeshProps;
    skeleton: SkeletonProps;
    bone: BoneProps;
    lineSegments: LineSegmentsProps;
    lineLoop: LineLoopProps;
    points: PointsProps;
    group: GroupProps;
    camera: CameraProps;
    perspectiveCamera: PerspectiveCameraProps;
    orthographicCamera: OrthographicCameraProps;
    cubeCamera: CubeCameraProps;
    arrayCamera: ArrayCameraProps;
    instancedBufferGeometry: InstancedBufferGeometryProps;
    bufferGeometry: BufferGeometryProps;
    boxBufferGeometry: BoxBufferGeometryProps;
    circleBufferGeometry: CircleBufferGeometryProps;
    coneBufferGeometry: ConeBufferGeometryProps;
    cylinderBufferGeometry: CylinderBufferGeometryProps;
    dodecahedronBufferGeometry: DodecahedronBufferGeometryProps;
    extrudeBufferGeometry: ExtrudeBufferGeometryProps;
    icosahedronBufferGeometry: IcosahedronBufferGeometryProps;
    latheBufferGeometry: LatheBufferGeometryProps;
    octahedronBufferGeometry: OctahedronBufferGeometryProps;
    planeBufferGeometry: PlaneBufferGeometryProps;
    polyhedronBufferGeometry: PolyhedronBufferGeometryProps;
    ringBufferGeometry: RingBufferGeometryProps;
    shapeBufferGeometry: ShapeBufferGeometryProps;
    sphereBufferGeometry: SphereBufferGeometryProps;
    tetrahedronBufferGeometry: TetrahedronBufferGeometryProps;
    torusBufferGeometry: TorusBufferGeometryProps;
    torusKnotBufferGeometry: TorusKnotBufferGeometryProps;
    tubeBufferGeometry: TubeBufferGeometryProps;
    wireframeGeometry: WireframeGeometryProps;
    tetrahedronGeometry: TetrahedronGeometryProps;
    octahedronGeometry: OctahedronGeometryProps;
    icosahedronGeometry: IcosahedronGeometryProps;
    dodecahedronGeometry: DodecahedronGeometryProps;
    polyhedronGeometry: PolyhedronGeometryProps;
    tubeGeometry: TubeGeometryProps;
    torusKnotGeometry: TorusKnotGeometryProps;
    torusGeometry: TorusGeometryProps;
    sphereGeometry: SphereGeometryProps;
    ringGeometry: RingGeometryProps;
    planeGeometry: PlaneGeometryProps;
    latheGeometry: LatheGeometryProps;
    shapeGeometry: ShapeGeometryProps;
    extrudeGeometry: ExtrudeGeometryProps;
    edgesGeometry: EdgesGeometryProps;
    coneGeometry: ConeGeometryProps;
    cylinderGeometry: CylinderGeometryProps;
    circleGeometry: CircleGeometryProps;
    boxGeometry: BoxGeometryProps;
    capsuleGeometry: CapsuleGeometryProps;
    material: MaterialProps;
    shadowMaterial: ShadowMaterialProps;
    spriteMaterial: SpriteMaterialProps;
    rawShaderMaterial: RawShaderMaterialProps;
    shaderMaterial: ShaderMaterialProps;
    pointsMaterial: PointsMaterialProps;
    meshPhysicalMaterial: MeshPhysicalMaterialProps;
    meshStandardMaterial: MeshStandardMaterialProps;
    meshPhongMaterial: MeshPhongMaterialProps;
    meshToonMaterial: MeshToonMaterialProps;
    meshNormalMaterial: MeshNormalMaterialProps;
    meshLambertMaterial: MeshLambertMaterialProps;
    meshDepthMaterial: MeshDepthMaterialProps;
    meshDistanceMaterial: MeshDistanceMaterialProps;
    meshBasicMaterial: MeshBasicMaterialProps;
    meshMatcapMaterial: MeshMatcapMaterialProps;
    lineDashedMaterial: LineDashedMaterialProps;
    lineBasicMaterial: LineBasicMaterialProps;
    primitive: PrimitiveProps;
    light: LightProps;
    spotLightShadow: SpotLightShadowProps;
    spotLight: SpotLightProps;
    pointLight: PointLightProps;
    rectAreaLight: RectAreaLightProps;
    hemisphereLight: HemisphereLightProps;
    directionalLightShadow: DirectionalLightShadowProps;
    directionalLight: DirectionalLightProps;
    ambientLight: AmbientLightProps;
    lightShadow: LightShadowProps;
    ambientLightProbe: AmbientLightProbeProps;
    hemisphereLightProbe: HemisphereLightProbeProps;
    lightProbe: LightProbeProps;
    spotLightHelper: SpotLightHelperProps;
    skeletonHelper: SkeletonHelperProps;
    pointLightHelper: PointLightHelperProps;
    hemisphereLightHelper: HemisphereLightHelperProps;
    gridHelper: GridHelperProps;
    polarGridHelper: PolarGridHelperProps;
    directionalLightHelper: DirectionalLightHelperProps;
    cameraHelper: CameraHelperProps;
    boxHelper: BoxHelperProps;
    box3Helper: Box3HelperProps;
    planeHelper: PlaneHelperProps;
    arrowHelper: ArrowHelperProps;
    axesHelper: AxesHelperProps;
    texture: TextureProps;
    videoTexture: VideoTextureProps;
    dataTexture: DataTextureProps;
    dataTexture3D: DataTexture3DProps;
    compressedTexture: CompressedTextureProps;
    cubeTexture: CubeTextureProps;
    canvasTexture: CanvasTextureProps;
    depthTexture: DepthTextureProps;
    raycaster: RaycasterProps;
    vector2: Vector2Props;
    vector3: Vector3Props;
    vector4: Vector4Props;
    euler: EulerProps;
    matrix3: Matrix3Props;
    matrix4: Matrix4Props;
    quaternion: QuaternionProps;
    bufferAttribute: BufferAttributeProps;
    float16BufferAttribute: Float16BufferAttributeProps;
    float32BufferAttribute: Float32BufferAttributeProps;
    float64BufferAttribute: Float64BufferAttributeProps;
    int8BufferAttribute: Int8BufferAttributeProps;
    int16BufferAttribute: Int16BufferAttributeProps;
    int32BufferAttribute: Int32BufferAttributeProps;
    uint8BufferAttribute: Uint8BufferAttributeProps;
    uint16BufferAttribute: Uint16BufferAttributeProps;
    uint32BufferAttribute: Uint32BufferAttributeProps;
    instancedBufferAttribute: InstancedBufferAttributeProps;
    color: ColorProps;
    fog: FogProps;
    fogExp2: FogExp2Props;
    shape: ShapeProps;
}
declare global {
    namespace JSX {
        interface IntrinsicElements extends ThreeElements {
        }
    }
}
export {};
