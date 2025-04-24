import { useState } from "react";
import ExpAndEduCard from "./ExpAndEduCard";
import AddEducation from "../Profile/AddEducation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { getEducations } from "@/Api/profile.api";
import { Button } from "../ui/button";

const EducationCard = () => {
  const [open, setOpen] = useState(false);

  const { data: educations } = useQuery({
    queryKey: ["educations"],
    queryFn: getEducations,
  });

  return (
    <div className="flex flex-col gap-5 relative overflow-hidden">
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
              {educations &&
                educations?.data.map((item, index) => (
                  <ExpAndEduCard
                    id={item._id}
                    key={index}
                    institution={item.institution}
                    date={`${item.graduationYear}`}
                    location={""}
                    type="Edu"
                    title={item.degree}
                    gpa={item.gpa}
                    isNotSkills
                    onClick={() => {}}
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
                Add Education
              </h1>
              <AddEducation onSuccess={() => setOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EducationCard;
