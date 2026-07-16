// import React, { useRef, useState, useEffect } from 'react';
// import { motion, useScroll, useTransform } from 'framer-motion';

// // --- Constants ---
// const SLIDE_COUNT = 8;
// const SLIDE_REM_WIDTH = 18; // w-72 (18rem)
// const SLIDE_MARGIN_REM = 2; // m-4 on both sides (2rem)
// const PIXELS_PER_REM = 16;
// const SCROLL_HEIGHT_VH = 400; // Vertical scroll duration (400vh)

// const SLIDE_DATA = [
//   { id: 1, text: "Slide One", color: "bg-orange-500" },
//   { id: 2, text: "Slide Two", color: "bg-red-500" },
//   { id: 3, text: "Slide Three", color: "bg-violet-500" },
//   { id: 4, text: "Slide Four", color: "bg-primarylw" },
//   { id: 5, text: "Slide Five", color: "bg-teal-500" },
//   { id: 6, text: "Slide Six", color: "bg-yellow-500" },
//   { id: 7, text: "Slide Seven", color: "bg-fuchsia-500" },
//   { id: 8, text: "Slide Eight", color: "bg-green-500" },
// ];

// /**
//  * Renders a single 3D rotating slide, driven by the parent's scroll motion.
//  * @param {object} props - Component props
//  * @param {number} positionIndex - The index of the slide (0 to 7)
//  * @param {string} content - Text content for the slide
//  * @param {string} colorClass - Tailwind background color class
//  * @param {motion.MotionValue<number>} scrollX - The horizontal scroll offset of the track
//  */
// const Slide = ({ positionIndex, content, colorClass, scrollX }) => {
//   const slideRef = useRef(null);

//   // Total width of one slide block including its margin
//   const slideBlockWidthPx = (SLIDE_REM_WIDTH + SLIDE_MARGIN_REM * 2) * PIXELS_PER_REM;
  
//   // Calculate the position of the slide's center point (relative to the track start)
//   const slideCenterPositionPx = (positionIndex * slideBlockWidthPx) + (slideBlockWidthPx / 2);
  
//   // Define the effective scroll window for the 3D effect
//   const WINDOW_SIZE_PX = 900; 

//   // --- Framer Motion Mappings ---

//   // 1. Calculate the distance from the slide's center to the current scroll offset.
//   const distance = useTransform(scrollX, (x) => {
//     // Current viewport center relative to the un-translated track position
//     const viewportCenter = window.innerWidth / 2;
//     // Current slide center position in the viewport (before track translation is applied)
//     const currentCenter = slideCenterPositionPx;
    
//     // We want distance = 0 when the slide is in the viewport center.
//     // The track moves by 'x' (negative).
//     // The slide's position in the viewport is currentCenter + x.
//     return (currentCenter + x) - viewportCenter; 
//   });

//   // 2. Map distance to Rotation (rotateY)
//   const rotateY = useTransform(
//     distance,
//     [-WINDOW_SIZE_PX, 0, WINDOW_SIZE_PX],
//     ["-45deg", "0deg", "45deg"]
//   );

//   // 3. Map distance to Scale
//   const scale = useTransform(
//     distance,
//     [-WINDOW_SIZE_PX, 0, WINDOW_SIZE_PX],
//     [0.5, 1.25, 0.65] // 3D perspective effect
//   );

//   // 4. Map distance to TranslateZ (Depth)
//   const translateZ = useTransform(
//     distance,
//     [-WINDOW_SIZE_PX, 0, WINDOW_SIZE_PX],
//     [64, 16, 64] // In pixels (4em -> 1em -> 4em)
//   );

//   // 5. Map distance to Opacity (Fade)
//   const opacity = useTransform(
//     distance,
//     [-WINDOW_SIZE_PX / 2, 0, WINDOW_SIZE_PX / 2],
//     [0.2, 1, 0.2]
//   );
  
//   // 6. Fade effect for the content wrapper (inner text)
//   const innerOpacity = useTransform(
//     distance,
//     [-WINDOW_SIZE_PX / 4, 0, WINDOW_SIZE_PX / 4],
//     [0, 1, 0]
//   );

//   // Style for the sliding element to achieve the initial offset and sizing
//   const slideStyle = {
//     flexShrink: 0, 
//     width: `${SLIDE_REM_WIDTH}rem`,
//     height: '100%',
//     margin: `0 ${SLIDE_MARGIN_REM}rem`, // Adjusted margin for calculation
//     perspective: '40em', 
//     transformOrigin: 'center center',
//     position: 'relative',
//     // We rely on the order of elements in the DOM for z-index effect here.
//   };

//   return (
//     <motion.div ref={slideRef} style={slideStyle}>
//       {/* The main content box that rotates */}
//       <motion.div
//         className={`content h-full w-full rounded-xl relative shadow-xl ${colorClass}`}
//         style={{
//           transformStyle: 'preserve-3d',
//           transform: `
//             rotateY(${rotateY}) 
//             translateZ(${translateZ}px) 
//             scale(${scale})
//           `,
//           opacity: opacity,
//         }}
//       >
//         <div className="content-wrapper absolute inset-0 flex items-center justify-center p-4">
//           <motion.div 
//             className="text-white text-xl font-extrabold text-center uppercase" 
//             style={{ opacity: innerOpacity }}
//           >
//             {content}
//           </motion.div>
//         </div>
        
//         {/* Reflection/Shadow beneath the box (using CSS pseudo-element logic) */}
//         {/* Use a simple black gradient to simulate the fade/shadow */}
//         <div className="absolute top-full left-0 w-full h-1/2 overflow-hidden [transform:rotateX(180deg)] [transform-origin:top]">
//              <div className="absolute inset-0 [transform:rotateX(180deg)] [transform-origin:top]"
//              style={{
//                 background: `linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,1) 100%)`,
//                 opacity: opacity,
//              }}>
//              </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// /**
//  * --- Main Pinned Carousel Component ---
//  * Creates a vertical scroll container (400vh) that pins the viewport and maps
//  * vertical scroll progress to horizontal translation, creating a 3D horizontal carousel effect.
//  */
// const ScrollSnapCarouselPin = () => {
//   const containerRef = useRef(null);
//   const trackRef = useRef(null);
  
//   // State for responsive calculation
//   const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     const handleResize = () => setViewportWidth(window.innerWidth);
//     window.addEventListener('resize', handleResize);
//     // Ensure cleanup function runs when component unmounts
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // 1. Get vertical scroll progress of the component container
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"]
//   });

//   // Calculate the required horizontal distance to scroll
//   const slideBlockWidthPx = (SLIDE_REM_WIDTH + SLIDE_MARGIN_REM * 2) * PIXELS_PER_REM;
//   const totalContentWidth = SLIDE_COUNT * slideBlockWidthPx;
  
//   // Starting point X: Position to center the first slide
//   // End point X: Position to center the last slide
//   const startX = (viewportWidth / 2) - (slideBlockWidthPx / 2);
//   const endX = (viewportWidth / 2) - (totalContentWidth - (slideBlockWidthPx / 2));
  
//   // 2. Map vertical scroll progress (0 to 1) to horizontal translation
//   const x = useTransform(scrollYProgress, [0, 1], [startX, endX]);

//   return (
//     // 3. Outer Wrapper: Gives the large vertical scroll height (400vh)
//     <div 
//       ref={containerRef} 
//       className="relative z-10 w-full"
//       // Height set dynamically to ensure scroll lock
//       style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
//     >
//       {/* 4. Pinning Container: Fixed view that holds the carousel */}
//       <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-gray-950 p-4">
//         <h2 className="absolute top-10 text-2xl font-bold text-white z-20">
//           Scroll Down to View 3D Carousel
//         </h2>
        
//         {/* Carousel Viewport */}
//         <div className="w-full h-[60vh] overflow-visible perspective-[1000px] relative">
          
//           {/* 5. Horizontal Track: This element moves horizontally */}
//           <motion.div
//             ref={trackRef}
//             className="flex items-center h-full absolute"
//             style={{ x }}
//           >
//             {SLIDE_DATA.map((slide, index) => (
//               <Slide
//                 key={slide.id}
//                 positionIndex={index}
//                 content={slide.text}
//                 colorClass={slide.color}
//                 scrollX={x}
//               />
//             ))}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScrollSnapCarouselPin;
