import React from "react";
export interface CarouselCard {
    id: string;
    category: string;
    title: string;
    icon: React.ReactNode;
    preview: string;
    content: string;
    imageUrl?: string;
}
interface Carousel3DProps {
    cards: CarouselCard[];
    cardWidth?: number;
    cardHeight?: number;
    radius?: number;
    autoRotate?: boolean;
    autoRotateInterval?: number;
    pauseOnHover?: boolean;
    enableGlitchEffect?: boolean;
    enableGlowEffect?: boolean;
    showControls?: boolean;
    showThemeToggle?: boolean;
    dragSensitivity?: number;
    transitionDuration?: number;
    className?: string;
    onCardClick?: (card: CarouselCard, index: number) => void;
    onCardFlip?: (card: CarouselCard, index: number, isFlipped: boolean) => void;
    onRotate?: (currentIndex: number) => void;
}
declare const Carousel3D: React.FC<Carousel3DProps>;
export default Carousel3D;
