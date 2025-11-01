import { ILastMessage, IMessages } from "./message";
export interface UserSearchResult {
  id: number;
  username: string;
  photo: string | null;
  title: string | null;
  chat_id: number | null;
}

export interface ISender {
  id: number;
  username: string;
  photo: string | null;
  title: string | null;
}

export interface IReceiver {
  id: number;
  username: string;
  photo: string | null;
  title: string | null;
}
export interface IChat {
  id: number;
  sender: ISender;
  receiver: IReceiver;
  messages: IMessages[];
  isGroup: boolean;
  createdAt: string;
  unreadCount?: number;
  lastMessage?: ILastMessage;
}
