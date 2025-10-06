"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XpGainedEvent = void 0;
class XpGainedEvent {
    userId;
    xpAmount;
    source;
    metadata;
    constructor(userId, xpAmount, source, metadata) {
        this.userId = userId;
        this.xpAmount = xpAmount;
        this.source = source;
        this.metadata = metadata;
    }
}
exports.XpGainedEvent = XpGainedEvent;
//# sourceMappingURL=xp-gained.event.js.map