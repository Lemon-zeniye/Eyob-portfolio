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

const SignupForm = () => {
  const methods = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8r md:w-1/2 sm-phone:w-full  ">
      <div className="flex flex-col gap-2r">
        <p className="text-h2 font-bold">Sign Up</p>
        <p className="text-md text-neutral-500 dark:text-neutral-400">
          Welcome to fit habesha!
        </p>
        <Separator />
      </div>
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-5"
          onSubmit={methods.handleSubmit(() => {})}
        >
          <div className="flex lg:flex-col sm-phone:flex-col gap-4r w-full">
            <FormField
              control={methods.control}
              rules={{
                required: "Full Name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Full Name can only contain letters and spaces",
                },
              }}
              name="fullName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      required
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
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      required
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex lg:flex-col sm-phone:flex-col gap-4r w-full">
            <FormField
              control={methods.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password again"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">Sign Up</Button>
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
  );
};

export default SignupForm;
