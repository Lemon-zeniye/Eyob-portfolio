import { FormProvider, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import * as Select from "@radix-ui/react-select";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { addJob, getFetchSingleJob, updateJob } from "@/Api/job.api";
import { tos } from "@/lib/utils";
import { Spinner } from "../ui/Spinner";
import { getAxiosErrorMessage } from "@/Api/axios";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { BsExclamationCircleFill } from "react-icons/bs";
import { PiListChecksFill } from "react-icons/pi";
import { FaPlus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { useRole } from "@/Context/RoleContext";
import { jobIndustrys } from "@/lib/constant";

function AddJob() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skill, setSkill] = useState("");
  const [step, setStep] = useState(true);
  const { mode } = useRole();
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

  useEffect(() => {
    if (jobDetail) {
      setSkills(jobDetail?.data.skills);
    }
  }, [jobDetail]);

  const form = useForm({
    mode: "onChange",
    defaultValues: {
      jobTitle: jobDetail?.data.jobTitle ?? "",
      jobDescription: jobDetail?.data.jobDescription ?? "",
      deadLine: jobDetail?.data.deadLine
        ? new Date(jobDetail.data.deadLine)
        : new Date(),
      jobQualification: jobDetail?.data.jobQualification ?? "",
      jobLocation: jobDetail?.data.jobLocation ?? "",
      experience: jobDetail?.data.experience ?? "",
      employmentMode: jobDetail?.data.employmentMode ?? "",
      jobRequirement: jobDetail?.data.jobRequirement ?? "",
      jobIndustry: jobDetail?.data.jobIndustry ?? "",
      employmentType: jobDetail?.data.employmentType ?? "",
      skills: jobDetail?.data.skills ?? [],
      range: {
        minimum: jobDetail?.data.range?.[0]?.minimum ?? "",
        maximum: jobDetail?.data.range?.[0]?.maximum ?? "",
      },
      salaryType: jobDetail?.data.salaryType ?? "",
      salary: jobDetail?.data.salary ?? 0,
      numberOfOpenings: jobDetail?.data.numberOfOpenings ?? 1,
      timeToHire: jobDetail?.data.timeToHire ?? 0,
    },
  });

  //   {
  //   "jobTitle": "Software Engineer",
  //   "jobDescription": "Responsible for developing and maintaining software applications.",
  //   "deadLine": "2025-03-01",
  //   "jobLocation": "New York, NY",
  //   "jobQualification": "Bachelor's Degree in Computer Science",
  //   "experience": "3+ years",
  //   "locationType": "On-site-on-ome",
  //   "jobRequirement": "Strong problem-solving skills, familiarity with Agile methodology",
  //   "jobIndustry": "Information Technology",
  //   "employmentMode": "Work from office",
  //   "employmentType": "Graduat Job",
  //   "skills": [
  //     "JavaScript",
  //     "Node.js",
  //     "React"
  //   ],
  //   "salaryType": "Annual",
  //   "salary": 90000,
  //   "range": [
  //     {
  //       "minimum": 80000,
  //       "maximum": 120000
  //     }
  //   ],
  //   "numberOfOpenings": 5,
  //   "timeToHire": 30
  // }

  const { mutate, isLoading } = useMutation({
    mutationFn: addJob,
    onSuccess: () => {
      tos.success("Job Added Successfully!");
      // form.reset();
    },
    onError: (err) => {
      const mes = getAxiosErrorMessage(err);
      tos.error(mes);
    },
  });

  const { mutate: updateJobMut, isLoading: jobEditLoading } = useMutation({
    mutationFn: updateJob,
    onSuccess: () => {
      tos.success("Job Updated Successfully!");
      // form.reset();
    },
    onError: (err) => {
      const mes = getAxiosErrorMessage(err);
      tos.error(mes);
    },
  });

  const addSkill = () => {
    if (!skill) {
      return;
    }

    setSkills((pre) => [...pre, skill]);
    setSkill("");
  };

  // const addEducationalBack = () => {
  //   if (!degree) {
  //     return;
  //   }
  //   setShowEducationError(false);

  //   setDegrees((pre) => [...pre, degree]);
  //   setDegree("");
  // };

  const onSubmit = (data: any) => {
    let payload = {
      ...data,
      skills: skills,
    };

    if (
      data?.range?.minimum &&
      data?.range?.maximum &&
      data.range.minimum !== 0
    ) {
      payload = {
        ...payload,
        range: [{ ...data.range }],
      };
    } else {
      // Remove the range key from payload if it exists
      const { range, ...rest } = payload;
      payload = rest;
    }

    if (id) {
      updateJobMut({ id, payload });
    } else {
      mutate(payload);
    }
  };

  const salaryType = form.watch("salaryType");

  const locationTypes = [
    { value: "On-site", label: "On-site" },
    { value: "Remote", label: "Remote" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  // const employmentTypes = [
  //   { value: "full-time", label: "Full-time" },
  //   { value: "part-time", label: "Part-time" },
  //   { value: "internship", label: "Internship" },
  //   { value: "contract", label: "Contract" },
  // ];

  const nextStep = async () => {
    const isStep1Valid = await form.trigger([
      "jobTitle",
      // "jobType",
      "salaryType",
      "salary",
      "range",
      "range.minimum",
      "range.maximum",
      "employmentMode",
      "jobQualification",
      "jobRequirement",
      "jobIndustry",
      "skills",
    ]);

    if (isStep1Valid) {
      setStep(false);
    } else {
      console.log("Step 1 validation failed");
    }
  };

  return (
    <div className="mb-10 px-2">
      {/* custom tab */}
      <div className="py-4 border-2 border-gray-200  flex justify-center">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-6 sm:gap-20 w-full max-w-3xl">
          {/* Step 1 */}
          <div
            className="flex items-center gap-2 cursor-pointer flex-1 min-w-[140px]"
            onClick={() => setStep(true)}
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full ${
                mode === "formal" ? "bg-primary" : "bg-primary2"
              }`}
            >
              <BsExclamationCircleFill className="rotate-180 text-white text-base sm:text-lg" />
            </div>
            <div>
              <p className="font-light text-xs sm:text-sm">Step 1/2</p>
              <p className="font-semibold text-[#25324B] text-sm sm:text-base">
                Basic Information
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-10 w-[1px] bg-gray-400"></div>

          {/* Step 2 */}
          <div
            className="flex items-center gap-2 cursor-pointer flex-1 min-w-[140px]"
            onClick={() => nextStep()}
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full ${
                !step
                  ? mode === "formal"
                    ? "bg-primary"
                    : "bg-primary2"
                  : "bg-[#E9EBFD]"
              }`}
            >
              <PiListChecksFill
                className={`${
                  !step ? "text-white" : "text-[#25324B]"
                } text-base sm:text-lg`}
              />
            </div>
            <div>
              <p className="font-light text-xs sm:text-sm">Step 2/2</p>
              <p className="font-semibold text-[#25324B] text-sm sm:text-base">
                Job Description
              </p>
            </div>
          </div>
        </div>
      </div>

      <FormProvider {...form}>
        <form
          className="pb-6 p-2 md:pl-4 lg:pl-6 md:pr-6 lg:pr-12"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <AnimatePresence mode="wait">
            {step ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className=""
              >
                {/* header one */}
                <div className="py-2 mt-2 ">
                  <h1 className="font-semibold text-[#25324B]">
                    Basic Information
                  </h1>
                  <p className="font-light ">
                    Short description of what you are looking for
                  </p>
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* Job Title */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Job Title
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[50%]">
                      Name of the position you are trying to fill.
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      rules={{ required: "Required" }}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g. Senior Product Designer"
                              {...field}
                              className="rounded-none bg-transparent border-gray-300 shadow-sm w-full md:w-[70%] lg:w-[50%] "
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* Type of Employment */}
                {/* <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Type of Employment
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[60%]">
                      Some employment types can be selected together
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="employmentType"
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="space-y-2">
                              {employmentTypes.map((option) => (
                                <label
                                  key={option}
                                  className="flex items-center space-x-2 py-1 text-gray-600"
                                >
                                  <label
                                    key={option}
                                    className="flex items-center space-x-2 cursor-pointer"
                                  >
                                    <input
                                      type="radio"
                                      value={option}
                                      checked={field.value === option}
                                      onChange={() => field.onChange(option)}
                                      className="peer hidden"
                                    />
                                    <div
                                      className={`w-4 h-4 p-1 rounded-sm border border-gray-400 ${
                                        mode === "formal"
                                          ? "peer-checked:bg-primary peer-checked:border-primary/40"
                                          : "peer-checked:bg-primary2 peer-checked:border-primary2/40"
                                      }`}
                                    />

                                    <span>{option}</span>
                                  </label>
                                </label>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div> */}

                {/* <hr className=" hidden sm:block my-4 border  border-gray-200" /> */}

                {/* salary type */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Salary Type
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[60%]">
                      Select the time salary amount is based upon
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="salaryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="hidden md:block text-sm font-medium text-gray-700">
                            Select Salary Type
                          </FormLabel>
                          <FormControl>
                            <Select.Root
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <Select.Trigger
                                className={`flex items-center justify-between h-10 px-3 py-2 mt-1 border border-gray-300 placeholder:text-gray-300 bg-transparent rounded-none shadow-sm  text-sm focus:outline-none focus:ring-1 ${
                                  field.value ? "text-black" : "text-gray-400"
                                } w-full md:w-[70%] lg:w-[50%] `}
                              >
                                <Select.Value placeholder="Select salary type" />
                                <Select.Icon>
                                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                                </Select.Icon>
                              </Select.Trigger>
                              <Select.Portal>
                                <Select.Content className="z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
                                  <Select.Viewport className="p-1">
                                    {["Annual", "Monthly", "Hourly"].map(
                                      (g) => (
                                        <Select.Item
                                          key={g}
                                          value={g}
                                          className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                                        >
                                          <Select.ItemText>{g}</Select.ItemText>
                                        </Select.Item>
                                      )
                                    )}
                                  </Select.Viewport>
                                </Select.Content>
                              </Select.Portal>
                            </Select.Root>
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {salaryType ? (
                  <>
                    <hr className=" hidden sm:block my-4 border  border-gray-200" />
                    {/* salary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                      <div className="col-span-1">
                        <h1 className="font-semibold space-y-1 text-[#25324B]">
                          Salary
                        </h1>
                        <p className="hidden sm:block font-light w-full lg:w-[70%]">
                          Enter the fixed salary amount (optional unless salary
                          type is selected)
                        </p>
                      </div>

                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name="salary"
                          rules={{
                            validate: (value) => {
                              const salaryType = form.watch("salaryType");
                              if (salaryType && (!value || value <= 0)) {
                                return "Salary must be a positive number if salary type is selected";
                              }
                              return true;
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g. 90000"
                                  {...field}
                                  className="mt-1 rounded-none bg-transparent border-gray-300 shadow-sm w-full md:w-[70%] lg:w-[50%]"
                                />
                              </FormControl>
                              <FormMessage className="mt-1 text-sm text-red-600" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <hr className=" hidden sm:block my-4 border  border-gray-200" />

                    {/* Salary range */}
                    <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                      <div className="col-span-1">
                        <h1 className="font-semibold space-y-1 text-[#25324B]">
                          Salary Range
                        </h1>
                        <p className="hidden sm:block font-light w-full lg:w-[70%]">
                          Select the range in which the job salary will fall in.
                        </p>
                        <p className="hidden sm:block font-light w-full lg:w-[70%]">
                          *You can leave one field blank for fixed salaries
                        </p>
                      </div>

                      <div className="col-span-3">
                        <div className="flex items-center gap-4 sm:gap-10">
                          {/* Salary Range - Min */}
                          <FormField
                            control={form.control}
                            name="range.minimum"
                            rules={{
                              validate: (value) => {
                                const salaryType = form.watch("salaryType");
                                if (!salaryType) {
                                  // salaryType not selected => minimum required
                                  if (
                                    value === "" ||
                                    value === undefined ||
                                    value === null
                                  ) {
                                    return "Minimum salary is required when Salary Type is not selected";
                                  }
                                }
                                // if provided, minimum must be >= 0
                                if (
                                  value !== "" &&
                                  value !== undefined &&
                                  value !== null &&
                                  Number(value) < 0
                                ) {
                                  return "Minimum must be 0 or more";
                                }
                                // if max provided, minimum <= max
                                const max = form.watch("range.maximum");
                                if (
                                  value !== "" &&
                                  max !== "" &&
                                  value !== undefined &&
                                  max !== undefined &&
                                  Number(value) > Number(max)
                                ) {
                                  return "Minimum must be less than or equal to maximum";
                                }
                                return true;
                              },
                            }}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. 50000"
                                    {...field}
                                    type="number"
                                    className="w-full md:w-fit rounded-none bg-transparent border-gray-300 shadow-sm"
                                  />
                                </FormControl>
                                <FormMessage className="mt-1 text-sm text-red-600" />
                              </FormItem>
                            )}
                          />
                          <div className="text-center md:text-left">to</div>

                          <FormField
                            control={form.control}
                            name="range.maximum"
                            rules={{
                              validate: (value) => {
                                const salaryType = form.watch("salaryType");
                                if (!salaryType) {
                                  // salaryType not selected => maximum required
                                  if (
                                    value === "" ||
                                    value === undefined ||
                                    value === null
                                  ) {
                                    return "Maximum salary is required when Salary Type is not selected";
                                  }
                                }
                                // if max < min error
                                const min = form.watch("range.minimum");
                                if (
                                  value !== "" &&
                                  min !== "" &&
                                  value !== undefined &&
                                  min !== undefined &&
                                  Number(value) < Number(min)
                                ) {
                                  return "Maximum must be greater than or equal to minimum";
                                }
                                return true;
                              },
                            }}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. 100000"
                                    {...field}
                                    type="number"
                                    className="w-full md:w-fit rounded-none bg-transparent border-gray-300 shadow-sm"
                                  />
                                </FormControl>
                                <FormMessage className="mt-1 text-sm text-red-600" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* category */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Location Type
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[60%]">
                      Select the type of work location
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="employmentMode"
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="hidden md:block text-sm font-medium text-gray-700">
                            Selecte Location Type
                          </FormLabel>
                          <FormControl>
                            <Select.Root
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <Select.Trigger
                                className={`flex items-center justify-between h-10 px-3 py-2 mt-1 border border-gray-300 bg-transparent rounded-none shadow-sm text-sm focus:outline-none focus:ring-1 ${
                                  field.value ? "text-black" : "text-gray-400"
                                } w-full md:w-[70%] lg:w-[50%]`}
                              >
                                <Select.Value placeholder="Selecte Location Type" />
                                <Select.Icon>
                                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                                </Select.Icon>
                              </Select.Trigger>
                              <Select.Portal>
                                <Select.Content className="z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
                                  <Select.Viewport className="p-1">
                                    {locationTypes.map((g) => (
                                      <Select.Item
                                        key={g.value}
                                        value={g.value}
                                        className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                                      >
                                        <Select.ItemText>
                                          {g.label}
                                        </Select.ItemText>
                                      </Select.Item>
                                    ))}
                                  </Select.Viewport>
                                </Select.Content>
                              </Select.Portal>
                            </Select.Root>
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Job Qualification */}

                <hr className=" hidden sm:block my-4 border  border-gray-200" />
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Job Qualification
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[70%]">
                      Minimum qualifications required for this job.
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="jobQualification"
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="hidden md:block text-sm font-medium text-gray-700">
                            Selecte Qualification
                          </FormLabel>
                          <FormControl>
                            <Select.Root
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <Select.Trigger
                                className={`flex items-center justify-between h-10 px-3 py-2 mt-1 border border-gray-300 bg-transparent rounded-none shadow-sm text-sm focus:outline-none focus:ring-1 ${
                                  field.value ? "text-black" : "text-gray-400"
                                } w-full md:w-[70%] lg:w-[50%]`}
                              >
                                <Select.Value placeholder="Selecte Qualification" />
                                <Select.Icon>
                                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                                </Select.Icon>
                              </Select.Trigger>
                              <Select.Portal>
                                <Select.Content className="z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
                                  <Select.Viewport className="p-1">
                                    {[
                                      { label: "Diploma", value: "diploma" },
                                      { label: "Bachelor", value: "bachelor" },
                                      { label: "Masters", value: "masters" },
                                      { label: "PHD", value: "phd" },
                                    ].map((g) => (
                                      <Select.Item
                                        key={g.value}
                                        value={g.value}
                                        className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                                      >
                                        <Select.ItemText>
                                          {g.label}
                                        </Select.ItemText>
                                      </Select.Item>
                                    ))}
                                  </Select.Viewport>
                                </Select.Content>
                              </Select.Portal>
                            </Select.Root>
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Job Industry
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[50%]">
                      Specify the industry this job belongs to.
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="jobIndustry"
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="hidden md:block text-sm font-medium text-gray-700">
                            Selecte Job Industry
                          </FormLabel>
                          <FormControl>
                            <Select.Root
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <Select.Trigger
                                className={`flex items-center justify-between h-10 px-3 py-2 mt-1 border border-gray-300 bg-transparent rounded-none shadow-sm text-sm focus:outline-none focus:ring-1 ${
                                  field.value ? "text-black" : "text-gray-400"
                                } w-full md:w-[70%] lg:w-[50%]`}
                              >
                                <Select.Value placeholder="e.g. Technology, Healthcare, Education, Finance" />

                                <Select.Icon>
                                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                                </Select.Icon>
                              </Select.Trigger>
                              <Select.Portal>
                                <Select.Content className="z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
                                  <Select.Viewport className="p-1">
                                    {jobIndustrys.map((g) => (
                                      <Select.Item
                                        key={g.value}
                                        value={g.value}
                                        className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                                      >
                                        <Select.ItemText>
                                          {g.label}
                                        </Select.ItemText>
                                      </Select.Item>
                                    ))}
                                  </Select.Viewport>
                                </Select.Content>
                              </Select.Portal>
                            </Select.Root>
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* <div className="col-span-3">
                    <FormField
                      control={form.control}
                      rules={{ required: "Required" }}
                      name="jobIndustry"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g. Technology, Healthcare, Education, Finance"
                              {...field}
                              className="rounded-none bg-transparent border-gray-300 shadow-sm w-full md:w-[70%] lg:w-[50%]"
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div> */}
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* job requirements */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Job Requirements
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[70%]">
                      Outline the skills, experience, or attributes needed to
                      succeed in this role.
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="jobRequirement"
                      rules={{
                        required: "Required",
                      }}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormControl>
                            <Textarea
                              placeholder="e.g. Strong problem-solving skills, ability to work in a team, proficiency in JavaScript..."
                              {...field}
                              className="bg-transparent rounded-none border-gray-300 shadow-sm min-h-[120px] w-full md:w-[70%] lg:w-[60%]"
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* skill */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Skill
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[50%]">
                      Add required skills for the job
                    </p>
                  </div>

                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <Button
                        className={`py-2 px-4 rounded-none flex items-center justify-center gap-2 ${
                          mode === "formal"
                            ? "bg-primary"
                            : "bg-primary2  hover:bg-primary2/70"
                        }`}
                        onClick={() => addSkill()}
                        type="button"
                      >
                        <FaPlus />
                        <span>Add Skills</span>
                      </Button>
                      <Input
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        placeholder="Start Typing to Search Skills"
                        className="rounded-none bg-transparent border-gray-300  placeholder:text-gray-400 shadow-sm w-full md:w-[60%] lg:w-[40%]"
                      />
                    </div>
                    <div className="flex flex-wrap items-start mt-2 gap-2">
                      {skills?.map((skill, index) => (
                        <div
                          key={skill + index}
                          className="bg-[#f1f1fc]  py-1 px-2 gap-4 flex items-center text-primary font-medium"
                        >
                          <span>{skill}</span>
                          <IoMdClose
                            size={20}
                            className="cursor-pointer"
                            onClick={() =>
                              setSkills(skills.filter((ski) => ski !== skill))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                <div className="flex items-center justify-end">
                  <Button
                    onClick={() => nextStep()}
                    type="button"
                    className={`px-4 py-2 rounded-none ${
                      mode === "formal"
                        ? "bg-primary"
                        : "bg-primary2  hover:bg-primary2/70"
                    }`}
                  >
                    Next Step
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className=""
              >
                {/* header two */}
                <div className="py-2 mt-2 ">
                  <h1 className="font-semibold text-[#25324B]">Details</h1>
                  <p className="font-light ">
                    Add the description of the job, responsibilities, who you
                    are, and nice-to-haves.
                  </p>
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* Job Description */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Job Description
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[50%]">
                      Describe the job position you are trying to fill in
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="jobDescription"
                      rules={{
                        required: "Required",
                      }}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormControl>
                            <Textarea
                              placeholder="Describe the role and responsibilities..."
                              {...field}
                              className="bg-transparent rounded-none border-gray-300 shadow-sm  min-h-[120px] w-full md:w-[70%] lg:w-[60%]"
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* location */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Job Location
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[50%]">
                      Where do you wish your desired employee based in?
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      rules={{ required: "Required" }}
                      name="jobLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Job Location"
                              {...field}
                              className="mt-1 rounded-none bg-transparent border-gray-300 shadow-sm w-full md:w-[70%] lg:w-[50%]"
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* <hr className=" hidden sm:block my-4 border  border-gray-200" />

                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Employment Mode
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[50%]">
                      Specify the type of employment for this role.
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="employmentMode"
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g. Full-time, Part-time, Contract"
                              {...field}
                              className="rounded-none bg-transparent border-gray-300 shadow-sm w-full md:w-[70%] lg:w-[50%]"
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div> */}

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* employment type */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Employment Type
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[60%]">
                      Choose the category that best describes this position.
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="employmentType"
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="hidden md:block text-sm font-medium text-gray-700">
                            Select Employment Type
                          </FormLabel>
                          <FormControl>
                            <Select.Root
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <Select.Trigger
                                className={`flex items-center justify-between h-10 px-3 py-2 mt-1 border border-gray-300 placeholder:text-gray-300 bg-transparent rounded-none shadow-sm text-sm focus:outline-none focus:ring-1 ${
                                  field.value ? "text-black" : "text-gray-400"
                                } w-full md:w-[70%] lg:w-[50%]`}
                              >
                                <Select.Value placeholder="Select employment type" />
                                <Select.Icon>
                                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                                </Select.Icon>
                              </Select.Trigger>
                              <Select.Portal>
                                <Select.Content className="z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
                                  <Select.Viewport className="p-1">
                                    {[
                                      "Graduate Job",
                                      "Internship",
                                      "Co-op",
                                      "On-Campus Internship",
                                      "STEM Internship",
                                      "Unpaid/Volunteer Work",
                                    ].map((type) => (
                                      <Select.Item
                                        key={type}
                                        value={type}
                                        className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                                      >
                                        <Select.ItemText>
                                          {type}
                                        </Select.ItemText>
                                      </Select.Item>
                                    ))}
                                  </Select.Viewport>
                                </Select.Content>
                              </Select.Portal>
                            </Select.Root>
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* time to hire */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Time to Hire
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[60%]">
                      Enter the number of days in which you plan to fill the
                      position.
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="timeToHire"
                      rules={{
                        required: "Required",
                        min: { value: 1, message: "Must be at least 1 day" },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 14"
                              {...field}
                              className="rounded-none bg-transparent border-gray-300 shadow-sm w-full md:w-[70%] lg:w-[50%]"
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* deadline */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Deadline
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[50%]">
                      Specify the time this employment will end if exists
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="deadLine"
                      rules={{
                        required: "Required",
                      }}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Popover.Root>
                              <Popover.Trigger asChild>
                                <button
                                  className="flex items-center justify-between h-10 px-3 border  rounded-none bg-transparent text-sm focus:outline-none w-full md:w-[70%] lg:w-[50%]"
                                  type="button"
                                >
                                  {field.value
                                    ? format(field.value, "PPP")
                                    : "Deadline Date"}
                                  <CalendarIcon className="w-4 h-4 text-gray-600" />
                                </button>
                              </Popover.Trigger>

                              <Popover.Portal>
                                <Popover.Content
                                  align="start"
                                  sideOffset={8}
                                  className="z-50 bg-white p-3 rounded-md shadow-md border"
                                >
                                  <DayPicker
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    captionLayout="dropdown"
                                    fromYear={1900}
                                    toYear={new Date().getFullYear()}
                                  />
                                </Popover.Content>
                              </Popover.Portal>
                            </Popover.Root>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* experience */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Experience
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[50%]">
                      Specify the required years of experience (e.g. 3+ years, 5
                      years).
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      rules={{ required: "Required" }}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g. 3+ years"
                              {...field}
                              className="mt-1 rounded-none bg-transparent border-gray-300 shadow-sm w-full md:w-[70%] lg:w-[50%]"
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* number of opning */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Number of Openings
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[50%]">
                      Specify how many positions are available for this role.
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="numberOfOpenings"
                      rules={{
                        required: "Required",
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g. 5"
                              {...field}
                              type="number"
                              className="rounded-none bg-transparent border-gray-300 shadow-sm w-full md:w-[70%] lg:w-[50%] "
                            />
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Education Background */}
                {/* <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Education Background
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[60%]">
                      Specify the minimum education status of the employee
                    </p>
                  </div>

                  <div className="col-span-3">
                    <div className="flex flex-col-reverse items-start md:flex-row md:items-center gap-2">
                      <Button
                        className={`py-2 px-4 rounded-none  flex items-center justify-center gap-2 ${
                          mode === "formal"
                            ? "bg-primary"
                            : "bg-primary2  hover:bg-primary2/70"
                        }`}
                        onClick={addEducationalBack}
                        type="button"
                      >
                        <FaPlus />
                        <span>Add Educational Backgrounds</span>
                      </Button>
                      <Input
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        placeholder="Educational Background"
                        className="rounded-none bg-transparent border-gray-300  placeholder:text-gray-400 shadow-sm w-full md:w-[70%] lg:w-[40%]"
                      />
                    </div>
                    {showEducationError ? (
                      <span className="text-red-500 text-sm">
                        Add at list one Educational Background{" "}
                      </span>
                    ) : null}
                    <div className="flex flex-wrap items-start mt-2 gap-2">
                      {degrees?.map((degree, index) => (
                        <div
                          key={degree + index}
                          className="bg-[#F8F8FD]  py-1 px-2 gap-4 flex items-center text-primary font-medium"
                        >
                          <span>{degree}</span>
                          <IoMdClose
                            className="cursor-pointer"
                            onClick={() =>
                              setDegrees(degrees.filter((d) => d !== degree))
                            }
                            size={20}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div> */}

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                <div className="my-4 flex items-center justify-end">
                  <Button
                    className={`px-4 py-2 rounded-none ${
                      mode === "formal"
                        ? "bg-primary"
                        : "bg-primary2 hover:bg-primary2/70"
                    }`}
                  >
                    {isLoading || jobEditLoading ? <Spinner /> : "Save"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </FormProvider>
    </div>
  );
}

export default AddJob;

// employmentType
// "Graduat Job",
//   "Internship",
//   "Co-op",
//   "On-Compus Internship",
//   "STEM Internship",
//   "Unpaid/Volunteer Work";
