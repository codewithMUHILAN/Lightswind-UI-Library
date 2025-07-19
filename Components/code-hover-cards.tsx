"use client";
import React, { useState, useRef } from 'react';
import { cn } from '../lib/utils';
import {
  Github,
  Code,
  Dices,
  Terminal,
  Settings,
  Heart,
  Star,
  Zap,
  Trophy,
  Shield,
} from 'lucide-react';

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
  theme?: 'normal' | 'dark'; // retained for fallback
}

const DEFAULT_CARDS: CardData[] = [
  { id: '1', icon: Github, title: 'GitHub', description: 'Code repository' },
  { id: '2', icon: Code, title: 'Code', description: 'Development tools' },
  { id: '3', icon: Dices, title: 'Games', description: 'Interactive projects' },
];

const DEFAULT_ICONS = [Github, Code, Dices, Terminal, Settings, Heart, Star, Zap, Trophy, Shield];

const CodeHoverCards: React.FC<CodeHoverCardsProps> = ({
  cards = DEFAULT_CARDS,
  className,
  cardClassName,
  maskRadius = 300,
  characterCount = 2000,
  characterSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  animationDuration = 0.5,
  borderRadius = 26,
  cardGap = '1rem',
  iconSize = 48,
  enableTouch = true,
  columns = 3,
  minHeight = 399,
  onCardClick,
  onCardHover,
  disabled = false,
  showBorder = true,
  theme = 'normal',
}) => {
  const [mousePositions, setMousePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [randomTexts, setRandomTexts] = useState<{ [key: string]: string }>({});
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const generateRandomString = (length: number): string => {
    return Array.from({ length }, () => characterSet[Math.floor(Math.random() * characterSet.length)]).join('');
  };

  const handleMouseMove = (e: React.MouseEvent, cardId: string) => {
    if (disabled) return;
    const card = cardRefs.current[cardId];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePositions(prev => ({ ...prev, [cardId]: { x, y } }));
    setRandomTexts(prev => ({ ...prev, [cardId]: generateRandomString(characterCount) }));
  };

  const handleTouchMove = (e: React.TouchEvent, cardId: string) => {
    if (disabled || !enableTouch) return;
    const card = cardRefs.current[cardId];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setMousePositions(prev => ({ ...prev, [cardId]: { x, y } }));
    setRandomTexts(prev => ({ ...prev, [cardId]: generateRandomString(characterCount) }));
  };

  const handleCardClick = (card: CardData) => {
    if (disabled) return;
    if (card.href) window.open(card.href, '_blank');
    onCardClick?.(card);
  };

  const handleCardHover = (card: CardData) => {
    if (disabled) return;
    onCardHover?.(card);
  };

  const getColumnClass = () => {
    const columnMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    };
    return columnMap[columns];
  };

  return (
    <div className={cn('w-full flex items-center justify-center px-0 py-4 bg-background text-foreground', className)}>
      <div className="container mx-auto">
        <div className={cn('grid', getColumnClass())} style={{ gap: cardGap }}>
          {cards.map((card) => {
            const IconComponent = card.icon;
            const position = mousePositions[card.id] || { x: 0, y: 0 };
            const randomText = randomTexts[card.id] || '';

            return (
              <div
                key={card.id}
                className={cn(
                  'group relative w-full',
                  disabled && 'pointer-events-none opacity-50',
                  cardClassName
                )}
              >
                <div
                  ref={(el) => { cardRefs.current[card.id] = el; }}
                  className={cn(
                    'relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-200',
                    'hover:scale-105 active:scale-95',
                    showBorder && 'border'
                  )}
                  style={{
                    borderRadius: borderRadius + 'px',
                    minHeight: minHeight + 'px',
                    aspectRatio: '1',
                  }}
                  onMouseMove={(e) => handleMouseMove(e, card.id)}
                  onTouchMove={enableTouch ? (e) => handleTouchMove(e, card.id) : undefined}
                  onClick={() => handleCardClick(card)}
                  onMouseEnter={() => handleCardHover(card)}
                >
                  {/* Icon */}
                  <div className="relative z-10 text-foreground">
                    <IconComponent
                      size={iconSize}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 pointer-events-none z-[5]" />

                  {/* Character background */}
                  <div
                    className="absolute inset-0 font-mono text-sm leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden break-all text-foreground"
                    style={{
                      WebkitMaskImage:
                        'radial-gradient(' +
                        maskRadius +
                        'px circle at ' +
                        position.x +
                        'px ' +
                        position.y +
                        'px, #000 20%, rgba(0, 0, 0, 0.25), transparent)',
                      maskImage:
                        'radial-gradient(' +
                        maskRadius +
                        'px circle at ' +
                        position.x +
                        'px ' +
                        position.y +
                        'px, #000 20%, rgba(0, 0, 0, 0.25), transparent)',
                      transform: 'scale(1.025)',
                      transitionDuration: animationDuration + 's',
                    }}
                  >
                    {randomText}
                  </div>
                </div>

                {/* Card info */}
                {(card.title || card.description) && (
                  <div className="mt-4 text-center">
                    {card.title && (
                      <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                    )}
                    {card.description && (
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CodeHoverCards;
