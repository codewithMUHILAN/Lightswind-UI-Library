import { Mapping, RenderTargetOptions } from 'three';
/**
 * This is the Metadata stored in an encoded Gainmap which is used
 * to decode it and return an HDR image
 *
 * @category Specs
 * @group Specs
 */
export type GainMapMetadata = {
    /**
     * This is the gamma to apply to the stored map values.
     * @defaultValue [1, 1, 1]
     * @remarks
     * * Typically you can use a gamma of 1.0.
     * * You can use a different value if your gain map has a very uneven distribution of log_recovery(x, y) values.
     *
     *   For example, this might apply if a gain map has a lot of detail just above SDR range (represented as small log_recovery(x, y) values),
     *   and a very large map_max_log2 for the top end of the HDR rendition's desired brightness (represented by large log_recovery(x, y) values).
     *   In this case, you can use a map_gamma higher than 1.0 so that recovery(x, y) can precisely encode the detail in both the low end and high end of log_recovery(x, y).
     */
    gamma: [number, number, number];
    /**
     * This is log2 of the minimum display boost value for which the map is applied at all.
     *
     * @remarks
     * * This value also affects how much to apply the gain map based on the display boost.
     * * Must be 0.0 or greater.
     *
     * Logarithmic space
     */
    hdrCapacityMin: number;
    /**
     * Stores the value of hdr_capacity_max. This is log2 of the maximum display boost value for which the map is applied completely.
     *
     * @remarks
     * * This value also affects how much to apply the gain map based on the display boost.
     * * Must be greater than hdrCapacityMin.
     * * Required.
     *
     * Logarithmic space
     */
    hdrCapacityMax: number;
    /**
     * This is the offset to apply to the SDR pixel values during gain map generation and application
     * @defaultValue [1/64, 1/64, 1/64]
     */
    offsetSdr: [number, number, number];
    /**
     * This is the offset to apply to the HDR pixel values during gain map generation and application.
     * @defaultValue [1/64, 1/64, 1/64]
     */
    offsetHdr: [number, number, number];
    /**
     * This is log2 of min content boost, which is the minimum allowed ratio of
     * the linear luminance for the target HDR rendition relative to
     * (divided by) that of the SDR image, at a given pixel.
     */
    gainMapMin: [number, number, number];
    /**
     * This is log2 of max content boost, which is the maximum allowed ratio of
     * the linear luminance for the Target HDR rendition relative to
     * (divided by) that of the SDR image, at a given pixel.
     */
    gainMapMax: [number, number, number];
};
/**
 *
 */
export type QuadRendererTextureOptions = Omit<RenderTargetOptions, 'type' | 'format' | 'colorSpace' | 'encoding' | 'depthTexture' | 'stencilBuffer' | 'depthBuffer' | 'internalFormat'> & {
    /**
     * @defaultValue {@link Mapping}
     */
    mapping?: Mapping;
    /**
     * @defaultValue 1
     */
    anisotropy?: number;
};
