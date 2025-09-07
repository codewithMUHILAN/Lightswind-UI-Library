"use client";

import React from "react";

type OrbitCardProps = {
  children: React.ReactNode;
  className?: string;
};

const OrbitCard: React.FC<OrbitCardProps> = ({ children, className }) => {
  return (
    <div className={`relative ${className} rounded-xl`}>
      {/* Glowing shadow background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center rounded-xl bg-background">
        <div className="absolute h-full w-full animate-orbit-glow rounded-xl">
          <div className="h-full w-full rounded-xl bg-transparent shadow-[0_0_30px_10px_rgba(59,130,246,0.5)]"></div>
        </div>
      </div>

      {/* Card Content */}
      <div className="relative z-10 rounded-xl bg-background p-6 ">
        {children}
      </div>

      {/* Keyframes for glowing effect */}
      <style jsx>{`
        @keyframes orbit-glow {
          0% {
            transform: scale(1);
            box-shadow: 0 0 30px 10px rgba(59, 130, 246, 0.5);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 40px 20px rgba(59, 130, 246, 0.3);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 30px 10px rgba(59, 130, 246, 0.5);
          }
        }
        .animate-orbit-glow {
          animation: orbit-glow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default OrbitCard;
