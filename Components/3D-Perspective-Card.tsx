"use client";

import React, { useRef, useEffect, CSSProperties } from "react";

interface ThreeDPerspectiveCardProps {
  /** The URL for the background image of the card. */
  image: string;
  /** Optional width of the card (e.g., "300px"). Defaults to "300px". */
  width?: string;
  /** Optional height of the card (e.g., "350px"). Defaults to "350px". */
  height?: string;
}

const ThreeDPerspectiveCard: React.FC<ThreeDPerspectiveCardProps> = ({
  image,
  width = "300px",
  height = "350px",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !shineRef.current || !shadowRef.current) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!cardRef.current || !shineRef.current || !shadowRef.current) {
        return;
      }

      const wHeight = window.innerHeight;
      const wWidth = window.innerWidth;

      const currentMousePos = { x: event.pageX, y: event.pageY };
      const mouseFromCenter = {
        x: currentMousePos.x - wWidth / 2,
        y: currentMousePos.y - wHeight / 2,
      };

      const maxRotation = 10;
      const mouseXRatio = (currentMousePos.x / wWidth) * 2 - 1;
      const mouseYRatio = (currentMousePos.y / wHeight) * 2 - 1;

      const rotateXDeg = -1 * (mouseYRatio * maxRotation);
      const rotateYDeg = mouseXRatio * maxRotation;

      const maxTranslate = 20;
      const transX = mouseXRatio * maxTranslate;
      const transY = mouseYRatio * maxTranslate;

      const dy = event.pageY - wHeight / 2;
      const dx = event.pageX - wWidth / 2;
      const theta = Math.atan2(dy, dx);
      const angle = (theta * 180) / Math.PI - 90;

      const backgroundPositionX = (currentMousePos.x / wWidth) * 100;
      const backgroundPositionY = (currentMousePos.y / wHeight) * 50;

      shineRef.current.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${
        (currentMousePos.y / wHeight) * 0.7
      }) 0%, rgba(255,255,255, 0) 80%)`;

      cardRef.current.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(1) rotateX(${rotateXDeg}deg) rotateY(${rotateYDeg}deg)`;
      cardRef.current.style.backgroundPosition = `${backgroundPositionX}% ${backgroundPositionY}%`;

      shadowRef.current.style.transform = `scale(.9,.9) translateX(${
        mouseFromCenter.x * -0.02 + 12
      }px) translateY(${mouseFromCenter.y * -0.02 + 12}px) rotateY(${
        (mouseFromCenter.x / 25) * 0.5
      }deg) rotateX(${mouseFromCenter.y / -25}deg)`;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // --- Inline style objects ---
  const containerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
    position: "relative",
    width: "100%",
    padding: "40px",
  };

  const wrapStyle: CSSProperties = {
    perspective: "1000px",
    position: "relative",
    width,
    height,
  };

  const sharedCardStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    transition: "transform 0.15s ease-out, background-position 0.15s ease-out",
    willChange: "transform",
  };

  const shadowStyle: CSSProperties = {
    ...sharedCardStyle,
    background: "rgba(0, 0, 0, 0.5)",
    filter: "blur(25px)",
    opacity: 0.8,
    zIndex: 1,
    transform: "scale(0.9) translateY(10px)",
  };

  const cardStyle: CSSProperties = {
    ...sharedCardStyle,
    background: "#fff 50% 50%",
    zIndex: 2,
    backgroundImage: `url(${image})`,
    backgroundSize: "450%",
  };

  const cardFrontStyle: CSSProperties = {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    width: "100%",
    height: "100%",
    position: "relative",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const cardShineStyle: CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    zIndex: 10,
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 60%)",
  };

  return (
    <div style={containerStyle}>
      <div style={wrapStyle}>
        <div ref={shadowRef} style={shadowStyle} />
        <div ref={cardRef} style={cardStyle}>
          <div style={cardFrontStyle}>
            <div ref={shineRef} style={cardShineStyle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDPerspectiveCard;
