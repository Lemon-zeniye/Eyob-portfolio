import { PostComRes, PostRes } from "@/Types/post.type";
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
