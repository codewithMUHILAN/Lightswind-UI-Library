import * as React from "react";
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Makes the card have a hover effect */
    hoverable?: boolean;
    /** Makes the card have a bordered appearance */
    bordered?: boolean;
    /** Renders the card with compact padding */
    compact?: boolean;
}
declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Adjusts the spacing in the header */
    spacing?: "default" | "compact" | "relaxed";
}
declare const CardHeader: React.ForwardRefExoticComponent<CardHeaderProps & React.RefAttributes<HTMLDivElement>>;
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    /** HTML heading level to use */
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    /** Adjusts the text size */
    size?: "sm" | "default" | "lg";
}
declare const CardTitle: React.ForwardRefExoticComponent<CardTitleProps & React.RefAttributes<HTMLParagraphElement>>;
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    /** Makes text smaller or larger */
    size?: "xs" | "sm" | "default";
}
declare const CardDescription: React.ForwardRefExoticComponent<CardDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Removes the top padding when used after CardHeader */
    removeTopPadding?: boolean;
    /** Adjusts content padding */
    padding?: "none" | "sm" | "default" | "lg";
}
declare const CardContent: React.ForwardRefExoticComponent<CardContentProps & React.RefAttributes<HTMLDivElement>>;
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Changes the alignment of footer items */
    align?: "start" | "center" | "end" | "between" | "around";
    /** Changes the direction of footer items */
    direction?: "row" | "column";
}
declare const CardFooter: React.ForwardRefExoticComponent<CardFooterProps & React.RefAttributes<HTMLDivElement>>;
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
