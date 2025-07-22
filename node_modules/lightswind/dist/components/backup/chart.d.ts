import * as React from "react";
import * as RechartsPrimitive from "recharts";
declare const THEMES: {
    readonly light: "";
    readonly dark: ".dark";
};
export type ChartConfig = {
    [k in string]: {
        label?: React.ReactNode;
        icon?: React.ComponentType;
    } & ({
        color?: string;
        theme?: never;
    } | {
        color?: never;
        theme: Record<keyof typeof THEMES, string>;
    });
};
declare const ChartContainer: React.ForwardRefExoticComponent<Omit<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ChartStyle: ({ id, config }: {
    id: string;
    config: ChartConfig;
}) => import("react/jsx-runtime").JSX.Element | null;
declare const ChartTooltip: typeof RechartsPrimitive.Tooltip;
declare const ChartTooltipContent: React.ForwardRefExoticComponent<Omit<RechartsPrimitive.DefaultTooltipContentProps<import("recharts/types/component/DefaultTooltipContent").ValueType, import("recharts/types/component/DefaultTooltipContent").NameType> & {
    accessibilityLayer?: boolean;
    active?: boolean | undefined;
    includeHidden?: boolean | undefined;
    allowEscapeViewBox?: import("recharts/types/util/types").AllowInDimension;
    animationDuration?: import("recharts/types/util/types").AnimationDuration;
    animationEasing?: import("recharts/types/util/types").AnimationTiming;
    content?: import("recharts/types/component/Tooltip").ContentType<import("recharts/types/component/DefaultTooltipContent").ValueType, import("recharts/types/component/DefaultTooltipContent").NameType> | undefined;
    coordinate?: Partial<import("recharts/types/util/types").Coordinate>;
    cursor?: boolean | React.ReactElement | React.SVGProps<SVGElement>;
    filterNull?: boolean;
    defaultIndex?: number;
    isAnimationActive?: boolean;
    offset?: number;
    payloadUniqBy?: import("recharts/types/util/payload/getUniqPayload").UniqueOption<import("recharts/types/component/DefaultTooltipContent").Payload<import("recharts/types/component/DefaultTooltipContent").ValueType, import("recharts/types/component/DefaultTooltipContent").NameType>> | undefined;
    position?: Partial<import("recharts/types/util/types").Coordinate>;
    reverseDirection?: import("recharts/types/util/types").AllowInDimension;
    shared?: boolean;
    trigger?: "hover" | "click";
    useTranslate3d?: boolean;
    viewBox?: import("recharts/types/util/types").CartesianViewBox;
    wrapperStyle?: React.CSSProperties;
} & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
}, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ChartLegend: typeof RechartsPrimitive.Legend;
declare const ChartLegendContent: React.ForwardRefExoticComponent<Omit<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & Pick<RechartsPrimitive.LegendProps, "verticalAlign" | "payload"> & {
    hideIcon?: boolean;
    nameKey?: string;
}, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle, };
