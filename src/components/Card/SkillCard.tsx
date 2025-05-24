import { useState } from "react";
import ExpAndEduCard from "./ExpAndEduCard";
import AddSkill from "../Profile/AddSkill";
import { useQuery } from "react-query";
import { getUserSkills } from "@/Api/profile.api";
import { motion, AnimatePresence } from "framer-motion";
import { useRole } from "@/Context/RoleContext";
import ExpAndEduCardSocial from "./ExpAndEduCardSocial";
import { UserSkill } from "@/Types/profile.type";
import { FiPlus, FiX } from "react-icons/fi";

const SkillCard = ({
  otherUserSkill,
}: {
  otherUserSkill: UserSkill[] | undefined;
}) => {
  const [open, setOpen] = useState(false);
  const { mode } = useRole();
  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: getUserSkills,
    enabled: !otherUserSkill,
  });

  const displayData = otherUserSkill || skills?.data;

  return (
    <div className="flex flex-col gap-5">
      {!otherUserSkill && (
        <div className="flex flex-row gap-2 justify-between items-end px-2">
          {open ? (
            <h1 className="text-lg p-2 items-center font-semibold">
              Add Skill
            </h1>
          ) : (
            <div></div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className={`
              p-3 rounded-full transition-all duration-300
               ${
                 !open
                   ? mode === "formal"
                     ? "bg-primary hover:bg-primary/90 text-white"
                     : "bg-primary2 hover:bg-primary2/90 text-white"
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
      )}

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
              {displayData &&
                (mode === "formal"
                  ? displayData?.map((item, index) => (
                      <ExpAndEduCard
                        id={item._id}
                        key={index}
                        isNotSkills={false}
                        title={item.skill}
                        type="Ski"
                        showIcon={!otherUserSkill}
                        category={item.category}
                        institution={item.company}
                      />
                    ))
                  : displayData?.map((item, index) => (
                      <ExpAndEduCardSocial
                        id={item._id}
                        key={index}
                        isNotSkills={false}
                        title={item.skill}
                        type="Ski"
                        showIcon={!otherUserSkill}
                        category={item.category}
                        institution={item.company}
                      />
                    )))}
            </motion.div>
          ) : (
            <motion.div
              key="add-education"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut" }}
            >
              <AddSkill onSuccess={() => setOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillCard;
