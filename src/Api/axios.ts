import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "https://db.takilo.com/api",
});

// Only attach the request interceptor to add the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAxiosErrorMessage = (error: any): string => {
  const errMes = error?.response?.data?.message;

  return errMes || "Something went wrong!";
};

export const getAxiosSuccessMessage = <T>(response: T): string => {
  if (response && typeof response === "object" && "data" in response) {
    const data = (response as any).data;
    return data?.message || "Request was successful.";
  }
  return "Request completed successfully.";
};

export default axiosInstance;
