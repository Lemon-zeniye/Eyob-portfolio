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
  picturePath?: string;
  // isNotEmployee: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  googleid?: string;
  password?: string;
  passwordResetNumber?: null;
  passwordResetToken?: string;
  passwordResetTokenExpires?: null;
  deviceTokens?: any[]; // You might want to replace 'any' with a more specific type
  role?: string;
  lastLoggedIn?: null;
  status?: string;
  isActive?: boolean;
  otp?: string;
  otpExpiresAt?: null;
  updatedAt?: string;
  passwordChangedAt?: string;
  createdAt?: string;
  __v?: number;
}

export interface Picture {
  filename: string;
  path: string;
}

export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  content: string;
  subjectUser?: User;
  createdAt: string;
  senderPicture: Picture;
  receiverPicture: Picture;
}

export interface MessageRes {
  msg: string;
  success: boolean;
  data: Message[];
}

export interface GroupRes {
  msg: string;
  success: boolean;
  data: Group[];
}

// Interface for a group member
export interface GroupMember {
  _id: string;
  status: string;
  memberId: string;
  joinedAt: string;
}

// Interface for the group
export interface Group {
  _id: string;
  groupName: string;
  members: GroupMember[];
  createdBy: string;
  status: string;
  createdAt: string;
  __v: number;
}

//////////// \\\\\\\\\\\

export interface Member {
  _id: string;
  name: string;
  email: string;
  googleid: string;
  password: string;
  passwordResetNumber: number | null;
  passwordResetToken: string;
  passwordResetTokenExpires: string | null;
  deviceTokens: string[];
  role: "user" | "admin" | string;
  lastLoggedIn: string | null;
  status: "online" | "offline" | string;
  otp: string;
  otpExpiresAt: string | null;
  updatedAt: string;
  passwordChangedAt: string;
  createdAt: string;
  __v: number;
}

export interface GroupMemberEntry {
  memberId: string;
  joinedAt: string;
  status: "pending" | "active" | string;
}

export interface GroupNew {
  _id: string;
  groupName: string;
  members: GroupMemberEntry[];
  createdBy: string;
  status: "active" | "inactive" | string;
  groupType: "social" | "business" | string;
  createdAt: string;
  __v: number;
}

export interface GroupChat {
  _id: string;
  groupId: GroupNew;
  memberId: Member;
  content: string;
  status: "active" | "archived" | string;
  viewStatus: "unseen" | "seen" | string;
  chatType: "groupRequest" | string;
  createdAt: string;
  __v: number;
}

export interface GroupChatRes {
  meg: string;
  data: GroupChat[];
  success: boolean;
}

export interface PreviousChatRes {
  msg: string;
  success: boolean;
  data: PreviousChat[];
}

export interface PreviousChat {
  _id: string;
  userId: string;
  email: string;
  name: string;
  userPicturePath: string;
  lastMessage: {
    _id: string;
    content: string;
    sender: string;
    receiver: string;
    createdAt: string;
  };
}

export interface GroupMemberNew {
  _id: string;
  email: string;
  name: string;
}

export interface GroupMemberRes {
  msg: string;
  success: boolean;
  data: GroupMemberNew[];
}
