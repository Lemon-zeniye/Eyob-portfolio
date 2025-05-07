import EmptyCard from "../Card/EmptyCard";
import logo from "../../assets/icons8-google-48.png";
import { Job } from "@/Types/job.type";
import { MdOutlineLocationOn } from "react-icons/md";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { AiOutlineDollar } from "react-icons/ai";
import { IoMdHeartEmpty } from "react-icons/io";

interface JobsCardProps {
  size: "small" | "large";
  job: Job;
  onClick: () => void;
  classname?: string;
}

const JobsCard = ({ size, job, onClick, classname }: JobsCardProps) => {
  const isSmall = size === "small";
  return (
    <div>
      <EmptyCard
        cardClassname={`${
          isSmall ? "bg-[#f5f5f5]" : ""
        } ${classname} rounded-none `}
      >
        <div
          onClick={onClick}
          className="flex flex-col gap-4 pt-4 px-4 cursor-pointer"
        >
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2 items-center">
              <img
                className={` ${
                  isSmall ? "w-12 h-12" : "w-16 h-16"
                }  rounded-full border border-primary `}
                src={logo}
                alt=""
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{job.company}</p>
                <p
                  className={` ${
                    isSmall ? "text-base" : "text-lg"
                  } font-semibold `}
                >
                  {job.jobTitle}
                </p>
              </div>
            </div>
            <div>
              <IoMdHeartEmpty size={isSmall ? 24 : 25} />
            </div>
          </div>
          <div className="w-full">
            <p
              className={` ${
                isSmall ? "text-sm" : "text-base"
              } font-light opacity-75`}
            >
              {job.jobDescription}
            </p>
          </div>
          <div className="w-full flex opacity-75 flex-row justify-between gap-5 flex-wrap">
            <div className="flex flex-row gap-2 items-center">
              <MdOutlineLocationOn size={isSmall ? 20 : 22} />{" "}
              <p className={`${isSmall ? "text-sm" : "text-base"}`}>
                {job.jobLocation}
              </p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <HiOutlineBriefcase size={isSmall ? 20 : 22} />{" "}
              <p className={`${isSmall ? "text-sm" : "text-base"}`}>
                {job.locationType}
              </p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <AiOutlineDollar size={isSmall ? 20 : 22} />{" "}
              <p className={`${isSmall ? "text-sm" : "text-base"}`}>
                {job.salary && job.salaryType
                  ? `${job.salary?.toFixed(2)} / ${job.salaryType}`
                  : "Not Specified"}
              </p>
            </div>
          </div>
        </div>
      </EmptyCard>
    </div>
  );
};

export default JobsCard;
