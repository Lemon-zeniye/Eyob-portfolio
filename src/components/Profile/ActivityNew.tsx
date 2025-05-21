import { useState } from "react";
import { useQuery } from "react-query";
import { getSingleUserPost } from "@/Api/profile.api";
import { motion, AnimatePresence } from "framer-motion";
import ActivityCard from "../Card/ActivityCard";
import AddPost from "./AddPost";
import { Post } from "@/Types/profile.type";
import { FiPlus, FiX } from "react-icons/fi";

function ActivityNew() {
  const [open, setOpen] = useState(false);
  const [initialData, setInitialData] = useState<Post | undefined>(undefined);

  const { data: posts } = useQuery({
    queryKey: ["singleUserPost"],
    queryFn: getSingleUserPost,
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row gap-2 justify-between items-end px-2">
        {open ? (
          <h1 className="text-lg py-2 items-center font-semibold">Add Post</h1>
        ) : (
          <div></div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className={`
              p-3 rounded-full transition-all duration-300
              ${
                !open
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }
              shadow-md hover:shadow-lg
              transform hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              ${!open ? "focus:ring-primary" : "focus:ring-red-500"}
            `}
        >
          {open ? <FiX size={20} /> : <FiPlus size={20} />}
        </button>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.div
              key="education-list"
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut" }}
              className="grid sm-phone:grid-cols-1 lg:grid-cols-2 sm-phone:gap-8 lg:gap-10 px-2"
            >
              {posts &&
                posts?.data.map((item) => (
                  <ActivityCard
                    key={item._id}
                    onclick={(id) => {
                      const post = posts?.data.find((p) => p._id === id);
                      setOpen(true);
                      setInitialData(post);
                    }}
                    classname=" sm-phone:w-full "
                    post={item}
                  />
                ))}
            </motion.div>
          ) : (
            <motion.div
              key="add-education"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut" }}
            >
              <AddPost
                initialData={initialData}
                onSuccess={() => setOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ActivityNew;
