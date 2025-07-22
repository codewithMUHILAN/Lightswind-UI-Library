import { Texture } from 'three';
import { Vector3 } from '@react-three/fiber';
import * as THREE from 'three';
export type Size = {
    w: number;
    h: number;
};
export type FrameData = {
    frame: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    scaleRatio?: number;
    rotated: boolean;
    trimmed: boolean;
    spriteSourceSize: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    sourceSize: Size;
};
export type MetaData = {
    version: string;
    size: {
        w: number;
        h: number;
    };
    rows: number;
    columns: number;
    frameWidth: number;
    frameHeight: number;
    scale: string;
};
type Frames = Record<string, FrameData[]> | FrameData[];
export type SpriteData = {
    frames: Frames;
    meta: MetaData;
};
export declare const getFirstFrame: (frames: SpriteData["frames"], frameName?: string) => FrameData;
export declare const checkIfFrameIsEmpty: (frameData: Uint8ClampedArray) => boolean;
export declare function useSpriteLoader<Url extends string>(input: Url | null, json?: string | null, animationNames?: string[] | null, numberOfFrames?: number | null, onLoad?: (texture: Texture, textureData?: SpriteData | null) => void, canvasRenderingContext2DSettings?: CanvasRenderingContext2DSettings): {
    spriteObj: {
        spriteTexture: THREE.Texture;
        spriteData: SpriteData | null;
        aspect: Vector3;
    } | null;
    loadJsonAndTexture: (textureUrl: string, jsonUrl?: string) => void;
};
export declare namespace useSpriteLoader {
    var preload: (url: string) => undefined;
    var clear: (input: string) => void;
}
export {};
