import React, { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

// Define the props for the reusable component.
interface SparkleNavbarProps {
  /**
   * An array of strings representing the navigation menu items.
   * Each string will be the text for a button.
   * @example ['Home', 'About', 'Contact']
   */
  items: string[];
  /**
   * The color for the active state text shadow, box shadow, and other effects.
   * @example '#1E90FF' (a shade of blue)
   */
  color?: string;
}

/**
 * A reusable navigation menu component with a dynamic, animated active state indicator.
 * All CSS and animation logic are self-contained within this single TSX file.
 *
 * @param {SparkleNavbarProps} props - The component props.
 * @returns {JSX.Element} The rendered navigation menu.
 */
const SparkleNavbar: React.FC<SparkleNavbarProps> = ({
  items,
  color = "#00fffc",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs to get direct access to DOM elements for animations.
  const navRef = useRef<HTMLDivElement>(null);
  const activeElementRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Function to create the SVG content for the active element.
  const createSVG = (element: HTMLDivElement) => {
    element.innerHTML = `
   
    `;
  };

  // Helper function to calculate the horizontal offset for the active element.
  const getOffsetLeft = (element: HTMLButtonElement) => {
    if (!navRef.current || !activeElementRef.current) return 0;
    const elementRect = element.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();
    const activeElementWidth = activeElementRef.current.offsetWidth;
    return (
      elementRect.left -
      navRect.left +
      (elementRect.width - activeElementWidth) / 2
    );
  };

  // useLayoutEffect runs synchronously after all DOM mutations, ensuring the
  // initial position of the active element is correct before the first paint.
  useLayoutEffect(() => {
    const activeButton = buttonRefs.current[activeIndex];
    if (navRef.current && activeElementRef.current && activeButton) {
      gsap.set(activeElementRef.current, {
        x: getOffsetLeft(activeButton),
      });
      gsap.to(activeElementRef.current, {
        "--active-element-show": "1",
        duration: 0.2,
      });
    }
  }, []);

  // Handler for button clicks, which triggers the animation.
  const handleClick = (index: number) => {
    const navElement = navRef.current;
    const activeElement = activeElementRef.current;
    const oldButton = buttonRefs.current[activeIndex];
    const newButton = buttonRefs.current[index];

    if (
      index === activeIndex ||
      !navElement ||
      !activeElement ||
      !oldButton ||
      !newButton
    ) {
      return;
    }

    const x = getOffsetLeft(newButton);
    const direction = index > activeIndex ? "after" : "before";
    const spacing = Math.abs(x - getOffsetLeft(oldButton));

    navElement.classList.add(direction);

    gsap.set(activeElement, {
      rotateY: direction === "before" ? "180deg" : "0deg",
    });

    gsap.to(activeElement, {
      keyframes: [
        {
          "--active-element-width": `${spacing > navElement.offsetWidth - 60 ? navElement.offsetWidth - 60 : spacing}px`,
          duration: 0.3,
          ease: "none",
          onStart: () => {
            createSVG(activeElement);
            gsap.to(activeElement, {
              "--active-element-opacity": 1,
              duration: 0.1,
            });
          },
        },
        {
          "--active-element-scale-x": "0",
          "--active-element-scale-y": ".25",
          "--active-element-width": "0px",
          duration: 0.3,
          onStart: () => {
            gsap.to(activeElement, {
              "--active-element-mask-position": "40%",
              duration: 0.5,
            });
            gsap.to(activeElement, {
              "--active-element-opacity": 0,
              delay: 0.45,
              duration: 0.25,
            });
          },
          onComplete: () => {
            activeElement.innerHTML = "";
            navElement.classList.remove("before", "after");
            gsap.set(activeElement, {
              x: getOffsetLeft(newButton),
              "--active-element-show": "1",
            });
            // Update the state after the animation completes to trigger a re-render
            // with the new active item.
            setActiveIndex(index);
          },
        },
      ],
    });

    gsap.to(activeElement, {
      x,
      "--active-element-strike-x": "-50%",
      duration: 0.6,
      ease: "none",
    });
  };

  return (
    <>
      <style>{`
        .navigation-menu {
          margin: 20px 0px;
          position: relative;
          z-index: 1;
        }

        .navigation-menu ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          gap: 40px;
        }

        .navigation-menu ul li button {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          border: none;
          cursor: pointer;
          background-color: transparent;
          padding: 0;
          margin: 0;
          list-style: 22px;
          color: #fff;
          transition: color 0.25s;
        }

        .navigation-menu ul li:not(.active):hover button {
          text-shadow: 0 0 10px ${color}, 0 0 20px ${color};
        }

        .navigation-menu .active-element {
          --active-element-scale-x: 1;
          --active-element-scale-y: 1;
          --active-element-show: 0;
          --active-element-opacity: 0;
          --active-element-width: 0px;
          --active-element-strike-x: 0%;
          --active-element-mask-position: 0%;
          position: absolute;
          left: 0;
          top: 34px;
          height: 3px;
          width: 36px;
          border-radius: 2px;
          background-color: #fff;
          opacity: var(--active-element-show);
        }

        .navigation-menu .active-element > svg,
        .navigation-menu .active-element .strike {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          opacity: var(--active-element-opacity);
          width: var(--active-element-width);
          mix-blend-mode: multiply;
        }

        .navigation-menu .active-element > svg {
          display: block;
          overflow: visible;
          height: 5px;
          filter: blur(0.5px) drop-shadow(2px 0px 8px ${color}40) drop-shadow(1px 0px 2px ${color}80) drop-shadow(0px 0px 3px ${color}40) drop-shadow(2px 0px 8px ${color}45) drop-shadow(8px 0px 16px ${color}50);
        }

        .navigation-menu .active-element .strike {
          padding: 24px 0;
          -webkit-mask-image: linear-gradient(to right, transparent calc(0% + var(--active-element-mask-position)), black calc(15% + var(--active-element-mask-position)), black 80%, transparent);
          mask-image: linear-gradient(to right, transparent calc(0% + var(--active-element-mask-position)), black calc(15% + var(--active-element-mask-position)), black 80%, transparent);
        }

        .navigation-menu .active-element .strike svg {
          display: block;
          overflow: visible;
          height: 12px;
          width: calc(var(--active-element-width) * 2);
          transform: translate(var(--active-element-strike-x), 30%) scale(var(--active-element-scale-x), var(--active-element-scale-y));
        }

        .navigation-menu .active-element .strike svg:last-child {
          transform: translate(var(--active-element-strike-x), -30%) scale(-1);
        }

        .navigation-menu .active-element .strike svg g path:nth-child(2) {
          filter: blur(2px);
        }

        .navigation-menu .active-element .strike svg g path:nth-child(3) {
          filter: blur(4px);
        }

        .navigation-menu.before .active-element {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* The main container for the component, replicating the body styles. */}

      <nav className="navigation-menu" ref={navRef}>
        <ul>
          {items.map((item, index) => (
            <li key={item} className={index === activeIndex ? "active" : ""}>
              <button
                ref={(el) => (buttonRefs.current[index] = el)}
                onClick={() => handleClick(index)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
        <div className="active-element" ref={activeElementRef} />
      </nav>
    </>
  );
};

export default SparkleNavbar;
