"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftTransferredEvent = void 0;
class NftTransferredEvent {
    nft;
    fromUserId;
    toUserId;
    constructor(nft, fromUserId, toUserId) {
        this.nft = nft;
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
    }
}
exports.NftTransferredEvent = NftTransferredEvent;
//# sourceMappingURL=nft-transferred.event.js.map