import { IMessage } from "./message";
import { IUser } from "./user";

export interface IChat {
  id: number;
  sender: IUser; 
  receiver: IUser; 
  isGroup: boolean;
  createdAt: string; 
  messages: IMessage[];
}
