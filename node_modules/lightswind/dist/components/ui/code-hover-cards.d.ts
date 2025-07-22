import React from 'react';
export interface CardData {
    id: string;
    icon: React.ComponentType<any>;
    href?: string;
    title?: string;
    description?: string;
}
export interface CodeHoverCardsProps {
    cards?: CardData[];
    className?: string;
    cardClassName?: string;
    maskRadius?: number;
    characterCount?: number;
    characterSet?: string;
    animationDuration?: number;
    borderRadius?: number;
    cardGap?: string;
    iconSize?: number;
    enableTouch?: boolean;
    columns?: 1 | 2 | 3 | 4;
    minHeight?: number;
    onCardClick?: (card: CardData) => void;
    onCardHover?: (card: CardData) => void;
    disabled?: boolean;
    showBorder?: boolean;
    theme?: 'normal' | 'dark';
}
declare const CodeHoverCards: React.FC<CodeHoverCardsProps>;
export default CodeHoverCards;
