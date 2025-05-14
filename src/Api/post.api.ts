import { CommentsRes, PostComRes, PostRes } from "@/Types/post.type";
import axios from "./axios";

export const getAllPosts = async (): Promise<PostRes> => {
  const response = await axios.get<any>(`/userPost/getAllUser`);
  return response.data;
};

export const getAllPostsWithComments = async (): Promise<PostComRes> => {
  const response = await axios.get<any>(
    `/userPost/fetchAllPostsWithCommentsAndLikes`
  );
  return response.data;
};

export const likeOrDeslike = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(`/userPost/likeOrDeslike`, payload);
  return response.data;
};

export const addComment = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(`/userPost/addComment`, payload);
  return response.data;
};

export const addStory = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(`/user/uploadUserStory`, payload);
  return response.data;
};

export const getUserStorys = async (): Promise<any> => {
  const response = await axios.get<any>(`/user/getUserStories`);
  return response.data;
};

export const updateStory = async (id: string, payload: any): Promise<any> => {
  const response = await axios.patch<any>(
    `/user/updateUserStory/${id}`,
    payload
  );
  return response.data;
};

export const deleteStory = async (id: string): Promise<any> => {
  const response = await axios.patch<any>(`/user/deleteUserStory/{id}/${id}`);
  return response.data;
};

export const getcComments = async (id: string): Promise<CommentsRes> => {
  const response = await axios.get<any>(
    `/userPost/fetchCommentsOfGivenPost/${id}`
  );
  return response.data;
};
