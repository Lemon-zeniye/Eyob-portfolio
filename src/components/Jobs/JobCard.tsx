import { Job } from "@/Types/job.type";
import { Button } from "../ui/button";
import googleLogo from "../../assets/icons8-google-48.png";
const JobCard = ({ job, onClick }: { job: Job; onClick: () => void }) => {
  // Fill in dummy data for missing fields
  const jobData = {
    jobTitle: job.jobTitle || "Social Media Assistant",
    company: job.company || "Amazon",
    jobLocation: job.jobLocation || "Paris, France",
    jobType: job.jobType || "Full-Time",
    jobDescription: job.jobDescription || "Marketing",
    skills: job.skills?.length ? job.skills.join(", ") : "Social Media",
    appliedCount: 5, // Assuming these are additional metrics
    capacity: 10,
    jobLocationType: job.locationType || "Remote",
    degree: job.degree || "Degree",
  };

  return (
    <div
      className="border bg-white border-gray-300  p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div className="flex-none px-2">
          <img src={googleLogo} />
        </div>
        <div className="flex-1">
          <div className="mb-3 space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {jobData.jobTitle}
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-base text-[#7C8493]">
                {jobData.company}
              </span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-base text-gray-500">
                {jobData.jobLocation}
              </span>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap gap-2 text-[0.8rem]">
            <span className="rounded-full px-3 py-1.5 border border-white bg-[#EFFAF7]  text-[#56CDAD]  font-medium">
              {jobData.jobType}
            </span>
            <div className="h-8 border-l"></div>
            <span className="rounded-full px-3 py-1.5 border-2 border-[#FFB836] bg-white text-[#FFB836]  font-medium">
              {jobData.jobLocationType}
            </span>
            <span className="rounded-full px-3 py-1.5 border-2 border-[#05A9A9] bg-white text-[#05A9A9]  font-medium">
              {jobData.degree}
            </span>
          </div>
        </div>

        <div className="flex-none flex flex-col space-y-2">
          <Button className="bg-[#05A9A9] px-11 rounded-none py-4  text-white focus:outline-none focus:ring-2 focus:ring-[#05A9A9]">
            Apply
          </Button>

          {/* Progress Bar */}
          <div className="w-full ">
            <div className="w-full bg-gray-200 h-1.5">
              <div
                className="h-1.5 bg-[#56CDAD]"
                style={{
                  width: `${(jobData.appliedCount / jobData.capacity) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-1 ">
            <span className="font-bold">{jobData.appliedCount} applied</span> of{" "}
            {jobData.capacity} capacity
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
