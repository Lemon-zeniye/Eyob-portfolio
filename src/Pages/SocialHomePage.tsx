import {
  addStory,
  deleteStory,
  getAllPostsWithComments,
  getAllUserStories,
  likeOrDeslikeStory,
  trackStoryView,
} from "@/Api/post.api";
import { AddPost } from "@/components/Post/AddPost";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
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
  Eye,
  FileText,
  Heart,
  ImageIcon,
  Layers,
  PlusIcon,
  // Send,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cookies from "js-cookie";
// import { getUserFullProfile, getUserProfile } from "@/Api/profile.api";
import { Spinner } from "@/components/ui/Spinner";
import PostGalleryTwo from "@/components/Post/PostGalleryTwo";
import { tos, transformInfiniteStories } from "@/lib/utils";
import { PostCom } from "@/Types/post.type";
import { getAxiosErrorMessage } from "@/Api/axios";
import { Input } from "@/components/ui/input";
import { getAppliedJobs } from "@/Api/job.api";
import { RelatedJobSkeleton } from "@/components/Jobs/JobDetailNew";
import { useRole } from "@/Context/RoleContext";
import { RelatedJob } from "@/components/Jobs/RelatedJob";
// import CustomVideoPlayer from "@/components/Video/Video";

type StoryFile = File & {
  preview?: string; // For object URL preview
};

function SocialHomePage() {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [allPosts, setAllPosts] = useState<PostCom[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isError, isFetching } = useQuery(
    ["getAllPostsWithComments", page, limit, "social"],
    () => getAllPostsWithComments(page, limit, "social"),
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

      setHasMore(data.data.length >= limit);
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
  // const profileImage = Cookies.get("profilePic");
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [showAll, setShowAll] = useState(false);

  const { mode } = useRole();

  const [viewingStory, setViewingStory] = useState<null | {
    id: number;
    username: string;
    _id: string;
    likes: number;
    isViewedByUser: boolean;
    isLikedByUser: boolean;
    userId: string;
    views: number;
    avatar: string;
    caption?: string;
    items: Array<{ id: string; image: string }>;
  }>(null);

  useEffect(() => {
    if (!viewingStory) return;

    const storyDuration = 10000;
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

  const { data: appliedJobs } = useQuery({
    queryKey: ["appliedJobs"],
    queryFn: getAppliedJobs,
  });

  const jobsToShow = showAll
    ? appliedJobs?.data?.slice()?.reverse()
    : appliedJobs?.data?.slice()?.reverse()?.slice(0, 3);

  // const { data: userData } = useQuery({
  //   queryKey: ["userProfile"],
  //   queryFn: getUserProfile,
  // });

  // const { data: userFullProfile } = useQuery({
  //   queryKey: ["getUserFullProfile", userId],
  //   queryFn: () => {
  //     if (userId) {
  //       return getUserFullProfile(userId);
  //     }
  //   },
  //   enabled: !!userId,
  // });

  const { mutate: addUserStory, isLoading: storyLoading } = useMutation({
    mutationFn: addStory,
    onSuccess: () => {
      queryClient.invalidateQueries("userStories");
      setOpenFileUpload(false);
      removeFile();
      tos.success("Story added Successfully");
    },
    onError: () => {},
  });

  const {
    data: userStories,
    isLoading: isLoadingStories,
    isFetching: isFetchingStories,
    fetchNextPage: fetchNextStories,
    hasNextPage: hasNextStories,
  } = useInfiniteQuery({
    queryKey: ["userStories"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getAllUserStories(pageParam);
      return res;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.data && lastPage?.data?.length > 0
        ? allPages.length + 1
        : undefined;
    },
  });

  // const stories = userStories ? transformStories(userStories) : [];
  const stories = userStories
    ? userStories?.pages &&
      transformInfiniteStories(userStories?.pages?.flatMap((page) => page.data))
    : [];

  // story scroll effects
  const storiesContainerRef = useRef<HTMLDivElement>(null);

  const handleStoriesScroll = useCallback(() => {
    if (!storiesContainerRef.current) return;

    const { scrollLeft, clientWidth, scrollWidth } =
      storiesContainerRef.current;

    // Check if scrolled near the right edge (with 100px buffer)
    const isNearRightEdge = scrollLeft + clientWidth >= scrollWidth - 100;

    // Early return if conditions aren't met
    if (
      !isNearRightEdge ||
      isLoadingStories ||
      isFetchingStories ||
      !hasNextStories
    ) {
      return;
    }

    fetchNextStories();
  }, [isLoadingStories, isFetchingStories, hasNextStories, fetchNextStories]);

  // Add horizontal scroll event listener
  useEffect(() => {
    const container = storiesContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleStoriesScroll);
    return () => container.removeEventListener("scroll", handleStoriesScroll);
  }, [handleStoriesScroll]);

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

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      // Cleanup function
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [selectedFile]);

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
      tos.error("Please select a valid file type (JPG, PNG, MP4)");
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

  const { mutate: likeStory } = useMutation({
    mutationFn: likeOrDeslikeStory,
    onSuccess: () => {
      queryClient.invalidateQueries(["userStories"]);
      tos.success("You liked the story");
    },
  });

  const { mutate: tracStory } = useMutation({
    mutationFn: trackStoryView,
    onSuccess: () => {
      queryClient.invalidateQueries(["userStories"]);
    },
  });

  useEffect(() => {
    if (viewingStory?._id && !viewingStory?.isViewedByUser) {
      tracStory({ storyid: viewingStory._id });
    }
  }, [viewingStory]);

  const { mutate: deleteUserStory } = useMutation({
    mutationFn: deleteStory,
    onSuccess: () => {
      queryClient.invalidateQueries(["userStories"]);
      tos.success("You delete the story");
      setViewStory(false);
    },
    onError: (e) => {
      const message = getAxiosErrorMessage(e);
      tos.error(message);
      setViewStory(false);
    },
  });

  const handleSubmit = () => {
    if (!selectedFile) return;

    // Create FormData for your API call
    const formData = new FormData();
    formData.append("storyFile", selectedFile);
    if (caption && caption !== "") {
      formData.append("caption", caption);
    }

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
      <div className="rounded-2xl scrollbar-hide  overflow-hidden">
        <div
          className="flex gap-5 overflow-x-auto  scrollbar-hide"
          ref={storiesContainerRef}
        >
          <div
            key="add-story"
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => {
              setOpenFileUpload(true);
            }}
          >
            <div className="relative mb-2">
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-gray-50 shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #FFA500, #ffffff)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{
                    background: "#FFA500",
                  }}
                >
                  <PlusIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-600">Add</span>
          </div>

          {stories?.map((story) => (
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
              <div className="relative mb-1">
                <div
                  className={`w-14 h-14  md:w-16 md:h-16 rounded-full p-0.5 shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 ${
                    story.isViewedByUser
                      ? "bg-gray-300"
                      : "bg-gradient-to-br from-[#FFA500] via-[#fac970] to-[#f2cf8f]"
                  }`}
                >
                  <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                    <img
                      src={story?.items[0]?.image}
                      alt={story?.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600 truncate max-w-[60px] text-center">
                {story?.username}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-12 mx-auto gap-5 pr-1 md:px-4 py-2">
        {/* post card */}
        <div className="col-span-12 lg:col-span-9   space-y-8">
          <div className="space-y-2 max-w-xl mx-auto my-4">
            <div className="w-full flex justify-end">
              <Button
                onClick={() => setOpen(true)}
                className="text-white flex items-center gap-2 rounded-full px-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #FFA500, #f2cf8f)",
                }}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Create Post</span>
              </Button>
            </div>
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
                      <div className="w-full ">
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
                <div className="w-full flex items-center justify-center h-16 rounded-lg border bg-primary2/20 border-primary2/40">
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
                      <div className="h-px flex-1 bg-primary2"></div>
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
                  <div className="w-16 h-16 bg-primary2/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Layers className="w-8 h-8 text-primary2" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Your feed is empty
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start sharing moments with your friends
                  </p>
                  <Button
                    onClick={() => setOpen(true)}
                    className="bg-primary2 hover:bg-primary2/50"
                  >
                    Create Your First Post
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* the right side */}
        <div className="lg:col-span-3  hidden lg:block ">
          <div className="sticky top-20 overflow-y-hidden bg-white rounded-2xl shadow-lg border border-[#e6f7f7] p-4">
            <h1 className="text-xl font-semibold my-2">Recently Applied</h1>
            <div className="min-h-[10vh] max-h-[80vh] pb-10 overflow-y-auto">
              <div className="flex flex-col gap-y-2 md:items-center justify-between">
                <div className="flex flex-col gap-y-2 md:items-center justify-between">
                  {isLoading ? (
                    ["1", "2", "3"].map((_, index) => (
                      <RelatedJobSkeleton key={index} />
                    ))
                  ) : jobsToShow && jobsToShow?.length > 0 ? (
                    jobsToShow.map((job) => (
                      <RelatedJob key={job._id} job={job?.jobid} />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center my-4">
                      You haven’t applied to any jobs yet.
                    </p>
                  )}

                  {!isLoading &&
                    appliedJobs?.data &&
                    appliedJobs?.data.length > 3 && (
                      <Button
                        className={`px-4 py-2 rounded-none w-full mx-6 ${
                          mode === "formal"
                            ? "bg-primary"
                            : "bg-primary2 hover:bg-primary2/70"
                        }`}
                        onClick={() => setShowAll((prev) => !prev)}
                      >
                        {showAll ? "Show Less" : "Explore More"}
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right side */}
        {/* <div className="lg:col-span-3  hidden lg:block">
          <div className="sticky top-16  overflow-y-hidden">
            <div className="bg-white rounded-2xl shadow-lg border border-[#e6f7f7] p-4">
              <div
                className="h-32 rounded-t-md"
                style={{
                  background:
                    "linear-gradient(135deg, #FFA500, #fac970, #f2cf8f)",
                }}
              >
                <CustomVideoPlayer
                  otherUser={undefined}
                  isOtherUser={false}
                  fromChat={true}
                  showUpload={false}
                />
              </div>
              <div className="px-5 pb-5 pt-0 -mt-8">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage
                    className="object-cover"
                    src={profileImage}
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
                  {(userData?.data && userData?.data?.position) ||
                    "No position specified"}
                </p>

                <div className="h-[60vh] pb-10 overflow-y-auto">
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
                    {(userData?.data && userData?.data?.bio) ||
                      "No bio available"}
                  </p>

                  {userFullProfile?.data.experience?.find(
                    (exp) => exp.workingAt
                  ) && (
                    <div className="mt-5 p-4 bg-primary2/5 rounded-xl">
                      <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                        <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-primary2 to-primary2/50"></span>
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
                          <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-primary2 to-primary2/50"></span>
                          Education
                        </h4>
                        {userFullProfile.data.education
                          .slice(0, 2)
                          .map((edu) => (
                            <div
                              key={edu._id}
                              className="mt-2 p-3 bg-primary2/5 rounded-lg"
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
                    userFullProfile?.data.skills?.length > 0 && (
                      <div className="mt-5">
                        <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2 mb-2">
                          <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-primary2 to-primary2/50"></span>
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {userFullProfile.data.skills.map((ski) => (
                            <span
                              key={ski._id}
                              className="px-3 py-1 bg-primary2/10 text-primary2 rounded-full text-xs font-medium"
                            >
                              {ski.skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {userFullProfile?.data.organization &&
                    userFullProfile?.data.organization?.length > 0 && (
                      <div className="mt-5">
                        <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2 mb-2">
                          <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-primary2 to-primary2/50"></span>
                          Organizations
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {userFullProfile.data.organization
                            .slice(0, 3)
                            .map((org) => (
                              <div
                                key={org._id}
                                className="flex items-center bg-primary2/5 px-3 py-2 rounded-lg"
                              >
                                <div className="w-6 h-6 rounded-full bg-primary2 flex items-center justify-center mr-2 text-primary2">
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
        </div> */}
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-medium text-gray-800 flex items-center gap-2">
                <span className="inline-block w-1.5 h-5 rounded-full bg-gradient-to-b from-primary2 to-primary2/50"></span>
                Create New Post
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-primary2 rounded-full p-2 hover:bg-[#f8fdfd] transition-colors duration-200">
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
              <div className="relative w-full max-w-3xl max-h-screen  mx-auto">
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
                              "linear-gradient(to right, #fda90b, #fcc358)",
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
                        className="object-cover"
                      />
                      <AvatarFallback className="text-white bg-primary2">
                        {viewingStory?.username
                          ? viewingStory?.username[0]?.toUpperCase()
                          : ""}
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
                  className="h-[calc(100vh-10rem)] min-h-[400px]  bg-black rounded-xl overflow-hidden shadow-2xl"
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
                        encodeURIComponent(viewingStory.username) ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }`
                    }
                    alt={viewingStory.username}
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

                {/* <div className="absolute bottom-8 bg-white/10 backdrop-blur-md  rounded-full px-4 mx-auto w-fit left-0 right-0 flex items-center justify-center">
                  

                  <span className="px-2"> {viewingStory.likes || 0}</span>
                  <span className="px-2"> {viewingStory.views || 0}</span>

                  <button
                    className="ml-2 text-white bg-primary2/70 p-2 rounded-full hover:bg-primary2/50 transition-colors duration-200"
                    onClick={() =>
                      likeStory({
                        storyid: viewingStory._id,
                        like: viewingStory.isLikedByUser
                          ? "neutralize"
                          : "like",
                      })
                    }
                  >
                    <Heart
                      className={`w-5 h-5${
                        viewingStory.isLikedByUser
                          ? " text-red-400"
                          : "text-black"
                      }`}
                    />
                  </button>
                  {userId === viewingStory.userId && (
                    <button
                      className="ml-2 text-white bg-red-500 p-2 rounded-full hover:bg-red-400 transition-colors duration-200"
                      onClick={() => deleteUserStory(viewingStory._id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div> */}

                <div className="absolute bottom-8 bg-white/10 backdrop-blur-md rounded-full px-4 mx-auto w-fit left-0 right-0 flex items-center justify-center gap-2 py-2 border border-white/20 shadow-lg">
                  {/* Views - with eye icon */}
                  <div className="flex items-center text-sm text-white/80">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{viewingStory.views || 0}</span>
                  </div>

                  {/* Divider */}
                  <div className="h-4 w-px bg-white/30"></div>

                  {/* Likes - with heart icon and count */}
                  <div className="flex items-center">
                    <button
                      className="flex items-center justify-center p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
                      onClick={() =>
                        likeStory({
                          storyid: viewingStory._id,
                          like: viewingStory.isLikedByUser
                            ? "neutralize"
                            : "like",
                        })
                      }
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          viewingStory.isLikedByUser
                            ? "text-red-500 fill-red-500"
                            : "text-white/70 fill-transparent"
                        }`}
                      />
                    </button>
                    <span className="ml-1 text-sm text-white/80">
                      {viewingStory.likes || 0}
                    </span>
                  </div>

                  {/* Delete button (only for owner) */}
                  {userId === viewingStory.userId && (
                    <>
                      <div className="h-4 w-px bg-white/30"></div>
                      <button
                        className="flex items-center justify-center p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
                        onClick={() => deleteUserStory(viewingStory._id)}
                      >
                        <Trash2 className="w-5 h-5 text-white/70 hover:text-red-400 transition-colors" />
                      </button>
                    </>
                  )}
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
                <span className="inline-block w-1.5 h-5 rounded-full bg-gradient-to-b from-primary2 to-primary2/50"></span>
                Create New Story
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-primary2 rounded-full p-2 hover:bg-[#f8fdfd] transition-colors duration-200">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              {!selectedFile && (
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-primary2 bg-[#f8fdfd]"
                      : "border-[#e6f7f7] hover:border-primary2 hover:bg-[#f8fdfd]"
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
                      <Upload className="w-7 h-7 text-primary2" />
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
                      Supports JPG, PNG, MP4 (Max 50MB)
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
                <>
                  <div className="rounded-xl overflow-hidden bg-[#f8fdfd] border border-[#e6f7f7] shadow-md">
                    {selectedFile.type.startsWith("image/") ? (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    ) : (
                      <video
                        src={previewUrl}
                        controls
                        className="w-full h-auto max-h-96"
                      />
                    )}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-[#e6f7f7]">
                          <FileText className="w-4 h-4 text-primary2" />
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
                  <Input
                    placeholder="Write a caption (optional)"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full rounded-md my-3"
                  />
                </>
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
