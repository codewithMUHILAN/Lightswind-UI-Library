import { HalfFloatType, Loader, LoadingManager, WebGLRenderer } from 'three';
import { QuadRenderer } from '../../core/QuadRenderer';
import { type GainMapMetadata, QuadRendererTextureOptions } from '../../core/types';
import { GainMapDecoderMaterial } from '../materials/GainMapDecoderMaterial';
export declare class LoaderBase<TUrl = string> extends Loader<QuadRenderer<typeof HalfFloatType, GainMapDecoderMaterial>, TUrl> {
    private _renderer?;
    private _renderTargetOptions?;
    /**
     * @private
     */
    protected _internalLoadingManager: LoadingManager;
    /**
     *
     * @param renderer
     * @param manager
     */
    constructor(renderer?: WebGLRenderer, manager?: LoadingManager);
    /**
     * Specify the renderer to use when rendering the gain map
     *
     * @param renderer
     * @returns
     */
    setRenderer(renderer: WebGLRenderer): this;
    /**
     * Specify the renderTarget options to use when rendering the gain map
     *
     * @param options
     * @returns
     */
    setRenderTargetOptions(options: QuadRendererTextureOptions): this;
    /**
     * @private
     * @returns
     */
    protected prepareQuadRenderer(): QuadRenderer<1016, GainMapDecoderMaterial>;
    /**
   * @private
   * @param quadRenderer
   * @param metadata
   * @param sdrBuffer
   * @param gainMapBuffer
   */
    protected render(quadRenderer: QuadRenderer<typeof HalfFloatType, GainMapDecoderMaterial>, metadata: GainMapMetadata, sdrBuffer: ArrayBuffer, gainMapBuffer?: ArrayBuffer): Promise<void>;
}
