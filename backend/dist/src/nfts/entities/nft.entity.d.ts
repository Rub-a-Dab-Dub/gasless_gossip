import { User } from "../../users/entities/user.entity";
export interface NftMetadata {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{
        trait_type: string;
        value: string | number;
    }>;
    external_url?: string;
    animation_url?: string;
    background_color?: string;
}
export interface NftTransferLog {
    from: string;
    to: string;
    timestamp: Date;
    transactionId: string;
    blockNumber?: number;
}
export declare class Nft {
    id: string;
    userId: string;
    user: User;
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
}
