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
import "react-day-picker/dist/style.css";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "react-query";
import { addUserOrganization } from "@/Api/profile.api";
import { getAxiosErrorMessage } from "@/Api/axios";
import { Spinner } from "../ui/Spinner";
import { useState } from "react";
import { toast } from "sonner";

function AddOrganization({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      organizationLogo: "",
      organizationName: "",
      email: "",
      organizationType: "",
    },
  });

  const organizationLogo = form.watch("organizationLogo");
  const [logoFile, setLogoFile] = useState<File | undefined>(undefined);
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      form.setValue("organizationLogo", fileURL);
      setLogoFile(file);
    }
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: addUserOrganization,
    onSuccess: () => {
      toast.success("Organization added Successfully");

      onSuccess();
      queryClient.invalidateQueries("organization");
    },
    onError: (error: any) => {
      const message = getAxiosErrorMessage(error);
      toast.error(message);
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();

    formData.append("organizationName", data.organizationName);
    formData.append("email", data.email);
    formData.append("organizationType", data.organizationType);

    if (logoFile instanceof File) {
      formData.append("organizationLogo", logoFile);
    }

    mutate(formData);
  };

  return (
    <div>
      <FormProvider {...form}>
        <form className="" onSubmit={form.handleSubmit(onSubmit)}>
          <FormItem>
            <FormControl>
              <div className="flex flex-col gap-2 items-center justify-center">
                <label htmlFor="logo-upload">
                  <div className="w-32 h-32 rounded-full border border-dashed flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100 hover:bg-gray-200 transition">
                    {organizationLogo ? (
                      <img
                        src={organizationLogo}
                        alt="Organization Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">Upload Logo</span>
                    )}
                  </div>
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <FormLabel>Organization Logo</FormLabel>
              </div>
            </FormControl>
          </FormItem>
          <FormField
            control={form.control}
            name="organizationName"
            rules={{ required: "Required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Organization Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organizationType"
            rules={{
              required: "Required",
            }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Organization Type</FormLabel>
                <FormControl>
                  <Select.Root
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white text-gray-500 text-sm focus:outline-none">
                      <Select.Value placeholder="Select Category" />
                      <Select.Icon>
                        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                        <Select.Viewport className="p-1">
                          {[
                            "Fraternity",
                            "Sorority",
                            "Club",
                            "Non-Profit",
                            "Others",
                          ].map((org) => (
                            <Select.Item
                              key={org}
                              value={org}
                              className="px-3 py-2 text-sm text-orgray-700 hover:bg-gray-100 cursor-pointer rounded"
                            >
                              <Select.ItemText>{org}</Select.ItemText>
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
            name="email"
            rules={{ required: "Required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Organization Email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="my-4 flex items-center justify-end">
            <Button>{isLoading ? <Spinner /> : "Add Organization"}</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default AddOrganization;
