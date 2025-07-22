import { Root } from './renderer';
import { RootState } from './store';
import { _XRFrame } from './utils';
export declare type GlobalRenderCallback = (timeStamp: number) => void;
/**
 * Adds a global render callback which is called each frame.
 * @see https://docs.pmnd.rs/react-three-fiber/api/additional-exports#addEffect
 */
export declare const addEffect: (callback: GlobalRenderCallback) => () => void;
/**
 * Adds a global after-render callback which is called each frame.
 * @see https://docs.pmnd.rs/react-three-fiber/api/additional-exports#addAfterEffect
 */
export declare const addAfterEffect: (callback: GlobalRenderCallback) => () => void;
/**
 * Adds a global callback which is called when rendering stops.
 * @see https://docs.pmnd.rs/react-three-fiber/api/additional-exports#addTail
 */
export declare const addTail: (callback: GlobalRenderCallback) => () => void;
export declare type GlobalEffectType = 'before' | 'after' | 'tail';
export declare function flushGlobalEffects(type: GlobalEffectType, timestamp: number): void;
export declare type Invalidate = (state?: RootState, frames?: number) => void;
export declare type Advance = (timestamp: number, runGlobalEffects?: boolean, state?: RootState, frame?: _XRFrame) => void;
interface Loop {
    loop: (timestamp: number) => void;
    /**
     * Invalidates the view, requesting a frame to be rendered. Will globally invalidate unless passed a root's state.
     * @see https://docs.pmnd.rs/react-three-fiber/api/additional-exports#invalidate
     */
    invalidate: Invalidate;
    /**
     * Advances the frameloop and runs render effects, useful for when manually rendering via `frameloop="never"`.
     * @see https://docs.pmnd.rs/react-three-fiber/api/additional-exports#advance
     */
    advance: Advance;
}
export declare function createLoop<TCanvas>(roots: Map<TCanvas, Root>): Loop;
export {};
