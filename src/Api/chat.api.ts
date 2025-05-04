import {
  ActiveUsersRes,
  GroupChatRes,
  GroupMemberRes,
  GroupRes,
  MessageRes,
  PreviousChatRes,
} from "@/Types/chat.type";
import axios from "./axios";

export const getActiveUsers = async (): Promise<ActiveUsersRes> => {
  const response = await axios.get<any>(`/user/getActiveUsers`);
  return response.data;
};

export const getChatWithX = async (id: string): Promise<MessageRes> => {
  const response = await axios.get<any>(`/chat/getMyChatsWithX/${id}`);
  return response.data;
};

export const getGroups = async (): Promise<GroupRes> => {
  const response = await axios.get<any>(`/group/getUserGroups`);
  return response.data;
};

export const createGroup = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(`/group/createGroup`, payload);
  return response.data;
};

export const getGroupChats = async (id: string): Promise<GroupChatRes> => {
  const response = await axios.get<any>(`/group/getGroupChats/${id}`);
  return response.data;
};

export const getPreviousChat = async (): Promise<PreviousChatRes> => {
  const response = await axios.get<any>(`/chat/getChattedUsers`);
  return response.data;
};

export const getGroupMembersList = async (
  id: string
): Promise<GroupMemberRes> => {
  const response = await axios.get<any>(`/group/getGroupMembersList/${id}`);
  return response.data;
};

export const removeMember = async ({
  groupId,
  memberId,
}: {
  groupId: string;
  memberId: string;
}): Promise<GroupMemberRes> => {
  const response = await axios.delete<any>(
    `/group/removeMember/${groupId}/${memberId}`
  );
  return response.data;
};

export const deleteGroup = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(`/group/removeGroup`, payload);
  return response.data;
};

export const addMemebers = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(`/group/addToGroup`, payload);
  return response.data;
};
