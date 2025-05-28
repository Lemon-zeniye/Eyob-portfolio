import EmptyCard from "./EmptyCard";
import { TbBriefcase2 } from "react-icons/tb";
import { FiEdit2, FiMapPin, FiTrash2 } from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { useMutation, useQueryClient } from "react-query";
import {
  deleteEducation,
  deleteExperience,
  deleteOrganization,
  deleteSkill,
} from "@/Api/profile.api";
import { tos } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ExpAndEduCardProps {
  id: string;
  title?: string;
  institution?: string;
  date?: string;
  location?: string;
  isNotSkills?: boolean;
  category?: string;
  locationType?: string;
  gpa?: number;
  type: "Edu" | "Exp" | "Ski" | "Org";
  orgEmail?: string;
  showIcon: boolean;
  onClick?: (id: string) => void;
}
type SectionType = "Edu" | "Exp" | "Ski" | "Org";
const ExpAndEduCard = ({
  id,
  date,
  institution,
  location,
  title,
  isNotSkills,
  category,
  locationType,
  gpa,
  type,
  orgEmail,
  showIcon,
  onClick,
}: ExpAndEduCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const queryClient = useQueryClient();

  const deleteEducationMutation = useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      tos.success("Success");
      queryClient.invalidateQueries("educations");
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      tos.success("Success");
      queryClient.invalidateQueries("experiences");
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      tos.success("Success");
      queryClient.invalidateQueries("skill");
    },
  });

  const deleteOrganizationMutation = useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      {
        queryClient.invalidateQueries("organization");
        tos.success("Success");
      }
    },
  });

  const deleteCard = (type: SectionType, id: string) => {
    console.log("Deleting", type, id);
    switch (type) {
      case "Edu":
        deleteEducationMutation.mutate(id);
        break;
      case "Exp":
        deleteExperienceMutation.mutate(id);
        break;
      case "Ski":
        deleteSkillMutation.mutate(id);
        break;
      case "Org":
        deleteOrganizationMutation.mutate(id);
        break;
      default:
        console.error("Invalid type:", type);
    }
  };
  return (
    <EmptyCard
      cardClassname="relative px-5"
      contentClassname="flex flex-row gap-5 py-4"
    >
      <div
        className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 md:h-28 md:w-28  rounded-full flex items-center justify-center border-2 text-primary border-primary bg-[#daf2f2]
"
      >
        {type === "Exp" ? (
          <TbBriefcase2 size={40} />
        ) : type === "Org" ? (
          <HiBuildingOffice2 size={40} />
        ) : (
          <LuGraduationCap size={40} />
        )}
      </div>
      <div className="flex flex-col gap-2 justify-center ">
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-base font-normal opacity-50">{category}</p>
          <p className="text-base font-normal opacity-50">{institution}</p>
          <p className="text-base font-normal opacity-50">{orgEmail}</p>
        </div>
        {isNotSkills ? (
          <div>
            <div className="flex text-sm  items-center gap-4">
              <p className="">{date}</p>
              {locationType ? (
                <div className="flex items-center gap-1">
                  <FiMapPin size={14} /> {locationType}{" "}
                </div>
              ) : null}
              {gpa ? (
                <div className="flex items-center gap-1">
                  <FaRegStar size={14} /> {gpa}{" "}
                </div>
              ) : null}
            </div>

            <p className="text-xs font-normal opacity-50">{location}</p>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* 3-dot menu */}
      {showIcon && type !== "Ski" && (
        <div
          className="absolute top-3 right-4 group z-10"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          <MoreHorizontal className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />

          {showMenu && (
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-0 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-20 overflow-hidden"
                >
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick?.(id);
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
                      deleteCard(type, id);
                    }}
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      )}
    </EmptyCard>
  );
};

export default ExpAndEduCard;
