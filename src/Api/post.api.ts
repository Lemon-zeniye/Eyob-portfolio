import {
  ChildCommentsRes,
  CommentsRes,
  NotificationRes,
  PostComRes,
  PostRes,
  StoryRes,
} from "@/Types/post.type";
import axios from "./axios";

export const getAllPosts = async (): Promise<PostRes> => {
  const response = await axios.get<any>(`/userPost/getAllUser`);
  return response.data;
};

export const getAllPostsWithComments = async (
  page: number = 1,
  limit: number = 5
): Promise<PostComRes> => {
  const response = await axios.get<PostComRes>(
    `https://awema.co/api/userPost/fetchAllPostsWithCommentsAndLikes`,
    {
      params: { page, limit },
    }
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

export const getUserStories = async (): Promise<StoryRes> => {
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

export const getComments = async (
  id: string,
  page: number = 1,
  limit: number = 5
): Promise<CommentsRes> => {
  const response = await axios.get<any>(
    `/userPost/fetchCommentsOfGivenPost/${id}`,
    {
      params: { page, limit },
    }
  );
  return response.data;
};

export const addChildComment = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(`/userPost/addChildComment`, payload);
  return response.data;
};

export const getChildComments = async (
  id: string
): Promise<ChildCommentsRes> => {
  const response = await axios.get<any>(`/userPost/fetchChildComments/${id}
`);
  return response.data;
};

export const Commentlike = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(
    `/userPost/commentLikeOrDeslike`,
    payload
  );
  return response.data;
};

// Notification Apis
export const getNotifications = async (): Promise<NotificationRes> => {
  const response = await axios.get<any>(`/notification/getNotifications`);
  return response.data;
};

export const deleteNotification = async (
  id: string
): Promise<NotificationRes> => {
  const response = await axios.delete<any>(
    `/notification/deleteNotification/${id}`
  );
  return response.data;
};

export const updateNotification = async ({
  id,
  payload,
}: {
  id: string;
  payload: any;
}): Promise<NotificationRes> => {
  const response = await axios.patch<any>(
    `/notification/updateNotification/${id}`,
    payload
  );
  return response.data;
};
