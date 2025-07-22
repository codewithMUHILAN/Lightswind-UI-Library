import { ShaderMaterial, Texture } from 'three';
import { GainmapEncodingParameters } from '../types';
/**
 * A Material which is able to encode a gainmap
 *
 * @category Materials
 * @group Materials
 */
export declare class GainMapEncoderMaterial extends ShaderMaterial {
    private _minContentBoost;
    private _maxContentBoost;
    private _offsetSdr;
    private _offsetHdr;
    private _gamma;
    /**
     *
     * @param params
     */
    constructor({ sdr, hdr, offsetSdr, offsetHdr, maxContentBoost, minContentBoost, gamma }: {
        sdr: Texture;
        hdr: Texture;
    } & GainmapEncodingParameters);
    /**
     * @see {@link GainmapEncodingParameters.gamma}
     */
    get gamma(): [number, number, number];
    set gamma(value: [number, number, number]);
    /**
     * @see {@link GainmapEncodingParameters.offsetHdr}
     */
    get offsetHdr(): [number, number, number];
    set offsetHdr(value: [number, number, number]);
    /**
     * @see {@link GainmapEncodingParameters.offsetSdr}
     */
    get offsetSdr(): [number, number, number];
    set offsetSdr(value: [number, number, number]);
    /**
     * @see {@link GainmapEncodingParameters.minContentBoost}
     * @remarks Non logarithmic space
     */
    get minContentBoost(): number;
    set minContentBoost(value: number);
    /**
     * @see {@link GainmapEncodingParameters.maxContentBoost}
     * @remarks Non logarithmic space
     */
    get maxContentBoost(): number;
    set maxContentBoost(value: number);
    /**
     * @see {@link GainMapMetadata.gainMapMin}
     * @remarks Logarithmic space
     */
    get gainMapMin(): [number, number, number];
    /**
     * @see {@link GainMapMetadata.gainMapMax}
     * @remarks Logarithmic space
     */
    get gainMapMax(): [number, number, number];
    /**
     * @see {@link GainMapMetadata.hdrCapacityMin}
     * @remarks Logarithmic space
     */
    get hdrCapacityMin(): number;
    /**
     * @see {@link GainMapMetadata.hdrCapacityMax}
     * @remarks Logarithmic space
     */
    get hdrCapacityMax(): number;
}
