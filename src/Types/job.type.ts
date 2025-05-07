export interface Job {
  _id: string;
  userid: {
    _id: string;
    name: string;
  };
  company: string;
  jobTitle: string;
  jobType: string;
  jobDescription: string;
  deadLine: string;
  degree: string;
  jobLocation: string;
  experience: string;
  locationType: string;
  skills: string[];
  range: Range[];
  jobPostDate: string;
  salaryType: string;
  salary: number;
  __v: number;
}

interface Range {
  minimum: number;
  maximum: number;
}

export interface JobApplication {
  _id: string;
  userid: string;
  name: string;
  jobid: Job;
  jobTitle: string;
  company: string;
  applicationDate: string;
  __v: number;
}

export interface JobResponse {
  msg: string;
  success: boolean;
  data: Job[];
}

export interface SingleJobResponse {
  msg: string;
  success: boolean;
  data: Job;
}

export interface AppliedJobsResponse {
  msg: string;
  success: boolean;
  data: JobApplication[];
}

export type FilterOption = {
  id: number;
  name: string;
  value: string;
};

export type FilterCategory = {
  category: { label: string; value: string };
  options: FilterOption[];
};

export type SelectedValues = {
  [category: string]: string | null;
};

export type CheckboxWithLabelProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
};

export interface JobStatics {
  pending: number;
  accepted: number;
  declined: number;
}

export interface JobStaticsRes {
  success: boolean;
  msg: string;
  data: JobStatics;
}
