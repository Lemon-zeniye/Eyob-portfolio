import { Job } from "@/Types/job.type";
import { FC } from "react";
import { useRole } from "@/Context/RoleContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  job: Job;
}

const JobCardTwo: FC<Props> = ({ job }) => {
  const { mode } = useRole();
  const navigate = useNavigate();
  return (
    <div
      className="border p-4 w-100 shadow-sm  bg-white cursor-pointer"
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <Avatar>
          <AvatarImage
            src={undefined}
            alt={job.company}
            className={`w-16 h-16 rounded-full object-cover border-2 border-primary/20`}
          />
          <AvatarFallback
            className={`${
              mode === "formal" ? "bg-primary/30" : "bg-primary2/30"
            } `}
          >
            {job?.company?.slice(0, 1)}{" "}
          </AvatarFallback>
        </Avatar>
        <span
          className={` border-white text-sm px-3 py-1 font-medium rounded-full ${
            mode === "formal"
              ? "bg-primary/10  text-primary/60 "
              : "bg-primary2/10  text-primary2/70 "
          } `}
        >
          {job?.employmentMode}
        </span>
      </div>

      {/* Job Title */}
      <h2 className="font-semibold text-lg mt-3">{job.jobTitle}</h2>

      {/* Company and Location */}
      <p className="text-sm text-gray-500">
        {job?.jobIndustry} &nbsp;•&nbsp; {job.jobLocation}
      </p>

      {/* Tags */}
      <div className="flex gap-2 mt-3">
        <span className="text-sm font-medium border border-[#FFB836] bg-white text-[#FFB836]  sm px-3 py-1 rounded-full">
          {job.employmentType || "Marketing"}
        </span>
        <span className="text-teal-600 text-sm font-medium border border-teal-300 bg-teal-50 px-3 py-1 rounded-full">
          {job.skills[0] || "Social Media"}
        </span>
      </div>

      <div className="mt-4 space-y-1">
        {/* Progress Bar */}
        <div className="w-full ">
          <div className="w-full bg-gray-200 h-1.5">
            <div
              className={`h-1.5 ${
                mode === "formal" ? "bg-primary/40 " : "bg-primary2/40"
              }`}
              style={{
                width: job?.numberOfOpenings
                  ? `${
                      (Math.floor(job.numberOfOpenings * 0.7) /
                        job.numberOfOpenings) *
                      100
                    }%`
                  : "0%",
              }}
            ></div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-1 ">
          <span className="font-bold">
            {job?.numberOfOpenings ? Math.floor(job.numberOfOpenings * 0.7) : 0}{" "}
            applied
          </span>{" "}
          of {job?.numberOfOpenings} capacity
        </p>
      </div>
    </div>
  );
};

export default JobCardTwo;
