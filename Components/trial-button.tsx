import React from "react";

export interface TrialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The text to display inside the button.
   */
  children: React.ReactNode;

  /**
   * The color used for the animated trail / border gradient.
   * Example: "#4f46e5" or "blue"
   */
  trailColor?: string;

  /**
   * The color used for the inner blur/glow animation.
   * Example: "#60a5fa" or "aqua"
   */
  blurColor?: string;
}

/**
 * A reusable button component with a shiny, animated gradient effect.
 * Supports dynamic trail and blur colors.
 */
export const TrialButton: React.FC<TrialButtonProps> = ({
  children,
  trailColor = "blue",
  blurColor = "#8484ff",
  ...props
}) => {
  return (
    <>
      <style>
        {`
        @import url("https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,500&display=swap");

        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @property --gradient-angle-offset {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @property --gradient-percent {
          syntax: "<percentage>";
          initial-value: 5%;
          inherits: false;
        }
        @property --gradient-shine {
          syntax: "<color>";
          initial-value: white;
          inherits: false;
        }

        .shiny-custom-styles {
          --animation: gradient-angle linear infinite;
          --duration: 3s;
          --shadow-size: 2px;
          --trail-color: var(--user-trail-color, blue);
          --blur-color: var(--user-blur-color, #8484ff);

          border: 1px solid transparent;
          background: conic-gradient(
              from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
              transparent,
              var(--trail-color) var(--gradient-percent),
              var(--gradient-shine) calc(var(--gradient-percent) * 2),
              var(--trail-color) calc(var(--gradient-percent) * 3),
              transparent calc(var(--gradient-percent) * 4)
            )
            border-box;
          box-shadow: inset 0 0 0 1px #1a1818;

          transition: --gradient-angle-offset 800ms cubic-bezier(0.25, 1, 0.5, 1),
                      --gradient-percent 800ms cubic-bezier(0.25, 1, 0.5, 1),
                      --gradient-shine 800ms cubic-bezier(0.25, 1, 0.5, 1);
          animation: var(--animation) var(--duration);
          animation-composition: add;
        }

        .shiny-custom-styles::before,
        .shiny-custom-styles::after,
        .shiny-custom-styles span::before {
          content: "";
          pointer-events: none;
          position: absolute;
          inset-inline-start: 50%;
          inset-block-start: 50%;
          translate: -50% -50%;
          z-index: -1;
        }

        .shiny-custom-styles::before {
          --size: calc(100% - var(--shadow-size) * 3);
          --position: 2px;
          --space: calc(var(--position) * 2);
          width: var(--size);
          height: var(--size);
          background: radial-gradient(
              circle at var(--position) var(--position),
              white calc(var(--position) / 4),
              transparent 0
            )
            padding-box;
          background-size: var(--space) var(--space);
          background-repeat: space;
          mask-image: conic-gradient(
            from calc(var(--gradient-angle) + 45deg),
            black,
            transparent 10% 90%,
            black
          );
          border-radius: inherit;
          opacity: 0.8;
          z-index: -1;
          animation: var(--animation) var(--duration);
          animation-composition: add;
        }

        .shiny-custom-styles::after {
          --animation: shimmer linear infinite;
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(-50deg, transparent, var(--trail-color), transparent);
          mask-image: radial-gradient(circle at bottom, transparent 40%, black);
          opacity: 0.6;
          animation: var(--animation) var(--duration),
                    var(--animation) calc(var(--duration) / 0.4) reverse paused;
          animation-composition: add;
        }

        .shiny-custom-styles span {
          z-index: 1;
        }

        .shiny-custom-styles span::before {
          --size: calc(100% + 1rem);
          width: var(--size);
          height: var(--size);
          box-shadow: inset 0 -1ex 2rem 4px var(--blur-color);
          opacity: 0;
          transition: opacity 800ms cubic-bezier(0.25, 1, 0.5, 1);
          animation: calc(var(--duration) * 1.5) breathe linear infinite;
        }

        .shiny-custom-styles:is(:hover, :focus-visible) {
          --gradient-percent: 20%;
          --gradient-angle-offset: 95deg;
          --gradient-shine: var(--blur-color);
          animation-play-state: running;
        }

        .shiny-custom-styles:is(:hover, :focus-visible)::before,
        .shiny-custom-styles:is(:hover, :focus-visible)::after {
          animation-play-state: running;
        }

        .shiny-custom-styles:is(:hover, :focus-visible) span::before {
          opacity: 1;
        }

        @keyframes gradient-angle {
          to {
            --gradient-angle: 360deg;
          }
        }

        @keyframes shimmer {
          to {
            rotate: 360deg;
          }
        }

        @keyframes breathe {
          from, to {
            scale: 1;
          }
          50% {
            scale: 1.2;
          }
        }
      `}
      </style>

      <button
        className="backdrop-blur-md !font-bold shiny-custom-styles isolate relative overflow-hidden cursor-pointer outline-offset-4 py-[0.75rem] px-[1.25rem] text-base leading-tight !rounded-full text-black dark:text-white bg-white dark:bg-black active:translate-y-px flex items-center justify-center"
        style={
          {
            "--user-trail-color": trailColor,
            "--user-blur-color": blurColor,
          } as React.CSSProperties
        }
        {...props}
      >
        <span>{children}</span>
      </button>
    </>
  );
};
