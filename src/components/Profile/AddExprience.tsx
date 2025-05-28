import { FormProvider, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { CalendarIcon } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "react-query";
import { addExperience, updateUserExperience } from "@/Api/profile.api";
import { Spinner } from "../ui/Spinner";
import { tos } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { UserExperience } from "../Types";

function AddExprience({
  onSuccess,
  initialData,
}: {
  onSuccess: () => void;
  initialData: UserExperience | undefined;
}) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      entity: initialData?.entity ?? "",
      jobTitle: initialData?.jobTitle ?? "",
      employmentType: initialData?.employmentType ?? "",
      location: initialData?.location ?? "",
      locationType: initialData?.locationType ?? "",
      startDate: initialData?.startDate
        ? new Date(initialData?.startDate)
        : undefined,
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      expDescription: initialData?.expDescription ?? "",
      workingAt: initialData?.workingAt ?? false,
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: addExperience,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries("experiences");
      tos.success("Success");
    },
  });
  const { mutate: update, isLoading: isUpdating } = useMutation({
    mutationFn: updateUserExperience,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      tos.success("Success");
    },
  });
  const onSubmit = (data: any) => {
    if (initialData) {
      update({ id: initialData._id, payload: data });
    } else {
      mutate({ expRequest: [data] });
    }
  };
  return (
    <div className="p-2 md:p-0">
      <FormProvider {...form}>
        <form className="" onSubmit={form.handleSubmit(onSubmit)}>
          {/* <FormField
            control={form.control}
            name="jobTitle"
            rules={{
              required: "Required",
            }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Select.Root
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 border  rounded-md bg-white text-gray-500 text-sm focus:outline-none">
                      <Select.Value placeholder="Position" />
                      <Select.Icon>
                        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                        <Select.Viewport className="p-1">
                          {["Developer", "UX/UI", "Manager"].map((g) => (
                            <Select.Item
                              key={g}
                              value={g}
                              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded"
                            >
                              <Select.ItemText>{g}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            rules={{
              required: "Position",

              minLength: {
                value: 3,
                message: "Position  must be at least 3 characters",
              },
            }}
            name="jobTitle"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Position" {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            rules={{
              required: "Company Name is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Company Name can only contain letters and spaces",
              },
              minLength: {
                value: 3,
                message: "Company Name must be at least 3 characters",
              },
            }}
            name="entity"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Company Name"
                    {...field}
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employmentType"
            rules={{
              required: "Required",
            }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Employment Type</FormLabel>
                <FormControl>
                  <Select.Root
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 border  rounded-md bg-white text-gray-500 text-sm focus:outline-none">
                      <Select.Value placeholder="Employment Type" />
                      <Select.Icon>
                        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                        <Select.Viewport className="p-1">
                          {["Full-time", "Part-time", "Contract"].map((g) => (
                            <Select.Item
                              key={g}
                              value={g}
                              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded"
                            >
                              <Select.ItemText>{g}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            rules={{
              required: "Location is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Location can only contain letters and spaces",
              },
              minLength: {
                value: 3,
                message: "Location must be at least 3 characters",
              },
            }}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Location"
                    {...field}
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="locationType"
            rules={{
              required: "Required",
            }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Location Type</FormLabel>
                <FormControl>
                  <Select.Root
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 border  rounded-md bg-white text-gray-500 text-sm focus:outline-none">
                      <Select.Value placeholder="Location Type" />
                      <Select.Icon>
                        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                        <Select.Viewport className="p-1">
                          {["On-site", "Remote", "Hybrid"].map((g) => (
                            <Select.Item
                              key={g}
                              value={g}
                              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded"
                            >
                              <Select.ItemText>{g}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="startDate"
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

            <FormField
              control={form.control}
              name="endDate"
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
                            : "End Date"}
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

          <FormField
            control={form.control}
            name="expDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workingAt"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex items-center justify-start my-4 gap-2">
                    <Checkbox
                      id="currently-studying"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label
                      htmlFor="currently-studying"
                      className="text-lg leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I currently work here
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            <Button>
              {isLoading || isUpdating ? (
                <Spinner />
              ) : initialData ? (
                "Edit Experience"
              ) : (
                "Add Experience"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default AddExprience;
