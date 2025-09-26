import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePodcastRoomDto } from './create-podcast-room.dto';

export class UpdatePodcastRoomDto extends PartialType(
  OmitType(CreatePodcastRoomDto, ['roomId', 'audioHash', 'creatorId'] as const),
) {}

// src/podcast-rooms/dto/podcast-room-response.dto.ts
import { Expose } from 'class-transformer';

export class PodcastRoomResponseDto {
  @Expose()
  id!: string;

  @Expose()
  roomId!: string;

  @Expose()
  audioHash!: string;

  @Expose()
  creatorId!: string;

  @Expose()
  title!: string;

  @Expose()
  description!: string;

  @Expose()
  duration!: number;

  @Expose()
  audioFormat!: string;

  @Expose()
  fileSize!: number;

  @Expose()
  stellarHash!: string;

  @Expose()
  ipfsHash!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  tags!: string[];

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
