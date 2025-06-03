import { FormProvider, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";
// import * as Select from "@radix-ui/react-select";
// import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addUserSkill,
  fetchSkillCategories,
  updateUserSkill,
} from "@/Api/profile.api";
import { getAxiosErrorMessage } from "@/Api/axios";
import { Spinner } from "../ui/Spinner";
import { Textarea } from "../ui/textarea";
import { tos } from "@/lib/utils";
import { Input } from "../ui/input";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "lucide-react";
import { UserSkill } from "@/Types/profile.type";

function AddSkill({
  initialData,
  onSuccess,
}: {
  initialData: UserSkill | undefined;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      skill: initialData?.skill ?? "",
      category: initialData?.category ?? "",
      company: initialData?.company ?? "",
      skillDescription: initialData?.skillDescription ?? "",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: addUserSkill,
    onSuccess: () => {
      tos.success("Skill added Successfully");
      queryClient.invalidateQueries("skills");
      onSuccess();
    },
    onError: (error: any) => {
      const message = getAxiosErrorMessage(error);
      tos.error(message);
    },
  });

  const { mutate: updapteSkill, isLoading: isUpdateLoading } = useMutation({
    mutationFn: updateUserSkill,
    onSuccess: () => {
      tos.success("Skill updated Successfully");
      queryClient.invalidateQueries("skills");
      onSuccess();
    },
    onError: (error: any) => {
      const message = getAxiosErrorMessage(error);
      tos.error(message);
    },
  });

  // const {} = useQuery({
  //   queryKey: ["skills"],
  //   queryFn: getSkills,
  // });

  const { data: categories } = useQuery({
    queryKey: ["skillsCategory"],
    queryFn: fetchSkillCategories,
  });

  const onSubmit = (data: any) => {
    if (initialData) {
      updapteSkill({ id: initialData._id, payload: data });
    } else {
      mutate(data);
    }
  };
  return (
    <div className="p-2 md:p-0">
      <FormProvider {...form}>
        <form className="" onSubmit={form.handleSubmit(onSubmit)}>
          {/* <FormField
            control={form.control}
            name="skill"
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
                      <Select.Value placeholder="Skill Name" />
                      <Select.Icon>
                        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                        <Select.Viewport className="p-1">
                          {skills &&
                            skills?.data.map((g) => (
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
          /> */}

          <FormField
            control={form.control}
            rules={{
              required: "Skill Name is required",
              minLength: {
                value: 2,
                message: "Skill Name must be at least 3 characters",
              },
            }}
            name="skill"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Skill Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Skill Name"
                    {...field}
                    type="text"
                  />
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
                    <Select.Trigger
                      className={`flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white  text-sm focus:outline-none ${
                        field.value ? "text-black" : "text-gray-500"
                      }`}
                    >
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
                                value={g.name}
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
            rules={{
              required: "Company is required",
            }}
            name="company"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Company" {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skillDescription"
            rules={{
              required: "Required",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Details" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="my-4 flex items-center justify-end">
            <Button>
              {isLoading || isUpdateLoading ? (
                <Spinner />
              ) : initialData ? (
                "Edit Skill"
              ) : (
                "Add Skill"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default AddSkill;
