import {
  addComment,
  addStory,
  getAllPostsWithComments,
  getcComments,
  likeOrDeslike,
} from "@/Api/post.api";
import { AddPost } from "@/components/Post/AddPost";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as Dialog from "@radix-ui/react-dialog";
import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  ImageIcon,
  Layers,
  MessageCircle,
  PlusIcon,
  Send,
  Share2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { formatDateSmart, formatMessageTime, tos } from "@/lib/utils";
import PostGallery from "@/components/Post/PostGallery";
import Cookies from "js-cookie";
import { deletePost, getUserFullProfile } from "@/Api/profile.api";
import { FaEllipsisH, FaTrash } from "react-icons/fa";
import { Spinner } from "@/components/ui/Spinner";

type StoryFile = File & {
  preview?: string; // For object URL preview
};

function NormalHomePage() {
  const { data: allPostsWithComments } = useQuery({
    queryKey: ["getAllPostsWithComments"],
    queryFn: getAllPostsWithComments,
  });
  const [open, setOpen] = useState(false);
  const [currentStoryItemIndex, setCurrentStoryItemIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [expandedPost, setExpandedPost] = useState<string | undefined>(
    undefined
  );
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );
  const [viewStory, setViewStory] = useState(false);
  const queryClient = useQueryClient();
  const userId = Cookies.get("userId");
  const [openFileUpload, setOpenFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<StoryFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stories = [
    {
      id: 1,
      username: "sarah_j",
      title: "Mountain Trip",
      avatar: "https://picsum.photos/seed/avatar1/80/80",
      items: [
        {
          id: "s1-1",
          image: "https://picsum.photos/seed/mountainview/720/1280",
        },
        {
          id: "s1-2",
          image: "https://picsum.photos/seed/hikingtrail/720/1280",
        },
      ],
    },
    {
      id: 2,
      username: "mike_design",
      title: "New Project",
      avatar: "https://picsum.photos/seed/avatar2/80/80",
      items: [
        {
          id: "s2-1",
          image: "https://picsum.photos/seed/designmockup/720/1280",
        },
      ],
    },
    {
      id: 3,
      username: "travel_lisa",
      title: "Paris",
      avatar: "https://picsum.photos/seed/avatar3/80/80",
      items: [
        {
          id: "s3-1",
          image: "https://picsum.photos/seed/eiffeltower/720/1280",
        },
        {
          id: "s3-2",
          image: "https://picsum.photos/seed/louvremuseum/720/1280",
        },
        {
          id: "s3-3",
          image: "https://picsum.photos/seed/seineriver/720/1280",
        },
      ],
    },
    {
      id: 4,
      username: "photo_chris",
      title: "Portraits",
      avatar: "https://picsum.photos/seed/avatar4/80/80",
      items: [
        {
          id: "s4-1",
          image: "https://picsum.photos/seed/portrait1/720/1280",
        },
        {
          id: "s4-2",
          image: "https://picsum.photos/seed/portrait2/720/1280",
        },
      ],
    },
    {
      id: 5,
      username: "fitness_alex",
      title: "Workout",
      avatar: "https://picsum.photos/seed/avatar5/80/80",
      items: [
        {
          id: "s5-1",
          image: "https://picsum.photos/seed/gymsession/720/1280",
        },
      ],
    },
    {
      id: 6,
      username: "food_maria",
      title: "Recipes",
      avatar: "https://picsum.photos/seed/avatar6/80/80",
      items: [
        {
          id: "s6-1",
          image: "https://picsum.photos/seed/pastarecipe/720/1280",
        },
        {
          id: "s6-2",
          image: "https://picsum.photos/seed/dessert/720/1280",
        },
      ],
    },
    {
      id: 7,
      username: "food_maria",
      title: "Recipes",
      avatar: "https://picsum.photos/seed/avatar6/80/80",
      items: [
        {
          id: "s6-1",
          image: "https://picsum.photos/seed/pastarecipe/720/1280",
        },
        {
          id: "s6-2",
          image: "https://picsum.photos/seed/dessert/720/1280",
        },
      ],
    },
    {
      id: 8,
      username: "food_maria",
      title: "Recipes",
      avatar: "https://picsum.photos/seed/avatar6/80/80",
      items: [
        {
          id: "s6-1",
          image: "https://picsum.photos/seed/pastarecipe/720/1280",
        },
        {
          id: "s6-2",
          image: "https://picsum.photos/seed/dessert/720/1280",
        },
      ],
    },
  ];

  const [viewingStory, setViewingStory] = useState<null | {
    id: number;
    username: string;
    title: string;
    avatar: string;
    items: Array<{ id: string; image: string }>;
  }>(null);

  useEffect(() => {
    if (!viewingStory) return;

    const storyDuration = 5000;
    const interval = 100;
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    setStoryProgress(0);

    progressTimer = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 100 / (storyDuration / interval);
      });
    }, interval);

    timer = setTimeout(() => {
      if (currentStoryItemIndex < viewingStory.items.length - 1) {
        setCurrentStoryItemIndex((prev) => prev + 1);
        setStoryProgress(0);
      } else {
        const currentIndex = stories.findIndex((s) => s.id === viewingStory.id);
        const nextIndex = (currentIndex + 1) % stories.length;
        setViewingStory(stories[nextIndex]);
        setCurrentStoryItemIndex(0);
        setStoryProgress(0);
      }
    }, storyDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [viewingStory, currentStoryItemIndex]);

  const toggleComments = (postId: string) => {
    setExpandedPost((pre) => (pre === postId ? undefined : postId));
  };

  const { data: postComments, isLoading: isLoadingComment } = useQuery({
    queryKey: ["postComments", expandedPost],
    queryFn: () => {
      if (expandedPost) {
        return getcComments(expandedPost);
      }
    },
    enabled: !!expandedPost,
  });

  const handleCommentChange = (postId: string, value: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const { data: userFullProfile } = useQuery({
    queryKey: ["getUserFullProfile", userId],
    queryFn: () => {
      if (userId) {
        return getUserFullProfile(userId);
      }
    },
    enabled: !!userId,
  });

  ///// mutuation
  const { mutate, isLoading } = useMutation({
    mutationFn: likeOrDeslike,
    onSuccess: () => {
      queryClient.invalidateQueries("getAllPostsWithComments");
    },
    onError: () => {},
  });

  const { mutate: addUserStory, isLoading: storyLoading } = useMutation({
    mutationFn: addStory,
    onSuccess: () => {
      queryClient.invalidateQueries("getAllPostsWithComments");
      setOpenFileUpload(false);
      removeFile();
      tos.success("Story added Successfully");
    },
    onError: () => {},
  });

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
      queryClient.invalidateQueries("postComments");
    },
    onError: () => {},
  });

  const handleLike = (id: string) => {
    mutate({ like: "like", postId: id });
  };

  // file uploader
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) return;

    const storyFile: StoryFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    setSelectedFile(storyFile);
  };

  const validateFile = (file: File): boolean => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "video/mp4",
      "video/avi",
      "video/x-msvideo", // For AVI files
    ];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!validTypes.includes(file.type)) {
      tos.error("Please select a valid file type (JPG, PNG, MP4, AVI)");
      return false;
    }

    if (file.size > maxSize) {
      tos.error("File size exceeds 50MB limit");
      return false;
    }

    return true;
  };

  const removeFile = () => {
    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) return;

    // Create FormData for your API call
    const formData = new FormData();
    formData.append("storyFile", selectedFile);

    addUserStory(formData);
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (selectedFile?.preview) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile]);

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

  return (
    // <div className="min-h-screen bg-gradient-to-b from-[#f8fdfd] to-white">
    <div className="min-h-screen">
      <div className="grid grid-cols-12 mx-auto gap-5 pr-1 md:px-4 py-2">
        <div className="col-span-12 lg:col-span-9  space-y-8">
          {/* story */}
          <div className="bg-white rounded-md md:rounded-2xl shadow-sm p-2 md:p-5 overflow-hidden">
            <h2 className="font-medium text-lg mb-5 text-gray-800 flex items-center gap-2">
              Stories
            </h2>
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-4 scrollbar-hide p-2 md:px-0">
              <div
                key="add-story"
                className="min-w-[140px] md:min-w-[180px] h-[180px] md:h-[200px] rounded-xl md:rounded-2xl bg-white border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
                onClick={() => {
                  setOpenFileUpload(true);
                }}
              >
                {/* Image container with matching height */}
                <div className="h-[100px] md:h-[120px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                  {/* Animated plus button with gradient */}
                  <div className="relative z-10">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#03a9a9] to-[#03c9c9] flex items-center justify-center text-white shadow-lg duration-300 group-hover:scale-110">
                      <PlusIcon className="w-6 h-6 md:w-7 md:h-7 stroke-2" />
                    </div>
                  </div>

                  {/* Subtle decorative elements */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-[#03a9a9] blur-md"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-10 h-10 rounded-full bg-[#03c9c9] blur-md"></div>
                  </div>
                </div>

                {/* Content area matching story cards */}
                <div className="p-3 flex-1 flex flex-col items-center justify-center">
                  <h3 className="font-semibold text-sm md:text-base text-gray-900 group-hover:text-[#03a9a9] transition-colors">
                    Add Story
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Tap to create</p>
                </div>

                {/* Matching glow effect on hover */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl pointer-events-none transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(3,169,169,0.3)] group-hover:bg-[#03a9a9]/5"></div>
              </div>
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="min-w-[140px] md:min-w-[180px] h-[180px] md:h-[200px] rounded-xl md:rounded-2xl bg-white border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
                  onClick={() => {
                    setViewingStory(story);
                    setCurrentStoryItemIndex(0);
                    setViewStory(true);
                    setStoryProgress(0);
                  }}
                >
                  {/* Image container with modern overlay */}
                  <div className="h-[100px] md:h-[120px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 z-10"></div>
                    <img
                      src={
                        story.items[0]?.image ||
                        `/placeholder.svg?height=120&width=180&text=${encodeURIComponent(
                          story.title
                        )}`
                      }
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Avatar with modern ring */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="p-0.5 rounded-full bg-gradient-to-br from-[#03a9a9] to-[#03c9c9] shadow-md">
                        <Avatar className="w-7 h-7 md:w-8 md:h-8 ring-2 ring-white">
                          <AvatarImage
                            src={story.avatar || "/placeholder.svg"}
                            alt={story.username}
                          />
                          <AvatarFallback className="bg-[#03a9a9]/20 text-[#03a9a9] font-medium">
                            {story.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    {/* Item count badge */}
                    {story.items.length > 1 && (
                      <div className="absolute bottom-3 right-3 z-20 bg-[#03a9a9] text-gray-900 text-xs font-semibold px-2 py-1 rounded-full shadow-sm backdrop-blur-sm bg-opacity-90">
                        {story.items.length}
                      </div>
                    )}
                  </div>

                  {/* Content with modern typography */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h3 className="font-semibold text-sm md:text-base line-clamp-2 text-gray-900 group-hover:text-[#03a9a9] transition-colors">
                      {story.title}
                    </h3>
                    <div className="flex justify-between items-end">
                      <p className="text-xs text-gray-500 font-medium">
                        @{story.username}
                      </p>
                      <div className="text-[10px] text-[#03a9a9] font-bold uppercase tracking-wide">
                        View Story
                      </div>
                    </div>
                  </div>

                  {/* Modern glow effect on hover */}
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl pointer-events-none transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(3,169,169,0.3)] group-hover:bg-[#03a9a9]/5"></div>
                </div>
              ))}
            </div>
          </div>

          {/* header */}
          <div className="flex justify-between items-center px-1 md:px-10">
            <h2 className="font-medium text-lg text-gray-800 flex items-center gap-2">
              Your Feed
            </h2>
            <Button
              onClick={() => setOpen(true)}
              className="text-white flex items-center gap-2 rounded-sm px-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-primary"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Create Post</span>
            </Button>
          </div>

          {/* post card */}
          <div className="space-y-6 max-w-[600px] mx-auto">
            {[...(allPostsWithComments?.data ?? [])]
              // .reverse()
              .map((post, index) => {
                const postId = post._id || `post-${index}`;
                const isCommentsExpanded = post._id === expandedPost;

                return (
                  <motion.div
                    key={postId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="rounded-2xl shadow-lg overflow-hidden bg-white border border-[#e6f7f7]"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <Avatar className="w-10 h-10 border-2 border-[#e6f7f7]">
                          <AvatarImage
                            src="/placeholder.svg?height=40&width=40"
                            alt={post.postOwner?.name || "User"}
                          />
                          <AvatarFallback
                            className="text-white"
                            style={{
                              background:
                                "linear-gradient(135deg, #05A9A9, #4ecdc4)",
                            }}
                          >
                            {(post.postOwner?.name?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">
                            {post.postOwner?.name || "Anonymous"}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="text-gray-400 hover:text-[#05A9A9] group relative transition-colors duration-200">
                        <div className="flex items-center gap-1">
                          <FaEllipsisH className="w-5 h-5" />

                          {userId === post.postOwner?._id && (
                            <span
                              className="hidden group-hover:flex items-center gap-1 absolute top-4 right-2 ml-2 bg-white px-3 z-20 py-2 rounded-lg shadow-md whitespace-nowrap"
                              onClick={() => {
                                deleteP(post._id);
                              }}
                            >
                              <FaTrash className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-red-500">
                                Delete
                              </span>
                            </span>
                          )}
                        </div>
                      </button>
                    </div>

                    <div className="w-full  bg-gray-100">
                      <PostGallery key={post._id} post={post} index={index} />
                    </div>

                    <div className="p-5">
                      <div className="mb-3">
                        <h3 className="font-medium text-lg mb-2 text-gray-800">
                          {post.postTitle}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {post.postContent || "No description provided."}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {["photography", "design", "creative"].map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-[#e6f7f7] text-[#05A9A9] rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <Separator className="my-4 bg-[#e6f7f7]" />

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likesCount || 0} likes</span>
                        </div>
                        <button
                          className="flex items-center gap-1"
                          onClick={() => toggleComments(postId)}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>
                            {postComments?.data?.length || 0} comments
                          </span>
                        </button>
                        <div className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => handleLike(post._id)}
                          disabled={isLoading}
                          className="flex items-center justify-center flex-1 gap-2 h-10 px-4 rounded-full border bg-white border-[#e6f7f7] hover:bg-[#f8fdfd] transition-all duration-200"
                          whileTap={{ scale: 0.95 }}
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
                            <Heart
                              className={`w-4 h-4 ${
                                post.isLikedByUser
                                  ? "text-[#05A9A9] fill-[#05A9A9]"
                                  : "text-gray-500"
                              }`}
                            />
                          </motion.div>
                          <span className="text-sm font-medium text-gray-700">
                            {post.isLikedByUser ? "Liked" : "Like"}
                          </span>
                        </motion.button>
                        <Button
                          variant="outline"
                          className="flex-1 h-10 rounded-full border-[#e6f7f7] text-gray-700 hover:bg-[#f8fdfd]"
                          onClick={() => toggleComments(postId)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Comment
                        </Button>
                        <Button
                          variant="outline"
                          className="w-10 h-10 p-0 rounded-full border-[#e6f7f7] text-gray-700 hover:bg-[#f8fdfd]"
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>

                      {isCommentsExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="mt-5 pt-4 border-t border-[#e6f7f7]"
                        >
                          <div className="flex gap-3">
                            <Avatar className="w-8 h-8 border-2 border-[#e6f7f7]">
                              <AvatarImage
                                src="/placeholder.svg?height=32&width=32"
                                alt="Your avatar"
                              />
                              <AvatarFallback
                                className="text-white"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #05A9A9, #4ecdc4)",
                                }}
                              >
                                YA
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                              <Textarea
                                placeholder="Add a comment..."
                                className="min-h-[40px] resize-none rounded-xl border-[#e6f7f7] focus-visible:ring-[#05A9A9]"
                                value={commentInputs[postId] || ""}
                                onChange={(e) =>
                                  handleCommentChange(postId, e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    if (commentInputs[postId]?.trim()) {
                                      submitComment({
                                        postId,
                                        userId: post.userid,
                                      });
                                    }
                                  }
                                }}
                              />
                              <Button
                                size="icon"
                                className="h-10 w-10 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #05A9A9, #4ecdc4)",
                                }}
                                onClick={() =>
                                  submitComment({ postId, userId: post.userid })
                                }
                                disabled={!commentInputs[postId]?.trim()}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <h4 className="font-medium text-gray-800 text-sm mt-5 mb-3 flex items-center gap-2">
                            <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-[#05A9A9] to-[#4ecdc4]"></span>
                            Comments
                          </h4>

                          <div className="space-y-3 mb-3">
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
                              <>
                                {" "}
                                {postComments?.data &&
                                postComments?.data.length > 0 ? (
                                  postComments.data.map((comment, i) => (
                                    <motion.div
                                      key={i}
                                      className="flex gap-3"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{
                                        duration: 0.2,
                                        delay: i * 0.05,
                                      }}
                                    >
                                      <Avatar className="w-8 h-8 border-2 border-[#e6f7f7]">
                                        <AvatarImage
                                          src={`/placeholder-icon.png?height=32&width=32&text=${
                                            comment.commentedBy.name || "U"
                                          }`}
                                        />
                                        <AvatarFallback
                                          className="text-white"
                                          style={{
                                            background:
                                              "linear-gradient(135deg, #05A9A9, #4ecdc4)",
                                          }}
                                        >
                                          {(
                                            comment.commentedBy.name?.slice(
                                              0,
                                              1
                                            ) || "U"
                                          )?.toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 bg-[#f8fdfd] p-3 rounded-xl">
                                        <div className="flex justify-between items-start">
                                          <p className="font-medium text-sm text-gray-800">
                                            {comment.commentedBy?.name ||
                                              "Anonymous"}
                                          </p>
                                          <span className="text-xs text-gray-500">
                                            {formatDateSmart(
                                              comment.createdAt,
                                              true
                                            ) +
                                              " at " +
                                              formatMessageTime(
                                                comment.createdAt
                                              )}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                          {comment.comment}
                                        </p>
                                      </div>
                                    </motion.div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-400 text-center py-4 bg-[#f8fdfd] rounded-xl">
                                    No comments yet. Be the first to comment!
                                  </p>
                                )}{" "}
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

            {(!allPostsWithComments?.data ||
              allPostsWithComments.data.length === 0) && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-[#e6f7f7]">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{
                    background: "linear-gradient(135deg, #e6f7f7, #f5fcfc)",
                    boxShadow: "0 8px 20px rgba(5, 169, 169, 0.1)",
                  }}
                >
                  <Layers className="w-10 h-10" style={{ color: "#05A9A9" }} />
                </div>
                <h3 className="text-xl font-medium mb-3 text-gray-800">
                  Your feed is empty
                </h3>
                <p className="text-gray-500 mb-5 max-w-md mx-auto">
                  Start sharing moments with your friends and see their updates
                  here
                </p>
                <Button
                  onClick={() => setOpen(true)}
                  className="rounded-full px-6 py-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #05A9A9, #4ecdc4)",
                  }}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Create Your First Post
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3  hidden lg:block">
          <div className="sticky  top-16 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden ">
              <div className="h-32 bg-gradient-to-br bg-[#03a9a9]  "></div>
              <div className="px-5 pb-5 pt-0 -mt-10">
                {/* Profile Header */}
                <Avatar className="w-20 h-20 border-4">
                  <AvatarImage
                    src="https://i.pravatar.cc/100?img=7"
                    alt="Your profile"
                  />
                  <AvatarFallback className="bg-[#03a9a9]/10 text-[#03a9a9] text-xl">
                    {userFullProfile?.data.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <h3 className="font-bold text-lg mt-2">
                  {userFullProfile?.data.name ?? "Your Name"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {userFullProfile?.data.position || "No position specified"}
                </p>

                {/* Stats */}
                <div className="flex justify-between mt-4 text-center border-y py-3">
                  <div>
                    <p className="font-bold">248</p>
                    <p className="text-xs text-gray-500">Posts</p>
                  </div>
                  <div>
                    <p className="font-bold">1,432</p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                  <div>
                    <p className="font-bold">526</p>
                    <p className="text-xs text-gray-500">Following</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 text-sm mt-3">
                  {userFullProfile?.data.bio || "No bio available"}
                </p>

                {/* Current Role (if available) */}
                {userFullProfile?.data.experience?.find(
                  (exp) => exp.workingAt
                ) && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm text-gray-700">
                      Currently
                    </h4>
                    <p className="font-medium">
                      {
                        userFullProfile.data.experience.find(
                          (exp) => exp.workingAt
                        )?.jobTitle
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      {
                        userFullProfile.data.experience.find(
                          (exp) => exp.workingAt
                        )?.entity
                      }
                    </p>
                  </div>
                )}

                {/* Education Summary */}
                {userFullProfile?.data.education &&
                  userFullProfile?.data.education?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm text-gray-700">
                        Education
                      </h4>
                      {userFullProfile.data.education.slice(0, 2).map((edu) => (
                        <div key={edu._id} className="mt-1">
                          <p className="font-medium">{edu.institution}</p>
                          <p className="text-sm text-gray-600">
                            {edu.degree}
                            {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Skills Cloud */}
                {userFullProfile?.data.skills &&
                  userFullProfile?.data.skills?.[0]?.skill?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm text-gray-700">
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {userFullProfile.data.skills[0].skill
                          .slice(0, 8)
                          .map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Organizations */}
                {userFullProfile?.data.organization &&
                  userFullProfile?.data.organization?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm text-gray-700">
                        Organizations
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {userFullProfile.data.organization
                          .slice(0, 3)
                          .map((org) => (
                            <div key={org._id} className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-1">
                                <span className="text-xs">🏢</span>
                              </div>
                              <span className="text-sm">
                                {org.organizationName}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* <Button className="w-full mt-6 bg-[#05A9A9] hover:bg-[#048484]">
                  Edit Profile
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-medium text-gray-800 flex items-center gap-2">
                Create New Post
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-[#05A9A9] rounded-full p-2 hover:bg-[#f8fdfd] transition-colors duration-200">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <AddPost onSuccess={() => setOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {viewingStory && (
        <Dialog.Root open={viewStory} onOpenChange={setViewStory}>
          <Dialog.Portal>
            <Dialog.Overlay
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
              onClick={() => {
                setViewStory(false);
              }}
            />
            <Dialog.Content className="fixed inset-0 mx-auto z-50 w-full md:w-[50%] flex items-center justify-center focus:outline-none">
              <div className="relative w-full max-w-3xl mx-auto">
                <div className="absolute top-0 left-4 right-4 flex gap-1 z-10 p-4">
                  {viewingStory.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="h-1.5 rounded-full flex-1 overflow-hidden bg-white/30"
                    >
                      {idx === currentStoryItemIndex && (
                        <div
                          className="h-full transition-all duration-100 ease-linear"
                          style={{
                            width: `${storyProgress}%`,
                            background:
                              "linear-gradient(to right, #05A9A9, #4ecdc4)",
                          }}
                        />
                      )}
                      {idx < currentStoryItemIndex && (
                        <div className="h-full bg-white w-full" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-10">
                  <div className="flex items-center">
                    <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                      <AvatarImage
                        src={viewingStory.avatar || "/placeholder.svg"}
                        alt={viewingStory.username}
                      />
                      <AvatarFallback
                        className="text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #05A9A9, #4ecdc4)",
                        }}
                      >
                        {viewingStory.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 text-white">
                      <p className="font-medium">{viewingStory.username}</p>
                      <p className="text-xs opacity-80">3h ago</p>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      className="text-white hover:text-gray-200 rounded-full p-1 bg-black/20 hover:bg-black/30 transition-colors duration-200"
                      onClick={() => setViewStory(false)}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </Dialog.Close>
                </div>

                <div
                  className="aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const isLeftSide = x < rect.width / 2;

                    if (isLeftSide) {
                      if (currentStoryItemIndex > 0) {
                        setCurrentStoryItemIndex(currentStoryItemIndex - 1);
                        setStoryProgress(0);
                      } else {
                        const currentIndex = stories.findIndex(
                          (s) => s.id === viewingStory.id
                        );
                        const prevIndex =
                          (currentIndex - 1 + stories.length) % stories.length;
                        setViewingStory(stories[prevIndex]);
                        setCurrentStoryItemIndex(
                          stories[prevIndex].items.length - 1
                        );
                        setStoryProgress(0);
                      }
                    } else {
                      if (
                        currentStoryItemIndex <
                        viewingStory.items.length - 1
                      ) {
                        setCurrentStoryItemIndex(currentStoryItemIndex + 1);
                        setStoryProgress(0);
                      } else {
                        const currentIndex = stories.findIndex(
                          (s) => s.id === viewingStory.id
                        );
                        const nextIndex = (currentIndex + 1) % stories.length;
                        setViewingStory(stories[nextIndex]);
                        setCurrentStoryItemIndex(0);
                        setStoryProgress(0);
                      }
                    }
                  }}
                >
                  <img
                    src={
                      viewingStory.items[currentStoryItemIndex]?.image ||
                      `/placeholder.svg?height=1280&width=720&text=${
                        encodeURIComponent(viewingStory.title) ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }`
                    }
                    alt={viewingStory.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <button
                  className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentStoryItemIndex > 0) {
                      setCurrentStoryItemIndex((prev) => prev - 1);
                      setStoryProgress(0);
                    } else {
                      const currentIndex = stories.findIndex(
                        (s) => s.id === viewingStory.id
                      );
                      const prevIndex =
                        (currentIndex - 1 + stories.length) % stories.length;
                      setViewingStory(stories[prevIndex]);
                      setCurrentStoryItemIndex(
                        stories[prevIndex].items.length - 1
                      );
                      setStoryProgress(0);
                    }
                  }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentStoryItemIndex < viewingStory.items.length - 1) {
                      setCurrentStoryItemIndex((prev) => prev + 1);
                      setStoryProgress(0);
                    } else {
                      const currentIndex = stories.findIndex(
                        (s) => s.id === viewingStory.id
                      );
                      const nextIndex = (currentIndex + 1) % stories.length;
                      setViewingStory(stories[nextIndex]);
                      setCurrentStoryItemIndex(0);
                      setStoryProgress(0);
                    }
                  }}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-full px-5 py-3 flex items-center shadow-lg">
                    <input
                      type="text"
                      placeholder="Reply to story..."
                      className="bg-transparent border-none text-white placeholder-white/70 focus:outline-none w-full"
                    />
                    <button className="ml-2 text-white bg-[#05A9A9] p-2 rounded-full hover:bg-[#4ecdc4] transition-colors duration-200">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      <Dialog.Root open={openFileUpload} onOpenChange={setOpenFileUpload}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-medium text-gray-800 flex items-center gap-2">
                Create New Story
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-[#05A9A9] rounded-full p-2 hover:bg-[#f8fdfd] transition-colors duration-200">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              {!selectedFile && (
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-[#05A9A9] bg-[#f8fdfd]"
                      : "border-[#e6f7f7] hover:border-[#05A9A9] hover:bg-[#f8fdfd]"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="flex flex-col items-center justify-center space-y-4 py-10">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #e6f7f7, #f5fcfc)",
                      }}
                    >
                      <Upload className="w-7 h-7 text-[#05A9A9]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-lg">
                        Drag & drop your file here
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        or click to browse files
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 bg-[#f8fdfd] px-4 py-2 rounded-full">
                      Supports JPG, PNG, MP4, AVI (Max 50MB)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    id="story-upload"
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.mp4,.avi"
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {selectedFile && (
                <div className="rounded-xl overflow-hidden bg-[#f8fdfd] border border-[#e6f7f7] shadow-md">
                  {selectedFile.type.startsWith("image/") ? (
                    <img
                      src={
                        URL.createObjectURL(selectedFile) || "/placeholder.svg"
                      }
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(selectedFile)}
                      controls
                      className="w-full h-auto max-h-96"
                    />
                  )}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-[#e6f7f7]">
                        <FileText className="w-4 h-4 text-[#05A9A9]" />
                      </div>
                      <div>
                        <span className="text-sm font-medium truncate max-w-[180px] text-gray-700 block">
                          {selectedFile.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(1)}MB
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {selectedFile && (
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 flex items-center justify-center px-4 text-white font-medium rounded-full transition-all hover:shadow-lg transform hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #05A9A9, #4ecdc4)",
                    boxShadow: "0 4px 14px rgba(5, 169, 169, 0.2)",
                  }}
                >
                  {storyLoading ? <Spinner /> : "Create Story"}
                </button>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default NormalHomePage;
