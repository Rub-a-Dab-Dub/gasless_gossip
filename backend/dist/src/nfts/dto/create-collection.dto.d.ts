export declare class CollectionMetadataDto {
    name: string;
    description: string;
    image: string;
    banner_image?: string;
    external_link?: string;
    seller_fee_basis_points?: number;
    fee_recipient?: string;
}
export declare class CreateCollectionDto {
    name: string;
    symbol: string;
    description: string;
    metadata: CollectionMetadataDto;
    maxSupply?: number;
}
