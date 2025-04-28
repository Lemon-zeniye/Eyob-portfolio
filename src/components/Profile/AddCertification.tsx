import { FormProvider, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import "react-day-picker/dist/style.css";
import { Button } from "../ui/button";
import { useMutation } from "react-query";
import { addCertificate } from "@/Api/profile.api";
import { getAxiosErrorMessage } from "@/Api/axios";
import { Spinner } from "../ui/Spinner";
import { useState } from "react";
import { CalendarIcon, FileText } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { tos } from "@/lib/utils";

function AddCertification({ onSuccess }: { onSuccess: () => void }) {
  const form = useForm({
    defaultValues: {
      certificate: "",
      certificateName: "",
      certifiedBy: "",
      certificationNo: "",
      expireDate: new Date(),
    },
  });

  const certificate = form.watch("certificate");
  const [logoFile, setLogoFile] = useState<File | undefined>(undefined);
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      form.setValue("certificate", fileURL);
      setLogoFile(file);
    }
  };
  const [isExpired, setIsExpired] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: addCertificate,
    onSuccess: () => {
      tos.success("Success");
      onSuccess();
      //   queryClient.invalidateQueries("organization");
    },
    onError: (error: any) => {
      const message = getAxiosErrorMessage(error);
      tos.error(message);
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();

    formData.append("certificateName", data.certificateName);
    formData.append("certifiedBy", data.certifiedBy);
    formData.append("certificateNumber", data.certificationNo);
    formData.append("expireDate", data.expireDate);

    if (logoFile instanceof File) {
      formData.append("certificateDoc", logoFile);
    }

    mutate(formData);
  };

  return (
    <div>
      <FormProvider {...form}>
        <form className="p-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormItem>
            <FormControl>
              <div className="flex flex-col gap-2 items-center justify-center">
                <label htmlFor="certificate-file">
                  <div className="w-42 h-42 rounded-xl border border-dashed flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100 hover:bg-gray-200 transition">
                    {certificate ? (
                      <div className="p-4 text-center">
                        <FileText className="w-24 h-12 mx-auto" />
                        <span className="text-green-500 text-sm">
                          PDF Uploaded
                        </span>
                      </div>
                    ) : (
                      <div className="h-14 w-44 flex items-center justify-center rounded-xl bg-gray-50  border-gray-400 border-dashed">
                        <span className="text-gray-500 text-sm">
                          Upload Certificate PDF
                        </span>
                      </div>
                    )}
                  </div>
                </label>
                <input
                  id="certificate-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                {/* <FormLabel>Certificate Pdf</FormLabel> */}
              </div>
            </FormControl>
          </FormItem>
          <FormField
            control={form.control}
            name="certificateName"
            rules={{ required: "Required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Certificate Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certifiedBy"
            rules={{ required: "Required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certified By</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Certified By" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificationNo"
            rules={{ required: "Required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certification Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Certification Number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-start my-4 gap-2">
            <Checkbox
              id="currently-studying"
              checked={isExpired}
              onCheckedChange={(val) => setIsExpired(val as boolean)}
            />
            <label
              htmlFor="currently-studying"
              className="text-lg leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is Expired
            </label>
          </div>

          {isExpired ? (
            <FormField
              control={form.control}
              name="expireDate"
              rules={{
                required: "Required",
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
          ) : null}

          <div className="my-4 flex items-center justify-end">
            <Button>{isLoading ? <Spinner /> : "Add Certification"}</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default AddCertification;
