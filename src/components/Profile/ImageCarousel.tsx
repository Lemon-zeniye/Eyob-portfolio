import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs"

interface ImageCarouselProps {
  images: string[]
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-lg">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={images[currentIndex]}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          custom={direction}
          initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute w-full h-full object-cover rounded-lg"
        />
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black/20 py-1 text-black rounded-r"
      >
        <BsChevronCompactLeft />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black/20 text-black py-1 rounded-l"
      >
        <BsChevronCompactRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1)
              setCurrentIndex(i)
            }}
            className={`w-2 h-2 rounded-full ${
              i === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
