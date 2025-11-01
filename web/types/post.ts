import { IUser } from "./user";

export interface IComment {
  content: string;
  parent_id?: number;
}

export interface IEditComment {
  content: string;
}

export interface ICreatePost {
  content: string;
  medias?: string[];
}

export interface IEditPost {
  content?: string;
  medias?: string[];
}

export interface IComment {
  id: number;
  content: string;
  author: IUser;
  post: IPost;
  parent?: IComment | null;
  replies: IComment[];
  createdAt: string;
}

export interface ILike {
  id: number;
  user: IUser;
  post: IPost;
}

export interface IPost {
  id: number;
  content: string;
  medias: string[];
  author: IUser;
  comments: Comment[];
  likes: ILike[];
  commentCount: number;
  likeCount: number;
  createdAt: Date;
}

export interface IPostListAuthor {
  id: number;
  photo: string | null;
  username: string;
}

export interface IPostList {
  id: number;
  content: string;
  medias?: string[] | null;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  hasLiked: boolean;
  author?: IPostListAuthor;
}
