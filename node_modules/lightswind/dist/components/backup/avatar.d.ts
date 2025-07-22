import * as React from "react";
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback?: React.ReactNode;
    status?: "online" | "offline" | "away" | "busy" | null;
}
declare const Avatar: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLDivElement>>;
interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
}
declare const AvatarImage: React.ForwardRefExoticComponent<AvatarImageProps & React.RefAttributes<HTMLImageElement>>;
interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const AvatarFallback: React.ForwardRefExoticComponent<AvatarFallbackProps & React.RefAttributes<HTMLDivElement>>;
export { Avatar, AvatarImage, AvatarFallback };
