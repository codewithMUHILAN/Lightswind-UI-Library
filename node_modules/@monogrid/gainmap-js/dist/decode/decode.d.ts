import { HalfFloatType } from 'three';
import { QuadRenderer } from '../core/QuadRenderer';
import { GainMapDecoderMaterial } from './materials/GainMapDecoderMaterial';
import { DecodeParameters } from './types';
/**
 * Decodes a gain map using a WebGLRenderTarget
 *
 * @category Decoding Functions
 * @group Decoding Functions
 * @example
 * import { decode } from '@monogrid/gainmap-js'
 * import {
 *   Mesh,
 *   MeshBasicMaterial,
 *   PerspectiveCamera,
 *   PlaneGeometry,
 *   Scene,
 *   TextureLoader,
 *   WebGLRenderer
 * } from 'three'
 *
 * const renderer = new WebGLRenderer()
 *
 * const textureLoader = new TextureLoader()
 *
 * // load SDR Representation
 * const sdr = await textureLoader.loadAsync('sdr.jpg')
 * // load Gain map recovery image
 * const gainMap = await textureLoader.loadAsync('gainmap.jpg')
 * // load metadata
 * const metadata = await (await fetch('metadata.json')).json()
 *
 * const result = await decode({
 *   sdr,
 *   gainMap,
 *   // this allows to use `result.renderTarget.texture` directly
 *   renderer,
 *   // this will restore the full HDR range
 *   maxDisplayBoost: Math.pow(2, metadata.hdrCapacityMax),
 *   ...metadata
 * })
 *
 * const scene = new Scene()
 * // `result` can be used to populate a Texture
 * const mesh = new Mesh(
 *   new PlaneGeometry(),
 *   new MeshBasicMaterial({ map: result.renderTarget.texture })
 * )
 * scene.add(mesh)
 * renderer.render(scene, new PerspectiveCamera())
 *
 * // result must be manually disposed
 * // when you are done using it
 * result.dispose()
 *
 * @param params
 * @returns
 * @throws {Error} if the WebGLRenderer fails to render the gain map
 */
export declare const decode: (params: DecodeParameters) => InstanceType<typeof QuadRenderer<typeof HalfFloatType, InstanceType<typeof GainMapDecoderMaterial>>>;
