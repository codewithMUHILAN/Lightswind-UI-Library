import { QuadRenderer } from '../core/QuadRenderer';
import { GainMapEncoderMaterial } from './materials/GainMapEncoderMaterial';
import { EncodingParametersBase } from './types';
/**
 *
 * @param params
 * @returns
 * @category Encoding Functions
 * @group Encoding Functions
 */
export declare const getGainMap: (params: {
    sdr: InstanceType<typeof QuadRenderer>;
} & EncodingParametersBase) => QuadRenderer<1009, GainMapEncoderMaterial>;
