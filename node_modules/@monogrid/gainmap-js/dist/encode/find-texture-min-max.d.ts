import { DataTexture, WebGLRenderer } from 'three';
import { EXR } from 'three/examples/jsm/loaders/EXRLoader';
import { RGBE } from 'three/examples/jsm/loaders/RGBELoader';
/**
 *
 * @category Utility
 * @group Utility
 *
 * @param image
 * @param mode
 * @param renderer
 * @returns
 */
export declare const findTextureMinMax: (image: EXR | RGBE | DataTexture, mode?: "min" | "max", renderer?: WebGLRenderer) => number[];
