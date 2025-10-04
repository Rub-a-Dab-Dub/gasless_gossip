import { IsString, IsBoolean, IsNumber, IsOptional, IsEnum, IsArray, Min, Max, Length, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSecretRoomDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;

  @IsBoolean()
  isPrivate!: boolean;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(1000)
  maxUsers?: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  category?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  theme?: string;

  @IsOptional()
  @IsBoolean()
  enablePseudonyms?: boolean;

  @IsOptional()
  @IsString()
  @IsEnum(['default', 'space', 'animals', 'colors', 'cyber', 'mythical'])
  fakeNameTheme?: 'default' | 'space' | 'animals' | 'colors' | 'cyber' | 'mythical';

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  expiresAt?: Date;

  @IsOptional()
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
  moderationSettings?: {
    creatorModPrivileges?: boolean;
    autoModeration?: boolean;
    voiceModerationQueue?: boolean;
    maxViolationsBeforeAutoDelete?: number;
    pseudonymDecryption?: boolean;
  };

  @IsOptional()
  metadata?: {
    tags?: string[];
    location?: string;
    timezone?: string;
    language?: string;
    ageRestriction?: number;
  };
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
  maxUsers?: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  category?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  theme?: string;

  @IsOptional()
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
  metadata?: {
    tags?: string[];
    location?: string;
    timezone?: string;
    language?: string;
    ageRestriction?: number;
  };
}

export class JoinRoomDto {
  @IsString()
  @Length(6, 20)
  roomCode!: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  nickname?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}

export class InviteUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  userId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  message?: string;

  @IsOptional()
  @IsEnum(['member', 'moderator', 'admin'])
  role?: 'member' | 'moderator' | 'admin';

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  expiresInDays?: number;
}

export class SecretRoomDto {
  id!: string;
  creatorId!: string;
  name!: string;
  description?: string;
  roomCode!: string;
  isPrivate!: boolean;
  isActive!: boolean;
  status!: string;
  maxUsers!: number;
  currentUsers!: number;
  category?: string;
  theme?: string;
  enablePseudonyms!: boolean;
  fakeNameTheme!: string;
  xpMultiplier!: number;
  settings?: Record<string, any>;
  moderationSettings?: {
    creatorModPrivileges?: boolean;
    autoModeration?: boolean;
    voiceModerationQueue?: boolean;
    maxViolationsBeforeAutoDelete?: number;
    pseudonymDecryption?: boolean;
  };
  reactionMetrics?: {
    totalReactions?: number;
    mostReactedMessageId?: string;
    trendingScore?: number;
    lastTrendingUpdate?: Date;
  };
  metadata?: Record<string, any>;
  lastActivityAt?: Date;
  expiresAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}

export class RoomMemberDto {
  id!: string;
  roomId!: string;
  userId!: string;
  role!: string;
  status!: string;
  nickname?: string;
  displayName?: string;
  isAnonymous!: boolean;
  canInvite!: boolean;
  canModerate!: boolean;
  messageCount!: number;
  reactionCount!: number;
  lastSeenAt?: Date;
  lastMessageAt?: Date;
  permissions?: Record<string, any>;
  metadata?: Record<string, any>;
  joinedAt!: Date;
  updatedAt!: Date;
}

export class RoomInvitationDto {
  id!: string;
  roomId!: string;
  invitedBy!: string;
  invitedUserId?: string;
  invitedEmail?: string;
  invitationCode!: string;
  status!: string;
  message?: string;
  role?: string;
  expiresInDays!: number;
  expiresAt?: Date;
  acceptedAt?: Date;
  declinedAt?: Date;
  metadata?: Record<string, any>;
  createdAt!: Date;
}

export class RoomStatsDto {
  totalRooms!: number;
  activeRooms!: number;
  privateRooms!: number;
  publicRooms!: number;
  totalMembers!: number;
  averageMembersPerRoom!: number;
  roomsCreatedToday!: number;
  roomsCreatedThisWeek!: number;
}

export class UserRoomLimitDto {
  userId!: string;
  currentRooms!: number;
  maxRooms!: number;
  canCreateMore!: boolean;
  remainingSlots!: number;
}
