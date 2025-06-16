import { LoginRes } from "@/Types/auth.type";
import axios from "./axios";

export const login = async (payload: any): Promise<LoginRes> => {
  const response = await axios.post<any>("/login", payload);
  return response.data;
};

export const signup = async (payload: any): Promise<any> => {
  const response = await axios.post<any>("/register", payload);
  return response.data;
};
