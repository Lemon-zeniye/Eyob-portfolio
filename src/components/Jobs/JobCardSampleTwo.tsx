import { FC } from "react";
import { useRole } from "@/Context/RoleContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Job } from "@/Types/sampleJob.type";

interface Props {
  job: Job;
}

const JobCardSampleTwo: FC<Props> = ({ job }) => {
  const { mode } = useRole();
  const navigate = useNavigate();

  const handleCardClick = (job: Job) => {
    localStorage.setItem("job", JSON.stringify(job));
    navigate(`/jobs/${job.job_id}`);
  };
  return (
    <div
      className="border p-4 w-100 shadow-sm  bg-white cursor-pointer"
      onClick={() => handleCardClick(job)}
    >
      {/* Top Row */}
      <div className="flex gap-4 items-center">
        <Avatar>
          <AvatarImage
            src={job.employer_logo}
            alt={job.employer_name}
            className={`w-16 h-16 rounded-full object-cover border-2 border-primary/20`}
          />
          <AvatarFallback
            className={`${
              mode === "formal" ? "bg-primary/30" : "bg-primary2/30"
            } `}
          >
            {job?.employer_name?.slice(0, 1)}{" "}
          </AvatarFallback>
        </Avatar>
        <p className="text-xl font-semibold text-gray-900">
          {job?.employer_name}
        </p>
      </div>

      {/* Job Title */}
      <h2 className="font-semibold text-lg mt-3">{job.job_title}</h2>

      {/* Company and Location */}
      <p className="text-sm text-gray-500">
        {job?.job_country} &nbsp;•&nbsp; {job.job_state} &nbsp;•&nbsp;{" "}
        {job.job_city}
      </p>

      {/* Tags */}
      <div className="flex gap-2 mt-3">
        <span className="text-sm font-medium border border-[#FFB836] bg-white text-[#FFB836]  sm px-3 py-1.5 rounded-full">
          {job?.job_is_remote ? "Remote" : "On-Site"}
        </span>
        <div className="inline-flex flex-wrap justify-start items-center gap-2">
          {Array.isArray(job?.job_employment_types)
            ? job.job_employment_types.map((type, index) => (
                <span
                  key={index}
                  className="rounded-full text-sm px-3 py-1.5 border border-[#FFB836] bg-white text-[#FFB836] font-medium"
                >
                  {type}
                </span>
              ))
            : job?.job_employment_types && (
                <span className="rounded-full px-3 py-1.5 border border-[#FFB836] bg-white text-[#FFB836] font-medium">
                  {job.job_employment_types}
                </span>
              )}
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-gray-600">{job?.job_posted_at}</p>
        {/* Progress Bar */}
        {/* <div className="w-full ">
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
        </p> */}
      </div>
    </div>
  );
};

export default JobCardSampleTwo;
