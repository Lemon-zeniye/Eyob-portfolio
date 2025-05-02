import { getJobs } from "@/Api/job.api";
import { CheckboxWithLabel } from "@/components/Jobs/CheckBox";
import JobCard from "@/components/Jobs/JobCard";
import { Button } from "@/components/ui/button";
import { FilterCategory, SelectedValues } from "@/Types/job.type";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FiChevronDown, FiFilter, FiSearch } from "react-icons/fi";
import { useQuery } from "react-query";
import JobCardTwo from "@/components/Jobs/JobCardGrid";
import { PiColumnsFill } from "react-icons/pi";
import { TbLayoutGridFilled } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useIsMobile } from "@/hooks/use-isMobile";
import MobileFilter from "@/components/Jobs/MobileFiltter";
import JobCardSkeleton from "@/components/Jobs/JobCardSkeleton";
import JobCardTwoSkeleton from "@/components/Jobs/JobCardTwoSkeleton";
import { IoBusinessOutline } from "react-icons/io5";
import { CiCircleRemove } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

function NewJobPage() {
  const filterValues: FilterCategory[] = [
    {
      category: { label: "Employment Type", value: "jobType" },
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

  const [openCategories, setOpenCategories] = useState<string[]>(
    filterValues.map((filter) => filter.category.value)
  );

  const [gridOne, setGridOne] = useState(true);
  // const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);
  // const [openJobDetail, setOpenJobDetail] = useState<boolean>(false);
  const navigate = useNavigate();

  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
    jobTitle: "",
    jobType: null,
    jobLocation: null,
    payment: null,
    company: "",
  });

  const [selectedFilter, setSelectedFilter] = useState({});

  const [mobileFilter, setMobileFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});

  const applyFilters = () => {
    const filters = Object.entries(selectedValues).reduce(
      (acc: { [key: string]: string }, [key, value]) => {
        if (value !== "" && value !== null) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    setSelectedFilter(filters);
  };

  const cancelRadioFilters = () => {
    setSelectedValues((prev) => ({
      ...prev,
      jobType: null,
      jobLocation: null,
      payment: null,
    }));

    const filtered = Object.entries(selectedValues).reduce(
      (acc: { [key: string]: string }, [key, value]) => {
        if (
          value !== "" &&
          value !== null &&
          !["jobType", "jobLocation", "payment"].includes(key)
        ) {
          if (value !== "" && value !== null) {
            acc[key] = value;
          }
        }
        return acc;
      },
      {}
    );
    setSelectedFilter(filtered);
  };

  const handleChangeFilter = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = new Set(prev[category] || []);
      current.has(value) ? current.delete(value) : current.add(value);
      return { ...prev, [category]: Array.from(current) };
    });
  };

  const handleCheckboxChange = (category: string, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [category]: prev[category] === value ? null : value,
    }));
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", selectedFilters);
    setMobileFilter(false);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
  };

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["jobs", selectedFilter],
    queryFn: () => getJobs(selectedFilter),
  });

  useEffect(() => {
    console.log("selected value", selectedValues);
  }, [selectedValues]);

  const applyFilteredValues = (values: SelectedValues) => {
    const cleaned = Object.entries(values).reduce(
      (acc: { [key: string]: string }, [key, value]) => {
        if (value !== "" && value !== null) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
    setSelectedFilter(cleaned);
  };

  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: ["jobs"] });
  // }, [selectedFilter]);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setGridOne(false);
    }
  }, [isMobile]);

  const toggleCategory = (value: string) => {
    setOpenCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="">
      <div className="flex items-center justify-between border rounded-md shadow-sm py-3 px-3  md:mx-4 bg-white">
        <div className="flex items-center flex-1 border-r pr-4">
          <FiSearch className="text-gray-500 mr-2 text-lg" />
          <input
            type="text"
            value={selectedValues["jobTitle"] ?? ""}
            onChange={(e) => handleCheckboxChange("jobTitle", e.target.value)}
            placeholder="Job title or keyword"
            className="w-full py-2 border-b outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
          />
          {selectedValues["jobTitle"] ? (
            <span
              className="ml-1 cursor-pointer text-gray-600"
              onClick={() => {
                const updatedValues = { ...selectedValues, jobTitle: "" };
                setSelectedValues(updatedValues);
                applyFilteredValues(updatedValues);
              }}
            >
              <CiCircleRemove size={20} />
            </span>
          ) : null}
        </div>

        {/* Location input */}
        <div className="flex items-center flex-1 px-4">
          <IoBusinessOutline className="text-gray-500 mr-2 text-lg" />
          <input
            type="text"
            value={selectedValues["company"] ?? ""}
            onChange={(e) => handleCheckboxChange("company", e.target.value)}
            placeholder="Amazon"
            className="w-full border-b py-2 outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
          />
          {selectedValues["company"] ? (
            <span
              className="ml-1 cursor-pointer text-gray-600"
              onClick={() => {
                const updatedValues = { ...selectedValues, company: "" };
                setSelectedValues(updatedValues);
                applyFilteredValues(updatedValues);
              }}
            >
              <CiCircleRemove size={20} />
            </span>
          ) : null}
        </div>

        <Button
          onClick={() => applyFilters()}
          className="bg-[#05A9A9] px-8 rounded-none py-2  text-white focus:outline-none focus:ring-2 focus:ring-[#05A9A9]"
        >
          Search
        </Button>
      </div>

      <div className="grid grid-cols-6">
        <div className="hidden md:block md:col-span-1 p-4 space-y-3">
          {filterValues.map((filter) => {
            const isOpen = openCategories.includes(filter.category.value);
            return (
              <div key={filter.category.value}>
                <button
                  type="button"
                  onClick={() => toggleCategory(filter.category.value)}
                  className="w-full flex justify-between items-center text-left text-[1rem] font-semibold text-gray-800 hover:text-primary transition"
                >
                  {filter.category.label}
                  <span
                    className={`transform transition-transform text-sm ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDownIcon size={22} />
                  </span>
                </button>
                <div
                  className={`mt-3 space-y-4 transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 overflow-hidden opacity-0"
                  }`}
                >
                  {filter.options.map((option) => (
                    <CheckboxWithLabel
                      key={option.id}
                      id={`${filter.category.value}-${option.value}`}
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
            );
          })}
          <div className="flex gap-2">
            <Button
              onClick={() => cancelRadioFilters()}
              className="rounded-none "
              variant="outline"
            >
              Clear
            </Button>
            <Button onClick={() => applyFilters()} className="rounded-none ">
              Apply Filter
            </Button>
          </div>
        </div>
        <div className="col-span-6 md:col-span-5 mr-2 md:pr-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row justify-between flex-1 w-full items-start md:items-center py-2 pr-0 md:pr-4 border-b border-gray-200">
              <div>
                <h2 className="font-bold text-2xl mr-2">All Jobs</h2>
                <span className="text-gray-600">Showing 73 results</span>
              </div>

              <div className="hidden md:flex items-center mt-2 md:mt-0">
                <span className="mr-2">Sort by:</span>
                <span className="font-semibold mr-1">Most relevant</span>
                <FiChevronDown />
              </div>
            </div>

            <div className="flex gap-x-2 items-center w-full md:w-auto justify-between">
              <button
                className="md:hidden flex items-center text-gray-700 border border-gray-300 rounded px-2 py-1 cursor-pointer"
                onClick={() => setMobileFilter(true)}
              >
                <FiFilter className="mr-1" />
                Filter
              </button>

              <div className="flex gap-x-2 items-center">
                <TbLayoutGridFilled
                  size={24}
                  onClick={() => setGridOne(false)}
                  className={`${!gridOne ? "text-primary" : ""} cursor-pointer`}
                />
                <PiColumnsFill
                  size={24}
                  onClick={() => setGridOne(true)}
                  className={`${
                    gridOne ? "text-primary" : ""
                  } rotate-90 cursor-pointer hidden md:block`}
                />
              </div>
            </div>
          </div>
          <div className="mt-4   h-[64vh]">
            <ScrollArea.Root className="w-full h-full overflow-hidden rounded">
              <ScrollArea.Viewport className="w-full h-full">
                <AnimatePresence mode="wait">
                  {gridOne ? (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full space-y-4"
                    >
                      {isLoading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                          <JobCardSkeleton key={idx} />
                        ))
                      ) : jobsData?.data && jobsData?.data?.length > 0 ? (
                        jobsData.data.map((job) => (
                          <JobCard
                            key={job._id}
                            job={job}
                            onClick={() => {
                              // setOpenJobDetail(true);
                              // setSelectedJob(job);
                            }}
                          />
                        ))
                      ) : (
                        <div className="w-full flex flex-col items-center justify-center py-12 text-center text-gray-500">
                          <h2 className="text-xl font-semibold">
                            No jobs found
                          </h2>
                          <p className="text-sm text-gray-400 mt-1">
                            Try adjusting your filters or check back later.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full grid gap-y-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    >
                      {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                          <JobCardTwoSkeleton key={i} />
                        ))
                      ) : jobsData?.data && jobsData?.data?.length > 0 ? (
                        jobsData.data.map((job) => (
                          <JobCardTwo
                            key={job._id}
                            job={job}
                            onClick={() => {
                              // setOpenJobDetail(true);
                              // setSelectedJob(job);
                              navigate(`/jobs/${job._id}`);
                            }}
                          />
                        ))
                      ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-gray-500">
                          <h2 className="text-xl font-semibold">
                            No jobs found
                          </h2>
                          <p className="text-sm text-gray-400 mt-1">
                            Try adjusting your filters or check back later.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar
                orientation="vertical"
                className="w-1 bg-gray-200"
              >
                <ScrollArea.Thumb className="bg-primary" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </div>
        </div>
        {/* <div className="w-full">
          {selectedJob && (
            <JobsDetail
              id={selectedJob._id}
              open={openJobDetail}
              onChange={(o) => setOpenJobDetail(o)}
              selectedJob={selectedJob}
              FollowClicked={function (): void {
                throw new Error("Function not implemented.");
              }}
              ReportClicked={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          )}
        </div> */}

        <div className="w-full">
          <MobileFilter
            open={mobileFilter}
            onOpenChange={setMobileFilter}
            filters={filterValues}
            selectedFilters={selectedFilters}
            onChangeFilter={handleChangeFilter}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        </div>
      </div>
    </div>
  );
}

export default NewJobPage;
