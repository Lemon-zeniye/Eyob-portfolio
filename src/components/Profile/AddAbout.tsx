import { FormProvider, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "react-query";
import { addAbout, updateCompanyAbout } from "@/Api/profile.api";
import { tos } from "@/lib/utils";
import { Button } from "../ui/button";
import { Spinner } from "../ui/Spinner";
import { Textarea } from "../ui/textarea";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { CompanyAbout } from "@/Types/profile.type";
import { getAxiosErrorMessage } from "@/Api/axios";

function AddAbout({
  initialData,
  onSuccess,
}: {
  initialData: CompanyAbout | undefined;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      history: initialData?.history ?? "",
      website: initialData?.website ?? [],
      socialMedia: initialData?.socialMedia ?? [],
    },
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: addAbout,
    onSuccess: () => {
      tos.success("Success");
      queryClient.invalidateQueries("companyAbout");
      onSuccess();
    },
    onError: (err: any) => {
      const message = getAxiosErrorMessage(err);
      tos.error(message);
    },
  });

  const { mutate: updateAbout, isLoading: updateIsLoading } = useMutation({
    mutationFn: updateCompanyAbout,
    onSuccess: () => {
      tos.success("Success");
      queryClient.invalidateQueries("companyAbout");
      onSuccess();
    },
    onError: (err: any) => {
      const message = getAxiosErrorMessage(err);
      tos.error(message);
    },
  });
  const onSubmit = (data: any) => {
    if (initialData) {
      updateAbout(data);
    } else {
      mutate(data);
    }
  };
  return (
    <div>
      <FormProvider {...form}>
        <form className="" onSubmit={form.handleSubmit(onSubmit)}>
          {/* History field */}
          <FormField
            control={form.control}
            name="history"
            rules={{ required: "History is required" }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>History</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter history" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full items-end gap-2">
            <div className="flex-1 flex-shrink-0">
              {form.watch("website")?.map((_, index) => (
                <div key={index} className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`website.${index}`}
                    rules={{
                      required: "Required",
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/,
                        message: "Please enter a valid URL",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{index === 0 ? "Websites" : ""}</FormLabel>
                        <FormControl>
                          <Input placeholder={`Website`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("website").length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const websites = [...form.watch("website")];
                        websites.splice(index, 1);
                        form.setValue("website", websites);
                      }}
                    >
                      <IoMdRemoveCircle className="text-red-500" size={20} />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="mt-2 flex-none"
              onClick={() =>
                form.setValue("website", [...form.watch("website"), ""])
              }
            >
              <IoMdAddCircle size={20} className="text-primary" />
            </Button>
          </div>

          {/* Social Media fields */}
          <div className="flex w-full items-end gap-2">
            <div className="flex-1 flex-shrink-0">
              {form.watch("socialMedia")?.map((_, index) => (
                <div key={index} className="flex items-end gap-2">
                  <FormField
                    key={index}
                    control={form.control}
                    name={`socialMedia.${index}`}
                    rules={{
                      required: "Required",
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/,
                        message: "Please enter a valid URL",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          {index === 0 ? "Social Media" : ""}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder={`Social Media Link`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("socialMedia").length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const socialMedias = [...form.watch("socialMedia")];
                        socialMedias.splice(index, 1);
                        form.setValue("socialMedia", socialMedias);
                      }}
                    >
                      <IoMdRemoveCircle className="text-red-500" size={20} />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Add social media field button */}
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={() =>
                form.setValue("socialMedia", [...form.watch("socialMedia"), ""])
              }
            >
              <IoMdAddCircle size={20} className="text-primary" />
            </Button>
          </div>

          <div className="flex items-center mt-4 justify-end">
            <Button type="submit">
              {isLoading || updateIsLoading ? <Spinner /> : "Submit"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default AddAbout;
