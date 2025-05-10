"use client"

import { getAllPostsWithComments } from "@/Api/post.api"
import { AddPost } from "@/components/Post/AddPost"
import { useQuery } from "react-query"
import * as Dialog from "@radix-ui/react-dialog"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Bookmark,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  ImageIcon,
  Layers,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

function Home() {
  const { data: allPostsWithComments } = useQuery({
    queryKey: ["getAllPostsWithComments"],
    queryFn: getAllPostsWithComments,
  })
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("following")
  const [currentStoryItemIndex, setCurrentStoryItemIndex] = useState(0)
  const [storyProgress, setStoryProgress] = useState(0)
  const [expandedComments, setExpandedComments] = useState<string[]>([])
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})

  const stories = [
    {
      id: 1,
      username: "sarah_j",
      title: "Mountain Trip",
      avatar: "/placeholder.svg?height=80&width=80",
      items: [
        {
          id: "s1-1",
          image: "/placeholder.svg?height=1280&width=720&text=Mountain%20View",
        },
        {
          id: "s1-2",
          image: "/placeholder.svg?height=1280&width=720&text=Hiking%20Trail",
        },
      ],
    },
    {
      id: 2,
      username: "mike_design",
      title: "New Project",
      avatar: "/placeholder.svg?height=80&width=80",
      items: [
        {
          id: "s2-1",
          image: "/placeholder.svg?height=1280&width=720&text=Design%20Mockup",
        },
      ],
    },
    {
      id: 3,
      username: "travel_lisa",
      title: "Paris",
      avatar: "/placeholder.svg?height=80&width=80",
      items: [
        {
          id: "s3-1",
          image: "/placeholder.svg?height=1280&width=720&text=Eiffel%20Tower",
        },
        {
          id: "s3-2",
          image: "/placeholder.svg?height=1280&width=720&text=Louvre%20Museum",
        },
        {
          id: "s3-3",
          image: "/placeholder.svg?height=1280&width=720&text=Seine%20River",
        },
      ],
    },
    {
      id: 4,
      username: "photo_chris",
      title: "Portraits",
      avatar: "/placeholder.svg?height=80&width=80",
      items: [
        {
          id: "s4-1",
          image: "/placeholder.svg?height=1280&width=720&text=Portrait%201",
        },
        {
          id: "s4-2",
          image: "/placeholder.svg?height=1280&width=720&text=Portrait%202",
        },
      ],
    },
    {
      id: 5,
      username: "fitness_alex",
      title: "Workout",
      avatar: "/placeholder.svg?height=80&width=80",
      items: [
        {
          id: "s5-1",
          image: "/placeholder.svg?height=1280&width=720&text=Gym%20Session",
        },
      ],
    },
    {
      id: 6,
      username: "food_maria",
      title: "Recipes",
      avatar: "/placeholder.svg?height=80&width=80",
      items: [
        {
          id: "s6-1",
          image: "/placeholder.svg?height=1280&width=720&text=Pasta%20Recipe",
        },
        {
          id: "s6-2",
          image: "/placeholder.svg?height=1280&width=720&text=Dessert",
        },
      ],
    },
  ]

  const [viewingStory, setViewingStory] = useState<null | {
    id: number
    username: string
    title: string
    avatar: string
    items: Array<{ id: string; image: string }>
  }>(null)

  useEffect(() => {
    if (!viewingStory) return

    const storyDuration = 5000
    const interval = 100
    let timer: NodeJS.Timeout
    let progressTimer: NodeJS.Timeout

    setStoryProgress(0)

    progressTimer = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 100 / (storyDuration / interval)
      })
    }, interval)

    timer = setTimeout(() => {
      if (currentStoryItemIndex < viewingStory.items.length - 1) {
        setCurrentStoryItemIndex((prev) => prev + 1)
        setStoryProgress(0)
      } else {
        const currentIndex = stories.findIndex((s) => s.id === viewingStory.id)
        const nextIndex = (currentIndex + 1) % stories.length
        setViewingStory(stories[nextIndex])
        setCurrentStoryItemIndex(0)
        setStoryProgress(0)
      }
    }, storyDuration)

    return () => {
      clearTimeout(timer)
      clearInterval(progressTimer)
    }
  }, [viewingStory, currentStoryItemIndex])

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    )
  }

  const handleCommentChange = (postId: string, value: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }))
  }

  const submitComment = (postId: string) => {
    console.log(`Submitting comment for post ${postId}:`, commentInputs[postId])

    setCommentInputs((prev) => ({
      ...prev,
      [postId]: "",
    }))
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto flex gap-8 p-4">
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-5 overflow-hidden">
            <h2 className="font-semibold  text-lg mb-4">Stories</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="min-w-[160px] h-[180px] rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setViewingStory(story)
                    setCurrentStoryItemIndex(0)
                    setStoryProgress(0)
                  }}
                >
                  <div className="h-24 bg-gray-100 relative">
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
                    <div className="absolute top-2 left-2 ring-2 ring-white rounded-full">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={story.avatar || "/placeholder.svg"}
                          alt={story.username}
                        />
                        <AvatarFallback className="bg-[#05A9A9]/10 text-[#05A9A9]">
                          {story.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {story.items.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {story.items.length}
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h3 className="font-medium text-sm line-clamp-1">
                      {story.title}
                    </h3>
                    <p className="text-xs text-gray-500">@{story.username}</p>
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
                const postId = post._id || `post-${index}`
                const isCommentsExpanded = expandedComments.includes(postId)

                return (
                  <div
                    key={postId}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <Avatar className="w-10 h-10 border">
                          <AvatarImage
                            src="/placeholder.svg?height=40&width=40"
                            alt={post.user?.name || "User"}
                          />
                          <AvatarFallback className="bg-[#05A9A9]/10 text-[#05A9A9]">
                            {(post.user?.name?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="font-medium">
                            {post.user?.name || "Anonymous"}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-500 hover:text-gray-700">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="aspect-video bg-gray-100">
                      <img
                        src={
                          post.image ||
                          `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(
                            post.title || "Post Image"
                          )}`
                        }
                        alt={post.title || "Post"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-5">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {post.content || "No description provided."}
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
                          <span>{post.likes?.length || 0} likes</span>
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
                        <Button variant="outline" className="flex-1 h-9">
                          <Heart className="w-4 h-4 mr-2" />
                          Like
                        </Button>
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
                          <h4 className="font-medium text-sm mb-3">Comments</h4>

                          <div className="space-y-3 mb-4">
                            {post.comments && post.comments.length > 0 ? (
                              post.comments.map((comment: any, i: number) => (
                                <div key={i} className="flex gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage
                                      src={`/placeholder.svg?height=32&width=32&text=${
                                        comment.user?.name?.[0] || "U"
                                      }`}
                                      alt={comment.user?.name || "User"}
                                    />
                                    <AvatarFallback className="bg-[#05A9A9]/10 text-[#05A9A9]">
                                      {(
                                        comment.user?.name?.[0] || "U"
                                      ).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 bg-gray-50 p-3 rounded-xl">
                                    <div className="flex justify-between items-start">
                                      <p className="font-medium text-sm">
                                        {comment.user?.name || "Anonymous"}
                                      </p>
                                      <span className="text-xs text-gray-500">
                                        {new Date(
                                          comment.createdAt
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm mt-1">
                                      {comment.content}
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
                              />
                              <Button
                                size="icon"
                                className="h-10 w-10 bg-[#05A9A9] hover:bg-[#048484]"
                                onClick={() => submitComment(postId)}
                                disabled={!commentInputs[postId]?.trim()}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
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

        <div className="w-80 hidden lg:block">
          <div className="sticky top-20 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="h-24 bg-[#05A9A9]"></div>
              <div className="px-5 pb-5 pt-0 -mt-10">
                <Avatar className="w-20 h-20 border-4 border-white">
                  <AvatarImage
                    src="/placeholder.svg?height=80&width=80"
                    alt="Your profile"
                  />
                  <AvatarFallback className="bg-[#05A9A9]/10 text-[#05A9A9] text-xl">
                    YP
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg mt-2">Your Name</h3>
                <p className="text-gray-500 text-sm">@username</p>

                <div className="flex justify-between mt-4 text-center">
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

                <Button className="w-full mt-4 bg-[#05A9A9] hover:bg-[#048484]">
                  Edit Profile
                </Button>
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

            <div className="border border-dashed border-gray-300 rounded-xl p-6 mb-4 text-center">
              <div className="w-16 h-16 bg-[#05A9A9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-[#05A9A9]" />
              </div>
              <p className="text-gray-600 mb-4">
                Drag and drop your photo here, or click to browse
              </p>
              <Button className="bg-[#05A9A9] hover:bg-[#048484]">
                Upload Photo
              </Button>
            </div>

            <AddPost onSuccess={() => setOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {viewingStory && (
        <Dialog.Root
          open={!!viewingStory}
          onOpenChange={() => setViewingStory(null)}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center focus:outline-none">
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
                    <button className="text-white hover:text-gray-200 rounded-full p-1">
                      <X className="w-6 h-6" />
                    </button>
                  </Dialog.Close>
                </div>

                <div
                  className="aspect-[9/16] bg-black rounded-lg overflow-hidden"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const isLeftSide = x < rect.width / 2

                    if (isLeftSide) {
                      if (currentStoryItemIndex > 0) {
                        setCurrentStoryItemIndex(currentStoryItemIndex - 1)
                        setStoryProgress(0)
                      } else {
                        const currentIndex = stories.findIndex(
                          (s) => s.id === viewingStory.id
                        )
                        const prevIndex =
                          (currentIndex - 1 + stories.length) % stories.length
                        setViewingStory(stories[prevIndex])
                        setCurrentStoryItemIndex(
                          stories[prevIndex].items.length - 1
                        )
                        setStoryProgress(0)
                      }
                    } else {
                      // Go to next item or next story
                      if (
                        currentStoryItemIndex <
                        viewingStory.items.length - 1
                      ) {
                        setCurrentStoryItemIndex(currentStoryItemIndex + 1)
                        setStoryProgress(0)
                      } else {
                        const currentIndex = stories.findIndex(
                          (s) => s.id === viewingStory.id
                        )
                        const nextIndex = (currentIndex + 1) % stories.length
                        setViewingStory(stories[nextIndex])
                        setCurrentStoryItemIndex(0)
                        setStoryProgress(0)
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
                    e.stopPropagation()
                    if (currentStoryItemIndex > 0) {
                      setCurrentStoryItemIndex((prev) => prev - 1)
                      setStoryProgress(0)
                    } else {
                      const currentIndex = stories.findIndex(
                        (s) => s.id === viewingStory.id
                      )
                      const prevIndex =
                        (currentIndex - 1 + stories.length) % stories.length
                      setViewingStory(stories[prevIndex])
                      setCurrentStoryItemIndex(
                        stories[prevIndex].items.length - 1
                      )
                      setStoryProgress(0)
                    }
                  }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (currentStoryItemIndex < viewingStory.items.length - 1) {
                      setCurrentStoryItemIndex((prev) => prev + 1)
                      setStoryProgress(0)
                    } else {
                      const currentIndex = stories.findIndex(
                        (s) => s.id === viewingStory.id
                      )
                      const nextIndex = (currentIndex + 1) % stories.length
                      setViewingStory(stories[nextIndex])
                      setCurrentStoryItemIndex(0)
                      setStoryProgress(0)
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
  )
}

export default Home
