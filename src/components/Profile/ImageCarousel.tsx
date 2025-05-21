import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

interface ImageCarouselProps {
  images: string[];
  aspectRatio?: "square" | "landscape";
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  aspectRatio = "landscape",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isSingleImage = images.length <= 1;
  const heightClass = aspectRatio === "square" ? "h-full" : "h-40 sm:h-40";

  const goToPrevious = () => {
    if (isSingleImage) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (isSingleImage) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden rounded-lg bg-gray-100`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={images[currentIndex]}
          custom={direction}
          initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {!isSingleImage && (
        <>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 backdrop-blur-sm text-white shadow-sm"
          >
            <BsChevronCompactLeft size={20} />
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 backdrop-blur-sm text-white shadow-sm"
          >
            <BsChevronCompactRight size={20} />
          </motion.button>
        </>
      )}

      {/* Dots Indicator */}
      {!isSingleImage && (
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? "bg-white w-4" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ImageCarousel;
