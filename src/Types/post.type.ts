export interface User {
  _id: string;
  name: string;
}

export interface Post {
  _id: string;
  userid: User | null;
  postTitle: string;
  postContent: string;
  postPictures: string[];
  likes: number;
  deslikes: number;
  status: string;
  postDate: string;
  createdAt: string;
  __v: number;
}

export interface PostRes {
  data: Post[];
  success: boolean;
  msg: string;
}

// ///
export type Comment = {
  _id: string;
  postId: string;
  comment: string;
  commentedBy: string;
  commentedTo: string;
  createdAt: string;
  __v: number;
};

export type CommenterDetail = {
  _id: string;
  name: string;
};

export type PostOwner = {
  _id: string;
  name: string;
};

export type PostCom = {
  _id: string;
  userid: string;
  postTitle: string;
  postContent: string;
  postPictures: string[];
  status: string;
  postDate: string;
  createdAt: string;
  comments?: Comment[]; // Optional, since it's missing in one post
  commenterDetails: CommenterDetail[];
  userPicturePath: string;
  isLikedByUser: boolean;
  likesCount: number;
  dislikesCount: number;
  postOwner: PostOwner;
};

export interface PostComRes {
  data: PostCom[];
  success: boolean;
  msg: string;
}

export interface CommentsRes {
  data: CommentNew[];
  success: boolean;
  msg: string;
}
export interface UserNew {
  _id: string;
  name: string;
  email: string;
}

export interface CommentNew {
  _id: string;
  postId: string;
  comment: string;
  commentedBy: User;
  commentedTo: User;
  createdAt: string;
  __v: number;
}

export interface ChildCommentsRes {
  data: ChildComments[];
  success: boolean;
  msg: string;
}

export interface ChildComments {
  _id: string;
  parentComment: string;
  commentedBy: string;
  comment: string;
  likes: number;
  deslikes: number;
  createdAt: string;
  __v: number;
}

export interface StoryItem {
  id: string;
  image: string; // Only one image per story
}

export interface Story {
  id: number;
  username: string;
  title: string;
  avatar: string;
  items: StoryItem[]; // But API will only return 1 item
}

export interface StoryApiResponse {
  _id: string;
  userid: string;
  filename: string;
  path: string;
  likes: number;
  deslikes: number;
  views: number;
  createdAt: Date | string;
  __v?: number;
}

export interface StoryRes {
  data: StoryApiResponse[];
  success: boolean;
  msg: string;
}
