import type { NftCollection, CollectionMetadata } from "../entities/nft-collection.entity";
export declare class CollectionResponseDto {
    id: string;
    name: string;
    symbol: string;
    description: string;
    metadata: CollectionMetadata;
    contractAddress: string;
    creatorAddress: string;
    totalSupply: number;
    maxSupply?: number;
    floorPrice?: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(collection: NftCollection);
}
