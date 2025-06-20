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
    <div className="flex flex-col w-full max-w-md mx-auto bg-transparent">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center gap-3">
          <img src={logo} alt="Akilo" className="w-20 h-20" />
          <div className="flex flex-col">
            <p className="text-2xl font-bold bg-gradient-to-br from-black to-primary2 bg-clip-text text-transparent">
              Akilo Consultancy
              <br />
              Corporation
            </p>
          </div>
        </div>

        <p className="text-base text-center px-2 leading-6 font-medium">
          Provide Technology Solutions to Elevate Your Business. Born in Tigray!
        </p>

        <div className="px-2 mx-auto w-full">
          <button className="bg-primary2 flex text-white items-center justify-center gap-2 w-full text-base py-2 rounded-lg hover:bg-primary2/70">
            Visit Akio <MdArrowOutward className="text-lg" />
          </button>
        </div>

        <div className="my-3 text-center">
          <h2 className="text-lg font-semibold">Wa'ela Check in Ticket</h2>
          <p className="text-xs text-gray-600">
            Login to access your Ticket Qr Code
          </p>
        </div>
      </div>

      <FormProvider {...methods}>
        <form
          className="flex flex-col w-full gap-4 px-1 mt-2"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
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
              <FormItem>
                <FormLabel className="text-sm">Username</FormLabel>
                <FormControl>
                  <Input
                    required
                    type="text"
                    placeholder="Enter your username"
                    className="w-full bg-white py-3 rounded-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
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
              <FormItem>
                <FormLabel className="text-sm">Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      required
                      className="w-full pr-10 bg-white py-3 rounded-lg"
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <Checkbox {...field} id="terms" className="h-4 w-4" />
                  <label
                    htmlFor="terms"
                    className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              </FormItem>
            )}
          />

          <button
            className="bg-primary2 text-white flex items-center justify-center gap-2 w-full text-base py-3 rounded-lg hover:bg-primary2/70 mt-2"
            type="submit"
          >
            {isLoading ? <Spinner /> : "Login"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default LoginForm;
