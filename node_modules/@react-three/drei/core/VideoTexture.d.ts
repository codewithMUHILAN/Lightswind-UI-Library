import * as React from 'react';
import * as THREE from 'three';
import { type default as Hls } from 'hls.js';
declare function getHls(...args: ConstructorParameters<typeof Hls>): Promise<Hls | null>;
export declare function useVideoTexture(srcOrSrcObject: HTMLVideoElement['src' | 'srcObject'], { unsuspend, start, hls: hlsConfig, crossOrigin, muted, loop, playsInline, onVideoFrame, ...videoProps }?: {
    unsuspend?: keyof HTMLVideoElementEventMap;
    start?: boolean;
    hls?: Parameters<typeof getHls>[0];
    onVideoFrame?: VideoFrameRequestCallback;
} & Partial<Omit<HTMLVideoElement, 'children' | 'src' | 'srcObject'>>): THREE.VideoTexture;
type UseVideoTextureParams = Parameters<typeof useVideoTexture>;
type VideoTexture = ReturnType<typeof useVideoTexture>;
export type VideoTextureProps = {
    children?: (texture: VideoTexture) => React.ReactNode;
    src: UseVideoTextureParams[0];
} & UseVideoTextureParams[1];
export declare const VideoTexture: React.ForwardRefExoticComponent<{
    children?: (texture: VideoTexture) => React.ReactNode;
    src: UseVideoTextureParams[0];
} & {
    unsuspend?: keyof HTMLVideoElementEventMap;
    start?: boolean;
    hls?: Parameters<typeof getHls>[0];
    onVideoFrame?: VideoFrameRequestCallback;
} & Partial<Omit<HTMLVideoElement, "children" | "src" | "srcObject">> & React.RefAttributes<THREE.VideoTexture>>;
export {};
