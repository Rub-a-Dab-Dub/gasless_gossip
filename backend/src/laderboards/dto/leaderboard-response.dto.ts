export class LeaderboardEntryDto {
  rank: number;
  userId: string;
  score: number;
  username?: string; // Optional user info
}

export class LeaderboardResponseDto {
  type: string;
  entries: LeaderboardEntryDto[];
  total: number;
  cached: boolean;
  generatedAt: Date;
}

