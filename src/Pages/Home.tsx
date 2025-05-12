import {
  addComment,
  getAllPostsWithComments,
  likeOrDeslike,
} from "@/Api/post.api";
import { AddPost } from "@/components/Post/AddPost";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  ImageIcon,
  Layers,
  MessageCircle,
  Send,
  Share2,
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

function Home() {
  const { data: allPostsWithComments } = useQuery({
    queryKey: ["getAllPostsWithComments"],
    queryFn: getAllPostsWithComments,
  });
  const [open, setOpen] = useState(false);
  const [currentStoryItemIndex, setCurrentStoryItemIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );
  const [viewStory, setViewStory] = useState(false);
  const queryClient = useQueryClient();
  const userId = Cookies.get("userId");

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

  const { data: userFullProfile } = useQuery({
    queryKey: ["getUserFullProfile", userId],
    queryFn: () => {
      if (userId) {
        return getUserFullProfile(userId);
      }
    },
    enabled: !!userId,
  });

  console.log("00000", userFullProfile);

  ///// mutuation
  const { mutate, isLoading } = useMutation({
    mutationFn: likeOrDeslike,
    onSuccess: () => {
      queryClient.invalidateQueries("getAllPostsWithComments");
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
      queryClient.invalidateQueries("getAllPostsWithComments");
    },
    onError: () => {},
  });

  const handleLike = (id: string) => {
    mutate({ like: "like", postId: id });
  };

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
    <div className="min-h-screen">
      <div className="w-full mx-auto flex gap-8 p-1 ">
        <div className="w-full  space-y-6">
          <div className="bg-white rounded-none md:rounded-2xl shadow-sm p-2  md:p-5 overflow-hidden">
            <h2 className="font-semibold  text-lg mb-4">Stories</h2>
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-4 scrollbar-hide px-2 md:px-0">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="min-w-[120px] md:min-w-[160px] h-[160px] md:h-[180px] rounded-lg md:rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setViewingStory(story);
                    setCurrentStoryItemIndex(0);
                    setViewStory(true);
                    setStoryProgress(0);
                  }}
                >
                  <div className="h-20 md:h-24 bg-gray-100 relative">
                    <img
                      src={
                        story.items[0]?.image ||
                        `/placeholder.svg?height=96&width=160&text=${encodeURIComponent(
                          story.title
                        )}`
                      }
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 md:top-2 left-1.5 md:left-2 ring-2 ring-white rounded-full">
                      <Avatar className="w-6 h-6 md:w-8 md:h-8">
                        <AvatarImage
                          src={story.avatar || "/placeholder.svg"}
                          alt={story.username}
                        />
                        <AvatarFallback className="bg-[#05A9A9]/10 text-[#05A9A9] text-xs md:text-base">
                          {story.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {story.items.length > 1 && (
                      <div className="absolute bottom-1.5 md:bottom-2 right-1.5 md:right-2 bg-black/50 text-white text-[10px] md:text-xs px-1 md:px-1.5 py-0.5 rounded-full">
                        {story.items.length}
                      </div>
                    )}
                  </div>
                  <div className="p-2 md:p-3 flex-1 flex flex-col justify-between">
                    <h3 className="font-medium text-xs md:text-sm line-clamp-1">
                      {story.title}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-500">
                      @{story.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <h2 className="font-medium text-lg">Your Feed</h2>
            <Button
              onClick={() => setOpen(true)}
              className="bg-[#05A9A9] hover:bg-[#048484] text-white flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Create Post</span>
            </Button>
          </div>

          <div className="space-y-6">
            {[...(allPostsWithComments?.data ?? [])]
              .reverse()
              .map((post, index) => {
                const postId = post._id || `post-${index}`;
                const isCommentsExpanded = expandedComments.includes(postId);

                return (
                  <div
                    key={postId}
                    className="rounded-2xl shadow-sm overflow-hidden bg-white"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <Avatar className="w-10 h-10 border">
                          <AvatarImage
                            src="/placeholder.svg?height=40&width=40"
                            alt={post.postOwner?.name || "User"}
                          />
                          <AvatarFallback className="bg-[#05A9A9]/10 text-[#05A9A9]">
                            {(post.postOwner?.name?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="font-medium">
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

                      <button className="text-gray-500 hover:text-gray-700 group relative">
                        <div className="flex items-center gap-1">
                          <FaEllipsisH className="w-5 h-5" />

                          {userId === post.postOwner?._id && (
                            <span
                              className="hidden group-hover:flex items-center gap-1 absolute top-4 right-2  ml-2 bg-white px-3 z-20 py-2 rounded shadow whitespace-nowrap"
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

                    <div className="aspect-video w-full  md:h-[58vh]  bg-gray-100">
                      <PostGallery key={post._id} post={post} index={index} />
                    </div>

                    <div className="p-2 md:p-5">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {post.postTitle}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {post.postContent || "No description provided."}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {["photography", "design", "creative"].map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-[#05A9A9]/10 text-[#05A9A9] rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <Separator className="my-3" />

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
                          <span>{post.comments?.length || 0} comments</span>
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
                          className="flex items-center justify-center flex-1 gap-2 h-9 px-4 rounded border bg-white border-gray-300"
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
                            <Heart
                              className={`w-4 h-4 ${
                                post.isLikedByUser
                                  ? "text-red-500 fill-red-500"
                                  : "text-gray-500"
                              }`}
                            />
                          </motion.div>
                          <span className="text-sm">
                            {post.isLikedByUser ? "Liked" : "Like"}
                          </span>
                        </motion.button>
                        <Button
                          variant="outline"
                          className="flex-1 h-9"
                          onClick={() => toggleComments(postId)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Comment
                        </Button>
                        <Button variant="outline" className="w-9 h-9 p-0">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>

                      {isCommentsExpanded && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src="/placeholder.svg?height=32&width=32"
                                alt="Your avatar"
                              />
                              <AvatarFallback className="bg-[#05A9A9]/10 text-[#05A9A9]">
                                YA
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                              <Textarea
                                placeholder="Add a comment..."
                                className="min-h-[40px] resize-none"
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
                                className="h-10 w-10 bg-[#05A9A9] hover:bg-[#048484]"
                                onClick={() =>
                                  submitComment({ postId, userId: post.userid })
                                }
                                disabled={!commentInputs[postId]?.trim()}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <h4 className="font-medium text-sm mb-3">Comments</h4>

                          <div className="space-y-3 mb-4">
                            {post.comments && post.comments.length > 0 ? (
                              post.comments.map((comment, i) => (
                                <div key={i} className="flex gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage
                                      src={`/placeholder.svg?height=32&width=32&text=${
                                        post?.commenterDetails?.find(
                                          (user) =>
                                            user._id === comment.commentedBy
                                        ) || "U"
                                      }`}
                                      // alt={post?.commenterDetails?.find((user) => user._id === comment.commentedBy) || "User"}
                                    />
                                    <AvatarFallback className="bg-[#05A9A9]/10 text-[#05A9A9]">
                                      {(
                                        post?.commenterDetails
                                          ?.find(
                                            (user) =>
                                              user._id === comment.commentedBy
                                          )
                                          ?.name?.slice(0, 1) || "U"
                                      )?.toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 bg-gray-50 p-3 rounded-xl">
                                    <div className="flex justify-between items-start">
                                      <p className="font-medium text-sm">
                                        {post?.commenterDetails?.find(
                                          (user) =>
                                            user._id === comment.commentedBy
                                        )?.name || "Anonymous"}
                                      </p>
                                      <span className="text-xs text-gray-500">
                                        {formatDateSmart(
                                          comment.createdAt,
                                          true
                                        ) +
                                          " at " +
                                          formatMessageTime(comment.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-sm font-light mt-1">
                                      {comment.comment}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">
                                No comments yet. Be the first to comment!
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {(!allPostsWithComments?.data ||
              allPostsWithComments.data.length === 0) && (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-[#05A9A9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8 text-[#05A9A9]" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your feed is empty</h3>
                <p className="text-gray-500 mb-4">
                  Start sharing moments with your friends
                </p>
                <Button
                  onClick={() => setOpen(true)}
                  className="bg-[#05A9A9] hover:bg-[#048484]"
                >
                  Create Your First Post
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="w-96 hidden lg:block">
          <div className="sticky top-16 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="h-24 bg-[#05A9A9]"></div>
              <div className="px-5 pb-5 pt-0 -mt-10">
                {/* Profile Header */}
                <Avatar className="w-20 h-20 border-4 border-white">
                  <AvatarImage
                    src="https://i.pravatar.cc/100?img=7"
                    alt="Your profile"
                  />
                  <AvatarFallback className="bg-[#05A9A9]/10 text-[#05A9A9] text-xl">
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
              <Dialog.Title className="text-xl font-semibold">
                Create New Post
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-800 rounded-full p-1 hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {/* <div className="border border-dashed border-gray-300 rounded-xl p-6 mb-4 text-center">
              <div className="w-16 h-16 bg-[#05A9A9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-[#05A9A9]" />
              </div>
              <p className="text-gray-600 mb-4">
                Drag and drop your photo here, or click to browse
              </p>
              <Button className="bg-[#05A9A9] hover:bg-[#048484]">
                Upload Photo
              </Button>
            </div> */}

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
                console.log(viewStory);
              }}
            />
            <Dialog.Content className="fixed inset-0 mx-auto z-50 w-[50%] bg-red-400 flex items-center justify-center focus:outline-none">
              <div className="relative w-full max-w-3xl mx-auto">
                <div className="absolute top-0 left-4 right-4 flex gap-1 z-10 p-4">
                  {viewingStory.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="h-1 rounded-full flex-1 overflow-hidden bg-white/30"
                    >
                      {idx === currentStoryItemIndex && (
                        <div
                          className="h-full bg-white transition-all duration-100 ease-linear"
                          style={{ width: `${storyProgress}%` }}
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
                    <Avatar className="w-10 h-10 border-2 border-white">
                      <AvatarImage
                        src={viewingStory.avatar || "/placeholder.svg"}
                        alt={viewingStory.username}
                      />
                      <AvatarFallback className="bg-[#05A9A9]/10 text-[#05A9A9]">
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
                      className="text-white hover:text-gray-200 rounded-full p-1"
                      onClick={() => setViewStory(false)} // Explicit close handler
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </Dialog.Close>
                </div>

                <div
                  className="aspect-[9/16] bg-black rounded-lg overflow-hidden"
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
                      // Go to next item or next story
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
                      `/placeholder.svg?height=1280&width=720&text=${encodeURIComponent(
                        viewingStory.title
                      )}`
                    }
                    alt={viewingStory.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Navigation buttons */}
                <button
                  className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50"
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
                  className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50"
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

                {/* Story interaction */}
                <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 flex items-center">
                    <input
                      type="text"
                      placeholder="Reply to story..."
                      className="bg-transparent border-none text-white placeholder-white/70 focus:outline-none"
                    />
                    <button className="ml-2 text-white">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
}

export default Home;
