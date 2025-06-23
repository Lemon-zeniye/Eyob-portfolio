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
      identifier: data.username,
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

  const handleClick = () => {
    window.open("https://www.akilocorp.com/", "_blank");
  };

  return (
    <div className="flex flex-col w-full md:w-[26rem] bg-transparent space-y-4 pt-6  max-h-screen">
      {/* Header Section */}
      <div className="flex lg:hidden items-center justify-center gap-3">
        <img src={logo} alt="Akilo" className="w-24 h-24" />
        <div className="flex flex-col">
          <p className="text-3xl font-bold bg-gradient-to-br from-black to-primary2 bg-clip-text text-transparent leading-10">
            Akilo Consultancy
            <br />
            Corporation
          </p>
        </div>
      </div>

      <div className="px-4 lg:space-y-8">
        <p className="text-xl text-center px-4  font-medium leading-9 md:hidden">
          Provide Technology Solutions to Elevate Your Business. Born in Tigray!
        </p>

        <button
          className="bg-primary2 my-1 text-white flex items-center justify-center gap-2 w-full text-lg py-2 rounded-xl hover:bg-primary2/70 lg:hidden"
          onClick={handleClick}
        >
          Visit Akilo <MdArrowOutward className="text-xl" />
        </button>

        <div className="py-2 text-center">
          <h2 className="text-2xl">Wa'ela Check in Ticket</h2>
          <p className="text-sm text-gray-600">
            Login to access your Ticket Qr Code
          </p>
        </div>

        {/* Login Form */}
        <FormProvider {...methods}>
          <form
            className="flex flex-col w-full gap-y-4"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <FormField
              control={methods.control}
              name="username"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="text"
                      placeholder="Enter your email"
                      className="w-full !bg-white !py-3.5 rounded-lg"
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
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        required
                        className="w-full pr-10 !bg-white !py-3.5 rounded-lg"
                      />
                    </FormControl>
                    <button
                      type="button"
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

            <FormField
              control={methods.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox {...field} id="terms" />
                  </FormControl>
                  <label
                    htmlFor="terms"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </FormItem>
              )}
            />

            <button
              className="bg-primary2 text-white flex items-center justify-center gap-2 w-full text-lg py-3 rounded-xl hover:bg-primary2/70 mt-2"
              type="submit"
            >
              {isLoading ? <Spinner /> : "Login"}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default LoginForm;
