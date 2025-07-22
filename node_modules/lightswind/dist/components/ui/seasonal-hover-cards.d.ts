export interface SeasonCardProps {
    title: string;
    subtitle: string;
    description: string;
    imageSrc: string;
    imageAlt?: string;
    className?: string;
}
interface SeasonalHoverCardsProps {
    cards: SeasonCardProps[];
    className?: string;
}
export declare function SeasonalHoverCards({ cards, className, }: SeasonalHoverCardsProps): import("react/jsx-runtime").JSX.Element;
export {};
