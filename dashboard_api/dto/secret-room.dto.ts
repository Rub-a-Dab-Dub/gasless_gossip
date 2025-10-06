import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  Min,
  Max,
  Length,
  IsDate,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { RoomType, RoomStatus } from '../entities/room.entity';
import { FakeNameTheme } from '../services/fake-name-generator.service';

export class CreateSecretRoomDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;

  @IsEnum(RoomType)
  type!: RoomType;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(1000)
  maxParticipants?: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  theme?: string;

  @IsOptional()
  @IsBoolean()
  enablePseudonyms?: boolean;

  @IsOptional()
  @IsEnum(['default', 'space', 'animals', 'colors', 'cyber', 'mythical'])
  fakeNameTheme?: FakeNameTheme;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  expiresAt?: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  xpMultiplier?: number;

  @IsOptional()
  @IsObject()
  settings?: {
    allowAnonymous?: boolean;
    requireApproval?: boolean;
    autoDelete?: boolean;
    deleteAfterHours?: number;
    allowFileSharing?: boolean;
    maxFileSize?: number;
    moderationLevel?: 'low' | 'medium' | 'high';
  };

  @IsOptional()
  @IsObject()
  moderationSettings?: {
    creatorModPrivileges?: boolean;
    autoModeration?: boolean;
    voiceModerationQueue?: boolean;
    maxViolationsBeforeAutoDelete?: number;
    pseudonymDecryption?: boolean;
  };

  @IsOptional()
  @IsObject()
  metadata?: {
    tags?: string[];
    location?: string;
    timezone?: string;
    language?: string;
    ageRestriction?: number;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  moderatorIds?: string[];
}

export class UpdateSecretRoomDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(1000)
  maxParticipants?: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  theme?: string;

  @IsOptional()
  @IsBoolean()
  enablePseudonyms?: boolean;

  @IsOptional()
  @IsEnum(['default', 'space', 'animals', 'colors', 'cyber', 'mythical'])
  fakeNameTheme?: FakeNameTheme;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  expiresAt?: Date;

  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  xpMultiplier?: number;

  @IsOptional()
  @IsObject()
  settings?: {
    allowAnonymous?: boolean;
    requireApproval?: boolean;
    autoDelete?: boolean;
    deleteAfterHours?: number;
    allowFileSharing?: boolean;
    maxFileSize?: number;
    moderationLevel?: 'low' | 'medium' | 'high';
  };

  @IsOptional()
  @IsObject()
  moderationSettings?: {
    creatorModPrivileges?: boolean;
    autoModeration?: boolean;
    voiceModerationQueue?: boolean;
    maxViolationsBeforeAutoDelete?: number;
    pseudonymDecryption?: boolean;
  };

  @IsOptional()
  @IsObject()
  metadata?: {
    tags?: string[];
    location?: string;
    timezone?: string;
    language?: string;
    ageRestriction?: number;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  moderatorIds?: string[];
}

export class JoinRoomDto {
  @IsString()
  roomCode!: string;

  @IsOptional()
  @IsBoolean()
  usePseudonym?: boolean;

  @IsOptional()
  @IsEnum(['default', 'space', 'animals', 'colors', 'cyber', 'mythical'])
  fakeNameTheme?: FakeNameTheme;
}

export class InviteUserDto {
  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  message?: string;
}

export class SendTokenTipDto {
  @IsString()
  recipientUserId!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @Length(1, 20)
  token!: string; // Token symbol like 'XLM', 'USDC', etc.

  @IsOptional()
  @IsString()
  @Length(1, 200)
  message?: string;

  @IsOptional()
  @IsBoolean()
  usePseudonym?: boolean;
}

export class RoomReactionDto {
  @IsString()
  messageId!: string;

  @IsString()
  @Length(1, 10)
  emoji!: string;
}

export class VoiceNoteDto {
  @IsString()
  voiceNoteUrl!: string;

  @IsNumber()
  @Min(1)
  @Max(300) // Max 5 minutes
  duration!: number;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  transcript?: string;
}

export class ModerationActionDto {
  @IsString()
  targetUserId!: string;

  @IsEnum(['warn', 'mute', 'kick', 'ban'])
  action!: 'warn' | 'mute' | 'kick' | 'ban';

  @IsOptional()
  @IsString()
  @Length(1, 200)
  reason?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  durationMinutes?: number; // For mute/ban duration
}

// Response DTOs
export class SecretRoomResponseDto {
  id!: string;
  name!: string;
  description?: string;
  type!: RoomType;
  creatorId!: string;
  roomCode?: string;
  isPrivate!: boolean;
  isActive!: boolean;
  status!: RoomStatus;
  maxParticipants!: number;
  currentUsers!: number;
  theme?: string;
  enablePseudonyms!: boolean;
  fakeNameTheme!: string;
  xpMultiplier!: number;
  expiresAt?: Date;
  lastActivityAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;

  // Conditional fields based on user permissions
  moderationSettings?: any;
  reactionMetrics?: any;
  settings?: any;
  metadata?: any;
  moderatorIds?: string[];
}

export class RoomParticipantDto {
  userId!: string;
  pseudonym?: string;
  joinedAt!: Date;
  role!: 'creator' | 'moderator' | 'member';
  isActive!: boolean;
}

export class RoomStatsDto {
  totalParticipants!: number;
  activeParticipants!: number;
  totalMessages!: number;
  totalReactions!: number;
  totalTokenTips!: number;
  averageSessionDuration!: number; // in minutes
  trendingScore!: number;
  moderationQueueLength!: number;
}

export class UserRoomLimitDto {
  currentRooms!: number;
  maxRooms!: number;
  canCreateMore!: boolean;
}

export class RoomInvitationDto {
  id!: string;
  roomId!: string;
  roomName!: string;
  inviterId!: string;
  inviterName!: string;
  invitedUserId!: string;
  message?: string;
  status!: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt!: Date;
  expiresAt?: Date;
}

export class ModerationQueueStatusDto {
  totalItems!: number;
  pendingItems!: number;
  processingItems!: number;
  queueCapacity!: number;
  averageProcessingTime!: number;
  yourPosition?: number;
}

export class FakeNamePreviewDto {
  theme!: FakeNameTheme;
  samples!: string[];
}
