import { IsOptional, IsString, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChatHistoryQueryDto {
  @IsUUID()
  roomId!: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsString()
  cursor?: string; // For cursor-based pagination

  @IsOptional()
  @IsString()
  before?: string; // ISO date string for messages before this date

  @IsOptional()
  @IsString()
  after?: string; // ISO date string for messages after this date
}

export class ChatHistoryResponseDto {
  messages!: ChatMessageDto[];
  pagination!: PaginationDto;
  performance!: PerformanceMetricsDto;
}

export class ChatMessageDto {
  id!: string;
  roomId!: string;
  senderId!: string;
  content!: string;
  messageType?: string;
  metadata?: Record<string, any>;
  createdAt!: Date;
}

export class PaginationDto {
  page!: number;
  limit!: number;
  total!: number;
  totalPages!: number;
  hasNext!: boolean;
  hasPrev!: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

export class PerformanceMetricsDto {
  queryTimeMs!: number;
  cacheHit!: boolean;
  indexUsed!: boolean;
}
