import EmptyCard from "./EmptyCard"
import type { Post } from "@/Types/profile.type"
import { formatDateToMonthYear, tos } from "@/lib/utils"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { deletePost } from "@/Api/profile.api"
import { CiCalendar } from "react-icons/ci"
import ImageCarousel from "../Profile/ImageCarousel"

interface ActivityCardProps {
  post: Post
  classname: string
  onclick: () => void
}

function sliceTo168Characters(text: string): string {
  const maxLength = 168
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text
}

const ActivityCard = ({ post, classname, onclick }: ActivityCardProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const queryClient = useQueryClient()

  // const postPictureURL =
  //   post.postPictures?.length > 0
  //     ? `https://awema.co/${post.postPictures[0].replace("public/", "")}`
  //     : undefined;

  const { mutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries("singleUserPost")
      tos.success("Success")
    },
  })

  return (
    <EmptyCard
      cardClassname={`relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] ${classname} rounded-2xl border border-gray-100 hover:border-primary/90 bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group`}
      contentClassname="flex flex-col sm:flex-row gap-0 cursor-pointer p-0 overflow-hidden"
      onClick={onclick}
    >
      <div className="w-full sm:w-2/5 md:w-1/3 relative overflow-hidden sm:max-w-[220px] h-[180px] sm:h-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-pink-500/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <ImageCarousel
          images={[
            "https://i.pravatar.cc/100?img=3",
            "https://i.pravatar.cc/100?img=4",
            "https://i.pravatar.cc/100?img=5",
          ]}
        />
      </div>

      <div className="flex flex-col p-5 gap-3 justify-between flex-1">
        <div className="space-y-2.5">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {post.postTitle}
          </h3>
          <p className="text-gray-600 line-clamp-3 text-[15px] leading-relaxed">
            {sliceTo168Characters(post.postContent)}
          </p>
        </div>
        <div className="flex gap-2 items-center text-sm text-gray-500 mt-1">
          <div className="flex items-center justify-center rounded-full bg-violet-50 p-1.5 text-primary">
            <CiCalendar className="w-4 h-4" />
          </div>
          <span className="font-medium text-primary">
            {formatDateToMonthYear(post.postDate)}
          </span>
        </div>
      </div>

      {/* 3-dot menu */}
      <div
        className="absolute top-3 right-3 z-10"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        <div className="p-2 rounded-full hover:bg-gray-100/80 backdrop-blur-sm transition-colors bg-white/70 shadow-sm">
          <MoreHorizontal className="w-5 h-5 text-gray-600 hover:text-primary cursor-pointer" />
        </div>

        {showMenu && (
          <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-xl border border-gray-100 text-sm z-20 overflow-hidden w-32 animate-in fade-in slide-in-from-top-5 duration-200">
            <button
              className="px-4 py-3 text-red-500 hover:bg-red-50 w-full text-left transition-colors font-medium flex items-center gap-2"
              onClick={() => {
                mutate(post._id)
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Delete
            </button>
          </div>
        )}
      </div>
    </EmptyCard>
  )
}

export default ActivityCard
