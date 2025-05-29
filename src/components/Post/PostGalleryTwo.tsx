import { CommentNew, PostCom } from "@/Types/post.type";
import { motion, Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
  FaTrash,
} from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatImageUrl, formatImageUrls, tos } from "@/lib/utils";
import { FaRegComment } from "react-icons/fa";
// import { RiSendPlaneLine } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa6";
// import { LuBookmarkMinus } from "react-icons/lu";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import {
  addChildComment,
  addComment,
  Commentlike,
  getChildComments,
  getComments,
  likeOrDeslike,
} from "@/Api/post.api";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-separator";
import { deletePost } from "@/Api/profile.api";
import { Textarea } from "../ui/textarea";
import { Send } from "lucide-react";
import Cookies from "js-cookie";
import { IoIosArrowDown, IoMdHeart } from "react-icons/io";
import { Spinner } from "../ui/Spinner";
import { formatDistanceToNow } from "date-fns";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/Context/RoleContext";

interface PostCardProps {
  post: PostCom;
  index: number;
}

const PostGalleryTwo: React.FC<PostCardProps> = ({ post, index }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  // const postImages =;
  const [postImages, setPostImages] = useState<string | string[]>("");
  const queryClient = useQueryClient();
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );
  const userId = Cookies.get("userId");
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [selectedCommnet, setSelectedCommnet] = useState<string | undefined>(
    undefined
  );
  const [selectedCommnetReplay, setSelectedCommnetReplay] = useState<string[]>(
    []
  );
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, CommentNew[]>
  >({});
  const [replierName, setReplierName] = useState<string | undefined>(undefined);
  const [, setChildComId] = useState<string | undefined>(undefined);

  const profilePic = Cookies.get("profilePic");
  const userName = Cookies.get("userName");

  const navigate = useNavigate();

  useEffect(() => {
    const postImages = formatImageUrls(post?.postPictures);
    setPostImages(postImages);
  }, [post]);

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

  const handleClick = (userId: string, userName: string) => {
    // Replace spaces with underscores
    const formattedUserName = userName.replace(/\s+/g, "_");
    navigate(`/user/${formattedUserName}`, { state: { id: userId } });
  };

  const currentImages = [postImages[currentImageIndex]].filter(Boolean);
  const hasNoImage = currentImages.length === 0;

  const {
    data,
    isLoading: isLoadingComment,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["postComments", post._id],
    queryFn: async ({ pageParam = 1 }) => {
      if (!post._id) return;
      const res = await getComments(post._id, pageParam);
      return res;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.data && lastPage?.data?.length > 0
        ? allPages.length + 1
        : undefined;
    },
    enabled: false,
  });

  // Mutation Function
  const { mutate, isLoading } = useMutation({
    mutationFn: likeOrDeslike,
    onSuccess: () => {
      queryClient.invalidateQueries("getAllPostsWithComments");
    },
    onError: () => {},
  });

  const childComIdRef = useRef<string | null>(null);
  // Mutation Function
  const { mutate: likeComment } = useMutation({
    mutationFn: Commentlike,
    onSuccess: () => {
      queryClient.invalidateQueries(["postComments", post._id]);
      if (childComIdRef?.current) {
        queryClient.invalidateQueries(["childComment", childComIdRef.current]);
      }
      refetch();
      tos.success("Success");
    },
    onError: () => {},
  });

  const handleLike = (id: string, isLikedByUser: boolean) => {
    const payload = isLikedByUser ? "neutralize" : "like";
    mutate({ like: payload, postId: id });
  };

  const handleCommentLike = (
    parentComment: string,
    isLikedByUser: boolean,
    childComment?: string
  ) => {
    if (parentComment) {
      childComIdRef.current = parentComment;
    }
    const payload = isLikedByUser ? "neutralize" : "like";
    likeComment({
      parentComment: childComment ? null : parentComment,
      childComment: childComment || null,
      like: payload,
    });
  };
  const isCommentsExpanded = expandedComments.includes(post._id);

  const { mode } = useRole();

  const { mutate: deleteP } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["getAllPostsWithComments", 1, 5, mode]);
      tos.success("Success");
    },
  });

  const { mutate: comment } = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["postComments", post._id]);
      setCommentInputs((prev) => ({
        ...prev,
        [post._id]: "",
      }));
      refetch();
    },
    onError: () => {},
  });

  const { mutate: childComment } = useMutation({
    mutationFn: addChildComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["postComments", post._id]);
      queryClient.invalidateQueries(["childComment", selectedCommnet]);
      setSelectedCommnet(undefined);
      setReplierName(undefined);
      setChildComId(undefined);
      refetch();
      setCommentInputs((prev) => ({
        ...prev,
        [post._id]: "",
      }));
    },
    onError: () => {},
  });

  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const handleScroll = useCallback(() => {
    if (!scrollableDivRef.current) return;

    const { scrollTop, clientHeight, scrollHeight } = scrollableDivRef.current;

    // Check if scrolled near the bottom of the div (with 100px buffer)
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    // Early return if conditions aren't met
    if (!isNearBottom || isLoadingComment || isFetching || !hasNextPage) {
      return;
    }

    fetchNextPage();
  }, [isLoadingComment, isFetching, hasNextPage, fetchNextPage]);

  // Add scroll event listener
  useEffect(() => {
    const div = scrollableDivRef.current;
    if (!div) return;

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Access all comments with data?.pages.flat()

  const submitComment = ({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }) => {
    if (selectedCommnet) {
      childComment({
        parentComment: selectedCommnet,
        comment: replierName
          ? "@" + replierName + " " + commentInputs[postId]
          : commentInputs[postId],
      });
    } else {
      comment({
        postId: postId,
        comment: commentInputs[postId],
        commentedTo: userId,
      });
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      if (prev.includes(postId)) {
        // If already expanded, remove it
        setCommentsByPost((prev) => ({ ...prev, [postId]: [] }));
        return prev.filter((id) => id !== postId);
      } else {
        // If not expanded, add it
        if (!commentsByPost[postId]) {
          setCommentsByPost((prev) => ({ ...prev, [postId]: [] }));
        }
        return [...prev, postId];
      }
    });
  };

  const replyToComment = (commentId: string) => {
    commentRef.current?.focus();
    setSelectedCommnet(commentId);
    setSelectedCommnetReplay(
      (prev) =>
        prev.includes(commentId)
          ? prev // Keep as is if already exists
          : [...prev, commentId] // Add if not present
    );
  };

  const replyToChildComment = (
    commentId: string,
    replierName: string,
    childComId: string
  ) => {
    commentRef.current?.focus();
    setSelectedCommnet(commentId);
    setReplierName(replierName);
    setChildComId(childComId);
  };

  const CancelReplyToComment = () => {
    commentRef.current?.blur();
    setSelectedCommnet(undefined);
    setChildComId(undefined);
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
      className="rounded-xl md:rounded-3xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative ">
        {hasNoImage ? (
          <div className="min-h-[48vh] py-[5rem] flex items-center pl-4 border-2 border-primary/30 rounded-3xl">
            <div className="p-2 space-y-1 md:space-y-2 ">
              <h3 className="font-semibold text-lg">{post.postTitle}</h3>
              <div className="space-y-2">
                <p className="text-gray-600 text-sm">
                  {post.postContent || "No description provided."}
                </p>
                {/* <div className="flex flex-wrap gap-2">
                  {["photography", "design", "creative"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary2/10 text-primary2 rounded-full text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[600px] w-full max-w-[600px] mx-auto">
            {currentImages.map((image, idx) => (
              <div key={idx} className="h-full">
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
                  className="w-full h-full object-cover rounded-b-xl md:rounded-b-3xl"
                />
              </div>
            ))}
          </div>
        )}

        {!hasNoImage && (
          <>
            {/* Top Gradient Shadow (Small) */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

            {/* Bottom Gradient Shadow (Small) */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t rounded-b-xl md:rounded-b-3xl from-black/50 to-transparent pointer-events-none" />
          </>
        )}

        {/* Top Absolute for Profile */}
        <div className="absolute top-0 left-0 right-0 p-2 md:p-4">
          <div className="flex items-center justify-between px-2 md:px-4 ">
            <div
              className="flex items-center cursor-pointer"
              onClick={() =>
                handleClick(post?.postOwner._id, post?.postOwner.name)
              }
            >
              <div className="relative w-12 h-12 md:w-[4.5rem] md:h-[4.5rem]">
                <div
                  className="w-full h-full rounded-full bg-gradient-to-tr from-primary2 to-primary2 
          [mask:radial-gradient(circle,transparent_60%,black_64%,black_80%,transparent_82%)]"
                ></div>

                <div className="absolute inset-0 flex items-center justify-center">
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
                      <AvatarFallback className="bg-primary2/10 text-primary2">
                        U
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>

              <div
                className={`ml-2 md:ml-3 font-semibold ${
                  hasNoImage ? "text-black" : "text-white"
                } `}
              >
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

            <button
              className={`group relative ${
                hasNoImage ? "text-gray-600" : "text-white"
              }`}
            >
              {userId === post.postOwner?._id && (
                <div className="flex items-center gap-1">
                  <FaEllipsisV className="w-4 h-4 md:w-5 md:h-5" />

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
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Modern Bottom Absolute Container */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[60%] max-w-md px-4">
          <div className="flex justify-around  items-center bg-[#FFC55B]/50 backdrop-blur-md rounded-full p-1 md:p-3 shadow-md shadow-white/20 border-2 border-[#FFC55B]/10">
            <motion.button
              onClick={() => handleLike(post._id, post.isLikedByUser)}
              disabled={isLoading}
              className="flex items-center flex-1 justify-center  gap-1 md:gap-2 h-7 md:h-9 px-2 md:px-4 bg-transparent hover:scale-110 transition-transform"
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
              className="flex gap-1 flex-1 md:gap-2 items-center justify-center w-full text-white hover:scale-110 transition-transform"
              onClick={() => {
                toggleComments(post._id);
                refetch();
              }}
            >
              <FaRegComment className="text-xl md:text-3xl text-white" />
              <span className="text-sm md:text-lg font-medium">
                {post.commentCount || 0}
              </span>
            </button>

            {/* <button className="flex flex-col items-center justify-center w-full text-white hover:scale-110 transition-transform">
              <RiSendPlaneLine className="text-2xl md:text-4xl text-white" />
            </button> */}

            {/* <button className="flex flex-col items-center justify-center w-full text-white hover:scale-110 transition-transform">
              <LuBookmarkMinus className="text-2xl md:text-4xl text-white" />
            </button> */}
          </div>
        </div>

        {/* Multiple Image Indicators */}
        {postImages.length > 1 && (
          <>
            {/* Dots Indicator */}
            <div className="absolute bottom-16 md:bottom-24 left-0 right-0 flex justify-center gap-1">
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
      <div className="p-2 space-y-1 md:space-y-2">
        {!hasNoImage && (
          <>
            <h3 className="font-semibold text-lg">{post.postTitle}</h3>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                {post.postContent || "No description provided."}
              </p>
              {/* <div className="flex flex-wrap gap-2">
                {["photography", "design", "creative"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary2/10 text-primary2 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div> */}
            </div>
          </>
        )}

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
                  src={profilePic}
                  alt="Your avatar"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary2 to-primary2/70 text-white">
                  {userName?.slice(0, 1)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary2/20 to-primary2/10 rounded-xl blur-sm opacity-75 transition-opacity duration-300"></div>

                <div className="relative flex gap-2">
                  <Textarea
                    ref={commentRef}
                    placeholder="Add a comment..."
                    className="min-h-[44px] resize-none flex-1 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm focus:shadow-md focus:border-primary2/30 transition-all duration-300 placeholder:text-gray-500/80 text-gray-700"
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
                    className="h-[44px] w-[44px] bg-gradient-to-br from-primary2 to-primary2/80 hover:from-[#048484] hover:to-[#048484]/90 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
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
                  {selectedCommnet && (
                    <div className="absolute top-[0.1rem] right-14">
                      <MdCancel
                        size={20}
                        className="text-primary2 cursor-pointer"
                        onClick={() => CancelReplyToComment()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <h4 className="font-medium my-2">Comments</h4>

            <div className="space-y-4 mb-6">
              {isLoadingComment ? (
                <>
                  {[...Array(2)].map((_, index) => (
                    <div
                      key={index}
                      className="relative bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-white/70 shadow-sm animate-pulse"
                    >
                      <div className="flex justify-between items-start">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-4 w-full bg-gray-200 rounded mt-2"></div>
                      <div className="h-4 w-5/6 bg-gray-200 rounded mt-1"></div>
                      <div className="flex gap-3 mt-2">
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                        <div className="h-3 w-10 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div
                  className="min-h-[5vh] max-h-[44vh] overflow-y-auto overflow-x-hidden"
                  ref={scrollableDivRef}
                >
                  {data?.pages &&
                  data?.pages?.[0]?.data?.length &&
                  data?.pages?.[0]?.data?.length > 0 ? (
                    <div>
                      {data.pages.map((page, i) => (
                        <div key={i}>
                          {page?.data.map((comment, i) => (
                            <motion.div
                              key={comment._id}
                              className="flex gap-3 my-2 group"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.05 }}
                            >
                              <Avatar className="w-9 h-9 transition-all duration-300 group-hover:scale-105">
                                <AvatarImage
                                  src={formatImageUrl(
                                    comment?.commentedBy?.userPicturePath
                                  )}
                                  className="object-cover"
                                />
                                <AvatarFallback className="bg-gradient-to-br from-primary2 to-primary2/70 text-white">
                                  {(
                                    comment.commentedBy.name?.slice(0, 1) || "U"
                                  )?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1">
                                <div className="relative">
                                  <div className="absolute -inset-1 bg-gradient-to-r from-primary2/20 to-primary2/10 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                                  <div
                                    className={`relative bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 ${
                                      selectedCommnet === comment._id
                                        ? "border border-primary2"
                                        : " border border-white/20 "
                                    }`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <p className="font-medium text-sm text-gray-800">
                                        {comment?.commentedBy.name ||
                                          "Anonymous"}
                                      </p>
                                      <span className="text-xs text-gray-500/80">
                                        {/* {formatDateSmart(
                                          comment.createdAt,
                                          true
                                        ) +
                                          " • " +
                                          formatMessageTime(comment.createdAt)} */}
                                        {formatDistanceToNow(
                                          new Date(comment.createdAt),
                                          {
                                            addSuffix: true,
                                          }
                                        )}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">
                                      {comment.comment}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <div className="flex gap-3 mt-2 duration-300">
                                        {comment?.likes ? (
                                          <div className="flex items-center text-sm text-gray-500">
                                            <IoMdHeart className="text-base text-red-500 " />

                                            <span className="pl-2">
                                              {comment.likes}
                                            </span>
                                          </div>
                                        ) : null}
                                        <button
                                          className="text-xs text-gray-500 hover:text-primary2 transition-colors"
                                          onClick={() =>
                                            replyToComment(comment._id)
                                          }
                                        >
                                          Reply
                                        </button>
                                        {/* )} */}
                                        <button
                                          className="text-xs text-gray-500 hover:text-primary2 transition-colors"
                                          onClick={() =>
                                            handleCommentLike(
                                              comment._id,
                                              comment.isLikedByUser
                                            )
                                          }
                                        >
                                          Like
                                        </button>
                                      </div>
                                      <div>
                                        <button
                                          className="text-xs flex items-center gap-2 text-gray-500 hover:text-primary2 transition-colors"
                                          onClick={() => {
                                            comment.totalReplies !== 0 &&
                                              setSelectedCommnetReplay(
                                                (prev) =>
                                                  prev.includes(comment._id)
                                                    ? prev.filter(
                                                        (id) =>
                                                          id !== comment._id
                                                      ) // Toggle off
                                                    : [...prev, comment._id] // Toggle on
                                              );
                                          }}
                                        >
                                          {comment.totalReplies}{" "}
                                          <span>replies</span>
                                          <IoIosArrowDown />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {selectedCommnetReplay.includes(
                                  comment._id
                                ) && (
                                  <ChildReplies
                                    commentId={comment._id}
                                    replyToComment={replyToChildComment}
                                    // childComId={childComId}
                                    handleCommentLike={handleCommentLike}
                                  />
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ))}
                      {isFetching && (
                        <div className="py-[1rem] my-2 flex item-center justify-center bg-primary2/10 z-20">
                          <Spinner />
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4  rounded-xl">
                      No comments yet. Be the first to comment!
                    </p>
                  )}{" "}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <span
              className="text-gray-700 text-sm mt-1 cursor-pointer hover:text-gray-600"
              onClick={() => {
                toggleComments(post._id);
                refetch();
              }}
            >
              View All Comments
              {/* <span className="text-primary">
                ( {postComments?.data.length} )
              </span> */}
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        {isCommentsExpanded && (
          <span
            className="text-gray-700 text-sm mt-1 cursor-pointer hover:text-gray-600"
            onClick={() => toggleComments(post._id)}
          >
            Hide Comments
          </span>
        )}
      </div>
      <hr className="my-1 border border-gray-400" />
    </motion.div>
  );
};

export default PostGalleryTwo;

export const ChildReplies = ({
  commentId,
  replyToComment,
  handleCommentLike,
}: {
  commentId: string;
  replyToComment: (id: string, replierName: string, childComId: string) => void;
  handleCommentLike: (
    parentComment: string,
    isLikedByUser: boolean,
    childComment?: string
  ) => void;
}) => {
  const { data: childComments } = useQuery({
    queryKey: ["childComment", commentId],
    queryFn: () => getChildComments(commentId),
  });

  const { mode } = useRole();

  // if (isLoading)
  //   return (
  //     <div className="flex items-center justify-center my-2">
  //       <Spinner className="text-primary2" />
  //     </div>
  //   );

  return (
    <div className="ml-4">
      {childComments?.data.map((comment, i) => (
        <motion.div
          key={comment._id}
          className="flex gap-3 my-2 group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Avatar className="w-9 h-9 transition-all duration-300 group-hover:scale-105">
            <AvatarImage src={formatImageUrl(comment?.userPicturePath)} />
            <AvatarFallback
              className={`bg-gradient-to-br text-white ${
                mode === "formal"
                  ? "from-primary to-primary/70 "
                  : "from-primary2 to-primary2/70 "
              }`}
            >
              {comment?.user?.name?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="relative">
              <div
                className={`absolute -inset-1 bg-gradient-to-r  rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-all duration-300 ${
                  mode === "formal"
                    ? "from-primary/20 to-primary/10"
                    : "from-primary2/20 to-primary2/10"
                }`}
              ></div>
              <div
                className={`relative bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm text-gray-800">
                    {comment.user.name}
                  </p>
                  <span className="text-xs text-gray-500/80">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">
                  {comment.comment}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 mt-2 duration-300">
                    {comment?.likes ? (
                      <div className="flex items-center text-sm text-gray-500">
                        <IoMdHeart className="text-base text-red-500 " />

                        <span className="pl-2">{comment.likes}</span>
                      </div>
                    ) : null}
                    <button
                      className={`text-xs text-gray-500  transition-colors ${
                        mode === "formal"
                          ? "hover:text-primary"
                          : "hover:text-primary2"
                      }`}
                      onClick={() =>
                        replyToComment(
                          commentId,
                          comment?.user.name,
                          comment._id
                        )
                      }
                    >
                      Reply
                    </button>
                    {/* )} */}
                    <button
                      className={`text-xs text-gray-500 transition-colors ${
                        mode === "formal"
                          ? "hover:text-primary"
                          : "hover:text-primary2"
                      }`}
                      onClick={() =>
                        handleCommentLike(
                          commentId,
                          comment.isLikedByUser,
                          comment._id
                        )
                      }
                    >
                      Like
                    </button>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
