import { IsString, IsUUID, IsOptional, IsEnum, IsObject, IsInt, Min, Max } from 'class-validator';

export class CreateGossipIntentDto {
  @IsUUID()
  roomId!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1440) // Max 24 hours in minutes
  expiresInMinutes?: number;
}

export class UpdateGossipIntentDto {
  @IsUUID()
  intentId!: string;

  @IsEnum(['pending', 'verified', 'debunked', 'expired'])
  status!: 'pending' | 'verified' | 'debunked' | 'expired';

  @IsOptional()
  @IsString()
  reason?: string;
}

export class VoteGossipDto {
  @IsUUID()
  intentId!: string;

  @IsEnum(['upvote', 'downvote', 'remove'])
  action!: 'upvote' | 'downvote' | 'remove';
}

export class CommentGossipDto {
  @IsUUID()
  intentId!: string;

  @IsString()
  content!: string;
}

export class GossipIntentDto {
  id!: string;
  roomId!: string;
  userId!: string;
  content!: string;
  status!: string;
  metadata?: Record<string, any>;
  upvotes!: number;
  downvotes!: number;
  expiresAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}

export class GossipUpdateDto {
  id!: string;
  intentId!: string;
  userId!: string;
  type!: string;
  content?: string;
  metadata?: Record<string, any>;
  createdAt!: Date;
}

export class GossipBroadcastDto {
  type!: 'new_intent' | 'status_change' | 'vote' | 'comment' | 'verification';
  intent!: GossipIntentDto;
  update?: GossipUpdateDto;
  timestamp!: string;
  roomId!: string;
}
