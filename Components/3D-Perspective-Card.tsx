"use client";

import React, { useRef, useEffect } from "react";

interface ThreeDPerspectiveCardProps {
  image: string;
  width?: string;
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
    const handleMouseMove = (event: MouseEvent) => {
      if (
        !cardRef.current ||
        !shineRef.current ||
        !shadowRef.current
      )
        return;

      const wHeight = window.innerHeight;
      const wWidth = window.innerWidth;

      const currentMousePos = { x: event.pageX, y: event.pageY };
      const mouseFromCenter = {
        x: currentMousePos.x - wWidth / 2,
        y: currentMousePos.y - wHeight / 2,
      };

      const around1 =
        -1 * (((currentMousePos.y * 100) / wHeight) * 0.2 - 10) + "deg";
      const around2 = ((currentMousePos.x * 100) / wWidth) * 0.2 - 10 + "deg";
      const trans1 = ((currentMousePos.x * 100) / wHeight) * 0.3 + "px";
      const trans2 = ((currentMousePos.y * 100) / wHeight) * 0.3 + "px";
      const dy = event.pageY - wHeight / 2;
      const dx = event.pageX - wWidth / 2;
      const theta = Math.atan2(dy, dx);
      const angle = (theta * 180) / Math.PI - 90;
      const mousePositionX = (currentMousePos.x / wWidth) * 100;

      shineRef.current.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${
        (currentMousePos.y / wHeight) * 0.7
      }) 0%, rgba(255,255,255, 0) 80%)`;

      cardRef.current.style.transform = `translate3d(${trans1}, ${trans2}, 0) scale(1) rotateX(${around1}) rotateY(${around2})`;
      cardRef.current.style.backgroundPosition = `${mousePositionX}% ${(currentMousePos.y / wHeight) * 50}%`;

      shadowRef.current.style.transform = `scale(.9,.9) translateX(${
        mouseFromCenter.x * -0.02 + 12
      }px) translateY(${mouseFromCenter.y * -0.02 + 12}px) rotateY(${
        (mouseFromCenter.x / 25) * 0.5
      }deg) rotateX(${mouseFromCenter.y / -25}deg)`;

  };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
            backgroundSize: "450%",
          }}
        >
          <div className="card-front">
            <div className="card-shine" ref={shineRef}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .parent-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: auto;
          position: relative;
          width: 100%;
        }

        .wrap {
          perspective: 600px;
          width: fit-content;
        }

        .card-shadow,
        .card {
          position: relative;
          border-radius: 10px;
          margin: 0 auto;
          left: 0;
          right: 0;
        }

        .card {
          background: #fff 50% 50%;
        }

        .card-front {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          width: 100%;
          height: 100%;
          position: relative;
        }

        .card-title {
          color: #fff;
          position: absolute;
          text-shadow: 0 5px 8px rgba(0, 0, 0, 0.65);
          width: 80%;
          bottom: 100px;
          font-weight: 700;
        }

        .card-shine {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          z-index: -1;
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
