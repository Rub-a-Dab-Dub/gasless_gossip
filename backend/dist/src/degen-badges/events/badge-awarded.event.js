"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeMintedEvent = exports.BadgeAwardedEvent = void 0;
class BadgeAwardedEvent {
    badge;
    achievementData;
    timestamp;
    constructor(badge, achievementData, timestamp = new Date()) {
        this.badge = badge;
        this.achievementData = achievementData;
        this.timestamp = timestamp;
    }
}
exports.BadgeAwardedEvent = BadgeAwardedEvent;
class BadgeMintedEvent {
    badgeId;
    userId;
    transactionId;
    assetCode;
    amount;
    timestamp;
    constructor(badgeId, userId, transactionId, assetCode, amount, timestamp = new Date()) {
        this.badgeId = badgeId;
        this.userId = userId;
        this.transactionId = transactionId;
        this.assetCode = assetCode;
        this.amount = amount;
        this.timestamp = timestamp;
    }
}
exports.BadgeMintedEvent = BadgeMintedEvent;
//# sourceMappingURL=badge-awarded.event.js.map