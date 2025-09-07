import React from "react";
import { cn } from "../lib/utils";

interface BentoCardData {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
  background?: React.ReactNode;
}

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cards: BentoCardData[];
  columns?: number;
  rowHeight?: string;
}

export const BentoGrid = ({
  cards,
  columns = 3,
  rowHeight = "auto",
  className,
  ...props
}: BentoGridProps) => {
  return (
    <div
      className={cn(
        `grid w-full gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} bg-background`,
        className
      )}
      {...props}
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={cn(
              "relative overflow-hidden rounded-2xl p-5 flex flex-col justify-end",
              "h-[15rem]",
              "bg-white/40 dark:bg-white/5 backdrop-blur-lg",
              "border border-black/10 dark:border-white/10",
              "shadow-inner shadow-black/10 dark:shadow-white/10",
              "text-black dark:text-white",
              "group transition-all duration-300 ease-in-out",
              card.className
            )}
          >
            {card.background && (
              <div className="absolute inset-0 z-0">{card.background}</div>
            )}

            {/* Hover-revealed content */}
            <div className="relative z-10 w-full">
              <div
                className={cn(
                  "flex flex-col justify-end h-full",
                  "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0",
                  "transition-all duration-300 ease-out"
                )}
              >
                <Icon className="h-5 w-5 text-current mb-2" />
                <h3 className="text-base font-semibold">{card.title}</h3>
                <p className="text-sm text-muted-foreground dark:text-white/60">
                  {card.description}
                </p>
              </div>
            </div>

            {/* Hover overlay effect */}
            <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-black/5 dark:group-hover:bg-white/5 rounded-2xl" />
          </div>
        );
      })}
    </div>
  );
};
