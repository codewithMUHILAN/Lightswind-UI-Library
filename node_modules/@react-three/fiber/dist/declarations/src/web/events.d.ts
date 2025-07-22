import { UseBoundStore } from 'zustand';
import { RootState } from '../core/store';
import { EventManager } from '../core/events';
/** Default R3F event manager for web */
export declare function createPointerEvents(store: UseBoundStore<RootState>): EventManager<HTMLElement>;
