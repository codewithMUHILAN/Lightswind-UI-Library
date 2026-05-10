import React, { useLayoutEffect } from 'react';

declare global {
  interface Window {
    particlesJS: any;
  }
}

interface ParticlesBackgroundProps {
  colors?: string[];
  size?: number;
  countDesktop?: number;
  countTablet?: number;
  countMobile?: number;
  zIndex?: number;
  height?: string;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  colors = ['#ff223e', '#5d1eb2', '#ff7300'],
  size = 3,
  countDesktop = 60,
  countTablet = 50,
  countMobile = 40,
  zIndex = 0,
  height = '100vh',
}) => {
  useLayoutEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
    script.onload = () => {
      const particlesElement = document.getElementById('js-particles');
      if (particlesElement && window.particlesJS) {
        const getParticleCount = () => {
          const screenWidth = window.innerWidth;
          if (screenWidth > 1024) return countDesktop;
          if (screenWidth > 768) return countTablet;
          return countMobile;
        };

        window.particlesJS('js-particles', {
          particles: {
            number: {
              value: getParticleCount(),
            },
            color: {
              value: colors,
            },
            shape: {
              type: 'circle',
            },
            opacity: {
              value: 1,
              random: false,
            },
            size: {
              value: size,
              random: true,
            },
            line_linked: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 2,
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
            },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: false,
              },
              onclick: {
                enable: false,
              },
              resize: true,
            },
          },
          retina_detect: true,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [colors, size, countDesktop, countTablet, countMobile]);

  return (
    <div
      id="js-particles"
      style={{
        width: '100%',
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: zIndex,
        pointerEvents: 'none',
      }}
    >
      <style>{`
        #js-particles canvas {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particles-js-canvas-el {
          position: absolute;
        }

        .particles-js-canvas-el circle {
          fill: currentColor;
          filter: url(#glow);
        }
      `}</style>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default ParticlesBackground;
