import { addStory, getAllPostsWithComments } from "@/Api/post.api";
import { AddPost } from "@/components/Post/AddPost";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as Dialog from "@radix-ui/react-dialog";
import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type DragEvent,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ImageIcon,
  Layers,
  PlusIcon,
  Send,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cookies from "js-cookie";
import { getUserFullProfile } from "@/Api/profile.api";
import { Spinner } from "@/components/ui/Spinner";
import PostGalleryTwo from "@/components/Post/PostGalleryTwo";
import { tos } from "@/lib/utils";
import { PostCom } from "@/Types/post.type";

type StoryFile = File & {
  preview?: string; // For object URL preview
};

function SocialHomePage() {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [allPosts, setAllPosts] = useState<PostCom[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isError, isFetching } = useQuery(
    ["getAllPostsWithComments", page, limit],
    () => getAllPostsWithComments(page, limit),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  useEffect(() => {
    if (data && data.success) {
      if (page === 1) {
        setAllPosts(data.data);
      } else if (data.data.length > 0) {
        setAllPosts((prev) => {
          const existingIds = new Set(prev.map((post) => post._id));
          const newPosts = data.data.filter(
            (post) => !existingIds.has(post._id)
          );
          return [...prev, ...newPosts];
        });
      }

      setHasMore(data.data.length === limit);
    }
  }, [data, page, limit]);

  const [open, setOpen] = useState(false);
  const [currentStoryItemIndex, setCurrentStoryItemIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
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

  //   const { data: postComments, isLoading: isLoadingComment } = useQuery({
  //     queryKey: ["postComments", expandedPost],
  //     queryFn: () => {
  //       if (expandedPost) {
  //         return getcComments(expandedPost);
  //       }
  //     },
  //     enabled: !!expandedPost,
  //   });

  const { data: userFullProfile } = useQuery({
    queryKey: ["getUserFullProfile", userId],
    queryFn: () => {
      if (userId) {
        return getUserFullProfile(userId);
      }
    },
    enabled: !!userId,
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

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop <
        document.documentElement.offsetHeight - 100 ||
      isLoading ||
      isFetching ||
      !hasMore
    ) {
      return;
    }
    setPage((prev) => prev + 1);
  }, [isLoading, isFetching, hasMore]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Manual load more function
  const loadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // Reset to page 1 if needed (e.g., on pull-to-refresh)
  // const refreshPosts = () => {
  //   setPage(1);
  //   setHasMore(true);
  // };

  if (isError) return <div>Error loading posts</div>;

  return (
    // <div className="min-h-screen bg-gradient-to-b from-[#f8fdfd] to-white">
    <div className="min-h-screen">
      <div className="grid grid-cols-12 mx-auto gap-5 pr-1 md:px-4 py-2">
        <div className="col-span-12 lg:col-span-9  space-y-8">
          {/* story */}
          <div className="bg-white rounded-2xl shadow-lg p-2 md:p-6 overflow-hidden border border-[#e6f7f7]">
            <h2 className="font-medium text-lg mb-5 text-gray-800 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 rounded-full bg-gradient-to-b from-[#05A9A9] to-[#4ecdc4]"></span>
              Stories
            </h2>
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
              <div
                key="add-story"
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => {
                  setOpenFileUpload(true);
                }}
              >
                <div className="relative mb-2">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-gray-50 shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #f5f9f9, #ffffff)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #05A9A9, #4ecdc4)",
                      }}
                    >
                      <PlusIcon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600">Add</span>
              </div>

              {stories.map((story) => (
                <div
                  key={story.id}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => {
                    setViewingStory(story);
                    setCurrentStoryItemIndex(0);
                    setViewStory(true);
                    setStoryProgress(0);
                  }}
                >
                  <div className="relative mb-2">
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full p-0.5 shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105"
                      style={{
                        background:
                          "linear-gradient(135deg, #05A9A9, #4ecdc4, #a6e4e0)",
                        padding: "2px",
                      }}
                    >
                      <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                        <img
                          src={story.avatar || "/placeholder.svg"}
                          alt={story.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 truncate max-w-[80px] text-center">
                    {story.username.split("_")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* post header */}
          <div className="flex justify-between items-center px-1 md:px-10">
            <h2 className="font-medium text-lg text-gray-800 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 rounded-full bg-gradient-to-b from-[#05A9A9] to-[#4ecdc4]"></span>
              Your Feed
            </h2>
            <Button
              onClick={() => setOpen(true)}
              className="text-white flex items-center gap-2 rounded-full px-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #05A9A9, #4ecdc4)",
              }}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Create Post</span>
            </Button>
          </div>

          {/* post card */}
          <div className="space-y-6 max-w-xl mx-auto my-10">
            <div className="space-y-6">
              {[...(allPosts ?? [])]
                // .reverse()
                .map((post, index) => {
                  const postId = post._id || `post-${index}`;

                  return (
                    <div
                      key={postId}
                      className="rounded-t-2xl overflow-hidden "
                    >
                      <div className="w-full  ">
                        <PostGalleryTwo
                          key={post._id}
                          post={post}
                          index={index}
                        />
                      </div>
                    </div>
                  );
                })}

              {(isLoading || isFetching) && (
                <div className="w-full flex items-center justify-center h-16 rounded-lg border bg-primary/20 border-primary/40">
                  <Spinner />
                </div>
              )}

              {!isLoading && !isFetching && hasMore && (
                <button
                  onClick={loadMore}
                  disabled={isFetching}
                  className="load-more-btn my-4"
                >
                  {isFetching ? "Loading..." : "Load More"}
                </button>
              )}

              {!hasMore && allPosts.length > 0 && (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-full max-w-md px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-px flex-1 bg-primary-300"></div>
                      <span className="text-sm font-medium text-primary-600 px-2">
                        You're all caught up
                      </span>
                      <div className="h-px flex-1 bg-primary-300"></div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-primary-500 text-sm">
                        You've seen all the latest posts
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!hasMore && allPosts.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <div className="w-16 h-16 bg-[#05A9A9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Layers className="w-8 h-8 text-[#05A9A9]" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Your feed is empty
                  </h3>
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
        </div>

        {/* right side */}
        <div className="lg:col-span-3  hidden lg:block">
          <div className="sticky top-16  overflow-y-hidden">
            <div className="bg-white rounded-2xl shadow-lg border border-[#e6f7f7] p-4">
              <div
                className="h-28 rounded-t-md"
                style={{
                  background:
                    "linear-gradient(135deg, #05A9A9, #4ecdc4, #a6e4e0)",
                }}
              ></div>
              <div className="px-5 pb-5 pt-0 -mt-14">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage
                    src="https://i.pravatar.cc/100?img=7"
                    alt="Your profile"
                  />
                  <AvatarFallback
                    className="text-white text-xl"
                    style={{
                      background: "linear-gradient(135deg, #05A9A9, #4ecdc4)",
                    }}
                  >
                    {userFullProfile?.data.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <h3 className="font-medium text-lg mt-3 text-gray-800">
                  {userFullProfile?.data.name ?? "Your Name"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {userFullProfile?.data.position || "No position specified"}
                </p>

                <div className="h-[60vh] overflow-y-auto">
                  <div className="flex justify-between mt-5 text-center border-y border-[#e6f7f7] py-4">
                    <div>
                      <p className="font-medium text-gray-800">248</p>
                      <p className="text-xs text-gray-500">Posts</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">1,432</p>
                      <p className="text-xs text-gray-500">Followers</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">526</p>
                      <p className="text-xs text-gray-500">Following</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mt-4">
                    {userFullProfile?.data.bio || "No bio available"}
                  </p>

                  {userFullProfile?.data.experience?.find(
                    (exp) => exp.workingAt
                  ) && (
                    <div className="mt-5 p-4 bg-[#f8fdfd] rounded-xl">
                      <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                        <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-[#05A9A9] to-[#4ecdc4]"></span>
                        Currently
                      </h4>
                      <p className="font-medium text-gray-800 mt-1">
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

                  {userFullProfile?.data.education &&
                    userFullProfile?.data.education?.length > 0 && (
                      <div className="mt-5">
                        <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2 mb-2">
                          <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-[#05A9A9] to-[#4ecdc4]"></span>
                          Education
                        </h4>
                        {userFullProfile.data.education
                          .slice(0, 2)
                          .map((edu) => (
                            <div
                              key={edu._id}
                              className="mt-2 p-3 bg-[#f8fdfd] rounded-lg"
                            >
                              <p className="font-medium text-gray-800">
                                {edu.institution}
                              </p>
                              <p className="text-sm text-gray-600">
                                {edu.degree}
                                {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}

                  {userFullProfile?.data.skills &&
                    userFullProfile?.data.skills?.[0]?.skill?.length > 0 && (
                      <div className="mt-5">
                        <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2 mb-2">
                          <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-[#05A9A9] to-[#4ecdc4]"></span>
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {userFullProfile.data.skills[0].skill
                            .slice(0, 8)
                            .map((skill, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-[#e6f7f7] text-[#05A9A9] rounded-full text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                  {userFullProfile?.data.organization &&
                    userFullProfile?.data.organization?.length > 0 && (
                      <div className="mt-5">
                        <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2 mb-2">
                          <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-[#05A9A9] to-[#4ecdc4]"></span>
                          Organizations
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {userFullProfile.data.organization
                            .slice(0, 3)
                            .map((org) => (
                              <div
                                key={org._id}
                                className="flex items-center bg-[#f8fdfd] px-3 py-2 rounded-lg"
                              >
                                <div className="w-6 h-6 rounded-full bg-[#e6f7f7] flex items-center justify-center mr-2 text-[#05A9A9]">
                                  <span className="text-xs">🏢</span>
                                </div>
                                <span className="text-sm text-gray-700">
                                  {org.organizationName}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </div>
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
                <span className="inline-block w-1.5 h-5 rounded-full bg-gradient-to-b from-[#05A9A9] to-[#4ecdc4]"></span>
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
                <span className="inline-block w-1.5 h-5 rounded-full bg-gradient-to-b from-[#05A9A9] to-[#4ecdc4]"></span>
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

export default SocialHomePage;
