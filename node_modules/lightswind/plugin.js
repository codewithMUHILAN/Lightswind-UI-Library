const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = plugin(
  function ({ addBase, theme, addComponents, addUtilities }) {
    // Add custom keyframes animations
    addBase({
      // autota text aniamtion
      "@keyframes aurora-1": {
        "0%": { top: "0", right: "0" },
        "50%": { top: "100%", right: "75%" },
        "75%": { top: "100%", right: "25%" },
        "100%": { top: "0", right: "0" },
      },
      "@keyframes aurora-2": {
        "0%": { top: "-50%", left: "0%" },
        "60%": { top: "100%", left: "75%" },
        "85%": { top: "100%", left: "25%" },
        "100%": { top: "-50%", left: "0%" },
      },
      "@keyframes aurora-3": {
        "0%": { bottom: "0", left: "0" },
        "40%": { bottom: "100%", left: "75%" },
        "65%": { bottom: "40%", left: "50%" },
        "100%": { bottom: "0", left: "0" },
      },
      "@keyframes aurora-4": {
        "0%": { bottom: "-50%", right: "0" },
        "50%": { bottom: "0%", right: "40%" },
        "90%": { bottom: "50%", right: "25%" },
        "100%": { bottom: "-50%", right: "0" },
      },
      "@keyframes aurora-border": {
        "0%": { borderRadius: "37% 29% 27% 27% / 28% 25% 41% 37%" },
        "25%": { borderRadius: "47% 29% 39% 49% / 61% 19% 66% 26%" },
        "50%": { borderRadius: "57% 23% 47% 72% / 63% 17% 66% 33%" },
        "75%": { borderRadius: "28% 49% 29% 100% / 93% 20% 64% 25%" },
        "100%": { borderRadius: "37% 29% 27% 27% / 28% 25% 41% 37%" },
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


      // tinybarloader Animation classes
      "@keyframes TinyBarLoader-anime": {
        "0%": {
          opacity: "1"
        },
        "100%": {
          opacity: "0.1"
        },
      },

      // Glassmorphism Animated Login Form
      "@keyframes GlassLoginAnimateBg": {
        "100%": {
          filter: "hue-rotate(360deg)"
        }
      },

      // Gradient Animated BG
      "@keyframes GradientAnimatedBgTurn": {
        "to": {
          transform: "rotate(1turn)"
        }
      },

      // Glassmorphism Marquee
      "@keyframes marquee-right-left": {
        "0%": {
          transform: "translateX(0)"
        },
        "100%": {
          transform: "translateX(-50%)"  /* Removed the space */
        }
      },

      // Animated Gradient Border Button
      '@property --border-angle': {
        syntax: '"<angle>"',
        inherits: true,
        'initial-value': '0turn',
      },
      '@keyframes bg-spin': {
        to: {
          '--border-angle': '1turn',
        },
      },

      // ProductCardSkeleton
      "@keyframes skeletonLoader": {
        "0%": {
          'background-position': '-2000px 0'
        },
        "100%": {
          'background-position': '2000px 0'

        }
      },

      // SkeletonBars
      "@keyframes skeletonBarsLoader": {
        "0%": {
          'background-position': '-2000px 0'
        },
        "100%": {
          "background-position": '2000px 0'
        }
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

    });

    // Add custom utilities for animations
    addUtilities({
      // aurora Button Animation-class
      ".aurora-animation-1": {
        animation: "aurora-1 5s ease-in-out infinite alternate",
      },
      ".aurora-animation-2": {
        animation: "aurora-2 5s ease-in-out infinite alternate",
      },
      ".aurora-animation-3": {
        animation: "aurora-3 3s ease-in-out infinite alternate",
      },
      ".aurora-animation-4": {
        animation: "aurora-4 13s ease-in-out infinite alternate",
      },
      ".aurora-border-animation": {
        animation: "aurora-border 6s ease-in-out infinite",
      },

      // neon Button Animation-class
      ".neon-pulse-animation": {
        animation: "neon-pulse 0.6s ease-in-out infinite",
      },
      ".neon-bounce-animation": {
        animation: "neon-bounce 0.3s ease-in-out infinite",
      },

      // tinybarloader Animation-class
      ".TinyBarLoader": {
        animation: "TinyBarLoader-anime 1s linear infinite"
      },

      // GlassMarqueeContainer
      ".GlassMarqueeContainer": {
        animation: "marquee-right-left 12s linear infinite"
      },

      '.animated-gradient-border-button': {
        '--border-angle': '0turn',
        animation: 'animated-gradient-border-spin  3s linear infinite',
      },

      // ProductCardSkeleton
      ".animate-skeletonLoader": {
        animation: "skeletonLoader 5s ease-in-out infinite"
      },

      // SkeletonBars
      ".skeletonBarsLoaders": {
        'background-size': "200% 100%",
        animation: "skeletonBarsLoader 6s ease-in-out infinite"
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
    });


    // Add custom root-level styles and components
    addBase({
      ":root": {
        "--primarylw": "#173eff",
        "--primarylw-2": "#3758f9",
        "--darklw": "#11131B",
        "--darklw-2": "#1a1d25",
      },

      /* Utility for smooth scroll */
      '.scroll-smooth': {
        scrollBehavior: 'smooth',
      },
      '.scrollbar-hide': {
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none',
      },
      '.scrollbar-hide::-webkit-scrollbar': {
        display: 'none',
      },

      /* Custom card component */
      '.custom-card': {
        borderRadius: theme('borderRadius.lg'),
        boxShadow: theme('boxShadow.lg'),
        padding: theme('spacing.6'),
        backgroundColor: theme('colors.white'),
        border: `1px solid ${theme('colors.border-gray')}`,
      },

      // Dynamic navigation classes
      '.dynamicNav-nav-bg': {
        backgroundColor: '#000000',
        width: '100%',
        ahbition: 'relative',
      },
      '.dynamicNav-highlight-glow': {
        boxShadow: 'inset 0 0 10px #fff',
      },
      '.dynamicNav-nav-link': {
        color: '#ffffff',
        transition: 'color 0.3s ease, transform 0.3s ease',
      },
      '.dynamicNav-nav-link:hover': {
        transform: 'scale(1.1)',
      },
      '.dynamicNav-highlight-transition': {
        transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
      },
      '.dynamicNav-active-link': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },

      // Corrected InteractiveGalleryCard styles
      '.InteractiveGalleryCard:hover': {
        transform: 'perspective(1000px)',
      },

      '.InteractiveGalleryCard': {
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        willChange: 'transform',
      },

      // Glass Marquee styles
      '.GlassMarqueeContainer': {
        display: 'flex',
        width: '200%',
        gap: '20px',
        whiteSpace: 'nowrap',
        alignItems: 'center',
        animation: 'marquee-right-left 12s linear infinite',
      },

      '.GlassMarqueeContainer:hover': {
        animationPlayState: 'paused',
      },

      '.GlassMarqueeCard': {
        flexShrink: 0,
        transition: 'transform 0.3s, box-shadow 0.3s, brightness 0.3s',
      },

      '.GlassMarqueeCard:hover': {
        transform: 'translateY(-10px) scale(1.05)',
        boxShadow: '0px 20px 30px rgba(0, 0, 0, 0.4)',
      },

      '.GlassMarqueeEffect': {
        backdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.15)',
      },

      // Glass Marquee styles
      '.GlassMarqueeContainer': {
        display: 'flex',
        width: '200%',
        gap: '20px',
        whiteSpace: 'nowrap',
        alignItems: 'center',
        animation: 'marquee-right-left 12s linear infinite',
      },

      // Animatd Gradient Border Button
      '.gradient-border': {
        '--border-angle': '0turn',
        background:
          'conic-gradient(from var(--border-angle), #000, #000) padding-box,' +
          ' conic-gradient(from var(--border-angle), transparent 25%, #08f, rgb(1, 206, 46) 99%, transparent) border-box',
        animation: 'bg-spin 3s linear infinite',
      },
      '.gradient-border:hover': {
        animationPlayState: 'paused',
      },
      '@property --border-angle': {
        syntax: '<angle>',
        inherits: true,
        'initial-value': '0turn',
      },

      // Animatd Gradient Border Button
      '.animatedRangeInput .animatedRangeInputLevel::-webkit-slider-thumb': {
        '-webkit-appearance': 'none',
        width: '0',
        height: '0',
        '-webkit-box-shadow': '-200px 0 0 200px #fff',
        boxShadow: '-200px 0 0 200px #fff',
      },
      '.animatedRangeInput .animatedRangeInputLevel::-moz-range-thumb': {
        width: '0',
        height: '0',
        borderRadius: '0',
        border: 'none',
        boxShadow: '-200px 0 0 200px #fff',
      },

      // Animatd Gradient Border Button
      '.animatedRangeInput .animatedRangeInputLevel::-webkit-slider-thumb': {
        '-webkit-appearance': 'none',
        width: '0',
        height: '0',
        '-webkit-box-shadow': '-200px 0 0 200px #fff',
        boxShadow: '-200px 0 0 200px #fff',
      },
      '.animatedRangeInput .animatedRangeInputLevel::-moz-range-thumb': {
        width: '0',
        height: '0',
        borderRadius: '0',
        border: 'none',
        boxShadow: '-200px 0 0 200px #fff',
      },
      /* Smooth transition for sidebar toggle */
      '.ToggleThemeSidebar': {
        transition: 'width 0.4s ease, padding 0.4s ease'
      },

      '.ToggleThemeSidebar-expanded': {
        width: '160px'
      },

      '.ToggleThemeSidebar-collapsed': {
        width: '64px'
      },

      /* Smooth transition for theme change */
      '.transition-colors': {
        transition: 'background-color 0.4s, color 0.4s'
      }

    });
  },


  {
    theme: {
      container: {
        center: true,
        padding: "16px",
      },
      extend: {
        fontFamily: {
          primarylw: [
            '"Inter"', // Primary font
            'ui-sans-serif', // Generic sans-serif font for better compatibility
            'system-ui', // Default system font
            'sans-serif', // Fallback generic sans-serif
            '"Apple Color Emoji"', // Emojis for Apple devices
            '"Segoe UI Emoji"', // Emojis for Windows devices
            '"Segoe UI Symbol"', // Emojis for Windows devices
            '"Noto Color Emoji"', // Emojis for Android/Google devices
            'Roboto', // Additional common font
            'Arial', // Additional fallback
            ...defaultTheme.fontFamily.sans, // Default sans-serif fonts from Tailwind
          ],
        },
        colors: {
          primarylw: {
            DEFAULT: "var(--primarylw)", // Default value from root
            "2": "var(--primarylw-2)",  // -2 value from root
          },
          darklw: {
            DEFAULT: "var(--darklw)",    // Default value from root
            "2": "var(--darklw-2)",     // -2 value from root
          },
        },
      },
    },
  }
);
