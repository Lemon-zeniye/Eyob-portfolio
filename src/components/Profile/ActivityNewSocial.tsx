import { useState } from "react";
import { useQuery } from "react-query";
import { getSingleUserPost } from "@/Api/profile.api";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import ActivityCard from "../Card/ActivityCard";
import AddPost from "./AddPost";
import { Post } from "@/Types/profile.type";

function ActivityNew() {
  const [open, setOpen] = useState(false);

  const { data: posts } = useQuery({
    queryKey: ["singleUserPost"],
    queryFn: getSingleUserPost,
  });

  return (
    <div className="flex flex-col gap-6 p-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {!open ? "Your Activity" : "Create New Post"}
        </h2>
        <Button
          onClick={() => setOpen(!open)}
          className={`rounded-full px-5 transition-all duration-300 ${
            !open
              ? "bg-gradient-to-r from-[#05A9A9] to-[#4ecdc4] hover:from-[#05A9A9] hover:to-[#4ecdc4] shadow-md hover:shadow-lg"
              : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-md hover:shadow-lg"
          }`}
        >
          <span className="mr-2">
            {!open ? <Plus size={18} /> : <X size={18} />}
          </span>
          {open ? "Cancel" : "Add Post"}
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.div
              key="posts-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {posts && posts.data.length > 0 ? (
                posts.data.map((item) => (
                  <ActivityCardWrapper key={item._id} post={item} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No posts yet
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Share your thoughts, experiences, or achievements by
                    creating your first post.
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="add-post-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <AddPost onSuccess={() => setOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ActivityCardWrapper({ post }: { post: Post }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }}
      className="transform transition-all duration-300"
    >
      <div className="overflow-hidden rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 bg-white">
        <ActivityCard post={post} classname="w-full" onclick={() => {}} />
      </div>
    </motion.div>
  );
}

export default ActivityNew;
