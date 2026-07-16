const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = plugin.withOptions(
  function (options = {}) {
    return function ({ addBase, theme, addComponents, addUtilities }) {
      const effect3d = options.effect3d === true || options.effect3d === 'true';

      const add3D = (selector, flatStyles, active3DStyles) => {
        addComponents({
          [selector]: effect3d ? active3DStyles : flatStyles
        });

        if (!effect3d) {
          let scoped;
          if (selector.startsWith(".dark ")) {
            const sub = selector.substring(6);
            scoped = `.dark .lw-3d ${sub}, .dark .lw-3d${sub}, .dark .theme-3d ${sub}, .dark .theme-3d${sub}, .lw-3d .dark ${sub}, .lw-3d.dark ${sub}, .theme-3d .dark ${sub}, .theme-3d.dark ${sub}`;
          } else {
            scoped = `.lw-3d ${selector}, .lw-3d${selector}, .theme-3d ${selector}, .theme-3d${selector}`;
          }
          addComponents({
            [scoped]: active3DStyles
          });
        }
      };
    // Add custom keyframes animations
    addBase({
      // Light (default) theme
      // Light theme
      ":root": {
        "--primarylw": "#173eff",
        "--primarylw-2": "#3758f9",
        "--darklw": "#11131B",
        "--darklw-2": "#1a1d25",
        "--greedy": "#07eae6",

        "--background": "0 0% 100%",
        "--foreground": "0 0% 0%",

        "--card": "0 0% 100%",
        "--card-foreground": "0 0% 0%",

        "--popover": "0 0% 100%",
        "--popover-foreground": "0 0% 0%",

        "--primary": "0 0% 0%",
        "--primary-foreground": "0 0% 100%",
        "--lw-primary-color": "hsl(var(--primary))",
        "--lw-primary-foreground": "hsl(var(--primary-foreground))",

        "--secondary": "0 0% 96%",
        "--secondary-foreground": "0 0% 0%",

        "--muted": "0 0% 96%",
        "--muted-foreground": "0 0% 45%",

        "--accent": "0 0% 96%",
        "--accent-foreground": "0 0% 0%",

        "--destructive": "0 84% 60%",
        "--destructive-foreground": "0 0% 100%",

        "--border": "0 0% 90%",
        "--input": "0 0% 90%",
        "--ring": "0 0% 0%",

        "--radius": "0.5rem",

        "--scrollbar-thumb": "0 0% 75%",
        "--scrollbar-track": "0 0% 95%",
        "--scrollbar-hover": "0 0% 65%",
      },

      // Dark theme
      ".dark": {
        "--primarylw": "#173eff",
        "--primarylw-2": "#3758f9",
        "--darklw": "#11131B",
        "--darklw-2": "#1a1d25",
        "--greedy": "#07eae6",

        "--background": "0 0% 0%",
        "--foreground": "0 0% 100%",

        "--card": "0 0% 5%",
        "--card-foreground": "0 0% 100%",

        "--popover": "0 0% 5%",
        "--popover-foreground": "0 0% 100%",

        "--primary": "0 0% 100%",
        "--primary-foreground": "0 0% 0%",
        "--lw-primary-color": "hsl(var(--primary))",
        "--lw-primary-foreground": "hsl(var(--primary-foreground))",

        "--secondary": "0 0% 15%",
        "--secondary-foreground": "0 0% 100%",

        "--muted": "0 0% 15%",
        "--muted-foreground": "0 0% 65%",

        "--accent": "0 0% 15%",
        "--accent-foreground": "0 0% 100%",

        "--destructive": "0 62% 30%",
        "--destructive-foreground": "0 0% 100%",

        "--border": "0 0% 10%",
        "--input": "0 0% 20%",
        "--ring": "0 0% 20%",

        "--scrollbar-thumb": "0 0% 25%",
        "--scrollbar-track": "0 0% 10%",
        "--scrollbar-hover": "0 0% 35%",
      },

      // neon Button Animation
      "@keyframes neon-pulse": {
        "0%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.05)" },
        "100%": { transform: "scale(1)" },
      },
      "@keyframes neon-bounce": {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-10px)" },
      },

      // tiny-bar-loader Animation classes
      "@keyframes tiny-bar-loader-anime": {
        "0%": {
          opacity: "1",
        },
        "100%": {
          opacity: "0.1",
        },
      },

      // Glassmorphism Animated Login Form
      "@keyframes GlassLoginAnimateBg": {
        "100%": {
          filter: "hue-rotate(360deg)",
        },
      },

      // Gradient Animated BG
      "@keyframes GradientAnimatedBgTurn": {
        to: {
          transform: "rotate(1turn)",
        },
      },

      // Glassmorphism Marquee
      "@keyframes marquee-right-left": {
        "0%": {
          transform: "translateX(0)",
        },
        "100%": {
          transform: "translateX(-50%)" /* Removed the space */,
        },
      },

      // Animated Gradient Border Button
      "@property --border-angle": {
        syntax: '"<angle>"',
        inherits: true,
        "initial-value": "0turn",
      },
      "@keyframes bg-spin": {
        to: {
          "--border-angle": "1turn",
        },
      },

      // ProductCardSkeleton
      "@keyframes skeletonLoader": {
        "0%": {
          "background-position": "-2000px 0",
        },
        "100%": {
          "background-position": "2000px 0",
        },
      },

      // SkeletonBars
      "@keyframes skeletonBarsLoader": {
        "0%": {
          "background-position": "-2000px 0",
        },
        "100%": {
          "background-position": "2000px 0",
        },
      },

      // Animated Cart Button

      // Animated Cart Button
      "@keyframes AnimatedCartBtntruck": {
        "0%": { left: "-10%" },
        "40%, 55%": { left: "50%" },
        "100%": { left: "110%" },
      },
      "@keyframes AnimatedCartBtnbox": {
        "0%, 40%": { top: "-20%", left: "-5%" },
        "55%": { top: "37%", left: "52%" },
        "100%": { top: "37%", left: "110%" },
      },
      "@keyframes AnimatedCartBtntxt1": {
        "0%": { opacity: "1" },
        "20%, 100%": { opacity: "0" },
      },
      "@keyframes AnimatedCartBtntxt2": {
        "0%, 80%": { opacity: "0" },
        "100%": { opacity: "1" },
      },

      // Missing Circle & Shine Animations
      "@keyframes rotateClockwise": {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
      "@keyframes rotateAnticlockwise": {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(-360deg)" },
      },
      "@keyframes shine": {
        "0%": { left: "-60%" },
        "99%": { left: "220%" },
        "100%": { opacity: "0" },
      },

      "*": {
        scrollbarWidth: "thin",
        scrollbarColor:
          "hsl(var(--scrollbar-thumb)) hsl(var(--scrollbar-track))",
      },
      body: {
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        fontFamily: `${defaultTheme.fontFamily.sans.join(", ")}`,
      },
      ".command-dialog-open, .popover-open": {
        overflow: "hidden",
      },
      ".command-dialog-open::after, .popover-open::after": {
        content: '""',
        position: "fixed",
        inset: "0",
        zIndex: "39",
        backdropFilter: "blur(4px)",
        pointerEvents: "none",
        transition: "backdrop-filter 0.2s ease",
      },
      ".border": {
        borderWidth: "1px",
        borderColor: "hsl(var(--border))",
      },
      ".dark .border": {
        borderColor: "hsl(var(--border))",
      },
      // Directional border variants — default to theme border color
      ".border-t": {
        borderTopWidth: "1px",
        borderTopColor: "hsl(var(--border))",
      },
      ".border-b": {
        borderBottomWidth: "1px",
        borderBottomColor: "hsl(var(--border))",
      },
      ".border-l": {
        borderLeftWidth: "1px",
        borderLeftColor: "hsl(var(--border))",
      },
      ".border-r": {
        borderRightWidth: "1px",
        borderRightColor: "hsl(var(--border))",
      },
      ".border-x": {
        borderLeftWidth: "1px",
        borderLeftColor: "hsl(var(--border))",
        borderRightWidth: "1px",
        borderRightColor: "hsl(var(--border))",
      },
      ".border-y": {
        borderTopWidth: "1px",
        borderTopColor: "hsl(var(--border))",
        borderBottomWidth: "1px",
        borderBottomColor: "hsl(var(--border))",
      },
    });

    // Add custom utilities for animations
    addUtilities({
      // neon Button Animation-class
      ".neon-pulse-animation": {
        animation: "neon-pulse 0.6s ease-in-out infinite",
      },
      ".neon-bounce-animation": {
        animation: "neon-bounce 0.3s ease-in-out infinite",
      },


      ".animated-gradient-border-button": {
        "--border-angle": "0turn",
        animation: "animated-gradient-border-spin  3s linear infinite",
      },

      // ProductCardSkeleton
      ".animate-skeletonLoader": {
        animation: "skeletonLoader 5s ease-in-out infinite",
      },

      // SkeletonBars
      ".skeletonBarsLoaders": {
        "background-size": "200% 100%",
        animation: "skeletonBarsLoader 6s ease-in-out infinite",
      },

      // Animated Cart Button
      ".cart-button.clicked .cart-shopping-svg": {
        animation: "AnimatedCartBtntruck 2s ease-in-out forwards",
      },
      ".cart-button.clicked .cart-box-svg": {
        animation: "AnimatedCartBtnbox 2s ease-in-out forwards",
      },
      ".cart-button.clicked span.add-to-cart": {
        animation: "AnimatedCartBtntxt1 2s ease-in-out forwards",
      },
      ".cart-button.clicked span.added": {
        animation: "AnimatedCartBtntxt2 2s ease-in-out forwards",
      },
      ".card-hover": {
        transitionProperty: "transform",
        transitionDuration: "300ms",
        transitionTimingFunction: "ease",
        transform: "none",
      },
      ".card-hover:hover": {
        transform: "scale(1.02)",
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // shadow-lg
      },

      ".toggle-switch": {
        position: "relative",
        width: "2.5rem", // w-10
        height: "1.25rem", // h-5
        borderRadius: "9999px",
        backgroundColor: "hsl(var(--secondary))",
        transitionProperty: "background-color",
        transitionDuration: "200ms",
      },
      ".toggle-switch.active": {
        backgroundColor: "var(--lw-primary-color)",
      },
      ".toggle-switch .toggle-knob": {
        position: "absolute",
        top: "2px",
        left: "2px",
        width: "1rem", // w-4
        height: "1rem", // h-4
        borderRadius: "9999px",
        backgroundColor: "hsl(var(--foreground))",
        transitionProperty: "transform",
        transitionDuration: "200ms",
      },
      ".toggle-switch.active .toggle-knob": {
        transform: "translateX(1.25rem)", // translate-x-5
        backgroundColor: "hsl(var(--background))",
      },

      ".dropdown-hover-item": {
        display: "flex",
        alignItems: "center",
        padding: "0.5rem 0.5rem",
        fontSize: "0.875rem",
        borderRadius: "0.375rem",
        cursor: "pointer",
        transitionProperty: "color, background-color",
        transitionDuration: "200ms",
      },
      ".dropdown-hover-item:hover": {
        backgroundColor: "hsl(var(--accent))",
        color: "hsl(var(--accent-foreground))",
      },

      ".dropdown-category": {
        fontSize: "0.75rem",
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "0.25rem",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        color: "hsl(var(--muted-foreground))",
      },

      ".dropdown-category-item": {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        width: "100%",
        fontSize: "0.875rem",
      },

      ".tabs-bg-indicator": {
        position: "absolute",
        borderRadius: "0.125rem",
        backgroundColor: "var(--lw-primary-color)",
        transitionProperty: "all",
        transitionDuration: "200ms",
        transitionTimingFunction: "ease-out",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        transformOrigin: "center center",
      },

      ".sidebar-menu-indicator": {
        position: "absolute",
        transitionProperty: "all",
        transitionDuration: "200ms",
        transitionTimingFunction: "ease-out",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      },
      ".dropdown-content, .select-content, .popover-content, .command-dialog": {
        maxHeight: "calc(90vh - 2rem)",
        overflowY: "auto",
      },
      ".no-scroll": {
        overflow: "hidden",
      },
      ".scrollbar-hide": {
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      },
      ".scrollbar-hide::-webkit-scrollbar": {
        display: "none",
      },
      ".custom-scrollbar::-webkit-scrollbar": {
        width: "5px",
        height: "5px",
      },
      ".custom-scrollbar::-webkit-scrollbar-track": {
        background: "transparent",
        borderRadius: "10px",
      },
      ".custom-scrollbar::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(120, 120, 120, 0.3)",
        borderRadius: "10px",
        transition: "all 0.2s ease",
      },
      ".custom-scrollbar:hover::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(120, 120, 120, 0.5)",
      },
      ".custom-scrollbar::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "rgba(120, 120, 120, 0.7)",
      },
      ".custom-scrollbar::-webkit-scrollbar-corner": {
        background: "transparent",
      },
      ".flex-wrap-tabs": {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.25rem", // gap-1 = 4px = 0.25rem
      },

      ".sidebar-scrollable-syntax::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      ".sidebar-scrollable-syntax::-webkit-scrollbar-track": {
        backgroundColor: "#f0f0f0",
        borderRadius: "10px",
      },
      ".sidebar-scrollable-syntax::-webkit-scrollbar-thumb": {
        backgroundColor: "#505050",
        borderRadius: "10px",
        border: "2px solid #f0f0f0",
      },
      ".sidebar-scrollable-syntax::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#b3b3b3",
      },

      "@keyframes shimmer": {
        "0%": { transform: "translateX(-100%)" },
        "100%": { transform: "translateX(100%)" },
      },
      ".animate-shimmer": {
        animation: "shimmer 2s infinite",
      },
      ".animate-shine": {
        animation: "shine 2s ease-in-out forwards",
      },
      ".animate-rotate-cw": {
        animation: "rotateClockwise 3s linear infinite",
      },
      "@keyframes toast-enter": {
        "0%": { transform: "translateX(100%)", opacity: "0" },
        "100%": { transform: "translateX(0)", opacity: "1" },
      },
      "@keyframes toast-exit": {
        "0%": { transform: "translateX(0)", opacity: "1" },
        "100%": { transform: "translateX(100%)", opacity: "0" },
      },
      "@keyframes toast-enter-mobile": {
        "0%": { transform: "translateY(-100%)", opacity: "0" },
        "100%": { transform: "translateY(0)", opacity: "1" },
      },
      "@keyframes toast-exit-mobile": {
        "0%": { transform: "translateY(0)", opacity: "1" },
        "100%": { transform: "translateY(-100%)", opacity: "0" },
      },
    });


            // Premium 3D Buttons & Components (Flat by default, 3D on options.effect3d or .lw-3d wrapper)
      add3D(".btn-3d-default", {
        background: "var(--lw-primary-color)",
        color: "var(--lw-primary-foreground)",
        borderWidth: "1px",
        borderColor: "transparent",
        boxShadow: "none",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          background: "color-mix(in srgb, var(--lw-primary-color) 90%, transparent)",
          boxShadow: "none",
        },
        "&:active": {
          background: "var(--lw-primary-color)",
          boxShadow: "none",
          transform: "none",
          transitionDuration: "0ms",
        },
      }, {
        background: "linear-gradient(to bottom, color-mix(in srgb, var(--lw-primary-color) 90%, transparent) 0%, var(--lw-primary-color) 100%)",
        color: "var(--lw-primary-foreground)",
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.1)",
        boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 0 rgba(255, 255, 255, 0.18), 0 1px 2px 0 rgba(255, 255, 255, 0.2)",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.3), inset 0 -2px 0 0 rgba(0, 0, 0, 0.25), 0 2px 4px 0 rgba(0, 0, 0, 0.1)",
          background: "linear-gradient(to bottom, color-mix(in srgb, var(--lw-primary-color) 95%, transparent) 0%, color-mix(in srgb, var(--lw-primary-color) 98%, transparent) 100%)",
        },
        "&:active": {
          boxShadow: "inset 0 2px 3px 0 rgba(0, 0, 0, 0.2)",
          transform: "translateY(1.5px)",
          background: "var(--lw-primary-color)",
          transitionDuration: "0ms",
        },
      });

      add3D(".dark .btn-3d-default", {
        background: "var(--lw-primary-color)",
        borderColor: "transparent",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
          background: "color-mix(in srgb, var(--lw-primary-color) 90%, transparent)",
        },
        "&:active": {
          boxShadow: "none",
          transform: "none",
          background: "var(--lw-primary-color)",
          transitionDuration: "0ms",
        },
      }, {
        background: "linear-gradient(to bottom, var(--lw-primary-color) 0%, color-mix(in srgb, var(--lw-primary-color) 92%, transparent) 100%)",
        borderColor: "rgba(0, 0, 0, 0.12)",
        boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.9), inset 0 -2px 0 0 rgba(0, 0, 0, 0.18), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "&:hover": {
          boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 1.0), inset 0 -2px 0 0 rgba(0, 0, 0, 0.22), 0 2px 4px 0 rgba(0, 0, 0, 0.1)",
          background: "linear-gradient(to bottom, var(--lw-primary-color) 0%, color-mix(in srgb, var(--lw-primary-color) 96%, transparent) 100%)",
        },
        "&:active": {
          boxShadow: "inset 0 2px 3px 0 rgba(0, 0, 0, 0.15)",
          transform: "translateY(1.5px)",
          background: "color-mix(in srgb, var(--lw-primary-color) 90%, transparent)",
          transitionDuration: "0ms",
        },
      });

      add3D(".btn-3d-destructive", {
        background: "hsl(var(--destructive))",
        color: "hsl(var(--destructive-foreground))",
        borderWidth: "1px",
        borderColor: "transparent",
        boxShadow: "none",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          background: "hsl(var(--destructive) / 0.9)",
          boxShadow: "none",
        },
        "&:active": {
          background: "hsl(var(--destructive))",
          boxShadow: "none",
          transform: "none",
          transitionDuration: "0ms",
        },
      }, {
        background: "linear-gradient(to bottom, hsl(var(--destructive) / 0.9) 0%, hsl(var(--destructive)) 100%)",
        color: "hsl(var(--destructive-foreground))",
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.1)",
        boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.25), inset 0 -2px 0 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.35), inset 0 -2px 0 0 rgba(0, 0, 0, 0.35), 0 2px 4px 0 rgba(0, 0, 0, 0.1)",
          background: "linear-gradient(to bottom, hsl(var(--destructive) / 0.95) 0%, hsl(var(--destructive) / 0.98) 100%)",
        },
        "&:active": {
          boxShadow: "inset 0 2px 3px 0 rgba(0, 0, 0, 0.25)",
          transform: "translateY(1.5px)",
          background: "hsl(var(--destructive))",
          transitionDuration: "0ms",
        },
      });

      add3D(".dark .btn-3d-destructive", {
        background: "hsl(var(--destructive))",
        borderColor: "transparent",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
          background: "hsl(var(--destructive) / 0.9)",
        },
        "&:active": {
          boxShadow: "none",
          transform: "none",
          background: "hsl(var(--destructive))",
          transitionDuration: "0ms",
        },
      }, {
        background: "linear-gradient(to bottom, hsl(0, 84%, 55%) 0%, hsl(0, 84%, 45%) 100%)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderTopColor: "rgba(255, 255, 255, 0.30)",
        boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.45), inset 0 -2px 0 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "&:hover": {
          boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.55), inset 0 -2px 0 0 rgba(0, 0, 0, 0.25), 0 2px 4px 0 rgba(0, 0, 0, 0.1)",
          background: "linear-gradient(to bottom, hsl(0, 84%, 60%) 0%, hsl(0, 84%, 50%) 100%)",
        },
        "&:active": {
          boxShadow: "inset 0 2px 3px 0 rgba(0, 0, 0, 0.3)",
          transform: "translateY(1.5px)",
          background: "linear-gradient(to bottom, hsl(0, 84%, 48%) 0%, hsl(0, 84%, 40%) 100%)",
          transitionDuration: "0ms",
        },
      });

      add3D(".btn-3d-secondary", {
        background: "hsl(var(--secondary))",
        color: "hsl(var(--secondary-foreground))",
        borderWidth: "1px",
        borderColor: "transparent",
        boxShadow: "none",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          background: "hsl(var(--secondary) / 0.9)",
          boxShadow: "none",
        },
        "&:active": {
          background: "hsl(var(--secondary))",
          boxShadow: "none",
          transform: "none",
          transitionDuration: "0ms",
        },
      }, {
        background: "linear-gradient(to bottom, hsl(var(--secondary) / 0.9) 0%, hsl(var(--secondary)) 100%)",
        color: "hsl(var(--secondary-foreground))",
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.05)",
        boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.4), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.6), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.08), 0 2px 3px 0 rgba(0, 0, 0, 0.08)",
          background: "linear-gradient(to bottom, hsl(var(--secondary) / 0.95) 0%, hsl(var(--secondary) / 0.98) 100%)",
        },
        "&:active": {
          boxShadow: "inset 0 1.5px 2px 0 rgba(0, 0, 0, 0.1)",
          transform: "translateY(1.5px)",
          background: "hsl(var(--secondary))",
          transitionDuration: "0ms",
        },
      });

      add3D(".dark .btn-3d-secondary", {
        background: "hsl(var(--secondary))",
        borderColor: "transparent",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
          background: "hsl(var(--secondary) / 0.9)",
        },
        "&:active": {
          boxShadow: "none",
          transform: "none",
          background: "hsl(var(--secondary))",
          transitionDuration: "0ms",
        },
      }, {
        background: "linear-gradient(to bottom, hsl(var(--secondary) / 0.95) 0%, hsl(var(--secondary) / 0.85) 100%)",
        borderColor: "rgba(255, 255, 255, 0.05)",
        boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.15), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.35), 0 1px 2px 0 rgba(0, 0, 0, 0.15)",
        "&:hover": {
          boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.2), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.45), 0 2px 3px 0 rgba(0, 0, 0, 0.2)",
          background: "linear-gradient(to bottom, hsl(var(--secondary) / 1) 0%, hsl(var(--secondary) / 0.9) 100%)",
        },
        "&:active": {
          boxShadow: "inset 0 1.5px 2px 0 rgba(0, 0, 0, 0.3)",
          transform: "translateY(1.5px)",
          background: "hsl(var(--secondary) / 0.9)",
          transitionDuration: "0ms",
        },
      });

      add3D(".btn-3d-github", {
        background: "#ffffff",
        color: "#000000",
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.1)",
        boxShadow: "none",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          boxShadow: "none",
          backgroundColor: "#f9fafb",
        },
        "&:active": {
          boxShadow: "none",
          transform: "none",
          transitionDuration: "0ms",
        },
      }, {
        background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.90) 100%)",
        color: "#000000",
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.1)",
        boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.6), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.8), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.08), 0 2px 3px 0 rgba(0, 0, 0, 0.06)",
          backgroundColor: "#f9fafb",
        },
        "&:active": {
          boxShadow: "inset 0 1.5px 2px 0 rgba(0, 0, 0, 0.08)",
          transform: "translateY(1.5px)",
          transitionDuration: "0ms",
        },
      });

      add3D(".dark .btn-3d-github", {
        background: "#1f2937",
        color: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
          backgroundColor: "#374151",
        },
        "&:active": {
          boxShadow: "none",
          transform: "none",
          transitionDuration: "0ms",
        },
      }, {
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderTopColor: "rgba(255, 255, 255, 0.4)",
      });

      add3D(".btn-3d-outline", {
        borderWidth: "1px",
        borderColor: "hsl(var(--border))",
        backgroundColor: "hsl(var(--background))",
        boxShadow: "none",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          backgroundColor: "hsl(var(--accent))",
          color: "hsl(var(--accent-foreground))",
          boxShadow: "none",
        },
        "&:active": {
          boxShadow: "none",
          transform: "none",
          transitionDuration: "0ms",
        },
      }, {
        borderWidth: "1px",
        borderColor: "hsl(var(--border))",
        backgroundColor: "hsl(var(--background))",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          backgroundColor: "hsl(var(--accent))",
          color: "hsl(var(--accent-foreground))",
          boxShadow: "0 2px 3px 0 rgba(0, 0, 0, 0.08)",
        },
        "&:active": {
          boxShadow: "none",
          transform: "translateY(1.5px)",
          transitionDuration: "0ms",
        },
      });

      add3D(".dark .btn-3d-outline", {
        boxShadow: "none",
      }, {
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.15)",
      });

      add3D(".btn-3d-ghost", {
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          backgroundColor: "hsl(var(--accent))",
          color: "hsl(var(--accent-foreground))",
        },
        "&:active": {
          transform: "none",
          backgroundColor: "hsl(var(--accent) / 0.8)",
          transitionDuration: "0ms",
        },
      }, {
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          backgroundColor: "hsl(var(--accent))",
          color: "hsl(var(--accent-foreground))",
        },
        "&:active": {
          transform: "translateY(1.5px)",
          backgroundColor: "hsl(var(--accent) / 0.8)",
          transitionDuration: "0ms",
        },
      });

      add3D(".btn-3d-custom", {
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.15)",
        boxShadow: "none",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          boxShadow: "none",
        },
        "&:active": {
          boxShadow: "none",
          transform: "none",
          transitionDuration: "0ms",
        },
      }, {
        backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.1) 100%)",
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.15)",
        boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.3), inset 0 -2px 0 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 0%, rgba(0, 0, 0, 0.05) 100%)",
          boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.4), inset 0 -2px 0 0 rgba(0, 0, 0, 0.25), 0 2px 4px 0 rgba(0, 0, 0, 0.1)",
        },
        "&:active": {
          backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.15) 100%)",
          boxShadow: "inset 0 2px 3px 0 rgba(0, 0, 0, 0.25)",
          transform: "translateY(1.5px)",
          transitionDuration: "0ms",
        },
      });

      add3D(".dark .btn-3d-custom", {
        borderColor: "rgba(255, 255, 255, 0.12)",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
        "&:active": {
          boxShadow: "none",
        }
      }, {
        borderColor: "rgba(255, 255, 255, 0.12)",
        borderTopColor: "rgba(255, 255, 255, 0.3)",
        boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.35), inset 0 -2px 0 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.15)",
        "&:hover": {
          boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.45), inset 0 -2px 0 0 rgba(0, 0, 0, 0.35), 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
        },
        "&:active": {
          boxShadow: "inset 0 2px 3px 0 rgba(0, 0, 0, 0.4)",
        }
      });

      add3D(".btn-3d-link", {
        color: "var(--lw-primary-color)",
        textDecorationLine: "none",
        textUnderlineOffset: "4px",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          textDecorationLine: "underline",
        },
      }, {
        color: "var(--lw-primary-color)",
        textDecorationLine: "none",
        textUnderlineOffset: "4px",
        transitionProperty: "all",
        transitionDuration: "200ms",
        "&:hover": {
          textDecorationLine: "underline",
        },
      });

      add3D(".bg-gradient-tabs", {
        background: "hsl(var(--foreground)) !important",
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.1)",
        boxShadow: "none",
      }, {
        background: "linear-gradient(to bottom, hsl(var(--foreground) / 0.9) 0%, hsl(var(--foreground)) 100%) !important",
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.1)",
        boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 0 rgba(255, 255, 255, 0.18), 0 1px 2px 0 rgba(255, 255, 255, 0.2)",
      });

      add3D(".dark .bg-gradient-tabs", {
        background: "hsl(var(--foreground)) !important",
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.12)",
        boxShadow: "none",
      }, {
        background: "linear-gradient(to bottom, hsl(var(--foreground)) 0%, hsl(var(--foreground) / 0.92) 100%) !important",
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.12)",
        boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.9), inset 0 -2px 0 0 rgba(0, 0, 0, 0.18), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      });

      add3D(".chart-3d-shade .recharts-rectangle", {
        filter: "none",
      }, {
        filter: "url(#lw-3d-shade)",
      });

      add3D(".chart-3d-shade .recharts-sector", {
        filter: "none",
      }, {
        filter: "url(#lw-3d-shade)",
      });

      add3D(".chart-3d-shade .recharts-area-area", {
        filter: "none",
      }, {
        filter: "url(#lw-3d-shade)",
      });


    // Add custom root-level styles and components
    addBase({
      /* Utility for smooth scroll */
      ".scroll-smooth": {
        scrollBehavior: "smooth",
      },
      ".scrollbar-hide": {
        scrollbarWidth: "none",
        "-ms-overflow-style": "none",
      },
      ".scrollbar-hide::-webkit-scrollbar": {
        display: "none",
      },

      /* Custom card component */
      ".custom-card": {
        borderRadius: theme("borderRadius.lg"),
        boxShadow: theme("boxShadow.lg"),
        padding: theme("spacing.6"),
        backgroundColor: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      },

      // Dynamic navigation classes
      ".dynamicNav-nav-bg": {
        backgroundColor: "#000000",
        width: "100%",
        ahbition: "relative",
      },
      ".dynamicNav-highlight-glow": {
        boxShadow: "inset 0 0 10px #fff",
      },
      ".dynamicNav-nav-link": {
        color: "#ffffff",
        transition: "color 0.3s ease, transform 0.3s ease",
      },
      ".dynamicNav-nav-link:hover": {
        transform: "scale(1.1)",
      },
      ".dynamicNav-highlight-transition": {
        transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
      },
      ".dynamicNav-active-link": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },

      // Corrected InteractiveGalleryCard styles
      ".InteractiveGalleryCard:hover": {
        transform: "perspective(1000px)",
      },

      ".InteractiveGalleryCard": {
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        willChange: "transform",
      },

      // Glass Marquee styles
      ".GlassMarqueeContainer": {
        display: "flex",
        width: "200%",
        gap: "20px",
        whiteSpace: "nowrap",
        alignItems: "center",
        animation: "marquee-right-left 12s linear infinite",
      },

      ".GlassMarqueeContainer:hover": {
        animationPlayState: "paused",
      },

      ".GlassMarqueeCard": {
        flexShrink: 0,
        transition: "transform 0.3s, box-shadow 0.3s, brightness 0.3s",
      },

      ".GlassMarqueeCard:hover": {
        transform: "translateY(-10px) scale(1.05)",
        boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.4)",
      },

      ".GlassMarqueeEffect": {
        backdropFilter: "blur(10px)",
        background: "rgba(255, 255, 255, 0.15)",
      },

      // Glass Marquee styles
      ".GlassMarqueeContainer": {
        display: "flex",
        width: "200%",
        gap: "20px",
        whiteSpace: "nowrap",
        alignItems: "center",
        animation: "marquee-right-left 12s linear infinite",
      },

      // Animatd Gradient Border Button
      ".gradient-border": {
        "--border-angle": "0turn",
        background:
          "conic-gradient(from var(--border-angle), #000, #000) padding-box," +
          " conic-gradient(from var(--border-angle), transparent 25%, #08f, rgb(1, 206, 46) 99%, transparent) border-box",
        animation: "bg-spin 3s linear infinite",
      },
      ".gradient-border:hover": {
        animationPlayState: "paused",
      },
      "@property --border-angle": {
        syntax: '"<angle>"',
        inherits: true,
        "initial-value": "0turn",
      },

      // Animatd Gradient Border Button
      ".animatedRangeInput .animatedRangeInputLevel::-webkit-slider-thumb": {
        "-webkit-appearance": "none",
        width: "0",
        height: "0",
        "-webkit-box-shadow": "-200px 0 0 200px #fff",
        boxShadow: "-200px 0 0 200px #fff",
      },
      ".animatedRangeInput .animatedRangeInputLevel::-moz-range-thumb": {
        width: "0",
        height: "0",
        borderRadius: "0",
        border: "none",
        boxShadow: "-200px 0 0 200px #fff",
      },

      // Animatd Gradient Border Button
      ".animatedRangeInput .animatedRangeInputLevel::-webkit-slider-thumb": {
        "-webkit-appearance": "none",
        width: "0",
        height: "0",
        "-webkit-box-shadow": "-200px 0 0 200px #fff",
        boxShadow: "-200px 0 0 200px #fff",
      },
      ".animatedRangeInput .animatedRangeInputLevel::-moz-range-thumb": {
        width: "0",
        height: "0",
        borderRadius: "0",
        border: "none",
        boxShadow: "-200px 0 0 200px #fff",
      },
      /* Smooth transition for sidebar toggle */
      ".ToggleThemeSidebar": {
        transition: "width 0.4s ease, padding 0.4s ease",
      },

      ".ToggleThemeSidebar-expanded": {
        width: "160px",
      },

      ".ToggleThemeSidebar-collapsed": {
        width: "64px",
      },

      /* Smooth transition for theme change */
      ".transition-colors": {
        transition: "background-color 0.4s, color 0.4s",
      },

      
        });
  };
},
  function (options = {}) {
    return {
      theme: {
      container: {
        center: true,
        padding: "16px",
      },
      extend: {
        fontFamily: {
          primarylw: [
            '"Inter"', // Primary font
            "ui-sans-serif", // Generic sans-serif font for better compatibility
            "system-ui", // Default system font
            "sans-serif", // Fallback generic sans-serif
            '"Apple Color Emoji"', // Emojis for Apple devices
            '"Segoe UI Emoji"', // Emojis for Windows devices
            '"Segoe UI Symbol"', // Emojis for Windows devices
            '"Noto Color Emoji"', // Emojis for Android/Google devices
            "Roboto", // Additional common font
            "Arial", // Additional fallback
            ...defaultTheme.fontFamily.sans, // Default sans-serif fonts from Tailwind
          ],
        },
        colors: {
          // Custom color namespaces
          // custom color here
          greedy: "#00a3e4ff",
          primarylw: "var(--primarylw)",
          "primarylw-2": "var(--primarylw-2)",

          darklw: {
            DEFAULT: "var(--darklw)",
            2: "var(--darklw-2)",
          },

          // Theme-based design tokens
          background: "hsl(var(--background) / <alpha-value>)",
          foreground: "hsl(var(--foreground) / <alpha-value>)",

          card: "hsl(var(--card) / <alpha-value>)",
          "card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",

          popover: "hsl(var(--popover) / <alpha-value>)",
          "popover-foreground": "hsl(var(--popover-foreground) / <alpha-value>)",

          primary: "hsl(var(--primary) / <alpha-value>)",
          "primary-foreground": "hsl(var(--primary-foreground) / <alpha-value>)",

          secondary: "hsl(var(--secondary) / <alpha-value>)",
          "secondary-foreground": "hsl(var(--secondary-foreground) / <alpha-value>)",

          muted: "hsl(var(--muted) / <alpha-value>)",
          "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",

          accent: "hsl(var(--accent) / <alpha-value>)",
          "accent-foreground": "hsl(var(--accent-foreground) / <alpha-value>)",

          destructive: "hsl(var(--destructive) / <alpha-value>)",
          "destructive-foreground": "hsl(var(--destructive-foreground) / <alpha-value>)",

          border: {
            DEFAULT: "hsl(var(--border) / <alpha-value>)",
            2: "var(--darklw-2)",
          },
          input: "hsl(var(--input) / <alpha-value>)",
          ring: "hsl(var(--ring) / <alpha-value>)",

          // Scrollbar colors
          "scrollbar-thumb": "hsl(var(--scrollbar-thumb))",
          "scrollbar-track": "hsl(var(--scrollbar-track))",
          "scrollbar-hover": "hsl(var(--scrollbar-hover))",
        },
      },
    },
      };
  }
);