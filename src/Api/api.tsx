import axios, { AxiosError, AxiosInstance } from "axios";
import Cookies from "js-cookie";

export const BASE_URL = "http://194.5.159.228:3002";
const REFRESH_URL = `${BASE_URL}/api/auth/refresh`;

const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle token expiration & refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          error.config!.headers!["Authorization"] = `Bearer ${newAccessToken}`;
          return axios.request(error.config!);
        }
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  try {
    const { data } = await api.post("auth/login", { email, password });
    storeTokens(data.accessToken, data.refreshToken);
    return data;
  } catch (error) {
    handleApiError(error, "Login failed");
    throw error;
  }
};

export const fetchData = async (endpoint: string) => {
  try {
    const { data } = await api.get(endpoint);
    return data;
  } catch (error) {
    handleApiError(error, "Data fetching failed");
    throw error;
  }
};

export const postData = async <T,>(endpoint: string, data?: T) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    handleApiError(error, "Posting data failed");
    throw error;
  }
};

// Token Refresh Function
const refreshToken = async (): Promise<string | null> => {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) return null;
  try {
    const { data } = await axios.post(REFRESH_URL, { refreshToken });
    storeTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch (error) {
    console.error("Error refreshing token", error);
    return null;
  }
};

// Store tokens in cookies
const storeTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set("accessToken", accessToken, { expires: 1, secure: true });
  Cookies.set("refreshToken", refreshToken, { expires: 7, secure: true });
};

// Logout Function
const logout = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  console.log("User logged out");
};

// Error Handling
const handleApiError = (error: unknown, message: string) => {
  if (axios.isAxiosError(error)) {
    console.error(`${message}:`, error.response?.data || error.message);
  } else {
    console.error(`Unexpected error: ${message}`, error);
  }
};

// Specific API Calls
export const fetchJobs = () => fetchData("job/fetchJob");
// export const fetchUserProfile = () => fetchData("userProfile/fetch");
// export const fetchUserExperience = () => fetchData("experience/fetch");
// export const fetchAllUserPosts = () => fetchData("userPost/getAllUser");
// export const fetchUserSkills = () => fetchData("profession/getSkill");
// export const fetchUserEducation = () => fetchData("education/fetch");

export default api;
