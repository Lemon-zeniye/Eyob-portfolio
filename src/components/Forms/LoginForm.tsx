import { FormProvider, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import goggle from "../../assets/icons8-google-48.png";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: "",
    },
  });

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8r lg:w-1/2 ">
      <div className="flex flex-col gap-2r">
        <p className="text-h2 font-bold">Login</p>
        <p className="text-md text-neutral-500 dark:text-neutral-400">
          If you are already a member you can login with{" "}
          <br className="sm-phone:hidden lg:flex" /> your email address and
          password.
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
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </div>
          <div className="flex justify-end">
            <FormField
              control={methods.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex items-end justify-end gap-2">
                      <Checkbox {...field} id="terms" />
                      <label
                        htmlFor="terms"
                        className="text-sm  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Log In</Button>
        </form>
        <Button onClick={() => {}} variant={"outline"} type="button">
          <div className="flex flex-row gap-2 items-center justify-center">
            <img className="w-7 h-7" src={goggle} alt="googleIcon" />
            <p>Sign In With Google</p>
          </div>
        </Button>
        <div className="flex flex-row gap-0 items-center justify-center">
          <p>Don't have an account?</p>
          <Button
            className="px-2 text-bold text-pretty text-primary"
            variant={"link"}
            onClick={() => navigate("/signup")}
          >
            Sign Up here
          </Button>
        </div>
      </FormProvider>
    </div>
  );
};

export default LoginForm;
