import { type PromiseWorkerType, type WorkerInterfaceImplementation } from './worker-types';
export * from './worker-types';
/**
 * Wraps a Regular worker into a `PromiseWorker`
 *
 * @param worker
 * @returns
 */
export declare const getPromiseWorker: (worker: Worker) => PromiseWorkerType;
/**
 * Returns an interface where methods of the worker can be called by the host site
 *
 * @example
 * // this assumes a vite-like bundler understands the `?worker` import
 * import GainMapWorker from '@monogrid/gainmap-js/worker?worker'
 * import { getPromiseWorker, getWorkerInterface } from '@monogrid/gainmap-js/worker-interface'
 *
 * // turn our Worker into a PromiseWorker
 * const promiseWorker = getPromiseWorker(new GainMapWorker())
 * // get the interface
 * const workerInterface = getWorkerInterface(promiseWorker)
 *
 * @param worker
 * @returns
 */
export declare const getWorkerInterface: (worker: PromiseWorkerType) => WorkerInterfaceImplementation;
