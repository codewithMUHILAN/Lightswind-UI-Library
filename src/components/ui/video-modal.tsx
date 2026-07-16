"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlayCircle, VideoIcon, X } from "lucide-react";
import { cn } from "@/components/lib/utils";

type SlideInStyle =
  | "bottom"
  | "center"
  | "top"
  | "left"
  | "right"
  | "fade"
  | "slide-up-fade-out"
  | "slide-left-fade-out";

interface VideoModalProps {
  sourceUrl: string;
  previewImage: string;
  previewAlt?: string;
  transition?: SlideInStyle;
  containerClass?: string;
}

const slideVariants = {
  bottom: {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  center: {
    initial: { scale: 0.7, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.7, opacity: 0 },
  },
  top: {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  left: {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  right: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "slide-up-fade-out": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "slide-left-fade-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
};

export function VideoModal({
  sourceUrl,
  previewImage,
  previewAlt = "Preview thumbnail",
  transition = "center",
  containerClass,
}: VideoModalProps) {
  const [open, setOpen] = useState(false);
  const variant = slideVariants[transition];

  return (
    <div className={cn("relative", containerClass)}>
      {/* Preview Area */}
      <div
        role="button"
        className="group relative overflow-hidden rounded-xl border  shadow-lg 
        transition-all cursor-pointer h-64 object-cover bg-black/60 inset-0 "
        onClick={() => setOpen(true)}
      >
        <img
          src={previewImage}
          alt={previewAlt}
          className="w-full object-cover transition duration-200 group-hover:brightness-75 
          "
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <VideoIcon className="text-white size-12 transition-transform group-hover:scale-110" />
          </div>
        </div>
      </div>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex 
            items-center justify-center 
            bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeOverlay}
          >
            <motion.div
              {...variant}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative mx-4 w-full max-w-5xl h-[70vh]"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-14 right-0 z-50 
                rounded-full bg-black/70 p-2 text-white hover:bg-black/90"
              >
                <X className="size-5" />
              </button>

              <div className="w-full h-full overflow-hidden rounded-2xl border shadow-2xl">
                <iframe
                  src={sourceUrl}
                  allowFullScreen
                  className="w-full h-full rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Background fade animation for modal
const fadeOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
