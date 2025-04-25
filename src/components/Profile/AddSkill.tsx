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
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addSkill, getJobCategory } from "@/Api/profile.api";
import { getAxiosErrorMessage } from "@/Api/axios";
import { Spinner } from "../ui/Spinner";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

function AddSkill({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      name: "",
      category: "",
      company: "",
      details: "",
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["jobCategories"],
    queryFn: getJobCategory,
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: addSkill,
    onSuccess: () => {
      toast.success("Education added Successfully");
      queryClient.invalidateQueries("skills");
      onSuccess();
    },
    onError: (error: any) => {
      const message = getAxiosErrorMessage(error);
      toast.error(message);
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      name: data.name,
      category: data.category,
    };

    mutate(payload);
  };
  return (
    <div>
      <FormProvider {...form}>
        <form className="" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            rules={{
              required: "Required",
            }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Skill Name</FormLabel>
                <FormControl>
                  <Select.Root
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white text-gray-500 text-sm focus:outline-none">
                      <Select.Value placeholder="Employment Type" />
                      <Select.Icon>
                        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                        <Select.Viewport className="p-1">
                          {["Python", "Java", "JavaScript"].map((g) => (
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
            name="category"
            rules={{
              required: "Required",
            }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
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
                          {categories &&
                            categories?.data.map((g) => (
                              <Select.Item
                                key={g._id}
                                value={g._id}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded"
                              >
                                <Select.ItemText>{g.name}</Select.ItemText>
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
            name="company"
            rules={{
              required: "Required",
            }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Select.Root
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white text-gray-500 text-sm focus:outline-none">
                      <Select.Value placeholder="Location Type" />
                      <Select.Icon>
                        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                        <Select.Viewport className="p-1">
                          {["Company A", "Comapny B"].map((g) => (
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
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Details</FormLabel>
                <FormControl>
                  <Textarea
                    className="text-gray-500"
                    placeholder="Enter Details"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="my-4 flex items-center justify-end">
            <Button>{isLoading ? <Spinner /> : "Add Skill"}</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default AddSkill;
