export type PostTypes = {
  _id: string;
  postTitle: string;
  postContent: string;
  postDate: string;
  createdAt: string;
  postPictures: string[];
  userid: string | null;
  __v: number;
};

export interface UserEducation {
  _id: string;
  createdAt: string;
  currentlyStudying: boolean;
  degree: string;
  fieldOfStudy: string;
  gpa: number;
  graduationYear: number;
  institution: string;
  userid: string;
  __v: number;
}

export interface UserExperience {
  _id: string;
  createdAt: string;
  employmentType: string;
  endDate: string;
  entity: string;
  expDescription: string;
  jobTitle: string;
  location: string;
  locationType: string;
  startDate: string;
  userid: string;
  workingAt: boolean;
  __v: number;
}

export interface UserSkill {
  _id: string;
  createdAt: string;
  skill: string[];
  userid: string;
  __v: number;
}

export interface UserProfile {
  bio: string;
  createdAt: string;
  location: string;
  position: string;
  userid: string;
  __v: number;
  _id: string;
}

export type ChatType = "all" | "personal" | "group";
