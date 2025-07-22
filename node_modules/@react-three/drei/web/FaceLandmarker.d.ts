import * as React from 'react';
import { ReactNode } from 'react';
import type { FaceLandmarker as FaceLandmarkerImpl, FaceLandmarkerOptions } from '@mediapipe/tasks-vision';
type FaceLandmarkerProps = {
    basePath?: string;
    options?: FaceLandmarkerOptions;
    children?: ReactNode;
};
export declare const FaceLandmarkerDefaults: {
    basePath: string;
    options: FaceLandmarkerOptions;
};
export declare const FaceLandmarker: React.ForwardRefExoticComponent<FaceLandmarkerProps & React.RefAttributes<FaceLandmarkerImpl>>;
export declare function useFaceLandmarker(): FaceLandmarkerImpl | undefined;
export {};
