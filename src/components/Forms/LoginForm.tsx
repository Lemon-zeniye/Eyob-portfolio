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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import { useMutation } from "react-query";
import { login } from "@/Api/auth.api";
import Cookies from "js-cookie";
import { Spinner } from "../ui/Spinner";
import { useRole } from "@/Context/RoleContext";
import { tos } from "@/lib/utils";
import { getAxiosErrorMessage } from "@/Api/axios";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/image2.png";
import { MdArrowOutward } from "react-icons/md";

const LoginForm = () => {
  const { login: authLogin } = useAuth();
  const { setRole, setUser } = useRole();
  const [showPassword, setShowPassword] = useState(false);
  const methods = useForm({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: "",
    },
  });

  const navigate = useNavigate();
  // const { login } = useAuth();

  const onSubmit = (data: any) => {
    const payload = {
      username: data.username,
      password: data.password,
    };
    mutate(payload);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const accessToken = response?.token;
      if (accessToken) {
        Cookies.set("accessToken", accessToken);
        authLogin(accessToken);
        setRole(response?.user.role);
        setUser(response?.user);
        Cookies.set("role", response?.user.role);
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
    <div className="flex flex-col   lg:w-1/2 ">
      <div className="flex flex-col gap-2r">
        <div className="flex items-center gap-3 px-4">
          <img src={logo} alt="Akilo" className="w-24 h-24 shrink-0" />
          <div className="flex flex-col">
            <p className="text-2xl font-bold bg-gradient-to-br from-black to-primary2 bg-clip-text text-transparent">
              Akilo Consultancy
              <br />
              Corporation
            </p>
          </div>
        </div>
        <p className="text-xl text-center px-2 md:px-3 leading-8 font-medium ">
          Provide Technology Solutions to Elevate Your Business. Born in Tigray!
          <br className="hidden lg:flex" />
        </p>

        <div className="px-2 md:px-8 mx-auto w-full">
          <button className="bg-primary2 flex text-white items-center justify-center gap-3 w-full text-lg py-2.5 rounded-xl hover:bg-primary2/70">
            Vsit Akio <MdArrowOutward className="text-xl" />
          </button>
        </div>
        {/* <Separator /> */}
        <div className="my-4 text-center">
          <h2 className="text-xl">Wa'ela Check in Ticket</h2>
          <p className="text-sm text-gray-600">
            Login to access your Ticket Qr Code
          </p>
        </div>
      </div>
      <FormProvider {...methods}>
        <form
          className="flex flex-col w-full gap-y-5 px-2"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="flex lg:flex-col flex-col gap-4r w-full">
            <FormField
              control={methods.control}
              name="username"
              rules={{
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters long",
                },
              }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="text"
                      placeholder="Enter your username"
                      className="w-full !bg-white !py-4 rounded-none"
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
                        className="w-full pr-10 !bg-[#fff] rounded-none" // Add padding for the icon
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
          </div>
          <div className="flex justify-center items-center w-full">
            <FormField
              control={methods.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex items-center justify-center gap-2">
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
          <div className="flex items-center justify-center px-4">
            <button className="bg-primary2 flex text-white  items-center justify-center gap-3 w-full text-lg py-2.5 rounded-xl hover:bg-primary2/70">
              {isLoading ? <Spinner /> : "Login"}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default LoginForm;
