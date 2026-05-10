// @ts-nocheck
"use client";
import { cn } from "../lib/utils";
import { createRef, ReactNode, useRef } from "react";

interface MouseTrailProps {
  imageSources: string[];
  content?: ReactNode;
  containerClassName?: string;
  imageClassName?: string;
  triggerDistance?: number;
  maxTrailImages?: number;
  useFadeEffect?: boolean;
}

export default function ImageTrailEffect({
  imageSources,
  content,
  containerClassName,
  maxTrailImages = 5,
  imageClassName = "w-40 h-48",
  triggerDistance = 20,
  useFadeEffect = false,
}: MouseTrailProps) {
  const wrapperRef = useRef(null);
  const imageRefs = useRef(
    imageSources.map(() => createRef<HTMLImageElement>())
  );
  const zIndexCounterRef = useRef(1);

  let imageIndex = 0;
  let lastPosition = { x: 0, y: 0 };

  const activateImage = (img: HTMLImageElement, x: number, y: number) => {
    const containerBounds = wrapperRef.current?.getBoundingClientRect();
    const relativeX = x - containerBounds.left;
    const relativeY = y - containerBounds.top;

    img.style.left = `${relativeX}px`;
    img.style.top = `${relativeY}px`;

    if (zIndexCounterRef.current > 40) {
      zIndexCounterRef.current = 1;
    }

    img.style.zIndex = String(zIndexCounterRef.current++);
    img.dataset.status = "active";

    if (useFadeEffect) {
      setTimeout(() => {
        img.dataset.status = "inactive";
      }, 1500);
    }

    lastPosition = { x, y };
  };

  const calculateDistance = (x: number, y: number) => {
    return Math.hypot(x - lastPosition.x, y - lastPosition.y);
  };

  const deactivateImage = (img: HTMLImageElement) => {
    img.dataset.status = "inactive";
  };

  const handleMouseMove = (e: MouseEvent | Touch) => {
    if (
      calculateDistance(e.clientX, e.clientY) >
      window.innerWidth / triggerDistance
    ) {
      const leadImage =
        imageRefs.current[imageIndex % imageRefs.current.length]?.current;
      const tailImage =
        imageRefs.current[
          (imageIndex - maxTrailImages) % imageRefs.current.length
        ]?.current;

      if (leadImage) activateImage(leadImage, e.clientX, e.clientY);
      if (tailImage) deactivateImage(tailImage);

      imageIndex++;
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onTouchMove={(e) => handleMouseMove(e.touches[0])}
      ref={wrapperRef}
      className={cn(
        `grid place-content-center h-[600px] w-full bg-background  text-foreground
        relative overflow-hidden rounded-lg`,
        containerClassName
      )}
    >
      {imageSources.map((src, i) => (
        <img
          key={i}
          ref={imageRefs.current[i]}
          src={src}
          alt={`trail-${i}`}
          data-index={i}
          data-status="inactive"
          className={cn(
            "object-cover scale-0 opacity:0 data-[status='active']:scale-100 data-[status='active']:opacity-100 transition-transform data-[status='active']:duration-500 duration-300 data-[status='active']:ease-out-expo absolute -translate-y-[50%] -translate-x-[50%]",
            imageClassName
          )}
        />
      ))}
      {content}
    </section>
  );
}
