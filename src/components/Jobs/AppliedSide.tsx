import { useNavigate } from "react-router-dom";
import EmptyCard from "../Card/EmptyCard";
import { Button } from "../ui/button";
import JobsCard from "./JobsCard";
import { useQuery } from "react-query";
import { getAppliedJobs } from "@/Api/job.api";

const AppliedSide = () => {
  const navigate = useNavigate();
  const { data: appliedJobs } = useQuery({
    queryKey: ["appliedJobs"],
    queryFn: getAppliedJobs,
  });

  return (
    <EmptyCard cardClassname=" hidden w-[30%] lg:flex   h-screen overflow-y-scroll ">
      <div className="flex flex-col gap-3 w-full pt-1 px-3">
        <div className="flex flex-row justify-between items-center">
          <p className="opacity-75 font-bold ">Applied Jobs</p>
          <Button
            onClick={() => navigate("/applied-jobs")}
            className="p-0"
            variant={"link"}
          >
            See All
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {appliedJobs
            ? appliedJobs.data.map((jobApp) => (
                <JobsCard
                  key={jobApp._id}
                  size="small"
                  job={jobApp.jobid}
                  onClick={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              ))
            : "No jobs applied yet"}
        </div>
      </div>
    </EmptyCard>
  );
};

export default AppliedSide;
