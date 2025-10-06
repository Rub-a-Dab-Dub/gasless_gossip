"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardResponseDto = exports.LeaderboardEntryDto = void 0;
class LeaderboardEntryDto {
    rank;
    userId;
    score;
    username;
}
exports.LeaderboardEntryDto = LeaderboardEntryDto;
class LeaderboardResponseDto {
    type;
    entries;
    total;
    cached;
    generatedAt;
}
exports.LeaderboardResponseDto = LeaderboardResponseDto;
//# sourceMappingURL=leaderboard-response.dto.js.map