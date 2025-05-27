import { getJobs } from "@/Api/job.api";
import { CheckboxWithLabel } from "@/components/Jobs/CheckBox";
import JobCard from "@/components/Jobs/JobCard";
import { Button } from "@/components/ui/button";
import { FilterCategory, SelectedValues } from "@/Types/job.type";
import { ChevronDownIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import { useInfiniteQuery } from "react-query";
import JobCardTwo from "@/components/Jobs/JobCardGrid";
import { PiColumnsFill } from "react-icons/pi";
import { TbLayoutGridFilled } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-isMobile";
import MobileFilter from "@/components/Jobs/MobileFiltter";
import JobCardSkeleton from "@/components/Jobs/JobCardSkeleton";
import JobCardTwoSkeleton from "@/components/Jobs/JobCardTwoSkeleton";
import { IoBusinessOutline } from "react-icons/io5";
import { CiCircleRemove } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/Spinner";
import { useRole } from "@/Context/RoleContext";
import clsx from "clsx";

function NewJobPage() {
  const filterValues: FilterCategory[] = [
    {
      category: { label: "Employment Type", value: "employmentType" },
      options: [
        { id: 1, name: "Graduate Job", value: "graduate-job" },
        { id: 2, name: "Internship", value: "internship" },
        { id: 3, name: "Co-op", value: "co-op" },
        { id: 4, name: "On-Campus Internship", value: "on-campus-internship" },
        { id: 5, name: "STEM Internship", value: "stem-internship" },
        {
          id: 6,
          name: "Unpaid/Volunteer Work",
          value: "unpaid-volunteer-work",
        },
      ],
    },
    {
      category: { label: "Employment Mode", value: "employmentMode" },
      options: [
        { id: 1, name: "Remote", value: "remote" },
        { id: 2, name: "On site", value: "on-site" },
        { id: 3, name: "Hybrid", value: "hybrid" },
      ],
    },
    {
      category: { label: "Job Qualification", value: "jobQualification" },
      options: [
        { id: 1, name: "Diploma", value: "diploma" },
        { id: 2, name: "Bachelor", value: "bachelor" },
        { id: 3, name: "Masters", value: "masters" },
        { id: 4, name: "PHD", value: "phd" },
      ],
    },
  ];

  const [openCategories, setOpenCategories] = useState<string[]>(
    filterValues.map((filter) => filter.category.value)
  );
  const [gridOne, setGridOne] = useState(true);
  const navigate = useNavigate();
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
    jobTitle: "",
    employmentType: null,
    employmentMode: null,
    jobIndustry: "",
  });
  const [selectedFilter, setSelectedFilter] = useState({});
  const [mobileFilter, setMobileFilter] = useState(false);
  const { mode } = useRole();

  const applyFilters = () => {
    console.log("333333333", selectedValues);
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
    setMobileFilter(false);
  };

  const cancelRadioFilters = () => {
    setSelectedValues((prev) => ({
      ...prev,
      employmentType: null,
      employmentMode: null,
    }));

    const filtered = Object.entries(selectedValues).reduce(
      (acc: { [key: string]: string }, [key, value]) => {
        if (
          value !== "" &&
          value !== null &&
          !["employmentType", "employmentMode"].includes(key)
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

  const handleCheckboxChange = (category: string, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [category]: prev[category] === value ? null : value,
    }));
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery(
    ["jobs", selectedFilter],
    ({ pageParam = 1 }) => getJobs(selectedFilter, pageParam, 5),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.data.length > 0 ? allPages.length + 1 : undefined;
      },
    }
  );

  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const handleScroll = useCallback(() => {
    if (!scrollableDivRef.current) return;

    const { scrollTop, clientHeight, scrollHeight } = scrollableDivRef.current;

    // Check if scrolled near the bottom of the div (with 100px buffer)
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    // Early return if conditions aren't met
    if (!isNearBottom || isLoading || isFetchingNextPage || !hasNextPage) {
      return;
    }

    fetchNextPage();
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  // Add scroll event listener
  useEffect(() => {
    const div = scrollableDivRef.current;
    if (!div) return;

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
            value={selectedValues["jobIndustry"] ?? ""}
            onChange={(e) =>
              handleCheckboxChange("jobIndustry", e.target.value)
            }
            placeholder="Search Job Industry here"
            className="w-full border-b py-2 outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
          />
          {selectedValues["jobIndustry"] ? (
            <span
              className="ml-1 cursor-pointer text-gray-600"
              onClick={() => {
                const updatedValues = { ...selectedValues, jobIndustry: "" };
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
          className={`px-8 rounded-none py-2 text-white focus:outline-none focus:ring-2 ${
            mode === "formal"
              ? "bg-primary focus:ring-primary"
              : "bg-[#FFA500] hover:bg-[#FFA500]/70"
          }`}
        >
          Search
        </Button>
      </div>

      <div className="grid grid-cols-6">
        <div className="hidden md:block md:col-span-1 p-4 space-y-3 h-[70vh] overflow-y-auto">
          <h1>Filter</h1>
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
            <Button
              onClick={() => applyFilters()}
              className={`rounded-none py-2 text-white focus:outline-none focus:ring-2 ${
                mode === "formal"
                  ? "bg-primary hover:bg-primary/70"
                  : "bg-primary2 hover:bg-primary2/70"
              }`}
            >
              Apply Filter
            </Button>
          </div>
        </div>
        <div className="col-span-6 md:col-span-5 mr-2 md:pr-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row justify-between flex-1 w-full items-start md:items-center py-2 pr-0 md:pr-4 border-b border-gray-200">
              <div>
                <h2 className="font-bold text-2xl mr-2">All Jobs</h2>
                {/* <span className="text-gray-600">Showing 73 results</span> */}
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* <div className="hidden md:flex items-center mt-2 md:mt-0">
                  <span className="mr-2">Sort by:</span>
                  <span className="font-semibold mr-1">Most relevant</span>
                  <FiChevronDown />
                </div> */}
                <div className="hidden md:flex items-center mt-2 md:mt-0">
                  <button
                    type="button"
                    className={clsx(
                      "font-medium transition-colors duration-200",
                      mode === "formal"
                        ? "text-primary hover:text-primary/70"
                        : "text-primary2 hover:text-primary2/70"
                    )}
                    onClick={() => navigate("/jobs/applied-jobs")}
                  >
                    Applied Jobs
                  </button>
                </div>
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
                  className={`cursor-pointer ${
                    !gridOne
                      ? mode === "formal"
                        ? "text-primary"
                        : "text-primary2"
                      : "text-gray-400"
                  }`}
                />

                <PiColumnsFill
                  size={24}
                  onClick={() => setGridOne(true)}
                  className={`rotate-90 cursor-pointer hidden md:block ${
                    gridOne
                      ? mode === "formal"
                        ? "text-primary"
                        : "text-primary2"
                      : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>
          <div
            className="w-full h-[64vh] overflow-y-auto overflow-x-hidden rounded"
            ref={scrollableDivRef}
          >
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
                    // Initial loading state
                    Array.from({ length: 4 }).map((_, idx) => (
                      <JobCardSkeleton key={idx} />
                    ))
                  ) : error ? (
                    // Error state
                    <div className="w-full flex flex-col items-center justify-center py-12 text-center text-red-500">
                      <h2 className="text-xl font-semibold">
                        Error loading jobs
                      </h2>
                      <p className="text-sm text-red-400 mt-1">
                        {(error as Error).message}
                      </p>
                    </div>
                  ) : data?.pages && data?.pages?.[0]?.data?.length > 0 ? (
                    // Success state with jobs
                    <div className="space-y-4">
                      {data.pages.map((page, i) => (
                        <div key={i} className="space-y-4">
                          {page.data.map((job) => (
                            <JobCard key={job._id} job={job} />
                          ))}
                        </div>
                      ))}
                      {isFetchingNextPage && (
                        <div className="py-[1rem] my-2 flex item-center justify-center bg-primary/10 z-20">
                          <Spinner />
                        </div>
                      )}
                    </div>
                  ) : (
                    // Empty state
                    <div className="w-full flex flex-col items-center justify-center py-12 text-center text-gray-500">
                      <h2 className="text-xl font-semibold">No jobs found</h2>
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
                  className="w-full space-y-4"
                >
                  {isLoading ? (
                    // Initial loading state
                    Array.from({ length: 4 }).map((_, idx) => (
                      <JobCardTwoSkeleton key={idx} />
                    ))
                  ) : error ? (
                    // Error state
                    <div className="w-full flex flex-col items-center justify-center py-12 text-center text-red-500">
                      <h2 className="text-xl font-semibold">
                        Error loading jobs
                      </h2>
                      <p className="text-sm text-red-400 mt-1">
                        {(error as Error).message}
                      </p>
                    </div>
                  ) : data?.pages && data?.pages?.[0]?.data?.length > 0 ? (
                    // Success state with jobs - Single grid container for all jobs
                    <div className="w-full grid gap-y-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {data.pages.map((page) =>
                        page.data.map((job) => (
                          <JobCardTwo key={job._id} job={job} />
                        ))
                      )}
                      {isFetchingNextPage && (
                        <div className="col-span-full py-[1rem] my-2 flex item-center justify-center bg-primary/10 z-20">
                          <Spinner />
                        </div>
                      )}
                    </div>
                  ) : (
                    // Empty state
                    <div className="w-full flex flex-col items-center justify-center py-12 text-center text-gray-500">
                      <h2 className="text-xl font-semibold">No jobs found</h2>
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your filters or check back later.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="w-full">
          <MobileFilter
            open={mobileFilter}
            onOpenChange={setMobileFilter}
            filters={filterValues}
            selectedFilters={selectedValues}
            onChangeFilter={handleCheckboxChange}
            onApply={applyFilters}
            onClear={cancelRadioFilters}
          />
        </div>
      </div>
    </div>
  );
}

export default NewJobPage;
