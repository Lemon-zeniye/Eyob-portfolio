import { useRole } from "@/Context/RoleContext";
import { Job } from "@/Types/job.type";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const RelatedJob = ({ job }: { job: Job }) => {
  const { mode } = useRole();
  const navigate = useNavigate();
  return (
    <div
      className={`p-4 border w-full  md:w-80 cursor-pointer ${
        mode === "formal" ? " hover:bg-primary/5" : " hover:bg-primary2/5"
      } `}
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-[90%] ">
          <Avatar className="w-12 h-12 border-2 border-white shadow-md">
            <AvatarImage
              src={undefined}
              alt={job?.company}
              className="object-cover"
            />
            <AvatarFallback
              className={`"\text-white ${
                mode === "formal" ? "bg-primary" : "bg-primary2"
              } `}
            >
              {job?.company ? job?.company[0]?.toUpperCase() : ""}
            </AvatarFallback>
          </Avatar>
          <div className="">
            <h1 className="font-semibold">{job.jobTitle}</h1>
            <div className="flex text-[#515B6F] items-center text-sm gap-2">
              <span className="">{job?.company}</span>
              <span className="align-middle leading-[0]">•</span>
              <span>{job.jobLocation}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full border-2 whitespace-nowrap shrink-0  ${
            mode === "formal"
              ? "border-primary bg-primary/10 text-primary"
              : "border-primary2 bg-primary2/10 text-primary2"
          } `}
        >
          {job.employmentMode}
        </span>
      </div>

      {/* <div className="text-lg mt-6 font-semibold flex gap-2 items-center justify-end">
        <HiOutlineCurrencyDollar size={1} />{" "}
        {job?.range?.length === 0
          ? job.salary
          : job.range[0]?.minimum + "-" + job.range[0]?.maximum}
      </div> */}

      <div className="text-lg font-semibold flex items-center  gap-2 text-gray-800 justify-end">
        <HiOutlineCurrencyDollar size={20} />
        <span>
          {job?.range &&
          job?.range?.length > 0 &&
          job?.range[0]?.minimum != null &&
          job?.range[0]?.maximum != null
            ? `$${job.range[0].minimum} - $${job.range[0].maximum}`
            : job?.salary
            ? `$${job.salary}`
            : "N/A"}
        </span>
      </div>
    </div>
  );
};
