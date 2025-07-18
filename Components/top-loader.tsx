"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface TopLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the loader is currently active */
  isLoading?: boolean;
  /** The color of the loader bar */
  color?: string;
  /** The height of the loader bar in pixels */
  height?: number;
  /** The speed of the loader animation in milliseconds */
  speed?: number;
  /** Whether to show the spinner */
  showSpinner?: boolean;
  /** The easing function for the animation */
  easing?: string;
  /** The minimum percentage to start at */
  minimum?: number;
  /** The parent element to render the loader in */
  parent?: string;
  /** Whether to automatically increment the loader */
  trickle?: boolean;
  /** How much to increase during trickle */
  trickleRate?: number;
  /** How often to trickle in milliseconds */
  trickleSpeed?: number;
  /** Custom template for the loader */
  template?: string;
  /** Z-index for the loader elements */
  zIndex?: number;
  /** Current progress value (0-1) */
  progress?: number;
}

const TopLoader = React.forwardRef<HTMLDivElement, TopLoaderProps>(
  ({
    isLoading = false,
    color = "#33C3F0",
    height = 4,
    speed = 200,
    showSpinner = true,
    easing = "ease",
    minimum = 0.08,
    parent = "body",
    trickle = true,
    trickleRate = 0.02,
    trickleSpeed = 800,
    zIndex = 1031,
    progress,
    className,
    ...props
  }, ref) => {
    const [mounted, setMounted] = React.useState(false);
    const [currentProgress, setCurrentProgress] = React.useState(0);
    const progressRef = React.useRef<number>(0);
    const isStartedRef = React.useRef<boolean>(false);
    const requestRef = React.useRef<number | null>(null);
    const loaderIdRef = React.useRef<string>(`top-loader-${Math.random().toString(36).substring(2, 9)}`);

    // CSS styles for the loader
    const styles = React.useMemo(() => {
      return {
        container: {
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: `${height}px`,
          zIndex: zIndex,
        } as React.CSSProperties,
        bar: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: color,
          boxShadow: `0 0 15px ${color}, 0 0 8px ${color}`,
          transition: `transform ${speed}ms ${easing}`,
          transform: `translate3d(-${100 - (currentProgress * 100)}%, 0, 0)`,
          zIndex: zIndex,
        } as React.CSSProperties,
        spinner: {
          display: showSpinner ? 'block' : 'none',
          position: 'fixed',
          top: '15px',
          right: '15px',
          width: '18px',
          height: '25px',
          boxSizing: 'border-box',
          border: 'solid 2px transparent',
          borderTopColor: color,
          borderLeftColor: color,
          borderRadius: '50%',
          animation: 'top-loader-spinner 400ms linear infinite',
          zIndex: zIndex,
        } as React.CSSProperties,
      };
    }, [color, currentProgress, easing, height, showSpinner, speed, zIndex]);

    // Helper functions
    const clamp = (n: number, min: number, max: number): number => {
      if (n < min) return min;
      if (n > max) return max;
      return n;
    };

    const set = React.useCallback((n: number) => {
      n = clamp(n, minimum, 1);
      progressRef.current = n;
      setCurrentProgress(n);
      
      if (n === 1) {
        setTimeout(() => {
          setCurrentProgress(0);
          isStartedRef.current = false;
        }, speed);
      } else {
        isStartedRef.current = true;
      }
    }, [minimum, speed]);

    const inc = React.useCallback((amount?: number) => {
      let n = progressRef.current;
      
      if (!isStartedRef.current) {
        set(minimum);
        return;
      }
      
      if (typeof amount !== 'number') {
        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
      }
      
      n = clamp(n + amount, 0, 0.994);
      set(n);
    }, [minimum, set]);

    const trickleFunction = React.useCallback(() => {
      inc(trickleRate * Math.random());
    }, [inc, trickleRate]);

    React.useEffect(() => {
      if (!mounted) return;
      
      if (progress !== undefined) {
        set(progress);
        return;
      }
      
      if (isLoading && trickle) {
        const tick = () => {
          if (!isLoading) return;
          trickleFunction();
          requestRef.current = window.setTimeout(() => {
            if (requestRef.current) {
              tick();
            }
          }, trickleSpeed);
        };
        
        tick();
        
        return () => {
          if (requestRef.current) {
            window.clearTimeout(requestRef.current);
            requestRef.current = null;
          }
        };
      }
    }, [isLoading, mounted, progress, set, trickle, trickleFunction, trickleSpeed]);

    React.useEffect(() => {
      setMounted(true);
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes top-loader-spinner {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
        if (requestRef.current) {
          window.clearTimeout(requestRef.current);
        }
      };
    }, []);

    React.useEffect(() => {
      if (!mounted) return;
      
      if (isLoading) {
        if (currentProgress === 0) {
          set(minimum);
        }
      } else if (currentProgress > 0) {
        set(1);
      }
    }, [isLoading, mounted, currentProgress, minimum, set]);

    if (!mounted) {
      return null;
    }

    if (!isLoading && currentProgress === 0) {
      return null;
    }

    return (
      <div
        id={loaderIdRef.current}
        ref={ref}
        className={cn("top-loader", className)}
        style={styles.container}
        {...props}
        role="progressbar"
        aria-busy={isLoading}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(currentProgress * 100)}
      >
        <div className="top-loader-bar" style={styles.bar} />
        {showSpinner && <div className="top-loader-spinner" style={styles.spinner} />}
      </div>
    );
  }
);

TopLoader.displayName = "TopLoader";

export { TopLoader };
