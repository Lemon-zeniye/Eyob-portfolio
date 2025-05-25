import { Button } from "../ui/button";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { CiBookmark } from "react-icons/ci";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { applyJob, getFetchSingleJob, getJobs } from "@/Api/job.api";
import { useState } from "react";
import { Job } from "@/Types/job.type";
import { tos } from "@/lib/utils";
import { Spinner } from "../ui/Spinner";
import { getAxiosErrorMessage } from "@/Api/axios";
import { useRole } from "@/Context/RoleContext";

const RelatedJobSkeleton = () => {
  return (
    <div className="p-4 border w-80 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-14 h-14 bg-gray-300 rounded-full" />
        <span className="px-3 py-1 text-sm rounded-full bg-gray-300 w-20 h-6" />
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-gray-300 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-4 bg-gray-300 rounded w-20" />
          <div className="h-4 bg-gray-300 rounded w-1" />
          <div className="h-4 bg-gray-300 rounded w-20" />
        </div>
      </div>
      <div className="h-5 bg-gray-300 rounded w-1/2 mt-6" />
    </div>
  );
};

const RelatedJob = ({ job }: { job: Job }) => {
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
        <div className="w-14 h-14">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png"
            className="w-full h-full object-cover"
          />
        </div>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full border-2  ${
            mode === "formal"
              ? "border-primary bg-primary/10 text-primary"
              : "border-primary2 bg-primary2/10 text-primary2"
          } `}
        >
          {job.jobType}
        </span>
      </div>
      <div className="">
        <h1 className="text-xl font-semibold">{job.jobTitle}</h1>
        <div className="flex text-[#515B6F] items-center text-sm gap-2">
          <span>{job.company}</span>
          <span className="align-middle leading-[0]">•</span>
          <span>{job.jobLocation}</span>
        </div>
      </div>
      <div className="text-xl mt-6 font-semibold flex gap-2 items-center">
        <HiOutlineCurrencyDollar size={22} />{" "}
        {job?.range?.length === 0
          ? job.salary
          : job.range[0]?.minimum + "-" + job.range[0]?.maximum}
      </div>
    </div>
  );
};

function JobDetailNew() {
  const { id } = useParams();
  const { data: jobDetail } = useQuery({
    queryKey: ["jobDetail", id],
    queryFn: () => {
      if (id) {
        return getFetchSingleJob(id);
      }
    },
    enabled: !!id,
  });

  const { mode } = useRole();

  const company = jobDetail?.data?.company;

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["jobFilter", company],
    queryFn: () => getJobs({ company: company! }),
    enabled: !!company,
  });
  const [showAll, setShowAll] = useState(false);
  const jobsToShow = showAll ? jobsData?.data : jobsData?.data.slice(0, 3);

  const { mutate, isLoading: jobApplyIsLoading } = useMutation({
    mutationFn: applyJob,
    onSuccess: () => {
      tos.success("Application submitted successfully!");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err);
      tos.error(message);
    },
  });

  const skillColors = ["#56CDAD", "#FFB836", "#05A9A9"];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 border-2 mx-2 py-4 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png"
              className="w-full h-full object-cover"
              alt="Company logo"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-semibold break-words">
              {jobDetail?.data.jobTitle}
            </h1>
            <div className="flex flex-wrap text-sm text-[#515B6F] items-center gap-1 sm:gap-2">
              <span>{jobDetail?.data.company}</span>
              <span className="mx-1">•</span>
              <span>{jobDetail?.data.jobLocation}</span>
              <span className="mx-1">•</span>
              <span>{jobDetail?.data.locationType}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-2 w-full md:w-auto">
          <div className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <HiOutlineCurrencyDollar size={22} />
            <span>
              {jobDetail?.data?.range &&
              jobDetail?.data?.range?.length > 0 &&
              jobDetail?.data?.range[0]?.minimum != null &&
              jobDetail?.data?.range[0]?.maximum != null
                ? `$${jobDetail.data.range[0].minimum} - $${jobDetail.data.range[0].maximum}`
                : jobDetail?.data?.salary
                ? `$${jobDetail.data.salary}`
                : "N/A"}
            </span>
          </div>

          <Button
            onClick={() =>
              mutate({
                jobId: id,
              })
            }
            className={`py-2 px-6 bg-primary rounded-none w-full sm:w-auto ${
              mode === "formal"
                ? "bg-primary "
                : "bg-primary2 hover:bg-primary2/70"
            }`}
          >
            {jobApplyIsLoading ? <Spinner /> : "Apply"}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-2 mt-4">
        <div className="sm:col-span-2 lg:col-span-3 border p-6  shadow-sm space-y-6">
          {/* Tags */}
          <div className="flex items-center gap-3">
            {jobDetail?.data?.skills.map((m, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm font-medium rounded-full border-2"
                style={{
                  borderColor: skillColors[index % 3],
                  color: skillColors[index % 3],
                }}
              >
                {m}
              </span>
            ))}
          </div>

          {/* Overview */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Overview</h2>
            <p className="text-gray-600 leading-relaxed font-light">
              {jobDetail?.data.jobDescription}
            </p>
          </div>

          <div className="flex gap-2 ">
            <Button
              onClick={() =>
                mutate({
                  jobId: id,
                })
              }
              className={`py-2 px-10 rounded-none ${
                mode === "formal"
                  ? "bg-primary "
                  : "bg-primary2 hover:bg-primary2/70"
              }`}
            >
              {jobApplyIsLoading ? <Spinner /> : "Apply"}
            </Button>
            <div className="w-10 h-10 border flex items-center justify-center">
              <CiBookmark size={24} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 ">
          <h1 className="text-xl font-semibold pl-4 mb-4">
            Jobs from {jobDetail?.data.company}
          </h1>
          <div className="flex flex-col gap-y-2 md:items-center justify-between">
            <div className="flex flex-col gap-y-2 md:items-center justify-between">
              {isLoading
                ? ["1", "2", "3"].map((_, index) => (
                    <RelatedJobSkeleton key={index} />
                  ))
                : jobsToShow?.map((job) => (
                    <RelatedJob key={job._id} job={job} />
                  ))}

              {!isLoading && jobsData?.data && jobsData?.data.length > 3 && (
                <Button
                  className={`px-4 py-2 rounded-none w-[94%] mx-6 ${
                    mode === "formal"
                      ? "bg-primary "
                      : "bg-primary2 hover:bg-primary2/70"
                  }`}
                  onClick={() => setShowAll((prev) => !prev)}
                >
                  {showAll ? "Show Less" : "Explore More"}
                </Button>
              )}
            </div>
          </div>
          {/* <h1 className="text-2xl font-semibold pl-4 my-4">Related Jobs</h1>
          <div className="flex flex-col gap-y-2 items-center justify-between">
            {["1", "2", "3"].map((_) => (
              <RelatedJob />
            ))}
            <Button className="px-4 py-2 rounded-none bg-primary w-[94%] mx-6">
              Explor More
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default JobDetailNew;
