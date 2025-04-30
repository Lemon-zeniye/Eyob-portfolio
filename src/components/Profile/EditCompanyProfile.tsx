import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "react-query";
import { addCompanyProfile, updateCompanyProfile } from "@/Api/profile.api";
import { Spinner } from "../ui/Spinner";
import { CompanyProfile } from "@/Types/profile.type";
import { tos } from "@/lib/utils";
import { getAxiosErrorMessage } from "@/Api/axios";

type PostFormProps = {
  onSuccess: () => void;
  initialValue: CompanyProfile | undefined;
};

function EditCompanyProfile({ initialValue, onSuccess }: PostFormProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      industry: initialValue?.industry ?? "",
      location: initialValue?.location ?? "",
      companyBio: initialValue?.companyBio ?? "",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => {
      if (initialValue) {
        return updateCompanyProfile(data);
      } else {
        return addCompanyProfile(data);
      }
    },
    onSuccess: () => {
      onSuccess();
      tos.success("Success");
      queryClient.invalidateQueries("companyProfile");
    },
    onError: (err: any) => {
      const msg = getAxiosErrorMessage(err);
      tos.error(msg);
    },
  });

  const onSubmit = (data: any) => {
    mutate(data);
  };

  return (
    <div className="w-full">
      <FormProvider {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="industry"
            rules={{ required: "Required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Industry" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            rules={{ required: "Required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyBio"
            rules={{ required: "Post content is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write your bio..."
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {isLoading ? (
              <Spinner />
            ) : initialValue ? (
              "Update Profile"
            ) : (
              "Add Profile"
            )}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

export default EditCompanyProfile;
