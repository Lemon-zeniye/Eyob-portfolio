import { UserEducation, UserExperience } from "@/components/Types";
import { Role } from "./auth.type";

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
  category: SkillCategory;
};

export type FetchSkillsResponse = {
  success: boolean;
  msg: string;
  data: Skill[];
};

export type UserSkillsRes = {
  success: boolean;
  msg: string;
  data: UserSkill[];
};

export interface UserSkill {
  _id: string;
  userid: string;
  skill: string;
  category: string;
  company: string;
  skillDescription: string;
  createdAt: string;
  __v: number;
}

export interface PostPayload {
  postContent: string;
  postTitle: string;
  postImages?: string[];
}

export interface SkillCategory {
  _id: string;
  name: string;
  status: string;
  createdAt: string;
  __v: number;
}

export interface SkillCategoriesResponse {
  success: boolean;
  msg: string;
  data: SkillCategory[];
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
  role?: Role;
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

export interface Employee {
  companyId: string;
  createdAt: string;
  empPosition: string;
  name: string;
  status: string;
  __v: number;
  _id: string;
}

export interface EmployeeRes {
  data: Employee[];
  msg: string;
  success: boolean;
}

export interface CompanyAbout {
  _id: string;
  userid: string;
  history: string;
  website: string[];
  socialMedia: string[];
  createdAt: string;
  __v: number;
}

export interface CompanyAboutResponse {
  success: boolean;
  msg: string;
  data: CompanyAbout;
}

export interface CompanyProfileRes {
  success: boolean;
  msg: string;
  data: CompanyProfile;
}

export interface CompanyProfile {
  _id: string;
  userid: string;
  name: string;
  industry: string;
  location: string;
  companyBio: string;
  createdAt: string;
  __v: number;
}

export interface UserProfileRes {
  success: boolean;
  msg: string;
  data: UserProfile;
}

export interface UserProfile {
  position: string;
  location: string;
  bio: string;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  pictures: UserFile[];
  videos: UserFile[];
  education: UserEducation[];
  experience: UserExperience[];
  skills: UserSkill[];
  organization: Organization[];
  certification: Certificate[];
  id: string;
  location: string;
  position: string;
  bio: string;
}

export interface UserFullProfileRes {
  success: boolean;
  msg: string;
  data: UserData;
}

export interface SkillNew {
  _id: string;
  userid: string;
  skill: string[];
  createdAt: string;
  __v: number;
}

export interface ActiveCompaniesRes {
  success: boolean;
  msg: string;
  data: ActiveCompanies[];
}
export interface ActiveCompanies {
  email: string;
  name: string;
  picturePath: string;
  role: Role;
  _id: string;
}

export interface Certificate {
  certificateName: string;
  certificateNumber: string;
  certifiedBy: string;
  createdAt: Date;
  expireDate: Date;
  path: string;
  userid: string;
  __v: number;
  _id: string;
}

export interface CertificateRes {
  success: boolean;
  msg: string;
  data: Certificate[];
}
