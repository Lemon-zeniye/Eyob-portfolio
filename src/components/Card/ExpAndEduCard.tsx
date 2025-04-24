import EmptyCard from "./EmptyCard";
import { TbBriefcase2 } from "react-icons/tb";
import { FiMapPin } from "react-icons/fi";
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
import { toast } from "@/hooks/use-toast";

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
  onClick?: () => void;
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
  onClick,
}: ExpAndEduCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const queryClient = useQueryClient();

  const deleteEducationMutation = useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => queryClient.invalidateQueries("educations"),
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => queryClient.invalidateQueries("experiences"),
  });

  const deleteSkillMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => queryClient.invalidateQueries("skill"),
  });

  const deleteOrganizationMutation = useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries("organization");
      toast;
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
      onClick={onClick}
      cardClassname="relative px-5"
      contentClassname="flex flex-row gap-5 py-4"
    >
      <div
        className="h-28 w-28  rounded-full flex items-center justify-center border-2 text-primary border-primary bg-[#daf2f2]
"
      >
        {type === "Exp" ? (
          <TbBriefcase2 size={70} />
        ) : type === "Org" ? (
          <HiBuildingOffice2 size={70} />
        ) : (
          <LuGraduationCap size={70} />
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
                deleteCard(type, id);
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

export default ExpAndEduCard;
