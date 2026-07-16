import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/components/lib/utils";
import { CountUp } from "./count-up";
import Image from "next/image";
import Link from "next/link";

interface TrustedUsersProps {
  avatars: string[];
  rating?: number;
  totalUsersText?: number;
  caption?: string;
  className?: string;
  starColorClass?: string;
  ringColors?: string[];
}

export const TrustedUsers: React.FC<TrustedUsersProps> = ({
  avatars,
  rating = 5,
  totalUsersText = 1000, // ✅ default as number
  caption = "Trusted by",
  className = "",
  starColorClass = "text-yellow-400",
  ringColors = [],
}) => {
  return (
    <div
      className={cn(
        `flex items-center justify-center gap-6 bg-transparent
          text-foreground py-4 px-4`,
        className
      )}
    >
      <div className="flex -space-x-4">
        {avatars.map((src, i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full overflow-hidden ring-1 ring-offset-2 ring-offset-black ${ringColors[i] || "ring-blue-900"
              }`}
          >
            <Image
              src={src}
              alt={`Avatar ${i + 1}`}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start gap-1">
        <div className={`flex gap-1 ${starColorClass}`}>
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} fill="currentColor" className="w-4 h-4" aria-hidden="true" />
          ))}
        </div>
        <div className="text-foreground text-xs md:text-md font-medium flex items-center flex-wrap">
          {caption}
          <CountUp
            value={totalUsersText}
            duration={2}
            separator=","
            className="ml-1 text-lg"
            suffix="+"
            colorScheme="gradient"
          />
          <Link href="/pricing" className="underline text-primarylw dark:text-greedy ml-1">
            Pro users
          </Link>
        </div>
      </div>
    </div>
  );
};
