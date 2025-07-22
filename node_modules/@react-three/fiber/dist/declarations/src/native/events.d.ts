import { UseBoundStore } from 'zustand';
import { RootState } from '../core/store';
import { EventManager } from '../core/events';
/** Default R3F event manager for react-native */
export declare function createTouchEvents(store: UseBoundStore<RootState>): EventManager<HTMLElement>;
