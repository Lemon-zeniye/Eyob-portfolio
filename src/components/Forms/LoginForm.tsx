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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import { useMutation } from "react-query";
import { getAxiosErrorMessage, login } from "@/Api/auth.api";
import Cookies from "js-cookie";
import { Spinner } from "../ui/Spinner";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import axiosInstance from "@/Api/axios";
import { useRole } from "@/Context/RoleContext";
import { tos } from "@/lib/utils";

// interface GooglePayload {
//   name: string;
//   email: string;
//   sub: string; // This is the Google ID
// }

const LoginForm = () => {
  const { login: authLogin } = useAuth();
  const { setRole } = useRole();
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: "",
    },
  });

  const navigate = useNavigate();
  // const { login } = useAuth();

  const onSubmit = (data: any) => {
    const payload = {
      email: data.email,
      password: data.password,
    };
    mutate(payload);
  };

  // const handleSuccess = async (credentialResponse: any) => {
  //   const idToken = credentialResponse.credential;

  //   // Decode the token to get user info
  //   const decoded: GooglePayload = jwtDecode(idToken);

  //   const payload = {
  //     idToken,
  //     name: decoded.name,
  //     email: decoded.email,
  //     googleId: decoded.sub,
  //   };

  //   try {
  //     const response = await axiosInstance.post("/auth/verifyTokenId", payload);
  //     const accessToken = response.data?.access_token;
  //     const refreshToken = response.data?.refresh_token;
  //     if (accessToken && refreshToken) {
  //       Cookies.set("accessToken", accessToken);
  //       Cookies.set("refreshToken", refreshToken);
  //       authLogin(accessToken, refreshToken);

  //       navigate("/");
  //       tos.success("Successfully logged in!");
  //     } else {
  //       throw new Error("Login failed, tokens missing");
  //     }
  //   } catch (error) {
  //     const mes = getAxiosErrorMessage(error);
  //     tos.error(mes);
  //   }
  // };

  const { mutate, isLoading } = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const accessToken = response?.accessToken;
      const refreshToken = response?.refreshToken;
      if (accessToken && refreshToken) {
        Cookies.set("accessToken", accessToken);
        Cookies.set("refreshToken", refreshToken);
        Cookies.set("mode", "formal");
        authLogin(accessToken, refreshToken);

        setRole("user");
        Cookies.set("role", "user");
        navigate("/");
        tos.success("Successfully logged in!");
      } else {
        throw new Error("Login failed, tokens missing");
      }
    },
    onError: (error: any) => {
      const message = getAxiosErrorMessage(error);
      tos.error(error?.msg || message);
    },
  });

  return (
    <div className="flex flex-col gap-8r lg:w-1/2 ">
      <div className="flex flex-col gap-2r">
        <p className="text-h2 font-bold">Login</p>
        <p className="text-md text-neutral-500 dark:text-neutral-400">
          If you are already a member you can login with{" "}
          <br className="hidden lg:flex" /> your email address and password.
        </p>
        <Separator />
      </div>
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-5"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="flex lg:flex-col flex-col gap-4r w-full">
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
          <Button type="submit">{isLoading ? <Spinner /> : "Log In"}</Button>
        </form>
        {/* <Button onClick={() => {}} variant={"outline"} type="button">
          <div className="flex flex-row gap-2 items-center justify-center">
            <img className="w-7 h-7" src={goggle} alt="googleIcon" />
            <p>Sign In With Google</p>
          </div>
        </Button> */}
        {/* <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        /> */}
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
