import { FormProvider, useForm } from "react-hook-form";
import { Separator } from "../ui/separator";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import goggle from "../../assets/icons8-google-48.png";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useMutation } from "react-query";
import { getAxiosErrorMessage, signup } from "@/Api/auth.api";
import { Spinner } from "../ui/Spinner";
import { tos } from "@/lib/utils";

const SignupForm = () => {
  const methods = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Validate on change
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      navigate("/");
    },
    onError: (error: any) => {
      const message = getAxiosErrorMessage(error);
      tos.error(message);
    },
  });

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    const payload = {
      name: data.fullName,
      email: data.email,
      password: data.password,
      role: "user",
    };
    mutate(payload);
  };

  return (
    <ScrollArea.Root className="w-full h-screen ">
      <ScrollArea.Viewport className="w-full h-full">
        <div className="mx-auto flex flex-col gap-4 md:w-1/2 sm-phone:w-full">
          <div className="flex flex-col gap-2">
            <p className="text-h2 font-bold">Sign Up</p>
            <p className="text-md text-neutral-500 dark:text-neutral-400">
              Welcome to awema!
            </p>
            <Separator />
          </div>
          <FormProvider {...methods}>
            <form
              className="flex flex-col gap-2"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="flex lg:flex-col sm-phone:flex-col gap-2r w-full">
                <FormField
                  control={methods.control}
                  rules={{
                    required: "Full Name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Full Name can only contain letters and spaces",
                    },
                    minLength: {
                      value: 3,
                      message: "Full Name must be at least 3 characters",
                    },
                  }}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your Full Name"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex lg:flex-col sm-phone:flex-col gap-2r w-full">
                <FormField
                  control={methods.control}
                  name="password"
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="confirmPassword"
                  rules={{
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === methods.watch("password") ||
                      "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password again"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="flex items-center gap-2 px-10">
                {isLoading ? <Spinner /> : "Sign up"}
              </Button>
            </form>
          </FormProvider>
          <Button variant={"outline"} type="button" onClick={() => {}}>
            <div className="flex flex-row gap-2 items-center justify-center">
              <img className="w-7 h-7" src={goggle} alt="googleIcon" />
              <p>Sign Up With Google</p>
            </div>
          </Button>
          <div className="flex flex-row gap-0 items-center justify-center">
            <p>Already have an account?</p>
            <Button
              className="px-2 text-bold text-pretty text-primary"
              variant={"link"}
              onClick={() => navigate("/login")}
            >
              Log In here
            </Button>
          </div>
        </div>
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  );
};

export default SignupForm;
