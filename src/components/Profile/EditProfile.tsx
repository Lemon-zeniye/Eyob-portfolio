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
import { addUserProfile, updateUserProfile } from "@/Api/profile.api";
import { Spinner } from "../ui/Spinner";
import { UserProfile } from "@/Types/profile.type";
import { tos } from "@/lib/utils";
import { getAxiosErrorMessage } from "@/Api/axios";
import { useRole } from "@/Context/RoleContext";

type PostFormProps = {
  onSuccess: () => void;
  initialData: UserProfile | undefined;
};

function EditProfile({ initialData, onSuccess }: PostFormProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      position: initialData?.position ?? "",
      location: initialData?.location ?? "",
      bio: initialData?.bio ?? "",
    },
  });
  const { mode } = useRole();

  const { mutate, isLoading } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      onSuccess();
      tos.success("Profile Updated!");
      queryClient.invalidateQueries("userProfile");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err);
      tos.error(message);
    },
  });

  const { mutate: addProfile, isLoading: isAdding } = useMutation({
    mutationFn: addUserProfile,
    onSuccess: () => {
      onSuccess();
      tos.success("Profile Added!");
      queryClient.invalidateQueries("userProfile");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err);
      tos.error(message);
    },
  });

  const onSubmit = (data: any) => {
    if (initialData) {
      mutate(data);
    } else {
      addProfile(data);
    }
  };

  return (
    <div className="w-full">
      <FormProvider {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="position"
            rules={{ required: "Required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Position" />
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
            name="bio"
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

          <Button
            type="submit"
            className={`w-full ${
              mode === "formal"
                ? "bg-primary hover:bg-primary/80"
                : "bg-primary2 hover:bg-primary2/80"
            }`}
          >
            {isLoading || isAdding ? (
              <Spinner />
            ) : initialData ? (
              "Edit Profile"
            ) : (
              "Add Profile"
            )}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

export default EditProfile;
