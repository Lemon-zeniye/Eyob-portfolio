import { getJobs } from "@/Api/job.api";
import AppliedSide from "@/components/Jobs/AppliedSide";
import JobsCard from "@/components/Jobs/JobsCard";
import JobsDetail from "@/components/Jobs/JobsDetail";
import JobsFilterSm from "@/components/Jobs/JobsFilterSm";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckboxWithLabelProps,
  FilterCategory,
  Job,
  SelectedValues,
} from "@/Types/job.type";
import { ExternalLink, Frown, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

interface AppliedButtonProps {
  classname: string;
  onClick: () => void;
}

const AppliedButton = ({ classname, onClick }: AppliedButtonProps) => (
  <Button
    onClick={onClick}
    variant={"link"}
    className={`${classname} flex flex-row gap-2 text-center `}
  >
    <ExternalLink size={20} />
    Applied Jobs
  </Button>
);

const filterValues: FilterCategory[] = [
  {
    category: { label: "Employment Type", value: "jobTitle" },
    options: [
      { id: 1, name: "Full Time", value: "full-time" },
      { id: 2, name: "Part Time", value: "part-time" },
      { id: 3, name: "Internship", value: "internship" },
      { id: 4, name: "Contract", value: "contract" },
    ],
  },
  {
    category: { label: "Job Location", value: "jobLocation" },
    options: [
      { id: 1, name: "Remote", value: "remote" },
      { id: 2, name: "On site", value: "on-site" },
      { id: 3, name: "Hybrid", value: "hybrid" },
    ],
  },
  {
    category: { label: "Salary Type", value: "payment" },
    options: [
      { id: 1, name: "Hourly", value: "hourly" },
      { id: 2, name: "Monthly", value: "monthly" },
      { id: 3, name: "Annual", value: "Annual" },
    ],
  },
];

const Jobs = () => {
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({});
  const [selectedFilter, setSelectedFilter] = useState({});
  const [search, setSearch] = useState<string>("");
  const [openJobDetail, setOpenJobDetail] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);
  const navigate = useNavigate();

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["jobs", selectedFilter],
    queryFn: () => getJobs(selectedFilter),
  });

  // const handleCheckboxChange = (value: string, checked: boolean) => {
  //   setSelectedValues((prevValues) =>
  //     checked ? [...prevValues, value] : prevValues.filter((v) => v !== value)
  //   );
  // };

  const handleCheckboxChange = (category: string, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [category]: prev[category] === value ? null : value,
    }));
  };

  const handleApplyFilter = () => {
    // console.log("Applied Filters:", selectedValues);
    setSelectedFilter(selectedValues);
  };

  const handleClearAll = () => {
    setSelectedValues({});
    setSelectedFilter({});
  };

  // const filteredJobs = jobsData?.data.filter((job) => {
  //   const matchesFilters =
  //     selectedValues.length === 0 ||
  //     selectedValues.some((filter) => {
  //       return (
  //         filter === job.locationType?.toLowerCase() ||
  //         filter === job.jobTitle?.toLowerCase() ||
  //         filter === job.company?.toLowerCase()
  //       );
  //     });

  //   const matchesSearch =
  //     job.company?.toLowerCase().includes(search.toLowerCase()) ||
  //     job.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
  //     job.jobLocation?.toLowerCase().includes(search.toLowerCase()) ||
  //     job.locationType?.toLowerCase().includes(search.toLowerCase());

  //   return matchesFilters && matchesSearch;
  // });

  function CheckboxWithLabel({
    id,
    label,
    checked,
    onChange,
  }: CheckboxWithLabelProps) {
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onChange}
          className="h-4 w-4 border-primary"
        />
        <label htmlFor={id} className="cursor-pointer">
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pr-5">
      <div className="flex flex-row justify-between items-center">
        <p className=" sm:text-base md:text-xl font-bold">
          Recommended For You
        </p>
        <div className="flex flex-row sm-phone:gap-2">
          <div className="sm-phone:hidden sm:flex">
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          <div className="lg:hidden sm:flex sm-phone:hidden ">
            <JobsFilterSm
              filterValues={filterValues}
              selectedValues={selectedValues}
              handleCheckboxChange={handleCheckboxChange}
            />
          </div>
          <AppliedButton
            classname=" sm:hidden sm-phone:flex "
            onClick={() => navigate("/applied-jobs")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex sm-phone:flex-row sm-phone:justify-between sm:items-end sm:justify-end">
          <div className="flex flex-row sm-phone:items-end justify-end w-full sm:hidden sm-phone:gap-2">
            <SearchBar search={search} setSearch={setSearch} />
            <JobsFilterSm
              filterValues={filterValues}
              selectedValues={selectedValues}
              handleCheckboxChange={handleCheckboxChange}
            />
          </div>
          <AppliedButton
            classname=" sm:flex sm-phone:hidden lg:hidden"
            onClick={() => navigate("/applied-jobs")}
          />
        </div>

        <div className="flex flex-row justify-between w-full gap-6">
          <div className=" sm-phone:hidden lg:flex flex-col gap-7 w-1/5">
            <div className="flex flex-col gap-3 w-full">
              <h1 className="text-lg font-semibold underline">Quick Filters</h1>

              {filterValues.map((filter) => (
                <div
                  key={filter.category.value}
                  className="flex flex-col gap-3"
                >
                  <p className="font-medium">{filter.category.label}</p>
                  <div className="flex flex-col gap-4">
                    {filter.options.map((option) => (
                      <CheckboxWithLabel
                        key={option.id}
                        id={`${filter.category.value}-${option.id}`}
                        label={option.name}
                        onChange={() =>
                          handleCheckboxChange(
                            filter.category.value,
                            option.value
                          )
                        }
                        checked={
                          selectedValues[filter.category.value] === option.value
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleApplyFilter}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/70"
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 h-screen overflow-y-auto pr-2 space-y-3 lg:w-2/3">
            {isLoading ? (
              <div className="flex items-center justify-center h-full ">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : jobsData?.data.length === 0 ? (
              <div className="flex flex-col w-full gap-3 items-center justify-center h-full ">
                <Frown size={80} className="text-primary" />
                <p className="font-bold text-center ">
                  Sorry, but we don't have those jobs for you!
                </p>
              </div>
            ) : (
              jobsData?.data.map((job) => (
                <JobsCard
                  key={job._id}
                  size="large"
                  job={job}
                  onClick={() => {
                    setOpenJobDetail(true);
                    setSelectedJob(job);
                  }}
                />
              ))
            )}
          </div>

          <AppliedSide />
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
    </div>
  );
};

export default Jobs;
