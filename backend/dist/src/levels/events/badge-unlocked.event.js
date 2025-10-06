"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeUnlockedEvent = void 0;
class BadgeUnlockedEvent {
    userId;
    badgeId;
    level;
    stellarTransactionId;
    constructor(userId, badgeId, level, stellarTransactionId) {
        this.userId = userId;
        this.badgeId = badgeId;
        this.level = level;
        this.stellarTransactionId = stellarTransactionId;
    }
}
exports.BadgeUnlockedEvent = BadgeUnlockedEvent;
//# sourceMappingURL=badge-unlocked.event.js.map