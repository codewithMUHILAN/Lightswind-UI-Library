import * as THREE from 'three';
import * as React from 'react';
import { RefObject } from 'react';
import type { FaceLandmarkerResult } from '@mediapipe/tasks-vision';
import { VideoTextureProps } from '../core/VideoTexture';
import { FacemeshApi, FacemeshProps } from './Facemesh';
export type FaceControlsProps = {
    camera?: THREE.Camera;
    videoTexture?: VideoTextureProps;
    manualDetect?: boolean;
    faceLandmarkerResult?: FaceLandmarkerResult;
    manualUpdate?: boolean;
    makeDefault?: boolean;
    smoothTime?: number;
    offset?: boolean;
    offsetScalar?: number;
    eyes?: boolean;
    eyesAsOrigin?: boolean;
    depth?: number;
    debug?: boolean;
    facemesh?: FacemeshProps;
};
export type FaceControlsApi = THREE.EventDispatcher & {
    computeTarget: () => THREE.Object3D;
    update: (delta: number, target?: THREE.Object3D) => void;
    facemeshApiRef: RefObject<FacemeshApi>;
};
export declare const FaceControls: React.ForwardRefExoticComponent<FaceControlsProps & React.RefAttributes<FaceControlsApi>>;
export declare const useFaceControls: () => FaceControlsApi;
