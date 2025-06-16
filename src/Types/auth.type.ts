export type Role = "user" | "admin";
export type Mode = "social" | "formal";

export interface User {
  id: string;
  username: string;
  ticket_type: string;
  email: string;
  role: "user" | "admin";
  no_people: number;
  is_active: boolean;
}

export interface LoginRes {
  message: string;
  user: User;
  token: string;
}
