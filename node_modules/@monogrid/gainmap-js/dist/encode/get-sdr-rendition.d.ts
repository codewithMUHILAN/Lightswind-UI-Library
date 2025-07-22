import { DataTexture, ToneMapping, UnsignedByteType, WebGLRenderer } from 'three';
import { QuadRenderer } from '../core/QuadRenderer';
import { QuadRendererTextureOptions } from '../decode';
import { SDRMaterial } from './materials/SDRMaterial';
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
export declare const getSDRRendition: (hdrTexture: DataTexture, renderer?: WebGLRenderer, toneMapping?: ToneMapping, renderTargetOptions?: QuadRendererTextureOptions) => InstanceType<typeof QuadRenderer<typeof UnsignedByteType, InstanceType<typeof SDRMaterial>>>;
