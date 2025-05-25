import { Job } from "@/Types/job.type";
import { MdOutlineLocationOn } from "react-icons/md";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { AiOutlineDollar } from "react-icons/ai";
import { IoMdHeartEmpty } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRole } from "@/Context/RoleContext";

interface JobsCardProps {
  size: "small" | "large";
  job: Job;
  onClick: () => void;
  classname?: string;
}

const JobsCard = ({ size, job, onClick, classname }: JobsCardProps) => {
  const isSmall = size === "small";
  const { mode } = useRole();
  return (
    <div
      className={`
    
    hover:shadow-md transition-shadow duration-200
    ${
      mode === "formal"
        ? "bg-white rounded-lg border border-primary/50"
        : "bg-white rounded-lg border border-primary2/50 "
    }
    ${isSmall ? "" : "min-h-[220px]"} 
    ${classname}
  `}
    >
      <div
        onClick={onClick}
        className="flex flex-col gap-4 p-4 cursor-pointer h-full"
      >
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-row gap-3 items-start">
            {/* <img
              className={`${
                isSmall ? "w-12 h-12" : "w-16 h-16"
              } rounded-full object-cover border-2 border-primary/20`}
              src={undefined}
              alt={job.company}
            /> */}
            <Avatar>
              <AvatarImage
                src={undefined}
                alt={job.company}
                className={`${
                  isSmall ? "w-12 h-12" : "w-16 h-16"
                } rounded-full object-cover border-2 border-primary/20`}
              />
              <AvatarFallback
                className={`${
                  mode === "formal" ? "bg-primary/30" : "bg-primary2/30"
                } `}
              >
                {job?.company?.slice(0, 1)}{" "}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-600">{job.company}</p>
              <p
                className={`${
                  isSmall ? "text-base" : "text-lg"
                } font-semibold text-gray-900`}
              >
                {job.jobTitle}
              </p>
            </div>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <IoMdHeartEmpty
              size={isSmall ? 20 : 22}
              className="text-gray-400 hover:text-red-500"
            />
          </button>
        </div>

        <div className="flex-1">
          <p
            className={`${
              isSmall ? "text-sm" : "text-base"
            } text-gray-600 line-clamp-3`}
          >
            {job.jobDescription}
          </p>
        </div>

        <div className="w-full flex flex-wrap gap-4 text-gray-500">
          <div className="flex items-center gap-1.5">
            <MdOutlineLocationOn size={18} className="flex-shrink-0" />
            <span className={`${isSmall ? "text-xs" : "text-sm"}`}>
              {job.jobLocation}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <HiOutlineBriefcase size={18} className="flex-shrink-0" />
            <span className={`${isSmall ? "text-xs" : "text-sm"}`}>
              {job.locationType}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <AiOutlineDollar size={18} className="flex-shrink-0" />
            <span className={`${isSmall ? "text-xs" : "text-sm"}`}>
              {job.salary && job.salaryType
                ? `${job.salary?.toFixed(2)} / ${job.salaryType}`
                : "Not Specified"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsCard;
