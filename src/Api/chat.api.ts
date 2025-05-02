import { ActiveUsersRes } from "@/Types/chat.type";
import axios from "./axios";

export const getActiveUsers = async (): Promise<ActiveUsersRes> => {
  const response = await axios.get<any>(`/user/getActiveUsers`);
  return response.data;
};

export const getChatWithX = async (id: string): Promise<ActiveUsersRes> => {
  const response = await axios.get<any>(`/chat/getMyChatsWithX/${id}`);
  return response.data;
};
