import { IChat, ISender } from "./chat";

export interface IMessage {
  id: number;
  chat: IChat;
  sender: ISender;
  content: string;
  isRead: boolean;
  createdAt: Date;
}
export interface IMessages {
  id: number;
  senderId: number;
  chatId: number;
  isRead: boolean;
  content: string;
  createdAt: Date;
}
export interface ILastMessage {
  content: string;
  createdAt: string;
  senderId: number;
}
