import { ShaderMaterial, Texture } from 'three';
import { GainMapMetadata } from '../../core/types';
import { GainmapDecodingParameters } from '../types';
/**
 * A Material which is able to decode the Gainmap into a full HDR Representation
 *
 * @category Materials
 * @group Materials
 */
export declare class GainMapDecoderMaterial extends ShaderMaterial {
    private _maxDisplayBoost;
    private _hdrCapacityMin;
    private _hdrCapacityMax;
    /**
     *
     * @param params
     */
    constructor({ gamma, offsetHdr, offsetSdr, gainMapMin, gainMapMax, maxDisplayBoost, hdrCapacityMin, hdrCapacityMax, sdr, gainMap }: GainMapMetadata & GainmapDecodingParameters & {
        sdr: Texture;
        gainMap: Texture;
    });
    get sdr(): Texture;
    set sdr(value: Texture);
    get gainMap(): Texture;
    set gainMap(value: Texture);
    /**
     * @see {@link GainMapMetadata.offsetHdr}
     */
    get offsetHdr(): [number, number, number];
    set offsetHdr(value: [number, number, number]);
    /**
     * @see {@link GainMapMetadata.offsetSdr}
     */
    get offsetSdr(): [number, number, number];
    set offsetSdr(value: [number, number, number]);
    /**
     * @see {@link GainMapMetadata.gainMapMin}
     */
    get gainMapMin(): [number, number, number];
    set gainMapMin(value: [number, number, number]);
    /**
     * @see {@link GainMapMetadata.gainMapMax}
     */
    get gainMapMax(): [number, number, number];
    set gainMapMax(value: [number, number, number]);
    /**
     * @see {@link GainMapMetadata.gamma}
     */
    get gamma(): [number, number, number];
    set gamma(value: [number, number, number]);
    /**
     * @see {@link GainMapMetadata.hdrCapacityMin}
     * @remarks Logarithmic space
     */
    get hdrCapacityMin(): number;
    set hdrCapacityMin(value: number);
    /**
     * @see {@link GainMapMetadata.hdrCapacityMin}
     * @remarks Logarithmic space
     */
    get hdrCapacityMax(): number;
    set hdrCapacityMax(value: number);
    /**
     * @see {@link GainmapDecodingParameters.maxDisplayBoost}
     * @remarks Non Logarithmic space
     */
    get maxDisplayBoost(): number;
    set maxDisplayBoost(value: number);
    private calculateWeight;
}
