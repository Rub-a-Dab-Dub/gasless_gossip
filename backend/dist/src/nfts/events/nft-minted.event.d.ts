import type { Nft } from "../entities/nft.entity";
export declare class NftMintedEvent {
    readonly nft: Nft;
    constructor(nft: Nft);
}
