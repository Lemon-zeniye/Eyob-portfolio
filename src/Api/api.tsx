import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

export const BASE_URL = "http://194.5.159.228:3002";

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

// Store tokens in cookies
const storeTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set("accessToken", accessToken, { expires: 1, secure: true });
  Cookies.set("refreshToken", refreshToken, { expires: 7, secure: true });
};

// Error Handling
const handleApiError = (error: unknown, message: string) => {
  if (axios.isAxiosError(error)) {
    console.error(`${message}:`, error.response?.data || error.message);
  } else {
    console.error(`Unexpected error: ${message}`, error);
  }
};

export const fetchJobs = () => fetchData("job/fetchJob");

export default api;
