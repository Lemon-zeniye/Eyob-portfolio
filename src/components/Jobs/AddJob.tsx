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
import { MultiSelectInput } from "../ui/MultiSelectInput";
import { Button } from "../ui/button";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useMutation } from "react-query";
import { addJob } from "@/Api/job.api";
import { tos } from "@/lib/utils";
import { Spinner } from "../ui/Spinner";
import { getAxiosErrorMessage } from "@/Api/axios";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

function AddJob() {
  const [isRange, setIsRange] = useState(false);
  const form = useForm({
    defaultValues: {
      jobTitle: "",
      jobType: "",
      jobDescription: "",
      deadLine: new Date(),
      jobLocation: "",
      degree: "",
      experience: "",
      locationType: "",
      skills: [],
      salaryType: "",
      salary: undefined,
      range: {
        minimum: undefined,
        maximum: undefined,
      },
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: addJob,
    onSuccess: () => {
      tos.success("Job Added Successfully!");
      setIsRange(false);
    },
    onError: (err) => {
      const mes = getAxiosErrorMessage(err);
      tos.error(mes);
    },
  });
  const onSubmit = (data: any) => {
    if (!isRange) {
      const { range, ...result } = data;
      mutate(result);
    } else {
      const payload = { ...data, range: [{ ...data.range }] };
      mutate(payload);
    }
  };

  return (
    <div className="mb-10">
      <h1 className="text-xl font-semibold my-4">Add Job</h1>
      <div className="grid grid-cols-4">
        <div className="col-span-3">
          <FormProvider {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <FormField
                  control={form.control}
                  rules={{ required: "Required" }}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Job Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Senior Product Designer"
                          {...field}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm "
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-sm text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Job Description */}
                <FormField
                  control={form.control}
                  name="jobDescription"
                  rules={{
                    required: "Required",
                  }}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Job Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the role and responsibilities..."
                          {...field}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm  min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-sm text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Degree */}
                <FormField
                  control={form.control}
                  name="degree"
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Degree
                      </FormLabel>
                      <FormControl>
                        <Select.Root
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 py-2 mt-1 border border-gray-300 rounded-md bg-white shadow-sm text-gray-700 text-sm focus:outline-none focus:ring-1 ">
                            <Select.Value placeholder="Select degree" />
                            <Select.Icon>
                              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
                              <Select.Viewport className="p-1">
                                {["Bachelor's", "Master's", "Ph.D"].map((g) => (
                                  <Select.Item
                                    key={g}
                                    value={g}
                                    className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                                  >
                                    <Select.ItemText>{g}</Select.ItemText>
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

                {/* Experience */}
                <FormField
                  control={form.control}
                  rules={{ required: "Required" }}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Experience (years)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 5"
                          {...field}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm "
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-sm text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                <FormField
                  control={form.control}
                  name="skills"
                  rules={{ required: "Please select at least one skill" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Skills
                      </FormLabel>
                      <FormControl>
                        <MultiSelectInput
                          options={[
                            "JS",
                            "Next.JS",
                            "React.JS",
                            "Node.JS",
                            "Nest.JS",
                            "Three.JS",
                          ]}
                          placeholder="Select required skills"
                          value={field.value}
                          onChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-sm text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  rules={{ required: "Required" }}
                  name="jobLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. New York, NY"
                          {...field}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm "
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-sm text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Type */}
                <FormField
                  control={form.control}
                  name="jobType"
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Job Type
                      </FormLabel>
                      <FormControl>
                        <Select.Root
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 py-2 mt-1 border border-gray-300 rounded-md bg-white shadow-sm text-gray-700 text-sm focus:outline-none focus:ring-1 ">
                            <Select.Value placeholder="Select job type" />
                            <Select.Icon>
                              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
                              <Select.Viewport className="p-1">
                                {["Full-time", "Part-time", "Contract"].map(
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

                {/* Workplace */}
                <FormField
                  control={form.control}
                  name="locationType"
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Workplace
                      </FormLabel>
                      <FormControl>
                        <Select.Root
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 py-2 mt-1 border border-gray-300 rounded-md bg-white shadow-sm text-gray-700 text-sm focus:outline-none focus:ring-1 ">
                            <Select.Value placeholder="Select workplace" />
                            <Select.Icon>
                              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
                              <Select.Viewport className="p-1">
                                {["On-site", "Remote", "Hybrid"].map((g) => (
                                  <Select.Item
                                    key={g}
                                    value={g}
                                    className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                                  >
                                    <Select.ItemText>{g}</Select.ItemText>
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

                <FormField
                  control={form.control}
                  name="deadLine"
                  rules={{
                    required: "Required",
                  }}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Popover.Root>
                          <Popover.Trigger asChild>
                            <button
                              className="flex items-center justify-between w-full h-10 px-3 border  rounded-md bg-white text-gray-500 text-sm focus:outline-none"
                              type="button"
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Start Date"}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Salary */}
                <FormField
                  control={form.control}
                  rules={{ required: "Required" }}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Salary
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 80000"
                          {...field}
                          type="number"
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm "
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-sm text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Salary Type */}
                <FormField
                  control={form.control}
                  name="salaryType"
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Salary Type
                      </FormLabel>
                      <FormControl>
                        <Select.Root
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 py-2 mt-1 border border-gray-300 rounded-md bg-white shadow-sm text-gray-700 text-sm focus:outline-none focus:ring-1 ">
                            <Select.Value placeholder="Select salary type" />
                            <Select.Icon>
                              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
                              <Select.Viewport className="p-1">
                                {["Annual", "Monthly", "Hourly"].map((g) => (
                                  <Select.Item
                                    key={g}
                                    value={g}
                                    className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                                  >
                                    <Select.ItemText>{g}</Select.ItemText>
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

              <div className="flex items-center justify-start my-4 gap-2">
                <Checkbox
                  id="currently-studying"
                  checked={isRange}
                  onCheckedChange={(val) => setIsRange(val as boolean)}
                />
                <label
                  htmlFor="currently-studying"
                  className="text-lg leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Is Range
                </label>
              </div>

              {isRange && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Salary Range - Min */}
                  <FormField
                    control={form.control}
                    rules={{ required: "Required" }}
                    name="range.minimum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700">
                          Minimum Salary
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 50000"
                            {...field}
                            type="number"
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm "
                          />
                        </FormControl>
                        <FormMessage className="mt-1 text-sm text-red-600" />
                      </FormItem>
                    )}
                  />

                  {/* Salary Range - Max */}
                  <FormField
                    control={form.control}
                    rules={{ required: "Required" }}
                    name="range.maximum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700">
                          Maximum Salary
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 100000"
                            {...field}
                            type="number"
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm "
                          />
                        </FormControl>
                        <FormMessage className="mt-1 text-sm text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div className="my-4 flex items-center justify-end">
                <Button className="">
                  {isLoading ? <Spinner /> : "Save"}{" "}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
        <div className="col-span-1"></div>
      </div>
    </div>
  );
}

export default AddJob;
