import { IsEnum, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReactionType } from '../entities/reaction.entity';

export class CreateReactionDto {
  @ApiProperty({
    description!: 'ID of the message to react to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'Message ID must be a valid UUID' })
  @IsNotEmpty()
  messageId: string;

  @ApiProperty({
    description!: 'Type of reaction',
    enum: ReactionType,
    example: ReactionType.LIKE,
  })
  @IsEnum(ReactionType, {
    message: 'Reaction type must be one of the allowed types',
  })
  @IsNotEmpty()
  type: ReactionType;
}
