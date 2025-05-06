import type React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock } from "lucide-react";
import { getCompanyJobs } from "@/Api/job.api";
import { useQuery } from "react-query";
import amazonLogo from "../../assets/icons8-google-48.png";
import { ConvertToDateOnly } from "@/lib/utils";
const LatestJobs: React.FC = () => {
  const { data: companyJobs } = useQuery({
    queryKey: ["companyJobs"],
    queryFn: getCompanyJobs,
  });

  return (
    <div className="bg-white rounded-lg shadow divide-y">
      {companyJobs?.data.map((job) => (
        <Link
          key={job._id}
          to={`/jobs/${job._id}`}
          className="block p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start">
            <img
              src={amazonLogo}
              alt={job.company}
              className="w-10 h-10 rounded-md mr-4 object-cover"
            />
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
                  <span>{job.jobType}</span>
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
    </div>
  );
};

export default LatestJobs;
