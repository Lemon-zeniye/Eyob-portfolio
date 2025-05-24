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

function AddJob() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skill, setSkill] = useState("");
  const [step, setStep] = useState(true);
  const [degree, setDegree] = useState("");
  const [degrees, setDegrees] = useState<string[]>([]);
  const [showEducationError, setShowEducationError] = useState(false);
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
      setDegrees([jobDetail?.data.degree]);
    }
  }, [jobDetail]);

  const form = useForm({
    mode: "onChange",
    defaultValues: {
      // step 1
      jobTitle: jobDetail?.data.jobTitle ?? "",
      jobType: jobDetail?.data.jobType ?? "",
      salaryType: jobDetail?.data.salaryType ?? "",
      range: {
        minimum: jobDetail?.data?.range[0]?.minimum ?? "",
        maximum: jobDetail?.data?.range[0]?.maximum ?? "",
      },
      salary: jobDetail?.data.salary ?? 0,
      skills: [],

      // step 2
      deadLine: jobDetail?.data.deadLine
        ? new Date(jobDetail?.data.deadLine)
        : new Date(),
      jobLocation: jobDetail?.data.jobLocation ?? "",
      experience: jobDetail?.data.experience ?? "",
      locationType: jobDetail?.data.locationType ?? "",
      jobDescription: jobDetail?.data.jobDescription ?? "",
      // numberOfOpenings: jobDetail?.data?.numberOfOpenings ?? "",
    },
  });

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

  const addEducationalBack = () => {
    if (!degree) {
      return;
    }
    setShowEducationError(false);

    setDegrees((pre) => [...pre, degree]);
    setDegree("");
  };

  const onSubmit = (data: any) => {
    if (degrees?.length === 0) {
      setShowEducationError(true);
      return;
    }
    setShowEducationError(false);

    const payload = {
      ...data,
      degree: degrees[0],
      skills: skills,
      salary: data.range.minimum,
      range: [{ ...data.range }],
    };
    if (id) {
      updateJobMut({ id, payload });
    } else {
      mutate(payload);
    }
  };

  const nextStep = async () => {
    const isStep1Valid = await form.trigger([
      "jobTitle",
      "jobType",
      "salaryType",
      "range.minimum",
      "range.maximum",
      "locationType",
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
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
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
                      name="jobType"
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="space-y-2">
                              {[
                                "Full-time",
                                "Part-time",
                                "Internship",
                                "Contract",
                              ].map((option) => (
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
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

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
                      rules={{ required: "Required" }}
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

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* Salary */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Salary
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[60%]">
                      Select the range in which the job salary will fall in.
                    </p>
                    <p className="hidden sm:block font-light w-full lg:w-[60%]">
                      *You can leave one field blank for fixed salaries
                    </p>
                  </div>

                  <div className="col-span-3">
                    <div className="flex items-center gap-4 sm:gap-10">
                      {/* Salary Range - Min */}
                      <FormField
                        control={form.control}
                        rules={{
                          required: "Required",
                          min: {
                            value: 0,
                            message: "Minimum must be 0 or more",
                          },
                        }}
                        name="range.minimum"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="e.g. 50000"
                                {...field}
                                type="number"
                                className="w-full md:w-fit rounded-none bg-transparent border-gray-300 shadow-sm "
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
                          required: "Required",
                          validate: (value) => {
                            const min = form.watch("range.minimum") ?? 0;
                            return (
                              value >= min ||
                              "Maximum must be greater than or equal to minimum"
                            );
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="e.g. 100000"
                                {...field}
                                type="number"
                                className="w-full md:w-fit rounded-none bg-transparent border-gray-300 shadow-sm "
                              />
                            </FormControl>
                            <FormMessage className="mt-1 text-sm text-red-600" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <hr className=" hidden sm:block my-4 border  border-gray-200" />

                {/* category */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Workplace
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[60%]">
                      Work location type
                    </p>
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="locationType"
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
                                    {["On-site", "Remote", "Hybrid"].map(
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

                {/* year or expriance */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
                  <div className="col-span-1">
                    <h1 className="font-semibold space-y-1 text-[#25324B]">
                      Experience
                    </h1>
                    <p className="hidden sm:block font-light w-full lg:w-[50%]">
                      Specify the amount of years of experience of the employee
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
                              placeholder="2 Years"
                              {...field}
                              type="number"
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
                {/* <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
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
                </div> */}

                {/* Education Background */}
                <div className="grid grid-cols-1 md:grid-cols-4 my-2 gap-6">
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
                </div>

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
