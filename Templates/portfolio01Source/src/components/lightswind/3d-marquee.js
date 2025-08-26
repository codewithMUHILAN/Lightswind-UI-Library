"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
export const ThreeDMarquee = ({ images, className = "", cols = 4, onImageClick, }) => {
    // Clone the image list twice
    const duplicatedImages = [...images, ...images];
    const groupSize = Math.ceil(duplicatedImages.length / cols);
    const imageGroups = Array.from({ length: cols }, (_, index) => duplicatedImages.slice(index * groupSize, (index + 1) * groupSize));
    const handleImageClick = (image, globalIndex) => {
        if (onImageClick) {
            onImageClick(image, globalIndex);
        }
        else if (image.href) {
            window.open(image.href, image.target || "_self");
        }
    };
    return (_jsx("section", { className: `mx-auto block h-[600px] max-sm:h-[400px] 
        overflow-hidden rounded-2xl bg-white dark:bg-black ${className}`, children: _jsx("div", { className: "flex w-full h-full items-center justify-center", style: {
                transform: "rotateX(55deg) rotateY(0deg) rotateZ(45deg)",
            }, children: _jsx("div", { className: "w-full overflow-hidden scale-90 sm:scale-100", children: _jsx("div", { className: `relative grid h-full w-full origin-center 
              grid-cols-2 sm:grid-cols-${cols} gap-4 transform 
              `, children: imageGroups.map((imagesInGroup, idx) => (_jsxs(motion.div, { animate: { y: idx % 2 === 0 ? 100 : -100 }, transition: {
                            duration: idx % 2 === 0 ? 10 : 15,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }, className: "flex flex-col items-center gap-6 relative", children: [_jsx("div", { className: "absolute left-0 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" }), imagesInGroup.map((image, imgIdx) => {
                                const globalIndex = idx * groupSize + imgIdx;
                                const isClickable = image.href || onImageClick;
                                return (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700" }), _jsx(motion.img, { whileHover: { y: -10 }, transition: { duration: 0.3, ease: "easeInOut" }, src: image.src, alt: image.alt, width: 970, height: 700, className: `aspect-[970/700] w-full max-w-[200px] rounded-lg object-cover ring ring-gray-300/30 dark:ring-gray-800/50 shadow-xl hover:shadow-2xl transition-shadow duration-300 ${isClickable ? "cursor-pointer" : ""}`, onClick: () => handleImageClick(image, globalIndex) })] }, `img-${imgIdx}`));
                            })] }, `column-${idx}`))) }) }) }) }));
};
