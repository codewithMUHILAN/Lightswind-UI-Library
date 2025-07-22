import { ForwardRefComponent } from '../helpers/ts-utils';
import * as React from 'react';
import Stats from 'stats-gl';
type StatsOptions = ConstructorParameters<typeof Stats>[0];
type Props = Partial<StatsOptions> & {
    id?: string;
    clearStatsGlStyle?: boolean;
    showPanel?: number;
    className?: string;
    parent?: React.RefObject<HTMLElement>;
    ref?: React.RefObject<HTMLElement>;
};
export declare const StatsGl: ForwardRefComponent<Props, HTMLDivElement>;
export {};
