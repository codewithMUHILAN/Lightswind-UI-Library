import * as React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { RenderProps } from '../core';
export interface CanvasProps extends Omit<RenderProps<HTMLCanvasElement>, 'size' | 'dpr'>, ViewProps {
    children?: React.ReactNode;
    style?: ViewStyle;
}
export interface Props extends CanvasProps {
}
/**
 * A native canvas which accepts threejs elements as children.
 * @see https://docs.pmnd.rs/react-three-fiber/api/canvas
 */
export declare const Canvas: React.ForwardRefExoticComponent<Props & React.RefAttributes<View>>;
