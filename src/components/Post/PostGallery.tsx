import { PostCom } from "@/Types/post.type";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.webp";
import image3 from "../../assets/image3.webp";

interface PostCardProps {
  post: PostCom;
  index: number;
}

const PostGallery: React.FC<PostCardProps> = ({ post, index }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const postImages = [image1, image2, image3];
  //   postImages

  const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const nextImage = (): void => {
    setCurrentImageIndex((prev) => (prev + 1) % (postImages.length - 1));
  };

  const prevImage = (): void => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + (postImages.length - 1)) % (postImages.length - 1)
    );
  };

  // Get the current and next image for display
  const currentImages = [
    postImages[currentImageIndex],
    postImages[(currentImageIndex + 1) % postImages.length],
  ].filter(Boolean); // Filter out undefined if odd number of images

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="overflow-hidden  bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-full bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {currentImages.map((image, idx) => (
            <div key={idx} className="aspect-[4/3] relative">
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={
                  image ||
                  `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(
                    post.postTitle || "Post Image"
                  )}`
                }
                alt={post.postTitle || "Post"}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Multiple Image Indicators */}
        {postImages.length > 2 && (
          <>
            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
              {Array.from({
                length: Math.ceil(postImages.length / 2),
              }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === Math.floor(currentImageIndex / 2)
                      ? "bg-white"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows (shown on hover) */}
            {isHovered && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                >
                  <FaChevronLeft className="h-5 w-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                >
                  <FaChevronRight className="h-5 w-5" />
                </motion.button>
              </>
            )}
          </>
        )}
      </div>

      {/* Post Content */}
    </motion.div>
  );
};

export default PostGallery;
