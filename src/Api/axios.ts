import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "http://147.79.100.108:7000/api",
});

const RapidAPI = import.meta.env.VITE_RapidAPI;

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

// Response interceptor to handle 401 errors
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = Cookies.get("refreshToken");
//         if (!refreshToken) {
//           throw new Error("Refresh token not available");
//         }

//         const refreshResponse = await axios.post(
//           "https://awema.co/api/auth/refresh",
//           {
//             refreshToken: refreshToken,
//           }
//         );

//         const newAccessToken = refreshResponse.data.tokens.accessToken;
//         const newRefreshToken = refreshResponse.data.tokens.refreshToken;
//         Cookies.set("accessToken", newAccessToken);
//         Cookies.set("refreshToken", newRefreshToken);

//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error("Failed to refresh token:", refreshError);
//         Cookies.remove("accessToken");
//         Cookies.remove("refreshToken");

//         // Navigate to login
//         if (navigateFunction) {
//           navigateFunction("/login");
//         }

//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
export const getAxiosErrorMessage = (error: any): string => {
  const errMes = error?.response?.data?.msg;

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

export const axiosInstanceTwo = axios.create({
  baseURL: "https://jsearch.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": RapidAPI, // 🔁 replace with your key
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  },
});
