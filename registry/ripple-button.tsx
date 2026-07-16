import React from "react";

interface RippleButtonProps {
  text?: string;
  bgColor?: string;
  circleColor?: string;
  width?: string;  // e.g., "200px" or "100%"
  height?: string; // e.g., "50px"
}

const RippleButton: React.FC<RippleButtonProps> = ({
  text = "Click Me",
  bgColor,
  circleColor,
  width,
  height,
}) => {
  // Use a default circle color if none is provided
  const defaultCircleColor = circleColor || "#173eff";

  return (
    <>
      <button
        className={`ripple-btn bg-gray-500 !text-black  `}
        style={{
          backgroundColor: bgColor,
          width: width,
          height: height,
        }}
      >
        <span className="circle1"></span>
        <span className="circle2"></span>
        <span className="circle3"></span>
        <span className="circle4"></span>
        <span className="circle5"></span>
        <span className="text">{text}</span>
      </button>

      {/* The styled-jsx block, which requires the @types/styled-jsx package */}
      <style jsx>{`
        .ripple-btn {
          font-family: Arial, Helvetica, sans-serif;
          font-weight: bold;
          padding: 1em 2em;
          border: none;
          border-radius: 0.6rem;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          /* Ensure text color is set by props if background is set */
          color: ${bgColor ? 'white' : 'inherit'};
        }

        /* Target all circle spans */
        .ripple-btn span:not(:nth-child(6)) {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          height: 30px;
          width: 30px;
          /* Use the prop value for background color */
          background-color: ${defaultCircleColor};
          border-radius: 50%;
          transition: 0.6s ease;
          pointer-events: none;
        }

        .ripple-btn span:nth-child(6) {
          position: relative;
          z-index: 1;
        }

        /* Initial offset positioning for the circles */
        .ripple-btn span:nth-child(1) {
          transform: translate(-3.3em, -4em);
        }

        .ripple-btn span:nth-child(2) {
          transform: translate(-6em, 1.3em);
        }

        .ripple-btn span:nth-child(3) {
          transform: translate(-0.2em, 1.8em);
        }

        .ripple-btn span:nth-child(4) {
          transform: translate(3.5em, 1.4em);
        }

        .ripple-btn span:nth-child(5) {
          transform: translate(3.5em, -3.8em);
        }

        /* Hover effect: Scale circles up to create the ripple illusion */
        .ripple-btn:hover span:not(:nth-child(6)) {
          transform: translate(-50%, -50%) scale(4);
          transition: 1.5s ease;
        }
      `}</style>
    </>
  );
};

export default RippleButton;