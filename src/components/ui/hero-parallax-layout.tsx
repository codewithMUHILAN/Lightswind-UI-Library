"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/components/lib/utils";

export interface HeroParallaxCard {
  title: string;
  link: string;
  thumbnail: string;
}

export interface HeroParallaxProps {
  products: HeroParallaxCard[];
}

/**
 * HeroParallaxLayout
 *
 * An advanced scrolling 3D layout pattern showcasing products or images tilted in 3D-space, 
 * which dynamically levels to a flat, readable surface as you scroll down.
 */
export const HeroParallaxLayout = ({ products, containerRef }: HeroParallaxProps & { containerRef?: React.RefObject<any> }) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        
        <motion.div className="flex flex-row space-x-20 mb-20">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>

        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold text-foreground">
        The Ultimate <br /> Product Suite
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-neutral-500">
        We build premium design engineering frameworks merging beautiful animations with highly functional math. Browse the catalogue natively as you scroll past.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: HeroParallaxCard;
  translate: any;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <div className="block group-hover/product:shadow-2xl h-full w-full rounded-2xl overflow-hidden cursor-pointer border border-border/10 bg-muted/20 absolute inset-0">
        {/* Render image */}
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full opacity-80 group-hover/product:opacity-100 transition-opacity"
          alt={product.title}
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-100 bg-black/50 pointer-events-none transition-opacity" />
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-bold text-xl pointer-events-none transition-opacity">
        {product.title}
      </h2>
    </motion.div>
  );
};
