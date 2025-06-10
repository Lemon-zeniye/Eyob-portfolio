import {
  AppliedJobsResponse,
  JobResponse,
  JobStaticsRes,
  SingleJobResponse,
} from "@/Types/job.type";
import axios, { axiosInstanceTwo } from "./axios";
import { JobSearchResponse, SingleResponse } from "@/Types/sampleJob.type";
import { AppliedFilters } from "@/Pages/SampleJob";

export const getJobs = async (
  filters: Record<string, string> = {},
  page: number = 1,
  limit: number = 10
): Promise<JobResponse> => {
  const response = await axios.get<any>("job/findJob", {
    params: {
      ...filters,
      page,
      limit,
    },
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
  const response = await axios.get<any>(`job/fetchSingle/${id}`);
  return response.data;
};

export const applyJob = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(`job/applyJob`, payload);
  return response.data;
};

export const addJob = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(`job/addJob`, payload);
  return response.data;
};

export const getJobStatics = async (): Promise<JobStaticsRes> => {
  const response = await axios.get<any>(`/job/fetchJobStatistics`);
  return response.data;
};

export const getCompanyJobs = async (): Promise<JobResponse> => {
  const response = await axios.get<any>(`/job/fetchSingleUserJob`);
  return response.data;
};

export const fetchAllApplicants = async (): Promise<AppliedJobsResponse> => {
  const response = await axios.get<any>(`job/fetchAllApplicants`);
  return response.data;
};

export const updateJob = async ({
  id,
  payload,
}: {
  id: string;
  payload: any;
}): Promise<any> => {
  const response = await axios.put<any>(`/job/updateJob/${id}`, payload);
  return response.data;
};

export const getAllApplicantsOfaJob = async (
  id: string
): Promise<AppliedJobsResponse> => {
  const response = await axios.get<any>(`/job/getApplicantsOfGivenJob/${id}`);
  return response.data;
};

export const fetchJobs = async (
  filters: AppliedFilters,
  page: number = 1,
  numPages: number = 1
): Promise<JobSearchResponse> => {
  const params = {
    page,
    num_pages: numPages,
    query: filters.job_titles || "developer",
    ...(filters.date_posted && { date_posted: filters.date_posted }),
    ...(filters.remote && { work_from_home: filters.remote }),
    ...(filters.employment_types && {
      employment_types: Array.isArray(filters.employment_types)
        ? filters.employment_types.join(",")
        : filters.employment_types,
    }),
    ...(filters.job_requirements && {
      job_requirements: Array.isArray(filters.job_requirements)
        ? filters.job_requirements.join(",")
        : filters.job_requirements,
    }),
  };

  const response = await axiosInstanceTwo.get("/search", { params });
  return response.data;
};

export const fetchJobDetail = async (id: string): Promise<SingleResponse> => {
  const response = await axiosInstanceTwo.get<any>(`job-details?job_id=${id}`);
  return response.data;
};
