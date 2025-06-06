import { Job } from "@/Types/job.type";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { applyJob } from "@/Api/job.api";
import { tos } from "@/lib/utils";
import { Spinner } from "../ui/Spinner";
import { getAxiosErrorMessage } from "@/Api/axios";
import { useRole } from "@/Context/RoleContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const JobCard = ({ job }: { job: Job }) => {
  const navigate = useNavigate();
  // Fill in dummy data for missing fields

  const { mode } = useRole();

  const { mutate, isLoading } = useMutation({
    mutationFn: applyJob,
    onSuccess: () => {
      tos.success("Application submitted successfully!");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err);
      tos.error(message);
    },
  });

  return (
    <div className="border bg-white border-gray-300  p-4 cursor-pointer">
      <div className="flex gap-4">
        <div
          onClick={() => navigate(`/jobs/${job._id}`)}
          className="flex-none px-2"
        >
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
        </div>
        <div onClick={() => navigate(`/jobs/${job._id}`)} className="flex-1">
          <div className="mb-3 space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {job.jobTitle}
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-base text-[#7C8493]">
                {job?.jobIndustry}
              </span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-base text-gray-500">
                {job?.jobLocation}
              </span>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap gap-2 text-[0.8rem]">
            <span className="rounded-full px-3 py-1.5 border border-white bg-[#EFFAF7]  text-[#56CDAD]  font-medium">
              {job?.employmentType}
            </span>
            <div className="h-8 border-l"></div>
            <span className="rounded-full px-3 py-1.5 border-2 border-[#FFB836] bg-white text-[#FFB836]  font-medium">
              {job?.employmentMode}
            </span>
            {/* <span className="rounded-full px-3 py-1.5 border-2 border-primary bg-white text-primary  font-medium">
              {jobData.degree}
            </span> */}
          </div>
        </div>

        <div className="flex-none flex flex-col space-y-2">
          <Button
            className={`px-11 rounded-none py-4 text-white focus:outline-none focus:ring-2 ${
              mode === "formal"
                ? "bg-primary hover:bg-primary"
                : "bg-primary2/90 hover:bg-primary2/60"
            }`}
            onClick={() =>
              mutate({
                jobId: job._id,
              })
            }
          >
            {isLoading ? <Spinner /> : "Apply"}
          </Button>

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
              {job?.numberOfOpenings
                ? Math.floor(job.numberOfOpenings * 0.7)
                : 0}{" "}
              applied
            </span>{" "}
            of {job?.numberOfOpenings} capacity
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
