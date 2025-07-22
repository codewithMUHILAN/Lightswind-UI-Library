import { ByteType, ColorSpace, DataTexture, FloatType, HalfFloatType, IntType, Material, ShortType, TextureDataType, UnsignedByteType, UnsignedIntType, WebGLRenderer, WebGLRenderTarget } from 'three';
import { QuadRendererTextureOptions } from './types';
/**
 * Utility Type that translates `three` texture types to their TypedArray counterparts.
 *
 * @category Utility
 * @group Utility
 */
export type TextureDataTypeToBufferType<TType extends TextureDataType> = TType extends typeof UnsignedByteType ? Uint8ClampedArray : TType extends typeof HalfFloatType ? Uint16Array : TType extends typeof UnsignedIntType ? Uint32Array : TType extends typeof ByteType ? Int8Array : TType extends typeof ShortType ? Int16Array : TType extends typeof IntType ? Int32Array : TType extends typeof FloatType ? Float32Array : never;
export type QuadRendererOptions<TType extends TextureDataType, TMaterial extends Material> = {
    /**
     * Width of the render target
     */
    width: number;
    /**
     * height of the renderTarget
     */
    height: number;
    /**
     * TextureDataType of the renderTarget
     */
    type: TType;
    /**
     * ColorSpace of the renderTarget
     */
    colorSpace: ColorSpace;
    /**
     * material to use for rendering
     */
    material: TMaterial;
    /**
     * Renderer instance to use
     */
    renderer?: WebGLRenderer;
    /**
     * Additional renderTarget options
     */
    renderTargetOptions?: QuadRendererTextureOptions;
};
/**
 * Utility class used for rendering a texture with a material
 *
 * @category Core
 * @group Core
 */
export declare class QuadRenderer<TType extends TextureDataType, TMaterial extends Material> {
    private _renderer;
    private _rendererIsDisposable;
    private _material;
    private _scene;
    private _camera;
    private _quad;
    private _renderTarget;
    private _width;
    private _height;
    private _type;
    private _colorSpace;
    private _supportsReadPixels;
    /**
     * Constructs a new QuadRenderer
     *
     * @param options Parameters for this QuadRenderer
     */
    constructor(options: QuadRendererOptions<TType, TMaterial>);
    /**
     * Instantiates a temporary renderer
     *
     * @returns
     */
    static instantiateRenderer(): WebGLRenderer;
    /**
     * Renders the input texture using the specified material
     */
    render: () => void;
    /**
     * Obtains a Buffer containing the rendered texture.
     *
     * @throws Error if the browser cannot read pixels from this RenderTarget type.
     * @returns a TypedArray containing RGBA values from this renderer
     */
    toArray(): TextureDataTypeToBufferType<TType>;
    /**
     * Performs a readPixel operation in the renderTarget
     * and returns a DataTexture containing the read data
     *
     * @param options options
     * @returns
     */
    toDataTexture(options?: QuadRendererTextureOptions): DataTexture;
    /**
     * If using a disposable renderer, it will dispose it.
     */
    disposeOnDemandRenderer(): void;
    /**
     * Will dispose of **all** assets used by this renderer.
     *
     *
     * @param disposeRenderTarget will dispose of the renderTarget which will not be usable later
     * set this to true if you passed the `renderTarget.texture` to a `PMREMGenerator`
     * or are otherwise done with it.
     *
     * @example
     * ```js
     * const loader = new HDRJPGLoader(renderer)
     * const result = await loader.loadAsync('gainmap.jpeg')
     * const mesh = new Mesh(geometry, new MeshBasicMaterial({ map: result.renderTarget.texture }) )
     * // DO NOT dispose the renderTarget here,
     * // it is used directly in the material
     * result.dispose()
     * ```
     *
     * @example
     * ```js
     * const loader = new HDRJPGLoader(renderer)
     * const pmremGenerator = new PMREMGenerator( renderer );
     * const result = await loader.loadAsync('gainmap.jpeg')
     * const envMap = pmremGenerator.fromEquirectangular(result.renderTarget.texture)
     * const mesh = new Mesh(geometry, new MeshStandardMaterial({ envMap }) )
     * // renderTarget can be disposed here
     * // because it was used to generate a PMREM texture
     * result.dispose(true)
     * ```
     */
    dispose(disposeRenderTarget?: boolean): void;
    /**
     * Width of the texture
     */
    get width(): number;
    set width(value: number);
    /**
     * Height of the texture
     */
    get height(): number;
    set height(value: number);
    /**
     * The renderer used
     */
    get renderer(): WebGLRenderer;
    /**
     * The `WebGLRenderTarget` used.
     */
    get renderTarget(): WebGLRenderTarget;
    set renderTarget(value: WebGLRenderTarget);
    /**
     * The `Material` used.
     */
    get material(): TMaterial;
    /**
     *
     */
    get type(): TType;
    get colorSpace(): ColorSpace;
}
