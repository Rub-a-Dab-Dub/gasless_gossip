"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelUpEvent = void 0;
class LevelUpEvent {
    userId;
    previousLevel;
    newLevel;
    totalXp;
    badgesUnlocked;
    constructor(userId, previousLevel, newLevel, totalXp, badgesUnlocked = []) {
        this.userId = userId;
        this.previousLevel = previousLevel;
        this.newLevel = newLevel;
        this.totalXp = totalXp;
        this.badgesUnlocked = badgesUnlocked;
    }
}
exports.LevelUpEvent = LevelUpEvent;
//# sourceMappingURL=level-up.event.js.map