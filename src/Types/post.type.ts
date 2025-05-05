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
  comments?: Comment; // Optional, since it's missing in one post
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
