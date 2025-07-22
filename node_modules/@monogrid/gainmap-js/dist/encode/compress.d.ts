import { CompressedImage, CompressParameters } from './types';
/**
 * Converts a RAW RGBA image buffer into the provided `mimeType` using the provided `quality`
 *
 * @category Compression
 * @group Compression
 * @param params
 * @throws {Error} if the browser does not support [createImageBitmap](https://caniuse.com/createimagebitmap)
 * @throws {Error} if the provided source image cannot be decoded
 * @throws {Error} if the function fails to create a canvas context
 */
export declare const compress: (params: CompressParameters) => Promise<CompressedImage>;
