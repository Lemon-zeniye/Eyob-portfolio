import axios from "./axios";
import {
  ActiveUserResponse,
  CompanyAboutResponse,
  CompanyProfileRes,
  EducationResponse,
  EmployeeRes,
  ExperienceResponse,
  FetchSkillsResponse,
  FileResponse,
  GetOrganizationsResponse,
  JobCategoriesResponse,
  PostPayload,
  UserPostResponse,
  UserProfileRes,
} from "@/Types/profile.type";

export const getUserJob = async (): Promise<EducationResponse> => {
  const response = await axios.get<any>("/job/fetch");
  return response.data;
};

// POST
export const createPost = async (payload: any): Promise<PostPayload> => {
  const response = await axios.post<any>("/userPost/postContent", payload);
  return response.data;
};

export const getSingleUserPost = async (): Promise<UserPostResponse> => {
  const response = await axios.get<any>("/userPost/getSingleUserPost");
  return response.data;
};

//Education
export const addEducation = async (payload: any): Promise<any> => {
  const response = await axios.post<any>("/education/add", payload);
  return response.data;
};

export const getEducations = async (): Promise<EducationResponse> => {
  const response = await axios.get<any>("/education/fetch");
  return response.data;
};

//Experience
export const addExperience = async (payload: any): Promise<any> => {
  const response = await axios.post<any>("/experience/add", payload);
  return response.data;
};

export const getUserExperience = async (): Promise<ExperienceResponse> => {
  const response = await axios.get<any>("/experience/fetch");
  return response.data;
};

//Skill
export const getUserSkills = async (): Promise<FetchSkillsResponse> => {
  const response = await axios.get<any>("/skill/fetchSkills");
  return response.data;
};

export const addSkill = async (payload: any): Promise<any> => {
  const response = await axios.post<any>("/skill/addSkill", payload);
  return response.data;
};

export const getJobCategory = async (): Promise<JobCategoriesResponse> => {
  const response = await axios.get<any>("/job/fetchJobCategories");
  return response.data;
};

export const getUserPicture = async (): Promise<FileResponse> => {
  const response = await axios.get<any>("/user/getUserPicture");
  return response.data;
};

export const uploadCV = async (payload: any): Promise<any> => {
  const response = await axios.post<any>("/experience/uploadCV", payload);
  return response.data;
};

export const getUserCV = async (): Promise<FileResponse> => {
  const response = await axios.get<any>("experience/fetchUserCV");
  return response.data;
};

export const uploadUserPicture = async (payload: any): Promise<any> => {
  const response = await axios.post<any>("user/uploadUserPicture", payload);
  return response.data;
};

export const deleteUserPicture = async (): Promise<any> => {
  const response = await axios.delete<any>("user/deleteUserPicture");
  return response.data;
};

export const getUserVideo = async (): Promise<FileResponse> => {
  const response = await axios.get<any>("/user/getUserVideoLink");
  return response.data;
};

export const uploadUserVideo = async (payload: any): Promise<any> => {
  const response = await axios.post<any>("user/uploadUserVideo", payload);
  return response.data;
};

export const updateUserVideo = async (payload: any): Promise<any> => {
  const response = await axios.patch<any>("user/updateUserVideo", payload);
  return response.data;
};

export const deleteUserVideo = async (): Promise<any> => {
  const response = await axios.delete<any>("user/deleteUserVideo");
  return response.data;
};

export const getUserOrganization =
  async (): Promise<GetOrganizationsResponse> => {
    const response = await axios.get<any>("organization/user/organizations");
    return response.data;
  };

export const addUserOrganization = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(
    "/organization/addOrganization",
    payload
  );
  return response.data;
};

export const deleteExperience = async (id: string): Promise<any> => {
  const response = await axios.delete<any>(`experience/deleteExp/${id}`);
  return response.data;
};

export const deleteEducation = async (id: string): Promise<any> => {
  const response = await axios.delete<any>(`education/deleteEdu/${id}`);
  return response.data;
};

export const deleteOrganization = async (id: string): Promise<any> => {
  const response = await axios.delete<any>(
    `organization/deleteOrganization/${id}`
  );
  return response.data;
};

export const deletePost = async (id: string): Promise<any> => {
  const response = await axios.patch<any>(`/userPost/deactivateUserPost/${id}`);
  return response.data;
};

export const deleteSkill = async (id: string): Promise<any> => {
  const response = await axios.delete<any>(`skill/deleteSkill/${id}`);
  return response.data;
};

export const getActiveUsers = async (): Promise<ActiveUserResponse> => {
  const response = await axios.get("user/getActiveUsers");
  return response.data;
};

export const shareProfile = async (
  payload: any
): Promise<ActiveUserResponse> => {
  const response = await axios.post("/share/addShare", payload);
  return response.data;
};

export const addCertificate = async (payload: any): Promise<any> => {
  const response = await axios.post("/organization/addCertificate", payload);
  return response.data;
};

export const getCompanyProfile = async (): Promise<CompanyProfileRes> => {
  const response = await axios.get(`/companyProfile/fetch`);
  return response.data;
};

export const getCompanyEmployees = async (): Promise<EmployeeRes> => {
  const response = await axios.get("company/fetchEmployee");
  return response.data;
};

export const addEmployee = async (payload: any): Promise<any> => {
  const response = await axios.post("/company/addEmployee", payload);
  return response.data;
};

export const getCompanyAbout = async (): Promise<CompanyAboutResponse> => {
  const response = await axios.get("companyAbout/fetch");
  return response.data;
};

export const addAbout = async (payload: any): Promise<any> => {
  const response = await axios.post("companyAbout/addCompanyAbout", payload);
  return response.data;
};

export const updateCompanyProfile = async (payload: any): Promise<any> => {
  const response = await axios.put(
    "/companyProfile/updateCompanyProfile",
    payload
  );
  return response.data;
};

export const addCompanyProfile = async (payload: any): Promise<any> => {
  const response = await axios.put(
    "/companyProfile/addCompanyProfile",
    payload
  );
  return response.data;
};

export const updateCompanyAbout = async (payload: any): Promise<any> => {
  const response = await axios.put("/companyAbout/updateCompanyAbout", payload);
  return response.data;
};

export const getUserProfile = async (): Promise<UserProfileRes> => {
  const response = await axios.get<any>(`/userProfile/fetch`);
  return response.data;
};

export const updateUserProfile = async (payload: any): Promise<any> => {
  const response = await axios.put<any>(
    `userProfile/updateUserProfile`,
    payload
  );
  return response.data;
};

export const addUserProfile = async (payload: any): Promise<any> => {
  const response = await axios.post("/userProfile/addUserProfile", payload);
  return response.data;
};
