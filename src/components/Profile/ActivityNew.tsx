import { useState } from "react";
import { useQuery } from "react-query";
import { getSingleUserPost } from "@/Api/profile.api";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ActivityCard from "../Card/ActivityCard";
import AddPost from "./AddPost";

function ActivityNew() {
  const [open, setOpen] = useState(false);

  const { data: posts } = useQuery({
    queryKey: ["singleUserPost"],
    queryFn: getSingleUserPost,
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row gap-2 justify-end items-end px-2">
        <Button
          className={`${
            !open
              ? "bg-primary hover:bg-primary/80"
              : "bg-red-500 hover:bg-red-500/80"
          }`}
          onClick={() => setOpen(!open)}
        >
          {open ? "Cancel" : "Add"}
        </Button>
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
                    onclick={() => {}}
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
              <h1 className="text-lg py-2 items-center font-semibold">
                Add Post
              </h1>
              <AddPost onSuccess={() => setOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ActivityNew;
