export interface CardProps {
    title: string;
    description: string;
    imageSrc: string;
    buttonText: string;
    buttonLink?: string;
    imageAlt?: string;
    accentColor?: string;
    onClick?: () => void;
}
interface InteractiveCardGalleryProps {
    cards: CardProps[];
    className?: string;
    cardHeight?: string;
    columns?: 1 | 2 | 3 | 4;
    hoverScale?: number;
    transitionDuration?: number;
}
export declare function InteractiveCardGallery({ cards, className, cardHeight, columns, hoverScale, transitionDuration, }: InteractiveCardGalleryProps): import("react/jsx-runtime").JSX.Element;
export {};
