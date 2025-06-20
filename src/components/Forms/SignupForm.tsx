import { FormProvider, useForm } from "react-hook-form";
import { Separator } from "../ui/separator";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useMutation } from "react-query";
import { signup } from "@/Api/auth.api";
import { Spinner } from "../ui/Spinner";
import { tos } from "@/lib/utils";
import { getAxiosErrorMessage } from "@/Api/axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const SignupForm = () => {
  const methods = useForm({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "admin",
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
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const onSubmit = (data: any) => {
    const payload = {
      username: data.username,
      password: data.password,
      role: data.role,
    };
    mutate(payload);
  };

  return (
    <ScrollArea.Root className="w-full h-screen">
      <ScrollArea.Viewport className="w-full h-full">
        <div className="mx-auto flex flex-col gap-4 md:w-1/2 w-full">
          <div className="flex flex-col gap-2">
            <p className="text-h2 font-bold">Sign Up</p>
            {/* <p className="text-md text-neutral-500 dark:text-neutral-400">
              Welcome to awema!
            </p> */}
            <Separator />
          </div>
          <div>
            {/* {otpSent ? (
              <div>
                <h1 className="py-2">Verification Code</h1>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the code sent to your email"
                />
                <div className="flex items-center justify-between text-gray-400 px-1">
                  <small>{methods?.getValues("email")}</small>
                  <small
                    onClick={() => setOtpSent(false)}
                    className="cursor-pointer hover:text-gray-500"
                  >
                    Invalid Email
                  </small>
                </div>
                <Button
                  type="button"
                  onClick={handleOTPVerification}
                  disabled={!otp || otp.length < 5}
                  className="flex items-center w-full gap-2 mt-2 px-10"
                >
                  {isOTPLoading ? <Spinner /> : "Verify Email"}
                </Button>
              </div>
            ) : ( */}
            <FormProvider {...methods}>
              <form
                className="flex flex-col gap-2"
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <div className="flex lg:flex-col flex-col gap-2r space-y-3 mb-3 w-full">
                  <FormField
                    control={methods.control}
                    rules={{
                      required: "Username is required",
                      // pattern: {
                      //   value: /^[A-Za-z\s]+$/,
                      //   message: "Username can only contain letters and spaces",
                      // },
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    }}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your Username"
                            {...field}
                            type="text"
                            className="!outline-none rounded-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
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
                    /> */}
                  <FormField
                    control={methods.control}
                    name="password"
                    rules={{
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              {...field}
                              required
                              className="w-full pr-10 rounded-none" // Add padding for the icon
                            />
                          </FormControl>
                          <button
                            type="button" // Important to prevent form submission
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
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
                  /> */}

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
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showCPassword ? "text" : "password"}
                              placeholder="Enter your password again"
                              {...field}
                              required
                              className="w-full pr-10 rounded-none" // Add padding for the icon
                            />
                          </FormControl>
                          <button
                            type="button" // Important to prevent form submission
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowCPassword(!showCPassword)}
                          >
                            {showCPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={methods.control}
                    name="role"
                    rules={{
                      required: "Role is Required",
                    }}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Select.Root
                            // onValueChange={(value) => {
                            //   field.onChange(value);
                            // }}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <Select.Trigger
                              className={`flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white ${
                                field.value ? "text-black" : "text-gray-500 "
                              } text-sm focus:outline-none`}
                            >
                              <Select.Value placeholder="Select Role (User or Company)" />
                              <Select.Icon>
                                <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                              </Select.Icon>
                            </Select.Trigger>

                            <Select.Portal>
                              <Select.Content className="z-50 mt-1 w-[--radix-select-trigger-width] rounded-md border border-gray-200 bg-white shadow-md">
                                <Select.Viewport className="p-1">
                                  {[
                                    { label: "User", value: "user" },
                                    { label: "Company", value: "company" },
                                  ].map((g) => (
                                    <Select.Item
                                      key={g.value}
                                      value={g.value}
                                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded"
                                    >
                                      <Select.ItemText>
                                        {g.label}
                                      </Select.ItemText>
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
                </div>

                <Button
                  type="submit"
                  className="flex items-center gap-2 px-10 bg-primary2 hover:bg-primary2"
                >
                  {isLoading ? <Spinner /> : "Sign up"}
                </Button>
              </form>
            </FormProvider>
            {/* )} */}
          </div>

          <div className="flex flex-row gap-0 items-center justify-center">
            <p>Already have an account?</p>
            <Button
              className="px-2 text-bold text-pretty text-primary2"
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
