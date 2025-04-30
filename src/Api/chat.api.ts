import { ActiveUsersRes } from "@/Types/chat.type";
import axios from "./axios";

export const getActiveUsers = async (): Promise<ActiveUsersRes> => {
  const response = await axios.get<any>(`/user/getActiveUsers`);
  return response.data;
};
