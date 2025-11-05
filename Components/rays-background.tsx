import React from 'react';

interface RaysBackgroundProps {
  /** Theme variant - 'light' or 'dark' */
  theme?: 'light' | 'dark';
  /** Enable/disable animation */
  animated?: boolean;
  /** Animation speed multiplier (1 = normal, 2 = double speed, 0.5 = half speed) */
  animationSpeed?: number;
  /** Opacity of the effect (0-1) */
  opacity?: number;
  /** Custom color scheme for rays */
  colors?: {
    purple?: string;
    yellow?: string;
    pink?: string;
    teal?: string;
    blue?: string;
  };
  /** Blur amount for rays in pixels */
  blurAmount?: number;
  /** Children to render on top of the background */
  children?: React.ReactNode;
  /** Additional className for the wrapper */
  className?: string;
}

const RaysBackground: React.FC<RaysBackgroundProps> = ({
  theme = 'dark',
  animated = true,
  animationSpeed = 1,
  opacity = 0.7,
  colors = {
    purple: 'rgba(169, 73, 207, 1)',
    yellow: 'rgba(238, 248, 86, 1)',
    pink: 'rgba(248, 72, 202, 1)',
    teal: 'rgba(119, 235, 195, 1)',
    blue: 'rgba(77, 71, 214, 1)',
  },
  blurAmount = 6,
  children,
  className = '',
}) => {
  const isLightTheme = theme === 'light';

  return (
    <div className={`absolute left-0 top-0 w-full min-h-screen max-h-screen 
    overflow-hidden bg-background ${className}`}>
      {/* Color Ray Container */}
      <div
        className="absolute left-0 right-0 w-full h-full mx-auto 
        overflow-hidden pointer-events-none"
        style={{
          maxWidth: '38%',
          top: '-51%',
          transform: 'scaleX(4) scaleY(1.2)',
          mixBlendMode: isLightTheme ? 'darken' : 'normal',
        }}
      >
        {/* Light Rays */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(rgba(255, 255, 255, .6), rgba(0, 0, 0, .7))',
            overflow: 'hidden',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 1%, rgba(0, 0, 0, .7) 5%, rgba(0, 0, 0, .5) 10%, rgba(0, 0, 0, .3) 22%, rgba(0, 0, 0, .15) 35%, transparent 50%)',
            maskImage:
              'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 1%, rgba(0, 0, 0, .7) 5%, rgba(0, 0, 0, .5) 10%, rgba(0, 0, 0, .3) 22%, rgba(0, 0, 0, .15) 35%, transparent 50%)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            mixBlendMode: 'color-burn',
            opacity: 0.6,
          }}
        >
          {/* Before pseudo element - Light rays pattern 1 */}
          <div
            className={animated ? 'animate-rotate-rays-1' : ''}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              margin: '-100vmax',
              width: '200vmax',
              height: '200vmax',
              opacity: 0.45,
              background: `
                conic-gradient(
                  from 20deg at 50% 50%,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), transparent,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 1), transparent,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), transparent,
                  rgba(3, 10, 0, 0.1)
                ),
                conic-gradient(
                  from 30deg at 50% 50%,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), transparent,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 1), transparent,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), transparent,
                  rgba(3, 10, 0, 0.1)
                ),
                conic-gradient(
                  from 40deg at 50% 50%,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), transparent,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 1), transparent,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), transparent,
                  rgba(3, 10, 0, 0.1)
                )
              `,
              backgroundBlendMode: 'exclusion, hard-light, overlay',
              mixBlendMode: 'hard-light',
              WebkitMaskImage:
                'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 1%, rgba(0, 0, 0, .7) 5%, rgba(0, 0, 0, .5) 10%, rgba(0, 0, 0, .3) 22%, rgba(0, 0, 0, .15) 35%, transparent 50%)',
              maskImage:
                'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 1%, rgba(0, 0, 0, .7) 5%, rgba(0, 0, 0, .5) 10%, rgba(0, 0, 0, .3) 22%, rgba(0, 0, 0, .15) 35%, transparent 50%)',
              animationDuration: `${10 / animationSpeed}s`,
            }}
          />

          {/* After pseudo element - Light rays pattern 2 */}
          <div
            className={animated ? 'animate-rotate-rays-2' : ''}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              margin: '-100vmax',
              width: '200vmax',
              height: '200vmax',
              opacity: 0.45,
              background: `
                conic-gradient(
                  from 0deg at 50% 50%,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.5), rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.5), rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.5), rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.5), rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.5)
                ),
                conic-gradient(
                  from 30deg at 50% 50%,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), transparent,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 1), transparent,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.68), transparent,
                  rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), transparent,
                  rgba(3, 10, 0, 0.1)
                ),
                conic-gradient(
                  from -20deg at 50% 50%,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.5), rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.5), rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.5), rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.5), rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.5)
                ),
                conic-gradient(
                  from -35deg at 50% 50%,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.5), rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.5), rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.5), rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 1), rgba(3, 10, 0, 0.5), transparent,
                  rgba(3, 10, 0, 0.5), rgba(3, 10, 0, 0.1), transparent,
                  rgba(3, 10, 0, 0.5)
                )
              `,
              backgroundBlendMode: 'exclusion, exclusion, difference, exclusion',
              mixBlendMode: 'color-burn',
              WebkitMaskImage:
                'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 1%, rgba(0, 0, 0, .7) 5%, rgba(0, 0, 0, .5) 10%, rgba(0, 0, 0, .3) 22%, rgba(0, 0, 0, .15) 35%, transparent 50%)',
              maskImage:
                'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 1%, rgba(0, 0, 0, .7) 5%, rgba(0, 0, 0, .5) 10%, rgba(0, 0, 0, .3) 22%, rgba(0, 0, 0, .15) 35%, transparent 50%)',
              animationDuration: `${6 / animationSpeed}s`,
              animationDelay: `${10 / animationSpeed}s`,
            }}
          />
        </div>

        {/* Color Rays */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            transition: 'all 300ms ease',
            mixBlendMode: isLightTheme ? 'hard-light' : 'hard-light',
            opacity: opacity,
            filter: `blur(${blurAmount}px)`,
            WebkitMaskImage:
              'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 6%, rgba(0, 0, 0, .7) 11%, rgba(0, 0, 0, .5) 18%, rgba(0, 0, 0, .3) 26%, rgba(0, 0, 0, .15) 35%, transparent 70%)',
            maskImage:
              'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 6%, rgba(0, 0, 0, .7) 11%, rgba(0, 0, 0, .5) 18%, rgba(0, 0, 0, .3) 26%, rgba(0, 0, 0, .15) 35%, transparent 70%)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        >
          {/* Color Rays Before */}
          <div
            className={animated ? 'animate-color-rays' : ''}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              background: `conic-gradient(
                from 90deg at 50% 50%,
                ${colors.purple},
                ${colors.yellow},
                ${colors.pink},
                ${colors.teal},
                ${colors.blue},
                ${colors.purple}
              )`,
              WebkitMaskImage:
                'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, .9) 5%, rgba(0, 0, 0, .7) 13%, rgba(0, 0, 0, .5) 22%, rgba(0, 0, 0, .3) 29%, rgba(0, 0, 0, .15) 37%, transparent 46%)',
              maskImage:
                'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, .9) 5%, rgba(0, 0, 0, .7) 13%, rgba(0, 0, 0, .5) 22%, rgba(0, 0, 0, .3) 29%, rgba(0, 0, 0, .15) 37%, transparent 46%)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              filter: `blur(${blurAmount * 1.5}px)`,
              mixBlendMode: isLightTheme ? 'overlay' : 'color-dodge',
              animationDuration: `${5.5 / animationSpeed}s, ${8 / animationSpeed}s`,
            }}
          />

          {/* Color Rays After */}
          <div
            className={animated ? 'animate-color-rays-reverse' : ''}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: '-1.5%',
              left: 0,
              WebkitMaskImage:
                'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, .9) 9%, rgba(0, 0, 0, .7) 17%, rgba(0, 0, 0, .5) 25%, rgba(0, 0, 0, .3) 33%, rgba(0, 0, 0, .15) 41%, transparent 50%)',
              maskImage:
                'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, .9) 9%, rgba(0, 0, 0, .7) 17%, rgba(0, 0, 0, .5) 25%, rgba(0, 0, 0, .3) 33%, rgba(0, 0, 0, .15) 41%, transparent 50%)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              filter: `blur(${blurAmount * 0.5}px)`,
              mixBlendMode: isLightTheme ? 'hard-light' : 'multiply',
              animationDuration: `${80 / animationSpeed}s`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full">{children}</div>

      <style jsx>{`
        @keyframes rotateRays1 {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateRays2 {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes colorRays {
          0% {
            filter: hue-rotate(0deg) blur(${blurAmount * 1.5}px);
          }
          100% {
            filter: hue-rotate(360deg) blur(${blurAmount * 1.5}px);
          }
        }

        @keyframes colorRaysReverse {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        .animate-rotate-rays-1 {
          animation: rotateRays1 10s linear infinite;
        }

        .animate-rotate-rays-2 {
          animation: rotateRays2 6s linear 10s infinite;
        }

        .animate-color-rays {
          animation: colorRays 5.5s linear infinite, colorRaysReverse 8s linear infinite;
        }

        .animate-color-rays-reverse {
          animation: colorRaysReverse 80s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RaysBackground;
