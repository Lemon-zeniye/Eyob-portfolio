import axiosInstance from "./axios";

export const scan = async (payload: { id: string }): Promise<any> => {
  const response = await axiosInstance.post<any>("/scan", payload);
  return response.data;
};
