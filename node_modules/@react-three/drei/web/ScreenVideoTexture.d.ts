import * as React from 'react';
import * as THREE from 'three';
import { VideoTextureProps } from '../core/VideoTexture';
export type ScreenVideoTextureProps = Omit<VideoTextureProps, 'src'> & {
    options?: DisplayMediaStreamOptions;
};
export declare const ScreenVideoTexture: React.ForwardRefExoticComponent<Omit<{
    children?: (texture: THREE.VideoTexture) => React.ReactNode;
    src: string | MediaProvider | null;
} & {
    unsuspend?: keyof HTMLVideoElementEventMap;
    start?: boolean;
    hls?: Parameters<(userConfig?: Partial<import("hls.js").HlsConfig> | undefined) => Promise<import("hls.js").default | null>>[0];
    onVideoFrame?: VideoFrameRequestCallback;
} & Partial<Omit<HTMLVideoElement, "children" | "src" | "srcObject">>, "src"> & {
    options?: DisplayMediaStreamOptions;
} & React.RefAttributes<THREE.VideoTexture>>;
