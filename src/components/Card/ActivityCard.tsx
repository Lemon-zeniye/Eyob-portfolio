import { Post } from "@/Types/profile.type";
import { formatDateToMonthYear, formatImageUrls, tos } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { deletePost } from "@/Api/profile.api";
import { CiCalendar } from "react-icons/ci";
import ImageCarousel from "../Profile/ImageCarousel";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface ActivityCardProps {
  post: Post;
  classname?: string;
  onclick: (id: string) => void;
}

function truncateText(text: string, maxLength: number = 168): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

const ActivityCard = ({ post, classname = "", onclick }: ActivityCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const queryClient = useQueryClient();
  const [postImages, setPostImages] = useState<string | string[]>("");

  useEffect(() => {
    const postImages = formatImageUrls(post?.postPictures);
    setPostImages(postImages);
  }, [post]);

  const hasImage = postImages.length > 0;

  const { mutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries("singleUserPost");
      tos.success("Post deleted successfully");
    },
  });

  return (
    <div
      className={`relative rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md overflow-hidden ${classname} ${
        isHovered ? "ring-1 ring-gray-200" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-shrink-0 flex-1 flex-col sm:flex-row gap-4 p-4 cursor-pointer">
        {hasImage && (
          <div className="w-full sm:w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden">
            <ImageCarousel
              images={Array.isArray(postImages) ? postImages : [postImages]}
            />
          </div>
        )}

        <div className="flex flex-col flex-1 gap-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {post.postTitle}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3">
              {truncateText(post.postContent)}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto">
            <CiCalendar className="w-4 h-4 flex-shrink-0" />
            <span>{formatDateToMonthYear(post.postDate)}</span>
          </div>
        </div>
      </div>

      {/* Context menu button */}
      <div
        className=" absolute top-2 right-2 bg-gray-100 rounded-full flex items-center justify-center py-1"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        <button className="p-0 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical size={18} />
        </button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-0 right-2 mt-0 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-20 overflow-hidden"
            >
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onclick(post._id);
                  setShowMenu(false);
                }}
              >
                <FiEdit2 size={14} />
                Edit
              </button>
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  mutate(post._id);
                }}
              >
                <FiTrash2 size={14} />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActivityCard;
