import React from "react";

// Include the CSS animations as a string inside the component
const AuroraEffect = () => {
  return (
    <div className="min-w-full min-h-screen bg-black flex items-center justify-center overflow-hidden text-white font-sans">
      <div className="text-center">
        <h1 className="text-[clamp(3rem,8vw,7rem)] font-extrabold tracking-tight relative overflow-hidden">
          Beautiful
          <div className="absolute inset-0 z-10 mix-blend-darken pointer-events-none">
            <div
              className="absolute w-[60vw] h-[60vw] bg-cyan-400 rounded-[37%_29%_27%_27%/28%_25%_41%_37%] filter blur-[1rem] mix-blend-overlay animate-[aurora-border_6s_ease-in-out_infinite,aurora-1_5s_ease-in-out_infinite_alternate]"
              style={{ animationName: "aurora-border, aurora-1" }}
            ></div>
            <div
              className="absolute w-[60vw] h-[60vw] bg-yellow-400 rounded-[37%_29%_27%_27%/28%_25%_41%_37%] filter blur-[1rem] mix-blend-overlay animate-[aurora-border_6s_ease-in-out_infinite,aurora-2_5s_ease-in-out_infinite_alternate]"
              style={{ animationName: "aurora-border, aurora-2" }}
            ></div>
            <div
              className="absolute w-[60vw] h-[60vw] bg-green-400 rounded-[37%_29%_27%_27%/28%_25%_41%_37%] filter blur-[1rem] mix-blend-overlay animate-[aurora-border_6s_ease-in-out_infinite,aurora-3_3s_ease-in-out_infinite_alternate]"
              style={{ animationName: "aurora-border, aurora-3" }}
            ></div>
            <div
              className="absolute w-[60vw] h-[60vw] bg-purple-500 rounded-[37%_29%_27%_27%/28%_25%_41%_37%] filter blur-[1rem] mix-blend-overlay animate-[aurora-border_6s_ease-in-out_infinite,aurora-4_13s_ease-in-out_infinite_alternate]"
              style={{ animationName: "aurora-border, aurora-4" }}
            ></div>
          </div>
        </h1>
      </div>
    </div>
  );
};

export default AuroraEffect;
