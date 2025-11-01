export class UserPreviewDto {
  id: number;
  username: string;
  photo: string | null;
  title: string | null;
}

export class LastMessageDto {
  chatId: number;
  content: string;
  createdAt: Date;
  senderId: number;
}

export class ChatPreviewDto {
  id: number;
  createdAt: Date;
  sender: UserPreviewDto;
  receiver: UserPreviewDto;
  lastMessage: LastMessageDto | null;
  unreadCount: number;
}
