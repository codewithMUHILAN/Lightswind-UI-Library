import { CompressedImage, EncodingParametersWithCompression } from './types';
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
export declare const encodeAndCompress: (params: EncodingParametersWithCompression) => Promise<{
    sdr: CompressedImage;
    gainMap: CompressedImage;
    rawSDR: Uint8ClampedArray;
    rawGainMap: Uint8ClampedArray;
    gamma: [number, number, number];
    hdrCapacityMin: number;
    hdrCapacityMax: number;
    offsetSdr: [number, number, number];
    offsetHdr: [number, number, number];
    gainMapMin: [number, number, number];
    gainMapMax: [number, number, number];
    hdr: import("three").DataTexture;
    getMetadata: () => import(".").GainMapMetadata;
}>;
