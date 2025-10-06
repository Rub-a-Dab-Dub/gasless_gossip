"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftAnalyticsEvent = void 0;
class GiftAnalyticsEvent {
    userId;
    action;
    metadata;
    timestamp;
    constructor(userId, action, metadata, timestamp = new Date()) {
        this.userId = userId;
        this.action = action;
        this.metadata = metadata;
        this.timestamp = timestamp;
    }
}
exports.GiftAnalyticsEvent = GiftAnalyticsEvent;
//# sourceMappingURL=gift-analytics.event.js.map