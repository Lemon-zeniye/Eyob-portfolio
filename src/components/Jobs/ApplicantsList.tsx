import {
  getAllApplicantsOfaJob,
  JobApplicationToAccepted,
  JobApplicationToDeclined,
  JobApplicationToPending,
  JobApplicationToShortList,
} from "@/Api/job.api";
import { toMonthDayYear, tos } from "@/lib/utils";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import UserProfile from "./UserFullProfile";
import { useNavigate, useParams } from "react-router-dom";
import { getAxiosErrorMessage } from "@/Api/axios";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";

import { useRole } from "@/Context/RoleContext";
import { ChevronDownIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/Spinner";
import { statusColors, statusValue } from "@/lib/constant";

// “Reviewing”, “Shortlisted”, “Interview”, “Accepted”, and “Rejected”.

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
  const { id } = useParams();
  const { data: applicants, isLoading } = useQuery({
    queryKey: ["fetchAllApplicants", id],
    queryFn: () => {
      if (id) return getAllApplicantsOfaJob(id);
    },
    enabled: !!id,
  });

  const navigate = useNavigate();

  const { mode } = useRole();

  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[] | undefined>(
    undefined
  );
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const queryClient = useQueryClient();

  const handleFetchProfile = (id: string) => {
    setUserId(id);
    setOpen(true);
  };

  const { mutate: shortlisted, isLoading: isSLoading } = useMutation({
    mutationFn: JobApplicationToShortList,
    onSuccess: () => {
      tos.success("Status Updated Successfully");
      queryClient.invalidateQueries(["fetchAllApplicants", id]);
      setOpenStatus(false);
    },
    onError: (error) => {
      const msg = getAxiosErrorMessage(error);
      tos.error(msg);
    },
  });

  const { mutate: declined, isLoading: isDLoading } = useMutation({
    mutationFn: JobApplicationToDeclined,
    onSuccess: () => {
      tos.success("Status Updated Successfully");
      queryClient.invalidateQueries(["fetchAllApplicants", id]);
      setOpenStatus(false);
    },
    onError: (error) => {
      const msg = getAxiosErrorMessage(error);
      tos.error(msg);
    },
  });

  const { mutate: accepted, isLoading: isALoading } = useMutation({
    mutationFn: JobApplicationToAccepted,
    onSuccess: () => {
      tos.success("Status Updated Successfully");
      queryClient.invalidateQueries(["fetchAllApplicants", id]);
      setOpenStatus(false);
    },
    onError: (error) => {
      const msg = getAxiosErrorMessage(error);
      tos.error(msg);
    },
  });

  const { mutate: pending, isLoading: isPLoading } = useMutation({
    mutationFn: JobApplicationToPending,
    onSuccess: () => {
      tos.success("Status Updated Successfully");
      queryClient.invalidateQueries(["fetchAllApplicants", id]);
      setOpenStatus(false);
    },
    onError: (error) => {
      const msg = getAxiosErrorMessage(error);
      tos.error(msg);
    },
  });

  const changeStatus = () => {
    if (selectedStatus) {
      if (selectedStatus === "short_list") {
        shortlisted({
          jobid: id,
          ids: selectedIds,
          appStatus: selectedStatus,
        });
      } else if (selectedStatus === "accepted") {
        accepted({
          jobid: id,
          ids: selectedIds,
          appStatus: selectedStatus,
        });
      } else if (selectedStatus === "declined") {
        declined({
          jobid: id,
          ids: selectedIds,
          appStatus: selectedStatus,
        });
      } else if (selectedStatus === "pending") {
        pending({
          jobid: id,
          ids: selectedIds,
          appStatus: selectedStatus,
        });
      }
    } else {
      tos.error("Please Select a Status");
    }
  };

  const statusOptions = [
    { value: "pending", label: "Shortlisted" },
    { value: "short_list", label: "Passed for Interview" },
    { value: "accepted", label: "Accepted" },
    { value: "declined", label: "Declined" },
  ];

  const handleClick = (userId: string, userName: string) => {
    // Replace spaces with underscores
    const formattedUserName = userName.replace(/\s+/g, "_");
    navigate(`/user/${formattedUserName}`, { state: { id: userId } });
  };

  return (
    <div className="overflow-x-auto ">
      <div className="my-1 flex items-center justify-center">
        {selectedIds && selectedIds?.length > 0 && (
          <button
            className={`mb-1 px-2 py-1 text-white cursor-pointer ${
              mode === "formal" ? "bg-primary" : "bg-primary2"
            } `}
            onClick={() => setOpenStatus(true)}
          >
            Change Status
          </button>
        )}
      </div>
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
            {/* <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              Score
            </th> */}
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
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <tbody className="bg-white divide-y my-4 py-6 divide-gray-200">
            {applicants?.data.map((application, ind) => (
              <tr
                key={application._id}
                className={`${ind % 2 === 0 ? "bg-[#F8F8FD]" : "bg-white"}`}
              >
                <td className="px-6 py-4 whitespace-nowrap ">
                  <input
                    type="checkbox"
                    // checked={selectedIds?.includes(application._id) || false}
                    className="h-4 w-4 cursor-pointer text-primary focus:ring-primary border-gray-300 rounded"
                    onChange={() => {
                      setSelectedIds((prev) => {
                        const current = prev ?? [];
                        if (current.includes(application._id)) {
                          // Remove if already selected
                          return current.filter((id) => id !== application._id);
                        } else {
                          // Add if not selected
                          return [...current, application._id];
                        }
                      });
                    }}
                  />
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 hover:text-gray-700 cursor-pointer"
                  onClick={() => handleFetchProfile(application?.userid._id)}
                >
                  <div className="flex items-center justify-start gap-2">
                    {/* <img
                      className="w-8 h-8 rounded-full object-cover"
                      src={application.}
                    /> */}
                    {application.name}
                  </div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {"0.0"}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-4 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                    ${statusColors[application.appStatus]?.bg}
                    ${statusColors[application.appStatus]?.text}
                    ${statusColors[application.appStatus]?.border}`}
                  >
                    {statusValue[application.appStatus]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {toMonthDayYear(application.applicationDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-primary hover:text-primary/70">
                  <button
                    className="border border-primary px-4 py-2"
                    onClick={() =>
                      handleClick(application.userid?._id, application.name)
                    }
                  >
                    See Applicant
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      <UserProfile
        open={open}
        setOpen={setOpen}
        id={userId}
        showShare={false}
      />

      <Dialog.Root open={openStatus} onOpenChange={setOpenStatus}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between mb-2">
              <Dialog.Title className="text-lg font-semibold">
                Change Status
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="">
              <Select.Root
                onValueChange={(value) => setSelectedStatus(value)}
                value={selectedStatus}
              >
                <Select.Trigger
                  className={`flex items-center justify-between h-10 px-3 py-2 mt-1 border border-gray-300 bg-transparent rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 ${
                    selectedStatus ? "text-black" : "text-gray-400"
                  } w-full`}
                >
                  <Select.Value placeholder="Please Select Status" />
                  <Select.Icon>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
                    <Select.Viewport className="p-1">
                      {statusOptions.map((g) => (
                        <Select.Item
                          key={g.value}
                          value={g.value}
                          className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                        >
                          <Select.ItemText>{g.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              <Button
                className={`w-full my-4 ${
                  mode === "formal"
                    ? "bg-primary hover:bg-primary/70"
                    : "bg-primary2 hover:bg-primary2/70"
                } `}
                onClick={() => changeStatus()}
              >
                {isALoading || isDLoading || isSLoading || isPLoading ? (
                  <Spinner />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default ApplicantsList;
