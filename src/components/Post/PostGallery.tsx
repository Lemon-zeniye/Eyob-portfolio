import { formatImageUrl, formatImageUrls } from "@/lib/utils";
import { PostCom } from "@/Types/post.type";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import * as Dialog from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { X } from "lucide-react";

interface PostCardProps {
  post: PostCom;
  index: number;
}

const PostGallery: React.FC<PostCardProps> = ({ post, index }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  // const postImages = [image1, image2, image3, image4, image5, image6];
  const [postImages, setPostImages] = useState<string | string[]>("");

  //   postImages

  const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const nextImage = (): void => {
    setCurrentImageIndex((prev) => (prev + 1) % postImages.length);
  };

  const prevImage = (): void => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + postImages.length) % postImages.length
    );
  };

  useEffect(() => {
    const postImages = formatImageUrls(post?.postPictures);
    setPostImages(postImages);
  }, [post]);

  const [openFullScreen, setOpenFullScreen] = useState(false);

  const currentImages = [postImages[currentImageIndex]].filter(Boolean);

  return (
    <>
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
        <div className="relative">
          <div className="h-[400px] md:h-[600px] w-full max-w-[600px] mx-auto">
            {currentImages.map((image, idx) => (
              <div
                key={idx}
                className="h-full"
                onClick={() => setOpenFullScreen(true)}
              >
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
          {postImages.length > 1 && (
            <>
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
                {Array.from({
                  length: Math.ceil(postImages.length),
                }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx === Math.floor(currentImageIndex)
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
      {/* to show image in full screen */}
      <Dialog.Root open={openFullScreen} onOpenChange={setOpenFullScreen}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
            onClick={() => {
              setOpenFullScreen(false);
            }}
          />
          <Dialog.Content className="fixed inset-0 mx-auto z-50 w-full md:w-[50%] flex items-center justify-center focus:outline-none">
            <div className="relative w-full max-w-3xl max-h-screen  mx-auto">
              <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={
                          post?.userPicturePath &&
                          formatImageUrl(post.userPicturePath)
                        }
                        alt="User"
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {post?.postOwner?.name?.slice(0, 1)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className={`ml-2 md:ml-3 font-semibold text-white `}>
                    <div className="flex items-center gap-1 md:gap-2 text-sm md:text-lg font-medium">
                      <span className="truncate max-w-[100px] md:max-w-none">
                        {post.postOwner?.name || "Anonymous"}
                      </span>
                      <span>•</span>
                      <span className="text-xs opacity-80">
                        {/* {formatDateSmart(post.createdAt)} */}
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button
                    className="text-white hover:text-gray-200 rounded-full p-1 bg-black/20 hover:bg-black/30 transition-colors duration-200"
                    onClick={() => setOpenFullScreen(false)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="h-[calc(100vh-10rem)] min-h-[400px]  bg-black  overflow-hidden shadow-2xl relative">
                {currentImages.map((image, idx) => (
                  <div
                    key={idx}
                    className="h-full"
                    onClick={() => setOpenFullScreen(true)}
                  >
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
                      className="w-full h-full object-cover "
                    />
                  </div>
                ))}
                {postImages.length > 1 && (
                  <>
                    {/* Dots Indicator */}
                    <div className="absolute bottom-2  md:bottom-4 left-0 right-0 flex justify-center gap-1">
                      {Array.from({
                        length: Math.ceil(postImages.length),
                      }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            idx === Math.floor(currentImageIndex)
                              ? "bg-white/70"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>

                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute  left-2 top-1/2 -translate-y-1/2 bg-primary/50  text-white p-2 rounded-full"
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
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary/50 text-white p-2 rounded-full"
                      >
                        <FaChevronRight className="h-5 w-5" />
                      </motion.button>
                    </>
                  </>
                )}
              </div>

              {/* Top Gradient Shadow (Small) */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

              {/* Bottom Gradient Shadow (Small) */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t rounded-b-xl md:rounded-b-3xl from-black/50 to-transparent pointer-events-none" />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default PostGallery;
