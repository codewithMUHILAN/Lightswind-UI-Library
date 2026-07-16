"use client";
import React, { useState } from "react";
import { cn } from "@/components/lib/utils";

export interface FocusCardType {
  title: string;
  src: string;
}

export const FocusCardsLayout = ({ cards }: { cards: FocusCardType[] }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4 md:px-8 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
};

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: FocusCardType;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => {
    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "rounded-xl sm:rounded-2xl relative bg-muted/40 overflow-hidden h-60 md:h-96 w-full transition-all duration-500 ease-out border border-border/20 shadow-sm",
          hovered !== null && hovered !== index && "blur-sm scale-[0.98] md:opacity-40"
        )}
      >
        <img
          src={card.src}
          alt={card.title}
          className="object-cover absolute inset-0 w-full h-full"
        />
        <div
          className={cn(
            "absolute inset-0 bg-black/50 flex items-end py-8 px-6 transition-opacity duration-300",
            hovered === index ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {card.title}
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "FocusCard";
