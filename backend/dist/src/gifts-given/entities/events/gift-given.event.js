"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftGivenEvent = void 0;
class GiftGivenEvent {
    giftId;
    userId;
    recipientId;
    giftType;
    giftValue;
    timestamp;
    constructor(giftId, userId, recipientId, giftType, giftValue, timestamp = new Date()) {
        this.giftId = giftId;
        this.userId = userId;
        this.recipientId = recipientId;
        this.giftType = giftType;
        this.giftValue = giftValue;
        this.timestamp = timestamp;
    }
}
exports.GiftGivenEvent = GiftGivenEvent;
//# sourceMappingURL=gift-given.event.js.map