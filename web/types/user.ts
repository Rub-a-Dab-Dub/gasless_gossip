import { IChat } from "./chat";
import { IMessage } from "./message";
import { IComment, ILike, IPost } from "./post";
import { IRoomMember } from "./room";

export interface IUser {
  id: number;
  username: string;
  password: string;
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
