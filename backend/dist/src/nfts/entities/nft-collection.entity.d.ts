import { Nft } from "./nft.entity";
export interface CollectionMetadata {
    name: string;
    description: string;
    image: string;
    banner_image?: string;
    external_link?: string;
    seller_fee_basis_points?: number;
    fee_recipient?: string;
}
export declare class NftCollection {
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
    nfts: Nft[];
    createdAt: Date;
    updatedAt: Date;
}
