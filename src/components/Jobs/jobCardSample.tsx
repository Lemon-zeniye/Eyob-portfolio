import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/Context/RoleContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Job } from "@/Types/sampleJob.type";

const JobCardSample = ({ job }: { job: Job }) => {
  const navigate = useNavigate();
  // Fill in dummy data for missing fields

  const { mode } = useRole();

  const handleCardClick = (job: Job) => {
    localStorage.setItem("job", JSON.stringify(job));
    setTimeout(() => {
      navigate(`/jobs/${job.job_id}`);
    });
  };

  return (
    <div className="border bg-white border-gray-300  p-4 cursor-pointer">
      <div className="flex gap-4">
        <div onClick={() => handleCardClick(job)} className="flex-none px-2">
          <Avatar>
            <AvatarImage
              src={job.employer_logo}
              alt={job.employer_logo}
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
        </div>
        <div onClick={() => handleCardClick(job)} className="flex-1">
          <div className="mb-3 space-y-1">
            <h3 className="text-xl font-semibold text-gray-900">
              {job.job_title}
            </h3>
            <h2 className="text-base font-medium text-gray-900">
              {job?.employer_name}
            </h2>
            <div className="flex items-center gap-1">
              <span className="text-base text-[#7C8493]">
                {job?.job_country}
              </span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{job?.job_state}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{job?.job_city}</span>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap gap-2 text-[0.8rem]">
            <span className="rounded-full px-3 py-1.5 border border-white bg-[#EFFAF7]  text-[#56CDAD]  font-medium">
              {job?.job_is_remote ? "Remote" : "On-Site"}
            </span>
            <div className="h-8 border-l"></div>
            <div className="inline-flex flex-wrap items-center gap-2">
              {Array.isArray(job?.job_employment_types)
                ? job.job_employment_types.map((type, index) => (
                    <span
                      key={index}
                      className="rounded-full px-3 py-1.5 border-2 border-[#FFB836] bg-white text-[#FFB836] font-medium"
                    >
                      {type}
                    </span>
                  ))
                : job?.job_employment_types && (
                    <span className="rounded-full px-3 py-1.5 border-2 border-[#FFB836] bg-white text-[#FFB836] font-medium">
                      {job.job_employment_types}
                    </span>
                  )}
            </div>
            {/* <span className="rounded-full px-3 py-1.5 border-2 border-primary bg-white text-primary  font-medium">
              {jobData.degree}
            </span> */}
          </div>
        </div>

        <div className="flex-none flex flex-col justify-between items-center space-y-2">
          <Button
            className={`px-11 rounded-none py-4 text-white focus:outline-none focus:ring-2 ${
              mode === "formal"
                ? "bg-primary hover:bg-primary"
                : "bg-primary2/90 hover:bg-primary2/60"
            }`}
            onClick={() => {
              if (job.job_apply_link) {
                window.open(
                  job.job_apply_link,
                  "_blank",
                  "noopener,noreferrer"
                );
              }
            }}
            disabled={!job.job_apply_link}
          >
            Apply
          </Button>

          <div className="text-gray-600">{job?.job_posted_at}</div>

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
              {job?.numberOfOpenings
                ? Math.floor(job.numberOfOpenings * 0.7)
                : 0}{" "}
              applied
            </span>{" "}
            of {job?.numberOfOpenings} capacity
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default JobCardSample;
