export declare class NftAttributeDto {
    trait_type: string;
    value: string | number;
}
export declare class NftMetadataDto {
    name: string;
    description: string;
    image: string;
    attributes?: NftAttributeDto[];
    external_url?: string;
    animation_url?: string;
    background_color?: string;
}
export declare class CreateNftDto {
    metadata: NftMetadataDto;
    recipientStellarAddress?: string;
    collectionId?: string;
    mintPrice?: string;
}
