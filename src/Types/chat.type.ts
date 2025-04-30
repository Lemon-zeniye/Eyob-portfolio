export interface ActiveUsersRes {
  success: boolean;
  msg: string;
  data: ActiveUsers[];
}

export interface ActiveUsers {
  _id: string;
  name: string;
  email: string;
  role: string;
}
