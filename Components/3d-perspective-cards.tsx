"use client";

import React, { useRef, useEffect } from "react";

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
    // This is an optimization: the mouse move listener should only be
    // added if the client is ready and references exist.
    if (!cardRef.current || !shineRef.current || !shadowRef.current) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      // Get window dimensions
      const wHeight = window.innerHeight;
      const wWidth = window.innerWidth;

      const currentMousePos = { x: event.pageX, y: event.pageY };
      const mouseFromCenter = {
        x: currentMousePos.x - wWidth / 2,
        y: currentMousePos.y - wHeight / 2,
      };

      // 1. Calculate Rotation for Card (3D Perspective)
      const maxRotation = 10; // Max rotation angle in degrees
      const mouseXRatio = (currentMousePos.x / wWidth) * 2 - 1; // Range from -1 to 1
      const mouseYRatio = (currentMousePos.y / wHeight) * 2 - 1; // Range from -1 to 1

      // around1 (RotateX) is inversely proportional to mouse Y
      const rotateXDeg = -1 * (mouseYRatio * maxRotation);
      // around2 (RotateY) is proportional to mouse X
      const rotateYDeg = mouseXRatio * maxRotation;

      // 2. Calculate Translation for Floating Effect
      const maxTranslate = 20; // Max translation in pixels
      const transX = mouseXRatio * maxTranslate;
      const transY = mouseYRatio * maxTranslate;

      // 3. Calculate Shine Angle (for linear-gradient)
      const dy = event.pageY - wHeight / 2;
      const dx = event.pageX - wWidth / 2;
      // Math.atan2 gives angle in radians, convert to degrees, and adjust
      const theta = Math.atan2(dy, dx);
      const angle = (theta * 180) / Math.PI - 90;

      // 4. Calculate Background Position (Parallax Effect)
      const backgroundPositionX = (currentMousePos.x / wWidth) * 100; // 0% to 100%
      const backgroundPositionY = (currentMousePos.y / wHeight) * 50; // 0% to 50%

      // Apply styles to Shine
      shineRef.current!.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${
        (currentMousePos.y / wHeight) * 0.7 // Intensity based on Y position
      }) 0%, rgba(255,255,255, 0) 80%)`;

      // Apply styles to Card (3D Rotation, Float, and Parallax)
      cardRef.current!.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(1) rotateX(${rotateXDeg}deg) rotateY(${rotateYDeg}deg)`;
      cardRef.current!.style.backgroundPosition = `${backgroundPositionX}% ${backgroundPositionY}%`;

      // Apply styles to Shadow
      // This creates a subtle opposite movement and rotation for a deeper shadow effect
      shadowRef.current!.style.transform = `scale(.9,.9) translateX(${
        mouseFromCenter.x * -0.02 + 12
      }px) translateY(${mouseFromCenter.y * -0.02 + 12}px) rotateY(${
        (mouseFromCenter.x / 25) * 0.5
      }deg) rotateX(${mouseFromCenter.y / -25}deg)`;
    };

    // Attach listener to the whole document
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // The rendering logic remains the same
  return (
    <div className="parent-container">
      <div className="wrap">
        <div className="card-shadow" ref={shadowRef}></div>
        <div
          className="card"
          ref={cardRef}
          style={{
            width,
            height,
            backgroundImage: `url(${image})`,
            // Background size is large to allow for parallax scrolling effect
            backgroundSize: "450%", 
          }}
        >
          <div className="card-front">
            <div className="card-shine" ref={shineRef}></div>
          </div>
        </div>
      </div>

      {/* The styled-jsx block (THIS IS WHERE THE TS ERROR OCCURRED) */}
      <style jsx>{`
        .parent-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh; /* Changed to 100vh for demonstration */
          position: relative;
          width: 100%;
        }

        .wrap {
          /* Defines the 3D space depth for children */
          perspective: 1000px; 
          width: fit-content;
        }

        .card-shadow,
        .card {
          position: absolute; /* Changed to absolute to stack shadow and card */
          border-radius: 10px;
          margin: 0 auto;
          /* Add a slight transition for smoother movement */
          transition: transform 0.15s ease-out, background-position 0.15s ease-out;
          will-change: transform, background-position;
        }

        .card {
          /* Initial position for the card */
          background: #fff 50% 50%;
          z-index: 2;
        }
        
        .card-shadow {
          /* Initial position for the shadow */
          background: rgba(0, 0, 0, 0.5); 
          filter: blur(25px);
          opacity: 0.8;
          width: 95%; /* Make shadow slightly smaller than card */
          height: 95%;
          z-index: 1;
          /* Match initial card dimensions */
          top: 2.5%; 
          left: 2.5%;
          /* Also needs a transition for smooth movement */
          transition: transform 0.15s ease-out;
          will-change: transform;
        }

        .card-front {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          width: 100%;
          height: 100%;
          position: relative;
          /* Adds a border for visual depth */
          border: 1px solid rgba(255, 255, 255, 0.2); 
        }

        .card-shine {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          z-index: 10; /* Bring the shine layer above the card background */
          /* Initial shine gradient */
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 60%
          );
        }
      `}</style>
    </div>
  );
};

export default ThreeDPerspectiveCard;
