import { Job } from "@/Types/job.type";
import { FC } from "react";
import googleLogo from "../../assets/icons8-google-48.png";
import { useRole } from "@/Context/RoleContext";
import { useNavigate } from "react-router-dom";

interface Props {
  job: Job;
}

const JobCardTwo: FC<Props> = ({ job }) => {
  // Dummy data
  const applied = 5;
  const capacity = 10;
  const { mode } = useRole();
  const navigate = useNavigate();
  return (
    <div
      className="border p-4 w-100 shadow-sm  bg-white cursor-pointer"
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <img
          src={googleLogo}
          alt="Company"
          className="w-10 h-10 object-cover"
        />
        <span
          className={` border-white text-sm px-3 py-1 font-medium rounded-full ${
            mode === "formal"
              ? "bg-primary/10  text-primary/60 "
              : "bg-primary2/10  text-primary2/70 "
          } `}
        >
          {job.employmentType || "Full-Time"}
        </span>
      </div>

      {/* Job Title */}
      <h2 className="font-semibold text-lg mt-3">{job.jobTitle}</h2>

      {/* Company and Location */}
      <p className="text-sm text-gray-500">
        {job.company} &nbsp;•&nbsp; {job.jobLocation}
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

      {/* Progress */}
      <div className="mt-4 space-y-1">
        <div className="w-full bg-gray-200  h-1.5">
          <div
            className={`h-1.5 ${
              mode === "formal" ? "bg-primary/40 " : "bg-primary2/40"
            }`}
            style={{ width: `${(applied / capacity) * 100}%` }}
          />
        </div>

        <div className="flex gap-1 text-sm mb-1">
          <span className="font-semibold text-gray-700">
            {applied} applied{" "}
          </span>
          <span className="text-gray-400">of {capacity} capacity</span>
        </div>
      </div>
    </div>
  );
};

export default JobCardTwo;
