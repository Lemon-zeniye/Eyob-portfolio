import { Button } from "../ui/button";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getFetchSingleJob, getJobs } from "@/Api/job.api";
import { useState } from "react";
import { Job } from "@/Types/job.type";
import { toMonthDayYear } from "@/lib/utils";
import Tabs from "../Tabs/TabsLine";
import { SearchBar } from "../SearchBar/SearchBar";
import ApplicantsList from "./ApplicantsList";

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
  return (
    <div className="p-4 border w-full  md:w-80">
      <div className="flex items-center justify-between">
        <div className="w-14 h-14">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="px-3 py-1 text-sm font-medium rounded-full border-2 border-[#56CDAD] bg-green-50 text-[#56CDAD]">
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

function JobsDetailComapny() {
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

  const company = jobDetail?.data?.company;
  const navigate = useNavigate();
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["jobFilter", company],
    queryFn: () => getJobs({ company: company! }),
    enabled: !!company,
  });
  const [showAll, setShowAll] = useState(false);
  const jobsToShow = showAll ? jobsData?.data : jobsData?.data.slice(0, 3);

  const skillColors = ["#56CDAD", "#FFB836", "#05A9A9"];

  return (
    <div className="mb-20 md:mb-8">
      {/* deatils */}
      <div className="flex flex-col  md:flex-row justify-between items-start md:items-center px-4 border-2 mx-2 py-4 gap-4">
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
              <span>{jobDetail?.data.company ?? "Company Name"}</span>
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
            variant="outline"
            className="py-2 px-6 text-primary rounded-none w-full sm:w-auto"
            onClick={() => navigate(`/jobs/edit/${jobDetail?.data._id}`)}
          >
            Edit Job Details
          </Button>
        </div>
      </div>

      {/* tabs */}
      <div className="mx-2 ">
        <Tabs
          tabs={["Job Details", "Applicants", "Analytics"]}
          tabClassName="border-2 border-b-2 font-semibold px-4 py-1 my-4"
        >
          {/* job Detials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
            <div className="sm:col-span-2 lg:col-span-3 border-2 p-6  shadow-sm space-y-6">
              {/* Tags */}
              {/* <div className="flex items-center gap-3">
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
              </div> */}

              {/* Overview */}
              <div>
                <h2 className="font-semibold text-gray-800 mb-2 text-lg">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed font-light">
                  {jobDetail?.data.jobDescription}
                </p>
              </div>

              {/* Role */}
              <div>
                <h2 className="font-semibold text-gray-800 mb-2 text-lg">
                  The Role:
                </h2>
                <ul className="list-disc text-sm md:text-base list-inside text-gray-600 space-y-1 font-light">
                  <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                    delectus facilis facere distinctio dolorum quia odio.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                    delectus facilis facere distinctio dolorum quia odio.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                    delectus facilis facere distinctio dolorum quia odio.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                    delectus facilis facere distinctio dolorum quia odio.
                  </li>
                </ul>
              </div>

              {/* Responsibilities */}
              <div>
                <h2 className="font-semibold text-gray-800 mb-2 text-lg">
                  Responsibilities:
                </h2>
                <ul className="list-disc text-sm md:text-base list-inside text-gray-600 space-y-1 font-light">
                  <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                    delectus facilis facere distinctio dolorum quia odio.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                    delectus facilis facere distinctio dolorum quia odio.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                    delectus facilis facere distinctio dolorum quia odio.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                    delectus facilis facere distinctio dolorum quia odio.
                  </li>
                </ul>
              </div>

              {/* You Have */}
              <div>
                <h2 className=" font-semibold text-gray-800 mb-2 text-lg">
                  You have:
                </h2>
                <ul className="list-disc text-sm md:text-base list-inside text-gray-600 space-y-1 font-light">
                  <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                    delectus facilis facere distinctio dolorum quia odio.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                    delectus facilis facere distinctio dolorum quia odio.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                    delectus facilis facere distinctio dolorum quia odio.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                    delectus facilis facere distinctio dolorum quia odio.
                  </li>
                </ul>
              </div>
            </div>
            <div className="lg:col-span-1 lg:px-4 ">
              <h1 className="text-xl font-semibold mb-4">About this role</h1>
              {/* progress bar */}
              <div className="px-4 py-2 bg-gray-200 space-y-4">
                <div>
                  <span className="font-semibold">6 applied </span> of 10
                  capacity
                </div>
                <div className="w-full bg-gray-200 h-1.5">
                  <div
                    className="h-1.5 bg-[#56CDAD]"
                    style={{
                      width: `${(50 / 100) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* additional info */}
              <div className="px-1 text-lg space-y-4 my-6">
                <div className="flex items-center justify-between">
                  <p className="font-light">Apply Before</p>
                  <p className="font-semibold">
                    {jobDetail?.data.jobPostDate &&
                      toMonthDayYear(jobDetail?.data.deadLine)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-light">Job Posted On</p>
                  <p className="font-semibold">
                    {jobDetail?.data.jobPostDate &&
                      toMonthDayYear(jobDetail?.data.jobPostDate)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-light">Job Type</p>
                  <p className="font-semibold">{jobDetail?.data.jobType}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-light">Salary</p>
                  <p className="font-semibold">
                    {jobDetail?.data?.range &&
                    jobDetail?.data?.range?.length > 0 &&
                    jobDetail?.data?.range[0]?.minimum != null &&
                    jobDetail?.data?.range[0]?.maximum != null
                      ? `$${jobDetail.data.range[0].minimum} - $${jobDetail.data.range[0].maximum}`
                      : jobDetail?.data?.salary
                      ? `$${jobDetail.data.salary}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* hr */}
              <hr className="my-8" />

              {/* Categories  */}
              <div>
                <h1 className="text-xl font-semibold mb-4">Categories</h1>
                <span
                  className="px-3 py-1 text-sm font-medium rounded-full border-2"
                  style={{
                    borderColor: skillColors[0],
                    color: skillColors[0],
                  }}
                >
                  {jobDetail?.data.degree}
                </span>
              </div>

              <hr className="my-8" />

              <div>
                <h1 className="text-xl font-semibold mb-4">Required Skills</h1>

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
              </div>

              <div className="flex flex-col gap-y-2 md:items-center justify-between">
                <div className="flex flex-col gap-y-2 md:items-center justify-between">
                  {isLoading
                    ? ["1", "2", "3"].map((_, index) => (
                        <RelatedJobSkeleton key={index} />
                      ))
                    : jobsToShow?.map((job) => (
                        <RelatedJob key={job._id} job={job} />
                      ))}

                  {!isLoading &&
                    jobsData?.data &&
                    jobsData?.data.length > 3 && (
                      <Button
                        className="px-4 py-2 rounded-none bg-primary w-[94%] mx-6"
                        onClick={() => setShowAll((prev) => !prev)}
                      >
                        {showAll ? "Show Less" : "Explore More"}
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Applicants */}
          <div>
            <div className="flex items-center justify-between px-2">
              <h1 className="text-lg font-semibold">Total Applicants : 19</h1>
              <div>
                <SearchBar
                  search=""
                  setSearch={() => {}}
                  className="rounded-none outline-none"
                />
              </div>
            </div>
            <ApplicantsList />
          </div>

          {/* analytics */}
          <div>analytics</div>
        </Tabs>
      </div>
    </div>
  );
}

export default JobsDetailComapny;
