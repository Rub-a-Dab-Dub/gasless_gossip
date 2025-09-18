import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateReactionDto {
  @IsString()
  @IsNotEmpty()
  messageId!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['👍', '❤️', '😂', '🔥', '🎉', '😮', '😢', '😡']) // Add more fun emojis as needed
  type!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;
}
