/**
 * @monogrid/gainmap-js v3.1.0
 * With ❤️, by MONOGRID <rnd@monogrid.com>
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
    typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.encode = {}, global.three));
})(this, (function (exports, three) { 'use strict';

    /**
     * Used internally
     *
     * @internal
     * @param canvas
     * @param mimeType
     * @param quality
     * @returns
     */
    const canvasToBlob = async (canvas, mimeType, quality) => {
        if (typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas) {
            return canvas.convertToBlob({ type: mimeType, quality: quality || 0.9 });
        }
        else if (canvas instanceof HTMLCanvasElement) {
            return new Promise((resolve, reject) => {
                canvas.toBlob((res) => {
                    if (res)
                        resolve(res);
                    else
                        reject(new Error('Failed to convert canvas to blob'));
                }, mimeType, quality || 0.9);
            });
        }
        /* istanbul ignore next
          as long as this function is not exported this is only here
          to satisfy TS strict mode internally
        */
        throw new Error('Unsupported canvas element');
    };
    /**
     * Converts a RAW RGBA image buffer into the provided `mimeType` using the provided `quality`
     *
     * @category Compression
     * @group Compression
     * @param params
     * @throws {Error} if the browser does not support [createImageBitmap](https://caniuse.com/createimagebitmap)
     * @throws {Error} if the provided source image cannot be decoded
     * @throws {Error} if the function fails to create a canvas context
     */
    const compress = async (params) => {
        if (typeof createImageBitmap === 'undefined')
            throw new Error('createImageBitmap() not supported.');
        const { source, mimeType, quality, flipY } = params;
        // eslint-disable-next-line no-undef
        let imageBitmapSource;
        if ((source instanceof Uint8Array || source instanceof Uint8ClampedArray) && 'sourceMimeType' in params) {
            imageBitmapSource = new Blob([source], { type: params.sourceMimeType });
        }
        else if (source instanceof ImageData) {
            imageBitmapSource = source;
        }
        else {
            throw new Error('Invalid source image');
        }
        const img = await createImageBitmap(imageBitmapSource);
        const width = img.width;
        const height = img.height;
        let canvas;
        if (typeof OffscreenCanvas !== 'undefined') {
            canvas = new OffscreenCanvas(width, height);
        }
        else {
            canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx)
            throw new Error('Failed to create canvas Context');
        // flip Y
        if (flipY === true) {
            ctx.translate(0, height);
            ctx.scale(1, -1);
        }
        ctx.drawImage(img, 0, 0, width, height);
        const blob = await canvasToBlob(canvas, mimeType, quality || 0.9);
        const data = new Uint8Array(await blob.arrayBuffer());
        return {
            data,
            mimeType,
            width,
            height
        };
    };

    /**
     * Utility function to obtain a `DataTexture` from various input formats
     *
     * @category Utility
     * @group Utility
     *
     * @param image
     * @returns
     */
    const getDataTexture = (image) => {
        let dataTexture;
        if (image instanceof three.DataTexture) {
            if (!(image.image.data instanceof Uint16Array) && !(image.image.data instanceof Float32Array)) {
                throw new Error('Provided image is not HDR');
            }
            dataTexture = image;
        }
        else {
            dataTexture = new three.DataTexture(image.data, image.width, image.height, 'format' in image ? image.format : three.RGBAFormat, image.type, three.UVMapping, three.RepeatWrapping, three.RepeatWrapping, three.LinearFilter, three.LinearFilter, 1, 'colorSpace' in image && image.colorSpace === 'srgb' ? image.colorSpace : three.LinearSRGBColorSpace);
            // TODO: This tries to detect a raw RGBE and applies flipY
            // see if there's a better way to detect it?
            if ('header' in image && 'gamma' in image) {
                dataTexture.flipY = true;
            }
            dataTexture.needsUpdate = true;
        }
        return dataTexture;
    };

    const getBufferForType = (type, width, height) => {
        let out;
        switch (type) {
            case three.UnsignedByteType:
                out = new Uint8ClampedArray(width * height * 4);
                break;
            case three.HalfFloatType:
                out = new Uint16Array(width * height * 4);
                break;
            case three.UnsignedIntType:
                out = new Uint32Array(width * height * 4);
                break;
            case three.ByteType:
                out = new Int8Array(width * height * 4);
                break;
            case three.ShortType:
                out = new Int16Array(width * height * 4);
                break;
            case three.IntType:
                out = new Int32Array(width * height * 4);
                break;
            case three.FloatType:
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
        const testRT = new three.WebGLRenderTarget(1, 1, renderTargetOptions);
        renderer.setRenderTarget(testRT);
        const mesh = new three.Mesh(new three.PlaneGeometry(), new three.MeshBasicMaterial({ color: 0xffffff }));
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
                format: three.RGBAFormat,
                depthBuffer: false,
                stencilBuffer: false,
                // user options
                type: this._type, // set in class property
                colorSpace: this._colorSpace, // set in class property
                anisotropy: ((_a = options.renderTargetOptions) === null || _a === void 0 ? void 0 : _a.anisotropy) !== undefined ? (_b = options.renderTargetOptions) === null || _b === void 0 ? void 0 : _b.anisotropy : 1,
                generateMipmaps: ((_c = options.renderTargetOptions) === null || _c === void 0 ? void 0 : _c.generateMipmaps) !== undefined ? (_d = options.renderTargetOptions) === null || _d === void 0 ? void 0 : _d.generateMipmaps : false,
                magFilter: ((_e = options.renderTargetOptions) === null || _e === void 0 ? void 0 : _e.magFilter) !== undefined ? (_f = options.renderTargetOptions) === null || _f === void 0 ? void 0 : _f.magFilter : three.LinearFilter,
                minFilter: ((_g = options.renderTargetOptions) === null || _g === void 0 ? void 0 : _g.minFilter) !== undefined ? (_h = options.renderTargetOptions) === null || _h === void 0 ? void 0 : _h.minFilter : three.LinearFilter,
                samples: ((_j = options.renderTargetOptions) === null || _j === void 0 ? void 0 : _j.samples) !== undefined ? (_k = options.renderTargetOptions) === null || _k === void 0 ? void 0 : _k.samples : undefined,
                wrapS: ((_l = options.renderTargetOptions) === null || _l === void 0 ? void 0 : _l.wrapS) !== undefined ? (_m = options.renderTargetOptions) === null || _m === void 0 ? void 0 : _m.wrapS : three.ClampToEdgeWrapping,
                wrapT: ((_o = options.renderTargetOptions) === null || _o === void 0 ? void 0 : _o.wrapT) !== undefined ? (_p = options.renderTargetOptions) === null || _p === void 0 ? void 0 : _p.wrapT : three.ClampToEdgeWrapping
            };
            this._material = options.material;
            if (options.renderer) {
                this._renderer = options.renderer;
            }
            else {
                this._renderer = QuadRenderer.instantiateRenderer();
                this._rendererIsDisposable = true;
            }
            this._scene = new three.Scene();
            this._camera = new three.OrthographicCamera();
            this._camera.position.set(0, 0, 10);
            this._camera.left = -0.5;
            this._camera.right = 0.5;
            this._camera.top = 0.5;
            this._camera.bottom = -0.5;
            this._camera.updateProjectionMatrix();
            if (!canReadPixels(this._type, this._renderer, this._camera, rtOptions)) {
                let alternativeType;
                switch (this._type) {
                    case three.HalfFloatType:
                        alternativeType = this._renderer.extensions.has('EXT_color_buffer_float') ? three.FloatType : undefined;
                        break;
                }
                if (alternativeType !== undefined) {
                    console.warn(`This browser does not support reading pixels from ${this._type} RenderTargets, switching to ${three.FloatType}`);
                    this._type = alternativeType;
                }
                else {
                    this._supportsReadPixels = false;
                    console.warn('This browser dos not support toArray or toDataTexture, calls to those methods will result in an error thrown');
                }
            }
            this._quad = new three.Mesh(new three.PlaneGeometry(), this._material);
            this._quad.geometry.computeBoundingBox();
            this._scene.add(this._quad);
            this._renderTarget = new three.WebGLRenderTarget(this.width, this.height, rtOptions);
            this._renderTarget.texture.mapping = ((_q = options.renderTargetOptions) === null || _q === void 0 ? void 0 : _q.mapping) !== undefined ? (_r = options.renderTargetOptions) === null || _r === void 0 ? void 0 : _r.mapping : three.UVMapping;
        }
        /**
         * Instantiates a temporary renderer
         *
         * @returns
         */
        static instantiateRenderer() {
            const renderer = new three.WebGLRenderer();
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
            const returnValue = new three.DataTexture(
            // fixed values
            this.toArray(), this.width, this.height, three.RGBAFormat, this._type, 
            // user values
            (options === null || options === void 0 ? void 0 : options.mapping) || three.UVMapping, (options === null || options === void 0 ? void 0 : options.wrapS) || three.ClampToEdgeWrapping, (options === null || options === void 0 ? void 0 : options.wrapT) || three.ClampToEdgeWrapping, (options === null || options === void 0 ? void 0 : options.magFilter) || three.LinearFilter, (options === null || options === void 0 ? void 0 : options.minFilter) || three.LinearFilter, (options === null || options === void 0 ? void 0 : options.anisotropy) || 1, 
            // fixed value
            three.LinearSRGBColorSpace);
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
            if (this.material instanceof three.ShaderMaterial) {
                Object.values(this.material.uniforms).forEach(v => {
                    if (v.value instanceof three.Texture)
                        v.value.dispose();
                });
            }
            // dispose other material properties
            Object.values(this.material).forEach(value => {
                if (value instanceof three.Texture)
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

    const vertexShader$2 = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
    const fragmentShader$2 = /* glsl */ `
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform sampler2D sdr;
uniform sampler2D hdr;
uniform vec3 gamma;
uniform vec3 offsetSdr;
uniform vec3 offsetHdr;
uniform float minLog2;
uniform float maxLog2;

varying vec2 vUv;

void main() {
  vec3 sdrColor = texture2D(sdr, vUv).rgb;
  vec3 hdrColor = texture2D(hdr, vUv).rgb;

  vec3 pixelGain = (hdrColor + offsetHdr) / (sdrColor + offsetSdr);
  vec3 logRecovery = (log2(pixelGain) - minLog2) / (maxLog2 - minLog2);
  vec3 clampedRecovery = saturate(logRecovery);
  gl_FragColor = vec4(pow(clampedRecovery, gamma), 1.0);
}
`;
    /**
     * A Material which is able to encode a gainmap
     *
     * @category Materials
     * @group Materials
     */
    class GainMapEncoderMaterial extends three.ShaderMaterial {
        /**
         *
         * @param params
         */
        constructor({ sdr, hdr, offsetSdr, offsetHdr, maxContentBoost, minContentBoost, gamma }) {
            if (!maxContentBoost)
                throw new Error('maxContentBoost is required');
            if (!sdr)
                throw new Error('sdr is required');
            if (!hdr)
                throw new Error('hdr is required');
            const _gamma = gamma || [1, 1, 1];
            const _offsetSdr = offsetSdr || [1 / 64, 1 / 64, 1 / 64];
            const _offsetHdr = offsetHdr || [1 / 64, 1 / 64, 1 / 64];
            const _minContentBoost = minContentBoost || 1;
            const _maxContentBoost = Math.max(maxContentBoost, 1.0001);
            super({
                name: 'GainMapEncoderMaterial',
                vertexShader: vertexShader$2,
                fragmentShader: fragmentShader$2,
                uniforms: {
                    sdr: { value: sdr },
                    hdr: { value: hdr },
                    gamma: { value: new three.Vector3().fromArray(_gamma) },
                    offsetSdr: { value: new three.Vector3().fromArray(_offsetSdr) },
                    offsetHdr: { value: new three.Vector3().fromArray(_offsetHdr) },
                    minLog2: { value: Math.log2(_minContentBoost) },
                    maxLog2: { value: Math.log2(_maxContentBoost) }
                },
                blending: three.NoBlending,
                depthTest: false,
                depthWrite: false
            });
            this._minContentBoost = _minContentBoost;
            this._maxContentBoost = _maxContentBoost;
            this._offsetSdr = _offsetSdr;
            this._offsetHdr = _offsetHdr;
            this._gamma = _gamma;
            this.needsUpdate = true;
            this.uniformsNeedUpdate = true;
        }
        /**
         * @see {@link GainmapEncodingParameters.gamma}
         */
        get gamma() { return this._gamma; }
        set gamma(value) {
            this._gamma = value;
            this.uniforms.gamma.value = new three.Vector3().fromArray(value);
        }
        /**
         * @see {@link GainmapEncodingParameters.offsetHdr}
         */
        get offsetHdr() { return this._offsetHdr; }
        set offsetHdr(value) {
            this._offsetHdr = value;
            this.uniforms.offsetHdr.value = new three.Vector3().fromArray(value);
        }
        /**
         * @see {@link GainmapEncodingParameters.offsetSdr}
         */
        get offsetSdr() { return this._offsetSdr; }
        set offsetSdr(value) {
            this._offsetSdr = value;
            this.uniforms.offsetSdr.value = new three.Vector3().fromArray(value);
        }
        /**
         * @see {@link GainmapEncodingParameters.minContentBoost}
         * @remarks Non logarithmic space
         */
        get minContentBoost() { return this._minContentBoost; }
        set minContentBoost(value) {
            this._minContentBoost = value;
            this.uniforms.minLog2.value = Math.log2(value);
        }
        /**
         * @see {@link GainmapEncodingParameters.maxContentBoost}
         * @remarks Non logarithmic space
         */
        get maxContentBoost() { return this._maxContentBoost; }
        set maxContentBoost(value) {
            this._maxContentBoost = value;
            this.uniforms.maxLog2.value = Math.log2(value);
        }
        /**
         * @see {@link GainMapMetadata.gainMapMin}
         * @remarks Logarithmic space
         */
        get gainMapMin() { return [Math.log2(this._minContentBoost), Math.log2(this._minContentBoost), Math.log2(this._minContentBoost)]; }
        /**
         * @see {@link GainMapMetadata.gainMapMax}
         * @remarks Logarithmic space
         */
        get gainMapMax() { return [Math.log2(this._maxContentBoost), Math.log2(this._maxContentBoost), Math.log2(this._maxContentBoost)]; }
        /**
         * @see {@link GainMapMetadata.hdrCapacityMin}
         * @remarks Logarithmic space
         */
        get hdrCapacityMin() { return Math.min(Math.max(0, this.gainMapMin[0]), Math.max(0, this.gainMapMin[1]), Math.max(0, this.gainMapMin[2])); }
        /**
         * @see {@link GainMapMetadata.hdrCapacityMax}
         * @remarks Logarithmic space
         */
        get hdrCapacityMax() { return Math.max(Math.max(0, this.gainMapMax[0]), Math.max(0, this.gainMapMax[1]), Math.max(0, this.gainMapMax[2])); }
    }

    /**
     *
     * @param params
     * @returns
     * @category Encoding Functions
     * @group Encoding Functions
     */
    const getGainMap = (params) => {
        const { image, sdr, renderer } = params;
        const dataTexture = getDataTexture(image);
        const material = new GainMapEncoderMaterial({
            ...params,
            sdr: sdr.renderTarget.texture,
            hdr: dataTexture
        });
        const quadRenderer = new QuadRenderer({
            width: dataTexture.image.width,
            height: dataTexture.image.height,
            type: three.UnsignedByteType,
            colorSpace: three.LinearSRGBColorSpace,
            material,
            renderer,
            renderTargetOptions: params.renderTargetOptions
        });
        try {
            quadRenderer.render();
        }
        catch (e) {
            quadRenderer.disposeOnDemandRenderer();
            throw e;
        }
        return quadRenderer;
    };

    const vertexShader$1 = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
    const fragmentShader$1 = /* glsl */ `
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif

uniform sampler2D map;
uniform float brightness;
uniform float contrast;
uniform float saturation;
uniform float exposure;

varying vec2 vUv;

mat4 brightnessMatrix( float brightness ) {
  return mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    brightness, brightness, brightness, 1
  );
}

mat4 contrastMatrix( float contrast ) {
  float t = ( 1.0 - contrast ) / 2.0;
  return mat4(
    contrast, 0, 0, 0,
    0, contrast, 0, 0,
    0, 0, contrast, 0,
    t, t, t, 1
  );
}

mat4 saturationMatrix( float saturation ) {
  vec3 luminance = vec3( 0.3086, 0.6094, 0.0820 );
  float oneMinusSat = 1.0 - saturation;
  vec3 red = vec3( luminance.x * oneMinusSat );
  red+= vec3( saturation, 0, 0 );
  vec3 green = vec3( luminance.y * oneMinusSat );
  green += vec3( 0, saturation, 0 );
  vec3 blue = vec3( luminance.z * oneMinusSat );
  blue += vec3( 0, 0, saturation );
  return mat4(
    red,     0,
    green,   0,
    blue,    0,
    0, 0, 0, 1
  );
}

vec3 RRTAndODTFit( vec3 v ) {
  vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
  vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
  return a / b;
}

vec3 ACESFilmicToneMapping( vec3 color ) {
  // sRGB => XYZ => D65_2_D60 => AP1 => RRT_SAT
  const mat3 ACESInputMat = mat3(
    vec3( 0.59719, 0.07600, 0.02840 ), // transposed from source
    vec3( 0.35458, 0.90834, 0.13383 ),
    vec3( 0.04823, 0.01566, 0.83777 )
  );
  // ODT_SAT => XYZ => D60_2_D65 => sRGB
  const mat3 ACESOutputMat = mat3(
    vec3(  1.60475, -0.10208, -0.00327 ), // transposed from source
    vec3( -0.53108,  1.10813, -0.07276 ),
    vec3( -0.07367, -0.00605,  1.07602 )
  );
  color = ACESInputMat * color;
  // Apply RRT and ODT
  color = RRTAndODTFit( color );
  color = ACESOutputMat * color;
  // Clamp to [0, 1]
  return saturate( color );
}

// source: https://www.cs.utah.edu/docs/techreports/2002/pdf/UUCS-02-001.pdf
vec3 ReinhardToneMapping( vec3 color ) {
  return saturate( color / ( vec3( 1.0 ) + color ) );
}

// source: http://filmicworlds.com/blog/filmic-tonemapping-operators/
vec3 CineonToneMapping( vec3 color ) {
  // optimized filmic operator by Jim Hejl and Richard Burgess-Dawson
  color = max( vec3( 0.0 ), color - 0.004 );
  return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}

// nothing
vec3 LinearToneMapping ( vec3 color ) {
  return color;
}


void main() {
  vec4 color = texture2D(map, vUv);

  vec4 exposed = vec4(exposure * color.rgb, color.a);

  vec4 tonemapped = vec4(TONEMAPPING_FUNCTION(exposed.rgb), color.a);

  vec4 adjusted =
    brightnessMatrix( brightness ) *
    contrastMatrix( contrast ) *
    saturationMatrix( saturation ) *
    tonemapped;

  gl_FragColor = adjusted;
}
`;
    /**
     * A Material used to adjust the SDR representation of an HDR image
     *
     * @category Materials
     * @group Materials
     */
    class SDRMaterial extends three.ShaderMaterial {
        /**
         *
         * @param params
         */
        constructor({ map, toneMapping }) {
            super({
                name: 'SDRMaterial',
                vertexShader: vertexShader$1,
                fragmentShader: fragmentShader$1,
                uniforms: {
                    map: { value: map },
                    brightness: { value: 0 },
                    contrast: { value: 1 },
                    saturation: { value: 1 },
                    exposure: { value: 1 }
                },
                blending: three.NoBlending,
                depthTest: false,
                depthWrite: false
            });
            this._brightness = 0;
            this._contrast = 1;
            this._saturation = 1;
            this._exposure = 1;
            this._map = map;
            this.toneMapping = this._toneMapping = toneMapping || three.ACESFilmicToneMapping;
            this.needsUpdate = true;
            this.uniformsNeedUpdate = true;
        }
        get toneMapping() { return this._toneMapping; }
        set toneMapping(value) {
            let valid = false;
            switch (value) {
                case three.ACESFilmicToneMapping:
                    this.defines.TONEMAPPING_FUNCTION = 'ACESFilmicToneMapping';
                    valid = true;
                    break;
                case three.ReinhardToneMapping:
                    this.defines.TONEMAPPING_FUNCTION = 'ReinhardToneMapping';
                    valid = true;
                    break;
                case three.CineonToneMapping:
                    this.defines.TONEMAPPING_FUNCTION = 'CineonToneMapping';
                    valid = true;
                    break;
                case three.LinearToneMapping:
                    this.defines.TONEMAPPING_FUNCTION = 'LinearToneMapping';
                    valid = true;
                    break;
                default:
                    console.error(`Unsupported toneMapping: ${value}. Using LinearToneMapping.`);
                    this.defines.TONEMAPPING_FUNCTION = 'LinearToneMapping';
                    this._toneMapping = three.LinearToneMapping;
            }
            if (valid) {
                this._toneMapping = value;
            }
            this.needsUpdate = true;
        }
        get brightness() { return this._brightness; }
        set brightness(value) {
            this._brightness = value;
            this.uniforms.brightness.value = value;
        }
        get contrast() { return this._contrast; }
        set contrast(value) {
            this._contrast = value;
            this.uniforms.contrast.value = value;
        }
        get saturation() { return this._saturation; }
        set saturation(value) {
            this._saturation = value;
            this.uniforms.saturation.value = value;
        }
        get exposure() { return this._exposure; }
        set exposure(value) {
            this._exposure = value;
            this.uniforms.exposure.value = value;
        }
        get map() { return this._map; }
        set map(value) {
            this._map = value;
            this.uniforms.map.value = value;
        }
    }

    /**
     * Renders an SDR Representation of an HDR Image
     *
     * @category Encoding Functions
     * @group Encoding Functions
     *
     * @param hdrTexture The HDR image to be rendered
     * @param renderer (optional) WebGLRenderer to use during the rendering, a disposable renderer will be create and destroyed if this is not provided.
     * @param toneMapping (optional) Tone mapping to be applied to the SDR Rendition
     * @param renderTargetOptions (optional) Options to use when creating the output renderTarget
     * @throws {Error} if the WebGLRenderer fails to render the SDR image
     */
    const getSDRRendition = (hdrTexture, renderer, toneMapping, renderTargetOptions) => {
        hdrTexture.needsUpdate = true;
        const quadRenderer = new QuadRenderer({
            width: hdrTexture.image.width,
            height: hdrTexture.image.height,
            type: three.UnsignedByteType,
            colorSpace: three.SRGBColorSpace,
            material: new SDRMaterial({ map: hdrTexture, toneMapping }),
            renderer,
            renderTargetOptions
        });
        try {
            quadRenderer.render();
        }
        catch (e) {
            quadRenderer.disposeOnDemandRenderer();
            throw e;
        }
        return quadRenderer;
    };

    /**
     * Encodes a Gainmap starting from an HDR file.
     *
     * @remarks
     * if you do not pass a `renderer` parameter
     * you must manually dispose the result
     * ```js
     * const encodingResult = await encode({ ... })
     * // do something with the buffers
     * const sdr = encodingResult.sdr.getArray()
     * const gainMap = encodingResult.gainMap.getArray()
     * // after that
     * encodingResult.sdr.dispose()
     * encodingResult.gainMap.dispose()
     * ```
     *
     * @category Encoding Functions
     * @group Encoding Functions
     *
     * @example
     * import { encode, findTextureMinMax } from '@monogrid/gainmap-js'
     * import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
     *
     * // load an HDR file
     * const loader = new EXRLoader()
     * const image = await loader.loadAsync('image.exr')
     *
     * // find RAW RGB Max value of a texture
     * const textureMax = await findTextureMinMax(image)
     *
     * // Encode the gainmap
     * const encodingResult = encode({
     *   image,
     *   // this will encode the full HDR range
     *   maxContentBoost: Math.max.apply(this, textureMax)
     * })
     * // can be re-encoded after changing parameters
     * encodingResult.sdr.material.exposure = 0.9
     * encodingResult.sdr.render()
     * // or
     * encodingResult.gainMap.material.gamma = [1.1, 1.1, 1.1]
     * encodingResult.gainMap.render()
     *
     * // do something with encodingResult.gainMap.toArray()
     * // and encodingResult.sdr.toArray()
     *
     * // renderers must be manually disposed
     * encodingResult.sdr.dispose()
     * encodingResult.gainMap.dispose()
     *
     * @param params Encoding Parameters
     * @returns
     */
    const encode = (params) => {
        const { image, renderer } = params;
        const dataTexture = getDataTexture(image);
        const sdr = getSDRRendition(dataTexture, renderer, params.toneMapping, params.renderTargetOptions);
        const gainMapRenderer = getGainMap({
            ...params,
            image: dataTexture,
            sdr,
            renderer: sdr.renderer // reuse the same (maybe disposable?) renderer
        });
        return {
            sdr,
            gainMap: gainMapRenderer,
            hdr: dataTexture,
            getMetadata: () => {
                return {
                    gainMapMax: gainMapRenderer.material.gainMapMax,
                    gainMapMin: gainMapRenderer.material.gainMapMin,
                    gamma: gainMapRenderer.material.gamma,
                    hdrCapacityMax: gainMapRenderer.material.hdrCapacityMax,
                    hdrCapacityMin: gainMapRenderer.material.hdrCapacityMin,
                    offsetHdr: gainMapRenderer.material.offsetHdr,
                    offsetSdr: gainMapRenderer.material.offsetSdr
                };
            }
        };
    };

    /**
     * Encodes a Gainmap starting from an HDR file into compressed file formats (`image/jpeg`, `image/webp` or `image/png`).
     *
     * Uses {@link encode} internally, then pipes the results to {@link compress}.
     *
     * @remarks
     * if a `renderer` parameter is not provided
     * This function will automatically dispose its "disposable"
     * renderer, no need to dispose it manually later
     *
     * @category Encoding Functions
     * @group Encoding Functions
     * @example
     * import { encodeAndCompress, findTextureMinMax } from '@monogrid/gainmap-js'
     * import { encodeJPEGMetadata } from '@monogrid/gainmap-js/libultrahdr'
     * import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
     *
     * // load an HDR file
     * const loader = new EXRLoader()
     * const image = await loader.loadAsync('image.exr')
     *
     * // find RAW RGB Max value of a texture
     * const textureMax = await findTextureMinMax(image)
     *
     * // Encode the gainmap
     * const encodingResult = await encodeAndCompress({
     *   image,
     *   maxContentBoost: Math.max.apply(this, textureMax),
     *   mimeType: 'image/jpeg'
     * })
     *
     * // embed the compressed images + metadata into a single
     * // JPEG file
     * const jpeg = await encodeJPEGMetadata({
     *   ...encodingResult,
     *   sdr: encodingResult.sdr,
     *   gainMap: encodingResult.gainMap
     * })
     *
     * // `jpeg` will be an `Uint8Array` which can be saved somewhere
     *
     *
     * @param params Encoding Parameters
     * @throws {Error} if the browser does not support [createImageBitmap](https://caniuse.com/createimagebitmap)
     */
    const encodeAndCompress = async (params) => {
        const encodingResult = encode(params);
        const { mimeType, quality, flipY, withWorker } = params;
        let compressResult;
        let rawSDR;
        let rawGainMap;
        const sdrImageData = new ImageData(encodingResult.sdr.toArray(), encodingResult.sdr.width, encodingResult.sdr.height);
        const gainMapImageData = new ImageData(encodingResult.gainMap.toArray(), encodingResult.gainMap.width, encodingResult.gainMap.height);
        if (withWorker) {
            const workerResult = await Promise.all([
                withWorker.compress({
                    source: sdrImageData,
                    mimeType,
                    quality,
                    flipY
                }),
                withWorker.compress({
                    source: gainMapImageData,
                    mimeType,
                    quality,
                    flipY
                })
            ]);
            compressResult = workerResult;
            rawSDR = workerResult[0].source;
            rawGainMap = workerResult[1].source;
        }
        else {
            compressResult = await Promise.all([
                compress({
                    source: sdrImageData,
                    mimeType,
                    quality,
                    flipY
                }),
                compress({
                    source: gainMapImageData,
                    mimeType,
                    quality,
                    flipY
                })
            ]);
            rawSDR = sdrImageData.data;
            rawGainMap = gainMapImageData.data;
        }
        encodingResult.sdr.dispose();
        encodingResult.gainMap.dispose();
        return {
            ...encodingResult,
            ...encodingResult.getMetadata(),
            sdr: compressResult[0],
            gainMap: compressResult[1],
            rawSDR,
            rawGainMap
        };
    };

    const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
    const fragmentShader = /* glsl */ `
precision mediump float;

#ifndef CELL_SIZE
  #define CELL_SIZE 2
#endif

#ifndef COMPARE_FUNCTION
  #define COMPARE_FUNCTION max
#endif

#ifndef INITIAL_VALUE
  #define INITIAL_VALUE 0
#endif

uniform sampler2D map;
uniform vec2 u_srcResolution;

varying vec2 vUv;

void main() {
  // compute the first pixel the source cell
  vec2 srcPixel = floor(gl_FragCoord.xy) * float(CELL_SIZE);

  // one pixel in source
  vec2 onePixel = vec2(1) / u_srcResolution;

  // uv for first pixel in cell. +0.5 for center of pixel
  vec2 uv = (srcPixel + 0.5) * onePixel;

  vec4 resultColor = vec4(INITIAL_VALUE);

  for (int y = 0; y < CELL_SIZE; ++y) {
    for (int x = 0; x < CELL_SIZE; ++x) {
      resultColor = COMPARE_FUNCTION(resultColor, texture2D(map, uv + vec2(x, y) * onePixel));
    }
  }

  gl_FragColor = resultColor;
}
`;
    /**
     *
     * @category Utility
     * @group Utility
     *
     * @param image
     * @param mode
     * @param renderer
     * @returns
     */
    const findTextureMinMax = (image, mode = 'max', renderer) => {
        const srcTex = getDataTexture(image);
        const cellSize = 2;
        const mat = new three.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                u_srcResolution: { value: new three.Vector2(srcTex.image.width, srcTex.image.height) },
                map: { value: srcTex }
            },
            defines: {
                CELL_SIZE: cellSize,
                COMPARE_FUNCTION: mode,
                INITIAL_VALUE: mode === 'max' ? 0 : 65504 // max half float value
            }
        });
        srcTex.needsUpdate = true;
        mat.needsUpdate = true;
        let w = srcTex.image.width;
        let h = srcTex.image.height;
        const quadRenderer = new QuadRenderer({
            width: w,
            height: h,
            type: srcTex.type,
            colorSpace: srcTex.colorSpace,
            material: mat,
            renderer
        });
        const frameBuffers = [];
        while (w > 1 || h > 1) {
            w = Math.max(1, (w + cellSize - 1) / cellSize | 0);
            h = Math.max(1, (h + cellSize - 1) / cellSize | 0);
            const fb = new three.WebGLRenderTarget(w, h, {
                type: quadRenderer.type,
                format: srcTex.format,
                colorSpace: quadRenderer.colorSpace,
                minFilter: three.NearestFilter,
                magFilter: three.NearestFilter,
                wrapS: three.ClampToEdgeWrapping,
                wrapT: three.ClampToEdgeWrapping,
                generateMipmaps: false,
                depthBuffer: false,
                stencilBuffer: false
            });
            frameBuffers.push(fb);
        }
        w = srcTex.image.width;
        h = srcTex.image.height;
        frameBuffers.forEach((fbi) => {
            w = Math.max(1, (w + cellSize - 1) / cellSize | 0);
            h = Math.max(1, (h + cellSize - 1) / cellSize | 0);
            quadRenderer.renderTarget = fbi;
            quadRenderer.render();
            mat.uniforms.map.value = fbi.texture;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            mat.uniforms.u_srcResolution.value.x = w;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            mat.uniforms.u_srcResolution.value.y = h;
        });
        const out = quadRenderer.toArray();
        quadRenderer.dispose();
        frameBuffers.forEach(fb => fb.dispose());
        return [
            quadRenderer.type === three.FloatType ? out[0] : three.DataUtils.fromHalfFloat(out[0]),
            quadRenderer.type === three.FloatType ? out[1] : three.DataUtils.fromHalfFloat(out[1]),
            quadRenderer.type === three.FloatType ? out[2] : three.DataUtils.fromHalfFloat(out[2])
        ];
    };

    exports.GainMapEncoderMaterial = GainMapEncoderMaterial;
    exports.SDRMaterial = SDRMaterial;
    exports.compress = compress;
    exports.encode = encode;
    exports.encodeAndCompress = encodeAndCompress;
    exports.findTextureMinMax = findTextureMinMax;
    exports.getGainMap = getGainMap;
    exports.getSDRRendition = getSDRRendition;

}));
