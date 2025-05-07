import { getAppliedJobs } from "@/Api/job.api";
import JobsCard from "@/components/Jobs/JobsCard";
import JobsDetail from "@/components/Jobs/JobsDetail";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { Button } from "@/components/ui/button";
import { Job } from "@/Types/job.type";
import { ChevronLeft, ListFilter } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);
  const [openJobDetail, setOpenJobDetail] = useState<boolean>(false);

  const { data: appliedJobs } = useQuery({
    queryKey: ["appliedJobs"],
    queryFn: getAppliedJobs,
  });

  return (
    <div className="flex flex-col gap-6 pr-5">
      <div className="flex sm-phone:flex-col sm:flex-row justify-between sm-phone:gap-8">
        <div className="flex flex-row gap-4 sm-phone:justify-center sm-phone:items-center ">
          <SearchBar search="" setSearch={() => {}} />
          {/* <Button>
            <div className="flex flex-row gap-2">
              <ListFilter />
              <p>Filter</p>
            </div>
          </Button> */}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 flex-wrap w-full gap-5">
        {appliedJobs?.data.map((job) => (
          <div className="">
            <JobsCard
              size={"large"}
              job={job.jobid}
              onClick={() => {
                setOpenJobDetail(true);
                setSelectedJob(job.jobid);
              }}
              classname="w-full"
            />
          </div>
        ))}
      </div>
      <div className="w-full">
        {selectedJob && (
          <JobsDetail
            id={selectedJob._id}
            open={openJobDetail}
            onChange={(isOpen) => setOpenJobDetail(isOpen)}
            selectedJob={selectedJob}
            FollowClicked={function (): void {
              throw new Error("Function not implemented.");
            }}
            ReportClicked={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
