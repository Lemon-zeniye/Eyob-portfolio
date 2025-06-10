import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { CiBookmark } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import { useRole } from "@/Context/RoleContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Job } from "@/Types/sampleJob.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function SampleJobDetailNew() {
  // const { id } = useParams();
  // const [job, setJob] = useState<Job | undefined>(undefined);
  // useQuery({
  //   queryKey: ["jobDetail", id],
  //   queryFn: () => {
  //     if (id) {
  //       return fetchJobDetail(id);
  //     }
  //   },
  //   enabled: !!id,
  //   onSuccess: (res) => {
  //     const job: Job | undefined = res?.data[0];
  //     setJob(job);
  //   },
  // });

  const getJob = (): Job | undefined => {
    const storedJobs = localStorage.getItem("job");
    return storedJobs ? JSON.parse(storedJobs) : undefined;
  };

  const navigate = useNavigate();

  const { id } = useParams(); // Assuming React Router
  const [job, setJob] = useState<Job | undefined>(undefined);

  useEffect(() => {
    const storedJob = getJob(); // Retrieve from localStorage
    if (storedJob?.job_id === id) {
      setJob(storedJob);
    } else {
      navigate("/jobs");
    }
  }, [id]);

  const { mode } = useRole();

  const skillColors = ["#56CDAD", "#FFB836", "#05A9A9"];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 border-2 mx-2 py-4 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <Avatar className="rounded-none w-20 h-20 sm:w-24 sm:h-24">
            <AvatarImage
              src={job?.employer_logo}
              alt={job?.employer_logo}
              className={`w-full h-full rounded-none`}
            />
            <AvatarFallback
              className={`${
                mode === "formal" ? "bg-primary/30" : "bg-primary2/30"
              } `}
            >
              {job?.employer_name?.slice(0, 1)}{" "}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-semibold break-words">
              {job?.job_title}
            </h1>
            <h2 className="text-lg my-1 font-medium">{job?.employer_name}</h2>
            <div className="flex flex-wrap text-sm text-[#515B6F] items-center gap-1 sm:gap-2">
              <span>{job?.job_country}</span>
              <span className="mx-1">•</span>
              <span>{job?.job_state}</span>
              <span className="mx-1">•</span>
              <span>{job?.job_city}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-gray-600">{job?.job_posted_at}</span>
            </div>
            <div>
              {job?.job_is_remote && (
                <span
                  className="px-3 py-1 text-sm font-medium rounded-full border-2"
                  style={{
                    borderColor: skillColors[0],
                    color: skillColors[0],
                  }}
                >
                  Remote
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-2 w-full md:w-auto">
          <div className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <HiOutlineCurrencyDollar size={22} />
            <span>
              {job?.job_min_salary && job?.job_max_salary
                ? `${job?.job_min_salary} - ${job?.job_max_salary}`
                : job?.job_salary ?? "N/A"}
            </span>
            {job?.job_salary_period && (
              <>
                {" / "}
                <span>{job?.job_salary_period}</span>
              </>
            )}
          </div>

          <Button
            onClick={() => {
              if (job?.job_apply_link) {
                window.open(
                  job?.job_apply_link,
                  "_blank",
                  "noopener,noreferrer"
                );
              }
            }}
            disabled={!job?.job_apply_link}
            className={`py-2 px-6 bg-primary rounded-none w-full sm:w-auto ${
              mode === "formal"
                ? "bg-primary "
                : "bg-primary2 hover:bg-primary2/70"
            }`}
          >
            Apply
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-2 mt-4">
        <div className="sm:col-span-2 lg:col-span-3 border p-6  shadow-sm space-y-6">
          {/* Tags */}
          <div className="flex items-center gap-3">
            {job?.job_employment_types.map((m, index) => (
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
              {job?.job_description}
            </p>
            <br />
            <hr />
            <br />
            <h2 className="font-semibold text-gray-800 mb-2 text-lg">
              Qualifications
            </h2>
            <div className="text-gray-600 leading-relaxed font-light">
              {Array.isArray(job?.job_highlights?.Qualifications) ? (
                <ul className="space-y-2 list-disc pl-5">
                  {job?.job_highlights.Qualifications.map(
                    (qualification, index) => (
                      <li
                        key={index}
                        className="hover:text-gray-800 transition-colors"
                      >
                        {qualification}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                job?.job_highlights?.Qualifications ||
                "No qualifications listed"
              )}
            </div>

            <h2 className="font-semibold text-gray-800 mb-2 text-lg">
              Responsibilities
            </h2>
            <div className="text-gray-600 leading-relaxed font-light">
              {Array.isArray(job?.job_highlights?.Responsibilities) ? (
                <ul className="space-y-2 list-disc pl-5">
                  {job?.job_highlights.Responsibilities.map(
                    (qualification, index) => (
                      <li
                        key={index}
                        className="hover:text-gray-800 transition-colors"
                      >
                        {qualification}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                job?.job_highlights?.Responsibilities ||
                "No Responsibilities listed"
              )}
            </div>
          </div>

          <div className="flex gap-2 ">
            <Button
              onClick={() => {
                if (job?.job_apply_link) {
                  window.open(
                    job?.job_apply_link,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              }}
              disabled={!job?.job_apply_link}
              className={`py-2 px-10 rounded-none ${
                mode === "formal"
                  ? "bg-primary "
                  : "bg-primary2 hover:bg-primary2/70"
              }`}
            >
              Apply
            </Button>
            <div className="w-10 h-10 border flex items-center justify-center">
              <CiBookmark size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SampleJobDetailNew;
