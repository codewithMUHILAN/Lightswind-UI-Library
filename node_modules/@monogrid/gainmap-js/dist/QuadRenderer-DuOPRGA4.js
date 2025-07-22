/**
 * @monogrid/gainmap-js v3.1.0
 * With ❤️, by MONOGRID <rnd@monogrid.com>
 */

import { RGBAFormat, LinearFilter, ClampToEdgeWrapping, Scene, OrthographicCamera, HalfFloatType, FloatType, Mesh, PlaneGeometry, WebGLRenderTarget, UVMapping, WebGLRenderer, DataTexture, LinearSRGBColorSpace, ShaderMaterial, Texture, IntType, ShortType, ByteType, UnsignedIntType, UnsignedByteType, MeshBasicMaterial } from 'three';

const getBufferForType = (type, width, height) => {
    let out;
    switch (type) {
        case UnsignedByteType:
            out = new Uint8ClampedArray(width * height * 4);
            break;
        case HalfFloatType:
            out = new Uint16Array(width * height * 4);
            break;
        case UnsignedIntType:
            out = new Uint32Array(width * height * 4);
            break;
        case ByteType:
            out = new Int8Array(width * height * 4);
            break;
        case ShortType:
            out = new Int16Array(width * height * 4);
            break;
        case IntType:
            out = new Int32Array(width * height * 4);
            break;
        case FloatType:
            out = new Float32Array(width * height * 4);
            break;
        default:
            throw new Error('Unsupported data type');
    }
    return out;
};
let _canReadPixelsResult;
/**
 * Test if this browser implementation can correctly read pixels from the specified
 * Render target type.
 *
 * Runs only once
 *
 * @param type
 * @param renderer
 * @param camera
 * @param renderTargetOptions
 * @returns
 */
const canReadPixels = (type, renderer, camera, renderTargetOptions) => {
    if (_canReadPixelsResult !== undefined)
        return _canReadPixelsResult;
    const testRT = new WebGLRenderTarget(1, 1, renderTargetOptions);
    renderer.setRenderTarget(testRT);
    const mesh = new Mesh(new PlaneGeometry(), new MeshBasicMaterial({ color: 0xffffff }));
    renderer.render(mesh, camera);
    renderer.setRenderTarget(null);
    const out = getBufferForType(type, testRT.width, testRT.height);
    renderer.readRenderTargetPixels(testRT, 0, 0, testRT.width, testRT.height, out);
    testRT.dispose();
    mesh.geometry.dispose();
    mesh.material.dispose();
    _canReadPixelsResult = out[0] !== 0;
    return _canReadPixelsResult;
};
/**
 * Utility class used for rendering a texture with a material
 *
 * @category Core
 * @group Core
 */
class QuadRenderer {
    /**
     * Constructs a new QuadRenderer
     *
     * @param options Parameters for this QuadRenderer
     */
    constructor(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        this._rendererIsDisposable = false;
        this._supportsReadPixels = true;
        /**
         * Renders the input texture using the specified material
         */
        this.render = () => {
            this._renderer.setRenderTarget(this._renderTarget);
            try {
                this._renderer.render(this._scene, this._camera);
            }
            catch (e) {
                this._renderer.setRenderTarget(null);
                throw e;
            }
            this._renderer.setRenderTarget(null);
        };
        this._width = options.width;
        this._height = options.height;
        this._type = options.type;
        this._colorSpace = options.colorSpace;
        const rtOptions = {
            // fixed options
            format: RGBAFormat,
            depthBuffer: false,
            stencilBuffer: false,
            // user options
            type: this._type, // set in class property
            colorSpace: this._colorSpace, // set in class property
            anisotropy: ((_a = options.renderTargetOptions) === null || _a === void 0 ? void 0 : _a.anisotropy) !== undefined ? (_b = options.renderTargetOptions) === null || _b === void 0 ? void 0 : _b.anisotropy : 1,
            generateMipmaps: ((_c = options.renderTargetOptions) === null || _c === void 0 ? void 0 : _c.generateMipmaps) !== undefined ? (_d = options.renderTargetOptions) === null || _d === void 0 ? void 0 : _d.generateMipmaps : false,
            magFilter: ((_e = options.renderTargetOptions) === null || _e === void 0 ? void 0 : _e.magFilter) !== undefined ? (_f = options.renderTargetOptions) === null || _f === void 0 ? void 0 : _f.magFilter : LinearFilter,
            minFilter: ((_g = options.renderTargetOptions) === null || _g === void 0 ? void 0 : _g.minFilter) !== undefined ? (_h = options.renderTargetOptions) === null || _h === void 0 ? void 0 : _h.minFilter : LinearFilter,
            samples: ((_j = options.renderTargetOptions) === null || _j === void 0 ? void 0 : _j.samples) !== undefined ? (_k = options.renderTargetOptions) === null || _k === void 0 ? void 0 : _k.samples : undefined,
            wrapS: ((_l = options.renderTargetOptions) === null || _l === void 0 ? void 0 : _l.wrapS) !== undefined ? (_m = options.renderTargetOptions) === null || _m === void 0 ? void 0 : _m.wrapS : ClampToEdgeWrapping,
            wrapT: ((_o = options.renderTargetOptions) === null || _o === void 0 ? void 0 : _o.wrapT) !== undefined ? (_p = options.renderTargetOptions) === null || _p === void 0 ? void 0 : _p.wrapT : ClampToEdgeWrapping
        };
        this._material = options.material;
        if (options.renderer) {
            this._renderer = options.renderer;
        }
        else {
            this._renderer = QuadRenderer.instantiateRenderer();
            this._rendererIsDisposable = true;
        }
        this._scene = new Scene();
        this._camera = new OrthographicCamera();
        this._camera.position.set(0, 0, 10);
        this._camera.left = -0.5;
        this._camera.right = 0.5;
        this._camera.top = 0.5;
        this._camera.bottom = -0.5;
        this._camera.updateProjectionMatrix();
        if (!canReadPixels(this._type, this._renderer, this._camera, rtOptions)) {
            let alternativeType;
            switch (this._type) {
                case HalfFloatType:
                    alternativeType = this._renderer.extensions.has('EXT_color_buffer_float') ? FloatType : undefined;
                    break;
            }
            if (alternativeType !== undefined) {
                console.warn(`This browser does not support reading pixels from ${this._type} RenderTargets, switching to ${FloatType}`);
                this._type = alternativeType;
            }
            else {
                this._supportsReadPixels = false;
                console.warn('This browser dos not support toArray or toDataTexture, calls to those methods will result in an error thrown');
            }
        }
        this._quad = new Mesh(new PlaneGeometry(), this._material);
        this._quad.geometry.computeBoundingBox();
        this._scene.add(this._quad);
        this._renderTarget = new WebGLRenderTarget(this.width, this.height, rtOptions);
        this._renderTarget.texture.mapping = ((_q = options.renderTargetOptions) === null || _q === void 0 ? void 0 : _q.mapping) !== undefined ? (_r = options.renderTargetOptions) === null || _r === void 0 ? void 0 : _r.mapping : UVMapping;
    }
    /**
     * Instantiates a temporary renderer
     *
     * @returns
     */
    static instantiateRenderer() {
        const renderer = new WebGLRenderer();
        renderer.setSize(128, 128);
        // renderer.outputColorSpace = SRGBColorSpace
        // renderer.toneMapping = LinearToneMapping
        // renderer.debug.checkShaderErrors = false
        // this._rendererIsDisposable = true
        return renderer;
    }
    /**
     * Obtains a Buffer containing the rendered texture.
     *
     * @throws Error if the browser cannot read pixels from this RenderTarget type.
     * @returns a TypedArray containing RGBA values from this renderer
     */
    toArray() {
        if (!this._supportsReadPixels)
            throw new Error('Can\'t read pixels in this browser');
        const out = getBufferForType(this._type, this._width, this._height);
        this._renderer.readRenderTargetPixels(this._renderTarget, 0, 0, this._width, this._height, out);
        return out;
    }
    /**
     * Performs a readPixel operation in the renderTarget
     * and returns a DataTexture containing the read data
     *
     * @param options options
     * @returns
     */
    toDataTexture(options) {
        const returnValue = new DataTexture(
        // fixed values
        this.toArray(), this.width, this.height, RGBAFormat, this._type, 
        // user values
        (options === null || options === void 0 ? void 0 : options.mapping) || UVMapping, (options === null || options === void 0 ? void 0 : options.wrapS) || ClampToEdgeWrapping, (options === null || options === void 0 ? void 0 : options.wrapT) || ClampToEdgeWrapping, (options === null || options === void 0 ? void 0 : options.magFilter) || LinearFilter, (options === null || options === void 0 ? void 0 : options.minFilter) || LinearFilter, (options === null || options === void 0 ? void 0 : options.anisotropy) || 1, 
        // fixed value
        LinearSRGBColorSpace);
        // set this afterwards, we can't set it in constructor
        returnValue.generateMipmaps = (options === null || options === void 0 ? void 0 : options.generateMipmaps) !== undefined ? options === null || options === void 0 ? void 0 : options.generateMipmaps : false;
        return returnValue;
    }
    /**
     * If using a disposable renderer, it will dispose it.
     */
    disposeOnDemandRenderer() {
        this._renderer.setRenderTarget(null);
        if (this._rendererIsDisposable) {
            this._renderer.dispose();
            this._renderer.forceContextLoss();
        }
    }
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
    dispose(disposeRenderTarget) {
        this.disposeOnDemandRenderer();
        if (disposeRenderTarget) {
            this.renderTarget.dispose();
        }
        // dispose shader material texture uniforms
        if (this.material instanceof ShaderMaterial) {
            Object.values(this.material.uniforms).forEach(v => {
                if (v.value instanceof Texture)
                    v.value.dispose();
            });
        }
        // dispose other material properties
        Object.values(this.material).forEach(value => {
            if (value instanceof Texture)
                value.dispose();
        });
        this.material.dispose();
        this._quad.geometry.dispose();
    }
    /**
     * Width of the texture
     */
    get width() { return this._width; }
    set width(value) {
        this._width = value;
        this._renderTarget.setSize(this._width, this._height);
    }
    /**
     * Height of the texture
     */
    get height() { return this._height; }
    set height(value) {
        this._height = value;
        this._renderTarget.setSize(this._width, this._height);
    }
    /**
     * The renderer used
     */
    get renderer() { return this._renderer; }
    /**
     * The `WebGLRenderTarget` used.
     */
    get renderTarget() { return this._renderTarget; }
    set renderTarget(value) {
        this._renderTarget = value;
        this._width = value.width;
        this._height = value.height;
        // this._type = value.texture.type
    }
    /**
     * The `Material` used.
     */
    get material() { return this._material; }
    /**
     *
     */
    get type() { return this._type; }
    get colorSpace() { return this._colorSpace; }
}

export { QuadRenderer as Q };
