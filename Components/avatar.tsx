
import * as React from "react";
import { cn } from "../lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  status?: "online" | "offline" | "away" | "busy" | null;
}

const DEFAULT_AVATAR = `https://robohash.org/${Math.random().toString(36).substring(7)}.png`;


const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, status, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          "transition-all duration-300 ease-in-out hover:scale-105",
          className
        )}
        {...props}
      />
    );
  }
);

Avatar.displayName = "Avatar";

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, onError, onLoad, ...props }, ref) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [imgError, setImgError] = React.useState(false);

    const finalSrc = src && !imgError ? src : DEFAULT_AVATAR;

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.log("AvatarImage error occurred, using fallback");
      setImgError(true);
      if (onError) onError(e);
    };

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setIsLoaded(true);
      if (onLoad) onLoad(e);
    };

    return (
      <img
        ref={ref}
        src={finalSrc}
        alt={alt || "Avatar"}
        className={cn(
          "aspect-square h-full w-full object-cover",
          "transition-opacity duration-300 ease-in-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        "animate-in fade-in-0 zoom-in-0 duration-300",
        className
      )}
      {...props}
    />
  )
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
