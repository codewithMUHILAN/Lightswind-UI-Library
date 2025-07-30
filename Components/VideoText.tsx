"use client";

import { cn } from "../lib/utils";
import React, { ElementType, ReactNode, useEffect, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion"; // Import HTMLMotionProps

export interface VideoTextProps {
  /**
   * The video source URL
   */
  src: string;
  /**
   * Additional className for the container
   */
  className?: string;
  /**
   * Whether to autoplay the video
   */
  autoPlay?: boolean;
  /**
   * Whether to mute the video
   */
  muted?: boolean;
  /**
   * Whether to loop the video
   */
  loop?: boolean;
  /**
   * Whether to preload the video
   */
  preload?: "auto" | "metadata" | "none";
  /**
   * The content to display (will have the video "inside" it)
   */
  children: ReactNode;
  /**
   * Font size for the text mask (in viewport width units)
   * @default 20
   */
  fontSize?: string | number;
  /**
   * Font weight for the text mask
   * @default "bold"
   */
  fontWeight?: string | number;
  /**
   * Text anchor for the text mask
   * @default "middle"
   */
  textAnchor?: string;
  /**
   * Dominant baseline for the text mask
   * @default "middle"
   */
  dominantBaseline?: string;
  /**
   * Font family for the text mask
   * @default "sans-serif"
   */
  fontFamily?: string;
  /**
   * The element type to render for the component container
   * @default "div"
   */
  as?: "div" | "span" | "section" | "article" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"; // Constrain 'as' to common HTML elements
  // Inherit Framer Motion props directly
}

export function VideoText({
  src,
  children,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  preload = "auto",
  fontSize = 20,
  fontWeight = "bold",
  textAnchor = "middle",
  dominantBaseline = "middle",
  fontFamily = "sans-serif",
  as: Component = "div",
  ...motionProps // Collect all other props as motionProps
}: VideoTextProps & HTMLMotionProps<"div">) { // Extend with HTMLMotionProps<"div"> for type safety
  const [svgMask, setSvgMask] = useState("");
  const content = React.Children.toArray(children).join("");

  useEffect(() => {
    const responsiveFontSize =
      typeof fontSize === "number" ? `${fontSize}vw` : fontSize;

    const newSvgMask = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
      <text x='50%' y='50%'
            font-size='${responsiveFontSize}'
            font-weight='${fontWeight}'
            text-anchor='${textAnchor}'
            dominant-baseline='${dominantBaseline}'
            font-family='${fontFamily}'
            fill='black'>${content}</text>
    </svg>`;
    setSvgMask(newSvgMask);
  }, [content, fontSize, fontWeight, textAnchor, dominantBaseline, fontFamily]);

  // Create a Motion component from the provided 'as' prop
  // If 'Component' is not a valid key of 'motion', it will default to 'motion.div'
  const MotionComponent = motion[Component as keyof typeof motion] || motion.div;

  if (!svgMask) {
    return (
      <MotionComponent
        className={cn("relative size-full", className)}
        {...motionProps} // Spread collected motion props
      >
        <span className="sr-only">{content}</span>
      </MotionComponent>
    );
  }

  const dataUrlMask = `url("data:image/svg+xml,${encodeURIComponent(svgMask)}")`;

  return (
    <MotionComponent
      className={cn("relative overflow-hidden", className)}
      {...motionProps} // Spread collected motion props
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          maskImage: dataUrlMask,
          WebkitMaskImage: dataUrlMask,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          opacity: 1,
        }}
      >
        <video
          className="w-full h-full object-cover"
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          playsInline
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <span className="sr-only">{content}</span>
    </MotionComponent>
  );
}