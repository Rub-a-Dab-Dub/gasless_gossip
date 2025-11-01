import { IChat } from "./chat";
import { IMessage } from "./message";
import { IComment, ILike, IPost, IPostList } from "./post";
import { IRoomMember } from "./room";
import { IWallet } from "./wallet";

export interface IUser {
  id: number;
  username: string;
  photo?: string | null;
  email?: string | null;
  address?: string | null;
  xp: number;
  title?: string | null;
  about?: string | null;

  posts: IPost[];
  comments: IComment[];
  likes: ILike[];
  room_members: IRoomMember[];
  followers: IUser[];
  following: IUser[];
  sentChats: IChat[];
  receivedChats: IChat[];
  messages: IMessage[];
  wallet: IWallet[];
}

export interface IAllUser {
  id: number;
  username: string;
  photo?: string | null;
  title?: string | null;
  about?: string | null;
}
export interface IUpdateProfile {
  photo?: string;
  email?: string;
  username?: string;
  address?: string;
  title?: string;
  about?: string;
}

export interface IChangePassword {
  old_password: string;
  new_password: string;
}

export interface IProfileStats {
  posts?: number;
  followers?: number;
  following?: number;
}

export interface IUserStats {
  posts: number;
  followers: number;
  following: number;
}
export interface ViewUser {
  user: IAllUser;
  stats: IUserStats;
  isFollowing: boolean;
  isFollowedBy: boolean;
  posts: IPostList[];
  chat: null | number;
}
