export interface Carousel3DItem {
    id: number;
    title: string;
    brand: string;
    description: string;
    tags: string[];
    imageUrl: string;
    link: string;
}
interface Carousel3DProps {
    items: Carousel3DItem[];
    autoRotate?: boolean;
    rotateInterval?: number;
    cardHeight?: number;
    title?: string;
    subtitle?: string;
    tagline?: string;
    isMobileSwipe?: boolean;
}
declare const Carousel3D: ({ items, autoRotate, rotateInterval, cardHeight, title, subtitle, tagline, isMobileSwipe, }: Carousel3DProps) => import("react/jsx-runtime").JSX.Element;
export default Carousel3D;
