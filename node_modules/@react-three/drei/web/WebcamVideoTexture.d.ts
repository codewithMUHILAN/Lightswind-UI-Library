import * as React from 'react';
import * as THREE from 'three';
import { VideoTextureProps } from '../core/VideoTexture';
export type WebcamVideoTextureProps = Omit<VideoTextureProps, 'src'> & {
    constraints?: MediaStreamConstraints;
};
export declare const WebcamVideoTexture: React.ForwardRefExoticComponent<Omit<{
    children?: (texture: THREE.VideoTexture) => React.ReactNode;
    src: string | MediaProvider | null;
} & {
    unsuspend?: keyof HTMLVideoElementEventMap;
    start?: boolean;
    hls?: Parameters<(userConfig?: Partial<import("hls.js").HlsConfig> | undefined) => Promise<import("hls.js").default | null>>[0];
    onVideoFrame?: VideoFrameRequestCallback;
} & Partial<Omit<HTMLVideoElement, "children" | "src" | "srcObject">>, "src"> & {
    constraints?: MediaStreamConstraints;
} & React.RefAttributes<THREE.VideoTexture>>;
