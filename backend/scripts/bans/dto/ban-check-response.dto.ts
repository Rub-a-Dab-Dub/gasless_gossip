export class BanCheckResponseDto {
  isBanned: boolean;
  banDetails?: {
    id: string;
    reason: string;
    createdAt: Date;
    expiresAt: Date | null;
    bannedBy: string | null;
  };
}