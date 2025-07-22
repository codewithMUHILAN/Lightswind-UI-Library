import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
const DEFAULT_AVATAR = `https://robohash.org/${Math.random().toString(36).substring(7)}.png`;
const Avatar = React.forwardRef(({ className, src, alt, fallback, status, ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", "transition-all duration-300 ease-in-out hover:scale-105", className), ...props }));
});
Avatar.displayName = "Avatar";
const AvatarImage = React.forwardRef(({ className, src, alt, onError, onLoad, ...props }, ref) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [imgError, setImgError] = React.useState(false);
    const finalSrc = src && !imgError ? src : DEFAULT_AVATAR;
    const handleError = (e) => {
        console.log("AvatarImage error occurred, using fallback");
        setImgError(true);
        if (onError)
            onError(e);
    };
    const handleLoad = (e) => {
        setIsLoaded(true);
        if (onLoad)
            onLoad(e);
    };
    return (_jsx("img", { ref: ref, src: finalSrc, alt: alt || "Avatar", className: cn("aspect-square h-full w-full object-cover", "transition-opacity duration-300 ease-in-out", isLoaded ? "opacity-100" : "opacity-0", className), onError: handleError, onLoad: handleLoad, ...props }));
});
AvatarImage.displayName = "AvatarImage";
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", "animate-in fade-in-0 zoom-in-0 duration-300", className), ...props })));
AvatarFallback.displayName = "AvatarFallback";
export { Avatar, AvatarImage, AvatarFallback };
