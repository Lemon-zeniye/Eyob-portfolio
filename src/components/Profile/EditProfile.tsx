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
import { useMutation } from "react-query";
import { createPost } from "@/Api/profile.api";
import { Spinner } from "../ui/Spinner";

type PostFormProps = {
  onSuccess: () => void;
};

function EditProfile({ onSuccess }: PostFormProps) {
  const form = useForm({
    defaultValues: {
      position: "",
      location: "",
      bio: "",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      onSuccess();
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

          <Button type="submit" className="w-full">
            {isLoading ? <Spinner /> : "Add Profile"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

export default EditProfile;
