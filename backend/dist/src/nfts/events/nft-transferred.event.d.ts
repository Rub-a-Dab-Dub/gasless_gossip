import type { Nft } from "../entities/nft.entity";
export declare class NftTransferredEvent {
    readonly nft: Nft;
    readonly fromUserId: string;
    readonly toUserId: string;
    constructor(nft: Nft, fromUserId: string, toUserId: string);
}
