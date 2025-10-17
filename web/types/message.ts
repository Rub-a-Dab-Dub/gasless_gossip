import { IChat } from "./chat";
import { IUser } from "./user";

export interface IMessage {
  id: number;
  chat: IChat;
  sender: IUser;
  content: string;
  isRead: boolean;
  createdAt: Date;
}
