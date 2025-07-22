import { GainMapMetadata } from '../core/types';
/**
 * Decodes a JPEG file with an embedded Gainmap and XMP Metadata (aka JPEG-R)
 *
 * @category Decoding
 * @group Decoding
 * @deprecated
 * @example
 * import { decodeJPEGMetadata } from '@monogrid/gainmap-js/libultrahdr'
 *
 * // fetch a JPEG image containing a gainmap as ArrayBuffer
 * const gainmap = new Uint8Array(await (await fetch('gainmap.jpeg')).arrayBuffer())
 *
 * // extract data from the JPEG
 * const { gainMap, sdr, parsedMetadata } = await decodeJPEGMetadata(gainmap)
 *
 * @param file A Jpeg file Uint8Array.
 * @returns The decoded data
 * @throws {Error} if the provided file cannot be parsed or does not contain a valid Gainmap
 */
export declare const decodeJPEGMetadata: (file: Uint8Array) => Promise<{
    parsedMetadata: GainMapMetadata;
    metadata: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
    success: boolean;
    errorMessage: any;
    sdr: any;
    gainMap: any;
}>;
