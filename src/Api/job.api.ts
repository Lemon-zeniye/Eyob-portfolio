import {
  AppliedJobsResponse,
  JobResponse,
  SingleJobResponse,
} from "@/Types/job.type";
import axios from "./axios";

// export const getJobs = async (): Promise<JobResponse> => {
//   const response = await axios.get<any>(`job/fetchJob`);
//   return response.data;
// };

export const getJobs = async (
  filters: Record<string, string> = {}
): Promise<JobResponse> => {
  const response = await axios.get<any>("job/fetchJob", {
    params: filters,
  });
  return response.data;
};

export const getAppliedJobs = async (): Promise<AppliedJobsResponse> => {
  const response = await axios.get<any>(`job/fetchAllJobsUserAppliedTo`);
  return response.data;
};

export const getFetchSingleJob = async (
  id: string
): Promise<SingleJobResponse> => {
  const response = await axios.get<any>(`/job/fetchSingleJob/${id}`);
  return response.data;
};

export const applyJob = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(`job/applyJob`, payload);
  return response.data;
};
