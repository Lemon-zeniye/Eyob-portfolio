import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "react-query";
// import {
//   TbBriefcase2,
//   FiMapPin,
//   LuGraduationCap,
//   FaRegStar,
//   HiBuildingOffice2,
//   MoreHorizontal,
//   FiEdit2,
//   FiTrash2,
// } from "react-icons/all";
import {
  deleteEducation,
  deleteExperience,
  deleteOrganization,
  deleteUserSkill,
} from "@/Api/profile.api";
import { formatImageUrl, tos } from "@/lib/utils";
import { TbBriefcase2 } from "react-icons/tb";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { LuGraduationCap } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa";
import { FiEdit2, FiMapPin, FiTrash2 } from "react-icons/fi";
import { MoreVertical } from "lucide-react";

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
  orgLogo?: string;
  onClick?: (id: string) => void;
}

type SectionType = "Edu" | "Exp" | "Ski" | "Org";

const ExpAndEduCardSocial = ({
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
  orgLogo,
  onClick,
}: ExpAndEduCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const queryClient = useQueryClient();

  // Icon mapping
  const iconMap = {
    Exp: <TbBriefcase2 size={24} />,
    Org: <HiBuildingOffice2 size={24} />,
    Edu: <LuGraduationCap size={24} />,
    Ski: <FaRegStar size={24} />,
  };

  // Color mapping based on type
  const colorMap = {
    Exp: "from-[#ffa500]/50 to-[#ffa500]",
    Org: "from-[#ffa500]/50 to-[#ffa500]",
    Edu: "from-[#ffa500]/50 to-[#ffa500]",
    Ski: "from-[#ffa500]/50 to-[#ffa500]",
  };

  // Mutation handlers
  const createMutation = <T,>(
    mutationFn: (id: string) => Promise<T>,
    queryKey: string
  ) =>
    useMutation({
      mutationFn: (id: string) => mutationFn(id),
      onSuccess: () => {
        tos.success("Success");
        queryClient.invalidateQueries(queryKey);
      },
    });

  const deleteEducationMutation = createMutation(deleteEducation, "educations");
  const deleteExperienceMutation = createMutation(
    deleteExperience,
    "experiences"
  );
  const deleteSkillMutation = createMutation(deleteUserSkill, "skills");
  const deleteOrganizationMutation = createMutation(
    deleteOrganization,
    "organization"
  );

  const deleteCard = (type: SectionType, id: string) => {
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
    setShowMenu(false);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-xl p-5 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden
        ${isHovered ? "ring-1 ring-opacity-20" : ""}
        ${
          type === "Exp"
            ? "ring-blue-200"
            : type === "Org"
            ? "ring-purple-200"
            : type === "Edu"
            ? "ring-green-200"
            : "ring-yellow-200"
        }`}
    >
      {/* Gradient accent */}
      <div
        className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colorMap[type]}`}
      />

      <div className="flex gap-4 items-start">
        {/* Icon container */}
        {type === "Org" && orgLogo ? (
          <img
            className="w-12 h-12 rounded-sm object-cover"
            src={formatImageUrl(orgLogo)}
          />
        ) : (
          <div
            className={`p-3 rounded-lg bg-gradient-to-br ${colorMap[type]} text-white`}
          >
            {iconMap[type]}
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

          {category && (
            <p className="text-sm font-medium text-gray-600 mt-1">{category}</p>
          )}

          {institution && (
            <p className="text-sm text-gray-500 mt-1">{institution}</p>
          )}

          {orgEmail && <p className="text-sm text-gray-400 mt-2">{orgEmail}</p>}

          {isNotSkills && (
            <div className="mt-3">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                {date && <span>{date}</span>}

                {locationType && (
                  <span className="flex items-center gap-1">
                    <FiMapPin size={12} /> {locationType}
                  </span>
                )}

                {gpa && (
                  <span className="flex items-center gap-1">
                    <FaRegStar size={12} /> {gpa}
                  </span>
                )}
              </div>

              {location && (
                <p className="text-xs text-gray-400 mt-1">{location}</p>
              )}
            </div>
          )}
        </div>

        {/* Context menu */}
        {showIcon && (
          <div
            className="relative"
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
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ExpAndEduCardSocial;

// import EmptyCard from "./EmptyCard"
// import { TbBriefcase2 } from "react-icons/tb"
// import { FiMapPin, FiCalendar, FiTrash2 } from "react-icons/fi"
// import { LuGraduationCap } from "react-icons/lu"
// import { FaRegStar } from "react-icons/fa"
// import { useState } from "react"
// import { MoreHorizontal } from "lucide-react"
// import { HiBuildingOffice2 } from "react-icons/hi2"
// import { useMutation, useQueryClient } from "react-query"
// import {
//   deleteEducation,
//   deleteExperience,
//   deleteOrganization,
//   deleteSkill,
// } from "@/Api/profile.api"
// import { tos } from "@/lib/utils"

// interface ExpAndEduCardProps {
//   id: string
//   title?: string
//   institution?: string
//   date?: string
//   location?: string
//   isNotSkills?: boolean
//   category?: string
//   locationType?: string
//   gpa?: number
//   type: "Edu" | "Exp" | "Ski" | "Org"
//   orgEmail?: string
//   onClick?: () => void
// }

// type SectionType = "Edu" | "Exp" | "Ski" | "Org"

// const ExpAndEduCard = ({
//   id,
//   date,
//   institution,
//   location,
//   title,
//   isNotSkills,
//   category,
//   locationType,
//   gpa,
//   type,
//   orgEmail,
//   onClick,
// }: ExpAndEduCardProps) => {
//   const [showMenu, setShowMenu] = useState(false)
//   const queryClient = useQueryClient()

//   const deleteEducationMutation = useMutation({
//     mutationFn: deleteEducation,
//     onSuccess: () => {
//       tos.success("Success")
//       queryClient.invalidateQueries("educations")
//     },
//   })

//   const deleteExperienceMutation = useMutation({
//     mutationFn: deleteExperience,
//     onSuccess: () => {
//       tos.success("Success")
//       queryClient.invalidateQueries("experiences")
//     },
//   })

//   const deleteSkillMutation = useMutation({
//     mutationFn: deleteSkill,
//     onSuccess: () => {
//       tos.success("Success")
//       queryClient.invalidateQueries("skill")
//     },
//   })

//   const deleteOrganizationMutation = useMutation({
//     mutationFn: deleteOrganization,
//     onSuccess: () => {
//       queryClient.invalidateQueries("organization")
//       tos.success("Success")
//     },
//   })

//   const deleteCard = (type: SectionType, id: string) => {
//     console.log("Deleting", type, id)
//     switch (type) {
//       case "Edu":
//         deleteEducationMutation.mutate(id)
//         break
//       case "Exp":
//         deleteExperienceMutation.mutate(id)
//         break
//       case "Ski":
//         deleteSkillMutation.mutate(id)
//         break
//       case "Org":
//         deleteOrganizationMutation.mutate(id)
//         break
//       default:
//         console.error("Invalid type:", type)
//     }
//   }

//   const getIcon = () => {
//     switch (type) {
//       case "Exp":
//         return <TbBriefcase2 className="text-[#05A9A9] text-3xl md:text-4xl" />
//       case "Org":
//         return (
//           <HiBuildingOffice2 className="text-[#05A9A9] text-3xl md:text-4xl" />
//         )
//       case "Edu":
//         return (
//           <LuGraduationCap className="text-[#05A9A9] text-3xl md:text-4xl" />
//         )
//       case "Ski":
//         return <FaRegStar className="text-[#05A9A9] text-3xl md:text-4xl" />
//       default:
//         return <TbBriefcase2 className="text-[#05A9A9] text-3xl md:text-4xl" />
//     }
//   }

//   return (
//     <EmptyCard
//       onClick={onClick}
//       cardClassname="relative px-5 hover:shadow-md transition-all duration-300 group border border-gray-100 hover:border-[#4ecdc4]/30 rounded-xl overflow-hidden"
//       contentClassname="flex flex-row gap-5 py-5"
//     >
//       <div className="relative">
//         <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 md:h-24 md:w-24 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#05A9A9]/10 to-[#4ecdc4]/10 group-hover:from-[#05A9A9]/20 group-hover:to-[#4ecdc4]/20 transition-all duration-300">
//           {getIcon()}
//         </div>
//         <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
//           {type === "Exp" && (
//             <TbBriefcase2 className="text-[#05A9A9] text-xs" />
//           )}
//           {type === "Org" && (
//             <HiBuildingOffice2 className="text-[#05A9A9] text-xs" />
//           )}
//           {type === "Edu" && (
//             <LuGraduationCap className="text-[#05A9A9] text-xs" />
//           )}
//           {type === "Ski" && <FaRegStar className="text-[#05A9A9] text-xs" />}
//         </div>
//       </div>

//       <div className="flex flex-col gap-3 justify-center flex-1">
//         <div>
//           {title && (
//             <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#05A9A9] transition-colors duration-300">
//               {title}
//             </h3>
//           )}
//           {category && (
//             <p className="text-sm font-medium text-gray-600">{category}</p>
//           )}
//           {institution && (
//             <p className="text-sm text-gray-500 flex items-center gap-1.5">
//               <HiBuildingOffice2 className="text-[#4ecdc4] text-xs" />
//               {institution}
//             </p>
//           )}
//           {orgEmail && <p className="text-sm text-gray-500">{orgEmail}</p>}
//         </div>

//         {isNotSkills && (
//           <div className="space-y-2">
//             <div className="flex flex-wrap text-xs text-gray-500 items-center gap-3">
//               {date && (
//                 <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full">
//                   <FiCalendar className="text-[#4ecdc4]" />
//                   <span>{date}</span>
//                 </div>
//               )}

//               {locationType && (
//                 <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full">
//                   <FiMapPin className="text-[#4ecdc4]" />
//                   <span>{locationType}</span>
//                 </div>
//               )}

//               {gpa && (
//                 <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full">
//                   <FaRegStar className="text-[#4ecdc4]" />
//                   <span>{gpa}</span>
//                 </div>
//               )}
//             </div>

//             {location && (
//               <p className="text-xs text-gray-400 flex items-center gap-1.5">
//                 <FiMapPin className="text-[#4ecdc4]" />
//                 {location}
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       <div
//         className="absolute top-3 right-3 z-10"
//         onClick={(e) => e.stopPropagation()}
//         onMouseEnter={() => setShowMenu(true)}
//         onMouseLeave={() => setShowMenu(false)}
//       >
//         <div className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
//           <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-gray-600" />
//         </div>

//         {showMenu && (
//           <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-xl border border-gray-100 text-sm z-20 overflow-hidden w-32 animate-in fade-in zoom-in-95 duration-100">
//             <button
//               className="px-4 py-3 text-red-500 hover:bg-gray-50 w-full text-left flex items-center gap-2 transition-colors"
//               onClick={() => {
//                 deleteCard(type, id)
//               }}
//             >
//               <FiTrash2 className="w-4 h-4" />
//               <span>Delete</span>
//             </button>
//           </div>
//         )}
//       </div>
//     </EmptyCard>
//   )
// }

// export default ExpAndEduCard
