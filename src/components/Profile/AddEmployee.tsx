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
import { addEmployee } from "@/Api/profile.api";
import { tos } from "@/lib/utils";
import { Button } from "../ui/button";
import { Spinner } from "../ui/Spinner";

function AddEmployee({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      name: "",
      empPosition: "",
    },
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: addEmployee,
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
          <FormField
            control={form.control}
            rules={{
              required: "Employee Name is required",
              minLength: {
                value: 3,
                message: "Employee Name must be at least 3 characters",
              },
            }}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Employee Name</FormLabel>
                <FormControl>
                  <Input placeholder="Employee Name" {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            rules={{
              required: "Role is required",
              minLength: {
                value: 3,
                message: "Role must be at least 3 characters",
              },
            }}
            name="empPosition"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Role" {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center mt-4 justify-end">
            <Button>{isLoading ? <Spinner /> : "Add Employee"}</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default AddEmployee;
