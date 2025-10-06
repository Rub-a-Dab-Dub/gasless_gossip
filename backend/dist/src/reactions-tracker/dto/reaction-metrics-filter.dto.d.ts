export declare enum ReactionType {
    LIKE = "like",
    LOVE = "love",
    LAUGH = "laugh",
    ANGRY = "angry",
    SAD = "sad"
}
export declare enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare class ReactionMetricsFilterDto {
    dateFrom?: string;
    dateTo?: string;
    reactionType?: ReactionType;
    limit?: number;
    offset?: number;
    sortOrder?: SortOrder;
}
export declare class ReactionTrackResponseDto {
    id: string;
    messageId: string;
    totalCount: number;
    likeCount: number;
    loveCount: number;
    laughCount: number;
    angryCount: number;
    sadCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class MostReactedSecretsResponseDto {
    data: ReactionTrackResponseDto[];
    total: number;
    limit: number;
    offset: number;
}
export declare class ReactionUpdateDto {
    messageId: string;
    reactionType: ReactionType;
    count: number;
}
