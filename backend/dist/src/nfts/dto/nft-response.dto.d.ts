import type { Nft, NftMetadata, NftTransferLog } from "../entities/nft.entity";
export declare class NftResponseDto {
    id: string;
    userId: string;
    metadata: NftMetadata;
    txId: string;
    contractAddress: string;
    tokenId: string;
    stellarAssetCode?: string;
    stellarAssetIssuer?: string;
    transferLogs: NftTransferLog[];
    mintPrice?: string;
    currentOwner: boolean;
    rarityScore?: number;
    collectionId?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(nft: Nft);
}
