import type React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock } from "lucide-react";
import { getCompanyJobs } from "@/Api/job.api";
import { useQuery } from "react-query";
import { ConvertToDateOnly } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRole } from "@/Context/RoleContext";

const LatestJobs: React.FC = () => {
  const { data: companyJobs, isLoading } = useQuery({
    queryKey: ["companyJobs"],
    queryFn: getCompanyJobs,
  });

  const { mode } = useRole();

  return (
    <div className="bg-white rounded-lg shadow divide-y my-1">
      {isLoading ? (
        <div className="bg-white rounded-lg shadow divide-y">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="block p-4 animate-pulse transition-colors">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-md bg-gray-200 mr-4" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />

                  <div className="flex gap-4 mt-2">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {companyJobs?.data &&
            companyJobs?.data?.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="block p-4 my-1  hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-2">
                  {/* <img
                    src={amazonLogo}
                    alt={job.company}
                    className="w-10 h-10 rounded-md mr-4 object-cover"
                  /> */}

                  <Avatar className="w-10 h-10 md:w-12 md:h-12 border-1 border-white shadow-lg">
                    <AvatarImage src={undefined} alt="Preview" />
                    <AvatarFallback
                      className={`bg-gradient-to-br  text-white text-2xl ${
                        mode === "formal"
                          ? "from-[#05A9A9] to-[#4ecdc4]"
                          : "from-primary2 to-primary2/50"
                      } `}
                    >
                      {job?.company
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{job.jobTitle}</h3>
                    <p className="text-sm text-gray-500">
                      {job?.company ?? "company Name not available"}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{job.jobLocation}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{job.employmentType}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{ConvertToDateOnly(job.jobPostDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </>
      )}
    </div>
  );
};

export default LatestJobs;
