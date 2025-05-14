import { PostCom } from "@/Types/post.type";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
  FaTrash,
} from "react-icons/fa";
import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.webp";
import image3 from "../../assets/image3.webp";
import image4 from "../../assets/image4.jpg";
import image5 from "../../assets/image5.jpg";
import image6 from "../../assets/image6.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateSmart, formatMessageTime, tos } from "@/lib/utils";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa6";
import { LuBookmarkMinus } from "react-icons/lu";
import { useMutation, useQueryClient } from "react-query";
import { addComment, likeOrDeslike } from "@/Api/post.api";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-separator";
import { deletePost } from "@/Api/profile.api";
import { Textarea } from "../ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import Cookies from "js-cookie";

interface PostCardProps {
  post: PostCom;
  index: number;
}

const PostGalleryTwo: React.FC<PostCardProps> = ({ post, index }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const postImages = [image1, image2, image3, image4, image5, image6];
  const queryClient = useQueryClient();
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );
  const userId = Cookies.get("userId");
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

  const { mutate, isLoading } = useMutation({
    mutationFn: likeOrDeslike,
    onSuccess: () => {
      queryClient.invalidateQueries("getAllPostsWithComments");
    },
    onError: () => {},
  });

  const handleLike = (id: string) => {
    mutate({ like: "like", postId: id });
  };
  const isCommentsExpanded = expandedComments.includes(post._id);

  const { mutate: deleteP } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries("getAllPostsWithComments");
      tos.success("Success");
    },
  });

  const { mutate: comment } = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries("getAllPostsWithComments");
    },
    onError: () => {},
  });

  const submitComment = ({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }) => {
    comment({
      postId: postId,
      comment: commentInputs[postId],
      commentedTo: userId,
    });

    setCommentInputs((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleCommentChange = (postId: string, value: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className=" rounded-3xl min-h-[40vh]  md:min-h-[80vh]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] md:aspect-[2/1]">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {currentImages.map((image, idx) => (
            <div
              key={idx}
              className={`h-full group ${idx > 0 ? "hidden md:block" : ""}`}
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
                className={`w-full h-full object-cover ${
                  idx % 2 === 0
                    ? "rounded-b-3xl md:rounded-bl-3xl"
                    : "rounded-b-3xl md:rounded-br-3xl"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Top Gradient Shadow (Small) */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

        {/* Bottom Gradient Shadow (Small) */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t rounded-b-3xl from-black/50 to-transparent pointer-events-none" />

        {/* Top Absolute for Profile */}
        <div className="absolute top-0 left-0 right-0 p-2 md:p-4">
          <div className="flex items-center justify-between px-2 md:px-4">
            <div className="flex items-center">
              <div className="relative w-12 h-12 md:w-[4.5rem] md:h-[4.5rem]">
                <div
                  className="w-full h-full rounded-full bg-gradient-to-tr from-[#FFA500] to-[#05A9A9] 
          [mask:radial-gradient(circle,transparent_60%,black_64%,black_80%,transparent_82%)]"
                ></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src="https://i.pravatar.cc/100?img=2"
                        alt="User"
                      />
                      <AvatarFallback className="bg-[#05A9A9]/10 text-[#05A9A9]">
                        U
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>

              <div className="ml-2 md:ml-3 font-semibold text-white">
                <div className="flex items-center gap-1 md:gap-2 text-sm md:text-lg font-medium">
                  <span className="truncate max-w-[100px] md:max-w-none">
                    {post.postOwner?.name || "Anonymous"}
                  </span>
                  <span>•</span>
                  <span className="text-xs opacity-80">
                    {formatDateSmart(post.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <button className="text-white hover:text-gray-100 group relative">
              <div className="flex items-center gap-1">
                <FaEllipsisV className="w-4 h-4 md:w-5 md:h-5" />

                {userId === post.postOwner?._id && (
                  <span
                    className="hidden group-hover:flex items-center gap-1 absolute top-4 right-2 ml-2 bg-white px-2 md:px-3 z-20 py-1 md:py-2 rounded shadow whitespace-nowrap"
                    onClick={() => {
                      deleteP(post._id);
                    }}
                  >
                    <FaTrash className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                    <span className="text-xs md:text-sm text-red-500">
                      Delete
                    </span>
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Modern Bottom Absolute Container */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[80%] max-w-md px-4">
          <div className="flex justify-between items-center bg-[#FFC55B]/50 backdrop-blur-md rounded-full p-1 md:p-3 shadow-md shadow-[#FFC55B]/50 border-2 border-[#FFC55B]/10">
            <motion.button
              onClick={() => handleLike(post._id)}
              disabled={isLoading}
              className="flex items-center justify-center flex-1 gap-1 md:gap-2 h-7 md:h-9 px-2 md:px-4 bg-transparent hover:scale-110 transition-transform"
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                key={post.isLikedByUser ? "liked" : "unliked"}
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                exit={{ scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                {
                  <FaRegHeart
                    className={`text-xl md:text-3xl ${
                      post.isLikedByUser
                        ? "text-red-500 fill-red-500"
                        : "text-white"
                    }`}
                  />
                }
              </motion.div>
              <span className="text-sm md:text-lg font-medium text-white">
                {post.likesCount}
              </span>
            </motion.button>

            <button
              className="flex gap-1 md:gap-2 items-center justify-center w-full text-white hover:scale-110 transition-transform"
              onClick={() => toggleComments(post._id)}
            >
              <FaRegComment className="text-xl md:text-3xl text-white" />
              <span className="text-sm md:text-lg font-medium">
                {post?.comments?.length || 0}
              </span>
            </button>

            <button className="flex flex-col items-center justify-center w-full text-white hover:scale-110 transition-transform">
              <RiSendPlaneLine className="text-2xl md:text-4xl text-white" />
            </button>

            <button className="flex flex-col items-center justify-center w-full text-white hover:scale-110 transition-transform">
              <LuBookmarkMinus className="text-2xl md:text-4xl text-white" />
            </button>
          </div>
        </div>

        {/* Multiple Image Indicators */}
        {postImages.length > 2 && (
          <>
            {/* Dots Indicator */}
            <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-1">
              {Array.from({
                length: Math.ceil(postImages.length / 2),
              }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === Math.floor(currentImageIndex / 2)
                      ? "bg-white/70"
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
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#FFC55B]/50 text-white p-2 rounded-full"
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FFC55B]/50 text-white p-2 rounded-full"
                >
                  <FaChevronRight className="h-5 w-5" />
                </motion.button>
              </>
            )}
          </>
        )}
      </div>

      {/* Post Content */}
      <div className="p-2 ">
        <div className="mb-1">
          <h3 className="font-semibold text-lg mb-2">{post.postTitle}</h3>
        </div>
        <div className=" flex items-center gap-4">
          <p className="text-gray-900">
            {post.postContent || "No description provided."}
          </p>
          <div className="flex flex-wrap gap-2">
            {["photography", "design", "creative"].map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-[#05A9A9]/10 text-[#05A9A9] rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <Separator className="my-3" />

        {isCommentsExpanded ? (
          <div className="mt-4 pt-4 border-t">
            <motion.div
              className="flex gap-3 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar className="w-9 h-9 transition-transform duration-300 hover:scale-105">
                <AvatarImage
                  src="/placeholder.svg?height=36&width=36"
                  alt="Your avatar"
                />
                <AvatarFallback className="bg-gradient-to-br from-[#05A9A9] to-[#05A9A9]/70 text-white">
                  YA
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#05A9A9]/20 to-[#05A9A9]/10 rounded-xl blur-sm opacity-75 transition-opacity duration-300"></div>

                <div className="relative flex gap-2">
                  <Textarea
                    placeholder="Add a comment..."
                    className="min-h-[44px] resize-none flex-1 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm focus:shadow-md focus:border-[#05A9A9]/30 transition-all duration-300 placeholder:text-gray-500/80 text-gray-700"
                    value={commentInputs[post._id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post._id, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (commentInputs[post._id]?.trim()) {
                          submitComment({
                            postId: post._id,
                            userId: post.userid,
                          });
                        }
                      }
                    }}
                  />

                  <Button
                    size="icon"
                    className="h-[44px] w-[44px] bg-gradient-to-br from-[#05A9A9] to-[#05A9A9]/80 hover:from-[#048484] hover:to-[#048484]/90 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={() =>
                      submitComment({ postId: post._id, userId: post.userid })
                    }
                    disabled={!commentInputs[post._id]?.trim()}
                  >
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Send className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </div>
              </div>
            </motion.div>

            <h4 className="font-medium my-2">Comments</h4>

            <div className="space-y-4 mb-6">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-3 group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Avatar className="w-9 h-9 transition-all duration-300 group-hover:scale-105">
                      <AvatarImage
                        src={`/placeholder.svg?height=36&width=36&text=${
                          post?.commenterDetails
                            ?.find((user) => user._id === comment.commentedBy)
                            ?.name?.slice(0, 1) || "U"
                        }`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#05A9A9] to-[#05A9A9]/70 text-white">
                        {(
                          post?.commenterDetails
                            ?.find((user) => user._id === comment.commentedBy)
                            ?.name?.slice(0, 1) || "U"
                        )?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#05A9A9]/20 to-[#05A9A9]/10 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-sm group-hover:shadow-md transition-all duration-300">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-sm text-gray-800">
                              {post?.commenterDetails?.find(
                                (user) => user._id === comment.commentedBy
                              )?.name || "Anonymous"}
                            </p>
                            <span className="text-xs text-gray-500/80">
                              {formatDateSmart(comment.createdAt, true) +
                                " • " +
                                formatMessageTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">
                            {comment.comment}
                          </p>
                          <div className="flex gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="text-xs text-gray-500 hover:text-[#05A9A9] transition-colors">
                              Reply
                            </button>
                            <button className="text-xs text-gray-500 hover:text-[#05A9A9] transition-colors">
                              Like
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {post?.comments && post.comments.length > 0 && (
              <span
                className="text-gray-700 text-sm mt-1 cursor-pointer hover:text-gray-600"
                onClick={() => toggleComments(post._id)}
              >
                View All Comments{" "}
                <span className="text-primary">( {post.comments.length} )</span>{" "}
              </span>
            )}
          </div>
        )}
      </div>
      {post?.comments && post.comments.length > 0 && isCommentsExpanded && (
        <span
          className="text-gray-700 text-sm mt-1 cursor-pointer hover:text-gray-600"
          onClick={() => toggleComments(post._id)}
        >
          Hide Comments
        </span>
      )}
      <hr className="my-1 border border-gray-400" />
    </motion.div>
  );
};

export default PostGalleryTwo;
