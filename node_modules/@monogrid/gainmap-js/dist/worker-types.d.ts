import { CompressedImage, type CompressParameters } from './encode/types';
export type WorkerInterface = {
    compress: {
        request: {
            type: 'compress';
            payload: CompressParameters;
        };
        result: Awaited<CompressedImage> & {
            source: Uint8ClampedArray;
        };
    };
};
/**
 * Transferable
 */
export type Transferable = ArrayBufferLike | ImageBitmap;
export type WorkerInterfaceImplementation = {
    [k in keyof WorkerInterface]: (payload: WorkerInterface[k]['request']['payload']) => Promise<WorkerInterface[k]['result']>;
};
export type WorkerRequest = WorkerInterface[keyof WorkerInterface]['request'];
export type WithTransferListFunction = <T>(payload: T, transferList: Transferable[]) => T;
export type PromiseWorkerType = {
    postMessage: (message: any, transferables?: Transferable[]) => Promise<any>;
};
