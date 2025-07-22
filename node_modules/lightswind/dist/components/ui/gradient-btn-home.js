"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
export function GradientButton({ children, size = "md", className = "", gradientColors = [
    "#ff6d1b",
    "#ffee55",
    "#5bff89",
    "#4d8aff",
    "#6b5fff",
    "#ff64f9",
    "#ff6565",
], animationSpeed = 2, glowEffect = true, glowSize = 4, variant = "default", ...props }) {
    // Generate gradient string from colors
    const gradientString = gradientColors.join(", ");
    // Size classes mapping
    const sizeClasses = {
        sm: "text-sm px-4 py-2 rounded-lg",
        md: "text-base px-6 py-2 rounded-lg",
        lg: "text-lg px-8 py-3 rounded-lg",
        xl: "text-2xl px-10 py-4 rounded-lg",
    };
    // Border styles based on variant
    const borderStyles = {
        default: "border-transparent",
        outline: "border-current",
        ghost: "border-transparent bg-opacity-10",
    };
    // Define the button's background, including the inner fill and the border gradient
    const buttonBackground = variant === "ghost"
        ? `linear-gradient(90deg, ${gradientString})` // Ghost variant uses only the gradient
        : `linear-gradient(#121213, #121213), linear-gradient(#121213 50%, rgba(18, 18, 19, 0.6) 80%, rgba(18, 18, 19, 0)), linear-gradient(90deg, ${gradientString})`;
    return (_jsxs(_Fragment, { children: [_jsx("style", { dangerouslySetInnerHTML: {
                    __html: `
            .btn-gradient::before {
              content: "";
              height: 30%;
              width: 60%;
              position: relative;
              bottom: -20%;
              z-index: 0;
              background-size: 200%;
              animation: gradient-animate ${animationSpeed}s infinite linear;
              filter: blur(calc(${glowSize} * 0.2rem));
              border-radius: 0.5rem; /* Equivalent to rounded-lg */
              ${!glowEffect ? 'display: none;' : ''} /* Conditionally hide glow based on prop */
            }

            .btn-gradient:hover,
            .btn-gradient:hover::before {
              animation: gradient-animate ${animationSpeed / 4}s infinite linear;
            }

            @keyframes gradient-animate {
              0% {
                background-position: 0;
              }
              100% {
                background-position: 200%;
              }
            }

            .btn-gradient {
              animation: gradient-animate ${animationSpeed}s infinite linear;
            }

            /* Media query for responsiveness */
            @media screen and (max-width: 1000px) {
              .btn-gradient {
                font-size: 2rem;
                padding: 1rem 2rem;
                border-radius: 0.5rem; /* Equivalent to rounded-lg */
              }
              .btn-gradient::before {
                 filter: blur(calc(${glowSize} * 0.1rem));
                 border-radius: 0.5rem; /* Equivalent to rounded-lg */
                 ${!glowEffect ? 'display: none;' : ''} /* Conditionally hide glow based on prop */
              }
            }
          `,
                } }), _jsx("button", { className: `
          btn-gradient relative bg-black dark:bg-white text-white dark:text-black
          flex items-center rounded-xl
          justify-center
          border-[0.15rem] Z-20 ${borderStyles[variant]} ${sizeClasses[size]}
          ${className}
        `, style: {
                    background: buttonBackground,
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box, border-box",
                    backgroundSize: "200%",
                    borderRadius: "0.5rem", // Equivalent to Tailwind's rounded-lg
                }, ...props, children: children })] }));
}
export default GradientButton;
