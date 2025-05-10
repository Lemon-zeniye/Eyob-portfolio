import EmptyCard from "./EmptyCard";
import { Post } from "@/Types/profile.type";
import { formatDateToMonthYear, tos } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { deletePost } from "@/Api/profile.api";
import { CiCalendar } from "react-icons/ci";
import ImageCarousel from "../Profile/ImageCarousel";

interface ActivityCardProps {
  post: Post;
  classname: string;
  onclick: () => void;
}

function sliceTo168Characters(text: string): string {
  const maxLength = 168;
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

const ActivityCard = ({ post, classname, onclick }: ActivityCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const queryClient = useQueryClient();

  // const postPictureURL =
  //   post.postPictures?.length > 0
  //     ? `https://awema.co/${post.postPictures[0].replace("public/", "")}`
  //     : undefined;

  const { mutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries("singleUserPost");
      tos.success("Success");
    },
  });

  return (
    <EmptyCard
      cardClassname={`relative  ${classname}`}
      contentClassname="flex flex-row gap-4 cursor-pointer p-0"
      onClick={onclick}
    >
      <ImageCarousel
        images={[
          "https://i.pravatar.cc/100?img=3",
          "https://i.pravatar.cc/100?img=4",
          "https://i.pravatar.cc/100?img=5",
        ]}
      />

      <div className="flex flex-col pb-2 gap-2 justify-between">
        <div>
          <p className="text-lg font-semibold">{post.postTitle}</p>
          <p className="">{sliceTo168Characters(post.postContent)}</p>
        </div>
        <div className="flex gap-2 items-center text-sm text-gray-500 ">
          <CiCalendar className="w-4 h-4" />
          <span className="">{formatDateToMonthYear(post.postDate)}</span>
        </div>
      </div>

      {/* 3-dot menu */}
      <div
        className="absolute top-3 right-4 group z-10"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        <MoreHorizontal className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />

        {showMenu && (
          <div className="absolute right-0 mt-0 bg-white shadow-md rounded-md border text-sm z-20">
            <button
              className="px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
              onClick={() => {
                mutate(post._id);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </EmptyCard>
  );
};

export default ActivityCard;
