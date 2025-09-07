import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  forwardRef,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LucideIcon } from "lucide-react";

// Assuming these are external, import them
import { cn } from "../lib/utils";

gsap.registerPlugin(ScrollTrigger);

// --- Component Props and Types ---
// Define a type for a single feature object
export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
}

// Define the component's props interface
export interface ScrollCarouselProps {
  features: FeatureItem[];
  className?: string; // To allow external classes
  maxScrollHeight?: number; // New optional prop for max scroll height
}

// --- Custom Hook for Animations ---
const useFeatureAnimations = (
  containerRef: React.RefObject<HTMLDivElement>,
  scrollContainerRef: React.RefObject<HTMLDivElement>,
  scrollContainerRef2: React.RefObject<HTMLDivElement>,
  progressBarRef: React.RefObject<HTMLDivElement>,
  cardRefs: React.MutableRefObject<HTMLDivElement[]>,
  cardRefs2: React.MutableRefObject<HTMLDivElement[]>,
  isDesktop: boolean,
  maxScrollHeight?: number
) => {
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Desktop horizontal scroll logic
      if (isDesktop) {
        const scrollWidth1 = scrollContainerRef.current?.scrollWidth || 0;
        const scrollWidth2 = scrollContainerRef2.current?.scrollWidth || 0;
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const cardWidth = cardRefs.current[0]?.offsetWidth || 0;
        const viewportOffset = (containerWidth - cardWidth) / 2;

        const finalOffset1 = scrollWidth1 - containerWidth + viewportOffset;
        const finalOffset2 = scrollWidth2 - containerWidth + viewportOffset;

        // Use the provided maxScrollHeight or the calculated offset as the scroll distance
        const scrollDistance = maxScrollHeight || finalOffset1;

        gsap.set(scrollContainerRef2.current, {
          x: -finalOffset2 + viewportOffset * 2,
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: () => `+=${scrollDistance}`,
              scrub: 1,
              pin: true,
            },
          })
          .fromTo(
            scrollContainerRef.current,
            { x: viewportOffset },
            { x: -finalOffset1 + viewportOffset, ease: "none" }
          );

        gsap
          .timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: () => `+=${scrollDistance}`,
              scrub: 1,
            },
          })
          .to(scrollContainerRef2.current, { x: viewportOffset, ease: "none" });

        gsap.to(progressBarRef.current, {
          width: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: true,
          },
        });
      } else {
        // Mobile vertical scroll logic
        const allCards = [...cardRefs.current, ...cardRefs2.current];
        allCards.forEach((card, index) => {
          if (card) {
            gsap.fromTo(
              card,
              {
                opacity: 0,
                x: index % 2 === 0 ? -200 : 200,
              },
              {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 0%",
                  toggleActions: "play none none none",
                  once: true,
                },
              }
            );
          }
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isDesktop, maxScrollHeight]);
};

// --- Component Definition ---
export const ScrollCarousel = forwardRef<HTMLDivElement, ScrollCarouselProps>(
  ({ features, className, maxScrollHeight }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef2 = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<HTMLDivElement[]>([]);
    const cardRefs2 = useRef<HTMLDivElement[]>([]);
    const [isDesktop, setIsDesktop] = useState(false);

    // Dynamic sorting for the second row of cards
    const features2 = [...features].sort(() => Math.random() - 0.5);

    useEffect(() => {
      const checkDesktop = () => {
        setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
      };
      checkDesktop();
      window.addEventListener("resize", checkDesktop);
      return () => window.removeEventListener("resize", checkDesktop);
    }, []);

    useFeatureAnimations(
      containerRef,
      scrollContainerRef,
      scrollContainerRef2,
      progressBarRef,
      cardRefs,
      cardRefs2,
      isDesktop,
      maxScrollHeight
    );

    const renderFeatureCards = (
      featureSet: FeatureItem[],
      refs: React.MutableRefObject<HTMLDivElement[]>
    ) =>
      featureSet.map((feature, index) => (
        <div
          key={index}
          ref={(el: HTMLDivElement | null) => {
            if (el) refs.current[index] = el;
          }}
          className="feature-card flex-shrink-0 w-full md:w-full  h-full
          z-10 gap-4  group relative transition-all duration-300 ease-in-out"
        >
          <div
            className={cn(
              `relative h-full p-4 lg:p-8 rounded-3xl backdrop-blur-sm 
              flex items-center justify-center z-10 
              transition-all duration-300 my-4`,
              `backdrop-blur-lg border text-black dark:text-white`,
              "group-hover:scale-105 centered:scale-105"
            )}
          >
            <img
              src={
                feature.image ||
                "https://images.pexels.com/photos/9934462/pexels-photo-9934462.jpeg"
              }
              alt=""
              className="absolute inset-0 w-full h-full 
              object-cover z-[-1] rounded-3xl "
            />
            {/* <RippleLoader className="!absolute z-[-1]" icon={feature.icon} /> */}
            <div className="absolute bottom-4 z-10 w-full px-4">
              <div
                className={cn(
                  `flex flex-col justify-end h-full opacity-100 translate-y-4 transition-all duration-300 ease-out text-center`
                )}
              >
                <h3 className="text-2xl mb-0 font-bold text-white transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-white text-xs mb-4 opacity-60">
                  {feature.description}
                </p>
                {/* <img
                  src={feature.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover z-[-1] rounded-3xl blur-[5px]"
                /> */}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-black/5 dark:group-hover:bg-white/5 centered:bg-black/5 dark:centered:bg-white/5 rounded-2xl group-hover:blur-md" />
          </div>
        </div>
      ));

    return (
      <section
        className={cn(
          "bg-transparent text-foreground relative overflow-hidden",
          className
        )}
        ref={ref}
      >
        <div
          ref={containerRef}
          className="relative overflow-hidden md:h-screen md:py-20 
          flex flex-col gap-0 z-10 
          lg:[mask-image:_linear-gradient(to_right,transparent_0,_black_5%,_black_95%,transparent_100%)]"
        >
          <div
            ref={scrollContainerRef}
            className="flex flex-col md:flex-row gap-8 
            items-center h-full px-6 md:px-0"
          >
            {renderFeatureCards(features, cardRefs)}
          </div>

          <div
            ref={scrollContainerRef2}
            className="flex flex-col md:flex-row gap-8 items-center h-full px-6 md:px-0 hidden xl:flex"
          >
            {renderFeatureCards(features2, cardRefs2)}
          </div>

          {isDesktop && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-2 bg-black/30 dark:bg-white/30 z-50 overflow-hidden rounded-full">
              <div
                ref={progressBarRef}
                className="h-full rounded-full relative overflow-hidden transition-all duration-100"
                style={{ width: "0%" }}
              >
                <div className="absolute inset-0 animated-water" />
              </div>
            </div>
          )}
        </div>
        <style jsx>{`
          .animated-water {
            background: repeating-linear-gradient(
              -45deg,
              rgba(0, 0, 0, 0.7) 0%,
              rgba(0, 0, 0, 0.5) 25%,
              rgba(0, 0, 0, 0.7) 50%
            );
            background-size: 40px 40px;
            animation: waveMove 2s linear infinite;
          }
          :global(.dark) .animated-water {
            background: repeating-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 255, 255, 0.6) 25%,
              rgba(255, 255, 255, 0.9) 50%
            );
          }
          @keyframes waveMove {
            from {
              background-position: 0 0;
            }
            to {
              background-position: 40px 40px;
            }
          }
        `}</style>
      </section>
    );
  }
);

ScrollCarousel.displayName = "ScrollCarousel";

export default ScrollCarousel;
