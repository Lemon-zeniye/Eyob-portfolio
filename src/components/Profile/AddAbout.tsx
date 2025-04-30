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
import { addAbout } from "@/Api/profile.api";
import { tos } from "@/lib/utils";
import { Button } from "../ui/button";
import { Spinner } from "../ui/Spinner";
import { Textarea } from "../ui/textarea";
import { IoMdAddCircle } from "react-icons/io";

function AddAbout({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      history: "",
      website: [""],
      socialMedia: [""],
    },
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: addAbout,
    onSuccess: () => {
      tos.success("Success");
      queryClient.invalidateQueries("employees");
      onSuccess();
    },
  });
  const onSubmit = (data: any) => {
    mutate(data);
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
                <FormField
                  key={index}
                  control={form.control}
                  name={`website.${index}`}
                  rules={{
                    pattern: {
                      value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/,
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
                <FormField
                  key={index}
                  control={form.control}
                  name={`socialMedia.${index}`}
                  rules={{
                    pattern: {
                      value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/,
                      message: "Please enter a valid URL",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{index === 0 ? "Social Media" : ""}</FormLabel>
                      <FormControl>
                        <Input placeholder={`Social Media Link`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
            <Button type="submit">{isLoading ? <Spinner /> : "Submit"}</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default AddAbout;
