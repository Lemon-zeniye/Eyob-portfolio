import { UserEducation, UserExperience } from "@/components/Types";

export interface UserPostResponse {
  success: boolean;
  msg: string;
  data: Post[];
}

export interface Post {
  _id: string;
  userid: {
    _id: string;
    name: string;
  };
  postTitle: string;
  postContent: string;
  postPictures: string[]; // assuming postPictures will contain URLs or file paths
  likes: number;
  deslikes: number;
  status: "active" | "inactive"; // you can expand this based on actual status options
  postDate: string; // ISO string format
  createdAt: string;
  __v: number;
}

export interface EducationResponse {
  success: boolean;
  msg?: string;
  data: UserEducation[];
}

export interface ExperienceResponse {
  data: UserExperience[];
  success: boolean;
  msg?: string;
}

type Skill = {
  _id: string;
  name: string;
  status: string;
  createdAt: string;
  __v: number;
  category: JobCategory;
};

export type FetchSkillsResponse = {
  success: boolean;
  msg: string;
  data: Skill[];
};

export interface PostPayload {
  postContent: string;
  postTitle: string;
  postImages?: string[];
}

export interface JobCategory {
  _id: string;
  name: string;
  status: string;
  createdAt: string;
  __v: number;
}

export interface JobCategoriesResponse {
  success: boolean;
  msg: string;
  data: JobCategory[];
}

export interface FileResponse {
  success: boolean;
  msg: string;
  data: UserFile;
}

export interface UserFile {
  _id: string;
  userid: string;
  filename: string;
  path: string;
  createdAt: string; // ISO date string
  __v: number;
}

// types/auth.d.ts
export interface JwtPayload {
  iat: number;
  exp: number;
  aud: Array<{
    _id?: string;
    name?: string;
    role?: string;
    [key: string]: any;
  }>;
  iss: string;
}

export interface UserInfo {
  id?: string;
  name?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface GetOrganizationsResponse {
  success: boolean;
  msg: string;
  data: Organization[];
}

export interface Organization {
  _id: string;
  userid: string;
  organizationName: string;
  organizationType: string;
  email: string;
  path: string;
  createdAt: string;
  __v: number;
}

export interface ActiveUser {
  email: string;
  name: string;
  role: "user" | "company";
  _id: string;
}
export interface ActiveUserResponse {
  success: boolean;
  meg: string;
  data: ActiveUser[];
}
