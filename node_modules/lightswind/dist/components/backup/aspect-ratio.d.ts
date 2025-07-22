import * as React from "react";
interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The aspect ratio to maintain (width/height) */
    ratio?: number;
    /** Predefined aspect ratios for common use cases */
    preset?: "square" | "video" | "portrait" | "widescreen" | "ultrawide" | "golden";
    /** Whether to apply rounded corners */
    rounded?: boolean;
    /** Whether to show a border */
    bordered?: boolean;
    /** Optional object-fit style for child elements */
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}
declare const AspectRatio: React.ForwardRefExoticComponent<AspectRatioProps & React.RefAttributes<HTMLDivElement>>;
export { AspectRatio };
