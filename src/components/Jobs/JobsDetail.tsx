import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { Flag, HardHat } from "lucide-react";
import CompanySmallCard from "../Card/CompanySmallCard";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { applyJob, getFetchSingleJob } from "@/Api/job.api";
import { Job } from "@/Types/job.type";
import { MdOutlineLocationOn } from "react-icons/md";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { AiOutlineDollar } from "react-icons/ai";
import { IoBriefcaseOutline } from "react-icons/io5";
import { Spinner } from "../ui/Spinner";
import { toast } from "sonner";

interface JobsDetailProps {
  id: string | undefined;
  selectedJob: Job;
  open: boolean;
  onChange: (open: boolean) => void;
  FollowClicked: () => void;
  ReportClicked: () => void;
}

const JobsDetail = ({
  id,
  selectedJob,
  open,
  onChange,
  FollowClicked,
  ReportClicked,
}: JobsDetailProps) => {
  const queryClient = useQueryClient();
  const {} = useQuery({
    queryKey: ["singleJob", id],
    queryFn: () => {
      if (id) {
        return getFetchSingleJob(id);
      }
    },
    enabled: !!id,
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: applyJob,
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      queryClient.invalidateQueries("appliedJobs");
    },
  });

  return (
    <Sheet open={open} onOpenChange={onChange}>
      <SheetContent
        side={"bottom"}
        className="h-[70vh] flex flex-col gap-2 overflow-y-scroll"
      >
        <SheetHeader>
          <SheetDescription className="text-xl text-black font-bold">
            {selectedJob.jobTitle}
          </SheetDescription>
        </SheetHeader>
        <div className="w-full flex sm-phone:flex-col md:flex-row justify-between gap-10">
          <div className="lg:w-3/4 md:w-1/2 flex flex-col gap-4">
            <SheetDescription className="text-base">
              {selectedJob.jobDescription}
            </SheetDescription>
            <div className="flex flex-col gap-4">
              <SheetDescription className="text-base text-black font-bold">
                Skills
              </SheetDescription>
              <div className="flex flex-row gap-4 flex-wrap">
                {selectedJob.skills.map((item) => (
                  <div className="flex flex-row gap-2 items-center">
                    <div className="bg-primary flex items-center justify-center p-2 text-white rounded-md">
                      <HardHat className="" />
                    </div>
                    <p className="text-xl font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:w-1/4 md:w-1/2 flex flex-col gap-4">
            <div className="w-full flex opacity-75 flex-col  gap-5 ">
              <div className="flex flex-row gap-2 items-center">
                <IoBriefcaseOutline size={22} />
                <p className={``}>{selectedJob.jobType}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <MdOutlineLocationOn size={22} />
                <p className={``}>{selectedJob.jobLocation}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <HiOutlineBriefcase size={22} />{" "}
                <p className={``}>{selectedJob.locationType}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <AiOutlineDollar size={22} />
                <p className={``}>
                  {selectedJob.salary?.toFixed(2)} / {selectedJob.salaryType}
                </p>
              </div>
            </div>
            <div className=" w-full">
              <CompanySmallCard
                FollowClicked={FollowClicked}
                companyDescription={selectedJob.company}
                companyName={selectedJob.company}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Button
                onClick={() =>
                  mutate({
                    jobId: id,
                  })
                }
              >
                {isLoading ? <Spinner /> : "Apply"}
              </Button>
              <Button onClick={ReportClicked} variant={"destructive"}>
                <div className="flex flex-row gap-2 items-center">
                  <Flag size={20} />
                  <p>Report</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default JobsDetail;
