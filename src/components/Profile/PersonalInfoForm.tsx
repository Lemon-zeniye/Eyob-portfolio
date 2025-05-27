import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "react-query";
import { addPersonalInfo, updatePersonalInfo } from "@/Api/profile.api";
import { Spinner } from "../ui/Spinner";
import { tos } from "@/lib/utils";
import { getAxiosErrorMessage } from "@/Api/axios";
import * as Select from "@radix-ui/react-select";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { PersonalInfo } from "@/Types/profile.type";
import { useRole } from "@/Context/RoleContext";

type PersonalInfoFormProps = {
  onSuccess: () => void;
  initialData: PersonalInfo | undefined;
};

function PersonalInfoForm({ initialData, onSuccess }: PersonalInfoFormProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      dateOfBirth: initialData?.dateOfBirth
        ? new Date(initialData.dateOfBirth)
        : new Date(),
      gender: initialData?.gender ?? "",
      phoneNumber: initialData?.phoneNumber ?? "",
      country: initialData?.country ?? "",
      state: initialData?.state ?? "",
      city: initialData?.city ?? "",
      experience: initialData?.experience ?? "",
    },
  });

  const { mode } = useRole();

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: any) =>
      initialData?._id
        ? updatePersonalInfo(initialData._id, data)
        : addPersonalInfo(data),
    onSuccess: () => {
      onSuccess();
      tos.success(
        initialData ? "Personal info updated!" : "Personal info added!"
      );
      queryClient.invalidateQueries("personalInfo");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err);
      tos.error(message);
    },
  });

  const onSubmit = (data: any) => {
    mutate(data);
  };

  return (
    <div className="w-full">
      <FormProvider {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dateOfBirth"
              rules={{
                required: "Required",
              }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Date of Birth</FormLabel>

                  <FormControl>
                    <Popover.Root>
                      <Popover.Trigger asChild>
                        <button
                          className="flex items-center justify-between h-10 px-3 border  rounded-none bg-transparent text-sm focus:outline-none w-full "
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

            <FormField
              control={form.control}
              name="gender"
              rules={{
                required: "Required",
              }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select.Root
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <Select.Trigger
                        className={`flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white ${
                          field.value ? "text-black" : "text-gray-500 "
                        } text-sm focus:outline-none`}
                      >
                        <Select.Value placeholder="Select Gender" />
                        <Select.Icon>
                          <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                        </Select.Icon>
                      </Select.Trigger>

                      <Select.Portal>
                        <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                          <Select.Viewport className="p-1">
                            {[
                              { label: "Male", value: "male" },
                              { label: "Female", value: "female" },
                            ].map((g) => (
                              <Select.Item
                                key={g.value}
                                value={g.value}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded"
                              >
                                <Select.ItemText>{g.label}</Select.ItemText>
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
              name="phoneNumber"
              rules={{
                required: "Required",
                minLength: {
                  value: 10,
                  message: "Minimum length is 10 characters",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="+1234567890" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              rules={{
                required: "Required",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Country" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              rules={{
                required: "Required",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="State" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              rules={{
                required: "Required",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="City" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="experience"
            rules={{
              required: "Required",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., 5 years in software development"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={`w-full ${
              mode === "formal"
                ? "bg-primary hover:bg-primary/80"
                : "bg-primary2 hover:bg-primary2/80"
            }`}
          >
            {isLoading ? <Spinner /> : initialData ? "Update Info" : "Add Info"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

export default PersonalInfoForm;
