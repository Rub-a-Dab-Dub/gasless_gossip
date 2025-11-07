import { MessageDto } from '../../messages/dtos/message.dto';

export class ChatDetailDto {
  id: number;
  sender: {
    id: number;
    username: string;
    photo?: string;
    title?: string;
  };
  receiver: {
    id: number;
    username: string;
    photo?: string;
    title?: string;
  };
  createdAt: Date;
  messages: MessageDto[];
}
