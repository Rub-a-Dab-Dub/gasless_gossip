export declare class Avatar {
    id: string;
    userId: string;
    metadata: {
        name: string;
        description: string;
        image: string;
        level: number;
        rarity: 'common' | 'rare' | 'epic' | 'legendary';
        attributes: Array<{
            trait_type: string;
            value: string | number;
        }>;
    };
    txId: string;
    stellarAssetCode: string;
    stellarIssuer: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AttributeDto {
    trait_type: string;
    value: string | number;
}
export declare class CreateAvatarDto {
    name: string;
    description: string;
    image: string;
    level: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    attributes: AttributeDto[];
}
