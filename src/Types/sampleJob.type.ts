export interface Job {
  job_id: string;
  job_title: string;
  job_description: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_location: string;
  job_latitude: number;
  job_longitude: number;
  job_is_remote: boolean;
  job_employment_type: string;
  job_employment_types: string[];
  job_posted_at: string;
  job_posted_at_datetime_utc: string;
  job_posted_at_timestamp: number;
  job_apply_is_direct: boolean;
  job_apply_link: string;
  job_google_link: string;
  job_benefits: string | null;
  job_salary: string | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_period: string | null;
  job_onet_soc: string;
  job_onet_job_zone: string;
  job_publisher: string;
  employer_name: string;
  employer_logo: string;
  employer_website: string;

  apply_options: {
    publisher: string;
    apply_link: string;
    is_direct: boolean;
  }[];

  job_highlights: {
    Qualifications: string[];
    Responsibilities: string[];
  };
}

export interface JobSearchResponse {
  status: string;
  request_id: string;
  parameters: {
    query: string;
    page: number;
    num_pages: number;
    country: string;
    language: string;
  };
  data: Job[];
}

export interface SingleResponse {
  status: string;
  request_id: string;
  parameters: {
    query: string;
    country: string;
    language: string;
  };
  data: Job[];
}
