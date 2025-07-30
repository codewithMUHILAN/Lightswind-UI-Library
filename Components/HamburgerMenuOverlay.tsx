"use client";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "../lib/utils";
import { Menu, X } from "lucide-react";

export interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface HamburgerMenuOverlayProps {
  /** Array of menu items */
  items: MenuItem[];
  /** Button position from top */
  buttonTop?: string;
  /** Button position from left */
  buttonLeft?: string;
  /** Button size */
  buttonSize?: "sm" | "md" | "lg";
  /** Button background color */
  buttonColor?: string;
  /** Overlay background color/gradient */
  overlayBackground?: string;
  /** Menu text color */
  textColor?: string;
  /** Menu font size */
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** Font family */
  fontFamily?: string;
  /** Font weight */
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Stagger delay between menu items */
  staggerDelay?: number;
  /** Menu items alignment */
  menuAlignment?: "left" | "center" | "right";
  /** Custom class for container */
  className?: string;
  /** Custom class for button */
  buttonClassName?: string;
  /** Custom class for menu items */
  menuItemClassName?: string;
  /** Disable overlay close on item click */
  keepOpenOnItemClick?: boolean;
  /** Custom button content */
  customButton?: React.ReactNode;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Callback when menu opens */
  onOpen?: () => void;
  /** Callback when menu closes */
  onClose?: () => void;
  /** Menu items layout direction */
  menuDirection?: "vertical" | "horizontal";
  /** Enable blur backdrop */
  enableBlur?: boolean;
  /** Z-index for overlay */
  zIndex?: number;
}

export const HamburgerMenuOverlay: React.FC<HamburgerMenuOverlayProps> = ({
  items = [],
  buttonTop = "60px",
  buttonLeft = "60px",
  buttonSize = "md",
  buttonColor = "#6c8cff",
  overlayBackground = "#6c8cff",
  textColor = "#ffffff",
  fontSize = "md",
  fontFamily = '"Krona One", monospace',
  fontWeight = "bold",
  animationDuration = 1.5,
  staggerDelay = 0.1,
  menuAlignment = "left",
  className,
  buttonClassName,
  menuItemClassName,
  keepOpenOnItemClick = false,
  customButton,
  ariaLabel = "Navigation menu",
  onOpen,
  onClose,
  menuDirection = "vertical",
  enableBlur = false,
  zIndex = 1000,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const buttonSizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const fontSizes = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-5xl md:text-6xl",
    "2xl": "text-6xl md:text-7xl",
  };

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }

    if (item.href && !item.onClick) {
      window.location.href = item.href;
    }

    if (!keepOpenOnItemClick) {
      setIsOpen(false);
      onClose?.();
    }
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className={cn("absolute w-full h-full", className)}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Krona+One:wght@400&display=swap');
          
          .hamburger-overlay-${zIndex} {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: start;
            align-items: center;
            background: ${overlayBackground};
            z-index: ${zIndex};
            clip-path: circle(0px at ${buttonLeft} ${buttonTop});
            transition: clip-path ${animationDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            ${enableBlur ? "backdrop-filter: blur(10px);" : ""}
          }
          
          .hamburger-overlay-${zIndex}.open {
            clip-path: circle(150% at ${buttonLeft} ${buttonTop});
          }
          
          .hamburger-button-${zIndex} {
            position: absolute;
            left: ${buttonLeft};
            top: ${buttonTop};
            transform: translate(-50%, -50%);
            border-radius: 20px;
            z-index: ${zIndex + 1};
            background: ${buttonColor};
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .hamburger-button-${zIndex}:hover {
            transform: translate(-50%, -50%) scale(1.1);
          }
          
          .hamburger-button-${zIndex}:focus {
            outline: 2px solid ${textColor};
            outline-offset: 2px;
          }
          
          .menu-items-${zIndex} {
            ${menuDirection === "horizontal" ? "display: flex; flex-wrap: wrap; gap: 1rem;" : ""}
            ${menuAlignment === "center" ? "text-align: center;" : ""}
            ${menuAlignment === "right" ? "text-align: right;" : ""}
          }
          
          .menu-item-${zIndex} {
            position: relative;
            list-style: none;
            padding: 0.5rem 0;
            cursor: pointer;
            transform: translateX(-200px);
            opacity: 0;
            transition: all 0.3s ease;
            font-family: ${fontFamily};
            font-weight: ${fontWeight};
            color: ${textColor};
            ${menuDirection === "horizontal" ? "display: inline-block; margin: 0 1rem;" : ""}
          }
          
          .menu-item-${zIndex}.visible {
            transform: translateX(0);
            opacity: 1;
          }
          
          .menu-item-${zIndex}::before {
            content: "";
            position: absolute;
            left: -20%;
            top: 50%;
            transform: translate(-50%, -50%) translateX(-50%);
            width: 25%;
            height: 8px;
            border-radius: 10px;
            background: ${textColor};
            opacity: 0;
            transition: all 0.25s ease;
            pointer-events: none;
          }
          
          .menu-item-${zIndex}:hover::before {
            opacity: 1;
            transform: translate(-50%, -50%) translateX(0);
          }
          
          .menu-item-${zIndex} span {
            opacity: 0.7;
            transition: opacity 0.25s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .menu-item-${zIndex}:hover span {
            opacity: 1;
          }
          
          .menu-item-${zIndex}:focus {
            outline: 2px solid ${textColor};
            outline-offset: 2px;
            border-radius: 4px;
          }
          
          /* Mobile responsiveness */
          @media (max-width: 768px) {
            .hamburger-button-${zIndex} {
              left: 30px;
              top: 30px;
            }
            
            .hamburger-overlay-${zIndex} {
              clip-path: circle(0px at 30px 30px);
            }
            
            .hamburger-overlay-${zIndex}.open {
              clip-path: circle(150% at 30px 30px);
            }
            
            .menu-items-${zIndex} {
              padding: 1rem;
              max-height: 80vh;
              overflow-y: auto;
            }
            
            .menu-item-${zIndex} {
              padding: 1rem 0;
            }
          }
          
          @media (max-width: 480px) {
            .menu-items-${zIndex} {
              ${menuDirection === "horizontal" ? "flex-direction: column; gap: 0;" : ""}
            }
            
            .menu-item-${zIndex} {
              ${menuDirection === "horizontal" ? "display: block; margin: 0;" : ""}
            }
          }
        `}
      </style>

      {/* Navigation Overlay */}
      <div
        ref={navRef}
        className={cn(`flex flex-col items-center justify-center h-full
           hamburger-overlay-${zIndex}`, isOpen && "open")}
        aria-hidden={!isOpen}
      >
        <ul
          className={cn(
            `mt-20 menu-items-${zIndex}`,
            menuDirection === "horizontal" && "flex flex-wrap "
          )}
        >
          {items.map((item, index) => (
            <li
              key={index}
              className={cn(
                `menu-item-${zIndex}`,
                fontSizes[fontSize],
                isOpen && "visible",
                menuItemClassName
              )}
              style={{
                transitionDelay: isOpen ? `${index * staggerDelay}s` : "0s",
              }}
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleItemClick(item);
                }
              }}
              tabIndex={isOpen ? 0 : -1}
              role="button"
              aria-label={`Navigate to ${item.label}`}
            >
              <span>
                {item.icon && <span className="menu-icon">{item.icon}</span>}
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hamburger Button */}
      <button
        className={cn(
          `hamburger-button-${zIndex}`,
          buttonSizes[buttonSize],
          buttonClassName
        )}
        onClick={toggleMenu}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls="navigation-menu"
      >
        {customButton || (
          <div className="relative w-full h-full flex items-center justify-center">
            <Menu
              className={cn(
                "absolute transition-all duration-300",
                isOpen
                  ? "opacity-0 rotate-45 scale-0"
                  : "opacity-100 rotate-0 scale-100"
              )}
              size={buttonSize === "sm" ? 16 : buttonSize === "md" ? 20 : 24}
              color={textColor}
            />
            <X
              className={cn(
                "absolute transition-all duration-300",
                isOpen
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-45 scale-0"
              )}
              size={buttonSize === "sm" ? 16 : buttonSize === "md" ? 20 : 24}
              color={textColor}
            />
          </div>
        )}
      </button>
    </div>
  );
};

export default HamburgerMenuOverlay;
