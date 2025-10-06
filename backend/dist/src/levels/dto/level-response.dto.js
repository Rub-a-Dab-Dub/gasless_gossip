"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelUpEventDto = exports.LevelResponseDto = void 0;
class LevelResponseDto {
    id;
    userId;
    level;
    currentXp;
    xpThreshold;
    totalXp;
    isLevelUpPending;
    xpToNextLevel;
    progressPercentage;
    createdAt;
    updatedAt;
}
exports.LevelResponseDto = LevelResponseDto;
class LevelUpEventDto {
    userId;
    previousLevel;
    newLevel;
    totalXp;
    badgesUnlocked;
    timestamp;
}
exports.LevelUpEventDto = LevelUpEventDto;
//# sourceMappingURL=level-response.dto.js.map