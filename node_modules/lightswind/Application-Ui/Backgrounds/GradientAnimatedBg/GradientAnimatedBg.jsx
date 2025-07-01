import React from "react";

const GradientAnimatedBg = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Blur Container */}
      <div
        className="absolute inset-0 grid"
        style={{ filter: "blur(12vw)" }}
      >
        {/* First Shape */}
        <div
          className="absolute inset-0 mx-auto"
          style={{
            clipPath:
              "polygon(50.9% 37.2%, 43.5% 34.7%, 33.6% 26.1%, 39.2% 10.8%, 26.2% 0.0%, 4.8% 6.4%, 0.0% 30.4%, 20.7% 37.2%, 33.4% 26.3%, 43.2% 34.9%, 45.0% 35.6%, 43.6% 46.4%, 37.8% 59.5%, 21.8% 63.2%, 11.7% 76.1%, 22.9% 91.3%, 47.4% 91.3%, 54.0% 79.0%, 38.0% 59.6%, 43.9% 46.4%, 45.2% 35.5%, 50.9% 37.6%, 56.1% 36.8%, 59.8% 47.6%, 70.3% 61.9%, 87.7% 56.0%, 96.4% 37.4%, 88.6% 15.1%, 63.7% 16.7%, 55.2% 33.6%, 55.9% 36.6%, 50.9% 37.2%)",
            background: "linear-gradient(hotpink, red, orange, yellow, hotpink)",
            animation: "GradientAnimatedBgTurn 8000ms linear infinite",
            opacity: 0.66,
          }}
        ></div>

        {/* Second Shape */}
        <div
          className="absolute inset-0 mx-auto"
          style={{
            clipPath:
              "polygon(50.9% 37.2%, 43.5% 34.7%, 33.6% 26.1%, 39.2% 10.8%, 26.2% 0.0%, 4.8% 6.4%, 0.0% 30.4%, 20.7% 37.2%, 33.4% 26.3%, 43.2% 34.9%, 45.0% 35.6%, 43.6% 46.4%, 37.8% 59.5%, 21.8% 63.2%, 11.7% 76.1%, 22.9% 91.3%, 47.4% 91.3%, 54.0% 79.0%, 38.0% 59.6%, 43.9% 46.4%, 45.2% 35.5%, 50.9% 37.6%, 56.1% 36.8%, 59.8% 47.6%, 70.3% 61.9%, 87.7% 56.0%, 96.4% 37.4%, 88.6% 15.1%, 63.7% 16.7%, 55.2% 33.6%, 55.9% 36.6%, 50.9% 37.2%)",
            background: "linear-gradient(cyan, blue, green, purple, cyan)",
            animation: "GradientAnimatedBgTurn 6000ms linear infinite",
            transform: "rotate(180deg)",
          }}
        ></div>
      </div>

      {/* Keyframe Animation in JSX */}
      <style>{`
        @keyframes GradientAnimatedBgTurn {
          to {
            transform: rotate(1turn);
          }
        }
      `}</style>
    </div>
  );
};

export default GradientAnimatedBg;
