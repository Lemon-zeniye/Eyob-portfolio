import { fetchAllApplicants } from "@/Api/job.api";
import { toMonthDayYear } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "react-query";
import UserProfile from "./UserFullProfile";

function TableSkeleton() {
  return (
    <tbody className="bg-white w-full divide-y my-4 py-6 divide-gray-200">
      {Array.from({ length: 3 }).map((_, ind) => (
        <tr
          key={ind}
          className={`${ind % 2 === 0 ? "bg-[#F8F8FD]" : "bg-white"}`}
        >
          <td className="px-6 py-4">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-10 bg-gray-300 rounded"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-8 w-28 bg-gray-300 rounded border border-gray-300"></div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function ApplicantsList() {
  const { data: appliedJobs, isLoading } = useQuery({
    queryKey: ["fetchAllApplicants"],
    queryFn: fetchAllApplicants,
  });

  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const handleFetchProfile = (id: string) => {
    setUserId(id);
    setOpen(true);
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 border">
          <tr className="">
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
            ></th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              Full Name
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              Score
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              Hiring Stage
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              Applied Date
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <br />
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <tbody className="bg-white divide-y my-4 py-6 divide-gray-200">
            {appliedJobs?.data.map((application, ind) => (
              <tr
                key={application._id}
                className={`${ind % 2 === 0 ? "bg-[#F8F8FD]" : "bg-white"}`}
              >
                <td className="px-6 py-4 whitespace-nowrap ">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 hover:text-gray-700 cursor-pointer"
                  onClick={() => handleFetchProfile(application?.userid._id)}
                >
                  <div className="flex items-center justify-start gap-2">
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      src={`https://i.pravatar.cc/100?img=${ind}`}
                    />
                    {application.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {"0.0"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-4 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                  ${
                    true &&
                    "bg-green-100 text-green-800 border border-green-800"
                  }`}
                  >
                    {"In Review"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {toMonthDayYear(application.applicationDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-primary hover:text-primary/70">
                  <button className="border border-primary px-4 py-2">
                    See Application
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      <UserProfile open={open} setOpen={setOpen} id={userId} />
    </div>
  );
}

export default ApplicantsList;
