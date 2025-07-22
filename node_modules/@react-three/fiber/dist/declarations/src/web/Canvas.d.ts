import * as React from 'react';
import { Options as ResizeOptions } from 'react-use-measure';
import { RenderProps } from '../core';
export interface CanvasProps extends Omit<RenderProps<HTMLCanvasElement>, 'size'>, React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    /** Canvas fallback content, similar to img's alt prop */
    fallback?: React.ReactNode;
    /**
     * Options to pass to useMeasure.
     * @see https://github.com/pmndrs/react-use-measure#api
     */
    resize?: ResizeOptions;
    /** The target where events are being subscribed to, default: the div that wraps canvas */
    eventSource?: HTMLElement | React.MutableRefObject<HTMLElement>;
    /** The event prefix that is cast into canvas pointer x/y events, default: "offset" */
    eventPrefix?: 'offset' | 'client' | 'page' | 'layer' | 'screen';
}
export interface Props extends CanvasProps {
}
/**
 * A DOM canvas which accepts threejs elements as children.
 * @see https://docs.pmnd.rs/react-three-fiber/api/canvas
 */
export declare const Canvas: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLCanvasElement>>;
