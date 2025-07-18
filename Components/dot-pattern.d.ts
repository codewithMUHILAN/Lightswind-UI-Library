interface DotPatternProps {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    cx?: number;
    cy?: number;
    cr?: number;
    className?: string;
    [key: string]: any;
}
export declare function DotPattern({ width, height, x, y, cx, cy, cr, className, ...props }: DotPatternProps): import("react/jsx-runtime").JSX.Element;
export default DotPattern;
