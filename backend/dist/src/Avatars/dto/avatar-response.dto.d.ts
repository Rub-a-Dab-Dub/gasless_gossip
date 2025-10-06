export declare class AvatarResponseDto {
    id: string;
    userId: string;
    metadata: {
        name: string;
        description: string;
        image: string;
        level: number;
        rarity: string;
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
