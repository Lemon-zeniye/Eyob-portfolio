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
import { addEducation } from "@/Api/profile.api";
import { getAxiosErrorMessage } from "@/Api/auth.api";
import { Spinner } from "../ui/Spinner";
import { getDateParts, tos } from "@/lib/utils";

function AddEducation({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      graduationYear: new Date(),
      gpa: undefined,
      currentlyStudying: false,
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: addEducation,
    onSuccess: () => {
      tos.success("Education added Successfully");
      queryClient.invalidateQueries("educations");
      onSuccess();
    },
    onError: (error: any) => {
      const message = getAxiosErrorMessage(error);
      tos.error(message);
    },
  });
  const onSubmit = (data: any) => {
    const graduationYear = getDateParts(data.graduationYear).year;
    const currentlyStudying =
      data?.currentlyStudying === undefined ? false : data.currentlyStudying;
    const payload = { ...data, graduationYear, currentlyStudying };
    mutate({ eduRequest: [payload] });
  };

  return (
    <div className="px-4">
      <FormProvider {...form}>
        <form className="" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            rules={{
              required: "School name is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Only letters and spaces are allowed",
              },
              minLength: {
                value: 3,
                message: "Minimum 3 characters required",
              },
            }}
            name="institution"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input placeholder="School Name" {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="degree"
            rules={{
              required: "Degree is required",
            }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Degree Level</FormLabel>
                <FormControl>
                  <Select.Root
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white text-gray-500 text-sm focus:outline-none">
                      <Select.Value placeholder="Select degree level" />
                      <Select.Icon>
                        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                        <Select.Viewport className="p-1">
                          {["Bachelor", "Master", "PhD", "Other"].map((g) => (
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
            name="fieldOfStudy"
            rules={{
              required: "Field of study is required",
            }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Field of Study</FormLabel>
                <FormControl>
                  <Select.Root
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white text-gray-500 text-sm focus:outline-none">
                      <Select.Value placeholder="Select your field" />
                      <Select.Icon>
                        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                        <Select.Viewport className="p-1">
                          {[
                            "Computer Science",
                            "Engineering",
                            "Business",
                            "Other",
                          ].map((g) => (
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
              required: "GPA is required",
              min: {
                value: 0,
                message: "GPA must be positive",
              },
              //  max: {
              //   value: 4,
              //   message: "GPA must be  positive",
              // }
            }}
            name="gpa"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>GPA</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your GPA (e.g. 3.5)"
                    {...field}
                    type="number"
                    step="0.1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="graduationYear"
            rules={{
              required: "Graduation year is required",
            }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Graduation Date</FormLabel>
                <FormControl>
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button
                        className="flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white text-gray-500 text-sm focus:outline-none"
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Select graduation date"}
                        <CalendarIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </Popover.Trigger>

                    <Popover.Portal>
                      <Popover.Content
                        align="start"
                        sideOffset={8}
                        className="z-[100] bg-white p-3 rounded-md shadow-md border"
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
            name="currentlyStudying"
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
                      I currently study here
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end my-2 w-full">
            <Button>{isLoading ? <Spinner /> : "Add Education"}</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default AddEducation;
