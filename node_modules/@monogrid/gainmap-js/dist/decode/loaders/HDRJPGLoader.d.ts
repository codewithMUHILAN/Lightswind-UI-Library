import { HalfFloatType } from 'three';
import { QuadRenderer } from '../../core/QuadRenderer';
import { GainMapDecoderMaterial } from '../materials/GainMapDecoderMaterial';
import { LoaderBase } from './LoaderBase';
/**
 * A Three.js Loader for a JPEG with embedded gainmap metadata.
 *
 * @category Loaders
 * @group Loaders
 *
 * @example
 * import { HDRJPGLoader } from '@monogrid/gainmap-js'
 * import {
 *   EquirectangularReflectionMapping,
 *   LinearFilter,
 *   Mesh,
 *   MeshBasicMaterial,
 *   PerspectiveCamera,
 *   PlaneGeometry,
 *   Scene,
 *   WebGLRenderer
 * } from 'three'
 *
 * const renderer = new WebGLRenderer()
 *
 * const loader = new HDRJPGLoader(renderer)
 *
 * const result = await loader.loadAsync('gainmap.jpeg')
 * // `result` can be used to populate a Texture
 *
 * const scene = new Scene()
 * const mesh = new Mesh(
 *   new PlaneGeometry(),
 *   new MeshBasicMaterial({ map: result.renderTarget.texture })
 * )
 * scene.add(mesh)
 * renderer.render(scene, new PerspectiveCamera())
 *
 * // Starting from three.js r159
 * // `result.renderTarget.texture` can
 * // also be used as Equirectangular scene background
 * //
 * // it was previously needed to convert it
 * // to a DataTexture with `result.toDataTexture()`
 * scene.background = result.renderTarget.texture
 * scene.background.mapping = EquirectangularReflectionMapping
 *
 * // result must be manually disposed
 * // when you are done using it
 * result.dispose()
 *
 */
export declare class HDRJPGLoader extends LoaderBase<string> {
    /**
     * Loads a JPEG containing gain map metadata
     * Renders a normal SDR image if gainmap data is not found
     *
     * @param url An array in the form of [sdr.jpg, gainmap.jpg, metadata.json]
     * @param onLoad Load complete callback, will receive the result
     * @param onProgress Progress callback, will receive a {@link ProgressEvent}
     * @param onError Error callback
     * @returns
     */
    load(url: string, onLoad?: (data: QuadRenderer<typeof HalfFloatType, GainMapDecoderMaterial>) => void, onProgress?: (event: ProgressEvent) => void, onError?: (err: unknown) => void): QuadRenderer<typeof HalfFloatType, GainMapDecoderMaterial>;
}
