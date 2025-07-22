export type MPFExtractorOptions = {
    debug: boolean;
    extractFII: boolean;
    extractNonFII: boolean;
};
/**
 * MPF Extractor (Multi Picture Format Extractor)
 * By Henrik S Nilsson 2019
 *
 * Extracts images stored in images based on the MPF format (found here: https://www.cipa.jp/e/std/std-sec.html
 * under "CIPA DC-007-Translation-2021 Multi-Picture Format"
 *
 * Overly commented, and without intention of being complete or production ready.
 * Created to extract depth maps from iPhone images, and to learn about image metadata.
 * Kudos to: Phil Harvey (exiftool), Jaume Sanchez (android-lens-blur-depth-extractor)
 */
export declare class MPFExtractor {
    options: MPFExtractorOptions;
    constructor(options?: Partial<MPFExtractorOptions>);
    extract(imageArrayBuffer: Uint8Array): Promise<Blob[]>;
}
