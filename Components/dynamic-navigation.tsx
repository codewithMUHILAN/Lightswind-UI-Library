import React, { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";

export interface DynamicNavigationProps {
  /** Navigation links */
  links: {
    id: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
  }[];
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Highlight color */
  highlightColor?: string;
  /** Glow effect intensity (0-10) */
  glowIntensity?: number;
  /** CSS class name */
  className?: string;
  /** Whether to show labels on mobile */
  showLabelsOnMobile?: boolean;
  /** Callback when a link is clicked */
  onLinkClick?: (id: string) => void;
  /** Initially active link ID */
  activeLink?: string;
  /** Enable ripple effect on click */
  enableRipple?: boolean;
}

export const DynamicNavigation = ({
  links,
  backgroundColor,
  textColor,
  highlightColor,
  glowIntensity = 5,
  className,
  showLabelsOnMobile = false,
  onLinkClick,
  activeLink,
  enableRipple = true,
}: DynamicNavigationProps) => {
  const navRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(
    activeLink || (links.length > 0 ? links[0].id : null)
  );

  // Directly define the default black and white theme styles
  const defaultThemeStyles = {
    bg: backgroundColor || "bg-background", // Use provided or default black
    border: "border",
    text: textColor || "text-foreground", // Use provided or default white
    highlight: highlightColor || "bg-foreground/10", // Use provided or default white/10
    glow: `shadow-[0_0_${glowIntensity}px_rgba(255,255,255,0.3)]`,
  };

  // Update highlight position based on active link
  const updateHighlightPosition = (id?: string) => {
    if (!navRef.current || !highlightRef.current) return;

    const linkElement = navRef.current.querySelector(
      `#nav-item-${id || active}`
    );
    if (!linkElement) return;

    const { left, width } = linkElement.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();

    highlightRef.current.style.transform = `translateX(${
      left - navRect.left
    }px)`;
    highlightRef.current.style.width = `${width}px`;
  };

  // Create ripple effect
  const createRipple = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!enableRipple) return;

    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${
      event.clientX - button.getBoundingClientRect().left - diameter / 2
    }px`;
    circle.style.top = `${
      event.clientY - button.getBoundingClientRect().top - diameter / 2
    }px`;
    circle.classList.add(
      "absolute",
      "bg-white",
      "rounded-full",
      "pointer-events-none",
      "opacity-30",
      "animate-ripple"
    );

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  };

  // Handle link click
  const handleLinkClick = (
    id: string,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (enableRipple) {
      createRipple(event);
    }
    setActive(id);
    if (onLinkClick) {
      onLinkClick(id);
    }
  };

  // Handle link hover
  const handleLinkHover = (id: string) => {
    if (!navRef.current || !highlightRef.current) return;
    updateHighlightPosition(id);
  };

  // Set initial highlight position and update on window resize
  useEffect(() => {
    updateHighlightPosition();

    const handleResize = () => {
      updateHighlightPosition();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [active, links]);

  // Update when active link changes externally
  useEffect(() => {
    if (activeLink && activeLink !== active) {
      setActive(activeLink);
    }
  }, [activeLink]);

  return (
    <nav
      ref={navRef}
      className={cn(
        `relative rounded-full  backdrop-blur-md border 
        shadow-lg transition-all duration-300`,
        defaultThemeStyles.bg,
        defaultThemeStyles.border,
        defaultThemeStyles.glow,
        className
      )}
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      {/* Background highlight */}
      <div
        ref={highlightRef}
        className={cn(
          `absolute top-0 left-0 h-full rounded-full transition-all 
          duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-0`,
          defaultThemeStyles.highlight
        )}
        style={{
          backgroundColor: highlightColor,
        }}
      ></div>

      <ul className="flex justify-between items-center gap-4 py-2 relative z-10">
        {links.map((link) => (
          <li
            key={link.id}
            className="flex-1 rounded-full mx-1 lg:mx-2 px-4"
            id={`nav-item-${link.id}`}
          >
            <a
              href={link.href}
              className={cn(
                `flex gap-1 items-center justify-center h-8 md:h-8 text-xs md:text-sm 
                rounded-full font-medium transition-all duration-300 hover:scale-105 
                relative overflow-hidden`,
                defaultThemeStyles.text,
                active === link.id && "font-semibold"
              )}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id, e);
              }}
              onMouseEnter={() => handleLinkHover(link.id)}
            >
              {link.icon && (
                <span className="text-current text-xs ">
                  {link.icon}
                </span>
              )}
              <span
                className={cn(showLabelsOnMobile ? "flex" : "hidden sm:flex")}
              >
                {link.label}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <style
        dangerouslySetInnerHTML={{
          __html: `        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s linear;
        }
`,
        }}
      />
    </nav>
  );
};

export default DynamicNavigation;