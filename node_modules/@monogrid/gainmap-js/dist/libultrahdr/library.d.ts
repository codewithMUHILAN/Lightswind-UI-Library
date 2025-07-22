import { MainModule } from '../../libultrahdr-wasm/build/libultrahdr';
/**
 * Instances the WASM module and returns it, only one module will be created upon multiple calls.
 * @category WASM
 * @group WASM
 *
 * @returns
 */
export declare const getLibrary: () => Promise<MainModule>;
